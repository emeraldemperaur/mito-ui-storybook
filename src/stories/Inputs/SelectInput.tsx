"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Select, Popover, Flex, Text, Checkbox, ScrollArea, Tooltip, Box } from '@radix-ui/themes';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground, type InputOption } from "../../utils/Vinci";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface SelectInputProps extends BaseInputProps {
  /** Array of structural options mapping values, text, and optional external resources. */
  options: InputOption[];
  /** Toggles standard single-select vs. array-based multi-select mode. @default false */
  multiple?: boolean;
  /** Explicit placeholder text for the unselected state. @default "Select an option" */
  placeholder?: string;
}

/**
 * @component SelectInput
 * @description Unified SSR-safe dropdown. Routes between single Radix Selects and multi-select Popovers, supporting Material, Outline, and smart Neumorphic designs.
 */
export const SelectInput = React.forwardRef<HTMLButtonElement, SelectInputProps>(({
  alias,
  inputLabel,
  options,
  multiple = false,
  design = 'outline',
  elevation = 3,
  surface = 'flat',       
  lightSource = 'top-left', 
  darkModeColors,
  width = 12,
  newRow,
  placeholder = "Select an option",
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
// ... rest of the component
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isOpen, setIsOpen] = useState(false);

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  
  const isFormik = Boolean(activeContext);
  const fieldValue = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  const selectedValues = multiple 
    ? (Array.isArray(fieldValue) ? fieldValue : []) 
    : (fieldValue ? [fieldValue] : []);

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

  const handleSingleChange = (val: string) => {
    if (isFormik) activeContext.setFieldValue(alias, val);
    if (onChange) onChange(val);
    setTimeout(() => isFormik && activeContext.setFieldTouched(alias, true, false), 0);
  };

  const handleMultiToggle = (val: string) => {
    const newValues = selectedValues.includes(val)
      ? selectedValues.filter((v: string) => v !== val)
      : [...selectedValues, val];
    
    if (isFormik) activeContext.setFieldValue(alias, newValues);
    if (onChange) onChange(newValues);
    setTimeout(() => isFormik && activeContext.setFieldTouched(alias, true, false), 0);
  };

  const displayLabel = selectedValues.length > 0
    ? options.filter(opt => selectedValues.includes(String(opt.optionvalue))).map(opt => opt.text).join(', ')
    : placeholder;

  const triggerStyles: Record<string, React.CSSProperties> = {
    outline: { border: hasError ? '1px solid var(--red-9)' : '1px solid var(--gray-7)', background: 'transparent', borderRadius: '6px' },
    material: { borderBottom: hasError ? '2px solid var(--red-9)' : '2px solid var(--gray-7)', background: 'var(--color-surface)', borderRadius: '4px 4px 0 0' },
    neumorphic: { 
      border: 'none', background: 'var(--neu-bg)', borderRadius: '12px',
      boxShadow: isOpen 
        ? `inset ${elevation}px ${elevation}px ${elevation * 2}px var(--neu-shadow-dark), inset -${elevation}px -${elevation}px ${elevation * 2}px var(--neu-shadow-light)`
        : `${elevation}px ${elevation}px ${elevation * 2}px var(--neu-shadow-dark), -${elevation}px -${elevation}px ${elevation * 2}px var(--neu-shadow-light)`
    }
  };

  const popoverStyles: Record<string, React.CSSProperties> = {
    outline: { border: '1px solid var(--gray-7)', background: 'var(--color-panel-solid)' },
    material: { border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', background: 'var(--color-surface)' },
    neumorphic: { border: 'none', background: 'var(--neu-bg)', boxShadow: `${elevation * 2}px ${elevation * 2}px ${elevation * 4}px var(--neu-shadow-dark), -${elevation * 2}px -${elevation * 2}px ${elevation * 4}px var(--neu-shadow-light)` }
  };

  const activeTriggerStyle = triggerStyles[design] || triggerStyles.outline;
  const activePopoverStyle = popoverStyles[design] || popoverStyles.outline;

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`v-input-wrapper ${className}`}
        style={{ ...style, ...neuVars, ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}) } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles }} />
        
        {inputLabel && (
          <label className="v-input-label" htmlFor={`${alias}-trigger`}>
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

        {multiple ? (
          <Popover.Root onOpenChange={(open) => { setIsOpen(open); if (!open && isFormik) activeContext.setFieldTouched(alias, true, false); }}>
            <Popover.Trigger>
              <button
                ref={ref}
                id={`${alias}-trigger`}
                type="button" 
                disabled={readOnly}
                aria-invalid={hasError}
                className="v-input-base"
                style={{ justifyContent: 'space-between', cursor: 'pointer', ...activeTriggerStyle }}
                {...props}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: selectedValues.length === 0 ? 'var(--gray-9)' : 'inherit' }}>
                  {displayLabel}
                </span>
                <Icon name='chevrondown' style={{ opacity: 0.5, flexShrink: 0 }} />
              </button>
            </Popover.Trigger>
            <Popover.Content align="start" style={{ width: containerRef.current?.offsetWidth, padding: 0, zIndex: 10, ...activePopoverStyle }}>
              <ScrollArea type="auto" style={{ maxHeight: 250 }}>
                <Box p="2">
                  <Flex direction="column" gap="1">
                    {options.map((opt) => (
                      <Flex key={opt.optionid} align="center" gap="2" onClick={() => !readOnly && handleMultiToggle(String(opt.optionvalue))} style={{ padding: '8px', cursor: readOnly ? 'default' : 'pointer', borderRadius: '6px', background: selectedValues.includes(String(opt.optionvalue)) ? 'var(--accent-a3)' : 'transparent' }}>
                        <Checkbox checked={selectedValues.includes(String(opt.optionvalue))} style={{ pointerEvents: 'none' }} />
                        <Text size="2">{opt.text}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              </ScrollArea>
            </Popover.Content>
          </Popover.Root>
        ) : (
          <Select.Root 
            value={fieldValue || ""} 
            onValueChange={handleSingleChange}
            onOpenChange={(open) => { setIsOpen(open); if (!open && isFormik) activeContext.setFieldTouched(alias, true, false); }}
            disabled={readOnly}
          >
            <Select.Trigger 
              ref={ref as any}
              id={`${alias}-trigger`}
              className="v-input-base"
              aria-invalid={hasError}
              style={{ justifyContent: 'space-between', paddingRight: '16px', ...activeTriggerStyle }}
              {...props}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayLabel}
              </span>
            </Select.Trigger>
            <Select.Content position="popper" style={{ zIndex: 10, ...activePopoverStyle }}>
              {options.map((opt) => (
                <Select.Item key={opt.optionid} value={String(opt.optionvalue)} style={{ cursor: 'pointer' }}>
                  {opt.text}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        )}

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Selection required"}
          </span>
        )}
      </div>
    </Column>
  );
});

SelectInput.displayName = 'SelectInput';