"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Tooltip } from '@radix-ui/themes';
import { IMaskInput } from 'react-imask';
import cardValidator from "card-validator";
import { FaCcVisa } from '@react-icons/all-files/fa/FaCcVisa';
import { FaCcMastercard } from '@react-icons/all-files/fa/FaCcMastercard';
import { FaCcAmex } from '@react-icons/all-files/fa/FaCcAmex';
import { FaCcDiscover } from '@react-icons/all-files/fa/FaCcDiscover';
import { FaCcDinersClub } from '@react-icons/all-files/fa/FaCcDinersClub';
import { FaCcJcb } from '@react-icons/all-files/fa/FaCcJcb';
import { FaCreditCard } from '@react-icons/all-files/fa/FaCreditCard';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

/**
 * @component CreditCardInput
 * @description SSR-safe formatted payment input. Automatically detects card types via Regex and updates UI iconography dynamically.
 */
export const CreditCardInput = React.forwardRef<HTMLInputElement, BaseInputProps>(({
  alias,
  inputLabel,
  design = 'outline',
  darkModeColors,
  width = 12,
  newRow,
  placeholder = "0000 0000 0000 0000",
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

  const cardInfo = cardValidator.number(fieldValue);
  const cardType = cardInfo.card?.type; 
  const maskPattern = cardType === 'american-express' ? '0000 000000 00000' : '0000 0000 0000 0000';

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa': return <FaCcVisa color="#1A1F71" size="22" />;
      case 'mastercard': return <FaCcMastercard color="#EB001B" size="22" />;
      case 'american-express': return <FaCcAmex color="#006FCF" size="22" />;
      case 'discover': return <FaCcDiscover color="#FF6000" size="22" />;
      case 'diners-club': return <FaCcDinersClub color="#0079BE" size="22" />;
      case 'jcb': return <FaCcJcb color="#000" size="22" />;
      default: return <FaCreditCard color="var(--gray-8)" size="20" />;
    }
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
          <IMaskInput
            inputRef={ref}
            id={`${alias}-input`}
            name={alias}
            mask={maskPattern}
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
            inputMode="numeric"
            autoComplete="cc-number"
            style={{ flex: 1, fontFamily: 'var(--code-font-family, monospace)' }}
            {...props}
          />
          <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
            {getCardIcon()}
          </div>
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Invalid card"}
          </span>
        )}
      </div>
    </Column>
  );
});

CreditCardInput.displayName = 'CreditCardInput';