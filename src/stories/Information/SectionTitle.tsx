"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Column } from "../Layout/Column"; 
import { useGlobalUIContext } from "../Layout/GlobalUIContext";

export interface SectionTitleProps {
  /** The core title text rendered as an accessible heading. */
  title: string;
  /** The architectural design system variation. @default 'outline' */
  design?: 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';
  /** If true, merges component DOM into the immediate child via Radix Slot. @default false */
  asChild?: boolean;
  /** The required viewport column width. @default 12 */
  width?: number;
  /** Option to force the component onto a new grid row. @default true */
  newRow?: boolean; 
  /** Typography scale for the primary title. @default "5" */
  size?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  /** Optional secondary descriptive text rendered below the primary title. */
  subTitle?: string;
  /** Typography scale for the subtitle. @default "2" */
  subsize?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  /** Horizontal alignment of the text and icon content. @default "left" */
  align?: "left" | "center" | "right";
  /** Renders a visual geometric separator line beneath the title block. @default true */
  withSeparator?: boolean;
  /** Custom CSS class name for specific overrides. */
  className?: string;
  /** Custom CSS properties. */
  style?: React.CSSProperties;
  /** Explicit background color override. If omitted, Neumorphic designs calculate the parent background natively. */
  backgroundColor?: string;
  /** ReactNode representing an icon rendered adjacently to the title text. */
  icon?: React.ReactNode;
  /** Explicit title text color override. */
  titleColor?: string;
  /** Explicit subtitle text color override. */
  subtitleColor?: string;
  /** Controls the structural border color for Outline (left stroke) and Material (bottom stroke) variants. Defaults to black (#000000). */
  strokeColor?: string;
  /** Typographic letter spacing (tracking) in `em` units. @default "0.05em" */
  letterSpacing?: string;
  /** Neumorphic 3D extrusion distance in pixels. @default 4 */
  elevation?: number;
  /** Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. @default 1 */
  neuIntensity?: number;
  /** Global lighting angle that dictates the X and Y shadow trajectories (Neumorphic only). @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Manual injection of dark mode variables to bypass context. */
  darkModeColors?: { light: string; dark: string };
  /** Explicit override for the container border radius (e.g. '8px', '12px', or numeric 8). */
  borderRadius?: string | number;
}

// Helper to convert Radix-style 1-9 sizes to standard rem sizes to maintain visual parity
const sizeToRem = (s: string) => {
  const map: Record<string, string> = { "1": "0.75rem", "2": "0.875rem", "3": "1rem", "4": "1.125rem", "5": "1.25rem", "6": "1.5rem", "7": "1.75rem", "8": "2rem", "9": "2.5rem" };
  return map[s] || "1.25rem";
};

/**
 * @component SectionTitle
 * @description Accessible header block supporting Outline, Material, Skeuomorphic, and tactile Neumorphic design languages.
 */
