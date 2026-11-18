"use client";

import React, { useRef, useState, useEffect, useContext, createContext, type JSX, type ReactNode, useId } from "react";
import { Slot } from '@radix-ui/react-slot';
import { FormikContext, getIn, type FormikContextType } from "formik";
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type InputOption, adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Column } from "../Layout/Column";
import { Row } from "../Layout/Row"; 
import { Icon } from "../../components/icons/Icons";
import { sharedInputStyles } from "./types";
import { type InputDesign } from "./Input";

export type TriggerType = 'toggle' | 'checkbox' | 'select';

export interface GlobalFormContextValue {
  readOnlyMode?: boolean;
  brandColor?: string;
  darkModeColors?: { light: string; dark: string };
}
export const GlobalFormContext = createContext<GlobalFormContextValue | null>(null);

/**
 * @interface ConditionalProps
 * @description Strongly-typed attributes mapping Formik or standalone state to structural DOM reveal animations.
 * Optimized for MCP context-injection to ensure flawless conditional logic in complex pipelines.
 */
export interface ConditionalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 
   * @description Unique identifier mapping the input to its Formik state and DOM label. 
   * @required
   */
  alias: string;
  /** 
   * @description The interaction modality used to trigger the conditional render. 
   * @default 'toggle' 
   */
  triggerType?: TriggerType;
  /** 
   * @description The value the field must strictly equal (`===`) to reveal the child components. 
   * @required
   */
  triggerValue: any;
  /** 
   * @description The explicit boolean value that triggers the condition.
   */
  triggerValueBool?: boolean;
  /** 
   * @description The explicit string value that triggers the condition.
   */
  triggerValueStr?: string;
  /** 
   * @description The React nodes (typically xForm Queries) to reveal when the trigger condition is met. 
   * @required
   */
  children: ReactNode;
  /** 
   * @description Text rendered alongside the toggle, checkbox, or above the select input.
   */
  inputLabel?: string;
  /** 
   * @description Explicit placeholder text shown when the `select` triggerType has no option selected. 
   * @default "Select an option" 
   */
  placeholder?: string;
  /** 
   * @description Array of structural options exclusively required if `triggerType` is 'select'. 
   */
  inputOptions?: InputOption[];
  /**
   * @description The core architectural design variant of the trigger and container well.
   * - `material`: Minimalist with vibrant gradient animations.
   * - `outline`: Crisp bordered aesthetic.
   * - `neumorphic`: Soft, extruded physical surface utilizing inset shadows.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical well.
   * @default 'outline'
   */
  design?: InputDesign;
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
   * @description Highlight color applied to the active/focused borders, toggles, and checkboxes. 
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
   * @description External fallback state value for standalone non-Formik setups.
   */
  value?: any;
  /** 
   * @description If true, merges component DOM into the immediate child via Radix Slot. 
   * @default false 
   */
  asChild?: boolean;
  /** 
   * @description Standalone value callback for external state management. 
   */
  onChange?: (value: any) => void;
}

/**
 * @component ConditionalTrigger
 * @description State-managing wrapper that evaluates Formik or external state against a triggerValue to reveal hidden form sections.
 * Supports Outline, Material, Neumorphic, and Skeuomorphic design variants with smooth DOM expansion animations.
 */
