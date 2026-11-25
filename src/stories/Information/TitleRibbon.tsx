"use client";

import React, { useRef, useState, useEffect, type JSX, type ReactNode } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";

/**
 * @type TitleRibbonDesignVariant
 * @description Strong string literal union representing the supported enterprise architectural design variants.
 */
export type TitleRibbonDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @interface TitleRibbonProps
 * @description Strongly-typed attributes configuring the TitleRibbon banner, typography, typewriter animation,
 * multi-variant 3D surface adaptation, and granular light/dark color overrides.
 * Every prop is explicitly documented for optimal downstream MCP context-injection.
 */
export interface TitleRibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @description Primary heading text rendered inside the banner. Also exposed to assistive technologies via a screen-reader `<h1>`.
   * @required
   */
  title: string;
  /**
   * @description Optional secondary description or subtitle rendered directly beneath the primary title.
   */
  subtitle?: string;
  /**
   * @description Optional icon ReactNode injected adjacent to the title text.
   */
  icon?: ReactNode;
  /**
   * @description Controls the placement of the injected icon relative to the title text.
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * @description The architectural design system variation dictating the ribbon's surface, border, and depth styling.
   * - `outline`: Clean bordered banner with a leading brand accent bar.
   * - `material`: Elevated surface with soft drop shadows and a bottom brand accent rule.
   * - `neumorphic`: Soft, extruded 3D surface dynamically adapted to its parent's background color.
   * - `skeuomorphic`: Tactile, beveled 3D surface with directional lighting gradients adapted to its parent's background.
   * @default 'outline'
   */
  design?: TitleRibbonDesignVariant;
  /**
   * @description Delegates rendering to the immediate child element via Radix Slot, allowing semantic HTML substitution without breaking layout.
   * @default false
   */
  asChild?: boolean;
  /**
   * @description Horizontal text alignment of the title, icon, subtitle, and optional error message within the ribbon container.
   * @default 'left'
   */
  textAlignment?: 'left' | 'center' | 'right';
  /**
   * @description Enables an SSR-safe, character-by-character typewriter entrance animation with a blinking cursor.
   * @default false
   */
  typewriterFX?: boolean;
  /**
   * @description Base CSS font-family string applied globally to the ribbon's typography unless overridden by `titleFontFamily` or `subTitleFontFamily`.
   * @default '"Bodoni Moda Variable", -apple-system, serif'
   */
  fontFamily?: string;
  /**
   * @description Explicit CSS font-family override applied specifically to the primary title text.
   */
  titleFontFamily?: string;
  /**
   * @description Explicit CSS font-family override applied specifically to the subtitle text.
   */
  subTitleFontFamily?: string;
  /**
   * @description Explicit CSS font-size string controlling the rendered scale of the title text.
   * @default '2.4rem'
   */
  textSize?: string;
  /**
   * @description Explicit color override for the ribbon's brand accent stroke/border, taking precedence over `darkModeColors` and global theme tokens.
   */
  strokeColor?: string;
  /**
   * @description Force dark mode rendering independent of the global UI context or OS preference.
   * @default false
   */
  
  darkMode?: boolean;
  /**
   * @description Explicit override for the ribbon container's border radius across all design variants.
   * @default '0px'
   */
  borderRadius?: string | number;
  /**
   * @description Dynamic light/dark mode brand accent color mapping injected into `--ui-brand-color` to override global context.
   */
  darkModeColors?: { light: string; dark: string };
  /**
   * @description Explicit container background color override for light mode contexts. Also serves as the base environment color for Neumorphic/Skeuomorphic shadow calculation if provided.
   */
  backgroundColor?: string;
  /**
   * @description Explicit container background color override specifically for dark mode contexts.
   */
  darkBackgroundColor?: string;
  /**
   * @description Explicit title text color override for light mode contexts.
   */
  textColor?: string;
  /**
   * @description Explicit title text color override specifically for dark mode contexts.
   */
  darkTextColor?: string;
  /**
   * @description Optional validation or system alert message displayed directly beneath the title/subtitle inside the ribbon.
   */
  errorText?: string;
  /**
   * @description Explicit error message text color override for light mode contexts.
   * @default '#dc2626'
   */
  errorTextColor?: string;
  /**
   * @description Explicit error message text color override specifically for dark mode contexts.
   * @default '#f87171'
   */
  darkErrorTextColor?: string;
  /**
   * @description Z-axis 3D extrusion distance in pixels for Neumorphic and Skeuomorphic shadow spread and offset.
   * @default 4
   */
  elevation?: number;
  /**
   * @description Multiplier for Neumorphic and Skeuomorphic shadow contrast intensity to maintain WCAG visual clarity across varying parent backgrounds.
   * @default 1
   */
  neuIntensity?: number;
  /**
   * @description Global lighting angle dictating the X and Y shadow trajectories for Neumorphic and Skeuomorphic variants.
   * @default 'top-left'
   */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * @component TitleRibbon
 * @description Master SSR-safe enterprise page/section header banner. Supports icon injection, subtitles,
 * dynamic typewriter effects, ambient-aware Neumorphic and Skeuomorphic 3D rendering, dark mode token overrides, and strictly scoped styling.
 */
