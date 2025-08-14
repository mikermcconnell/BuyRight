import { NextRequest, NextResponse } from 'next/server';

// POST /api/journey/checklist - Complete a checklist item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, stepId, checklistItemId, completed } = body;

    if (!userId || !stepId || !checklistItemId) {
      return NextResponse.json(
        { error: 'userId, stepId, and checklistItemId are required' },
        { status: 400 }
      );
    }

    if (typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'completed must be a boolean value' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Update the checklist item status in the database
    // 2. Update the step progress
    // 3. Recalculate step completion percentage

    const response = {
      userId,
      stepId,
      checklistItemId,
      completed,
      completedAt: completed ? new Date() : null,
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      message: `Checklist item ${completed ? 'completed' : 'unchecked'}`,
      data: response
    });
  } catch (error) {
    console.error('Error updating checklist item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/journey/checklist - Get checklist progress for a step
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const stepId = searchParams.get('stepId');

    if (!userId || !stepId) {
      return NextResponse.json(
        { error: 'userId and stepId parameters are required' },
        { status: 400 }
      );
    }

    // In production, this would fetch from the database
    // For now, return empty checklist progress
    return NextResponse.json({
      success: true,
      data: {
        stepId,
        completedItems: [],
        totalItems: 0,
        completionPercentage: 0
      }
    });
  } catch (error) {
    console.error('Error fetching checklist progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}