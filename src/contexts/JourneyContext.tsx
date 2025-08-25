'use client';

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useEffect, 
  ReactNode 
} from 'react';
import { 
  JourneyContextState, 
  JourneyAction, 
  UserJourneyProgress,
  JourneyPhase,
  JourneyStep,
  StepProgress,
  RegionCode 
} from '@/types/regional';
import { 
  JourneyEngine,
  createJourneyEngine,
  baseJourneyTemplate,
  initializeUserProgress
} from '@/lib/journeyEngine';
import { ProgressPersistence } from '@/lib/progressPersistence';
import { JourneyApi } from '@/lib/progressApi';
import { useRegional } from './RegionalContext';
import { useAuth } from './AuthContext';
import { supabaseService, JourneyProgress } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { JOURNEY_CONSTANTS } from '@/lib/constants';

const journeyLogger = logger.createDomainLogger('journey');

// Custom error types for journey operations
export class JourneyError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'JourneyError';
  }
}

export class JourneyInitializationError extends JourneyError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'JOURNEY_INIT_ERROR', context);
    this.name = 'JourneyInitializationError';
  }
}

export class JourneyPersistenceError extends JourneyError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'JOURNEY_PERSISTENCE_ERROR', context);
    this.name = 'JourneyPersistenceError';
  }
}

export class JourneyStepError extends JourneyError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'JOURNEY_STEP_ERROR', context);
    this.name = 'JourneyStepError';
  }
}

