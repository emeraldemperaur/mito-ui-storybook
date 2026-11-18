"use client";

import React, { useRef, useState, useEffect, useMemo, type JSX, useId, useContext } from "react";
import { getIn, type FormikContextType, FormikContext } from "formik";
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { getCountries } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en.json';
import type { Country } from 'react-phone-number-input';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Icon } from '../../components/icons/Icons';
import { FlagIcon } from "../../components/icons/FlagIcon";
import { Column } from '../Layout/Column';
import { type InputDesign } from "./Input";

/**
 * @interface CountrySelectProps
 * @description Strongly-typed attributes extending button behaviors to act as a multi-variant country selector.
 * Optimized for MCP context-injection to ensure flawless form pipeline integration and robust standalone rendering.
 */
export interface CountrySelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  /** 
   * @description Unique identifier mapping the input to its Formik state and DOM label. 
   * @required
   */
  alias: string;
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
   * @description Option to render the country flag icon next to the country name. 
   * @default true 
   */
  displayFlag?: boolean;
  /** 
   * @description Option to allow multiple country selections. 
   * @default false 
   */
  multiselect?: boolean;
  /** 
   * @description Option to enable a search bar inside the CountrySelect popup to filter countries. 
   * @default false 
   */
  enableSearch?: boolean;
  /** 
   * @description Explicit placeholder text shown when no country is selected. 
   * @default "Select Country..." 
   */
  placeholder?: string;
  /** 
   * @description Optional icon node rendered inside the input field. 
   */
  icon?: React.ReactNode;
  /** 
   * @description Determines if the optional generic icon is placed on the left (leading). The dropdown chevron is always on the right.
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
   * @description Text color for the dropdown items in light mode. 
   */
  dropdownTextColor?: string;
  /** 
   * @description Text color for the dropdown items in dark mode. 
   */
  darkDropdownTextColor?: string;
  /** 
   * @description Text color when a dropdown item is hovered in light mode. 
   */
  dropdownHoverTextColor?: string;
  /** 
   * @description Text color when a dropdown item is hovered in dark mode. 
   */
  darkDropdownHoverTextColor?: string;
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
   * @description Locks the component to prevent user interaction and selection changes, while preserving the current value and rendering a disabled visual state.
   * @default false
   */
  readOnly?: boolean;
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
  value?: string | string[];
  /** 
   * @description Standalone value callback for external state management. 
   */
  onChange?: (value: string | string[]) => void;
}

/**
 * @component CountrySelectInput
 * @description Multi-variant Country Selector. Supports Material, Outline, Neumorphic, and Skeuomorphic designs.
 * Strips out high-level theme dependencies for robust overlay rendering in isolated environments.
 */
