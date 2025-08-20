'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useJourney } from '@/contexts/JourneyContext';

interface GestureConfig {
  enableSwipeNavigation: boolean;
  enablePinchToZoom: boolean;
  enableDoubleTapToComplete: boolean;
  enableLongPressActions: boolean;
  hapticFeedback: boolean;
  swipeThreshold: number;
  longPressThreshold: number;
}

interface GestureState {
  currentGesture: 'none' | 'swipe' | 'pinch' | 'tap' | 'longpress';
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null;
  isProcessing: boolean;
  lastGestureTime: number;
}

interface MobileGestureContextType {
  config: GestureConfig;
  state: GestureState;
  updateConfig: (newConfig: Partial<GestureConfig>) => void;
  registerGestureArea: (id: string, handlers: GestureHandlers) => void;
  unregisterGestureArea: (id: string) => void;
  triggerHaptic: (pattern?: number | number[]) => void;
}

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
}

const defaultConfig: GestureConfig = {
  enableSwipeNavigation: true,
  enablePinchToZoom: false,
  enableDoubleTapToComplete: true,
  enableLongPressActions: true,
  hapticFeedback: true,
  swipeThreshold: 50,
  longPressThreshold: 800,
};

const MobileGestureContext = createContext<MobileGestureContextType | undefined>(undefined);

interface MobileGestureProviderProps {
  children: ReactNode;
  initialConfig?: Partial<GestureConfig>;
}

export function MobileGestureProvider({ children, initialConfig }: MobileGestureProviderProps) {
  const router = useRouter();
  const [config, setConfig] = useState<GestureConfig>({ ...defaultConfig, ...initialConfig });
  const [state, setState] = useState<GestureState>({
    currentGesture: 'none',
    swipeDirection: null,
    isProcessing: false,
    lastGestureTime: 0,
  });
  const [gestureAreas, setGestureAreas] = useState<Map<string, GestureHandlers>>(new Map());

  const { 
    currentStep,
    getNextStep,
    getPreviousStep,
    completeStep,
    isStepAvailable,
    isStepCompleted
  } = useJourney();

  // Haptic feedback function
  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (!config.hapticFeedback || !('vibrate' in navigator)) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
    }
  };

  // Update configuration
  const updateConfig = (newConfig: Partial<GestureConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Register gesture area
  const registerGestureArea = (id: string, handlers: GestureHandlers) => {
    setGestureAreas(prev => new Map(prev.set(id, handlers)));
  };

  // Unregister gesture area
  const unregisterGestureArea = (id: string) => {
    setGestureAreas(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  // Global gesture handlers for journey navigation
  const handleGlobalSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!config.enableSwipeNavigation || !currentStep) return;

    setState(prev => ({ ...prev, swipeDirection: direction, isProcessing: true }));

    switch (direction) {
      case 'left': {
        const nextStep = getNextStep();
        if (nextStep && (isStepCompleted(currentStep.id) || isStepAvailable(nextStep.id))) {
          triggerHaptic([30, 10, 30]);
          router.push(`/journey/${nextStep.phaseId}/${nextStep.id}`);
        } else {
          triggerHaptic([100, 50, 100]); // Error vibration
        }
        break;
      }
      case 'right': {
        const previousStep = getPreviousStep();
        if (previousStep) {
          triggerHaptic([30, 10, 30]);
          router.push(`/journey/${previousStep.phaseId}/${previousStep.id}`);
        } else {
          triggerHaptic([100, 50, 100]); // Error vibration
        }
        break;
      }
      case 'up': {
        // Scroll to top or show step overview
        window.scrollTo({ top: 0, behavior: 'smooth' });
        triggerHaptic(20);
        break;
      }
      case 'down': {
        // Scroll to bottom or show step actions
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        triggerHaptic(20);
        break;
      }
    }

    // Reset processing state
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        swipeDirection: null, 
        isProcessing: false,
        lastGestureTime: Date.now()
      }));
    }, 500);
  };

  const handleGlobalDoubleTap = async () => {
    if (!config.enableDoubleTapToComplete || !currentStep || isStepCompleted(currentStep.id)) return;

    triggerHaptic([50, 30, 50]);
    await completeStep(currentStep.id, 'Completed via double-tap gesture');
  };

  const handleGlobalLongPress = () => {
    if (!config.enableLongPressActions) return;

    triggerHaptic([100, 50, 100, 50, 100]);
    // Could show quick actions menu or step options
    console.log('Long press detected - show quick actions');
  };

  const value: MobileGestureContextType = {
    config,
    state,
    updateConfig,
    registerGestureArea,
    unregisterGestureArea,
    triggerHaptic,
  };

  return (
    <MobileGestureContext.Provider value={value}>
      <GlobalGestureDetector
        onSwipeLeft={() => handleGlobalSwipe('left')}
        onSwipeRight={() => handleGlobalSwipe('right')}
        onSwipeUp={() => handleGlobalSwipe('up')}
        onSwipeDown={() => handleGlobalSwipe('down')}
        onDoubleTap={handleGlobalDoubleTap}
        onLongPress={handleGlobalLongPress}
        config={config}
      >
        {children}
      </GlobalGestureDetector>
    </MobileGestureContext.Provider>
  );
}

interface GlobalGestureDetectorProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onDoubleTap: () => void;
  onLongPress: () => void;
  config: GestureConfig;
}

