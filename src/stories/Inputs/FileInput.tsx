"use client";

import React, { useRef, useState, useEffect, type JSX, useId } from "react";
import { useFormikContext, getIn, type FormikContextType } from "formik";
import { Flex, Text, IconButton, Box, Badge } from '@radix-ui/themes';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ACCEPTED_FORMATS, ACCEPTED_EXTENSIONS, adjustColor, formatBytes, getNearestParentBackground } from "../../utils/Vinci";
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { type InputDesign } from "./Input";

/**
 * @interface FileInputProps
 * @description Strongly-typed attributes extending native HTML input behaviors with advanced dropzone UI and file management capabilities.
 * Optimized for MCP context-injection to ensure flawless form pipeline integration.
 */
export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type' | 'value' | 'onChange'> {
  /** 
   * @description Unique identifier mapping the input to its Formik state and DOM label. 
   * @required
   */
  alias: string;
  /** 
   * @description Text rendered above the input or floating over the border.
   */
  inputLabel?: string;
  /** 
   * @description Toggles the interactive floating label animation (primarily used with the 'outline' variant).
   * @default false
   */
  floatingLabel?: boolean;
  /**
   * @description The core architectural design variant of the dropzone field.
   * - `material`: Minimalist underline with a vibrant gradient animation on focus.
   * - `outline`: Crisp bordered aesthetic with optional floating labels.
   * - `neumorphic`: Soft, extruded physical surface utilizing inset shadows.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical input well.
   * @default 'outline'
   */
  design?: InputDesign;
  /** 
   * @description Toggles standard single file payload vs batch multi-file array payload. 
   * @default false 
   */
  multiple?: boolean;
  /** 
   * @description Automatically generates object URLs to preview images locally. 
   * @default true 
   */
  preview?: boolean;
  /** 
   * @description Overrides the standard accepted MIME types or extensions. 
   */
  accept?: string;
  /** 
   * @description Descriptive text outlining supported formats or instructions, displayed beneath the main dropzone label.
   * @default "Supports PDF, Images, Excel, JSON, ZIP"
   */
  helperText?: string;
  /** 
   * @description Optional icon node rendered inside the input field header. 
   */
  icon?: React.ReactNode;
  /** 
   * @description Determines if the optional generic icon is placed on the left (leading) or right (trailing).
   * @default "left"
   */
  iconPosition?: 'left' | 'right';
  /** 
   * @description Forces the component into dark mode, overriding system or parent theme contexts. 
   */
  darkMode?: boolean;
  /** 
   * @description Dynamic base background color for light mode. Injected as `--mito-input-bg`.
   */
  backgroundColor?: string;
  /** 
   * @description Dynamic base background color specifically for dark mode contexts.
   */
  darkBackgroundColor?: string;
  /** 
   * @description Standard text and icon color for light mode. Injected as `--mito-input-text`.
   */
  textColor?: string;
  /** 
   * @description Standard text and icon color specifically for dark mode contexts.
   */
  darkTextColor?: string;
  /** 
   * @description Validation failure text color for light mode. Injected as `--mito-input-error`.
   */
  errorTextColor?: string;
  /** 
   * @description Validation failure text color for dark mode. Injected as `--mito-input-error-dark`.
   */
  darkErrorTextColor?: string;
  /** 
   * @description Highlight color applied to the active/focused border and icons. 
   */
  activeColor?: string;
  /** 
   * @description Font family override to match specific UI brand primitives. 
   */
  fontFamily?: string;
  /** 
   * @description Toggles an active hint tooltip next to the label. 
   */
  isHinted?: boolean;
  /** 
   * @description The informational text displayed inside the hint tooltip. 
   */
  hintText?: string;
  /** 
   * @description Optional URL to open when the hint tooltip icon is clicked. 
   */
  hintUrl?: string;
  /** 
   * @description Explicit error message string. Overrides Formik validation errors if provided. 
   */
  errorText?: string;
  /** 
   * @description Viewport column width configuration value (1 to 12). 
   * @default 12 
   */
  width?: number;
  /** 
   * @description Forces container layouts to break downward onto a fresh structural row line. 
   */
  newRow?: boolean;
  /** 
   * @description Locks the component to prevent user interaction and file manipulation, rendering a disabled visual state.
   * @default false
   */
  readOnly?: boolean;
  /** 
   * @description Specific custom style class selector appended to the root container. 
   */
  className?: string;
  /** 
   * @description Inline modification style rules object. 
   */
  style?: React.CSSProperties;
  /** 
   * @description Explicit Formik context object injected for nested step fields. 
   */
  formikContext?: FormikContextType<any>;
  /** 
   * @description External fallback state value for standalone non-Formik setups.
   */
  value?: File | File[] | null;
  /** 
   * @description Standalone value callback for external state management. 
   */
  onChange?: (value: File | File[] | null) => void;
}

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return <Icon name='image' width="20" height="20" style={{ color: 'var(--scoped-text)' }} />;
  if (file.type.includes('pdf')) return <Icon name='filetext' width="20" height="20" style={{ color: '#ef4444' }} />; // Strict red for PDF
  if (file.type.includes('csv') || file.type.includes('sheet')) return <Icon name='table' width="20" height="20" style={{ color: '#22c55e' }} />; // Strict green for excel/csv
  if (file.name.endsWith('.zip')) return <Icon name='archive' width="20" height="20" style={{ color: 'var(--scoped-text)' }} />;
  return <Icon name='filetext' width="20" height="20" style={{ color: 'var(--scoped-text)' }} />;
};

