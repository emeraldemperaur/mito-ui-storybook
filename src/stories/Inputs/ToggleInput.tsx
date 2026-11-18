"use client";

import React, { useRef, useState, useEffect, type JSX, useId, useContext } from "react";
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { FormikContext, getIn, type FormikContextType } from 'formik';
import { Slot } from '@radix-ui/react-slot';
import * as TooltipPrimitive from '@radix-ui/react-tooltip'; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Column } from "../Layout/Column";
import { Icon } from "../../components/icons/Icons";
import { sharedInputStyles } from "./types";
import { type InputDesign } from "./Input";

/**
 * @interface ToggleProps
 * @description Strongly-typed attributes mapping Formik or standalone boolean state to a tactile multi-variant toggle switch.
 */
export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultValue'> {
  /** 
   * @description Unique identifier mapping the input to its Formik state and DOM label. 
   * @required
   */
  alias: string;
  /** 
   * @description Option to specify an Icon name for Toggle input field. 
   * @default "layers" 
   */
  icon?: React.ComponentProps<typeof Icon>['name'];
  /** 
   * @description Determines if the icon is placed on the left (leading) or right (trailing) of the label.
   * @default "left"
   */
  iconPosition?: 'left' | 'right';
  /** 
   * @description Text rendered adjacent to the toggle switch.
   */
  inputLabel?: string;
  /**
   * @description The core architectural design variant of the toggle switch.
   * - `material`: Minimalist track with vibrant inset thumb.
   * - `outline`: Crisp bordered track.
   * - `neumorphic`: Soft, extruded physical surface utilizing inset shadows.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical sliding switch.
   * @default 'outline'
   */
  design?: InputDesign;
  /** 
   * @description Toggles the interactive floating label animation (primarily used with outline/material variants).
   * @default false
   */
  floatingLabel?: boolean;
  /** 
   * @description Forces the component into dark mode, overriding system or parent theme contexts. 
   */
  darkMode?: boolean;
  /** 
   * @description Legacy color override object. Prefer `activeColor` for standard implementations.
   */
  darkModeColors?: { light: string; dark: string };
  /** 
   * @description Dynamic base background color for light mode. Injected as `--mito-input-bg`.
   */
  backgroundColor?: string;
  /** 
   * @description Dynamic base background color specifically for dark mode contexts.
   */
  darkBackgroundColor?: string;
  /** 
   * @description Standard text and icon color for light mode. Injected as `--mito-input-text`.
   */
  textColor?: string;
  /** 
   * @description Standard text and icon color specifically for dark mode contexts.
   */
  darkTextColor?: string;
  /** 
   * @description Validation failure text color for light mode. Injected as `--mito-input-error`.
   */
  errorTextColor?: string;
  /** 
   * @description Validation failure text color for dark mode. Injected as `--mito-input-error-dark`.
   */
  darkErrorTextColor?: string;
  /** 
   * @description Highlight color applied to the active 'on' state of the toggle track. 
   */
  activeColor?: string;
  /** 
   * @description Font family override to match specific UI brand primitives. 
   */
  fontFamily?: string;
  /** 
   * @description Toggles an active hint tooltip next to the label. 
   */
  isHinted?: boolean;
  /** 
   * @description The informational text displayed inside the hint tooltip. 
   */
  hintText?: string;
  /** 
   * @description Optional URL to open when the hint tooltip icon is clicked. 
   */
  hintUrl?: string;
  /** 
   * @description Explicit error message string. Overrides Formik validation errors if provided. 
   */
  errorText?: string;
  /** 
   * @description Viewport column width configuration value (1 to 12). 
   * @default 12 
   */
  width?: number;
  /** 
   * @description Forces container layouts to break downward onto a fresh structural row line. 
   */
  newRow?: boolean;
  /** 
   * @description Locks the component to prevent user interaction, rendering a disabled visual state.
   */
  readOnly?: boolean;
  /** 
   * @description Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. 
   * @default 1 
   */
  neuIntensity?: number;
  /** 
   * @description Specific custom style class selector appended to the root container. 
   */
  className?: string;
  /** 
   * @description Inline modification style rules object. 
   */
  style?: React.CSSProperties;
  /** 
   * @description Explicit Formik context object injected for nested step fields. 
   */
  formikContext?: FormikContextType<any>;
  /** 
   * @description External fallback state boolean value for standalone non-Formik setups.
   */
  value?: boolean;
  /** 
   * @description Delegates rendering to the immediate child element via Radix Slot. 
   */
  asChild?: boolean;
  /** 
   * @description Unmasked raw boolean value callback for external state management. 
   */
  onChange?: (value: boolean) => void;
}

