"use client";

import React, { useRef, useState, useEffect, type JSX, useId, useContext } from "react";
import { getIn, type FormikContextType, FormikContext } from "formik";
import { Slot } from '@radix-ui/react-slot';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground, type InputOption } from "../../utils/Vinci";
import { sharedInputStyles } from "./types";
import { type InputDesign } from "./Input";

/**
 * @interface SelectInputProps
 * @description Strongly-typed attributes extending HTML Select behaviors with Mito UI's enterprise visual variants.
 * Routes dynamically between single-select dropdowns and multi-select popovers.
 */
export interface SelectInputProps extends Omit<React.HTMLAttributes<HTMLButtonElement | HTMLSelectElement>, 'onChange' | 'value' | 'defaultValue'> {
  /** 
   * @description Unique identifier mapping the input to its Formik state and DOM label. 
   * @required
   */
  alias: string;
  /** 
   * @description Array of structural options mapping values, text, and optional external resources. 
   * @required
   */
  options: InputOption[];
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
   * @description Toggles standard single-select vs. array-based multi-select mode. 
   * @default false 
   */
  multiple?: boolean;
  /** 
   * @description Explicit placeholder text for the unselected state. 
   * @default "Select an option" 
   */
  placeholder?: string;
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
   * @description Locks the component to prevent user interaction, rendering a disabled visual state.
   */
  readOnly?: boolean;
  /** 
   * @description Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. 
   * @default 1 
   */
  neuIntensity?: number;
  /** 
   * @description Explicit Formik context object injected for nested step fields. 
   */
  formikContext?: FormikContextType<any>;
  /** 
   * @description External fallback state value for standalone non-Formik setups.
   */
  value?: string | string[];
  /** 
   * @description Delegates rendering to the immediate child element via Radix Slot. 
   */
  asChild?: boolean;
  /** 
   * @description Unmasked raw string (or array of strings) value callback for external state management. 
   */
  onChange?: (value: any) => void;
  /** 
   * @description Callback fired when an option is selected, returning the complete rich metadata object (including tag, score, note, etc.) for downstream processing.
   */
  onOptionChange?: (option: InputOption, value: any) => void;
}

/**
 * @component SelectInput
 * @description Unified SSR-safe dropdown. Routes between single-select native/styled dropdowns and multi-select Popovers, supporting Neumorphic ambient-background matching and global dark mode token overrides.
 */
