"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Tooltip } from '@radix-ui/themes';
import { IMaskInput } from 'react-imask';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface NumberInputProps extends BaseInputProps {
  /** Number of decimal places to enforce. @default 2 */
  decimals?: number;
  /** Permits negative numbers. @default false */
  allowNegative?: boolean;
}

/**
 * @component NumberInput
 * @description Advanced numerical input engine. Forces exact floating-point layouts and blocks invalid characters natively.
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(({
  alias,
  decimals = 2,
  allowNegative = false,
  inputLabel,
  design = 'outline',
  darkModeColors,
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
  }, [design]);

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`v-input-wrapper ${className}`}
        style={{ ...style, ...neuVars, ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}) } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles }} />
        
        {inputLabel && (
          <label className="v-input-label" htmlFor={`${alias}-input`}>
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

        <div className={`v-input-base v-input-${design}`} data-error={hasError}>
          <IMaskInput
            inputRef={ref}
            id={`${alias}-input`}
            name={alias}
            {...({
              mask: Number,
              scale: decimals,
              signed: allowNegative,
              thousandsSeparator: ",",
              padFractionalZeros: decimals > 0,
              normalizeZeros: true,
              radix: ".",
              mapToRadix: ['.']
            } as any)}
            value={fieldValue !== undefined && fieldValue !== null ? String(fieldValue) : ''}
            unmask={true}
            onAccept={(val) => {
              if (isFormik) activeContext.setFieldValue(alias, val);
              if (onChange) onChange(val);
            }}
            onBlur={() => {
              if (isFormik) activeContext.setFieldTouched(alias, true, false);
            }}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${alias}-error` : undefined}
            style={{ textAlign: 'right', fontFamily: 'var(--code-font-family, monospace)' }}
            {...props}
          />
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Invalid number"}
          </span>
        )}
      </div>
    </Column>
  );
});

NumberInput.displayName = 'NumberInput';