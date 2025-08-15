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
  
  console.log('🚀 MIDDLEWARE ENTRY:', req.nextUrl.pathname)
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('🔧 SUPABASE CONFIG CHECK:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlStartsWith: supabaseUrl?.startsWith('https://') ? 'https' : supabaseUrl?.substring(0, 10),
    keyLength: supabaseAnonKey?.length || 0
  })
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ MIDDLEWARE: Supabase not configured - allowing request')
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
          console.log(`🍪 Getting cookie ${name}:`, cookie ? 'present' : 'missing')
          return cookie
        },
        set(name: string, value: string, options: any) {
          console.log(`🍪 Setting cookie ${name}`)
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          console.log(`🍪 Removing cookie ${name}`)
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
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
    // Get the current session and refresh if needed
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    console.log('🔍 MIDDLEWARE SESSION CHECK:', { 
      path, 
      hasError: !!error, 
      errorMessage: error?.message,
      hasSession: !!session, 
      hasUser: !!session?.user,
      userId: session?.user?.id,
      sessionExpiry: session?.expires_at,
      accessToken: session?.access_token ? 'present' : 'missing'
    })

    if (error) {
      console.error('❌ Middleware auth error:', error)
      // On auth error, allow the request but let the component handle it
      return res
    }

    // Check if session is expired and needs refresh
    if (session && session.expires_at) {
      const expiryTime = new Date(session.expires_at * 1000)
      const now = new Date()
      const timeUntilExpiry = expiryTime.getTime() - now.getTime()
      
      console.log('🕐 SESSION EXPIRY CHECK:', {
        expiryTime: expiryTime.toISOString(),
        now: now.toISOString(),
        timeUntilExpiryMinutes: Math.round(timeUntilExpiry / (1000 * 60)),
        isExpired: timeUntilExpiry <= 0
      })
    }

    const isAuthenticated = !!session?.user
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isAuthRoute = authRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.includes(path) || path === '/'

    console.log('🔍 MIDDLEWARE DECISIONS:', { 
      path, 
      isAuthenticated, 
      isProtectedRoute, 
      isAuthRoute, 
      isPublicRoute 
    })

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
        .eq('user_id', session.user.id)
        .single()

      const redirectTo = req.nextUrl.searchParams.get('redirectTo')
      
      if (redirectTo && protectedRoutes.some(route => redirectTo.startsWith(route))) {
        return NextResponse.redirect(new URL(redirectTo, req.url))
      }
      
      // Redirect based on onboarding status
      const dashboardUrl = profile?.location ? '/dashboard' : '/onboarding'
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }

    // Handle root route
    if (path === '/') {
      if (isAuthenticated) {
        // Check onboarding status and redirect accordingly
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('location')
          .eq('user_id', session.user.id)
          .single()

        const dashboardUrl = profile?.location ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(new URL(dashboardUrl, req.url))
      }
      // For non-authenticated users, let them see the landing page
      return res
    }

    // Allow all other requests
    return res
  } catch (error) {
    console.error('Middleware error:', error)
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