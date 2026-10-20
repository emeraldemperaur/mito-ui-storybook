/**
 * @file Vinci Utilities
 * @description High-fidelity mathematical formatters, layout DOM query heuristics, and context options definition blocks for the design token system.
 */

/**
 * Traverses upwards through the DOM hierarchy from a given starting target to find the nearest non-transparent computed background color.
 * @function getNearestBackgroundColor
 * @param {HTMLElement | null} element - The initial HTML element to trigger the lookback inspection from.
 * @returns {string} The resolved non-transparent computed CSS color string value, or `#ffffff` as a universal browser baseline fallback.
 */
export const getNearestBackgroundColor = (element: HTMLElement | null): string => {
  let current: HTMLElement | null = element;

  while (current) {
    const style: CSSStyleDeclaration = window.getComputedStyle(current);
    const color: string = style.backgroundColor;

    if (
      color && 
      color !== 'rgba(0, 0, 0, 0)' && 
      color !== 'transparent'
    ) {
      return color;
    }

    current = current.parentElement;
  }

  return '#ffffff';
};

/**
 * Traverses upwards through the DOM hierarchy from a given starting target to compute the background color needed specifically for Neumorphic depth contrasts.
 * @function getNearestParentBackground
 * @param {HTMLElement | null} element - The initial HTML element to trigger the lookup loop from.
 * @returns {string} The resolved computed CSS color string value, or `#e0e5ec` as the design system's default neumorphic neutral grey fallback surface.
 */
export const getNearestParentBackground = (element: HTMLElement | null): string => {
  let current: HTMLElement | null = element;
  
  while (current) {
    const style: CSSStyleDeclaration = window.getComputedStyle(current);
    const color: string = style.backgroundColor;
    
    if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
      return color;
    }
    current = current.parentElement;
  }
  return '#e0e5ec'; 
};

/**
 * Dynamically darkens or lightens a color parameter by modifying channel values uniformly across Hexadecimal or RGB channels.
 * @function adjustColor
 * @param {string} color - The input CSS string (supports standard pound hex format or functional `rgb()` notations).
 * @param {number} amount - A signed integer indicating magnitude shift (negative value darkens, positive value lightens).
 * @returns {string} The transformed color string matching the notation layout provided at intake.
 */
export const adjustColor = (color: string, amount: number): string => {
  let usePound = false;
  let workingColor = color;

  if (workingColor.startsWith('#')) {
    workingColor = workingColor.slice(1);
    usePound = true;
  }
  
  if (workingColor.startsWith('rgb')) {
    const rgb = workingColor.match(/\d+/g)?.map(Number);
    if (!rgb) return workingColor;
    return `rgb(${Math.max(0, Math.min(255, rgb[0] + amount))}, ${Math.max(0, Math.min(255, rgb[1] + amount))}, ${Math.max(0, Math.min(255, rgb[2] + amount))})`;
  }
  
  const num = parseInt(workingColor, 16);
  if (isNaN(num)) return color;

  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  return (usePound ? '#' : '') + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Stringified list of permitted standard and custom MIME types to assign to standard form field 'accept' layout values.
 * @constant ACCEPTED_FORMATS
 * @type {string}
 */
export const ACCEPTED_FORMATS: string = [
  "image/jpeg", "image/png", "image/gif",
  "application/pdf",
  ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".csv", "text/csv",
  "text/plain",
  "application/json",
  ".zip", "application/zip", "application/x-zip-compressed"
].join(',');

/**
 * Standard array string representing common visual/data file format extensions used to run validation guards.
 * @constant ACCEPTED_EXTENSIONS
 * @type {string}
 */
export const ACCEPTED_EXTENSIONS: string = [
  ".jpeg", ".jpg", ".pdf", ".png", ".gif", 
  ".docx", ".xlsx", ".csv", ".txt", ".json", ".zip"
].join(",");

/**
 * Formats a raw numerical bit count integer into a clean human-scannable data-rate size string value.
 * @function formatBytes
 * @param {number} bytes - Total size value expressed in bits/bytes.
 * @param {number} [decimals=2] - Number of trailing dynamic mantissa decimals to permit.
 * @returns {string} Computed metric display string (e.g., "12.45 MB").
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Conditional evaluation helper. Chains structural utility className entries together while dropping falsy items.
 * @function classNames
 * @param {string[]} classes - Array of string classes or conditional evaluations.
 * @returns {string} A unified space-separated clean class name layout block.
 */
export const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ');

/**
 * @interface InputOption
 * @description Structure definition indicating required layout models for multi-select options, lists, field context elements, or dropdown targets.
 */
export interface InputOption {
  /**
   * The required unique option identifier for tracking list index points.
   * @example optionid="version-gtr-x-1000"
   */
  optionid: number | string;
  /**
   * The visible text payload rendered directly on the viewport overlay interface.
   * @example text="Version GTR-X"
   */
  text: string; 
  /**
   * The evaluation payload tracking data variables on internal form submit cycles.
   * @example optionvalue="VGTRX-1000"
   */
  optionvalue: string | number | boolean;
  /**
   * Optional decorative label badge string.
   * @example tag="HINT"
   */
  tag?: string;
  /**
   * Optional metadata ranking weight, visibility threshold or statistical score.
   * @example score={10}
   */
  score?: number;
  /**
   * Optional technical instructions or hint message mapping context under descriptive labels.
   * @example note="This is an example hint note for the Input Option item."
   */
  note?: string; 
  /**
   * Optional contextual link location payload.
   * @example optionurl="https://github.com/emeraldemperaur/vector-sigma"
   */
  optionurl?: string;
}

/**
 * @constant InputOptionsPlaceholder
 * @type {InputOption}
 * @description Mock item initialization baseline configured to match form option parameters for layout testing safely.
 */
export const InputOptionsPlaceholder: InputOption = {
  optionid: crypto.randomUUID(),
  text: "loremipsum",
  optionvalue: "__RESET__",
  tag: "DEBUG",
  score: 0,
  note: "None",
  optionurl: "" // Fixed lowercase 'u' structural casing conflict to perfectly match the InputOption schema definition contract
};