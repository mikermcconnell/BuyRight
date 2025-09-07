import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase'

// Define routes that require authentication
// Note: These routes now allow guest access with localStorage fallbacks
const protectedRoutes = [
  '/onboarding', // Still require auth for profile setup
]

// Define routes that redirect authenticated users
const authRoutes = [
  '/login',
  '/register',
  '/auth',
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/privacy',
  '/terms',
  '/delete-account',
  '/delete-account/success',
  '/dashboard',     // Allow guest access with localStorage
  '/calculators',   // Allow guest access with localStorage
  '/journey',       // Allow guest access with localStorage  
  '/guides',        // Allow guest access with localStorage
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Middleware entry point
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Verify Supabase configuration
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase not configured - allowing request
    // In demo mode, allow all requests to proceed
    return res;
  }
  
  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          const cookie = req.cookies.get(name)?.value
          // Get cookie value
          return cookie
        },
        set(name: string, value: string, options: any) {
          // Set cookie with security options
          const cookieOptions = {
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            httpOnly: name.includes('refresh') ? true : options.httpOnly
          };
          req.cookies.set({
            name,
            value,
            ...cookieOptions,
          })
          res.cookies.set({
            name,
            value,
            ...cookieOptions,
          })
        },
        remove(name: string, options: any) {
          // Remove cookie with security options
          const cookieOptions = {
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            httpOnly: name.includes('refresh') ? true : options.httpOnly
          };
          req.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          })
          res.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          })
        },
      },
    }
  )

  // Get the current path
  const path = req.nextUrl.pathname

  // Skip middleware for static files and API routes
  if (
    path.startsWith('/_next/') ||
    path.startsWith('/api/') ||
    path.startsWith('/static/') ||
    path.includes('.')
  ) {
    return res
  }

  try {
    // Use getUser() for proper authentication verification
    // This contacts the Supabase Auth server for verification
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Check authentication status

    if (error) {
      // Auth error occurred - user is not authenticated
      // Clear any stale cookies
      res.cookies.delete('sb-access-token')
      res.cookies.delete('sb-refresh-token')
    }

    // Determine authentication status
    const isAuthenticated = !!user && !error
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isAuthRoute = authRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.includes(path) || path === '/'

    // Route protection logic

    // Handle protected routes
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(loginUrl)
    }

    // Handle auth routes (redirect authenticated users away)
    if (isAuthRoute && isAuthenticated) {
      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('location')
        .eq('user_id', user.id)
        .single()

      const redirectTo = req.nextUrl.searchParams.get('redirectTo')
      
      if (redirectTo && protectedRoutes.some(route => redirectTo.startsWith(route))) {
        return NextResponse.redirect(new URL(redirectTo, req.url))
      }
      
      // Redirect based on onboarding status
      const dashboardUrl = (profile && (profile as any).location) ? '/dashboard' : '/onboarding'
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }

    // Handle root route
    if (path === '/') {
      if (isAuthenticated) {
        // Check onboarding status and redirect accordingly
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('location')
          .eq('user_id', user.id)
          .single()

        const dashboardUrl = (profile && (profile as any).location) ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(new URL(dashboardUrl, req.url))
      }
      // For non-authenticated users, let them see the landing page
      return res
    }

    // Allow all other requests
    return res
  } catch (error) {
    // Middleware error - allow request to proceed
    // On any error, allow the request to proceed
    return res
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
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}