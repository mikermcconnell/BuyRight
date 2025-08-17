'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';

const uiLogger = logger.createDomainLogger('ui');

interface Props {
  children: ReactNode;
  pageName: string;
  fallbackComponent?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `page-error-${Date.now()}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    uiLogger.error(
      `Page error in ${this.props.pageName}`,
      error,
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'PageErrorBoundary',
        errorId: this.state.errorId,
        pageName: this.props.pageName,
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

  private handleNavigateHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback component if provided
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return <FallbackComponent error={this.state.error!} reset={this.handleRetry} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto h-20 w-20 text-red-500 mb-6">
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
                  strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error on the {this.props.pageName} page. 
              This has been logged and we'll work to fix it.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label={`Retry loading ${this.props.pageName} page`}
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleNavigateHome}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Go back to dashboard"
              >
                Back to Dashboard
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:underline">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-3 text-xs text-gray-600 bg-gray-100 p-4 rounded-lg overflow-auto max-h-48 border">
                  <strong>Error:</strong> {this.state.error.toString()}
                  {this.state.error.stack && (
                    <>
                      <br /><br />
                      <strong>Stack Trace:</strong>
                      <br />
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
            
            <div className="mt-8 text-xs text-gray-400">
              Error ID: {this.state.errorId}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage with pages
export function withPageErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  pageName: string,
  fallbackComponent?: React.ComponentType<{ error: Error; reset: () => void }>,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedPage(props: P) {
    return (
      <PageErrorBoundary
        pageName={pageName}
        fallbackComponent={fallbackComponent}
        onError={onError}
      >
        <Component {...props} />
      </PageErrorBoundary>
    );
  };
}

export default PageErrorBoundary;