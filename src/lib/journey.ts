// Journey management service for BuyRight
import { createClient } from '@supabase/supabase-js';
import { validateStepId, sanitizeTextInput } from '@/lib/validation';
import { 
  JourneyPhase, 
  JourneyStep, 
  JourneyProgress, 
  JourneyState,
  JourneyTemplate,
  JourneyInsight,
  JourneyCustomization
} from '@/types/journey';
import { RegionCode } from '@/types/regional';
import { loadRegionalContent } from '@/lib/regional';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class JourneyService {
  // Get user's journey progress
  static async getUserProgress(userId: string): Promise<JourneyProgress[]> {
    try {
      const { data, error } = await supabase
        .from('journey_progress')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching journey progress:', error);
        return [];
      }

      return data.map(record => ({
        userId: record.user_id,
        stepId: record.step_id,
        phase: record.phase as JourneyPhase,
        status: record.completed ? 'completed' : 'in_progress',
        completedAt: record.completed_at,
        lastUpdated: record.updated_at,
        notes: record.notes,
        userData: record.data || {},
      }));
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      return [];
    }
  }

  // Update step progress
  static async updateStepProgress(
    userId: string,
    stepId: string,
    phase: JourneyPhase,
    status: 'in_progress' | 'completed' | 'skipped',
    data?: any
  ): Promise<boolean> {
    try {
      // Validate stepId to prevent injection attacks
      if (!validateStepId(stepId)) {
        console.error('Invalid stepId format:', stepId);
        return false;
      }

      // Sanitize any text data
      const sanitizedData = data ? {
        ...data,
        notes: data.notes ? sanitizeTextInput(data.notes, 500) : null
      } : null;
      const progressData = {
        user_id: userId,
        step_id: stepId,
        phase,
        completed: status === 'completed',
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        notes: sanitizedData?.notes || null,
        data: sanitizedData || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('journey_progress')
        .upsert(progressData, {
          onConflict: 'user_id,step_id',
        });

      if (error) {
        console.error('Error updating step progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateStepProgress:', error);
      return false;
    }
  }

  // Calculate journey state
  static async calculateJourneyState(
    userId: string,
    regionCode: RegionCode,
    customization?: JourneyCustomization
  ): Promise<JourneyState> {
    try {
      // Load regional content for steps
      const regionalResult = await loadRegionalContent(regionCode);
      const regionalSteps = regionalResult.content?.steps || [];

      // Get user progress
      const progress = await this.getUserProgress(userId);

      // Transform regional steps to journey steps
      const allSteps = this.transformRegionalSteps(regionalSteps, regionCode);
      
      // Calculate state
      const completedSteps = progress
        .filter(p => p.status === 'completed')
        .map(p => p.stepId);
      
      const availableSteps = this.calculateAvailableSteps(allSteps, completedSteps);
      const blockedSteps = allSteps
        .filter(step => !availableSteps.includes(step.id) && !completedSteps.includes(step.id))
        .map(step => step.id);

      const currentStep = this.getCurrentStep(allSteps, progress);
      const currentPhase = currentStep ? 
        allSteps.find(s => s.id === currentStep)?.phase : 
        this.getNextPhase(allSteps, completedSteps);

      // Calculate progress percentages
      const overallProgress = Math.round((completedSteps.length / allSteps.length) * 100);
      const phaseProgress = this.calculatePhaseProgress(allSteps, completedSteps);

      return {
        currentStep,
        currentPhase,
        completedSteps,
        availableSteps,
        blockedSteps,
        progress,
        timeline: customization?.timeline || 'normal',
        region: regionCode,
        overallProgress,
        phaseProgress,
        estimatedCompletion: this.calculateEstimatedCompletion(
          allSteps,
          completedSteps,
          customization?.timeline || 'normal'
        ),
      };
    } catch (error) {
      console.error('Error calculating journey state:', error);
      throw error;
    }
  }

  // Transform regional steps to journey steps
  private static transformRegionalSteps(regionalSteps: any[], regionCode: RegionCode): JourneyStep[] {
    return regionalSteps.map((step, index) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      phase: this.mapCategoryToPhase(step.category),
      order: index,
      estimatedDuration: step.estimatedDuration || '1 week',
      difficulty: this.inferDifficulty(step),
      prerequisites: step.prerequisites || [],
      optional: !step.required,
      content: {
        overview: step.description,
        instructions: step.resources?.map((resource: any, idx: number) => ({
          id: `${step.id}-instruction-${idx}`,
          title: resource.title,
          description: resource.description,
          type: this.mapResourceType(resource.type),
          order: idx,
          required: true,
          component: resource.type === 'calculator' ? 'Calculator' : undefined,
          data: resource,
        })) || [],
        resources: step.resources?.map((resource: any) => ({
          id: resource.id || `${step.id}-resource-${Math.random()}`,
          title: resource.title,
          type: resource.type,
          url: resource.url,
          description: resource.description,
          category: this.mapResourceCategory(resource.type),
          regional: true,
        })) || [],
        tips: step.tips || [],
        warnings: [],
      },
      regionalOverrides: {
        [regionCode]: {
          content: {
            overview: step.description,
            instructions: [],
            resources: step.resources || [],
            tips: step.tips || [],
            warnings: [],
          }
        }
      }
    }));
  }

  // Map regional categories to journey phases
  private static mapCategoryToPhase(category: string): JourneyPhase {
    const phaseMap: { [key: string]: JourneyPhase } = {
      'planning': 'planning',
      'financing': 'financing',
      'searching': 'searching',
      'inspection': 'inspection',
      'closing': 'closing',
      'maintenance': 'maintenance',
    };
    return phaseMap[category] || 'planning';
  }

  // Infer difficulty from step characteristics
  private static inferDifficulty(step: any): 'easy' | 'medium' | 'hard' {
    const complexSteps = ['make-offer', 'finalize-financing', 'closing-day'];
    if (complexSteps.includes(step.id)) return 'hard';
    
    const mediumSteps = ['get-preapproved', 'home-inspection', 'hire-lawyer'];
    if (mediumSteps.includes(step.id)) return 'medium';
    
    return 'easy';
  }

  // Map resource types
  private static mapResourceType(type: string): 'action' | 'information' | 'decision' | 'calculation' {
    const typeMap: { [key: string]: any } = {
      'calculator': 'calculation',
      'contact': 'action',
      'document': 'information',
      'website': 'information',
      'form': 'action',
    };
    return typeMap[type] || 'information';
  }

  // Map resource categories
  private static mapResourceCategory(type: string): 'government' | 'legal' | 'financial' | 'educational' | 'tool' {
    const categoryMap: { [key: string]: any } = {
      'calculator': 'tool',
      'contact': 'legal',
      'document': 'government',
      'website': 'educational',
      'form': 'legal',
    };
    return categoryMap[type] || 'educational';
  }

  // Calculate available steps based on prerequisites
  private static calculateAvailableSteps(allSteps: JourneyStep[], completedSteps: string[]): string[] {
    const available: string[] = [];

    for (const step of allSteps) {
      if (completedSteps.includes(step.id)) {
        continue; // Already completed
      }

      const prerequisitesMet = step.prerequisites.every(prereq => 
        completedSteps.includes(prereq)
      );

      if (prerequisitesMet) {
        available.push(step.id);
      }
    }

    return available;
  }

  // Get current step user should focus on
  private static getCurrentStep(allSteps: JourneyStep[], progress: JourneyProgress[]): string | undefined {
    // Find the first in-progress step
    const inProgress = progress.find(p => p.status === 'in_progress');
    if (inProgress) return inProgress.stepId;

    // Find the first available step
    const completedSteps = progress
      .filter(p => p.status === 'completed')
      .map(p => p.stepId);
    
    const availableSteps = this.calculateAvailableSteps(allSteps, completedSteps);
    
    // Return the first available step in order
    const sortedSteps = allSteps.sort((a, b) => a.order - b.order);
    return sortedSteps.find(step => availableSteps.includes(step.id))?.id;
  }

  // Get next phase user should work on
  private static getNextPhase(allSteps: JourneyStep[], completedSteps: string[]): JourneyPhase | undefined {
    const phases: JourneyPhase[] = ['planning', 'financing', 'searching', 'inspection', 'closing', 'maintenance'];
    
    for (const phase of phases) {
      const phaseSteps = allSteps.filter(step => step.phase === phase);
      const phaseCompleted = phaseSteps.every(step => 
        completedSteps.includes(step.id) || step.optional
      );
      
      if (!phaseCompleted) {
        return phase;
      }
    }
    
    return undefined;
  }

  // Calculate phase progress percentages
  private static calculatePhaseProgress(allSteps: JourneyStep[], completedSteps: string[]) {
    const phases: JourneyPhase[] = ['planning', 'financing', 'searching', 'inspection', 'closing', 'maintenance'];
    const phaseProgress: { [phase in JourneyPhase]: number } = {} as any;

    for (const phase of phases) {
      const phaseSteps = allSteps.filter(step => step.phase === phase);
      const completedInPhase = phaseSteps.filter(step => 
        completedSteps.includes(step.id)
      ).length;
      
      phaseProgress[phase] = phaseSteps.length > 0 ? 
        Math.round((completedInPhase / phaseSteps.length) * 100) : 0;
    }

    return phaseProgress;
  }

  // Calculate estimated completion date
  private static calculateEstimatedCompletion(
    allSteps: JourneyStep[], 
    completedSteps: string[], 
    timeline: 'fast' | 'normal' | 'thorough'
  ): string {
    const remainingSteps = allSteps.filter(step => !completedSteps.includes(step.id));
    
    // Estimate weeks based on timeline
    const timelineMultiplier = {
      fast: 0.7,
      normal: 1.0,
      thorough: 1.4,
    };
    
    const baseWeeks = remainingSteps.reduce((total, step) => {
      // Parse duration like "2-3 days", "1 week", etc.
      const duration = step.estimatedDuration.toLowerCase();
      if (duration.includes('day')) {
        const days = parseInt(duration) || 7;
        return total + (days / 7);
      } else if (duration.includes('week')) {
        const weeks = parseInt(duration) || 1;
        return total + weeks;
      }
      return total + 1; // Default to 1 week
    }, 0);

    const adjustedWeeks = Math.ceil(baseWeeks * timelineMultiplier[timeline]);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + (adjustedWeeks * 7));
    
    return completionDate.toISOString();
  }

  // Generate journey insights and recommendations
  static generateInsights(state: JourneyState, allSteps: JourneyStep[]): JourneyInsight[] {
    const insights: JourneyInsight[] = [];

    // Check for blocked steps
    if (state.blockedSteps.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Steps Waiting',
        description: `${state.blockedSteps.length} steps are waiting for prerequisites to be completed.`,
        priority: 'medium',
        actionable: true,
        action: {
          label: 'Review Prerequisites',
          component: 'PrerequisiteReview',
        },
      });
    }

    // Progress milestone
    if (state.overallProgress >= 50 && state.overallProgress < 60) {
      insights.push({
        type: 'milestone',
        title: 'Halfway There!',
        description: 'You\'re making great progress on your home buying journey.',
        priority: 'low',
        actionable: false,
      });
    }

    // Timeline suggestions
    if (state.timeline === 'fast' && state.overallProgress < 30) {
      insights.push({
        type: 'suggestion',
        title: 'Fast Timeline Challenge',
        description: 'Your fast timeline may be ambitious. Consider focusing on critical steps first.',
        priority: 'medium',
        actionable: true,
        action: {
          label: 'Adjust Timeline',
          component: 'TimelineAdjuster',
        },
      });
    }

    // Phase-specific insights
    if (state.currentPhase === 'financing' && state.phaseProgress.financing < 25) {
      insights.push({
        type: 'tip',
        title: 'Financing Foundation',
        description: 'Getting pre-approved early will strengthen your position when making offers.',
        priority: 'high',
        phaseId: 'financing',
        actionable: true,
        action: {
          label: 'Start Pre-approval',
          url: '/journey/get-preapproved',
        },
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Get step by ID with regional content
  static async getStepDetails(stepId: string, regionCode: RegionCode): Promise<JourneyStep | null> {
    try {
      const regionalResult = await loadRegionalContent(regionCode);
      const regionalSteps = regionalResult.content?.steps || [];
      
      const allSteps = this.transformRegionalSteps(regionalSteps, regionCode);
      return allSteps.find(step => step.id === stepId) || null;
    } catch (error) {
      console.error('Error getting step details:', error);
      return null;
    }
  }
}

// Utility functions for journey management
export const journeyUtils = {
  // Format phase name for display
  formatPhaseName(phase: JourneyPhase): string {
    const phaseNames: { [key in JourneyPhase]: string } = {
      planning: 'Planning',
      financing: 'Financing',
      searching: 'House Hunting',
      inspection: 'Inspection',
      closing: 'Closing',
      maintenance: 'Maintenance',
    };
    return phaseNames[phase];
  },

  // Get phase icon
  getPhaseIcon(phase: JourneyPhase): string {
    const phaseIcons: { [key in JourneyPhase]: string } = {
      planning: '📋',
      financing: '💰',
      searching: '🔍',
      inspection: '🔎',
      closing: '📝',
      maintenance: '🔧',
    };
    return phaseIcons[phase];
  },

  // Get phase color
  getPhaseColor(phase: JourneyPhase): string {
    const phaseColors: { [key in JourneyPhase]: string } = {
      planning: 'blue',
      financing: 'green',
      searching: 'purple',
      inspection: 'orange',
      closing: 'red',
      maintenance: 'gray',
    };
    return phaseColors[phase];
  },

  // Calculate time remaining
  formatTimeRemaining(estimatedCompletion?: string): string {
    if (!estimatedCompletion) return 'Unknown';
    
    const completion = new Date(estimatedCompletion);
    const now = new Date();
    const diffTime = completion.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    if (diffWeeks <= 0) return 'Overdue';
    if (diffWeeks === 1) return '1 week remaining';
    if (diffWeeks < 4) return `${diffWeeks} weeks remaining`;
    
    const diffMonths = Math.ceil(diffWeeks / 4);
    if (diffMonths === 1) return '1 month remaining';
    return `${diffMonths} months remaining`;
  },

  // Get step status display
  getStepStatusDisplay(
    stepId: string,
    progress: JourneyProgress[],
    availableSteps: string[],
    completedSteps: string[]
  ): { status: string; color: string; icon: string } {
    if (completedSteps.includes(stepId)) {
      return { status: 'Completed', color: 'green', icon: '✅' };
    }
    
    const stepProgress = progress.find(p => p.stepId === stepId);
    if (stepProgress?.status === 'in_progress') {
      return { status: 'In Progress', color: 'blue', icon: '🔄' };
    }
    
    if (availableSteps.includes(stepId)) {
      return { status: 'Available', color: 'yellow', icon: '⏳' };
    }
    
    return { status: 'Blocked', color: 'gray', icon: '🔒' };
  },
};