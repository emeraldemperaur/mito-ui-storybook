"use client";

import React, { useRef, useState, useEffect, type JSX } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";

/**
 * @type CardDesignVariant
 * @description Standardized design language variants for the Card architectural component.
 */
export type CardDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 
   * Unique identifier for the Card, essential for DOM querying and strict WCAG ARIA linking. 
   */
  id?: string;
  /** 
   * The architectural design system variation. 
   * @default 'material' 
   */
  design?: CardDesignVariant;
  /** 
   * If true, merges component DOM into the immediate child via Radix Slot. 
   * @default false 
   */
  asChild?: boolean;
  /** 
   * Explicit background color override for light mode contexts. 
   */
  backgroundColor?: string;
  /** 
   * Explicit background color override specifically for dark mode contexts. 
   */
  darkBackgroundColor?: string;
  /** 
   * Explicit text color override for light mode contexts. 
   */
  textColor?: string;
  /** 
   * Explicit text color override specifically for dark mode contexts. 
   */
  darkTextColor?: string;
  /** 
   * Toggles the outer border specifically for the Material design variant. 
   * @default true 
   */
  materialBorder?: boolean;
  /** 
   * Explicit override for the container's structural border color in light mode. 
   */
  borderColor?: string;
  /** 
   * Explicit override for the container's structural border color in dark mode. 
   */
  darkBorderColor?: string;
  /** 
   * Explicit override for the container's border width (e.g., '2px' or numeric 2). 
   * @default '1px'
   */
  borderWidth?: string | number;
  /** 
   * Custom font family applied globally to the card content. 
   * @default '"Bodoni Moda Variable", -apple-system, sans-serif' 
   */
  fontFamily?: string;
  /** 
   * Force dark mode rendering independent of the global context or system preference. 
   * @default false
   */
  darkMode?: boolean;
  /** 
   * Dynamic light/dark mode fallback color mapping for the active brand token. 
   */
  darkModeColors?: { light: string; dark: string };
  /** 
   * Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. 
   * @default 1 
   */
  neuIntensity?: number;
  /** 
   * Neumorphic 3D extrusion distance in pixels. 
   * @default 6 
   */
  elevation?: number;
  /** 
   * Global lighting angle that dictates the X and Y shadow trajectories (Neumorphic/Skeuomorphic only). 
   * @default 'top-left' 
   */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 
   * Explicit override for the container border radius (e.g. '12px', '1rem', or numeric 12). 
   * @default '0.75rem'
   */
  borderRadius?: string | number;
  /** 
   * Toggles an enterprise-grade frosted glassmorphism aesthetic using backdrop filters and transparency adjustments.
   * @default false
   */
  trueGlass?: boolean;
  /** 
   * Enables a tactile physical hover effect with kinetic drop-shadow transitions.
   * @default false
   */
  tactile?: boolean;
  /** 
   * Dictates the severity of the tactile hover effect.
   * @default 'medium'
   */
  hoverEffect?: 'subtle' | 'medium' | 'pronounced';
}

export interface CardSubComponentProps extends React.HTMLAttributes<HTMLElement> {
  /** If true, merges component DOM into the immediate child via Radix Slot. @default false */
  asChild?: boolean;
}

export interface CardLayoutSubComponentProps extends CardSubComponentProps {
  /** Horizontal alignment of the inner content. */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  /** Vertical alignment of the inner content. */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** Gap between child elements in pixels or rems. */
  gap?: string | number;
  /** Toggles the structural separation line border. @default true */
  withBorder?: boolean;
}

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Dictates border-radius rendering based on image placement. @default 'top' */
  position?: 'top' | 'bottom' | 'overlay';
  /** If true, merges component DOM into the immediate child via Radix Slot. @default false */
  asChild?: boolean;
}

export interface CardListGroupProps extends React.HTMLAttributes<HTMLUListElement> {
  /** If true, removes outer borders and rounded corners to fit edge-to-edge inside the card. @default true */
  flush?: boolean;
  asChild?: boolean;
}

