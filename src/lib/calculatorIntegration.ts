// Calculator-Journey Integration Service
// Manages calculator results persistence and journey integration

export interface AffordabilityResult {
  maxHomePrice: number;
  maxMonthlyPayment: number;
  maxLoanAmount: number;
  downPaymentNeeded: number;
  totalHousingBudget: number;
  debtToIncomeRatio: number;
  recommendations: string[];
  totalCashRequired: number;
  calculatedAt: Date;
}

export interface MortgageCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principalAmount: number;
  paymentBreakdown: {
    principal: number;
    interest: number;
    taxes?: number;
    insurance?: number;
  };
  calculatedAt: Date;
  scenario?: string; // For comparing different lenders/scenarios
}

export interface ClosingCostsResult {
  totalClosingCosts: number;
  costsByCategory: { [category: string]: any[] };
  cashNeeded: number;
  percentOfHomePrice: number;
  breakdown: any[];
  calculatedAt: Date;
}

export interface CalculatorResults {
  affordability?: AffordabilityResult;
  mortgage: MortgageCalculation[];
  closingCosts?: ClosingCostsResult;
  lastUpdated: Date;
}

export interface StepCalculatorMapping {
  stepId: string;
  calculators: string[];
  required?: boolean;
  description: string;
}

// Define which calculators are relevant for each journey step
export const STEP_CALCULATOR_MAPPINGS: StepCalculatorMapping[] = [
  {
    stepId: 'assess-finances',
    calculators: ['affordability'],
    required: true,
    description: 'Use the affordability calculator to determine your budget before house hunting'
  },
  {
    stepId: 'set-budget',
    calculators: ['affordability', 'mortgage'],
    required: true,
    description: 'Refine your budget with both affordability and mortgage payment calculations'
  },
  {
    stepId: 'get-preapproved',
    calculators: ['mortgage'],
    description: 'Calculate potential mortgage payments for pre-approval meetings'
  },
  {
    stepId: 'compare-lenders',
    calculators: ['mortgage'],
    description: 'Compare mortgage scenarios from different lenders'
  },
  {
    stepId: 'make-offer',
    calculators: ['mortgage', 'closing-costs'],
    description: 'Calculate total costs including closing expenses before making an offer'
  },
  {
    stepId: 'final-walkthrough',
    calculators: ['closing-costs'],
    description: 'Finalize closing costs calculations before completion'
  },
  {
    stepId: 'closing-day',
    calculators: ['closing-costs'],
    description: 'Review all financial calculations before signing'
  }
];

export class CalculatorIntegrationService {
  private static readonly STORAGE_KEY = 'buyright_calculator_results';

  // Get calculator results from storage
  static getResults(): CalculatorResults | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const results = JSON.parse(saved);
        
        // Convert date strings back to Date objects
        if (results.lastUpdated) {
          results.lastUpdated = new Date(results.lastUpdated);
        }
        
        if (results.affordability?.calculatedAt) {
          results.affordability.calculatedAt = new Date(results.affordability.calculatedAt);
        }
        
        if (results.mortgage) {
          results.mortgage = results.mortgage.map((calc: any) => ({
            ...calc,
            calculatedAt: new Date(calc.calculatedAt)
          }));
        }
        
        if (results.closingCosts?.calculatedAt) {
          results.closingCosts.calculatedAt = new Date(results.closingCosts.calculatedAt);
        }
        
