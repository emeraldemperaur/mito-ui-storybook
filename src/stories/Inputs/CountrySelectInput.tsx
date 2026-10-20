"use client";

import React, { useRef, useState, useEffect, useMemo, type JSX } from 'react';
import { Popover, Flex, Text, Checkbox, ScrollArea, Box, Tooltip, TextField } from '@radix-ui/themes';
import { useFormikContext, getIn } from 'formik';
import { getCountries } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en.json';
import type { Country } from 'react-phone-number-input';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Icon } from '../../components/icons/Icons';
import { FlagIcon } from "../../components/icons/FlagIcon";
import { Column } from '../Layout/Column';
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface CountrySelectProps extends BaseInputProps {
  /** Option to render the country flag icon next to the country name. @default true */
  displayFlag?: boolean;
  /** Option to allow multiple country selections. @default false */
  multiselect?: boolean;
  /** Option to enable search bar inside the CountrySelect to filter countries. @default false */
  enableSearch?: boolean;
  /** Explicit placeholder text. @default "Select Country..." */
  placeholder?: string;
}

/**
 * @component CountrySelectInput
 * @description Multi-variant Country Selector. Supports Material, Outline, and Neumorphic designs.
 */
export const CountrySelectInput = React.forwardRef<HTMLButtonElement, CountrySelectProps>(({
  alias,
  inputLabel,
  design = 'outline',
  elevation = 3,
  surface = 'flat',         
  lightSource = 'top-left', 
  darkModeColors,
  width = 12,
  newRow,
  placeholder = 'Select Country...',
  readOnly,
  isHinted,
  hintText,
  hintUrl,
  errorText,
  displayFlag = true,
  multiselect = false,
  enableSearch = false,
  className = "",
  style,
  formikContext,
  value,
  onChange,
  // Plucked leaky props
  defaultValue,
  ...props
}, ref): JSX.Element => {
  
  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;

  const isFormik = Boolean(activeContext);
  const fieldValue = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;

  const selectedValues: string[] = useMemo(() => {
      if (multiselect) return Array.isArray(fieldValue) ? fieldValue : [];
      return fieldValue ? [String(fieldValue)] : [];
  }, [fieldValue, multiselect]);

  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allCountries = useMemo(() => getCountries().map((c: Country) => ({ value: c, label: en[c] })), []);

  const filteredCountries = useMemo(() => {
      if (!enableSearch || !searchQuery) return allCountries;
      const lowerSearch = searchQuery.toLowerCase();
      return allCountries.filter((c: { value: string; label: string }) => c.label.toLowerCase().includes(lowerSearch));
  }, [allCountries, searchQuery, enableSearch]);

  const handleSelection = (countryCode: string) => {
      if (multiselect) {
          const newValues = selectedValues.includes(countryCode)
              ? selectedValues.filter((v) => v !== countryCode)
              : [...selectedValues, countryCode];
          if (isFormik) activeContext.setFieldValue(alias, newValues);
          if (onChange) onChange(newValues);
      } else {
          if (isFormik) activeContext.setFieldValue(alias, countryCode);
          if (onChange) onChange(countryCode);
          setIsOpen(false);
      }
      setTimeout(() => isFormik && activeContext.setFieldTouched(alias, true, false), 0);
  };

  const displayLabel = useMemo(() => {
      if (selectedValues.length === 0) return placeholder;
      if (!multiselect) {
          const c = allCountries.find((x: { value: string; label: string }) => x.value === selectedValues[0]);
          return c ? c.label : selectedValues[0];
      }
      if (selectedValues.length <= 2) {
          return selectedValues.map(v => allCountries.find((x: { value: string; label: string }) => x.value === v)?.label || v).join(', ');
      }
      return `${selectedValues.length} countries selected`;
  }, [selectedValues, multiselect, allCountries, placeholder]);

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = getNearestParentBackground(containerRef.current.parentElement);
      setNeuVars({
        '--neu-bg': parentBg,
        '--neu-shadow-dark': adjustColor(parentBg, -30),
        '--neu-shadow-light': adjustColor(parentBg, 30),
      } as React.CSSProperties);
    }
  }, [design, elevation]);

  useEffect(() => {
      if (!isOpen) setSearchQuery("");
  }, [isOpen]);

  const baseTrigger: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
    cursor: readOnly ? 'default' : 'pointer', textAlign: 'left', padding: '0 12px',
    whiteSpace: 'nowrap', overflow: 'hidden', boxSizing: 'border-box', opacity: readOnly ? 0.7 : 1,
  };

  const materialTrigger: React.CSSProperties = {
    ...baseTrigger, backgroundColor: 'var(--color-surface)',
    border: hasError ? '1px solid var(--red-9)' : 'none',
    borderBottom: hasError ? '2px solid var(--red-9)' : '2px solid var(--gray-7)',
    borderRadius: '4px 4px 0 0', height: '36px', fontWeight: 500,
  };

  const outlineTrigger: React.CSSProperties = {
    ...baseTrigger, backgroundColor: 'transparent',
    border: hasError ? '2px solid var(--red-9)' : '1px solid var(--gray-7)',
    borderRadius: '6px', height: '36px', fontWeight: 500,
  };

  const neumorphicTrigger: React.CSSProperties = {
    ...baseTrigger, backgroundColor: 'var(--neu-bg)', border: 'none', borderRadius: '12px', height: '44px', fontWeight: 600,
    boxShadow: isOpen 
      ? 'inset 6px 6px 12px var(--neu-shadow-dark), inset -6px -6px 12px var(--neu-shadow-light)'
      : '6px 6px 12px var(--neu-shadow-dark), -6px -6px 12px var(--neu-shadow-light)',
    transition: 'all 0.2s ease',
  };

  const activeTrigger = 
    design === 'material' ? materialTrigger :
    design === 'neumorphic' ? { ...neumorphicTrigger, ...neuVars } :
    outlineTrigger;

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef} 
        className={`v-input-wrapper ${className}`}
        style={{ ...style, ...neuVars, ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}) } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles }} />
        
        {inputLabel && (
          <label className="v-input-label" id={`${alias}-label`} htmlFor={`${alias}-trigger`}>
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

        <Popover.Root open={isOpen} onOpenChange={(open) => {
            if (readOnly) return;
            setIsOpen(open);
            if(!open && isFormik) activeContext.setFieldTouched(alias, true, false);
        }}>
          <Popover.Trigger>
            <button
              id={`${alias}-trigger`}
              ref={ref as any}
              type="button" 
              className="v-input-base"
              style={activeTrigger}
              aria-describedby={`${alias}-label`}
              aria-invalid={hasError}
              disabled={readOnly}
              {...(props as any)}
            >
              <Flex align="center" gap="3" style={{ minWidth: 0, flex: 1 }}>                
                  {!multiselect && displayFlag && selectedValues.length === 1 && (
                      <FlagIcon country={selectedValues[0] as Country} />
                  )}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: selectedValues.length === 0 ? 'var(--gray-9)' : 'inherit' }}>
                      {displayLabel}
                  </span>
              </Flex>
              <Icon name='chevrondown' style={{ flexShrink: 0, opacity: 0.5, marginLeft: 8 }} />
            </button>
          </Popover.Trigger>

          <Popover.Content 
            align="start" 
            sideOffset={8}
            style={{ 
              width: containerRef.current?.offsetWidth || 240, padding: 0,
              backgroundColor: design === 'neumorphic' ? 'var(--neu-bg)' : 'var(--color-panel-solid)',
              boxShadow: design === 'neumorphic' 
                  ? '6px 6px 12px var(--neu-shadow-dark), -6px -6px 12px var(--neu-shadow-light)'
                  : (design === 'material' ? '0 4px 12px rgba(0,0,0,0.15)' : undefined),
              border: design === 'outline' ? '1px solid var(--gray-7)' : 'none',
              borderRadius: design === 'neumorphic' ? '12px' : '6px',
            }}
          >
            {enableSearch && (
                <Box p="2" style={{ borderBottom: design === 'neumorphic' ? '1px solid rgba(0,0,0,0.05)' : '1px solid var(--gray-6)' }}>
                    <TextField.Root 
                        placeholder="Search countries..." 
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        variant={design === 'neumorphic' ? 'soft' : 'surface'}
                    >
                        <TextField.Slot>
                            <Icon name="search" height="14" width="14" style={{ opacity: 0.5 }} />
                        </TextField.Slot>
                    </TextField.Root>
                </Box>
            )}

            <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 300 }}>
              <Box p="2">
                <Flex direction="column">
                  {filteredCountries.length === 0 ? (
                      <Text size="2" color="gray" align="center" style={{ padding: '16px 0' }}>No countries found.</Text>
                  ) : (
                      filteredCountries.map((country: { value: string; label: string }) => {
                          const isSelected = selectedValues.includes(country.value);
                          return (
                              <Flex 
                                  key={country.value} 
                                  align="center" 
                                  gap="3"
                                  onClick={() => handleSelection(country.value)}
                                  style={{
                                    padding: '8px', cursor: 'pointer', borderRadius: '4px',
                                    backgroundColor: isSelected ? 'var(--accent-a3)' : 'transparent',
                                    transition: 'background-color 0.1s'
                                  }}
                              >
                                  {multiselect && (
                                      <Checkbox 
                                          checked={isSelected} 
                                          style={{ pointerEvents: 'none' }} 
                                      />
                                  )}
                                  {displayFlag && (
                                      <FlagIcon country={country.value as Country} />
                                  )}
                                  <Text size="2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: isSelected ? 600 : 400 }}>
                                      {country.label}
                                  </Text>
                              </Flex>
                          );
                      })
                  )}
                </Flex>
              </Box>
            </ScrollArea>
          </Popover.Content>
        </Popover.Root>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert" style={{ display: 'block', marginTop: 4 }}>
            {typeof displayError === 'string' ? displayError : "Required field"}
          </span>
        )}
      </div>
    </Column>
  );
});

CountrySelectInput.displayName = 'CountrySelectInput';