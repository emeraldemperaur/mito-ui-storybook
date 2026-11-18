"use client";

import React, { useRef, useState, useEffect, type JSX, createContext, useContext, useMemo } from "react";
import { Slot } from '@radix-ui/react-slot';
import { FormikContext, getIn, type FormikContextType } from 'formik';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";

export type FABPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

/**
 * @interface FloatingOptionsButtonRootProps
 * @description Strongly-typed attributes for the master state-managing wrapper of the rotating options cluster.
 * Optimized for MCP context-injection: Agents must adhere to these strict types to prevent UI thread blocking and style pollution.
 * 
 * DESIGN REQUIREMENT: This component relies on CSS Grid (1fr 1fr). For optimal circular symmetry, you must provide exactly 4 `<FloatingOptionsButton.Item>` children.
 */
export interface FloatingOptionsButtonRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'onChange'> {
  /**
   * Unique identifier for the cluster container. Essential for deterministic end-to-end testing and ARIA linking.
   */
  id?: string;

  /**
   * The core architectural design variant propagating to all quadrant items.
   * - `material`: Solid background with elevated z-index shadow. Standard for FABs.
   * - `outline`: Crisp bordered aesthetic with a truly transparent core.
   * - `neumorphic`: Soft, extruded physical surface adapting to parent background. Features a quadrant-specific radiating ripple on click.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical button.
   * @default 'material'
   */
  design?: DesignVariant | 'skeuomorphic';

  /**
   * @description Activates the continuous linear rotation animation of the entire cluster.
   * Animation automatically pauses when a user hovers over the cluster to allow precise item selection.
   * @default false
   */
  rotate?: boolean;
  
  /** Screen corner placement for the cluster. @default 'bottom-right' */
  position?: FABPosition;
  
  /** Distance from the designated screen edges in pixels. @default 32 */
  offset?: number;
  
  /** Overall width of the circular cluster. @default 120 */
  width?: number | string;

  /** Overall height of the circular cluster. @default 120 */
  height?: number | string;

  /** Forces the component into dark mode, overriding system contexts. */
  darkMode?: boolean;

  /* --- Formik Integration --- */
  
  /** The unique identifier and state key for the Formik field. */
  alias?: string;
  
  /** Standard controlled value (Ignored if Formik is active). */
  value?: any;
  
  /** Standard change handler (Ignored if Formik is active). */
  onChange?: (val: any) => void;
  
  /** Enables selection of multiple quadrants concurrently. @default false */
  multiselect?: boolean;

  /**
   * Explicit Formik context bypass. Useful for isolating the component from duplicate context 
   * providers or manually wiring it to a specific form state.
   */
  formikContext?: FormikContextType<any>;

  /* --- Dynamic Style Overrides --- */

  /**
   * @description Dynamic base background color for light mode. 
   * Injected as a local CSS variable (`--fob-bg`) to ensure strict style isolation and prevent global DOM pollution.
   */
  backgroundColor?: string;

  /**
   * @description Dynamic base background color specifically for dark mode contexts (`--fob-bg-dark`). 
   * Automatically overrides light mode defaults when the component or application shifts to dark mode.
   */
  darkBackgroundColor?: string;

  /**
   * @description Dynamic text and icon color for light mode. 
   * Injected locally as `--fob-text`.
   */
  textColor?: string;

  /**
   * @description Dynamic text and icon color specifically for dark mode contexts (`--fob-text-dark`).
   */
  darkTextColor?: string;

  /**
   * @description Optional hover background color (primarily affects Material and Outline variants). 
   * Injected as `--fob-hover-bg`. Falls back to the base background color if omitted.
   */
  hoverColor?: string;

  /**
   * @description Optional hover background color for dark mode contexts (`--fob-hover-bg-dark`).
   */
  darkHoverColor?: string;

  /**
   * @description Optional hover text and icon color (primarily affects Material and Outline variants). 
   * Injected as `--fob-hover-text`.
   */
  hoverTextColor?: string;

  /**
   * @description Optional hover text and icon color for dark mode contexts (`--fob-hover-text-dark`).
   */
  darkHoverTextColor?: string;

  /**
   * @description Typographic scale or icon size injection (e.g., '24px', '1.5rem'). 
   * Handled natively via the `--fob-size` CSS variable to dictate internal SVG bounds and font scales.
   */
  textSize?: string | number;

  /**
   * @description Font family override to match specific UI brand primitives. 
   * Injected as `--fob-font`.
   */
  fontFamily?: string;

