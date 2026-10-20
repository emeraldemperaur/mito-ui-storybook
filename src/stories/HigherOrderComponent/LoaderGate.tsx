"use client";

import React, { useState, useEffect, type JSX } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";

/**
 * @interface LoaderGateProps
 * @description Strongly-typed attributes configuring the LoaderGate splash screen, including typography, timing, and visual variants.
 */
export interface LoaderGateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @description The underlying application tree to be concealed until the Loader completes its lifecycle.
   */
  children: React.ReactNode;
  /**
   * @description The architectural design system variation dictating the visual styling of the loading block. 'minimal' provides a distraction-free pure overlay.
   * @default 'minimal'
   */
  design?: DesignVariant | 'minimal';
  /**
   * @description Delegates rendering of the main wrapper to the immediate child element via Radix Slot.
   * @default false
   */
  asChild?: boolean;
  /**
   * @description Text or component rendered prominently inside the animating loader block to signal application identity.
   * @default "Praimfaya"
   */
  brandName?: React.ReactNode;
  /**
   * @description Secondary contextual text displayed below the brand signal to indicate system status.
   * @default "Loading..."
   */
  loadingText?: string;
  /**
   * @description The explicit artificial delay (in milliseconds) before the gate unlocks and reveals the children tree. 
   * @default 1700
   */
  timeout?: number;
  /**
   * @description Custom CSS font-family string applied to the loading and brand text.
   * @default '"Bodoni Moda Variable", serif'
   */
  fontFamily?: string;
  /**
   * @description Explicit background color override for the full-screen overlay mask.
   */
  backgroundColor?: string;
  /**
   * @description Force dark mode rendering independent of the global context.
   * @default false
   */
  darkMode?: boolean;
  /**
   * @description Dynamic light/dark mode brand colors injected into the CSS variables.
   */
  darkModeColors?: { light: string; dark: string };
  /**
   * @description Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast.
   * @default 1
   */
  neuIntensity?: number;
  /**
   * @description Neumorphic 3D extrusion distance in pixels. Controls shadow spread and offset of the central loading card.
   * @default 12
   */
  elevation?: number;
}

/**
 * @component LoaderGate
 * @description Master transition barrier component. Orchestrates a full-screen, scroll-locked loading overlay with kinetic split-text animations that dissolves after a prescribed timeout to reveal the underlying application tree.
 */
