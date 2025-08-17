'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function InterestRateComparisonGuide() {
  const router = useRouter();

  const brokerPros = [
    'Access to multiple lenders in one place',
    'Can shop rates from 50+ lenders',
    'Often get better rates than posted bank rates',
    'Free service (paid by lenders)',
    'Expertise in matching your situation to best lender',
    'Handle paperwork and applications',
    'Can access specialty lenders for unique situations'
  ];

  const brokerCons = [
    'May not have access to all lenders',
    'Some lenders only work direct (e.g., some credit unions)',
    'Quality varies between brokers',
    'Less direct control over application process',
    'May push towards lenders that pay higher commissions'
  ];

  const bankPros = [
    'Direct relationship with your lender',
    'May offer package deals (banking + mortgage)',
    'Familiar with your financial history if existing customer',
    'Complete control over application process',
    'Some banks offer exclusive rates to existing customers',
    'Clear accountability and service standards'
  ];

  const bankCons = [
    'Limited to that bank\'s products and rates',
    'Posted rates often higher than available elsewhere',
    'Less negotiating power',
    'May not be best match for your situation',
    'Limited specialty products',
    'Potential bias towards bank\'s own products'
  ];

  const comparisonSites = [
    {
      name: 'WOWA.ca',
      url: 'https://wowa.ca/mortgage-rates',
      description: 'Comprehensive Canadian mortgage rate comparison with real-time rates from major lenders',
      features: ['Real-time rates', 'Mortgage calculators', 'Lender reviews', 'Educational content']
    },
    {
      name: 'RateHub.ca',
      url: 'https://www.ratehub.ca/best-mortgage-rates',
      description: 'Compare mortgage rates and connect with brokers',
      features: ['Rate comparison', 'Broker matching', 'Mortgage tools', 'Expert advice']
    },
    {
      name: 'Rates.ca',
      url: 'https://rates.ca/mortgage',
      description: 'Compare rates and get quotes from multiple lenders',
      features: ['Multiple quotes', 'Rate alerts', 'Mortgage news', 'Calculator tools']
    }
  ];

  const majorLenders = [
    { name: 'RBC Royal Bank', type: 'Big 6 Bank', specialty: 'Full service banking' },
    { name: 'TD Canada Trust', type: 'Big 6 Bank', specialty: 'Customer service focus' },
    { name: 'Scotiabank', type: 'Big 6 Bank', specialty: 'International banking' },
    { name: 'BMO Bank of Montreal', type: 'Big 6 Bank', specialty: 'Business banking' },
    { name: 'CIBC', type: 'Big 6 Bank', specialty: 'Digital banking' },
    { name: 'National Bank', type: 'Big 6 Bank', specialty: 'Quebec focused' },
    { name: 'First National', type: 'Monoline Lender', specialty: 'Competitive rates' },
    { name: 'MCAP', type: 'Monoline Lender', specialty: 'Alternative lending' },
    { name: 'Tangerine', type: 'Online Bank', specialty: 'Simple products' },
    { name: 'ING Direct (now Tangerine)', type: 'Online Bank', specialty: 'Low fees' }
  ];

  return (
    <div className="duolingo-container min-h-screen py-8">
      <div className="w-full max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => router.push('/dashboard')}
              className="hover:text-green-600 transition-colors"
              aria-label="Navigate to dashboard"
            >
              Dashboard
            </button>
            <span>→</span>
            <button
              onClick={() => router.back()}
              className="hover:text-green-600 transition-colors"
              aria-label="Go back to previous page"
            >
              Back
            </button>
            <span>→</span>
            <span className="text-gray-800 font-medium">Interest Rate Comparison Guide</span>
          </div>
        </nav>

        {/* Header */}
        <div className="duolingo-card mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="duolingo-title mb-2">Complete Guide to Comparing Mortgage Interest Rates</h1>
            <p className="duolingo-subtitle">
              Everything you need to know about finding the best mortgage rate in Canada
            </p>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="duolingo-card mb-8">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">🚀</span>
            Quick Start: Best Rate Comparison Sites
          </h2>
          
          <div className="space-y-4">
            {comparisonSites.map((site, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-blue-900">{site.name}</h3>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-all duration-200"
                  >
                    Visit Site
                    <ExternalLinkIcon className="w-4 h-4 ml-2" />
                  </a>
                </div>
                <p className="text-blue-800 text-sm mb-3">{site.description}</p>
                <div className="flex flex-wrap gap-2">
                  {site.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mortgage Broker vs Bank Comparison */}
        <div className="duolingo-card mb-8">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">⚖️</span>
            Mortgage Broker vs Bank: Complete Comparison
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mortgage Broker */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <UserGroupIcon className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-green-900">Mortgage Broker</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Advantages
                </h4>
                <ul className="space-y-2">
                  {brokerPros.map((pro, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start">
                      <span className="text-green-500 mr-2 flex-shrink-0">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  Disadvantages
                </h4>
                <ul className="space-y-2">
                  {brokerCons.map((con, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start">
                      <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bank */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BuildingLibraryIcon className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-blue-900">Bank Direct</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Advantages
                </h4>
                <ul className="space-y-2">
                  {bankPros.map((pro, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start">
                      <span className="text-blue-500 mr-2 flex-shrink-0">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  Disadvantages
                </h4>
                <ul className="space-y-2">
                  {bankCons.map((con, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start">
                      <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Comparison Strategy */}
        <div className="duolingo-card mb-8">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">🎯</span>
            Smart Rate Shopping Strategy
          </h2>

          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-3">📝 Step-by-Step Process</h3>
              <ol className="space-y-3 text-sm text-yellow-800">
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  <div>
                    <strong>Check online comparison sites</strong> - Start with WOWA.ca, RateHub, and Rates.ca to get baseline rates
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Contact 2-3 mortgage brokers</strong> - Get quotes from different brokers to compare their offerings
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                  <div>
                    <strong>Check your current bank</strong> - Especially if you're a long-term customer with multiple products
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                  <div>
                    <strong>Compare total costs</strong> - Look at rate, fees, penalties, and terms, not just the interest rate
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">5</span>
                  <div>
                    <strong>Negotiate</strong> - Use competing offers to negotiate better terms
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Major Lenders Overview */}
        <div className="duolingo-card mb-8">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">🏦</span>
            Major Canadian Lenders
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {majorLenders.map((lender, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-1">{lender.name}</h3>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full w-fit">
                    {lender.type}
                  </span>
                  <span className="text-sm text-gray-600">{lender.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Tips */}
        <div className="duolingo-card mb-8">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">💡</span>
            Pro Tips for Rate Shopping
          </h2>

          <div className="space-y-4">
            <div className="result-card-info blue">
              <h4 className="font-semibold text-blue-900 mb-3">💰 Beyond the Interest Rate</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  Compare Annual Percentage Rate (APR) which includes fees
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  Check prepayment privileges (can you pay extra without penalty?)
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  Understand penalty calculations for breaking early
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  Look at portability options if you might move
                </li>
              </ul>
            </div>

            <div className="result-card-info yellow">
              <h4 className="font-semibold text-yellow-900 mb-3">⚠️ Common Mistakes to Avoid</h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start">
                  <span className="font-bold mr-3 text-red-600">✗</span>
                  Only looking at the big banks
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3 text-red-600">✗</span>
                  Focusing only on posted rates (always ask for discounts)
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3 text-red-600">✗</span>
                  Not reading the fine print on terms and conditions
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3 text-red-600">✗</span>
                  Making multiple credit applications in a short time
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="duolingo-card mb-8">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">⏰</span>
            Rate Shopping Timeline
          </h2>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">📅 Recommended Timeline</h3>
              <div className="space-y-3 text-sm text-green-800">
                <div className="flex items-start">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-3">Week 1</span>
                  <span>Research online, contact brokers, get initial quotes</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-3">Week 2</span>
                  <span>Submit applications to top 3 choices, compare detailed offers</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-3">Week 3</span>
                  <span>Negotiate final terms, make decision, get rate hold</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="duolingo-card">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Start Comparing?</h3>
            <p className="text-gray-600 mb-6">
              Use this guide to find the best mortgage rate for your situation. Remember: even 0.1% can save thousands over your mortgage term.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wowa.ca/mortgage-rates"
                target="_blank"
                rel="noopener noreferrer"
                className="duolingo-button inline-flex items-center"
              >
                Start on WOWA.ca
                <ExternalLinkIcon className="w-4 h-4 ml-2" />
              </a>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
              >
                Back to Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}