// Journey Engine - Core logic for managing user journey through home buying process

import { 
  JourneyTemplate, 
  JourneyPhase, 
  JourneyStep, 
  UserJourneyProgress, 
  StepProgress,
  RegionCode 
} from '@/types/regional';

// Base journey template (generic steps applicable to all regions)
export const baseJourneyTemplate: JourneyTemplate = {
  basePhases: [
    {
      id: 'pre-approval',
      title: 'Figure Out Your Budget',
      description: 'Find out how much you can spend on your dream home',
      order: 1,
      estimatedDuration: '1-2 weeks',
      icon: '💰',
      steps: [
        {
          id: 'research-lenders',
          phaseId: 'pre-approval',
          title: 'Find the Right Bank for You',
          description: 'Shop around for the best home loan deals',
          order: 1,
          category: 'financing',
          estimatedDuration: '2-3 days',
          prerequisites: [],
          resources: [],
          checklist: [
            {
              id: 'understand-mortgage-types',
              title: 'Learn about different home loan types',
              description: 'Simple breakdown: fixed rate (payment stays the same) vs variable rate (payment can change).',
              category: 'research',
              estimatedTime: '15-20 minutes',
              required: true
            },
            {
              id: 'compare-rates',
              title: 'Compare rates from 3 different banks',
              description: 'Shop around! Different banks offer different deals - it pays to compare.',
              category: 'research',
              required: true
            },
            {
              id: 'check-first-time-programs',
              title: 'Look for first-time buyer perks',
              description: 'Many places offer special deals and discounts for first-time buyers - find yours!',
              category: 'research',
              estimatedTime: '20-30 minutes',
              required: true
            },
            {
              id: 'use-mortgage-calculator',
              title: 'Use mortgage calculator to explore scenarios',
              description: 'Practice with different loan amounts, rates, and terms to understand payment impacts.',
              category: 'planning',
              estimatedTime: '10-15 minutes',
              required: true
            }
          ],
          tips: [
            'Don\'t just focus on the lowest rate - consider the full package',
            'Ask about rate holds and how long they last',
            'Confirm all fees and closing costs upfront',
            'Make sure the lender can close within your timeline'
          ]
        },
        {
          id: 'get-preapproval',
          phaseId: 'pre-approval',
          title: 'Get Pre-approved',
          description: 'Submit application and get pre-approval letter',
          order: 2,
          category: 'financing',
          estimatedDuration: '3-5 days',
          prerequisites: ['research-lenders'],
          resources: [],
          checklist: [
            {
              id: 'select-preferred-provider',
              title: 'Select preferred mortgage provider',
              description: 'Choose your final lender based on rates, service, and terms from your research.',
              category: 'decision',
              estimatedTime: '30 minutes',
              required: true
            },
            {
              id: 'gather-documents',
              title: 'Gather required documents (income, assets, debt)',
              description: 'Collect all documentation needed for pre-approval application.',
              category: 'document',
              estimatedTime: '2-3 hours',
              required: true
            },
            {
              id: 'submit-application',
              title: 'Submit pre-approval application and documentation',
              description: 'Complete and submit your mortgage pre-approval application with all supporting documents.',
              category: 'action',
              estimatedTime: '1-2 hours',
              required: true
            },
            {
              id: 'receive-preapproval',
              title: 'Receive pre-approval letter',
              category: 'action',
              required: true
            }
          ],
          tips: [
            'Pre-approval shows sellers you\'re a serious buyer',
            'Don\'t make major financial changes after pre-approval',
            'Pre-approval is typically valid for 60-90 days'
          ],
          warnings: [
            'Avoid large purchases or new credit accounts during this time'
          ]
        }
      ]
    },
    {
      id: 'house-hunting',
      title: 'House Hunting',
      description: 'Find and evaluate potential homes with your agent',
      order: 2,
      estimatedDuration: '2-8 weeks',
      icon: '🏠',
      steps: [
        {
          id: 'find-agent',
          phaseId: 'house-hunting',
          title: 'Find a Real Estate Agent',
          description: 'Choose an experienced agent who knows your target area',
          order: 1,
          category: 'searching',
          estimatedDuration: '1-2 weeks',
          prerequisites: ['get-preapproval'],
          resources: [],
          checklist: [
            {
              id: 'check-references',
              title: 'Check agent references and reviews',
              description: 'Research potential agents online and check their reviews, credentials, and past client feedback.',
              category: 'research',
              estimatedTime: '1-2 hours',
              required: true
            },
            {
              id: 'reach-out-to-agents',
              title: 'Reach out to agents',
              description: 'Connect with potential real estate agents to find the right fit for your needs.',
              category: 'action',
              estimatedTime: '1-2 hours',
              required: true
            },
            {
              id: 'sign-buyer-agreement',
              title: 'Sign buyer representation agreement',
              category: 'action',
              required: true
            }
          ],
          tips: [
            'Choose an agent who specializes in your price range and area',
            'Make sure they understand your timeline and needs',
            'Good agents should provide market analysis and guidance'
          ]
        },
        {
          id: 'search-homes',
          phaseId: 'house-hunting',
          title: 'Search for Homes',
          description: 'Tour homes and narrow down your choices',
          order: 2,
          category: 'searching',
          estimatedDuration: '2-6 weeks',
          prerequisites: ['find-agent'],
          resources: [],
          checklist: [
            {
              id: 'define-criteria',
              title: 'Define your must-haves vs. nice-to-haves',
              description: 'Create a clear list of property requirements and preferences.',
              category: 'decision',
              estimatedTime: '1-2 hours',
              required: true
            },
            {
              id: 'diy-market-research',
              title: 'Research market conditions yourself',
              description: 'Research the market yourself to understand trends, pricing, and available inventory.',
              category: 'research',
              estimatedTime: '2-3 hours',
              required: true
            },
            {
              id: 'reach-out-agent-criteria',
              title: 'Reach out to agent with your criteria',
              description: 'Share your property requirements with your agent and request matching listings.',
              category: 'action',
              estimatedTime: '30 minutes',
              required: true
            },
            {
              id: 'tour-homes',
              title: 'Tour potential homes',
              description: 'Schedule and attend home viewings with your agent, or visit open houses on your own.',
              category: 'action',
              estimatedTime: 'Ongoing',
              required: true
            }
          ],
          tips: [
            'Keep detailed notes and photos of each home',
            'Visit neighborhoods at different times of day',
            'Consider resale value, not just current needs'
          ]
        }
      ]
    },
    {
      id: 'making-offer',
      title: 'Making an Offer',
      description: 'Submit competitive offers and negotiate terms',
      order: 3,
      estimatedDuration: '1-3 weeks',
      icon: '📝',
      steps: [
        {
          id: 'analyze-comparables',
          phaseId: 'making-offer',
          title: 'Analyze Market Comparables',
          description: 'Research recent sales to determine fair offer price',
          order: 1,
          category: 'searching',
          estimatedDuration: '1-2 days',
          prerequisites: ['search-homes'],
          resources: [],
          checklist: [
            {
              id: 'review-comps',
              title: 'Review comparable sales with your agent',
              category: 'research',
              required: true
            },
            {
              id: 'assess-property-value',
              title: 'Assess property value',
              description: 'Determine fair market value using multiple valuation methods and data sources.',
              category: 'research',
              estimatedTime: '2-3 hours',
              guideLink: '/guides/property-value-assessment',
              required: true
            }
          ],
          tips: [
            'Look at sales within the last 3-6 months',
            'Consider homes of similar size, age, and condition',
            'Factor in current market trends (buyer vs seller market)'
          ]
        },
        {
          id: 'submit-offer',
          phaseId: 'making-offer',
          title: 'Submit Purchase Offer',
          description: 'Make a competitive offer with appropriate conditions',
          order: 2,
          category: 'searching',
          estimatedDuration: '1-2 days',
          prerequisites: ['analyze-comparables'],
          resources: [],
          checklist: [
            {
              id: 'determine-offer-price',
              title: 'Agree on offer price with real estate agent and negotiation strategy',
              description: 'Work with your agent to determine competitive pricing and negotiation approach.',
              category: 'decision',
              estimatedTime: '45-60 minutes',
              guideLink: '/guides/offer-negotiation-strategy',
              required: true
            },
            {
              id: 'include-conditions',
              title: 'Include appropriate conditions (inspection, financing)',
              description: 'Choose the right conditions to protect yourself while staying competitive.',
              category: 'action',
              estimatedTime: '30-45 minutes',
              guideLink: '/guides/offer-conditions',
              required: true
            },
            {
              id: 'submit-offer',
              title: 'Submit written offer through agent',
              description: 'Understand the timeline - things move quickly in real estate offers.',
              category: 'action',
              estimatedTime: '30 minutes',
              guideLink: '/guides/offer-submission-timeline',
              required: true
            }
          ],
          tips: [
            'In competitive markets, consider limiting conditions',
            'Include earnest money to show you\'re serious',
            'Be prepared to negotiate - first offer is rarely accepted'
          ],
          warnings: []
        }
      ]
    },
    {
      id: 'closing',
      title: 'Closing Process',
      description: 'Complete inspections, finalize financing, and close on your home',
      order: 4,
      estimatedDuration: '3-6 weeks',
      icon: '🔑',
      steps: [
        {
          id: 'home-inspection',
          phaseId: 'closing',
          title: 'Home Inspection',
          description: 'Conduct professional inspection and negotiate repairs',
          order: 1,
          category: 'inspection',
          estimatedDuration: '1-2 weeks',
          prerequisites: ['submit-offer'],
          resources: [],
          checklist: [
            {
              id: 'hire-inspector',
              title: 'Hire qualified home inspector',
              category: 'action',
              required: true
            },
            {
              id: 'attend-inspection',
              title: 'Attend inspection and ask questions',
              description: 'Learn what questions to ask during the home inspection.',
              category: 'action',
              estimatedTime: '2-3 hours',
              guideLink: '/guides/home-inspection-questions',
              required: true
            },
            {
              id: 'review-report',
              title: 'Review inspection report with agent',
              category: 'action',
              required: true
            },
            {
              id: 'negotiate-repairs',
              title: 'Negotiate repairs or credits with seller',
              description: 'Understand your options for addressing inspection findings.',
              category: 'action',
              estimatedTime: '1-3 days',
              details: [
                'Review inspection report with agent to prioritize issues',
                'Get repair estimates for major problems',
                'Decide between asking for repairs, credits, or price reduction',
                'Submit repair request or negotiation to seller',
                'Be prepared to compromise on minor issues'
              ],
              required: true
            }
          ],
          tips: [
            'Don\'t skip the inspection to save money',
            'Focus on major issues, not cosmetic problems',
            'Get quotes for any major repairs before negotiating'
          ]
        },
        {
          id: 'finalize-mortgage',
          phaseId: 'closing',
          title: 'Finalize Mortgage',
          description: 'Complete mortgage underwriting and prepare for closing',
          order: 2,
          category: 'financing',
          estimatedDuration: '2-4 weeks',
          prerequisites: ['submit-offer'],
          resources: [],
          checklist: [
            {
              id: 'complete-mortgage-application',
              title: 'Complete detailed mortgage application',
              description: 'Submit comprehensive application with all required documents and information.',
              category: 'document',
              estimatedTime: '2-3 hours',
              details: [
                'Fill out complete loan application with employment history',
                'Provide updated financial documents (pay stubs, bank statements)',
                'Declare all assets, debts, and income sources',
                'Sign authorization for credit and employment verification',
                'Review application for accuracy before submission'
              ],
              required: true
            },
            {
              id: 'order-appraisal',
              title: 'Lender orders home appraisal',
              description: 'Professional appraisal determines if home value supports loan amount.',
              category: 'action',
              estimatedTime: '1-2 weeks',
              details: [
                'Lender schedules licensed appraiser to visit property',
                'Appraiser inspects home and compares to recent sales',
                'Appraisal report determines fair market value',
                'Loan amount cannot exceed appraised value',
                'You may need to renegotiate if appraisal comes in low'
              ],
              required: true
            },
            {
              id: 'underwriting-approval',
              title: 'Receive final underwriting approval',
              description: 'Underwriter reviews all documents and approves the loan for closing.',
              category: 'action',
              estimatedTime: '1-2 weeks',
              details: [
                'Underwriter reviews credit, income, assets, and property',
                'May request additional documents or explanations',
                'Responds promptly to any underwriter requests',
                'Receives \'clear to close\' or conditional approval',
                'Final approval confirms loan terms and closing date'
              ],
              required: true
            },
            {
              id: 'lock-interest-rate',
              title: 'Lock in your interest rate',
              description: 'Secure your mortgage rate to protect against rate increases during closing.',
              category: 'action',
              estimatedTime: '30 minutes',
              details: [
                'Choose rate lock period (15, 30, 45, or 60 days)',
                'Rate lock protects you from rate increases',
                'Get rate lock confirmation in writing',
                'Monitor rate lock expiration date',
                'Extend rate lock if closing is delayed (may cost extra)'
              ],
              required: true
            }
          ],
          tips: [
            'Respond quickly to lender requests for documentation',
            'Don\'t make major purchases during underwriting',
            'Review loan terms carefully before signing'
          ],
          warnings: [
            'Avoid changing jobs or making large purchases during this time'
          ]
        },
        {
          id: 'final-walkthrough',
          phaseId: 'closing',
          title: 'Final Walkthrough',
          description: 'Inspect the home one last time before closing',
          order: 3,
          category: 'inspection',
          estimatedDuration: '1 day',
          prerequisites: ['home-inspection', 'finalize-mortgage'],
          resources: [],
          checklist: [
            {
              id: 'schedule-walkthrough',
              title: 'Schedule walkthrough 24-48 hours before closing',
              category: 'action',
              required: true
            },
            {
              id: 'check-repairs',
              title: 'Verify agreed-upon repairs were completed',
              category: 'action',
              required: true
            },
            {
              id: 'test-utilities',
              title: 'Test utilities and major systems',
              description: 'Use our walkthrough checklist to test all utilities and systems.',
              category: 'action',
              estimatedTime: '45-60 minutes',
              guideLink: '/guides/final-walkthrough-checklist',
              required: true
            }
          ],
          tips: [
            'Bring your agent and a checklist',
            'Take photos of any new issues',
            'Don\'t expect perfection - focus on major problems'
          ]
        },
        {
          id: 'closing-day',
          phaseId: 'closing',
          title: 'Closing Day',
          description: 'Sign documents, transfer funds, and get your keys',
          order: 4,
          category: 'closing',
          estimatedDuration: '1 day',
          prerequisites: ['final-walkthrough'],
          resources: [],
          checklist: [
            {
              id: 'review-closing-disclosure',
              title: 'Review Closing Disclosure form',
              category: 'document',
              required: true
            },
            {
              id: 'bring-certified-funds',
              title: 'Bring certified funds for closing costs',
              category: 'action',
              required: true
            },
            {
              id: 'sign-documents',
              title: 'Sign all closing documents',
              category: 'action',
              required: true
            },
            {
              id: 'receive-keys',
              title: 'Receive keys and congratulations!',
              category: 'action',
              required: true
            }
          ],
          tips: [
            'Bring photo ID and all required funds',
            'Read everything carefully - ask questions',
            'Keep all closing documents in a safe place'
          ]
        }
      ]
    }
  ],
  regionalOverrides: {
    'ON': {
      // Ontario-specific modifications
      additionalSteps: []
    },
    'BC': {
      // BC-specific modifications  
      additionalSteps: [
        {
          id: 'property-transfer-tax',
          phaseId: 'closing',
          title: 'Property Transfer Tax',
          description: 'Understand BC Property Transfer Tax and first-time buyer exemption',
          order: 5,
          category: 'closing',
          estimatedDuration: '1 day',
          prerequisites: ['closing-day'],
          resources: [
            {
              type: 'website',
              title: 'BC Property Transfer Tax',
              url: 'https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax',
              description: 'Information about BC Property Transfer Tax',
              category: 'government'
            }
          ],
          checklist: [
            {
              id: 'check-exemption',
              title: 'Check if you qualify for first-time buyer exemption',
              category: 'research',
              required: true
            }
          ],
          tips: [
            'First-time buyers may be exempt from PTT on homes under $500K',
            'Partial exemption available for homes $500K-$525K'
          ]
        }
      ]
    }
  }
};

