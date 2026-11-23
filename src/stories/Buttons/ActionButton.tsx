"use client";

import React, { useRef, useState, useEffect, type JSX, type ReactNode } from "react";
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { type DesignVariant } from "../Layout/GlobalUIContext";

/**
 * @interface ActionButtonProps
 * @description Strongly-typed attributes for a compact, reusable action button. 
 * Designed specifically for CRUD operations in DataTables, cards, or tight layout spaces.
 */
export interface ActionButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onMouseEnter' | 'onMouseLeave'> {
  /** The icon or text node to render centrally inside the button. */
  icon: ReactNode;
  
  // --- AESTHETIC & DESIGN CONTROLS ---
  /** The architectural design system variation dictating the visual styling. @default 'outline' */
  design?: DesignVariant | 'neumorphic' | 'skeuomorphic';
  /** Toggles an enterprise-grade realistic translucent glassmorphism aesthetic. @default false */
  trueGlass?: boolean;
  /** Enables a tactile physical hover effect with kinetic drop-shadow and translation transitions. @default false */
  tactile?: boolean;
  /** Dictates the severity/intensity of the tactile hover effect. @default 'medium' */
  hoverEffect?: 'subtle' | 'medium' | 'pronounced';
  /** Explicit background color override for light mode contexts. */
  backgroundColor?: string;
  /** Explicit background color override specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Explicit border color override for specific variants (like outline). */
  borderColor?: string;
  /** Explicit text/icon color override for light mode contexts (e.g., '#ef4444' for delete actions). */
  textColor?: string;
  /** Explicit text/icon color override specifically for dark mode contexts. */
  darkTextColor?: string;
  /** Hover state text/icon color override. */
  hoverTextColor?: string;
  /** Hover state background color override. */
  hoverBackgroundColor?: string;
  /** Uniform width and height dimension. @default '32px' */
  size?: string | number;
  /** Force dark mode rendering independent of the global context. @default false */
  darkMode?: boolean;
  /** Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. @default 1 */
  neuIntensity?: number;
  /** Neumorphic 3D extrusion distance in pixels. @default 3 */
  elevation?: number;
  /** Global lighting angle that dictates the X and Y shadow trajectories. @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  // --- INTERACTION HANDLERS ---
  /** Standard click event handler. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Fired when the button is held down continuously for a specified duration. */
  onLongClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Duration in milliseconds required to trigger the onLongClick event. @default 500 */
  longClickDuration?: number;
  /** Callback fired whenever the hover state enters or leaves. */
  onHover?: (isHovered: boolean) => void;
}

/**
 * @component ActionButton
 * @description Compact, highly interactive button component optimized for CRUD tables and toolbars. 
 * Supports long-press actions, dynamic hover injections, and ambient-aware 3D rendering.
 */
