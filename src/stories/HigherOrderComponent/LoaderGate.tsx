"use client";

import React, { useRef, useState, useEffect, type JSX, type ReactNode } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";

/**
 * @type LoaderGateDesignVariant
 * @description Strong string literal union representing the supported enterprise architectural design variants for the central loading container.
 */
export type LoaderGateDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @type LoaderGateLogoPosition
 * @description Controls whether the injected brand logo is anchored on the far left or far right of the loader container.
 */
export type LoaderGateLogoPosition = 'left' | 'right';

/**
 * @type LoaderGateEntranceExit
 * @description Controls the entrance and exit transition style of the full-screen loading barrier.
 * - `'fade'`: Smooth opacity dissolve out once the timeout completes.
 * - `'liquid-curtain'`: Animated liquid SVG wave curtain that sweeps in from the right and exits to the left.
 */
export type LoaderGateEntranceExit = 'fade' | 'liquid-curtain';

/**
 * @interface LoaderGateProps
 * @description Strongly-typed attributes configuring the LoaderGate splash barrier, entrance/exit transitions,
 * liquid wave curtain colors, kinetic split-text brand reveal, positive/negative conditional routing or node rendering,
 * router-agnostic redirects, multi-variant 3D surface adaptation, frosted glassmorphism, and granular light/dark color overrides.
 * Every prop is explicitly documented for optimal downstream MCP context-injection.
 */
export interface LoaderGateProps extends React.HTMLAttributes<HTMLDivElement> {
  // --- CORE CONTENT & LIFECYCLE ---
  /** The underlying application tree concealed until the loader completes its lifecycle (when neither `onPositive` nor `onNegative` overrides it). */
  children?: ReactNode;
  /** The explicit delay in milliseconds before the gate unlocks, triggers its exit transition, and resolves to its destination content or redirect. @default 1700 */
  timeout?: number;
  /** Text or inline ReactNode rendered prominently inside the kinetic split-text animation. Ignored when `brandNode` is provided. @default 'Praimfaya' */
  brandName?: ReactNode;
  /** Custom ReactNode that completely overrides the default `brandName` upper/lower split-text loading element for full developer extensibility. */
  brandNode?: ReactNode;
  /** Secondary contextual status text revealed between the splitting brand halves (or beneath `brandNode`). @default 'Loading...' */
  loadingText?: string;

  // --- ENTRANCE / EXIT & LIQUID CURTAIN CONTROLS ---
  /** Controls the entrance and exit transition choreography (`'fade'` or `'liquid-curtain'`). @default 'fade' */
  entranceExit?: LoaderGateEntranceExit;
  /** Explicit fill color for the liquid curtain body and its animated SVG wave edges in light mode. Defaults to the resolved background color. */
  waveColor?: string;
  /** Explicit fill color for the liquid curtain body and its animated SVG wave edges specifically in dark mode. Defaults to `waveColor` or the resolved dark background color. */
  darkWaveColor?: string;
  /** Duration in milliseconds of the liquid curtain's slide-in and slide-out sweep transitions. @default 750 */
  curtainSpeed?: number;

  // --- CONDITIONAL GATE RESOLUTION (POSITIVE / NEGATIVE) ---
  /** When `true`, resolves the gate into its positive branch after `timeout`, rendering `onPositiveNode` (highest priority) or redirecting to `onPositivePath`. @default false */
  onPositive?: boolean;
  /** Destination URL or client-side route path navigated to when `onPositive` is `true` and `onPositiveNode` is not provided. */
  onPositivePath?: string;
  /** ReactNode rendered inside the gate when `onPositive` is `true`. Takes strict priority over `onPositivePath` if both are provided. */
  onPositiveNode?: ReactNode;
  /** When `true` (and `onPositive` is not `true`), resolves the gate into its negative branch after `timeout`, rendering `onNegativeNode` (highest priority) or redirecting to `onNegativePath`. @default false */
  onNegative?: boolean;
  /** Destination URL or client-side route path navigated to when `onNegative` is `true` and `onNegativeNode` is not provided. */
  onNegativePath?: string;
  /** ReactNode rendered inside the gate when `onNegative` is `true`. Takes strict priority over `onNegativePath` if both are provided. */
  onNegativeNode?: ReactNode;
  /** Optional router-agnostic redirect handler (e.g., React Router's `navigate` or Next.js `router.push`). When omitted, falls back to native `window.location.assign(path)`. */
  onRedirect?: (path: string) => void;

