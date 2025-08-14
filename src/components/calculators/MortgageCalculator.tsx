'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegional } from '@/contexts/RegionalContext';
import { CalculatorIntegrationService } from '@/lib/calculatorIntegration';
import {
  validateHomePrice,
  validateDownPayment,
  validateInterestRate,
  validateLoanTerm,
  ValidationError
} from '@/lib/validation';
import {
  CalculatorIcon,
  InformationCircleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface MortgageCalculation {
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
}

interface MortgageCalculatorProps {
  initialValues?: {
    homePrice?: number;
    downPayment?: number;
    interestRate?: number;
    loanTerm?: number;
  };
  onCalculationChange?: (calculation: MortgageCalculation | null) => void;
  showSaveOption?: boolean;
}

export default function MortgageCalculator({
  initialValues,
  onCalculationChange,
  showSaveOption = false,
}: MortgageCalculatorProps) {
  const [homePrice, setHomePrice] = useState(initialValues?.homePrice || 500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [downPaymentAmount, setDownPaymentAmount] = useState(initialValues?.downPayment || 100000);
  const [interestRate, setInterestRate] = useState(initialValues?.interestRate || 5.5);
  const [loanTerm, setLoanTerm] = useState(initialValues?.loanTerm || 25);
  const [includePropertyTax, setIncludePropertyTax] = useState(false);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);
  const [usePercentage, setUsePercentage] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [showAmortizationChart, setShowAmortizationChart] = useState(false);

  const { formatCurrency, getTaxRate, currentRegion } = useRegional();
  const router = useRouter();

  // Update down payment when switching between percentage and amount
  useEffect(() => {
    if (usePercentage) {
      setDownPaymentAmount(Math.round((homePrice * downPaymentPercent) / 100));
    } else {
      setDownPaymentPercent(Math.round((downPaymentAmount / homePrice) * 100));
    }
  }, [homePrice, downPaymentPercent, downPaymentAmount, usePercentage]);

  // Calculate mortgage details
  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPaymentAmount, interestRate, loanTerm, includePropertyTax, includeInsurance]);

  const calculateMortgage = () => {
    setIsValidating(true);
    const newErrors: Record<string, string> = {};

    try {
      // Validate all inputs
      const homePriceValidation = validateHomePrice(homePrice);
      if (!homePriceValidation.valid) {
        newErrors.homePrice = homePriceValidation.error!;
      }

      const downPaymentValidation = validateDownPayment(downPaymentAmount, homePrice);
      if (!downPaymentValidation.valid) {
        newErrors.downPayment = downPaymentValidation.error!;
      }

      const interestRateValidation = validateInterestRate(interestRate);
      if (!interestRateValidation.valid) {
        newErrors.interestRate = interestRateValidation.error!;
      }

      const loanTermValidation = validateLoanTerm(loanTerm);
      if (!loanTermValidation.valid) {
        newErrors.loanTerm = loanTermValidation.error!;
      }

      // Set errors and return early if validation failed
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setCalculation(null);
        onCalculationChange?.(null);
        setIsValidating(false);
        return;
      }

      // Use sanitized values for calculation
      const sanitizedHomePrice = homePriceValidation.sanitizedValue!;
      const sanitizedDownPayment = downPaymentValidation.sanitizedValue!;
      const sanitizedInterestRate = interestRateValidation.sanitizedValue!;
      const sanitizedLoanTerm = loanTermValidation.sanitizedValue!;

      const loanAmount = sanitizedHomePrice - sanitizedDownPayment;
      const monthlyInterestRate = sanitizedInterestRate / 100 / 12;
      const totalPayments = sanitizedLoanTerm * 12;

      // Additional business logic validation
      if (loanAmount <= 0) {
        newErrors.downPayment = 'Down payment cannot equal or exceed home price';
        setErrors(newErrors);
        setCalculation(null);
        onCalculationChange?.(null);
        setIsValidating(false);
        return;
      }

      if (monthlyInterestRate <= 0) {
        newErrors.interestRate = 'Interest rate must be greater than 0%';
        setErrors(newErrors);
        setCalculation(null);
        onCalculationChange?.(null);
        setIsValidating(false);
        return;
      }

      // Calculate monthly principal and interest payment
      const monthlyPI = loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / 
        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

      // Validate calculated monthly payment for reasonableness
      if (isNaN(monthlyPI) || !isFinite(monthlyPI) || monthlyPI <= 0) {
        newErrors.general = 'Unable to calculate mortgage payment with these parameters';
        setErrors(newErrors);
        setCalculation(null);
        onCalculationChange?.(null);
        setIsValidating(false);
        return;
      }

      let monthlyTaxes = 0;
      let monthlyInsurance = 0;

      // Estimate property taxes (if enabled)
      if (includePropertyTax && currentRegion) {
        const annualTaxRate = getTaxRate('propertyTax') || 1; // Default 1%
        monthlyTaxes = (sanitizedHomePrice * (annualTaxRate / 100)) / 12;
      }

      // Estimate home insurance (if enabled)
      if (includeInsurance) {
        monthlyInsurance = sanitizedHomePrice * 0.003 / 12; // Rough estimate: 0.3% annually
      }

      const totalMonthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurance;
      const totalAmountPaid = monthlyPI * totalPayments;
      const totalInterestPaid = totalAmountPaid - loanAmount;

      const mortgageCalculation: MortgageCalculation = {
        monthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
        totalPayment: Math.round((totalAmountPaid + (monthlyTaxes + monthlyInsurance) * totalPayments) * 100) / 100,
        totalInterest: Math.round(totalInterestPaid * 100) / 100,
        principalAmount: loanAmount,
        paymentBreakdown: {
          principal: Math.round((monthlyPI - (loanAmount * monthlyInterestRate)) * 100) / 100,
          interest: Math.round((loanAmount * monthlyInterestRate) * 100) / 100,
          taxes: Math.round(monthlyTaxes * 100) / 100,
          insurance: Math.round(monthlyInsurance * 100) / 100,
        },
      };

      setCalculation(mortgageCalculation);
      onCalculationChange?.(mortgageCalculation);
      
      // Save to integration service for journey tracking
      CalculatorIntegrationService.saveMortgageResult({
        monthlyPayment: mortgageCalculation.monthlyPayment,
        totalPayment: mortgageCalculation.totalPayment,
        totalInterest: mortgageCalculation.totalInterest,
        principalAmount: mortgageCalculation.principalAmount,
        paymentBreakdown: mortgageCalculation.paymentBreakdown
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Mortgage calculation error:', error);
      }
      
      // Set generic error for user
      setErrors({ general: 'An error occurred during calculation. Please check your inputs and try again.' });
      setCalculation(null);
      onCalculationChange?.(null);
    } finally {
      setIsValidating(false);
    }
  };

  const getMinDownPayment = () => {
    // Canadian mortgage rules - simplified
    if (currentRegion?.startsWith('CA') || currentRegion === 'ON' || currentRegion === 'BC') {
      if (homePrice <= 500000) return 0.05; // 5%
      if (homePrice <= 999999) return 0.05 + (homePrice - 500000) * 0.10 / homePrice; // 5% + 10% on amount over 500k
      return 0.20; // 20% for homes $1M+
    }
    
    // US rules - simplified
    return 0.03; // Conventional loans can go as low as 3%
  };

  const minDownPaymentPercent = getMinDownPayment() * 100;

  const calculateAmortizationSchedule = () => {
    if (!calculation) return [];
    
    const principal = calculation.principalAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = calculation.paymentBreakdown.principal + calculation.paymentBreakdown.interest;
    
    let remainingBalance = principal;
    const schedule = [];
    
    for (let year = 1; year <= loanTerm; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearlyPrincipal += principalPayment;
        yearlyInterest += interestPayment;
        remainingBalance -= principalPayment;
        
        if (remainingBalance <= 0) break;
      }
      
      schedule.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        remainingBalance: Math.max(0, remainingBalance)
      });
      
      if (remainingBalance <= 0) break;
    }
    
    return schedule;
  };

  const handleSaveCalculation = async () => {
    if (!calculation) return;

    try {
      const response = await fetch('/api/calculators/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calculatorType: 'mortgage',
          inputData: {
            homePrice,
            downPaymentAmount,
            interestRate,
            loanTerm,
            includePropertyTax,
            includeInsurance,
          },
          results: calculation,
        }),
      });

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
          <CalculatorIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="duolingo-title mb-4">Mortgage Calculator</h1>
        <p className="duolingo-subtitle">
          Calculate your monthly mortgage payments and understand your loan costs
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
        <h3 className="mobile-subtitle mb-6">Loan Details</h3>
        
        <div className="space-y-6">
          {/* Home Price */}
          <div className="duolingo-form-group">
            <label htmlFor="homePrice" className="duolingo-label">
              Home Price
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
            <div className="flex items-center justify-between mb-2">
              <label className="duolingo-label mb-0">
                Down Payment
              </label>
              <div className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUsePercentage(true)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
                    usePercentage 
                      ? 'text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={usePercentage ? { backgroundColor: 'var(--duolingo-green)' } : {}}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => setUsePercentage(false)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
                    !usePercentage 
                      ? 'text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={!usePercentage ? { backgroundColor: 'var(--duolingo-green)' } : {}}
                >
                  $
                </button>
              </div>
            </div>
            
            {usePercentage ? (
              <div className="relative">
                <input
                  type="number"
                  className={`form-input pr-8 ${errors.downPayment ? 'error' : ''}`}
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  min={minDownPaymentPercent}
                  max="90"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
              </div>
            ) : (
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  className={`form-input pl-8 ${errors.downPayment ? 'error' : ''}`}
                  value={downPaymentAmount}
                  onChange={(e) => setDownPaymentAmount(Number(e.target.value))}
                  min={homePrice * minDownPaymentPercent / 100}
                  max={homePrice * 0.9}
                  step="1000"
                />
              </div>
            )}
            
            {downPaymentPercent < minDownPaymentPercent && !errors.downPayment && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ Minimum down payment is {minDownPaymentPercent.toFixed(1)}% ({formatCurrency(homePrice * minDownPaymentPercent / 100)})
                </p>
              </div>
            )}
            {errors.downPayment && (
              <p className="duolingo-error">{errors.downPayment}</p>
            )}
            {!errors.downPayment && (
              <p className="text-xs text-gray-500 mt-1">
                Currently {formatCurrency(downPaymentAmount)} ({downPaymentPercent.toFixed(1)}% of home price)
              </p>
            )}
          </div>

          {/* Interest Rate */}
          <div className="duolingo-form-group">
            <label htmlFor="interestRate" className="duolingo-label">
              Interest Rate (Annual)
            </label>
            <div className="relative">
              <input
                type="number"
                id="interestRate"
                className={`form-input pr-8 ${errors.interestRate ? 'error' : ''}`}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min="0.1"
                max="20"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
            </div>
            {errors.interestRate && (
              <p className="duolingo-error">{errors.interestRate}</p>
            )}
            {!errors.interestRate && (
              <p className="text-xs text-gray-500 mt-1">
                Current rates typically range from 4% to 8%
              </p>
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
            {errors.loanTerm && (
              <p className="duolingo-error">{errors.loanTerm}</p>
            )}
          </div>

          {/* Additional Options */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="duolingo-label mb-4 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" style={{ color: 'var(--duolingo-green)' }} />
              Include in Payment
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={includePropertyTax}
                  onChange={(e) => setIncludePropertyTax(e.target.checked)}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Property Taxes (estimated)</span>
                  <p className="text-xs text-gray-500 mt-1">Based on regional tax rates</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={includeInsurance}
                  onChange={(e) => setIncludeInsurance(e.target.checked)}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Home Insurance (estimated)</span>
                  <p className="text-xs text-gray-500 mt-1">Estimated at 0.3% annually</p>
                </div>
              </label>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Including taxes and insurance gives you a more complete picture of your monthly housing costs
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      {calculation && (
        <div className="mobile-card">
          <h3 className="mobile-subtitle mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-3" style={{ color: 'var(--duolingo-green)' }} />
            Your Monthly Payment
          </h3>
          
          <div className="space-y-6">
            {/* Total Monthly Payment */}
            <div className="result-card-primary">
              <div className="text-4xl font-bold text-white mb-2">
                {formatCurrency(calculation.monthlyPayment)}
              </div>
              <div className="text-lg text-white/90">Total Monthly Payment</div>
            </div>

            {/* Payment Breakdown */}
            <div className="space-y-4">
              <div className="result-card-secondary">
                <div className="text-2xl font-bold" style={{ color: 'var(--duolingo-green)' }}>
                  {formatCurrency(calculation.paymentBreakdown.principal + calculation.paymentBreakdown.interest)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Principal + Interest</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {calculation.paymentBreakdown.taxes && calculation.paymentBreakdown.taxes > 0 && (
                  <div className="result-card-secondary">
                    <div className="text-lg font-bold" style={{ color: 'var(--duolingo-green)' }}>
                      {formatCurrency(calculation.paymentBreakdown.taxes)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Property Taxes</div>
                  </div>
                )}
                
                {calculation.paymentBreakdown.insurance && calculation.paymentBreakdown.insurance > 0 && (
                  <div className="result-card-secondary">
                    <div className="text-lg font-bold" style={{ color: 'var(--duolingo-green)' }}>
                      {formatCurrency(calculation.paymentBreakdown.insurance)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Home Insurance</div>
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Loan Overview */}
            <div className="result-card-info blue">
              <button
                onClick={() => setShowAmortizationChart(!showAmortizationChart)}
                className="w-full flex justify-between items-center focus:outline-none"
              >
                <h4 className="font-semibold text-blue-900">💰 Loan Overview</h4>
                <span className="text-blue-600 text-sm">
                  {showAmortizationChart ? '▼ Hide Details' : '▶ Show Payment Breakdown'}
                </span>
              </button>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Loan Amount:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(calculation.principalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Total Interest Over Life:</span>
                  <span className="font-semibold text-blue-900">{formatCurrency(calculation.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-blue-200 pt-3">
                  <span className="text-blue-800 font-medium">Total Amount Paid:</span>
                  <span className="font-semibold" style={{ color: 'var(--duolingo-green)' }}>{formatCurrency(calculation.totalPayment)}</span>
                </div>
              </div>

              {/* Amortization Chart */}
              {showAmortizationChart && (
                <div className="mt-6 pt-4 border-t border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-4">📊 Principal vs Interest Over Time</h5>
                  <div className="space-y-2">
                    {calculateAmortizationSchedule().map((yearData, index) => {
                      const totalYearPayment = yearData.principal + yearData.interest;
                      const principalPercent = (yearData.principal / totalYearPayment) * 100;
                      const interestPercent = (yearData.interest / totalYearPayment) * 100;
                      
                      return (
                        <div key={yearData.year} className="space-y-1">
                          <div className="flex justify-between text-xs text-blue-800">
                            <span>Year {yearData.year}</span>
                            <span>{formatCurrency(totalYearPayment)}</span>
                          </div>
                          <div className="flex h-6 bg-blue-50 rounded overflow-hidden">
                            <div 
                              className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                              style={{ width: `${principalPercent}%` }}
                            >
                              {principalPercent > 15 && `${Math.round(principalPercent)}%`}
                            </div>
                            <div 
                              className="bg-red-400 flex items-center justify-center text-white text-xs font-medium"
                              style={{ width: `${interestPercent}%` }}
                            >
                              {interestPercent > 15 && `${Math.round(interestPercent)}%`}
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                              Principal: {formatCurrency(yearData.principal)}
                            </span>
                            <span className="flex items-center">
                              <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
                              Interest: {formatCurrency(yearData.interest)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm font-medium text-yellow-900">Principal Payment</span>
                      <div className="w-3 h-3 bg-red-400 rounded ml-4"></div>
                      <span className="text-sm font-medium text-yellow-900">Interest Payment</span>
                    </div>
                    <p className="text-xs text-yellow-800">
                      Early years pay mostly interest. Later years pay mostly principal as your balance decreases.
                    </p>
                  </div>
                </div>
              )}
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
                <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                Uses standard mortgage calculation formulas
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                Property tax rates based on your selected region
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                Insurance estimated at 0.3% of home value annually
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                Get pre-approved with a lender for accurate rates
              </li>
              {currentRegion && (
                <li className="flex items-start">
                  <span className="font-bold mr-3" style={{ color: 'var(--duolingo-green)' }}>→</span>
                  Regional programs and incentives may be available
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}