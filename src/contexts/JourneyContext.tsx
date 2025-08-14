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
      console.log('UPDATE_PROGRESS: completed steps before/after:', 
                  state.userProgress?.completedSteps?.length, '→', action.payload?.completedSteps?.length);
      
      // Handle initial userProgress setup (when state.userProgress is null)
      if (!state.userProgress) {
        return {
          ...state,
          userProgress: {
            ...action.payload,
            lastUpdated: new Date()
          }
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
  error: null
};

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

interface JourneyProviderProps {
  children: ReactNode;
}

export function JourneyProvider({ children }: JourneyProviderProps) {
  const [state, dispatch] = useReducer(journeyReducer, initialState);
  const { currentRegion } = useRegional();

  // Initialize journey when region is loaded
  useEffect(() => {
    if (currentRegion) {
      initializeJourney(currentRegion);
    }
  }, [currentRegion]);

  const initializeJourney = async (regionCode: RegionCode) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Load the journey template
      dispatch({ 
        type: 'LOAD_JOURNEY', 
        payload: { 
          template: baseJourneyTemplate, 
          regionCode 
        } 
      });

      // Load or create user progress using enhanced persistence
      let userProgress = await ProgressPersistence.loadProgress('demo-user');
      
      if (!userProgress || userProgress.regionCode !== regionCode) {
        // Create new progress for this region
        userProgress = initializeUserProgress('demo-user', regionCode);
        await ProgressPersistence.saveProgress(userProgress);
      }

      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: userProgress 
      });

    } catch (error) {
      console.error('Failed to initialize journey:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to initialize journey' 
      });
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
    dispatch({ type: 'START_STEP', payload: { stepId } });
    
    // Sync with step API
    try {
      await JourneyApi.steps.startStep('demo-user', stepId);
    } catch (error) {
      console.error('Failed to sync step start with API:', error);
      // Continue with local state - the persistence service will handle offline sync
    }
  };

  const completeStep = async (stepId: string, notes?: string, timeSpent?: number) => {
    dispatch({ type: 'COMPLETE_STEP', payload: { stepId, notes } });
    
    // Call step completion API in background
    try {
      await JourneyApi.steps.completeStep('demo-user', stepId, notes, timeSpent);
    } catch (error) {
      console.error('Failed to sync step completion with API:', error);
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
        
        // Update progress via persistence service
        await ProgressPersistence.updateProgress('demo-user', nextStepUpdate);
      }
    }
  };

  const completeChecklistItem = async (stepId: string, checklistItemId: string) => {
    // Determine current state to toggle properly
    const currentStepProgress = state.userProgress?.stepProgress[stepId];
    const isCurrentlyCompleted = currentStepProgress?.completedChecklist?.includes(checklistItemId) || false;
    const newCompletedState = !isCurrentlyCompleted;
    
    dispatch({ 
      type: 'COMPLETE_CHECKLIST_ITEM', 
      payload: { stepId, checklistItemId } 
    });
    
    // Sync with checklist API
    try {
      await JourneyApi.checklist.updateChecklistItem('demo-user', stepId, checklistItemId, newCompletedState);
    } catch (error) {
      console.error('Failed to sync checklist completion with API:', error);
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
    if (currentRegion) {
      await ProgressPersistence.resetProgress('demo-user');
      const newProgress = initializeUserProgress('demo-user', currentRegion);
      await ProgressPersistence.saveProgress(newProgress);
      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: newProgress 
      });
    }
  };

  const unlockAllSteps = async () => {
    console.log('=== UNLOCK ALL STEPS DEBUG ===');
    console.log('Current region:', currentRegion);
    console.log('Engine exists:', !!engine);
    console.log('User progress exists:', !!state.userProgress);
    
    if (currentRegion && engine && state.userProgress) {
      // Get all steps from the journey engine
      const allSteps = engine.getAllSteps();
      const allStepIds = allSteps.map(step => step.id);
      
      console.log('Total steps found:', allSteps.length);
      console.log('All step IDs:', allStepIds);
      console.log('Current completed steps:', state.userProgress.completedSteps);
      
      // Strategy: Recursively mark prerequisites as completed until all steps are available
      // This ensures we complete the minimum number of steps to unlock everything
      
      const completedSteps = new Set([...state.userProgress.completedSteps]);
      let changed = true;
      let iterations = 0;
      const maxIterations = 20; // Safety limit
      
      // Keep adding prerequisite steps until all steps are unlocked or we hit the limit
      while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;
        
        console.log(`Unlock iteration ${iterations}:`);
        
        for (const step of allSteps) {
          if (!engine.isStepAvailable(step.id, Array.from(completedSteps))) {
            // This step is not available, mark its prerequisites as completed
            if (step.prerequisites) {
              for (const prereqId of step.prerequisites) {
                if (!completedSteps.has(prereqId)) {
                  console.log(`  - Marking prerequisite ${prereqId} as completed to unlock ${step.id}`);
                  completedSteps.add(prereqId);
                  changed = true;
                }
              }
            }
          }
        }
        
        console.log(`  Total completed after iteration ${iterations}:`, completedSteps.size);
      }
      
      console.log('Final completed steps for unlock:', Array.from(completedSteps));
      
      // Create unlocked progress with minimal completed steps
      const unlockedProgress = {
        ...state.userProgress,
        completedSteps: Array.from(completedSteps),
        lastUpdated: new Date()
      };
      
      console.log('New unlocked progress (prerequisites only):', unlockedProgress);
      console.log('Completed steps before:', state.userProgress.completedSteps.length);
      console.log('Completed steps after:', unlockedProgress.completedSteps.length);
      
      // Save and update the progress
      await ProgressPersistence.saveProgress(unlockedProgress);
      console.log('Progress saved to persistence');
      
      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: unlockedProgress 
      });
      console.log('Dispatched UPDATE_PROGRESS action');
      
      // Additional verification
      setTimeout(() => {
        console.log('=== POST-UNLOCK VERIFICATION ===');
        console.log('State after unlock:', state.userProgress?.completedSteps);
        
        // Test several steps to see if they're available
        const testSteps = allStepIds.slice(0, 5);
        testSteps.forEach(stepId => {
          const isAvailable = engine.isStepAvailable(stepId, unlockedProgress.completedSteps);
          const isCompleted = unlockedProgress.completedSteps.includes(stepId);
          console.log(`Step ${stepId}: available=${isAvailable}, completed=${isCompleted}`);
        });
      }, 100);
      
    } else {
      console.log('Missing requirements for unlock:');
      console.log('- currentRegion:', currentRegion);
      console.log('- engine:', !!engine);
      console.log('- state.userProgress:', !!state.userProgress);
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