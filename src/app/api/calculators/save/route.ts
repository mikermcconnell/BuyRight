import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedUser } from '@/lib/auth-utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
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
    const { data, error } = await supabase
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

    if (error) {
      console.error('Database error saving calculation:', error);
      return NextResponse.json(
        { error: 'Failed to save calculation' },
        { status: 500 }
      );
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
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const calculatorType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

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

    const { data, error } = await query;

    if (error) {
      console.error('Database error fetching calculations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch calculations' },
        { status: 500 }
      );
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