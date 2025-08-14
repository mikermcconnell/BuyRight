'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import { CalculatorIntegrationService } from '@/lib/calculatorIntegration';
import {
  CurrencyDollarIcon,
  CalculatorIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

interface Calculator {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  benefits: string[];
  requiresCompletion?: string[]; // Which calculators must be completed first
  status?: 'available' | 'locked' | 'completed';
}

export default function CalculatorsPage() {
  const router = useRouter();
  const [hasCompletedAffordability, setHasCompletedAffordability] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag and check completion status on mount
    setIsClient(true);
    setHasCompletedAffordability(CalculatorIntegrationService.hasCompletedAffordability());
  }, []);

  const calculators: Calculator[] = [
    {
      id: 'affordability',
      name: 'Affordability & Closing Costs Calculator',
      description: 'Find out how much you can afford, closing costs, and total cash required',
      icon: CurrencyDollarIcon,
      href: '/calculators/affordability',
      difficulty: 'easy',
      estimatedTime: '5 minutes',
      benefits: ['Personalized budget', 'Closing cost breakdown', 'Emergency fund calculation', 'Complete cash requirements'],
      status: 'available',
    },
    {
      id: 'mortgage',
      name: 'Mortgage Calculator',
      description: 'Calculate monthly payments, total interest, and payment breakdowns',
      icon: CalculatorIcon,
      href: '/calculators/mortgage',
      difficulty: 'easy',
      estimatedTime: '3 minutes',
      benefits: ['Payment breakdown', 'Interest analysis', 'Term comparison'],
      requiresCompletion: ['affordability'],
      status: isClient ? (hasCompletedAffordability ? 'available' : 'locked') : 'locked',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': 
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': 
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': 
        return 'bg-red-100 text-red-700 border-red-200';
      default: 
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--duolingo-background)' }}>
      <Header title="Financial Calculators" showBackButton />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mobile-card text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <CalculatorIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="mobile-title text-gray-900">Plan Your Home Purchase</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Use our comprehensive financial calculators to understand affordability, 
            mortgage payments, and closing costs before you buy.
          </p>
        </div>

        {/* Calculator Cards */}
        <div className="space-y-4 mb-8">
          {calculators.map((calculator, index) => {
            const IconComponent = calculator.icon;
            const isRecommended = index === 0; // First calculator is recommended
            const isLocked = calculator.status === 'locked';
            const isCompleted = calculator.status === 'completed';
            
            return (
              <div
                key={calculator.id}
                className={`mobile-card transition-all duration-300 ${
                  !isLocked ? 'hover:shadow-lg cursor-pointer group' : 'cursor-not-allowed opacity-60'
                } ${
                  isRecommended ? 'ring-2 ring-green-200' : ''
                } ${
                  isCompleted ? 'ring-2 ring-green-300 bg-green-50' : ''
                }`}
                onClick={() => {
                  if (!isLocked) {
                    router.push(calculator.href);
                  }
                }}
              >
                {isRecommended && !isCompleted && !isLocked && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Start Here
                    </div>
                  </div>
                )}
                
                {isCompleted && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Completed
                    </div>
                  </div>
                )}
                
                {isLocked && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <LockClosedIcon className="w-4 h-4 mr-1" />
                      Complete Affordability First
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isLocked 
                        ? 'bg-gray-100' 
                        : 'bg-green-50 group-hover:bg-green-100'
                    }`}>
                      {isLocked ? (
                        <LockClosedIcon className="w-6 h-6 text-gray-400" />
                      ) : (
                        <IconComponent className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`mobile-subtitle transition-colors ${
                      isLocked 
                        ? 'text-gray-500' 
                        : 'text-gray-900 group-hover:text-green-700'
                    }`}>
                      {calculator.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {calculator.description}
                    </p>
                    
                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {calculator.benefits.map((benefit, i) => (
                        <div
                          key={i}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {benefit}
                        </div>
                      ))}
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(calculator.difficulty)}`}>
                          {calculator.difficulty}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {calculator.estimatedTime}
                        </div>
                      </div>
                      
                      <div className={`font-medium text-sm transition-transform ${
                        isLocked 
                          ? 'text-gray-400' 
                          : 'text-green-600 group-hover:translate-x-1'
                      }`}>
                        {isLocked ? 'Locked 🔒' : isCompleted ? 'View Results →' : 'Start Calculator →'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* Call to Action */}
        <div className="mobile-card text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Ready to get started?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Get your complete financial picture with our comprehensive affordability and closing cost calculator.
          </p>
          <button
            onClick={() => router.push('/calculators/affordability')}
            className="duolingo-button max-w-xs mx-auto"
          >
            Start Financial Assessment
          </button>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}