// Journey Engine Class
export class JourneyEngine {
  private template: JourneyTemplate;
  private regionCode: RegionCode;

  constructor(template: JourneyTemplate, regionCode: RegionCode) {
    this.template = template;
    this.regionCode = regionCode;
  }

  // Get journey phases customized for user's region
  getCustomizedPhases(): JourneyPhase[] {
    const basePhases = [...this.template.basePhases];
    const regionalOverrides = this.template.regionalOverrides[this.regionCode];

    if (!regionalOverrides) {
      return basePhases;
    }

    // Apply regional customizations
    let customizedPhases = basePhases.map(phase => {
      // Add regional steps to phases
      if (regionalOverrides.additionalSteps) {
        const additionalSteps = regionalOverrides.additionalSteps.filter(
          step => step.phaseId === phase.id
        );
        phase.steps = [...phase.steps, ...additionalSteps];
      }

      // Remove hidden steps
      if (regionalOverrides.hiddenSteps) {
        phase.steps = phase.steps.filter(
          step => !regionalOverrides.hiddenSteps!.includes(step.id)
        );
      }

      return phase;
    });

    return customizedPhases;
  }

  // Get all steps flattened and properly ordered
  getAllSteps(): JourneyStep[] {
    const phases = this.getCustomizedPhases();
    // Sort phases by order, then flatten and sort steps within each phase
    const sortedPhases = phases.sort((a, b) => a.order - b.order);
    return sortedPhases.flatMap(phase => {
      // Sort steps within each phase by their order
      const sortedSteps = phase.steps.sort((a, b) => a.order - b.order);
      return sortedSteps;
    });
  }