        return results;
      }
    } catch (error) {
      console.error('Failed to load calculator results:', error);
    }
    return null;
  }

  // Save calculator results
  static saveResults(results: CalculatorResults): void {
    try {
      const toSave = {
        ...results,
        lastUpdated: new Date()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save calculator results:', error);
    }
  }

  // Save affordability calculation result
  static saveAffordabilityResult(result: Omit<AffordabilityResult, 'calculatedAt'>): void {
    const current = this.getResults() || {
      mortgage: [],
      lastUpdated: new Date()
    };
    
    current.affordability = {
      ...result,
      calculatedAt: new Date()
    };
    
    this.saveResults(current);
  }

  // Save mortgage calculation result
  static saveMortgageResult(
    result: Omit<MortgageCalculation, 'calculatedAt'>, 
    scenario?: string
  ): void {
    const current = this.getResults() || {
      mortgage: [],
      lastUpdated: new Date()
    };
    
    const mortgageResult: MortgageCalculation = {
      ...result,
      scenario,
      calculatedAt: new Date()
    };
    
    // If it's a named scenario, replace existing scenario with same name
    if (scenario) {
      const existingIndex = current.mortgage.findIndex(calc => calc.scenario === scenario);
      if (existingIndex >= 0) {
        current.mortgage[existingIndex] = mortgageResult;
      } else {
        current.mortgage.push(mortgageResult);
      }
    } else {
      // Replace the most recent unnamed calculation or add new one
      const unnamedIndex = current.mortgage.findIndex(calc => !calc.scenario);
      if (unnamedIndex >= 0) {
        current.mortgage[unnamedIndex] = mortgageResult;
      } else {
        current.mortgage.push(mortgageResult);
      }
    }
    
    // Keep only the 5 most recent calculations
    current.mortgage = current.mortgage
      .sort((a, b) => b.calculatedAt.getTime() - a.calculatedAt.getTime())
      .slice(0, 5);
    
    this.saveResults(current);
  }

  // Save closing costs calculation result
  static saveClosingCostsResult(result: Omit<ClosingCostsResult, 'calculatedAt'>): void {
    const current = this.getResults() || {
      mortgage: [],
      lastUpdated: new Date()
    };
    
    current.closingCosts = {
      ...result,
      calculatedAt: new Date()
    };
    
    this.saveResults(current);
  }

  // Check if affordability calculator has been completed
  static hasCompletedAffordability(): boolean {
    const results = this.getResults();
    return !!(results?.affordability);
  }

  // Check if mortgage calculator has been completed
  static hasCompletedMortgage(): boolean {
    const results = this.getResults();
    return !!(results?.mortgage && results.mortgage.length > 0);
  }

  // Check if closing costs calculator has been completed
  static hasCompletedClosingCosts(): boolean {
    const results = this.getResults();
    return !!(results?.closingCosts);
  }

  // Get calculators needed for a specific step
  static getCalculatorsForStep(stepId: string): StepCalculatorMapping | null {
    return STEP_CALCULATOR_MAPPINGS.find(mapping => mapping.stepId === stepId) || null;
  }

  // Check if step has required calculators completed
  static isStepCalculationComplete(stepId: string): boolean {
    const mapping = this.getCalculatorsForStep(stepId);
    if (!mapping) return true; // No calculators required
    
    const results = this.getResults();
    if (!results) return false;
    
    return mapping.calculators.every(calcType => {
      switch (calcType) {
        case 'affordability':
          return !!results.affordability;
        case 'mortgage':
          return results.mortgage.length > 0;
        case 'closing-costs':
          return !!results.closingCosts;
        default:
          return false;
      }
    });
  }

  // Get step completion percentage based on calculations
  static getStepCalculationProgress(stepId: string): number {
    const mapping = this.getCalculatorsForStep(stepId);
    if (!mapping) return 100; // No calculators required
    
    const results = this.getResults();
    if (!results) return 0;
    
    let completed = 0;
    const total = mapping.calculators.length;
    
    mapping.calculators.forEach(calcType => {
      switch (calcType) {
        case 'affordability':
          if (results.affordability) completed++;
          break;
        case 'mortgage':
          if (results.mortgage.length > 0) completed++;
          break;
        case 'closing-costs':
          if (results.closingCosts) completed++;
          break;
      }
    });
    
    return (completed / total) * 100;
  }

  // Get dashboard insights from calculator results
  static getDashboardInsights(): {
    maxBudget?: number;
    monthlyPayment?: number;
    totalClosingCosts?: number;
    totalCashRequired?: number;
    readyToBuy: boolean;
    recommendations: string[];
  } {
    const results = this.getResults();
    const insights = {
      readyToBuy: false,
      recommendations: [] as string[]
    };
    
    if (!results) {
      insights.recommendations.push('Start with the affordability calculator to set your budget');
      return insights;
    }
    
    if (results.affordability) {
      insights.maxBudget = results.affordability.maxHomePrice;
      insights.totalCashRequired = results.affordability.totalCashRequired;
      insights.recommendations.push(...results.affordability.recommendations);
    }
    
    if (results.mortgage.length > 0) {
      // Get the most recent mortgage calculation
      const latestMortgage = results.mortgage
        .sort((a, b) => b.calculatedAt.getTime() - a.calculatedAt.getTime())[0];
      insights.monthlyPayment = latestMortgage.monthlyPayment;
    }
    
    if (results.closingCosts) {
      insights.totalClosingCosts = results.closingCosts.totalClosingCosts;
    }
    
    // Determine if ready to buy
    insights.readyToBuy = !!(
      results.affordability && 
      results.mortgage.length > 0 && 
      results.affordability.debtToIncomeRatio <= 36
    );
    
    if (!insights.readyToBuy && results.affordability) {
      if (results.affordability.debtToIncomeRatio > 36) {
        insights.recommendations.unshift('Consider reducing debt before buying');
      }
    }
    
    return insights;
  }

  // Clear all calculator results
  static clearResults(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear calculator results:', error);
    }
  }

  // Export results for sharing/backup
  static exportResults(): string {
    const results = this.getResults();
    return JSON.stringify(results, null, 2);
  }

  // Import results from backup
  static importResults(data: string): boolean {
    try {
      const results = JSON.parse(data);
      this.saveResults(results);
      return true;
    } catch (error) {
      console.error('Failed to import calculator results:', error);
      return false;
    }
  }
}