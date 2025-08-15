'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { calculatorLogger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  calculatorName: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class CalculatorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `calc-error-${Date.now()}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    calculatorLogger.error(
      `Calculator error in ${this.props.calculatorName}`,
      error,
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'CalculatorErrorBoundary',
        errorId: this.state.errorId,
      }
    );
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  private handleReset = () => {
    // Clear any calculator data from localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('calculator') || key.includes('buyright_calculator')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      calculatorLogger.error('Failed to clear calculator data', error);
    }
    
    this.handleRetry();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto h-16 w-16 text-red-500 mb-4">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Calculator Error
            </h3>
            
            <p className="text-gray-600 mb-6">
              Something went wrong with the {this.props.calculatorName} calculator. 
              This might be due to invalid input values or a temporary issue.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                aria-label={`Retry ${this.props.calculatorName} calculator`}
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                aria-label={`Reset ${this.props.calculatorName} calculator data`}
              >
                Reset Calculator Data
              </button>
              
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                aria-label="Go back to dashboard"
              >
                Back to Dashboard
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage with calculators
export function withCalculatorErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  calculatorName: string,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedCalculator(props: P) {
    return (
      <CalculatorErrorBoundary calculatorName={calculatorName} onError={onError}>
        <Component {...props} />
      </CalculatorErrorBoundary>
    );
  };
}

export default CalculatorErrorBoundary;