"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Tooltip, IconButton } from '@radix-ui/themes';
import { EyeOpenIcon, EyeNoneIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

/**
 * @component PasswordInput
 * @description Secure credential field. Includes a native semantic visibility toggle button mapped securely to accessibility trees.
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, BaseInputProps>(({
  alias,
  inputLabel,
  design = 'outline',
  darkModeColors,
  width = 12,
  newRow,
  placeholder = "••••••••",
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
  const [showPassword, setShowPassword] = useState(false);

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  
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
          <div style={{ marginRight: 8, display: 'flex', color: 'var(--gray-10)' }}>
            <LockClosedIcon width="16" height="16" />
          </div>
          <input
            ref={ref}
            id={`${alias}-input`}
            name={alias}
            type={showPassword ? "text" : "password"}
            value={fieldValue || ''}
            onChange={handleChange}
            onBlur={isFormik ? activeContext.handleBlur : undefined}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${alias}-error` : undefined}
            autoComplete="current-password"
            {...props}
          />
          <Tooltip content={showPassword ? "Hide password" : "Show password"}>
            <IconButton 
              type="button"
              variant="ghost" 
              color="gray"
              size="1"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{ margin: 0, marginLeft: 8 }}
            >
              {showPassword ? <EyeOpenIcon width="16" height="16" /> : <EyeNoneIcon width="16" height="16" />}
            </IconButton>
          </Tooltip>
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Invalid password"}
          </span>
        )}
      </div>
    </Column>
  );
});

PasswordInput.displayName = 'PasswordInput';