/**
 * @component FileInput
 * @description Unified file uploader routing single/batch arrays. Supports Material, Outline, Neumorphic, and Skeuomorphic dropzone styling.
 * Shares exact visual parity with standard `Input` variants and relies entirely on Radix Tooltip primitives for isolated rendering.
 */
export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(({
  alias,
  inputLabel,
  floatingLabel = false,
  multiple = false,
  preview = true,
  design = 'outline',
  accept = multiple ? ACCEPTED_EXTENSIONS : ACCEPTED_FORMATS,
  helperText = "Supports PDF, Images, Excel, JSON, ZIP",
  icon,
  iconPosition = 'left',
  darkMode = false,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  errorTextColor,
  darkErrorTextColor,
  activeColor,
  fontFamily,
  width = 12,
  newRow,
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
  onBlur,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [objectUrls, setObjectUrls] = useState<Record<string, string>>({});
  const [isFocused, setIsFocused] = useState(false);
  const internalId = useId();
  const inputId = `${alias}-input-${internalId}`;

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = Boolean(activeContext);
  const fieldValue = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  const currentFiles: File[] = multiple 
    ? (Array.isArray(fieldValue) ? fieldValue : []) 
    : (fieldValue ? [fieldValue as File] : []);
    
  const hasValue = currentFiles.length > 0;
  const isFloating = floatingLabel && (isFocused || hasValue);

  const themeClass = darkMode ? 'mito-input-dark' : '';

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement) || '#e0e5ec';
      setNeuVars({
        '--mito-input-bg-env': parentBg,
        '--mito-input-shadow-dark': adjustColor(parentBg, -15), 
        '--mito-input-shadow-light': adjustColor(parentBg, 15),
      } as React.CSSProperties);
    }
  }, [design, backgroundColor]);

  useEffect(() => {
    if (!preview) return;
    const newUrls: Record<string, string> = {};
    currentFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        newUrls[file.name] = objectUrls[file.name] || URL.createObjectURL(file);
      }
    });
    setObjectUrls(newUrls);

    return () => {
      Object.keys(objectUrls).forEach(name => {
        if (!newUrls[name]) URL.revokeObjectURL(objectUrls[name]);
      });
    };
  }, [currentFiles, preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const incomingFiles = Array.from(e.target.files);
    const nextState = multiple ? [...currentFiles, ...incomingFiles] : incomingFiles[0];
    
    if (isFormik) activeContext.setFieldValue(alias, nextState);
    if (onChange) onChange(nextState);
    setTimeout(() => isFormik && activeContext.setFieldTouched(alias, true, false), 0);
    
    if (inputRef.current) inputRef.current.value = ''; // Reset input to allow uploading the same file again
  };

  const handleRemove = (indexToRemove: number) => {
    if (!multiple) {
      if (isFormik) activeContext.setFieldValue(alias, null);
      if (onChange) onChange(null);
      return;
    }
    const nextState = currentFiles.filter((_, idx) => idx !== indexToRemove);
    if (isFormik) activeContext.setFieldValue(alias, nextState);
    if (onChange) onChange(nextState);
  };

  const customStyles = {
    ...style,
    ...neuVars,
    '--mito-input-bg': backgroundColor,
    '--mito-input-bg-dark': darkBackgroundColor || backgroundColor,
    '--mito-input-text': textColor,
    '--mito-input-text-dark': darkTextColor || textColor,
    '--mito-input-error': errorTextColor || '#ef4444',
    '--mito-input-error-dark': darkErrorTextColor || errorTextColor || '#f87171',
    '--mito-input-active': activeColor || '#2563eb',
    '--mito-input-font': fontFamily,
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`mito-input-wrapper ${themeClass} ${className}`}
        style={customStyles}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .mito-input-wrapper {
            --scoped-bg: var(--mito-input-bg, #ffffff);
            --scoped-text: var(--mito-input-text, #111827);
            --scoped-placeholder: #9ca3af;
            --scoped-border: #d1d5db;
            --scoped-active: var(--mito-input-active, #2563eb);
            --scoped-error: var(--mito-input-error, #ef4444);
            --scoped-font: var(--mito-input-font, system-ui, -apple-system, sans-serif);
            
            display: flex;
            flex-direction: column;
            width: 100%;
            font-family: var(--scoped-font);
            position: relative;
          }
          
          .mito-input-wrapper.mito-input-dark {
            --scoped-bg: var(--mito-input-bg-dark, #1f2937);
            --scoped-text: var(--mito-input-text-dark, #f9fafb);
            --scoped-placeholder: #6b7280;
            --scoped-border: #4b5563;
            --scoped-error: var(--mito-input-error-dark, #f87171);
          }

          .mito-input-label-static {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--scoped-text);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.35rem;
          }

          .mito-input-base {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.3s ease;
          }

          /* Dropzone Core Styling */
          .mito-input-dropzone {
            width: 100%;
            box-sizing: border-box; /* Crucial for containment */
            height: auto;
            min-height: 60px;
            cursor: pointer;
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            transition: all 0.2s ease;
          }
          .mito-input-dropzone:disabled, .mito-input-dropzone[data-readonly="true"] {
            cursor: default;
            opacity: 0.7;
          }

          /* --- Outline Dropzone Variant --- */
          .mito-dropzone-outline {
            background-color: transparent;
            border: 2px dashed var(--scoped-border);
            border-radius: 6px;
          }
          .mito-dropzone-outline:hover:not([data-readonly="true"]) { border-color: var(--scoped-active); background-color: rgba(37, 99, 235, 0.02); }
          .mito-dropzone-outline[data-error="true"] { border-color: var(--scoped-error); background-color: rgba(239, 68, 68, 0.02); }

          /* --- Material Dropzone Variant --- */
          .mito-dropzone-material {
            background-color: var(--scoped-bg);
            border-bottom: 2px solid var(--scoped-border);
            border-radius: 4px 4px 0 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .mito-input-wrapper.mito-input-dark .mito-dropzone-material { box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
          .mito-dropzone-material:hover:not([data-readonly="true"]) { border-bottom-color: var(--scoped-active); }
          .mito-dropzone-material[data-error="true"] { border-bottom-color: var(--scoped-error); }

          /* --- Neumorphic Dropzone Variant --- */
          .mito-dropzone-neumorphic {
            background-color: var(--mito-input-bg-env);
            border-radius: 12px;
            border: 1px solid transparent;
            box-shadow: inset 4px 4px 8px var(--mito-input-shadow-dark), inset -4px -4px 8px var(--mito-input-shadow-light);
          }
          .mito-dropzone-neumorphic[data-has-files="true"] {
             box-shadow: 6px 6px 12px var(--mito-input-shadow-dark), -6px -6px 12px var(--mito-input-shadow-light);
          }
          .mito-dropzone-neumorphic:hover:not([data-readonly="true"]) {
            box-shadow: inset 6px 6px 12px var(--mito-input-shadow-dark), inset -6px -6px 12px var(--mito-input-shadow-light);
          }
          .mito-dropzone-neumorphic[data-error="true"] { border-color: var(--scoped-error); }

          /* --- Skeuomorphic Dropzone Variant --- */
          .mito-dropzone-skeuomorphic {
            background-color: var(--mito-input-bg-env);
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(255,255,255,0) 100%);
            border-radius: 8px;
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.2);
          }
          .mito-input-wrapper.mito-input-dark .mito-dropzone-skeuomorphic {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 100%);
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.1);
          }
          .mito-dropzone-skeuomorphic:hover:not([data-readonly="true"]) { box-shadow: inset 0 2px 8px rgba(0,0,0,0.2), 0 0 0 2px rgba(37, 99, 235, 0.4); }
          .mito-dropzone-skeuomorphic[data-error="true"] { border-color: var(--scoped-error); box-shadow: inset 0 2px 8px rgba(0,0,0,0.2), 0 0 0 1px var(--scoped-error); }
          
          /* Attached File Item Card Styling */
          .mito-file-card {
            width: 100%;
            box-sizing: border-box; /* Crucial for containment */
            padding: 8px 12px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.2s ease;
          }
          .mito-card-outline { border: 1px solid var(--scoped-border); background-color: var(--scoped-bg); }
          .mito-card-material { border: none; background-color: var(--scoped-bg); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .mito-input-wrapper.mito-input-dark .mito-card-material { box-shadow: 0 2px 5px rgba(0,0,0,0.4); }
          .mito-card-neumorphic { border: none; background-color: var(--mito-input-bg-env); box-shadow: 4px 4px 8px var(--mito-input-shadow-dark), -4px -4px 8px var(--mito-input-shadow-light); }
          .mito-card-skeuomorphic { 
            border: 1px solid rgba(0,0,0,0.2); 
            background-color: var(--mito-input-bg-env); 
            background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5); 
          }
          .mito-input-wrapper.mito-input-dark .mito-card-skeuomorphic {
            border-color: rgba(255,255,255,0.1);
            background-image: linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          }

          /* Floating Label Logic (Fallback for Dropzone layout) */
          .mito-input-floating-label {
            position: absolute;
            left: 14px;
            top: 24px; /* Centered in standard dropzone header */
            transform: translateY(-50%);
            font-size: 0.95rem;
            color: var(--scoped-placeholder);
            pointer-events: none;
            background-color: transparent;
            padding: 0 4px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 3;
            margin-left: -4px;
          }
          .mito-input-floating-label.floating {
            top: -2px; /* Pull up to the top edge */
            left: 10px;
            font-size: 0.75rem;
            color: var(--scoped-active);
            font-weight: 500;
            background-color: var(--scoped-bg);
          }
          .mito-dropzone-neumorphic .mito-input-floating-label.floating { background-color: var(--mito-input-bg-env); }
          .mito-dropzone-skeuomorphic .mito-input-floating-label.floating { background-color: var(--mito-input-bg-env); }
          .mito-input-dropzone[data-error="true"] ~ .mito-input-floating-label.floating { color: var(--scoped-error); }

          /* Validation Text */
          .mito-input-error-text {
            font-size: 0.75rem;
            color: var(--scoped-error);
            margin-top: 6px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
            animation: mito-fade-in 0.3s ease;
          }
          @keyframes mito-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        `}} />
        
        {inputLabel && !floatingLabel && (
          <label className="mito-input-label-static" htmlFor={inputId}>
            {inputLabel}
            {isHinted && (
              <TooltipPrimitive.Provider delayDuration={300}>
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <a href={hintUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
                      <Icon name="questionmarkcircled" height="14" width="14" style={{ color: 'var(--scoped-placeholder)', marginLeft: '4px' }} />
                    </a>
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content 
                      sideOffset={5} 
                      style={{ 
                        backgroundColor: darkMode ? '#374151' : '#111827', 
                        color: '#f9fafb', 
                        padding: '6px 10px', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem',
                        fontFamily: 'inherit',
                        zIndex: 50
                      }}
                    >
                      {hintText || "Information"}
                      <TooltipPrimitive.Arrow style={{ fill: darkMode ? '#374151' : '#111827' }} />
                    </TooltipPrimitive.Content>
                  </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
              </TooltipPrimitive.Provider>
            )}
          </label>
        )}

        <div className="mito-input-base">
          <div 
            className={`mito-input-dropzone mito-dropzone-${design}`}
            data-error={hasError}
            data-readonly={readOnly || props.disabled}
            data-has-files={hasValue}
            onClick={() => !(readOnly || props.disabled) && inputRef.current?.click()}
          >
            <Flex align="center" gap="4" style={{ width: '100%', minHeight: '36px' }}>
              <Box 
                style={{ 
                  background: (design === 'neumorphic' || design === 'skeuomorphic') ? 'transparent' : (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'), 
                  borderRadius: '50%', 
                  padding: '12px', 
                  flexShrink: 0, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: design === 'neumorphic' ? 'inset 2px 2px 5px var(--mito-input-shadow-dark), inset -2px -2px 5px var(--mito-input-shadow-light)' : 'none' 
                }}
              >
                {icon ? icon : <Icon name='upload' width="20" height="20" style={{ color: 'var(--scoped-active)' }} />}
              </Box>
              &nbsp;&nbsp;
              <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                <Text weight="bold" style={{ color: 'var(--scoped-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {hasValue ? `${currentFiles.length} file${currentFiles.length !== 1 ? 's' : ''} attached` : (multiple ? "Choose files..." : "Choose file...")}
                </Text>
                <Text size="1" style={{ color: 'var(--scoped-placeholder)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {helperText}
                </Text>
              </Flex>
            </Flex>

            <input
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
              }}
              id={inputId}
              name={alias}
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={handleFileChange}
              onFocus={(e) => {
                setIsFocused(true);
                if (props.onFocus) props.onFocus(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                if (onBlur) onBlur(e);
              }}
              disabled={readOnly || props.disabled}
              style={{ display: 'none' }}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${alias}-error` : undefined}
            />

            {hasValue && (
              <Flex direction="column" gap="3" style={{ width: '100%', marginTop: '8px' }}>
                {currentFiles.map((file, idx) => (
                  <div 
                    key={`${file.name}-${idx}`} 
                    className={`mito-file-card mito-card-${design}`}
                    onClick={(e) => e.stopPropagation()} 
                  >
                    {preview && objectUrls[file.name] ? (
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={objectUrls[file.name]} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <Box style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', flexShrink: 0, background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                        {getFileIcon(file)}
                      </Box>
                    )}

                    <Flex direction="column" style={{ flexGrow: 1, minWidth: 0 }}>
                      <Text size="2" weight="bold" style={{ color: 'var(--scoped-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</Text>
                      <Flex gap="3" align="center">
                        <Text size="1" style={{ color: 'var(--scoped-placeholder)' }}>{formatBytes(file.size)}</Text>&nbsp;
                        <Badge size="1" color={darkMode ? "gray" : "indigo"} variant="soft">&nbsp;{file.name.split('.').pop()?.toUpperCase()}&nbsp;</Badge>
                      </Flex>
                    </Flex>

                    {!(readOnly || props.disabled) && (
                      <IconButton size="1" variant="ghost" color="red" type="button" onClick={() => handleRemove(idx)} style={{ borderRadius: '50%', cursor: 'pointer' }}>
                        <Icon name='close' width="16" height="16" />
                      </IconButton>
                    )}
                  </div>
                ))}
              </Flex>
            )}
          </div>
          
          {inputLabel && floatingLabel && (
            <label 
              className={`mito-input-floating-label ${isFloating ? 'floating' : ''}`} 
              htmlFor={inputId}
            >
              {inputLabel}
            </label>
          )}
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="mito-input-error-text" role="alert">
            <Icon name="error" width="12" height="12" aria-hidden="true" />
            {typeof displayError === 'string' ? displayError : "File is required"}
          </span>
        )}
      </div>
    </Column>
  );
});

FileInput.displayName = 'FileInput';