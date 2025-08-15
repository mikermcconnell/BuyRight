import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient, isSupabaseAvailable } from '@/lib/supabase';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is available
    if (!isSupabaseAvailable()) {
      return NextResponse.json({
        success: false,
        message: 'Service temporarily unavailable - running in demo mode',
        data: {
          id: 'demo-' + Date.now(),
          calculatorType: 'demo',
          createdAt: new Date().toISOString(),
        },
      });
    }

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { calculatorType, inputData, results } = body;

    if (!calculatorType || !inputData || !results) {
      return NextResponse.json(
        { error: 'calculatorType, inputData, and results are required' },
        { status: 400 }
      );
    }

    // Validate calculator type
    const validTypes = ['mortgage', 'affordability', 'closing_costs'];
    if (!validTypes.includes(calculatorType)) {
      return NextResponse.json(
        { error: 'Invalid calculator type' },
        { status: 400 }
      );
    }

    // Save to database
    let data;
    try {
      const supabase = createSupabaseServiceClient();
      const result = await supabase
        .from('calculator_sessions')
        .insert([
          {
            user_id: user.id,
            calculator_type: calculatorType,
            input_data: inputData,
            results: results,
            saved: true,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (result.error) {
        console.error('Database error saving calculation:', result.error);
        return NextResponse.json(
          { error: 'Failed to save calculation' },
          { status: 500 }
        );
      }

      data = result.data;
    } catch (serviceError) {
      console.error('Service client error:', serviceError);
      return NextResponse.json({
        success: false,
        message: 'Service temporarily unavailable - calculation not saved',
        data: {
          id: 'demo-' + Date.now(),
          calculatorType: calculatorType,
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Calculation saved successfully',
      data: {
        id: data.id,
        calculatorType: data.calculator_type,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error('Calculator save API error:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is available
    if (!isSupabaseAvailable()) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Running in demo mode - no saved calculations available',
      });
    }

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const calculatorType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    let data;
    try {
      const supabase = createSupabaseServiceClient();
      let query = supabase
        .from('calculator_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('saved', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (calculatorType) {
        query = query.eq('calculator_type', calculatorType);
      }

      const result = await query;

      if (result.error) {
        console.error('Database error fetching calculations:', result.error);
        return NextResponse.json(
          { error: 'Failed to fetch calculations' },
          { status: 500 }
        );
      }

      data = result.data;
    } catch (serviceError) {
      console.error('Service client error:', serviceError);
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Service temporarily unavailable - no saved calculations available',
      });
    }

    const formattedData = data.map(record => ({
      id: record.id,
      calculatorType: record.calculator_type,
      inputData: record.input_data,
      results: record.results,
      createdAt: record.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Calculator fetch API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}