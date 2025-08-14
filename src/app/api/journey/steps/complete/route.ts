import { NextRequest, NextResponse } from 'next/server';
import { StepProgress } from '@/types/regional';

// POST /api/journey/steps/complete - Complete a step
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, stepId, notes, timeSpent } = body;

    if (!userId || !stepId) {
      return NextResponse.json(
        { error: 'userId and stepId are required' },
        { status: 400 }
      );
    }

    // Validate timeSpent if provided
    if (timeSpent !== undefined && (typeof timeSpent !== 'number' || timeSpent < 0)) {
      return NextResponse.json(
        { error: 'timeSpent must be a non-negative number' },
        { status: 400 }
      );
    }

    const completedStepProgress: Partial<StepProgress> = {
      stepId,
      status: 'completed',
      completedAt: new Date(),
      notes: notes || undefined,
      timeSpent: timeSpent || 0
    };

    // In production, this would:
    // 1. Update the step progress in the database
    // 2. Add the step to the user's completed steps list
    // 3. Update overall progress percentage
    // 4. Potentially trigger next step availability

    return NextResponse.json({
      success: true,
      message: 'Step completed successfully',
      data: {
        stepProgress: completedStepProgress,
        completedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error completing step:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/journey/steps/complete - Update step completion
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, stepId, updates } = body;

    if (!userId || !stepId) {
      return NextResponse.json(
        { error: 'userId and stepId are required' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'updates object is required' },
        { status: 400 }
      );
    }

    // Validate status if being updated
    if (updates.status && !['not_started', 'in_progress', 'completed', 'skipped'].includes(updates.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updatedStepProgress = {
      ...updates,
      stepId,
      lastUpdated: new Date()
    };

    return NextResponse.json({
      success: true,
      message: 'Step progress updated successfully',
      data: updatedStepProgress
    });
  } catch (error) {
    console.error('Error updating step progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}