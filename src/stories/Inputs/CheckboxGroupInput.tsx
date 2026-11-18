"use client";

import React, { useRef, useState, useEffect, type JSX, useId, useContext } from "react";
import { getIn, type FormikContextType, FormikContext } from "formik";
import { Slot } from '@radix-ui/react-slot';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type InputOption, adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { sharedInputStyles } from "./types";
import { type InputDesign } from "./Input";

/**
 * @interface CheckboxGroupProps
 * @description Strongly-typed attributes mapping Formik or standalone state to a multi-selection checkbox array.
 * Optimized for MCP context-injection to ensure flawless conditional logic in complex pipelines.
 */
export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 
   * @description Unique identifier mapping the input group to its Formik state and DOM label. 
   * @required
   */
  alias: string;
  /** 
   * @description Array of structured objects determining the available checkbox selections. 
   * @required
   */
  options: InputOption[];
  /** 
   * @description Text rendered above the checkbox group or floating over the fieldset border.
   */
  inputLabel?: string;
  /** 
   * @description Directional flow of the checkbox layout grid. 
   * @default 'row' 
   */
  direction?: 'row' | 'column';
  /** 
   * @description Explicit CSS Grid template column definitions (e.g. "1fr 1fr"). Overrides direction default.
   */
  columns?: string;
  /** 
   * @description Toggles the interactive floating label animation (primarily used with the 'outline' variant fieldset).
   * @default false
   */
  floatingLabel?: boolean;
  /**
   * @description The core architectural design variant of the checkboxes.
   * - `material`: Minimalist with vibrant color fill animations.
   * - `outline`: Crisp bordered aesthetic.
   * - `neumorphic`: Soft, extruded physical surface utilizing inset shadows.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical input well.
   * @default 'outline'
   */
  design?: InputDesign;
  /** 
   * @description Optional icon node rendered inside the group header or label. 
   */
  icon?: React.ReactNode;
  /** 
   * @description Determines if the icon is placed on the left (leading) or right (trailing) of the label.
   * @default "left"
   */
  iconPosition?: 'left' | 'right';
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
   * @description Highlight color applied to the active/checked borders and backgrounds. 
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
   * @default false
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
   * @description External fallback state value array for standalone non-Formik setups.
   */
  value?: string[];
  /** 
   * @description If true, merges component DOM into the immediate child via Radix Slot. 
   * @default false 
   */
  asChild?: boolean;
  /** 
   * @description Standalone array value callback for external state management. 
   */
  onChange?: (value: string[]) => void;
  /** 
   * @description Yields the complete InputOption object and its new checked state when toggled, allowing access to injected tags/scores.
   */
  onOptionChange?: (option: InputOption, isChecked: boolean) => void;
}

/**
 * @component CheckboxGroupInput
 * @description Master SSR-safe multi-selection array mapped to strict form states. Supports Neumorphic ambient-background matching, dynamic Formik injection, and global dark mode token overrides.
 */
