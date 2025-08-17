'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EyeIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  LightBulbIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  FireIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export default function HomeInspectionQuestionsGuide() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('structural');

  const questionCategories = [
    {
      id: 'structural',
      title: 'Structure & Foundation',
      icon: HomeIcon,
      color: 'blue',
      questions: [
        'Are there any foundation cracks or settling issues?',
        'How is the overall structural integrity?',
        'Are there any signs of water damage or flooding?',
        'What\'s the condition of the roof and how old is it?',
        'Are there any issues with load-bearing walls?',
        'How are the floors - any sagging or soft spots?'
      ],
      redFlags: [
        'Major foundation cracks',
        'Water damage in basement',
        'Sagging roof lines',
        'Bouncy or uneven floors'
      ]
    },
    {
      id: 'electrical',
      title: 'Electrical System',
      icon: BoltIcon,
      color: 'yellow',
      questions: [
        'How old is the electrical panel and wiring?',
        'Are there any safety concerns with the electrical?',
        'Do all outlets and switches work properly?',
        'Is the electrical up to current codes?',
        'Are there enough outlets for modern needs?',
        'Any issues with GFCI outlets in bathrooms/kitchen?'
      ],
      redFlags: [
        'Knob and tube wiring',
        'Overloaded electrical panel',
        'Missing GFCI protection',
        'Aluminum wiring'
      ]
    },
    {
      id: 'plumbing',
      title: 'Plumbing System',
      icon: WrenchScrewdriverIcon,
      color: 'blue',
      questions: [
        'What\'s the age and condition of the plumbing?',
        'Are there any leaks or water pressure issues?',
        'How is the water heater - age and condition?',
        'Any problems with drains or sewer lines?',
        'What type of pipes - any need replacement?',
        'How\'s the water quality and pressure?'
      ],
      redFlags: [
        'Galvanized steel pipes',
        'Water heater over 10 years old',
        'Low water pressure',
        'Signs of sewer backup'
      ]
    },
    {
      id: 'hvac',
      title: 'Heating & Cooling',
      icon: FireIcon,
      color: 'orange',
      questions: [
        'How old are the heating and cooling systems?',
        'When was the last maintenance performed?',
        'Are there any issues with ductwork?',
        'How efficient are the systems?',
        'Are there any safety concerns with gas systems?',
        'Do all rooms heat and cool evenly?'
      ],
      redFlags: [
        'HVAC system over 15-20 years old',
        'Leaky or damaged ductwork',
        'Carbon monoxide concerns',
        'Uneven heating/cooling'
      ]
    },
    {
      id: 'environmental',
      title: 'Environmental & Safety',
      icon: BeakerIcon,
      color: 'green',
      questions: [
        'Are there any concerns about asbestos or lead?',
        'Is there any evidence of mold or moisture issues?',
        'What about radon levels in the basement?',
        'Are smoke and carbon monoxide detectors working?',
        'Any pest or termite issues?',
        'What\'s the condition of insulation?'
      ],
      redFlags: [
        'Visible mold growth',
        'Asbestos in older homes',
        'High radon levels',
        'Termite damage'
      ]
    },
    {
      id: 'general',
      title: 'General Questions',
      icon: ClipboardDocumentListIcon,
      color: 'gray',
      questions: [
        'What are the three biggest issues you found?',
        'What would you prioritize fixing first?',
        'Are there any safety hazards I should know about?',
        'What\'s your overall impression of the home?',
        'What major expenses should I expect in the next few years?',
        'Is there anything that surprised you about this house?'
      ],
      priorities: [
        'Safety issues first',
        'Major structural problems',
        'Expensive system replacements',
        'Code violations'
      ]
    }
  ];

  const inspectionTips = [
    {
      title: 'Before the Inspection',
      icon: CheckCircleIcon,
      tips: [
        'Arrive early to meet the inspector',
        'Bring a notebook and pen',
        'Dress for crawling around (old clothes)',
        'Plan for 2-3 hours minimum',
        'Turn on utilities if they\'re off'
      ]
    },
    {
      title: 'During the Inspection',
      icon: EyeIcon,
      tips: [
        'Follow the inspector around',
        'Ask questions as they arise',
        'Take photos of any issues',
        'Don\'t be afraid to ask "why"',
        'Focus on learning about your future home'
      ]
    },
    {
      title: 'After the Inspection',
      icon: LightBulbIcon,
      tips: [
        'Review the written report carefully',
        'Get estimates for major repairs',
        'Prioritize safety and structural issues',
        'Discuss findings with your agent',
        'Decide what to negotiate with seller'
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
          icon: 'text-blue-600'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-900',
          icon: 'text-yellow-600'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-900',
          icon: 'text-orange-600'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-900',
          icon: 'text-green-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-900',
          icon: 'text-gray-600'
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
            <EyeIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">🔍 What to Ask During Your Home Inspection</h1>
          <p className="duolingo-subtitle max-w-3xl mx-auto">
            Essential questions to ask during your home inspection. 
            Learn what to focus on and what red flags to watch for.
          </p>
        </div>

        {/* Category Selector */}
        <div className="duolingo-card mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {questionCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeCategory === category.id 
                      ? 'text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={activeCategory === category.id ? { backgroundColor: 'var(--duolingo-green)' } : {}}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{category.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Content */}
          {questionCategories.map((category) => {
            if (category.id !== activeCategory) return null;
            
            const colorClasses = getColorClasses(category.color);
            const IconComponent = category.icon;
            
            return (
              <div key={category.id} className={`p-6 rounded-lg border-2 ${colorClasses.bg} ${colorClasses.border}`}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3">
                    <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${colorClasses.text}`}>{category.title}</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Questions to Ask:</h4>
                    <ul className="space-y-2">
                      {category.questions.map((question, index) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <span className="text-green-500 mr-2 mt-1">?</span>
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {category.redFlags && (
                    <div className="bg-red-50 border border-red-200 p-5 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-3">🚩 Red Flags to Watch For:</h4>
                      <ul className="space-y-1">
                        {category.redFlags.map((flag, index) => (
                          <li key={index} className="text-red-700 flex items-start text-sm">
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {category.priorities && (
                    <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-3">⚡ Priority Issues:</h4>
                      <ul className="space-y-1">
                        {category.priorities.map((priority, index) => (
                          <li key={index} className="text-yellow-700 flex items-start text-sm">
                            <CheckCircleIcon className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            {priority}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Inspection Tips */}
        <div className="duolingo-card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Inspection Day Tips</h2>
          
          <div className="space-y-6">
            {inspectionTips.map((category, index) => {
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

        {/* Important Reminders */}
        <div className="duolingo-card">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
            <div className="flex items-start">
              <LightBulbIcon className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">💡 Remember</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• No house is perfect - focus on major issues</li>
                  <li>• The inspector works for you - ask lots of questions</li>
                  <li>• Take notes and photos for your records</li>
                  <li>• Use findings to negotiate, not necessarily to walk away</li>
                  <li>• Safety issues should be your top priority</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => router.back()}
              className="duolingo-button"
            >
              Back to Closing Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}