export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(({
  icon,
  design = 'outline',
  trueGlass = false,
  tactile = false,
  hoverEffect = 'medium',
  backgroundColor,
  darkBackgroundColor,
  borderColor,
  textColor,
  darkTextColor,
  hoverTextColor,
  hoverBackgroundColor,
  size = '32px',
  darkMode = false,
  neuIntensity = 1,
  elevation = 3,
  lightSource = 'top-left',
  onClick,
  onLongClick,
  longClickDuration = 500,
  onHover,
  className = "",
  style,
  disabled,
  ...props
}, ref): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  // FIX: Using ReturnType<typeof setTimeout> is strictly safe across Browser and SSR Node environments
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  // FIX: Rely exclusively on the pure prop to avoid undefined context property errors
  const themeDarkMode = darkMode;

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && buttonRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(buttonRef.current.parentElement) || (themeDarkMode ? '#1f2937' : '#f8fafc');
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -15 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 15 * neuIntensity);

      setNeuVars({
        '--mito-ab-env-bg': parentBg,
        '--mito-ab-shadow-dark': shadowDark,
        '--mito-ab-shadow-light': shadowLight,
        '--mito-ab-x': `${x}px`,
        '--mito-ab-y': `${y}px`,
        '--mito-ab-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor, themeDarkMode]);

  // Handle Long Click Logic
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (onLongClick) {
      timerRef.current = setTimeout(() => {
        onLongClick(e);
        timerRef.current = null;
      }, longClickDuration);
    }
  };

  const handleMouseUpOrLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    // If a timer exists, it means mouseup happened before longClickDuration, so it's a standard click
    if (timerRef.current !== null || !onLongClick) {
      if (onClick) onClick(e);
    }
    handleMouseUpOrLeave();
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    if (onHover) onHover(true);
  };

  const handleMouseLeave = () => {
    handleMouseUpOrLeave();
    if (disabled) return;
    if (onHover) onHover(false);
  };

  const resolvedSize = typeof size === 'number' ? `${size}px` : size;

  const cssVariables = {
    '--mito-ab-size': resolvedSize,
    '--mito-ab-bg': backgroundColor || 'transparent',
    '--mito-ab-bg-dark': darkBackgroundColor || backgroundColor || 'transparent',
    '--mito-ab-border': borderColor || (themeDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
    '--mito-ab-text': textColor || (themeDarkMode ? '#d1d5db' : '#4b5563'),
    '--mito-ab-text-dark': darkTextColor || textColor || '#d1d5db',
    '--mito-ab-hover-bg': hoverBackgroundColor || (themeDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
    '--mito-ab-hover-text': hoverTextColor || (themeDarkMode ? '#ffffff' : '#111827'),
    ...neuVars,
  } as React.CSSProperties;

  const themeClass = themeDarkMode ? 'mito-ab-dark' : '';
  const glassClass = trueGlass ? 'mito-ab-glass' : '';
  const tactileClass = tactile ? `mito-ab-tactile mito-ab-tactile-${hoverEffect}` : '';

  return (
    <button
      ref={(node) => {
        buttonRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      type="button"
      className={`mito-action-btn mito-ab-${design} ${themeClass} ${glassClass} ${tactileClass} ${className}`}
      style={{ ...cssVariables, ...style }}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUpOrLeave}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--mito-ab-size);
          height: var(--mito-ab-size);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
          color: var(--mito-ab-text);
          padding: 0;
          box-sizing: border-box;
          flex-shrink: 0;
          --mito-ab-t-shadow: 0 0 0 transparent;
        }
        .mito-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .mito-action-btn:focus-visible {
          outline: 2px solid var(--ui-brand-color, #2563eb);
          outline-offset: 2px;
        }
        .mito-action-btn:hover:not(:disabled) {
          color: var(--mito-ab-hover-text);
        }
        .mito-action-btn:active:not(:disabled) {
          transform: scale(0.92);
        }
        
        .mito-ab-dark.mito-action-btn {
          color: var(--mito-ab-text-dark);
        }

        /* ------------------------- */
        /* TACTILE HOVER EFFECTS     */
        /* ------------------------- */
        
        .mito-ab-tactile {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, color 0.2s ease;
        }

        .mito-ab-tactile-subtle:hover:not(:disabled) { 
          transform: translateY(-1px); 
          --mito-ab-t-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); 
        }
        .mito-ab-tactile-medium:hover:not(:disabled) { 
          transform: translateY(-2px); 
          --mito-ab-t-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); 
        }
        .mito-ab-tactile-pronounced:hover:not(:disabled) { 
          transform: translateY(-4px); 
          --mito-ab-t-shadow: 0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04); 
        }

        .mito-ab-dark.mito-ab-tactile-subtle:hover:not(:disabled) { --mito-ab-t-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }
        .mito-ab-dark.mito-ab-tactile-medium:hover:not(:disabled) { --mito-ab-t-shadow: 0 10px 15px -3px rgba(0,0,0,0.4); }
        .mito-ab-dark.mito-ab-tactile-pronounced:hover:not(:disabled) { --mito-ab-t-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        
        /* Outline */
        .mito-ab-outline {
          background-color: var(--mito-ab-bg);
          border: 1px solid var(--mito-ab-border);
        }
        .mito-ab-dark.mito-ab-outline {
          background-color: var(--mito-ab-bg-dark);
        }
        .mito-ab-outline:hover:not(:disabled) {
          background-color: var(--mito-ab-hover-bg);
          box-shadow: var(--mito-ab-t-shadow);
        }

        /* Material */
        .mito-ab-material {
          background-color: var(--mito-ab-bg);
          border: 1px solid transparent;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .mito-ab-dark.mito-ab-material {
          background-color: var(--mito-ab-bg-dark);
          box-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }
        .mito-ab-material:hover:not(:disabled) {
          background-color: var(--mito-ab-hover-bg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.15), var(--mito-ab-t-shadow);
        }

        /* Neumorphic */
        .mito-ab-neumorphic {
          background-color: var(--mito-ab-env-bg);
          border: 1px solid transparent;
          box-shadow: var(--mito-ab-x) var(--mito-ab-y) var(--mito-ab-blur) var(--mito-ab-shadow-dark), 
                      calc(var(--mito-ab-x) * -1) calc(var(--mito-ab-y) * -1) var(--mito-ab-blur) var(--mito-ab-shadow-light);
        }
        .mito-ab-neumorphic:hover:not(:disabled) {
          box-shadow: inset 1px 1px 2px var(--mito-ab-shadow-dark), 
                      inset -1px -1px 2px var(--mito-ab-shadow-light),
                      var(--mito-ab-t-shadow);
        }

        /* Skeuomorphic */
        .mito-ab-skeuomorphic {
          background-color: var(--mito-ab-env-bg);
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.05) 100%);
          border: 1px solid rgba(0,0,0,0.2);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.2);
        }
        .mito-ab-dark.mito-ab-skeuomorphic {
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.5);
        }
        .mito-ab-skeuomorphic:hover:not(:disabled) {
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.2), var(--mito-ab-t-shadow);
        }
        .mito-ab-dark.mito-ab-skeuomorphic:hover:not(:disabled) {
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.5), var(--mito-ab-t-shadow);
        }
        .mito-ab-skeuomorphic:active:not(:disabled) {
          background-image: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }

        /* ------------------------- */
        /* TRUEGLASS AESTHETIC       */
        /* ------------------------- */
        
        .mito-ab-glass {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        /* Outline & Material Glass */
        .mito-ab-outline.mito-ab-glass, .mito-ab-material.mito-ab-glass {
          background-color: rgba(255, 255, 255, 0.15);
          border: 1px solid var(--mito-ab-border);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.4);
        }
        .mito-ab-dark.mito-ab-outline.mito-ab-glass, .mito-ab-dark.mito-ab-material.mito-ab-glass {
          background-color: rgba(0, 0, 0, 0.2);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
        }
        .mito-ab-outline.mito-ab-glass:hover:not(:disabled), .mito-ab-material.mito-ab-glass:hover:not(:disabled) {
          background-color: var(--mito-ab-hover-bg);
        }

        /* Neumorphic Glass */
        .mito-ab-neumorphic.mito-ab-glass {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.4), 
                      2px 2px 4px var(--mito-ab-shadow-dark);
        }
        .mito-ab-dark.mito-ab-neumorphic.mito-ab-glass {
          background-color: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 
                      2px 2px 4px var(--mito-ab-shadow-dark);
        }
        .mito-ab-neumorphic.mito-ab-glass:hover:not(:disabled) {
           box-shadow: inset 0 1px 1px rgba(255,255,255,0.4), inset 1px 1px 2px var(--mito-ab-shadow-dark), inset -1px -1px 2px var(--mito-ab-shadow-light), var(--mito-ab-t-shadow);
        }
        .mito-ab-dark.mito-ab-neumorphic.mito-ab-glass:hover:not(:disabled) {
           box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), inset 1px 1px 2px var(--mito-ab-shadow-dark), inset -1px -1px 2px var(--mito-ab-shadow-light), var(--mito-ab-t-shadow);
        }

        /* Skeuomorphic Glass */
        .mito-ab-skeuomorphic.mito-ab-glass {
          background-color: rgba(255, 255, 255, 0.1);
          background-image: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.1);
        }
        .mito-ab-dark.mito-ab-skeuomorphic.mito-ab-glass {
          background-color: rgba(0, 0, 0, 0.2);
          background-image: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.4);
        }
      `}} />
      {icon}
    </button>
  );
});

ActionButton.displayName = "ActionButton";