export const SectionTitle = React.forwardRef<HTMLDivElement, SectionTitleProps>(({
  title,
  design = 'outline',
  asChild = false,
  width = 12, 
  newRow = true, 
  size = "5",
  subsize = "2",
  subTitle,
  align = "left",
  letterSpacing = "0.05em",
  withSeparator = true,
  className = "",
  style,
  backgroundColor,
  icon,
  titleColor,
  subtitleColor,
  strokeColor,
  elevation = 4,
  neuIntensity = 1,
  lightSource = 'top-left',
  darkModeColors,
  borderRadius,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  const globalContext = useGlobalUIContext();
  
  // Base default is now #000000 (black) instead of the UI theme blue
  const resolvedBrandColor = strokeColor || darkModeColors?.light || globalContext.themeColors?.light || '#000000';
  const isDark = !!darkModeColors;

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement) || (isDark ? '#1f2937' : '#ffffff');
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -20 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 20 * neuIntensity);

      setNeuVars({
        '--neu-bg': parentBg,
        '--neu-shadow-dark': shadowDark,
        '--neu-shadow-light': shadowLight,
        '--neu-x': `${x}px`,
        '--neu-y': `${y}px`,
        '--neu-blur': `${blur}px`,
        '--ui-brand-color': resolvedBrandColor,
      } as React.CSSProperties);
    } else {
      setNeuVars({ '--ui-brand-color': resolvedBrandColor } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, resolvedBrandColor, backgroundColor, isDark]);

  const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
  const alignTextMap = { left: 'left', center: 'center', right: 'right' } as const;
  const Comp = asChild ? Slot : "div";
  
  const resolvedRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  return (
    <Column span={width} newLine={newRow} style={{ marginBottom: '24px', marginTop: '24px' }}>
      <Comp 
        ref={(node: HTMLDivElement | null) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={`mito-section-title mito-title-${design} ${isDark ? 'mito-title-dark' : ''} ${className}`}
        style={{ 
          ...neuVars, 
          ...style,
          ...(resolvedRadius ? { '--mito-title-radius': resolvedRadius } : {})
        }}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .mito-section-title { width: 100%; box-sizing: border-box; transition: all 0.3s ease; }
          
          /* --- OUTLINE --- */
          .mito-title-outline {
            padding: ${backgroundColor ? '12px 16px' : '0'};
            background-color: ${backgroundColor || 'transparent'};
            border-radius: var(--mito-title-radius, ${backgroundColor ? '6px' : '0'});
            border-left: ${backgroundColor ? 'none' : '4px solid var(--ui-brand-color)'};
            padding-left: ${backgroundColor ? '16px' : '16px'};
          }

          /* --- MATERIAL --- */
          .mito-title-material {
            padding: 12px 16px;
            background-color: ${backgroundColor || '#ffffff'};
            border-radius: var(--mito-title-radius, 6px);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            border-bottom: 3px solid var(--ui-brand-color);
          }
          .mito-title-dark.mito-title-material { background-color: ${backgroundColor || '#1f2937'}; }

          /* --- NEUMORPHIC --- */
          .mito-title-neumorphic {
            padding: 16px; 
            background-color: var(--neu-bg); 
            border-radius: var(--mito-title-radius, 16px);
            box-shadow: var(--neu-x) var(--neu-y) var(--neu-blur) var(--neu-shadow-dark), 
                        calc(var(--neu-x) * -1) calc(var(--neu-y) * -1) var(--neu-blur) var(--neu-shadow-light);
          }
          .mito-title-neumorphic .mito-title-separator {
            opacity: 0.5; box-shadow: inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light);
            border: none !important; height: 2px !important;
          }

          /* --- SKEUOMORPHIC --- */
          .mito-title-skeuomorphic {
            padding: 16px;
            background-color: var(--neu-bg);
            background-image: linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.04) 100%);
            border-radius: var(--mito-title-radius, 8px);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.5), 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.15);
          }
          .mito-title-dark.mito-title-skeuomorphic {
            background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 100%);
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.1);
          }
          .mito-title-skeuomorphic .mito-title-separator {
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.6);
            border: none !important; height: 2px !important;
          }
          .mito-title-dark.mito-title-skeuomorphic .mito-title-separator {
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
          }
        `}} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: justifyMap[align], width: '100%' }}>
            {icon && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: titleColor || 'var(--ui-brand-color)', marginRight: '12px' }} aria-hidden="true">
                {icon}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: alignTextMap[align] }}>
              <h2 style={{ 
                fontSize: sizeToRem(size), 
                fontWeight: 'bold', 
                color: titleColor || (isDark ? '#f9fafb' : '#111827'), 
                lineHeight: '1.2', 
                letterSpacing: letterSpacing,
                margin: 0,
                padding: 0
              }}>
                {title}
              </h2>
              
              {subTitle && (
                <p style={{ 
                  fontSize: sizeToRem(subsize), 
                  color: subtitleColor || (isDark ? '#9ca3af' : '#4b5563'), 
                  marginTop: '4px',
                  marginBottom: 0,
                  padding: 0,
                  letterSpacing: letterSpacing 
                }}>
                  {subTitle}
                </p>
              )}
            </div>
          </div>

          {withSeparator && (
            <hr className="mito-title-separator" style={{ 
              width: '100%', 
              margin: '8px 0 0 0', 
              border: 'none',
              borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, 
              transition: 'all 0.3s' 
            }} />
          )}
        </div>
      </Comp>
    </Column>
  );
});

SectionTitle.displayName = 'SectionTitle';