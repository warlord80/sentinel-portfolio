"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — catches client-side rendering errors and displays
 * a fallback UI instead of crashing the entire page.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="font-mono text-2xl text-accent">!</div>
            <p className="font-sans text-sm text-muted">
              Something went wrong loading this section.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-sm border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted hover:border-accent hover:text-accent"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
