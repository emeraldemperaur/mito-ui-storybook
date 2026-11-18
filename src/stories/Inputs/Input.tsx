"use client";

import React, { useRef, useState, useEffect, type JSX, useId, useContext } from "react";
import { getIn, type FormikContextType, FormikContext } from "formik";
import { Slot } from '@radix-ui/react-slot';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";

/** 
 * @type InputDesign 
 * @description Strong string literal union representing permitted enterprise design motifs. 
 */
export type InputDesign = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @interface InputProps
 * @description Strongly-typed attributes extending native HTML input behaviors with Mito UI's enterprise visual variants.
 * Optimized for MCP context-injection to ensure flawless form pipeline integration.
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'onChange'> {
  /** 
   * @description Unique identifier mapping the input to its Formik state and DOM label. 
   * @required
   */
  alias: string;
  /** 
   * @description The standard HTML input type. 
   * @default "text" 
   */
  type?: 'text' | 'email' | 'tel' | 'url' | 'search' | 'password' | 'number';
  /** 
   * @description Text rendered above the input or floating over the border.
   */
  inputLabel?: string;
  /** 
   * @description Toggles the interactive floating label animation (primarily used with the 'outline' variant).
   * @default false
   */
  floatingLabel?: boolean;
  /**
   * @description The core architectural design variant of the input field.
   * - `material`: Minimalist underline with a vibrant gradient animation on focus.
   * - `outline`: Crisp bordered aesthetic with optional floating labels.
   * - `neumorphic`: Soft, extruded physical surface utilizing inset shadows.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical input well.
   * @default 'outline'
   */
  design?: InputDesign;
  /** 
   * @description Optional icon node rendered inside the input field. 
   */
  icon?: React.ReactNode;
  /** 
   * @description Determines if the icon is placed on the left (leading) or right (trailing).
   * @default "left"
   */
  iconPosition?: 'left' | 'right';
  /** 
   * @description Forces the component into dark mode, overriding system or parent theme contexts. 
   */
  darkMode?: boolean;
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
   * @description Highlight color applied to the active/focused border and icons. 
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
   * @description Delegates rendering to the immediate child element via Radix Slot. 
   */
  asChild?: boolean;
  /** 
   * @description Unmasked raw string value callback for external state management. 
   */
  onChange?: (value: string) => void;
}

