"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Flex, Text, RadioGroup, Grid, Tooltip } from '@radix-ui/themes';
import { adjustColor, getNearestParentBackground, type InputOption } from "../../utils/Vinci";
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface RadioGroupProps extends BaseInputProps {
  /** Array of structured objects determining the available radio selections. */
  options: InputOption[];
  /** Directional flow of the radio layout grid. @default 'column' */
  direction?: 'row' | 'column';
  /** Explicit CSS Grid template column definitions (e.g. "1fr 1fr"). */
  columns?: string;
}

/**
 * @component RadioGroupInput
 * @description Single-selection group mapping values to strict AI constraints. Supports Outline, Material, and Neumorphic designs.
 */
export const RadioGroupInput = React.forwardRef<HTMLDivElement, RadioGroupProps>(({
  alias,
  inputLabel,
  options,
  design = 'outline',
  direction = 'column',
  columns,
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
  const fieldValue = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = getNearestParentBackground(containerRef.current.parentElement);
      setNeuVars({
        '--neu-bg': parentBg,
        '--neu-shadow-dark': adjustColor(parentBg, -15), 
        '--neu-shadow-light': adjustColor(parentBg, 15),
      } as React.CSSProperties);
    }
  }, [design, elevation]);

  const handleValueChange = (val: string) => {
    if (isFormik) activeContext.setFieldValue(alias, val);
    if (onChange) onChange(val);
    setTimeout(() => isFormik && activeContext.setFieldTouched(alias, true, false), 0);
  };

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`v-input-wrapper ${className}`}
        style={{ ...style, ...neuVars, ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}) } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles }} />
        
        <style dangerouslySetInnerHTML={{__html: `
          .radio-${alias}-outline { 
            background-color: transparent; border: 2px solid var(--gray-8); 
            width: 20px; height: 20px; transition: all 0.2s ease; margin-right: 8px;
          }
          .radio-${alias}-outline[data-state='checked'] { border-color: var(--ui-brand-color, var(--blue-9)); }
          
          .radio-${alias}-material { 
            background-color: var(--gray-4); border: none; 
            width: 20px; height: 20px; transition: all 0.2s ease; margin-right: 8px;
          }
          .radio-${alias}-material[data-state='checked'] { background-color: var(--ui-brand-color, var(--blue-9)); }
          
          .radio-${alias}-neumorphic { 
            background-color: var(--neu-bg); border: none;
            box-shadow: ${elevation}px ${elevation}px ${elevation*2}px var(--neu-shadow-dark), -${elevation}px -${elevation}px ${elevation*2}px var(--neu-shadow-light);
            width: 22px; height: 22px; transition: all 0.2s ease; margin-right: 8px;
          }
          .radio-${alias}-neumorphic[data-state='checked'] {
            box-shadow: inset 2px 2px 4px var(--neu-shadow-dark), inset -2px -2px 4px var(--neu-shadow-light);
          }

          /* Universal Indicator Color */
          .radio-${alias}-outline .rt-RadioGroupIndicator, .radio-${alias}-neumorphic .rt-RadioGroupIndicator {
             background-color: var(--ui-brand-color, var(--blue-9)); width: 10px; height: 10px; border-radius: 50%;
          }
          .radio-${alias}-material .rt-RadioGroupIndicator {
             background-color: white; width: 8px; height: 8px; border-radius: 50%;
          }
        `}} />

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

        <RadioGroup.Root 
          ref={ref}
          name={alias}
          aria-labelledby={`${alias}-label`}
          disabled={readOnly}
          value={fieldValue !== undefined && fieldValue !== null ? String(fieldValue) : ""}
          onValueChange={handleValueChange}
          style={{ width: '100%' }}
          {...props}
        >
          <Grid width="100%" columns={columns || (direction === 'row' ? 'repeat(auto-fit, minmax(100px, 1fr))' : '1')} gap="3">
            {options.map((opt) => (
              <Flex asChild key={opt.optionid} align="center" style={{ cursor: readOnly ? 'default' : 'pointer' }}>
                <Text as="label" size="2">
                  <RadioGroup.Item value={String(opt.optionvalue)} className={`radio-${alias}-${design}`} />
                  <span style={{ userSelect: 'none' }}>{opt.text}</span>
                </Text>
              </Flex>
            ))}
          </Grid>
        </RadioGroup.Root>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Selection required"}
          </span>
        )}
      </div>
    </Column>
  );
});

RadioGroupInput.displayName = 'RadioGroupInput';