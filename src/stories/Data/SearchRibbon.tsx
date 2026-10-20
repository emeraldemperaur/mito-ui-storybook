"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";

export interface FilterOption {
  label: string;
  value: string;
}

export interface SearchRibbonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  recordCount: number;
  recordLabel?: string; 
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
  filterOptions: FilterOption[];
  design?: DesignVariant;
  asChild?: boolean;
  backgroundColor?: string;
  fontFamily?: string;
  darkMode?: boolean;
  darkModeColors?: { light: string; dark: string };
  neuIntensity?: number;
  elevation?: number;
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const SearchRibbon = React.forwardRef<HTMLDivElement, SearchRibbonProps>(({
  recordCount,
  recordLabel = 'Records',
  searchTerm = '',
  onSearchChange,
  selectedFilter = '',
  onFilterChange,
  filterOptions,
  design = 'outline',
  asChild = false,
  backgroundColor,
  fontFamily = '"Bodoni Moda Variable", serif',
  darkMode = false,
  darkModeColors,
  neuIntensity = 1,
  elevation = 4,
  lightSource = 'top-left',
  className = "",
  style,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  const globalContext = useGlobalUIContext();
  const isReadOnly = globalContext.formikContext?.isSubmitting || false;
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)';

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement);
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -15 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 15 * neuIntensity);

      setNeuVars({
        '--ribbon-bg': parentBg,
        '--ribbon-shadow-dark': shadowDark,
        '--ribbon-shadow-light': shadowLight,
        '--ribbon-x': `${x}px`,
        '--ribbon-y': `${y}px`,
        '--ribbon-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor]);

  const handleSearchInput = (val: string) => {
    if (isReadOnly) return;
    if (onSearchChange) onSearchChange(val);
  };

  const handleFilterSelect = (val: string) => {
    if (isReadOnly) return;
    if (onFilterChange) onFilterChange(val);
  };

  const displayRecordLabel = recordCount === 1 ? recordLabel.replace(/s$/, '') : recordLabel;

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--ribbon-font': fontFamily,
    '--bg-main': backgroundColor || (darkMode ? '#1b1c1d' : '#ffffff'),
    '--bg-input': darkMode ? '#242526' : '#f9f9f9',
    '--border-color': darkMode ? '#333333' : '#e0e0e0',
    '--text-primary': darkMode ? '#ffffff' : '#0B0B45',
    '--text-muted': darkMode ? '#a9a9a9' : '#666666',
    '--focus-border': darkMode ? '#5a5a5a' : 'var(--ui-brand-color)',
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "div";

  return (
    <Comp 
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      role="search"
      aria-label="Search and filter toolbar"
      className={`v-search-ribbon v-ribbon-${design} ${className}`}
      style={{ ...cssVariables, ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .v-search-ribbon { display: flex; align-items: center; justify-content: space-between; padding: 1rem 3rem; flex-wrap: wrap; gap: 1rem; font-family: var(--ribbon-font); color: var(--text-primary); transition: background-color 0.3s ease, border-color 0.3s ease; width: 100%; box-sizing: border-box; }
        .v-ribbon-outline { background-color: var(--bg-main); border-bottom: 1px solid var(--border-color); }
        .v-ribbon-outline .v-search-filter-group { background-color: var(--bg-input); border: 1px solid var(--border-color); }
        .v-ribbon-outline .v-search-filter-group:focus-within { border-color: var(--focus-border); }
        .v-ribbon-material { background-color: var(--bg-main); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .v-ribbon-material .v-search-filter-group { background-color: var(--bg-input); border: none; border-bottom: 2px solid var(--border-color); border-radius: 4px 4px 0 0; }
        .v-ribbon-material .v-search-filter-group:focus-within { border-bottom-color: var(--focus-border); }
        .v-ribbon-neumorphic { background-color: transparent; padding: 1rem 1rem; }
        .v-ribbon-neumorphic .v-search-filter-group { background-color: var(--ribbon-bg); border: none; border-radius: 12px; box-shadow: inset var(--ribbon-x) var(--ribbon-y) var(--ribbon-blur) var(--ribbon-shadow-dark), inset calc(var(--ribbon-x) * -1) calc(var(--ribbon-y) * -1) var(--ribbon-blur) var(--ribbon-shadow-light); }
        .v-ribbon-neumorphic .v-filter-divider { background-color: transparent; border-left: 1px dashed var(--border-color); }
        .v-ribbon-neumorphic .v-search-filter-group:focus-within { outline: 2px solid var(--focus-border); outline-offset: 2px; }
        .v-search-filter-group { display: flex; align-items: center; border-radius: 6px; overflow: hidden; transition: all 0.2s ease; }
        .v-search-input-wrapper { display: flex; align-items: center; padding-left: 14px; }
        .v-search-icon { width: 18px; height: 18px; fill: var(--text-muted); margin-right: 8px; flex-shrink: 0; }
        .v-ribbon-search-input { border: none; background: transparent; color: var(--text-primary); padding: 12px 10px 12px 0; font-size: 0.95rem; outline: none; width: 250px; font-family: inherit; }
        .v-ribbon-search-input::placeholder { color: var(--text-muted); }
        .v-ribbon-search-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .v-filter-divider { width: 1px; height: 24px; background-color: var(--border-color); flex-shrink: 0; }
        .v-ribbon-dropdown { border: none; background: transparent; color: var(--text-primary); padding: 12px 36px 12px 16px; font-size: 0.95rem; outline: none; cursor: pointer; appearance: none; font-family: inherit; font-weight: 500; }
        .v-ribbon-dropdown:disabled { opacity: 0.6; cursor: not-allowed; }
        .v-ribbon-dropdown option { background-color: var(--bg-main); color: var(--text-primary); }
        .v-dropdown-wrapper { position: relative; display: flex; align-items: center; }
        .v-dropdown-chevron { position: absolute; right: 12px; pointer-events: none; width: 16px; height: 16px; fill: var(--text-muted); }
        .v-record-count { font-size: 1.2rem; font-weight: 500; color: var(--text-muted); display: flex; align-items: baseline; gap: 8px; }
        .v-record-number { font-size: 2rem; font-weight: 700; color: var(--text-primary); line-height: 1; }
        @media (max-width: 600px) { .v-search-ribbon { padding: 1rem 1.2rem; flex-direction: column; align-items: flex-start; } .v-search-filter-group { width: 100%; flex-wrap: wrap; } .v-search-input-wrapper { flex: 1 1 100%; } .v-ribbon-search-input { width: 100%; } .v-filter-divider { width: 100%; height: 1px; } .v-dropdown-wrapper { width: 100%; } .v-ribbon-dropdown { width: 100%; } }
      `}} />

      <div className="v-search-filter-group">
        <div className="v-search-input-wrapper">
          <svg className="v-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="search"
            className="v-ribbon-search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearchInput(e.target.value)}
            aria-label="Search records"
            disabled={isReadOnly}
          />
        </div>
        <div className="v-filter-divider" aria-hidden="true" />
        <div className="v-dropdown-wrapper">
          <select className="v-ribbon-dropdown" value={selectedFilter} onChange={(e) => handleFilterSelect(e.target.value)} aria-label="Search filter category" disabled={isReadOnly}>
            {filterOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </select>
          <svg className="v-dropdown-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z" /></svg>
        </div>
      </div>

      <div className="v-record-count" aria-live="polite" aria-atomic="true">
        <span className="v-record-number">{recordCount}</span> 
        <span>{displayRecordLabel} Found</span>
      </div>
    </Comp>
  );
});

SearchRibbon.displayName = 'SearchRibbon';