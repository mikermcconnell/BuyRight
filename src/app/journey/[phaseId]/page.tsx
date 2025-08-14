'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJourney, useJourneyProgress } from '@/contexts/JourneyContext';
import { JourneyPhase, JourneyStep } from '@/types/regional';

export default function JourneyPhasePage() {
  const params = useParams();
  const router = useRouter();
  const phaseId = params.phaseId as string;
  
  const {
    phases,
    currentStep,
    loading,
    error,
    setCurrentStep,
    completeStep,
    isStepCompleted,
    isStepAvailable
  } = useJourney();
  
  const { progressPercentage, completedStepsCount, totalStepsCount } = useJourneyProgress();
  
  const [currentPhase, setCurrentPhase] = useState<JourneyPhase | null>(null);
  const [phaseSteps, setPhaseSteps] = useState<JourneyStep[]>([]);

  useEffect(() => {
    const phase = phases.find(p => p.id === phaseId);
    if (phase) {
      setCurrentPhase(phase);
      setPhaseSteps(phase.steps);
    } else if (!loading) {
      // Phase not found, redirect to dashboard
      router.push('/dashboard');
    }
  }, [phases, phaseId, loading, router]);

  if (loading) {
    return (
      <div className="duolingo-container">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🏠</span>
          </div>
          <p className="text-gray-700 text-lg">Loading phase...</p>
        </div>
      </div>
    );
  }

  if (error || !currentPhase) {
    return (
      <div className="duolingo-container">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">⚠️</span>
          </div>
          <p className="text-red-700 text-lg">
            {error || 'Phase not found'}
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

  const handleStepClick = (stepId: string) => {
    router.push(`/journey/${phaseId}/${stepId}`);
  };

  const phaseProgress = phaseSteps.length > 0 
    ? (phaseSteps.filter(step => isStepCompleted(step.id)).length / phaseSteps.length) * 100 
    : 0;

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
              Dashboard
            </button>
            <span>→</span>
            <span className="text-gray-600">Journey</span>
            <span>→</span>
            <span className="text-gray-800 font-medium">{currentPhase.title}</span>
          </div>
        </nav>

        {/* Phase Header */}
        <div className="duolingo-card mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{currentPhase.icon}</div>
            <h1 className="duolingo-title mb-2">{currentPhase.title}</h1>
            <p className="duolingo-subtitle mb-6">{currentPhase.description}</p>
            
            {/* Phase Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-700">Phase Progress</span>
                <span className="text-xl font-bold" style={{ color: 'var(--duolingo-green)' }}>
                  {Math.round(phaseProgress)}%
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${phaseProgress}%`,
                    backgroundColor: 'var(--duolingo-green)'
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <span>Duration: {currentPhase.estimatedDuration}</span>
                <span>
                  {phaseSteps.filter(step => isStepCompleted(step.id)).length} / {phaseSteps.length} steps complete
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Steps */}
        <div className="duolingo-card">
          <h2 className="duolingo-title mb-6 flex items-center justify-center">
            <span className="text-2xl mr-3">📋</span>
            Steps in This Phase
          </h2>

          <div className="space-y-4">
            {phaseSteps.map((step, index) => {
              const isCompleted = isStepCompleted(step.id);
              const isCurrent = currentStep?.id === step.id;
              const isAvailable = isStepAvailable(step.id);
              
              return (
                <div key={step.id} className={`
                  flex items-center p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md
                  ${isCompleted 
                    ? 'bg-green-50 border-green-200 hover:border-green-300' 
                    : isCurrent 
                      ? 'bg-green-50 border-green-200 hover:border-green-300' 
                      : isAvailable
                        ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
                        : 'bg-gray-50 border-gray-200'
                  }
                `}>
                  {/* Step Icon */}
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0
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
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-bold mb-1 ${
                      isCompleted ? 'text-green-700' : 
                      isCurrent ? 'text-green-700' : 
                      isAvailable ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
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

                  {/* Action Arrow */}
                  {(isAvailable || isCompleted) && (
                    <div 
                      onClick={() => handleStepClick(step.id)}
                      className="ml-4 flex-shrink-0"
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110
                        ${isCompleted || isCurrent ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                      `}>
                        <span className="text-sm font-bold">→</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
          >
            ← Back to Dashboard
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
          >
            Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}