  /* --- Neumorphic & Skeuomorphic Tuning --- */

  /**
   * @description Controls the perceived physical distance of the component from its background plane on the Z-axis.
   * Higher values automatically calculate larger coordinate spreads and blurs for the underlying box-shadows, creating a deeper extruded or elevated effect.
   * @default 5
   */
  elevation?: number;

  /**
   * @description A mathematical multiplier applied to the opacity of both the light highlight and dark shadow channels. 
   * Use this to tune WCAG contrast ratios when the component is dynamically placed on extremely light or extremely dark parent backgrounds.
   * @default 1
   */
  neuIntensity?: number;

  /**
   * @description Dictates the simulated directional angle of the global environment light source.
   * Physically alters the X and Y coordinates of the highlights and shadows to maintain 3D lighting consistency across the UI.
   * @default 'top-left'
   */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** 
   * React children, strictly expected to be exactly four `FloatingOptionsButton.Item` components to complete the radial grid. 
   */
  children: React.ReactNode;
}

/**
 * @interface FloatingOptionsButtonItemProps
 * @description Strongly-typed attributes extending native HTML button behaviors for individual radial quadrants.
 */
export interface FloatingOptionsButtonItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The specific value this quadrant represents in the form state. */
  value: string | number;

  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;
  
  /** 
   * Primary action trigger. 
   * NOTE: For the 'neumorphic' variant, this automatically triggers a shape-conforming ripple animation. 
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /** Triggered when the user hovers over this specific quadrant. Maps to onMouseEnter. */
  onHover?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Triggered when the user presses and holds this specific quadrant for 500ms. */
  onLongClick?: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
}

interface FOBContextValue {
  design: DesignVariant | 'skeuomorphic';
  isReadOnly: boolean;
  multiselect: boolean;
  selectedValues: (string | number)[];
  onItemSelect: (value: string | number) => void;
}

const FloatingOptionsButtonContext = createContext<FOBContextValue | null>(null);

/**
 * @component FloatingOptionsButton.Root
 * @description Master state-managing wrapper for the rotating quadrant layout. Evaluates contextual lighting, enforces the grid, and processes dynamic CSS variables.
 */