/**
 * @component ToggleInput
 * @description Unified SSR-safe toggle switch. Replaces traditional push-buttons with sliding mechanical switches across Material, Outline, Neumorphic, and Skeuomorphic variants.
 */
export const ToggleInput = React.forwardRef<HTMLButtonElement, ToggleProps>(({
  alias, 
  readOnly, 
  width = 12, 
  inputLabel,
  floatingLabel = false,
  design = 'outline',
  icon,
  iconPosition = 'left',
  darkMode = false,
  darkModeColors,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  errorTextColor,
  darkErrorTextColor,
  activeColor,
  fontFamily,
  style,
  newRow,
  isHinted,
  hintText,
  hintUrl, 
  errorText,
  neuIntensity = 1,
  className = "",
  formikContext,
  value,
  asChild,
  onChange,
  ...props
}, ref): JSX.Element => {
  
  const fallbackContext = useContext(FormikContext) as FormikContextType<any> | undefined;
  const activeContext = formikContext || fallbackContext;
  const internalId = useId();

  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = activeContext !== undefined && typeof activeContext.setFieldValue === 'function';
  const fieldValue = isFormik ? getIn(activeContext!.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext!.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext!.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;
  const isActive = Boolean(fieldValue);

  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties & Record<string, any>>({});
  const themeClass = darkMode ? 'mito-input-dark' : '';
  const resolvedBrandColor = activeColor || darkModeColors?.light || '#2563eb';

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement) || '#e0e5ec';
      const shadowDark = adjustColor(parentBg, -20 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 20 * neuIntensity);
      
      setNeuVars({
        '--mito-input-bg-env': parentBg,
        '--mito-input-shadow-dark': shadowDark, 
        '--mito-input-shadow-light': shadowLight,
      } as React.CSSProperties);
    }
  }, [design, backgroundColor, neuIntensity]);

  const handleToggle = (val: boolean) => {
    if (!readOnly) {
      if (isFormik) {
        activeContext.setFieldValue(alias, val);
        setTimeout(() => activeContext.setFieldTouched(alias, true, false), 0);
      }
      if (onChange) onChange(val);
    }
  };

  const customStyles = {
    ...style,
    ...neuVars,
    '--mito-input-bg': backgroundColor,
    '--mito-input-bg-dark': darkBackgroundColor || backgroundColor,
    '--mito-input-text': textColor,
    '--mito-input-text-dark': darkTextColor || textColor,
    '--mito-input-error': errorTextColor || '#ef4444',
    '--mito-input-error-dark': darkErrorTextColor || errorTextColor || '#f87171',
    '--mito-input-active': resolvedBrandColor,
    '--mito-input-font': fontFamily,
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  const inputId = `${alias}-trigger-${internalId}`;
  const Component = asChild ? Slot : "button";

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef} 
        className={`mito-input-wrapper ${themeClass} ${className}`}
        style={customStyles}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles || '' }} />
        
        <style dangerouslySetInnerHTML={{ __html: `
          .mito-input-wrapper {
            --scoped-bg: var(--mito-input-bg, #ffffff);
            --scoped-text: var(--mito-input-text, #111827);
            --scoped-placeholder: #9ca3af;
            --scoped-border: #d1d5db;
            --scoped-active: var(--mito-input-active, #2563eb);
            --scoped-error: var(--mito-input-error, #ef4444);
            --scoped-font: var(--mito-input-font, system-ui, -apple-system, sans-serif);
            
            display: flex;
            flex-direction: column;
            width: 100%;
            font-family: var(--scoped-font);
            position: relative;
            opacity: ${readOnly ? 0.7 : 1};
          }
          
          .mito-input-wrapper.mito-input-dark {
            --scoped-bg: var(--mito-input-bg-dark, #1f2937);
            --scoped-text: var(--mito-input-text-dark, #f9fafb);
            --scoped-placeholder: #6b7280;
            --scoped-border: #4b5563;
            --scoped-error: var(--mito-input-error-dark, #f87171);
          }

          .mito-toggle-layout {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 16px;
            width: fit-content;
          }

          .mito-input-label-static {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--scoped-text);
            display: flex;
            align-items: center;
            gap: 0.35rem;
            cursor: ${readOnly ? 'default' : 'pointer'};
          }

          /* --- Standard Switch Base --- */
          .mito-switch-base {
            all: unset;
            position: relative;
            cursor: pointer;
            flex-shrink: 0;
            transition: all 0.3s ease;
            box-sizing: border-box;
          }
          .mito-switch-base:disabled { cursor: default; }
          .mito-switch-base:focus-visible { outline: 2px solid var(--scoped-active); outline-offset: 2px; }
          
          /* The Thumb */
          .mito-switch-base::before {
            content: '';
            position: absolute;
            transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), background-color 0.3s ease;
          }

          /* --- Outline Design --- */
          .mito-switch-outline {
            width: 44px; height: 24px; border-radius: 12px; 
            background-color: var(--scoped-border);
          }
          .mito-switch-outline[data-state="on"] { background-color: var(--scoped-active); }
          .mito-switch-outline[data-error="true"] { background-color: var(--scoped-error); }
          
          .mito-switch-outline::before {
            width: 18px; height: 18px; border-radius: 50%; 
            top: 3px; left: 3px;
            background-color: var(--scoped-bg); 
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
          .mito-switch-outline[data-state="on"]::before { transform: translateX(20px); }

          /* --- Material Design --- */
          .mito-switch-material {
            width: 40px; height: 20px; border-radius: 10px; 
            background-color: var(--scoped-border);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
          }
          .mito-switch-material[data-state="on"] { background-color: var(--scoped-active); }
          .mito-switch-material[data-error="true"] { background-color: var(--scoped-error); }
          
          .mito-switch-material::before {
            width: 24px; height: 24px; border-radius: 50%; 
            top: -2px; left: -2px;
            background-color: var(--scoped-bg); 
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .mito-switch-material[data-state="on"]::before { transform: translateX(20px); }

          /* --- Neumorphic Design --- */
          .mito-switch-neumorphic {
            width: 50px; height: 28px; border-radius: 14px; 
            background-color: var(--mito-input-bg-env);
            box-shadow: inset 2px 2px 5px var(--mito-input-shadow-dark), inset -2px -2px 5px var(--mito-input-shadow-light);
          }
          .mito-switch-neumorphic[data-state="on"] { background-color: var(--scoped-active); }
          .mito-switch-neumorphic[data-error="true"] { background-color: var(--scoped-error); }
          
          .mito-switch-neumorphic::before {
            width: 22px; height: 22px; border-radius: 50%; 
            top: 3px; left: 3px;
            background-color: var(--mito-input-bg-env); 
            box-shadow: 2px 2px 4px rgba(0,0,0,0.2), -1px -1px 3px rgba(255,255,255,0.7);
          }
          .mito-switch-neumorphic[data-state="on"]::before { transform: translateX(22px); }

          /* --- Skeuomorphic Design --- */
          .mito-switch-skeuomorphic {
            width: 44px; height: 24px; border-radius: 12px;
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.3);
          }
          .mito-switch-skeuomorphic[data-state="on"] { background-color: var(--scoped-active); }
          .mito-switch-skeuomorphic[data-error="true"] { background-color: var(--scoped-error); }
          
          .mito-switch-skeuomorphic::before {
            width: 18px; height: 18px; border-radius: 50%; 
            top: 2px; left: 2px;
            background-color: var(--mito-input-bg-env); 
            background-image: linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0.1) 100%);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,1);
          }
          .mito-switch-skeuomorphic[data-state="on"]::before { transform: translateX(20px); }

          /* Validation Text */
          .mito-input-error-text {
            font-size: 0.75rem;
            color: var(--scoped-error);
            margin-top: 6px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
            animation: mito-fade-in 0.3s ease;
          }
          @keyframes mito-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        `}} />
        
        <div className="mito-toggle-layout">
          {inputLabel ? (
            <label className="mito-input-label-static" id={`${alias}-label`} htmlFor={inputId}>
              {/* Icon placed left of label */}
              {icon && iconPosition === 'left' && (
                <Icon name={icon} height="16" width="16" style={{ color: 'var(--scoped-placeholder)' }} />
              )}
              
              {inputLabel}
              
              {/* Icon placed right of label */}
              {icon && iconPosition === 'right' && (
                <Icon name={icon} height="16" width="16" style={{ color: 'var(--scoped-placeholder)' }} />
              )}

              {isHinted && (
                <TooltipPrimitive.Provider delayDuration={300}>
                  <TooltipPrimitive.Root>
                    <TooltipPrimitive.Trigger asChild>
                      <a href={hintUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto', marginLeft: '4px' }}>
                        <Icon name="questionmarkcircled" height="14" width="14" style={{ color: 'var(--scoped-placeholder)' }} />
                      </a> 
                    </TooltipPrimitive.Trigger>
                    <TooltipPrimitive.Portal>
                      <TooltipPrimitive.Content 
                        sideOffset={5} 
                        style={{ 
                          backgroundColor: darkMode ? '#374151' : '#111827', 
                          color: '#f9fafb', 
                          padding: '6px 10px', 
                          borderRadius: '4px', 
                          fontSize: '0.75rem',
                          fontFamily: 'inherit',
                          zIndex: 50
                        }}
                      >
                        {hintText || "Information"}
                        <TooltipPrimitive.Arrow style={{ fill: darkMode ? '#374151' : '#111827' }} />
                      </TooltipPrimitive.Content>
                    </TooltipPrimitive.Portal>
                  </TooltipPrimitive.Root>
                </TooltipPrimitive.Provider>
              )}
            </label>
          ) : (
            /* If no label exists, render icon independently */
            icon ? (
              <Icon 
                name={icon} 
                height="20" 
                width="20" 
                style={{ 
                  color: isActive && !readOnly ? 'var(--scoped-active)' : 'var(--scoped-placeholder)',
                  transition: 'color 0.3s ease'
                }} 
              />
            ) : <div />
          )}

          <TogglePrimitive.Root
            pressed={isActive}
            onPressedChange={handleToggle}
            name={alias}
            disabled={readOnly}
            asChild={!asChild}
          >
            <Component
              ref={ref as any}
              id={inputId}
              type="button"
              disabled={readOnly}
              data-state={isActive ? "on" : "off"}
              data-error={hasError}
              aria-invalid={hasError}
              aria-describedby={inputLabel ? `${alias}-label` : undefined}
              className={`mito-switch-base mito-switch-${design} ${className}`}
              {...(props as any)}
            />
          </TogglePrimitive.Root>
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="mito-input-error-text" role="alert">
            <Icon name="error" width="12" height="12" aria-hidden="true" />
            {typeof displayError === 'string' ? displayError : "Required field"}
          </span>
        )}
      </div>
    </Column>
  );
});

ToggleInput.displayName = 'ToggleInput';