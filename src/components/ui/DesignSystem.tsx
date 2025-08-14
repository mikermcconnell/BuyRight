'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Design System Utility - Create if not exists
export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

// Enterprise Button Component
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:pointer-events-none disabled:opacity-50 touch-target-sm",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-200",
        secondary: "bg-surface-secondary text-text-primary border border-border-medium hover:bg-surface-tertiary focus:ring-gray-200",
        outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-200",
        ghost: "text-text-secondary hover:bg-surface-secondary hover:text-text-primary focus:ring-gray-200",
        success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-200",
        warning: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl focus:ring-orange-200",
        danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-200",
      },
      size: {
        sm: "text-sm px-4 py-2 min-h-10",
        md: "text-base px-6 py-3 min-h-12",
        lg: "text-lg px-8 py-4 min-h-14",
        xl: "text-xl px-10 py-5 min-h-16",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

// Enterprise Card Component
const cardVariants = cva(
  "rounded-2xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-surface-elevated border-border-light shadow-sm hover:shadow-md",
        outlined: "bg-transparent border-border-medium hover:border-border-strong",
        filled: "bg-surface-secondary border-border-light hover:bg-surface-tertiary",
        elevated: "bg-surface-elevated border-border-light shadow-lg hover:shadow-xl",
        interactive: "bg-surface-elevated border-border-light shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98]",
        gradient: "bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 shadow-sm hover:shadow-md",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Enterprise Input Component
const inputVariants = cva(
  "flex w-full rounded-xl border bg-surface-primary px-4 py-3 text-base transition-all duration-200 placeholder:text-text-tertiary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-border-medium focus:border-primary-500 focus:ring-4 focus:ring-primary-200",
        error: "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200",
        success: "border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-200",
      },
      size: {
        sm: "h-10 px-3 py-2 text-sm",
        md: "h-12 px-4 py-3",
        lg: "h-14 px-5 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Enterprise Badge Component
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-transparent bg-surface-secondary text-text-primary",
        secondary: "border-transparent bg-surface-tertiary text-text-secondary",
        destructive: "border-transparent bg-red-500 text-white",
        outline: "text-text-secondary border-border-medium",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-orange-500 text-white",
        info: "border-transparent bg-blue-500 text-white",
        primary: "border-transparent bg-primary-500 text-white",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-base px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

// Progress Component
interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
}

export function Progress({ 
  value, 
  max = 100, 
  className = '', 
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
}: ProgressProps) {
  const percentage = Math.round((value / max) * 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-orange-500 to-orange-600',
    danger: 'from-red-500 to-red-600',
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          <span className="text-sm text-text-secondary">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-tertiary rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${variantClasses[variant]} rounded-full shadow-sm`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Alert Component
const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3",
  {
    variants: {
      variant: {
        default: "bg-surface-secondary text-text-primary border-border-medium",
        destructive: "bg-red-50 text-red-900 border-red-200",
        success: "bg-green-50 text-green-900 border-green-200",
        warning: "bg-orange-50 text-orange-900 border-orange-200",
        info: "bg-blue-50 text-blue-900 border-blue-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

// Typography Components
export function Heading1({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={`text-4xl md:text-5xl font-bold text-text-primary leading-tight ${className}`}>
      {children}
    </h1>
  );
}

export function Heading2({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-3xl md:text-4xl font-bold text-text-primary leading-tight ${className}`}>
      {children}
    </h2>
  );
}

export function Heading3({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-2xl md:text-3xl font-semibold text-text-primary leading-tight ${className}`}>
      {children}
    </h3>
  );
}

export function BodyText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-base md:text-lg text-text-secondary leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function Caption({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm text-text-tertiary ${className}`}>
      {children}
    </p>
  );
}