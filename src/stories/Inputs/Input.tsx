"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Slot } from '@radix-ui/react-slot';
import { Tooltip } from '@radix-ui/themes';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface InputProps extends BaseInputProps {
  /** The standard HTML input type. @default "text" */
  type?: 'text' | 'email' | 'tel' | 'url' | 'search';
  /** Optional icon node rendered inside the input field. */
  icon?: React.ReactNode;
}

/**
 * @component Input
 * @description Master SSR-safe text input. Supports Neumorphic ambient-background matching, dynamic Formik injection, and global dark mode token overrides.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  alias,
  type = "text",
  inputLabel,
  design = 'outline',
  darkModeColors,
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
  icon,
  value,
  onChange,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = Boolean(activeContext);
  const fieldValue = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFormik) activeContext.handleChange(e);
    if (onChange) onChange(e.target.value);
  };

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

  const Component = asChild ? Slot : "input";

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`v-input-wrapper ${className}`}
        style={{
          ...style,
          ...neuVars,
          ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}),
        } as React.CSSProperties}
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
          {icon && <div style={{ marginRight: 8, display: 'flex', color: 'var(--gray-10)' }}>{icon}</div>}
          <Component
            ref={ref}
            id={`${alias}-input`}
            name={alias}
            type={type}
            value={fieldValue || ''}
            onChange={handleChange}
            onBlur={isFormik ? activeContext.handleBlur : undefined}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${alias}-error` : undefined}
            {...props}
          />
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Invalid input"}
          </span>
        )}
      </div>
    </Column>
  );
});

Input.displayName = 'Input';