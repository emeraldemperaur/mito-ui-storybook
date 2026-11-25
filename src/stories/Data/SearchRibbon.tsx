"use client";

import React, { useRef, useState, useEffect, type JSX, type ReactNode } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";
import { Icon } from "../../components/icons/Icons";
import { NumberCounter } from "../Information/NumberCounter";

/**
 * @type SearchRibbonDesignVariant
 * @description Strong string literal union representing permitted enterprise design motifs.
 */
export type SearchRibbonDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @interface FilterOption
 * @description Represents a single selectable category within the search ribbon's filter dropdown.
 */
export interface FilterOption {
  /** The human-readable text displayed in the dropdown. */
  label: string;
  /** The programmatic system value returned upon selection. */
  value: string;
}

/**
 * @interface SearchRibbonProps
 * @description Strongly-typed attributes configuring the SearchRibbon toolbar, filtering options,
 * animated record count indicators, action button slots, and granular light/dark theming.
 * Optimized for MCP context-injection.
 */
export interface SearchRibbonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  // --- DATA & SEARCH CONTROLS ---
  /** The numeric total representing the number of currently found/active records. */
  recordCount: number;
  /** Text appended next to the record count. Automatically handles singular/plural removal of 's' when count is 1. @default 'Records' */
  recordLabel?: string;
  /** Trailing suffix text after the record label. @default 'Found' */
  recordSuffix?: string;
  /** Enables the incremental count-up animation for the record count using `NumberCounter`. @default false */
  animateCount?: boolean;
  /** Duration in milliseconds for the incremental counter animation. @default 1200 */
  countAnimationDuration?: number;
  /** The controlled value of the primary search input field. @default '' */
  searchTerm?: string;
  /** Placeholder text for the search input field. @default 'Search...' */
  searchPlaceholder?: string;
  /** Callback triggered continuously as the user types into the search field. */
  onSearchChange?: (value: string) => void;
  /** The programmatic value of the currently selected filter from the dropdown. @default '' */
  selectedFilter?: string;
  /** Callback triggered when the user alters the select filter category. */
  onFilterChange?: (value: string) => void;
  /** Array of `FilterOption` structures populating the category dropdown. */
  filterOptions: FilterOption[];

  // --- COMPOSITE & LAYOUT CONTROLS ---
  /** Injects custom buttons or `ActionButton` nodes cleanly positioned to the right of the search/filter group. */
  actionsNode?: ReactNode;
  /** Optional footer slot (e.g., custom pagination bar or active filter chips) rendered beneath the main ribbon bar. */
  footerNode?: ReactNode;
  /** Expands the SearchRibbon to span 100% page width with enterprise-grade padding while preventing horizontal overflow. @default false */
  fullWidth?: boolean;
  /** Explicit override for the container border radius. @default '12px' */
  borderRadius?: string | number;
  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;

  // --- AESTHETIC & DESIGN CONTROLS ---
  /** The architectural design system variation dictating the visual styling. @default 'outline' */
  design?: SearchRibbonDesignVariant;
  /** Toggles an enterprise-grade realistic translucent glassmorphism aesthetic across all design variants. @default false */
  trueGlass?: boolean;
  /** Force dark mode rendering independent of the global context. @default false */
  darkMode?: boolean;
  /** Dynamic light/dark mode brand colors injected into the CSS variables to override global context. */
  darkModeColors?: { light: string; dark: string };
  /** Custom CSS font-family string applied to all ribbon text. @default '"Bodoni Moda Variable", -apple-system, sans-serif' */
  fontFamily?: string;
  /** Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. @default 1 */
  neuIntensity?: number;
  /** Neumorphic/Skeuomorphic 3D extrusion distance in pixels. @default 4 */
  elevation?: number;
  /** Global lighting angle that dictates the X and Y shadow trajectories. @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  // --- GRANULAR COLOR OVERRIDES ---
  /** Explicit container background color override for light mode. */
  backgroundColor?: string;
  /** Explicit container background color override for dark mode. */
  darkBackgroundColor?: string;
  /** Explicit global text color override for light mode. */
  textColor?: string;
  /** Explicit global text color override for dark mode. */
  darkTextColor?: string;
  /** Explicit override for the numeric record count color in light mode. */
  recordCountColor?: string;
  /** Explicit override for the numeric record count color in dark mode. */
  darkRecordCountColor?: string;
  /** Explicit override for the 'Records Found' label text color in light mode. */
  recordLabelColor?: string;
  /** Explicit override for the 'Records Found' label text color in dark mode. */
  darkRecordLabelColor?: string;
  /** Explicit override for the search input text color in light mode. */
  inputTextColor?: string;
  /** Explicit override for the search input text color in dark mode. */
  darkInputTextColor?: string;
  /** Explicit override for the filter dropdown text color in light mode. */
  dropdownTextColor?: string;
  /** Explicit override for the filter dropdown text color in dark mode. */
  darkDropdownTextColor?: string;
}

