'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  LightBulbIcon,
  CheckCircleIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

export default function OfferSubmissionTimelineGuide() {
  const router = useRouter();

  const timelineSteps = [
    {
      timeframe: 'Same Day',
      title: 'View the House',
      description: 'See the property and make your decision',
      details: [
        'Tour the home with your agent',
        'Take notes and photos if allowed',
        'Discuss initial thoughts with agent',
        'Decide if you want to make an offer'
      ],
      urgency: 'high'
    },
    {
      timeframe: '1-3 Hours',
      title: 'Prepare Your Offer',
      description: 'Work with agent to structure competitive offer',
      details: [
        'Analyze comparable sales for pricing',
        'Decide on conditions and terms',
        'Determine earnest money amount',
        'Set closing date preferences'
      ],
      urgency: 'high'
    },
    {
      timeframe: '30 Minutes',
      title: 'Submit Written Offer',
      description: 'Agent submits official purchase agreement',
      details: [
        'Review all terms one final time',
        'Sign purchase agreement',
        'Agent submits to seller\'s agent',
        'Await response from seller'
      ],
      urgency: 'high'
    },
    {
      timeframe: '2-24 Hours',
      title: 'Seller Response',
      description: 'Seller accepts, rejects, or counter-offers',
      details: [
        'Seller reviews your offer',
        'May accept, reject, or counter',
        'Counter-offers change price or terms',
        'You have limited time to respond'
      ],
      urgency: 'medium'
    },
    {
      timeframe: '1-6 Hours',
      title: 'Your Counter-Response',
      description: 'Respond to seller\'s counter-offer quickly',
      details: [
        'Review counter-offer terms',
        'Decide to accept, reject, or counter',
        'Each round narrows the negotiation',
        'Usually resolves in 2-3 rounds'
      ],
      urgency: 'high'
    }
  ];

  const urgencyTips = [
    {
      title: 'Why Speed Matters',
      icon: BoltIcon,
      tips: [
        'Hot markets: Multiple offers often submitted same day',
        'Sellers prefer quick, decisive buyers',
        'Good houses don\'t stay on market long',
        'Delays can cost you the house'
      ]
    },
    {
      title: 'Be Prepared',
      icon: CheckCircleIcon,
      tips: [
        'Have pre-approval letter ready',
        'Know your maximum budget',
        'Agent has blank purchase agreements',
        'Be available for quick decisions'
      ]
    },
    {
      title: 'Stay Flexible',
      icon: LightBulbIcon,
      tips: [
        'Clear your schedule when house hunting',
        'Be ready to see houses on short notice',
        'Have financing pre-arranged',
        'Trust your agent\'s timing advice'
      ]
    }
  ];

  const marketScenarios = [
    {
      type: 'Hot Market',
      timeline: 'Same day decisions',
      description: 'Houses receive multiple offers quickly',
      strategy: [
        'View house early in the day',
        'Make offer within 2-3 hours',
        'Best offer deadline often same evening',
        'Counter-offers happen in minutes/hours'
      ],
      color: 'red'
    },
    {
      type: 'Balanced Market',
      timeline: '1-2 day process',
      description: 'Normal negotiation timeframes',
      strategy: [
        'View house and think overnight if needed',
        'Submit offer within 24 hours',
        'Seller responds within 24-48 hours',
        'Counter negotiations over 2-3 days'
      ],
      color: 'blue'
    },
    {
      type: 'Buyer\'s Market',
      timeline: 'More relaxed timing',
      description: 'Sellers more patient with negotiations',
      strategy: [
        'Take time to view multiple times',
        'Submit offer within 2-3 days',
        'Longer response times acceptable',
        'Extended negotiation periods possible'
      ],
      color: 'green'
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
            <ClockIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">Offer Timeline: Things Move Fast!</h1>
          <p className="duolingo-subtitle max-w-3xl mx-auto">
            Understand how quickly you need to act when making offers. 
            In competitive markets, speed and preparation are essential.
          </p>
        </div>

        {/* Timeline */}
        <div className="duolingo-card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Typical Offer Timeline</h2>
          
          <div className="space-y-6">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className={`w-20 flex-shrink-0 text-center mr-4 ${
                  step.urgency === 'high' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold ${
                    step.urgency === 'high' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-xs font-medium">{step.timeframe}</div>
                </div>
                
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                  
                  <ul className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-sm text-gray-700 flex items-start">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Scenarios */}
        <div className="duolingo-card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Timeline by Market Type</h2>
          
          <div className="space-y-6">
            {marketScenarios.map((scenario, index) => (
              <div key={index} className={`p-5 rounded-lg border-2 ${
                scenario.color === 'red' ? 'bg-red-50 border-red-200' :
                scenario.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                'bg-green-50 border-green-200'
              }`}>
                <h3 className={`text-lg font-bold mb-2 ${
                  scenario.color === 'red' ? 'text-red-900' :
                  scenario.color === 'blue' ? 'text-blue-900' :
                  'text-green-900'
                }`}>{scenario.type}</h3>
                
                <p className={`text-sm mb-3 ${
                  scenario.color === 'red' ? 'text-red-700' :
                  scenario.color === 'blue' ? 'text-blue-700' :
                  'text-green-700'
                }`}>{scenario.timeline}</p>
                
                <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
                
                <ul className="space-y-2">
                  {scenario.strategy.map((item, itemIndex) => (
                    <li key={itemIndex} className={`text-sm flex items-start ${
                      scenario.color === 'red' ? 'text-red-800' :
                      scenario.color === 'blue' ? 'text-blue-800' :
                      'text-green-800'
                    }`}>
                      <span className="mr-2 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Tips */}
        <div className="duolingo-card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Success Tips</h2>
          
          <div className="space-y-6">
            {urgencyTips.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                      <IconComponent className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
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

        {/* Warning Box */}
        <div className="duolingo-card">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">⚠️ Don't Wait!</h3>
                <p className="text-red-800 text-sm mb-3">
                  In competitive markets, waiting until tomorrow to make an offer often means losing the house. 
                  Good properties receive multiple offers quickly, sometimes within hours of listing.
                </p>
                <p className="text-red-800 text-sm">
                  <strong>Be ready to act fast:</strong> Have your financing ready, know your budget, 
                  and trust your agent's advice on timing and market conditions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
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