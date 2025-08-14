import { NextRequest, NextResponse } from 'next/server';
import { StepProgress } from '@/types/regional';

// POST /api/journey/steps/start - Start a step
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, stepId } = body;

    if (!userId || !stepId) {
      return NextResponse.json(
        { error: 'userId and stepId are required' },
        { status: 400 }
      );
    }

    // In a real app, this would update the database
    // For now, we'll return success and let the frontend handle localStorage
    const stepProgress: StepProgress = {
      stepId,
      status: 'in_progress',
      startedAt: new Date(),
      completedChecklist: [],
      timeSpent: 0
    };

    return NextResponse.json({
      success: true,
      message: 'Step started successfully',
      data: stepProgress
    });
  } catch (error) {
    console.error('Error starting step:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}