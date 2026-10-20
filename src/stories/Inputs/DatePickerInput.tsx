"use client";

import React, { useRef, useState, useEffect, type JSX, forwardRef } from "react";
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useFormikContext, getIn } from "formik";
import { TextField, Tooltip } from '@radix-ui/themes';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column";
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface DatePickerInputProps extends BaseInputProps {
  /** Structural mode altering the popover UI and standard data payload. @default 'date' */
  mode?: 'date' | 'datetime' | 'daterange';
  /** Explicit placeholder text. @default "Select date" */
  placeholder?: string;
}

const CustomRadixInput = forwardRef<HTMLInputElement, any>((props, ref) => {
  const { radixId, radixStyle, hasError, design, ...restProps } = props;
  return (
    <TextField.Root 
      {...restProps} 
      id={radixId}
      style={radixStyle}
      variant="surface"
      ref={ref}
      autoComplete="off"
      data-error={hasError}
      className={`v-input-base v-input-${design === 'neumorphic' ? 'inset' : design}`}
    >
      <TextField.Slot>
        <Icon name={props.mode === 'datetime' ? "clock" : "calendar"} height="16" width="16" style={{ color: 'var(--gray-9)' }} />
      </TextField.Slot>
    </TextField.Root>
  );
});
CustomRadixInput.displayName = "CustomRadixInput";

/**
 * @component DatePickerInput
 * @description Unified SSR-safe calendar input. Routes cleanly between standard Dates, DateTimes, and Object Ranges based on structural mode prop.
 */
