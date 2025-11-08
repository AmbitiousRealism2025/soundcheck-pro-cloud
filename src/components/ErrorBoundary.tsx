import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || null,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
              Something went wrong
            </h1>

            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              We're sorry, but something unexpected happened. You can try resetting the app or refreshing the page.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/10">
                <p className="mb-2 font-mono text-sm font-semibold text-red-800 dark:text-red-400">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-red-600 dark:text-red-500">
                      Stack trace
                    </summary>
                    <pre className="mt-2 max-h-64 overflow-auto text-xs text-red-700 dark:text-red-400">
                      {this.state.errorInfo}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={this.handleReset}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