  // Get step by ID
  getStepById(stepId: string): JourneyStep | null {
    const steps = this.getAllSteps();
    return steps.find(step => step.id === stepId) || null;
  }

  // Get steps by phase
  getStepsByPhase(phaseId: string): JourneyStep[] {
    const phases = this.getCustomizedPhases();
    const phase = phases.find(p => p.id === phaseId);
    return phase?.steps || [];
  }

  // Get next step in the journey
  getNextStep(currentStepId: string): JourneyStep | null {
    const steps = this.getAllSteps();
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    
    if (currentIndex === -1 || currentIndex === steps.length - 1) {
      return null;
    }

    return steps[currentIndex + 1];
  }

  // Get previous step in the journey  
  getPreviousStep(currentStepId: string): JourneyStep | null {
    const steps = this.getAllSteps();
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    
    if (currentIndex <= 0) {
      return null;
    }

    return steps[currentIndex - 1];
  }

  // Check if step is available (prerequisites met)
  isStepAvailable(stepId: string, completedSteps: string[]): boolean {
    const step = this.getStepById(stepId);
    if (!step) return false;

    if (!step.prerequisites || step.prerequisites.length === 0) {
      return true;
    }

    return step.prerequisites.every(prereqId => 
      completedSteps.includes(prereqId)
    );
  }

