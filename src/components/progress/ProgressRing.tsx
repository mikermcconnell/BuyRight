'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'dashboard' | 'minimal';
  showMilestones?: boolean;
  milestones?: number[];
}

const sizeConfig = {
  xs: {
    container: 'w-16 h-16', // 64px - minimal indicators
    strokeWidth: 4,
    fontSize: 'text-xs',
    radius: 26,
  },
  sm: {
    container: 'w-20 h-20', // 80px - compact cards
    strokeWidth: 5,
    fontSize: 'text-sm',
    radius: 34,
  },
  md: {
    container: 'w-30 h-30', // 120px (exact design spec - mobile-first primary)
    strokeWidth: 6,
    fontSize: 'text-progress-large',
    radius: 54, // 120px diameter = 60px radius - 6px stroke = 54px
  },
  lg: {
    container: 'w-36 h-36', // 144px - desktop primary
    strokeWidth: 8,
    fontSize: 'text-4xl',
    radius: 64,
  },
  xl: {
    container: 'w-44 h-44', // 176px - hero displays
    strokeWidth: 10,
    fontSize: 'text-5xl',
    radius: 78,
  },
};

export default function ProgressRing({
  progress,
  size = 'md',
  showPercentage = true,
  showLabel = false,
  label,
  animated = true,
  className = '',
  onClick,
  variant = 'default',
  showMilestones = false,
  milestones = [],
}: ProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference;

  // Animate progress on mount or change
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const isInteractive = !!onClick;
  
  // Enhanced gradient and styling based on variant
  const getGradientId = () => `progress-gradient-${size}-${variant}`;
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'dashboard':
        return {
          background: 'bg-surface-elevated shadow-lg',
          border: 'border-2 border-border-light',
          textColor: 'text-text-primary',
        };
      case 'minimal':
        return {
          background: 'bg-transparent',
          border: '',
          textColor: 'text-text-secondary',
        };
      default:
        return {
          background: 'bg-surface-primary',
          border: 'border border-border-light',
          textColor: 'text-text-primary',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <motion.div
      className={`
        relative ${config.container} mx-auto rounded-full
        ${variantStyles.background} ${variantStyles.border}
        ${isInteractive ? 'cursor-pointer touch-target-lg hover:shadow-xl' : ''} 
        ${variant === 'dashboard' ? 'hover:scale-105 active:scale-95' : ''}
        transition-all duration-200 ${className}
      `}
      onClick={onClick}
      whileTap={isInteractive ? { scale: 0.95 } : undefined}
      whileHover={isInteractive ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.15, type: "spring", stiffness: 300 }}
    >
      {/* SVG Progress Ring */}
      <svg
        className="absolute inset-0 w-full h-full transform -rotate-90"
        viewBox={`0 0 ${(config.radius + config.strokeWidth) * 2} ${(config.radius + config.strokeWidth) * 2}`}
      >
        {/* Enhanced Gradient Definitions */}
        <defs>
          <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#007AFF" />
            <stop offset="50%" stopColor="#5856D6" />
            <stop offset="100%" stopColor="#AF52DE" />
          </linearGradient>
          
          {/* Glow effect for dashboard variant */}
          {variant === 'dashboard' && (
            <filter id={`glow-${size}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Background Circle */}
        <circle
          cx={config.radius + config.strokeWidth}
          cy={config.radius + config.strokeWidth}
          r={config.radius}
          fill="none"
          stroke={variant === 'minimal' ? '#F3F4F6' : '#E5E7EB'}
          strokeWidth={config.strokeWidth}
          className={variant === 'minimal' ? 'opacity-50' : 'opacity-30'}
        />

        {/* Milestone markers */}
        {showMilestones && milestones.map((milestone, index) => {
          const angle = (milestone / 100) * 2 * Math.PI;
          const x = config.radius + config.strokeWidth + Math.cos(angle - Math.PI/2) * config.radius;
          const y = config.radius + config.strokeWidth + Math.sin(angle - Math.PI/2) * config.radius;
          
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r={2}
              fill={displayProgress >= milestone ? '#34C759' : '#9CA3AF'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
            />
          );
        })}

        {/* Progress Circle with enhanced styling */}
        <motion.circle
          cx={config.radius + config.strokeWidth}
          cy={config.radius + config.strokeWidth}
          r={config.radius}
          fill="none"
          stroke={`url(#${getGradientId()})`}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          filter={variant === 'dashboard' ? `url(#glow-${size})` : undefined}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: animated ? strokeDashoffset : strokeDashoffset 
          }}
          transition={{ 
            duration: animated ? 1.2 : 0,
            ease: [0.4, 0, 0.2, 1],
            delay: animated ? 0.3 : 0
          }}
          className={variant === 'dashboard' ? 'drop-shadow-lg' : 'drop-shadow-sm'}
        />
      </svg>

      {/* Enhanced Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {showPercentage && (
            <motion.div
              className={`
                font-bold ${config.fontSize} leading-none
                ${variantStyles.textColor}
                ${variant === 'dashboard' ? 'drop-shadow-sm' : ''}
              `}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: animated ? 0.8 : 0,
                type: "spring",
                stiffness: 200
              }}
            >
              {Math.round(displayProgress)}%
            </motion.div>
          )}
          {showLabel && label && (
            <motion.div
              className={`
                text-xs mt-1 font-medium max-w-20 truncate
                ${variant === 'minimal' ? 'text-text-tertiary' : 'text-text-secondary'}
              `}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: animated ? 1 : 0 }}
            >
              {label}
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Interactive Highlight */}
      {isInteractive && (
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-transparent"
          whileHover={{ borderColor: 'rgba(0, 122, 255, 0.3)' }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Dashboard variant glow effect */}
      {variant === 'dashboard' && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 opacity-20 pointer-events-none" />
      )}
    </motion.div>
  );
}

// Compact version for smaller spaces
export function ProgressRingCompact({
  progress,
  className = '',
  variant = 'default',
}: {
  progress: number;
  className?: string;
  variant?: 'default' | 'minimal';
}) {
  return (
    <ProgressRing
      progress={progress}
      size="sm"
      showPercentage={true}
      showLabel={false}
      animated={false}
      variant={variant}
      className={className}
    />
  );
}

// Interactive version with click handler - Enhanced for 120px specification
export function ProgressRingInteractive({
  progress,
  onTap,
  label = "Journey Progress",
  className = '',
  variant = 'dashboard',
  showMilestones = false,
  milestones = [],
}: {
  progress: number;
  onTap: () => void;
  label?: string;
  className?: string;
  variant?: 'default' | 'dashboard' | 'minimal';
  showMilestones?: boolean;
  milestones?: number[];
}) {
  return (
    <ProgressRing
      progress={progress}
      size="md" // 120px exact design specification (mobile-first primary)
      showPercentage={true}
      showLabel={true}
      label={label}
      animated={true}
      variant={variant}
      showMilestones={showMilestones}
      milestones={milestones}
      onClick={onTap}
      className={`touch-target-lg ${className}`} // Ensure 44px+ touch target
    />
  );
}

// Hero version for landing and completion screens
export function ProgressRingHero({
  progress,
  title,
  subtitle,
  onTap,
  className = '',
  showMilestones = true,
  milestones = [20, 40, 60, 80],
}: {
  progress: number;
  title: string;
  subtitle?: string;
  onTap?: () => void;
  className?: string;
  showMilestones?: boolean;
  milestones?: number[];
}) {
  return (
    <div className={`text-center ${className}`}>
      <ProgressRing
        progress={progress}
        size="xl" // 176px for hero displays
        showPercentage={true}
        showLabel={false}
        animated={true}
        variant="dashboard"
        showMilestones={showMilestones}
        milestones={milestones}
        onClick={onTap}
        className="mb-4"
      />
      <motion.h2 
        className="text-dashboard-title text-text-primary mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          className="text-dashboard-subtitle text-text-secondary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// Minimal indicator for cards and lists
export function ProgressRingMinimal({
  progress,
  size = 'xs',
  className = '',
}: {
  progress: number;
  size?: 'xs' | 'sm';
  className?: string;
}) {
  return (
    <ProgressRing
      progress={progress}
      size={size}
      showPercentage={false}
      showLabel={false}
      animated={true}
      variant="minimal"
      className={className}
    />
  );
}