export const ConditionalTrigger = React.forwardRef<HTMLDivElement, ConditionalProps>(({
  alias,
  design = 'outline',
  triggerType = 'toggle',
  triggerValue = true,
  triggerValueBool,
  triggerValueStr,
  inputOptions = [],
  children,
  inputLabel,
  width = 12,
  newRow,
  placeholder = 'Select an option',
  readOnly,
  isHinted,
  hintText,
  hintUrl,
  errorText,
  neuIntensity = 1,
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
  className = "",
  style,
  formikContext,
  value,
  asChild = false,
  onChange,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const internalId = useId();

  const globalContext = useContext(GlobalFormContext);
  const fallbackContext = useContext(FormikContext) as FormikContextType<any> | undefined;
    const activeContext = formikContext || fallbackContext;
    
    // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
    const isFormik = activeContext !== undefined && typeof activeContext.setFieldValue === 'function';
    const fieldValue = isFormik ? getIn(activeContext!.values, alias) : value;
    const fieldError = isFormik ? getIn(activeContext!.errors, alias) : null;
    const fieldTouched = isFormik ? getIn(activeContext!.touched, alias) : null;

  const inputId = `${alias}-trigger-${internalId}`;
  const regionId = `${alias}-region-${internalId}`;
  const errorId = `${alias}-error-${internalId}`;

  const isOpen = fieldValue === triggerValue;
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;
  const isReadOnly = readOnly || globalContext?.readOnlyMode;

  const themeClass = darkMode ? 'mito-input-dark' : '';
  const resolvedBrandColor = activeColor || darkModeColors?.light || globalContext?.darkModeColors?.light || globalContext?.brandColor || '#2563eb';

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement) || '#e0e5ec';
      const shadowDark = adjustColor(parentBg, -20 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 20 * neuIntensity);

      setNeuVars({
        '--mito-input-bg-env': parentBg,
        '--mito-input-shadow-dark': shadowDark,
        '--mito-input-shadow-light': shadowLight,
        '--ui-brand-color': resolvedBrandColor,
      } as React.CSSProperties);
    } else {
      setNeuVars({ '--ui-brand-color': resolvedBrandColor } as React.CSSProperties);
    }
  }, [design, backgroundColor, neuIntensity, resolvedBrandColor]);

  const handleChange = (val: any) => {
    if (isReadOnly) return;
    if (isFormik) {
      activeContext.setFieldValue(alias, val);
      setTimeout(() => activeContext.setFieldTouched(alias, true, false), 0);
    }
    if (onChange) onChange(val);
  };

  const renderTrigger = () => {
    if (triggerType === 'checkbox') {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: isReadOnly ? 'default' : 'pointer', width: '100%' }}>
            <button 
              type="button"
              id={inputId}
              name={alias}
              disabled={isReadOnly}
              role="checkbox"
              aria-checked={fieldValue === true} 
              data-state={fieldValue === true ? "checked" : "unchecked"}
              onClick={() => handleChange(fieldValue !== true)}
              aria-expanded={isOpen}
              aria-controls={regionId}
              className={`mito-cond-checkbox mito-cond-checkbox-${design}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: fieldValue === true ? 1 : 0, transition: 'opacity 0.2s' }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <label htmlFor={inputId} style={{ cursor: isReadOnly ? 'default' : 'pointer', color: 'var(--scoped-text)', fontWeight: 'bold', fontSize: '0.875rem', flex: 1 }}>
                {inputLabel}
            </label>
          </div>
        );
    } 
    else if (triggerType === 'select') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {inputLabel && (
              <label htmlFor={inputId} style={{ color: 'var(--scoped-text)', fontWeight: 'bold', fontSize: '0.875rem' }}>
                  {inputLabel}
              </label>
            )}
            <div style={{ position: 'relative', width: '100%' }}>
              <select
                id={inputId}
                name={alias}
                disabled={isReadOnly}
                value={fieldValue !== undefined && fieldValue !== null ? String(fieldValue) : ""}
                onChange={(e) => handleChange(e.target.value)}
                aria-expanded={isOpen}
                aria-controls={regionId}
                className={`mito-cond-select mito-cond-select-${design} ${themeClass}`}
                style={{ width: '100%', color: 'var(--scoped-text)', appearance: 'none', cursor: isReadOnly ? 'default' : 'pointer' }}
              >
                <option value="" disabled hidden>{placeholder}</option>
                {inputOptions.map((inputoption, idx) => (
                  <option key={`${alias}-opt-${inputoption.optionid || idx}`} value={String(inputoption.optionvalue)}>
                    {inputoption.text}
                  </option>
                ))}
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--scoped-placeholder)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        );
    } 
    else {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <label htmlFor={inputId} style={{ cursor: isReadOnly ? 'default' : 'pointer', color: 'var(--scoped-text)', fontWeight: 'bold', fontSize: '0.875rem', flex: 1 }}>
                {inputLabel}
            </label>
            <button 
              type="button"
              id={inputId}
              name={alias}
              disabled={isReadOnly}
              role="switch"
              aria-checked={fieldValue === true} 
              data-state={fieldValue === true ? "checked" : "unchecked"}
              onClick={() => handleChange(fieldValue !== true)}
              aria-expanded={isOpen}
              aria-controls={regionId}
              className={`mito-cond-switch mito-cond-switch-${design}`}
            />
          </div>
        );
    }
  };

  const Comp = asChild ? Slot : "div";

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

  return (
    <Column span={width} newLine={newRow}>
      <Comp 
        ref={(node: HTMLDivElement | null) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={`mito-conditional-container mito-cond-container-${design} ${themeClass} ${className}`}
        style={{
          ...customStyles,
          padding: '16px',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          opacity: isReadOnly ? 0.7 : 1,
        }}
        data-state={isOpen ? "open" : "closed"}
        data-error={hasError ? "true" : "false"}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles || '' }} />
        <style dangerouslySetInnerHTML={{ __html: `
          .mito-conditional-container {
            --scoped-bg: var(--mito-input-bg, #ffffff);
            --scoped-text: var(--mito-input-text, #111827);
            --scoped-placeholder: #9ca3af;
            --scoped-border: #d1d5db;
            --scoped-active: var(--mito-input-active, #2563eb);
            --scoped-error: var(--mito-input-error, #ef4444);
            --scoped-font: var(--mito-input-font, system-ui, -apple-system, sans-serif);
            font-family: var(--scoped-font);
          }
          .mito-conditional-container.mito-input-dark {
            --scoped-bg: var(--mito-input-bg-dark, #1f2937);
            --scoped-text: var(--mito-input-text-dark, #f9fafb);
            --scoped-placeholder: #6b7280;
            --scoped-border: #4b5563;
            --scoped-error: var(--mito-input-error-dark, #f87171);
          }

          /* ------------------------- */
          /* OUTLINE DESIGN            */
          /* ------------------------- */
          .mito-cond-container-outline {
            border: 1px solid var(--scoped-border);
            background-color: var(--scoped-bg);
          }
          .mito-cond-container-outline[data-state="open"] { border-left: 4px solid var(--scoped-active); }
          .mito-cond-container-outline[data-error="true"] { border-color: var(--scoped-error); }
          .mito-cond-well-outline {
            margin-top: 16px; padding-top: 16px;
            border-top: 1px dashed var(--scoped-border);
          }
          
          /* Native Select */
          .mito-cond-select-outline { border: 1px solid var(--scoped-border); background-color: transparent; height: 40px; border-radius: 6px; padding: 0 12px; }
          .mito-cond-select-outline:focus-visible { border-color: var(--scoped-active); outline: 1px solid var(--scoped-active); }
          
          /* Switch */
          .mito-cond-switch-outline {
            all: unset; width: 44px; height: 24px; border-radius: 12px; background-color: var(--scoped-border);
            position: relative; cursor: pointer; transition: background-color 0.3s; flex-shrink: 0;
          }
          .mito-cond-switch-outline[data-state="checked"] { background-color: var(--scoped-active); }
          .mito-cond-switch-outline::before {
            content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; top: 3px; left: 3px;
            background-color: var(--scoped-bg); transition: transform 0.3s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
          .mito-cond-switch-outline[data-state="checked"]::before { transform: translateX(20px); }
          
          /* Checkbox */
          .mito-cond-checkbox-outline {
            all: unset; width: 20px; height: 20px; border-radius: 4px; border: 1px solid var(--scoped-border);
            background-color: var(--scoped-bg); display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.2s; box-sizing: border-box; color: transparent; flex-shrink: 0;
          }
          .mito-cond-checkbox-outline[data-state="checked"] { background-color: var(--scoped-active); border-color: var(--scoped-active); color: #fff; }

          /* ------------------------- */
          /* MATERIAL DESIGN           */
          /* ------------------------- */
          .mito-cond-container-material {
            background-color: transparent;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            border-left: 4px solid var(--scoped-border);
            border-radius: 8px !important;
          }
          .mito-conditional-container.mito-input-dark.mito-cond-container-material { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.4); }
          .mito-cond-container-material[data-state="open"] { border-left-color: var(--scoped-active); }
          .mito-cond-container-material[data-error="true"] { border-left-color: var(--scoped-error); }
          .mito-cond-well-material {
            margin-top: 16px; padding-top: 16px; padding-left: 8px; padding-right: 8px;
            border-top: 1px solid var(--scoped-border);
            background-color: rgba(0,0,0,0.02);
            border-radius: 0 0 8px 8px;
          }
          .mito-conditional-container.mito-input-dark .mito-cond-well-material { background-color: rgba(255,255,255,0.02); }
          
          /* Native Select */
          .mito-cond-select-material { border: none; border-bottom: 2px solid var(--scoped-border); background-color: rgba(0,0,0,0.02); border-radius: 4px 4px 0 0; height: 40px; padding: 0 12px; }
          .mito-conditional-container.mito-input-dark .mito-cond-select-material { background-color: rgba(255,255,255,0.02); }
          .mito-cond-select-material:focus-visible { border-bottom-color: var(--scoped-active); outline: none; }
          
          /* Switch */
          .mito-cond-switch-material {
            all: unset; width: 40px; height: 20px; border-radius: 10px; background-color: var(--scoped-border);
            position: relative; cursor: pointer; transition: background-color 0.3s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); flex-shrink: 0;
          }
          .mito-cond-switch-material[data-state="checked"] { background-color: var(--scoped-active); }
          .mito-cond-switch-material::before {
            content: ''; position: absolute; width: 24px; height: 24px; border-radius: 50%; top: -2px; left: -2px;
            background-color: var(--scoped-bg); transition: transform 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .mito-cond-switch-material[data-state="checked"]::before { transform: translateX(20px); background-color: var(--scoped-bg); }
          
          /* Checkbox */
          .mito-cond-checkbox-material {
            all: unset; width: 20px; height: 20px; border-radius: 2px; border: 2px solid var(--scoped-border);
            background-color: transparent; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.2s; box-sizing: border-box; color: transparent; flex-shrink: 0;
          }
          .mito-cond-checkbox-material[data-state="checked"] { background-color: var(--scoped-active); border-color: var(--scoped-active); color: #fff; }

          /* ------------------------- */
          /* NEUMORPHIC DESIGN         */
          /* ------------------------- */
          .mito-cond-container-neumorphic {
            background-color: var(--mito-input-bg-env);
            box-shadow: 6px 6px 12px var(--mito-input-shadow-dark), -6px -6px 12px var(--mito-input-shadow-light);
            border-radius: 16px !important;
            border: 1px solid transparent;
          }
          .mito-cond-container-neumorphic[data-error="true"] { border: 1px solid var(--scoped-error); }
          .mito-cond-well-neumorphic {
            margin-top: 16px; padding: 16px; border-radius: 12px;
            background-color: var(--mito-input-bg-env);
            box-shadow: inset 6px 6px 12px var(--mito-input-shadow-dark), inset -6px -6px 12px var(--mito-input-shadow-light);
          }
          
          /* Neumorphic Switch */
          .mito-cond-switch-neumorphic {
            all: unset; width: 50px; height: 28px; border-radius: 14px; background-color: var(--mito-input-bg-env);
            box-shadow: inset 2px 2px 5px var(--mito-input-shadow-dark), inset -2px -2px 5px var(--mito-input-shadow-light);
            position: relative; cursor: pointer; transition: background-color 0.3s; flex-shrink: 0;
          }
          .mito-cond-switch-neumorphic[data-state="checked"] { background-color: var(--scoped-active); }
          .mito-cond-switch-neumorphic::before {
            content: ''; position: absolute; width: 22px; height: 22px; border-radius: 50%; top: 3px; left: 3px;
            background-color: var(--mito-input-bg-env); transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            box-shadow: 2px 2px 4px rgba(0,0,0,0.2), -1px -1px 3px rgba(255,255,255,0.7);
          }
          .mito-cond-switch-neumorphic[data-state="checked"]::before { transform: translateX(22px); }
          .mito-cond-switch-neumorphic:focus-visible { outline: 2px solid var(--scoped-active); outline-offset: 2px; }

          /* Neumorphic Checkbox */
          .mito-cond-checkbox-neumorphic {
            all: unset; width: 24px; height: 24px; border-radius: 6px; background-color: var(--mito-input-bg-env);
            box-shadow: 2px 2px 5px var(--mito-input-shadow-dark), -2px -2px 5px var(--mito-input-shadow-light);
            display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer;
            box-sizing: border-box; color: transparent; flex-shrink: 0;
          }
          .mito-cond-checkbox-neumorphic[data-state="checked"] {
            box-shadow: inset 2px 2px 4px var(--mito-input-shadow-dark), inset -2px -2px 4px var(--mito-input-shadow-light);
            color: var(--scoped-active);
          }
          .mito-cond-checkbox-neumorphic:focus-visible { outline: 2px solid var(--scoped-active); outline-offset: 2px; }

          /* Neumorphic Select */
          .mito-cond-select-neumorphic {
            height: 44px; border-radius: 12px; border: none; padding: 0 12px;
            background-color: var(--mito-input-bg-env);
            box-shadow: 4px 4px 8px var(--mito-input-shadow-dark), -4px -4px 8px var(--mito-input-shadow-light);
            transition: all 0.2s; font-weight: 500;
          }
          .mito-cond-select-neumorphic:focus-visible { outline: 2px solid var(--scoped-active); outline-offset: -2px; }
          
          /* ------------------------- */
          /* SKEUOMORPHIC DESIGN       */
          /* ------------------------- */
          .mito-cond-container-skeuomorphic {
            background-color: var(--mito-input-bg-env);
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(255,255,255,0) 100%);
            border-radius: 8px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.2);
          }
          .mito-conditional-container.mito-input-dark.mito-cond-container-skeuomorphic {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 100%);
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.1);
          }
          .mito-cond-container-skeuomorphic[data-state="open"] { border-left: 4px solid var(--scoped-active); }
          .mito-cond-container-skeuomorphic[data-error="true"] { border-color: var(--scoped-error); box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 1px var(--scoped-error); }
          .mito-cond-well-skeuomorphic {
            margin-top: 16px; padding: 16px; border-radius: 6px;
            background-color: var(--mito-input-bg-env);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.2);
          }
          .mito-conditional-container.mito-input-dark .mito-cond-well-skeuomorphic {
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.1);
          }
          
          /* Skeuomorphic Switch */
          .mito-cond-switch-skeuomorphic {
            all: unset; width: 44px; height: 24px; border-radius: 12px;
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.3);
            position: relative; cursor: pointer; transition: background-color 0.3s; flex-shrink: 0;
          }
          .mito-cond-switch-skeuomorphic[data-state="checked"] { background-color: var(--scoped-active); }
          .mito-cond-switch-skeuomorphic::before {
            content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; top: 2px; left: 2px;
            background-color: var(--mito-input-bg-env); transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            background-image: linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0.1) 100%);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,1);
          }
          .mito-cond-switch-skeuomorphic[data-state="checked"]::before { transform: translateX(20px); }

          /* Skeuomorphic Checkbox */
          .mito-cond-checkbox-skeuomorphic {
            all: unset; width: 20px; height: 20px; border-radius: 4px;
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer;
            box-sizing: border-box; color: transparent; flex-shrink: 0;
          }
          .mito-cond-checkbox-skeuomorphic[data-state="checked"] {
            background-color: var(--scoped-active);
            color: #ffffff;
          }

          /* Skeuomorphic Select */
          .mito-cond-select-skeuomorphic {
            height: 40px; border-radius: 6px; padding: 0 12px;
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(255,255,255,0) 100%);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.2);
            transition: all 0.2s; font-weight: 500;
          }
          .mito-cond-select-skeuomorphic:focus-visible {
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 2px rgba(37, 99, 235, 0.4); outline: none;
          }
        `}} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {renderTrigger()}
          {isHinted && (
              <TooltipPrimitive.Provider delayDuration={300}>
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <a href={hintUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto', marginLeft: '12px' }}>
                      <Icon name="questionmarkcircled" height="18" width="18" style={{ cursor: 'pointer', color: 'var(--scoped-placeholder)' }} />
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

        <div 
          id={regionId}
          role="region"
          aria-hidden={!isOpen}
          style={{
            display: 'grid',
            gridTemplateRows: isOpen ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
            opacity: isOpen ? 1 : 0,
            width: '100%',
          }}
        >
          <div style={{ overflow: 'hidden', minHeight: 0 }}>
             <div className={`mito-cond-well mito-cond-well-${design}`}>
               <Row>
                 {children}
               </Row>
             </div>
          </div>
        </div>

        {hasError && displayError && (
          <div style={{ marginTop: '12px' }}>
            <span id={errorId} role="alert" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--scoped-error)', fontWeight: 500, fontSize: '0.875rem' }}>
                <Icon name="error" width="12" height="12" aria-hidden="true" />
                {typeof displayError === 'string' ? displayError : "Required condition unmet"}
            </span>
          </div>
        )}      
      </Comp>
    </Column>
  );
});

ConditionalTrigger.displayName = 'ConditionalTrigger';