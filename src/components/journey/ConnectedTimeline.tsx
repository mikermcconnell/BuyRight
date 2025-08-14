'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  HomeIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
  KeyIcon as KeyIconSolid,
} from '@heroicons/react/24/solid';

export interface JourneyPhase {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  progress: number; // 0-100
  status: 'completed' | 'current' | 'upcoming';
  description: string;
  estimatedTime?: string;
  milestones?: number; // Number of milestones in this phase
  completedMilestones?: number; // Number of completed milestones
}

interface ConnectedTimelineProps {
  phases: JourneyPhase[];
  onPhaseSelect?: (phase: JourneyPhase) => void;
  showConnectedPaths?: boolean;
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
}

// Enhanced winding path SVG component for journey connections - Design spec compliant
const ConnectedPath: React.FC<{
  fromX: number;
  toX: number;
  progress: number;
  isActive: boolean;
  pathIndex: number;
}> = ({ fromX, toX, progress, isActive, pathIndex }) => {
  const pathLength = Math.abs(toX - fromX);
  const strokeDasharray = `${pathLength * (progress / 100)} ${pathLength}`;
  
  // Create winding path points for more engaging visual
  const midX = (fromX + toX) / 2;
  const controlY = 50 + (pathIndex % 2 === 0 ? -15 : 15); // Alternate curve direction
  const pathD = `M ${fromX + 25} 50 Q ${midX + 25} ${controlY} ${toX + 25} 50`;
  
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${Math.max(fromX, toX) + 50} 100`}
      preserveAspectRatio="none"
    >
      <defs>
        {/* Enhanced gradient for journey path */}
        <linearGradient id={`path-gradient-${pathIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#007AFF" />
          <stop offset="50%" stopColor="#5856D6" />
          <stop offset="100%" stopColor="#AF52DE" />
        </linearGradient>
        
        {/* Glow effect for active paths */}
        {isActive && (
          <filter id={`glow-${pathIndex}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}
      </defs>
      
      {/* Background winding path */}
      <path
        d={pathD}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={3}
        className="opacity-30"
      />
      
      {/* Progress winding path with enhanced animation */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={`url(#path-gradient-${pathIndex})`}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={`${pathLength} ${pathLength}`}
        filter={isActive ? `url(#glow-${pathIndex})` : undefined}
        initial={{ 
          strokeDashoffset: pathLength,
          opacity: 0
        }}
        animate={{ 
          strokeDashoffset: pathLength - (pathLength * (progress / 100)),
          opacity: 1
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.4, 0, 0.2, 1], 
          delay: 0.3 + (pathIndex * 0.2)
        }}
        className={isActive ? "drop-shadow-md" : "drop-shadow-sm"}
      />
      
      {/* Animated progress indicator dot */}
      {progress > 0 && progress < 100 && (
        <motion.circle
          r={3}
          fill="#FF9500"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: 1 + (pathIndex * 0.2)
          }}
        >
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            begin={`${1 + (pathIndex * 0.2)}s`}
          >
            <mpath href={`#path-${pathIndex}`} />
          </animateMotion>
        </motion.circle>
      )}
      
      {/* Hidden path for motion animation */}
      <path
        id={`path-${pathIndex}`}
        d={pathD}
        fill="none"
        stroke="none"
      />
    </svg>
  );
};

// Milestone marker component
const MilestoneMarker: React.FC<{
  phase: JourneyPhase;
  index: number;
  onSelect?: () => void;
  variant: 'full' | 'compact' | 'minimal';
}> = ({ phase, index, onSelect, variant }) => {
  const Icon = phase.status === 'current' ? phase.activeIcon : phase.icon;
  
  const getStatusClasses = () => {
    switch (phase.status) {
      case 'completed':
        return 'journey-milestone-completed';
      case 'current':
        return 'journey-milestone-active';
      case 'upcoming':
        return 'journey-milestone-upcoming';
      default:
        return 'journey-milestone-upcoming';
    }
  };

  const getContainerSize = () => {
    if (variant === 'minimal') return 'w-8 h-8 touch-target-sm';
    if (variant === 'compact') return 'w-10 h-10 touch-target-md';
    return 'w-14 h-14 touch-target-lg';
  };

  const getIconSize = () => {
    // Using design spec: 16px for small, 20px for primary
    if (variant === 'minimal') return 'icon-sm'; // 16px
    if (variant === 'compact') return 'icon-md'; // 20px (design spec preferred)
    return 'icon-lg'; // 24px for large
  };

  return (
    <motion.button
      className={`
        ${getContainerSize()} ${getStatusClasses()}
        rounded-full flex items-center justify-center
        relative z-10 transition-all duration-200
        ${onSelect ? 'hover:scale-105 active:scale-95' : ''}
      `}
      onClick={onSelect}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileTap={onSelect ? { scale: 0.9 } : undefined}
    >
      <Icon className={getIconSize()} />
      
      {/* Progress indicator for current phase */}
      {phase.status === 'current' && variant === 'full' && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-1 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-journey-current rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${phase.progress}%` }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
        </div>
      )}
    </motion.button>
  );
};

// Phase card component for full variant
const PhaseCard: React.FC<{
  phase: JourneyPhase;
  index: number;
  onSelect?: () => void;
}> = ({ phase, index, onSelect }) => {
  const Icon = phase.status === 'current' ? phase.activeIcon : phase.icon;
  
  return (
    <motion.div
      className="card-interactive p-6 min-h-[200px] w-72 flex-shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onSelect}
    >
      {/* Phase Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${phase.status === 'completed' ? 'bg-journey-completed' : ''}
          ${phase.status === 'current' ? 'bg-journey-current' : ''}
          ${phase.status === 'upcoming' ? 'bg-surface-tertiary' : ''}
        `}>
          <Icon className={`
            icon-md
            ${phase.status === 'upcoming' ? 'text-text-tertiary' : 'text-white'}
          `} />
        </div>
        
        {phase.status === 'current' && (
          <div className="px-3 py-1 bg-journey-current/10 rounded-full">
            <span className="text-xs font-medium text-journey-current">Active</span>
          </div>
        )}
        
        {phase.status === 'completed' && (
          <div className="px-3 py-1 bg-journey-completed/10 rounded-full">
            <span className="text-xs font-medium text-journey-completed">Complete</span>
          </div>
        )}
      </div>

      {/* Phase Info */}
      <div className="mb-4">
        <h4 className="text-dashboard-subtitle text-text-primary mb-2 font-semibold">
          {phase.name}
        </h4>
        <p className="text-sm text-text-secondary mb-3">
          {phase.description}
        </p>
        
        {phase.estimatedTime && (
          <p className="text-xs text-text-tertiary">
            Estimated time: {phase.estimatedTime}
          </p>
        )}
      </div>

      {/* Progress Section */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">Progress</span>
          <span className="text-xs text-text-tertiary">{phase.progress}%</span>
        </div>
        
        <div className="w-full bg-surface-tertiary rounded-full h-2">
          <motion.div
            className={`
              h-full rounded-full
              ${phase.status === 'completed' ? 'bg-journey-completed' : ''}
              ${phase.status === 'current' ? 'bg-gradient-to-r from-journey-path to-journey-milestone' : ''}
              ${phase.status === 'upcoming' ? 'bg-border-medium' : ''}
            `}
            initial={{ width: 0 }}
            animate={{ width: `${phase.progress}%` }}
            transition={{ duration: 0.8, delay: 0.3 + (index * 0.1) }}
          />
        </div>
        
        {/* Milestone indicators */}
        {phase.milestones && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-tertiary">
              {phase.completedMilestones || 0} of {phase.milestones} milestones
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: phase.milestones }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-2 h-2 rounded-full
                    ${i < (phase.completedMilestones || 0) ? 'bg-journey-completed' : 'bg-border-medium'}
                  `}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function ConnectedTimeline({
  phases,
  onPhaseSelect,
  showConnectedPaths = true,
  className = '',
  variant = 'full',
}: ConnectedTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  const handlePhaseSelect = (phase: JourneyPhase) => {
    onPhaseSelect?.(phase);
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-between px-4 py-3 ${className}`}>
        {phases.map((phase, index) => (
          <React.Fragment key={phase.id}>
            <MilestoneMarker
              phase={phase}
              index={index}
              onSelect={() => handlePhaseSelect(phase)}
              variant={variant}
            />
            {index < phases.length - 1 && (
              <div className="flex-1 h-0.5 bg-border-light mx-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-journey-path to-journey-milestone rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: phase.status === 'completed' ? '100%' : 
                           phase.status === 'current' ? `${phase.progress}%` : '0%'
                  }}
                  transition={{ duration: 0.8, delay: 0.5 + (index * 0.1) }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <div className="px-4 mb-6">
          <h3 className="text-dashboard-subtitle text-text-primary">Journey Progress</h3>
          <p className="text-sm text-text-secondary">Track your home buying milestones</p>
        </div>
        
        <div className="relative px-4">
          {/* Enhanced connected winding paths */}
          {showConnectedPaths && (
            <div className="absolute top-6 left-0 right-0 h-16 pointer-events-none">
              {phases.slice(0, -1).map((phase, index) => {
                const nextPhase = phases[index + 1];
                const fromX = (index / (phases.length - 1)) * 100;
                const toX = ((index + 1) / (phases.length - 1)) * 100;
                
                // Calculate progress for this path segment
                let segmentProgress = 0;
                if (phase.status === 'completed') {
                  segmentProgress = 100;
                } else if (phase.status === 'current') {
                  segmentProgress = phase.progress;
                }
                
                return (
                  <ConnectedPath
                    key={`path-${index}`}
                    fromX={fromX}
                    toX={toX}
                    progress={segmentProgress}
                    isActive={phase.status === 'current' || nextPhase.status === 'current'}
                    pathIndex={index}
                  />
                );
              })}
            </div>
          )}
          
          <div className="flex items-center justify-between relative z-10">
            {phases.map((phase, index) => (
              <MilestoneMarker
                key={phase.id}
                phase={phase}
                index={index}
                onSelect={() => handlePhaseSelect(phase)}
                variant={variant}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full variant with cards
  return (
    <div className={`relative ${className}`}>
      <div className="px-4 mb-4">
        <h3 className="text-dashboard-title text-text-primary">Your Home Buying Journey</h3>
        <p className="text-dashboard-subtitle text-text-secondary">
          Swipe to explore each phase in detail
        </p>
      </div>

      <div ref={containerRef} className="relative overflow-hidden">
        <motion.div
          className="flex space-x-4 px-4"
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: -((phases.length - 1) * 288),
            right: 0
          }}
          dragElastic={0.1}
        >
          {phases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              index={index}
              onSelect={() => handlePhaseSelect(phase)}
            />
          ))}
        </motion.div>
      </div>

      {/* Phase indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {phases.map((phase, index) => (
          <button
            key={phase.id}
            className={`
              w-2 h-2 rounded-full transition-all duration-200
              ${phase.status === 'completed' ? 'bg-journey-completed w-6' : ''}
              ${phase.status === 'current' ? 'bg-journey-current w-4' : ''}
              ${phase.status === 'upcoming' ? 'bg-border-medium' : ''}
            `}
            onClick={() => {
              const targetX = -(index * 288);
              x.set(targetX);
            }}
          />
        ))}
      </div>
    </div>
  );
}