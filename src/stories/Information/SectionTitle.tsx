"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { Slot } from '@radix-ui/react-slot';
import { Heading, Separator, Flex, Text } from '@radix-ui/themes';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Column } from "../Layout/Column"; 
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";

export interface SectionTitleProps {
  /** The core title text rendered as an accessible heading. */
  title: string;
  /** The architectural design system variation. @default 'outline' */
  design?: DesignVariant;
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
}

/**
 * @component SectionTitle
 * @description Accessible header block supporting Outline, Material, and tactile Neumorphic design languages.
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
  elevation = 4,
  neuIntensity = 1,
  lightSource = 'top-left',
  darkModeColors,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)';

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement);
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
  }, [design, elevation, lightSource, neuIntensity, resolvedBrandColor, backgroundColor]);

  const justifyMap = { left: 'start', center: 'center', right: 'end' } as const;
  const Comp = asChild ? Slot : "div";

  return (
    <Column span={width} newLine={newRow} style={{ marginBottom: '24px', marginTop: '24px' }}>
      <Comp 
        ref={(node: HTMLDivElement | null) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={`v-section-title v-title-${design} ${className}`}
        style={{ ...neuVars, ...style }}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .v-section-title { width: 100%; box-sizing: border-box; transition: all 0.3s ease; }
          .v-title-outline {
            padding: ${backgroundColor ? 'var(--space-3) var(--space-4)' : '0'};
            background-color: ${backgroundColor || 'transparent'};
            border-radius: ${backgroundColor ? 'var(--radius-3)' : '0'};
            border-left: ${backgroundColor ? 'none' : '4px solid var(--ui-brand-color)'};
            padding-left: ${backgroundColor ? 'var(--space-4)' : '16px'};
          }
          .v-title-material {
            padding: var(--space-3) var(--space-4);
            background-color: ${backgroundColor || 'var(--color-surface, #ffffff)'};
            border-radius: var(--radius-3);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            border-bottom: 3px solid var(--ui-brand-color);
          }
          .v-title-neumorphic {
            padding: var(--space-4); background-color: var(--neu-bg); border-radius: 16px;
            box-shadow: var(--neu-x) var(--neu-y) var(--neu-blur) var(--neu-shadow-dark), 
                        calc(var(--neu-x) * -1) calc(var(--neu-y) * -1) var(--neu-blur) var(--neu-shadow-light);
          }
          .v-title-neumorphic .v-title-separator {
            opacity: 0.5; box-shadow: inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light);
            background-color: transparent !important; height: 2px !important;
          }
        `}} />
        
        <Flex direction="column" gap="2" style={{ textAlign: align }}>
          <Flex align="center" justify={justifyMap[align]} gap="3" style={{ width: '100%' }}>
            {icon && (
              <Flex align="center" justify="center" style={{ color: titleColor || 'var(--ui-brand-color)' }} aria-hidden="true">
                {icon}
              </Flex>
            )}
            <Heading size={size} weight="bold" style={{ color: titleColor || 'var(--gray-12)', lineHeight: '1.2', letterSpacing: letterSpacing }}>
              {title}
            </Heading>
          </Flex>
          
          {subTitle && (
            <Text size={subsize} style={{ color: subtitleColor || 'var(--gray-11)', maxWidth: '85%', margin: align === 'center' ? '0 auto' : undefined, letterSpacing: letterSpacing }}>
              {subTitle}
            </Text>
          )}

          {withSeparator && (
            <Separator size="4" className="v-title-separator" style={{ width: '100%', marginTop: '8px', backgroundColor: 'var(--gray-5)', transition: 'all 0.3s' }} />
          )}
        </Flex>
      </Comp>
    </Column>
  );
});

SectionTitle.displayName = 'SectionTitle';