export const SelectInput = React.forwardRef<HTMLButtonElement, SelectInputProps>(({
  alias,
  inputLabel,
  options = [],
  multiple = false,
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
  placeholder = "Select an option",
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
  asChild,
  onChange,
  onOptionChange,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties & Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedValues = multiple 
    ? (Array.isArray(fieldValue) ? fieldValue : []) 
    : (fieldValue ? [String(fieldValue)] : []);
    
  const hasValue = selectedValues.length > 0;
  const isFloating = floatingLabel && (isOpen || isFocused || hasValue);

  const themeClass = darkMode ? 'mito-input-dark' : '';

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement) || '#e0e5ec';
      const shadowDark = adjustColor(parentBg, -15 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 15 * neuIntensity);
      
      setNeuVars({
        '--mito-input-bg-env': parentBg,
        '--mito-input-shadow-dark': shadowDark, 
        '--mito-input-shadow-light': shadowLight,
      } as React.CSSProperties);
    }
  }, [design, backgroundColor, neuIntensity]);

  const handleSingleChange = (opt: InputOption) => {
    if (readOnly) return;
    const val = String(opt.optionvalue);
    
    if (isFormik) {
      activeContext.setFieldValue(alias, val);
      setTimeout(() => activeContext.setFieldTouched(alias, true, false), 0);
    }
    if (onChange) onChange(val);
    if (onOptionChange) onOptionChange(opt, val);
    setIsOpen(false);
  };

  const handleMultiToggle = (opt: InputOption) => {
    if (readOnly) return;
    const val = String(opt.optionvalue);
    const newValues = selectedValues.includes(val)
      ? selectedValues.filter((v: string) => v !== val)
      : [...selectedValues, val];
    
    if (isFormik) {
      activeContext.setFieldValue(alias, newValues);
      setTimeout(() => activeContext.setFieldTouched(alias, true, false), 0);
    }
    if (onChange) onChange(newValues);
    if (onOptionChange) onOptionChange(opt, newValues);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setIsFocused(open);
    if (!open && isFormik) activeContext.setFieldTouched(alias, true, false);
  };

  const displayLabel = hasValue
    ? options.filter(opt => selectedValues.includes(String(opt.optionvalue))).map(opt => opt.text).join(', ')
    : placeholder;

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
            justify-content: space-between;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.3s ease;
            cursor: pointer;
            text-align: left;
            font-family: inherit;
            font-size: 0.95rem;
            color: var(--scoped-text);
            background: transparent;
            border: none;
            outline: none;
          }
          .mito-input-base:disabled { cursor: default; opacity: 0.7; }
          .mito-input-base[data-placeholder="true"] { color: var(--scoped-placeholder); }

          .mito-input-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--scoped-placeholder);
            position: absolute;
            z-index: 2;
            transition: color 0.3s ease;
            top: 50%;
            transform: translateY(-50%);
          }
          .mito-input-icon.left { left: 12px; }
          .mito-input-icon.right { right: 12px; }
          .mito-input-base[data-state="open"] .mito-input-icon { color: var(--scoped-active); }
          .mito-input-base[data-error="true"] .mito-input-icon { color: var(--scoped-error); }

          /* --- Padding Adjustments for Icons --- */
          .mito-input-base.has-icon-left { padding-left: 38px !important; }
          .mito-input-base.has-icon-right { padding-right: 38px !important; }

          /* --- Outline Variant --- */
          .mito-input-outline {
            background-color: var(--scoped-bg);
            border: 1px solid var(--scoped-border);
            border-radius: 6px;
            padding: 12px 14px;
          }
          .mito-input-outline[data-state="open"], .mito-input-outline:focus-visible { border-color: var(--scoped-active); box-shadow: 0 0 0 1px var(--scoped-active); }
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
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .mito-input-floating-label .mito-floating-icon {
            display: flex;
            align-items: center;
            justify-content: center;
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
            padding: 8px 0;
          }
          .mito-input-material.has-icon-left { padding-left: 32px !important; }
          .mito-input-material[data-state="open"], .mito-input-material:focus-visible {
            border-image: linear-gradient(to right, var(--scoped-active), #0202020a);
            border-image-slice: 1;
            border-bottom-width: 2px;
            background-color: rgba(156, 163, 175, 0.05);
          }
          .mito-input-material[data-error="true"] { border-bottom-color: var(--scoped-error); border-image: none; }
          .mito-input-material .mito-input-icon.left { left: 4px; }
          
          /* Material Floating Label */
          .mito-input-material .mito-input-floating-label { left: 0; background: transparent; margin-left: 0; }
          .mito-input-material .mito-input-floating-label.has-icon { left: 32px; }
          .mito-input-material .mito-input-floating-label.floating { top: -8px; left: 0; }

          /* --- Neumorphic Variant --- */
          .mito-input-neumorphic {
            background-color: var(--mito-input-bg-env);
            border-radius: 8px;
            box-shadow: 4px 4px 8px var(--mito-input-shadow-dark), -4px -4px 8px var(--mito-input-shadow-light);
            border: 1px solid transparent;
            padding: 14px 16px;
          }
          .mito-input-neumorphic[data-state="open"], .mito-input-neumorphic:focus-visible { 
            box-shadow: inset 4px 4px 8px var(--mito-input-shadow-dark), inset -4px -4px 8px var(--mito-input-shadow-light); 
          }
          .mito-input-neumorphic[data-error="true"] { border-color: var(--scoped-error); }
          .mito-input-neumorphic .mito-input-floating-label { background: transparent; }

          /* --- Skeuomorphic Variant --- */
          .mito-input-skeuomorphic {
            background-color: var(--mito-input-bg-env);
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(255,255,255,0) 100%);
            border-radius: 6px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.2);
            padding: 12px 14px;
          }
          .mito-input-wrapper.mito-input-dark .mito-input-skeuomorphic {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 100%);
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.1);
          }
          .mito-input-skeuomorphic[data-state="open"], .mito-input-skeuomorphic:focus-visible { box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 2px rgba(37, 99, 235, 0.4); }
          .mito-input-skeuomorphic[data-error="true"] { border-color: var(--scoped-error); box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 1px var(--scoped-error); }

          /* Popover Content Styling */
          .mito-select-popover {
            width: var(--radix-popover-trigger-width);
            max-height: 250px;
            overflow-y: auto;
            border-radius: 6px;
            padding: 4px;
            z-index: 50;
            display: flex;
            flex-direction: column;
            gap: 2px;
            animation: mito-fade-in-up 0.2s ease;
          }
          .mito-select-popover-outline {
            background-color: var(--scoped-bg);
            border: 1px solid var(--scoped-border);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .mito-select-popover-material {
            background-color: var(--scoped-bg);
            border: none;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            border-radius: 4px;
          }
          .mito-select-popover-neumorphic {
            background-color: var(--mito-input-bg-env);
            border: none;
            box-shadow: 8px 8px 16px var(--mito-input-shadow-dark), -8px -8px 16px var(--mito-input-shadow-light);
            border-radius: 12px;
          }
          .mito-select-popover-skeuomorphic {
            background-color: var(--mito-input-bg-env);
            border: 1px solid rgba(0,0,0,0.2);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          }

          .mito-select-item {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            color: var(--scoped-text);
            font-size: 0.95rem;
            transition: background-color 0.2s;
            user-select: none;
          }
          .mito-select-item:hover, .mito-select-item:focus-visible {
            background-color: rgba(156, 163, 175, 0.1);
            outline: none;
          }
          .mito-select-item[data-state="checked"] {
            background-color: var(--scoped-active);
            color: #fff;
          }

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
          @keyframes mito-fade-in-up { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        `}} />
        
        {inputLabel && !floatingLabel && (
          <label className="mito-input-label-static" htmlFor={inputId}>
            {inputLabel}
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
        )}

        <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverPrimitive.Trigger asChild>
            <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
              
              {icon && !floatingLabel && (
                <div className={`mito-input-icon ${iconPosition}`}>
                  {icon}
                </div>
              )}
              
              {(inputLabel || icon) && floatingLabel && (
                <label 
                  className={`mito-input-floating-label ${isFloating ? 'floating' : ''}`} 
                  htmlFor={inputId}
                >
                  {icon && iconPosition === 'left' && <span className="mito-floating-icon">{icon}</span>}
                  {inputLabel && <span>{inputLabel}</span>}
                  {icon && iconPosition === 'right' && <span className="mito-floating-icon">{icon}</span>}
                </label>
              )}

              <Component
                ref={ref}
                id={inputId}
                type="button"
                disabled={readOnly}
                data-state={isOpen ? "open" : "closed"}
                data-placeholder={!hasValue}
                data-error={hasError}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${alias}-error` : undefined}
                className={`mito-input-base mito-input-${design} ${icon && !floatingLabel ? `has-icon-${iconPosition}` : ''}`}
                {...props}
              >
                <span 
                  style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap', 
                    display: 'block', 
                    flex: 1, 
                    paddingRight: '20px',
                    opacity: (floatingLabel && !isFloating) ? 0 : 1, 
                    transition: 'opacity 0.2s'
                  }}
                >
                  {displayLabel}
                </span>
                <Icon name="chevrondown" height="16" width="16" style={{ opacity: 0.5, flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </Component>
            </div>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content 
              align="start" 
              sideOffset={4}
              className={`mito-select-popover mito-select-popover-${design} ${themeClass}`}
              style={{
                '--mito-input-bg-env': neuVars['--mito-input-bg-env'],
                '--mito-input-shadow-dark': neuVars['--mito-input-shadow-dark'],
                '--mito-input-shadow-light': neuVars['--mito-input-shadow-light'],
                '--scoped-bg': (customStyles as Record<string, any>)['--mito-input-bg'] || (darkMode ? '#1f2937' : '#ffffff'),
                '--scoped-text': customStyles['--mito-input-text'],
                '--scoped-border': customStyles['--mito-input-text'] === '#111827' ? '#d1d5db' : '#4b5563',
                '--scoped-active': customStyles['--mito-input-active'],
                fontFamily: customStyles['--mito-input-font'],
              } as React.CSSProperties}
            >
              {options.map((opt) => {
                const isSelected = selectedValues.includes(String(opt.optionvalue));
                return (
                  <div
                    key={opt.optionid}
                    role="option"
                    aria-selected={isSelected}
                    data-state={isSelected ? "checked" : "unchecked"}
                    className="mito-select-item"
                    onClick={() => multiple ? handleMultiToggle(opt) : handleSingleChange(opt)}
                  >
                    {multiple && (
                      <div style={{ width: '16px', height: '16px', marginRight: '8px', border: '1px solid currentColor', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected && (
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                             <polyline points="20 6 9 17 4 12"></polyline>
                           </svg>
                        )}
                      </div>
                    )}
                    {opt.text}
                  </div>
                );
              })}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="mito-input-error-text" role="alert">
            <Icon name="error" width="12" height="12" aria-hidden="true" />
            {typeof displayError === 'string' ? displayError : "Invalid selection"}
          </span>
        )}
      </div>
    </Column>
  );
});

SelectInput.displayName = 'SelectInput';