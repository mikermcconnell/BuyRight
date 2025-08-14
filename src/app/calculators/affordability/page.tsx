'use client';

import React from 'react';
import Header from '@/components/navigation/Header';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import AffordabilityCalculator from '@/components/calculators/AffordabilityCalculator';

export default function AffordabilityCalculatorPage() {
  // Demo mode - always show save option since we're using localStorage
  const showSaveOption = true;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--duolingo-background)' }}>
      <Header title="Affordability Calculator" showBackButton />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <AffordabilityCalculator showSaveOption={showSaveOption} />
      </div>

      <MobileNavigation />
    </div>
  );
}