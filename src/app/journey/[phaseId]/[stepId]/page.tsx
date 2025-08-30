'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJourney, useJourneyProgress, useCurrentStep } from '@/contexts/JourneyContext';
import { JourneyStep, JourneyPhase, ChecklistItem } from '@/types/regional';
import CalculatorWidget from '@/components/journey/CalculatorWidget';
import MobileStepNavigation from '@/components/journey/MobileStepNavigation';
import { MobileGestureProvider } from '@/components/journey/MobileGestureProvider';
import { CalculatorIntegrationService } from '@/lib/calculatorIntegration';
import JourneyCelebration from '@/components/celebration/JourneyCelebration';

// Checklist item guide mappings - data-driven approach to avoid repetition
const CHECKLIST_GUIDE_LINKS: Record<string, { path: string; icon: string; label: string; color: string }> = {
  'compare-rates': { 
    path: '/resources/interest-rates', 
    icon: '📊', 
    label: 'Complete Rate Comparison Guide', 
    color: 'blue' 
  },
  'understand-mortgage-types': { 
    path: '/guides/mortgage-types', 
    icon: '📖', 
    label: 'Read Complete Mortgage Types Guide', 
    color: 'green' 
  },
  'use-mortgage-calculator': { 
    path: '/calculators/mortgage', 
    icon: '🧮', 
    label: 'Open Mortgage Calculator', 
    color: 'purple' 
  },
  'check-first-time-programs': { 
    path: '/guides/first-time-buyer-programs', 
    icon: '🏠', 
    label: 'View First-Time Buyer Programs Guide', 
    color: 'blue' 
  },
  'gather-documents': { 
    path: '/guides/pre-approval-documents', 
    icon: '📋', 
    label: 'View Complete Document Checklist', 
    color: 'green' 
  },
  'reach-out-to-agents': { 
    path: '/guides/selecting-real-estate-agent', 
    icon: '🏘️', 
    label: 'Agent Selection Guide', 
    color: 'blue' 
  },
  'define-criteria': { 
    path: '/guides/property-features-priority', 
    icon: '⭐', 
    label: 'Property Priority Guide', 
    color: 'purple' 
  },
  'diy-market-research': { 
    path: '/guides/diy-market-research', 
    icon: '📊', 
    label: 'DIY Research Guide', 
    color: 'orange' 
  },
  'tour-homes': { 
    path: '/guides/property-features-priority#scoring', 
    icon: '⭐', 
    label: 'Property Scoring Tool', 
    color: 'green' 
  },
  'assess-property-value': { 
    path: '/guides/property-value-assessment', 
    icon: '💰', 
    label: 'Property Value Assessment Guide', 
    color: 'blue' 
  },
  'determine-offer-price': { 
    path: '/guides/offer-negotiation-strategy', 
    icon: '🤝', 
    label: 'Offer Strategy Guide', 
    color: 'green' 
  },
  'include-conditions': { 
    path: '/guides/offer-conditions', 
    icon: '🛡️', 
    label: 'Conditions Guide', 
    color: 'purple' 
  },
  'submit-offer': { 
    path: '/guides/offer-submission-timeline', 
    icon: '⏰', 
    label: 'Timeline Guide', 
    color: 'red' 
  },
  'test-utilities': { 
    path: '/guides/final-walkthrough-checklist', 
    icon: '✅', 
    label: 'Walkthrough Checklist', 
    color: 'green' 
  },
  'attend-inspection': { 
    path: '/guides/home-inspection-questions', 
    icon: '👁️', 
    label: 'Inspection Questions Guide', 
    color: 'orange' 
  }
};

// Helper function to get button text based on completion status
const getCompletionButtonText = (
  isReady: boolean,
  checklistProgress: number,
  hasRequiredCalcs: boolean | undefined,
  calcsComplete: boolean
): string => {
  if (isReady) return 'Complete Step 🎉';
  if (checklistProgress < 100) return 'Complete Checklist First';
  if (hasRequiredCalcs && !calcsComplete) return 'Complete Required Calculators';
  return 'Complete Requirements First';
};

// Style constants to avoid inline style repetition
const DUOLINGO_STYLES = {
  greenText: { color: 'var(--duolingo-green)' },
  progressBar: (progress: number) => ({
    width: `${progress}%`,
    backgroundColor: 'var(--duolingo-green)'
  })
};

