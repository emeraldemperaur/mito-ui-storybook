"use client";

import React, { useRef, useState, useEffect, useMemo, type JSX } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";

export type SortDirection = 'asc' | 'desc';

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | string; 
  render?: (row: T) => React.ReactNode; 
  sortable?: boolean; 
}

export interface SortConfig<T> {
  key: keyof T | string;
  direction: SortDirection;
}

export interface DataTableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'data'> {
  columns: ColumnDef<T>[];
  data: T[];
  design?: DesignVariant;
  asChild?: boolean;
  darkMode?: boolean;
  darkModeColors?: { light: string; dark: string };
  backgroundColor?: string;
  fontFamily?: string;
  neuIntensity?: number;
  elevation?: number;
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  selectable?: boolean;
  isLoading?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  initialSort?: SortConfig<T> | null;
  pagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps<any>>(<T extends Record<string, any>>({ 
  columns, 
  data, 
  design = 'material',
  asChild = false,
  darkMode = false,
  darkModeColors,
  backgroundColor,
  fontFamily = '"Bodoni Moda Variable", serif',
  neuIntensity = 1,
  elevation = 6,
  lightSource = 'top-left',
  selectable = false,
  isLoading = false,
  onSelectionChange,
  initialSort = null,
  pagination = false,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
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
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement);
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -15 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 15 * neuIntensity);

      setNeuVars({
        '--tbl-env-bg': parentBg,
        '--tbl-shadow-dark': shadowDark,
        '--tbl-shadow-light': shadowLight,
        '--tbl-x': `${x}px`,
        '--tbl-y': `${y}px`,
        '--tbl-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor]);

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

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--tbl-font': fontFamily,
    '--tbl-bg': backgroundColor || (darkMode ? '#1f2937' : '#ffffff'),
    '--tbl-text': darkMode ? '#f9fafb' : '#212529',
    '--tbl-border': darkMode ? '#374151' : '#f3f4f6',
    '--tbl-header-bg': darkMode ? '#111827' : '#f9fafb',
    '--tbl-header-text': darkMode ? '#9ca3af' : '#6b7280',
    '--tbl-hover': darkMode ? '#374151' : '#f9fafb',
    '--tbl-secondary-text': darkMode ? '#9ca3af' : '#6b7280',
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
      className={`v-data-table-wrapper v-table-${design} ${className}`}
      style={{ ...cssVariables, ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .v-data-table-wrapper { width: 100%; overflow-x: auto; box-sizing: border-box; font-family: var(--tbl-font); transition: all 0.3s ease; background-color: var(--tbl-bg); }
        .v-table-outline { border-radius: 0.5rem; border: 1px solid var(--tbl-border); }
        .v-table-material { border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .v-table-neumorphic { background-color: var(--tbl-env-bg); border-radius: 1rem; border: none; box-shadow: var(--tbl-x) var(--tbl-y) var(--tbl-blur) var(--tbl-shadow-dark), calc(var(--tbl-x) * -1) calc(var(--tbl-y) * -1) var(--tbl-blur) var(--tbl-shadow-light); }
        .v-table-neumorphic .v-custom-data-table .v-table-header th { background-color: transparent; }
        .v-table-neumorphic .v-custom-data-table .v-table-body tr { background-color: transparent; }
        .v-table-neumorphic .v-custom-data-table .v-table-body tr:hover { background-color: rgba(128,128,128,0.05); }
        .v-custom-data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .v-custom-data-table th, .v-custom-data-table td { padding: 1rem 1.5rem; white-space: nowrap; border-bottom: 1px solid var(--tbl-border); }
        .v-table-header th { background-color: var(--tbl-header-bg); color: var(--tbl-header-text); font-size: 0.80rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; transition: background-color 0.2s; }
        .v-table-body tr { background-color: var(--tbl-bg); color: var(--tbl-text); transition: background-color 0.2s ease; }
        .v-table-body tr:hover { background-color: var(--tbl-hover); }
        .v-empty-state { text-align: center; color: var(--tbl-secondary-text); padding: 2.5rem; }
        .v-checkbox-cell { width: 40px; text-align: center; padding-right: 0 !important; }
        .v-tbl-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: var(--ui-brand-color); }
        .v-custom-data-table .v-table-body tr.v-selected-row { background-color: rgba(59, 130, 246, 0.08); }
        .v-pagination-footer { display: flex; justify-content: flex-end; align-items: center; padding: 0.75rem 1.5rem; gap: 2rem; color: var(--tbl-secondary-text); font-size: 0.875rem; }
        .v-pagination-select { background-color: transparent; border: none; color: var(--tbl-text); cursor: pointer; outline: none; font-family: inherit; font-size: 0.875rem; }
        .v-pagination-btn { background: none; border: none; padding: 4px; border-radius: 4px; color: var(--tbl-text); display: flex; align-items: center; transition: all 0.2s; }
        .v-pagination-btn:hover:not(:disabled) { background-color: var(--tbl-hover); }
        .v-pagination-btn:disabled { opacity: 0.3; cursor: not-allowed; }
      `}} />

      <table className="v-custom-data-table">
        <thead className="v-table-header">
          <tr>
            {selectable && (
              <th scope="col" className="v-checkbox-cell">
                <input type="checkbox" className="v-tbl-checkbox" checked={isAllVisibleSelected} ref={input => { if (input) input.indeterminate = isSomeVisibleSelected; }} onChange={handleSelectAll} aria-label="Select all rows" disabled={isLoading || displayData.length === 0} />
              </th>
            )}
            {columns.map((col, index) => (
              <th key={index} scope="col" onClick={() => col.sortable ? requestSort(col.accessor) : null} style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {col.header}
                  {col.sortable && (<span style={{ fontSize: '0.75rem', opacity: sortConfig?.key === col.accessor ? 0.8 : 0.3 }}>{sortConfig?.key === col.accessor ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}</span>)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="v-table-body">
          {isLoading ? (
            <tr><td colSpan={colSpanCount} className="v-empty-state">Loading data...</td></tr>
          ) : displayData.length === 0 ? (
            <tr><td colSpan={colSpanCount} className="v-empty-state">No records found.</td></tr>
          ) : (
            displayData.map((row, index) => {
              const actualIndex = pagination ? startIndex + index : index;
              const isSelected = selectedIndices.has(actualIndex);
              return (
                <tr key={actualIndex} className={isSelected ? 'v-selected-row' : ''} aria-selected={isSelected}>
                  {selectable && (
                    <td className="v-checkbox-cell">
                      <input type="checkbox" className="v-tbl-checkbox" checked={isSelected} onChange={(e) => handleRowSelect(actualIndex, e.target.checked)} aria-label={`Select row`} />
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>{col.render ? col.render(row) : (row[col.accessor as keyof T] as React.ReactNode)}</td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {pagination && !isLoading && totalRecords > 0 && (
        <div className="v-pagination-footer" style={{ borderTop: design === 'neumorphic' ? 'none' : '1px solid var(--tbl-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Rows per page:</span>
            <select className="v-pagination-select" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
              {pageSizeOptions.map(size => (<option key={size} value={size} style={{ color: '#111827', backgroundColor: '#ffffff' }}>{size}</option>))}
            </select>
          </div>
          <div>{startIndex + 1}-{endIndex} of {totalRecords}</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="v-pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>◀</button>
            <button type="button" className="v-pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>▶</button>
          </div>
        </div>
      )}
    </Comp>
  );
});

export default DataTable as <T extends Record<string, any>>(props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => ReturnType<typeof DataTable>;