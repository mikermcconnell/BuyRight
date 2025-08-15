'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ClockIcon,
  HandRaisedIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

export default function OfferNegotiationStrategyGuide() {
  const router = useRouter();

  const quickTips = [
    {
      category: 'Pricing Strategy',
      icon: CurrencyDollarIcon,
      tips: [
        'Start 5-10% below asking in balanced markets, closer to asking in hot markets',
        'Factor in needed repairs or updates when determining offer price',
        'Consider comparable sales from last 3-6 months for pricing guidance',
        'Leave room for counter-offers but don\'t lowball in competitive markets'
      ]
    },
    {
      category: 'Market Intelligence',
      icon: ChartBarIcon,
      tips: [
        'Ask agent how long house has been on market - longer = more negotiating power',
        'Find out if seller has already bought another home (motivated to sell)',
        'Research if price has been reduced recently (sign of motivated seller)',
        'Know if there are other offers or showings scheduled'
      ]
    },
    {
      category: 'Negotiation Tactics',
      icon: HandRaisedIcon,
      tips: [
        'Include personal letter to seller if market allows',
        'Offer flexible closing date that works for seller\'s timeline',
        'Consider offering above asking but asking for closing cost credits',
        'Be prepared to respond to counter-offers within hours, not days'
      ]
    },
    {
      category: 'Competitive Edges',
      icon: ScaleIcon,
      tips: [
        'Get pre-approval letter to show you\'re serious and qualified',
        'Larger earnest money deposit shows commitment',
        'Minimal conditions make offer more attractive to sellers',
        'Cash offers (if possible) almost always win over financed offers'
      ]
    }
  ];

  const marketStrategies = [
    {
      type: 'Hot Seller\'s Market',
      color: 'red',
      characteristics: [
        'Multiple offers common',
        'Houses sell quickly',
        'Prices at or above asking'
      ],
      strategy: [
        'Offer at or above asking price',
        'Limit conditions to inspection only',
        'Shorter timeframes (5-7 days)',
        'Include escalation clause',
        'Be ready to decide same day'
      ]
    },
    {
      type: 'Balanced Market',
      color: 'blue',
      characteristics: [
        'Reasonable negotiation possible',
        'Houses sell in 2-4 weeks',
        'Some price flexibility'
      ],
      strategy: [
        'Start 5-10% below asking',
        'Include standard conditions',
        'Normal timeframes (10-14 days)',
        'Negotiate repairs after inspection',
        'Take time to consider offers'
      ]
    },
    {
      type: 'Buyer\'s Market',
      color: 'green',
      characteristics: [
        'More houses than buyers',
        'Houses sit longer',
        'Price reductions common'
      ],
      strategy: [
        'Start 10-15% below asking',
        'Include all desired conditions',
        'Ask seller to pay closing costs',
        'Negotiate harder on repairs',
        'Take your time deciding'
      ]
    }
  ];

  const commonMistakes = [
    {
      mistake: 'Making emotional decisions',
      solution: 'Stick to your budget and must-haves list'
    },
    {
      mistake: 'Waiting too long to respond',
      solution: 'Be ready to act within hours in competitive markets'
    },
    {
      mistake: 'Focusing only on price',
      solution: 'Consider closing date, conditions, and other terms'
    },
    {
      mistake: 'Not having backup options',
      solution: 'Keep looking at other houses while negotiating'
    },
    {
      mistake: 'Taking rejection personally',
      solution: 'Stay professional and consider counter-offers'
    }
  ];

  return (
    <div className="duolingo-container min-h-screen py-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Journey</span>
          </button>
          
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--duolingo-green)' }}>
            <HandRaisedIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">Offer Strategy Quick Guide</h1>
          <p className="duolingo-subtitle max-w-2xl mx-auto">
            Essential tips for pricing your offer and negotiating with sellers. 
            Work with your agent to create a winning strategy.
          </p>
        </div>

        {/* Quick Tips */}
        <div className="duolingo-card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Strategy Tips</h2>
          
          <div className="space-y-6">
            {quickTips.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                      <IconComponent className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.category}</h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Strategies */}
        <div className="duolingo-card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Strategy by Market Type</h2>
          
          <div className="space-y-6">
            {marketStrategies.map((market, index) => (
              <div key={index} className={`p-5 rounded-lg border-2 ${
                market.color === 'red' ? 'bg-red-50 border-red-200' :
                market.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                'bg-green-50 border-green-200'
              }`}>
                <h3 className={`text-lg font-bold mb-3 ${
                  market.color === 'red' ? 'text-red-900' :
                  market.color === 'blue' ? 'text-blue-900' :
                  'text-green-900'
                }`}>{market.type}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Characteristics:</h4>
                    <ul className="space-y-1">
                      {market.characteristics.map((char, charIndex) => (
                        <li key={charIndex} className="text-sm text-gray-700 flex items-start">
                          <CheckCircleIcon className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Your Strategy:</h4>
                    <ul className="space-y-1">
                      {market.strategy.map((strat, stratIndex) => (
                        <li key={stratIndex} className={`text-sm flex items-start ${
                          market.color === 'red' ? 'text-red-700' :
                          market.color === 'blue' ? 'text-blue-700' :
                          'text-green-700'
                        }`}>
                          <span className="mr-2 mt-1">→</span>
                          {strat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="duolingo-card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Avoid These Mistakes</h2>
          
          <div className="space-y-4">
            {commonMistakes.map((item, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900 mb-1">❌ {item.mistake}</p>
                    <p className="text-sm text-yellow-800">✅ {item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Reminders */}
        <div className="duolingo-card">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-start">
              <LightBulbIcon className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">💡 Remember</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Your agent knows the local market - listen to their advice</li>
                  <li>• Every house and situation is different - stay flexible</li>
                  <li>• Be prepared to walk away if terms don't work</li>
                  <li>• The "right" house at the "right" price will come along</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={() => router.back()}
              className="duolingo-button"
            >
              Back to Making an Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}