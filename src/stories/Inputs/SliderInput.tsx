"use client";

import React, { useRef, useState, useEffect, type JSX, useContext, useId } from "react";
import { getIn, type FormikContextType, FormikContext } from "formik";
import { Slot } from '@radix-ui/react-slot';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { sharedInputStyles } from "./types";
import { type InputDesign } from "./Input";

/**
 * @interface SliderInputProps
 * @description Strongly-typed attributes mapping Formik or standalone state to a tactile slider.
 * Optimized for MCP context-injection to ensure flawless numeric/range scaling in complex pipelines.
 */
export interface SliderInputProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange' | 'value' | 'defaultValue'> {
  /** 
   * @description The reading direction of the slider track.
   * @default 'ltr'
   */
  dir?: 'ltr' | 'rtl';
  /** 
   * @description Unique identifier mapping the input to its Formik state and DOM label. 
   * @required
   */
  alias: string;
  /** 
   * @description Text rendered above the slider.
   */
  inputLabel?: string;
  /**
   * @description The core architectural design variant of the slider.
   * - `material`: Minimalist track with a vibrant floating handle.
   * - `outline`: Crisp bordered aesthetic.
   * - `neumorphic`: Soft, extruded physical track utilizing inset shadows.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical fader well.
   * @default 'outline'
   */
  design?: InputDesign;
  /** 
   * @description Determines if the slider captures a single integer or a dual-handle range tuple. 
   * @default 'single' 
   */
  mode?: 'single' | 'range';
  /** 
   * @description The minimum allowed numeric boundary. 
   * @default 0 
   */
  minvalue?: number;
  /** 
   * @description The maximum allowed numeric boundary. 
   * @default 100 
   */
  maxvalue?: number;
  /** 
   * @description The incremental stepping cadence of the track. 
   * @default 1 
   */
  stepvalue?: number;
  /** 
   * @description Minimum distance enforced between dual handles in 'range' mode. 
   * @default 0 
   */
  minStepsBetweenThumbs?: number;
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
   * @description Highlight color applied to the active/focused track range and handles. 
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
   * @description External fallback state numeric value (or tuple) for standalone non-Formik setups.
   */
  value?: number | number[];
  /** 
   * @description Delegates rendering to the immediate child element via Radix Slot. 
   */
  asChild?: boolean;
  /** 
   * @description Unmasked raw numeric value (or array of numbers) callback for external state management. 
   */
  onChange?: (value: number | number[]) => void;
}

/**
 * @component SliderInput
 * @description Unified SSR-safe tactile slider. Routes between standard and range modes with native Radix primitives, supporting Neumorphic ambient-background matching and global dark mode token overrides.
 */
