"use client";

import React, { useRef, useState, useEffect, type JSX } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";


export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The architectural design system variation. @default 'material' */
  design?: DesignVariant;
  /** If true, merges component DOM into the immediate child via Radix Slot. @default false */
  asChild?: boolean;
  /** Explicit background color override for the card container. */
  backgroundColor?: string;
  /** Custom font family applied globally to the card content. @default '"Bodoni Moda Variable", -apple-system, sans-serif' */
  fontFamily?: string;
  /** Force dark mode rendering independent of the global context. */
  darkMode?: boolean;
  /** Dynamic light/dark mode colors to override global context. */
  darkModeColors?: { light: string; dark: string };
  /** Opacity multiplier for the Neumorphic shadow intensity. @default 1 */
  neuIntensity?: number;
  /** Neumorphic 3D extrusion distance in pixels. @default 6 */
  elevation?: number;
  /** Global lighting angle that dictates the X and Y shadow trajectories. @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface CardSubComponentProps extends React.HTMLAttributes<HTMLElement> {
  /** If true, merges component DOM into the immediate child via Radix Slot. @default false */
  asChild?: boolean;
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
 * and kinetic Neumorphic 3D rendering. Acts as the root provider of CSS variables for its sub-components.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  design = 'material',
  asChild = false,
  backgroundColor,
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
  darkMode = false,
  darkModeColors,
  neuIntensity = 1,
  elevation = 6,
  lightSource = 'top-left',
  className = "",
  style,
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
      const shadowDark = adjustColor(parentBg, -15 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 15 * neuIntensity);

      setNeuVars({
        '--card-bg': parentBg,
        '--card-shadow-dark': shadowDark,
        '--card-shadow-light': shadowLight,
        '--card-x': `${x}px`,
        '--card-y': `${y}px`,
        '--card-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor]);

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--card-font': fontFamily,
    '--card-base-bg': backgroundColor || (darkMode ? '#1f2937' : '#ffffff'),
    '--card-border': darkMode ? '#374151' : '#e5e7eb',
    '--card-text-primary': darkMode ? '#f9fafb' : '#111827',
    '--card-text-secondary': darkMode ? '#9ca3af' : '#6b7280',
    '--card-divider': darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
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
      className={`v-card v-card-${design} ${className}`}
      style={{ ...cssVariables, ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .v-card {
          position: relative; display: flex; flex-direction: column; min-width: 0;
          word-wrap: break-word; background-clip: border-box;
          font-family: var(--card-font); color: var(--card-text-primary);
          border-radius: 0.75rem; transition: all 0.3s ease; box-sizing: border-box;
        }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        .v-card-outline {
          background-color: var(--card-base-bg);
          border: 1px solid var(--card-border);
        }
        .v-card-material {
          background-color: var(--card-base-bg);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
          border: 1px solid var(--card-border);
        }
        .v-card-neumorphic {
          background-color: var(--card-bg); border: none;
          box-shadow: var(--card-x) var(--card-y) var(--card-blur) var(--card-shadow-dark), 
                      calc(var(--card-x) * -1) calc(var(--card-y) * -1) var(--card-blur) var(--card-shadow-light);
        }

        /* ------------------------- */
        /* SUB-COMPONENTS            */
        /* ------------------------- */
        .v-card-header {
          padding: 1rem 1.25rem; margin-bottom: 0;
          background-color: transparent; border-bottom: 1px solid var(--card-divider);
        }
        .v-card-header:first-child { border-radius: calc(0.75rem - 1px) calc(0.75rem - 1px) 0 0; }
        
        .v-card-body { flex: 1 1 auto; padding: 1.25rem; }
        
        .v-card-footer {
          padding: 1rem 1.25rem; background-color: transparent;
          border-top: 1px solid var(--card-divider);
        }
        .v-card-footer:last-child { border-radius: 0 0 calc(0.75rem - 1px) calc(0.75rem - 1px); }

        .v-card-title { margin-bottom: 0.5rem; font-size: 1.25rem; font-weight: 600; line-height: 1.2; }
        .v-card-subtitle { margin-top: -0.25rem; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--card-text-secondary); }
        .v-card-text { margin-top: 0; margin-bottom: 1rem; font-size: 0.95rem; }
        .v-card-text:last-child { margin-bottom: 0; }

        /* Images */
        .v-card-img-top { width: 100%; border-top-left-radius: calc(0.75rem - 1px); border-top-right-radius: calc(0.75rem - 1px); object-fit: cover; }
        .v-card-img-bottom { width: 100%; border-bottom-left-radius: calc(0.75rem - 1px); border-bottom-right-radius: calc(0.75rem - 1px); object-fit: cover; }
        .v-card-img-overlay { position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 1.25rem; border-radius: calc(0.75rem - 1px); background: rgba(0,0,0,0.4); color: white; }
        .v-card-img-overlay .v-card-text { color: rgba(255,255,255,0.9); }
        .v-card-img-overlay .v-card-subtitle { color: rgba(255,255,255,0.7); }

        /* List Groups */
        .v-card-list-group { display: flex; flex-direction: column; padding-left: 0; margin-bottom: 0; border-radius: 0.75rem; }
        .v-card-list-group-flush { border-radius: 0; }
        .v-card-list-group-flush .v-card-list-item { border-width: 0 0 1px; }
        .v-card-list-group-flush .v-card-list-item:last-child { border-bottom-width: 0; }

        .v-card-list-item {
          position: relative; display: block; padding: 0.75rem 1.25rem;
          color: var(--card-text-primary); text-decoration: none;
          background-color: transparent; border: 1px solid var(--card-divider);
        }
        .v-card-neumorphic .v-card-list-item {
           border: none; border-bottom: 1px dashed var(--card-divider);
        }
        .v-card-neumorphic .v-card-list-item:last-child { border-bottom: none; }
      `}} />
      {children}
    </Comp>
  );
});
Card.displayName = 'Card';


export const CardHeader = React.forwardRef<HTMLDivElement, CardSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`v-card-header ${className}`} {...props} />;
});
CardHeader.displayName = 'CardHeader';

export const CardBody = React.forwardRef<HTMLDivElement, CardSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`v-card-body ${className}`} {...props} />;
});
CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef<HTMLDivElement, CardSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`v-card-footer ${className}`} {...props} />;
});
CardFooter.displayName = 'CardFooter';

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "h5";
  return <Comp ref={ref} className={`v-card-title ${className}`} {...props} />;
});
CardTitle.displayName = 'CardTitle';

export const CardSubtitle = React.forwardRef<HTMLHeadingElement, CardSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "h6";
  return <Comp ref={ref} className={`v-card-subtitle ${className}`} {...props} />;
});
CardSubtitle.displayName = 'CardSubtitle';

export const CardText = React.forwardRef<HTMLParagraphElement, CardSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "p";
  return <Comp ref={ref} className={`v-card-text ${className}`} {...props} />;
});
CardText.displayName = 'CardText';

/**
 * @component CardImage
 * @description Supports mapping an image to the 'top', 'bottom', or serving as an 'overlay' background for the card content.
 */
export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(({ position = 'top', asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "img";
  const posClass = position === 'overlay' ? 'v-card-img-top' : `v-card-img-${position}`;
  return <Comp ref={ref} className={`${posClass} ${className}`} {...props} />;
});
CardImage.displayName = 'CardImage';

/**
 * @component CardImageOverlay
 * @description Renders a dark, transparent overlay meant to sit directly on top of a `CardImage` to make nested text readable.
 */
export const CardImageOverlay = React.forwardRef<HTMLDivElement, CardSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`v-card-img-overlay ${className}`} {...props} />;
});
CardImageOverlay.displayName = 'CardImageOverlay';


/**
 * @component CardListGroup
 * @description Semantic unordered list element optimized to render seamlessly inside a Card.
 * Flush by default to remove outer borders and blend edge-to-edge.
 */
export const CardListGroup = React.forwardRef<HTMLUListElement, CardListGroupProps>(({ flush = true, asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "ul";
  const flushClass = flush ? 'v-card-list-group-flush' : '';
  return <Comp ref={ref} className={`v-card-list-group ${flushClass} ${className}`} {...props} />;
});
CardListGroup.displayName = 'CardListGroup';

export const CardListItem = React.forwardRef<HTMLLIElement, CardSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "li";
  return <Comp ref={ref} className={`v-card-list-item ${className}`} {...props} />;
});
CardListItem.displayName = 'CardListItem';