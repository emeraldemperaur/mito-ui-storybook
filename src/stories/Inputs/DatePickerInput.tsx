"use client";

import React, { useRef, useState, useEffect, type JSX, forwardRef, useId } from "react";
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useFormikContext, getIn, type FormikContextType } from "formik";
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type InputDesign } from "./Input";

/**
 * @interface DatePickerInputProps
 * @description Strongly-typed attributes extending numeric input behaviors with advanced date/time selection.
 * Optimized for MCP context-injection to ensure flawless form pipeline integration.
 */
export interface DatePickerInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type' | 'value' | 'onChange'> {
  /** 
   * @description Unique identifier mapping the input to its Formik state and DOM label. 
   * @required
   */
  alias: string;
  /** 
   * @description Structural mode altering the popover UI and standard data payload. 
   * - `date`: Standard calendar selection returning a JS Date object.
   * - `datetime`: Calendar + Timepicker returning a JS Date object.
   * - `daterange`: Standard calendar returning an object `{ from: Date | null, to: Date | null }` or array `[Date, Date]`.
   * @default 'date' 
   */
  mode?: 'date' | 'datetime' | 'daterange';
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
   * @description Optional icon node rendered inside the input field. Falls back to a default calendar/clock icon if omitted.
   */
  icon?: React.ReactNode;
  /** 
   * @description Determines if the optional generic icon is placed on the left (leading) or right (trailing).
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
   * @description Highlight color applied to the active/focused border and calendar highlights. 
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
   * @description External fallback state value for standalone non-Formik setups.
   */
  value?: Date | [Date | null, Date | null] | { from: Date | null, to: Date | null } | null;
  /** 
   * @description Standalone value callback for external state management. 
   */
  onChange?: (value: any) => void;
}

