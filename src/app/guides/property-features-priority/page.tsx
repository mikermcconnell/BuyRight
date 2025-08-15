'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function PropertyFeaturesPriorityGuide() {
  const router = useRouter();
  const { currentRegion } = useRegional();
  const [activeTab, setActiveTab] = useState('categories');
  
  // Property scoring tool state
  const [weights, setWeights] = useState<{[key: string]: number | 'na'}>({});
  const [currentProperty, setCurrentProperty] = useState('');
  const [propertyScores, setPropertyScores] = useState<{[propertyName: string]: {[feature: string]: number | 'na'}}>({});
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [customFeatures, setCustomFeatures] = useState<{feature: string, weight: number}[]>([]);
  const [newCustomFeature, setNewCustomFeature] = useState('');
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editableFeatures, setEditableFeatures] = useState<{[key: string]: string}>({});

  const featureCategories = [
    {
      id: 'location',
      title: 'Location & Neighborhood',
      icon: MapPinIcon,
      color: 'blue',
      description: 'These factors are typically unchangeable and have long-term impact',
      features: [
        {
          feature: 'School district quality',
          impact: 'High',
          changeable: false,
          considerations: 'Affects resale value even if you don\'t have children',
          questions: ['Do you plan to have children?', 'How important is resale value?']
        },
        {
          feature: 'Commute time to work',
          impact: 'High',
          changeable: false,
          considerations: 'Daily quality of life and transportation costs',
          questions: ['Will you work from home?', 'How do you prefer to commute?']
        },
        {
          feature: 'Neighborhood safety',
          impact: 'Critical',
          changeable: false,
          considerations: 'Personal safety and peace of mind',
          questions: ['Do you feel comfortable walking at night?', 'Are crime statistics acceptable?']
        },
        {
          feature: 'Proximity to amenities',
          impact: 'Medium',
          changeable: false,
          considerations: 'Grocery stores, restaurants, entertainment, healthcare',
          questions: ['What amenities do you use regularly?', 'Do you prefer walkable neighborhoods?']
        },
        {
          feature: 'Public transportation access',
          impact: 'Medium',
          changeable: false,
          considerations: 'Alternative transportation options and convenience',
          questions: ['Do you rely on public transit?', 'Is this important for resale?']
        },
        {
          feature: 'Future development plans',
          impact: 'Medium',
          changeable: false,
          considerations: 'Potential changes to neighborhood character',
          questions: ['Are you comfortable with change?', 'Could development affect property value?']
        }
      ]
    },
    {
      id: 'structural',
      title: 'Structure & Layout',
      icon: HomeIcon,
      color: 'green',
      description: 'These are expensive to change and affect daily living',
      features: [
        {
          feature: 'Number of bedrooms',
          impact: 'High',
          changeable: false,
          considerations: 'Family size, guests, home office needs',
          questions: ['How many bedrooms do you need now?', 'Will your needs change?']
        },
        {
          feature: 'Number of bathrooms',
          impact: 'High',
          changeable: false,
          considerations: 'Daily convenience and resale value',
          questions: ['How many people will live here?', 'Do you need multiple full baths?']
        },
        {
          feature: 'Square footage',
          impact: 'High',
          changeable: false,
          considerations: 'Living space, storage, and comfort',
          questions: ['What\'s your minimum comfortable space?', 'Do you prefer open or closed layouts?']
        },
        {
          feature: 'Single vs. multi-story',
          impact: 'Medium',
          changeable: false,
          considerations: 'Accessibility, privacy, maintenance',
          questions: ['Do stairs bother you?', 'Do you prefer main floor living?']
        },
        {
          feature: 'Basement or storage space',
          impact: 'Medium',
          changeable: false,
          considerations: 'Storage needs and potential finished space',
          questions: ['How much storage do you need?', 'Would you finish a basement?']
        },
        {
          feature: 'Garage or parking',
          impact: 'Medium',
          changeable: false,
          considerations: 'Vehicle protection and storage',
          questions: ['How many vehicles do you have?', 'Is covered parking essential?']
        }
      ]
    },
    {
      id: 'financial',
      title: 'Financial Considerations',
      icon: CurrencyDollarIcon,
      color: 'yellow',
      description: 'These affect your budget and long-term costs',
      features: [
        {
          feature: 'Purchase price',
          impact: 'Critical',
          changeable: false,
          considerations: 'Monthly payments and down payment requirements',
          questions: ['What\'s your maximum comfortable payment?', 'Do you have room in budget for surprises?']
        },
        {
          feature: 'Property taxes',
          impact: 'High',
          changeable: false,
          considerations: 'Ongoing monthly costs',
          questions: ['Are high taxes acceptable for better services?', 'How do taxes fit your budget?']
        },
        {
          feature: 'HOA or condo fees',
          impact: 'High',
          changeable: false,
          considerations: 'Monthly fees and restrictions',
          questions: ['What services do HOA fees cover?', 'Are restrictions acceptable?']
        },
        {
          feature: 'Utility costs',
          impact: 'Medium',
          changeable: true,
          considerations: 'Energy efficiency and monthly expenses',
          questions: ['How energy efficient is the home?', 'Are high utility costs sustainable?']
        },
        {
          feature: 'Maintenance costs',
          impact: 'Medium',
          changeable: true,
          considerations: 'Age of home, systems, and upkeep needs',
          questions: ['Are you handy with repairs?', 'Do you have budget for maintenance?']
        },
        {
          feature: 'Insurance costs',
          impact: 'Medium',
          changeable: false,
          considerations: 'Location-based risk factors',
          questions: ['Is the area prone to natural disasters?', 'How do insurance costs affect budget?']
        }
      ]
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle & Preferences',
      icon: HeartIcon,
      color: 'purple',
      description: 'These enhance comfort but are often changeable',
      features: [
        {
          feature: 'Architectural style',
          impact: 'Low',
          changeable: false,
          considerations: 'Personal preference and neighborhood fit',
          questions: ['Do you have a strong style preference?', 'Does it matter for resale?']
        },
        {
          feature: 'Kitchen size and layout',
          impact: 'Medium',
          changeable: true,
          considerations: 'Cooking habits and entertaining needs',
          questions: ['Do you cook frequently?', 'Is an open kitchen important?']
        },
        {
          feature: 'Master suite features',
          impact: 'Medium',
          changeable: true,
          considerations: 'Daily comfort and privacy',
          questions: ['Is a walk-in closet essential?', 'Do you need an ensuite bathroom?']
        },
        {
          feature: 'Outdoor space',
          impact: 'Medium',
          changeable: true,
          considerations: 'Entertaining, gardening, pets, children',
          questions: ['How do you use outdoor space?', 'Is maintenance a concern?']
        },
        {
          feature: 'Natural light',
          impact: 'Medium',
          changeable: false,
          considerations: 'Daily mood and energy costs',
          questions: ['Do you prefer bright spaces?', 'What times of day are you home?']
        },
        {
          feature: 'Updated finishes',
          impact: 'Low',
          changeable: true,
          considerations: 'Move-in readiness vs. renovation budget',
          questions: ['Do you want to move in immediately?', 'Do you enjoy renovation projects?']
        }
      ]
    }
  ];

  const prioritizationFramework = [
    {
      step: 1,
      title: 'List Your Non-Negotiables',
      description: 'Identify features that are absolutely essential',
      questions: [
        'What would make you immediately reject a property?',
        'What features are required for your basic daily life?',
        'What safety or accessibility needs must be met?',
        'What financial limits cannot be exceeded?'
      ],
      examples: ['Maximum budget', 'Minimum bedrooms', 'Specific school district', 'Ground floor living']
    },
    {
      step: 2,
      title: 'Identify High-Impact Features',
      description: 'Features that significantly affect daily life or are expensive to change',
      questions: [
        'What will you use or notice every single day?',
        'What would be very expensive to modify later?',
        'What affects long-term resale value?',
        'What impacts your family\'s safety and well-being?'
      ],
      examples: ['Location', 'Number of bathrooms', 'Commute time', 'Neighborhood quality']
    },
    {
      step: 3,
      title: 'Consider Your Timeline',
      description: 'Factor in life changes and priorities over time',
      questions: [
        'Will your family size change in the next 5 years?',
        'Are you planning to stay long-term or short-term?',
        'Will your work situation change?',
        'What life events might affect your needs?'
      ],
      examples: ['Growing family', 'Retirement plans', 'Career changes', 'Aging parents']
    },
    {
      step: 4,
      title: 'Rank Your Nice-to-Haves',
      description: 'Prioritize features that enhance comfort but aren\'t essential',
      questions: [
        'Which nice-to-haves would you miss most?',
        'What features would you be willing to add later?',
        'Which preferences might you compromise on?',
        'What would make you choose one property over another?'
      ],
      examples: ['Updated kitchen', 'Hardwood floors', 'Large garage', 'Swimming pool']
    }
  ];

  const decisionMatrix = [
    {
      category: 'Must-Have Criteria',
      description: 'These are non-negotiable. Any property missing these should be rejected.',
      examples: [
        'Within budget (purchase price + monthly costs)',
        'Minimum required bedrooms/bathrooms',
        'Acceptable commute time',
        'Safe neighborhood',
        'Required accessibility features'
      ],
      action: 'Eliminate properties that don\'t meet these criteria'
    },
    {
      category: 'High Priority Wants',
      description: 'Very important features that significantly impact daily life or value.',
      examples: [
        'Preferred school district',
        'Move-in ready condition',
        'Specific architectural style',
        'Large kitchen',
        'Private outdoor space'
      ],
      action: 'Strongly prefer properties with these features'
    },
    {
      category: 'Nice-to-Have Features',
      description: 'Desirable but not essential. Good for tie-breaking between properties.',
      examples: [
        'Updated finishes',
        'Hardwood floors',
        'Additional storage',
        'Fireplace',
        'Premium appliances'
      ],
      action: 'Consider these as bonus features when comparing options'
    },
    {
      category: 'Wish List Items',
      description: 'Features you\'d love but can live without or add later.',
      examples: [
        'Swimming pool',
        'Home theater',
        'Wine cellar',
        'Three-car garage',
        'Mountain views'
      ],
      action: 'Don\'t let these drive decisions, but enjoy if you find them'
    }
  ];

  const commonMistakes = [
    {
      mistake: 'Focusing too much on aesthetics',
      explanation: 'Paint colors and decorating can be changed easily and inexpensively.',
      solution: 'Look past surface finishes to structural and location factors.'
    },
    {
      mistake: 'Not considering resale value',
      explanation: 'Even if you plan to stay forever, life circumstances can change.',
      solution: 'Choose features that appeal to a broad range of buyers.'
    },
    {
      mistake: 'Ignoring total cost of ownership',
      explanation: 'Purchase price is just the beginning of homeownership costs.',
      solution: 'Factor in taxes, insurance, utilities, maintenance, and HOA fees.'
    },
    {
      mistake: 'Being too rigid with wish list',
      explanation: 'The perfect home rarely exists, and you might miss great opportunities.',
      solution: 'Be willing to compromise on less important features.'
    },
    {
      mistake: 'Not planning for future needs',
      explanation: 'Your needs may change due to family, career, or aging.',
      solution: 'Consider how your life might evolve over the next 5-10 years.'
    },
    {
      mistake: 'Emotional decision making',
      explanation: 'Falling in love with a property can cloud judgment about practical needs.',
      solution: 'Use your written criteria to evaluate properties objectively.'
    }
  ];

  // Scoring tool functions
  const getAllFeatures = () => {
    return featureCategories.flatMap(category => 
      category.features.map(feature => ({
        ...feature,
        categoryId: category.id,
        categoryTitle: category.title
      }))
    );
  };

  const updateWeight = (featureKey: string, weight: number | 'na') => {
    setWeights(prev => ({ ...prev, [featureKey]: weight }));
  };

  const updateScore = (featureKey: string, score: number | 'na') => {
    const propertyName = editingProperty || currentProperty;
    if (!propertyName) return;
    setPropertyScores(prev => ({
      ...prev,
      [propertyName]: {
        ...prev[propertyName],
        [featureKey]: score
      }
    }));
  };

  const calculatePropertyScore = (propertyName: string) => {
    const property = propertyScores[propertyName];
    if (!property) return "0";

    let totalWeightedScore = 0;
    let totalWeight = 0;

    Object.entries(property).forEach(([featureKey, score]) => {
      const weight = weights[featureKey] || 5; // Default weight is 5
      if (weight !== 'na' && score !== 'na') {
        totalWeightedScore += score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(1) : "0";
  };

  const saveProperty = () => {
    if (currentProperty && !savedProperties.includes(currentProperty)) {
      setSavedProperties(prev => [...prev, currentProperty]);
      setCurrentProperty('');
    }
  };

  const addCustomFeature = () => {
    if (newCustomFeature.trim()) {
      setCustomFeatures(prev => [...prev, { feature: newCustomFeature.trim(), weight: 5 }]);
      setNewCustomFeature('');
    }
  };

  const removeCustomFeature = (index: number) => {
    setCustomFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const startEditingProperty = (propertyName: string) => {
    setEditingProperty(propertyName);
    setCurrentProperty(propertyName);
  };

  const finishEditingProperty = () => {
    setEditingProperty(null);
    setCurrentProperty('');
  };

  const startEditingFeature = (featureKey: string, currentText: string) => {
    setEditingFeature(featureKey);
    setEditingText(currentText);
  };

  const saveFeatureEdit = () => {
    if (editingFeature && editingText.trim()) {
      setEditableFeatures(prev => ({
        ...prev,
        [editingFeature]: editingText.trim()
      }));
    }
    setEditingFeature(null);
    setEditingText('');
  };

  const cancelFeatureEdit = () => {
    setEditingFeature(null);
    setEditingText('');
  };

  const getFeatureDisplayName = (featureKey: string, originalName: string) => {
    return editableFeatures[featureKey] || originalName;
  };

  const deleteProperty = (propertyName: string) => {
    setSavedProperties(prev => prev.filter(p => p !== propertyName));
    setPropertyScores(prev => {
      const newScores = { ...prev };
      delete newScores[propertyName];
      return newScores;
    });
  };

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
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-900',
          icon: 'text-yellow-600',
          accent: 'bg-yellow-100'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-900',
          icon: 'text-purple-600',
          accent: 'bg-purple-100'
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
            <StarIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="duolingo-title mb-4">Property Features Priority Guide</h1>
          <p className="duolingo-subtitle max-w-3xl mx-auto">
            Learn to distinguish between must-haves and nice-to-haves to make smarter property decisions. 
            This guide helps you prioritize features that matter most for your lifestyle and budget.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="duolingo-card mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'categories', label: 'Feature Categories', icon: HomeIcon },
              { id: 'framework', label: 'Prioritization Process', icon: ClockIcon },
              { id: 'matrix', label: 'Decision Matrix', icon: CheckCircleIcon },
              { id: 'scoring', label: 'Property Scoring Tool', icon: StarIcon },
              { id: 'mistakes', label: 'Common Mistakes', icon: InformationCircleIcon }
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

          {/* Feature Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-8">
              {featureCategories.map((category) => {
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
                      {category.features.map((feature, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{feature.feature}</h4>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                feature.impact === 'Critical' ? 'bg-red-100 text-red-700' :
                                feature.impact === 'High' ? 'bg-orange-100 text-orange-700' :
                                feature.impact === 'Medium' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {feature.impact} Impact
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                feature.changeable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {feature.changeable ? 'Changeable' : 'Fixed'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Considerations:</p>
                              <p className="text-gray-600">{feature.considerations}</p>
                            </div>
                            
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Key Questions:</p>
                              <ul className="text-gray-600 space-y-1">
                                {feature.questions.map((q, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-500 mr-1">•</span>
                                    {q}
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

          {/* Prioritization Framework Tab */}
          {activeTab === 'framework' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">4-Step Prioritization Process</h3>
                <p className="text-gray-600">Follow this process to systematically prioritize property features.</p>
              </div>
              
              {prioritizationFramework.map((step, index) => (
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
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-green-800 mb-2">Ask Yourself:</p>
                      <ul className="space-y-1">
                        {step.questions.map((question, qIndex) => (
                          <li key={qIndex} className="flex items-start text-sm text-green-700">
                            <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium text-green-800 mb-2">Examples:</p>
                      <div className="flex flex-wrap gap-2">
                        {step.examples.map((example, eIndex) => (
                          <span key={eIndex} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Decision Matrix Tab */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Property Evaluation Matrix</h3>
                <p className="text-gray-600">Use these categories to systematically evaluate each property.</p>
              </div>
              
              {decisionMatrix.map((category, index) => (
                <div key={index} className={`p-6 rounded-lg border-2 ${
                  index === 0 ? 'bg-red-50 border-red-200' :
                  index === 1 ? 'bg-orange-50 border-orange-200' :
                  index === 2 ? 'bg-blue-50 border-blue-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-orange-500' :
                      index === 2 ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}>
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h4 className={`text-lg font-semibold ${
                      index === 0 ? 'text-red-900' :
                      index === 1 ? 'text-orange-900' :
                      index === 2 ? 'text-blue-900' :
                      'text-gray-900'
                    }`}>{category.category}</h4>
                  </div>
                  
                  <p className={`text-sm mb-4 ${
                    index === 0 ? 'text-red-800' :
                    index === 1 ? 'text-orange-800' :
                    index === 2 ? 'text-blue-800' :
                    'text-gray-800'
                  }`}>{category.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className={`font-medium mb-2 ${
                        index === 0 ? 'text-red-800' :
                        index === 1 ? 'text-orange-800' :
                        index === 2 ? 'text-blue-800' :
                        'text-gray-800'
                      }`}>Examples:</p>
                      <ul className="space-y-1">
                        {category.examples.map((example, eIndex) => (
                          <li key={eIndex} className={`flex items-start text-sm ${
                            index === 0 ? 'text-red-700' :
                            index === 1 ? 'text-orange-700' :
                            index === 2 ? 'text-blue-700' :
                            'text-gray-700'
                          }`}>
                            <span className="mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      index === 0 ? 'bg-red-100' :
                      index === 1 ? 'bg-orange-100' :
                      index === 2 ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      <p className={`font-medium text-sm ${
                        index === 0 ? 'text-red-900' :
                        index === 1 ? 'text-orange-900' :
                        index === 2 ? 'text-blue-900' :
                        'text-gray-900'
                      }`}>Action: {category.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Property Scoring Tool Tab */}
          {activeTab === 'scoring' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Property Scoring Tool</h3>
                <p className="text-gray-600">Set importance weights for features, then score properties you visit for an objective comparison.</p>
              </div>

              {/* Step 1: Set Feature Weights */}
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--duolingo-green)' }}>
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="text-lg font-semibold text-green-900">Set Feature Importance Weights To You</h4>
                </div>
                
                {/* Prominent instruction text */}
                <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg">
                  <h5 className="text-xl font-bold text-green-900 mb-2 text-center">
                    Rate how important each feature is to you
                  </h5>
                  <p className="text-lg font-semibold text-green-800 text-center">
                    1 = not important, 10 = extremely important
                  </p>
                  <p className="text-sm text-green-700 text-center mt-2">
                    Use "N/A" if the feature doesn't apply to your situation
                  </p>
                  <p className="text-xs text-green-600 text-center mt-2 italic">
                    💡 Tip: Click any feature name to edit and customize it to your needs
                  </p>
                </div>
                
                <div className="grid gap-4">
                  {featureCategories.map((category) => (
                    <div key={category.id} className="bg-white p-4 rounded-lg border">
                      <h5 className="font-semibold text-gray-900 mb-3">{category.title}</h5>
                      <div className="space-y-3">
                        {category.features.map((feature, fIndex) => {
                          const featureKey = `${category.id}-${fIndex}`;
                          const currentWeight = weights[featureKey];
                          const isNA = currentWeight === 'na';
                          return (
                            <div key={fIndex} className="flex items-center justify-between py-2">
                              <div className="flex-1">
                                {editingFeature === featureKey ? (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={editingText}
                                      onChange={(e) => setEditingText(e.target.value)}
                                      className="text-sm text-black bg-white border border-green-300 rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveFeatureEdit();
                                        if (e.key === 'Escape') cancelFeatureEdit();
                                      }}
                                      autoFocus
                                    />
                                    <button
                                      onClick={saveFeatureEdit}
                                      className="text-green-600 hover:text-green-800 text-xs px-1"
                                      title="Save"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={cancelFeatureEdit}
                                      className="text-red-600 hover:text-red-800 text-xs px-1"
                                      title="Cancel"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <span 
                                    className="text-sm text-gray-700 cursor-pointer hover:text-green-600 hover:underline"
                                    onClick={() => startEditingFeature(featureKey, getFeatureDisplayName(featureKey, feature.feature))}
                                    title="Click to edit feature name"
                                  >
                                    {getFeatureDisplayName(featureKey, feature.feature)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateWeight(featureKey, 'na')}
                                  className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                                    isNA 
                                      ? 'bg-gray-600 text-white' 
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  N/A
                                </button>
                                <span className="text-xs text-gray-500">1</span>
                                <input
                                  type="range"
                                  min="1"
                                  max="10"
                                  value={isNA ? 5 : (currentWeight || 5)}
                                  onChange={(e) => updateWeight(featureKey, parseInt(e.target.value))}
                                  disabled={isNA}
                                  className={`w-24 ${isNA ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                <span className="text-xs text-gray-500">10</span>
                                <span className="w-8 text-sm font-medium text-center" style={{ color: isNA ? '#666' : 'var(--duolingo-green)' }}>
                                  {isNA ? 'N/A' : (currentWeight || 5)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  
                  {/* Custom Features Section */}
                  <div className="bg-white p-4 rounded-lg border border-dashed border-green-300">
                    <h5 className="font-semibold text-gray-900 mb-3">Add Your Custom Features</h5>
                    
                    {/* Add new custom feature */}
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="text"
                        value={newCustomFeature}
                        onChange={(e) => setNewCustomFeature(e.target.value)}
                        placeholder="Enter custom feature (e.g., Pool, Home office)"
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={addCustomFeature}
                        disabled={!newCustomFeature.trim()}
                        className="px-3 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Add Feature
                      </button>
                    </div>
                    
                    {/* Display custom features */}
                    <div className="space-y-3">
                      {customFeatures.map((customFeature, index) => {
                        const featureKey = `custom-${index}`;
                        const currentWeight = weights[featureKey];
                        const isNA = currentWeight === 'na';
                        return (
                          <div key={index} className="flex items-center justify-between py-2 bg-green-25 rounded px-2">
                            <span className="text-sm text-gray-700 flex-1">{customFeature.feature}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => removeCustomFeature(index)}
                                className="text-red-500 hover:text-red-700 text-xs px-1"
                                title="Remove feature"
                              >
                                ✕
                              </button>
                              <button
                                onClick={() => updateWeight(featureKey, 'na')}
                                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                                  isNA 
                                    ? 'bg-gray-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                N/A
                              </button>
                              <span className="text-xs text-gray-500">1</span>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={isNA ? 5 : (currentWeight || customFeature.weight)}
                                onChange={(e) => updateWeight(featureKey, parseInt(e.target.value))}
                                disabled={isNA}
                                className={`w-24 ${isNA ? 'opacity-50 cursor-not-allowed' : ''}`}
                              />
                              <span className="text-xs text-gray-500">10</span>
                              <span className="w-8 text-sm font-medium text-center" style={{ color: isNA ? '#666' : 'var(--duolingo-green)' }}>
                                {isNA ? 'N/A' : (currentWeight || customFeature.weight)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {customFeatures.length === 0 && (
                      <p className="text-sm text-gray-500 italic text-center py-2">
                        No custom features added yet. Add features that are important to you but not listed above.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Score Properties */}
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="text-lg font-semibold text-blue-900">Score Properties You Visit</h4>
                </div>
                
                {/* Pro Tip */}
                <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500 rounded-r-lg">
                  <div className="flex items-start">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-800 text-sm mb-1">💡 Pro Tip for Open Houses</p>
                      <p className="text-blue-700 text-sm">
                        HouseSigma has an open house filter on their map that shows when and where open houses are happening. 
                        This makes it easy to plan your property visits and discover homes you might not have found otherwise.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-blue-800 text-sm font-medium mb-2">Property Name/Address:</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentProperty}
                      onChange={(e) => setCurrentProperty(e.target.value)}
                      placeholder="Enter property name or address"
                      className="flex-1 p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {editingProperty ? (
                      <button
                        onClick={finishEditingProperty}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                      >
                        Finish Editing
                      </button>
                    ) : (
                      <button
                        onClick={saveProperty}
                        disabled={!currentProperty}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Property
                      </button>
                    )}
                  </div>
                  {editingProperty && (
                    <p className="text-blue-700 text-sm mt-2">
                      ✏️ Currently editing: <strong>{editingProperty}</strong>
                    </p>
                  )}
                </div>

                {currentProperty && (
                  <div className="grid gap-4">
                    <p className="text-blue-700 text-sm">Rate each feature for: <strong>{currentProperty}</strong> (1-10 scale)</p>
                    {featureCategories.map((category) => (
                      <div key={category.id} className="bg-white p-4 rounded-lg border">
                        <h5 className="font-semibold text-gray-900 mb-3">{category.title}</h5>
                        <div className="space-y-3">
                          {category.features.map((feature, fIndex) => {
                            const featureKey = `${category.id}-${fIndex}`;
                            const propertyName = editingProperty || currentProperty;
                            const hasScore = propertyScores[propertyName]?.hasOwnProperty(featureKey);
                            const currentScore = propertyScores[propertyName]?.[featureKey];
                            const isNA = currentScore === 'na' || !hasScore;
                            const isExplicitNA = currentScore === 'na';
                            const isUnscored = !hasScore;
                            
                            return (
                              <div key={fIndex} className="py-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    {editingFeature === featureKey ? (
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="text"
                                          value={editingText}
                                          onChange={(e) => setEditingText(e.target.value)}
                                          className="text-sm text-black bg-white border border-blue-300 rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveFeatureEdit();
                                            if (e.key === 'Escape') cancelFeatureEdit();
                                          }}
                                          autoFocus
                                        />
                                        <button
                                          onClick={saveFeatureEdit}
                                          className="text-green-600 hover:text-green-800 text-xs px-1"
                                          title="Save"
                                        >
                                          ✓
                                        </button>
                                        <button
                                          onClick={cancelFeatureEdit}
                                          className="text-red-600 hover:text-red-800 text-xs px-1"
                                          title="Cancel"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <span 
                                        className="text-sm text-black cursor-pointer hover:text-blue-600 hover:underline"
                                        onClick={() => startEditingFeature(featureKey, getFeatureDisplayName(featureKey, feature.feature))}
                                        title="Click to edit feature name"
                                      >
                                        {getFeatureDisplayName(featureKey, feature.feature)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => updateScore(featureKey, 'na')}
                                      className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                                        isExplicitNA 
                                          ? 'bg-gray-600 text-white' 
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      N/A
                                    </button>
                                    <span className="text-xs text-gray-500">1</span>
                                    <input
                                      type="range"
                                      min="1"
                                      max="10"
                                      value={hasScore && currentScore !== 'na' ? currentScore : 5}
                                      onChange={(e) => updateScore(featureKey, parseInt(e.target.value))}
                                      disabled={isExplicitNA}
                                      className={`w-24 ${isExplicitNA ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <span className="text-xs text-gray-500">10</span>
                                    <span className={`w-8 text-sm font-medium text-center ${
                                      isUnscored ? 'text-black' : 
                                      isExplicitNA ? 'text-black' : 'text-blue-600'
                                    }`}>
                                      {isUnscored ? '-' : isExplicitNA ? 'N/A' : currentScore}
                                    </span>
                                  </div>
                                </div>
                                {isUnscored && (
                                  <div className="text-right mt-1">
                                    <span className="text-xs text-black">(not scored)</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    
                    {/* Custom Features Scoring */}
                    {customFeatures.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border border-dashed border-blue-300">
                        <h5 className="font-semibold text-gray-900 mb-3">Your Custom Features</h5>
                        <div className="space-y-3">
                          {customFeatures.map((customFeature, index) => {
                            const featureKey = `custom-${index}`;
                            const propertyName = editingProperty || currentProperty;
                            const hasScore = propertyScores[propertyName]?.hasOwnProperty(featureKey);
                            const currentScore = propertyScores[propertyName]?.[featureKey];
                            const isNA = currentScore === 'na' || !hasScore;
                            const isExplicitNA = currentScore === 'na';
                            const isUnscored = !hasScore;
                            
                            return (
                              <div key={index} className="py-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm flex-1 text-black">
                                    {customFeature.feature}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => removeCustomFeature(index)}
                                      className="text-red-500 hover:text-red-700 text-xs px-1"
                                      title="Remove feature"
                                    >
                                      ✕
                                    </button>
                                    <button
                                      onClick={() => updateScore(featureKey, 'na')}
                                      className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                                        isExplicitNA 
                                          ? 'bg-gray-600 text-white' 
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      N/A
                                    </button>
                                    <span className="text-xs text-gray-500">1</span>
                                    <input
                                      type="range"
                                      min="1"
                                      max="10"
                                      value={hasScore && currentScore !== 'na' ? currentScore : 5}
                                      onChange={(e) => updateScore(featureKey, parseInt(e.target.value))}
                                      disabled={isExplicitNA}
                                      className={`w-24 ${isExplicitNA ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <span className="text-xs text-gray-500">10</span>
                                    <span className={`w-8 text-sm font-medium text-center ${
                                      isUnscored ? 'text-black' : 
                                      isExplicitNA ? 'text-black' : 'text-blue-600'
                                    }`}>
                                      {isUnscored ? '-' : isExplicitNA ? 'N/A' : currentScore}
                                    </span>
                                  </div>
                                </div>
                                {isUnscored && (
                                  <div className="text-right mt-1">
                                    <span className="text-xs text-black">(not scored)</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 3: Compare Properties */}
              {savedProperties.length > 0 && (
                <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="text-lg font-semibold text-purple-900">Property Comparison</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {savedProperties
                      .sort((a, b) => parseFloat(calculatePropertyScore(b)) - parseFloat(calculatePropertyScore(a)))
                      .map((property, index) => {
                        const score = calculatePropertyScore(property);
                        const scoreColor = parseFloat(score) >= 8 ? 'text-green-600' : 
                                         parseFloat(score) >= 6 ? 'text-yellow-600' : 'text-red-600';
                        
                        // Calculate unscored features
                        const propertyScoresForProperty = propertyScores[property] || {};
                        const allFeatures = [...featureCategories.flatMap(cat => cat.features), ...customFeatures];
                        const totalFeatures = allFeatures.length;
                        const scoredCount = Object.keys(propertyScoresForProperty).length;
                        const unscoredCount = totalFeatures - scoredCount;
                        
                        return (
                          <div key={property} className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                                  index === 0 ? 'bg-yellow-500' : 
                                  index === 1 ? 'bg-gray-400' : 
                                  index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <h6 className="font-semibold text-gray-900">{property}</h6>
                                  <p className="text-sm text-gray-600">
                                    {scoredCount} of {totalFeatures} features scored
                                  </p>
                                  {unscoredCount > 0 && (
                                    <p className="text-xs text-orange-600 mt-1">
                                      ⚠️ {unscoredCount} features unranked and not scored
                                    </p>
                                  )}
                                </div>
                              </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${scoreColor}`}>{score}</div>
                                <div className="text-xs text-gray-500">/ 10</div>
                              </div>
                              <button
                                onClick={() => startEditingProperty(property)}
                                className="text-blue-500 hover:text-blue-700 p-1"
                                title="Edit property scores"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deleteProperty(property)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Delete property"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  <div className="mt-4 p-4 bg-purple-100 rounded-lg">
                    <h6 className="font-semibold text-purple-900 mb-2">How the Final Score is Calculated:</h6>
                    <div className="text-purple-800 text-sm space-y-2">
                      <p>
                        <strong>Weighted Average Formula:</strong> Each feature's score (1-10) is multiplied by its importance weight (1-10) that you set earlier.
                      </p>
                      <p>
                        <strong>Example:</strong> If "School District" has importance weight 9 and you scored it 8, it contributes 72 points (9 × 8 = 72).
                      </p>
                      <p>
                        <strong>Final Calculation:</strong> All weighted scores are added together, then divided by the total of all weights to get your final property score out of 10.
                      </p>
                      <div className="mt-2 p-2 bg-purple-200 rounded text-xs">
                        <strong>Formula:</strong> Final Score = (Sum of all: Feature Score × Feature Weight) ÷ (Sum of all Feature Weights)
                      </div>
                      <p className="text-xs">
                        <em>Note: Features marked as N/A or unscored are excluded from the calculation entirely.</em>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Common Mistakes Tab */}
          {activeTab === 'mistakes' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Avoid These Common Mistakes</h3>
                <p className="text-gray-600">Learn from others' experiences to make better decisions.</p>
              </div>
              
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <InformationCircleIcon className="w-6 h-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900 mb-2">{mistake.mistake}</h4>
                      <p className="text-yellow-800 text-sm mb-3">{mistake.explanation}</p>
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <p className="font-medium text-yellow-900 text-sm">
                          <strong>Better approach:</strong> {mistake.solution}
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
            <span className="text-2xl mr-3">📝</span>
            Create Your Property Criteria
          </h2>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Use this guide to create a written list of your must-haves and nice-to-haves before you start house hunting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="duolingo-button"
              >
                Start Defining Your Criteria
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