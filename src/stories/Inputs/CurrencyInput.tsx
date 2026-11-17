"use client";

import React, { useRef, useState, useEffect, type JSX, useId } from "react";
import { useFormikContext, getIn, type FormikContextType } from "formik";
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as SelectPrimitive from '@radix-ui/react-select';
import { IMaskInput } from 'react-imask';
import { CURRENCIES, type SupportedCurrency, type CurrencyOption } from '../../utils/CurrencyConfig'; 
import { FlagIcon } from "../../components/icons/FlagIcon";
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type InputDesign } from "./Input";

/**
 * @interface CurrencyInputProps
 * @description Strongly-typed attributes extending numeric input behaviors with localized currency dropdowns.
 * Optimized for MCP context-injection to ensure flawless form pipeline integration and strict financial formatting.
 */
export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type' | 'onChange'> {
  /** 
   * @description Unique identifier mapping the input to its Formik state and DOM label. 
   * @required
   */
  alias: string;
  /** 
   * @description Target local currency baseline configuration.
   * @default "USD"
   */
  defaultCurrency?: SupportedCurrency;
  /** 
   * @description Locks the currency dropdown, preventing the user from changing the `defaultCurrency`.
   * Ideal for fixed-asset and single-currency transaction workflows.
   * @default false
   */
  strictCurrency?: boolean;
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
   * @description Determines if the optional icon is placed on the left (leading) or right (trailing).
   * Note: The currency selector is permanently affixed to the left.
   * @default "right"
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
   * @description Unmasked string value callback for external state management. 
   */
  onChange?: (value: string) => void;
  /** 
   * @description Callback fired when the currency dropdown value changes. Essential for standalone state extraction.
   */
  onCurrencyChange?: (currencyCode: string) => void;
}

