import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/journey',
  '/calculators',
  '/settings',
  '/home-maintenance',
];

// Define routes that should redirect authenticated users away
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
];

// Define routes that don't require onboarding completion
const nonOnboardingRoutes = [
  '/onboarding',
  '/profile/setup',
  '/api',
  '/logout',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Skip middleware for static files, API routes, and special Next.js routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return res;
  }

  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession();

    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    );
    const requiresOnboarding = !nonOnboardingRoutes.some(route =>
      pathname.startsWith(route)
    );

    // If accessing a protected route without authentication
    if (isProtectedRoute && (!session?.user || error)) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If accessing auth routes while authenticated, redirect to dashboard
    if (isAuthRoute && session?.user) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Check onboarding status for authenticated users
    if (session?.user && requiresOnboarding && isProtectedRoute) {
      // Get user profile to check onboarding status
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('location')
        .eq('user_id', session.user.id)
        .single();

      // If user doesn't have a profile or location, redirect to onboarding
      if (!profile || !profile.location) {
        if (pathname !== '/onboarding') {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      }
    }

    // Special handling for root route
    if (pathname === '/') {
      if (session?.user) {
        // Check if user needs onboarding
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('location')
          .eq('user_id', session.user.id)
          .single();

        if (!profile || !profile.location) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } else {
        // Redirect unauthenticated users to login
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, allow the request to proceed
    // but log the error for debugging
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};