  // Get available next steps
  getAvailableSteps(completedSteps: string[]): JourneyStep[] {
    const allSteps = this.getAllSteps();
    
    return allSteps.filter(step => 
      !completedSteps.includes(step.id) && 
      this.isStepAvailable(step.id, completedSteps)
    );
  }

  // Calculate journey progress percentage
  calculateProgress(completedSteps: string[]): number {
    const allSteps = this.getAllSteps();
    const requiredSteps = allSteps.filter(step => !step.isOptional);
    const completedRequiredSteps = requiredSteps.filter(step => 
      completedSteps.includes(step.id)
    );

    return requiredSteps.length > 0 
      ? (completedRequiredSteps.length / requiredSteps.length) * 100 
      : 0;
  }

  // Get current phase based on progress
  getCurrentPhase(completedSteps: string[], currentStepId?: string): JourneyPhase | null {
    const phases = this.getCustomizedPhases();
    
    if (currentStepId) {
      const currentStep = this.getStepById(currentStepId);
      if (currentStep) {
        return phases.find(phase => phase.id === currentStep.phaseId) || null;
      }
    }

    // Find the first phase with incomplete steps
    for (const phase of phases) {
      const hasIncompleteSteps = phase.steps.some(step => 
        !completedSteps.includes(step.id) && !step.isOptional
      );
      if (hasIncompleteSteps) {
        return phase;
      }
    }

    // If all phases are complete, return the last phase
    return phases[phases.length - 1] || null;
  }
}