function GlobalGestureDetector({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  onDoubleTap,
  onLongPress,
  config 
}: GlobalGestureDetectorProps) {
  const [lastTap, setLastTap] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handlePan = (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipeThreshold = config.swipeThreshold;
    const velocityThreshold = 300;

    const absOffsetX = Math.abs(offset.x);
    const absOffsetY = Math.abs(offset.y);

    // Determine if it's a strong enough gesture
    const isStrongGesture = 
      absOffsetX > swipeThreshold || 
      absOffsetY > swipeThreshold ||
      Math.abs(velocity.x) > velocityThreshold ||
      Math.abs(velocity.y) > velocityThreshold;

    if (!isStrongGesture) return;

    // Determine primary direction
    if (absOffsetX > absOffsetY) {
      // Horizontal swipe
      if (offset.x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (offset.y > 0) {
        onSwipeDown();
      } else {
        onSwipeUp();
      }
    }
  };

  const handleTap = () => {
    if (!config.enableDoubleTapToComplete) return;

    const now = Date.now();
    const timeDiff = now - lastTap;

    if (timeDiff < 300 && timeDiff > 50) {
      // Double tap detected
      onDoubleTap();
      setLastTap(0); // Reset to prevent triple tap
    } else {
      setLastTap(now);
    }
  };

  const handleTapStart = () => {
    if (!config.enableLongPressActions) return;

    const timer = setTimeout(() => {
      onLongPress();
    }, config.longPressThreshold);

    setLongPressTimer(timer);
  };

  const handleTapEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <motion.div
      className="w-full h-full"
      onPan={handlePan}
      onTap={handleTap}
      onTapStart={handleTapStart}
      onTapCancel={handleTapEnd}
      style={{ touchAction: 'pan-y' }} // Allow vertical scrolling
    >
      {children}
    </motion.div>
  );
}

// Custom hook to use gesture context
export function useMobileGestures() {
  const context = useContext(MobileGestureContext);
  if (context === undefined) {
    throw new Error('useMobileGestures must be used within a MobileGestureProvider');
  }
  return context;
}

// Gesture area component for specific regions
interface GestureAreaProps {
  id: string;
  children: ReactNode;
  handlers: GestureHandlers;
  className?: string;
  disabled?: boolean;
}

export function GestureArea({ id, children, handlers, className = '', disabled = false }: GestureAreaProps) {
  const { registerGestureArea, unregisterGestureArea, config, triggerHaptic } = useMobileGestures();

  useEffect(() => {
    if (!disabled) {
      registerGestureArea(id, handlers);
    }
    
    return () => {
      unregisterGestureArea(id);
    };
  }, [id, handlers, disabled, registerGestureArea, unregisterGestureArea]);

  const handleLocalPan = (event: any, info: PanInfo) => {
    if (disabled) return;

    const { offset, velocity } = info;
    const swipeThreshold = config.swipeThreshold;

    if (Math.abs(offset.x) > swipeThreshold) {
      if (offset.x > 0 && handlers.onSwipeRight) {
        triggerHaptic(20);
        handlers.onSwipeRight();
      } else if (offset.x < 0 && handlers.onSwipeLeft) {
        triggerHaptic(20);
        handlers.onSwipeLeft();
      }
    }

    if (Math.abs(offset.y) > swipeThreshold) {
      if (offset.y > 0 && handlers.onSwipeDown) {
        triggerHaptic(20);
        handlers.onSwipeDown();
      } else if (offset.y < 0 && handlers.onSwipeUp) {
        triggerHaptic(20);
        handlers.onSwipeUp();
      }
    }
  };

  const handleLocalDoubleTap = () => {
    if (disabled || !handlers.onDoubleTap) return;
    
    triggerHaptic([30, 10, 30]);
    handlers.onDoubleTap();
  };

  return (
    <motion.div
      className={className}
      onPan={handleLocalPan}
      onTap={handleLocalDoubleTap}
    >
      {children}
    </motion.div>
  );
}

// Configuration component for gesture settings
interface GestureConfigProps {
  onConfigChange?: (config: GestureConfig) => void;
}

export function GestureConfig({ onConfigChange }: GestureConfigProps) {
  const { config, updateConfig } = useMobileGestures();

  const handleConfigChange = (key: keyof GestureConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    updateConfig({ [key]: value });
    onConfigChange?.(newConfig);
  };

  return (
    <div className="mobile-card">
      <h3 className="mobile-subtitle mb-4">Gesture Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Swipe Navigation</label>
          <input
            type="checkbox"
            checked={config.enableSwipeNavigation}
            onChange={(e) => handleConfigChange('enableSwipeNavigation', e.target.checked)}
            className="form-checkbox"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Double Tap to Complete</label>
          <input
            type="checkbox"
            checked={config.enableDoubleTapToComplete}
            onChange={(e) => handleConfigChange('enableDoubleTapToComplete', e.target.checked)}
            className="form-checkbox"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Long Press Actions</label>
          <input
            type="checkbox"
            checked={config.enableLongPressActions}
            onChange={(e) => handleConfigChange('enableLongPressActions', e.target.checked)}
            className="form-checkbox"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Haptic Feedback</label>
          <input
            type="checkbox"
            checked={config.hapticFeedback}
            onChange={(e) => handleConfigChange('hapticFeedback', e.target.checked)}
            className="form-checkbox"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Swipe Sensitivity: {config.swipeThreshold}px
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={config.swipeThreshold}
            onChange={(e) => handleConfigChange('swipeThreshold', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}