// Helper function to get user-friendly error messages
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof JourneyInitializationError) {
    return 'There was a problem loading your journey progress. Please try refreshing the page.';
  }
  
  if (error instanceof JourneyPersistenceError) {
    return 'Your progress couldn\'t be saved right now. Don\'t worry, your local progress is still intact.';
  }
  
  if (error instanceof JourneyStepError) {
    return 'There was a problem with this step. Please try again or contact support if the issue persists.';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

// Journey Context Type
interface JourneyContextType extends JourneyContextState {
  // Core journey data
  engine: JourneyEngine | null;
  phases: JourneyPhase[];
  currentPhase: JourneyPhase | null;
  currentStep: JourneyStep | null;
  availableSteps: JourneyStep[];
  
  // Progress calculations
  progressPercentage: number;
  completedStepsCount: number;
  totalStepsCount: number;
  
  // Actions
  startStep: (stepId: string) => void;
  completeStep: (stepId: string, notes?: string) => void;
  completeChecklistItem: (stepId: string, checklistItemId: string) => void;
  setCurrentStep: (stepId: string) => void;
  resetProgress: () => void;
  unlockAllSteps: () => void;
  
  // Celebration
  showCelebration: boolean;
  dismissCelebration: () => void;
  
  // Utilities
  getStepProgress: (stepId: string) => StepProgress | null;
  isStepCompleted: (stepId: string) => boolean;
  isStepAvailable: (stepId: string) => boolean;
  getNextStep: () => JourneyStep | null;
  getPreviousStep: () => JourneyStep | null;
}

// Reducer for journey state management
function journeyReducer(state: JourneyContextState, action: JourneyAction): JourneyContextState {
  switch (action.type) {
    case 'LOAD_JOURNEY':
      return {
        ...state,
        template: action.payload.template,
        loading: false,
        error: null
      };

    case 'START_STEP':
      if (!state.userProgress) return state;
      
      const stepProgress: StepProgress = {
        stepId: action.payload.stepId,
        status: 'in_progress',
        startedAt: new Date(),
        completedChecklist: [],
        timeSpent: 0
      };

      const updatedProgressStart = {
        ...state.userProgress,
        currentStepId: action.payload.stepId,
        stepProgress: {
          ...state.userProgress.stepProgress,
          [action.payload.stepId]: stepProgress
        },
        lastUpdated: new Date()
      };

      // NOTE: Persistence is handled by the caller, not the reducer
      // ProgressPersistence.saveProgress(updatedProgressStart);

      return {
        ...state,
        userProgress: updatedProgressStart
      };

    case 'COMPLETE_STEP':
      if (!state.userProgress) return state;

      const existingProgress = state.userProgress.stepProgress[action.payload.stepId] || {
        stepId: action.payload.stepId,
        status: 'not_started' as const,
        completedChecklist: [],
        timeSpent: 0
      };

      const completedStepProgress: StepProgress = {
        ...existingProgress,
        status: 'completed',
        completedAt: new Date(),
        notes: action.payload.notes
      };

      const updatedProgressComplete = {
        ...state.userProgress,
        completedSteps: state.userProgress.completedSteps.includes(action.payload.stepId) 
          ? state.userProgress.completedSteps 
          : [...state.userProgress.completedSteps, action.payload.stepId],
        stepProgress: {
          ...state.userProgress.stepProgress,
          [action.payload.stepId]: completedStepProgress
        },
        lastUpdated: new Date()
      };

      // NOTE: Persistence is handled by the caller, not the reducer
      // ProgressPersistence.saveProgress(updatedProgressComplete);

      return {
        ...state,
        userProgress: updatedProgressComplete
      };

    case 'COMPLETE_CHECKLIST_ITEM':
      if (!state.userProgress) return state;

      const currentStepProgress = state.userProgress.stepProgress[action.payload.stepId] || {
        stepId: action.payload.stepId,
        status: 'in_progress' as const,
        completedChecklist: [],
        timeSpent: 0
      };

      const updatedChecklist = currentStepProgress.completedChecklist.includes(action.payload.checklistItemId)
        ? currentStepProgress.completedChecklist.filter(id => id !== action.payload.checklistItemId)
        : [...currentStepProgress.completedChecklist, action.payload.checklistItemId];

      const updatedStepProgress = {
        ...currentStepProgress,
        completedChecklist: updatedChecklist
      };

      const updatedProgressChecklist = {
        ...state.userProgress,
        completedChecklist: state.userProgress.completedChecklist.includes(action.payload.checklistItemId)
          ? state.userProgress.completedChecklist
          : [...state.userProgress.completedChecklist, action.payload.checklistItemId],
        stepProgress: {
          ...state.userProgress.stepProgress,
          [action.payload.stepId]: updatedStepProgress
        },
        lastUpdated: new Date()
      };

      // NOTE: Persistence is handled by the caller, not the reducer
      // ProgressPersistence.saveProgress(updatedProgressChecklist);

      return {
        ...state,
        userProgress: updatedProgressChecklist
      };

    case 'UPDATE_PROGRESS':
      journeyLogger.debug('UPDATE_PROGRESS: completed steps before/after', {
        before: state.userProgress?.completedSteps?.length,
        after: action.payload?.completedSteps?.length
      });
      
      // Handle initial userProgress setup (when state.userProgress is null)
      if (!state.userProgress) {
        return {
          ...state,
          userProgress: {
            userId: action.payload?.userId || 'demo-user',
            currentPhaseId: action.payload?.currentPhaseId || 'pre-approval',
            currentStepId: action.payload?.currentStepId || 'research-lenders',
            completedSteps: action.payload?.completedSteps || [],
            completedChecklist: action.payload?.completedChecklist || [],
            stepProgress: action.payload?.stepProgress || {},
            startedAt: action.payload?.startedAt || new Date(),
            lastUpdated: new Date(),
            regionCode: action.payload?.regionCode || 'ON'
          },
          loading: false // Set loading to false when initial progress is loaded
        };
      }

      const updatedProgress = {
        ...state.userProgress,
        ...action.payload,
        lastUpdated: new Date()
      };

      // NOTE: Persistence is handled by the caller, not the reducer

      return {
        ...state,
        userProgress: updatedProgress
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'SHOW_CELEBRATION':
      return {
        ...state,
        showCelebration: true
      };

    case 'DISMISS_CELEBRATION':
      return {
        ...state,
        showCelebration: false
      };

    default:
      return state;
  }
}

// Initial state
const initialState: JourneyContextState = {
  template: null,
  userProgress: null,
  currentPhases: [],
  loading: true,
  error: null,
  showCelebration: false
};

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

interface JourneyProviderProps {
  children: ReactNode;
}

export function JourneyProvider({ children }: JourneyProviderProps) {
  const [state, dispatch] = useReducer(journeyReducer, initialState);
  const { currentRegion } = useRegional();
  const { user } = useAuth();

  // Initialize journey when region is loaded (for both authenticated and guest users)
  useEffect(() => {
    if (currentRegion) {
      initializeJourney(currentRegion);
    }
  }, [currentRegion]);

  const initializeJourney = async (regionCode: RegionCode) => {
    try {
      console.log('🏠 BuyRight: Initializing journey for region:', regionCode, 'User:', user ? 'authenticated' : 'guest');
      dispatch({ type: 'SET_LOADING', payload: true });

      // Load the journey template for all users
      dispatch({ 
        type: 'LOAD_JOURNEY', 
        payload: { 
          template: baseJourneyTemplate, 
          regionCode 
        } 
      });

      let userProgress: UserJourneyProgress;

      if (!user) {
        // Guest user - initialize demo journey
        journeyLogger.info('Initializing guest journey', { regionCode });
        
        // Check if there's existing guest progress in localStorage
        const existingProgress = await ProgressPersistence.loadProgress();
        
        if (existingProgress && existingProgress.userId === 'demo-user') {
          // Use existing guest progress
          userProgress = existingProgress;
          journeyLogger.info('Loaded existing guest progress from localStorage');
        } else {
          // Create new guest progress
          userProgress = initializeUserProgress('demo-user', regionCode);
          journeyLogger.info('Created new guest journey progress');
        }
        
        // Save to localStorage for guest mode
        await ProgressPersistence.saveProgress(userProgress);
      } else {
        // Authenticated user
        journeyLogger.info('Initializing authenticated journey', { userId: user.id, regionCode });
        
        // Load user progress from Supabase
        const supabaseProgress = await supabaseService.getJourneyProgress(user.id);
        
        if (supabaseProgress.length === 0) {
          // Create new progress for this user and region
          journeyLogger.info('Creating new journey progress for user');
          userProgress = initializeUserProgress(user.id, regionCode);
          
          // Save initial progress to Supabase
          await saveProgressToSupabase(userProgress);
        } else {
          // Convert Supabase progress to UserJourneyProgress format
          userProgress = convertSupabaseProgressToUserProgress(supabaseProgress, user.id, regionCode);
          journeyLogger.info('Loaded existing progress from Supabase', { 
            completedSteps: userProgress.completedSteps.length 
          });
        }

        // Also maintain localStorage backup for offline functionality
        await ProgressPersistence.saveProgress(userProgress);
      }

      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: userProgress 
      });

      console.log('🏠 BuyRight: Journey initialized successfully for', user ? 'authenticated user' : 'guest user');

    } catch (error) {
      const journeyError = new JourneyInitializationError(
        'Failed to initialize journey',
        { userId: user?.id || 'demo-user', regionCode, originalError: error }
      );
      journeyLogger.error('Failed to initialize journey:', journeyError);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: getUserFriendlyErrorMessage(journeyError)
      });
    }
  };

  // Convert Supabase journey progress to UserJourneyProgress format
  const convertSupabaseProgressToUserProgress = (
    supabaseProgress: JourneyProgress[],
    userId: string,
    regionCode: RegionCode
  ): UserJourneyProgress => {
    const completedSteps = supabaseProgress
      .filter(step => step.completed)
      .map(step => step.step_id);

    const stepProgress: { [stepId: string]: StepProgress } = {};
    
    supabaseProgress.forEach(step => {
      stepProgress[step.step_id] = {
        stepId: step.step_id,
        status: step.completed ? 'completed' : 'in_progress',
        startedAt: step.created_at ? new Date(step.created_at) : new Date(),
        completedAt: step.completed_at ? new Date(step.completed_at) : undefined,
        completedChecklist: [], // We'll need to add this to Supabase schema if needed
        timeSpent: 0, // We'll need to track this separately
        notes: step.notes || undefined,
      };
    });

    // Find the current step (the most recent incomplete step or the first available step)
    const incompleteSteps = supabaseProgress.filter(step => !step.completed);
    const currentStepId = incompleteSteps.length > 0 
      ? incompleteSteps[incompleteSteps.length - 1].step_id
      : 'research-lenders'; // default first step

    return {
      userId,
      regionCode,
      completedSteps,
      currentStepId,
      currentPhaseId: 'pre-approval', // derive from currentStepId if needed
      stepProgress,
      completedChecklist: [], // We'll populate this from stepProgress if needed
      startedAt: new Date(Math.min(...supabaseProgress.map(s => new Date(s.created_at).getTime()))),
      lastUpdated: new Date(Math.max(...supabaseProgress.map(s => new Date(s.updated_at).getTime()))),
    };
  };

  // Save progress to Supabase
  const saveProgressToSupabase = async (userProgress: UserJourneyProgress) => {
    if (!user) return;

    try {
      journeyLogger.info('Saving progress to Supabase', { 
        userId: user.id, 
        completedSteps: userProgress.completedSteps.length 
      });

      // Create or update progress records for each step
      for (const [stepId, stepProgress] of Object.entries(userProgress.stepProgress)) {
        await supabaseService.updateJourneyStep(
          user.id,
          stepId,
          stepProgress.stepId.split('-')[0], // Extract phase from step ID
          stepProgress.status === 'completed',
          stepProgress.notes,
          {
            timeSpent: stepProgress.timeSpent,
            completedChecklist: stepProgress.completedChecklist,
          }
        );
      }
    } catch (error) {
      const persistenceError = new JourneyPersistenceError(
        'Failed to save progress to Supabase',
        { userId: user.id, completedSteps: userProgress.completedSteps.length, originalError: error }
      );
      journeyLogger.error('Failed to save progress to Supabase:', persistenceError);
      // Don't throw - allow offline functionality to continue
    }
  };

  // Create journey engine instance
  const engine = currentRegion && state.template 
    ? createJourneyEngine(currentRegion) 
    : null;

  // Get customized phases
  const phases = engine ? engine.getCustomizedPhases() : [];

  // Get current phase and step
  const currentPhase = engine && state.userProgress 
    ? engine.getCurrentPhase(state.userProgress.completedSteps, state.userProgress.currentStepId)
    : null;

  const currentStep = engine && state.userProgress?.currentStepId
    ? engine.getStepById(state.userProgress.currentStepId)
    : null;

  // Get available steps
  const availableSteps = engine && state.userProgress
    ? engine.getAvailableSteps(state.userProgress.completedSteps)
    : [];

  // Calculate progress
  const progressPercentage = engine && state.userProgress
    ? engine.calculateProgress(state.userProgress.completedSteps)
    : 0;

  const completedStepsCount = state.userProgress?.completedSteps.length || 0;
  const totalStepsCount = engine ? engine.getAllSteps().filter(s => !s.isOptional).length : 0;

  // Action handlers
  const startStep = async (stepId: string) => {
    if (!user) return;
    
    dispatch({ type: 'START_STEP', payload: { stepId } });
    
    // Sync with Supabase
    try {
      await supabaseService.updateJourneyStep(
        user.id,
        stepId,
        stepId.split('-')[0], // Extract phase from step ID - validated by supabaseService
        false, // not completed, just started
        undefined,
        { startedAt: new Date().toISOString() }
      );
      journeyLogger.info('Step started in Supabase', { stepId });
    } catch (error) {
      const stepError = new JourneyStepError(
        'Failed to sync step start with Supabase',
        { userId: user.id, stepId, originalError: error }
      );
      journeyLogger.error('Failed to sync step start with Supabase:', stepError);
      // Continue with local state - the persistence service will handle offline sync
    }
  };

  const completeStep = async (stepId: string, notes?: string, timeSpent?: number) => {
    if (!user) return;
    
    dispatch({ type: 'COMPLETE_STEP', payload: { stepId, notes } });
    
    // Sync with Supabase
    try {
      await supabaseService.updateJourneyStep(
        user.id,
        stepId,
        stepId.split('-')[0], // Extract phase from step ID - validated by supabaseService
        true, // completed
        notes,
        { 
          timeSpent: timeSpent || 0,
          completedAt: new Date().toISOString()
        }
      );
      journeyLogger.info('Step completed in Supabase', { stepId });
    } catch (error) {
      const stepError = new JourneyStepError(
        'Failed to sync step completion with Supabase',
        { userId: user.id, stepId, originalError: error }
      );
      journeyLogger.error('Failed to sync step completion with Supabase:', stepError);
      // Continue with local state - the persistence service will handle offline sync
    }
    
    // Auto-advance to next step if available
    if (engine && state.userProgress) {
      const nextStep = engine.getNextStep(stepId);
      if (nextStep && engine.isStepAvailable(nextStep.id, [...state.userProgress.completedSteps, stepId])) {
        const nextStepUpdate = { currentStepId: nextStep.id };
        dispatch({ 
          type: 'UPDATE_PROGRESS', 
          payload: nextStepUpdate 
        });
        
        // Update progress via persistence service and Supabase
        await ProgressPersistence.updateProgress(user.id, nextStepUpdate);
      }
    }
  };

  const completeChecklistItem = async (stepId: string, checklistItemId: string) => {
    if (!user) return;
    
    // Determine current state to toggle properly
    const currentStepProgress = state.userProgress?.stepProgress[stepId];
    const isCurrentlyCompleted = currentStepProgress?.completedChecklist?.includes(checklistItemId) || false;
    const newCompletedState = !isCurrentlyCompleted;
    
    dispatch({ 
      type: 'COMPLETE_CHECKLIST_ITEM', 
      payload: { stepId, checklistItemId } 
    });
    
    // Sync with Supabase (save updated checklist data)
    try {
      const updatedChecklist = currentStepProgress?.completedChecklist || [];
      const newChecklist = newCompletedState 
        ? [...updatedChecklist, checklistItemId]
        : updatedChecklist.filter(id => id !== checklistItemId);
      
      await supabaseService.updateJourneyStep(
        user.id,
        stepId,
        stepId.split('-')[0], // Extract phase from step ID - validated by supabaseService
        currentStepProgress?.status === 'completed' || false,
        currentStepProgress?.notes,
        { 
          completedChecklist: newChecklist,
          timeSpent: currentStepProgress?.timeSpent || 0
        }
      );
      journeyLogger.info('Checklist item updated in Supabase', { stepId, checklistItemId, completed: newCompletedState });
      
      // Check if this is the "receive-keys" checklist item being completed for celebration
      if (checklistItemId === 'receive-keys' && newCompletedState) {
        journeyLogger.info('🎉 Receive keys completed - triggering celebration!');
        setTimeout(() => {
          dispatch({ type: 'SHOW_CELEBRATION' });
        }, JOURNEY_CONSTANTS.CELEBRATION_DELAY); // Small delay to let the UI update first
      }
    } catch (error) {
      const stepError = new JourneyStepError(
        'Failed to sync checklist completion with Supabase',
        { userId: user.id, stepId, checklistItemId, originalError: error }
      );
      journeyLogger.error('Failed to sync checklist completion with Supabase:', stepError);
      // Continue with local state - the persistence service will handle offline sync
    }
  };

  const setCurrentStep = (stepId: string) => {
    dispatch({ 
      type: 'UPDATE_PROGRESS', 
      payload: { currentStepId: stepId } 
    });
  };

  const resetProgress = async () => {
    if (currentRegion && user) {
      journeyLogger.info('Resetting progress for user', { userId: user.id });
      
      await ProgressPersistence.resetProgress(user.id);
      const newProgress = initializeUserProgress(user.id, currentRegion);
      await ProgressPersistence.saveProgress(newProgress);
      
      // Clear progress in Supabase (we could delete records or mark them as reset)
      try {
        // For now, we'll create new records that effectively reset the progress
        await saveProgressToSupabase(newProgress);
      } catch (error) {
        const persistenceError = new JourneyPersistenceError(
          'Failed to reset progress in Supabase',
          { userId: user.id, originalError: error }
        );
        journeyLogger.error('Failed to reset progress in Supabase:', persistenceError);
      }
      
      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: newProgress 
      });
    }
  };

  const unlockAllSteps = async () => {
    journeyLogger.debug('=== UNLOCK ALL STEPS DEBUG ===');
    journeyLogger.debug('Current region:', { currentRegion });
    journeyLogger.debug('Engine exists:', { exists: !!engine });
    journeyLogger.debug('User progress exists:', { exists: !!state.userProgress });
    journeyLogger.debug('User authenticated:', { exists: !!user });
    
    // If not authenticated, create a demo journey with all steps unlocked
    if (!user) {
      journeyLogger.info('User not authenticated - creating demo journey with all steps unlocked');
      
      // Initialize demo journey if not already initialized
      if (!currentRegion) {
        journeyLogger.warn('No region selected - cannot unlock steps');
        return;
      }
      
      // Create a demo user ID
      const demoUserId = 'demo-user';
      
      // Load the journey template
      dispatch({ 
        type: 'LOAD_JOURNEY', 
        payload: { 
          template: baseJourneyTemplate, 
          regionCode: currentRegion 
        } 
      });
      
      // Create demo progress with all steps unlocked
      const demoEngine = createJourneyEngine(currentRegion);
      const allSteps = demoEngine.getAllSteps();
      const allStepIds = allSteps.map(step => step.id);
      
      const demoProgress: UserJourneyProgress = {
        userId: demoUserId,
        completedSteps: allStepIds, // Mark all steps as completed
        currentStepId: allSteps[0]?.id || '',
        currentPhaseId: 'pre-approval',
        completedChecklist: [],
        stepProgress: {},
        startedAt: new Date(),
        lastUpdated: new Date(),
        regionCode: currentRegion
      };
      
      // Save to localStorage for demo mode
      await ProgressPersistence.saveProgress(demoProgress);
      
      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: demoProgress 
      });
      
      journeyLogger.info('Demo journey created with all steps unlocked');
      return;
    }
    
    // For authenticated users, check if journey is initialized
    if (currentRegion && engine && state.userProgress) {
      // Get all steps from the journey engine
      const allSteps = engine.getAllSteps();
      const allStepIds = allSteps.map(step => step.id);
      
      journeyLogger.debug('Total steps found:', { total: allSteps.length });
      journeyLogger.debug('All step IDs:', { stepIds: allStepIds });
      journeyLogger.debug('Current completed steps:', state.userProgress.completedSteps);
      
      // Strategy: Simply mark ALL steps as completed to unlock everything
      // This is the most direct approach for a "unlock all" demo feature
      
      journeyLogger.debug('Unlocking all steps by marking all as completed');
      
      // Create unlocked progress with ALL steps completed
      const unlockedProgress = {
        ...state.userProgress,
        completedSteps: [...allStepIds], // Mark all steps as completed
        lastUpdated: new Date()
      };
      
      journeyLogger.debug('New unlocked progress (all steps completed):', unlockedProgress);
      journeyLogger.info('Unlocking all steps', {
        completedStepsBefore: state.userProgress.completedSteps.length,
        completedStepsAfter: unlockedProgress.completedSteps.length
      });
      
      // Save and update the progress
      await ProgressPersistence.saveProgress(unlockedProgress);
      
      // Also save to Supabase if user is authenticated
      if (user) {
        try {
          await saveProgressToSupabase(unlockedProgress);
          journeyLogger.info('Progress saved to Supabase');
        } catch (error) {
          const persistenceError = new JourneyPersistenceError(
            'Failed to save unlocked progress to Supabase',
            { userId: user.id, originalError: error }
          );
          journeyLogger.error('Failed to save unlocked progress to Supabase:', persistenceError);
        }
      }
      
      journeyLogger.info('Progress saved to persistence');
      
      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: unlockedProgress 
      });
      journeyLogger.debug('Dispatched UPDATE_PROGRESS action');
      
      // Additional verification
      setTimeout(() => {
        journeyLogger.debug('=== POST-UNLOCK VERIFICATION ===');
        journeyLogger.debug('State after unlock:', state.userProgress?.completedSteps);
        
        // Test several steps to see if they're available
        const testSteps = allStepIds.slice(0, 5);
        testSteps.forEach(stepId => {
          const isAvailable = engine.isStepAvailable(stepId, unlockedProgress.completedSteps);
          const isCompleted = unlockedProgress.completedSteps.includes(stepId);
          journeyLogger.debug(`Step ${stepId}: available=${isAvailable}, completed=${isCompleted}`);
        });
      }, 100);
      
    } else {
      journeyLogger.warn('Missing requirements for unlock:', {
        currentRegion: !!currentRegion,
        engine: !!engine,
        userProgress: !!state.userProgress
      });
      
      // If user is authenticated but journey not initialized, try to initialize it
      if (user && currentRegion && !state.userProgress) {
        journeyLogger.info('Attempting to initialize journey for authenticated user');
        await initializeJourney(currentRegion);
        
        // After initialization, try unlocking again
        setTimeout(() => {
          journeyLogger.info('Retrying unlock after initialization');
          unlockAllSteps();
        }, 500);
      } else {
        journeyLogger.error('Cannot unlock steps - journey not properly initialized');
      }
    }
  };

  // Utility functions
  const getStepProgress = (stepId: string): StepProgress | null => {
    return state.userProgress?.stepProgress[stepId] || null;
  };

  const isStepCompleted = (stepId: string): boolean => {
    return state.userProgress?.completedSteps.includes(stepId) || false;
  };

  const isStepAvailable = (stepId: string): boolean => {
    if (!engine || !state.userProgress) {
      return false;
    }
    return engine.isStepAvailable(stepId, state.userProgress.completedSteps);
  };

  const getNextStep = (): JourneyStep | null => {
    if (!engine || !state.userProgress?.currentStepId) return null;
    return engine.getNextStep(state.userProgress.currentStepId);
  };

  const getPreviousStep = (): JourneyStep | null => {
    if (!engine || !state.userProgress?.currentStepId) return null;
    return engine.getPreviousStep(state.userProgress.currentStepId);
  };

  const dismissCelebration = () => {
    dispatch({ type: 'DISMISS_CELEBRATION' });
  };

  const value: JourneyContextType = {
    ...state,
    engine,
    phases,
    currentPhase,
    currentStep,
    availableSteps,
    progressPercentage,
    completedStepsCount,
    totalStepsCount,
    startStep,
    completeStep,
    completeChecklistItem,
    setCurrentStep,
    resetProgress,
    unlockAllSteps,
    dismissCelebration,
    getStepProgress,
    isStepCompleted,
    isStepAvailable,
    getNextStep,
    getPreviousStep
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
}

