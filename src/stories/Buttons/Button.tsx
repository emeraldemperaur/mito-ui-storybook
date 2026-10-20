"use client";

import React, { type JSX } from 'react';
import { Slot } from '@radix-ui/react-slot';

/**
 * @interface ButtonProps
 * @description Strongly-typed attributes extending native HTML button behaviors with theme, loading state, and Slot composition parameters.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual aesthetic design variant.
   * @default 'primary'
   * @example variant="destructive"
   */
  variant?: 'primary' | 'secondary' | 'destructive';
  
  /**
   * Toggles an active execution status layout. Disables the interaction node and updates accessibility trees.
   * @default false
   * @example isLoading={true}
   */
  isLoading?: boolean;

  /**
   * Delegates rendering to the immediate child element while merging behaviors, styles, and data attributes.
   * @default false
   * @example asChild={true}
   */
  asChild?: boolean;
}

/**
 * @component Button
 * @description Master interactive button element built with SSR-safe attribute bindings, Radix Slot composition, and complete WCAG aria accessibility support.
 * @example
 * <Button variant="primary" asChild>
 * <a href="/dashboard">Navigate to Dashboard</a>
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  isLoading = false, 
  asChild = false,
  children, 
  disabled,
  ...props 
}, ref): JSX.Element => {
  
  const isInteractionDisabled = disabled || isLoading;

  const Component = asChild ? Slot : 'button';

  return (
    <Component 
      ref={ref}
      disabled={isInteractionDisabled} 
      data-variant={variant} 
      aria-busy={isLoading ? "true" : undefined}
      aria-live={isLoading ? "polite" : undefined}
      {...props}
    >
      {isLoading ? (
        <span className="v-button-loading-state" aria-hidden="true">
          Loading...
        </span>
      ) : (
        children
      )}
    </Component>
  );
});

Button.displayName = 'Button';