const CustomRadixInput = forwardRef<HTMLInputElement, any>((props, ref) => {
  const { radixId, radixStyle, hasError, design, icon, iconPosition, floatingLabel, isFloating, inputLabel, ...restProps } = props;
  
  const { placeholder, value, onClick, onChange, onFocus, onBlur, onKeyDown, readOnly, disabled } = restProps;
  
  const defaultIcon = props.mode === 'datetime' ? <Icon name="clock" height="16" width="16" /> : <Icon name="calendar" height="16" width="16" />;
  const activeIcon = icon || defaultIcon;

  return (
    <div className={`mito-input-base mito-input-${design} ${activeIcon ? `has-icon-${iconPosition}` : ''}`} data-error={hasError} onClick={onClick}>
      
      {activeIcon && (
        <div className={`mito-input-icon ${iconPosition}`}>
          {activeIcon}
        </div>
      )}
      
      {inputLabel && floatingLabel && (
        <label 
          className={`mito-input-floating-label ${isFloating ? 'floating' : ''} ${activeIcon && iconPosition === 'left' ? 'has-icon-left' : ''}`} 
          htmlFor={radixId}
        >
          {inputLabel}
        </label>
      )}

      <input
        ref={ref}
        id={radixId}
        type="text"
        className={`mito-input-field ${activeIcon ? `has-icon-${iconPosition}` : ''}`}
        style={radixStyle}
        autoComplete="off"
        placeholder={floatingLabel && !isFloating ? '' : placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        disabled={disabled}
      />
    </div>
  );
});
CustomRadixInput.displayName = "CustomRadixInput";

/**
 * @component DatePickerInput
 * @description Unified SSR-safe calendar input. Routes cleanly between standard Dates, DateTimes, and Object Ranges based on structural mode prop.
 * Shares exact visual parity with standard `Input` variants (Neumorphic, Skeuomorphic, Outline, Material) and handles Radix primitive tooltips natively.
 */
export const DatePickerInput = React.forwardRef<any, DatePickerInputProps>(({
  alias,
  inputLabel,
  floatingLabel = false,
  mode = 'date',
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
  placeholder = "Select date",
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
  onFocus,
  onBlur,
  ...props
}, _ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isFocused, setIsFocused] = useState(false);
  const internalId = useId();
  const inputId = `${alias}-input-${internalId}`;

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = Boolean(activeContext);
  const fieldVal = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  const isRange = mode === 'daterange';
  
  const getRangeDates = (): [Date | null, Date | null] => {
    if (!fieldVal) return [null, null];
    if (typeof fieldVal === 'object' && 'from' in fieldVal) {
      return [fieldVal.from ? new Date(fieldVal.from) : null, fieldVal.to ? new Date(fieldVal.to) : null];
    }
    if (Array.isArray(fieldVal)) {
      return [fieldVal[0] ? new Date(fieldVal[0]) : null, fieldVal[1] ? new Date(fieldVal[1]) : null];
    }
    return [null, null];
  };

  const [startDate, endDate] = isRange ? getRangeDates() : [null, null];
  const standardDate = !isRange && fieldVal ? new Date(fieldVal) : null;
  
  // A DatePicker has a value if it has a start date (or a standard date)
  const hasValue = isRange ? startDate !== null : standardDate !== null;
  const isFloating = floatingLabel && (isFocused || hasValue);

  const themeClass = darkMode ? 'mito-input-dark' : '';

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

  const handleDateChange = (dates: any) => {
    if (isRange && Array.isArray(dates)) {
      const [start, end] = dates;
      const payload = { from: start, to: end };
      if (isFormik) activeContext.setFieldValue(alias, payload);
      if (onChange) onChange(payload);
      if (start && end && isFormik) activeContext.setFieldTouched(alias, true, false);
    } else {
      if (isFormik) activeContext.setFieldValue(alias, dates);
      if (onChange) onChange(dates);
      if (isFormik) activeContext.setFieldTouched(alias, true, false);
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
    '--mito-input-active': activeColor || '#2563eb',
    '--mito-input-font': fontFamily,
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`mito-input-wrapper v-date-wrapper-${alias} ${themeClass} ${className}`}
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
            pointer-events: none;
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
            cursor: pointer;
          }
          .mito-input-field::placeholder { color: var(--scoped-placeholder); opacity: 1; transition: opacity 0.2s ease; }
          .mito-input-field:focus::placeholder { opacity: 0.5; }
          .mito-input-field:disabled { cursor: default; opacity: 0.7; }

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
          .mito-input-floating-label.has-icon-left { left: 38px; }
          .mito-input-floating-label.floating {
            top: 0;
            left: 10px;
            font-size: 0.75rem;
            color: var(--scoped-active);
            font-weight: 500;
          }
          .mito-input-floating-label.floating.has-icon-left { left: 10px; }
          .mito-input-outline[data-error="true"] .mito-input-floating-label.floating { color: var(--scoped-error); }

          /* --- Material Variant --- */
          .mito-input-material {
            background-color: transparent;
            border-bottom: 2px solid var(--scoped-border);
            border-radius: 4px 4px 0 0;
          }
          .mito-input-material .mito-input-field { padding: 8px 0; }
          .mito-input-material.has-icon-left .mito-input-field { padding-left: 32px !important; }
          .mito-input-material:focus-within {
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

          /* React DatePicker Internal Customization overrides */
          .v-date-wrapper-${alias} .react-datepicker-wrapper { width: 100%; display: block; } 
          .v-date-wrapper-${alias} .react-datepicker {
            font-family: inherit;
            border: 1px solid var(--scoped-border) !important;
            border-radius: 8px !important;
            background-color: var(--scoped-bg) !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            padding: 12px; 
            display: flex !important;
            animation: mito-fade-in 0.2s ease;
          }
          .v-date-wrapper-${alias}.mito-input-dark .react-datepicker {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
          }
          .v-date-wrapper-${alias} .react-datepicker__header { background-color: transparent !important; border-bottom: none !important; }
          .v-date-wrapper-${alias} .react-datepicker__current-month, 
          .v-date-wrapper-${alias} .react-datepicker-time__header, 
          .v-date-wrapper-${alias} .react-datepicker-year-header {
            color: var(--scoped-text) !important;
            font-weight: 600;
          }
          .v-date-wrapper-${alias} .react-datepicker__day-name { color: var(--scoped-placeholder); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
          
          .v-date-wrapper-${alias} .react-datepicker__day {
            width: 32px; height: 32px; line-height: 32px; border-radius: 50% !important; margin: 2px !important; color: var(--scoped-text); transition: all 0.2s;
          }
          .v-date-wrapper-${alias} .react-datepicker__day:hover { 
            background-color: var(--scoped-border) !important; 
          }
          
          /* Selected Logic */
          .v-date-wrapper-${alias} .react-datepicker__day--selected, 
          .v-date-wrapper-${alias} .react-datepicker__time-list-item--selected,
          .v-date-wrapper-${alias} .react-datepicker__day--keyboard-selected {
            background-color: var(--scoped-active) !important;
            color: #ffffff !important;
            font-weight: bold;
          }

          /* Range Logic */
          .v-date-wrapper-${alias} .react-datepicker__day--in-range {
            background-color: rgba(37, 99, 235, 0.15) !important; 
            color: var(--scoped-active) !important; 
            border-radius: 0 !important;
          }
          .v-date-wrapper-${alias} .react-datepicker__day--range-start { background-color: var(--scoped-active) !important; color: white !important; border-radius: 50% 0 0 50% !important; }
          .v-date-wrapper-${alias} .react-datepicker__day--range-end { background-color: var(--scoped-active) !important; color: white !important; border-radius: 0 50% 50% 0 !important; }
          .v-date-wrapper-${alias} .react-datepicker__day--range-start.react-datepicker__day--range-end { border-radius: 50% !important; }

          /* Timepicker Logic */
          .v-date-wrapper-${alias} .react-datepicker__time-container { border-left: 1px solid var(--scoped-border) !important; width: 110px !important; background: transparent !important; }
          .v-date-wrapper-${alias} .react-datepicker__header--time { background: transparent !important; padding-top: 10px; padding-bottom: 10px; }
          .v-date-wrapper-${alias} .react-datepicker__time-list-item { height: 32px !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 0.9rem !important; color: var(--scoped-text); transition: all 0.2s; }
          .v-date-wrapper-${alias} .react-datepicker__time-list-item:hover { 
            background-color: var(--scoped-border) !important;
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

        <ReactDatePicker
          id={inputId}
          disabled={readOnly || props.disabled}
          placeholderText={floatingLabel && !isFocused ? '' : placeholder}
          aria-labelledby={`${alias}-label`}
          
          {...({
            selectsRange: isRange,
            startDate: isRange ? startDate : undefined,
            endDate: isRange ? endDate : undefined,
            selected: isRange ? undefined : standardDate,
          } as any)}
          
          showTimeSelect={mode === 'datetime'}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat={mode === 'datetime' ? "MMM d, yyyy h:mm aa" : "MMM d, yyyy"}
          
          onChange={handleDateChange as any}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (isFormik) activeContext.setFieldTouched(alias, true, false);
            if (onBlur) onBlur(e);
          }}
          
          customInput={
            <CustomRadixInput 
              radixId={inputId}
              mode={mode}
              design={design}
              hasError={hasError}
              icon={icon}
              iconPosition={iconPosition}
              floatingLabel={floatingLabel}
              isFloating={isFloating}
              inputLabel={inputLabel}
              style={{ cursor: (readOnly || props.disabled) ? 'default' : 'pointer' }}
              {...(props as any)} 
            />
          }
        />

        {hasError && displayError && (
          <span id={`${alias}-error`} className="mito-input-error-text" role="alert">
            <Icon name="error" width="12" height="12" aria-hidden="true" />
            {typeof displayError === 'string' ? displayError : "Date selection required"}
          </span>
        )}
      </div>
    </Column>
  );
});

DatePickerInput.displayName = 'DatePickerInput';