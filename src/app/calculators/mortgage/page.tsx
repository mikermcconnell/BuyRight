'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import MortgageCalculator from '@/components/calculators/MortgageCalculator';
import { CalculatorIntegrationService } from '@/lib/calculatorIntegration';
import { LockClosedIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function MortgageCalculatorPage() {
  const [hasCompletedAffordability, setHasCompletedAffordability] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Check completion status on mount
    setHasCompletedAffordability(CalculatorIntegrationService.hasCompletedAffordability());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--duolingo-background)' }}>
        <Header title="Mortgage Calculator" showBackButton />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
        <MobileNavigation />
      </div>
    );
  }

  if (!hasCompletedAffordability) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--duolingo-background)' }}>
        <Header title="Mortgage Calculator" showBackButton />
        
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <LockClosedIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="duolingo-title mb-4">Complete Affordability First</h1>
            <p className="duolingo-subtitle mb-8">
              You need to complete the affordability calculator before accessing mortgage calculations.
            </p>

            <div className="mobile-card mb-6">
              <div className="text-center">
                <h3 className="mobile-subtitle mb-4">Why This Order Matters:</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Know your realistic budget before exploring mortgages
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Understand closing costs and total cash needed
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Get pre-calculated values for mortgage scenarios
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Make informed decisions about loan terms
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => router.push('/calculators/affordability')}
              className="duolingo-button flex items-center mx-auto"
            >
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Start Affordability Calculator
            </button>
          </div>
        </div>

        <MobileNavigation />
      </div>
    );
  }

  // Demo mode - always show save option since we're using localStorage
  const showSaveOption = true;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--duolingo-background)' }}>
      <Header title="Mortgage Calculator" showBackButton />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <MortgageCalculator showSaveOption={showSaveOption} />
      </div>

      <MobileNavigation />
    </div>
  );
}