"use client";

import React, { useRef, useState, useEffect, type JSX } from 'react';
import { DropdownMenu, Flex, Text, Tooltip } from '@radix-ui/themes';
import { useFormikContext, getIn } from 'formik';
import { adjustColor, getNearestParentBackground, type InputOption } from "../../utils/Vinci";
import { Icon } from '../../components/icons/Icons';
import { Column } from '../Layout/Column';
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface DropdownProps extends BaseInputProps {
  /** Array of structural options mapping values, text, and optional external resources. */
  inputOptions: InputOption[];
  /** Explicit placeholder text. @default "Select an option" */
  placeholder?: string;
}

/**
 * @component DropdownInput
 * @description Multi-variant Dropdown built on Radix DropdownMenu. Supports standard value states, external url routing, and Neumorphic 3D designs.
 */
export const DropdownInput = React.forwardRef<HTMLButtonElement, DropdownProps>(({
  alias, 
  readOnly, 
  width = 12, 
  inputLabel,
  design = 'outline',
  elevation = 3,
  surface = 'flat',         
  lightSource = 'top-left', 
  darkModeColors,
  placeholder = "Select an option", 
  inputOptions,
  style, 
  newRow, 
  isHinted, 
  hintText,
  hintUrl, 
  errorText, 
  className = "",
  formikContext,
  value,
  onChange,
  // Plucked to prevent TS DOM collisions
  defaultValue,
  ...props
}, ref): JSX.Element => {
  
  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  const isFormik = Boolean(activeContext);

  const fieldValue = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;

  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isOpen, setIsOpen] = useState(false);

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

  const openLink = (inputUrl: string) => {
    window.open(inputUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSelect = (val: string) => {
    if (isFormik) activeContext.setFieldValue(alias, val);
    if (onChange) onChange(val);
    setTimeout(() => isFormik && activeContext.setFieldTouched(alias, true, false), 0);
  };

  const baseTrigger: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', cursor: readOnly ? 'default' : 'pointer', textAlign: 'left',
    whiteSpace: 'nowrap', overflow: 'hidden', boxSizing: 'border-box', opacity: readOnly ? 0.7 : 1,
  };

  const materialTrigger: React.CSSProperties = {
    ...baseTrigger,
    backgroundColor: 'var(--color-surface)', border: 'none',
    borderBottom: hasError ? '2px solid var(--red-9)' : '2px solid var(--gray-7)',
    borderRadius: '4px 4px 0 0', height: '36px', fontWeight: 500, padding: '0 12px'
  };
  const materialContent = {
    borderRadius: '4px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', backgroundColor: 'var(--color-surface)',
  };

  const outlineTrigger: React.CSSProperties = {
    ...baseTrigger,
    backgroundColor: 'transparent', border: hasError ? '2px solid var(--red-9)' : '1px solid var(--gray-7)',
    borderRadius: '6px', height: '36px', fontWeight: 500, padding: '0 12px'
  };
  const outlineContent = {
    border: '1px solid var(--gray-7)', borderRadius: '6px', boxShadow: 'none', backgroundColor: 'var(--color-panel-solid)',
  };

  const neumorphicTrigger: React.CSSProperties = {
    ...baseTrigger,
    backgroundColor: 'var(--neu-bg)', border: 'none', borderRadius: '12px', height: '44px', fontWeight: 600, padding: '0 12px',
    boxShadow: isOpen 
      ? 'inset 6px 6px 12px var(--neu-shadow-dark), inset -6px -6px 12px var(--neu-shadow-light)'
      : '6px 6px 12px var(--neu-shadow-dark), -6px -6px 12px var(--neu-shadow-light)',
    transition: 'all 0.2s ease',
  };
  const neumorphicContent = {
    backgroundColor: 'var(--neu-bg)', borderRadius: '12px', border: 'none',
    boxShadow: '6px 6px 12px var(--neu-shadow-dark), -6px -6px 12px var(--neu-shadow-light)',
  };

  const activeTriggerStyle = 
    design === 'material' ? materialTrigger :
    design === 'neumorphic' ? { ...neumorphicTrigger, ...neuVars } :
    outlineTrigger;

  const activeContentStyle = 
    design === 'material' ? materialContent :
    design === 'neumorphic' ? { ...neumorphicContent, ...neuVars } :
    outlineContent;

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef} 
        className={`v-input-wrapper ${className}`}
        style={{ ...style, ...neuVars, ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}) } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles }} />
        
        {design === 'neumorphic' && (
          <style dangerouslySetInnerHTML={{__html: `
            .neu-select-item {
              border-radius: 8px; transition: all 0.1s ease;
            }
            .neu-select-item:hover, .neu-select-item[data-highlighted] { 
              background-color: rgba(0,0,0,0.05) !important; cursor: pointer; 
              box-shadow: 2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light);
            }
          `}} />
        )}

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

        <DropdownMenu.Root
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open && isFormik) activeContext.setFieldTouched(alias, true, false);
          }}
        >
          <DropdownMenu.Trigger>
            <button
              id={`${alias}-trigger`}
              ref={ref as any}
              aria-labelledby={`${alias}-label`}
              aria-invalid={hasError}
              disabled={readOnly}
              className="v-input-base"
              style={activeTriggerStyle}
              {...(props as any)}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: !fieldValue ? 'var(--gray-9)' : 'inherit' }}>
                {inputOptions.find(opt => String(opt.optionvalue) === fieldValue)?.text || placeholder}
              </span>
              <DropdownMenu.TriggerIcon style={{ opacity: 0.5, flexShrink: 0, marginLeft: 8 }} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content 
            align="start" 
            sideOffset={8} 
            style={{ ...activeContentStyle, width: containerRef.current?.offsetWidth }}
          >
            <DropdownMenu.Item 
              onSelect={() => handleSelect("")}
              className={design === 'neumorphic' ? 'neu-select-item' : ''}
              style={{ color: 'var(--gray-10)', fontStyle: 'italic', padding: '10px' }}
            >
               {placeholder}
            </DropdownMenu.Item>
            
            <DropdownMenu.Separator style={{ margin: '4px 0', opacity: design === 'neumorphic' ? 0.2 : 0.5, background: 'var(--gray-8)' }} />

            {inputOptions.map((inputoption, idx) => {
               const itemId = String(inputoption.optionid) || `${alias}-item-${idx}`;
               const itemValue = String(inputoption.optionvalue) || `__empty_${idx}`;
               
               if (inputoption.optionurl) {
                 return (
                   <DropdownMenu.Item 
                     key={itemId}
                     onSelect={(e) => { 
                       e.preventDefault(); 
                       openLink(inputoption.optionurl || "#"); 
                     }}
                     className={design === 'neumorphic' ? 'neu-select-item' : ''}
                     style={{ padding: '10px' }}
                   >
                     <Flex width="100%" justify="between" align="center">
                       <Text>{inputoption.text}</Text>
                       <Icon name="externallink" height="14" width="14" style={{ opacity: 0.5 }} />
                     </Flex>
                   </DropdownMenu.Item>
                 );
               }

               return (
                 <DropdownMenu.Item 
                   key={itemId}
                   onSelect={() => handleSelect(itemValue)}
                   className={design === 'neumorphic' ? 'neu-select-item' : ''}
                   style={{ padding: '10px', fontWeight: 500 }}
                 >
                   {inputoption.text}
                 </DropdownMenu.Item>
               );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert" style={{ display: 'block', marginTop: 4 }}>
            {typeof displayError === 'string' ? displayError : "Required field"}
          </span>
        )}
      </div>
    </Column>
  );
});

DropdownInput.displayName = 'DropdownInput';