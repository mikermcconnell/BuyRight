'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';
import { CalculatorIntegrationService } from '@/lib/calculatorIntegration';
import {
  validateIncome,
  validateDebtAmount,
  validateInterestRate,
  validateHomePrice,
  ValidationError
} from '@/lib/validation';
import {
  ChartBarIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ScaleIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import BuyRightLogo from '@/components/ui/BuyRightLogo';

interface ClosingCost {
  id: string;
  category: 'tax' | 'legal' | 'inspection' | 'insurance' | 'financing' | 'other';
  name: string;
  amount: number;
  required: boolean;
  description?: string;
}

interface AffordabilityResult {
  maxHomePrice: number;
  maxMonthlyPayment: number;
  maxLoanAmount: number;
  downPaymentNeeded: number;
  totalHousingBudget: number;
  debtToIncomeRatio: number;
  recommendations: string[];
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  // Closing cost fields
  totalClosingCosts: number;
  cashNeeded: number;
  emergencyFund: number;
  totalCashRequired: number;
  closingCostsByCategory: { [category: string]: ClosingCost[] };
  closingCostBreakdown: ClosingCost[];
}

interface AffordabilityCalculatorProps {
  onResultChange?: (result: AffordabilityResult | null) => void;
  showSaveOption?: boolean;
}

const AffordabilityCalculator = React.memo(function AffordabilityCalculator({
  onResultChange,
  showSaveOption = false,
}: AffordabilityCalculatorProps) {
  const [annualIncome, setAnnualIncome] = useState(75000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number | "">(60000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(25);
  // Property costs are always included
  const includeProperty = true;
  // Closing cost options
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  const [includeEmergencyFund, setIncludeEmergencyFund] = useState(true);
  const [optionalClosingCosts, setOptionalClosingCosts] = useState({
    homeInspection: true,
    titleInsurance: true,
    movingExpenses: true,
    immediateRepairs: false,
    utilityConnections: false,
  });
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const { formatCurrency, getTaxRate, currentRegion } = useRegional();
  const router = useRouter();

  useEffect(() => {
    calculateAffordability();
  }, [annualIncome, monthlyDebts, downPaymentAmount, interestRate, loanTerm, isFirstTimeBuyer, includeEmergencyFund, optionalClosingCosts, currentRegion]);

  const calculateAffordability = () => {
    setIsValidating(true);
    const newErrors: Record<string, string> = {};

    try {
      // Validate all inputs
      const incomeValidation = validateIncome(annualIncome);
      if (!incomeValidation.valid) {
        newErrors.annualIncome = incomeValidation.error!;
      }

      const debtValidation = validateDebtAmount(monthlyDebts);
      if (!debtValidation.valid) {
        newErrors.monthlyDebts = debtValidation.error!;
      }

      const interestRateValidation = validateInterestRate(interestRate);
      if (!interestRateValidation.valid) {
        newErrors.interestRate = interestRateValidation.error!;
      }

      // Validate down payment amount
      if (downPaymentAmount === "" || downPaymentAmount < 1000 || downPaymentAmount > 500000) {
        newErrors.downPaymentAmount = downPaymentAmount === "" ? 'Down payment amount is required' : 'Down payment must be between $1,000 and $500,000';
      }

      // Set errors and return early if validation failed
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setResult(null);
        onResultChange?.(null);
        setIsValidating(false);
        return;
      }

      // Use sanitized values for calculation
      const sanitizedIncome = incomeValidation.sanitizedValue!;
      const sanitizedDebts = debtValidation.sanitizedValue!;
      const sanitizedInterestRate = interestRateValidation.sanitizedValue!;
      const numericDownPayment = downPaymentAmount === "" ? 0 : downPaymentAmount;

      const monthlyIncome = sanitizedIncome / 12;
      
      // Housing affordability rules (simplified)
      // Generally 28% of gross income for housing, 36% for total debt
      const maxHousingPayment = monthlyIncome * 0.28;
      const maxTotalDebt = monthlyIncome * 0.36;
      const availableForHousing = maxTotalDebt - sanitizedDebts;
      
      // Use the lower of the two limits
      const maxMonthlyPayment = Math.min(maxHousingPayment, availableForHousing);
      
      if (maxMonthlyPayment <= 0) {
        setResult(null);
        onResultChange?.(null);
        return;
      }

      // Calculate how much can be borrowed with the given down payment
      const monthlyInterestRate = sanitizedInterestRate / 100 / 12;
      const totalPayments = loanTerm * 12;
      
      let maxLoanAmount = 0;
      if (monthlyInterestRate > 0) {
        // Reserve some payment for property taxes and insurance if included
        let availableForPI = maxMonthlyPayment;
        
        // Always include property tax + insurance = 1.5% annually
        const propertyAndInsuranceRate = 0.015 / 12;
        // This is a bit circular, but we'll estimate based on median home price
        const estimatedPropertyCosts = 400000 * propertyAndInsuranceRate; // Use rough estimate
        availableForPI = Math.max(maxMonthlyPayment - estimatedPropertyCosts, maxMonthlyPayment * 0.8);
        
        maxLoanAmount = availableForPI * 
          (Math.pow(1 + monthlyInterestRate, totalPayments) - 1) / 
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments));
      }

      // Calculate max home price with fixed down payment amount
      let maxHomePrice = maxLoanAmount + numericDownPayment;
      
      // Calculate the effective down payment percentage for display
      const effectiveDownPaymentPercent = (numericDownPayment / maxHomePrice) * 100;
      
      // Always adjust for property costs
      if (currentRegion) {
        // Iterative approach to find true max price accounting for taxes
        let adjustedMaxPrice = maxHomePrice;
        for (let i = 0; i < 5; i++) {
          const propertyTaxRate = getTaxRate('propertyTax') || 1;
          const monthlyPropertyTax = (adjustedMaxPrice * (propertyTaxRate / 100)) / 12;
          const monthlyInsurance = adjustedMaxPrice * 0.003 / 12;
          const availableForPI = maxMonthlyPayment - monthlyPropertyTax - monthlyInsurance;
          
          if (availableForPI <= 0) break;
          
          const adjustedLoanAmount = availableForPI * 
            (Math.pow(1 + monthlyInterestRate, totalPayments) - 1) / 
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments));
          
          adjustedMaxPrice = adjustedLoanAmount + numericDownPayment;
        }
        maxHomePrice = adjustedMaxPrice;
        maxLoanAmount = maxHomePrice - numericDownPayment;
      }

      const debtToIncomeRatio = ((sanitizedDebts + maxMonthlyPayment) / monthlyIncome) * 100;
      
      // Generate recommendations
      const recommendations: string[] = [];
      
      if (debtToIncomeRatio > 36) {
        recommendations.push('Consider reducing existing debts to improve affordability');
      }
      
      if (effectiveDownPaymentPercent < 20) {
        recommendations.push('A larger down payment will reduce monthly costs and may eliminate PMI');
      }
      
      if (maxMonthlyPayment < monthlyIncome * 0.25) {
        recommendations.push('You may be able to afford more than the conservative estimate shown');
      }
      
      if (monthlyDebts > monthlyIncome * 0.1) {
        recommendations.push('Focus on debt reduction to increase buying power');
      }

      // Regional recommendations
      if (currentRegion === 'ON' || currentRegion === 'BC') {
        if (maxHomePrice < 500000) {
          recommendations.push('You may qualify for first-time home buyer programs in Canada');
        }
      }

      // Calculate final property costs for display
      const finalPropertyTaxRate = getTaxRate('propertyTax') || 1;
      const monthlyPropertyTax = (maxHomePrice * (finalPropertyTaxRate / 100)) / 12;
      const monthlyInsurance = maxHomePrice * 0.003 / 12;

      // Calculate closing costs
      const closingCosts = calculateClosingCosts(maxHomePrice, maxLoanAmount, isFirstTimeBuyer, optionalClosingCosts, currentRegion);
      const totalClosingCosts = closingCosts.reduce((sum, cost) => sum + cost.amount, 0);
      
      // Calculate 6-month emergency fund (6x monthly income) if enabled
      const emergencyFund = includeEmergencyFund ? monthlyIncome * 6 : 0;
      
      // Total cash required = down payment + closing costs + emergency fund (if enabled)
      const cashNeeded = numericDownPayment + totalClosingCosts;
      const totalCashRequired = cashNeeded + emergencyFund;

      // Group closing costs by category
      const closingCostsByCategory: { [category: string]: ClosingCost[] } = {};
      closingCosts.forEach(cost => {
        if (!closingCostsByCategory[cost.category]) {
          closingCostsByCategory[cost.category] = [];
        }
        closingCostsByCategory[cost.category].push(cost);
      });

      const affordabilityResult: AffordabilityResult = {
        maxHomePrice: Math.max(0, maxHomePrice),
        maxMonthlyPayment,
        maxLoanAmount: Math.max(0, maxLoanAmount),
        downPaymentNeeded: Math.max(0, numericDownPayment),
        totalHousingBudget: maxMonthlyPayment,
        debtToIncomeRatio,
        recommendations,
        monthlyPropertyTax,
        monthlyInsurance,
        // Closing cost fields
        totalClosingCosts,
        cashNeeded,
        emergencyFund,
        totalCashRequired,
        closingCostsByCategory,
        closingCostBreakdown: closingCosts,
      };

      setResult(affordabilityResult);
      onResultChange?.(affordabilityResult);
      
      // Save to integration service for journey tracking
      CalculatorIntegrationService.saveAffordabilityResult({
        maxHomePrice: affordabilityResult.maxHomePrice,
        maxMonthlyPayment: affordabilityResult.maxMonthlyPayment,
        maxLoanAmount: affordabilityResult.maxLoanAmount,
        downPaymentNeeded: affordabilityResult.downPaymentNeeded,
        totalHousingBudget: affordabilityResult.totalHousingBudget,
        debtToIncomeRatio: affordabilityResult.debtToIncomeRatio,
        recommendations: affordabilityResult.recommendations,
        totalCashRequired: affordabilityResult.totalCashRequired
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Affordability calculation error:', error);
      }
      
      // Set generic error for user
      setErrors({ general: 'An error occurred during calculation. Please check your inputs and try again.' });
      setResult(null);
      onResultChange?.(null);
    } finally {
      setIsValidating(false);
    }
  };

  const calculateClosingCosts = (homePrice: number, loanAmount: number, firstTimeBuyer: boolean, optionalCosts: any, region: string | null): ClosingCost[] => {
    if (!region) return [];
    
    const costs: ClosingCost[] = [];

    // Regional-specific required costs
    if (region === 'ON') {
      // Ontario-specific costs
      costs.push({
        id: 'ltt-provincial',
        category: 'tax',
        name: 'Provincial Land Transfer Tax',
        amount: calculateOntarioLTT(homePrice),
        required: true,
        description: 'Tax paid to Ontario government'
      });

      // Toronto municipal land transfer tax (simplified check)
      if (homePrice > 400000) {
        costs.push({
          id: 'ltt-municipal',
          category: 'tax',
          name: 'Municipal Land Transfer Tax',
          amount: calculateOntarioLTT(homePrice),
          required: true,
          description: 'Additional tax for Toronto/GTA properties'
        });
      }

      // Legal fees
      costs.push({
        id: 'legal-fees',
        category: 'legal',
        name: 'Legal Fees',
        amount: homePrice > 800000 ? 2500 : homePrice > 500000 ? 2000 : 1500,
        required: true,
        description: 'Lawyer fees for transaction handling'
      });

      // Property tax adjustment
      costs.push({
        id: 'property-tax-adj',
        category: 'other',
        name: 'Property Tax Adjustment',
        amount: homePrice * 0.01 / 12 * 6, // 6 months average
        required: true,
        description: 'Prepaid property taxes'
      });

    } else if (region === 'BC') {
      // BC-specific costs
      costs.push({
        id: 'property-transfer-tax',
        category: 'tax',
        name: 'Property Transfer Tax',
        amount: calculateBCPTT(homePrice, firstTimeBuyer),
        required: true,
        description: 'BC Property Transfer Tax'
      });

      // Legal fees
      costs.push({
        id: 'legal-fees',
        category: 'legal',
        name: 'Legal Fees',
        amount: homePrice > 1000000 ? 3000 : homePrice > 600000 ? 2200 : 1800,
        required: true,
        description: 'Lawyer fees for transaction handling'
      });

      // Property tax adjustment
      costs.push({
        id: 'property-tax-adj',
        category: 'other',
        name: 'Property Tax Adjustment',
        amount: homePrice * 0.006 / 12 * 6, // BC has lower property tax rates
        required: true,
        description: 'Prepaid property taxes'
      });

    } else if (region?.startsWith('US_')) {
      // US-specific costs
      costs.push({
        id: 'closing-costs',
        category: 'financing',
        name: 'Lender Closing Costs',
        amount: loanAmount * 0.02,
        required: true,
        description: 'Lender fees and closing costs'
      });

      costs.push({
        id: 'recording-fees',
        category: 'other',
        name: 'Recording Fees',
        amount: 200,
        required: true,
        description: 'Government recording fees'
      });

      costs.push({
        id: 'appraisal',
        category: 'financing',
        name: 'Home Appraisal',
        amount: 400,
        required: true,
        description: 'Lender-required property appraisal'
      });
    }

    // Common required costs for all regions
    if (loanAmount > 0) {
      // Mortgage default insurance (if applicable)
      const downPaymentPercent = ((homePrice - loanAmount) / homePrice) * 100;
      if (downPaymentPercent < 20 && (region === 'ON' || region === 'BC')) {
        const cmhcRate = downPaymentPercent < 10 ? 0.04 : 
                        downPaymentPercent < 15 ? 0.031 : 0.028;
        costs.push({
          id: 'mortgage-insurance',
          category: 'financing',
          name: 'Mortgage Default Insurance (CMHC)',
          amount: loanAmount * cmhcRate,
          required: true,
          description: 'Required for down payments under 20%'
        });
      }

      // Home insurance (annual premium)
      costs.push({
        id: 'home-insurance',
        category: 'insurance',
        name: 'Home Insurance (1 year)',
        amount: homePrice * 0.003,
        required: true,
        description: 'Annual home insurance premium'
      });
    }

    // Optional costs based on checkboxes
    if (optionalCosts.homeInspection) {
      costs.push({
        id: 'home-inspection',
        category: 'inspection',
        name: 'Home Inspection',
        amount: region === 'BC' && homePrice > 1000000 ? 800 : 
                region === 'ON' && homePrice > 800000 ? 750 : 
                region?.startsWith('US_') ? 500 : 650,
        required: false,
        description: 'Professional property inspection'
      });
    }

    if (optionalCosts.titleInsurance) {
      const titleInsuranceAmount = region?.startsWith('US_') ? 
        homePrice * 0.005 : 
        Math.min(Math.max(homePrice * 0.0005, 300), 600);
      
      costs.push({
        id: 'title-insurance',
        category: 'insurance',
        name: 'Title Insurance',
        amount: titleInsuranceAmount,
        required: false,
        description: 'Protection against title defects'
      });
    }

    if (optionalCosts.movingExpenses) {
      costs.push({
        id: 'moving',
        category: 'other',
        name: 'Moving Expenses',
        amount: 1500,
        required: false,
        description: 'Professional movers or truck rental'
      });
    }

    if (optionalCosts.immediateRepairs) {
      costs.push({
        id: 'immediate-repairs',
        category: 'other',
        name: 'Immediate Repairs/Updates',
        amount: homePrice * 0.01,
        required: false,
        description: 'Minor repairs and updates needed right away'
      });
    }

    if (optionalCosts.utilityConnections) {
      costs.push({
        id: 'utilities',
        category: 'other',
        name: 'Utility Connections',
        amount: 500,
        required: false,
        description: 'Setting up utilities and services'
      });
    }

    return costs;
  };

  const calculateOntarioLTT = (price: number): number => {
    let tax = 0;
    if (price <= 55000) {
      tax = price * 0.005;
    } else if (price <= 250000) {
      tax = 275 + (price - 55000) * 0.01;
    } else if (price <= 400000) {
      tax = 2225 + (price - 250000) * 0.015;
    } else {
      tax = 4475 + (price - 400000) * 0.02;
    }
    return Math.max(tax, 0);
  };

  const calculateBCPTT = (price: number, firstTimeBuyer: boolean): number => {
    let tax = 0;
    if (price <= 200000) {
      tax = price * 0.01;
    } else if (price <= 2000000) {
      tax = 2000 + (price - 200000) * 0.02;
    } else {
      tax = 38000 + (price - 2000000) * 0.03;
    }

    // First-time buyer exemption (simplified)
    if (firstTimeBuyer && price <= 500000) {
      tax = Math.max(0, tax - Math.min(8000, tax));
    }

    return Math.max(tax, 0);
  };

  const getCategoryName = (category: string): string => {
    const categoryNames: { [key: string]: string } = {
      tax: 'Taxes',
      legal: 'Legal Fees',
      inspection: 'Inspections',
      insurance: 'Insurance',
      financing: 'Financing Costs',
      other: 'Other Costs',
    };
    return categoryNames[category] || category;
  };

  const getCategoryIcon = (category: string): JSX.Element => {
    const iconProps = { className: "w-5 h-5", style: { color: 'white' } };
    
    switch (category) {
      case 'tax':
        return <ScaleIcon {...iconProps} />;
      case 'legal':
        return <BuildingOfficeIcon {...iconProps} />;
      case 'inspection':
        return <MagnifyingGlassIcon {...iconProps} />;
      case 'insurance':
        return <ShieldCheckIcon {...iconProps} />;
      case 'financing':
        return <BanknotesIcon {...iconProps} />;
      case 'other':
        return <WrenchScrewdriverIcon {...iconProps} />;
      default:
        return <CurrencyDollarIcon {...iconProps} />;
    }
  };

  const handleSaveCalculation = async () => {
    if (!result) return;

    try {
      const response = await fetch('/api/calculators/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calculatorType: 'affordability',
          inputData: {
            annualIncome,
            monthlyDebts,
            downPaymentAmount: downPaymentAmount === "" ? 0 : downPaymentAmount,
            interestRate,
            loanTerm,
            includeProperty: true,
          },
          results: result,
        }),
      });

      // Navigate to dashboard after saving
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving calculation:', error);
      // Navigate to dashboard even if save fails
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Calculator Header */}
      <div className="text-center mb-8">
        {/* BuyRight Branding */}
        <div className="mb-6">
          <BuyRightLogo size="lg" className="justify-center" />
        </div>
        
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--duolingo-green)' }}>
          <CurrencyDollarIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="duolingo-title mb-4">🏡 What Can You Afford?</h1>
        <p className="duolingo-subtitle">
          Let's figure out your perfect home budget together!
        </p>
      </div>

      {/* General Error Display */}
      {errors.general && (
        <div className="result-card-info red">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
            </div>
            <div>
              <p className="font-medium text-red-900 mb-1">Calculation Error</p>
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="mobile-card">
        <h3 className="mobile-subtitle mb-6">Your Financial Information</h3>
        
        <div className="space-y-6">
          {/* Annual Income */}
          <div className="duolingo-form-group">
            <label htmlFor="annualIncome" className="duolingo-label">
              💰 What do you make per year? (before taxes)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="annualIncome"
                className={`form-input pl-8 ${errors.annualIncome ? 'error' : ''}`}
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                min="20000"
                step="1000"
              />
            </div>
            {errors.annualIncome && (
              <p className="duolingo-error">{errors.annualIncome}</p>
            )}
            {!errors.annualIncome && (
              <p className="text-xs text-gray-500 mt-1">
                Include all income sources before taxes
              </p>
            )}
          </div>

          {/* Monthly Debts */}
          <div className="duolingo-form-group">
            <label htmlFor="monthlyDebts" className="duolingo-label">
              💳 Monthly debt payments (credit cards, loans, etc.)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="monthlyDebts"
                className="form-input pl-8"
                value={monthlyDebts}
                onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                min="0"
                step="50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Credit cards, car loans, student loans, etc.
            </p>
          </div>

          {/* Down Payment */}
          <div className="duolingo-form-group">
            <label htmlFor="downPaymentAmount" className="duolingo-label">
              Down Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="downPaymentAmount"
                className={`form-input pl-8 ${errors.downPaymentAmount ? 'error' : ''}`}
                value={downPaymentAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  setDownPaymentAmount(value === "" ? "" : Number(value));
                }}
                min="1000"
                max="500000"
                step="1000"
                placeholder=""
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              How much cash you plan to put down
            </p>
            {errors.downPaymentAmount && (
              <p className="duolingo-error">{errors.downPaymentAmount}</p>
            )}
          </div>

          {/* Interest Rate */}
          <div className="duolingo-form-group">
            <label htmlFor="interestRate" className="duolingo-label">
              📈 Interest rate you expect to get (ask your bank!)
            </label>
            <div className="relative">
              <input
                type="number"
                id="interestRate"
                className={`form-input pr-8 ${errors.interestRate ? 'error' : ''}`}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min="2"
                max="15"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
            </div>
            {errors.interestRate && (
              <p className="duolingo-error">{errors.interestRate}</p>
            )}
            
            {/* Mortgage Rate Finder (Canada Only) */}
            {(currentRegion === 'ON' || currentRegion === 'BC') && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  💡 Need current mortgage rates?
                </p>
                <p className="text-sm text-blue-700">
                  Check out{' '}
                  <a 
                    href="https://wowa.ca/mortgage-rates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="duolingo-link hover:underline"
                  >
                    WOWA's rate finder
                  </a>
                  {' '}for up-to-date Canadian mortgage rates. This is a rate comparison tool we recommend (not a sponsorship).
                </p>
              </div>
            )}
          </div>

          {/* Loan Term */}
          <div className="duolingo-form-group">
            <label htmlFor="loanTerm" className="duolingo-label">
              Amortization Period
            </label>
            <select
              id="loanTerm"
              className="form-select"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
            >
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={25}>25 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>

          {/* Property Costs Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Property taxes and insurance included
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Estimated at {currentRegion ? `${getTaxRate('propertyTax') || 1}%` : '1%'} property tax + 0.3% insurance annually
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Cost Options */}
      <div className="mobile-card">
        <h3 className="mobile-subtitle mb-6 flex items-center">
          <DocumentTextIcon className="w-6 h-6 mr-3" style={{ color: 'var(--duolingo-green-dark)' }} />
          Closing Cost Options
        </h3>
        
        <div className="space-y-6">
          {/* First Time Buyer Option (BC only) */}
          {currentRegion === 'BC' && (
            <div>
              <h4 className="duolingo-label mb-4">Buyer Status</h4>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={isFirstTimeBuyer}
                  onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">First-time home buyer</span>
                  <p className="text-xs text-gray-500 mt-1">May qualify for BC tax exemptions</p>
                </div>
              </label>
            </div>
          )}

          {/* Optional Closing Costs */}
          <div>
            <h4 className="duolingo-label mb-4">Optional Closing Costs</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={optionalClosingCosts.homeInspection}
                  onChange={(e) => setOptionalClosingCosts(prev => ({ ...prev, homeInspection: e.target.checked }))}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Home Inspection</span>
                  <p className="text-xs text-gray-500 mt-1">Professional property inspection (recommended)</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={optionalClosingCosts.titleInsurance}
                  onChange={(e) => setOptionalClosingCosts(prev => ({ ...prev, titleInsurance: e.target.checked }))}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Title Insurance</span>
                  <p className="text-xs text-gray-500 mt-1">Protection against title defects</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={optionalClosingCosts.movingExpenses}
                  onChange={(e) => setOptionalClosingCosts(prev => ({ ...prev, movingExpenses: e.target.checked }))}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Moving Expenses</span>
                  <p className="text-xs text-gray-500 mt-1">Professional movers or truck rental</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={optionalClosingCosts.immediateRepairs}
                  onChange={(e) => setOptionalClosingCosts(prev => ({ ...prev, immediateRepairs: e.target.checked }))}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Immediate Repairs/Updates</span>
                  <p className="text-xs text-gray-500 mt-1">Minor repairs and updates needed right away</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={optionalClosingCosts.utilityConnections}
                  onChange={(e) => setOptionalClosingCosts(prev => ({ ...prev, utilityConnections: e.target.checked }))}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Utility Connections</span>
                  <p className="text-xs text-gray-500 mt-1">Setting up utilities and services</p>
                </div>
              </label>
            </div>
          </div>

          {/* Emergency Fund Option */}
          <div>
            <h4 className="duolingo-label mb-4">Emergency Fund</h4>
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={includeEmergencyFund}
                onChange={(e) => setIncludeEmergencyFund(e.target.checked)}
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">Include 6-month emergency fund</span>
                <p className="text-xs text-gray-500 mt-1">Recommended safety net (6x monthly income: {formatCurrency(annualIncome / 12 * 6)})</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && result.maxHomePrice > 0 && (
        <div className="mobile-card">
          <h3 className="mobile-subtitle mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-3" style={{ color: 'var(--duolingo-green)' }} />
            What You Can Afford
          </h3>
          
          <div className="space-y-6">
            {/* Max Home Price */}
            <div className="result-card-primary">
              <div className="text-4xl font-bold text-white mb-2 whitespace-nowrap">
                {formatCurrency(result.maxHomePrice)}
              </div>
              <div className="text-lg text-white/90">Maximum Home Price</div>
            </div>

            {/* Key Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="result-card-secondary">
                <div className="text-xl font-bold" style={{ color: 'var(--duolingo-green)' }}>
                  {formatCurrency(result.maxMonthlyPayment)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Max Monthly Payment</div>
              </div>
              
              <div className="result-card-secondary">
                <div className="text-xl font-bold" style={{ color: 'var(--duolingo-green)' }}>
                  {formatCurrency(result.downPaymentNeeded)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Down Payment
                </div>
              </div>
              
              <div className="result-card-secondary">
                <div className="text-xl font-bold" style={{ color: 'var(--duolingo-green)' }}>
                  {formatCurrency(result.maxLoanAmount)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Max Loan Amount</div>
              </div>
              
              <div className="result-card-secondary">
                <div className="text-xl font-bold" style={{ color: 'var(--duolingo-green)' }}>
                  {result.debtToIncomeRatio.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Debt-to-Income Ratio</div>
              </div>
            </div>

            {/* Income Breakdown */}
            <div className="result-card-info blue">
              <h4 className="font-semibold text-blue-900 mb-4">💡 Monthly Budget Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Gross Monthly Income:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(annualIncome / 12)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Current Debts:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(monthlyDebts)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-blue-200 pt-3">
                  <span className="text-blue-800 font-medium">Total Housing Payment:</span>
                  <span className="font-semibold" style={{ color: 'var(--duolingo-green)' }}>{formatCurrency(result.maxMonthlyPayment)}</span>
                </div>
                <div className="pl-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">• Mortgage Payment:</span>
                    <span className="font-medium text-blue-800">{formatCurrency(result.maxMonthlyPayment - result.monthlyPropertyTax - result.monthlyInsurance)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">• Property Tax:</span>
                    <span className="font-medium text-blue-800">{formatCurrency(result.monthlyPropertyTax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">• Home Insurance:</span>
                    <span className="font-medium text-blue-800">{formatCurrency(result.monthlyInsurance)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-blue-200 pt-3">
                  <span className="text-blue-800 font-medium">Remaining Income:</span>
                  <span className="font-semibold text-blue-900">
                    {formatCurrency(annualIncome / 12 - monthlyDebts - result.maxMonthlyPayment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="result-card-info yellow">
                <h4 className="font-semibold text-yellow-900 mb-4">💡 Recommendations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-yellow-800 flex items-start">
                      <span className="font-bold mr-3 flex-shrink-0" style={{ color: 'var(--duolingo-green)' }}>→</span>
                      <span className="break-words leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Closing Cost Results */}
      {result && result.maxHomePrice > 0 && (
        <div className="mobile-card">
          <h3 className="mobile-subtitle mb-6 flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-3" style={{ color: 'var(--duolingo-green-dark)' }} />
            Closing Costs & Cash Required
          </h3>
          
          <div className="space-y-6">
            {/* Key Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="result-card-green">
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(result.totalClosingCosts)}
                </div>
                <div className="text-sm text-gray-800 mt-1">Total Closing Costs</div>
              </div>
              
              <div className="result-card-green">
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(result.totalCashRequired)}
                </div>
                <div className="text-sm text-gray-800 mt-1">Total Cash Required</div>
              </div>
            </div>

            {/* Cash Breakdown */}
            <div className="result-card-info blue">
              <h4 className="font-semibold text-blue-900 mb-4">💰 Cash Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Down Payment:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(result.downPaymentNeeded)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Closing Costs:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(result.totalClosingCosts)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-blue-200 pt-3">
                  <span className="text-blue-800 font-medium">Cash at Closing:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(result.cashNeeded)}</span>
                </div>
                {includeEmergencyFund && (
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">6-Month Emergency Fund:</span>
                    <span className="font-semibold text-blue-900">{formatCurrency(result.emergencyFund)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Fund Info */}
            {includeEmergencyFund && (
              <div className="result-card-info yellow">
                <h4 className="font-semibold text-yellow-900 mb-3">💡 About the Emergency Fund</h4>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  A 6-month emergency fund ({formatCurrency(result.emergencyFund)}) is recommended to cover 
                  unexpected expenses after purchasing your home. This should be separate from your down payment 
                  and closing costs.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Closing Cost Breakdown */}
      {result && result.maxHomePrice > 0 && result.closingCostBreakdown.length > 0 && (
        <div className="mobile-card">
          <h3 className="mobile-subtitle mb-6 flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-3" style={{ color: 'var(--duolingo-green-dark)' }} />
            Detailed Closing Cost Breakdown
          </h3>
          
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-200">
              {result.closingCostBreakdown.map((cost) => (
                <div key={cost.id} className="px-4 py-4 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{cost.name}</span>
                        {!cost.required && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                            Optional
                          </span>
                        )}
                      </div>
                      {cost.description && (
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{cost.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <span className="font-bold text-lg" style={{ color: 'var(--duolingo-green)' }}>
                        {formatCurrency(cost.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && result.maxHomePrice > 0 && (
        <div className="mobile-card">
          <div className="space-y-6">
            {/* Save Calculation */}
            {showSaveOption && (
              <button
                onClick={handleSaveCalculation}
                className="duolingo-button"
              >
                💾 Save This Calculation
              </button>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {result && result.maxHomePrice <= 0 && (
        <div className="mobile-card">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <InformationCircleIcon className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="mobile-title mb-4">
              Let's Work on This Together! 💪
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              No worries! We just need to adjust a few numbers. Try reducing monthly debts or increasing income to see your options.
            </p>
            <div className="result-card-info yellow text-left">
              <h4 className="font-semibold text-yellow-900 mb-4">💪 Suggestions to Improve:</h4>
              <ul className="space-y-2">
                <li className="text-sm text-yellow-800 flex items-start">
                  <span className="font-bold mr-3 flex-shrink-0" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  <span className="break-words leading-relaxed">Increase your income</span>
                </li>
                <li className="text-sm text-yellow-800 flex items-start">
                  <span className="font-bold mr-3 flex-shrink-0" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  <span className="break-words leading-relaxed">Pay down existing debts</span>
                </li>
                <li className="text-sm text-yellow-800 flex items-start">
                  <span className="font-bold mr-3 flex-shrink-0" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  <span className="break-words leading-relaxed">Consider a longer amortization period</span>
                </li>
                <li className="text-sm text-yellow-800 flex items-start">
                  <span className="font-bold mr-3 flex-shrink-0" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  <span className="break-words leading-relaxed">Save for a larger down payment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="result-card-info blue">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">ℹ️ How This Calculator Works</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-bold mr-3 flex-shrink-0" style={{ color: 'var(--duolingo-green)' }}>→</span>
                <span className="break-words leading-relaxed">Uses the 28/36 rule: 28% of income for housing, 36% for total debt</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3 flex-shrink-0" style={{ color: 'var(--duolingo-green)' }}>→</span>
                <span className="break-words leading-relaxed">Assumes property taxes and insurance are included if selected</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3 flex-shrink-0" style={{ color: 'var(--duolingo-green)' }}>→</span>
                <span className="break-words leading-relaxed">Conservative estimates - you may qualify for more</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3 flex-shrink-0" style={{ color: 'var(--duolingo-green)' }}>→</span>
                <span className="break-words leading-relaxed">Get pre-approved with a lender for accurate amounts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AffordabilityCalculator;