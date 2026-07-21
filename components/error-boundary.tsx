'use client'

import React, { ReactNode, Component, ErrorInfo } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Enterprise-grade Error Boundary
 * Catches React errors and displays user-friendly error messages
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="bg-slate-900 border-red-500/20 p-8 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <pre className="bg-slate-800 p-3 rounded text-xs text-red-300 overflow-auto mb-4 max-h-32">
                  {this.state.error.toString()}
                </pre>
              )}
              <div className="flex gap-3">
                <Button onClick={this.handleReset} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
                <Button
                  onClick={() => (window.location.href = '/')}
                  variant="outline"
                  className="flex-1 border-slate-600"
                >
                  Home
                </Button>
              </div>
            </Card>
          </div>
        )
      )
    }

    return this.props.children
  }
}
