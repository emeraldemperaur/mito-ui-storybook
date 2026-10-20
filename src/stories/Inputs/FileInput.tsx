"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { useFormikContext, getIn } from "formik";
import { Flex, Text, IconButton, Box, AspectRatio, Badge, Tooltip } from '@radix-ui/themes';
import { ACCEPTED_FORMATS, ACCEPTED_EXTENSIONS, adjustColor, formatBytes, getNearestParentBackground } from "../../utils/Vinci";
import { Icon } from "../../components/icons/Icons";
import { Column } from "../Layout/Column"; 
import { type BaseInputProps, sharedInputStyles } from "../../utils/types";
import '../../styles/main.scss';

export interface FileInputProps extends BaseInputProps {
  /** Toggles standard single file vs batch multi-file arrays. @default false */
  multiple?: boolean;
  /** Automatically generates object URLs to preview images locally. @default true */
  preview?: boolean;
  /** Overrides the standard accepted MIME types or extensions. */
  accept?: string;
}

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return <Icon name='image' width="20" height="20" />;
  if (file.type.includes('pdf')) return <Icon name='filetext' color="var(--red-9)" width="20" height="20" />;
  if (file.type.includes('csv') || file.type.includes('sheet')) return <Icon name='table' color="var(--grass-9)" width="20" height="20" />;
  if (file.name.endsWith('.zip')) return <Icon name='archive' width="20" height="20" />;
  return <Icon name='filetext' width="20" height="20" />;
};

/**
 * @component FileInput
 * @description Unified file uploader routing single/batch arrays. Supports Material, Outline, and Neumorphic dropzone styling.
 */
