'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  RocketLaunchIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

export type ComplexityMode = 'beginner' | 'experienced' | 'adaptive';

interface ComplexityToggleProps {
  mode: ComplexityMode;
  onChange: (mode: ComplexityMode) => void;
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
}

const modeConfig = {
  beginner: {
    label: 'Beginner',
    shortLabel: 'Guide',
    description: 'Step-by-step guidance with detailed explanations',
    icon: AcademicCapIcon,
    color: 'bg-journey-current',
    textColor: 'text-journey-current',
    bgColor: 'bg-warning-50',
    borderColor: 'border-warning-200',
    features: [
      'Detailed explanations for every step',
      'Educational tips and contextual help', 
      'Confirmation dialogs for important actions',
      'Progress tracking with milestones',
      'Simplified interface with fewer options'
    ],
  },
  experienced: {
    label: 'Experienced',
    shortLabel: 'Pro',
    description: 'Streamlined workflow for efficient task completion',
    icon: RocketLaunchIcon,
    color: 'bg-journey-milestone',
    textColor: 'text-journey-milestone',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    features: [
      'Quick actions and batch operations',
      'Advanced shortcuts and gestures',
      'Compact interface with more data',
      'Skip routine confirmations',
      'Customizable dashboard layout'
    ],
  },
  adaptive: {
    label: 'Smart',
    shortLabel: 'Auto',
    description: 'Adapts to your behavior and preferences automatically',
    icon: AdjustmentsHorizontalIcon,
    color: 'bg-journey-completed',
    textColor: 'text-journey-completed',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-200',
    features: [
      'Learns from your interaction patterns',
      'Smart suggestions based on progress',
      'Auto-adjusts interface complexity',
      'Predictive task recommendations',
      'Contextual help when needed'
    ],
  },
};

