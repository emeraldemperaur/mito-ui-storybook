"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";

/**
 * @interface TitleRibbonProps
 * @description Strongly-typed attributes configuring the TitleRibbon banner, including typography, layout, animation, and theming.
 */
export interface TitleRibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @description The primary text content to be displayed within the ribbon. Rendered semantically as an `<h1>` for screen readers.
   * @example title="System Dashboard"
   */
  title: string;

  /**
   * @description The architectural design system variation dictating the visual styling.
   * @default 'outline'
   */
  design?: DesignVariant;

  /**
   * @description Delegates rendering to the immediate child element via Radix Slot, allowing semantic HTML substitution without breaking layout.
   * @default false
   */
  asChild?: boolean;

  /**
   * @description Controls the horizontal alignment of the title text inside the bounding container.
   * @default 'left'
   */
  textAlignment?: 'left' | 'center' | 'right';

  /**
   * @description Toggles a simulated typewriter animation effect on mount. Handles SSR hydration safely.
   * @default false
   */
  typewriterFX?: boolean;

  /**
   * @description Custom CSS font-family string applied to the ribbon text.
   * @default '"Bodoni Moda Variable", serif'
   */
  fontFamily?: string;

  /**
   * @description Custom CSS font-size string (supports rem, em, px) applied to the ribbon text.
   * @default '2.4rem'
   */
  textSize?: string;

  /**
   * @description Explicit background color override. If omitted, falls back to transparency (Outline), surface color (Material), or computed environment background (Neumorphic).
   */
  backgroundColor?: string;

  /**
   * @description Explicit text color override.
   * @default 'var(--gray-12)'
   */
  textColor?: string;

  /**
   * @description Dynamic light/dark mode brand colors injected into the CSS variables to override global context.
   */
  darkModeColors?: { light: string; dark: string };

  /**
   * @description Neumorphic 3D extrusion distance in pixels. Controls shadow spread and offset.
   * @default 4
   */
  elevation?: number;

  /**
   * @description Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast on varying backgrounds.
   * @default 1
   */
  neuIntensity?: number;

  /**
   * @description Global lighting angle that dictates the X and Y shadow trajectories (Neumorphic only).
   * @default 'top-left'
   */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * @component TitleRibbon
 * @description A prominent structural layout banner used for page or section titles. Supports screen-reader optimized headings, localized typing animations, and multi-variant rendering algorithms.
 */
export const TitleRibbon = React.forwardRef<HTMLDivElement, TitleRibbonProps>(({
  title,
  design = 'outline',
  asChild = false,
  textAlignment = 'left',
  typewriterFX = false,
  fontFamily = '"Bodoni Moda Variable", serif',
  textSize = '2.4rem',
  backgroundColor,
  textColor,
  darkModeColors,
  elevation = 4,
  neuIntensity = 1,
  lightSource = 'top-left',
  className = "",
  style,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  const [isClient, setIsClient] = useState(false);
  const [displayedText, setDisplayedText] = useState(typewriterFX ? '' : title);
  const [isTyping, setIsTyping] = useState(typewriterFX);

  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)';

  useEffect(() => {
    setIsClient(true);
    if (!typewriterFX) {
      setDisplayedText(title);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < title.length) {
        setDisplayedText(title.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false); 
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [title, typewriterFX]);

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement);
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -20 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 20 * neuIntensity);

      setNeuVars({
        '--ribbon-bg': parentBg,
        '--ribbon-shadow-dark': shadowDark,
        '--ribbon-shadow-light': shadowLight,
        '--ribbon-x': `${x}px`,
        '--ribbon-y': `${y}px`,
        '--ribbon-blur': `${blur}px`,
        '--ui-brand-color': resolvedBrandColor,
      } as React.CSSProperties);
    } else {
      setNeuVars({ '--ui-brand-color': resolvedBrandColor } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, resolvedBrandColor, backgroundColor]);

  const Comp = asChild ? Slot : "div";

  return (
    <Comp 
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`v-title-ribbon v-ribbon-${design} ${className}`}
      role="banner"
      aria-label={title}
      style={{
        backgroundColor: backgroundColor || (design === 'neumorphic' ? 'var(--ribbon-bg)' : undefined),
        color: textColor || 'var(--gray-12)',
        textAlign: textAlignment,
        ...neuVars,
        ...style
      }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .v-title-ribbon { width: 100%; box-sizing: border-box; margin-top: 2rem; margin-bottom: 2rem; padding: 2.5rem 3rem; transition: all 0.3s ease; }
        .v-ribbon-outline { background-color: transparent; border-top: 1px solid var(--gray-6); border-bottom: 1px solid var(--gray-6); border-left: 6px solid var(--ui-brand-color); }
        .v-ribbon-material { background-color: var(--color-surface, #ffffff); box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05); border-bottom: 3px solid var(--ui-brand-color); }
        .v-ribbon-neumorphic { border-radius: 16px; background-color: var(--ribbon-bg); box-shadow: inset var(--ribbon-x) var(--ribbon-y) var(--ribbon-blur) var(--ribbon-shadow-dark), inset calc(var(--ribbon-x) * -1) calc(var(--ribbon-y) * -1) var(--ribbon-blur) var(--ribbon-shadow-light); }
        @keyframes v-blinkFX { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .v-typewriter-cursor { display: inline-block; width: 0.1em; height: 0.9em; background-color: currentColor; margin-left: 4px; vertical-align: text-bottom; animation: v-blinkFX 0.85s step-end infinite; }
        .v-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
      `}} />
      
      <div 
        className="v-ribbon-inner"
        style={{ maxWidth: '1600px', margin: '0 auto', fontFamily: fontFamily, fontSize: textSize, fontWeight: 600, letterSpacing: '0.04em', lineHeight: '1.2', minHeight: '1.2em' }}
      >
        <h1 className="v-sr-only">{title}</h1>
        <span aria-hidden="true">
          {!isClient && typewriterFX ? '' : (typewriterFX ? displayedText : title)}
          {isTyping && <span className="v-typewriter-cursor" />}
        </span>
      </div>
    </Comp>
  );
});

TitleRibbon.displayName = 'TitleRibbon';