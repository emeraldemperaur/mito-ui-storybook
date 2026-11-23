"use client";

import React, { useRef, useState, useEffect, type JSX, useId, useContext } from "react";
import { getIn, type FormikContextType, FormikContext } from "formik";
import { Slot } from '@radix-ui/react-slot';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type InputDesign } from "./Input";

import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';

import _Editor from 'react-simple-code-editor';
const Editor = (_Editor as any).default || _Editor;

/**
- @interface TextAreaProps
- @description Strongly-typed attributes extending native HTML textarea behaviors with Mito UI's enterprise visual variants.
- Specifically engineered for large text blocks, system logs, or source code snippets.
 */
export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** 
- @description Unique identifier mapping the textarea to its Formik state and DOM label. 
- @required
   */
  alias: string;
  /** 
- @description Text rendered above the textarea or floating over the border.
   */
  inputLabel?: string;
  /** 
- @description Toggles the interactive floating label animation (primarily used with the 'outline' variant).
- @default false
   */
  floatingLabel?: boolean;
  /**
- @description The core architectural design variant of the textarea field.
- @default 'outline'
   */
  design?: InputDesign;
  
  // --- TEXTAREA SPECIFIC CONTROLS ---
  /** Physical row count dictating the initial vertical height. @default 4 */
  rows?: number;
  /** Physical column count dictating the character width threshold. */
  cols?: number;
  /** HTML wrap attribute behavior ('soft', 'hard', 'off'). */
  wrap?: 'soft' | 'hard' | 'off';
  /** Typographic line-height override for legibility. @default '1.6' */
  lineHeight?: string | number;
  
  // --- CODE SNIPPET CONTROLS ---
  /** 
- @description Optimizes the typography and padding specifically for rendering/editing code.
- Swaps the native textarea for a PrismJS powered code editor with synchronized line numbers.
- @default false
   */
  sourceCode?: boolean;
  /** 
- @description The string identifier of the programming language (e.g., 'typescript', 'bash', 'json').
- Injects syntax highlighting and renders a sleek language badge in the top right corner.
   */
  sourceLang?: string;
  
  // --- AESTHETIC & DESIGN CONTROLS ---
  /** Forces the component into dark mode, overriding system or parent theme contexts. */
  darkMode?: boolean;
  /** Dynamic base background color for light mode. */
  backgroundColor?: string;
  /** Dynamic base background color specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Standard text color for light mode. */
  textColor?: string;
  /** Standard text color specifically for dark mode contexts. */
  darkTextColor?: string;
  /** Validation failure text color for light mode. */
  errorTextColor?: string;
  /** Validation failure text color for dark mode. */
  darkErrorTextColor?: string;
  /** Highlight color applied to the active/focused border. */
  activeColor?: string;
  /** Font family override. (Ignored if sourceCode=true). */
  fontFamily?: string;
  
  // --- INTERACTION & LAYOUT ---
  /** Toggles an active hint tooltip next to the label. */
  isHinted?: boolean;
  /** The informational text displayed inside the hint tooltip. */
  hintText?: string;
  /** Optional URL to open when the hint tooltip icon is clicked. */
  hintUrl?: string;
  /** Explicit error message string. Overrides Formik validation errors if provided. */
  errorText?: string;
  /** Viewport column width configuration value (1 to 12). @default 12 */
  width?: number;
  /** Forces container layouts to break downward onto a fresh structural row line. */
  newRow?: boolean;
  /** Specific custom style class selector appended to the root container. */
  className?: string;
  /** Inline modification style rules object. */
  style?: React.CSSProperties;
  /** Explicit Formik context object injected for nested step fields. */
  formikContext?: FormikContextType<any>;
  /** Delegates rendering to the immediate child element via Radix Slot. */
  asChild?: boolean;
  /** Unmasked raw string value callback for external state management. */
  onChange?: (value: string) => void;
}