export const LoaderGate = React.forwardRef<HTMLDivElement, LoaderGateProps>(({
  children,
  design = 'minimal',
  asChild = false,
  brandName = "Praimfaya",
  loadingText = "Loading...",
  timeout = 1700,
  fontFamily = '"Bodoni Moda Variable", serif',
  backgroundColor,
  darkMode = false,
  darkModeColors,
  neuIntensity = 1,
  elevation = 12,
  className = "",
  style,
  ...props
}, ref): JSX.Element => {
  // ... [Implementation remains exactly the same]
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});

  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || (darkMode ? '#ffffff' : '#002C51');
  
  const defaultBg = darkMode ? '#1b1c1d' : '#ffffff';
  const overlayBg = backgroundColor || defaultBg;

  useEffect(() => {
    setIsMounted(true);
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsLoading(false);
      if (typeof document !== 'undefined') document.body.style.overflow = '';
    }, timeout);

    return () => {
      clearTimeout(timer);
      if (typeof document !== 'undefined') document.body.style.overflow = '';
    };
  }, [timeout]);

  useEffect(() => {
    if (design === 'neumorphic') {
      const envBg = backgroundColor || (typeof document !== 'undefined' ? getNearestParentBackground(document.body) : overlayBg);
      const shadowDark = adjustColor(envBg, -15 * neuIntensity);
      const shadowLight = adjustColor(envBg, 15 * neuIntensity);

      setNeuVars({
        '--loader-env-bg': envBg,
        '--loader-shadow-dark': shadowDark,
        '--loader-shadow-light': shadowLight,
        '--loader-dist': `${elevation}px`,
        '--loader-blur': `${elevation * 2}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, neuIntensity, backgroundColor, overlayBg]);

  const cssVariables = {
    '--loader-font': fontFamily,
    '--loader-bg': overlayBg,
    '--loader-brand': resolvedBrandColor,
    '--loader-inside': darkMode ? '#9ca3af' : resolvedBrandColor,
    '--loader-border': darkMode ? '#333333' : '#e0e0e0',
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "div";

  return (
    <Comp ref={ref} className={`v-loader-wrapper ${className}`} style={style} {...props}>
      <style dangerouslySetInnerHTML={{ __html: `
        .v-loader-wrapper { position: relative; width: 100%; min-height: 100vh; }
        .v-loader-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; background-color: var(--loader-bg); z-index: 99999; transition: opacity 0.4s ease-out, visibility 0.4s ease-out; font-family: var(--loader-font); }
        .v-loader-overlay.fade-out { opacity: 0; visibility: hidden; pointer-events: none; }
        .v-loader-card { display: flex; justify-content: center; align-items: center; padding: 3rem 4rem; }
        .v-design-outline { border: 1px solid var(--loader-border); border-radius: 12px; background-color: transparent; }
        .v-design-material { background-color: var(--loader-bg); border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, ${darkMode ? 0.5 : 0.1}); }
        .v-design-neumorphic { background-color: var(--loader-env-bg); border-radius: 20px; box-shadow: var(--loader-dist) var(--loader-dist) var(--loader-blur) var(--loader-shadow-dark), calc(var(--loader-dist) * -1) calc(var(--loader-dist) * -1) var(--loader-blur) var(--loader-shadow-light); }
        .v-cl-container { width: 9.25em; height: 1.15em; font-size: 2.5rem; letter-spacing: 0.13em; position: relative; }
        .v-cl-container > div { position: absolute; left: 0; text-transform: uppercase; width: 100%; display: block; text-align: center; font-weight: 700; }
        .v-upper { top: 0; height: 52.5%; overflow: hidden; z-index: 3; color: var(--loader-brand); background-color: var(--loader-bg); animation: v-moveUp 1.5s ease-in-out forwards; }
        .v-design-neumorphic .v-upper { background-color: var(--loader-env-bg); }
        .v-lower { bottom: 0; height: 100%; z-index: 1; background: linear-gradient(180deg, var(--loader-bg) 52.5%, var(--loader-brand) 52.5%); color: transparent; background-clip: text; -webkit-background-clip: text; animation: v-moveDown 1.5s ease-in-out forwards; }
        .v-design-neumorphic .v-lower { background: linear-gradient(180deg, var(--loader-env-bg) 52.5%, var(--loader-brand) 52.5%); color: transparent; background-clip: text; -webkit-background-clip: text; }
        .v-inside { position: absolute; top: 30%; transform: translateY(-50%); text-align: center; z-index: 2; font-size: 0.77rem; letter-spacing: 0.13em; font-weight: 600; color: var(--loader-inside); opacity: 0; animation: v-fadeText 1.5s ease-in-out forwards; }
        @keyframes v-fadeText { 0%, 15%, 85%, 100% { opacity: 0; } 40%, 60% { opacity: 1; } }
        @keyframes v-moveUp { 0%, 100% { top: 0; } 50%, 70% { top: -45px; } }
        @keyframes v-moveDown { 0%, 100% { top: 0; } 50%, 70% { top: 30px; } }
        @media (max-width: 424px) { .v-cl-container { font-size: 2rem; } .v-inside { font-size: 0.65rem; } }
      `}} />

      {(!isMounted || isLoading) && (
        <div className={`v-loader-overlay ${!isLoading ? 'fade-out' : ''}`} style={cssVariables} role="status" aria-live="polite" aria-busy={isLoading}>
          <div className={`v-loader-card v-design-${design}`}>
            <div className="v-cl-container">
              <div className="v-upper" aria-hidden="true">{brandName}</div>
              <div className="v-lower" aria-hidden="true">{brandName}</div>
              <div className="v-inside">{loadingText}</div>
            </div>
          </div>
        </div>
      )}

      <div className="v-loader-content" style={{ visibility: isLoading ? 'hidden' : 'visible', height: isLoading ? 0 : 'auto', overflow: isLoading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </Comp>
  );
});

LoaderGate.displayName = 'LoaderGate';