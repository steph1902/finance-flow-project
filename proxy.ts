import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { logWarn, logError, logInfo } from "@/lib/logger";
import rateLimiter from "@/lib/rate-limiter";

/**
 * Next.js 16 Proxy (Authentication & Rate Limiting)
 *
 * ⚠️ NEXT.JS 16 MIGRATION:
 * Renamed from middleware to proxy per Next.js 16 conventions.
 *
 * ⚠️ VERCEL BUILD FIX:
 * Proxy now lazily loads NEXTAUTH_SECRET at runtime, not build time.
 * This prevents build failures when env vars are missing.
 */

// Lazy secret loading (runtime-only)
function getSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET not configured in environment variables");
  }
  return new TextEncoder().encode(secret);
}

// Rate limit configuration for proxy
const PROXY_RATE_LIMIT = {
  limit: 100, // 100 requests
  window: 60 * 1000, // per minute
};

export async function proxy(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const path = req.nextUrl.pathname;
  const method = req.method;

  // Rate limiting by IP address
  const rateLimitKey = `proxy:${ip}`;
  const isAllowed = rateLimiter.check(
    rateLimitKey,
    PROXY_RATE_LIMIT.limit,
    PROXY_RATE_LIMIT.window,
  );

  if (!isAllowed) {
    const resetTime = rateLimiter.getResetTime(rateLimitKey);
    const retryAfter = resetTime ? Math.ceil(resetTime / 1000) : 60;

    logWarn("Rate limit exceeded in proxy", {
      ip,
      path,
      method,
      retryAfter,
    });

    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(PROXY_RATE_LIMIT.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(
          resetTime || Date.now() + PROXY_RATE_LIMIT.window,
        ),
      },
    });
  }

  // Get authentication token
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    logInfo("Unauthenticated request to protected route", {
      ip,
      path,
      method,
    });
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify JWT token (lazy load secret at runtime)
    const SECRET = getSecret();
    const { payload } = await jwtVerify(token, SECRET);

    // Validate payload structure
    if (!payload.id || typeof payload.id !== "string") {
      logWarn("Invalid JWT payload structure", {
        ip,
        path,
        hasId: !!payload.id,
      });

      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("auth-token");
      return response;
    }

    // Check token expiration and warn if close to expiry
    if (payload.exp) {
      const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
      if (expiresIn < 300) {
        // Less than 5 minutes
        logInfo("JWT token expiring soon", {
          userId: payload.id,
          expiresIn,
          path,
        });
      }
    }

    // Add user context to request headers for downstream API routes
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.id as string);
    requestHeaders.set("x-user-email", (payload.email as string) || "");

    // Add rate limit info to headers
    const remaining = rateLimiter.getRemaining(
      rateLimitKey,
      PROXY_RATE_LIMIT.limit,
    );
    requestHeaders.set("x-ratelimit-remaining", String(remaining));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Log authentication failures with context
    logError("JWT verification failed in proxy", error, {
      ip,
      path,
      method,
      errorType: error instanceof Error ? error.name : "unknown",
    });

    // Clear invalid token cookie
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("auth-token");
    return response;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/budgets/:path*",
    "/recurring/:path*",
    "/ai-assistant/:path*",
    "/settings/:path*",
    "/api/transactions/:path*",
    "/api/budgets/:path*",
    "/api/recurring-transactions/:path*",
    "/api/dashboard/:path*",
    "/api/ai/:path*",
  ],
};