/**
- @component TextAreaInput
- @description Master SSR-safe textarea component. Handles multi-line string state via Formik or controlled values,
- complete with macOS custom scrollbars, integrated Code Editing workflows, and Neumorphic 3D rendering.
 */
export const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  alias,
  inputLabel,
  floatingLabel = false,
  design = 'outline',
  rows = 4,
  cols,
  wrap,
  lineHeight = 1.6,
  sourceCode = false,
  sourceLang,
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
  placeholder,
  readOnly,
  isHinted,
  hintText,
  hintUrl,
  errorText,
  className = "",
  style,
  formikContext,
  asChild,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [isFocused, setIsFocused] = useState(false);
  const internalId = useId();
  const inputId = `${alias}-textarea-${internalId}`;

  const fallbackContext = useContext(FormikContext) as FormikContextType<any> | undefined;
  const activeContext = formikContext || fallbackContext;
    
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = activeContext !== undefined && typeof activeContext.setFieldValue === 'function';
  const fieldValue = isFormik ? getIn(activeContext!.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext!.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext!.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;
  const hasValue = fieldValue !== undefined && fieldValue !== null && String(fieldValue).length > 0;
  const isFloating = floatingLabel && (isFocused || hasValue);

  const themeClass = darkMode ? 'mito-input-dark' : '';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFormik) activeContext.handleChange(e);
    if (onChange) onChange(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<any>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e as React.FocusEvent<HTMLTextAreaElement>);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    setIsFocused(false);
    if (isFormik) activeContext.handleBlur(e);
    if (onBlur) onBlur(e as React.FocusEvent<HTMLTextAreaElement>);
  };

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

  const codeFont = '"Fira Code", "JetBrains Mono", Consolas, Monaco, "Courier New", monospace';
  const resolvedFont = sourceCode ? codeFont : (fontFamily || 'system-ui, -apple-system, sans-serif');
  const codeLines = (String(fieldValue || '').match(/\n/g) || []).length + 1;

  const highlightCode = (code: string) => {
    try {
      const lang = sourceLang || 'javascript';
      const grammar = Prism.languages[lang] || Prism.languages.javascript;
      return Prism.highlight(code, grammar, lang);
    } catch (e) {
      return code; 
    }
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
    '--mito-input-font': resolvedFont,
    '--mito-input-lh': lineHeight,
    '--mito-scroll-thumb': darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    '--mito-scroll-thumb-hover': darkMode ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.4)',
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  const Component = asChild ? Slot : "textarea";

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`mito-input-wrapper mito-textarea-wrapper ${themeClass} ${className}`}
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
            width: 100%;
            box-sizing: border-box;
            transition: all 0.3s ease;
          }

          /* --- TEXTAREA SPECIFIC --- */
          .mito-input-field {
            width: 100%;
            font-family: inherit;
            font-size: 0.95rem;
            line-height: var(--mito-input-lh, 1.6);
            color: var(--scoped-text);
            background: transparent;
            border: none;
            outline: none;
            box-sizing: border-box;
            resize: vertical; 
            min-height: 80px;
            transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
          }
          
          .mito-input-field::placeholder { color: var(--scoped-placeholder); opacity: 1; transition: opacity 0.2s ease; }
          .mito-input-field:focus::placeholder { opacity: 0.5; }

          /* --- MAC-OS ENTERPRISE SCROLLBAR SCOPED --- */
          .mito-textarea-wrapper .mito-input-field {
            scrollbar-width: thin;
            scrollbar-color: var(--mito-scroll-thumb) transparent;
          }
          .mito-textarea-wrapper .mito-input-field::-webkit-scrollbar {
            width: 14px;
            height: 14px;
          }
          .mito-textarea-wrapper .mito-input-field::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 8px;
            margin: 4px;
          }
          .mito-textarea-wrapper .mito-input-field::-webkit-scrollbar-thumb {
            background-color: var(--mito-scroll-thumb);
            border-radius: 10px;
            border: 3px solid transparent; 
            background-clip: padding-box; 
            transition: background-color 0.2s ease;
          }
          .mito-textarea-wrapper .mito-input-field::-webkit-scrollbar-thumb:hover {
            background-color: var(--mito-scroll-thumb-hover);
          }

          /* --- CODE EDITOR OVERRIDES --- */
          .mito-input-field.is-code-wrapper {
            display: flex;
            padding: 0 !important;
            align-items: flex-start;
            overflow-y: auto;
            resize: vertical;
          }
          .mito-code-gutter {
            display: flex;
            flex-direction: column;
            padding: 16px 12px;
            background: rgba(128,128,128,0.05);
            border-right: 1px solid var(--scoped-border);
            color: var(--scoped-placeholder);
            font-size: 0.85rem;
            text-align: right;
            user-select: none;
            min-width: 44px;
            box-sizing: border-box;
          }
          .mito-gutter-line {
            line-height: var(--mito-input-lh, 1.6);
          }
          .mito-code-editor-core {
            flex-grow: 1;
            font-family: inherit !important;
            font-size: 0.85rem !important;
            line-height: var(--mito-input-lh, 1.6) !important;
          }
          .mito-code-editor-core textarea {
            outline: none !important;
            color: var(--scoped-text) !important;
          }
          
          /* Language Badge */
          .mito-code-badge {
            position: absolute;
            top: 8px;
            right: 18px;
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 700;
            color: var(--scoped-placeholder);
            background-color: var(--scoped-bg);
            border: 1px solid var(--scoped-border);
            padding: 2px 6px;
            border-radius: 4px;
            pointer-events: none;
            user-select: none;
            z-index: 5;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .mito-input-dark .mito-code-badge {
             background-color: var(--scoped-bg);
             border: 1px solid rgba(255,255,255,0.1);
          }

          /* --- Outline Variant --- */
          .mito-input-outline {
            background-color: var(--scoped-bg);
            border: 1px solid var(--scoped-border);
            border-radius: 6px;
          }
          .mito-input-outline .mito-input-field { padding: 12px 14px; }
          .mito-input-outline:focus-within { border-color: var(--scoped-active); box-shadow: 0 0 0 1px var(--scoped-active); }
          .mito-input-outline[data-error="true"] { border-color: var(--scoped-error); box-shadow: 0 0 0 1px var(--scoped-error); }
          
          /* Floating Label Logic (Outline only) */
          .mito-input-floating-label {
            position: absolute;
            left: 14px;
            top: 14px;
            font-size: 0.95rem;
            color: var(--scoped-placeholder);
            pointer-events: none;
            background-color: var(--scoped-bg);
            padding: 0 4px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 6;
            margin-left: -4px;
          }
          .mito-input-floating-label.floating {
            top: 0;
            left: 10px;
            transform: translateY(-50%);
            font-size: 0.75rem;
            color: var(--scoped-active);
            font-weight: 500;
          }
          .mito-input-outline[data-error="true"] .mito-input-floating-label.floating { color: var(--scoped-error); }

          /* --- Material Variant --- */
          .mito-input-material {
            background-color: transparent;
            border-bottom: 2px solid var(--scoped-border);
            border-radius: 4px 4px 0 0;
          }
          .mito-input-material .mito-input-field { padding: 12px 0 8px 0; }
          .mito-input-material:focus-within {
            border-image: linear-gradient(to right, var(--scoped-active), #0202020a);
            border-image-slice: 1;
            border-bottom-width: 2px;
            background-color: rgba(156, 163, 175, 0.05);
          }
          .mito-input-material[data-error="true"] { border-bottom-color: var(--scoped-error); border-image: none; }
          
          /* Material Floating Label */
          .mito-input-material .mito-input-floating-label {
            left: 0;
            top: 12px;
            background: transparent;
            margin-left: 0;
          }
          .mito-input-material .mito-input-floating-label.floating {
            top: -12px;
            left: 0;
            transform: translateY(0);
          }

          /* --- Neumorphic Variant --- */
          .mito-input-neumorphic {
            background-color: var(--mito-input-bg-env);
            border-radius: 8px;
            box-shadow: inset 3px 3px 6px var(--mito-input-shadow-dark), inset -3px -3px 6px var(--mito-input-shadow-light);
            border: 1px solid transparent;
          }
          .mito-input-neumorphic .mito-input-field { padding: 14px 16px; }
          .mito-input-neumorphic:focus-within { box-shadow: inset 4px 4px 8px var(--mito-input-shadow-dark), inset -4px -4px 8px var(--mito-input-shadow-light); }
          .mito-input-neumorphic[data-error="true"] { border-color: var(--scoped-error); }
          .mito-input-neumorphic .mito-input-floating-label { background: transparent; }
          
          /* Neumorphic Scrollbar Override */
          .mito-design-neumorphic .mito-input-field::-webkit-scrollbar-track {
            box-shadow: inset 0 0 4px rgba(0,0,0,0.03);
          }
          .mito-input-dark.mito-design-neumorphic .mito-input-field::-webkit-scrollbar-track {
            box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
          }

          /* --- Skeuomorphic Variant --- */
          .mito-input-skeuomorphic {
            background-color: var(--mito-input-bg-env);
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(255,255,255,0) 100%);
            border-radius: 6px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.2);
          }
          .mito-input-wrapper.mito-input-dark .mito-input-skeuomorphic {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 100%);
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.1);
          }
          .mito-input-skeuomorphic .mito-input-field { padding: 12px 14px; }
          .mito-input-skeuomorphic:focus-within { box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 2px rgba(37, 99, 235, 0.4); }
          .mito-input-skeuomorphic[data-error="true"] { border-color: var(--scoped-error); box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 0 0 1px var(--scoped-error); }
          
          /* Skeuomorphic Scrollbar Override */
          .mito-design-skeuomorphic .mito-input-field::-webkit-scrollbar-thumb {
            border: 3px solid transparent;
            background-image: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%);
          }

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

        <div className={`mito-input-base mito-design-${design} mito-input-${design}`} data-error={hasError}>
          
          {sourceCode && sourceLang && (
            <div className="mito-code-badge">{sourceLang}</div>
          )}
          
          {inputLabel && floatingLabel && (
            <label 
              className={`mito-input-floating-label ${isFloating ? 'floating' : ''}`} 
              htmlFor={inputId}
            >
              {inputLabel}
            </label>
          )}

          {sourceCode ? (
            <div className="mito-input-field is-code-wrapper">
              <div className="mito-code-gutter" aria-hidden="true">
                {Array.from({ length: codeLines }).map((_, i) => (
                  <div key={i} className="mito-gutter-line">{i + 1}</div>
                ))}
              </div>
              <Editor
                textareaId={inputId}
                value={fieldValue !== undefined ? String(fieldValue) : ''}
                onValueChange={(code: string) => {
                  if (isFormik) activeContext.setFieldValue(alias, code);
                  if (onChange) onChange(code);
                }}
                highlight={highlightCode}
                padding={16}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={readOnly}
                className="mito-code-editor-core"
                style={{
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  minHeight: '80px',
                }}
              />
            </div>
          ) : (
            <Component
              ref={ref}
              id={inputId}
              name={alias}
              aria-label={inputLabel ? undefined : (placeholder || alias)}
              value={fieldValue !== undefined ? fieldValue : ''}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              readOnly={readOnly}
              placeholder={floatingLabel && !isFocused ? '' : placeholder}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${alias}-error` : undefined}
              rows={rows}
              cols={cols}
              wrap={wrap}
              className="mito-input-field"
              {...props}
            />
          )}
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="mito-input-error-text" role="alert">
            <Icon name="error" width="12" height="12" aria-hidden="true" />
            {typeof displayError === 'string' ? displayError : "Invalid input"}
          </span>
        )}
      </div>
    </Column>
  );
});

TextAreaInput.displayName = 'TextAreaInput';