// Custom hook to use journey context
export function useJourney(): JourneyContextType {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}

// Additional utility hooks
export function useJourneyProgress() {
  const { 
    userProgress, 
    progressPercentage, 
    completedStepsCount, 
    totalStepsCount,
    currentPhase,
    currentStep 
  } = useJourney();

  return {
    userProgress,
    progressPercentage,
    completedStepsCount,
    totalStepsCount,
    currentPhase,
    currentStep,
    isComplete: progressPercentage >= 100
  };
}

export function useCurrentStep() {
  const { 
    currentStep, 
    getStepProgress, 
    isStepCompleted, 
    isStepAvailable,
    startStep,
    completeStep,
    completeChecklistItem
  } = useJourney();

  const stepProgress = currentStep ? getStepProgress(currentStep.id) : null;

  return {
    step: currentStep,
    progress: stepProgress,
    isCompleted: currentStep ? isStepCompleted(currentStep.id) : false,
    isAvailable: currentStep ? isStepAvailable(currentStep.id) : false,
    start: () => currentStep && startStep(currentStep.id),
    complete: (notes?: string) => currentStep && completeStep(currentStep.id, notes),
    completeChecklistItem: (checklistItemId: string) => 
      currentStep && completeChecklistItem(currentStep.id, checklistItemId)
  };
}