export interface SearchRibbonSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

/**
 * @component SearchRibbon
 * @description Master enterprise composite toolbar designed to sit above DataTables or lists.
 * Orchestrates text search, categorical filtering, injected action buttons, animated record counters,
 * and optional footer/pagination overrides across Outline, Material, Neumorphic, and Skeuomorphic variants.
 */
export const SearchRibbon = React.forwardRef<HTMLDivElement, SearchRibbonProps>(({
  recordCount,
  recordLabel = 'Records',
  recordSuffix = 'Found',
  animateCount = false,
  countAnimationDuration = 1200,
  searchTerm = '',
  searchPlaceholder = 'Search...',
  onSearchChange,
  selectedFilter = '',
  onFilterChange,
  filterOptions,
  actionsNode,
  footerNode,
  fullWidth = false,
  borderRadius = '12px',
  design = 'outline',
  trueGlass = false,
  asChild = false,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  recordCountColor,
  darkRecordCountColor,
  recordLabelColor,
  darkRecordLabelColor,
  inputTextColor,
  darkInputTextColor,
  dropdownTextColor,
  darkDropdownTextColor,
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
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
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement) || (darkMode ? '#1f2937' : '#f8fafc');
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -15 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 15 * neuIntensity);

      setNeuVars({
        '--mito-sr-env-bg': parentBg,
        '--mito-sr-shadow-dark': shadowDark,
        '--mito-sr-shadow-light': shadowLight,
        '--mito-sr-x': `${x}px`,
        '--mito-sr-y': `${y}px`,
        '--mito-sr-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor, darkMode]);

  const handleSearchInput = (val: string) => {
    if (isReadOnly) return;
    if (onSearchChange) onSearchChange(val);
  };

  const handleFilterSelect = (val: string) => {
    if (isReadOnly) return;
    if (onFilterChange) onFilterChange(val);
  };

  const displayRecordLabel = recordCount === 1 ? recordLabel.replace(/s$/, '') : recordLabel;
  const resolvedRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  // Resolve light/dark granular typography tokens
  const resolvedBaseText = darkMode ? (darkTextColor || textColor || '#f9fafb') : (textColor || '#111827');
  const resolvedMutedText = darkMode ? '#9ca3af' : '#6b7280';

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--mito-sr-font': fontFamily,
    '--mito-sr-radius': fullWidth ? '0px' : resolvedRadius,
    '--mito-sr-bg': backgroundColor || (darkMode ? '#1f2937' : '#ffffff'),
    '--mito-sr-bg-dark': darkBackgroundColor || backgroundColor || '#1f2937',
    '--mito-sr-input-bg': darkMode ? 'rgba(255, 255, 255, 0.04)' : '#f9fafb',
    '--mito-sr-border': darkMode ? '#374151' : '#e5e7eb',
    '--mito-sr-text': resolvedBaseText,
    '--mito-sr-muted': resolvedMutedText,
    '--mito-sr-count-color': darkMode
      ? (darkRecordCountColor || recordCountColor || resolvedBaseText)
      : (recordCountColor || resolvedBaseText),
    '--mito-sr-label-color': darkMode
      ? (darkRecordLabelColor || recordLabelColor || resolvedMutedText)
      : (recordLabelColor || resolvedMutedText),
    '--mito-sr-input-text': darkMode
      ? (darkInputTextColor || inputTextColor || resolvedBaseText)
      : (inputTextColor || resolvedBaseText),
    '--mito-sr-dropdown-text': darkMode
      ? (darkDropdownTextColor || dropdownTextColor || resolvedBaseText)
      : (dropdownTextColor || resolvedBaseText),
    '--mito-sr-focus': darkMode ? resolvedBrandColor : resolvedBrandColor,
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "div";
  const themeClass = darkMode ? 'mito-sr-dark' : '';
  const glassClass = trueGlass ? 'mito-sr-glass' : '';
  const fullWidthClass = fullWidth ? 'mito-sr-fullwidth' : '';

  return (
    <Comp
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      role="search"
      aria-label="Search and filter toolbar"
      className={`mito-sr-root mito-sr-design-${design} ${themeClass} ${glassClass} ${fullWidthClass} ${className}`}
      style={{ ...cssVariables, ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-sr-root {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
          font-family: var(--mito-sr-font);
          color: var(--mito-sr-text);
          border-radius: var(--mito-sr-radius, 12px);
          transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .mito-sr-main-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem 1.5rem;
          padding: 1rem 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        .mito-sr-fullwidth .mito-sr-main-bar {
          padding: 1.15rem 2.5rem;
        }

        .mito-sr-controls-cluster {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          flex: 1 1 auto;
          min-width: 0;
        }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        .mito-sr-design-outline {
          background-color: var(--mito-sr-bg);
          border: 1px solid var(--mito-sr-border);
        }
        .mito-sr-dark.mito-sr-design-outline {
          background-color: var(--mito-sr-bg-dark);
        }
        .mito-sr-fullwidth.mito-sr-design-outline {
          border-left: none;
          border-right: none;
        }

        .mito-sr-design-material {
          background-color: var(--mito-sr-bg);
          border: 1px solid var(--mito-sr-border);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
        }
        .mito-sr-dark.mito-sr-design-material {
          background-color: var(--mito-sr-bg-dark);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.45);
        }

        .mito-sr-design-neumorphic {
          background-color: var(--mito-sr-env-bg);
          border: none;
          box-shadow: var(--mito-sr-x) var(--mito-sr-y) var(--mito-sr-blur) var(--mito-sr-shadow-dark),
                      calc(var(--mito-sr-x) * -1) calc(var(--mito-sr-y) * -1) var(--mito-sr-blur) var(--mito-sr-shadow-light);
        }

        .mito-sr-design-skeuomorphic {
          background-color: var(--mito-sr-env-bg);
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.03) 100%);
          border: 1px solid rgba(0, 0, 0, 0.15);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.45), 0 8px 15px -3px rgba(0, 0, 0, 0.18);
        }
        .mito-sr-dark.mito-sr-design-skeuomorphic {
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.2) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.55);
        }

        /* ------------------------- */
        /* TRUEGLASS AESTHETIC       */
        /* ------------------------- */
        .mito-sr-glass {
          backdrop-filter: blur(24px) saturate(1.5);
          -webkit-backdrop-filter: blur(24px) saturate(1.5);
        }

        .mito-sr-design-outline.mito-sr-glass,
        .mito-sr-design-material.mito-sr-glass {
          background-color: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 4px 12px rgba(0, 0, 0, 0.06);
        }
        .mito-sr-dark.mito-sr-design-outline.mito-sr-glass,
        .mito-sr-dark.mito-sr-design-material.mito-sr-glass {
          background-color: rgba(31, 41, 55, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.06), 0 10px 20px rgba(0, 0, 0, 0.35);
        }

        .mito-sr-design-neumorphic.mito-sr-glass {
          background-color: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.5),
                      var(--mito-sr-x) var(--mito-sr-y) var(--mito-sr-blur) var(--mito-sr-shadow-dark);
        }
        .mito-sr-dark.mito-sr-design-neumorphic.mito-sr-glass {
          background-color: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.06),
                      var(--mito-sr-x) var(--mito-sr-y) var(--mito-sr-blur) var(--mito-sr-shadow-dark);
        }

        .mito-sr-design-skeuomorphic.mito-sr-glass {
          background-color: rgba(255, 255, 255, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.75), 0 10px 15px -3px rgba(0, 0, 0, 0.12);
        }
        .mito-sr-dark.mito-sr-design-skeuomorphic.mito-sr-glass {
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }

        /* ------------------------- */
        /* SEARCH & FILTER GROUP     */
        /* ------------------------- */
        .mito-sr-group {
          display: flex;
          align-items: center;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          max-width: 100%;
          box-sizing: border-box;
        }

        .mito-sr-design-outline .mito-sr-group {
          background-color: var(--mito-sr-input-bg);
          border: 1px solid var(--mito-sr-border);
        }
        .mito-sr-design-outline .mito-sr-group:focus-within {
          border-color: var(--mito-sr-focus);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .mito-sr-design-material .mito-sr-group {
          background-color: var(--mito-sr-input-bg);
          border: none;
          border-bottom: 2px solid var(--mito-sr-border);
          border-radius: 6px 6px 0 0;
        }
        .mito-sr-design-material .mito-sr-group:focus-within {
          border-bottom-color: var(--mito-sr-focus);
        }

        .mito-sr-design-neumorphic .mito-sr-group {
          background-color: var(--mito-sr-env-bg);
          border: 1px solid transparent;
          border-radius: 10px;
          box-shadow: inset var(--mito-sr-x) var(--mito-sr-y) var(--mito-sr-blur) var(--mito-sr-shadow-dark),
                      inset calc(var(--mito-sr-x) * -1) calc(var(--mito-sr-y) * -1) var(--mito-sr-blur) var(--mito-sr-shadow-light);
        }
        .mito-sr-design-neumorphic .mito-sr-group:focus-within {
          outline: 2px solid var(--mito-sr-focus);
          outline-offset: 2px;
        }

        .mito-sr-design-skeuomorphic .mito-sr-group {
          background-color: rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.18);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 0 rgba(255, 255, 255, 0.6);
        }
        .mito-sr-dark.mito-sr-design-skeuomorphic .mito-sr-group {
          background-color: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        .mito-sr-design-skeuomorphic .mito-sr-group:focus-within {
          border-color: var(--mito-sr-focus);
        }

        /* Glass Input Well Polish */
        .mito-sr-glass .mito-sr-group {
          background-color: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .mito-sr-dark.mito-sr-glass .mito-sr-group {
          background-color: rgba(0, 0, 0, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        /* Input & Clear Button */
        .mito-sr-input-wrap {
          display: flex;
          align-items: center;
          padding: 0 10px 0 14px;
          flex: 1 1 auto;
          min-width: 0;
        }
        .mito-sr-search-icon {
          color: var(--mito-sr-muted);
          margin-right: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .mito-sr-input {
          border: none;
          background: transparent;
          color: var(--mito-sr-input-text);
          padding: 10px 4px 10px 0;
          font-size: 0.925rem;
          outline: none;
          width: 240px;
          max-width: 100%;
          font-family: inherit;
          box-sizing: border-box;
        }
        .mito-sr-input::placeholder {
          color: var(--mito-sr-muted);
          opacity: 0.8;
        }
        .mito-sr-input:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .mito-sr-clear-btn {
          background: transparent;
          border: none;
          color: var(--mito-sr-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease, background-color 0.15s ease;
        }
        .mito-sr-clear-btn:hover {
          color: var(--mito-sr-text);
          background-color: rgba(128, 128, 128, 0.12);
        }

        /* Divider */
        .mito-sr-divider {
          width: 1px;
          height: 24px;
          background-color: var(--mito-sr-border);
          flex-shrink: 0;
        }
        .mito-sr-design-neumorphic .mito-sr-divider {
          background-color: transparent;
          border-left: 1px dashed var(--mito-sr-border);
        }

        /* Filter Dropdown */
        .mito-sr-dropdown-wrap {
          position: relative;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .mito-sr-dropdown {
          border: none;
          background: transparent;
          color: var(--mito-sr-dropdown-text);
          padding: 10px 34px 10px 14px;
          font-size: 0.925rem;
          outline: none;
          cursor: pointer;
          appearance: none;
          font-family: inherit;
          font-weight: 500;
        }
        .mito-sr-dropdown:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .mito-sr-dropdown option {
          background-color: var(--mito-sr-bg);
          color: var(--mito-sr-text);
        }
        .mito-sr-dark .mito-sr-dropdown option {
          background-color: var(--mito-sr-bg-dark);
        }
        .mito-sr-chevron {
          position: absolute;
          right: 10px;
          pointer-events: none;
          color: var(--mito-sr-muted);
          display: flex;
          align-items: center;
        }

        /* Actions Slot */
        .mito-sr-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        /* Record Count */
        .mito-sr-count {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-shrink: 0;
        }
        .mito-sr-count-num {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--mito-sr-count-color);
          line-height: 1;
        }
        .mito-sr-count-label {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--mito-sr-label-color);
        }

        /* Optional Footer / Pagination Slot */
        .mito-sr-footer {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 1.5rem;
          border-top: 1px solid var(--mito-sr-border);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
        }
        .mito-sr-fullwidth .mito-sr-footer {
          padding: 0.75rem 2.5rem;
        }
        .mito-sr-design-neumorphic .mito-sr-footer {
          border-top: 1px dashed var(--mito-sr-border);
        }

        /* ------------------------- */
        /* RESPONSIVE BREAKPOINTS    */
        /* ------------------------- */
        @media (max-width: 768px) {
          .mito-sr-main-bar,
          .mito-sr-fullwidth .mito-sr-main-bar {
            padding: 1rem 1.25rem;
          }
          .mito-sr-footer,
          .mito-sr-fullwidth .mito-sr-footer {
            padding: 0.75rem 1.25rem;
          }
          .mito-sr-input {
            width: 180px;
          }
        }

        @media (max-width: 600px) {
          .mito-sr-main-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .mito-sr-controls-cluster {
            flex-direction: column;
            align-items: stretch;
          }
          .mito-sr-group {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .mito-sr-input-wrap {
            width: 100%;
            box-sizing: border-box;
          }
          .mito-sr-input {
            width: 100%;
          }
          .mito-sr-divider {
            width: 100%;
            height: 1px;
            border-left: none !important;
          }
          .mito-sr-design-neumorphic .mito-sr-divider {
            border-top: 1px dashed var(--mito-sr-border);
          }
          .mito-sr-dropdown-wrap,
          .mito-sr-dropdown {
            width: 100%;
          }
          .mito-sr-actions {
            justify-content: flex-start;
          }
          .mito-sr-count {
            justify-content: flex-end;
            padding-top: 0.25rem;
          }
        }
      `}} />

      <div className="mito-sr-main-bar">
        <div className="mito-sr-controls-cluster">
          <SearchRibbonGroup>
            <div className="mito-sr-input-wrap">
              <span className="mito-sr-search-icon" aria-hidden="true">
                <Icon name="search" width="16" height="16" />
              </span>
              <input
                type="search"
                className="mito-sr-input"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchInput(e.target.value)}
                aria-label="Search records"
                disabled={isReadOnly}
              />
              {searchTerm && !isReadOnly && (
                <button
                  type="button"
                  className="mito-sr-clear-btn"
                  onClick={() => handleSearchInput('')}
                  aria-label="Clear search"
                >
                  <Icon name="close" width="14" height="14" />
                </button>
              )}
            </div>

            {filterOptions.length > 0 && (
              <>
                <div className="mito-sr-divider" aria-hidden="true" />
                <div className="mito-sr-dropdown-wrap">
                  <select
                    className="mito-sr-dropdown"
                    value={selectedFilter}
                    onChange={(e) => handleFilterSelect(e.target.value)}
                    aria-label="Search filter category"
                    disabled={isReadOnly}
                  >
                    {filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="mito-sr-chevron" aria-hidden="true">
                    <Icon name="chevrondown" width="14" height="14" />
                  </span>
                </div>
              </>
            )}
          </SearchRibbonGroup>

          {actionsNode && (
            <SearchRibbonActions>
              {actionsNode}
            </SearchRibbonActions>
          )}
        </div>

        <SearchRibbonCount aria-live="polite" aria-atomic="true">
          <NumberCounter
            value={recordCount}
            animate={animateCount}
            duration={countAnimationDuration}
            className="mito-sr-count-num"
            darkMode={darkMode}
          />
          <span className="mito-sr-count-label">
            {displayRecordLabel} {recordSuffix}
          </span>
        </SearchRibbonCount>
      </div>

      {footerNode && (
        <SearchRibbonFooter>
          {footerNode}
        </SearchRibbonFooter>
      )}
    </Comp>
  );
});

SearchRibbon.displayName = 'SearchRibbon';

/* -------------------------------------------------------------------------- */
/* EXPORTED SUB-COMPONENTS FOR DEEP COMPOSITE CONTROL                         */
/* -------------------------------------------------------------------------- */

export const SearchRibbonGroup = React.forwardRef<HTMLDivElement, SearchRibbonSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-sr-group ${className}`} {...props} />;
});
SearchRibbonGroup.displayName = 'SearchRibbonGroup';

export const SearchRibbonActions = React.forwardRef<HTMLDivElement, SearchRibbonSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-sr-actions ${className}`} {...props} />;
});
SearchRibbonActions.displayName = 'SearchRibbonActions';

export const SearchRibbonCount = React.forwardRef<HTMLDivElement, SearchRibbonSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-sr-count ${className}`} {...props} />;
});
SearchRibbonCount.displayName = 'SearchRibbonCount';

export const SearchRibbonFooter = React.forwardRef<HTMLDivElement, SearchRibbonSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-sr-footer ${className}`} {...props} />;
});
SearchRibbonFooter.displayName = 'SearchRibbonFooter';