export const CheckboxGroupInput = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(({
  alias,
  options = [],
  inputLabel,
  floatingLabel = false,
  direction = 'row',
  columns,
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
  width = 12,
  newRow,
  readOnly,
  isHinted,
  hintText,
  hintUrl,
  errorText,
  neuIntensity = 1,
  className = "",
  style,
  formikContext,
  value,
  asChild = false,
  onChange,
  onOptionChange,
  ...props
}, _ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isFocused, setIsFocused] = useState(false);
  const internalId = useId();

  const fallbackContext = useContext(FormikContext) as FormikContextType<any> | undefined;
  const activeContext = formikContext || fallbackContext;
  
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = activeContext !== undefined && typeof activeContext.setFieldValue === 'function';
  const fieldValue = isFormik ? getIn(activeContext!.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext!.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext!.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;
  const currentValues = (Array.isArray(fieldValue) ? fieldValue : []) as string[];
  const hasValue = currentValues.length > 0;
  const isFloating = floatingLabel && (isFocused || hasValue);
  isFloating;

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

  // Update handler to receive the full InputOption object
  const handleCheckedChange = (checked: boolean, opt: InputOption) => {
    if (readOnly) return;
    
    const val = String(opt.optionvalue);
    let newValues = [...currentValues];
    
    if (checked) {
      newValues.push(val);
    } else {
      newValues = newValues.filter(v => String(v) !== val);
    }
    
    if (isFormik) {
      activeContext.setFieldValue(alias, newValues);
      setTimeout(() => activeContext.setFieldTouched(alias, true, false), 0);
    }
    
    if (onChange) onChange(newValues);
    if (onOptionChange) onOptionChange(opt, checked); // <-- Fire the new callback
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

  const gridTemplateColumns = columns || (direction === 'row' ? 'repeat(auto-fit, minmax(140px, 1fr))' : '1fr');
  const Component = asChild ? Slot : "div";

  return (
    <Column span={width} newLine={newRow}>
      <Component 
        ref={containerRef}
        className={`mito-input-wrapper ${themeClass} ${className}`}
        style={customStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
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

          .mito-input-label-static {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--scoped-text);
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.35rem;
          }

          .mito-cb-grid {
            display: grid;
            gap: 12px;
            width: 100%;
            position: relative;
            padding: ${floatingLabel ? '16px 12px 12px 12px' : '0'};
            border-radius: 8px;
            border: ${floatingLabel ? '1px solid var(--scoped-border)' : 'none'};
            transition: all 0.3s ease;
          }
          .mito-cb-grid[data-error="true"] { border-color: var(--scoped-error); }
          .mito-cb-grid:focus-within { border-color: ${floatingLabel ? 'var(--scoped-active)' : 'transparent'}; }

          .mito-cb-floating-label {
            position: absolute;
            left: 10px;
            top: -10px;
            font-size: 0.75rem;
            color: var(--scoped-placeholder);
            background-color: var(--scoped-bg);
            padding: 0 4px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: color 0.3s ease;
            pointer-events: none;
          }
          .mito-cb-grid:focus-within .mito-cb-floating-label { color: var(--scoped-active); }
          .mito-cb-grid[data-error="true"] .mito-cb-floating-label { color: var(--scoped-error); }

          .mito-cb-item {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: ${readOnly ? 'default' : 'pointer'};
            font-size: 0.875rem;
            color: var(--scoped-text);
            user-select: none;
            position: relative;
          }

          /* Native Checkbox Visually Hidden */
          .mito-cb-native {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
            margin: 0;
          }

          /* Base Visual Box */
          .mito-cb-box {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s ease;
            box-sizing: border-box;
          }
          .mito-cb-native:focus-visible + .mito-cb-box { outline: 2px solid var(--scoped-active); outline-offset: 2px; }
          .mito-cb-native:disabled + .mito-cb-box { cursor: default; filter: grayscale(1); opacity: 0.6; }

          /* Outline Design */
          .mito-cb-box-outline {
            width: 20px; height: 20px;
            border-radius: 4px;
            border: 1px solid var(--scoped-border);
            background-color: var(--scoped-bg);
            color: transparent;
          }
          .mito-cb-native:checked + .mito-cb-box-outline {
            background-color: var(--scoped-active);
            border-color: var(--scoped-active);
            color: #ffffff;
          }

          /* Material Design */
          .mito-cb-box-material {
            width: 20px; height: 20px;
            border-radius: 2px;
            border: 2px solid var(--scoped-border);
            background-color: transparent;
            color: transparent;
          }
          .mito-cb-native:checked + .mito-cb-box-material {
            background-color: var(--scoped-active);
            border-color: var(--scoped-active);
            color: #ffffff;
          }

          /* Neumorphic Design */
          .mito-cb-box-neumorphic {
            width: 24px; height: 24px;
            border-radius: 6px;
            background-color: var(--mito-input-bg-env);
            box-shadow: 2px 2px 5px var(--mito-input-shadow-dark), -2px -2px 5px var(--mito-input-shadow-light);
            color: transparent;
            border: 1px solid transparent;
          }
          .mito-cb-native:checked + .mito-cb-box-neumorphic {
            box-shadow: inset 2px 2px 4px var(--mito-input-shadow-dark), inset -2px -2px 4px var(--mito-input-shadow-light);
            color: var(--scoped-active);
          }

          /* Skeuomorphic Design */
          .mito-cb-box-skeuomorphic {
            width: 20px; height: 20px;
            border-radius: 4px;
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.3);
            background-color: var(--mito-input-bg-env);
            color: transparent;
          }
          .mito-cb-native:checked + .mito-cb-box-skeuomorphic {
            background-color: var(--scoped-active);
            color: #ffffff;
          }

          /* Validation Text */
          .mito-input-error-text {
            font-size: 0.75rem;
            color: var(--scoped-error);
            margin-top: 8px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
            animation: mito-fade-in 0.3s ease;
          }
          @keyframes mito-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        `}} />
        
        {inputLabel && !floatingLabel && (
          <div className="mito-input-label-static" id={`${alias}-label`}>
            {icon && iconPosition === 'left' && <span style={{ color: 'var(--scoped-placeholder)' }}>{icon}</span>}
            {inputLabel}
            {icon && iconPosition === 'right' && <span style={{ color: 'var(--scoped-placeholder)' }}>{icon}</span>}
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
          </div>
        )}

        <div 
          className="mito-cb-grid" 
          style={{ gridTemplateColumns }}
          role="group" 
          aria-labelledby={inputLabel && !floatingLabel ? `${alias}-label` : undefined}
          data-error={hasError}
        >
          {inputLabel && floatingLabel && (
            <div className="mito-cb-floating-label">
              {icon && iconPosition === 'left' && icon}
              {inputLabel}
              {icon && iconPosition === 'right' && icon}
            </div>
          )}

          {options.map((opt, idx) => {
            const isChecked = currentValues.some(val => String(val) === String(opt.optionvalue));
            const itemId = `${alias}-opt-${opt.optionid || idx}-${internalId}`;
            return (
              <label key={opt.optionid || idx} htmlFor={itemId} className="mito-cb-item">
                <input 
                  type="checkbox"
                  id={itemId}
                  name={alias}
                  value={String(opt.optionvalue)}
                  checked={isChecked}
                  disabled={readOnly}
                  onChange={(e) => handleCheckedChange(e.target.checked, opt)}
                  className="mito-cb-native"
                  aria-invalid={hasError}
                />
                <div className={`mito-cb-box mito-cb-box-${design}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: isChecked ? 1 : 0, transition: 'opacity 0.2s' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>{opt.text}</span>
              </label>
            );
          })}
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="mito-input-error-text" role="alert">
            <Icon name="error" width="12" height="12" aria-hidden="true" />
            {typeof displayError === 'string' ? displayError : "Selection required"}
          </span>
        )}
      </Component>
    </Column>
  );
});

CheckboxGroupInput.displayName = 'CheckboxGroupInput';