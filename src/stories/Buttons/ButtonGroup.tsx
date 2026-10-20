"use client";

import React, { useRef, useState, useEffect, useMemo, createContext, useContext, type JSX } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useFormikContext, getIn } from 'formik';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import type { BaseInputProps } from "../../utils/types";


export interface ButtonGroupRootProps extends BaseInputProps {
  /** Enables selection of multiple buttons concurrently. @default false */
  multiselect?: boolean;
  /** Layout direction of the button group. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. @default 1 */
  neuIntensity?: number;
  /** Accessible label for screen readers. @default "Button group" */
  ariaLabel?: string;
  /** React children, typically expected to be `ButtonGroup.Item` components. */
  children: React.ReactNode;
}

export interface ButtonGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The specific value this button represents in the form state. */
  value: string | number;
  /** If true, merges props onto the immediate child instead of wrapping it in a `<button>`. @default false */
  asChild?: boolean;
}

interface ButtonGroupContextValue {
  name?: string;
  design: 'material' | 'outline' | 'neumorphic';
  orientation: 'horizontal' | 'vertical';
  multiselect: boolean;
  selectedValues: (string | number)[];
  hasError: boolean;
  readOnly?: boolean;
  onItemSelect: (value: string | number) => void;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);


/**
 * @component ButtonGroup.Root
 * @description State-managing wrapper for ButtonGroup. Automatically syncs with Formik or standard controlled state.
 * Evaluates Neumorphic lighting dynamically based on the nearest DOM parent background.
 */
