"use client";

import React, { useRef, useState, useEffect, useMemo, createContext, useContext, type JSX, useId } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useFormikContext, getIn } from 'formik';
import { getNearestParentBackground } from "../../utils/Vinci";
import { type BaseInputProps } from "../Inputs/types";
import '../../styles/Button.scss';

/**
 * @interface ButtonGroupRootProps
 * @description Strongly-typed attributes for the ButtonGroup state manager. Evaluates context, bounds, and enterprise styling.
 * Optimized for MCP Context: Agents must respect the maximum limit of 12 items to prevent UI layout fractures.
 */
export interface ButtonGroupRootProps extends Omit<BaseInputProps, 'design'> {
  /**
   * Unique identifier for the group container. Essential for a11y linking and DOM queries.
   */
  id?: string;

  /**
   * The core architectural design variant propagating to all child items.
   * @default 'outline'
   */
  design?: 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

  /** Enables selection of multiple buttons concurrently. @default false */
  multiselect?: boolean;
  
  /** Layout direction of the button group. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  
  /** Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. @default 1 */
  neuIntensity?: number;
  
  /** Accessible label for screen readers. @default "Button group" */
  ariaLabel?: string;
  
  /** Forces the component into dark mode, overriding system contexts. */
  darkMode?: boolean;

  /** Enables complex interactions and micro-animations. Applies to 'material' and 'outline'. */
  animate?: boolean;

  /** The specific animation topology to apply when `animate` is true. */
  animation?: 'bubble' | 'prism' | 'none';

  /** Custom border radius applied to the outer edges of the Button Group. Defaults to '0' for a clean look. */
  borderRadius?: string | number;

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
   * React children, strictly expected to be `ButtonGroup.Item` components. 
   * WARNING: Hard-capped at 12 nodes to respect maximum grid footprint.
   */
  children: React.ReactNode;
}

export interface ButtonGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string | number;
  asChild?: boolean;
  onHover?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLongClick?: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
}

