'use client';

import React from 'react';
import { Alert } from '../alert';
import { Button } from '../button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert
              variant="error"
              message={
                this.state.error?.message ||
                '予期しないエラーが発生しました。'
              }
            />
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                エラーが発生しました。ページを再読み込みしてください。
              </p>
              <Button onClick={this.handleReset} variant="secondary">
                もう一度試す
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}