// Utility functions
export const createJourneyEngine = (regionCode: RegionCode): JourneyEngine => {
  return new JourneyEngine(baseJourneyTemplate, regionCode);
};

export const initializeUserProgress = (
  userId: string, 
  regionCode: RegionCode
): UserJourneyProgress => {
  const engine = createJourneyEngine(regionCode);
  const firstStep = engine.getAllSteps()[0];

  return {
    userId,
    currentPhaseId: firstStep?.phaseId || 'pre-approval',
    currentStepId: firstStep?.id || 'research-lenders',
    completedSteps: [],
    completedChecklist: [],
    stepProgress: {},
    startedAt: new Date(),
    lastUpdated: new Date(),
    regionCode
  };
};

// Storage utilities for localStorage persistence
export const saveUserProgress = (progress: UserJourneyProgress): void => {
  try {
    localStorage.setItem('buyright_journey_progress', JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save user progress:', error);
  }
};

export const loadUserProgress = (): UserJourneyProgress | null => {
  try {
    const saved = localStorage.getItem('buyright_journey_progress');
    if (saved) {
      const progress = JSON.parse(saved);
      // Convert date strings back to Date objects
      progress.startedAt = new Date(progress.startedAt);
      progress.lastUpdated = new Date(progress.lastUpdated);
      return progress;
    }
  } catch (error) {
    console.error('Failed to load user progress:', error);
  }
  return null;
};

export const clearUserProgress = (): void => {
  try {
    localStorage.removeItem('buyright_journey_progress');
  } catch (error) {
    console.error('Failed to clear user progress:', error);
  }
};