export default function ComplexityToggle({
  mode,
  onChange,
  showLabels = true,
  compact = false,
  className = '',
}: ComplexityToggleProps) {
  const modes: ComplexityMode[] = ['beginner', 'experienced', 'adaptive'];

  if (compact) {
    return (
      <div className={`card-surface p-2 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-progress-small text-text-secondary font-medium">
            Experience Mode
          </span>
          <div className="text-xs text-text-tertiary">
            {modeConfig[mode].shortLabel}
          </div>
        </div>
        
        <div className="flex bg-surface-tertiary rounded-xl p-1">
          {modes.map((m) => {
            const config = modeConfig[m];
            const Icon = config.icon;
            const isActive = mode === m;

            return (
              <motion.button
                key={m}
                onClick={() => onChange(m)}
                className={`
                  relative flex-1 flex items-center justify-center py-2 px-2 rounded-lg
                  text-progress-small font-medium transition-all duration-200 touch-target-sm
                  ${isActive 
                    ? `bg-surface-elevated ${config.textColor} shadow-sm border border-border-light` 
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-secondary'
                  }
                `}
                whileTap={{ scale: 0.95 }}
                whileHover={!isActive ? { scale: 1.02 } : undefined}
              >
                <Icon className={`icon-sm ${isActive ? '' : 'opacity-60'}`} />
                {showLabels && (
                  <span className="ml-1 hidden sm:inline text-xs">
                    {config.shortLabel}
                  </span>
                )}
                
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg"
                    layoutId="complexity-indicator-compact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Smart suggestions and current mode description */}
        <div className="mt-2 px-1">
          <p className="text-xs text-text-tertiary">
            {modeConfig[mode].description}
            {mode === 'adaptive' && (
              <span className="block mt-1 text-primary-600 font-medium">
                • Smart detection active
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabels && (
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Choose Your Experience Level
          </h3>
          <p className="text-sm text-gray-600">
            This helps us customize the interface and guidance for you
          </p>
        </div>
      )}

      <div className="space-y-2">
        {modes.map((m) => {
          const config = modeConfig[m];
          const Icon = config.icon;
          const isActive = mode === m;

          return (
            <motion.button
              key={m}
              onClick={() => onChange(m)}
              className={`
                w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                ${isActive 
                  ? `${config.borderColor} ${config.bgColor}` 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                  ${isActive ? config.color : 'bg-gray-200'}
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${
                      isActive ? config.textColor : 'text-gray-900'
                    }`}>
                      {config.label} Mode
                    </h4>

                    {/* Selection Indicator */}
                    <motion.div
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isActive 
                          ? `${config.borderColor.replace('border-', 'border-')} ${config.color}` 
                          : 'border-gray-300'
                        }
                      `}
                      animate={{ scale: isActive ? 1 : 0.8 }}
                    >
                      {isActive && (
                        <motion.div
                          className="w-2 h-2 rounded-full bg-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        />
                      )}
                    </motion.div>
                  </div>

                  <p className={`text-sm mt-1 ${
                    isActive ? config.textColor.replace('700', '600') : 'text-gray-600'
                  }`}>
                    {config.description}
                  </p>

                  {/* Enhanced Mode-specific features */}
                  <div className="mt-3">
                    <div className="grid grid-cols-1 gap-1">
                      {config.features.slice(0, 3).map((feature, index) => (
                        <motion.div
                          key={feature}
                          className={`
                            flex items-center text-xs
                            ${isActive ? config.textColor.replace('700', '600') : 'text-text-tertiary'}
                          `}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <div className={`
                            w-1 h-1 rounded-full mr-2 flex-shrink-0
                            ${isActive ? config.color.replace('bg-', 'bg-') : 'bg-border-medium'}
                          `} />
                          <span className="leading-tight">{feature}</span>
                        </motion.div>
                      ))}
                      
                      {config.features.length > 3 && (
                        <div className={`
                          text-xs mt-1
                          ${isActive ? config.textColor.replace('700', '500') : 'text-text-tertiary'}
                        `}>
                          +{config.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Quick Toggle for Settings/Header - Enhanced for mobile
export function ComplexityQuickToggle({
  mode,
  onChange,
  className = '',
  showTooltip = false,
}: {
  mode: ComplexityMode;
  onChange: (mode: ComplexityMode) => void;
  className?: string;
  showTooltip?: boolean;
}) {
  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <motion.div className={`relative ${className}`}>
      <motion.button
        onClick={() => {
          const modes: ComplexityMode[] = ['beginner', 'experienced', 'adaptive'];
          const currentIndex = modes.indexOf(mode);
          const nextMode = modes[(currentIndex + 1) % modes.length];
          onChange(nextMode);
        }}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200
          touch-target-md shadow-sm border border-border-light
          ${config.bgColor} ${config.textColor} 
          hover:shadow-md hover:scale-105 active:scale-95
        `}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <Icon className="icon-sm" />
        <span className="text-progress-medium font-semibold">
          {config.shortLabel}
        </span>
        
        {/* Mode indicator dot */}
        <div className={`
          w-2 h-2 rounded-full ${config.color} opacity-60
        `} />
      </motion.button>
      
      {/* Enhanced tooltip */}
      {showTooltip && (
        <motion.div
          className="
            absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50
            bg-surface-elevated border border-border-light rounded-xl shadow-lg p-3 min-w-48
          "
          initial={{ opacity: 0, y: -5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center">
            <p className="text-progress-medium font-semibold text-text-primary mb-1">
              {config.label} Mode
            </p>
            <p className="text-xs text-text-secondary mb-2">
              {config.description}
            </p>
            <div className="text-xs text-text-tertiary">
              Tap to cycle modes
            </div>
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-surface-elevated border-l border-t border-border-light rotate-45" />
        </motion.div>
      )}
    </motion.div>
  );
}

// Enhanced Context with Smart Detection and Analytics
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserBehaviorMetrics {
  sessionCount: number;
  averageTaskCompletionTime: number;
  skipConfirmationRate: number;
  helpContentEngagement: number;
  advancedFeatureUsage: number;
  taskCompletionAccuracy: number;
  lastInteractionTime: number;
}

interface ComplexityContextType {
  mode: ComplexityMode;
  setMode: (mode: ComplexityMode) => void;
  isBeginnerMode: boolean;
  isExperiencedMode: boolean;
  isAdaptiveMode: boolean;
  // Smart detection features
  suggestedMode: ComplexityMode;
  confidenceScore: number;
  adaptiveFeatures: {
    showDetailedExplanations: boolean;
    enableBatchActions: boolean;
    showAdvancedShortcuts: boolean;
    useProgressiveDisclosure: boolean;
  };
  // Tracking methods
  trackTaskCompletion: (taskId: string, completionTime: number) => void;
  trackHelpEngagement: (helpId: string, engagementType: 'view' | 'skip' | 'complete') => void;
  trackFeatureUsage: (featureId: string, usageType: 'basic' | 'advanced') => void;
}

const ComplexityContext = createContext<ComplexityContextType | undefined>(undefined);

// Smart complexity detection algorithm
function detectOptimalComplexity(metrics: UserBehaviorMetrics): { mode: ComplexityMode; confidence: number } {
  const {
    sessionCount,
    averageTaskCompletionTime,
    skipConfirmationRate,
    helpContentEngagement,
    advancedFeatureUsage,
    taskCompletionAccuracy
  } = metrics;

  let beginnerScore = 0;
  let experiencedScore = 0;
  let confidence = 0;

  // Session count influence (more sessions = more experienced)
  if (sessionCount < 3) beginnerScore += 0.3;
  else if (sessionCount > 10) experiencedScore += 0.3;
  
  // Task completion speed (faster = more experienced)
  if (averageTaskCompletionTime > 300) beginnerScore += 0.2; // >5 minutes
  else if (averageTaskCompletionTime < 120) experiencedScore += 0.2; // <2 minutes
  
  // Confirmation skipping (high skip rate = experienced)
  if (skipConfirmationRate > 0.7) experiencedScore += 0.25;
  else if (skipConfirmationRate < 0.2) beginnerScore += 0.15;
  
  // Help engagement (high engagement = beginner)
  if (helpContentEngagement > 0.6) beginnerScore += 0.2;
  else if (helpContentEngagement < 0.2) experiencedScore += 0.15;
  
  // Advanced feature usage
  if (advancedFeatureUsage > 0.5) experiencedScore += 0.3;
  else if (advancedFeatureUsage < 0.1) beginnerScore += 0.2;
  
  // Task completion accuracy
  if (taskCompletionAccuracy > 0.9) experiencedScore += 0.1;
  else if (taskCompletionAccuracy < 0.7) beginnerScore += 0.1;
  
  // Calculate confidence based on data points available
  const dataPoints = [sessionCount, averageTaskCompletionTime, skipConfirmationRate].filter(v => v > 0).length;
  confidence = Math.min(dataPoints / 6, 0.95); // Max 95% confidence
  
  // Determine mode
  const mode: ComplexityMode = experiencedScore > beginnerScore ? 'experienced' : 'beginner';
  
  return { mode, confidence };
}

export function ComplexityProvider({ 
  children,
  defaultMode = 'adaptive'
}: { 
  children: ReactNode;
  defaultMode?: ComplexityMode;
}) {
  const [mode, setMode] = useState<ComplexityMode>(defaultMode);
  const [behaviorMetrics, setBehaviorMetrics] = useState<UserBehaviorMetrics>({
    sessionCount: 0,
    averageTaskCompletionTime: 0,
    skipConfirmationRate: 0,
    helpContentEngagement: 0,
    advancedFeatureUsage: 0,
    taskCompletionAccuracy: 0,
    lastInteractionTime: Date.now()
  });
  
  // Smart detection results
  const { mode: suggestedMode, confidence: confidenceScore } = detectOptimalComplexity(behaviorMetrics);
  
  // Adaptive features based on detected complexity
  const adaptiveFeatures = {
    showDetailedExplanations: mode === 'beginner' || (mode === 'adaptive' && suggestedMode === 'beginner'),
    enableBatchActions: mode === 'experienced' || (mode === 'adaptive' && suggestedMode === 'experienced'),
    showAdvancedShortcuts: mode === 'experienced' || (mode === 'adaptive' && suggestedMode === 'experienced' && confidenceScore > 0.7),
    useProgressiveDisclosure: mode === 'adaptive' || mode === 'beginner'
  };
  
  // Behavior tracking methods
  const trackTaskCompletion = (taskId: string, completionTime: number) => {
    setBehaviorMetrics(prev => {
      const newAverage = prev.averageTaskCompletionTime > 0 
        ? (prev.averageTaskCompletionTime + completionTime) / 2
        : completionTime;
      
      return {
        ...prev,
        averageTaskCompletionTime: newAverage,
        lastInteractionTime: Date.now()
      };
    });
  };
  
  const trackHelpEngagement = (helpId: string, engagementType: 'view' | 'skip' | 'complete') => {
    setBehaviorMetrics(prev => {
      const engagementValue = engagementType === 'complete' ? 1 : engagementType === 'view' ? 0.5 : 0;
      const newEngagement = prev.helpContentEngagement > 0
        ? (prev.helpContentEngagement + engagementValue) / 2
        : engagementValue;
      
      return {
        ...prev,
        helpContentEngagement: newEngagement,
        lastInteractionTime: Date.now()
      };
    });
  };
  
  const trackFeatureUsage = (featureId: string, usageType: 'basic' | 'advanced') => {
    setBehaviorMetrics(prev => {
      const usageValue = usageType === 'advanced' ? 1 : 0;
      const newUsage = prev.advancedFeatureUsage > 0
        ? (prev.advancedFeatureUsage + usageValue) / 2
        : usageValue;
      
      return {
        ...prev,
        advancedFeatureUsage: newUsage,
        lastInteractionTime: Date.now()
      };
    });
  };
  
  // Load metrics from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('complexity-metrics');
    if (stored) {
      try {
        const metrics = JSON.parse(stored);
        setBehaviorMetrics(prev => ({ ...prev, ...metrics }));
      } catch (error) {
        console.warn('Failed to load complexity metrics:', error);
      }
    }
  }, []);
  
  // Save metrics to localStorage on change
  useEffect(() => {
    localStorage.setItem('complexity-metrics', JSON.stringify(behaviorMetrics));
  }, [behaviorMetrics]);

  return (
    <ComplexityContext.Provider
      value={{
        mode,
        setMode,
        isBeginnerMode: mode === 'beginner',
        isExperiencedMode: mode === 'experienced',
        isAdaptiveMode: mode === 'adaptive',
        suggestedMode,
        confidenceScore,
        adaptiveFeatures,
        trackTaskCompletion,
        trackHelpEngagement,
        trackFeatureUsage,
      }}
    >
      {children}
    </ComplexityContext.Provider>
  );
}

export function useComplexity() {
  const context = useContext(ComplexityContext);
  if (context === undefined) {
    throw new Error('useComplexity must be used within a ComplexityProvider');
  }
  return context;
}

// Progressive Disclosure Hook
export function useProgressiveDisclosure(featureId: string, defaultExpanded = false) {
  const { adaptiveFeatures, trackFeatureUsage } = useComplexity();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const toggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    // Track usage
    trackFeatureUsage(featureId, newState ? 'advanced' : 'basic');
  };
  
  const shouldShow = adaptiveFeatures.useProgressiveDisclosure ? isExpanded : true;
  
  return {
    isExpanded,
    shouldShow,
    toggle,
    canExpand: adaptiveFeatures.useProgressiveDisclosure
  };
}

// Smart Help Hook
export function useSmartHelp(helpId: string) {
  const { adaptiveFeatures, trackHelpEngagement } = useComplexity();
  const [hasViewed, setHasViewed] = useState(false);
  
  const markViewed = () => {
    if (!hasViewed) {
      setHasViewed(true);
      trackHelpEngagement(helpId, 'view');
    }
  };
  
  const markCompleted = () => {
    trackHelpEngagement(helpId, 'complete');
  };
  
  const markSkipped = () => {
    trackHelpEngagement(helpId, 'skip');
  };
  
  return {
    shouldShowHelp: adaptiveFeatures.showDetailedExplanations,
    markViewed,
    markCompleted,
    markSkipped
  };
}