/**
 * @component Input
 * @description Master SSR-safe text input. Supports Neumorphic ambient-background matching, dynamic Formik injection, and global dark mode token overrides.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  alias,
  type = "text",
  inputLabel,
  floatingLabel = false,
  design = 'outline',
  icon,
  iconPosition = 'left',
  darkMode = false,
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
  placeholder,
  readOnly,
  isHinted,
  hintText,
  hintUrl,
  errorText,
  className = "",
  style,
  formikContext,
  asChild,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isFocused, setIsFocused] = useState(false);
  const internalId = useId();
  const inputId = `${alias}-input-${internalId}`;

  const fallbackContext = useContext(FormikContext) as FormikContextType<any> | undefined;
  const activeContext = formikContext || fallbackContext;
    
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = activeContext !== undefined && typeof activeContext.setFieldValue === 'function';
  const fieldValue = isFormik ? getIn(activeContext!.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext!.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext!.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;
  const hasValue = fieldValue !== undefined && fieldValue !== null && String(fieldValue).length > 0;
  const isFloating = floatingLabel && (isFocused || hasValue);

  const themeClass = darkMode ? 'mito-input-dark' : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFormik) activeContext.handleChange(e);
    if (onChange) onChange(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (isFormik) activeContext.handleBlur(e);
    if (onBlur) onBlur(e);
  };

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement) || '#e0e5ec';
      setNeuVars({
        '--mito-input-bg-env': parentBg,
        '--mito-input-shadow-dark': adjustColor(parentBg, -15), 
        '--mito-input-shadow-light': adjustColor(parentBg, 15),
      } as React.CSSProperties);
    }
  }, [design, backgroundColor]);

  const customStyles = {
    ...style,
    ...neuVars,
    '--mito-input-bg': backgroundColor,
    '--mito-input-bg-dark': darkBackgroundColor || backgroundColor,
    '--mito-input-text': textColor,
    '--mito-input-text-dark': darkTextColor || textColor,
    '--mito-input-error': errorTextColor || '#ef4444',
    '--mito-input-error-dark': darkErrorTextColor || errorTextColor || '#f87171',
    '--mito-input-active': activeColor || '#2563eb',
    '--mito-input-font': fontFamily,
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  const Component = asChild ? Slot : "input";

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`mito-input-wrapper ${themeClass} ${className}`}
        style={customStyles}
      >
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
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.35rem;
          }

          .mito-input-base {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.3s ease;
          }

          .mito-input-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--scoped-placeholder);
            position: absolute;
            z-index: 2;
            transition: color 0.3s ease;
          }
          .mito-input-icon.left { left: 12px; }
          .mito-input-icon.right { right: 12px; }
          .mito-input-base:focus-within .mito-input-icon { color: var(--scoped-active); }
          .mito-input-base[data-error="true"] .mito-input-icon { color: var(--scoped-error); }

          .mito-input-field {
            width: 100%;
            font-family: inherit;
            font-size: 0.95rem;
            color: var(--scoped-text);
            background: transparent;
            border: none;
            outline: none;
            box-sizing: border-box;
            transition: all 0.3s ease;
          }
          .mito-input-field::placeholder { color: var(--scoped-placeholder); opacity: 1; transition: opacity 0.2s ease; }
          .mito-input-field:focus::placeholder { opacity: 0.5; }

          /* --- Padding Adjustments for Icons --- */
          .mito-input-field.has-icon-left { padding-left: 38px !important; }
          .mito-input-field.has-icon-right { padding-right: 38px !important; }

          /* --- Outline Variant --- */
          .mito-input-outline {
            background-color: var(--scoped-bg);
            border: 1px solid var(--scoped-border);
            border-radius: 6px;
          }
          .mito-input-outline .mito-input-field { padding: 12px 14px; }
          .mito-input-outline:focus-within { border-color: var(--scoped-active); box-shadow: 0 0 0 1px var(--scoped-active); }
          .mito-input-outline[data-error="true"] { border-color: var(--scoped-error); box-shadow: 0 0 0 1px var(--scoped-error); }
          
          /* Floating Label Logic (Outline only) */
          .mito-input-floating-label {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.95rem;
            color: var(--scoped-placeholder);
            pointer-events: none;
            background-color: var(--scoped-bg);
            padding: 0 4px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 1;
            margin-left: -4px;
          }
          .mito-input-floating-label.has-icon { left: 38px; }
          .mito-input-floating-label.floating {
            top: 0;
            left: 10px;
            font-size: 0.75rem;
            color: var(--scoped-active);
            font-weight: 500;
          }
          .mito-input-floating-label.floating.has-icon { left: 10px; }
          .mito-input-outline[data-error="true"] .mito-input-floating-label.floating { color: var(--scoped-error); }

          /* --- Material Variant --- */
          .mito-input-material {
            background-color: transparent;
            border-bottom: 2px solid var(--scoped-border);
            border-radius: 4px 4px 0 0;
          }
          .mito-input-material .mito-input-field { padding: 8px 0; }
          .mito-input-material.has-icon-left .mito-input-field { padding-left: 32px; }
          .mito-input-material:focus-within {
            border-image: linear-gradient(to right, var(--scoped-active), #0202020a);
            border-image-slice: 1;
            border-bottom-width: 2px;
            background-color: rgba(156, 163, 175, 0.05);
          }
          .mito-input-material[data-error="true"] { border-bottom-color: var(--scoped-error); border-image: none; }
          .mito-input-material .mito-input-icon.left { left: 4px; }
          
          /* Material Floating Label */
          .mito-input-material .mito-input-floating-label {
            left: 0;
            background: transparent;
            margin-left: 0;
          }
          .mito-input-material .mito-input-floating-label.has-icon { left: 32px; }
          .mito-input-material .mito-input-floating-label.floating {
            top: -8px;
            left: 0;
          }

          /* --- Neumorphic Variant --- */
          .mito-input-neumorphic {
            background-color: var(--mito-input-bg-env);
            border-radius: 8px;
            box-shadow: inset 3px 3px 6px var(--mito-input-shadow-dark), inset -3px -3px 6px var(--mito-input-shadow-light);
            border: 1px solid transparent;
          }
          .mito-input-neumorphic .mito-input-field { padding: 14px 16px; }
          .mito-input-neumorphic:focus-within { box-shadow: inset 4px 4px 8px var(--mito-input-shadow-dark), inset -4px -4px 8px var(--mito-input-shadow-light); }
          .mito-input-neumorphic[data-error="true"] { border-color: var(--scoped-error); }
          .mito-input-neumorphic .mito-input-floating-label { background: transparent; }

          /* --- Skeuomorphic Variant --- */
          .mito-input-skeuomorphic {
            background-color: var(--mito-input-bg-env);
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(255,255,255,0) 100%);
            border-radius: 6px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.2);
          }
          .mito-input-wrapper.mito-input-dark .mito-input-skeuomorphic {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 100%);
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.1);
          }
          .mito-input-skeuomorphic .mito-input-field { padding: 12px 14px; }
          .mito-input-skeuomorphic:focus-within { box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 2px rgba(37, 99, 235, 0.4); }
          .mito-input-skeuomorphic[data-error="true"] { border-color: var(--scoped-error); box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 1px var(--scoped-error); }
          
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
        
        {inputLabel && !floatingLabel && (
          <label className="mito-input-label-static" htmlFor={inputId}>
            {inputLabel}
            {isHinted && (
              <TooltipPrimitive.Provider delayDuration={300}>
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <a href={hintUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
                      <Icon name="questionmarkcircled" height="14" width="14" style={{ color: 'var(--scoped-placeholder)', marginLeft: '4px' }} />
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
        )}

        <div className={`mito-input-base mito-input-${design} ${icon ? `has-icon-${iconPosition}` : ''}`} data-error={hasError}>
          {icon && (
            <div className={`mito-input-icon ${iconPosition}`}>
              {icon}
            </div>
          )}
          
          {inputLabel && floatingLabel && (
            <label 
              className={`mito-input-floating-label ${isFloating ? 'floating' : ''} ${icon && iconPosition === 'left' ? 'has-icon' : ''}`} 
              htmlFor={inputId}
            >
              {inputLabel}
            </label>
          )}

          <Component
            ref={ref}
            id={inputId}
            name={alias}
            type={type}
            value={fieldValue !== undefined ? fieldValue : ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly={readOnly}
            placeholder={floatingLabel && !isFocused ? '' : placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${alias}-error` : undefined}
            className={`mito-input-field ${icon ? `has-icon-${iconPosition}` : ''}`}
            {...props}
          />
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="mito-input-error-text" role="alert">
            <Icon name="error" width="12" height="12" aria-hidden="true" />
            {typeof displayError === 'string' ? displayError : "Invalid input"}
          </span>
        )}
      </div>
    </Column>
  );
});

Input.displayName = 'Input';