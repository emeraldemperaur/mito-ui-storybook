"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Select, Tooltip, Flex, Text } from '@radix-ui/themes';
import { IMaskInput } from 'react-imask';
import { CURRENCIES, type SupportedCurrency, type CurrencyOption } from '../../utils/CurrencyConfig'; 
import { FlagIcon } from "../../components/icons/FlagIcon";
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface CurrencyInputProps extends BaseInputProps {
  /** Target local currency baseline configuration. @default "USD" */
  defaultCurrency?: SupportedCurrency;
}

/**
 * @component CurrencyInput
 * @description Advanced financial evaluation input. Combines a native Radix Select primitive for localized rate mapping with strict floating-point numerical masking.
 */
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(({
  alias,
  inputLabel,
  design = 'outline',
  defaultCurrency = "USD",
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
  const currencyAlias = `${alias}Currency`; 
  
  const fieldValue = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  const currencyFieldValue = isFormik ? getIn(activeContext.values, currencyAlias) : defaultCurrency;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  const currentCode = (currencyFieldValue as SupportedCurrency) || "USD";
  const activeCurrency = CURRENCIES[currentCode] || CURRENCIES.USD;

  useEffect(() => {
    if (isFormik && !currencyFieldValue) {
      activeContext.setFieldValue(currencyAlias, defaultCurrency);
    }
  }, [isFormik, currencyFieldValue, currencyAlias, defaultCurrency, activeContext]);

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

        <div className={`v-input-base v-input-${design}`} data-error={hasError} style={{ paddingLeft: 0 }}>
          
          {/* Radix Select Integration */}
          <Select.Root 
            value={activeCurrency.code} 
            name={currencyAlias}
            onValueChange={(val) => isFormik ? activeContext.setFieldValue(currencyAlias, val) : null}  
            disabled={readOnly} 
          >
            <Select.Trigger 
              variant="ghost" 
              style={{ height: '100%', padding: '0 8px 0 12px', borderRadius: 'inherit', borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: 'var(--gray-3)' }}
            >
              <Flex align="center" gap="2">
                <FlagIcon country={activeCurrency.country} />
                <Text weight="bold" size="2">{activeCurrency.code}</Text>
              </Flex>
            </Select.Trigger>
            <Select.Content position="popper">
              {Object.values(CURRENCIES).map((c: CurrencyOption) => (
                <Select.Item key={c.code} value={c.code}>
                  <Flex align="center" gap="2">
                    <FlagIcon country={c.country} />
                    <Text>{c.code}</Text>
                    <Text color="gray" size="1">({c.symbol})</Text>
                  </Flex>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Text color="gray" size="2" style={{ paddingLeft: '12px', userSelect: 'none' }}>
            {activeCurrency.symbol}
          </Text>

          <IMaskInput
            inputRef={ref}
            id={`${alias}-input`}
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
            inputMode="decimal"
            style={{ textAlign: 'right', flex: 1, paddingRight: '12px' }}
            {...props}
          />
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Invalid amount"}
          </span>
        )}
      </div>
    </Column>
  );
});

CurrencyInput.displayName = 'CurrencyInput';