/**
 * @component CurrencyInput
 * @description Advanced financial evaluation input. Combines a native Radix Select primitive for localized rate mapping with strict floating-point numerical masking.
 * Shares exact visual parity with standard `Input` variants (Neumorphic, Skeuomorphic, Outline, Material).
 */
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(({
  alias,
  inputLabel,
  floatingLabel = false,
  design = 'outline',
  defaultCurrency = "USD",
  strictCurrency = false,
  icon,
  iconPosition = 'right',
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
  placeholder = "0.00",
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
  onCurrencyChange,
  onFocus,
  onBlur,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isFocused, setIsFocused] = useState(false);
  const [internalCurrency, setInternalCurrency] = useState<SupportedCurrency>(defaultCurrency);
  const internalId = useId();
  const inputId = `${alias}-input-${internalId}`;

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = Boolean(activeContext);
  const currencyAlias = `${alias}Currency`; 
  
  const fieldValue = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  const currencyFieldValue = isFormik ? getIn(activeContext.values, currencyAlias) : internalCurrency;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;
  const hasValue = fieldValue !== undefined && fieldValue !== null && String(fieldValue).length > 0;
  const isFloating = floatingLabel && (isFocused || hasValue);

  const themeClass = darkMode ? 'mito-input-dark' : '';
  const currentCode = (currencyFieldValue as SupportedCurrency) || "USD";
  const activeCurrency = CURRENCIES[currentCode] || CURRENCIES.USD;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleCurrencyChange = (val: string) => {
    const code = val as SupportedCurrency;
    if (isFormik) {
      activeContext.setFieldValue(currencyAlias, code);
    } else {
      setInternalCurrency(code);
    }
    if (onCurrencyChange) onCurrencyChange(code);
  };

  useEffect(() => {
    if (isFormik && !currencyFieldValue) {
      activeContext.setFieldValue(currencyAlias, defaultCurrency);
    }
  }, [isFormik, currencyFieldValue, currencyAlias, defaultCurrency, activeContext]);

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
          .mito-input-wrapper {
            --scoped-bg: var(--mito-input-bg, #ffffff);
            --scoped-text: var(--mito-input-text, #111827);
            --scoped-dropdown-text: var(--mito-dropdown-text, #111827);
            --scoped-dropdown-hover-text: var(--mito-dropdown-hover-text, #ffffff);
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
          }
          /* Custom offset handling for the fixed left currency addon */
          .mito-input-icon.left { left: var(--currency-addon-width, 115px); }
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
            font-variant-numeric: tabular-nums;
          }
          .mito-input-field::placeholder { color: var(--scoped-placeholder); opacity: 1; transition: opacity 0.2s ease; }
          .mito-input-field:focus::placeholder { opacity: 0.5; }

          /* Dynamic padding based on the currency selector + optional icon */
          .mito-input-field.has-currency { padding-left: var(--currency-addon-width, 115px) !important; }
          .mito-input-field.has-currency.has-icon-left { padding-left: calc(var(--currency-addon-width, 115px) + 28px) !important; }
          .mito-input-field.has-icon-right { padding-right: 38px !important; }

          /* Currency Addon Container */
          .mito-input-currency-addon {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            display: flex;
            align-items: center;
            z-index: 5;
          }

          .mito-select-trigger:focus-visible {
            outline: 2px solid var(--scoped-active);
            outline-offset: -2px;
          }

          .mito-select-item {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            cursor: pointer;
            outline: none;
            user-select: none;
            border-radius: 4px;
            font-size: 0.875rem;
            color: var(--scoped-dropdown-text);
            transition: background-color 0.2s, color 0.2s;
          }
          .mito-select-item[data-highlighted] {
            background-color: var(--scoped-active);
            color: var(--scoped-dropdown-hover-text);
          }
          .mito-select-item[data-highlighted] .mito-select-item-symbol {
            color: var(--scoped-dropdown-hover-text) !important;
            opacity: 0.8;
          }

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
            background-color: transparent;
            padding: 0 4px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 1;
            margin-left: -4px;
          }
          /* Ensure floating label safely clears the currency prefix */
          .mito-input-floating-label.has-currency { left: calc(var(--currency-addon-width, 115px) + 8px); }
          .mito-input-floating-label.has-currency.has-icon-left { left: calc(var(--currency-addon-width, 115px) + 36px); }
          
          .mito-input-floating-label.floating {
            top: 0;
            left: 10px;
            font-size: 0.75rem;
            color: var(--scoped-active);
            font-weight: 500;
            background-color: var(--scoped-bg);
          }
          .mito-input-floating-label.floating.has-currency { left: 10px; }
          .mito-input-floating-label.floating.has-currency.has-icon-left { left: 10px; }
          .mito-input-outline[data-error="true"] .mito-input-floating-label.floating { color: var(--scoped-error); }

          /* --- Material Variant --- */
          .mito-input-material {
            background-color: transparent;
            border-bottom: 2px solid var(--scoped-border);
            border-radius: 4px 4px 0 0;
          }
          .mito-input-material .mito-input-field { padding: 8px 0; }
          .mito-input-material:focus-within {
            border-image: linear-gradient(to right, var(--scoped-active), #0202020a);
            border-image-slice: 1;
            border-bottom-width: 2px;
            background-color: rgba(156, 163, 175, 0.05);
          }
          .mito-input-material[data-error="true"] { border-bottom-color: var(--scoped-error); border-image: none; }
          
          /* Material Floating Label */
          .mito-input-material .mito-input-floating-label {
            background: transparent;
            margin-left: 0;
          }
          .mito-input-material .mito-input-floating-label.floating {
            top: -8px;
            left: 0;
            background: transparent;
          }
          .mito-input-material .mito-input-floating-label.floating.has-currency { left: 0; }

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

        <div 
          className={`mito-input-base mito-input-${design}`} 
          data-error={hasError}
          style={{ '--currency-addon-width': '112px' } as React.CSSProperties}
        >
          
          <div className="mito-input-currency-addon">
            <SelectPrimitive.Root 
              value={activeCurrency.code} 
              name={currencyAlias}
              onValueChange={handleCurrencyChange}  
              disabled={readOnly || props.disabled || strictCurrency} 
            >
              <SelectPrimitive.Trigger 
                className="mito-select-trigger"
                style={{ 
                  height: '100%', 
                  padding: '0 4px 0 10px', 
                  borderRadius: 'inherit', 
                  borderTopRightRadius: 0, 
                  borderBottomRightRadius: 0, 
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: (readOnly || props.disabled || strictCurrency) ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <SelectPrimitive.Value>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FlagIcon country={activeCurrency.country} />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--scoped-text)' }}>
                      {activeCurrency.code}
                    </span>
                  </div>
                </SelectPrimitive.Value>
              </SelectPrimitive.Trigger>

              <SelectPrimitive.Portal>
                <SelectPrimitive.Content 
                  position="popper" 
                  sideOffset={4}
                  className={themeClass}
                  style={{ 
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 60,
                    overflow: 'hidden',
                    fontFamily: 'var(--scoped-font, system-ui, sans-serif)'
                  }}
                >
                  <SelectPrimitive.Viewport style={{ padding: '4px', overflowY: 'auto', maxHeight: '300px' }}>
                    {Object.values(CURRENCIES).map((c: CurrencyOption) => (
                      <SelectPrimitive.Item 
                        key={c.code} 
                        value={c.code}
                        className="mito-select-item"
                      >
                        <SelectPrimitive.ItemText>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FlagIcon country={c.country} />
                            <span>{c.code}</span>
                            <span className="mito-select-item-symbol" style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                              ({c.symbol})
                            </span>
                          </div>
                        </SelectPrimitive.ItemText>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>

            <span style={{ paddingLeft: '6px', paddingRight: '12px', userSelect: 'none', color: 'var(--scoped-placeholder)', fontSize: '0.875rem' }}>
              {activeCurrency.symbol}
            </span>

            {design === 'outline' && (
              <div style={{ width: 1, height: '60%', backgroundColor: 'var(--scoped-border)' }} />
            )}
          </div>

          {icon && (
            <div className={`mito-input-icon ${iconPosition}`}>
              {icon}
            </div>
          )}
          
          {inputLabel && floatingLabel && (
            <label 
              className={`mito-input-floating-label ${isFloating ? 'floating' : ''} has-currency ${icon && iconPosition === 'left' ? 'has-icon-left' : ''}`} 
              htmlFor={inputId}
            >
              {inputLabel}
            </label>
          )}

          <IMaskInput
            inputRef={ref}
            id={inputId}
            name={alias}
            {...({
              mask: Number,
              scale: activeCurrency.scale,
              signed: false,
              thousandsSeparator: ",",
              padFractionalZeros: true,
              normalizeZeros: true,
              radix: ".",
              mapToRadix: ['.']
            } as any)}
            value={fieldValue !== undefined && fieldValue !== null ? String(fieldValue) : ''}
            unmask={true}
            onAccept={(val: string) => {
              if (isFormik) activeContext.setFieldValue(alias, val);
              if (onChange) onChange(val);
            }}
            onFocus={handleFocus}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              setIsFocused(false);
              if (isFormik) activeContext.setFieldTouched(alias, true, false);
              if (onBlur) onBlur(e);
            }}
            readOnly={readOnly}
            placeholder={floatingLabel && !isFocused ? '' : placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${alias}-error` : undefined}
            inputMode="decimal"
            className={`mito-input-field has-currency ${icon ? `has-icon-${iconPosition}` : ''}`}
            style={{ textAlign: 'right' }} 
            {...props}
          />
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="mito-input-error-text" role="alert">
            <Icon name="error" width="12" height="12" aria-hidden="true" />
            {typeof displayError === 'string' ? displayError : "Invalid amount"}
          </span>
        )}
      </div>
    </Column>
  );
});

CurrencyInput.displayName = 'CurrencyInput';