"use client";

import React, { useRef, useState, useEffect, useMemo, type JSX, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";

/**
 * @type SortDirection
 * @description Strong string literal union determining the chronological or alphabetical sorting order.
 */
export type SortDirection = 'asc' | 'desc';

export type DataTableDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @interface ColumnDef
 * @description Defines the structural and behavioral configuration for a single table column.
 */
export interface ColumnDef<T> {
  /** The text label displayed in the column header. */
  header: string;
  /** The object key used to extract the cell value from the dataset. */
  accessor: keyof T | string; 
  /** Optional render function to bypass standard text output and inject custom React nodes (e.g., status badges, action buttons). */
  render?: (row: T) => React.ReactNode; 
  /** Toggles the column header as an interactive sort trigger. @default false */
  sortable?: boolean; 
  /** Explicit minimum width control to prevent column clashing. (e.g., '150px') */
  minWidth?: string;
  /** Horizontal alignment for the column header and cell content. @default 'left' */
  align?: 'left' | 'center' | 'right';
}

/**
 * @interface SortConfig
 * @description Tracks the active column sorting state.
 */
export interface SortConfig<T> {
  /** The currently active accessor key being sorted. */
  key: keyof T | string;
  /** The direction of the active sort. */
  direction: SortDirection;
}

/**
 * @interface DataTableProps
 * @description Strongly-typed attributes configuring the DataTable's layout, pagination, theming, and interaction events.
 */
export interface DataTableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'data'> {
  /** Array of column definitions determining the horizontal layout and data mapping. */
  columns: ColumnDef<T>[];
  /** The primary array of objects to be rendered into the table rows. */
  data: T[];
  
  // --- COMPOSITE LAYOUT CONTROLS ---
  /** Inject a custom ReactNode above the table as a distinct header panel (e.g., Search bars, filters). */
  headerNode?: ReactNode;
  /** Inject a custom ReactNode below the table as a distinct footer panel, replacing the default pagination. */
  footerNode?: ReactNode;
  
  // --- AESTHETIC & DESIGN CONTROLS ---
  /** The architectural design system variation dictating the visual styling. @default 'material' */
  design?: DataTableDesignVariant;
  /** Explicit override for the container border radius. @default '16px' */
  borderRadius?: string | number;
  /** Toggles an enterprise-grade realistic translucent glassmorphism aesthetic. @default false */
  trueGlass?: boolean;
  /** Explicit background color override for light mode contexts. */
  backgroundColor?: string;
  /** Explicit background color override specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Explicit text color override for light mode contexts. */
  textColor?: string;
  /** Explicit text color override specifically for dark mode contexts. */
  darkTextColor?: string;
  /** Explicit header text color override for light mode contexts. */
  headerTextColor?: string;
  /** Explicit header text color override specifically for dark mode contexts. */
  darkHeaderTextColor?: string;
  /** Custom CSS font-family string applied globally to the table content. */
  fontFamily?: string;
  /** Force dark mode rendering independent of the global context. @default false */
  darkMode?: boolean;
  /** Dynamic light/dark mode brand colors injected into the CSS variables to override global context. */
  darkModeColors?: { light: string; dark: string };
  /** Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. @default 1 */
  neuIntensity?: number;
  /** Neumorphic 3D extrusion distance in pixels. Controls shadow spread and offset. @default 6 */
  elevation?: number;
  /** Global lighting angle that dictates the X and Y shadow trajectories. @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  // --- BEHAVIOR & INTERACTION CONTROLS ---
  /** Enables row-level checkbox selection. Injects a leading checkbox column. @default false */
  selectable?: boolean;
  /** Toggles the table into a loading state, replacing data rows with a progress indicator or empty state. @default false */
  isLoading?: boolean;
  /** Override for the default 'Loading data...' empty state text. */
  loadingData?: ReactNode;
  /** Callback function triggered whenever the row selection state changes. */
  onSelectionChange?: (selectedRows: T[]) => void;
  /** Initial sorting configuration applied immediately upon mounting. @default null */
  initialSort?: SortConfig<T> | null;
  /** Enables client-side pagination, breaking data into controlled views and appending a footer navigation block. @default false */
  pagination?: boolean;
  /** The default number of records to display per page when pagination is active. @default 10 */
  defaultPageSize?: number;
  /** The available steps mapped into the pagination size selector. @default [5, 10, 25, 50] */
  pageSizeOptions?: number[];
  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;
}

export interface TableSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

/**
 * @component DataTable
 * @description Highly extensible, SSR-safe data grid. Supports complex client-side sorting, pagination, and multi-row selection while rendering flawlessly across Outline, Material, and Neumorphic design languages.
 */
export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps<any>>(<T extends Record<string, any>>({ 
  columns, 
  data, 
  headerNode,
  footerNode,
  design = 'material',
  borderRadius = '16px',
  trueGlass = false,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  headerTextColor,
  darkHeaderTextColor,
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
  darkMode = false,
  darkModeColors,
  neuIntensity = 1,
  elevation = 6,
  lightSource = 'top-left',
  selectable = false,
  isLoading = false,
  loadingData = 'Loading data...',
  onSelectionChange,
  initialSort = null,
  pagination = false,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  asChild = false,
  className = "",
  style,
  ...props
}: DataTableProps<T>, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element => {
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)';

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement) || (darkMode ? '#1f2937' : '#f8fafc');
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -15 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 15 * neuIntensity);

      setNeuVars({
        '--mito-tbl-env-bg': parentBg,
        '--mito-tbl-shadow-dark': shadowDark,
        '--mito-tbl-shadow-light': shadowLight,
        '--mito-tbl-x': `${x}px`,
        '--mito-tbl-y': `${y}px`,
        '--mito-tbl-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor, darkMode]);

  const sortedData = useMemo(() => {
    if (!mounted) return data; 
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig, mounted]);

  const requestSort = (key: keyof T | string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const totalRecords = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
  }, [totalRecords, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const displayData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData;

  useEffect(() => {
    if (onSelectionChange && mounted) {
      const selectedRecords = sortedData.filter((_, index) => selectedIndices.has(index));
      onSelectionChange(selectedRecords);
    }
  }, [selectedIndices, sortedData, onSelectionChange, mounted]);

  const visibleIndices = displayData.map((_, i) => pagination ? startIndex + i : i);
  const isAllVisibleSelected = visibleIndices.length > 0 && visibleIndices.every(i => selectedIndices.has(i));
  const isSomeVisibleSelected = visibleIndices.some(i => selectedIndices.has(i)) && !isAllVisibleSelected;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelection = new Set(selectedIndices);
    if (e.target.checked) visibleIndices.forEach(i => newSelection.add(i));
    else visibleIndices.forEach(i => newSelection.delete(i));
    setSelectedIndices(newSelection);
  };

  const handleRowSelect = (actualIndex: number, checked: boolean) => {
    const newSelection = new Set(selectedIndices);
    if (checked) newSelection.add(actualIndex);
    else newSelection.delete(actualIndex);
    setSelectedIndices(newSelection);
  };
  
  const colSpanCount = selectable ? columns.length + 1 : columns.length;
  const resolvedRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--mito-tbl-font': fontFamily,
    '--mito-tbl-bg': backgroundColor || (darkMode ? '#1f2937' : '#ffffff'),
    '--mito-tbl-bg-dark': darkBackgroundColor || backgroundColor || '#1f2937',
    '--mito-tbl-text': textColor || (darkMode ? '#f9fafb' : '#111827'),
    '--mito-tbl-text-dark': darkTextColor || textColor || '#f9fafb',
    '--mito-tbl-border': darkMode ? '#374151' : '#e5e7eb',
    '--mito-tbl-header-bg': darkMode ? '#111827' : '#f9fafb',
    '--mito-tbl-header-text': headerTextColor || (darkMode ? '#9ca3af' : '#6b7280'),
    '--mito-tbl-header-text-dark': darkHeaderTextColor || headerTextColor || '#9ca3af',
    '--mito-tbl-hover': darkMode ? '#374151' : '#f9fafb',
    '--mito-tbl-secondary-text': darkMode ? '#9ca3af' : '#6b7280',
    '--mito-scroll-thumb': darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    '--mito-scroll-thumb-hover': darkMode ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.4)',
    ...(resolvedRadius ? { '--mito-tbl-radius': resolvedRadius } : {}),
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "div";
  const themeClass = darkMode ? 'mito-tbl-dark' : '';
  const glassClass = trueGlass ? 'mito-tbl-glass' : '';

  return (
    <Comp 
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`mito-data-table-container mito-design-${design} ${themeClass} ${glassClass} ${className}`}
      style={{ ...cssVariables, ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-data-table-container { 
          width: 100%; display: flex; flex-direction: column; box-sizing: border-box; 
          font-family: var(--mito-tbl-font); transition: all 0.3s ease; 
          color: var(--mito-tbl-text); border-radius: var(--mito-tbl-radius, 16px);
          overflow: hidden;
        }
        .mito-tbl-dark.mito-data-table-container { color: var(--mito-tbl-text-dark); }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        .mito-design-outline { background-color: var(--mito-tbl-bg); border: 1px solid var(--mito-tbl-border); }
        .mito-tbl-dark.mito-design-outline { background-color: var(--mito-tbl-bg-dark); }
        
        .mito-design-material { background-color: var(--mito-tbl-bg); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid var(--mito-tbl-border); }
        .mito-tbl-dark.mito-design-material { background-color: var(--mito-tbl-bg-dark); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); }

        .mito-design-neumorphic { 
          background-color: var(--mito-tbl-env-bg); border: none; 
          box-shadow: var(--mito-tbl-x) var(--mito-tbl-y) var(--mito-tbl-blur) var(--mito-tbl-shadow-dark), 
                      calc(var(--mito-tbl-x) * -1) calc(var(--mito-tbl-y) * -1) var(--mito-tbl-blur) var(--mito-tbl-shadow-light); 
        }

        .mito-design-skeuomorphic {
          background-color: var(--mito-tbl-env-bg);
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.02) 100%);
          border: 1px solid rgba(0,0,0,0.15);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 10px 15px -3px rgba(0,0,0,0.2);
        }
        .mito-tbl-dark.mito-design-skeuomorphic {
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.15) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.1), 0 10px 15px -3px rgba(0,0,0,0.6);
        }

        /* ------------------------- */
        /* TRUEGLASS AESTHETIC       */
        /* ------------------------- */
        .mito-tbl-glass { backdrop-filter: blur(24px) saturate(1.5); -webkit-backdrop-filter: blur(24px) saturate(1.5); }
        
        .mito-design-outline.mito-tbl-glass, .mito-design-material.mito-tbl-glass { 
          background-color: rgba(255, 255, 255, 0.45); 
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 4px 6px rgba(0,0,0,0.05); 
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .mito-tbl-dark.mito-design-outline.mito-tbl-glass, .mito-tbl-dark.mito-design-material.mito-tbl-glass { 
          background-color: rgba(31, 41, 55, 0.5); 
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 10px 15px rgba(0,0,0,0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mito-design-neumorphic.mito-tbl-glass { 
          background-color: rgba(255, 255, 255, 0.1); 
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.5), var(--mito-tbl-x) var(--mito-tbl-y) var(--mito-tbl-blur) var(--mito-tbl-shadow-dark); 
        }
        .mito-tbl-dark.mito-design-neumorphic.mito-tbl-glass {
          background-color: rgba(255, 255, 255, 0.03); 
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), var(--mito-tbl-x) var(--mito-tbl-y) var(--mito-tbl-blur) var(--mito-tbl-shadow-dark);
        }
        
        .mito-design-skeuomorphic.mito-tbl-glass { 
          background-color: rgba(255, 255, 255, 0.2); 
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.8), 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
        }
        .mito-tbl-dark.mito-design-skeuomorphic.mito-tbl-glass { 
          background-color: rgba(0, 0, 0, 0.3); 
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.5); 
        }

        /* ------------------------- */
        /* COMPOSITE SECTIONS        */
        /* ------------------------- */
        .mito-tbl-header-node { padding: 1.25rem 1.5rem; flex-shrink: 0; border-bottom: 1px solid var(--mito-tbl-border); display: flex; align-items: center; }
        .mito-design-neumorphic .mito-tbl-header-node, .mito-design-neumorphic.mito-tbl-glass .mito-tbl-header-node { border-bottom: 1px dashed var(--mito-tbl-border); }
        .mito-design-skeuomorphic .mito-tbl-header-node { border-bottom: 1px solid rgba(0,0,0,0.1); box-shadow: 0 1px 0 rgba(255,255,255,0.1); }
        .mito-tbl-dark.mito-design-skeuomorphic .mito-tbl-header-node { border-bottom: 1px solid rgba(255,255,255,0.05); box-shadow: 0 1px 0 rgba(0,0,0,0.5); }
        
        /* Table Layout Engine */
        .mito-tbl-scroll-wrapper { width: 100%; overflow-x: auto; flex-grow: 1; }
        
        /* ------------------------- */
        /* MAC-OS CUSTOM SCROLLBAR   */
        /* ------------------------- */
        .mito-data-table-container .mito-tbl-scroll-wrapper {
          scrollbar-width: thin;
          scrollbar-color: var(--mito-scroll-thumb) transparent;
        }
        .mito-data-table-container .mito-tbl-scroll-wrapper::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        .mito-data-table-container .mito-tbl-scroll-wrapper::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 8px;
        }
        .mito-data-table-container .mito-tbl-scroll-wrapper::-webkit-scrollbar-thumb {
          background-color: var(--mito-scroll-thumb);
          border-radius: 10px;
          border: 3px solid transparent; 
          background-clip: padding-box; 
          transition: background-color 0.2s ease;
        }
        .mito-data-table-container .mito-tbl-scroll-wrapper::-webkit-scrollbar-thumb:hover {
          background-color: var(--mito-scroll-thumb-hover);
        }
        /* Scrollbar Variant Overrides */
        .mito-design-neumorphic .mito-tbl-scroll-wrapper::-webkit-scrollbar-track {
          box-shadow: inset 0 0 4px rgba(0,0,0,0.03);
        }
        .mito-tbl-dark.mito-design-neumorphic .mito-tbl-scroll-wrapper::-webkit-scrollbar-track {
          box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
        }
        .mito-design-skeuomorphic .mito-tbl-scroll-wrapper::-webkit-scrollbar-thumb {
          border: 3px solid transparent;
          background-image: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%);
        }

        /* ------------------------- */
        /* ENTERPRISE CHECKBOX AESTHETICS */
        /* ------------------------- */
        .mito-checkbox-cell { width: 40px; text-align: center; padding-right: 0 !important; vertical-align: middle; }
        
        .mito-cb-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
        }

        /* Native Checkbox Visually Hidden */
        .mito-cb-native {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          margin: 0;
        }

        /* Base Visual Box */
        .mito-cb-box {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .mito-cb-native:focus-visible + .mito-cb-box { outline: 2px solid var(--ui-brand-color); outline-offset: 2px; }
        .mito-cb-native:disabled + .mito-cb-box { cursor: not-allowed; filter: grayscale(1); opacity: 0.5; }

        /* Outline Design */
        .mito-design-outline .mito-cb-box {
          width: 20px; height: 20px;
          border-radius: 4px;
          border: 1px solid var(--mito-tbl-border);
          background-color: var(--mito-tbl-bg);
          color: transparent;
        }
        .mito-design-outline .mito-cb-native:checked + .mito-cb-box {
          background-color: var(--ui-brand-color);
          border-color: var(--ui-brand-color);
          color: #ffffff;
        }

        /* Material Design */
        .mito-design-material .mito-cb-box {
          width: 20px; height: 20px;
          border-radius: 2px;
          border: 2px solid var(--mito-tbl-border);
          background-color: transparent;
          color: transparent;
        }
        .mito-design-material .mito-cb-native:checked + .mito-cb-box {
          background-color: var(--ui-brand-color);
          border-color: var(--ui-brand-color);
          color: #ffffff;
        }

        /* Neumorphic Design */
        .mito-design-neumorphic .mito-cb-box {
          width: 24px; height: 24px;
          border-radius: 6px;
          background-color: var(--mito-tbl-env-bg);
          box-shadow: 2px 2px 5px var(--mito-tbl-shadow-dark), -2px -2px 5px var(--mito-tbl-shadow-light);
          color: transparent;
          border: 1px solid transparent;
        }
        .mito-design-neumorphic .mito-cb-native:checked + .mito-cb-box {
          box-shadow: inset 2px 2px 4px var(--mito-tbl-shadow-dark), inset -2px -2px 4px var(--mito-tbl-shadow-light);
          color: var(--ui-brand-color);
        }

        /* Skeuomorphic Design */
        .mito-design-skeuomorphic .mito-cb-box {
          width: 20px; height: 20px;
          border-radius: 4px;
          background-image: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.8);
          border: 1px solid rgba(0,0,0,0.3);
          background-color: var(--mito-tbl-env-bg);
          color: transparent;
        }
        .mito-design-skeuomorphic .mito-cb-native:checked + .mito-cb-box {
          background-color: var(--ui-brand-color);
          color: #ffffff;
        }

        /* Checkmark SVG */
        .mito-cb-check {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .mito-cb-native:checked + .mito-cb-box .mito-cb-check {
          opacity: 1;
        }
        /* Partial/Indeterminate Support */
        .mito-cb-native:indeterminate + .mito-cb-box {
          background-color: var(--ui-brand-color) !important;
          border-color: var(--ui-brand-color) !important;
        }
        .mito-cb-native:indeterminate + .mito-cb-box .mito-cb-check {
          opacity: 0;
        }
        .mito-cb-native:indeterminate + .mito-cb-box::after {
          content: '';
          display: block;
          width: 10px;
          height: 2px;
          background-color: #ffffff;
          border-radius: 1px;
        }
        .mito-design-neumorphic .mito-cb-native:indeterminate + .mito-cb-box::after {
           background-color: var(--ui-brand-color);
        }

        /* ------------------------- */
        /* TRUEGLASS CHECKBOX POLISH */
        /* ------------------------- */
        .mito-tbl-glass .mito-cb-box {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        /* Outline & Material Glass */
        .mito-design-outline.mito-tbl-glass .mito-cb-box,
        .mito-design-material.mito-tbl-glass .mito-cb-box {
          background-color: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
        }
        .mito-tbl-dark.mito-design-outline.mito-tbl-glass .mito-cb-box,
        .mito-tbl-dark.mito-design-material.mito-tbl-glass .mito-cb-box {
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .mito-design-outline.mito-tbl-glass .mito-cb-native:checked + .mito-cb-box,
        .mito-design-material.mito-tbl-glass .mito-cb-native:checked + .mito-cb-box,
        .mito-design-outline.mito-tbl-glass .mito-cb-native:indeterminate + .mito-cb-box,
        .mito-design-material.mito-tbl-glass .mito-cb-native:indeterminate + .mito-cb-box {
          background-color: var(--ui-brand-color) !important;
          border-color: rgba(255,255,255,0.4) !important;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Neumorphic Glass */
        .mito-design-neumorphic.mito-tbl-glass .mito-cb-box {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3), 2px 2px 5px var(--mito-tbl-shadow-dark);
        }
        .mito-tbl-dark.mito-design-neumorphic.mito-tbl-glass .mito-cb-box {
          background-color: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 2px 2px 5px var(--mito-tbl-shadow-dark);
        }

        .mito-design-neumorphic.mito-tbl-glass .mito-cb-native:checked + .mito-cb-box {
          background-color: rgba(255,255,255,0.1) !important;
          box-shadow: inset 2px 2px 4px var(--mito-tbl-shadow-dark) !important;
          color: var(--ui-brand-color);
        }

        /* Skeuomorphic Glass */
        .mito-design-skeuomorphic.mito-tbl-glass .mito-cb-box {
          background-image: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.5);
        }
        .mito-tbl-dark.mito-design-skeuomorphic.mito-tbl-glass .mito-cb-box {
          background-image: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1);
        }
        
        .mito-design-skeuomorphic.mito-tbl-glass .mito-cb-native:checked + .mito-cb-box,
        .mito-design-skeuomorphic.mito-tbl-glass .mito-cb-native:indeterminate + .mito-cb-box {
          background-image: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%) !important;
          background-color: var(--ui-brand-color) !important;
          border: 1px solid rgba(255,255,255,0.3) !important;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.2) !important;
        }

        /* ------------------------- */
        /* TABLE CORE ELEMENTS       */
        /* ------------------------- */
        .mito-data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .mito-data-table th, .mito-data-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--mito-tbl-border); }
        
        /* Neumorphic/Skeuomorphic structural overrides */
        .mito-design-neumorphic .mito-data-table th, .mito-design-neumorphic .mito-data-table td,
        .mito-design-skeuomorphic .mito-data-table th, .mito-design-skeuomorphic .mito-data-table td {
           border-bottom: 1px solid rgba(128,128,128,0.1);
        }
        
        /* Thead / Th styling */
        .mito-data-table th { 
          background-color: var(--mito-tbl-header-bg); color: var(--mito-tbl-header-text); 
          font-size: 0.75rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; 
        }
        .mito-tbl-dark .mito-data-table th { color: var(--mito-tbl-header-text-dark); }
        .mito-tbl-glass .mito-data-table th { background-color: rgba(0,0,0,0.03); }
        .mito-tbl-dark.mito-tbl-glass .mito-data-table th { background-color: rgba(255,255,255,0.03); }
        .mito-design-neumorphic .mito-data-table th, .mito-design-skeuomorphic .mito-data-table th { background-color: transparent; }

        /* Tbody / Tr / Td styling */
        .mito-data-table .mito-tbl-body tr { transition: background-color 0.2s ease; }
        .mito-data-table .mito-tbl-body tr:hover { background-color: var(--mito-tbl-hover); }
        
        .mito-tbl-glass .mito-data-table .mito-tbl-body tr:hover,
        .mito-design-neumorphic .mito-data-table .mito-tbl-body tr:hover,
        .mito-design-skeuomorphic .mito-data-table .mito-tbl-body tr:hover { 
          background-color: rgba(128,128,128,0.08); 
        }

        .mito-empty-state { text-align: center; color: var(--mito-tbl-secondary-text); padding: 3rem 1.5rem; font-size: 0.875rem; font-style: italic; }
        .mito-data-table .mito-tbl-body tr.mito-selected-row { background-color: rgba(59, 130, 246, 0.08); }
        
        /* Pagination Footer */
        .mito-tbl-footer-node { display: flex; justify-content: flex-end; align-items: center; padding: 0.75rem 1.5rem; gap: 2rem; color: var(--mito-tbl-secondary-text); font-size: 0.875rem; border-top: 1px solid var(--mito-tbl-border); }
        .mito-design-neumorphic .mito-tbl-footer-node, .mito-design-neumorphic.mito-tbl-glass .mito-tbl-footer-node { border-top: 1px dashed var(--mito-tbl-border); }
        .mito-design-skeuomorphic .mito-tbl-footer-node { border-top: 1px solid rgba(0,0,0,0.1); box-shadow: inset 0 1px 0 rgba(255,255,255,0.2); }
        .mito-tbl-dark.mito-design-skeuomorphic .mito-tbl-footer-node { border-top: 1px solid rgba(0,0,0,0.5); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }

        .mito-pagination-select { background-color: transparent; border: none; color: inherit; cursor: pointer; outline: none; font-family: inherit; font-size: 0.875rem; font-weight: 500; }
        .mito-pagination-btn { background: none; border: none; padding: 4px 8px; border-radius: 4px; color: inherit; display: flex; align-items: center; transition: all 0.2s; cursor: pointer; }
        .mito-pagination-btn:hover:not(:disabled) { background-color: rgba(128,128,128,0.1); color: var(--mito-tbl-text); }
        .mito-pagination-btn:focus-visible { outline: 2px solid var(--ui-brand-color); }
        .mito-pagination-btn:disabled { opacity: 0.3; cursor: not-allowed; }
      `}} />

      {headerNode && (
        <TableHeader>
          {headerNode}
        </TableHeader>
      )}

      <div className="mito-tbl-scroll-wrapper">
        <table className="mito-data-table">
          <thead className="mito-tbl-header">
            <tr>
              {selectable && (
                <th scope="col" className="mito-checkbox-cell">
                  <label className="mito-cb-wrapper">
                    <input 
                      type="checkbox" 
                      className="mito-cb-native" 
                      checked={isAllVisibleSelected} 
                      ref={input => { if (input) input.indeterminate = isSomeVisibleSelected; }} 
                      onChange={handleSelectAll} 
                      aria-label="Select all rows" 
                      disabled={isLoading || displayData.length === 0} 
                    />
                    <div className="mito-cb-box">
                       <svg className="mito-cb-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </label>
                </th>
              )}
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  scope="col" 
                  onClick={() => col.sortable ? requestSort(col.accessor) : null} 
                  style={{ 
                    cursor: col.sortable ? 'pointer' : 'default', 
                    userSelect: 'none',
                    minWidth: col.minWidth || 'auto',
                    textAlign: col.align || 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}>
                    {col.header}
                    {col.sortable && (<span style={{ fontSize: '0.75rem', opacity: sortConfig?.key === col.accessor ? 0.8 : 0.3 }}>{sortConfig?.key === col.accessor ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}</span>)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="mito-tbl-body">
            {isLoading ? (
              <tr><td colSpan={colSpanCount} className="mito-empty-state">{loadingData}</td></tr>
            ) : displayData.length === 0 ? (
              <tr><td colSpan={colSpanCount} className="mito-empty-state">No records found.</td></tr>
            ) : (
              displayData.map((row, index) => {
                const actualIndex = pagination ? startIndex + index : index;
                const isSelected = selectedIndices.has(actualIndex);
                return (
                  <tr key={actualIndex} className={isSelected ? 'mito-selected-row' : ''} aria-selected={isSelected}>
                    {selectable && (
                      <td className="mito-checkbox-cell">
                        <label className="mito-cb-wrapper">
                          <input 
                            type="checkbox" 
                            className="mito-cb-native" 
                            checked={isSelected} 
                            onChange={(e) => handleRowSelect(actualIndex, e.target.checked)} 
                            aria-label={`Select row`} 
                          />
                          <div className="mito-cb-box">
                            <svg className="mito-cb-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        </label>
                      </td>
                    )}
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} style={{ textAlign: col.align || 'left', minWidth: col.minWidth || 'auto' }}>
                        {col.render ? col.render(row) : (row[col.accessor as keyof T] as ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {footerNode ? (
        <TableFooter>
          {footerNode}
        </TableFooter>
      ) : (
        pagination && !isLoading && totalRecords > 0 && (
          <TablePagination>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Rows per page:</span>
              <select className="mito-pagination-select" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
                {pageSizeOptions.map(size => (<option key={size} value={size} style={{ color: '#111827', backgroundColor: '#ffffff' }}>{size}</option>))}
              </select>
            </div>
            <div>{startIndex + 1}-{endIndex} of {totalRecords}</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="mito-pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Previous Page">◀</button>
              <button type="button" className="mito-pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Next Page">▶</button>
            </div>
          </TablePagination>
        )
      )}
    </Comp>
  );
});

export default DataTable as <T extends Record<string, any>>(props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => ReturnType<typeof DataTable>;


export const TableHeader = React.forwardRef<HTMLDivElement, TableSubComponentProps>(({ 
  asChild, className = "", style, ...props 
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-tbl-header-node ${className}`} style={style} {...props} />;
});
TableHeader.displayName = 'TableHeader';

export const TableFooter = React.forwardRef<HTMLDivElement, TableSubComponentProps>(({ 
  asChild, className = "", style, ...props 
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-tbl-footer-node ${className}`} style={style} {...props} />;
});
TableFooter.displayName = 'TableFooter';

export const TablePagination = React.forwardRef<HTMLDivElement, TableSubComponentProps>(({ 
  asChild, className = "", style, ...props 
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-tbl-footer-node ${className}`} style={style} {...props} />;
});
TablePagination.displayName = 'TablePagination';