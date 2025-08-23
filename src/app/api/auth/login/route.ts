import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { SupabaseService, getSupabaseAuthErrorMessage, isSupabaseAvailable } from '@/lib/supabase';
import { authRateLimiter } from '@/lib/rate-limiter';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  // Check if Supabase is configured
  if (!isSupabaseAvailable()) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Authentication service temporarily unavailable - Demo mode',
          code: 'SERVICE_UNAVAILABLE'
        }
      },
      { status: 503 }
    );
  }
  
  try {
    const supabase = await createSupabaseRouteHandlerClient();
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required',
          },
        },
        { status: 400 }
      );
    }

    // Generate client identifier for rate limiting
    const clientId = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    email.toLowerCase().trim(); // fallback to email for demo

    // Attempt to sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password,
    });

    // Check rate limit after login attempt (count failures)
    const loginSuccessful = !error && data.user && data.session;
    const rateLimitResult = await authRateLimiter.check(clientId, Boolean(loginSuccessful));
    
    if (!rateLimitResult.success && !loginSuccessful) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many failed login attempts. Please try again later.',
          },
          resetTime: rateLimitResult.resetTime,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      );
    }

    if (error) {
      console.error('Supabase login error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LOGIN_FAILED',
            message: getSupabaseAuthErrorMessage(error),
          },
        },
        { status: 401 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LOGIN_FAILED',
            message: 'Authentication failed',
          },
        },
        { status: 401 }
      );
    }

    // Get user profile if it exists
    const supabaseService = new SupabaseService(supabase);
    const profile = await supabaseService.getProfile(data.user.id);

    // Prepare user data
    const userData = {
      id: data.user.id,
      email: data.user.email!,
      email_verified: !!data.user.email_confirmed_at,
      created_at: data.user.created_at,
    };

    // Determine next step in journey based on profile completeness
    let nextStep = '/onboarding';
    if (profile && profile.location) {
      nextStep = '/dashboard';
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: userData,
          profile: profile || null,
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
          },
          next_step: nextStep,
        },
        message: 'Login successful',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);

    // Generic server error
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred during login',
        },
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'GET method not allowed for login',
      },
    },
    { status: 405 }
  );
}