  // --- BRANDING & LOGO CONTROLS ---
  /** Optional ReactNode representing an auxiliary brand logo icon injected into the loader container. */
  logo?: ReactNode;
  /** Explicit CSS width applied to the logo container (e.g., `'48px'`, `48`). */
  logoWidth?: string | number;
  /** Explicit CSS height applied to the logo container (e.g., `'48px'`, `48`). */
  logoHeight?: string | number;
  /** Controls whether the injected `logo` is positioned on the far `'left'` or far `'right'` of the loader container. @default 'left' */
  logoPosition?: LoaderGateLogoPosition;

  // --- AESTHETIC & DESIGN CONTROLS ---
  /** The architectural design system variation dictating the loading container's surface, borders, and depth. `'material'` provides the clean, distraction-free base overlay aesthetic. @default 'material' */
  design?: LoaderGateDesignVariant;
  /** Toggles an ultra-translucent architectural frosted glass aesthetic (with subtle fractal grain and 1px glass rims) across the overlay and loading card. @default false */
  trueGlass?: boolean;
  /** Explicit CSS `box-shadow` string to override the default drop shadow of the active design variant's loading container. */
  dropShadow?: string;
  /** Custom CSS font-family string applied globally to the loader's brand and status typography. @default '"Bodoni Moda Variable", -apple-system, serif' */
  fontFamily?: string;
  /** Force dark mode rendering independent of the global UI context or OS preference. @default false */
  darkMode?: boolean;
  /** Dynamic light/dark mode brand accent color mapping injected into the CSS variables to override global context. */
  darkModeColors?: { light: string; dark: string };
  /** Explicit overlay and card background color override for light mode contexts. */
  backgroundColor?: string;
  /** Explicit overlay and card background color override specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Explicit primary brand/status text color override for light mode contexts. */
  textColor?: string;
  /** Explicit primary brand/status text color override specifically for dark mode contexts. */
  darkTextColor?: string;
  /** Z-axis 3D extrusion distance in pixels for Neumorphic and Skeuomorphic shadow spread and offset. @default 12 */
  elevation?: number;
  /** Opacity/contrast multiplier for Neumorphic and Skeuomorphic shadow intensity to maintain WCAG visual clarity. @default 1 */
  neuIntensity?: number;
  /** Global lighting angle dictating the X and Y shadow trajectories for Neumorphic and Skeuomorphic variants. @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Delegates rendering of the root wrapper element to its immediate child via Radix Slot. @default false */
  asChild?: boolean;
}

/**
 * @interface LoaderGateSubComponentProps
 * @description Shared props for exported composite sub-components enabling deep layout extensibility.
 */
export interface LoaderGateSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;
}

const WAVE_IN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='164.66' height='1080' viewBox='0 0 164.66 1080'%3E%3Cpath d='M33.62,1080h131V0h-131A163.35,163.35,0,0,0,20.21,15.76C5.15,36-4,62.18,1.69,86.79,16.36,150.53,114.12,166.52,128.2,230.4c7.94,36-15.13,73.25-8.15,109.45,4.87,25.28,23.59,45.64,32.09,69.94,14,40-1.72,84.84-25.73,119.79s-56,63.86-80.15,98.7-40.32,79.4-26.9,119.63C32.42,787,71.43,816.42,73.84,857.6c1.85,31.71-18.87,65.19-4.74,93.65,14.4,29,66.63,35.73,66.63,68.12C135.73,1045.52,57.55,1053.26,33.62,1080Z' fill='%23000'/%3E%3C/svg%3E")`;
const WAVE_OUT_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='170.82' height='1080' viewBox='0 0 170.82 1080'%3E%3Cpath d='M82.5,951.25c-14.13-28.46,6.59-61.94,4.74-93.65C84.83,816.42,45.82,787,32.76,747.91c-13.42-40.23,2.73-84.8,26.91-119.63s56.13-63.74,80.14-98.7,39.74-79.76,25.73-119.79c-8.5-24.3-27.22-44.66-32.09-69.94-7-36.2,16.1-73.44,8.16-109.45C127.52,166.52,29.76,150.53,15.1,86.79,9.44,62.18,18.56,36,33.61,15.76A163.35,163.35,0,0,1,47,0H0V1080H47c23.93-26.74,102.11-34.48,102.11-60.63C149.13,987,96.9,980.26,82.5,951.25Z' fill='%23000'/%3E%3C/svg%3E")`;
const NOISE_SVG = `url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`;

