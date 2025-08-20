'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useJourney } from '@/contexts/JourneyContext';
import { JourneyStep } from '@/types/regional';

interface MobileStepNavigationProps {
  currentStepId: string;
  enableGestures?: boolean;
  showMiniMap?: boolean;
  autoHide?: boolean;
}

interface SwipeDirection {
  direction: 'left' | 'right' | null;
  strength: number;
}

export default function MobileStepNavigation({ 
  currentStepId, 
  enableGestures = true,
  showMiniMap = true,
  autoHide = true
}: MobileStepNavigationProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [swipeState, setSwipeState] = useState<SwipeDirection>({ direction: null, strength: 0 });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{ step: JourneyStep; direction: string } | null>(null);

  const { 
    engine,
    phases,
    currentStep,
    getNextStep,
    getPreviousStep,
    isStepAvailable,
    isStepCompleted,
    completeStep
  } = useJourney();

  // Get all steps for mini-map
  const allSteps = phases.flatMap(phase => phase.steps);
  const currentStepIndex = allSteps.findIndex(step => step.id === currentStepId);
  
  // Get navigation steps
  const previousStep = getPreviousStep();
  const nextStep = getNextStep();

  // Auto-hide on scroll
  useEffect(() => {
    if (!autoHide) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, autoHide]);

  // Handle swipe gestures
  const handlePan = (event: any, info: PanInfo) => {
    if (!enableGestures) return;

    const { offset, velocity } = info;
    const direction = offset.x > 0 ? 'right' : 'left';
    const strength = Math.abs(offset.x) / 100; // Normalize to 0-1+

    setSwipeState({ direction, strength: Math.min(strength, 1) });

    // Provide haptic feedback for strong swipes
    if (strength > 0.5 && 'vibrate' in navigator) {
      navigator.vibrate(5);
    }
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    if (!enableGestures) return;

    const { offset, velocity } = info;
    const swipeThreshold = 80;
    const velocityThreshold = 300;

    setSwipeState({ direction: null, strength: 0 });

    const isSwipeStrong = Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold;

    if (isSwipeStrong) {
      if (offset.x > 0 && previousStep) {
        // Swipe right - go to previous step
        navigateToStep(previousStep, 'previous');
      } else if (offset.x < 0 && nextStep) {
        // Swipe left - go to next step
        if (isStepCompleted(currentStepId) || isStepAvailable(nextStep.id)) {
          navigateToStep(nextStep, 'next');
        } else {
          // Show confirmation for incomplete step
          setPendingNavigation({ step: nextStep, direction: 'next' });
          setShowConfirmation(true);
        }
      }
    }
  };

  const navigateToStep = (step: JourneyStep, direction: string) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }

    // Navigate to step
    router.push(`/journey/${step.phaseId}/${step.id}`);
  };

  const handleQuickNavigate = async (step: JourneyStep, direction: string) => {
    if (direction === 'next' && !isStepCompleted(currentStepId)) {
      // Auto-complete current step before moving to next
      await completeStep(currentStepId, 'Auto-completed via navigation');
    }
    
    navigateToStep(step, direction);
    setShowConfirmation(false);
    setPendingNavigation(null);
  };

  const getSwipeIndicatorColor = () => {
    if (!swipeState.direction) return 'transparent';
    
    const opacity = Math.min(swipeState.strength * 0.8, 0.8);
    
    if (swipeState.direction === 'right' && previousStep) {
      return `rgba(59, 130, 246, ${opacity})`; // Blue for previous
    } else if (swipeState.direction === 'left' && nextStep) {
      return `rgba(34, 197, 94, ${opacity})`; // Green for next
    }
    
    return `rgba(239, 68, 68, ${opacity})`; // Red for invalid
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-20 left-0 right-0 z-40 px-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Swipe area */}
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 mx-auto max-w-sm"
              style={{ backgroundColor: getSwipeIndicatorColor() }}
              onPan={handlePan}
              onPanEnd={handlePanEnd}
              whileTap={{ scale: 0.98 }}
            >
              {/* Navigation controls */}
              <div className="flex items-center justify-between">
                {/* Previous step */}
                <motion.button
                  className={`
                    flex items-center space-x-2 px-4 py-3 rounded-xl transition-all
                    ${previousStep 
                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-700' 
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  disabled={!previousStep}
                  onClick={() => previousStep && navigateToStep(previousStep, 'previous')}
                  whileHover={previousStep ? { scale: 1.05 } : {}}
                  whileTap={previousStep ? { scale: 0.95 } : {}}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Back</span>
                </motion.button>

                {/* Current step indicator */}
                <div className="flex-1 mx-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    Step {currentStepIndex + 1} of {allSteps.length}
                  </div>
                  <div className="text-sm font-medium text-gray-700 truncate">
                    {currentStep?.title || 'Current Step'}
                  </div>
                  
                  {/* Mini progress bar */}
                  {showMiniMap && (
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStepIndex + 1) / allSteps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>

                {/* Next step */}
                <motion.button
                  className={`
                    flex items-center space-x-2 px-4 py-3 rounded-xl transition-all
                    ${nextStep 
                      ? 'bg-green-50 hover:bg-green-100 text-green-700' 
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  disabled={!nextStep}
                  onClick={() => {
                    if (nextStep) {
                      if (isStepCompleted(currentStepId) || isStepAvailable(nextStep.id)) {
                        navigateToStep(nextStep, 'next');
                      } else {
                        setPendingNavigation({ step: nextStep, direction: 'next' });
                        setShowConfirmation(true);
                      }
                    }
                  }}
                  whileHover={nextStep ? { scale: 1.05 } : {}}
                  whileTap={nextStep ? { scale: 0.95 } : {}}
                >
                  <span className="text-sm font-medium">Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              {/* Gesture hint */}
              {enableGestures && (
                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span>←</span>
                      <span>Swipe for navigation</span>
                      <span>→</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Swipe direction indicator */}
              <AnimatePresence>
                {swipeState.direction && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className={`
                      px-4 py-2 rounded-xl text-white font-medium text-sm
                      ${swipeState.direction === 'right' ? 'bg-blue-500' : 'bg-green-500'}
                    `}>
                      {swipeState.direction === 'right' 
                        ? `← ${previousStep?.title || 'Previous'}` 
                        : `${nextStep?.title || 'Next'} →`
                      }
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mini-map dots */}
            {showMiniMap && (
              <div className="flex justify-center space-x-1 mt-3">
                {allSteps.slice(Math.max(0, currentStepIndex - 2), currentStepIndex + 3).map((step, index) => {
                  const actualIndex = Math.max(0, currentStepIndex - 2) + index;
                  const isCurrent = actualIndex === currentStepIndex;
                  const isCompleted = isStepCompleted(step.id);
                  
                  return (
                    <motion.div
                      key={step.id}
                      className={`
                        w-2 h-2 rounded-full transition-all
                        ${isCurrent ? 'bg-blue-500 scale-125' : 
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                      `}
                      animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                      transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation confirmation modal */}
      <AnimatePresence>
        {showConfirmation && pendingNavigation && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Continue to Next Step?
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't completed the current step yet. Would you like to mark it as complete and move on to <strong>{pendingNavigation.step.title}</strong>?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowConfirmation(false);
                      setPendingNavigation(null);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Stay Here
                  </button>
                  <button
                    onClick={() => handleQuickNavigate(pendingNavigation.step, pendingNavigation.direction)}
                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Complete & Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}