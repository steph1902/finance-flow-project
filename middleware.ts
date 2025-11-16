import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ENV } from "@/lib/env";

const SECRET = new TextEncoder().encode(ENV.NEXTAUTH_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/budgets/:path*",
    "/settings/:path*",
    "/api/transactions/:path*",
    "/api/budgets/:path*",
    "/api/dashboard/:path*",
  ],
};