export const TitleRibbon = React.forwardRef<HTMLDivElement, TitleRibbonProps>(({
  title,
  subtitle,
  icon,
  iconPosition = 'left',
  design = 'outline',
  asChild = false,
  textAlignment = 'left',
  typewriterFX = false,
  fontFamily = '"Bodoni Moda Variable", -apple-system, serif',
  titleFontFamily,
  subTitleFontFamily,
  textSize = '2.4rem',
  strokeColor,
  borderRadius = '0px',
  darkMode = false,
  darkModeColors,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  errorText,
  errorTextColor,
  darkErrorTextColor,
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
  const resolvedBrandColor =
    strokeColor ||
    (darkMode
      ? (darkModeColors?.dark || darkModeColors?.light || globalContext.themeColors?.dark || globalContext.themeColors?.light || 'var(--blue-9, #3b82f6)')
      : (darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)'));

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
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const explicitBg = darkMode ? (darkBackgroundColor || backgroundColor) : backgroundColor;
      const parentBg =
        explicitBg ||
        getNearestParentBackground(containerRef.current.parentElement) ||
        (darkMode ? '#1f2937' : '#f1f5f9');

      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -18 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 18 * neuIntensity);

      setNeuVars({
        '--mito-tr-env-bg': parentBg,
        '--mito-tr-shadow-dark': shadowDark,
        '--mito-tr-shadow-light': shadowLight,
        '--mito-tr-x': `${x}px`,
        '--mito-tr-y': `${y}px`,
        '--mito-tr-blur': `${blur}px`,
      } as React.CSSProperties);
    } else {
      setNeuVars({});
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor, darkBackgroundColor, darkMode]);

  const resolvedJustify =
    textAlignment === 'center' ? 'center' : textAlignment === 'right' ? 'flex-end' : 'flex-start';

  const resolvedRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--mito-tr-radius': resolvedRadius,
    '--mito-tr-font': fontFamily,
    '--mito-tr-title-font': titleFontFamily || fontFamily,
    '--mito-tr-subtitle-font': subTitleFontFamily || fontFamily,
    '--mito-tr-size': textSize,
    '--mito-tr-align': textAlignment,
    '--mito-tr-justify': resolvedJustify,
    '--mito-tr-bg': backgroundColor || (design === 'outline' ? 'transparent' : '#ffffff'),
    '--mito-tr-bg-dark': darkBackgroundColor || backgroundColor || (design === 'outline' ? 'transparent' : '#1f2937'),
    '--mito-tr-text': textColor || '#111827',
    '--mito-tr-text-dark': darkTextColor || textColor || '#f9fafb',
    '--mito-tr-error': errorTextColor || '#dc2626',
    '--mito-tr-error-dark': darkErrorTextColor || errorTextColor || '#f87171',
    '--mito-tr-border': darkMode ? '#374151' : '#e5e7eb',
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "div";
  const themeClass = darkMode ? 'mito-tr-dark' : '';

  return (
    <Comp
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`mito-tr-root mito-tr-design-${design} ${themeClass} ${className}`}
      role="banner"
      aria-label={title}
      style={{ ...cssVariables, ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-tr-root {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          padding: 2.25rem 3rem;
          font-family: var(--mito-tr-font);
          color: var(--mito-tr-text);
          text-align: var(--mito-tr-align);
          transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
        }
        .mito-tr-dark.mito-tr-root {
          color: var(--mito-tr-text-dark);
        }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */

        /* Outline */
        .mito-tr-design-outline {
          background-color: var(--mito-tr-bg);
          border-top: 1px solid var(--mito-tr-border);
          border-bottom: 1px solid var(--mito-tr-border);
          border-left: 6px solid var(--ui-brand-color);
        }
        .mito-tr-dark.mito-tr-design-outline {
          background-color: var(--mito-tr-bg-dark);
        }

        /* Material */
        .mito-tr-design-material {
          background-color: var(--mito-tr-bg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
          border-bottom: 3px solid var(--ui-brand-color);
        }
        .mito-tr-dark.mito-tr-design-material {
          background-color: var(--mito-tr-bg-dark);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        /* Neumorphic */
        .mito-tr-design-neumorphic {
          background-color: var(--mito-tr-env-bg);
          border: none;
          box-shadow: inset var(--mito-tr-x) var(--mito-tr-y) var(--mito-tr-blur) var(--mito-tr-shadow-dark),
                      inset calc(var(--mito-tr-x) * -1) calc(var(--mito-tr-y) * -1) var(--mito-tr-blur) var(--mito-tr-shadow-light);
        }

        /* Skeuomorphic */
        .mito-tr-design-skeuomorphic {
          background-color: var(--mito-tr-env-bg);
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 0%, rgba(0, 0, 0, 0.04) 100%);
          border: 1px solid rgba(0, 0, 0, 0.16);
          border-bottom: 3px solid var(--ui-brand-color);
          box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.55), 0 10px 18px -4px rgba(0, 0, 0, 0.2);
        }
        .mito-tr-dark.mito-tr-design-skeuomorphic {
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 0%, rgba(0, 0, 0, 0.25) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 3px solid var(--ui-brand-color);
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.12), 0 12px 22px -4px rgba(0, 0, 0, 0.6);
        }

        /* ------------------------- */
        /* INNER TYPOGRAPHY & FX     */
        /* ------------------------- */
        .mito-tr-inner {
          max-width: 1600px;
          margin: 0 auto;
        }

        .mito-tr-title-row {
          display: flex;
          align-items: center;
          justify-content: var(--mito-tr-justify);
          gap: 0.75rem;
          font-family: var(--mito-tr-title-font);
          font-size: var(--mito-tr-size);
          font-weight: 600;
          letter-spacing: 0.04em;
          line-height: 1.2;
          min-height: 1.2em;
          word-break: break-word;
        }

        .mito-tr-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mito-tr-subtitle {
          margin: 0.5rem 0 0 0;
          font-family: var(--mito-tr-subtitle-font);
          font-size: 1rem;
          font-weight: 400;
          letter-spacing: 0.01em;
          line-height: 1.5;
          opacity: 0.78;
        }

        .mito-tr-error {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: normal;
          line-height: 1.4;
          color: var(--mito-tr-error);
        }
        .mito-tr-dark .mito-tr-error {
          color: var(--mito-tr-error-dark);
        }

        @keyframes mito-tr-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .mito-tr-cursor {
          display: inline-block;
          width: 0.09em;
          height: 0.9em;
          background-color: currentColor;
          margin-left: 4px;
          vertical-align: text-bottom;
          animation: mito-tr-blink 0.85s step-end infinite;
        }

        .mito-tr-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* ------------------------- */
        /* RESPONSIVE BREAKPOINTS    */
        /* ------------------------- */
        @media (max-width: 768px) {
          .mito-tr-root {
            padding: 1.75rem 1.5rem;
          }
          .mito-tr-title-row {
            font-size: calc(var(--mito-tr-size) * 0.8);
          }
          .mito-tr-subtitle {
            font-size: 0.925rem;
          }
        }

        @media (max-width: 480px) {
          .mito-tr-root {
            padding: 1.25rem 1rem;
          }
          .mito-tr-title-row {
            font-size: calc(var(--mito-tr-size) * 0.65);
          }
          .mito-tr-subtitle {
            font-size: 0.875rem;
          }
        }
      `}} />

      <div className="mito-tr-inner">
        <h1 className="mito-tr-sr-only">{title}</h1>
        <div className="mito-tr-title-row">
          {icon && iconPosition === 'left' && (
            <span className="mito-tr-icon" aria-hidden="true">{icon}</span>
          )}
          <span aria-hidden="true">
            {!isClient && typewriterFX ? '' : (typewriterFX ? displayedText : title)}
            {isTyping && <span className="mito-tr-cursor" />}
          </span>
          {icon && iconPosition === 'right' && (
            <span className="mito-tr-icon" aria-hidden="true">{icon}</span>
          )}
        </div>

        {subtitle && (
          <p className="mito-tr-subtitle">{subtitle}</p>
        )}

        {errorText && (
          <div className="mito-tr-error" role="alert">
            {errorText}
          </div>
        )}
      </div>
    </Comp>
  );
});

TitleRibbon.displayName = 'TitleRibbon';