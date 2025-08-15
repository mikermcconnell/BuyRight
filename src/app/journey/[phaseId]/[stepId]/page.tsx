'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJourney, useJourneyProgress, useCurrentStep } from '@/contexts/JourneyContext';
import { JourneyStep, JourneyPhase, ChecklistItem } from '@/types/regional';
import CalculatorWidget from '@/components/journey/CalculatorWidget';
import { CalculatorIntegrationService } from '@/lib/calculatorIntegration';

export default function StepDetailPage() {
  const params = useParams();
  const router = useRouter();
  const phaseId = params.phaseId as string;
  const stepId = params.stepId as string;
  
  const {
    phases,
    loading,
    error,
    completeChecklistItem,
    getNextStep,
    getPreviousStep,
    getStepProgress
  } = useJourney();
  
  const { step, progress, isCompleted, complete } = useCurrentStep();
  const [currentStep, setCurrentStep] = useState<JourneyStep | null>(null);
  const [currentPhase, setCurrentPhase] = useState<JourneyPhase | null>(null);
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);

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
    const nextStep = getNextStep();
    if (nextStep) {
      router.push(`/journey/${phaseId}/${nextStep.id}`);
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

  const nextStep = getNextStep();
  const previousStep = getPreviousStep();

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
                Checklist
              </h2>
              <span className="text-lg font-bold" style={{ color: 'var(--duolingo-green)' }}>
                {Math.round(checklistProgress)}%
              </span>
            </div>

            {/* Checklist Progress Bar */}
            <div className="mb-6">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${checklistProgress}%`,
                    backgroundColor: 'var(--duolingo-green)'
                  }}
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
                      
                      {/* Special link for compare-rates item */}
                      {item.id === 'compare-rates' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/resources/interest-rates');
                            }}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>📊</span>
                            <span>Complete Rate Comparison Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for understand-mortgage-types item */}
                      {item.id === 'understand-mortgage-types' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/mortgage-types');
                            }}
                            className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>📖</span>
                            <span>Read Complete Mortgage Types Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for use-mortgage-calculator item */}
                      {item.id === 'use-mortgage-calculator' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/calculators/mortgage');
                            }}
                            className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>🧮</span>
                            <span>Open Mortgage Calculator</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for check-first-time-programs item */}
                      {item.id === 'check-first-time-programs' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/first-time-buyer-programs');
                            }}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>🏠</span>
                            <span>View First-Time Buyer Programs Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for gather-documents item */}
                      {item.id === 'gather-documents' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/pre-approval-documents');
                            }}
                            className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>📋</span>
                            <span>View Complete Document Checklist</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for reach-out-to-agents item */}
                      {item.id === 'reach-out-to-agents' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/selecting-real-estate-agent');
                            }}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>🏘️</span>
                            <span>Agent Selection Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for define-criteria item */}
                      {item.id === 'define-criteria' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/property-features-priority');
                            }}
                            className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>⭐</span>
                            <span>Property Priority Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for diy-market-research item */}
                      {item.id === 'diy-market-research' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/diy-market-research');
                            }}
                            className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>📊</span>
                            <span>DIY Research Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for tour-homes item */}
                      {item.id === 'tour-homes' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/property-features-priority#scoring');
                            }}
                            className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>⭐</span>
                            <span>Property Scoring Tool</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for assess-property-value item */}
                      {item.id === 'assess-property-value' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/property-value-assessment');
                            }}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>💰</span>
                            <span>Property Value Assessment Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for determine-offer-price item */}
                      {item.id === 'determine-offer-price' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/offer-negotiation-strategy');
                            }}
                            className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>🤝</span>
                            <span>Offer Strategy Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for include-conditions item */}
                      {item.id === 'include-conditions' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/offer-conditions');
                            }}
                            className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>🛡️</span>
                            <span>Conditions Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for submit-offer item */}
                      {item.id === 'submit-offer' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/offer-submission-timeline');
                            }}
                            className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>⏰</span>
                            <span>Timeline Guide</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for test-utilities item */}
                      {item.id === 'test-utilities' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/final-walkthrough-checklist');
                            }}
                            className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>✅</span>
                            <span>Walkthrough Checklist</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Special link for attend-inspection item */}
                      {item.id === 'attend-inspection' && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/guides/home-inspection-questions');
                            }}
                            className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>👁️</span>
                            <span>Inspection Questions Guide</span>
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
                  {resource.type === 'guide' ? (
                    // Guide-type resources that link to separate pages
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
                  ) : (
                    // Regular resources (calculators, links, etc.)
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-1">{resource.title}</h3>
                      <p className="text-sm text-blue-700 mb-2">{resource.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {resource.type}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {resource.category}
                        </span>
                      </div>
                      {(resource as any).url && (
                        <div className="mt-3">
                          <a 
                            href={(resource as any).url} 
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1"
                          >
                            <span>Open {resource.type}</span>
                            <span>→</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
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
                  {!stepReadyForCompletion 
                    ? (checklistProgress < 100 
                        ? 'Complete Checklist First' 
                        : hasRequiredCalculators && !calculatorsComplete 
                          ? 'Complete Required Calculators' 
                          : 'Complete Requirements First'
                      )
                    : 'Complete Step 🎉'
                  }
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
        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              if (previousStep) {
                router.push(`/journey/${phaseId}/${previousStep.id}`);
              } else {
                router.push('/dashboard');
              }
            }}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
          >
            ← {previousStep ? 'Previous Step' : 'Back to Dashboard'}
          </button>
          
          {nextStep ? (
            <button
              onClick={() => router.push(`/journey/${phaseId}/${nextStep.id}`)}
              className="px-6 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-all duration-200"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
            >
              Back to Dashboard →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}