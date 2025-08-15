'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';
import {
  ChartBarIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  FireIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function DIYMarketResearchGuide() {
  const router = useRouter();
  const { currentRegion } = useRegional();
  const [activeTab, setActiveTab] = useState('basics');

  const advancedStrategies = [
    {
      id: 'comparative-analysis',
      title: 'Deep Comparative Market Analysis (CMA)',
      icon: ChartBarIcon,
      color: 'purple',
      description: 'Professional-level analysis techniques for accurate property valuation',
      strategies: [
        {
          strategy: 'Multi-layered comparison approach',
          instruction: 'How to do it: Use 3 separate comparison groups - recent sales (3 months), pending sales, and active listings in 3 different price ranges around your target.',
          explanation: 'This gives you current market, near-future trends, and competitive landscape in one analysis.',
          tools: 'HouseSigma (Canada) or Zillow Pro (US) for detailed comps data'
        },
        {
          strategy: 'Price per square foot trending',
          instruction: 'How to do it: Track price/sqft for your target neighborhood over 12 months, identify seasonal patterns and calculate monthly change rates.',
          explanation: 'Reveals if current prices are inflated, deflated, or trending predictably.',
          tools: 'Spreadsheet with monthly data from your preferred real estate platform'
        },
        {
          strategy: 'Days on market analysis by price point',
          instruction: 'How to do it: Chart average DOM for different price ranges in your area. Look for the "sweet spot" where homes sell fastest.',
          explanation: 'Identifies optimal pricing strategies and market demand patterns.',
          tools: 'Filter search results by price ranges and track DOM patterns'
        }
      ]
    },
    {
      id: 'market-timing',
      title: 'Market Timing & Predictive Analysis',
      icon: ClockIcon,
      color: 'blue',
      description: 'Advanced techniques to time your purchase optimally',
      strategies: [
        {
          strategy: 'Inventory flow analysis',
          instruction: 'How to do it: Track new listings vs. sold listings weekly for 8-12 weeks. Calculate the ratio to predict market direction.',
          explanation: 'When new listings exceed sales consistently, buyer power increases. When sales exceed listings, expect seller market.',
          tools: 'Weekly searches on your platform, record in spreadsheet'
        },
        {
          strategy: 'Interest rate impact modeling',
          instruction: 'How to do it: Research how 0.25% rate changes affected your area historically. Apply this to current rate trends to predict price movements.',
          explanation: 'Each market reacts differently to rate changes. Understanding your local sensitivity gives timing advantages.',
          tools: 'Historical rate data + local price history correlation analysis'
        },
        {
          strategy: 'Seasonal pattern recognition',
          instruction: 'How to do it: Analyze 3-5 years of monthly data for listing volume, price changes, and DOM. Identify the best months to buy vs. sell.',
          explanation: 'Most markets have predictable seasonal cycles. Buying during low-activity periods often means better deals.',
          tools: 'Multi-year data analysis from real estate websites'
        }
      ]
    },
    {
      id: 'neighborhood-intelligence',
      title: 'Neighborhood Intelligence Gathering',
      icon: MapPinIcon,
      color: 'green',
      description: 'Investigative techniques for comprehensive area assessment',
      strategies: [
        {
          strategy: 'Infrastructure development tracking',
          instruction: 'How to do it: Check city planning websites, attend city council meetings (often streamed), and research approved development projects within 2-3 miles.',
          explanation: 'New transit, schools, or commercial developments can dramatically impact property values before they\'re built.',
          tools: 'Municipal websites, city council agendas, local news archives'
        },
        {
          strategy: 'Crime trend analysis',
          instruction: 'How to do it: Get 3-5 years of crime data by neighborhood. Look for trends, not just current numbers. Map crime types by location and time.',
          explanation: 'Improving or declining safety trends affect property values more than static crime rates.',
          tools: 'Police department crime mapping tools, municipal crime statistics'
        },
        {
          strategy: 'School performance trajectory',
          instruction: 'How to do it: Track test scores, enrollment changes, and funding levels for 5+ years. Research teacher retention and principal changes.',
          explanation: 'School improvement or decline trends predict future property values, especially for family-oriented neighborhoods.',
          tools: 'Department of Education websites, school district annual reports'
        }
      ]
    },
    {
      id: 'financial-modeling',
      title: 'Advanced Financial Analysis',
      icon: CurrencyDollarIcon,
      color: 'yellow',
      description: 'Professional-level financial modeling for investment decisions',
      strategies: [
        {
          strategy: 'Total cost of ownership modeling',
          instruction: 'How to do it: Create 5-10 year projections including purchase price, taxes, insurance, maintenance, utilities, and opportunity cost of down payment.',
          explanation: 'Reveals true cost differences between properties and helps identify the most financially sound choice.',
          tools: 'Spreadsheet modeling with historical cost escalation rates'
        },
        {
          strategy: 'Rental yield analysis (even for primary residence)',
          instruction: 'How to do it: Research rental rates for similar properties. Calculate potential rental income vs. ownership costs as a benchmark.',
          explanation: 'Properties that could rent for more than carrying costs have stronger underlying value and better resale potential.',
          tools: 'Rental listing websites, property management company data'
        },
        {
          strategy: 'Comparable neighborhood analysis',
          instruction: 'How to do it: Compare your target neighborhood\'s price trends with 3-4 similar neighborhoods. Look for undervalued areas with similar amenities.',
          explanation: 'Identifies neighborhoods that may be underpriced relative to their fundamentals.',
          tools: 'Cross-neighborhood comparison using multiple data sources'
        }
      ]
    }
  ];

  const basicConcepts = [
    {
      id: 'price',
      title: 'What Should Homes Cost?',
      icon: CurrencyDollarIcon,
      color: 'green',
      description: 'Understanding if you\'re getting a fair price',
      tips: [
        {
          tip: 'Look at similar homes that sold recently',
          explanation: 'Find 3-5 homes like the one you want that sold in the last 3 months. This shows what people actually paid.',
          action: 'Check recently sold homes on Realtor.ca or Zillow'
        },
        {
          tip: 'Compare price per square foot',
          explanation: 'Divide the home price by square footage. Similar homes should have similar price per sq ft.',
          action: 'Calculate: $500,000 ÷ 1,500 sq ft = $333 per sq ft'
        },
        {
          tip: 'Check if prices are going up or down',
          explanation: 'If prices went up 10% this year, homes might be overpriced. If they went down, you might get a deal.',
          action: 'Look at price trends over the last 12 months'
        }
      ]
    },
    {
      id: 'speed',
      title: 'How Fast Do Homes Sell?',
      icon: ClockIcon,
      color: 'blue',
      description: 'Understanding how competitive the market is',
      tips: [
        {
          tip: 'Check "days on market"',
          explanation: 'This tells you how long homes sit before selling. Fast = competitive market.',
          action: 'Under 2 weeks = very competitive, 1-2 months = normal, 3+ months = slow'
        },
        {
          tip: 'See if homes sell for asking price',
          explanation: 'If homes sell for more than asking price, you\'re in a bidding war market.',
          action: 'Check sold vs. listed price on real estate websites'
        },
        {
          tip: 'Count how many homes are for sale',
          explanation: 'Lots of choices = easier to negotiate. Few choices = you need to act fast.',
          action: 'Search your area and see how many homes match your criteria'
        }
      ]
    },
    {
      id: 'neighborhood',
      title: 'Is This a Good Neighborhood?',
      icon: MapPinIcon,
      color: 'purple',
      description: 'Researching the area around your potential home',
      tips: [
        {
          tip: 'Check school ratings',
          explanation: 'Good schools keep property values strong, even if you don\'t have kids.',
          action: 'Search school ratings on GreatSchools.org or local education websites'
        },
        {
          tip: 'Look at crime statistics',
          explanation: 'Lower crime = safer and better for resale value.',
          action: 'Check local police websites or crime mapping tools'
        },
        {
          tip: 'Visit at different times',
          explanation: 'A quiet Tuesday morning might be very different from Friday night.',
          action: 'Drive through the neighborhood on weekdays, evenings, and weekends'
        }
      ]
    }
  ];

  const easyWebsites = [
    {
      category: 'Find Homes & Prices',
      description: 'Best websites to look at homes for sale and recently sold',
      websites: [
        {
          name: 'HouseSigma.com',
          description: 'The BEST tool for Canadian market research',
          whatYouCanDo: 'See detailed sold history, price trends, market stats, and comprehensive property analytics',
          why: 'Most powerful and detailed market data available in Canada - highly recommended',
          region: 'Canada',
          url: 'https://housesigma.com'
        },
        {
          name: 'Realtor.ca',
          description: 'Official website for Canadian homes',
          whatYouCanDo: 'See all homes for sale, recently sold prices, and property details',
          why: 'Most accurate and complete information in Canada',
          region: 'Canada',
          url: 'https://realtor.ca'
        },
        {
          name: 'Zillow.com',
          description: 'Popular US real estate website',
          whatYouCanDo: 'Search homes, see price estimates, check neighborhood info',
          why: 'Easy to use and lots of helpful information',
          region: 'United States',
          url: 'https://zillow.com'
        }
      ]
    },
    {
      category: 'Check Neighborhoods',
      description: 'Websites to research areas and communities',
      websites: [
        {
          name: 'WalkScore.com',
          description: 'Rates how walkable neighborhoods are',
          whatYouCanDo: 'See walkability scores, nearby shops and restaurants',
          why: 'Helps you understand daily life in the area',
          region: 'North America',
          url: 'https://walkscore.com'
        },
        {
          name: 'GreatSchools.org',
          description: 'School ratings and information',
          whatYouCanDo: 'Check school quality and ratings in any area',
          why: 'Good schools help property values even if you don\'t have kids',
          region: 'North America',
          url: 'https://greatschools.org'
        },
        {
          name: 'City/Town Websites',
          description: 'Official local government websites',
          whatYouCanDo: 'Find property tax rates, local services, future development plans',
          why: 'Official information about costs and area changes',
          region: 'Everywhere',
          url: null
        }
      ]
    }
  ];

  const simpleSteps = [
    {
      step: 1,
      title: 'Pick Your Areas',
      description: 'Decide where you want to look for homes',
      tasks: [
        'Choose 2-3 neighborhoods you like',
        'Make sure you can get to work in reasonable time',
        'Check that there are homes in your budget'
      ],
      timeEstimate: '15 minutes'
    },
    {
      step: 2,
      title: 'Look at Recent Sales',
      description: 'See what similar homes actually sold for',
      tasks: [
        'Find 3-5 homes like what you want that sold recently',
        'Write down what they sold for vs. asking price',
        'See how long they took to sell'
      ],
      timeEstimate: '30 minutes'
    },
    {
      step: 3,
      title: 'Check the Neighborhood',
      description: 'Make sure it\'s a good place to live',
      tasks: [
        'Look up school ratings (even if you don\'t have kids)',
        'Check crime statistics online',
        'Drive through at different times of day'
      ],
      timeEstimate: '30 minutes'
    },
    {
      step: 4,
      title: 'Count Available Homes',
      description: 'See how much choice you have',
      tasks: [
        'Search how many homes are for sale in your price range',
        'If there are lots = you can take your time',
        'If there are few = you need to act quickly'
      ],
      timeEstimate: '15 minutes'
    },
    {
      step: 5,
      title: 'Visit Open Houses',
      description: 'Get hands-on experience with different properties and features',
      tasks: [
        'Find open house schedules on real estate websites',
        'Visit 5-10 open houses in your target areas and price range',
        'Take notes on what you like and dislike about each property',
        'Pay attention to layout, condition, neighborhood feel, and features',
        'Use this experience to refine your must-haves vs. nice-to-haves'
      ],
      timeEstimate: '2-4 hours over several weekends'
    }
  ];

  const marketTypes = [
    {
      type: 'Hot Market (Seller\'s Market)',
      whatItMeans: 'Homes sell very quickly, often with multiple offers',
      signs: [
        'Homes sell in under 2 weeks',
        'Selling prices are higher than asking prices',
        'Not many homes for sale',
        'Lots of competition from other buyers'
      ],
      whatToDo: [
        'Get pre-approved for a mortgage first',
        'Be ready to make offers quickly',
        'You might need to offer more than asking price',
        'Have backup choices ready'
      ],
      color: 'red'
    },
    {
      type: 'Normal Market (Balanced)',
      whatItMeans: 'Reasonable balance between buyers and sellers',
      signs: [
        'Homes sell in 1-2 months',
        'Selling prices are close to asking prices',
        'Decent selection of homes available',
        'Some room to negotiate'
      ],
      whatToDo: [
        'Take time to compare different homes',
        'You can negotiate on price a little',
        'Normal home inspection and conditions',
        'Work with your agent on offers'
      ],
      color: 'blue'
    },
    {
      type: 'Cool Market (Buyer\'s Market)',
      whatItMeans: 'Lots of homes available, buyers have more power',
      signs: [
        'Homes sit for 3+ months',
        'Selling prices are lower than asking prices',
        'Lots of homes to choose from',
        'Sellers are motivated to negotiate'
      ],
      whatToDo: [
        'Take your time shopping around',
        'Negotiate hard on price',
        'Ask sellers to fix things or pay costs',
        'Good time to be picky about what you want'
      ],
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-900',
          icon: 'text-green-600',
          accent: 'bg-green-100'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          icon: 'text-red-600',
          accent: 'bg-red-100'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-900',
          icon: 'text-blue-600',
          accent: 'bg-blue-100'
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
            <ChartBarIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">Simple Market Research for Beginners</h1>
          <p className="duolingo-subtitle max-w-3xl mx-auto">
            Learn the basics of researching homes and neighborhoods yourself. Simple steps to understand 
            if you're getting a good deal and what to expect in your area.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="duolingo-card mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'basics', label: 'The Basics', icon: InformationCircleIcon },
              { id: 'websites', label: 'Best Websites', icon: ComputerDesktopIcon },
              { id: 'steps', label: 'Simple Steps', icon: ClockIcon },
              { id: 'hotness', label: 'Is Market Hot or Cold?', icon: FireIcon },
              { id: 'advanced', label: 'Advanced Research', icon: ChartBarIcon }
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

          {/* The Basics Tab */}
          {activeTab === 'basics' && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">3 Simple Questions to Answer</h3>
                <p className="text-gray-600">These are the basics every first-time buyer should understand.</p>
              </div>
              
              {basicConcepts.map((concept) => {
                const colorClasses = getColorClasses(concept.color);
                const IconComponent = concept.icon;
                
                return (
                  <div key={concept.id} className={`p-6 rounded-lg border-2 ${colorClasses.bg} ${colorClasses.border}`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${colorClasses.accent}`}>
                        <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${colorClasses.text}`}>{concept.title}</h3>
                        <p className={`text-sm ${colorClasses.text} opacity-80`}>{concept.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {concept.tips.map((tip, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-900 mb-2">✓ {tip.tip}</h4>
                          <p className="text-gray-700 text-sm mb-3">{tip.explanation}</p>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-medium text-blue-900 text-sm">
                              <strong>How to do it:</strong> {tip.action}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Best Websites Tab */}
          {activeTab === 'websites' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Websites to Use</h3>
                <p className="text-gray-600">The best websites for beginners to research homes and neighborhoods.</p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  * Not sponsored - these are genuine recommendations based on usefulness
                </p>
              </div>
              
              {easyWebsites.map((category, catIndex) => (
                <div key={catIndex} className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">{category.category}</h4>
                  <p className="text-blue-700 text-sm mb-4">{category.description}</p>
                  
                  <div className="space-y-4">
                    {category.websites.map((website, webIndex) => (
                      <div key={webIndex} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900 text-lg">{website.name}</h5>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {website.region}
                            </span>
                            {website.url && (
                              <a
                                href={website.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full font-medium transition-colors duration-200 flex items-center space-x-1"
                              >
                                <span>Visit Site</span>
                                <span>↗</span>
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{website.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-gray-700 text-sm mb-1">What you can do:</p>
                            <p className="text-gray-600 text-sm">{website.whatYouCanDo}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="font-medium text-green-800 text-sm">
                              <strong>Why it's helpful:</strong> {website.why}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Simple Steps Tab */}
          {activeTab === 'steps' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">5-Step Research Process</h3>
                <p className="text-gray-600">Follow this systematic approach to research the market effectively.</p>
              </div>
              
              {simpleSteps.map((step, index) => (
                <div key={index} className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--duolingo-green)' }}>
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-green-900">{step.title}</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {step.timeEstimate}
                        </span>
                      </div>
                      <p className="text-green-700 text-sm">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {step.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-start">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-green-800 text-sm">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Market Hotness Tab */}
          {activeTab === 'hotness' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Understanding Market Conditions</h3>
                <p className="text-gray-600">Identify whether you're in a buyer's, seller's, or balanced market and adjust your strategy accordingly.</p>
              </div>
              
              {marketTypes.map((market, index) => {
                const colorClasses = getColorClasses(market.color);
                
                return (
                  <div key={index} className={`p-6 rounded-lg border-2 ${colorClasses.bg} ${colorClasses.border}`}>
                    <h4 className={`text-lg font-semibold ${colorClasses.text} mb-2`}>{market.type}</h4>
                    <p className={`text-sm ${colorClasses.text} mb-4 opacity-80`}>{market.whatItMeans}</p>
                    
                    <div className="space-y-6 gap-6">
                      <div>
                        <h5 className={`font-medium ${colorClasses.text} mb-3`}>Signs You'll See:</h5>
                        <ul className="space-y-2">
                          {market.signs.map((sign, signIndex) => (
                            <li key={signIndex} className={`flex items-start text-sm ${colorClasses.text}`}>
                              <InformationCircleIcon className={`w-4 h-4 ${colorClasses.icon} mr-2 mt-0.5 flex-shrink-0`} />
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className={`font-medium ${colorClasses.text} mb-3`}>What You Should Do:</h5>
                        <ul className="space-y-2">
                          {market.whatToDo.map((action, actionIndex) => (
                            <li key={actionIndex} className={`flex items-start text-sm ${colorClasses.text}`}>
                              <CheckCircleIcon className={`w-4 h-4 ${colorClasses.icon} mr-2 mt-0.5 flex-shrink-0`} />
                              {action}
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

          {/* Advanced Research Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Research Strategies</h3>
                <p className="text-gray-600">Professional-level techniques for serious home buyers who want comprehensive market intelligence.</p>
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>⚠️ Note:</strong> These strategies require more time and analytical skills but provide deeper market insights.
                  </p>
                </div>
              </div>
              
              {advancedStrategies.map((category) => {
                const colorClasses = getColorClasses(category.color);
                const IconComponent = category.icon;
                
                return (
                  <div key={category.id} className={`p-6 rounded-lg border-2 ${colorClasses.bg} ${colorClasses.border}`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${colorClasses.accent}`}>
                        <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${colorClasses.text}`}>{category.title}</h3>
                        <p className={`text-sm ${colorClasses.text} opacity-80`}>{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {category.strategies.map((strategy, index) => (
                        <div key={index} className="bg-white p-5 rounded-lg border">
                          <h4 className="font-semibold text-gray-900 mb-3 text-lg">{strategy.strategy}</h4>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="font-semibold text-blue-900 text-sm mb-2">📋 Step-by-Step Instructions:</p>
                              <p className="text-blue-800 text-sm">{strategy.instruction}</p>
                            </div>
                            
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="font-semibold text-green-900 text-sm mb-2">💡 Why This Works:</p>
                              <p className="text-green-800 text-sm">{strategy.explanation}</p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-semibold text-gray-800 text-sm mb-2">🔧 Tools Needed:</p>
                              <p className="text-gray-700 text-sm">{strategy.tools}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">⏰ Time Investment</h4>
                <p className="text-yellow-800 text-sm">
                  Advanced research typically requires 10-20 hours spread over 4-8 weeks for comprehensive analysis. 
                  Start with one strategy and gradually build your analytical skills.
                </p>
              </div>
            </div>
          )}
        </div>


        {/* Get Started */}
        <div className="duolingo-card">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">🚀</span>
            Start Your Market Research
          </h2>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Use this guide to become an informed buyer who understands the market before making offers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="duolingo-button"
              >
                Begin DIY Research
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