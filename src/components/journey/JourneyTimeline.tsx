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
}

interface JourneyTimelineProps {
  phases: JourneyPhase[];
  onPhaseSelect?: (phase: JourneyPhase) => void;
  className?: string;
}

const defaultPhases: JourneyPhase[] = [
  {
    id: 'planning',
    name: 'Planning',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
    progress: 85,
    status: 'completed',
    description: 'Assess finances and set budget',
    estimatedTime: '1-2 weeks',
  },
  {
    id: 'financing',
    name: 'Financing',
    icon: CurrencyDollarIcon,
    activeIcon: CurrencyDollarIconSolid,
    progress: 60,
    status: 'current',
    description: 'Get pre-approved for mortgage',
    estimatedTime: '2-3 weeks',
  },
  {
    id: 'searching',
    name: 'House Hunting',
    icon: MagnifyingGlassIcon,
    activeIcon: MagnifyingGlassIconSolid,
    progress: 0,
    status: 'upcoming',
    description: 'Find and view potential homes',
    estimatedTime: '4-8 weeks',
  },
  {
    id: 'inspection',
    name: 'Inspection',
    icon: ClipboardDocumentCheckIcon,
    activeIcon: ClipboardDocumentCheckIconSolid,
    progress: 0,
    status: 'upcoming',
    description: 'Inspect and negotiate offer',
    estimatedTime: '2-3 weeks',
  },
  {
    id: 'closing',
    name: 'Closing',
    icon: KeyIcon,
    activeIcon: KeyIconSolid,
    progress: 0,
    status: 'upcoming',
    description: 'Finalize purchase and get keys',
    estimatedTime: '3-4 weeks',
  },
];

export default function JourneyTimeline({
  phases = defaultPhases,
  onPhaseSelect,
  className = '',
}: JourneyTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Calculate constraints for dragging
  const maxScroll = Math.max(0, (phases.length * 280) - (containerRef.current?.offsetWidth || 0));
  
  const handleDragEnd = (_: any, info: PanInfo) => {
    const velocity = info.velocity.x;
    const currentX = x.get();
    
    if (Math.abs(velocity) > 500) {
      // Snap to next/previous item if velocity is high
      const direction = velocity > 0 ? 1 : -1;
      const snapTo = Math.min(Math.max(currentX + (direction * 200), -maxScroll), 0);
      x.set(snapTo);
    } else {
      // Snap to nearest item
      const itemWidth = 280;
      const snapIndex = Math.round(-currentX / itemWidth);
      const snapTo = Math.min(Math.max(-snapIndex * itemWidth, -maxScroll), 0);
      x.set(snapTo);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Timeline Header */}
      <div className="px-4 mb-4">
        <h3 className="text-mobile-h3 text-gray-900">Your Home Buying Journey</h3>
        <p className="text-mobile-caption text-gray-500 mt-1">Swipe to explore each phase</p>
      </div>

      {/* Swipeable Phase Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
      >
        <motion.div
          className="flex space-x-4 px-4 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxScroll, right: 0 }}
          onDragEnd={handleDragEnd}
          dragElastic={0.1}
        >
          {phases.map((phase, index) => {
            const Icon = phase.status === 'current' ? phase.activeIcon : phase.icon;
            
            return (
              <motion.div
                key={phase.id}
                className="flex-shrink-0 w-64 select-none"
                whileTap={{ scale: 0.95 }}
                onClick={() => onPhaseSelect?.(phase)}
              >
                {/* Phase Card */}
                <div className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-48">
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`
                        milestone-marker
                        ${phase.status === 'completed' ? 'milestone-completed' : ''}
                        ${phase.status === 'current' ? 'milestone-current' : ''}
                        ${phase.status === 'upcoming' ? 'milestone-future' : ''}
                      `}
                    >
                      <Icon className="icon-md" />
                    </div>
                    
                    {phase.status === 'current' && (
                      <div className="px-2 py-1 bg-progress-current/10 rounded-full">
                        <span className="text-xs font-medium text-progress-current">Active</span>
                      </div>
                    )}
                    
                    {phase.status === 'completed' && (
                      <div className="px-2 py-1 bg-progress-completed/10 rounded-full">
                        <span className="text-xs font-medium text-progress-completed">Complete</span>
                      </div>
                    )}
                  </div>

                  {/* Phase Info */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{phase.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                    
                    {phase.estimatedTime && (
                      <p className="text-xs text-gray-500">
                        Estimated time: {phase.estimatedTime}
                      </p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">Progress</span>
                      <span className="text-xs text-gray-500">{phase.progress}%</span>
                    </div>
                    
                    <div className="progress-bar">
                      <motion.div
                        className={`
                          h-full rounded-full transition-all duration-500
                          ${phase.status === 'completed' ? 'bg-progress-completed' : ''}
                          ${phase.status === 'current' ? 'bg-gradient-to-r from-progress-start to-progress-end' : ''}
                          ${phase.status === 'upcoming' ? 'bg-progress-future' : ''}
                        `}
                        initial={{ width: 0 }}
                        animate={{ width: `${phase.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Connection Line to Next Phase */}
                  {index < phases.length - 1 && (
                    <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-300 transform -translate-y-1/2" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Phase Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {phases.map((phase, index) => (
          <button
            key={phase.id}
            className={`
              w-2 h-2 rounded-full transition-colors duration-200
              ${phase.status === 'completed' ? 'bg-progress-completed' : ''}
              ${phase.status === 'current' ? 'bg-progress-current' : ''}
              ${phase.status === 'upcoming' ? 'bg-gray-300' : ''}
            `}
            onClick={() => {
              const targetX = -(index * 280);
              x.set(Math.min(Math.max(targetX, -maxScroll), 0));
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Compact timeline for smaller spaces
export function JourneyTimelineCompact({
  phases = defaultPhases,
  onPhaseSelect,
  className = '',
}: JourneyTimelineProps) {
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between px-4 py-2">
        {phases.map((phase, index) => {
          const Icon = phase.status === 'current' ? phase.activeIcon : phase.icon;
          
          return (
            <React.Fragment key={phase.id}>
              <motion.button
                className={`
                  flex flex-col items-center space-y-1 p-2 rounded-lg touch-target
                  ${phase.status === 'current' ? 'bg-primary-50' : ''}
                `}
                onClick={() => onPhaseSelect?.(phase)}
                whileTap={{ scale: 0.9 }}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${phase.status === 'completed' ? 'bg-progress-completed text-white' : ''}
                    ${phase.status === 'current' ? 'bg-progress-current text-white' : ''}
                    ${phase.status === 'upcoming' ? 'bg-gray-200 text-gray-500' : ''}
                  `}
                >
                  <Icon className="w-4 h-4" />
                </div>
                
                <span className="text-xs text-gray-600 max-w-[60px] truncate">
                  {phase.name}
                </span>
              </motion.button>
              
              {/* Connection Line */}
              {index < phases.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}