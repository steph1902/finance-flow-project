import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if user has completed onboarding
  if (token && !isPublicRoute && pathname !== '/onboarding') {
    // Fetch user onboarding status
    const baseUrl = request.nextUrl.origin;
    try {
      const response = await fetch(`${baseUrl}/api/account/onboarding`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (response.ok) {
        const { onboardingCompleted } = await response.json();
        
        // Redirect to onboarding if not completed
        if (!onboardingCompleted) {
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      }
    } catch (error) {
      console.error('Onboarding check error:', error);
      // Continue to requested page on error
    }
  }

  // If accessing onboarding but already completed, redirect to dashboard
  if (token && pathname === '/onboarding') {
    const baseUrl = request.nextUrl.origin;
    try {
      const response = await fetch(`${baseUrl}/api/account/onboarding`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (response.ok) {
        const { onboardingCompleted } = await response.json();
        
        if (onboardingCompleted) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch (error) {
      console.error('Onboarding check error:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
