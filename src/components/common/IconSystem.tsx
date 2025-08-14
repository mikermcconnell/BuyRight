'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  KeyIcon,
  CalculatorIcon,
  ChartBarIcon,
  MapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import {
  HomeIcon as HomeIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
  KeyIcon as KeyIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
} from '@heroicons/react/24/solid';

// Icon size configurations following the 16-20px mobile-first design
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconVariant = 'outline' | 'solid';
export type IconColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'danger';

interface IconProps {
  name: string;
  size?: IconSize;
  variant?: IconVariant;
  color?: IconColor;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

// Icon registry with both outline and solid variants
const iconRegistry = {
  home: { outline: HomeIcon, solid: HomeIconSolid },
  currency: { outline: CurrencyDollarIcon, solid: CurrencyDollarIconSolid },
  search: { outline: MagnifyingGlassIcon, solid: MagnifyingGlassIconSolid },
  clipboard: { outline: ClipboardDocumentCheckIcon, solid: ClipboardDocumentCheckIconSolid },
  key: { outline: KeyIcon, solid: KeyIconSolid },
  calculator: { outline: CalculatorIcon, solid: CalculatorIcon },
  chart: { outline: ChartBarIcon, solid: ChartBarIcon },
  map: { outline: MapIcon, solid: MapIcon },
  check: { outline: CheckCircleIcon, solid: CheckCircleIconSolid },
  warning: { outline: ExclamationTriangleIcon, solid: ExclamationTriangleIconSolid },
  info: { outline: InformationCircleIcon, solid: InformationCircleIconSolid },
  sparkles: { outline: SparklesIcon, solid: SparklesIcon },
  clock: { outline: ClockIcon, solid: ClockIcon },
};

// Size class mappings for consistent icon sizing - Updated per design specs
const sizeClasses: Record<IconSize, string> = {
  xs: 'icon-xs',      // 12px - tiny indicators
  sm: 'icon-sm',      // 16px - UI actions (design spec preferred)
  md: 'icon-md',      // 20px - milestone/primary actions (design spec preferred)
  lg: 'icon-lg',      // 24px - interactive touch state
  xl: 'icon-xl',      // 32px - milestone icons
  '2xl': 'icon-2xl',  // 40px - large milestone icons
};

// Color class mappings using design system colors
const colorClasses: Record<IconColor, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  tertiary: 'text-text-tertiary',
  accent: 'text-text-accent',
  success: 'text-journey-completed',
  warning: 'text-journey-current',
  danger: 'text-red-500',
};

/**
 * Standardized Icon component with consistent sizing and accessibility
 * Follows the 16-20px mobile-first design system
 */
