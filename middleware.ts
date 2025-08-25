import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase'

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/onboarding', 
  '/calculators',
  '/journey',
  '/guides',
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
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // In demo mode, allow all requests to proceed
    return res;
  }
  
  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
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

    if (error) {
      // Auth error occurred - user is not authenticated
      // Clear any stale cookies
      res.cookies.delete('sb-access-token')
      res.cookies.delete('sb-refresh-token')
    }

    const isAuthenticated = !!user && !error
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isAuthRoute = authRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.includes(path) || path === '/'

    // Handle protected routes
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(loginUrl)
    }

    // Handle auth routes (redirect authenticated users away)
    if (isAuthRoute && isAuthenticated) {
      // Check if user has completed onboarding
      let dashboardUrl = '/onboarding'
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('location')
          .eq('user_id', user.id)
          .single()
        
        if (profile && (profile as any).location) {
          dashboardUrl = '/dashboard'
        }
      } catch {
        // If profile doesn't exist, redirect to onboarding
      }

      const redirectTo = req.nextUrl.searchParams.get('redirectTo')
      
      if (redirectTo && protectedRoutes.some(route => redirectTo.startsWith(route))) {
        return NextResponse.redirect(new URL(redirectTo, req.url))
      }
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }

    // Handle root route
    if (path === '/') {
      if (isAuthenticated) {
        // Check onboarding status and redirect accordingly
        let dashboardUrl = '/onboarding'
        try {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('location')
            .eq('user_id', user.id)
            .single()
          
          if (profile && (profile as any).location) {
            dashboardUrl = '/dashboard'
          }
        } catch {
          // If profile doesn't exist, redirect to onboarding
        }
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