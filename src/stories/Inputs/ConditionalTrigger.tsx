"use client";

import React, { useRef, useState, useEffect, useContext, createContext, type JSX, type ReactNode } from "react";
import { Slot } from '@radix-ui/react-slot';
import { useFormikContext, getIn } from 'formik';
import { Box, Flex, Text, Switch, Checkbox, Select, Tooltip } from '@radix-ui/themes';
import { type InputOption, adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Column } from "../Layout/Column";
import { Row } from "../Layout/Row";
import { Icon } from "../../components/icons/Icons";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";

export interface GlobalFormContextValue {
  readOnlyMode?: boolean;
  brandColor?: string;
  darkModeColors?: { light: string; dark: string };
}
export const GlobalFormContext = createContext<GlobalFormContextValue | null>(null);


export type TriggerType = 'toggle' | 'checkbox' | 'select';

export interface ConditionalProps extends BaseInputProps {
  /** The interaction modality used to trigger the conditional render. @default 'toggle' */
  triggerType?: TriggerType;
  /** The value the Formik field must strictly equal (`===`) to reveal the child components. */
  triggerValue: any;
  /** The React nodes (typically xForm Queries) to reveal when the trigger condition is met. */
  children: ReactNode;
  /** Explicit placeholder text for the 'select' triggerType. @default "Select an option" */
  placeholder?: string;
  /** Array of structural options exclusively required if triggerType is 'select'. */
  inputOptions?: InputOption[];
  /** Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. @default 1 */
  neuIntensity?: number;
  /** Global lighting angle that dictates the X and Y shadow trajectories (Neumorphic only). @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** If true, merges component DOM into the immediate child via Radix Slot. @default false */
  asChild?: boolean;
}

/**
 * @component ConditionalTrigger
 * @description State-managing wrapper that evaluates Formik state against a triggerValue to reveal hidden form sections.
 * Supports Outline, Material, and Neumorphic design variants with animated expanding regions.
 */
