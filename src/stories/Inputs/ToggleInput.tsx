"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { useFormikContext, getIn } from 'formik';
import { Button, Tooltip } from '@radix-ui/themes'; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Column } from "../Layout/Column";
import { Icon } from "../../components/icons/Icons";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface ToggleProps extends BaseInputProps {
  /** Option to specify an Icon name for Toggle input field. @default "layers" */
  icon?: React.ComponentProps<typeof Icon>['name'];
}

/**
 * @component ToggleInput
 * @description Multi-variant tactile toggle. Supports Material, Outline, and the Vanguard Neumorphic design.
 */
export const ToggleInput = React.forwardRef<HTMLButtonElement, ToggleProps>(({
  alias, 
  readOnly, 
  width = 12, 
  inputLabel,
  design = 'outline',
  elevation = 3,
  surface = 'flat',         
  lightSource = 'top-left', 
  darkModeColors,
  style,
  newRow,
  isHinted,
  hintText,
  hintUrl, 
  errorText,
  icon = 'layers',
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

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = getNearestParentBackground(containerRef.current.parentElement);
      setNeuVars({
        '--neu-bg': parentBg,
        '--neu-shadow-dark': adjustColor(parentBg, -20), 
        '--neu-shadow-light': adjustColor(parentBg, 20),
        '--vg-accent': 'var(--ui-brand-color, var(--blue-9))',
      } as React.CSSProperties);
    }
  }, [design, elevation]);

  const handleToggle = (val: boolean) => {
    if (!readOnly) {
      if (isFormik) activeContext.setFieldValue(alias, val);
      if (onChange) onChange(val);
      setTimeout(() => isFormik && activeContext.setFieldTouched(alias, true, false), 0);
    }
  };

  const materialStyle: React.CSSProperties = {
    textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600,
    borderRadius: '4px', transition: 'all 0.2s ease',
  };

  const outlineStyle: React.CSSProperties = {
    fontWeight: 600, background: 'transparent', transition: 'all 0.1s ease',
  };

  const iconColor = fieldValue && !readOnly ? 'var(--ui-brand-color, var(--blue-9))' : 'var(--gray-8)';

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef} 
        className={`v-input-wrapper ${className}`}
        style={{ ...style, ...neuVars, ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}) } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles }} />
        
        {design === 'neumorphic' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <style dangerouslySetInnerHTML={{__html: `
                  .vg-toggle-wrapper-${alias} {
                    display: flex; justify-content: center; align-items: center;
                    position: relative; border-radius: .5em; padding: .125em;
                    background-image: linear-gradient(to bottom, #d5d5d5, #e8e8e8);
                    box-shadow: 0 1px 1px rgba(255, 255, 255, 0.6);
                    font-size: 20px; /* Anchor scaling */
                    flex-shrink: 0;
                  }

                  /* Radix Item Override */
                  .vg-toggle-checkbox-${alias} {
                    all: unset; appearance: none; position: absolute; z-index: 2;
                    border-radius: inherit; width: 100%; height: 100%;
                    opacity: 0.0001; /* Invisible but intercepts clicks */
                    cursor: pointer;
                  }
                  
                  .vg-toggle-checkbox-${alias}:focus-visible + .vg-toggle-container-${alias} {
                    outline: 2px solid var(--vg-accent); outline-offset: 2px;
                  }

                  .vg-toggle-container-${alias} {
                    display: flex; align-items: center; position: relative;
                    border-radius: .375em; width: 3em; height: 1.5em;
                    background-color: #e8e8e8;
                    box-shadow: inset 0 0 .0625em .125em rgba(255, 255, 255, 0.2), 
                                inset 0 .0625em .125em rgba(0, 0, 0, 0.4);
                    transition: background-color .4s linear; z-index: 1;
                  }

                  /* Track State Hook mapped to Radix ARIA */
                  .vg-toggle-checkbox-${alias}[data-state='on'] + .vg-toggle-container-${alias} {
                    background-color: var(--vg-accent, #f3b519);
                  }

                  .vg-toggle-button-${alias} {
                    display: flex; justify-content: center; align-items: center; position: absolute;
                    left: .0625em; border-radius: .3125em; width: 1.375em; height: 1.375em;
                    background-color: #e8e8e8;
                    box-shadow: inset 0 -.0625em .0625em .125em rgba(0, 0, 0, 0.1), 
                                inset 0 -.125em .0625em rgba(0, 0, 0, 0.2), 
                                inset 0 .1875em .0625em rgba(255, 255, 255, 0.3), 
                                0 .125em .125em rgba(0, 0, 0, 0.5);
                    transition: left .4s cubic-bezier(0.4, 0, 0.2, 1);
                  }

                  /* Thumb Slide Animation Hook mapped to Radix ARIA */
                  .vg-toggle-checkbox-${alias}[data-state='on'] + .vg-toggle-container-${alias} > .vg-toggle-button-${alias} {
                    left: 1.5625em;
                  }

                  .vg-toggle-circles-${alias} {
                    display: grid; grid-template-columns: repeat(3, min-content); gap: .125em;
                    position: absolute; margin: 0 auto;
                  }

                  .vg-circle-${alias} {
                    border-radius: 50%; width: .125em; height: .125em;
                    background-image: radial-gradient(circle at 50% 0, #f5f5f5, #c4c4c4);
                  }
                `}} />

                <div 
                  className={`vg-toggle-wrapper-${alias}`} 
                  style={{ opacity: readOnly ? 0.6 : 1, pointerEvents: readOnly ? 'none' : 'auto' }}
                >
                    <TogglePrimitive.Root
                      ref={ref as any}
                      id={`${alias}-trigger`}
                      name={alias}
                      pressed={Boolean(fieldValue)}
                      onPressedChange={handleToggle}
                      disabled={readOnly}
                      aria-describedby={`${alias}-label`}
                      className={`vg-toggle-checkbox-${alias}`}
                      {...(props as any)}
                    />
                    <div className={`vg-toggle-container-${alias}`}>
                      <div className={`vg-toggle-button-${alias}`}>
                        <div className={`vg-toggle-circles-${alias}`}>
                          {[...Array(12)].map((_, i) => (
                             <div key={i} className={`vg-circle-${alias}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                </div>

                <Icon 
                    name={icon} height="20" width="20" color={iconColor}
                    style={{ transition: 'color 0.3s ease', opacity: readOnly ? 0.5 : 1, cursor: readOnly ? 'default' : 'pointer' }}
                    onClick={() => handleToggle(!fieldValue)}
                />
            </div>
        ) : (
            <TogglePrimitive.Root
                pressed={Boolean(fieldValue)}
                onPressedChange={handleToggle}
                name={alias}
                disabled={readOnly}
                id={`${alias}-trigger`}
                aria-describedby={`${alias}-label`}
                asChild
            >
                <Button
                    ref={ref as any}
                    disabled={readOnly}
                    className={`design-toggle ${design}`}
                    style={{
                        ...(design === 'material' ? materialStyle : {}),
                        ...(design === 'outline' ? outlineStyle : {}),
                        marginBottom: '8px'
                    }}
                    type="button"
                    {...(props as any)}
                >
                    <style dangerouslySetInnerHTML={{__html: `
                        .design-toggle.material[data-state='on'] { background-color: var(--ui-brand-color, var(--blue-9)); color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
                        .design-toggle.material[data-state='off'] { background-color: var(--gray-3); color: var(--gray-11); }
                        .design-toggle.outline[data-state='on'] { border: 2px solid var(--ui-brand-color, var(--blue-9)); color: var(--ui-brand-color, var(--blue-9)); background-color: var(--accent-2); }
                        .design-toggle.outline[data-state='off'] { border: 1px solid var(--gray-7); color: var(--gray-11); }
                    `}} />
                    {props.children || <Icon name={icon} />}
                </Button>
            </TogglePrimitive.Root>
        )}

        <div>
          {inputLabel && (
            <label className="v-input-label" id={`${alias}-label`} htmlFor={`${alias}-trigger`}>
              {inputLabel}
              {isHinted && (
                <Tooltip content={hintText || "Information"} align="start">
                  <a href={hintUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 6 }}>
                    <Icon name="questionmarkcircled" height="14" width="14" style={{ color: 'var(--gray-9)' }} />
                  </a> 
                </Tooltip>
              )}
            </label>
          )}

          {hasError && displayError && (
            <span id={`${alias}-error`} className="v-input-error" role="alert" style={{ display: 'block', marginTop: 4 }}>
              {typeof displayError === 'string' ? displayError : "Required field"}
            </span>
          )}
        </div>
      </div>
    </Column>
  );
});

ToggleInput.displayName = 'ToggleInput';