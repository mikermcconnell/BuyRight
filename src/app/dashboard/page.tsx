'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJourney, useJourneyProgress } from '@/contexts/JourneyContext';
import { CalculatorIntegrationService } from '@/lib/calculatorIntegration';
import CalculatorWidget from '@/components/journey/CalculatorWidget';

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [calculatorInsights, setCalculatorInsights] = useState<any>(null);
  
  // Use journey context
  const { 
    engine,
    phases,
    currentStep,
    availableSteps,
    loading: journeyLoading,
    error: journeyError,
    completeStep,
    setCurrentStep,
    isStepCompleted,
    isStepAvailable,
    resetProgress,
    unlockAllSteps
  } = useJourney();
  
  const { 
    progressPercentage, 
    completedStepsCount, 
    totalStepsCount 
  } = useJourneyProgress();

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('buyright_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    // Load calculator insights
    const insights = CalculatorIntegrationService.getDashboardInsights();
    setCalculatorInsights(insights);
    
    setInitialLoading(false);
  }, []);

  if (initialLoading || journeyLoading) {
    return (
      <div className="duolingo-container">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🏠</span>
          </div>
          <p className="text-gray-700 text-lg">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (journeyError) {
    return (
      <div className="duolingo-container">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">⚠️</span>
          </div>
          <p className="text-red-700 text-lg">Error loading journey: {journeyError}</p>
        </div>
      </div>
    );
  }

  const mockUser = { email: 'demo@example.com' };
  
  // Get all steps from all phases for display with phase info
  const allStepsWithPhase = phases.flatMap(phase => 
    phase.steps.map(step => ({ ...step, phase: phase }))
  );
  
  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId);
  };

  const handleCompleteStep = (stepId: string) => {
    completeStep(stepId);
  };

  const handleResetProgress = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  // Helper function to round to nearest $1000 and format without decimals
  const formatRoundedCurrency = (amount: number) => {
    const rounded = Math.round(amount / 1000) * 1000;
    return rounded.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="duolingo-container min-h-screen py-8">
      <div className="w-full max-w-4xl">
        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <p>Current Step: {currentStep?.id || 'none'}</p>
            <p>Completed Steps: [{phases.flatMap(p => p.steps).filter(s => isStepCompleted(s.id)).map(s => s.id).join(', ')}]</p>
            <p>Available Steps: [{phases.flatMap(p => p.steps).filter(s => isStepAvailable(s.id)).map(s => s.id).join(', ')}]</p>
          </div>
        )}

        {/* Header */}
        <div className="duolingo-card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏠</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">BuyRight</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button 
                onClick={async () => {
                  console.log('🔓 Unlock button clicked');
                  await unlockAllSteps();
                  
                  // Quick verification after a short delay
                  setTimeout(() => {
                    console.log('=== UNLOCK VERIFICATION FROM DASHBOARD ===');
                    const testSteps = phases.flatMap(p => p.steps).slice(0, 5);
                    testSteps.forEach(step => {
                      const available = isStepAvailable(step.id);
                      const completed = isStepCompleted(step.id);
                      console.log(`${step.id}: available=${available}, completed=${completed}`);
                    });
                  }, 200);
                }}
                className="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                title="Unlock all journey steps for demo/testing"
              >
                <span>🔓</span>
                <span>Unlock All Steps</span>
              </button>
              
              <button 
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                title="Reset all progress"
              >
                <span>🔄</span>
                <span>Reset Progress</span>
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="duolingo-card mb-8">
          <div className="text-center">
            <h1 className="duolingo-title mb-2">
              Welcome back, {profile?.firstName || mockUser.email.split('@')[0]}! 🎉
            </h1>
            <p className="duolingo-subtitle">
              Ready to continue your home buying journey?
            </p>
            <div className="flex items-center justify-center space-x-6 mt-6">
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: 'var(--duolingo-green)' }}>
                  {completedStepsCount}/{totalStepsCount}
                </div>
                <div className="text-sm text-gray-600">Steps Complete</div>
              </div>
              <div className="text-center">
                <div className="text-xl">🏆</div>
                <div className="text-sm font-bold" style={{ color: 'var(--duolingo-green)' }}>
                  {completedStepsCount >= 3 ? 'On Fire!' : 'Building Momentum!'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Insights */}
        {calculatorInsights && (calculatorInsights.maxBudget || calculatorInsights.monthlyPayment || calculatorInsights.totalClosingCosts || calculatorInsights.totalCashRequired) && (
          <div className="duolingo-card mb-8">
            <h2 className="duolingo-title mb-6 flex items-center justify-center">
              <span className="text-2xl mr-3">💰</span>
              Your Financial Picture
            </h2>

            {/* Primary Financial Numbers */}
            {(calculatorInsights.maxBudget || calculatorInsights.totalCashRequired) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {calculatorInsights.maxBudget && (
                  <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1 whitespace-nowrap">
                      {formatRoundedCurrency(calculatorInsights.maxBudget)}
                    </div>
                    <div className="text-sm text-green-700">Maximum Home Price</div>
                  </div>
                )}
                
                {calculatorInsights.totalCashRequired && (
                  <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1 whitespace-nowrap">
                      {formatRoundedCurrency(calculatorInsights.totalCashRequired)}
                    </div>
                    <div className="text-sm text-green-700">Total Cash Required</div>
                  </div>
                )}
              </div>
            )}

            {/* Secondary Financial Numbers */}
            {(calculatorInsights.monthlyPayment || calculatorInsights.totalClosingCosts) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {calculatorInsights.monthlyPayment && (
                  <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1 whitespace-nowrap">
                      {formatRoundedCurrency(calculatorInsights.monthlyPayment)}
                    </div>
                    <div className="text-sm text-blue-700">Monthly Payment</div>
                  </div>
                )}
                
                {calculatorInsights.totalClosingCosts && (
                  <div className="bg-orange-50 rounded-lg p-4 text-center border-2 border-orange-200">
                    <div className="text-2xl font-bold text-orange-600 mb-1 whitespace-nowrap">
                      {formatRoundedCurrency(calculatorInsights.totalClosingCosts)}
                    </div>
                    <div className="text-sm text-orange-700">Closing Costs</div>
                  </div>
                )}
              </div>
            )}

            {/* Ready to Buy Status */}
            <div className={`
              p-4 rounded-lg text-center
              ${calculatorInsights.readyToBuy 
                ? 'bg-green-50 border-2 border-green-200' 
                : 'bg-yellow-50 border-2 border-yellow-200'
              }
            `}>
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">
                  {calculatorInsights.readyToBuy ? '🎉' : '⚠️'}
                </span>
                <h3 className={`text-lg font-bold ${
                  calculatorInsights.readyToBuy ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {calculatorInsights.readyToBuy ? 'Ready to Buy!' : 'Getting There...'}
                </h3>
              </div>
              
              {calculatorInsights.recommendations.length > 0 && (
                <div className="mt-3">
                  <p className={`text-sm font-medium mb-2 ${
                    calculatorInsights.readyToBuy ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    Recommendations:
                  </p>
                  <ul className={`text-sm space-y-1 ${
                    calculatorInsights.readyToBuy ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {calculatorInsights.recommendations.slice(0, 3).map((rec: string, index: number) => (
                      <li key={index} className="break-words leading-relaxed">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <button 
                onClick={() => router.push('/calculators')}
                className="px-6 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-all duration-200"
              >
                Update Calculations →
              </button>
            </div>
          </div>
        )}

        {/* Calculator CTA for new users */}
        {calculatorInsights && !calculatorInsights.maxBudget && (
          <div className="duolingo-card mb-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🧮</div>
              <h2 className="duolingo-title mb-2">Start with Your Budget</h2>
              <p className="duolingo-subtitle mb-6">
                Use our financial calculators to understand what you can afford before house hunting
              </p>
              <button 
                onClick={() => router.push('/calculators/affordability')}
                className="duolingo-button"
              >
                Calculate Affordability 🚀
              </button>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Main Progress */}
          <div className="duolingo-card">
            <h2 className="duolingo-title mb-6 flex items-center justify-center">
              <span className="text-2xl mr-3">🎯</span>
              Your Home Buying Journey
            </h2>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-700">Overall Progress</span>
                <span className="text-xl font-bold" style={{ color: 'var(--duolingo-green)' }}>
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${progressPercentage}%`,
                    backgroundColor: 'var(--duolingo-green)'
                  }}
                ></div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {allStepsWithPhase.map((stepWithPhase, index) => {
                const step = stepWithPhase;
                const isCompleted = isStepCompleted(step.id);
                const isCurrent = currentStep?.id === step.id;
                const isAvailable = isStepAvailable(step.id);
                
                
                return (
                  <div 
                    key={step.id} 
                    className={`
                      flex items-center p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-lg
                      ${isCompleted 
                        ? 'bg-green-50 border-green-200 hover:border-green-300' 
                        : isCurrent 
                          ? 'bg-green-50 border-green-200 hover:border-green-300' 
                          : isAvailable
                            ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300 cursor-not-allowed'
                      }
                    `}
                    onClick={() => {
                      if (isAvailable || isCompleted || isCurrent) {
                        router.push(`/journey/${step.phase.id}/${step.id}`);
                      }
                    }}
                  >
                    {/* Step Icon */}
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mr-4
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                          ? 'bg-green-500 text-white' 
                          : isAvailable
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-500'
                      }
                    `}>
                      {isCompleted ? (
                        <span className="text-xl">✅</span>
                      ) : isCurrent ? (
                        <span className="text-xl">🎯</span>
                      ) : isAvailable ? (
                        <span className="text-lg font-bold">{index + 1}</span>
                      ) : (
                        <span className="text-lg font-bold text-gray-400">🔒</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-1 ${
                        isCompleted ? 'text-green-700' : 
                        isCurrent ? 'text-green-700' : 
                        isAvailable ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        {isCompleted && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                            COMPLETE
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                            CURRENT
                          </span>
                        )}
                        {isAvailable && !isCurrent && !isCompleted && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
                            READY
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {step.estimatedDuration}
                        </span>
                      </div>
                    </div>

                    {/* Action Indicator */}
                    {(isAvailable || isCompleted || isCurrent) && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">
                          Click to {isCompleted ? 'review' : isCurrent ? 'continue' : 'start'}
                        </span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Goal Section */}
          {currentStep && (
            <div className="duolingo-card">
              <div className="text-center">
                <h3 className="duolingo-title mb-4">
                  🏆 Current Goal
                </h3>
                <div className="text-4xl mb-3">🎯</div>
                <div className="text-lg font-bold text-gray-700 mb-2">
                  {currentStep.title}
                </div>
                <p className="text-gray-600 mb-4">
                  {currentStep.description}
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  Estimated time: {currentStep.estimatedDuration}
                </div>
                <button 
                  onClick={() => handleCompleteStep(currentStep.id)}
                  className="duolingo-button"
                >
                  Let&apos;s Go! 🚀
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Reset All Progress?
                </h3>
                <p className="text-gray-600 mb-6">
                  This will permanently delete all your progress and completed steps. You&apos;ll start from the beginning of your home buying journey.
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleResetProgress}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Reset Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}