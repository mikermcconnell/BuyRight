import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define routes that require authentication
const protectedRoutes = [
  '/onboarding', // Require auth for profile setup
]

// Define routes that redirect authenticated users
const authRoutes = [
  '/login',
  '/register',
  '/auth',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
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

  // For now, allow all requests to proceed
  // Auth checking will be handled client-side and in API routes
  // This ensures Vercel deployment works with Edge Runtime
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  
  // Only protect the essential onboarding route
  // Let other routes handle auth client-side for better compatibility
  if (isProtectedRoute) {
    // Check for a simple auth cookie (set by login)
    const authToken = req.cookies.get('sb-access-token')
    
    if (!authToken) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return res
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