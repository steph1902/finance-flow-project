"use client";

import { Component, ReactNode } from 'react';
import { logError } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Error Boundary Component
 * 
 * Catches React rendering errors and prevents the entire app from crashing.
 * Logs errors for debugging and displays user-friendly fallback UI.
 * 
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * @example Custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    logError('React Error Boundary caught error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.fallbackTitle || 'ErrorBoundary',
    });

    this.setState({ errorInfo });
  }

  handleReset = () => {
    // Reset error boundary state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    // Call optional reset handler
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>{this.props.fallbackTitle || 'Something went wrong'}</CardTitle>
              </div>
              <CardDescription>
                {this.props.fallbackMessage || 
                  'An unexpected error occurred. Please try refreshing the page.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm font-mono text-muted-foreground break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback for full-page errors
 */
export function FullPageErrorFallback({ 
  error, 
  onReset 
}: { 
  error?: Error; 
  onReset?: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl">Application Error</CardTitle>
          </div>
          <CardDescription>
            We encountered an unexpected error. This has been logged and we&apos;ll look into it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Error Details:</p>
              <div className="rounded-md bg-muted p-3 max-h-48 overflow-auto">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            {onReset && (
              <Button onClick={onReset} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button 
              variant={onReset ? "outline" : "default"}
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1"
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
