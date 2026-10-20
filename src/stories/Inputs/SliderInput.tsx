"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Flex, Text, Slider as RadixSlider, Tooltip } from '@radix-ui/themes';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface SliderInputProps extends BaseInputProps {
  /** Determines if the slider captures a single integer or a dual-handle range tuple. @default 'single' */
  mode?: 'single' | 'range';
  /** The minimum allowed numeric boundary. @default 0 */
  minvalue?: number;
  /** The maximum allowed numeric boundary. @default 100 */
  maxvalue?: number;
  /** The incremental stepping cadence of the track. @default 1 */
  stepvalue?: number;
  /** Minimum distance enforced between dual handles in 'range' mode. @default 0 */
  minStepsBetweenThumbs?: number;
}

/**
 * @component SliderInput
 * @description Unified SSR-safe tactile slider. Supports standard and range modes with Material, Outline, and Neumorphic 3D designs.
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
  elevation = 3,
  surface = 'flat',         
  lightSource = 'top-left', 
  darkModeColors,
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
  defaultValue, 
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  
  const isFormik = Boolean(activeContext);
  const fieldVal = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  // Type-safe value parsing based on mode
  const isRange = mode === 'range';
  const sliderValue: number[] = isRange 
    ? (Array.isArray(fieldVal) ? fieldVal : [minvalue, maxvalue]) 
    : [typeof fieldVal === 'number' ? fieldVal : minvalue];

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = getNearestParentBackground(containerRef.current.parentElement);
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;

      setNeuVars({
        '--neu-bg': parentBg,
        '--neu-shadow-dark': adjustColor(parentBg, -20), 
        '--neu-shadow-light': adjustColor(parentBg, 20),
        '--neu-x': `${x}px`,
        '--neu-y': `${y}px`,
        '--neu-blur': `${elevation * 2}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource]);

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`v-input-wrapper ${className}`}
        style={{ ...style, ...neuVars, ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}) } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles }} />
        
        <style dangerouslySetInnerHTML={{__html: `
          .slider-${alias}-neumorphic .rt-SliderTrack {
            background-color: var(--neu-bg); height: 8px;
            box-shadow: inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light);
          }
          .slider-${alias}-neumorphic .rt-SliderRange { background-color: var(--ui-brand-color, var(--blue-9)); }
          .slider-${alias}-neumorphic .rt-SliderThumb {
            background-color: var(--neu-bg); border: 2px solid var(--neu-bg);
            width: 24px; height: 24px;
            box-shadow: var(--neu-x) var(--neu-y) var(--neu-blur) var(--neu-shadow-dark), 
                        calc(var(--neu-x) * -1) calc(var(--neu-y) * -1) var(--neu-blur) var(--neu-shadow-light);
            transition: transform 0.1s;
          }
          .slider-${alias}-neumorphic .rt-SliderThumb:hover { transform: scale(1.1); cursor: grab; }
          .slider-${alias}-neumorphic .rt-SliderThumb:active { transform: scale(0.95); cursor: grabbing; box-shadow: inset 2px 2px 4px var(--neu-shadow-dark), inset -2px -2px 4px var(--neu-shadow-light); }

          .slider-${alias}-outline .rt-SliderTrack { height: 4px; background-color: var(--gray-4); border: 1px solid var(--gray-6); }
          .slider-${alias}-outline .rt-SliderRange { background-color: var(--ui-brand-color, var(--blue-9)); }
          .slider-${alias}-outline .rt-SliderThumb { background-color: white; border: 2px solid var(--ui-brand-color, var(--blue-9)); }

          .slider-${alias}-material .rt-SliderTrack { height: 2px; background-color: var(--gray-6); }
          .slider-${alias}-material .rt-SliderRange { background-color: var(--ui-brand-color, var(--blue-9)); }
          .slider-${alias}-material .rt-SliderThumb { background-color: var(--ui-brand-color, var(--blue-9)); width: 16px; height: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        `}} />

        <Flex justify="between" align="center" style={{ marginBottom: '4px' }}>
          {inputLabel && (
            <label className="v-input-label" id={`${alias}-label`}>
              {inputLabel}
              {isHinted && (
                <Tooltip content={hintText || "Information"} align="start">
                  <a href={hintUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <Icon name="questionmarkcircled" height="14" width="14" style={{ color: 'var(--gray-9)' }} />
                  </a>
                </Tooltip>
              )}
            </label>
          )}
          <Text size="2" weight="bold" color="gray" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--ui-brand-color, var(--blue-9))' }}>
            {isRange ? sliderValue.join(' - ') : sliderValue[0]}
          </Text>
        </Flex>

        <RadixSlider 
          ref={ref as any}
          name={alias}
          disabled={readOnly}
          aria-labelledby={`${alias}-label`}
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
          className={`slider-${alias}-${design}`}
          {...(props as any)}
        />

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Value required"}
          </span>
        )}
      </div>
    </Column>
  );
});

SliderInput.displayName = 'SliderInput';