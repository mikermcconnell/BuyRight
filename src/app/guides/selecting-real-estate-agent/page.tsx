'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';
import {
  UserGroupIcon,
  StarIcon,
  ChartBarIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

export default function SelectingRealEstateAgentGuide() {
  const router = useRouter();
  const { currentRegion } = useRegional();
  const [activeTab, setActiveTab] = useState('criteria');

  const selectionCriteria = [
    {
      id: 'experience',
      title: 'Experience & Track Record',
      icon: ChartBarIcon,
      color: 'blue',
      factors: [
        {
          factor: 'Years in business',
          importance: 'High',
          questions: ['How long have you been selling real estate?', 'How many homes did you sell last year?'],
          redFlags: ['Less than 2 years experience', 'Very few recent sales'],
          goodSigns: ['5+ years experience', '10+ transactions annually']
        },
        {
          factor: 'Local market expertise',
          importance: 'Critical',
          questions: ['How well do you know this neighborhood?', 'What are recent market trends here?'],
          redFlags: ['Vague market knowledge', 'Works all over the city'],
          goodSigns: ['Specializes in your area', 'Detailed market insights']
        },
        {
          factor: 'Buyer representation',
          importance: 'High',
          questions: ['What percentage of your business is buyers vs sellers?', 'How do you advocate for buyers?'],
          redFlags: ['Primarily listing agent', 'Unclear buyer advocacy'],
          goodSigns: ['50%+ buyer representation', 'Clear buyer-focused process']
        }
      ]
    },
    {
      id: 'communication',
      title: 'Communication & Availability',
      icon: PhoneIcon,
      color: 'green',
      factors: [
        {
          factor: 'Response time',
          importance: 'Critical',
          questions: ['How quickly do you typically respond to calls/texts?', 'Are you available for weekend showings?'],
          redFlags: ['Slow to respond initially', 'Limited availability'],
          goodSigns: ['Quick initial response', 'Flexible scheduling']
        },
        {
          factor: 'Communication style',
          importance: 'High',
          questions: ['How do you prefer to communicate?', 'How often will you update me?'],
          redFlags: ['Poor listener', 'Unclear explanations'],
          goodSigns: ['Active listener', 'Clear, patient explanations']
        },
        {
          factor: 'Technology use',
          importance: 'Medium',
          questions: ['What tools do you use for house hunting?', 'How do you share listings and updates?'],
          redFlags: ['Outdated methods only', 'No digital tools'],
          goodSigns: ['Modern apps/portals', 'Digital document handling']
        }
      ]
    },
    {
      id: 'services',
      title: 'Services & Support',
      icon: HomeIcon,
      color: 'purple',
      factors: [
        {
          factor: 'Full-service support',
          importance: 'High',
          questions: ['What services do you provide beyond finding homes?', 'Do you have preferred vendors?'],
          redFlags: ['Limited service scope', 'No vendor network'],
          goodSigns: ['Comprehensive support', 'Trusted vendor referrals']
        },
        {
          factor: 'Negotiation skills',
          importance: 'Critical',
          questions: ['How do you approach negotiations?', 'Can you share a recent negotiation success?'],
          redFlags: ['Weak negotiation examples', 'Avoids tough situations'],
          goodSigns: ['Strong negotiation stories', 'Confident approach']
        },
        {
          factor: 'Market analysis',
          importance: 'High',
          questions: ['How do you determine fair offer prices?', 'What market data do you provide?'],
          redFlags: ['No data-driven approach', 'Vague pricing guidance'],
          goodSigns: ['Detailed market analysis', 'Clear pricing rationale']
        }
      ]
    },
    {
      id: 'fit',
      title: 'Personal Fit & Trust',
      icon: UserGroupIcon,
      color: 'yellow',
      factors: [
        {
          factor: 'Understanding your needs',
          importance: 'Critical',
          questions: ['What questions do they ask about your preferences?', 'Do they listen to your concerns?'],
          redFlags: ['Doesn\'t ask about needs', 'Pushes their agenda'],
          goodSigns: ['Thorough needs assessment', 'Respects your timeline']
        },
        {
          factor: 'Personality match',
          importance: 'Medium',
          questions: ['Do you feel comfortable with this person?', 'Are they patient with questions?'],
          redFlags: ['Personality clash', 'Makes you feel rushed'],
          goodSigns: ['Good rapport', 'Patient and supportive']
        },
        {
          factor: 'Honesty & transparency',
          importance: 'Critical',
          questions: ['Are they upfront about costs?', 'Do they discuss potential challenges?'],
          redFlags: ['Avoids difficult topics', 'Unrealistic promises'],
          goodSigns: ['Honest about challenges', 'Transparent about process']
        }
      ]
    }
  ];

  const interviewQuestions = [
    {
      category: 'Experience & Credentials',
      questions: [
        'How long have you been working in real estate?',
        'How many buyer transactions did you complete last year?',
        'What percentage of your business comes from repeat clients and referrals?',
        'Are you a full-time agent?',
        'What professional designations or certifications do you have?'
      ]
    },
    {
      category: 'Local Market Knowledge',
      questions: [
        'How well do you know the neighborhoods I\'m considering?',
        'What are the current market conditions in my price range?',
        'How many homes have you sold in this area in the past year?',
        'What are typical days on market for homes like I\'m seeking?',
        'Can you provide recent comparable sales data?'
      ]
    },
    {
      category: 'Working Relationship',
      questions: [
        'How do you typically communicate with clients?',
        'How quickly do you usually respond to calls or emails?',
        'Are you available for evening and weekend showings?',
        'How many active buyers are you currently representing?',
        'What is your process for showing homes and providing feedback?'
      ]
    },
    {
      category: 'Services & Support',
      questions: [
        'What services do you provide beyond finding and showing homes?',
        'Do you have relationships with lenders, inspectors, and other professionals?',
        'How do you help determine a competitive offer price?',
        'What is your approach to negotiations?',
        'How do you handle multiple offer situations?'
      ]
    },
    {
      category: 'Fees & Expectations',
      questions: [
        'What is your commission structure?',
        'Are there any additional fees I should expect?',
        'What do you expect from me as a client?',
        'How long do buyer representation agreements typically last?',
        'Under what circumstances can the agreement be terminated?'
      ]
    }
  ];

  const redFlags = [
    {
      category: 'Experience Issues',
      flags: [
        'Very new to real estate (less than 1 year)',
        'Part-time agent with another primary job',
        'No recent sales or very few transactions',
        'Works in areas far from your target neighborhoods',
        'Primarily a listing agent with little buyer experience'
      ]
    },
    {
      category: 'Communication Problems',
      flags: [
        'Slow to respond to initial inquiries',
        'Difficult to reach or schedule appointments',
        'Doesn\'t ask about your needs and preferences',
        'Seems rushed or impatient during meetings',
        'Uses high-pressure sales tactics'
      ]
    },
    {
      category: 'Professionalism Concerns',
      flags: [
        'Shows up late or unprepared to meetings',
        'Can\'t provide references or avoids the topic',
        'Makes unrealistic promises about timeline or outcomes',
        'Doesn\'t have professional marketing materials',
        'Seems unfamiliar with current market conditions'
      ]
    },
    {
      category: 'Service Limitations',
      flags: [
        'Only shows homes during limited hours',
        'Doesn\'t provide market analysis or comparable sales',
        'Has no relationships with other professionals',
        'Avoids discussing potential challenges or problems',
        'Focuses only on price, ignoring other important factors'
      ]
    }
  ];

  const actionPlan = [
    {
      step: 1,
      title: 'Research Potential Agents',
      description: 'Find agents through multiple channels',
      tasks: [
        'Ask friends, family, and coworkers for referrals',
        'Check recent home sale signs in your target neighborhoods',
        'Search online reviews and real estate websites',
        'Contact 3-5 agents who seem like good potential fits',
        'Review their online presence and recent listings'
      ]
    },
    {
      step: 2,
      title: 'Initial Contact & Screening',
      description: 'Make contact and assess basic fit',
      tasks: [
        'Call or email to introduce yourself and your needs',
        'Ask a few key screening questions',
        'Schedule brief phone conversations or meetings',
        'Pay attention to response time and communication style',
        'Narrow down to 2-3 top candidates'
      ]
    },
    {
      step: 3,
      title: 'In-Depth Interviews',
      description: 'Meet with your top candidates',
      tasks: [
        'Schedule face-to-face or video meetings',
        'Ask detailed questions from our interview guide',
        'Request and contact references',
        'Review their market analysis and comparable sales',
        'Discuss commission and service expectations'
      ]
    },
    {
      step: 4,
      title: 'Make Your Decision',
      description: 'Choose the best agent for your needs',
      tasks: [
        'Compare all candidates against your criteria',
        'Trust your instincts about personality fit',
        'Verify credentials and check online reviews',
        'Make your final selection',
        'Sign the buyer representation agreement'
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
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-900',
          icon: 'text-yellow-600',
          accent: 'bg-yellow-100'
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
            <UserGroupIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">Selecting Your Real Estate Agent</h1>
          <p className="duolingo-subtitle max-w-3xl mx-auto">
            Your agent is one of the most important partners in your home buying journey. 
            This guide helps you find an agent who understands your needs and will advocate for your best interests.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="duolingo-card mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'criteria', label: 'Selection Criteria', icon: CheckCircleIcon },
              { id: 'questions', label: 'Interview Questions', icon: QuestionMarkCircleIcon },
              { id: 'redflags', label: 'Red Flags', icon: InformationCircleIcon },
              { id: 'action', label: 'Action Plan', icon: ClockIcon }
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

          {/* Selection Criteria Tab */}
          {activeTab === 'criteria' && (
            <div className="space-y-8">
              {selectionCriteria.map((category) => {
                const colorClasses = getColorClasses(category.color);
                const IconComponent = category.icon;
                
                return (
                  <div key={category.id} className={`p-6 rounded-lg border-2 ${colorClasses.bg} ${colorClasses.border}`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${colorClasses.accent}`}>
                        <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
                      </div>
                      <h3 className={`text-xl font-bold ${colorClasses.text}`}>{category.title}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {category.factors.map((factor, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{factor.factor}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              factor.importance === 'Critical' ? 'bg-red-100 text-red-700' :
                              factor.importance === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {factor.importance}
                            </span>
                          </div>
                          
                          <div className="space-y-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-700 mb-2">Key Questions:</p>
                              <ul className="text-gray-600 space-y-1">
                                {factor.questions.map((q, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-500 mr-1">•</span>
                                    {q}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <p className="font-medium text-red-700 mb-2">Red Flags:</p>
                              <ul className="text-red-600 space-y-1">
                                {factor.redFlags.map((flag, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-red-500 mr-1">⚠</span>
                                    {flag}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <p className="font-medium text-green-700 mb-2">Good Signs:</p>
                              <ul className="text-green-600 space-y-1">
                                {factor.goodSigns.map((sign, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-500 mr-1">✓</span>
                                    {sign}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interview Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Essential Interview Questions</h3>
                <p className="text-gray-600">Use these questions to evaluate potential agents during your interviews.</p>
              </div>
              
              {interviewQuestions.map((category, index) => (
                <div key={index} className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">{category.category}</h4>
                  <div className="space-y-3">
                    {category.questions.map((question, qIndex) => (
                      <div key={qIndex} className="flex items-start">
                        <QuestionMarkCircleIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-blue-800">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Red Flags Tab */}
          {activeTab === 'redflags' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Warning Signs to Watch For</h3>
                <p className="text-gray-600">These red flags may indicate an agent isn't the right fit for your needs.</p>
              </div>
              
              {redFlags.map((category, index) => (
                <div key={index} className="p-6 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-red-900 mb-4">{category.category}</h4>
                  <div className="space-y-2">
                    {category.flags.map((flag, fIndex) => (
                      <div key={fIndex} className="flex items-start">
                        <InformationCircleIcon className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-red-800">{flag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Plan Tab */}
          {activeTab === 'action' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Step-by-Step Action Plan</h3>
                <p className="text-gray-600">Follow this process to find and select the right agent for your needs.</p>
              </div>
              
              {actionPlan.map((step, index) => (
                <div key={index} className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--duolingo-green)' }}>
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-green-900">{step.title}</h4>
                      <p className="text-green-700 text-sm">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {step.tasks.map((task, tIndex) => (
                      <div key={tIndex} className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-green-800">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regional Considerations */}
        {currentRegion && (
          <div className="duolingo-card mb-8">
            <h2 className="duolingo-title mb-4 flex items-center">
              <span className="text-2xl mr-3">🏠</span>
              Regional Considerations
            </h2>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                {currentRegion === 'ON' ? 'Ontario' : 
                 currentRegion === 'BC' ? 'British Columbia' : 
                 currentRegion} Specific Factors
              </h3>
              
              {currentRegion === 'ON' && (
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Look for agents familiar with OREA forms and Ontario disclosure requirements</p>
                  <p>• Ask about experience with Land Transfer Tax and first-time buyer rebates</p>
                  <p>• Ensure they understand Tarion warranty programs for new homes</p>
                  <p>• Verify knowledge of local market conditions and municipal requirements</p>
                </div>
              )}
              
              {currentRegion === 'BC' && (
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Ensure familiarity with BC Real Estate Association forms and processes</p>
                  <p>• Ask about Property Transfer Tax and available exemptions</p>
                  <p>• Look for knowledge of strata properties and regulations</p>
                  <p>• Verify understanding of foreign buyer tax implications</p>
                </div>
              )}
              
              {currentRegion?.startsWith('US') && (
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Ensure they are licensed in your state and familiar with local laws</p>
                  <p>• Ask about experience with FHA, VA, and conventional loan programs</p>
                  <p>• Look for knowledge of state-specific disclosure requirements</p>
                  <p>• Verify understanding of local market conditions and regulations</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ready to Start */}
        <div className="duolingo-card">
          <h2 className="duolingo-title mb-6 flex items-center">
            <span className="text-2xl mr-3">🚀</span>
            Ready to Find Your Agent?
          </h2>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Use this guide to find an agent who will be your advocate throughout the home buying process.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="duolingo-button"
              >
                Start Reaching Out to Agents
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