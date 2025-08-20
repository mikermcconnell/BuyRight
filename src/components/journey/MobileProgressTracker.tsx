'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useJourney, useJourneyProgress } from '@/contexts/JourneyContext';
import { JourneyStep, JourneyPhase } from '@/types/regional';
import { UI_CONSTANTS } from '@/lib/constants';

interface MobileProgressTrackerProps {
  showDetailed?: boolean;
  enableGestures?: boolean;
  compactMode?: boolean;
}

interface StepCardProps {
  step: JourneyStep;
  phase: JourneyPhase;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isAvailable: boolean;
  onClick: () => void;
  enableGestures: boolean;
}

function StepCard({ step, phase, index, isActive, isCompleted, isAvailable, onClick, enableGestures }: StepCardProps) {
  const [panX, setPanX] = useState(0);
  
  const handlePan = (event: any, info: PanInfo) => {
    if (!enableGestures) return;
    
    const { offset } = info;
    setPanX(offset.x);
    
    // Add haptic feedback for significant swipes
    if (Math.abs(offset.x) > 100 && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    if (!enableGestures) return;
    
    const { offset, velocity } = info;
    
    // Reset position
    setPanX(0);
    
    // Quick swipe detection
    const swipeThreshold = 50;
    const velocityThreshold = 500;
    
    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
      if (offset.x > 0) {
        // Swiped right - mark as complete or show details
        if (isAvailable && !isCompleted) {
          onClick();
        }
      } else {
        // Swiped left - navigate or skip
        onClick();
      }
    }
  };

  const getStepIcon = () => {
    if (isCompleted) return '✅';
    if (isActive) return '🎯';
    if (isAvailable) return '🔷';
    return '🔒';
  };

  const getStepStatus = () => {
    if (isCompleted) return 'COMPLETE';
    if (isActive) return 'CURRENT';
    if (isAvailable) return 'READY';
    return 'LOCKED';
  };

  const getCardStyles = () => {
    if (isCompleted) return 'bg-green-50 border-green-200 shadow-green-100';
    if (isActive) return 'bg-blue-50 border-blue-200 shadow-blue-100';
    if (isAvailable) return 'bg-white border-gray-200 shadow-gray-100';
    return 'bg-gray-50 border-gray-100 shadow-gray-50';
  };

  const getTextStyles = () => {
    if (isCompleted) return 'text-green-700';
    if (isActive) return 'text-blue-700';
    if (isAvailable) return 'text-gray-700';
    return 'text-gray-400';
  };

  return (
    <motion.div
      className={`
        mobile-card border-2 transition-all duration-300 cursor-pointer relative overflow-hidden
        ${getCardStyles()}
        ${isAvailable || isCompleted ? 'hover:shadow-lg' : 'cursor-not-allowed'}
      `}
      style={{ x: panX }}
      animate={{ 
        scale: isActive ? 1.02 : 1,
        y: isActive ? -2 : 0 
      }}
      whileTap={isAvailable || isCompleted ? { scale: 0.98 } : {}}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      onClick={onClick}
      layout
    >
      {/* Swipe indicator */}
      {enableGestures && isAvailable && !isCompleted && (
        <motion.div
          className="absolute inset-y-0 right-0 w-16 bg-green-500 flex items-center justify-center opacity-0"
          animate={{ 
            opacity: panX > 50 ? 0.8 : 0,
            x: panX > 0 ? Math.min(panX - 50, 0) : 0
          }}
        >
          <span className="text-white text-xl">✓</span>
        </motion.div>
      )}
      
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <motion.div
          className={`h-full ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
          initial={{ width: 0 }}
          animate={{ width: isCompleted ? '100%' : isActive ? '50%' : '0%' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        />
      </div>

      <div className="flex items-center space-x-4">
        {/* Step icon with animation */}
        <motion.div
          className={`
            w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold
            ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : isAvailable ? 'bg-gray-400' : 'bg-gray-300'}
          `}
          whileHover={isAvailable || isCompleted ? { scale: 1.1 } : {}}
          animate={isActive ? { 
            boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 10px rgba(59, 130, 246, 0)'],
          } : {}}
          transition={isActive ? { duration: 2, repeat: Infinity } : {}}
        >
          {getStepIcon()}
        </motion.div>

        {/* Step content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-bold text-lg truncate ${getTextStyles()}`}>
              {step.title}
            </h3>
            <span className={`
              text-xs px-2 py-1 rounded-full font-bold
              ${isCompleted ? 'bg-green-100 text-green-700' : 
                isActive ? 'bg-blue-100 text-blue-700' : 
                isAvailable ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-400'}
            `}>
              {getStepStatus()}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {step.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{phase.title}</span>
            <span>{step.estimatedDuration}</span>
          </div>
        </div>

        {/* Navigation indicator */}
        {(isAvailable || isCompleted) && (
          <motion.div
            className="text-gray-400"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Gesture hints for new users */}
      {enableGestures && isAvailable && !isCompleted && (
        <motion.div
          className="absolute bottom-2 right-2 text-xs text-gray-400 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Swipe →
        </motion.div>
      )}
    </motion.div>
  );
}

export default function MobileProgressTracker({ 
  showDetailed = true, 
  enableGestures = true,
  compactMode = false 
}: MobileProgressTrackerProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'overview' | 'detailed'>('overview');
  const [filterPhase, setFilterPhase] = useState<string | null>(null);

  const { 
    phases,
    currentStep,
    isStepCompleted,
    isStepAvailable,
    completeStep
  } = useJourney();

  const { 
    progressPercentage, 
    completedStepsCount, 
    totalStepsCount 
  } = useJourneyProgress();

  // Get all steps with phase information
  const allStepsWithPhase = phases.flatMap(phase => 
    phase.steps.map(step => ({ step, phase }))
  );

  // Filter steps by phase if selected
  const filteredSteps = filterPhase 
    ? allStepsWithPhase.filter(({ phase }) => phase.id === filterPhase)
    : allStepsWithPhase;

  const handleStepClick = (stepId: string, phaseId: string) => {
    if (isStepAvailable(stepId) || isStepCompleted(stepId)) {
      router.push(`/journey/${phaseId}/${stepId}`);
    }
  };

  const handleQuickComplete = async (stepId: string) => {
    if (isStepAvailable(stepId) && !isStepCompleted(stepId)) {
      await completeStep(stepId, 'Quick completion via mobile tracker');
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]);
      }
    }
  };

  if (compactMode) {
    return (
      <div className="mobile-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="mobile-subtitle">Your Progress</h2>
          <span className="text-2xl font-bold text-green-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div className="mb-4">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {completedStepsCount} of {totalStepsCount} steps complete
          </p>
          {currentStep && (
            <button
              onClick={() => router.push(`/journey/${currentStep.phaseId}/${currentStep.id}`)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
            >
              Continue: {currentStep.title}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="mobile-card">
        <div className="text-center mb-4">
          <motion.div
            className="text-6xl font-bold text-green-600 mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {Math.round(progressPercentage)}%
          </motion.div>
          <h2 className="mobile-title">Your Journey Progress</h2>
          <p className="text-gray-600">
            {completedStepsCount} of {totalStepsCount} steps complete
          </p>
        </div>

        {/* Circular progress */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="10"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="var(--duolingo-green)"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progressPercentage / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                pathLength: progressPercentage / 100,
                strokeDasharray: 314.159,
                strokeDashoffset: 314.159 * (1 - progressPercentage / 100),
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🏡</span>
          </div>
        </div>

        {/* View toggle */}
        {showDetailed && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'overview' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('detailed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'detailed' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Steps
            </button>
          </div>
        )}
      </div>

      {/* Phase filter */}
      {currentView === 'detailed' && (
        <div className="mobile-card">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterPhase(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                !filterPhase ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              All Phases
            </button>
            {phases.map(phase => (
              <button
                key={phase.id}
                onClick={() => setFilterPhase(phase.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  filterPhase === phase.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {phase.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Steps list */}
      <AnimatePresence mode="wait">
        {currentView === 'detailed' && (
          <motion.div
            key="detailed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {filteredSteps.map(({ step, phase }, index) => (
              <StepCard
                key={step.id}
                step={step}
                phase={phase}
                index={index}
                isActive={currentStep?.id === step.id}
                isCompleted={isStepCompleted(step.id)}
                isAvailable={isStepAvailable(step.id)}
                enableGestures={enableGestures}
                onClick={() => handleStepClick(step.id, phase.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current step highlight */}
      {currentView === 'overview' && currentStep && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mobile-card border-2 border-blue-200 bg-blue-50"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="mobile-subtitle text-blue-700">Your Next Step</h3>
            <p className="font-bold text-lg text-blue-800 mb-2">
              {currentStep.title}
            </p>
            <p className="text-blue-600 text-sm mb-4">
              {currentStep.description}
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => router.push(`/journey/${currentStep.phaseId}/${currentStep.id}`)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium"
              >
                Start Step
              </button>
              {enableGestures && (
                <button
                  onClick={() => handleQuickComplete(currentStep.id)}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium"
                >
                  Quick Complete
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievement celebration */}
      {completedStepsCount > 0 && completedStepsCount % 5 === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mobile-card bg-yellow-50 border-yellow-200 text-center"
        >
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="mobile-subtitle text-yellow-700">Milestone Reached!</h3>
          <p className="text-yellow-600">
            You've completed {completedStepsCount} steps. Keep up the great work!
          </p>
        </motion.div>
      )}

      {/* Gesture instructions for first-time users */}
      {enableGestures && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mobile-card bg-gray-50 border-gray-200 text-center"
        >
          <div className="text-2xl mb-2">💡</div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Pro Tip</h3>
          <p className="text-xs text-gray-600">
            Swipe right on available steps to quick complete, or tap to view details
          </p>
        </motion.div>
      )}
    </div>
  );
}