export const ConditionalTrigger = React.forwardRef<HTMLDivElement, ConditionalProps>(({
  alias,
  design = 'outline',
  triggerType = 'toggle',
  triggerValue = true,
  inputOptions = [],
  children,
  inputLabel,
  width = 12,
  newRow,
  placeholder = 'Select an option',
  readOnly,
  isHinted,
  hintText,
  hintUrl,
  errorText,
  elevation = 3,
  neuIntensity = 1,
  lightSource = 'top-left',
  darkModeColors,
  className = "",
  style,
  formikContext,
  asChild = false,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});

  const globalContext = useContext(GlobalFormContext);
  const defaultFormikContext = useFormikContext<any>();
  const activeContext = formikContext || defaultFormikContext;

  if (!activeContext) {
      console.error(`ConditionalTrigger '${alias}' must be used within a Formik provider or receive a formikContext prop.`);
  }

  const { values, touched, errors, setFieldValue, setFieldTouched } = activeContext || { values: {}, touched: {}, errors: {}, setFieldValue: () => {}, setFieldTouched: () => {} };

  const fieldValue = getIn(values, alias);
  const fieldTouched = getIn(touched, alias);
  const fieldError = getIn(errors, alias);

  const inputId = `${alias}-trigger`;
  const regionId = `${alias}-region`;
  const errorId = `${alias}-error`;

  const isOpen = fieldValue === triggerValue;
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;
  const isReadOnly = readOnly || globalContext?.readOnlyMode;

  const resolvedBrandColor = darkModeColors?.light || globalContext?.darkModeColors?.light || globalContext?.brandColor || 'var(--blue-9)';

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = getNearestParentBackground(containerRef.current.parentElement);
      
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      
      const shadowDark = adjustColor(parentBg, -20 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 20 * neuIntensity);

      setNeuVars({
        '--neu-bg': parentBg,
        '--neu-shadow-dark': shadowDark,
        '--neu-shadow-light': shadowLight,
        '--neu-x': `${x}px`,
        '--neu-y': `${y}px`,
        '--neu-blur': `${blur}px`,
        '--ui-brand-color': resolvedBrandColor,
      } as React.CSSProperties);
    } else {
      setNeuVars({ '--ui-brand-color': resolvedBrandColor } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, resolvedBrandColor]);

  const handleChange = (val: any) => {
    if (isReadOnly) return;
    setFieldValue(alias, val);
    setTimeout(() => setFieldTouched(alias, true, false), 0);
  };

  const renderTrigger = () => {
    if (triggerType === 'checkbox') {
        return (
          <Flex align="center" gap="3" style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
            <Checkbox 
              id={inputId}
              name={alias}
              disabled={isReadOnly}
              checked={fieldValue === true} 
              onCheckedChange={(checked) => handleChange(!!checked)} 
              aria-expanded={isOpen}
              aria-controls={regionId}
              className={`v-cond-checkbox v-cond-checkbox-${design}`}
            />
            <Text as="label" size="2" weight="bold" htmlFor={inputId} style={{ cursor: isReadOnly ? 'default' : 'pointer', color: 'var(--gray-12)' }}>
                {inputLabel}
            </Text>
          </Flex>
        );
    } 
    else if (triggerType === 'select') {
        return (
          <Flex direction="column" gap="2" style={{ width: '100%' }}>
            {inputLabel && (
              <Text as="label" size="2" weight="bold" htmlFor={inputId} style={{ color: 'var(--gray-12)' }}>
                  {inputLabel}
              </Text>
            )}
            <Select.Root
              name={alias}
              disabled={isReadOnly}
              value={fieldValue ? String(fieldValue) : ""}
              onValueChange={handleChange}
            >
              <Select.Trigger 
                id={inputId}
                aria-expanded={isOpen}
                aria-controls={regionId}
                className={`v-cond-select v-cond-select-${design}`}
                style={{ width: '100%' }}
                placeholder={placeholder}
              />
              <Select.Content className={`v-cond-select-content-${design}`}>
                {inputOptions.map((inputoption, idx) => (
                  <Select.Item key={`${alias}-opt-${inputoption.optionid || idx}`} value={String(inputoption.optionvalue)} style={{ cursor: 'pointer', borderRadius: '4px' }}>
                    {inputoption.text}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        );
    } 
    else {
        return (
          <Flex justify="between" align="center" style={{ width: '100%' }}>
            <Text as="label" size="2" weight="bold" htmlFor={inputId} style={{ cursor: isReadOnly ? 'default' : 'pointer', color: 'var(--gray-12)' }}>
                {inputLabel}
            </Text>
            <Switch 
              id={inputId}
              name={alias}
              disabled={isReadOnly}
              checked={fieldValue === true} 
              onCheckedChange={(checked) => handleChange(!!checked)} 
              aria-expanded={isOpen}
              aria-controls={regionId}
              className={`v-cond-switch v-cond-switch-${design}`}
            />
          </Flex>
        );
    }
  };

  const Comp = asChild ? Slot : "div";

  return (
    <Column span={width} newLine={newRow}>
      <Comp 
        ref={(node: HTMLDivElement | null) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={`v-conditional-container v-cond-container-${design} ${className}`}
        style={{
          ...neuVars,
          padding: '16px',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          opacity: isReadOnly ? 0.7 : 1,
          ...style
        }}
        data-state={isOpen ? "open" : "closed"}
        data-error={hasError ? "true" : "false"}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles || '' }} />
        <style dangerouslySetInnerHTML={{ __html: `
          /* ------------------------- */
          /* OUTLINE DESIGN            */
          /* ------------------------- */
          .v-cond-container-outline {
            border: 1px solid var(--gray-6);
            background-color: transparent;
          }
          .v-cond-container-outline[data-state="open"] { border-left: 4px solid var(--ui-brand-color); }
          .v-cond-container-outline[data-error="true"] { border-color: var(--red-9); }
          .v-cond-well-outline {
            margin-top: 16px; padding-top: 16px;
            border-top: 1px dashed var(--gray-6);
          }
          .v-cond-switch-outline { background-color: var(--gray-5); }
          .v-cond-switch-outline[data-state="checked"] { background-color: var(--ui-brand-color); }
          .v-cond-select-outline { border: 1px solid var(--gray-6); background-color: var(--color-surface); height: 40px; border-radius: 6px; }

          /* ------------------------- */
          /* MATERIAL DESIGN           */
          /* ------------------------- */
          .v-cond-container-material {
            background-color: var(--color-surface);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            border-left: 4px solid var(--gray-5);
            border-radius: 8px !important;
          }
          .v-cond-container-material[data-state="open"] { border-left-color: var(--ui-brand-color); }
          .v-cond-container-material[data-error="true"] { border-left-color: var(--red-9); }
          .v-cond-well-material {
            margin-top: 16px; padding-top: 16px; padding-left: 8px; padding-right: 8px;
            border-top: 1px solid var(--gray-4);
            background-color: rgba(0,0,0,0.02);
            border-radius: 0 0 8px 8px;
          }
          .v-cond-switch-material { background-color: var(--gray-5); box-shadow: 0 2px 4px rgba(0,0,0,0.1) inset; }
          .v-cond-switch-material[data-state="checked"] { background-color: var(--ui-brand-color); }
          .v-cond-select-material { border: none; border-bottom: 2px solid var(--gray-7); background-color: var(--gray-3); border-radius: 4px 4px 0 0; height: 40px; }

          /* ------------------------- */
          /* NEUMORPHIC DESIGN         */
          /* ------------------------- */
          .v-cond-container-neumorphic {
            background-color: var(--neu-bg);
            box-shadow: var(--neu-x) var(--neu-y) var(--neu-blur) var(--neu-shadow-dark), calc(var(--neu-x) * -1) calc(var(--neu-y) * -1) var(--neu-blur) var(--neu-shadow-light);
            border-radius: 16px !important;
            border: none;
          }
          .v-cond-container-neumorphic[data-error="true"] { border: 1px solid var(--red-9); }
          .v-cond-well-neumorphic {
            margin-top: 16px; padding: 16px; border-radius: 12px;
            background-color: var(--neu-bg);
            box-shadow: inset var(--neu-x) var(--neu-y) var(--neu-blur) var(--neu-shadow-dark), inset calc(var(--neu-x) * -1) calc(var(--neu-y) * -1) var(--neu-blur) var(--neu-shadow-light);
          }
          
          /* Neumorphic Switch */
          .v-cond-switch-neumorphic {
            all: unset; width: 50px; height: 28px; border-radius: 14px; background-color: var(--neu-bg);
            box-shadow: inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light);
            position: relative; cursor: pointer; transition: background-color 0.3s;
          }
          .v-cond-switch-neumorphic[data-state="checked"] { background-color: var(--ui-brand-color); }
          .v-cond-switch-neumorphic::before {
            content: ''; position: absolute; width: 22px; height: 22px; border-radius: 50%; top: 3px; left: 3px;
            background-color: var(--neu-bg); transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            box-shadow: 2px 2px 4px rgba(0,0,0,0.2), -1px -1px 3px rgba(255,255,255,0.7);
          }
          .v-cond-switch-neumorphic[data-state="checked"]::before { transform: translateX(22px); }
          .v-cond-switch-neumorphic:focus-visible { outline: 2px solid var(--ui-brand-color); outline-offset: 2px; }

          /* Neumorphic Checkbox */
          .v-cond-checkbox-neumorphic {
            all: unset; width: 24px; height: 24px; border-radius: 6px; background-color: var(--neu-bg);
            box-shadow: 2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light);
            display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer;
          }
          .v-cond-checkbox-neumorphic[data-state="checked"] {
            box-shadow: inset 2px 2px 4px var(--neu-shadow-dark), inset -2px -2px 4px var(--neu-shadow-light);
            color: var(--ui-brand-color);
          }
          .v-cond-checkbox-neumorphic:focus-visible { outline: 2px solid var(--ui-brand-color); outline-offset: 2px; }

          /* Neumorphic Select */
          .v-cond-select-neumorphic {
            height: 44px; border-radius: 12px; border: none; padding: 0 12px;
            background-color: var(--neu-bg);
            box-shadow: 4px 4px 8px var(--neu-shadow-dark), -4px -4px 8px var(--neu-shadow-light);
            transition: all 0.2s; font-weight: 500;
          }
          .v-cond-select-neumorphic:focus-visible { outline: 2px solid var(--ui-brand-color); outline-offset: -2px; }
          .v-cond-select-neumorphic[aria-expanded="true"] {
            box-shadow: inset 2px 2px 4px var(--neu-shadow-dark), inset -2px -2px 4px var(--neu-shadow-light);
          }
          .v-cond-select-content-neumorphic {
            background-color: var(--neu-bg); border-radius: 12px; border: none; padding: 8px;
            box-shadow: 8px 8px 16px var(--neu-shadow-dark), -8px -8px 16px var(--neu-shadow-light);
          }
        `}} />

        <Box>
          <Flex justify="between" align="center" width="100%">
            {renderTrigger()}
            {isHinted && (
                <Tooltip content={hintText || "No hint available"} align="start" sideOffset={5}>
                    <a href={hintUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '12px' }}>
                      <Icon name="questionmarkcircled" height="18" width="18" style={{ cursor: 'pointer', color: 'var(--gray-9)' }} />
                    </a> 
                </Tooltip>
            )} 
          </Flex>
        </Box>

        <div 
          id={regionId}
          role="region"
          aria-hidden={!isOpen}
          style={{
            display: 'grid',
            gridTemplateRows: isOpen ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
            opacity: isOpen ? 1 : 0,
            width: '100%',
          }}
        >
          <div style={{ overflow: 'hidden', minHeight: 0 }}>
             <Box className={`v-cond-well v-cond-well-${design}`}>
               <Row>
                 {children}
               </Row>
             </Box>
          </div>
        </div>

        {hasError && displayError && (
          <Box mt="3">
            <Text id={errorId} role="alert" size="2" style={{ color: 'var(--red-9)', fontWeight: 500 }}>
                {typeof displayError === 'string' ? displayError : "Required condition unmet"}
            </Text>
          </Box>
        )}      
      </Comp>
    </Column>
  );
});

ConditionalTrigger.displayName = 'ConditionalTrigger';