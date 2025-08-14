'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import { DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function ClosingCostsCalculatorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after a short delay to show the message
    const timer = setTimeout(() => {
      router.push('/calculators/affordability');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--duolingo-background)' }}>
      <Header title="Redirecting..." showBackButton />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--duolingo-green)' }}>
            <DocumentTextIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">Calculator Updated!</h1>
          <p className="duolingo-subtitle mb-8">
            We've combined closing costs with our affordability calculator for a better experience.
          </p>

          <div className="mobile-card mb-6">
            <div className="text-center">
              <h3 className="mobile-subtitle mb-4">What's New:</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Affordability calculation with your budget
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Detailed closing cost breakdown
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  6-month emergency fund calculation
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Total cash required summary
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-600">Redirecting automatically in 3 seconds...</p>
            <button
              onClick={() => router.push('/calculators/affordability')}
              className="duolingo-button flex items-center"
            >
              Go to Affordability Calculator
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}