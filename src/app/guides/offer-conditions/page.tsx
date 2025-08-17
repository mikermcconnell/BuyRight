'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  HomeIcon,
  BanknotesIcon,
  ScaleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import BuyRightLogo from '@/components/ui/BuyRightLogo';

export default function OfferConditionsGuide() {
  const router = useRouter();
  const { currentRegion } = useRegional();
  const [activeTab, setActiveTab] = useState('overview');

  const conditionTypes = [
    {
      id: 'inspection',
      title: 'Home Inspection Condition',
      icon: EyeIcon,
      color: 'blue',
      description: 'Right to back out if serious problems are found during inspection',
      timeframe: '7-14 days',
      typical: true,
      details: {
        whatItMeans: 'You can cancel the purchase or negotiate repairs if the home inspection reveals significant issues.',
        howItWorks: [
          'You hire a professional inspector within the specified timeframe',
          'Inspector examines the home\'s structure, systems, and major components',
          'You receive a detailed report of any problems found',
          'You can request repairs, credits, or cancel the deal based on findings'
        ],
        whenToUse: [
          'Almost always - unless you\'re very experienced',
          'Especially important for older homes',
          'Critical for first-time buyers',
          'When buying "as-is" properties (to know what you\'re getting)'
        ],
        costs: [
          'Home inspection: $300-$600',
          'Specialist inspections (pest, radon, etc.): $100-$300 each',
          'Lost earnest money if you back out for non-inspection reasons'
        ]
      },
      pros: [
        'Protects you from buying a house with major problems',
        'Gives you negotiating power for repairs or price reduction',
        'Professional inspector finds issues you might miss',
        'Can save thousands in unexpected repair costs'
      ],
      cons: [
        'Costs money upfront even if deal falls through',
        'Can delay closing if issues need negotiation',
        'Might lose the house if seller gets better offer without conditions',
        'Some sellers prefer offers without inspection condition'
      ],
      tips: [
        'Attend the inspection to learn about your future home',
        'Focus on major issues, not minor cosmetic problems',
        'Get repair estimates before negotiating with seller',
        'Consider which issues are deal-breakers vs. negotiable'
      ]
    },
    {
      id: 'financing',
      title: 'Financing Condition',
      icon: BanknotesIcon,
      color: 'green',
      description: 'Protection if you can\'t get approved for a mortgage',
      timeframe: '30-45 days',
      typical: true,
      details: {
        whatItMeans: 'You can cancel the purchase without penalty if you can\'t get a mortgage approved.',
        howItWorks: [
          'You apply for mortgage within specified timeframe',
          'Lender processes application and orders appraisal',
          'If loan is denied or terms are unacceptable, you can back out',
          'You must make good faith effort to get financing'
        ],
        whenToUse: [
          'When you don\'t have pre-approval',
          'If your financial situation has changed',
          'When buying above your pre-approval amount',
          'Always recommended unless paying cash'
        ],
        costs: [
          'Loan application fees: $300-$500',
          'Appraisal cost: $400-$600',
          'Credit report fees: $25-$50',
          'Lost earnest money if you don\'t try to get financing'
        ]
      },
      pros: [
        'Protects your earnest money if you can\'t get a loan',
        'Gives you time to shop for the best mortgage rates',
        'Protects against appraisal coming in too low',
        'Required by most lenders anyway'
      ],
      cons: [
        'Sellers may prefer cash offers or pre-approved buyers',
        'Can delay closing if financing takes longer than expected',
        'Requires you to actively pursue financing',
        'May need to pay for appraisal even if deal falls through'
      ],
      tips: [
        'Get pre-approved before house hunting to strengthen your offer',
        'Work with your lender to process loan quickly',
        'Have backup financing options ready',
        'Keep your finances stable during the process'
      ]
    },
    {
      id: 'appraisal',
      title: 'Appraisal Condition',
      icon: ScaleIcon,
      color: 'purple',
      description: 'Protection if the home doesn\'t appraise for the offer price',
      timeframe: '10-14 days after appraisal',
      typical: true,
      details: {
        whatItMeans: 'You can renegotiate or back out if the home appraises for less than your offer price.',
        howItWorks: [
          'Lender orders professional appraisal of the property',
          'Appraiser determines fair market value',
          'If appraisal is lower than offer price, you have options',
          'You can negotiate price down, pay difference, or cancel deal'
        ],
        whenToUse: [
          'In hot markets where prices are rising quickly',
          'When making offers above asking price',
          'Always recommended unless paying cash',
          'Especially important for first-time buyers'
        ],
        costs: [
          'Appraisal fee: $400-$600 (usually paid at closing)',
          'Potential lost earnest money',
          'Additional cash needed if paying difference'
        ]
      },
      pros: [
        'Protects you from overpaying for the house',
        'Lender requires appraisal anyway for mortgage',
        'Gives you negotiating power if appraisal is low',
        'Professional valuation confirms your offer price'
      ],
      cons: [
        'Can delay closing if appraisal comes in low',
        'Seller might choose offer without appraisal condition',
        'You might lose the house if you can\'t agree on price',
        'Appraisal might not reflect true market value in hot markets'
      ],
      tips: [
        'Research comparable sales before making offer',
        'Be prepared to negotiate if appraisal is low',
        'Consider how much extra you\'re willing to pay',
        'Work with experienced agent who knows market values'
      ]
    },
    {
      id: 'sale-of-home',
      title: 'Sale of Current Home Condition',
      icon: HomeIcon,
      color: 'orange',
      description: 'Need to sell your current home before buying new one',
      timeframe: '30-60 days',
      typical: false,
      details: {
        whatItMeans: 'You can back out if you can\'t sell your current home within the specified timeframe.',
        howItWorks: [
          'You list your current home for sale',
          'New purchase depends on successful sale of current home',
          'If current home doesn\'t sell, you can cancel new purchase',
          'Seller may require your home to be under contract first'
        ],
        whenToUse: [
          'When you need proceeds from current home to buy new one',
          'If you can\'t afford two mortgage payments',
          'When you can\'t get bridge financing',
          'Only when absolutely necessary'
        ],
        costs: [
          'Carrying costs for current home (mortgage, utilities, etc.)',
          'Real estate agent commissions on current home sale',
          'Potential storage and moving costs',
          'Lost earnest money if neither sale works out'
        ]
      },
      pros: [
        'Protects you from owning two homes',
        'Ensures you have funds to complete purchase',
        'Reduces financial stress and risk',
        'Prevents you from having to get bridge financing'
      ],
      cons: [
        'Makes your offer much less attractive to sellers',
        'Significantly delays the purchase process',
        'Seller might accept other offers while waiting',
        'Complex timing coordination required'
      ],
      tips: [
        'List your home before house hunting',
        'Consider bridge financing instead',
        'Make this condition as short as possible',
        'Have backup plan if current home doesn\'t sell'
      ]
    },
    {
      id: 'title',
      title: 'Title Condition',
      icon: DocumentTextIcon,
      color: 'red',
      description: 'Protection against title problems or liens on the property',
      timeframe: '5-10 days',
      typical: true,
      details: {
        whatItMeans: 'You can back out if there are serious title issues that can\'t be resolved.',
        howItWorks: [
          'Title company searches public records for title issues',
          'They check for liens, judgments, or ownership disputes',
          'Title insurance protects against future claims',
          'Most issues can be resolved before closing'
        ],
        whenToUse: [
          'Always recommended for protection',
          'Especially important for foreclosures',
          'Critical when buying from estate sales',
          'Required by most lenders anyway'
        ],
        costs: [
          'Title search: $200-$400',
          'Title insurance: $500-$2000 (based on home price)',
          'Attorney fees if legal issues arise'
        ]
      },
      pros: [
        'Protects against ownership disputes',
        'Ensures you get clear title to property',
        'Title insurance protects future ownership',
        'Usually required by lender anyway'
      ],
      cons: [
        'Can delay closing if issues are found',
        'Additional closing costs',
        'Rare for serious issues to be found',
        'Complex legal issues may require attorney'
      ],
      tips: [
        'Review title report carefully',
        'Ask questions about any liens or issues',
        'Make sure seller resolves issues before closing',
        'Keep title insurance policy forever'
      ]
    }
  ];

  const competitiveMarketTips = [
    {
      title: 'Hot Market Strategy',
      icon: ExclamationTriangleIcon,
      tips: [
        'Consider limiting conditions to make offer more attractive',
        'Get pre-approval and appraisal waiver if possible',
        'Shorten timeframes (5 days for inspection vs. 10 days)',
        'Include escalation clause to compete with other offers',
        'Be prepared to act quickly on inspection issues'
      ]
    },
    {
      title: 'Buyer\'s Market Strategy',
      icon: CheckCircleIcon,
      tips: [
        'Include all standard conditions for maximum protection',
        'Take longer timeframes (14 days for inspection)',
        'Ask for seller to pay for inspections or repairs',
        'Include more specialized conditions if needed',
        'Negotiate harder on any issues found'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-900',
          icon: 'text-blue-600',
          accent: 'bg-blue-100'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-900',
          icon: 'text-green-600',
          accent: 'bg-green-100'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-900',
          icon: 'text-purple-600',
          accent: 'bg-purple-100'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-900',
          icon: 'text-orange-600',
          accent: 'bg-orange-100'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          icon: 'text-red-600',
          accent: 'bg-red-100'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-900',
          icon: 'text-gray-600',
          accent: 'bg-gray-100'
        };
    }
  };

  return (
    <div className="duolingo-container min-h-screen py-8">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Journey</span>
          </button>
          
          {/* BuyRight Branding */}
          <div className="mb-6">
            <BuyRightLogo size="lg" className="justify-center" />
          </div>
          
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--duolingo-green)' }}>
            <ShieldCheckIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">🛡️ How to Protect Yourself When Making an Offer</h1>
          <p className="duolingo-subtitle max-w-3xl mx-auto">
            Learn about smart "escape routes" you can build into your offer. These safety nets let you back out or negotiate if things go wrong!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="duolingo-card mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'overview', label: 'All Conditions', icon: DocumentTextIcon },
              { id: 'strategy', label: 'Market Strategy', icon: ExclamationTriangleIcon }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: 'var(--duolingo-green)' } : {}}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Contingencies Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Types of Conditions</h3>
                <p className="text-gray-600">Protect yourself with these common conditions in your purchase offer.</p>
              </div>

              {conditionTypes.map((condition) => {
                const colorClasses = getColorClasses(condition.color);
                const IconComponent = condition.icon;
                
                return (
                  <div key={condition.id} className={`p-6 rounded-lg border-2 ${colorClasses.bg} ${colorClasses.border}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${colorClasses.accent}`}>
                          <IconComponent className={`w-7 h-7 ${colorClasses.icon}`} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${colorClasses.text}`}>{condition.title}</h3>
                          <p className={`text-sm ${colorClasses.text} opacity-80`}>{condition.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-col space-y-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            condition.typical ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {condition.typical ? 'Usually Included' : 'Sometimes Used'}
                          </span>
                          <span className="text-xs text-gray-600">{condition.timeframe}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* What It Means */}
                      <div className="bg-white p-5 rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-3">What It Means</h4>
                        <p className="text-gray-700 mb-4">{condition.details.whatItMeans}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">How It Works:</h5>
                            <ul className="space-y-1">
                              {condition.details.howItWorks.map((step, i) => (
                                <li key={i} className="flex items-start text-sm text-gray-600">
                                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">When to Use:</h5>
                            <ul className="space-y-1">
                              {condition.details.whenToUse.map((situation, i) => (
                                <li key={i} className="flex items-start text-sm text-gray-600">
                                  <span className="text-blue-500 mr-2">•</span>
                                  {situation}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Typical Costs:</h5>
                            <ul className="space-y-1">
                              {condition.details.costs.map((cost, i) => (
                                <li key={i} className="flex items-start text-sm text-gray-600">
                                  <CurrencyDollarIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {cost}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pros and Cons */}
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border">
                          <h5 className="font-semibold text-green-800 mb-2">Pros</h5>
                          <ul className="space-y-1">
                            {condition.pros.map((pro, i) => (
                              <li key={i} className="text-sm text-green-700 flex items-start">
                                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border">
                          <h5 className="font-semibold text-red-800 mb-2">Cons</h5>
                          <ul className="space-y-1">
                            {condition.cons.map((con, i) => (
                              <li key={i} className="text-sm text-red-700 flex items-start">
                                <XMarkIcon className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Tips */}
                      <div className={`p-4 rounded-lg ${colorClasses.accent}`}>
                        <h5 className={`font-semibold mb-2 ${colorClasses.text}`}>💡 Pro Tips</h5>
                        <ul className="space-y-1">
                          {condition.tips.map((tip, i) => (
                            <li key={i} className={`text-sm ${colorClasses.text} flex items-start`}>
                              <span className="mr-2">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Market Strategy Tab */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Contingency Strategy by Market</h3>
                <p className="text-gray-600">Adjust your conditions based on market conditions to stay competitive.</p>
              </div>
              
              {competitiveMarketTips.map((strategy, index) => {
                const IconComponent = strategy.icon;
                const isHot = strategy.title.includes('Hot');
                return (
                  <div key={index} className={`p-6 rounded-lg border-2 ${
                    isHot ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        isHot ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          isHot ? 'text-red-600' : 'text-green-600'
                        }`} />
                      </div>
                      <h4 className={`text-lg font-semibold ${
                        isHot ? 'text-red-900' : 'text-green-900'
                      }`}>{strategy.title}</h4>
                    </div>
                    
                    <ul className="space-y-2">
                      {strategy.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className={`text-sm flex items-start ${
                          isHot ? 'text-red-800' : 'text-green-800'
                        }`}>
                          <CheckCircleIcon className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                            isHot ? 'text-red-500' : 'text-green-500'
                          }`} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Important Reminder</h4>
                    <p className="text-blue-800 text-sm">
                      The inspection protects you from costly surprises and is usually worth keeping even in competitive markets. 
                      Instead of waiving it completely, consider shortening the timeframe or limiting your negotiation requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Plan */}
        <div className="duolingo-card">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">🛡️</span>
            Ready to Protect Your Offer?
          </h2>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Use this guide to choose the right conditions for your situation. 
              Work with your real estate agent to balance protection with competitiveness.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="duolingo-button"
              >
                Back to Making an Offer
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
              >
                Print This Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}