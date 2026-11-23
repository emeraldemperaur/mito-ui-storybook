"use client";

import React, { type JSX, useId, useRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import '../../styles/Button.scss';

/**
 * @interface ButtonProps
 * @description Strongly-typed attributes extending native HTML button behaviors with Mito UI's enterprise visual variants. 
 * Optimized for MCP context-injection: Agents must adhere to these strict types to prevent UI thread blocking and style pollution.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Unique identifier for the button. Essential for deterministic end-to-end testing, 
   * strict DOM querying, and linking complex WCAG aria attributes (e.g., `aria-controls`, `aria-describedby`).
   */
  id?: string;

  /**
   * The core architectural design variant of the button.
   * - `material`: Solid background with optional micro-animations. Use for primary call-to-action (CTA) triggers.
   * - `outline`: Crisp bordered aesthetic with transparent core. Use for secondary actions or cancel triggers.
   * - `neumorphic`: Soft, extruded physical surface utilizing RGBA alpha overlays to intelligently adapt to any parent background. Use for spatial depth in dashboards.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical button. Use for critical, tactile interactions (e.g., deployment triggers).
   * @default 'material'
   */
  variant?: 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

  /**
   * Enables complex interactions and micro-animations. 
   * WARNING: Only applies when `variant` is 'material' or 'outline'.
   * @default false
   */
  animate?: boolean;

  /**
   * The specific animation topology to apply when `animate` is true.
   * - `bubble`: Gooey liquid explosion on hover utilizing an inline SVG filter. High visual impact.
   * - `prism`: 3D rotational face swap on hover using CSS preserve-3d.
   * - `none`: Standard transition scaling.
   * @default 'none'
   */
  animation?: 'bubble' | 'prism' | 'none';

  /**
   * Dynamic base background color for light mode. Injected as a local CSS variable (`--mito-btn-bg`) to prevent global DOM style pollution.
   */
  backgroundColor?: string;

  /**
   * Dynamic base background color specifically for dark mode contexts. Overrides CSS defaults.
   */
  darkBackgroundColor?: string;

  /**
   * Dynamic text color for light mode. Injected locally as `--mito-btn-text`.
   */
  textColor?: string;

  /**
   * Dynamic text color specifically for dark mode contexts.
   */
  darkTextColor?: string;

  /**
   * Typography scale injection (e.g., '14px', '1rem'). Handled natively via local CSS variables.
   */
  textSize?: string | number;

  /**
   * Font family override to match specific UI brand primitives. Injected as `--mito-btn-font`.
   */
  fontFamily?: string;

  /**
   * Toggles an active execution status layout. 
   * CRITICAL: Automatically disables the interaction node and updates WCAG accessibility trees (`aria-busy`, `aria-live`).
   * @default false
   */
  isLoading?: boolean;

  /**
   * Delegates rendering to the immediate child element while merging behaviors, styles, and data attributes via Radix Slot.
   * CONTEXT NOTE: This may conflict with complex `prism` animations that require strict multi-layered DOM wrapping.
   * @default false
   */
  asChild?: boolean;
  
  /**
   * Forces the component into dark mode, overriding system (`prefers-color-scheme`) or parent theme contexts.
   * Use this as an escape hatch when placing buttons over dark cinematic hero backgrounds in a light-themed application.
   * @default false
   */
  darkMode?: boolean;

  /** 
   * Triggered when the user hovers over the button. Maps to onMouseEnter. 
   */
  onHover?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** 
   * Triggered when the user presses and holds the button for 500ms. 
   */
  onLongClick?: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;

  /**
   * Optional hover background color (Material/Outline variants only). Injected as `--mito-btn-hover-bg`.
   */
  hoverColor?: string;

  /**
   * Optional hover background color for dark mode (Material/Outline variants only).
   */
  darkHoverColor?: string;

  /**
   * Optional hover text color (Material/Outline variants only). Injected as `--mito-btn-hover-text`.
   */
  hoverTextColor?: string;

  /**
   * Optional hover text color for dark mode (Material/Outline variants only).
   */
  darkHoverTextColor?: string;

  /**
   * Button label, icons, or child elements rendered inside the interactive trigger.
   */
  children?: React.ReactNode;
}