const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(({
  alias,
  design = 'outline',
  orientation = 'horizontal',
  multiselect = false,
  elevation = 3,
  surface = 'flat',
  neuIntensity = 1,
  darkModeColors,
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

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  const isFormik = Boolean(activeContext);

  const fieldValue = isFormik && alias ? getIn(activeContext.values, alias) : value;
  const fieldTouched = isFormik && alias ? getIn(activeContext.touched, alias) : null;
  const fieldError = isFormik && alias ? getIn(activeContext.errors, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);

  const selectedValues: (string | number)[] = useMemo(() => {
    if (!fieldValue) return [];
    if (Array.isArray(fieldValue)) return fieldValue;
    return [fieldValue];
  }, [fieldValue]);

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = getNearestParentBackground(containerRef.current.parentElement);
      const dist = elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -20 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 20 * neuIntensity);

      setNeuVars({
        '--neu-bg': parentBg,
        '--neu-shadow-dark': shadowDark,
        '--neu-shadow-light': shadowLight,
        '--neu-dist': `${dist}px`,
        '--neu-blur': `${blur}px`,
        '--ui-brand-color': darkModeColors?.light || 'var(--blue-9)',
        '--ui-brand-dark': darkModeColors?.dark || 'var(--blue-10)',
      } as React.CSSProperties);
    }
  }, [design, elevation, neuIntensity, darkModeColors]);

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

  const contextValue: ButtonGroupContextValue = {
    name: alias,
    design,
    orientation,
    multiselect,
    selectedValues,
    hasError,
    readOnly,
    onItemSelect: handleSelect,
  };

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div 
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="group"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={`v-btn-group v-btn-group-${design} v-btn-group-${orientation} ${className}`}
        style={{
          display: 'inline-flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          ...neuVars,
          ...style
        }}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .v-btn-group {
            border-radius: 6px;
            isolation: isolate;
          }
          
          /* Neumorphic Core Structure */
          .v-btn-group-neumorphic {
            background-color: var(--neu-bg);
            border-radius: 12px;
            padding: 4px;
            gap: 4px;
            box-shadow: inset var(--neu-dist) var(--neu-dist) var(--neu-blur) var(--neu-shadow-dark), 
                        inset calc(var(--neu-dist) * -1) calc(var(--neu-dist) * -1) var(--neu-blur) var(--neu-shadow-light);
          }

          /* General Item Structure */
          .v-btn-group-item {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 16px;
            font-weight: 500;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }
          
          .v-btn-group-item:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          /* Outline Design Collapsing Borders */
          .v-btn-group-outline .v-btn-group-item {
            background: transparent;
            border: 1px solid var(--gray-7);
            color: var(--gray-11);
          }
          .v-btn-group-outline.v-btn-group-horizontal .v-btn-group-item:not(:first-child) {
            margin-left: -1px;
          }
          .v-btn-group-outline.v-btn-group-vertical .v-btn-group-item:not(:first-child) {
            margin-top: -1px;
          }
          .v-btn-group-outline .v-btn-group-item:first-child {
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
          }
          .v-btn-group-outline .v-btn-group-item:last-child {
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
          }
          .v-btn-group-outline .v-btn-group-item[data-state="on"] {
            background-color: var(--ui-brand-color, var(--blue-9));
            border-color: var(--ui-brand-color, var(--blue-9));
            color: white;
            z-index: 1; /* Elevate above negative margins */
          }

          /* Material Design */
          .v-btn-group-material {
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
          }
          .v-btn-group-material .v-btn-group-item {
            background: var(--color-surface);
            border: none;
            color: var(--gray-11);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .v-btn-group-material .v-btn-group-item:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
          .v-btn-group-material .v-btn-group-item:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
          .v-btn-group-material .v-btn-group-item[data-state="on"] {
            background-color: var(--gray-4);
            color: var(--ui-brand-color, var(--blue-9));
            font-weight: 600;
          }

          /* Neumorphic Buttons */
          .v-btn-group-neumorphic .v-btn-group-item {
            background-color: transparent;
            border: none;
            border-radius: 8px;
            color: var(--gray-11);
          }
          .v-btn-group-neumorphic .v-btn-group-item:hover:not(:disabled) {
            box-shadow: var(--neu-dist) var(--neu-dist) var(--neu-blur) var(--neu-shadow-dark), 
                        calc(var(--neu-dist) * -1) calc(var(--neu-dist) * -1) var(--neu-blur) var(--neu-shadow-light);
          }
          .v-btn-group-neumorphic .v-btn-group-item[data-state="on"] {
            background-color: var(--neu-bg);
            color: var(--ui-brand-color, var(--blue-9));
            box-shadow: var(--neu-dist) var(--neu-dist) var(--neu-blur) var(--neu-shadow-dark), 
                        calc(var(--neu-dist) * -1) calc(var(--neu-dist) * -1) var(--neu-blur) var(--neu-shadow-light);
            font-weight: 600;
          }

          /* Focus Visibility */
          .v-btn-group-item:focus-visible {
            outline: 2px solid var(--ui-brand-color, var(--blue-9));
            outline-offset: -2px;
            z-index: 2;
          }
        `}} />
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
});
ButtonGroupRoot.displayName = "ButtonGroup.Root";


/**
 * @component ButtonGroup.Item
 * @description Individual segmented button. Consumes Context from ButtonGroup.Root to evaluate active states.
 * Supports Radix `asChild` delegation.
 */
const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(({
  value,
  asChild = false,
  className = "",
  disabled,
  onClick,
  ...props
}, ref): JSX.Element => {
  const context = useContext(ButtonGroupContext);

  if (!context) {
    throw new Error("ButtonGroup.Item must be used within a ButtonGroup.Root");
  }

  const { selectedValues, onItemSelect, multiselect, readOnly } = context;
  const isSelected = selectedValues.includes(value);
  const isDisabled = disabled || readOnly;

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type="button"
      role={multiselect ? "checkbox" : "radio"}
      aria-checked={isSelected}
      aria-pressed={isSelected} // Extra coverage for button semantics
      data-state={isSelected ? "on" : "off"}
      disabled={isDisabled}
      className={`v-btn-group-item ${className}`}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled) {
          onItemSelect(value);
        }
        if (onClick) onClick(e);
      }}
      {...props}
    />
  );
});
ButtonGroupItem.displayName = "ButtonGroup.Item";


export const ButtonGroup = {
  Root: ButtonGroupRoot,
  Item: ButtonGroupItem,
};