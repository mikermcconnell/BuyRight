'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';
import { CalculatorIntegrationService } from '@/lib/calculatorIntegration';
import { CalculatorService } from '@/lib/calculator-service';
import {
  validateHomePrice,
  validateDownPayment,
  ValidationError
} from '@/lib/validation';
import {
  DocumentTextIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

interface ClosingCost {
  id: string;
  category: 'tax' | 'legal' | 'inspection' | 'insurance' | 'financing' | 'other';
  name: string;
  amount: number;
  required: boolean;
  description?: string;
}

interface ClosingCostsResult {
  totalClosingCosts: number;
  costsByCategory: { [category: string]: ClosingCost[] };
  cashNeeded: number;
  percentOfHomePrice: number;
  breakdown: ClosingCost[];
}

interface ClosingCostsCalculatorProps {
  onResultChange?: (result: ClosingCostsResult | null) => void;
  showSaveOption?: boolean;
}

export default function ClosingCostsCalculator({
  onResultChange,
  showSaveOption = false,
}: ClosingCostsCalculatorProps) {
  const [homePrice, setHomePrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [loanAmount, setLoanAmount] = useState(400000);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  const [includeOptional, setIncludeOptional] = useState(true);
  const [result, setResult] = useState<ClosingCostsResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const { formatCurrency, currentRegion, regionalContent } = useRegional();
  const router = useRouter();

  // Update loan amount when home price or down payment changes
  useEffect(() => {
    setLoanAmount(homePrice - downPayment);
  }, [homePrice, downPayment]);

  useEffect(() => {
    calculateClosingCosts();
  }, [homePrice, downPayment, loanAmount, isFirstTimeBuyer, includeOptional, currentRegion]);

  const calculateClosingCosts = () => {
    setIsValidating(true);
    const newErrors: Record<string, string> = {};

    try {
      // Validate all inputs
      const homePriceValidation = validateHomePrice(homePrice);
      if (!homePriceValidation.valid) {
        newErrors.homePrice = homePriceValidation.error!;
      }

      const downPaymentValidation = validateDownPayment(downPayment, homePrice);
      if (!downPaymentValidation.valid) {
        newErrors.downPayment = downPaymentValidation.error!;
      }

      // Set errors and return early if validation failed
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setResult(null);
        onResultChange?.(null);
        setIsValidating(false);
        return;
      }

      if (!currentRegion) {
        newErrors.general = 'Region selection is required to calculate closing costs';
        setErrors(newErrors);
        setResult(null);
        onResultChange?.(null);
        setIsValidating(false);
        return;
      }

      // Use sanitized values for calculation
      const sanitizedHomePrice = homePriceValidation.sanitizedValue!;
      const sanitizedDownPayment = downPaymentValidation.sanitizedValue!;
      const sanitizedLoanAmount = sanitizedHomePrice - sanitizedDownPayment;
      const costs: ClosingCost[] = [];

      // Regional-specific costs based on current region
      if (currentRegion === 'ON') {
        // Ontario-specific costs
        costs.push({
          id: 'ltt-provincial',
          category: 'tax',
          name: 'Provincial Land Transfer Tax',
          amount: calculateOntarioLTT(sanitizedHomePrice),
          required: true,
          description: 'Tax paid to Ontario government'
        });

        // Toronto municipal land transfer tax (if applicable - simplified)
        if (sanitizedHomePrice > 400000) { // Rough approximation for GTA
          costs.push({
            id: 'ltt-municipal',
            category: 'tax',
            name: 'Municipal Land Transfer Tax',
            amount: calculateOntarioLTT(sanitizedHomePrice),
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

        // Home inspection
        costs.push({
          id: 'home-inspection',
          category: 'inspection',
          name: 'Home Inspection',
          amount: homePrice > 800000 ? 750 : 600,
          required: false,
          description: 'Professional property inspection'
        });

        // Title insurance
        costs.push({
          id: 'title-insurance',
          category: 'insurance',
          name: 'Title Insurance',
          amount: Math.min(Math.max(homePrice * 0.0005, 300), 600),
          required: false,
          description: 'Protection against title defects'
        });

        // Property tax adjustment
        costs.push({
          id: 'property-tax-adj',
          category: 'other',
          name: 'Property Tax Adjustment',
          amount: sanitizedHomePrice * 0.01 / 12 * 6, // 6 months average
          required: true,
          description: 'Prepaid property taxes'
        });

        // Utility connections
        costs.push({
          id: 'utilities',
          category: 'other',
          name: 'Utility Connections',
          amount: 500,
          required: false,
          description: 'Setting up utilities and services'
        });

      } else if (currentRegion === 'BC') {
        // BC-specific costs
        costs.push({
          id: 'property-transfer-tax',
          category: 'tax',
          name: 'Property Transfer Tax',
          amount: calculateBCPTT(homePrice, isFirstTimeBuyer),
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

        // Home inspection
        costs.push({
          id: 'home-inspection',
          category: 'inspection',
          name: 'Home Inspection',
          amount: homePrice > 1000000 ? 800 : 650,
          required: false,
          description: 'Professional property inspection'
        });

        // Property tax adjustment
        costs.push({
          id: 'property-tax-adj',
          category: 'other',
          name: 'Property Tax Adjustment',
          amount: sanitizedHomePrice * 0.006 / 12 * 6, // BC has lower property tax rates
          required: true,
          description: 'Prepaid property taxes'
        });

      } else if (currentRegion?.startsWith('US_')) {
        // US-specific costs (simplified)
        costs.push({
          id: 'closing-costs',
          category: 'financing',
          name: 'Lender Closing Costs',
          amount: sanitizedLoanAmount * 0.02,
          required: true,
          description: 'Lender fees and closing costs'
        });

        costs.push({
          id: 'title-insurance',
          category: 'insurance',
          name: 'Title Insurance',
          amount: sanitizedHomePrice * 0.005,
          required: true,
          description: 'Title insurance policy'
        });

        costs.push({
          id: 'home-inspection',
          category: 'inspection',
          name: 'Home Inspection',
          amount: 500,
          required: false,
          description: 'Professional home inspection'
        });

        costs.push({
          id: 'appraisal',
          category: 'financing',
          name: 'Home Appraisal',
          amount: 400,
          required: true,
          description: 'Lender-required property appraisal'
        });

        costs.push({
          id: 'recording-fees',
          category: 'other',
          name: 'Recording Fees',
          amount: 200,
          required: true,
          description: 'Government recording fees'
        });
      }

      // Common costs for all regions
      if (loanAmount > 0) {
        // Mortgage default insurance (if applicable)
        const downPaymentPercent = (downPayment / homePrice) * 100;
        if (downPaymentPercent < 20 && (currentRegion === 'ON' || currentRegion === 'BC')) {
          const cmhcRate = downPaymentPercent < 10 ? 0.04 : 
                          downPaymentPercent < 15 ? 0.031 : 0.028;
          costs.push({
            id: 'mortgage-insurance',
            category: 'financing',
            name: 'Mortgage Default Insurance (CMHC)',
            amount: sanitizedLoanAmount * cmhcRate,
            required: true,
            description: 'Required for down payments under 20%'
          });
        }

        // Home insurance (annual premium)
        costs.push({
          id: 'home-insurance',
          category: 'insurance',
          name: 'Home Insurance (1 year)',
          amount: sanitizedHomePrice * 0.003,
          required: true,
          description: 'Annual home insurance premium'
        });
      }

      // Moving costs
      if (includeOptional) {
        costs.push({
          id: 'moving',
          category: 'other',
          name: 'Moving Expenses',
          amount: 1500,
          required: false,
          description: 'Professional movers or truck rental'
        });

        costs.push({
          id: 'immediate-repairs',
          category: 'other',
          name: 'Immediate Repairs/Updates',
          amount: sanitizedHomePrice * 0.01,
          required: false,
          description: 'Minor repairs and updates needed right away'
        });
      }

      // Filter costs based on settings
      const filteredCosts = includeOptional ? costs : costs.filter(cost => cost.required);

      // Calculate totals
      const totalClosingCosts = filteredCosts.reduce((sum, cost) => sum + cost.amount, 0);
      const cashNeeded = totalClosingCosts + downPayment;
      const percentOfHomePrice = (totalClosingCosts / homePrice) * 100;

      // Group by category
      const costsByCategory: { [category: string]: ClosingCost[] } = {};
      filteredCosts.forEach(cost => {
        if (!costsByCategory[cost.category]) {
          costsByCategory[cost.category] = [];
        }
        costsByCategory[cost.category].push(cost);
      });

      const closingCostsResult: ClosingCostsResult = {
        totalClosingCosts,
        costsByCategory,
        cashNeeded,
        percentOfHomePrice,
        breakdown: filteredCosts,
      };

      setResult(closingCostsResult);
      onResultChange?.(closingCostsResult);
      
      // Save to integration service for journey tracking
      CalculatorIntegrationService.saveClosingCostsResult({
        totalClosingCosts: closingCostsResult.totalClosingCosts,
        costsByCategory: closingCostsResult.costsByCategory,
        cashNeeded: closingCostsResult.cashNeeded,
        percentOfHomePrice: closingCostsResult.percentOfHomePrice,
        breakdown: closingCostsResult.breakdown
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Closing costs calculation error:', error);
      }
      
      // Set generic error for user
      setErrors({ general: 'An error occurred during calculation. Please check your inputs and try again.' });
      setResult(null);
      onResultChange?.(null);
    } finally {
      setIsValidating(false);
    }
  };

  const calculateOntarioLTT = (price: number): number => {
    // Ontario Land Transfer Tax calculation
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
    // BC Property Transfer Tax calculation
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

  const getCategoryIcon = (category: string): React.ReactElement => {
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

  const getCategoryColor = (category: string): string => {
    const categoryColors: { [key: string]: string } = {
      tax: 'bg-red-50 text-red-800',
      legal: 'bg-blue-50 text-blue-800',
      inspection: 'bg-orange-50 text-orange-800',
      insurance: 'bg-green-50 text-green-800',
      financing: 'bg-purple-50 text-purple-800',
      other: 'bg-gray-50 text-gray-800',
    };
    return categoryColors[category] || 'bg-gray-50 text-gray-800';
  };

  const handleSaveCalculation = async () => {
    if (!result) return;

    try {
      // Use direct Supabase service instead of API route
      const saveResult = await CalculatorService.saveCalculation({
        calculatorType: 'closing-costs',
        inputData: {
          homePrice,
          downPayment,
          loanAmount,
          isFirstTimeBuyer,
          includeOptional,
          region: currentRegion,
        },
        results: result,
        saved: true,
      });

      if (!saveResult.success) {
        console.error('Failed to save calculation:', saveResult.error);
      }

      // Navigate back regardless of save success/failure
      // In a real app, you might want to handle errors differently
      router.back();
    } catch (error) {
      console.error('Error saving calculation:', error);
      // Still navigate back even if save fails
      router.back();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Calculator Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--duolingo-green)' }}>
          <DocumentTextIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="duolingo-title mb-4">Closing Costs Calculator</h1>
        <p className="duolingo-subtitle">
          Estimate all the costs you'll need to pay when buying your home
        </p>
      </div>

      {/* General Error Display */}
      {errors.general && (
        <div className="result-card-info red mb-6">
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
        <h3 className="mobile-subtitle mb-6">Purchase Details</h3>
        
        <div className="space-y-6">
          {/* Home Price */}
          <div className="duolingo-form-group">
            <label htmlFor="homePrice" className="duolingo-label">
              Home Purchase Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="homePrice"
                className={`form-input pl-8 ${errors.homePrice ? 'error' : ''}`}
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                min="50000"
                step="1000"
              />
            </div>
            {errors.homePrice && (
              <p className="duolingo-error">{errors.homePrice}</p>
            )}
            {!errors.homePrice && (
              <p className="text-xs text-gray-500 mt-1">
                Total purchase price of the home
              </p>
            )}
          </div>

          {/* Down Payment */}
          <div className="duolingo-form-group">
            <label htmlFor="downPayment" className="duolingo-label">
              Down Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="downPayment"
                className={`form-input pl-8 ${errors.downPayment ? 'error' : ''}`}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                min="0"
                max={homePrice * 0.9}
                step="1000"
              />
            </div>
            {errors.downPayment && (
              <p className="duolingo-error">{errors.downPayment}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Loan Amount: {formatCurrency(loanAmount)} ({((loanAmount / homePrice) * 100).toFixed(1)}% of home price)
            </p>
          </div>

          {/* Options */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="duolingo-label mb-4 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" style={{ color: 'var(--duolingo-green)' }} />
              Additional Options
            </h4>
            
            <div className="space-y-4">
              {(currentRegion === 'BC') && (
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
              )}

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={includeOptional}
                  onChange={(e) => setIncludeOptional(e.target.checked)}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Include optional costs (moving, repairs, etc.)</span>
                  <p className="text-xs text-gray-500 mt-1">Get a more complete closing budget</p>
                </div>
              </label>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Optional costs help you budget for the complete home buying experience
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mobile-card">
          <h3 className="mobile-subtitle mb-6">Your Closing Cost Estimate</h3>
          
          <div className="space-y-6">
            {/* Total Closing Costs */}
            <div className="result-card-primary">
              <div className="text-4xl font-bold text-white mb-2">
                {formatCurrency(result.totalClosingCosts)}
              </div>
              <div className="text-lg text-white/90 mb-1">Total Closing Costs</div>
              <div className="text-sm text-white/75">
                {result.percentOfHomePrice.toFixed(2)}% of home price
              </div>
            </div>

            {/* Cash Needed Summary */}
            <div className="result-card-info blue">
              <h4 className="font-semibold text-blue-900 mb-4">💰 Total Cash Needed at Closing</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Down Payment:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(downPayment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Closing Costs:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(result.totalClosingCosts)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-blue-200 pt-3">
                  <span className="text-blue-800 font-medium">Total Cash Required:</span>
                  <span className="text-2xl font-bold" style={{ color: 'var(--duolingo-green)' }}>
                    {formatCurrency(result.cashNeeded)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Save Calculation */}
          {showSaveOption && (
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveCalculation}
                className="duolingo-button"
              >
                Save This Calculation
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Detailed Breakdown */}
      {result && (
        <div className="mobile-card">
          <h3 className="mobile-subtitle mb-6 flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-3" style={{ color: 'var(--duolingo-green)' }} />
            Cost Breakdown by Category
          </h3>
          
          <div className="space-y-4">
            {Object.entries(result.costsByCategory).map(([category, costs]) => (
              <div key={category} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 font-semibold flex justify-between items-center" 
                     style={{ backgroundColor: 'var(--duolingo-green)', color: 'white' }}>
                  <span className="flex items-center">
                    {getCategoryIcon(category)}
                    <span className="ml-2">{getCategoryName(category)}</span>
                  </span>
                  <span className="text-lg font-bold">
                    {formatCurrency(costs.reduce((sum, cost) => sum + cost.amount, 0))}
                  </span>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {costs.map((cost) => (
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
            ))}
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
            <h4 className="font-semibold text-blue-900 mb-3">ℹ️ About These Estimates</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                Costs calculated based on typical rates in your region
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                Actual amounts may vary by lender, lawyer, and property
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                Some costs may be negotiable or covered by seller
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                Budget an extra 0.5-1% of home price for unexpected costs
              </li>
              {currentRegion && (
                <li className="flex items-start">
                  <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  Check for regional first-time buyer programs and rebates
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}