/**
 * @component Card
 * @description Accessible, SSR-safe semantic container. Natively supports Material shadows, Outline borders, 
 * Skeuomorphic realism, and kinetic Neumorphic 3D rendering. Acts as the root provider of CSS variables for its sub-components.
 * 
 * @example
 * // ARIA Compliant Example:
 * <Card id="user-stats" role="region" aria-labelledby="stats-title" materialBorder={false}>
 *   <CardHeader><CardTitle id="stats-title">User Statistics</CardTitle></CardHeader>
 *   <CardBody>...</CardBody>
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  id,
  children,
  design = 'material',
  asChild = false,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  materialBorder = true,
  borderColor,
  darkBorderColor,
  borderWidth = '1px',
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
  darkMode = false,
  darkModeColors,
  neuIntensity = 1,
  elevation = 6,
  lightSource = 'top-left',
  borderRadius,
  trueGlass = false,
  tactile = false,
  hoverEffect = 'medium',
  className = "",
  style,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  const globalContext = useGlobalUIContext();
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
        '--mito-card-bg-env': parentBg,
        '--mito-card-shadow-dark': shadowDark,
        '--mito-card-shadow-light': shadowLight,
        '--mito-card-x': `${x}px`,
        '--mito-card-y': `${y}px`,
        '--mito-card-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor, darkMode]);

  const resolvedRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
  const resolvedBorderWidth = typeof borderWidth === 'number' ? `${borderWidth}px` : borderWidth;

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--mito-card-font': fontFamily,
    '--mito-card-base-bg': backgroundColor || (darkMode ? '#1f2937' : '#ffffff'),
    '--mito-card-base-bg-dark': darkBackgroundColor || backgroundColor || '#1f2937',
    '--mito-card-text': textColor || (darkMode ? '#f9fafb' : '#111827'),
    '--mito-card-text-dark': darkTextColor || textColor || '#f9fafb',
    '--mito-card-border': darkMode ? (darkBorderColor || borderColor || '#374151') : (borderColor || '#e5e7eb'),
    '--mito-card-border-width': resolvedBorderWidth,
    '--mito-card-divider': darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    ...(resolvedRadius ? { '--mito-card-radius': resolvedRadius } : {}),
    ...(!materialBorder ? { '--mito-card-material-border': 'none' } : {}),
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "div";
  const themeClass = darkMode ? 'mito-card-dark' : '';
  const glassClass = trueGlass ? 'mito-card-glass' : '';
  const tactileClass = tactile ? `mito-card-tactile hover-${hoverEffect}` : '';

  return (
    <Comp 
      id={id}
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`mito-card mito-card-${design} ${themeClass} ${glassClass} ${tactileClass} ${className}`}
      style={{ ...cssVariables, ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-card {
          position: relative; display: flex; flex-direction: column; min-width: 0;
          word-wrap: break-word; background-clip: border-box;
          font-family: var(--mito-card-font); 
          color: var(--mito-card-text);
          border-radius: var(--mito-card-radius, 0.75rem); 
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
          box-sizing: border-box;
          z-index: 1;
        }
        .mito-card-dark {
          color: var(--mito-card-text-dark);
        }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        
        .mito-card-outline {
          background-color: var(--mito-card-base-bg);
          border: var(--mito-card-border-width) solid var(--mito-card-border);
        }
        .mito-card-dark.mito-card-outline {
          background-color: var(--mito-card-base-bg-dark);
        }

        .mito-card-material {
          background-color: var(--mito-card-base-bg);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
          border: var(--mito-card-material-border, var(--mito-card-border-width) solid var(--mito-card-border));
        }
        .mito-card-dark.mito-card-material {
          background-color: var(--mito-card-base-bg-dark);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2);
        }

        .mito-card-neumorphic {
          background-color: var(--mito-card-bg-env); border: none;
          box-shadow: var(--mito-card-x) var(--mito-card-y) var(--mito-card-blur) var(--mito-card-shadow-dark), 
                      calc(var(--mito-card-x) * -1) calc(var(--mito-card-y) * -1) var(--mito-card-blur) var(--mito-card-shadow-light);
        }

        .mito-card-skeuomorphic {
          background-color: var(--mito-card-bg-env);
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.02) 100%);
          border: var(--mito-card-border-width) solid rgba(0,0,0,0.15);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.6), 0 6px 12px rgba(0,0,0,0.1);
        }
        .mito-card-dark.mito-card-skeuomorphic {
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.2) 100%);
          border: var(--mito-card-border-width) solid rgba(255,255,255,0.1);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.15), 0 6px 12px rgba(0,0,0,0.4);
        }

        /* ------------------------- */
        /* TRUEGLASS SUPPORT         */
        /* ------------------------- */
        .mito-card.mito-card-glass {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .mito-card-outline.mito-card-glass, .mito-card-material.mito-card-glass {
          background-color: rgba(255, 255, 255, 0.6);
        }
        .mito-card-dark.mito-card-outline.mito-card-glass, .mito-card-dark.mito-card-material.mito-card-glass {
          background-color: rgba(31, 41, 55, 0.6);
        }
        .mito-card-neumorphic.mito-card-glass {
          background-color: transparent;
          box-shadow: inset 0 0 0 var(--mito-card-border-width) rgba(255,255,255,0.2), 
                      var(--mito-card-x) var(--mito-card-y) var(--mito-card-blur) rgba(0,0,0,0.1);
        }
        .mito-card-skeuomorphic.mito-card-glass {
          background-color: rgba(255,255,255,0.3);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 8px 32px rgba(0,0,0,0.1);
        }
        .mito-card-dark.mito-card-skeuomorphic.mito-card-glass {
          background-color: rgba(0,0,0,0.3);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3);
        }

        /* ------------------------- */
        /* TACTILE HOVER EFFECTS     */
        /* ------------------------- */
        .mito-card-tactile {
          will-change: transform, box-shadow;
        }
        .mito-card-tactile:hover {
          z-index: 5;
        }
        
        .mito-card-tactile.hover-subtle:hover { transform: translateY(-2px); }
        .mito-card-tactile.hover-medium:hover { transform: translateY(-4px); }
        .mito-card-tactile.hover-pronounced:hover { transform: translateY(-8px); }

        .mito-card-outline.mito-card-tactile:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .mito-card-material.mito-card-tactile:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .mito-card-neumorphic.mito-card-tactile:hover {
          box-shadow: calc(var(--mito-card-x) * 1.5) calc(var(--mito-card-y) * 1.5) calc(var(--mito-card-blur) * 1.2) var(--mito-card-shadow-dark), 
                      calc(var(--mito-card-x) * -1.5) calc(var(--mito-card-y) * -1.5) calc(var(--mito-card-blur) * 1.2) var(--mito-card-shadow-light);
        }
        .mito-card-skeuomorphic.mito-card-tactile:hover {
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.6), 0 12px 24px rgba(0,0,0,0.15);
        }
        .mito-card-dark.mito-card-skeuomorphic.mito-card-tactile:hover {
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.15), 0 12px 24px rgba(0,0,0,0.6);
        }

        /* ------------------------- */
        /* SUB-COMPONENTS            */
        /* ------------------------- */
        .mito-card-header {
          padding: 1.25rem 1.5rem; margin-bottom: 0;
          background-color: transparent; border-bottom: var(--mito-card-border-width) solid var(--mito-card-divider);
          display: flex; align-items: center;
        }
        .mito-card-header:first-child { border-radius: calc(var(--mito-card-radius, 0.75rem) - var(--mito-card-border-width)) calc(var(--mito-card-radius, 0.75rem) - var(--mito-card-border-width)) 0 0; }
        .mito-card-header.no-border { border-bottom: none; }
        
        .mito-card-body { flex: 1 1 auto; padding: 1.5rem; }
        
        .mito-card-footer {
          padding: 1.25rem 1.5rem; background-color: transparent;
          border-top: var(--mito-card-border-width) solid var(--mito-card-divider);
          display: flex; align-items: center;
        }
        .mito-card-footer:last-child { border-radius: 0 0 calc(var(--mito-card-radius, 0.75rem) - var(--mito-card-border-width)) calc(var(--mito-card-radius, 0.75rem) - var(--mito-card-border-width)); }
        .mito-card-footer.no-border { border-top: none; }

        .mito-card-title { margin-top: 0; margin-bottom: 0.5rem; font-size: 1.25rem; font-weight: 600; line-height: 1.2; color: inherit; }
        .mito-card-subtitle { margin-top: -0.25rem; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--mito-card-text); opacity: 0.7; }
        .mito-card-text { margin-top: 0; margin-bottom: 1rem; font-size: 0.95rem; line-height: 1.5; color: inherit; }
        .mito-card-text:last-child { margin-bottom: 0; }

        /* Images */
        .mito-card-img-top { width: 100%; border-top-left-radius: calc(var(--mito-card-radius, 0.75rem) - var(--mito-card-border-width)); border-top-right-radius: calc(var(--mito-card-radius, 0.75rem) - var(--mito-card-border-width)); object-fit: cover; }
        .mito-card-img-bottom { width: 100%; border-bottom-left-radius: calc(var(--mito-card-radius, 0.75rem) - var(--mito-card-border-width)); border-bottom-right-radius: calc(var(--mito-card-radius, 0.75rem) - var(--mito-card-border-width)); object-fit: cover; }
        .mito-card-img-overlay { position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 1.5rem; border-radius: calc(var(--mito-card-radius, 0.75rem) - var(--mito-card-border-width)); background: rgba(0,0,0,0.5); color: white; }
        .mito-card-img-overlay .mito-card-text { color: rgba(255,255,255,0.95); }
        .mito-card-img-overlay .mito-card-subtitle { color: rgba(255,255,255,0.8); }

        /* List Groups */
        .mito-card-list-group { display: flex; flex-direction: column; padding-left: 0; margin-bottom: 0; border-radius: var(--mito-card-radius, 0.75rem); }
        .mito-card-list-group-flush { border-radius: 0; }
        .mito-card-list-group-flush .mito-card-list-item { border-width: 0 0 var(--mito-card-border-width); }
        .mito-card-list-group-flush .mito-card-list-item:last-child { border-bottom-width: 0; }

        .mito-card-list-item {
          position: relative; display: block; padding: 1rem 1.5rem;
          color: inherit; text-decoration: none;
          background-color: transparent; border: var(--mito-card-border-width) solid var(--mito-card-divider);
        }
        .mito-card-neumorphic .mito-card-list-item {
           border: none; border-bottom: var(--mito-card-border-width) dashed var(--mito-card-divider);
        }
        .mito-card-neumorphic .mito-card-list-item:last-child { border-bottom: none; }
      `}} />
      {children}
    </Comp>
  );
});
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardLayoutSubComponentProps>(({ 
  id,
  asChild, 
  justify, 
  align, 
  gap, 
  withBorder = true, 
  className = "", 
  style, 
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "div";
  
  const layoutStyles = {
    ...(justify ? { justifyContent: justify } : {}),
    ...(align ? { alignItems: align } : {}),
    ...(gap ? { gap: typeof gap === 'number' ? `${gap}px` : gap } : {}),
    ...style
  } as React.CSSProperties;

  const borderClass = withBorder ? '' : 'no-border';

  return (
    <Comp 
      id={id}
      ref={ref} 
      className={`mito-card-header ${borderClass} ${className}`} 
      style={layoutStyles} 
      {...props} 
    />
  );
});
CardHeader.displayName = 'CardHeader';

export const CardBody = React.forwardRef<HTMLDivElement, CardSubComponentProps>(({ id, asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp id={id} ref={ref} className={`mito-card-body ${className}`} {...props} />;
});
CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef<HTMLDivElement, CardLayoutSubComponentProps>(({ 
  id,
  asChild, 
  justify, 
  align, 
  gap, 
  withBorder = true, 
  className = "", 
  style, 
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "div";
  
  const layoutStyles = {
    ...(justify ? { justifyContent: justify } : {}),
    ...(align ? { alignItems: align } : {}),
    ...(gap ? { gap: typeof gap === 'number' ? `${gap}px` : gap } : {}),
    ...style
  } as React.CSSProperties;

  const borderClass = withBorder ? '' : 'no-border';

  return (
    <Comp 
      id={id}
      ref={ref} 
      className={`mito-card-footer ${borderClass} ${className}`} 
      style={layoutStyles} 
      {...props} 
    />
  );
});
CardFooter.displayName = 'CardFooter';

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardSubComponentProps>(({ id, asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "h5";
  return <Comp id={id} ref={ref} className={`mito-card-title ${className}`} {...props} />;
});
CardTitle.displayName = 'CardTitle';

export const CardSubtitle = React.forwardRef<HTMLHeadingElement, CardSubComponentProps>(({ id, asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "h6";
  return <Comp id={id} ref={ref} className={`mito-card-subtitle ${className}`} {...props} />;
});
CardSubtitle.displayName = 'CardSubtitle';

export const CardText = React.forwardRef<HTMLParagraphElement, CardSubComponentProps>(({ id, asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "p";
  return <Comp id={id} ref={ref} className={`mito-card-text ${className}`} {...props} />;
});
CardText.displayName = 'CardText';

/**
 * @component CardImage
 * @description Supports mapping an image to the 'top', 'bottom', or serving as an 'overlay' background for the card content.
 */
export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(({ id, position = 'top', asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "img";
  const posClass = position === 'overlay' ? 'mito-card-img-top' : `mito-card-img-${position}`;
  return <Comp id={id} ref={ref} className={`${posClass} ${className}`} {...props} />;
});
CardImage.displayName = 'CardImage';

/**
 * @component CardImageOverlay
 * @description Renders a dark, transparent overlay meant to sit directly on top of a `CardImage` to make nested text readable.
 */
export const CardImageOverlay = React.forwardRef<HTMLDivElement, CardSubComponentProps>(({ id, asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp id={id} ref={ref} className={`mito-card-img-overlay ${className}`} {...props} />;
});
CardImageOverlay.displayName = 'CardImageOverlay';

/**
 * @component CardListGroup
 * @description Semantic unordered list element optimized to render seamlessly inside a Card.
 * Flush by default to remove outer borders and blend edge-to-edge.
 */
export const CardListGroup = React.forwardRef<HTMLUListElement, CardListGroupProps>(({ id, flush = true, asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "ul";
  const flushClass = flush ? 'mito-card-list-group-flush' : '';
  return <Comp id={id} ref={ref} className={`mito-card-list-group ${flushClass} ${className}`} {...props} />;
});
CardListGroup.displayName = 'CardListGroup';

export const CardListItem = React.forwardRef<HTMLLIElement, CardSubComponentProps>(({ id, asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "li";
  return <Comp id={id} ref={ref} className={`mito-card-list-item ${className}`} {...props} />;
});
CardListItem.displayName = 'CardListItem';