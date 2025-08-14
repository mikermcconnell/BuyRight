'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CalculatorIntegrationService, 
  StepCalculatorMapping 
} from '@/lib/calculatorIntegration';
import {
  CalculatorIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

interface CalculatorWidgetProps {
  stepId: string;
  compact?: boolean;
}

export default function CalculatorWidget({ stepId, compact = false }: CalculatorWidgetProps) {
  const router = useRouter();
  const [mapping, setMapping] = useState<StepCalculatorMapping | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const stepMapping = CalculatorIntegrationService.getCalculatorsForStep(stepId);
    setMapping(stepMapping);
    
    if (stepMapping) {
      const calculationProgress = CalculatorIntegrationService.getStepCalculationProgress(stepId);
      setProgress(calculationProgress);
      
      const calculatorResults = CalculatorIntegrationService.getResults();
      setResults(calculatorResults);
    }
  }, [stepId]);

  if (!mapping) {
    return null; // No calculators needed for this step
  }

  const getCalculatorIcon = (calculatorType: string) => {
    switch (calculatorType) {
      case 'affordability':
        return CurrencyDollarIcon;
      case 'mortgage':
        return CalculatorIcon;
      case 'closing-costs':
        return DocumentTextIcon;
      default:
        return CalculatorIcon;
    }
  };

  const getCalculatorName = (calculatorType: string) => {
    switch (calculatorType) {
      case 'affordability':
        return 'Affordability Calculator';
      case 'mortgage':
        return 'Mortgage Calculator';
      case 'closing-costs':
        return 'Closing Costs Calculator';
      default:
        return 'Calculator';
    }
  };

  const getCalculatorHref = (calculatorType: string) => {
    return `/calculators/${calculatorType}`;
  };

  const isCalculatorCompleted = (calculatorType: string): boolean => {
    if (!results) return false;
    
    switch (calculatorType) {
      case 'affordability':
        return !!results.affordability;
      case 'mortgage':
        return results.mortgage && results.mortgage.length > 0;
      case 'closing-costs':
        return !!results.closingCosts;
      default:
        return false;
    }
  };

  const getCalculatorResult = (calculatorType: string): string | null => {
    if (!results) return null;
    
    switch (calculatorType) {
      case 'affordability':
        if (results.affordability) {
          return `Max budget: $${results.affordability.maxHomePrice.toLocaleString()}`;
        }
        return null;
      case 'mortgage':
        if (results.mortgage && results.mortgage.length > 0) {
          const latest = results.mortgage[0];
          return `Monthly: $${latest.monthlyPayment.toLocaleString()}`;
        }
        return null;
      case 'closing-costs':
        if (results.closingCosts) {
          return `Closing costs: $${results.closingCosts.totalClosingCosts.toLocaleString()}`;
        }
        return null;
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <CalculatorIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Calculators</span>
          </div>
          <div className="text-sm font-bold text-blue-600">{Math.round(progress)}%</div>
        </div>
        
        <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-blue-700 mb-3">{mapping.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {mapping.calculators.map((calcType) => {
            const isCompleted = isCalculatorCompleted(calcType);
            const Icon = getCalculatorIcon(calcType);
            
            return (
              <button
                key={calcType}
                onClick={() => router.push(getCalculatorHref(calcType))}
                className={`
                  flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200
                  ${isCompleted 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircleIcon className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                <span>{getCalculatorName(calcType).split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="duolingo-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <CalculatorIcon className="w-5 h-5 mr-2 text-green-600" />
          Financial Calculators
        </h3>
        <div className="text-sm font-bold text-green-600">{Math.round(progress)}% Complete</div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="h-3 rounded-full transition-all duration-500"
          style={{ 
            width: `${progress}%`,
            backgroundColor: 'var(--duolingo-green)'
          }}
        ></div>
      </div>
      
      <p className="text-gray-600 mb-6">{mapping.description}</p>
      
      {/* Calculator Cards */}
      <div className="space-y-3">
        {mapping.calculators.map((calcType) => {
          const isCompleted = isCalculatorCompleted(calcType);
          const Icon = getCalculatorIcon(calcType);
          const result = getCalculatorResult(calcType);
          
          return (
            <div
              key={calcType}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${
                      isCompleted ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      {getCalculatorName(calcType)}
                    </h4>
                    
                    {result && (
                      <p className={`text-sm font-medium mb-1 ${
                        isCompleted ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {result}
                      </p>
                    )}
                    
                    {isCompleted && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                        COMPLETED
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => router.push(getCalculatorHref(calcType))}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200
                    ${isCompleted 
                      ? 'bg-green-100 hover:bg-green-200 text-green-700' 
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    }
                  `}
                >
                  {isCompleted ? (
                    <>
                      <span>Update</span>
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Start</span>
                      <PlayCircleIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Required Notice */}
      {mapping.required && progress < 100 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Required:</span> Complete these calculations before proceeding to the next step.
          </p>
        </div>
      )}
      
      {/* Completion Message */}
      {progress === 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              Great! You've completed all required calculations for this step.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}