export const CountrySelectInput = React.forwardRef<HTMLButtonElement, CountrySelectProps>(({
  alias,
  inputLabel,
  floatingLabel = false,
  design = 'outline',
  displayFlag = true,
  multiselect = false,
  enableSearch = false,
  placeholder = "Select Country...",
  icon,
  iconPosition = 'left',
  darkMode = false,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  dropdownTextColor,
  darkDropdownTextColor,
  dropdownHoverTextColor,
  darkDropdownHoverTextColor,
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
  className = "",
  style,
  formikContext,
  value,
  onChange,
  onBlur,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const selectedValues: string[] = useMemo(() => {
      if (multiselect) return Array.isArray(fieldValue) ? fieldValue : [];
      return fieldValue ? [String(fieldValue)] : [];
  }, [fieldValue, multiselect]);

  const hasValue = selectedValues.length > 0;
  const isFloating = floatingLabel && (isOpen || hasValue);

  const themeClass = darkMode ? 'mito-input-dark' : '';

  const allCountries = useMemo(() => getCountries().map((c: Country) => ({ value: c, label: en[c] })), []);

  const filteredCountries = useMemo(() => {
      if (!enableSearch || !searchQuery) return allCountries;
      const lowerSearch = searchQuery.toLowerCase();
      return allCountries.filter((c: { value: string; label: string }) => c.label.toLowerCase().includes(lowerSearch));
  }, [allCountries, searchQuery, enableSearch]);

  const handleSelection = (countryCode: string) => {
      if (multiselect) {
          const newValues = selectedValues.includes(countryCode)
              ? selectedValues.filter((v) => v !== countryCode)
              : [...selectedValues, countryCode];
          if (isFormik) activeContext.setFieldValue(alias, newValues);
          if (onChange) onChange(newValues);
      } else {
          if (isFormik) activeContext.setFieldValue(alias, countryCode);
          if (onChange) onChange(countryCode);
          setIsOpen(false);
      }
      setTimeout(() => isFormik && activeContext.setFieldTouched(alias, true, false), 0);
  };

  const displayLabel = useMemo(() => {
      // \u00A0 (non-breaking space) preserves the exact line-height of the button to prevent floating label distortion
      if (selectedValues.length === 0) return floatingLabel && !isFloating ? '\u00A0' : placeholder;
      if (!multiselect) {
          const c = allCountries.find((x: { value: string; label: string }) => x.value === selectedValues[0]);
          return c ? c.label : selectedValues[0];
      }
      if (selectedValues.length <= 2) {
          return selectedValues.map(v => allCountries.find((x: { value: string; label: string }) => x.value === v)?.label || v).join(', ');
      }
      return `${selectedValues.length} countries selected`;
  }, [selectedValues, multiselect, allCountries, placeholder, floatingLabel, isFloating]);

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

  useEffect(() => {
      if (!isOpen) setSearchQuery("");
  }, [isOpen]);

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
    '--mito-dropdown-text': dropdownTextColor || textColor || '#111827',
    '--mito-dropdown-text-dark': darkDropdownTextColor || darkTextColor || '#f9fafb',
    '--mito-dropdown-hover-text': dropdownHoverTextColor || '#ffffff',
    '--mito-dropdown-hover-text-dark': darkDropdownHoverTextColor || '#ffffff',
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`mito-input-wrapper ${themeClass} ${className}`}
        style={customStyles}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          /* Ensure variables map to both the parent wrapper AND the standalone popover portal */
          .mito-input-wrapper, .mito-popover-content {
            --scoped-bg: var(--mito-input-bg, #ffffff);
            --scoped-text: var(--mito-input-text, #111827);
            --scoped-dropdown-text: var(--mito-dropdown-text, #111827);
            --scoped-dropdown-hover-text: var(--mito-dropdown-hover-text, #ffffff);
            --scoped-placeholder: #9ca3af;
            --scoped-border: #d1d5db;
            --scoped-active: var(--mito-input-active, #2563eb);
            --scoped-error: var(--mito-input-error, #ef4444);
            --scoped-font: var(--mito-input-font, system-ui, -apple-system, sans-serif);
          }
          
          .mito-input-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
            font-family: var(--scoped-font);
            position: relative;
          }
          
          .mito-input-wrapper.mito-input-dark, .mito-popover-content.mito-input-dark {
            --scoped-bg: var(--mito-input-bg-dark, #1f2937);
            --scoped-text: var(--mito-input-text-dark, #f9fafb);
            --scoped-dropdown-text: var(--mito-dropdown-text-dark, #f9fafb);
            --scoped-dropdown-hover-text: var(--mito-dropdown-hover-text-dark, #ffffff);
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
            pointer-events: none;
          }
          .mito-input-icon.left { left: 12px; }
          .mito-input-icon.right { right: 12px; }
          .mito-input-base:focus-within .mito-input-icon, .mito-input-base[data-state="open"] .mito-input-icon { color: var(--scoped-active); }
          .mito-input-base[data-error="true"] .mito-input-icon { color: var(--scoped-error); }

          /* Button masquerading as input field */
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
            cursor: pointer;
            text-align: left;
            display: flex;
            align-items: center;
            white-space: nowrap;
            overflow: hidden;
          }
          .mito-input-field:disabled { cursor: default; opacity: 0.7; }
          
          /* Show placeholder styling if no values selected */
          .mito-input-field[data-placeholder="true"] { color: var(--scoped-placeholder); }

          /* --- Padding Adjustments for Icons --- */
          .mito-input-field.has-icon-left { padding-left: 38px !important; }
          /* Right padding to accommodate the chevron dropdown indicator */
          .mito-input-field { padding-right: 38px !important; }

          /* --- Outline Variant --- */
          .mito-input-outline {
            background-color: var(--scoped-bg);
            border: 1px solid var(--scoped-border);
            border-radius: 6px;
          }
          .mito-input-outline .mito-input-field { padding: 12px 14px; }
          .mito-input-outline:focus-within, .mito-input-outline:has([data-state="open"]) { border-color: var(--scoped-active); box-shadow: 0 0 0 1px var(--scoped-active); }
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
            background-color: transparent;
            padding: 0 4px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 1;
            margin-left: -4px;
          }
          .mito-input-floating-label.has-icon-left { left: 38px; }
          .mito-input-floating-label.floating {
            top: 0;
            left: 10px;
            font-size: 0.75rem;
            color: var(--scoped-active);
            font-weight: 500;
            background-color: var(--scoped-bg);
          }
          .mito-input-floating-label.floating.has-icon-left { left: 10px; }
          .mito-input-outline[data-error="true"] .mito-input-floating-label.floating { color: var(--scoped-error); }

          /* --- Material Variant --- */
          .mito-input-material {
            background-color: transparent;
            border-bottom: 2px solid var(--scoped-border);
            border-radius: 4px 4px 0 0;
          }
          .mito-input-material .mito-input-field { padding: 8px 0; padding-right: 28px !important; }
          .mito-input-material.has-icon-left .mito-input-field { padding-left: 32px !important; }
          .mito-input-material:focus-within, .mito-input-material:has([data-state="open"]) {
            border-image: linear-gradient(to right, var(--scoped-active), #38bdf8);
            border-image-slice: 1;
            border-bottom-width: 2px;
            background-color: rgba(156, 163, 175, 0.05);
          }
          .mito-input-material[data-error="true"] { border-bottom-color: var(--scoped-error); border-image: none; }
          .mito-input-material .mito-input-icon.left { left: 4px; }
          .mito-input-material .mito-input-icon.right { right: 4px; }
          
          /* Material Floating Label */
          .mito-input-material .mito-input-floating-label {
            left: 0;
            background: transparent;
            margin-left: 0;
          }
          .mito-input-material .mito-input-floating-label.has-icon-left { left: 32px; }
          .mito-input-material .mito-input-floating-label.floating {
            top: -8px;
            left: 0;
            background: transparent;
          }

          /* --- Neumorphic Variant --- */
          .mito-input-neumorphic {
            background-color: var(--mito-input-bg-env);
            border-radius: 8px;
            box-shadow: inset 3px 3px 6px var(--mito-input-shadow-dark), inset -3px -3px 6px var(--mito-input-shadow-light);
            border: 1px solid transparent;
          }
          .mito-input-neumorphic .mito-input-field { padding: 14px 16px; }
          .mito-input-neumorphic:focus-within, .mito-input-neumorphic:has([data-state="open"]) { box-shadow: inset 4px 4px 8px var(--mito-input-shadow-dark), inset -4px -4px 8px var(--mito-input-shadow-light); }
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
          .mito-input-skeuomorphic:focus-within, .mito-input-skeuomorphic:has([data-state="open"]) { box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 2px rgba(37, 99, 235, 0.4); }
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

          /* Custom Overlay Styling */
          .mito-popover-content {
            background-color: var(--scoped-bg);
            border: 1px solid var(--scoped-border);
            border-radius: 6px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            z-index: 60;
            overflow: hidden;
            font-family: var(--scoped-font);
            display: flex;
            flex-direction: column;
            animation: mito-fade-in 0.2s ease;
          }
          .mito-popover-content.mito-input-dark {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
          }

          .mito-search-input-wrapper {
            padding: 8px;
            border-bottom: 1px solid var(--scoped-border);
            background-color: var(--scoped-bg);
          }
          .mito-search-input {
            width: 100%;
            box-sizing: border-box;
            padding: 8px 12px 8px 32px;
            border: 1px solid var(--scoped-border);
            border-radius: 4px;
            font-family: inherit;
            font-size: 0.875rem;
            color: var(--scoped-text);
            background-color: transparent;
            outline: none;
            transition: border-color 0.2s;
          }
          .mito-search-input:focus {
            border-color: var(--scoped-active);
          }
          .mito-search-icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--scoped-placeholder);
            pointer-events: none;
          }

          .mito-country-list {
            max-height: 280px;
            overflow-y: auto;
            padding: 4px;
          }

          .mito-country-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            color: var(--scoped-dropdown-text);
            font-size: 0.875rem;
            transition: background-color 0.1s, color 0.1s;
          }
          .mito-country-item:hover, .mito-country-item.selected {
            background-color: var(--scoped-active);
            color: var(--scoped-dropdown-hover-text);
          }
          
          /* Multiselect specific item layout */
          .mito-country-item-checkbox {
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: 1px solid var(--scoped-border);
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
          }
          .mito-country-item:hover .mito-country-item-checkbox, 
          .mito-country-item.selected .mito-country-item-checkbox {
            border-color: var(--scoped-dropdown-hover-text);
          }
          .mito-country-item.selected .mito-country-item-checkbox {
            background-color: var(--scoped-dropdown-hover-text);
            color: var(--scoped-active);
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
              className={`mito-input-floating-label ${isFloating ? 'floating' : ''} ${icon && iconPosition === 'left' ? 'has-icon-left' : ''}`} 
              htmlFor={inputId}
            >
              {inputLabel}
            </label>
          )}

          <PopoverPrimitive.Root open={isOpen} onOpenChange={(open: boolean) => {
            if (readOnly || props.disabled) return;
            setIsOpen(open);
            if (!open && isFormik) activeContext.setFieldTouched(alias, true, false);
            if (!open && onBlur) onBlur(null as any);
          }}>
            <PopoverPrimitive.Trigger asChild>
              <button
                ref={ref}
                id={inputId}
                type="button"
                disabled={readOnly || props.disabled}
                className={`mito-input-field ${icon ? `has-icon-${iconPosition}` : ''}`}
                data-placeholder={selectedValues.length === 0}
                {...props}
              >
                {!multiselect && displayFlag && selectedValues.length === 1 && (
                  <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
                    <FlagIcon country={selectedValues[0] as Country} />
                  </div>
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayLabel}
                </span>
              </button>
            </PopoverPrimitive.Trigger>

            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content 
                align="start" 
                sideOffset={8}
                className={`mito-popover-content ${themeClass}`}
                style={{ width: containerRef.current?.offsetWidth || 240, ...customStyles }}
                onOpenAutoFocus={(e: Event) => {
                  if (enableSearch) {
                    // Let the search input grab focus automatically
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                {enableSearch && (
                  <div className="mito-search-input-wrapper" style={{ position: 'relative' }}>
                    <Icon name="search" height="14" width="14" className="mito-search-icon" />
                    <input
                      type="text"
                      className="mito-search-input"
                      placeholder="Search countries..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )}

                <div className="mito-country-list">
                  {filteredCountries.length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--scoped-placeholder)', fontSize: '0.875rem' }}>
                      No countries found.
                    </div>
                  ) : (
                    filteredCountries.map((country: { value: string; label: string }) => {
                      const isSelected = selectedValues.includes(country.value);
                      return (
                        <div
                          key={country.value}
                          className={`mito-country-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelection(country.value)}
                        >
                          {multiselect && (
                            <div className="mito-country-item-checkbox">
                              {isSelected && <Icon name="check" width="12" height="12" />}
                            </div>
                          )}
                          {displayFlag && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <FlagIcon country={country.value as Country} />
                            </div>
                          )}
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: isSelected ? 600 : 400 }}>
                            {country.label}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>
          
          <div className="mito-input-icon right" style={{ pointerEvents: 'none' }}>
            <Icon name="chevrondown" style={{ opacity: 0.5 }} />
          </div>
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

CountrySelectInput.displayName = 'CountrySelectInput';