const FloatingOptionsButtonRoot = React.forwardRef<HTMLDivElement, FloatingOptionsButtonRootProps>(({
  id,
  alias,
  value,
  onChange,
  multiselect = false,
  formikContext,
  design = 'material',
  rotate = false,
  position = 'bottom-right',
  offset = 32,
  width = 120,
  height = 120,
  darkMode = false,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  hoverColor,
  darkHoverColor,
  hoverTextColor,
  darkHoverTextColor,
  textSize,
  fontFamily,
  elevation = 5,
  neuIntensity = 1,
  lightSource = 'top-left',
  className = "",
  style,
  children,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  const [internalValue, setInternalValue] = useState<any>(value);
  
  const globalContext = useGlobalUIContext();
  const themeClass = darkMode ? 'v-fob-dark' : '';
  
  const fallbackContext = useContext(FormikContext) as FormikContextType<any> | undefined;
  const activeContext = formikContext || fallbackContext || globalContext.formikContext;
    
  // Hybrid State Engine: Use Formik if available, else fallback to standard controlled props
  const isFormik = activeContext !== undefined && typeof activeContext.setFieldValue === 'function';
  const isReadOnly = Boolean(activeContext?.isSubmitting);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const fieldValue = isFormik && alias ? getIn(activeContext!.values, alias) : internalValue;

  const selectedValues: (string | number)[] = useMemo(() => {
    if (fieldValue === undefined || fieldValue === null) return [];
    if (Array.isArray(fieldValue)) return fieldValue;
    return [fieldValue];
  }, [fieldValue]);

  const handleSelect = (itemValue: string | number) => {
    if (isReadOnly) return;
    let newValues: (string | number)[];
    
    if (multiselect) {
      newValues = selectedValues.some(v => String(v) === String(itemValue))
        ? selectedValues.filter(v => String(v) !== String(itemValue))
        : [...selectedValues, itemValue];
    } else {
      newValues = [itemValue];
    }

    const payload = multiselect ? newValues : newValues[0];
    
    if (!isFormik) {
      setInternalValue(payload); 
    }
    
    if (isFormik && alias) {
      activeContext!.setFieldValue(alias, payload);
      setTimeout(() => activeContext!.setFieldTouched(alias, true, false), 0);
    }
    if (onChange) onChange(payload);
  };

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic')) {
      const environmentBg = backgroundColor || (typeof document !== 'undefined' ? getNearestParentBackground(document.body) : '#e0e5ec');
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(environmentBg, -25 * neuIntensity);
      const shadowLight = adjustColor(environmentBg, 25 * neuIntensity);

      setNeuVars({
        '--fob-bg-env': environmentBg,
        '--fob-shadow-dark': shadowDark,
        '--fob-shadow-light': shadowLight,
        '--fob-x': `${x}px`,
        '--fob-y': `${y}px`,
        '--fob-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor]);

  const safeChildren = useMemo(() => {
    const arr = React.Children.toArray(children);
    if (arr.length > 4) {
      console.warn(`[Mito UI] FloatingOptionsButton ${id ? `('${id}')` : ''} strictly requires exactly 4 items for radial grid symmetry. Additional items have been truncated.`);
      return arr.slice(0, 4);
    }
    return arr;
  }, [children, id]);

  const customStyles = {
    ...style,
    ...neuVars,
    top: position.includes('top') ? `${offset}px` : 'auto',
    bottom: position.includes('bottom') ? `${offset}px` : 'auto',
    left: position.includes('left') ? `${offset}px` : 'auto',
    right: position.includes('right') ? `${offset}px` : 'auto',
    '--fob-width': typeof width === 'number' ? `${width}px` : width,
    '--fob-height': typeof height === 'number' ? `${height}px` : height,
    '--fob-bg': backgroundColor,
    '--fob-bg-dark': darkBackgroundColor || backgroundColor,
    '--fob-text': textColor,
    '--fob-text-dark': darkTextColor || textColor,
    '--fob-hover-bg': hoverColor,
    '--fob-hover-bg-dark': darkHoverColor || hoverColor,
    '--fob-hover-text': hoverTextColor,
    '--fob-hover-text-dark': darkHoverTextColor || hoverTextColor,
    '--fob-size': typeof textSize === 'number' ? `${textSize}px` : textSize,
    '--fob-font': fontFamily,
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  const rotationClass = rotate ? 'v-fob-rotating' : '';

  return (
    <FloatingOptionsButtonContext.Provider value={{ 
      design, 
      isReadOnly, 
      multiselect, 
      selectedValues, 
      onItemSelect: handleSelect 
    }}>
      <>
        <style dangerouslySetInnerHTML={{ __html: `
          .v-fob-root { 
            --scoped-bg: var(--fob-bg, #000000);
            --scoped-text: var(--fob-text, #ffffff);
            --scoped-hover-bg: var(--fob-hover-bg, var(--scoped-bg));
            --scoped-hover-text: var(--fob-hover-text, var(--scoped-text));
            --scoped-font: var(--fob-font, "Mozilla Headline", "Montserrat", sans-serif);
            
            position: fixed; 
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 4px;
            width: var(--fob-width, 120px);
            height: var(--fob-height, 120px);
            border-radius: 50%;
            z-index: 9999;
            font-family: var(--scoped-font);
            font-size: var(--fob-size, 16px);
          }
          
          .v-fob-root.v-fob-dark {
            --scoped-bg: var(--fob-bg-dark, #ffffff);
            --scoped-text: var(--fob-text-dark, #000000);
            --scoped-hover-bg: var(--fob-hover-bg-dark, var(--scoped-bg));
            --scoped-hover-text: var(--fob-hover-text-dark, var(--scoped-text));
          }

          /* Rotation Engine */
          .v-fob-rotating { animation: mito-fob-spin 12s linear infinite; }
          .v-fob-rotating:hover { animation-play-state: paused; }
          @keyframes mito-fob-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

          /* Generic Item Architecture */
          .v-fob-item {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background-color: var(--scoped-bg);
            color: var(--scoped-text);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            outline: none;
            border: none;
            box-sizing: border-box;
          }
          .v-fob-item:disabled { opacity: 0.6; cursor: not-allowed; transform: scale(1) !important; z-index: 1; }
          .v-fob-item svg, .v-fob-item i { width: 45%; height: 45%; transition: transform 0.3s ease; z-index: 2; }
          
          /* Strict Quadrant Radii Mapping */
          .v-fob-item:nth-child(1) { border-radius: 100% 0 0 0; }
          .v-fob-item:nth-child(2) { border-radius: 0 100% 0 0; }
          .v-fob-item:nth-child(3) { border-radius: 0 0 0 100%; }
          .v-fob-item:nth-child(4) { border-radius: 0 0 100% 0; }

          /* 
             MINIMAL FIX: Force override the quadrant radii on hover to create the overlapping rounded square tile.
             Scales up the SVG icon simultaneously to emphasize the selection.
          */
          .v-fob-item:hover:not(:disabled),
          .v-fob-item[data-state="on"] {
            border-radius: 12px !important;
            z-index: 10;
          }
          .v-fob-item:hover:not(:disabled) svg,
          .v-fob-item[data-state="on"] svg {
            transform: scale(1.3);
          }

          /* --- MATERIAL --- */
          .v-fob-root-material .v-fob-item { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
          .v-fob-root-material.v-fob-dark .v-fob-item { box-shadow: 0 4px 8px rgba(0,0,0,0.4); }
          
          .v-fob-root-material .v-fob-item:hover:not(:disabled) { 
            transform: scale(1.15); 
            box-shadow: 0 0 35px 10px rgba(0,0,0,0.4); 
            background-color: var(--scoped-hover-bg); 
            color: var(--scoped-hover-text); 
          }
          .v-fob-root-material .v-fob-item[data-state="on"] {
            transform: scale(1.05); 
            background-color: var(--scoped-hover-bg);
            color: var(--scoped-hover-text);
            box-shadow: 0 8px 16px rgba(0,0,0,0.25);
            z-index: 5;
          }
          .v-fob-root-material .v-fob-item:active:not(:disabled) { transform: scale(0.95); }

          /* --- OUTLINE --- */
          .v-fob-root-outline .v-fob-item { background-color: transparent; border: 2px solid var(--scoped-bg); color: var(--scoped-bg); }
          .v-fob-root-outline .v-fob-item:hover:not(:disabled) { transform: scale(1.15); background-color: var(--scoped-hover-bg); border-color: var(--scoped-hover-bg); color: var(--scoped-hover-text); }
          .v-fob-root-outline .v-fob-item[data-state="on"] { transform: scale(1.05); background-color: var(--scoped-hover-bg); border-color: var(--scoped-hover-bg); color: var(--scoped-hover-text); z-index: 5; }
          .v-fob-root-outline .v-fob-item:active:not(:disabled) { transform: scale(0.95); }

          /* --- NEUMORPHIC --- */
          .v-fob-root-neumorphic .v-fob-item { background-color: var(--fob-bg-env); color: var(--scoped-text); box-shadow: var(--fob-x) var(--fob-y) var(--fob-blur) var(--fob-shadow-dark), calc(var(--fob-x) * -1) calc(var(--fob-y) * -1) var(--fob-blur) var(--fob-shadow-light); }
          .v-fob-root-neumorphic .v-fob-item:hover:not(:disabled) { transform: scale(1.15); box-shadow: calc(var(--fob-x)*1.5) calc(var(--fob-y)*1.5) calc(var(--fob-blur)*1.5) var(--fob-shadow-dark), calc(var(--fob-x)*-1.5) calc(var(--fob-y)*-1.5) calc(var(--fob-blur)*1.5) var(--fob-shadow-light); }
          .v-fob-root-neumorphic .v-fob-item:active:not(:disabled),
          .v-fob-root-neumorphic .v-fob-item[data-state="on"] { transform: scale(0.95); box-shadow: inset 2px 2px 6px var(--fob-shadow-dark), inset -2px -2px 6px var(--fob-shadow-light); z-index: 5; }
          
          .v-fob-wave { position: absolute; width: 100%; height: 100%; border-radius: inherit; filter: blur(1px); z-index: -1; pointer-events: none; box-shadow: var(--fob-x) var(--fob-y) var(--fob-blur) var(--fob-shadow-dark), calc(var(--fob-x) * -1) calc(var(--fob-y) * -1) var(--fob-blur) var(--fob-shadow-light); background: linear-gradient(to bottom right, var(--fob-bg-env) 0%, transparent 100%); animation: mito-fob-quad-wave 0.8s ease-out forwards; }
          .v-fob-wave-delayed { animation-delay: 0.15s; }
          @keyframes mito-fob-quad-wave { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }

          /* --- SKEUOMORPHIC --- */
          .v-fob-root-skeuomorphic .v-fob-item {
            background-color: var(--fob-bg-env);
            background-image: linear-gradient(to top, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.8) 100%);
            border: 1px solid rgba(0, 0, 0, 0.2);
            color: var(--scoped-text);
            text-shadow: 0 1px rgba(255,255,255,0.6);
            box-shadow: 0 4px 3px 1px rgba(255,255,255,0.8), 0 6px 8px rgba(0,0,0,0.15), 0 -4px 4px rgba(0,0,0,0.05), 0 -6px 4px rgba(255,255,255,0.9), inset 0 0 3px 0 rgba(0,0,0,0.15); 
          }
          .v-fob-root-skeuomorphic.v-fob-dark .v-fob-item {
            background-image: linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 100%);
            border-color: rgba(255, 255, 255, 0.1);
            text-shadow: 0 1px rgba(0,0,0,0.8);
            box-shadow: 0 4px 3px 1px rgba(255,255,255,0.05), 0 6px 8px rgba(0,0,0,0.5), 0 -4px 4px rgba(0,0,0,0.3), 0 -6px 4px rgba(255,255,255,0.05), inset 0 0 3px 0 rgba(0,0,0,0.5);
          }
          .v-fob-root-skeuomorphic .v-fob-item:hover:not(:disabled) { transform: scale(1.15); }
          .v-fob-root-skeuomorphic .v-fob-item:active:not(:disabled),
          .v-fob-root-skeuomorphic .v-fob-item[data-state="on"] {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.8) 100%);
            box-shadow: 0 2px 2px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.15), inset 0 0 5px 3px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.15);
            transform: scale(0.95);
            z-index: 5;
          }
          .v-fob-root-skeuomorphic.v-fob-dark .v-fob-item:active:not(:disabled),
          .v-fob-root-skeuomorphic.v-fob-dark .v-fob-item[data-state="on"] {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 100%);
            box-shadow: 0 2px 2px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.5), inset 0 0 5px 3px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.5);
          }
        `}} />
        
        <div 
          id={id}
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className={`v-fob-root v-fob-root-${design} ${themeClass} ${rotationClass} ${className}`}
          style={customStyles}
          {...props}
        >
          {safeChildren}
        </div>
      </>
    </FloatingOptionsButtonContext.Provider>
  );
});
FloatingOptionsButtonRoot.displayName = "FloatingOptionsButton.Root";

/**
 * @component FloatingOptionsButton.Item
 * @description Individual segmented quadrant button for the options cluster. Consumes layout architecture from Root.
 */
const FloatingOptionsButtonItem = React.forwardRef<HTMLButtonElement, FloatingOptionsButtonItemProps>(({
  value,
  asChild = false,
  className = "",
  disabled,
  onHover,
  onLongClick,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onMouseEnter,
  children,
  ...props
}, ref): JSX.Element => {
  
  const context = useContext(FloatingOptionsButtonContext);
  if (!context) throw new Error("FloatingOptionsButton.Item must be used within a FloatingOptionsButton.Root");

  const { design, isReadOnly, selectedValues, onItemSelect, multiselect } = context;
  const isSelected = selectedValues.some(v => String(v) === String(value));
  const isDisabled = disabled || isReadOnly;
  
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isRippling, setIsRippling] = useState(false);

  const handlePressStart = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (onLongClick && !isDisabled) {
      longPressTimer.current = setTimeout(() => onLongClick(e), 500);
    }
    if (e.type === 'mousedown' && onMouseDown) onMouseDown(e as React.MouseEvent<HTMLButtonElement>);
    if (e.type === 'touchstart' && onTouchStart) onTouchStart(e as React.TouchEvent<HTMLButtonElement>);
  };

  const handlePressEnd = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (e.type === 'mouseup' && onMouseUp) onMouseUp(e as React.MouseEvent<HTMLButtonElement>);
    if (e.type === 'touchend' && onTouchEnd) onTouchEnd(e as React.TouchEvent<HTMLButtonElement>);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (onMouseLeave) onMouseLeave(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onHover && !isDisabled) onHover(e);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    
    // Sync to internal Formik state tracking
    onItemSelect(value);

    // Shape-conforming quadrant ripple
    if (design === 'neumorphic') {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 800); 
    }
    
    if (onClick) onClick(e);
  };

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type="button"
      role={multiselect ? "checkbox" : "radio"}
      aria-checked={isSelected}
      data-state={isSelected ? "on" : "off"}
      disabled={isDisabled}
      className={`v-fob-item ${className}`}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {children}
      {design === 'neumorphic' && isRippling && !isDisabled && (
        <>
          <span className="v-fob-wave" aria-hidden="true" />
          <span className="v-fob-wave v-fob-wave-delayed" aria-hidden="true" />
        </>
      )}
    </Comp>
  );
});
FloatingOptionsButtonItem.displayName = "FloatingOptionsButton.Item";

export const FloatingOptionsButton = {
  Root: FloatingOptionsButtonRoot,
  Item: FloatingOptionsButtonItem,
};