/**
 * @component LoaderGate
 * @description Master enterprise transition barrier and conditional gatekeeper. Orchestrates a full-screen,
 * scroll-locked loading overlay with kinetic split-text animations (or custom `brandNode` injection) and supports
 * both smooth fade-out and dynamic liquid-curtain entrance/exit transitions before revealing `children`,
 * rendering priority `onPositiveNode`/`onNegativeNode` views, or triggering router-agnostic redirects.
 */
export const LoaderGate = React.forwardRef<HTMLDivElement, LoaderGateProps>(({
  children,
  timeout = 1700,
  brandName = "Praimfaya",
  brandNode,
  loadingText = "Loading...",
  entranceExit = 'fade',
  waveColor,
  darkWaveColor,
  curtainSpeed = 750,
  onPositive = false,
  onPositivePath,
  onPositiveNode,
  onNegative = false,
  onNegativePath,
  onNegativeNode,
  onRedirect,
  logo,
  logoWidth,
  logoHeight,
  logoPosition = 'left',
  design = 'material',
  trueGlass = false,
  dropShadow,
  fontFamily = '"Bodoni Moda Variable", -apple-system, serif',
  darkMode = false,
  darkModeColors,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  elevation = 12,
  neuIntensity = 1,
  lightSource = 'top-left',
  asChild = false,
  className = "",
  style,
  ...props
}, ref): JSX.Element => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [curtainPhase, setCurtainPhase] = useState<'idle' | 'slide-in' | 'slide-out'>('idle');
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const hasRedirectedRef = useRef<boolean>(false);

  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkMode
    ? (darkTextColor || textColor || darkModeColors?.dark || darkModeColors?.light || globalContext.themeColors?.dark || '#ffffff')
    : (textColor || darkModeColors?.light || globalContext.themeColors?.light || '#002C51');

  const resolvedBg = darkMode
    ? (darkBackgroundColor || backgroundColor || '#0a0a0c')
    : (backgroundColor || '#f9fafb');

  const resolvedWaveColor = darkMode
    ? (darkWaveColor || waveColor || resolvedBg)
    : (waveColor || resolvedBg);

  const isLiquidCurtain = entranceExit === 'liquid-curtain';

  useEffect(() => {
    setIsLoading(true);
    setIsDismissed(false);
    setCurtainPhase('idle');
    hasRedirectedRef.current = false;

    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    let rafId: number | null = null;
    let dismissTimer: ReturnType<typeof setTimeout> | null = null;

    if (isLiquidCurtain && typeof window !== 'undefined') {
      rafId = requestAnimationFrame(() => {
        setCurtainPhase('slide-in');
      });
    }

    const exitDuration = isLiquidCurtain ? curtainSpeed + 80 : 420;

    const unlockTimer = setTimeout(() => {
      setIsLoading(false);
      if (isLiquidCurtain) {
        setCurtainPhase('slide-out');
      }
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }

      dismissTimer = setTimeout(() => {
        setIsDismissed(true);
      }, exitDuration);
    }, timeout);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(unlockTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [timeout, isLiquidCurtain, curtainSpeed]);

  useEffect(() => {
    if (isLoading || hasRedirectedRef.current) return;

    let targetPath: string | undefined;
    if (onPositive && !onPositiveNode && onPositivePath) {
      targetPath = onPositivePath;
    } else if (!onPositive && onNegative && !onNegativeNode && onNegativePath) {
      targetPath = onNegativePath;
    }

    if (targetPath) {
      hasRedirectedRef.current = true;
      if (onRedirect) {
        onRedirect(targetPath);
      } else if (typeof window !== 'undefined') {
        window.location.assign(targetPath);
      }
    }
  }, [isLoading, onPositive, onPositiveNode, onPositivePath, onNegative, onNegativeNode, onNegativePath, onRedirect]);

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && wrapperRef.current) {
      const explicitBg = darkMode ? (darkBackgroundColor || backgroundColor) : backgroundColor;
      const envBg =
        explicitBg ||
        (typeof document !== 'undefined'
          ? getNearestParentBackground(wrapperRef.current.parentElement || document.body)
          : resolvedBg) ||
        resolvedBg;

      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(envBg, -22 * neuIntensity);
      const shadowLight = adjustColor(envBg, 22 * neuIntensity);

      setNeuVars({
        '--mito-lg-env-bg': envBg,
        '--mito-lg-shadow-dark': shadowDark,
        '--mito-lg-shadow-light': shadowLight,
        '--mito-lg-x': `${x}px`,
        '--mito-lg-y': `${y}px`,
        '--mito-lg-dist': `${elevation}px`,
        '--mito-lg-blur': `${blur}px`,
      } as React.CSSProperties);
    } else {
      setNeuVars({});
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor, darkBackgroundColor, darkMode, resolvedBg]);

  const resolvedLogoWidth = typeof logoWidth === 'number' ? `${logoWidth}px` : logoWidth;
  const resolvedLogoHeight = typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight;

  const cssVariables = {
    '--mito-lg-font': fontFamily,
    '--mito-lg-bg': resolvedBg,
    '--mito-lg-wave-color': resolvedWaveColor,
    '--mito-lg-curtain-speed': `${curtainSpeed}ms`,
    '--mito-lg-text': resolvedBrandColor,
    '--mito-lg-muted': darkMode ? 'rgba(255, 255, 255, 0.6)' : '#4b5563',
    '--mito-lg-border': darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    '--mito-lg-glass-bg': darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.05)',
    '--mito-lg-glass-overlay': darkMode ? 'rgba(10, 10, 12, 0.35)' : 'rgba(249, 250, 251, 0.25)',
    '--mito-lg-glass-border': darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    ...(dropShadow ? { '--mito-lg-custom-shadow': dropShadow } : {}),
    ...neuVars,
  } as React.CSSProperties;

  const resolveUnlockedContent = (): ReactNode => {
    if (onPositive && onPositiveNode) return onPositiveNode;
    if (!onPositive && onNegative && onNegativeNode) return onNegativeNode;
    return children;
  };

  const Comp = asChild ? Slot : "div";
  const themeClass = darkMode ? 'mito-lg-dark' : '';
  const glassClass = trueGlass ? 'mito-lg-glass' : '';
  const transitionClass = isLiquidCurtain ? `mito-lg-liquid mito-lg-curtain-${curtainPhase}` : '';

  const renderLogoNode = () =>
    logo ? (
      <LoaderGateLogo
        style={{
          width: resolvedLogoWidth,
          height: resolvedLogoHeight,
        }}
      >
        {logo}
      </LoaderGateLogo>
    ) : null;

  return (
    <Comp
      ref={(node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`mito-lg-wrapper ${themeClass} ${glassClass} ${className}`}
      style={style}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-lg-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .mito-lg-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1.5rem;
          box-sizing: border-box;
          background-color: var(--mito-lg-bg);
          z-index: 99999;
          opacity: 1;
          visibility: visible;
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s ease;
          font-family: var(--mito-lg-font);
          color: var(--mito-lg-text);
        }
        .mito-lg-overlay.mito-lg-fade-out {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        /* Apotheosis TrueGlass Overlay (Ultra-Translucent + 24px Blur + Fractal Grain) */
        .mito-lg-glass .mito-lg-overlay:not(.mito-lg-liquid) {
          background-color: var(--mito-lg-glass-overlay);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .mito-lg-glass-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: ${NOISE_SVG};
          mix-blend-mode: overlay;
          z-index: 1;
        }

        /* ------------------------- */
        /* LIQUID CURTAIN TRANSITION */
        /* ------------------------- */
        .mito-lg-overlay.mito-lg-liquid {
          background-color: transparent;
          pointer-events: auto;
        }
        .mito-lg-overlay.mito-lg-liquid.mito-lg-curtain-slide-out {
          pointer-events: none;
        }

        .mito-lg-curtain {
          position: absolute;
          top: 0;
          right: 0;
          margin-right: -165px;
          left: auto;
          width: 0;
          height: 100%;
          background-color: var(--mito-lg-wave-color);
          z-index: 1;
          transition: all var(--mito-lg-curtain-speed, 750ms) cubic-bezier(0.17, 0.67, 0.83, 0.67);
        }

        .mito-lg-curtain::before,
        .mito-lg-curtain::after {
          content: "";
          display: none;
          position: absolute;
          top: 0;
          height: 100%;
          background-color: var(--mito-lg-wave-color);
          mask-repeat: repeat-y;
          -webkit-mask-repeat: repeat-y;
          mask-position: 0px 0px;
          -webkit-mask-position: 0px 0px;
          transition: transform var(--mito-lg-curtain-speed, 750ms) cubic-bezier(0.17, 0.67, 0.83, 0.67);
          animation: mito-lg-curtain-wave 7.5s linear infinite;
        }

        .mito-lg-curtain::before {
          left: -160px;
          width: 165px;
          mask-image: ${WAVE_IN_SVG};
          -webkit-mask-image: ${WAVE_IN_SVG};
          transform: scaleX(1);
        }

        .mito-lg-curtain::after {
          right: -166px;
          width: 171px;
          mask-image: ${WAVE_OUT_SVG};
          -webkit-mask-image: ${WAVE_OUT_SVG};
          transform: scaleX(1);
          transform-origin: top left;
        }

        .mito-lg-curtain-slide-in .mito-lg-curtain {
          right: 0;
          margin-right: -165px;
          left: auto;
          width: 150%;
        }
        .mito-lg-curtain-slide-in .mito-lg-curtain::before,
        .mito-lg-curtain-slide-in .mito-lg-curtain::after {
          display: block;
        }

        .mito-lg-curtain-slide-out .mito-lg-curtain {
          right: auto;
          margin-left: -171px;
          left: -171px;
          width: 0;
        }
        .mito-lg-curtain-slide-out .mito-lg-curtain::before {
          display: block;
        }
        .mito-lg-curtain-slide-out .mito-lg-curtain::after {
          display: block;
          transform: scaleX(2);
        }

        @keyframes mito-lg-curtain-wave {
          0% {
            mask-position: 0 0;
            -webkit-mask-position: 0 0;
          }
          100% {
            mask-position: 0 -1080px;
            -webkit-mask-position: 0 -1080px;
          }
        }

        .mito-lg-liquid .mito-lg-card {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .mito-lg-curtain-slide-in .mito-lg-card {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.2s;
        }
        .mito-lg-curtain-slide-out .mito-lg-card {
          opacity: 0;
          transform: translateY(-8px);
          transition-delay: 0s;
        }

        /* ------------------------- */
        /* CENTRAL LOADER CARD       */
        /* ------------------------- */
        .mito-lg-card {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.75rem;
          padding: 3rem 4rem;
          max-width: min(760px, 92vw);
          box-sizing: border-box;
          transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        /* Clean, Distraction-Free Base Material Aesthetic */
        .mito-lg-design-material {
          background: transparent;
          border: none;
          box-shadow: var(--mito-lg-custom-shadow, none);
        }

        .mito-lg-design-outline {
          border: 1.5px solid var(--mito-lg-border);
          border-radius: 20px;
          background-color: transparent;
          box-shadow: var(--mito-lg-custom-shadow, none);
        }

        /* Rich Neumorphic Extrusion + Carved Inner Well */
        .mito-lg-design-neumorphic {
          background-color: var(--mito-lg-env-bg);
          background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, transparent 50%, rgba(0, 0, 0, 0.04) 100%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 26px;
          box-shadow: var(
            --mito-lg-custom-shadow,
            var(--mito-lg-x) var(--mito-lg-y) var(--mito-lg-blur) var(--mito-lg-shadow-dark),
            calc(var(--mito-lg-x) * -1) calc(var(--mito-lg-y) * -1) var(--mito-lg-blur) var(--mito-lg-shadow-light),
            inset 1px 1px 2px rgba(255, 255, 255, 0.35)
          );
        }
        .mito-lg-dark .mito-lg-design-neumorphic {
          background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%, rgba(0, 0, 0, 0.18) 100%);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: var(
            --mito-lg-custom-shadow,
            var(--mito-lg-x) var(--mito-lg-y) var(--mito-lg-blur) var(--mito-lg-shadow-dark),
            calc(var(--mito-lg-x) * -1) calc(var(--mito-lg-y) * -1) var(--mito-lg-blur) var(--mito-lg-shadow-light),
            inset 1px 1px 2px rgba(255, 255, 255, 0.06)
          );
        }
        .mito-lg-design-neumorphic:not(.mito-lg-glass-card) .mito-lg-brand-slot {
          padding: 1.35rem 2.25rem;
          border-radius: 18px;
          background-color: var(--mito-lg-env-bg);
          box-shadow: inset calc(var(--mito-lg-x) * 0.55) calc(var(--mito-lg-y) * 0.55) calc(var(--mito-lg-blur) * 0.65) var(--mito-lg-shadow-dark),
                      inset calc(var(--mito-lg-x) * -0.55) calc(var(--mito-lg-y) * -0.55) calc(var(--mito-lg-blur) * 0.65) var(--mito-lg-shadow-light);
        }

        /* Rich Skeuomorphic Tactile Hardware Bevel + Recessed Display Plate */
        .mito-lg-design-skeuomorphic {
          background-color: var(--mito-lg-env-bg);
          background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.48) 0%,
            rgba(255, 255, 255, 0.14) 20%,
            rgba(0, 0, 0, 0.02) 70%,
            rgba(0, 0, 0, 0.14) 100%
          );
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 22px;
          box-shadow: var(
            --mito-lg-custom-shadow,
            inset 0 2px 2px rgba(255, 255, 255, 0.85),
            inset 0 -2px 3px rgba(0, 0, 0, 0.08),
            0 18px 36px rgba(0, 0, 0, 0.22),
            0 4px 10px rgba(0, 0, 0, 0.14)
          );
        }
        .mito-lg-dark .mito-lg-design-skeuomorphic {
          background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.04) 22%,
            rgba(0, 0, 0, 0.22) 70%,
            rgba(0, 0, 0, 0.48) 100%
          );
          border: 1px solid rgba(0, 0, 0, 0.65);
          border-top: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: var(
            --mito-lg-custom-shadow,
            inset 0 1px 1px rgba(255, 255, 255, 0.2),
            inset 0 -2px 4px rgba(0, 0, 0, 0.45),
            0 22px 44px rgba(0, 0, 0, 0.65),
            0 6px 14px rgba(0, 0, 0, 0.45)
          );
        }
        .mito-lg-design-skeuomorphic:not(.mito-lg-glass-card) .mito-lg-brand-slot {
          padding: 1.35rem 2.25rem;
          border-radius: 14px;
          background-color: rgba(0, 0, 0, 0.045);
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.14), 0 1px 0 rgba(255, 255, 255, 0.78);
        }
        .mito-lg-dark .mito-lg-design-skeuomorphic:not(.mito-lg-glass-card) .mito-lg-brand-slot {
          background-color: rgba(0, 0, 0, 0.34);
          border: 1px solid rgba(0, 0, 0, 0.6);
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Apotheosis TrueGlass Card (Exact Ultra-Translucent Glass Optics for framed variants) */
        .mito-lg-glass .mito-lg-card:not(.mito-lg-design-material) {
          background: var(--mito-lg-glass-bg);
          background-image: none;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid var(--mito-lg-glass-border);
          box-shadow: var(
            --mito-lg-custom-shadow,
            0 20px 40px rgba(0, 0, 0, 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.08)
          );
        }
        .mito-lg-dark.mito-lg-glass .mito-lg-card:not(.mito-lg-design-material) {
          box-shadow: var(
            --mito-lg-custom-shadow,
            0 25px 50px rgba(0, 0, 0, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.06)
          );
        }

        /* Logo Slot */
        .mito-lg-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .mito-lg-logo img,
        .mito-lg-logo svg {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        /* ------------------------- */
        /* KINETIC SPLIT-TEXT BRAND  */
        /* ------------------------- */
        .mito-lg-brand-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .mito-lg-split-container {
          position: relative;
          min-width: 9.25em;
          height: 1.25em;
          font-size: 2.5rem;
          letter-spacing: 0.13em;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mito-lg-split-upper,
        .mito-lg-split-lower {
          position: absolute;
          left: 0;
          width: 100%;
          text-align: center;
          text-transform: uppercase;
          font-weight: 700;
          line-height: 1.25em;
          color: var(--mito-lg-text);
          white-space: nowrap;
        }

        .mito-lg-split-upper {
          top: 0;
          clip-path: inset(0 0 47.5% 0);
          -webkit-clip-path: inset(0 0 47.5% 0);
          z-index: 3;
          animation: mito-lg-move-up 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .mito-lg-split-lower {
          top: 0;
          clip-path: inset(52.5% 0 0 0);
          -webkit-clip-path: inset(52.5% 0 0 0);
          z-index: 1;
          animation: mito-lg-move-down 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .mito-lg-status-inside {
          position: relative;
          z-index: 2;
          text-align: center;
          font-size: 0.8rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--mito-lg-muted);
          opacity: 0;
          animation: mito-lg-fade-text 1.5s ease-in-out forwards;
        }

        .mito-lg-custom-status {
          margin-top: 0.85rem;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--mito-lg-muted);
        }

        @keyframes mito-lg-fade-text {
          0%, 15%, 85%, 100% { opacity: 0; }
          40%, 60% { opacity: 1; }
        }
        @keyframes mito-lg-move-up {
          0%, 100% { transform: translateY(0); }
          50%, 70% { transform: translateY(-28px); }
        }
        @keyframes mito-lg-move-down {
          0%, 100% { transform: translateY(0); }
          50%, 70% { transform: translateY(24px); }
        }

        /* Unlocked Content Container */
        .mito-lg-content {
          width: 100%;
          min-height: 100vh;
        }

        /* ------------------------- */
        /* RESPONSIVE BREAKPOINTS    */
        /* ------------------------- */
        @media (max-width: 768px) {
          .mito-lg-card {
            padding: 2.25rem 2rem;
            gap: 1.25rem;
          }
          .mito-lg-split-container {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .mito-lg-card {
            flex-direction: column;
            padding: 1.75rem 1.25rem;
            gap: 1rem;
          }
          .mito-lg-split-container {
            font-size: 1.55rem;
            min-width: 7.5em;
          }
          .mito-lg-status-inside {
            font-size: 0.7rem;
          }
        }
      `}} />

      {!isDismissed && (
        <div
          className={`mito-lg-overlay ${transitionClass} ${!isLiquidCurtain && !isLoading ? 'mito-lg-fade-out' : ''}`}
          style={cssVariables}
          role="status"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {trueGlass && !isLiquidCurtain && <div className="mito-lg-glass-noise" aria-hidden="true" />}
          {isLiquidCurtain && <div className="mito-lg-curtain" aria-hidden="true" />}

          <LoaderGateCard className={`mito-lg-design-${design} ${trueGlass ? 'mito-lg-glass-card' : ''}`}>
            {logoPosition === 'left' && renderLogoNode()}

            <LoaderGateBrand>
              {brandNode ? (
                <>
                  {brandNode}
                  {loadingText && <div className="mito-lg-custom-status">{loadingText}</div>}
                </>
              ) : (
                <div className="mito-lg-split-container">
                  <div className="mito-lg-split-upper" aria-hidden="true">{brandName}</div>
                  <div className="mito-lg-split-lower" aria-hidden="true">{brandName}</div>
                  <div className="mito-lg-status-inside">{loadingText}</div>
                </div>
              )}
            </LoaderGateBrand>

            {logoPosition === 'right' && renderLogoNode()}
          </LoaderGateCard>
        </div>
      )}

      <LoaderGateContent
        style={{
          visibility: isLoading ? 'hidden' : 'visible',
          height: isLoading ? 0 : 'auto',
          overflow: isLoading ? 'hidden' : 'visible',
        }}
      >
        {resolveUnlockedContent()}
      </LoaderGateContent>
    </Comp>
  );
});

LoaderGate.displayName = 'LoaderGate';

export const LoaderGateCard = React.forwardRef<HTMLDivElement, LoaderGateSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-lg-card ${className}`} {...props} />;
});
LoaderGateCard.displayName = 'LoaderGateCard';

export const LoaderGateBrand = React.forwardRef<HTMLDivElement, LoaderGateSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-lg-brand-slot ${className}`} {...props} />;
});
LoaderGateBrand.displayName = 'LoaderGateBrand';

export const LoaderGateLogo = React.forwardRef<HTMLDivElement, LoaderGateSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-lg-logo ${className}`} {...props} />;
});
LoaderGateLogo.displayName = 'LoaderGateLogo';

export const LoaderGateContent = React.forwardRef<HTMLDivElement, LoaderGateSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-lg-content ${className}`} {...props} />;
});
LoaderGateContent.displayName = 'LoaderGateContent';