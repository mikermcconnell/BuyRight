import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { SupabaseService } from '@/lib/supabase';

// GET /api/auth/me - Get current user session
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteHandlerClient();

    // Get the current user session
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        },
        { status: 401 }
      );
    }

    // Get user profile
    const supabaseService = new SupabaseService(supabase);
    const profile = await supabaseService.getProfile(user.id);

    // Prepare user data
    const userData = {
      id: user.id,
      email: user.email!,
      email_verified: !!user.email_confirmed_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          user: userData,
          profile: profile || null,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get user error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'POST method not allowed for this endpoint',
      },
    },
    { status: 405 }
  );
}