interface ButtonGroupContextValue {
  name?: string;
  design: 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';
  orientation: 'horizontal' | 'vertical';
  multiselect: boolean;
  selectedValues: (string | number)[];
  hasError: boolean;
  readOnly?: boolean;
  animate: boolean;
  animation: 'bubble' | 'prism' | 'none';
  onItemSelect: (value: string | number) => void;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

/**
 * @component ButtonGroup.Root
 * @description Master state-managing wrapper. Automatically syncs with Formik and cascades custom CSS variables.
 */
const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(({
  id,
  alias,
  design = 'outline',
  orientation = 'horizontal',
  multiselect = false,
  elevation = 3,
  surface = 'flat',
  neuIntensity = 1,
  darkMode = false,
  animate = false,
  animation = 'none',
  borderRadius = 0,
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
  readOnly,
  errorText,
  className = "",
  style,
  formikContext,
  value,
  onChange,
  ariaLabel = "Button group",
  children,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const themeClass = darkMode ? 'v-btn-group-dark' : '';

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  const isFormik = Boolean(activeContext);

  const fieldValue = isFormik && alias ? getIn(activeContext.values, alias) : value;
  const fieldTouched = isFormik && alias ? getIn(activeContext.touched, alias) : null;
  const fieldError = isFormik && alias ? getIn(activeContext.errors, alias) : null;
  const hasError = Boolean((fieldTouched && fieldError) || errorText);

  const selectedValues: (string | number)[] = useMemo(() => {
    if (fieldValue === undefined || fieldValue === null) return [];
    if (Array.isArray(fieldValue)) return fieldValue;
    return [fieldValue];
  }, [fieldValue]);

  const safeChildren = useMemo(() => {
    const arr = React.Children.toArray(children);
    if (arr.length > 12) {
      console.warn(`[Mito UI] ButtonGroup ${alias || id} exceeds the maximum limit of 12 items. Truncating.`);
      return arr.slice(0, 12);
    }
    return arr;
  }, [children, alias, id]);

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = getNearestParentBackground(containerRef.current.parentElement) || '#e0e5ec';
      setNeuVars({
        '--parent-bg': parentBg,
        '--neu-dist': `${elevation}px`,
        '--neu-blur': `${elevation * 2}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation]);

  const handleSelect = (itemValue: string | number) => {
    if (readOnly) return;
    let newValues: (string | number)[];
    
    if (multiselect) {
      newValues = selectedValues.includes(itemValue)
        ? selectedValues.filter(v => v !== itemValue)
        : [...selectedValues, itemValue];
    } else {
      newValues = [itemValue];
    }

    const payload = multiselect ? newValues : newValues[0];
    if (isFormik && alias) {
      activeContext.setFieldValue(alias, payload);
      setTimeout(() => activeContext.setFieldTouched(alias, true, false), 0);
    }
    if (onChange) onChange(payload);
  };

  const customStyles = {
    ...style,
    ...neuVars,
    '--btn-group-direction': orientation === 'vertical' ? 'column' : 'row',
    '--btn-group-radius': typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
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

  const contextValue: ButtonGroupContextValue = {
    name: alias,
    design,
    orientation,
    multiselect,
    selectedValues,
    hasError,
    readOnly,
    animate,
    animation,
    onItemSelect: handleSelect,
  };

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <>
        <style dangerouslySetInnerHTML={{ __html: `
          .v-btn-group {
            --scoped-bg: var(--btn-bg, #000000);
            --scoped-text: var(--btn-text, #ffffff);
            --scoped-hover-bg: var(--btn-hover-bg, var(--scoped-bg));
            --scoped-hover-text: var(--btn-hover-text, var(--scoped-text));
            --scoped-font: var(--btn-font, "Mozilla Headline", "Montserrat", sans-serif);
            
            display: inline-flex;
            flex-direction: var(--btn-group-direction);
            align-items: stretch;
            border-radius: var(--btn-group-radius);
            isolation: isolate;
            font-family: var(--scoped-font);
            font-size: var(--btn-size, 14px);
          }
          
          .v-btn-group.v-btn-group-dark {
            --scoped-bg: var(--btn-bg-dark, #ffffff);
            --scoped-text: var(--btn-text-dark, #000000);
            --scoped-hover-bg: var(--btn-hover-bg-dark, var(--scoped-bg));
            --scoped-hover-text: var(--btn-hover-text-dark, var(--scoped-text));
          }

          /* Ensure wrapper components (like Bubble/Prism containers) align correctly */
          .v-btn-group > * {
            display: inline-flex;
          }

          .v-btn-group-item {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
            outline: none;
            border: none;
            background: transparent;
            box-sizing: border-box;
            width: 100%;
          }
          
          .v-btn-group-item:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
          }

          /* --- OUTLINE --- */
          .v-btn-group-outline .v-btn-group-item {
            color: var(--scoped-bg);
            border: 2px solid var(--scoped-bg);
          }
          .v-btn-group-outline.v-btn-group-horizontal > *:not(:first-child) { margin-left: -2px; }
          .v-btn-group-outline.v-btn-group-vertical > *:not(:first-child) { margin-top: -2px; margin-left: 0; }
          
          .v-btn-group-outline .v-btn-group-item:hover,
          .v-btn-group-outline .v-btn-group-item[data-state="on"] {
            background-color: var(--scoped-hover-bg);
            color: var(--scoped-hover-text);
            border-color: var(--scoped-hover-bg);
            z-index: 1;
          }

          /* --- MATERIAL --- */
          .v-btn-group-material .v-btn-group-item {
            color: var(--scoped-bg);
            border: 1px solid rgba(0,0,0,0.1);
            background: rgba(0,0,0,0.02);
          }
          .v-btn-group-material.v-btn-group-dark .v-btn-group-item { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }
          .v-btn-group-material.v-btn-group-horizontal > *:not(:first-child) { margin-left: -1px; }
          .v-btn-group-material.v-btn-group-vertical > *:not(:first-child) { margin-top: -1px; margin-left: 0; }
          .v-btn-group-material .v-btn-group-item:hover { background-color: rgba(0,0,0,0.05); }
          .v-btn-group-material .v-btn-group-item[data-state="on"] {
            background-color: var(--scoped-bg);
            color: var(--scoped-text);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
            border-color: var(--scoped-bg);
            z-index: 1;
          }
          
          .v-btn-group-material.v-btn-group-dark .v-btn-group-item[data-state="on"] {
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
          }

          /* --- DYNAMIC BORDER RADIUS LOGIC --- */
          .v-btn-group-horizontal > .v-btn-group-item:first-child,
          .v-btn-group-horizontal > div:first-child > .v-btn-group-item { border-radius: var(--btn-group-radius) 0 0 var(--btn-group-radius); }
          
          .v-btn-group-horizontal > .v-btn-group-item:last-child,
          .v-btn-group-horizontal > div:last-child > .v-btn-group-item { border-radius: 0 var(--btn-group-radius) var(--btn-group-radius) 0; }
          
          .v-btn-group-vertical > .v-btn-group-item:first-child,
          .v-btn-group-vertical > div:first-child > .v-btn-group-item { border-radius: var(--btn-group-radius) var(--btn-group-radius) 0 0; }
          
          .v-btn-group-vertical > .v-btn-group-item:last-child,
          .v-btn-group-vertical > div:last-child > .v-btn-group-item { border-radius: 0 0 var(--btn-group-radius) var(--btn-group-radius); }

          /* --- NEUMORPHIC --- */
          .v-btn-group-neumorphic { gap: 8px; background: transparent; }
          .v-btn-group-neumorphic .v-btn-group-item {
            color: var(--scoped-text);
            border-radius: var(--btn-group-radius, 12px);
            box-shadow: 6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.8);
          }
          .v-btn-group-neumorphic.v-btn-group-dark .v-btn-group-item {
            box-shadow: 6px 6px 12px rgba(0,0,0,0.5), -6px -6px 12px rgba(255,255,255,0.05);
          }
          .v-btn-group-neumorphic .v-btn-group-item:hover { opacity: 0.7; }
          .v-btn-group-neumorphic .v-btn-group-item:active:not(:disabled) {
            opacity: 1;
            box-shadow: inset 4px 4px 8px rgba(0,0,0,0.15), inset -4px -4px 8px rgba(255,255,255,0.7);
          }
          .v-btn-group-neumorphic.v-btn-group-dark .v-btn-group-item:active:not(:disabled) {
            box-shadow: inset 4px 4px 8px rgba(0,0,0,0.6), inset -4px -4px 8px rgba(255,255,255,0.05);
          }
          .v-btn-group-neumorphic .v-btn-group-item[data-state="on"] {
            opacity: 1;
            box-shadow: inset 4px 4px 8px rgba(0,0,0,0.15), inset -4px -4px 8px rgba(255,255,255,0.7);
          }
          .v-btn-group-neumorphic.v-btn-group-dark .v-btn-group-item[data-state="on"] {
            box-shadow: inset 4px 4px 8px rgba(0,0,0,0.6), inset -4px -4px 8px rgba(255,255,255,0.05);
          }

          /* --- SKEUOMORPHIC --- */
          .v-btn-group-skeuomorphic { gap: 2px; }
          .v-btn-group-skeuomorphic .v-btn-group-item {
            background-color: var(--scoped-bg);
            background-image: linear-gradient(to top, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.8) 100%);
            border: 1px solid rgba(0,0,0,0.2);
            color: var(--scoped-text);
            text-shadow: 0 1px rgba(255,255,255,0.6);
            box-shadow: 0 4px 3px 1px rgba(255,255,255,0.8), 0 6px 8px rgba(0,0,0,0.15), 0 -4px 4px rgba(0,0,0,0.05), 0 -6px 4px rgba(255,255,255,0.9), inset 0 0 3px 0 rgba(0,0,0,0.15);
          }
          .v-btn-group-skeuomorphic.v-btn-group-dark .v-btn-group-item {
            background-image: linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 100%);
            border-color: rgba(255,255,255,0.1);
            text-shadow: 0 1px rgba(0,0,0,0.8);
            box-shadow: 0 4px 3px 1px rgba(255,255,255,0.05), 0 6px 8px rgba(0,0,0,0.5), 0 -4px 4px rgba(0,0,0,0.3), 0 -6px 4px rgba(255,255,255,0.05), inset 0 0 3px 0 rgba(0,0,0,0.5);
          }
          .v-btn-group-skeuomorphic.v-btn-group-horizontal .v-btn-group-item:first-child { border-radius: 30px 0 0 30px; }
          .v-btn-group-skeuomorphic.v-btn-group-horizontal .v-btn-group-item:last-child { border-radius: 0 30px 30px 0; }
          .v-btn-group-skeuomorphic .v-btn-group-item:hover { opacity: 0.9; }
          .v-btn-group-skeuomorphic .v-btn-group-item:active:not(:disabled) {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.8) 100%);
            box-shadow: 0 2px 2px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.15), inset 0 0 5px 3px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.15);
            transform: translateY(2px);
          }
          .v-btn-group-skeuomorphic.v-btn-group-dark .v-btn-group-item:active:not(:disabled) {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 100%);
            box-shadow: 0 2px 2px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.5), inset 0 0 5px 3px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.5);
          }
          .v-btn-group-skeuomorphic .v-btn-group-item[data-state="on"] {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.8) 100%);
            box-shadow: 0 2px 2px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.15), inset 0 0 5px 3px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.15);
            transform: translateY(2px);
          }
          .v-btn-group-skeuomorphic.v-btn-group-dark .v-btn-group-item[data-state="on"] {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 100%);
            box-shadow: 0 2px 2px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.5), inset 0 0 5px 3px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.5);
          }
        `}} />
        
        <div 
          id={id}
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role="group"
          aria-label={ariaLabel}
          aria-orientation={orientation}
          className={`v-btn-group v-btn-group-${design} v-btn-group-${orientation} ${themeClass} ${className}`}
          style={customStyles}
          {...props}
        >
          {safeChildren}
        </div>
      </>
    </ButtonGroupContext.Provider>
  );
});
ButtonGroupRoot.displayName = "ButtonGroup.Root";

/**
 * @component ButtonGroup.Item
 * @description Individual segmented button. Consumes Context from ButtonGroup.Root to evaluate active states.
 */
const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(({
  id,
  value,
  asChild = false,
  className = "",
  disabled,
  onHover,
  onLongClick,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onMouseEnter,
  children,
  ...props
}, ref): JSX.Element => {
  const context = useContext(ButtonGroupContext);
  if (!context) throw new Error("ButtonGroup.Item must be used within a ButtonGroup.Root");

  const { selectedValues, onItemSelect, multiselect, readOnly, design, animate, animation } = context;
  const isSelected = selectedValues.includes(value);
  const isDisabled = disabled || readOnly;
  const filterId = useId();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressStart = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (onLongClick && !isDisabled) {
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
    if (onHover && !isDisabled) onHover(e);
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) onItemSelect(value);
    if (onClick) onClick(e);
  };

  const Comp = asChild ? Slot : "button";

  if (animate && animation === 'bubble' && (design === 'material' || design === 'outline')) {
    return (
      <div className="mito-btn-bubble-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="mito-btn-bubble-svg">
          <defs>
            <filter id={`goo-${filterId}`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <Comp
          id={id}
          ref={ref}
          type="button"
          role={multiselect ? "checkbox" : "radio"}
          aria-checked={isSelected}
          aria-pressed={isSelected}
          data-state={isSelected ? "on" : "off"}
          disabled={isDisabled}
          className={`v-btn-group-item mito-btn-anim-bubble ${className}`}
          style={{ filter: `url('#goo-${filterId}')` }}
          onClick={handleClick}
          {...sharedEventProps}
          {...props}
        >
          {children}
          <span className="mito-btn-bubble-effect-container">
            <span className="mito-bubble-circle top-left"></span>
            <span className="mito-bubble-circle top-left"></span>
            <span className="mito-bubble-circle top-left"></span>
            <span className="mito-bubble-effect-core"></span>
            <span className="mito-bubble-circle bottom-right"></span>
            <span className="mito-bubble-circle bottom-right"></span>
            <span className="mito-bubble-circle bottom-right"></span>
          </span>
        </Comp>
      </div>
    );
  }

  if (animate && animation === 'prism' && (design === 'material' || design === 'outline')) {
    return (
      <div className="mito-btn-prism-wrapper">
        <Comp
          id={id}
          ref={ref}
          type="button"
          role={multiselect ? "checkbox" : "radio"}
          aria-checked={isSelected}
          aria-pressed={isSelected}
          data-state={isSelected ? "on" : "off"}
          disabled={isDisabled}
          className={`v-btn-group-item mito-btn-anim-prism ${className}`}
          onClick={handleClick}
          {...sharedEventProps}
          {...props}
        >
          <div className="mito-btn-prism-inner">
            <span className="mito-btn-prism-placeholder" aria-hidden="true">
              {children}
            </span>
            <span className="mito-btn-prism-face mito-btn-prism-front">
              {children}
            </span>
            <span className="mito-btn-prism-face mito-btn-prism-top">
              {children}
            </span>
          </div>
        </Comp>
      </div>
    );
  }

  return (
    <Comp
      id={id}
      ref={ref}
      type="button"
      role={multiselect ? "checkbox" : "radio"}
      aria-checked={isSelected}
      aria-pressed={isSelected}
      data-state={isSelected ? "on" : "off"}
      disabled={isDisabled}
      className={`v-btn-group-item ${className}`}
      onClick={handleClick}
      {...sharedEventProps}
      {...props}
    >
      {children}
    </Comp>
  );
});
ButtonGroupItem.displayName = "ButtonGroup.Item";

export const ButtonGroup = {
  Root: ButtonGroupRoot,
  Item: ButtonGroupItem,
};