// API client for journey progress tracking
import { UserJourneyProgress, StepProgress } from '@/types/regional';

const API_BASE = '/api/journey';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Progress API functions
export class ProgressApi {
  // Get user progress
  static async getProgress(userId: string): Promise<ApiResponse<UserJourneyProgress>> {
    try {
      const response = await fetch(`${API_BASE}/progress?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch progress' };
      }

      return data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Save user progress
  static async saveProgress(progress: UserJourneyProgress): Promise<ApiResponse<UserJourneyProgress>> {
    try {
      const response = await fetch(`${API_BASE}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to save progress' };
      }

      return data;
    } catch (error) {
      console.error('Error saving progress:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Update user progress
  static async updateProgress(
    userId: string, 
    updates: Partial<UserJourneyProgress>
  ): Promise<ApiResponse<UserJourneyProgress>> {
    try {
      const response = await fetch(`${API_BASE}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, updates }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update progress' };
      }

      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Reset user progress
  static async resetProgress(userId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE}/progress?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to reset progress' };
      }

      return data;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return { success: false, error: 'Network error' };
    }
  }
}

// Step API functions
export class StepApi {
  // Start a step
  static async startStep(userId: string, stepId: string): Promise<ApiResponse<StepProgress>> {
    try {
      const response = await fetch(`${API_BASE}/steps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, stepId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to start step' };
      }

      return data;
    } catch (error) {
      console.error('Error starting step:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Complete a step
  static async completeStep(
    userId: string, 
    stepId: string, 
    notes?: string, 
    timeSpent?: number
  ): Promise<ApiResponse<{ stepProgress: Partial<StepProgress>; completedAt: Date }>> {
    try {
      const response = await fetch(`${API_BASE}/steps/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, stepId, notes, timeSpent }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to complete step' };
      }

      return data;
    } catch (error) {
      console.error('Error completing step:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Update step progress
  static async updateStepProgress(
    userId: string,
    stepId: string,
    updates: Partial<StepProgress>
  ): Promise<ApiResponse<Partial<StepProgress>>> {
    try {
      const response = await fetch(`${API_BASE}/steps/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, stepId, updates }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update step progress' };
      }

      return data;
    } catch (error) {
      console.error('Error updating step progress:', error);
      return { success: false, error: 'Network error' };
    }
  }
}

// Checklist API functions
export class ChecklistApi {
  // Complete/uncomplete a checklist item
  static async updateChecklistItem(
    userId: string,
    stepId: string,
    checklistItemId: string,
    completed: boolean
  ): Promise<ApiResponse<{
    userId: string;
    stepId: string;
    checklistItemId: string;
    completed: boolean;
    completedAt: Date | null;
    updatedAt: Date;
  }>> {
    try {
      const response = await fetch(`${API_BASE}/checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, stepId, checklistItemId, completed }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update checklist item' };
      }

      return data;
    } catch (error) {
      console.error('Error updating checklist item:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Get checklist progress for a step
  static async getChecklistProgress(
    userId: string,
    stepId: string
  ): Promise<ApiResponse<{
    stepId: string;
    completedItems: string[];
    totalItems: number;
    completionPercentage: number;
  }>> {
    try {
      const response = await fetch(
        `${API_BASE}/checklist?userId=${encodeURIComponent(userId)}&stepId=${encodeURIComponent(stepId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch checklist progress' };
      }

      return data;
    } catch (error) {
      console.error('Error fetching checklist progress:', error);
      return { success: false, error: 'Network error' };
    }
  }
}

// Unified API client
export const JourneyApi = {
  progress: ProgressApi,
  steps: StepApi,
  checklist: ChecklistApi,
};

export default JourneyApi;