"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Text, Checkbox as RadixCheckbox, Grid, Tooltip } from '@radix-ui/themes';
import { adjustColor, getNearestParentBackground, type InputOption } from "../../utils/Vinci";
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";

export interface CheckboxGroupProps extends BaseInputProps {
  /** Array of structured objects determining the available checkbox selections. */
  options: InputOption[];
  /** Directional flow of the checkbox layout grid. @default 'row' */
  direction?: 'row' | 'column';
  /** Explicit CSS Grid template column definitions (e.g. "1fr 1fr"). */
  columns?: string;
}

/**
 * @component CheckboxGroupInput
 * @description Multi-selection array mapped to strict form states. Supports Outline, Material, and Neumorphic designs.
 */
export const CheckboxGroupInput = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(({
  alias,
  inputLabel,
  options,
  design = 'outline',
  direction = 'row',
  columns,
  elevation = 3,
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

  const currentValues = (Array.isArray(fieldValue) ? fieldValue : []) as string[];

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

  const handleCheckedChange = (checked: boolean, val: string) => {
    let newValues = [...currentValues];
    if (checked) {
      newValues.push(val);
    } else {
      newValues = newValues.filter(v => String(v) !== String(val));
    }
    
    if (isFormik) activeContext.setFieldValue(alias, newValues);
    if (onChange) onChange(newValues);
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
        
        {/* Dynamic Radix Primitive Overrides */}
        <style dangerouslySetInnerHTML={{__html: `
          .check-${alias}-outline { 
            background-color: transparent; border: 2px solid var(--gray-8); border-radius: 4px;
            width: 20px; height: 20px; transition: all 0.2s ease; margin-right: 8px;
          }
          .check-${alias}-outline[data-state='checked'] { border-color: var(--ui-brand-color, var(--blue-9)); }
          
          .check-${alias}-material { 
            background-color: var(--gray-4); border: none; border-radius: 4px;
            width: 20px; height: 20px; transition: all 0.2s ease; margin-right: 8px;
          }
          .check-${alias}-material[data-state='checked'] { background-color: var(--ui-brand-color, var(--blue-9)); }
          
          .check-${alias}-neumorphic { 
            background-color: var(--neu-bg); border: none; border-radius: 6px;
            box-shadow: ${elevation}px ${elevation}px ${elevation*2}px var(--neu-shadow-dark), -${elevation}px -${elevation}px ${elevation*2}px var(--neu-shadow-light);
            width: 22px; height: 22px; transition: all 0.2s ease; margin-right: 8px;
          }
          .check-${alias}-neumorphic[data-state='checked'] {
            box-shadow: inset 2px 2px 4px var(--neu-shadow-dark), inset -2px -2px 4px var(--neu-shadow-light);
          }

          .check-${alias}-outline .rt-CheckboxIndicator, .check-${alias}-neumorphic .rt-CheckboxIndicator { color: var(--ui-brand-color, var(--blue-9)); }
          .check-${alias}-material .rt-CheckboxIndicator { color: white; }
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

        <Grid ref={ref as any} width="100%" columns={columns || (direction === 'row' ? 'repeat(auto-fit, minmax(120px, 1fr))' : '1')} gap="3" role="group" aria-labelledby={`${alias}-label`} {...props}>
          {options.map((opt) => {
            const isChecked = currentValues.some(val => String(val) === String(opt.optionvalue));
            return (
              <Text as="label" key={opt.optionid} size="2" style={{ display: 'flex', alignItems: 'center', cursor: readOnly ? 'default' : 'pointer' }}>
                <RadixCheckbox 
                  name={alias}
                  disabled={readOnly}
                  value={String(opt.optionvalue)}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleCheckedChange(checked as boolean, String(opt.optionvalue))}
                  className={`check-${alias}-${design}`}
                />
                <span style={{ userSelect: 'none' }}>{opt.text}</span>
              </Text>
            );
          })}
        </Grid>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Selection required"}
          </span>
        )}
      </div>
    </Column>
  );
});

CheckboxGroupInput.displayName = 'CheckboxGroupInput';