export const SliderInput = React.forwardRef<HTMLSpanElement, SliderInputProps>(({
  alias,
  inputLabel,
  mode = 'single',
  design = 'outline',
  minvalue = 0,
  maxvalue = 100,
  stepvalue = 1,
  minStepsBetweenThumbs = 0,
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
  asChild,
  onChange,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties & Record<string, any>>({});
  const internalId = useId();
  const inputId = `${alias}-input-${internalId}`;

  const fallbackContext = useContext(FormikContext) as FormikContextType<any> | undefined;
  const activeContext = formikContext || fallbackContext;
    
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = activeContext !== undefined && typeof activeContext.setFieldValue === 'function';
  const fieldVal = isFormik ? getIn(activeContext!.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext!.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext!.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  const isRange = mode === 'range';
  const sliderValue: number[] = isRange 
    ? (Array.isArray(fieldVal) ? fieldVal : [minvalue, maxvalue]) 
    : [typeof fieldVal === 'number' ? fieldVal : minvalue];

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

  const Component = asChild ? Slot : "span";

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

          .mito-slider-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          .mito-input-label-static {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--scoped-text);
            display: flex;
            align-items: center;
            gap: 0.35rem;
          }

          .mito-slider-value {
            font-size: 0.875rem;
            font-weight: 700;
            color: var(--scoped-active);
            font-variant-numeric: tabular-nums;
          }
          .mito-input-wrapper[data-error="true"] .mito-slider-value { color: var(--scoped-error); }

          /* Radix Slider Base Styles */
          .mito-slider-root {
            position: relative;
            display: flex;
            align-items: center;
            user-select: none;
            touch-action: none;
            width: 100%;
            height: 20px;
            margin-top: 4px;
          }
          .mito-slider-root[data-disabled] { opacity: 0.7; pointer-events: none; }
          
          .mito-slider-track {
            background-color: var(--scoped-border);
            position: relative;
            flex-grow: 1;
            border-radius: 9999px;
            height: 4px;
            transition: background-color 0.2s;
          }
          
          .mito-slider-range {
            position: absolute;
            background-color: var(--scoped-active);
            border-radius: 9999px;
            height: 100%;
            transition: background-color 0.2s;
          }
          .mito-input-wrapper[data-error="true"] .mito-slider-range { background-color: var(--scoped-error); }

          .mito-slider-thumb {
            display: block;
            width: 20px;
            height: 20px;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 50%;
            border: 2px solid var(--scoped-active);
            transition: border-color 0.2s, transform 0.1s;
            cursor: grab;
          }
          .mito-slider-thumb:hover { transform: scale(1.05); }
          .mito-slider-thumb:active { cursor: grabbing; transform: scale(0.95); }
          .mito-slider-thumb:focus-visible { outline: 2px solid var(--scoped-active); outline-offset: 2px; }
          .mito-input-wrapper[data-error="true"] .mito-slider-thumb { border-color: var(--scoped-error); }

          /* --- Outline Variant --- */
          .mito-slider-outline .mito-slider-track { background-color: rgba(156, 163, 175, 0.2); border: 1px solid var(--scoped-border); height: 6px; }

          /* --- Material Variant --- */
          .mito-slider-material .mito-slider-track { height: 2px; background-color: rgba(156, 163, 175, 0.3); border-radius: 0; }
          .mito-slider-material .mito-slider-range { border-radius: 0; }
          .mito-slider-material .mito-slider-thumb {
            background-color: var(--scoped-active);
            border: none;
            width: 16px;
            height: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .mito-input-wrapper[data-error="true"] .mito-slider-material .mito-slider-thumb { background-color: var(--scoped-error); }

          /* --- Neumorphic Variant --- */
          .mito-slider-neumorphic .mito-slider-track {
            background-color: var(--mito-input-bg-env);
            height: 8px;
            box-shadow: inset 2px 2px 5px var(--mito-input-shadow-dark), inset -2px -2px 5px var(--mito-input-shadow-light);
            border: 1px solid transparent;
          }
          .mito-input-wrapper[data-error="true"] .mito-slider-neumorphic .mito-slider-track { border-color: var(--scoped-error); }
          .mito-slider-neumorphic .mito-slider-thumb {
            background-color: var(--mito-input-bg-env);
            border: 2px solid var(--mito-input-bg-env);
            width: 24px;
            height: 24px;
            box-shadow: 3px 3px 6px var(--mito-input-shadow-dark), -3px -3px 6px var(--mito-input-shadow-light);
          }
          .mito-slider-neumorphic .mito-slider-thumb:active { box-shadow: inset 2px 2px 4px var(--mito-input-shadow-dark), inset -2px -2px 4px var(--mito-input-shadow-light); }
          .mito-input-wrapper[data-error="true"] .mito-slider-neumorphic .mito-slider-thumb { border-color: var(--scoped-error); }

          /* --- Skeuomorphic Variant --- */
          .mito-slider-skeuomorphic .mito-slider-track {
            background-color: var(--mito-input-bg-env);
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0) 100%);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.3);
            height: 8px;
          }
          .mito-input-wrapper.mito-input-dark .mito-slider-skeuomorphic .mito-slider-track {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 100%);
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.1);
          }
          .mito-input-wrapper[data-error="true"] .mito-slider-skeuomorphic .mito-slider-track { border-color: var(--scoped-error); box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 1px var(--scoped-error); }
          .mito-slider-skeuomorphic .mito-slider-range {
            background-image: linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 100%);
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.5);
          }
          .mito-slider-skeuomorphic .mito-slider-thumb {
            background-color: var(--mito-input-bg-env);
            background-image: linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0.1) 100%);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,1);
            border: 1px solid rgba(0,0,0,0.3);
            width: 20px;
            height: 20px;
          }
          .mito-slider-skeuomorphic .mito-slider-thumb::after {
            content: '';
            position: absolute;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 6px; height: 6px; border-radius: 50%;
            background-color: var(--scoped-active);
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
          }
          .mito-input-wrapper[data-error="true"] .mito-slider-skeuomorphic .mito-slider-thumb { border-color: var(--scoped-error); }
          .mito-input-wrapper[data-error="true"] .mito-slider-skeuomorphic .mito-slider-thumb::after { background-color: var(--scoped-error); }

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
        
        <div className="mito-slider-header" data-error={hasError}>
          {inputLabel && (
            <div className="mito-input-label-static" id={`${alias}-label`}>
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
            </div>
          )}
          <span className="mito-slider-value">
            {isRange ? sliderValue.join(' - ') : sliderValue[0]}
          </span>
        </div>

        <Component>
          <SliderPrimitive.Root 
            ref={ref as any}
            id={inputId} 
            name={alias}
            disabled={readOnly}
            aria-labelledby={inputLabel ? `${alias}-label` : undefined}
            aria-label={!inputLabel ? alias : undefined} 
            min={minvalue} 
            max={maxvalue} 
            step={stepvalue}
            minStepsBetweenThumbs={minStepsBetweenThumbs}
            value={sliderValue}
            onValueChange={(val) => {
              const finalVal = isRange ? val : val[0];
              if (isFormik) activeContext.setFieldValue(alias, finalVal);
              if (onChange) onChange(finalVal);
            }}
            onValueCommit={() => isFormik && activeContext.setFieldTouched(alias, true, false)}
            className={`mito-slider-root mito-slider-${design}`}
            {...props}
          >
            <SliderPrimitive.Track className="mito-slider-track">
              <SliderPrimitive.Range className="mito-slider-range" />
            </SliderPrimitive.Track>
            
            <SliderPrimitive.Thumb 
              className="mito-slider-thumb" 
              aria-label={isRange ? "Minimum value" : (inputLabel || alias)} 
            />
            {isRange && (
              <SliderPrimitive.Thumb 
                className="mito-slider-thumb" 
                aria-label="Maximum value" 
              />
            )}
          </SliderPrimitive.Root>
        </Component>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="mito-input-error-text" role="alert">
            <Icon name="error" width="12" height="12" aria-hidden="true" />
            {typeof displayError === 'string' ? displayError : "Value out of bounds"}
          </span>
        )}
      </div>
    </Column>
  );
});

SliderInput.displayName = 'SliderInput';