export default function StepDetailPage() {
  const params = useParams();
  const router = useRouter();
  const phaseId = params.phaseId as string;
  const stepId = params.stepId as string;
  
  const {
    engine,
    phases,
    loading,
    error,
    completeChecklistItem,
    getNextStep,
    getPreviousStep,
    getStepProgress,
    showCelebration,
    dismissCelebration
  } = useJourney();
  
  const { step, progress, isCompleted, complete } = useCurrentStep();
  const [currentStep, setCurrentStep] = useState<JourneyStep | null>(null);
  const [currentPhase, setCurrentPhase] = useState<JourneyPhase | null>(null);
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Find the step in the phases
    let foundStep: JourneyStep | null = null;
    let foundPhase: JourneyPhase | null = null;
    
    for (const phase of phases) {
      const stepInPhase = phase.steps.find(s => s.id === stepId);
      if (stepInPhase && phase.id === phaseId) {
        foundStep = stepInPhase;
        foundPhase = phase;
        break;
      }
    }
    
    if (foundStep && foundPhase) {
      setCurrentStep(foundStep);
      setCurrentPhase(foundPhase);
      
      // Set start time if not already started
      if (!progress?.startedAt && !startTime) {
        setStartTime(new Date());
      }
    } else if (!loading) {
      // Step not found, redirect to dashboard
      router.push('/dashboard');
    }
  }, [phases, phaseId, stepId, loading, router, progress, startTime]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileView(isMobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="duolingo-container">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🏠</span>
          </div>
          <p className="text-gray-700 text-lg">Loading step...</p>
        </div>
      </div>
    );
  }

  if (error || !currentStep || !currentPhase) {
    return (
      <div className="duolingo-container">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">⚠️</span>
          </div>
          <p className="text-red-700 text-lg">
            {error || 'Step not found'}
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="duolingo-button mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleCompleteStep = async () => {
    if (!currentStep) return;
    
    const timeSpent = startTime 
      ? Math.round((new Date().getTime() - startTime.getTime()) / 60000) // minutes
      : progress?.timeSpent || 0;
    
    await complete(notes || undefined);
    
    // Navigate to next step or back to dashboard
    const nextStepAfterComplete = currentStep ? engine?.getNextStep(currentStep.id) || null : null;
    if (nextStepAfterComplete) {
      router.push(`/journey/${nextStepAfterComplete.phaseId}/${nextStepAfterComplete.id}`);
    } else {
      router.push('/dashboard');
    }
  };

  const handleChecklistToggle = async (checklistItemId: string) => {
    try {
      await completeChecklistItem(currentStep.id, checklistItemId);
    } catch (error) {
      console.error('Error in handleChecklistToggle:', error);
    }
  };

  // Get the correct step progress for this specific step
  const stepProgress = currentStep ? getStepProgress(currentStep.id) : null;
  const completedChecklistItems = stepProgress?.completedChecklist || [];
  
  const checklistProgress = currentStep.checklist.length > 0 
    ? (completedChecklistItems.length / currentStep.checklist.length) * 100 
    : 100;
  
  // Check calculator completion for this step
  const calculatorProgress = CalculatorIntegrationService.getStepCalculationProgress(currentStep.id);
  const hasRequiredCalculators = CalculatorIntegrationService.getCalculatorsForStep(currentStep.id)?.required;
  const calculatorsComplete = CalculatorIntegrationService.isStepCalculationComplete(currentStep.id);
  
  // Overall step readiness
  const stepReadyForCompletion = checklistProgress >= 100 && (!hasRequiredCalculators || calculatorsComplete);

  // Get next/previous steps based on the currently viewed step, not user progress
  const nextStep = currentStep ? engine?.getNextStep(currentStep.id) || null : null;
  const previousStep = currentStep ? engine?.getPreviousStep(currentStep.id) || null : null;
  
  // Debug navigation info
  if (currentStep && process.env.NODE_ENV === 'development') {
    console.log('Navigation Debug:', {
      currentStepId: currentStep.id,
      currentStepTitle: currentStep.title,
      previousStepId: previousStep?.id,
      previousStepTitle: previousStep?.title,
      nextStepId: nextStep?.id,
      nextStepTitle: nextStep?.title
    });
  }

  // Check if next step is in a different phase
  const getNextPhaseInfo = () => {
    if (!nextStep || !currentPhase) return null;
    
    const nextStepPhase = phases.find(phase => 
      phase.steps.some(step => step.id === nextStep.id)
    );
    
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Current step:', currentStep?.id);
      console.log('Current phase:', currentPhase.id, currentPhase.title);
      console.log('Next step:', nextStep.id, nextStep.title);
      console.log('Next step phase:', nextStepPhase?.id, nextStepPhase?.title);
    }
    
    if (nextStepPhase && nextStepPhase.id !== currentPhase.id) {
      return {
        phase: nextStepPhase,
        isNewPhase: true
      };
    }
    
    return null;
  };

  const nextPhaseInfo = getNextPhaseInfo();

  return (
    <MobileGestureProvider initialConfig={{ hapticFeedback: false }}>
      <div className="duolingo-container min-h-screen py-8">
        <div className="w-full max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => router.push('/dashboard')}
              className="hover:text-green-600 transition-colors"
            >
              Journey
            </button>
            <span>→</span>
            <span className="text-gray-800 font-medium">{currentStep.title}</span>
          </div>
        </nav>

        {/* Step Header */}
        <div className="duolingo-card mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mr-4
                ${isCompleted ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}
              `}>
                {isCompleted ? (
                  <span className="text-2xl">✅</span>
                ) : (
                  <span className="text-2xl">🎯</span>
                )}
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{currentStep.title}</h1>
                <p className="text-gray-600">{currentPhase.title} Phase</p>
              </div>
            </div>
            
            <p className="duolingo-subtitle mb-6">{currentStep.description}</p>
            
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-600 flex-wrap gap-2">
              <div className="flex items-center space-x-1">
                <span>⏱️</span>
                <span>{currentStep.estimatedDuration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>📝</span>
                <span>{currentStep.checklist.length} checklist items</span>
              </div>
              {currentStep.isOptional && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <span>⭐</span>
                  <span>Optional</span>
                </div>
              )}
              {isCompleted && (
                <div className="flex items-center space-x-1 text-green-600">
                  <span>✅</span>
                  <span>Completed</span>
                </div>
              )}
            </div>

            {/* Prerequisites */}
            {currentStep.prerequisites && currentStep.prerequisites.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h4>
                <div className="text-sm text-gray-600">
                  <p>Complete these steps first: {currentStep.prerequisites.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calculator Widget */}
        <CalculatorWidget stepId={currentStep.id} />

        {/* Checklist */}
        {currentStep.checklist.length > 0 && (
          <div className="duolingo-card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="duolingo-title flex items-center">
                <span className="text-2xl mr-3">✅</span>
                Let's Check These Off!
              </h2>
              <span className="text-lg font-bold" style={DUOLINGO_STYLES.greenText}>
                {Math.round(checklistProgress)}% Done
              </span>
            </div>

            {/* Checklist Progress Bar */}
            <div className="mb-6">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={DUOLINGO_STYLES.progressBar(checklistProgress)}
                ></div>
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                {completedChecklistItems.length} / {currentStep.checklist.length} items completed
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {currentStep.checklist.map((item: ChecklistItem) => {
                const isCompleted = completedChecklistItems.includes(item.id);
                
                return (
                  <div 
                    key={item.id}
                    className={`
                      flex items-start p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                      ${isCompleted 
                        ? 'bg-green-50 border-green-200 hover:border-green-300' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => handleChecklistToggle(item.id)}
                  >
                    <div className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center mr-3 mt-0.5 transition-all duration-200
                      ${isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-400'
                      }
                    `}>
                      {isCompleted && <span className="text-sm font-bold">✓</span>}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-medium mb-1 ${
                        isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Guide link for checklist items - clean data-driven approach */}
                      {CHECKLIST_GUIDE_LINKS[item.id] && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(CHECKLIST_GUIDE_LINKS[item.id].path);
                            }}
                            className={`text-xs bg-${CHECKLIST_GUIDE_LINKS[item.id].color}-100 hover:bg-${CHECKLIST_GUIDE_LINKS[item.id].color}-200 text-${CHECKLIST_GUIDE_LINKS[item.id].color}-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1`}
                          >
                            <span>{CHECKLIST_GUIDE_LINKS[item.id].icon}</span>
                            <span>{CHECKLIST_GUIDE_LINKS[item.id].label}</span>
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-2">
                        {item.estimatedTime && (
                          <span className="text-xs text-gray-500">
                            {item.estimatedTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Resources */}
        {currentStep.resources && currentStep.resources.length > 0 && (
          <div className="duolingo-card mb-8" data-section="resources">
            <h2 className="duolingo-title mb-6 flex items-center">
              <span className="text-2xl mr-3">📚</span>
              Resources
            </h2>
            
            <div className="space-y-4">
              {currentStep.resources.map((resource, index) => (
                <div key={index}>
                  {/* All resources get the same handling now since 'guide' type doesn't exist */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-bold text-green-900 mb-1 flex items-center">
                      <span className="text-xl mr-2">📖</span>
                      {resource.title}
                    </h3>
                    <p className="text-sm text-green-700 mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          {resource.type}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          {resource.category}
                          </span>
                        </div>
                        {(resource as any).url && (
                          <a 
                            href={(resource as any).url} 
                            className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                          >
                            <span>Read Guide</span>
                            <span>📖</span>
                          </a>
                        )}
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        {currentStep.tips && currentStep.tips.length > 0 && (
          <div className="duolingo-card mb-8">
            <h2 className="duolingo-title mb-6 flex items-center">
              <span className="text-2xl mr-3">💡</span>
              Tips & Best Practices
            </h2>
            
            <div className="space-y-3">
              {currentStep.tips.map((tip, index) => (
                <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-yellow-600 mr-3 text-lg flex-shrink-0">💡</span>
                    <p className="text-yellow-800 text-sm leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings Section */}
        {currentStep.warnings && currentStep.warnings.length > 0 && (
          <div className="duolingo-card mb-8">
            <h2 className="duolingo-title mb-6 flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              Important Warnings
            </h2>
            
            <div className="space-y-3">
              {currentStep.warnings.map((warning, index) => (
                <div key={index} className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-red-600 mr-3 text-lg flex-shrink-0">⚠️</span>
                    <p className="text-red-800 text-sm font-medium leading-relaxed">{warning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="duolingo-card mb-8">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">📝</span>
            Your Notes
          </h2>
          
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your personal notes about this step..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={4}
          />
          
          <p className="text-sm text-gray-500 mt-2">
            💾 Your notes will be saved when you complete this step
          </p>
        </div>

        {/* Action Buttons */}
        <div className="duolingo-card">
          <div className="text-center">
            {!isCompleted ? (
              <>
                <button 
                  onClick={handleCompleteStep}
                  disabled={!stepReadyForCompletion}
                  className={`
                    duolingo-button text-lg px-8 py-3 mb-4
                    ${!stepReadyForCompletion ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {getCompletionButtonText(
                    stepReadyForCompletion,
                    checklistProgress,
                    hasRequiredCalculators,
                    calculatorsComplete
                  )}
                </button>
                
                {/* Next Phase Information */}
                {stepReadyForCompletion && nextPhaseInfo && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-2xl mr-2">{nextPhaseInfo.phase.icon}</span>
                      <h4 className="font-semibold text-blue-900">Next: {nextPhaseInfo.phase.title}</h4>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">{nextPhaseInfo.phase.description}</p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-blue-600">
                      <span className="flex items-center">
                        <span className="mr-1">⏱️</span>
                        {nextPhaseInfo.phase.estimatedDuration}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">📋</span>
                        {nextPhaseInfo.phase.steps.length} steps
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold text-green-700 mb-2">Step Completed!</h3>
                <p className="text-gray-600">Great work! You've finished this step.</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 gap-4">
          {previousStep ? (
            <div className="flex flex-col items-start">
              <button
                onClick={() => {
                  console.log('Navigating to previous step:', {
                    from: currentStep?.id,
                    to: previousStep.id,
                    toPhase: previousStep.phaseId
                  });
                  router.push(`/journey/${previousStep.phaseId}/${previousStep.id}`);
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-200"
              >
                ← Previous Step
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Previous: {previousStep.title}
              </p>
            </div>
          ) : (
            <button
              onClick={() => {
                console.log('No previous step, going to dashboard');
                router.push('/dashboard');
              }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-200"
            >
              ← First Step
            </button>
          )}
          
          <button
            onClick={() => {
              console.log('Navigating to dashboard');
              router.push('/dashboard');
            }}
            className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-all duration-200"
          >
            🏠 Dashboard
          </button>
          
          {nextStep ? (
            <div className="flex flex-col items-end">
              <button
                onClick={() => {
                  console.log('Navigating to next step:', {
                    from: currentStep?.id,
                    to: nextStep.id,
                    toPhase: nextStep.phaseId
                  });
                  router.push(`/journey/${nextStep.phaseId}/${nextStep.id}`);
                }}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200"
              >
                Next Step →
              </button>
              <p className="text-xs text-gray-500 mt-1 text-right">
                Next: {nextStep.title}
              </p>
            </div>
          ) : (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200"
            >
              Complete Journey →
            </button>
          )}
        </div>
        
        {/* Mobile Step Navigation */}
        {isMobileView && currentStep && (
          <MobileStepNavigation 
            currentStepId={stepId}
            enableGestures={true}
            showMiniMap={true}
            autoHide={true}
          />
        )}
      </div>
    </div>
    
    {/* Journey Completion Celebration */}
    <JourneyCelebration 
      isVisible={showCelebration}
      onClose={dismissCelebration}
      stepTitle={currentStep?.title || 'Closing Day'}
    />
    </MobileGestureProvider>
  );
}