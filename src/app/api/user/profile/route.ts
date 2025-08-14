import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteHandlerClient();
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Handle profile not found vs actual error
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to retrieve profile',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          profile: profile || null,
          has_profile: !!profile,
        },
        message: profile ? 'Profile retrieved successfully' : 'No profile found',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get profile error:', error);
    
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

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteHandlerClient();
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { location, budgetMax, timelinePreference, homeTypePreference, firstTimeBuyer } = body;

    // Validate required fields
    if (!location) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_LOCATION',
            message: 'Location is required',
          },
        },
        { status: 400 }
      );
    }

    // Validate location format (should be region codes like 'ON', 'BC', 'US_CA')
    const validLocations = ['ON', 'BC', 'US_CA', 'US_TX', 'US_FL', 'US_NY'];
    if (!validLocations.includes(location)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_LOCATION',
            message: 'Invalid location code',
            details: { validLocations },
          },
        },
        { status: 400 }
      );
    }

    // Validate timeline preference
    const validTimelines = ['fast', 'normal', 'thorough'];
    if (timelinePreference && !validTimelines.includes(timelinePreference)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TIMELINE',
            message: 'Invalid timeline preference',
            details: { validTimelines },
          },
        },
        { status: 400 }
      );
    }

    // Validate home type preference
    const validHomeTypes = ['single_family', 'condo', 'townhouse'];
    if (homeTypePreference && !validHomeTypes.includes(homeTypePreference)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_HOME_TYPE',
            message: 'Invalid home type preference',
            details: { validHomeTypes },
          },
        },
        { status: 400 }
      );
    }

    // Validate budget if provided
    if (budgetMax !== undefined && (typeof budgetMax !== 'number' || budgetMax < 0)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_BUDGET',
            message: 'Budget must be a positive number',
          },
        },
        { status: 400 }
      );
    }

    // Update or create profile
    const profileData = {
      user_id: user.id,
      location,
      budget_max: budgetMax || null,
      timeline_preference: timelinePreference || 'normal',
      home_type_preference: homeTypePreference || null,
      first_time_buyer: firstTimeBuyer !== undefined ? firstTimeBuyer : true,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single();
    
    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update profile',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          profile: updatedProfile,
        },
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update profile error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred while updating profile',
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
        message: 'POST method not allowed. Use PUT to update profile.',
      },
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'DELETE method not allowed. Use DELETE /api/user/account to delete account.',
      },
    },
    { status: 405 }
  );
}