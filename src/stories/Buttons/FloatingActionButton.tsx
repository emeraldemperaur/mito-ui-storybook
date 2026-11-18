"use client";

import React, { useRef, useState, useEffect, type JSX, useContext } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";
import { FormikContext, type FormikContextType } from "formik";

export type FABPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

/**
 * @interface FloatingActionButtonProps
 * @description Strongly-typed attributes extending native HTML button behaviors for the Mito UI FAB.
 * Optimized for MCP context-injection: Agents must adhere to these strict types to prevent UI thread blocking and style pollution.
 */
export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Unique identifier for the FAB. Essential for deterministic end-to-end testing and ARIA linking.
   */
  id?: string;

  /** React Node representing the internal icon (e.g., SVG, Lucide icon). */
  icon: React.ReactNode;
  
  /** Mandatory accessible label for screen readers. */
  ariaLabel: string;

  /**
   * The core architectural design variant of the button.
   * - `material`: Solid background with elevated z-index shadow. Standard for FABs.
   * - `outline`: Crisp bordered aesthetic with a truly transparent core.
   * - `neumorphic`: Soft, extruded physical surface adapting to parent background. Features a custom dual-wave ripple on click.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical button.
   * @default 'material'
   */
  design?: DesignVariant | 'skeuomorphic';
  
  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;
  
  /** Screen corner placement. @default 'bottom-right' */
  position?: FABPosition;
  
  /** Distance from the designated screen edges in pixels. @default 32 */
  offset?: number;
  
  /** Outer diameter of the circular button in pixels. @default 64 */
  size?: number;

  /** Forces the component into dark mode, overriding system contexts. */
  darkMode?: boolean;

  /**
   * @description Dynamic base background color for light mode. 
   * Injected as a local CSS variable (`--btn-bg`) to ensure strict style isolation and prevent global DOM pollution.
   */
  backgroundColor?: string;

  /**
   * @description Dynamic base background color specifically for dark mode contexts (`--btn-bg-dark`). 
   * Automatically overrides light mode defaults when the component or application shifts to dark mode.
   */
  darkBackgroundColor?: string;

  /**
   * @description Dynamic text and icon color for light mode. 
   * Injected locally as `--btn-text`.
   */
  textColor?: string;

  /**
   * @description Dynamic text and icon color specifically for dark mode contexts (`--btn-text-dark`).
   */
  darkTextColor?: string;

  /**
   * @description Optional hover background color (primarily affects Material and Outline variants). 
   * Injected as `--btn-hover-bg`. Falls back to the base background color if omitted.
   */
  hoverColor?: string;

  /**
   * @description Optional hover background color for dark mode contexts (`--btn-hover-bg-dark`).
   */
  darkHoverColor?: string;

  /**
   * @description Optional hover text and icon color (primarily affects Material and Outline variants). 
   * Injected as `--btn-hover-text`.
   */
  hoverTextColor?: string;

  /**
   * @description Optional hover text and icon color for dark mode contexts (`--btn-hover-text-dark`).
   */
  darkHoverTextColor?: string;

  /**
   * @description Typographic scale or icon size injection (e.g., '24px', '1.5rem'). 
   * Handled natively via the `--btn-size` CSS variable to dictate internal SVG bounds and font scales.
   */
  textSize?: string | number;

  /**
   * @description Font family override to match specific UI brand primitives. 
   * Injected as `--btn-font`.
   */
  fontFamily?: string;

  /* --- Neumorphic & Skeuomorphic Tuning --- */
  /**
   * @description Controls the perceived physical distance of the component from its background plane on the Z-axis.
   * Higher values automatically calculate larger coordinate spreads and blurs for the underlying box-shadows, creating a deeper extruded or elevated effect.
   * @default 5
   */
  elevation?: number;

  /**
   * @description A mathematical multiplier applied to the opacity of both the light highlight and dark shadow channels. 
   * Use this to tune WCAG contrast ratios when the component is dynamically placed on extremely light or extremely dark parent backgrounds.
   * @default 1
   */
  neuIntensity?: number;

  /**
   * @description Dictates the simulated directional angle of the global environment light source.
   * Physically alters the X and Y coordinates of the highlights and shadows to maintain 3D lighting consistency across the UI.
   * @default 'top-left'
   */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 
   * @description Explicit Formik context object injected for nested step fields. 
   */
  formikContext?: FormikContextType<any>;

  /* --- Interaction Handlers --- */
  /** 
   * Primary action trigger. 
   * NOTE: For the 'neumorphic' variant, this automatically triggers a dual-wave ripple animation. 
   * If used within a Formik context with type="submit", it automatically submits the form.
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /** Triggered when the user hovers over the FAB. Maps to onMouseEnter. */
  onHover?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Triggered when the user presses and holds the FAB for 500ms. */
  onLongClick?: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
}

