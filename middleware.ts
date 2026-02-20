import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Define protected routes and their required roles
const protectedRoutes = {
  admin: ['/admin'],
  agent: ['/agent'],
  customer: ['/customer'],
};

// Public routes that don't require authentication
const publicRoutes = ['/', '/services', '/gallery', '/about', '/contact'];

// Auth routes (redirect to dashboard if already authenticated)
const authRoutes = ['/login', '/register'];

// Helper function to check if a path matches any pattern
function matchesRoute(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => path.startsWith(pattern));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.includes(pathname)) {
    if (isAuthenticated) {
      // Redirect to role-based dashboard
      const dashboardUrl = userRole === 'ADMIN' 
        ? '/admin' 
        : userRole === 'AGENT' 
        ? '/agent' 
        : '/customer';
      
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (matchesRoute(pathname, protectedRoutes.admin)) {
    if (!isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // Protect agent routes
  if (matchesRoute(pathname, protectedRoutes.agent)) {
    if (!isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== 'AGENT' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // Protect customer routes
  if (matchesRoute(pathname, protectedRoutes.customer)) {
    if (!isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== 'CUSTOMER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