/**
 * @component Button
 * @description Master interactive button element built for the Mito UI ecosystem. Features SSR-safe attribute bindings, dynamic background adaptation, and WCAG 2.1 AA compliance. 
 * 
 * MCP AGENT INSTRUCTIONS: Do not apply inline styles directly to this component's wrapper. Always use the designated color props (`backgroundColor`, `textColor`, etc.) to ensure styling remains tightly scoped to the component's CSS variable architecture.
 * 
 * @example
 * // Example: Neumorphic dark mode button with custom branding
 * <Button 
 *   variant="neumorphic" 
 *   darkMode={true} 
 *   darkBackgroundColor="#1A1A1D" 
 *   darkTextColor="#90feb5"
 * >
 *   Deploy Agent
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  id,
  variant = 'material', 
  animate = false,
  animation = 'none',
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  hoverColor,
  darkHoverColor,
  hoverTextColor,
  darkHoverTextColor,
  textSize,
  fontFamily,
  isLoading = false, 
  asChild = false,
  darkMode = false,
  onHover,
  onLongClick,
  children, 
  disabled,
  className = '',
  style,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onMouseEnter,
  ...props 
}, ref): JSX.Element => {
  
  const isInteractionDisabled = disabled || isLoading;
  const Component = asChild ? Slot : 'button';
  const filterId = useId(); 
  const themeClass = darkMode ? 'mito-btn-dark' : '';
  const customStyles = { ...style } as React.CSSProperties & Record<string, any>;
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  if (backgroundColor) customStyles['--mito-btn-bg'] = backgroundColor;
  if (darkBackgroundColor) customStyles['--mito-btn-bg-dark'] = darkBackgroundColor;
  if (textColor) customStyles['--mito-btn-text'] = textColor;
  if (darkTextColor) customStyles['--mito-btn-text-dark'] = darkTextColor;
  if (hoverColor) customStyles['--mito-btn-hover-bg'] = hoverColor;
  if (darkHoverColor) customStyles['--mito-btn-hover-bg-dark'] = darkHoverColor;
  if (hoverTextColor) customStyles['--mito-btn-hover-text'] = hoverTextColor;
  if (darkHoverTextColor) customStyles['--mito-btn-hover-text-dark'] = darkHoverTextColor;
  if (textSize) customStyles['--mito-btn-size'] = typeof textSize === 'number' ? `${textSize}px` : textSize;
  if (fontFamily) {
    customStyles['--mito-btn-font'] = fontFamily;
    customStyles.fontFamily = fontFamily; 
  }

  const handlePressStart = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (onLongClick && !isInteractionDisabled) {
      longPressTimer.current = setTimeout(() => onLongClick(e), 500);
    }
    if (e.type === 'mousedown' && onMouseDown) onMouseDown(e as React.MouseEvent<HTMLButtonElement>);
    if (e.type === 'touchstart' && onTouchStart) onTouchStart(e as React.TouchEvent<HTMLButtonElement>);
  };

  const handlePressEnd = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (e.type === 'mouseup' && onMouseUp) onMouseUp(e as React.MouseEvent<HTMLButtonElement>);
    if (e.type === 'touchend' && onTouchEnd) onTouchEnd(e as React.TouchEvent<HTMLButtonElement>);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (onMouseLeave) onMouseLeave(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onHover && !isInteractionDisabled) onHover(e);
    if (onMouseEnter) onMouseEnter(e);
  };

  const sharedEventProps = {
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onTouchStart: handlePressStart,
    onTouchEnd: handlePressEnd,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
  };

  if (animate && animation === 'bubble' && (variant === 'material' || variant === 'outline')) {
    return (
      <div className={`mito-btn-bubble-wrapper ${themeClass}`} style={customStyles}>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="mito-btn-bubble-svg">
          <defs>
            <filter id={`goo-${filterId}`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <Component 
          id={id}
          ref={ref}
          className={`mito-btn mito-btn-${variant} mito-btn-anim-bubble ${themeClass} ${className}`}
          disabled={isInteractionDisabled} 
          data-variant={variant} 
          aria-busy={isLoading ? "true" : undefined}
          aria-live={isLoading ? "polite" : undefined}
          style={{ filter: `url('#goo-${filterId}')` }}
          {...sharedEventProps}
          {...props}
        >
          {isLoading ? <span className="mito-btn-loading" aria-hidden="true">Loading...</span> : children}
          {!isLoading && (
            <span className="mito-btn-bubble-effect-container">
              <span className="mito-bubble-circle top-left"></span>
              <span className="mito-bubble-circle top-left"></span>
              <span className="mito-bubble-circle top-left"></span>
              <span className="mito-bubble-effect-core"></span>
              <span className="mito-bubble-circle bottom-right"></span>
              <span className="mito-bubble-circle bottom-right"></span>
              <span className="mito-bubble-circle bottom-right"></span>
            </span>
          )}
        </Component>
      </div>
    );
  }

  if (animate && animation === 'prism' && (variant === 'material' || variant === 'outline')) {
    return (
      <div className={`mito-btn-prism-wrapper ${themeClass} ${className}`} style={customStyles}>
        <Component 
          id={id}
          ref={ref}
          className={`mito-btn mito-btn-${variant} mito-btn-anim-prism ${themeClass}`}
          disabled={isInteractionDisabled} 
          data-variant={variant} 
          aria-busy={isLoading ? "true" : undefined}
          aria-live={isLoading ? "polite" : undefined}
          {...sharedEventProps}
          {...props}
        >
          <div className="mito-btn-prism-inner">
            <span className="mito-btn-prism-placeholder" aria-hidden="true">
              {isLoading ? 'Loading...' : children}
            </span>
            <span className="mito-btn-prism-face mito-btn-prism-front">
              {isLoading ? 'Loading...' : children}
            </span>
            <span className="mito-btn-prism-face mito-btn-prism-top">
              {isLoading ? 'Loading...' : children}
            </span>
          </div>
        </Component>
      </div>
    );
  }

  return (
    <Component 
      id={id}
      ref={ref}
      className={`mito-btn mito-btn-${variant} ${themeClass} ${className}`}
      disabled={isInteractionDisabled} 
      data-variant={variant} 
      aria-busy={isLoading ? "true" : undefined}
      aria-live={isLoading ? "polite" : undefined}
      style={customStyles}
      {...sharedEventProps}
      {...props}
    >
      {isLoading ? (
        <span className="mito-btn-loading" aria-hidden="true">Loading...</span>
      ) : (
        children
      )}
    </Component>
  );
});

Button.displayName = 'Button';