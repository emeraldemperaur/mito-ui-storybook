"use client";

import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * @interface ErrorBoundaryProps
 * @description Strongly-typed attributes configuring the fallback UI and telemetry hooks for the ErrorBoundary wrapper.
 */
export interface ErrorBoundaryProps {
  /** * The primary component tree to be monitored for runtime exceptions. 
   */
  children?: ReactNode;
  
  /** * @description The visual fallback rendered when the component catches an error.
   * Can be a static ReactNode, or a render-prop function that provides the raw Error object and a reset trigger.
   * @example
   * <ErrorBoundary 
   * fallback={(error, reset) => (
   * <div role="alert">
   * <h2>System Fault Detected</h2>
   * <p>{error.message}</p>
   * <button onClick={reset}>Reboot Component</button>
   * </div>
   * )}
   * >
   * <FaultyWidget />
   * </ErrorBoundary>
   */
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);

  /**
   * @description Optional callback execution hook triggered immediately when an error is caught. 
   * Designed for injecting external telemetry tracking (e.g., Sentry, Datadog, Loki) without polluting the UI primitive.
   * @example
   * onError={(error, info) => Sentry.captureException(error, { extra: info })}
   */
  onError?: (error: Error, info: ErrorInfo) => void;
}

/**
 * @interface ErrorBoundaryState
 * @description Internal state tracking interface mapping the active fault status of the component tree.
 */
interface ErrorBoundaryState {
  /** Indicates whether a runtime fault has been intercepted. */
  hasError: boolean;
  /** The raw Error object intercepted from the child component tree, or null if stable. */
  error: Error | null;
}

/**
 * @component ErrorBoundary
 * @description SSR-compatible React Class Component. Intercepts runtime JavaScript errors anywhere in its child component tree, logs those errors, and displays a fallback UI instead of crashing the component tree.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  /**
   * @method getDerivedStateFromError
   * @description React lifecycle hook invoked after an error has been thrown by a descendant component. Updates state to trigger the fallback UI render pass.
   * @param {Error} error - The unhandled exception thrown by the child.
   * @returns {ErrorBoundaryState} The new state object explicitly flagging the error condition.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * @method componentDidCatch
   * @description React lifecycle hook invoked after an error has been thrown by a descendant component. Used explicitly for logging error information.
   * @param {Error} error - The specific error intercepted.
   * @param {ErrorInfo} info - An object containing a componentStack property with information about which component threw the error.
   */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Standard console trace for local debugging
    console.error("ErrorBoundary intercepted an unhandled fault:", error);
    console.error("Component execution stack trace:", info.componentStack);

    // Bubble the error up to external telemetry if a callback was provided
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  /**
   * @method resetErrorBoundary
   * @description Operational state modifier. Wipes the active fault from local state, forcing React to attempt a re-render of the primary children tree.
   */
  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!, this.resetErrorBoundary);
      }
      
      return this.props.fallback;
    }

    return this.props.children;
  }
}