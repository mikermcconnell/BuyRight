'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  HomeIcon,
  CalculatorIcon,
  DocumentTextIcon,
  MapPinIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  ClockIcon,
  EyeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function PropertyValueAssessmentGuide() {
  const router = useRouter();
  const { currentRegion } = useRegional();
  const [activeTab, setActiveTab] = useState('methods');

  const valuationMethods = [
    {
      id: 'comparative-market-analysis',
      title: 'Compare Similar Houses (CMA)',
      icon: ChartBarIcon,
      color: 'blue',
      accuracy: 'High',
      difficulty: 'Moderate',
      timeRequired: '2-3 hours',
      description: 'Look at similar houses that sold recently in the same area',
      steps: [
        {
          step: 1,
          title: 'Find Similar Houses That Sold',
          description: 'Look for 3-6 similar houses sold in the last 6 months',
          details: [
            'Houses within 1 mile (city) or 3 miles (suburbs)',
            'Similar size (within 20%)',
            'Same number of bedrooms and bathrooms',
            'Similar yard size and house type',
            'Built around the same time (within 15 years)'
          ],
          tools: ['HouseSigma (Canada)', 'Zillow', 'Realtor.com', 'MLS access through agent']
        },
        {
          step: 2,
          title: 'Compare Important Features',
          description: 'Look at features that change the house value',
          details: [
            'How well the house is maintained',
            'Recent updates like new kitchen or bathroom',
            'Yard size and landscaping',
            'Garage, driveway, and storage space',
            'Extra features like pool, fireplace, deck',
            'Location pros and cons (quiet street vs busy road)'
          ],
          adjustments: [
            'Updated kitchen: +$10,000-$30,000',
            'Finished basement: +$15,000-$25,000',
            'New roof: +$8,000-$15,000',
            'Busy street location: -$5,000-$15,000',
            'Larger lot size: +$2,000-$8,000'
          ]
        },
        {
          step: 3,
          title: 'Adjust the Prices',
          description: 'Add or subtract money based on differences',
          details: [
            'Start with the sold price of each similar house',
            'Add money if your house has better features',
            'Subtract money if the other house had better features',
            'Give more importance to recent sales',
            'Average all the adjusted prices for your estimate'
          ],
          formula: 'Estimated Value = (Comp Sale Price + Positive Adjustments - Negative Adjustments)'
        }
      ],
      pros: [
        'Most accurate way for regular houses',
        'Shows what the market is doing right now',
        'Banks and experts trust this method',
        'Considers your specific neighborhood'
      ],
      cons: [
        'Need enough similar house sales to compare',
        'Hard to use for unusual houses',
        'Market can change fast',
        'Guessing price adjustments can be tricky'
      ]
    },
    {
      id: 'online-valuation-tools',
      title: 'Online House Value Tools',
      icon: CalculatorIcon,
      color: 'green',
      accuracy: 'Moderate',
      difficulty: 'Easy',
      timeRequired: '15-30 minutes',
      description: 'Get quick estimates from websites and apps',
      steps: [
        {
          step: 1,
          title: 'Check Several Websites',
          description: 'Get price estimates from different websites',
          details: [
            'Zillow Zestimate (US)',
            'HouseSigma estimate (Canada)',
            'Realtor.com estimate',
            'Bank websites (TD, RBC, etc. in Canada)',
            'Redfin estimate (where available)'
          ],
          tools: ['Zillow', 'HouseSigma', 'Realtor.com', 'Bank websites', 'Redfin']
        },
        {
          step: 2,
          title: 'Compare All the Estimates',
          description: 'Look at all the prices and spot any weird ones',
          details: [
            'Write down all the estimates',
            'Find the average of all estimates',
            'See the difference between highest and lowest',
            'Remove any estimates that seem way off',
            'Look for estimates that are close to each other'
          ]
        },
        {
          step: 3,
          title: 'Know the Limits',
          description: 'Understand when these tools might be wrong',
          details: [
            'See if the website says how confident it is',
            'More accurate in busy neighborhoods with lots of sales',
            'Less accurate for unusual or expensive houses',
            'Might not show very recent market changes',
            'May not know local neighborhood details'
          ]
        }
      ],
      pros: [
        'Fast and easy to get',
        'Free to use',
        'Good place to start your research',
        'Helps you see if house values are going up or down'
      ],
      cons: [
        'Can be way off sometimes',
        'Doesn\'t know if the house needs repairs',
        'Doesn\'t know your neighborhood well',
        'Missing some important information'
      ]
    },
    {
      id: 'benchmark-price-method',
      title: 'Market Change Method',
      icon: ChartBarIcon,
      color: 'blue',
      accuracy: 'Moderate-High',
      difficulty: 'Moderate',
      timeRequired: '1-2 hours',
      description: 'See how much the market changed since this house last sold',
      steps: [
        {
          step: 1,
          title: 'Find When It Last Sold',
          description: 'Look up when this house sold before and for how much',
          details: [
            'Look up the house history online',
            'Use websites like HouseSigma or Zillow price history',
            'Make sure it was a normal sale (not to family)',
            'Check if anything special happened with that sale',
            'Write down the exact date it sold'
          ],
          tools: ['HouseSigma (Canada)', 'Zillow price history', 'County assessor records', 'MLS through agent']
        },
        {
          step: 2,
          title: 'Find Market Prices Back Then',
          description: 'Look up what house prices were like when it sold',
          details: [
            'Use housing price tracking websites',
            'Check CREA HPI for Canada or Case-Shiller for US',
            'Look at local real estate board reports',
            'Check bank housing market reports',
            'Write down the price index for that month'
          ],
          tools: ['CREA HPI', 'Case-Shiller Index', 'Local real estate boards', 'Bank market reports']
        },
        {
          step: 3,
          title: 'Calculate How Much Prices Changed',
          description: 'Figure out the percentage change in house prices',
          details: [
            'Find today\'s price index number',
            'Calculate: ((Today\'s Index - Old Index) / Old Index) × 100',
            'Consider if you\'re comparing different seasons',
            'Account for any crazy market periods',
            'Double-check with local real estate data'
          ],
          formula: 'Market Change % = ((Current Index - Sale Date Index) / Sale Date Index) × 100'
        },
        {
          step: 4,
          title: 'Apply the Change to the House',
          description: 'Use the market change to estimate current value',
          details: [
            'Apply the percentage change to the old sale price',
            'Think about things specific to this house',
            'Add value for any major improvements since then',
            'Consider if this neighborhood changed differently',
            'Compare with your other estimates to double-check'
          ],
          formula: 'Estimated Current Value = Last Sale Price × (1 + Market Change %)'
        }
      ],
      pros: [
        'Uses real market data, not guesses',
        'Shows how the whole market moved',
        'Works when you can\'t find similar house sales',
        'Good for seeing value trends over time'
      ],
      cons: [
        'Assumes this house followed the market exactly',
        'Your neighborhood might be different from the overall market',
        'Doesn\'t account for house condition changes',
        'Less accurate if house had major renovations'
      ]
    }
  ];

  const bestPractices = [
    {
      category: 'How to Do Your Research',
      icon: MagnifyingGlassIcon,
      practices: [
        {
          practice: 'Use Different Ways to Check',
          description: 'Don\'t trust just one method. Use comparing houses, online tools, and ask real estate agents.',
          importance: 'Critical'
        },
        {
          practice: 'Look at Recent Sales',
          description: 'Focus on houses sold in the last 6 months. Older sales might not show current prices.',
          importance: 'High'
        },
        {
          practice: 'Double-Check Your Information',
          description: 'Make sure the numbers match across different websites. Real estate agent data is usually most accurate.',
          importance: 'High'
        },
        {
          practice: 'Think About Market Direction',
          description: 'Consider if house prices are going up, down, or staying the same right now.',
          importance: 'Medium'
        }
      ]
    },
    {
      category: 'Picking Similar Houses',
      icon: HomeIcon,
      practices: [
        {
          practice: 'Stay Close By',
          description: 'Pick houses from the same neighborhood or school area when you can.',
          importance: 'Critical'
        },
        {
          practice: 'Find Similar Features',
          description: 'Match important things: size, bedrooms, bathrooms, yard size, age, and condition.',
          importance: 'Critical'
        },
        {
          practice: 'Normal Sales Only',
          description: 'Don\'t use foreclosures, family sales, or other unusual sales.',
          importance: 'High'
        },
        {
          practice: 'Be Conservative with Changes',
          description: 'Don\'t make big price adjustments. When unsure, use smaller amounts.',
          importance: 'Medium'
        }
      ]
    },
    {
      category: 'Getting Expert Help',
      icon: UserGroupIcon,
      practices: [
        {
          practice: 'Ask Local Real Estate Agents',
          description: 'Talk to agents who know your area well and understand local market conditions.',
          importance: 'High'
        },
        {
          practice: 'Get Several Opinions',
          description: 'Ask 2-3 different real estate professionals to get different viewpoints.',
          importance: 'Medium'
        },
        {
          practice: 'Consider Professional Appraisal',
          description: 'Think about hiring a professional appraiser for expensive houses or big decisions.',
          importance: 'Medium'
        },
        {
          practice: 'Ask About Timing',
          description: 'Ask experts about the best time to buy in your situation and market.',
          importance: 'Medium'
        }
      ]
    }
  ];

  const commonMistakes = [
    {
      mistake: 'Only Using Online Estimates',
      explanation: 'Websites like Zillow can be wrong by 10-20% or more, especially for unusual houses.',
      solution: 'Use online estimates to get started, but always check similar house sales too.',
      severity: 'High'
    },
    {
      mistake: 'Not Checking House Condition',
      explanation: 'Two identical houses can be worth very different amounts based on how well they\'re maintained.',
      solution: 'Always consider the condition, recent updates, and needed repairs.',
      severity: 'High'
    },
    {
      mistake: 'Using Old Sales Data',
      explanation: 'House markets change fast. Sales from 6+ months ago might not show current prices.',
      solution: 'Focus on houses sold in the last 6 months, especially recent ones.',
      severity: 'Medium'
    },
    {
      mistake: 'Getting Too Emotional',
      explanation: 'Loving certain features that don\'t actually add value can make you think it\'s worth more.',
      solution: 'Stay neutral and focus on features that most buyers actually care about.',
      severity: 'Medium'
    },
    {
      mistake: 'Ignoring Market Direction',
      explanation: 'House values in rising vs falling markets need to be looked at differently.',
      solution: 'Understand if prices are going up or down and how that affects your estimates.',
      severity: 'Medium'
    },
    {
      mistake: 'Wrong Search Area',
      explanation: 'Looking too far away or too close can give you bad comparison houses.',
      solution: 'Start with your immediate neighborhood, but look further if you need more data.',
      severity: 'Low'
    }
  ];

  const stepByStepProcess = [
    {
      phase: 'Get Started',
      duration: '30-60 minutes',
      steps: [
        'Write down basic house info (address, size, age, features)',
        'Get quick estimates from 3-4 websites',
        'Figure out your neighborhood boundaries',
        'Set your first guess of house value from online research'
      ]
    },
    {
      phase: 'Find Similar House Sales',
      duration: '2-3 hours',
      steps: [
        'Look for houses sold in last 6 months in your area',
        'Filter by house type, size, and features',
        'Write down 5-8 potential similar houses with details',
        'Remove weird sales and houses that don\'t fit',
        'Pick the 3-5 best similar houses for detailed comparison'
      ]
    },
    {
      phase: 'Compare the Details',
      duration: '1-2 hours',
      steps: [
        'Make a spreadsheet comparing important features',
        'Figure out price adjustments for each difference',
        'Apply adjustments to each similar house sale price',
        'Determine your value range from adjusted prices',
        'Give more importance to recent sales and closer houses'
      ]
    },
    {
      phase: 'Get Expert Opinion',
      duration: '1-2 weeks',
      steps: [
        'Share your analysis with a knowledgeable real estate agent',
        'Get the agent\'s opinion on market conditions and timing',
        'Consider hiring an appraiser for expensive houses',
        'Double-check your assumptions about local market factors',
        'Finalize your estimated value range for decision making'
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
          
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--duolingo-green)' }}>
            <CurrencyDollarIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">How Much Is This House Worth?</h1>
          <p className="duolingo-subtitle max-w-3xl mx-auto">
            Learn simple ways to figure out what a house is really worth before you make an offer. 
            Use these methods to make smart decisions and negotiate with confidence.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="duolingo-card mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'methods', label: 'Valuation Methods', icon: CalculatorIcon },
              { id: 'process', label: 'Step-by-Step Process', icon: ClockIcon },
              { id: 'practices', label: 'Best Practices', icon: CheckCircleIcon },
              { id: 'mistakes', label: 'Common Mistakes', icon: ExclamationTriangleIcon }
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

          {/* Valuation Methods Tab */}
          {activeTab === 'methods' && (
            <div className="space-y-8">
              {valuationMethods.map((method) => {
                const colorClasses = getColorClasses(method.color);
                const IconComponent = method.icon;
                
                return (
                  <div key={method.id} className={`p-6 rounded-lg border-2 ${colorClasses.bg} ${colorClasses.border}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${colorClasses.accent}`}>
                          <IconComponent className={`w-7 h-7 ${colorClasses.icon}`} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${colorClasses.text}`}>{method.title}</h3>
                          <p className={`text-sm ${colorClasses.text} opacity-80`}>{method.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-col space-y-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            method.accuracy === 'Very High' ? 'bg-green-100 text-green-700' :
                            method.accuracy === 'High' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {method.accuracy} Accuracy
                          </span>
                          <span className="text-xs text-gray-600">{method.timeRequired}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {method.steps.map((step, index) => (
                        <div key={index} className="bg-white p-5 rounded-lg border">
                          <div className="flex items-center mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${colorClasses.accent}`}>
                              <span className={`font-bold ${colorClasses.text}`}>{step.step}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{step.description}</p>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Key Steps:</h5>
                              <ul className="space-y-1">
                                {step.details.map((detail, i) => (
                                  <li key={i} className="flex items-start text-sm text-gray-600">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {step.tools && (
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Recommended Tools:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {step.tools.map((tool, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {step.adjustments && (
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Typical Adjustments:</h5>
                                <ul className="space-y-1">
                                  {step.adjustments.map((adj, i) => (
                                    <li key={i} className="text-sm text-gray-600 flex items-start">
                                      <span className="text-blue-500 mr-2">•</span>
                                      {adj}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {step.formula && (
                              <div className={`p-3 rounded-lg ${colorClasses.accent}`}>
                                <h5 className={`font-medium mb-1 ${colorClasses.text}`}>Formula:</h5>
                                <code className={`text-sm ${colorClasses.text}`}>{step.formula}</code>
                              </div>
                            )}
                            
                            {step.costEstimates && (
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Construction Cost Estimates:</h5>
                                <ul className="space-y-1">
                                  {step.costEstimates.map((cost, i) => (
                                    <li key={i} className="text-sm text-gray-600 flex items-start">
                                      <span className="text-orange-500 mr-2">•</span>
                                      {cost}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {step.depreciationRates && (
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Depreciation Guidelines:</h5>
                                <ul className="space-y-1">
                                  {step.depreciationRates.map((rate, i) => (
                                    <li key={i} className="text-sm text-gray-600 flex items-start">
                                      <span className="text-red-500 mr-2">•</span>
                                      {rate}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border">
                          <h5 className="font-semibold text-green-800 mb-2">Pros</h5>
                          <ul className="space-y-1">
                            {method.pros.map((pro, i) => (
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
                            {method.cons.map((con, i) => (
                              <li key={i} className="text-sm text-red-700 flex items-start">
                                <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step-by-Step Process Tab */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Step-by-Step House Value Process</h3>
                <p className="text-gray-600">Follow these steps to figure out what a house is worth.</p>
              </div>
              
              {stepByStepProcess.map((phase, index) => (
                <div key={index} className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--duolingo-green)' }}>
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-green-900">{phase.phase}</h4>
                      <p className="text-green-700 text-sm">Estimated time: {phase.duration}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {phase.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start text-sm text-green-800">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip: Keep Notes</h4>
                    <p className="text-blue-800 text-sm">
                      Write everything down in a spreadsheet. Include house addresses, sale dates, prices, 
                      changes you made, and your final estimates. This will help you get better at valuing houses 
                      and be useful for future house hunting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Best Practices Tab */}
          {activeTab === 'practices' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tips for Success</h3>
                <p className="text-gray-600">Follow these tips to get accurate house values.</p>
              </div>
              
              {bestPractices.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div key={index} className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        <IconComponent className="w-6 h-6 text-gray-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">{category.category}</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {category.practices.map((practice, pIndex) => (
                        <div key={pIndex} className="bg-white p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-gray-900">{practice.practice}</h5>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              practice.importance === 'Critical' ? 'bg-red-100 text-red-700' :
                              practice.importance === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {practice.importance}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{practice.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Common Mistakes Tab */}
          {activeTab === 'mistakes' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Don't Make These Mistakes</h3>
                <p className="text-gray-600">Learn from common errors to get better house value estimates.</p>
              </div>
              
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-yellow-900">{mistake.mistake}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          mistake.severity === 'High' ? 'bg-red-100 text-red-700' :
                          mistake.severity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {mistake.severity} Risk
                        </span>
                      </div>
                      <p className="text-yellow-800 text-sm mb-3">{mistake.explanation}</p>
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <p className="font-medium text-yellow-900 text-sm">
                          <strong>Solution:</strong> {mistake.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Plan */}
        <div className="duolingo-card">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">🎯</span>
            Ready to Assess Property Values?
          </h2>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Use this guide to figure out what houses are worth before making offers. 
              Start with online estimates, then compare similar house sales.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="duolingo-button"
              >
                Start Checking House Values
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