export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(({
  alias,
  inputLabel,
  multiple = false,
  preview = true,
  design = 'outline',
  accept = multiple ? ACCEPTED_EXTENSIONS : ACCEPTED_FORMATS,
  elevation = 3,
  darkModeColors,
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
  ...props
}, ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [objectUrls, setObjectUrls] = useState<Record<string, string>>({});

  const fallbackContext = useFormikContext<any>();
  const activeContext = formikContext || fallbackContext;
  
  const isFormik = Boolean(activeContext);
  const fieldValue = isFormik ? getIn(activeContext.values, alias) : value;
  const fieldError = isFormik ? getIn(activeContext.errors, alias) : null;
  const fieldTouched = isFormik ? getIn(activeContext.touched, alias) : null;
  
  const hasError = Boolean((fieldTouched && fieldError) || errorText);
  const displayError = errorText || fieldError;

  const currentFiles: File[] = multiple 
    ? (Array.isArray(fieldValue) ? fieldValue : []) 
    : (fieldValue ? [fieldValue as File] : []);

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
    
    if (inputRef.current) inputRef.current.value = '';
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

  const dropzoneStyles: Record<string, React.CSSProperties> = {
    outline: { border: hasError ? '2px dashed var(--red-9)' : '2px dashed var(--gray-7)', background: 'transparent' },
    material: { borderBottom: hasError ? '2px solid var(--red-9)' : '2px solid var(--accent-9)', background: 'var(--color-surface)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    neumorphic: { 
      border: 'none', background: 'var(--neu-bg)',
      boxShadow: currentFiles.length > 0 
        ? `${elevation}px ${elevation}px ${elevation * 2}px var(--neu-shadow-dark), -${elevation}px -${elevation}px ${elevation * 2}px var(--neu-shadow-light)`
        : `inset ${elevation}px ${elevation}px ${elevation * 2}px var(--neu-shadow-dark), inset -${elevation}px -${elevation}px ${elevation * 2}px var(--neu-shadow-light)`
    }
  };

  const itemCardStyles: Record<string, React.CSSProperties> = {
    outline: { border: '1px solid var(--gray-6)', background: 'var(--color-surface)' },
    material: { border: 'none', background: 'var(--color-surface)', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    neumorphic: { border: 'none', background: 'var(--neu-bg)', boxShadow: `${elevation}px ${elevation}px ${elevation * 2}px var(--neu-shadow-dark), -${elevation}px -${elevation}px ${elevation * 2}px var(--neu-shadow-light)` }
  };

  const activeDropzone = dropzoneStyles[design] || dropzoneStyles.outline;
  const activeItemCard = itemCardStyles[design] || itemCardStyles.outline;

  return (
    <Column span={width} newLine={newRow}>
      <div 
        ref={containerRef}
        className={`v-input-wrapper ${className}`}
        style={{ ...style, ...neuVars, ...(darkModeColors?.light ? { '--ui-brand-color': darkModeColors.light } : {}) } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: sharedInputStyles }} />
        
        {inputLabel && (
          <label className="v-input-label">
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

        <div 
          onClick={() => !readOnly && inputRef.current?.click()}
          style={{ height: 'auto', minHeight: '60px', cursor: readOnly ? 'default' : 'pointer', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', transition: 'all 0.2s ease', ...activeDropzone }}
        >
          {/* Main Dropzone Header */}
          <Flex align="center" gap="4" style={{ width: '100%' }}>
            <Box style={{ background: design === 'neumorphic' ? 'var(--neu-bg)' : 'var(--accent-3)', borderRadius: '50%', padding: '12px', flexShrink: 0, boxShadow: design === 'neumorphic' ? 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)' : 'none' }}>
              <Icon name='upload' width="20" height="20" color={design === 'neumorphic' ? "var(--gray-11)" : "var(--accent-9)"} />
            </Box>
            <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
              <Text weight="bold" style={{ color: 'var(--gray-12)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentFiles.length > 0 ? `${currentFiles.length} file${currentFiles.length !== 1 ? 's' : ''} attached` : "Choose files..."}
              </Text>
              <Text size="1" color="gray" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Supports PDF, Images, Excel, JSON, ZIP
              </Text>
            </Flex>
          </Flex>

          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            id={`${alias}-input`}
            name={alias}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleFileChange}
            disabled={readOnly}
            style={{ display: 'none' }}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${alias}-error` : undefined}
            {...props}
          />

          {/* Render Attached Files */}
          {currentFiles.length > 0 && (
            <Flex direction="column" gap="3" style={{ width: '100%' }}>
              {currentFiles.map((file, idx) => (
                <Flex key={`${file.name}-${idx}`} align="center" gap="3" onClick={(e) => e.stopPropagation()} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', ...activeItemCard }}>
                  
                  {preview && objectUrls[file.name] ? (
                    <AspectRatio ratio={1} style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={objectUrls[file.name]} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </AspectRatio>
                  ) : (
                    <Box style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, flexShrink: 0, background: 'var(--gray-3)' }}>
                      {getFileIcon(file)}
                    </Box>
                  )}

                  <Flex direction="column" style={{ flexGrow: 1, minWidth: 0 }}>
                    <Text size="2" weight="bold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</Text>
                    <Flex gap="2" align="center">
                      <Text size="1" color="gray">{formatBytes(file.size)}</Text>
                      <Badge size="1" color="gray" variant="soft">{file.name.split('.').pop()?.toUpperCase()}</Badge>
                    </Flex>
                  </Flex>

                  {!readOnly && (
                    <IconButton size="1" variant="ghost" color="red" type="button" onClick={() => handleRemove(idx)} style={{ borderRadius: '50%' }}>
                      <Icon name='close' width="16" height="16" />
                    </IconButton>
                  )}
                </Flex>
              ))}
            </Flex>
          )}
        </div>

        {hasError && displayError && (
          <span id={`${alias}-error`} className="v-input-error" role="alert">
            {typeof displayError === 'string' ? displayError : "File is required"}
          </span>
        )}
      </div>
    </Column>
  );
});

FileInput.displayName = 'FileInput';