/**
 * @component FloatingActionButton
 * @description Persistent global action trigger. Features intelligent environment background blending, strict accessibility requirements, and isolated styling.
 */
export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(({
  id,
  icon,
  ariaLabel,
  design = 'material',
  asChild = false,
  position = 'bottom-right',
  offset = 32,
  size = 64,
  darkMode = false,
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
  elevation = 5,
  neuIntensity = 1,
  lightSource = 'top-left',
  className = "",
  style,
  type = "button",
  onClick,
  onHover,
  onLongClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onMouseEnter,
  disabled,
  formikContext,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLButtonElement | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isRippling, setIsRippling] = useState(false);
  
  const globalContext = useGlobalUIContext();
  const fallbackContext = useContext(FormikContext) as FormikContextType<any> | undefined;
  const activeContext = formikContext || fallbackContext;
    
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = activeContext !== undefined && typeof activeContext.setFieldValue === 'function';
  const themeClass = darkMode ? 'v-fab-dark' : '';
  const isReadOnly = disabled || globalContext.formikContext?.isSubmitting;

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic')) {
      const environmentBg = backgroundColor || (typeof document !== 'undefined' ? getNearestParentBackground(document.body) : '#e0e5ec');
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(environmentBg, -25 * neuIntensity);
      const shadowLight = adjustColor(environmentBg, 25 * neuIntensity);

      setNeuVars({
        '--fab-bg': environmentBg,
        '--fab-shadow-dark': shadowDark,
        '--fab-shadow-light': shadowLight,
        '--fab-x': `${x}px`,
        '--fab-y': `${y}px`,
        '--fab-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor]);

  const handlePressStart = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (onLongClick && !isReadOnly) {
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
    if (onHover && !isReadOnly) onHover(e);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isReadOnly) { e.preventDefault(); return; }
    
    // MINIMAL FIX: Accelerated ripple timer to match tighter animation bounds
    if (design === 'neumorphic') {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 800); 
    }

    if (isFormik && type === 'submit') globalContext.formikContext?.submitForm();
    if (onClick) onClick(e);
  };

  const customStyles = {
    ...style,
    ...neuVars,
    top: position.includes('top') ? `${offset}px` : 'auto',
    bottom: position.includes('bottom') ? `${offset}px` : 'auto',
    left: position.includes('left') ? `${offset}px` : 'auto',
    right: position.includes('right') ? `${offset}px` : 'auto',
    width: `${size}px`, 
    height: `${size}px`,
    '--btn-bg': backgroundColor,
    '--btn-bg-dark': darkBackgroundColor || backgroundColor,
    '--btn-text': textColor,
    '--btn-text-dark': darkTextColor || textColor,
    '--btn-hover-bg': hoverColor,
    '--btn-hover-bg-dark': darkHoverColor || hoverColor,
    '--btn-hover-text': hoverTextColor,
    '--btn-hover-text-dark': darkHoverTextColor || hoverTextColor,
    '--btn-size': typeof textSize === 'number' ? `${textSize}px` : textSize,
    '--btn-font': fontFamily,
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  const Comp = asChild ? Slot : "button";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .v-fab { 
          --scoped-bg: var(--btn-bg, #000000);
          --scoped-text: var(--btn-text, #ffffff);
          --scoped-hover-bg: var(--btn-hover-bg, var(--scoped-bg));
          --scoped-hover-text: var(--btn-hover-text, var(--scoped-text));
          --scoped-font: var(--btn-font, "Mozilla Headline", "Montserrat", sans-serif);
          
          position: fixed; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          border-radius: 50%; 
          font-family: var(--scoped-font);
          font-size: var(--btn-size, 24px);
          cursor: pointer; 
          transition: transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0.0, 0.2, 1); 
          z-index: 9999; 
          outline: none; 
          -webkit-tap-highlight-color: transparent; 
        }
        
        .v-fab.v-fab-dark {
          --scoped-bg: var(--btn-bg-dark, #ffffff);
          --scoped-text: var(--btn-text-dark, #000000);
          --scoped-hover-bg: var(--btn-hover-bg-dark, var(--scoped-bg));
          --scoped-hover-text: var(--btn-hover-text-dark, var(--scoped-text));
        }

        .v-fab:disabled { opacity: 0.6; cursor: not-allowed; transform: scale(1) !important; }
        .v-fab svg, .v-fab i { width: 45%; height: 45%; display: flex; justify-content: center; align-items: center; transition: transform 0.3s ease; z-index: 2; }
        
        /* --- MATERIAL --- */
        .v-fab-material { background-color: var(--scoped-bg); border: none; color: var(--scoped-text); box-shadow: 0 6px 12px rgba(0,0,0,0.25); }
        .v-fab-material.v-fab-dark { box-shadow: 0 6px 12px rgba(0,0,0,0.5); }
        .v-fab-material:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.3); background-color: var(--scoped-hover-bg); color: var(--scoped-hover-text); }
        .v-fab-material:active:not(:disabled) { transform: translateY(0) scale(0.96); box-shadow: 0 3px 6px rgba(0,0,0,0.2); }
        
        /* --- OUTLINE --- */
        .v-fab-outline { background-color: transparent; border: 2px solid var(--scoped-bg); color: var(--scoped-bg); }
        .v-fab-outline:hover:not(:disabled) { background-color: var(--scoped-hover-bg); border-color: var(--scoped-hover-bg); color: var(--scoped-hover-text); transform: scale(1.05); }
        .v-fab-outline:active:not(:disabled) { transform: scale(0.96); }

        /* --- NEUMORPHIC --- */
        .v-fab-neumorphic { background-color: var(--fab-bg); border: none; color: var(--scoped-text); box-shadow: var(--fab-x) var(--fab-y) var(--fab-blur) var(--fab-shadow-dark), calc(var(--fab-x) * -1) calc(var(--fab-y) * -1) var(--fab-blur) var(--fab-shadow-light); }
        .v-fab-neumorphic:hover:not(:disabled) { opacity: 0.8; }
        .v-fab-neumorphic:active:not(:disabled) { transform: scale(0.96); box-shadow: inset 4px 4px 8px var(--fab-shadow-dark), inset -4px -4px 8px var(--fab-shadow-light); }
        .v-fab-neumorphic:active:not(:disabled) svg { transform: scale(0.9); }
        .v-fab-wave { position: absolute; width: 100%; height: 100%; border-radius: 50%; filter: blur(1px); z-index: 1; pointer-events: none; box-shadow: var(--fab-x) var(--fab-y) var(--fab-blur) var(--fab-shadow-dark), calc(var(--fab-x) * -1) calc(var(--fab-y) * -1) var(--fab-blur) var(--fab-shadow-light); background: linear-gradient(to bottom right, var(--fab-bg) 0%, transparent 100%); animation: mito-fab-waves 0.8s ease-out forwards; }
        .v-fab-wave-delayed { animation-delay: 0.15s; }
        @keyframes mito-fab-waves { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }

        /* --- SKEUOMORPHIC --- */
        .v-fab-skeuomorphic {
          background-color: var(--fab-bg);
          background-image: linear-gradient(to top, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.8) 100%);
          border: 1px solid rgba(0, 0, 0, 0.2);
          color: var(--scoped-text);
          text-shadow: 0 1px rgba(255,255,255,0.6);
          box-shadow: 0 4px 3px 1px rgba(255,255,255,0.8), 0 6px 8px rgba(0,0,0,0.15), 0 -4px 4px rgba(0,0,0,0.05), 0 -6px 4px rgba(255,255,255,0.9), inset 0 0 3px 0 rgba(0,0,0,0.15); 
        }
        .v-fab-skeuomorphic.v-fab-dark {
          background-image: linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 100%);
          border-color: rgba(255, 255, 255, 0.1);
          text-shadow: 0 1px rgba(0,0,0,0.8);
          box-shadow: 0 4px 3px 1px rgba(255,255,255,0.05), 0 6px 8px rgba(0,0,0,0.5), 0 -4px 4px rgba(0,0,0,0.3), 0 -6px 4px rgba(255,255,255,0.05), inset 0 0 3px 0 rgba(0,0,0,0.5);
        }
        .v-fab-skeuomorphic:hover:not(:disabled) { transform: scale(1.02); }
        .v-fab-skeuomorphic:active:not(:disabled) {
          background-image: linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.8) 100%);
          box-shadow: 0 2px 2px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.15), inset 0 0 5px 3px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.15);
          transform: translateY(2px) scale(0.98);
        }
        .v-fab-skeuomorphic.v-fab-dark:active:not(:disabled) {
          background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 100%);
          box-shadow: 0 2px 2px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.5), inset 0 0 5px 3px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.5);
        }
      `}} />

      <Comp 
        id={id}
        ref={(node: HTMLButtonElement | null) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        type={type}
        aria-label={ariaLabel}
        disabled={isReadOnly}
        onClick={handleAction}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className={`v-fab v-fab-${design} ${themeClass} ${className}`}
        style={customStyles}
        {...props}
      >
        {icon}
        {design === 'neumorphic' && isRippling && !isReadOnly && (
          <>
            <span className="v-fab-wave" aria-hidden="true" />
            <span className="v-fab-wave v-fab-wave-delayed" aria-hidden="true" />
          </>
        )}
      </Comp>
    </>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';