import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

// GET /api/user/preferences - Get user preferences and settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteHandlerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user profile for preferences
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get journey progress to understand current state
    const { data: progress, error: progressError } = await supabase
      .from('journey_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(10);

    // Get saved calculations
    const { data: calculations, error: calculationsError } = await supabase
      .from('calculator_sessions')
      .select('calculator_type, created_at, saved')
      .eq('user_id', user.id)
      .eq('saved', true)
      .order('created_at', { ascending: false })
      .limit(5);

    const preferences = {
      profile: profile || null,
      recentProgress: progress || [],
      savedCalculations: calculations || [],
      settings: {
        notifications: {
          email: true, // Default settings
          push: false,
          sms: false,
        },
        privacy: {
          dataSharing: false,
          analytics: true,
        },
        display: {
          theme: 'light',
          currency: (profile as any)?.location?.startsWith('US_') ? 'USD' : 'CAD',
          language: 'en',
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// PUT /api/user/preferences - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteHandlerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      timeline_preference, 
      budget_max, 
      home_type_preference,
      notifications,
      privacy,
      display 
    } = body;

    // Update profile preferences
    if (timeline_preference || budget_max !== undefined || home_type_preference) {
      const updateData: { 
        updated_at: string;
        timeline_preference?: string;
        budget_max?: number;
        home_type_preference?: string;
      } = { updated_at: new Date().toISOString() };
      
      if (timeline_preference) updateData.timeline_preference = timeline_preference;
      if (budget_max !== undefined) updateData.budget_max = budget_max;
      if (home_type_preference) updateData.home_type_preference = home_type_preference;

      const { error: updateError } = await (supabase as any)
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Profile preferences update error:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update preferences' },
          { status: 500 }
        );
      }
    }

    // Note: For notifications, privacy, and display settings, 
    // in a real app you might store these in a separate user_settings table
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}