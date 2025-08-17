'use client';

import React from 'react';

interface BuyRightLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showText?: boolean;
  className?: string;
}

export default function BuyRightLogo({ 
  size = 'md', 
  variant = 'default', 
  showText = true,
  className = '' 
}: BuyRightLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  };

  const iconSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          bg: 'bg-white',
          text: 'text-primary-600',
          brandText: 'text-white'
        };
      case 'dark':
        return {
          bg: 'bg-gray-800',
          text: 'text-white',
          brandText: 'text-gray-800'
        };
      default:
        return {
          bg: 'bg-primary-600',
          text: 'text-white',
          brandText: 'text-gray-800'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* App Icon - House with checkmark representing "Right" choice */}
      <div className={`${sizeClasses[size]} ${colors.bg} rounded-xl flex items-center justify-center shadow-sm`}>
        <div className="relative">
          {/* House icon */}
          <span className={`${iconSizeClasses[size]} ${colors.text}`}>🏡</span>
          {/* Small checkmark overlay indicating "Right" choice */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        </div>
      </div>
      
      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold ${colors.brandText}`}>
            Buy<span className="text-primary-600">Right</span>
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className="text-xs text-gray-500 -mt-1">Smart Home Buying</span>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Alternative compact version for headers
export function BuyRightIcon({ size = 'md', variant = 'default' }: Omit<BuyRightLogoProps, 'showText'>) {
  return <BuyRightLogo size={size} variant={variant} showText={false} />;
}

// Header version with tagline
export function BuyRightHeader({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <BuyRightLogo size="xl" showText={true} className="justify-center mb-2" />
      <p className="text-gray-600 text-sm font-medium">Your Guide to Smart Home Buying</p>
    </div>
  );
}