export function Icon({
  name,
  size = 'md',
  variant = 'outline',
  color = 'primary',
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  ...props
}: IconProps & React.SVGProps<SVGSVGElement>) {
  const iconDef = iconRegistry[name as keyof typeof iconRegistry];
  
  if (!iconDef) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  const IconComponent = iconDef[variant] || iconDef.outline;
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  return (
    <IconComponent
      className={`${sizeClass} ${colorClass} ${className}`.trim()}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
}

/**
 * Icon with touch-friendly container and hover states
 * Perfect for buttons and interactive elements
 * Meets 44px minimum touch target requirement from design specs
 */
export function TouchIcon({
  name,
  size = 'md',
  variant = 'outline',
  color = 'primary',
  touchSize = 'md',
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: IconProps & {
  touchSize?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  disabled?: boolean;
}) {
  const touchSizeClasses = {
    sm: 'icon-touch-sm',     // 44px touch area (minimum spec)
    md: 'icon-touch-md',     // 48px touch area (preferred spec)
    lg: 'icon-touch-lg',     // 52px touch area (comfortable spec)
    xl: 'icon-touch-xl',     // 64px touch area (large spec)
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${touchSizeClasses[touchSize]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `.trim()}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      aria-label={ariaLabel}
      {...props}
    >
      <Icon
        name={name}
        size={size}
        variant={variant}
        color={disabled ? 'tertiary' : color}
      />
    </motion.button>
  );
}

/**
 * Icon with decorative container background
 * Perfect for feature cards and status indicators
 */
export function ContainerIcon({
  name,
  size = 'md',
  variant = 'outline',
  containerSize = 'md',
  containerColor = 'primary',
  className = '',
  ...props
}: IconProps & {
  containerSize?: 'sm' | 'md' | 'lg' | 'xl';
  containerColor?: IconColor | 'journey-current' | 'journey-completed' | 'journey-future';
}) {
  const containerSizeClasses = {
    sm: 'icon-container-sm',
    md: 'icon-container-md',
    lg: 'icon-container-lg',
    xl: 'icon-container-xl',
  };

  const containerColorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-surface-secondary',
    tertiary: 'bg-surface-tertiary',
    accent: 'bg-journey-path',
    success: 'bg-journey-completed',
    warning: 'bg-journey-current',
    danger: 'bg-red-500',
    'journey-current': 'bg-journey-current',
    'journey-completed': 'bg-journey-completed',
    'journey-future': 'bg-surface-tertiary',
  };

  const iconColor = containerColor === 'secondary' || containerColor === 'tertiary' || containerColor === 'journey-future'
    ? 'secondary'
    : 'primary';

  return (
    <div className={`
      ${containerSizeClasses[containerSize]}
      ${containerColorClasses[containerColor as keyof typeof containerColorClasses]}
      ${className}
    `.trim()}>
      <Icon
        name={name}
        size={size}
        variant={variant}
        color={iconColor}
        className={iconColor === 'primary' ? 'text-white' : ''}
        {...props}
      />
    </div>
  );
}

/**
 * Animated icon with entrance effects
 * Perfect for success states and milestone achievements
 */
export function AnimatedIcon({
  name,
  size = 'md',
  variant = 'solid',
  color = 'success',
  animation = 'bounce',
  delay = 0,
  className = '',
  ...props
}: IconProps & {
  animation?: 'bounce' | 'pulse' | 'scale' | 'rotate' | 'shake';
  delay?: number;
}) {
  const animationVariants = {
    bounce: {
      initial: { scale: 0, y: 50 },
      animate: { 
        scale: 1, 
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 10,
          delay 
        }
      }
    },
    pulse: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.2, 1],
        transition: { 
          duration: 0.6, 
          repeat: Infinity, 
          repeatType: "reverse" as const,
          delay 
        }
      }
    },
    scale: {
      initial: { scale: 0 },
      animate: { 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay 
        }
      }
    },
    rotate: {
      initial: { rotate: -180, scale: 0 },
      animate: { 
        rotate: 0, 
        scale: 1,
        transition: { 
          duration: 0.5, 
          ease: "easeOut",
          delay 
        }
      }
    },
    shake: {
      initial: { x: 0 },
      animate: { 
        x: [0, -5, 5, -5, 5, 0],
        transition: { 
          duration: 0.5,
          delay 
        }
      }
    }
  };

  return (
    <motion.div
      initial={animationVariants[animation].initial}
      animate={animationVariants[animation].animate}
      className={className}
    >
      <Icon
        name={name}
        size={size}
        variant={variant}
        color={color}
        {...props}
      />
    </motion.div>
  );
}

/**
 * Status icon with semantic meaning
 * Perfect for alerts, notifications, and state indicators
 */
export function StatusIcon({
  status,
  size = 'md',
  showBackground = false,
  className = '',
  ...props
}: {
  status: 'success' | 'warning' | 'danger' | 'info' | 'pending';
  size?: IconSize;
  showBackground?: boolean;
  className?: string;
}) {
  const statusConfig = {
    success: {
      name: 'check',
      color: 'success' as IconColor,
      variant: 'solid' as IconVariant,
      bgClass: 'bg-success-50 border-success-200',
    },
    warning: {
      name: 'warning',
      color: 'warning' as IconColor,
      variant: 'solid' as IconVariant,
      bgClass: 'bg-warning-50 border-warning-200',
    },
    danger: {
      name: 'warning',
      color: 'danger' as IconColor,
      variant: 'solid' as IconVariant,
      bgClass: 'bg-red-50 border-red-200',
    },
    info: {
      name: 'info',
      color: 'accent' as IconColor,
      variant: 'solid' as IconVariant,
      bgClass: 'bg-primary-50 border-primary-200',
    },
    pending: {
      name: 'clock',
      color: 'tertiary' as IconColor,
      variant: 'outline' as IconVariant,
      bgClass: 'bg-surface-tertiary border-border-medium',
    },
  };

  const config = statusConfig[status];

  if (showBackground) {
    return (
      <div className={`
        w-8 h-8 rounded-full border flex items-center justify-center
        ${config.bgClass} ${className}
      `.trim()}>
        <Icon
          name={config.name}
          size={size}
          variant={config.variant}
          color={config.color}
          {...props}
        />
      </div>
    );
  }

  return (
    <Icon
      name={config.name}
      size={size}
      variant={config.variant}
      color={config.color}
      className={className}
      {...props}
    />
  );
}

// Export commonly used icon names for type safety
export const iconNames = Object.keys(iconRegistry) as Array<keyof typeof iconRegistry>;

// Export for use in other components
export { iconRegistry, sizeClasses, colorClasses };