import { NextRequest, NextResponse } from 'next/server';
import { UserJourneyProgress, RegionCode } from '@/types/regional';

// In-memory storage for demo purposes
// In production, this would be replaced with database operations
const progressStorage = new Map<string, UserJourneyProgress>();

// GET /api/journey/progress?userId=string
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const progress = progressStorage.get(userId);
    
    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found for user' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      data: progress 
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/journey/progress - Save progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const progress: UserJourneyProgress = body.progress;

    // Validate required fields
    if (!progress || !progress.userId || !progress.regionCode) {
      return NextResponse.json(
        { error: 'Invalid progress data: userId and regionCode are required' },
        { status: 400 }
      );
    }

    // Validate region code
    const validRegions: RegionCode[] = ['ON', 'BC', 'US_CA', 'US_NY', 'US_TX', 'US_FL'];
    if (!validRegions.includes(progress.regionCode)) {
      return NextResponse.json(
        { error: 'Invalid region code' },
        { status: 400 }
      );
    }

    // Ensure dates are properly formatted
    const sanitizedProgress: UserJourneyProgress = {
      ...progress,
      startedAt: new Date(progress.startedAt),
      lastUpdated: new Date(),
      stepProgress: Object.fromEntries(
        Object.entries(progress.stepProgress || {}).map(([stepId, stepProgress]) => [
          stepId,
          {
            ...stepProgress,
            startedAt: stepProgress.startedAt ? new Date(stepProgress.startedAt) : undefined,
            completedAt: stepProgress.completedAt ? new Date(stepProgress.completedAt) : undefined,
          }
        ])
      )
    };

    // Save to storage
    progressStorage.set(progress.userId, sanitizedProgress);

    return NextResponse.json({
      success: true,
      message: 'Progress saved successfully',
      data: sanitizedProgress
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/journey/progress - Update progress
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const existingProgress = progressStorage.get(userId);
    
    if (!existingProgress) {
      return NextResponse.json(
        { error: 'Progress not found for user' },
        { status: 404 }
      );
    }

    // Merge updates with existing progress
    const updatedProgress: UserJourneyProgress = {
      ...existingProgress,
      ...updates,
      lastUpdated: new Date(),
      // Preserve userId and regionCode
      userId: existingProgress.userId,
      regionCode: existingProgress.regionCode,
    };

    progressStorage.set(userId, updatedProgress);

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      data: updatedProgress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/journey/progress?userId=string - Reset progress
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const deleted = progressStorage.delete(userId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Progress not found for user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Progress reset successfully'
    });
  } catch (error) {
    console.error('Error resetting progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}