export const DatePickerInput = React.forwardRef<any, DatePickerInputProps>(({
  alias,
  inputLabel,
  mode = 'date',
  design = 'outline',
  elevation = 3,
  surface = 'flat',         
  lightSource = 'top-left', 
  darkModeColors,
  width = 12,
  newRow,
  placeholder = "Select date",
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
  defaultValue,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  
  const isFormik = Boolean(activeContext);
  const fieldVal = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  const isRange = mode === 'daterange';
  
  const getRangeDates = (): [Date | null, Date | null] => {
    if (!fieldVal) return [null, null];
    if (typeof fieldVal === 'object' && 'from' in fieldVal) {
      return [fieldVal.from ? new Date(fieldVal.from) : null, fieldVal.to ? new Date(fieldVal.to) : null];
    }
    if (Array.isArray(fieldVal)) {
      return [fieldVal[0] ? new Date(fieldVal[0]) : null, fieldVal[1] ? new Date(fieldVal[1]) : null];
    }
    return [null, null];
  };

  const [startDate, endDate] = isRange ? getRangeDates() : [null, null];
  const standardDate = !isRange && fieldVal ? new Date(fieldVal) : null;

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = getNearestParentBackground(containerRef.current.parentElement);
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;

      setNeuVars({
        '--neu-bg': parentBg,
        '--neu-shadow-dark': adjustColor(parentBg, -15), 
        '--neu-shadow-light': adjustColor(parentBg, 15),
        '--neu-x': `${x}px`,
        '--neu-y': `${y}px`,
        '--neu-blur': `${elevation * 2}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource]);

  const handleDateChange = (dates: any) => {
    if (isRange && Array.isArray(dates)) {
      const [start, end] = dates;
      const payload = { from: start, to: end };
      if (isFormik) activeContext.setFieldValue(alias, payload);
      if (onChange) onChange(payload);
      if (start && end && isFormik) activeContext.setFieldTouched(alias, true, false);
    } else {
      if (isFormik) activeContext.setFieldValue(alias, dates);
      if (onChange) onChange(dates);
      if (isFormik) activeContext.setFieldTouched(alias, true, false);
    }
  };

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`v-input-wrapper v-date-wrapper-${alias} ${className}`}
        style={{ ...style, ...neuVars, ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}) } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles }} />
        
\        <style dangerouslySetInnerHTML={{__html: `
          .v-date-wrapper-${alias} .react-datepicker-wrapper { width: 100%; } 
          .v-date-wrapper-${alias} .react-datepicker {
            font-family: var(--default-font-family, inherit);
            border: ${design === 'outline' ? '1px solid var(--gray-6)' : 'none'} !important;
            border-radius: 12px !important;
            background-color: ${design === 'neumorphic' ? 'var(--neu-bg)' : 'var(--color-panel-solid)'} !important;
            box-shadow: ${design === 'neumorphic' 
              ? 'calc(var(--neu-x)*2) calc(var(--neu-y)*2) calc(var(--neu-blur)*2) var(--neu-shadow-dark), calc(var(--neu-x)*-2) calc(var(--neu-y)*-2) calc(var(--neu-blur)*2) var(--neu-shadow-light)' 
              : '0 10px 40px -10px rgba(0,0,0,0.2)'};
            padding: 12px; display: flex !important;
          }
          .v-date-wrapper-${alias} .react-datepicker__header { background-color: transparent !important; border-bottom: none !important; }
          .v-date-wrapper-${alias} .react-datepicker__day-name { color: var(--gray-9); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
          
          .v-date-wrapper-${alias} .react-datepicker__day {
            width: 32px; height: 32px; line-height: 32px; border-radius: 50% !important; margin: 2px !important; color: var(--gray-12); transition: all 0.2s;
          }
          .v-date-wrapper-${alias} .react-datepicker__day:hover { 
            background-color: ${design === 'neumorphic' ? 'transparent' : 'var(--gray-4)'} !important; 
            box-shadow: ${design === 'neumorphic' ? '2px 2px 4px var(--neu-shadow-dark), -2px -2px 4px var(--neu-shadow-light)' : 'none'};
          }
          
          /* Selected Logic */
          .v-date-wrapper-${alias} .react-datepicker__day--selected, 
          .v-date-wrapper-${alias} .react-datepicker__time-list-item--selected {
            background-color: ${design === 'neumorphic' ? 'var(--neu-bg)' : 'var(--ui-brand-color, var(--blue-9))'} !important;
            color: ${design === 'neumorphic' ? 'var(--ui-brand-color, var(--blue-9))' : 'white'} !important;
            font-weight: bold;
            box-shadow: ${design === 'neumorphic' ? 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)' : 'none'};
          }

          /* Range Logic */
          .v-date-wrapper-${alias} .react-datepicker__day--in-range {
            background-color: var(--accent-3) !important; color: var(--ui-brand-color, var(--blue-9)) !important; border-radius: 0 !important;
            box-shadow: ${design === 'neumorphic' ? 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' : 'none'};
          }
          .v-date-wrapper-${alias} .react-datepicker__day--range-start { background-color: var(--ui-brand-color, var(--blue-9)) !important; color: white !important; border-radius: 50% 0 0 50% !important; }
          .v-date-wrapper-${alias} .react-datepicker__day--range-end { background-color: var(--ui-brand-color, var(--blue-9)) !important; color: white !important; border-radius: 0 50% 50% 0 !important; }
          .v-date-wrapper-${alias} .react-datepicker__day--range-start.react-datepicker__day--range-end { border-radius: 50% !important; }

          /* Timepicker Logic */
          .v-date-wrapper-${alias} .react-datepicker__time-container { border-left: 1px solid var(--gray-5) !important; width: 110px !important; background: transparent !important; }
          .v-date-wrapper-${alias} .react-datepicker__header--time { background: transparent !important; padding-top: 10px; padding-bottom: 10px; }
          .v-date-wrapper-${alias} .react-datepicker-time__header { color: var(--gray-11) !important; font-size: 0.75rem !important; text-transform: uppercase; }
          .v-date-wrapper-${alias} .react-datepicker__time-list-item { height: 32px !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 0.9rem !important; color: var(--gray-12); transition: all 0.2s; }
          .v-date-wrapper-${alias} .react-datepicker__time-list-item:hover { 
            background-color: ${design === 'neumorphic' ? 'transparent' : 'var(--gray-4)'} !important;
            box-shadow: ${design === 'neumorphic' ? '2px 2px 4px var(--neu-shadow-dark), -2px -2px 4px var(--neu-shadow-light)' : 'none'};
          }
        `}} />

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

        <ReactDatePicker
          id={`${alias}-trigger`}
          ref={ref as any}
          disabled={readOnly}
          placeholderText={placeholder} 
          aria-labelledby={`${alias}-label`}
          
          {...({
            selectsRange: isRange,
            startDate: isRange ? startDate : undefined,
            endDate: isRange ? endDate : undefined,
            selected: isRange ? undefined : standardDate,
          } as any)}
          
          showTimeSelect={mode === 'datetime'}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat={mode === 'datetime' ? "MMM d, yyyy h:mm aa" : "MMM d, yyyy"}
          
          onChange={handleDateChange as any}
          
          customInput={
            <CustomRadixInput 
              radixId={`${alias}-input`}
              mode={mode}
              design={design}
              hasError={hasError}
              style={{ cursor: readOnly ? 'default' : 'pointer' }}
              {...(props as any)} 
            />
          }
        />

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "Date selection required"}
          </span>
        )}
      </div>
    </Column>
  );
});

DatePickerInput.displayName = 'DatePickerInput';