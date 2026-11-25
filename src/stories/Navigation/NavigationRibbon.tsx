"use client";

import React, { useRef, useState, useEffect, useCallback, useId, type JSX, type ReactNode } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";

/**
 * @type NavigationRibbonDesignVariant
 * @description Strong string literal union representing the supported enterprise architectural design variants.
 */
export type NavigationRibbonDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @type NavigationRibbonVisibility
 * @description Dictates how the navigation ribbon responds to vertical page scrolling.
 * - `'sticky'`: Remains persistently visible at the configured `pagePosition`.
 * - `'auto-hide'`: Slides out of view when scrolling down and reappears when scrolling up.
 * - `'auto-hide-reappear'`: Slides out of view while scrolling down and automatically reappears once scrolling stops.
 */
export type NavigationRibbonVisibility = 'sticky' | 'auto-hide' | 'auto-hide-reappear';

/**
 * @type NavigationRibbonLogoPosition
 * @description Controls the vertical row (above or below the navigation track) and horizontal alignment of the brand logo.
 */
export type NavigationRibbonLogoPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * @type NavigationRibbonPagePosition
 * @description Controls whether the navigation ribbon is anchored to the top or bottom edge of the viewport.
 */
export type NavigationRibbonPagePosition = 'top' | 'bottom';

/**
 * @interface NavigationRibbonItem
 * @description Represents a single interactive destination inside the liquid-wave navigation ribbon.
 */
export interface NavigationRibbonItem {
  /** Unique identifier or display label rendered inside the navigation item. */
  label: string;
  /** Destination URL or client-side routing path. */
  href: string;
  /** Optional ReactNode icon rendered immediately before the item label. */
  icon?: ReactNode;
  /** Optional controlled flag marking this item as the currently active route. */
  isActive?: boolean;
}

/**
 * @interface NavigationRibbonProps
 * @description Strongly-typed attributes configuring the NavigationRibbon's true liquid SVG wave geometry,
 * 9-item cap, router-agnostic links, 6-position logo placement, top/bottom viewport docking, scroll visibility,
 * multi-variant 3D surface adaptation, glassmorphism, and granular light/dark color overrides.
 * Every prop is explicitly documented for optimal downstream MCP context-injection.
 */
export interface NavigationRibbonProps extends React.HTMLAttributes<HTMLElement> {
  // --- NAVIGATION & ROUTING ---
  /** Array of top-level `NavigationRibbonItem` definitions. Strictly capped at 9 items to enforce clean enterprise UI density. */
  navItems: NavigationRibbonItem[];
  /** Controlled index of the currently active navigation item. Overrides internal active state when provided. */
  activeIndex?: number;
  /** Initial active item index used when operating in uncontrolled mode. @default 0 */
  defaultActiveIndex?: number;
  /** Optional custom link component (e.g., React Router `Link` or Next.js `Link`) for seamless SPA routing without page reloads. Defaults to native `<a>`. */
  linkComponent?: React.ElementType;
  /** Optional callback fired whenever a navigation item is clicked, receiving the target `href`, item index, and mouse event. */
  onNavigate?: (href: string, index: number, e: React.MouseEvent) => void;

  // --- BRANDING & LOGO CONTROLS ---
  /** Optional ReactNode representing the brand logo (e.g., an SVG, image, or typography lockup). */
  logo?: ReactNode;
  /** Explicit CSS width applied to the logo container (e.g., `'140px'`, `48`). */
  logoWidth?: string | number;
  /** Explicit CSS height applied to the logo container (e.g., `'36px'`, `36`). */
  logoHeight?: string | number;
  /** Controls the logo's placement above or below the navigation track (`'top-left'`, `'top-center'`, `'top-right'`, `'bottom-left'`, `'bottom-center'`, `'bottom-right'`). @default 'top-left' */
  logoPosition?: NavigationRibbonLogoPosition;
  /** Destination URL or route path triggered when clicking the brand logo. @default '/' */
  brandHref?: string;

  // --- COMPOSITE ACTION SLOTS ---
  /** Single ReactNode slot for injecting custom social action buttons, search triggers, or login/user account buttons. */
  actionsNode?: ReactNode;
  /** Array of ReactNodes (e.g., `ActionButton` or `Button` instances) rendered in the trailing actions cluster. */
  rightActions?: ReactNode[];

  // --- VIEWPORT DOCKING & SCROLL VISIBILITY ---
  /** Anchors the navigation ribbon to either the `'top'` or `'bottom'` of the viewport, automatically inverting scroll-hide animations and flipping the liquid wave curve. @default 'top' */
  pagePosition?: NavigationRibbonPagePosition;
  /** Controls the menu's visibility behavior relative to page scrolling (`'sticky'`, `'auto-hide'`, or `'auto-hide-reappear'`). @default 'auto-hide' */
  menuVisibility?: NavigationRibbonVisibility;
  /** Delay in milliseconds after scrolling stops before the menu reappears when `menuVisibility="auto-hide-reappear"`. @default 450 */
  scrollReappearDelay?: number;

  // --- LIQUID WAVE INDICATOR CONTROLS ---
  /** Height in pixels of the liquid wave bulge protruding outward beneath (or above) the active item. @default 18 */
  waveHeight?: number;
  /** Half-width in pixels of the liquid wave bell curve. Controls how wide the wave spans. @default 88 */
  waveWidth?: number;
  /** Duration in milliseconds of the quartic ease-in-out liquid wave travel animation. @default 480 */
  waveDuration?: number;
  /** Optional stroke/edge highlight color along the liquid wave contour in light mode. Defaults to the variant's border/rim token. */
  waveColor?: string;
  /** Optional stroke/edge highlight color along the liquid wave contour in dark mode. Defaults to the variant's dark border/rim token. */
  darkWaveColor?: string;

  // --- AESTHETIC & DESIGN CONTROLS ---
  /** The architectural design system variation dictating the ribbon's surface, curved edge stroke, and depth. @default 'outline' */
  design?: NavigationRibbonDesignVariant;
  /** Toggles an enterprise-grade, hyper-realistic glossy frosted glassmorphism aesthetic clipped directly to the liquid wave silhouette. @default false */
  trueGlass?: boolean;
  /** Explicit CSS `drop-shadow(...)` filter string to override the default curved shadow of the active design variant. */
  dropShadow?: string;
  /** Custom CSS font-family string applied globally to the navigation ribbon typography. @default '"Bodoni Moda Variable", -apple-system, sans-serif' */
  fontFamily?: string;
  /** Force dark mode rendering independent of the global UI context or OS preference. @default false */
  darkMode?: boolean;
  /** Dynamic light/dark mode brand color mapping used as fallback accent tokens. */
  darkModeColors?: { light: string; dark: string };
  /** Explicit active/accent color override applied to the active navigation item text and focus rings. */
  activeColor?: string;
  /** Explicit container background color override for light mode contexts. */
  backgroundColor?: string;
  /** Explicit container background color override specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Explicit primary text color override for inactive items in light mode contexts. */
  textColor?: string;
  /** Explicit primary text color override for inactive items in dark mode contexts. */
  darkTextColor?: string;
  /** Explicit hover text color override for inactive items in light mode contexts. */
  hoverTextColor?: string;
  /** Explicit hover text color override for inactive items in dark mode contexts. */
  darkHoverTextColor?: string;
  /** Z-axis 3D extrusion distance in pixels for Neumorphic and Skeuomorphic shadow spread and offset. @default 6 */
  elevation?: number;
  /** Opacity/contrast multiplier for Neumorphic and Skeuomorphic shadow intensity. @default 1 */
  neuIntensity?: number;
  /** Global lighting angle dictating the X and Y shadow trajectories for Neumorphic and Skeuomorphic variants. @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Delegates rendering of the root `<header>` element to its immediate child via Radix Slot. @default false */
  asChild?: boolean;
}

/**
 * @interface NavigationRibbonSubComponentProps
 * @description Shared props for exported composite sub-components enabling deep layout extensibility.
 */
export interface NavigationRibbonSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;
}

/**
 * @interface NavigationRibbonLinkProps
 * @description Props for the router-agnostic `NavigationRibbonLink` sub-component.
 */
export interface NavigationRibbonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Destination URL or client-side route path. */
  href: string;
  /** Optional custom router link component (e.g., React Router `Link` or Next.js `Link`). */
  linkComponent?: React.ElementType;
  /** Marks the link as the currently active route. @default false */
  isActive?: boolean;
  /** Optional navigation callback fired upon click. */
  onNavigate?: (href: string, e: React.MouseEvent) => void;
}

/**
 * @component NavigationRibbonLink
 * @description Router-agnostic link primitive compatible with native `<a>` tags, React Router (`to`), or Next.js (`href`).
 */
export const NavigationRibbonLink = React.forwardRef<HTMLAnchorElement, NavigationRibbonLinkProps>(({
  href,
  linkComponent,
  isActive = false,
  onNavigate,
  onClick,
  className = "",
  children,
  ...props
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) onNavigate(href, e);
    if (onClick) onClick(e);
  };

  if (linkComponent) {
    const RouterLink = linkComponent;
    return (
      <RouterLink
        ref={ref}
        to={href}
        href={href}
        className={`${className} ${isActive ? 'mito-nrib-item-active' : ''}`.trim()}
        aria-current={isActive ? 'page' : undefined}
        onClick={handleClick}
        {...props}
      >
        {children}
      </RouterLink>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      className={`${className} ${isActive ? 'mito-nrib-item-active' : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
});
NavigationRibbonLink.displayName = 'NavigationRibbonLink';

const MAX_NAV_ITEMS = 9;

const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

/**
 * @component NavigationRibbon
 * @description Enterprise-grade, SSR-safe, mobile-ready navigation ribbon featuring a true geometric liquid SVG wave.
 * Uses a live 60fps `requestAnimationFrame` SVG `<clipPath>` so the ribbon's actual surface, frosted glass,
 * tactile Neumorphic/Skeuomorphic bevels, curved borders, and drop shadows flow seamlessly over any page background.
 */
export const NavigationRibbon = React.forwardRef<HTMLElement, NavigationRibbonProps>(({
  navItems = [],
  activeIndex: controlledActiveIndex,
  defaultActiveIndex = 0,
  linkComponent,
  onNavigate,
  logo,
  logoWidth,
  logoHeight,
  logoPosition = 'top-left',
  brandHref = '/',
  actionsNode,
  rightActions = [],
  pagePosition = 'top',
  menuVisibility = 'auto-hide',
  scrollReappearDelay = 450,
  waveHeight = 18,
  waveWidth = 88,
  waveDuration = 480,
  waveColor,
  darkWaveColor,
  design = 'outline',
  trueGlass = false,
  dropShadow,
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
  darkMode = false,
  darkModeColors,
  activeColor,
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  hoverTextColor,
  darkHoverTextColor,
  elevation = 6,
  neuIntensity = 1,
  lightSource = 'top-left',
  asChild = false,
  className = "",
  style,
  children,
  ...props
}, ref): JSX.Element => {
  const rawId = useId();
  const clipId = `mito-nrib-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const headerRef = useRef<HTMLElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const clipPathRef = useRef<SVGPathElement | null>(null);
  const strokeSvgRef = useRef<SVGSVGElement | null>(null);
  const strokePathRef = useRef<SVGPathElement | null>(null);
  const bevelHighlightPathRef = useRef<SVGPathElement | null>(null);

  const currentWaveX = useRef<number | null>(null);
  const waveRafRef = useRef<number | null>(null);

  const safeNavItems = navItems.slice(0, MAX_NAV_ITEMS);

  useEffect(() => {
    const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
    if (nodeEnv !== 'production' && navItems.length > MAX_NAV_ITEMS) {
      console.warn(
        `[Mito UI - NavigationRibbon] Received ${navItems.length} navItems. Capping at ${MAX_NAV_ITEMS} to preserve clean navigation ergonomics.`
      );
    }
  }, [navItems.length]);

  const propActiveFromItems = safeNavItems.findIndex((item) => item.isActive);
  const [internalActiveIndex, setInternalActiveIndex] = useState<number>(
    propActiveFromItems >= 0 ? propActiveFromItems : Math.min(defaultActiveIndex, Math.max(0, safeNavItems.length - 1))
  );

  const resolvedActiveIndex =
    controlledActiveIndex !== undefined
      ? controlledActiveIndex
      : propActiveFromItems >= 0
        ? propActiveFromItems
        : internalActiveIndex;

  const [isVisible, setIsVisible] = useState(true);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});

  const lastScrollY = useRef(0);
  const scrollStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const globalContext = useGlobalUIContext();
  const resolvedActiveColor =
    activeColor ||
    (darkMode
      ? (darkModeColors?.dark || darkModeColors?.light || globalContext.themeColors?.dark || globalContext.themeColors?.light || '#4a7fff')
      : (darkModeColors?.light || globalContext.themeColors?.light || '#2563eb'));

  const resolvedBaseBg = darkMode
    ? (darkBackgroundColor || backgroundColor || '#0d0f17')
    : (backgroundColor || '#ffffff');

  const buildWavePaths = useCallback(
    (cx: number, width: number, totalHeight: number): { clipD: string; strokeD: string } => {
      const bh = waveHeight;
      const bw = waveWidth;
      const lx = cx - bw;
      const rx = cx + bw;

      const l1x = lx + bw * 0.52;
      const l2x = cx - bw * 0.22;
      const r1x = cx + bw * 0.22;
      const r2x = rx - bw * 0.52;

      if (pagePosition === 'bottom') {
        const edge = [
          `M 0 ${bh}`,
          `L ${lx} ${bh}`,
          `C ${l1x} ${bh}, ${l2x} 0, ${cx} 0`,
          `C ${r1x} 0, ${r2x} ${bh}, ${rx} ${bh}`,
          `L ${width} ${bh}`,
        ].join(' ');

        return {
          strokeD: edge,
          clipD: `${edge} L ${width} ${totalHeight} L 0 ${totalHeight} Z`,
        };
      }

      const barH = Math.max(0, totalHeight - bh);
      const edge = [
        `M 0 ${barH}`,
        `L ${lx} ${barH}`,
        `C ${l1x} ${barH}, ${l2x} ${barH + bh}, ${cx} ${barH + bh}`,
        `C ${r1x} ${barH + bh}, ${r2x} ${barH}, ${rx} ${barH}`,
        `L ${width} ${barH}`,
      ].join(' ');

      return {
        strokeD: edge,
        clipD: `M 0 0 L ${width} 0 L ${width} ${barH} L ${rx} ${barH} C ${r2x} ${barH}, ${r1x} ${barH + bh}, ${cx} ${barH + bh} C ${l2x} ${barH + bh}, ${l1x} ${barH}, ${lx} ${barH} L 0 ${barH} Z`,
      };
    },
    [pagePosition, waveHeight, waveWidth]
  );

  const renderWaveAt = useCallback(
    (cx: number) => {
      const surfaceEl = surfaceRef.current;
      const clipEl = clipPathRef.current;
      const strokeSvgEl = strokeSvgRef.current;
      const strokeEl = strokePathRef.current;
      const bevelEl = bevelHighlightPathRef.current;
      if (!surfaceEl || !clipEl) return;

      const w = surfaceEl.clientWidth;
      const h = surfaceEl.clientHeight;
      if (w === 0 || h === 0) return;

      const { clipD, strokeD } = buildWavePaths(cx, w, h);
      clipEl.setAttribute('d', clipD);

      if (strokeSvgEl) {
        strokeSvgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
        if (strokeEl) strokeEl.setAttribute('d', strokeD);
        if (bevelEl) bevelEl.setAttribute('d', strokeD);
      }
    },
    [buildWavePaths]
  );

  const getActiveCenterX = useCallback((): number | null => {
    const surfaceEl = surfaceRef.current;
    const activeEl = itemRefs.current[resolvedActiveIndex];
    if (!surfaceEl || !activeEl) return null;

    const sr = surfaceEl.getBoundingClientRect();
    const er = activeEl.getBoundingClientRect();
    return er.left - sr.left + er.width / 2;
  }, [resolvedActiveIndex]);

  const animateWaveTo = useCallback(
    (targetX: number, immediate = false) => {
      if (waveRafRef.current !== null) {
        cancelAnimationFrame(waveRafRef.current);
        waveRafRef.current = null;
      }

      if (immediate || currentWaveX.current === null || waveDuration <= 0) {
        currentWaveX.current = targetX;
        renderWaveAt(targetX);
        return;
      }

      const fromX = currentWaveX.current;
      const delta = targetX - fromX;
      if (Math.abs(delta) < 0.5) {
        currentWaveX.current = targetX;
        renderWaveAt(targetX);
        return;
      }

      let startTs: number | null = null;
      const step = (ts: number) => {
        if (startTs === null) startTs = ts;
        const progress = Math.min((ts - startTs) / waveDuration, 1);
        const nextX = fromX + delta * easeInOutQuart(progress);
        currentWaveX.current = nextX;
        renderWaveAt(nextX);

        if (progress < 1) {
          waveRafRef.current = requestAnimationFrame(step);
        } else {
          waveRafRef.current = null;
        }
      };

      waveRafRef.current = requestAnimationFrame(step);
    },
    [renderWaveAt, waveDuration]
  );

  useEffect(() => {
    const activeEl = itemRefs.current[resolvedActiveIndex];
    const container = scrollContainerRef.current;

    if (activeEl && container && container.scrollWidth > container.clientWidth) {
      const targetScrollLeft = activeEl.offsetLeft - (container.clientWidth - activeEl.offsetWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });
    }

    const cx = getActiveCenterX();
    if (cx !== null) {
      animateWaveTo(cx, currentWaveX.current === null);
    }
  }, [resolvedActiveIndex, getActiveCenterX, animateWaveTo, safeNavItems.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncImmediate = () => {
      const cx = getActiveCenterX();
      if (cx !== null) animateWaveTo(cx, true);
    };

    window.addEventListener('resize', syncImmediate);

    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', syncImmediate, { passive: true });
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && surfaceRef.current) {
      resizeObserver = new ResizeObserver(syncImmediate);
      resizeObserver.observe(surfaceRef.current);
    }

    let cancelled = false;
    if (typeof document !== 'undefined' && 'fonts' in document && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) syncImmediate();
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('resize', syncImmediate);
      if (scrollEl) scrollEl.removeEventListener('scroll', syncImmediate);
      if (resizeObserver) resizeObserver.disconnect();
      if (waveRafRef.current !== null) cancelAnimationFrame(waveRafRef.current);
    };
  }, [getActiveCenterX, animateWaveTo, fontFamily]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (menuVisibility === 'sticky') {
        setIsVisible(true);
        return;
      }

      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < 6 && currentScrollY > 100) return;

      if (scrollStopTimer.current) {
        clearTimeout(scrollStopTimer.current);
        scrollStopTimer.current = null;
      }

      if (delta > 0 && currentScrollY > 100) {
        setIsVisible(false);
      } else if (delta < 0 || currentScrollY <= 100) {
        setIsVisible(true);
      }

      if (menuVisibility === 'auto-hide-reappear' && currentScrollY > 100) {
        scrollStopTimer.current = setTimeout(() => {
          setIsVisible(true);
        }, scrollReappearDelay);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
    };
  }, [menuVisibility, scrollReappearDelay]);

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && headerRef.current) {
      const explicitBg = darkMode ? (darkBackgroundColor || backgroundColor) : backgroundColor;
      const envBg =
        explicitBg ||
        (typeof document !== 'undefined'
          ? getNearestParentBackground(headerRef.current.parentElement || document.body)
          : resolvedBaseBg) ||
        resolvedBaseBg;

      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const shadowDark = adjustColor(envBg, -22 * neuIntensity);
      const shadowLight = adjustColor(envBg, 22 * neuIntensity);

      setNeuVars({
        '--mito-nrib-env-bg': envBg,
        '--mito-nrib-shadow-dark': shadowDark,
        '--mito-nrib-shadow-light': shadowLight,
        '--mito-nrib-x': `${x}px`,
        '--mito-nrib-y': `${y}px`,
        '--mito-nrib-dist': `${elevation}px`,
        '--mito-nrib-blur': `${elevation * 2}px`,
      } as React.CSSProperties);
    } else {
      setNeuVars({});
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor, darkBackgroundColor, darkMode, resolvedBaseBg]);

  const handleItemClick = (href: string, index: number, e: React.MouseEvent) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    if (onNavigate) {
      onNavigate(href, index, e);
    }
  };

  const resolvedLogoWidth = typeof logoWidth === 'number' ? `${logoWidth}px` : logoWidth;
  const resolvedLogoHeight = typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight;

  const isLogoAbove = logoPosition.startsWith('top-');
  const logoHorizontalAlign = logoPosition.endsWith('center')
    ? 'center'
    : logoPosition.endsWith('right')
      ? 'flex-end'
      : 'flex-start';

  const hiddenTransform = pagePosition === 'bottom' ? 'translateY(115%)' : 'translateY(-115%)';

  const defaultEdgeStroke = trueGlass
    ? darkMode
      ? 'rgba(255, 255, 255, 0.16)'
      : 'rgba(255, 255, 255, 0.55)'
    : design === 'outline'
      ? darkMode
        ? 'rgba(255, 255, 255, 0.14)'
        : '#e2e8f0'
      : design === 'skeuomorphic'
        ? darkMode
          ? 'rgba(0, 0, 0, 0.65)'
          : 'rgba(0, 0, 0, 0.22)'
        : design === 'neumorphic'
          ? 'var(--mito-nrib-shadow-dark)'
          : 'transparent';

  const resolvedEdgeStroke = darkMode
    ? (darkWaveColor || waveColor || defaultEdgeStroke)
    : (waveColor || defaultEdgeStroke);

  const showBevelHighlight = !trueGlass && (design === 'skeuomorphic' || design === 'neumorphic');
  const bevelHighlightColor =
    design === 'neumorphic'
      ? 'var(--mito-nrib-shadow-light)'
      : darkMode
        ? 'rgba(255, 255, 255, 0.14)'
        : 'rgba(255, 255, 255, 0.78)';
  const bevelOffsetY = pagePosition === 'bottom' ? 1.25 : -1.25;

  const cssVariables = {
    '--mito-nrib-active': resolvedActiveColor,
    '--mito-nrib-font': fontFamily,
    '--mito-nrib-bg': backgroundColor || '#ffffff',
    '--mito-nrib-bg-dark': darkBackgroundColor || backgroundColor || '#0d0f17',
    '--mito-nrib-text': textColor || '#64748b',
    '--mito-nrib-text-dark': darkTextColor || textColor || '#8890b8',
    '--mito-nrib-hover': hoverTextColor || '#0f172a',
    '--mito-nrib-hover-dark': darkHoverTextColor || hoverTextColor || '#e2e8f0',
    '--mito-nrib-logo-justify': logoHorizontalAlign,
    '--mito-nrib-wave-h': `${waveHeight}px`,
    ...(dropShadow ? { '--mito-nrib-custom-filter': dropShadow } : {}),
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "header";
  const themeClass = darkMode ? 'mito-nrib-dark' : '';
  const glassClass = trueGlass ? 'mito-nrib-glass' : '';
  const posClass = pagePosition === 'bottom' ? 'mito-nrib-pos-bottom' : 'mito-nrib-pos-top';
  const hasActions = Boolean(actionsNode) || rightActions.length > 0;

  const renderLogoRow = () =>
    logo ? (
      <div className="mito-nrib-logo-row">
        <NavigationRibbonBrand>
          <NavigationRibbonLink
            href={brandHref}
            linkComponent={linkComponent}
            className="mito-nrib-brand-link"
            onNavigate={(href, e) => onNavigate?.(href, -1, e)}
            style={{
              width: resolvedLogoWidth,
              height: resolvedLogoHeight,
            }}
          >
            {logo}
          </NavigationRibbonLink>
        </NavigationRibbonBrand>
      </div>
    ) : null;

  return (
    <Comp
      ref={(node: HTMLElement | null) => {
        headerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      className={`mito-nrib-header mito-nrib-design-${design} ${themeClass} ${glassClass} ${posClass} ${className}`}
      style={{
        ...cssVariables,
        transform: isVisible ? 'translateY(0)' : hiddenTransform,
        ...style,
      }}
      aria-label="Primary Navigation"
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* Outer shell is transparent and casts a true curved drop-shadow following the liquid wave */
        .mito-nrib-header {
          position: fixed;
          left: 0;
          width: 100%;
          max-width: 100%;
          z-index: 1000;
          box-sizing: border-box;
          background: transparent;
          font-family: var(--mito-nrib-font);
          color: var(--mito-nrib-text);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }
        .mito-nrib-pos-top { top: 0; }
        .mito-nrib-pos-bottom { bottom: 0; }
        .mito-nrib-dark.mito-nrib-header {
          color: var(--mito-nrib-text-dark);
        }

        /* Curved Drop Shadows per Design Variant (follow the liquid wave silhouette!) */
        .mito-nrib-design-outline {
          filter: var(--mito-nrib-custom-filter, none);
        }
        .mito-nrib-design-material.mito-nrib-pos-top {
          filter: var(--mito-nrib-custom-filter, drop-shadow(0 6px 14px rgba(0, 0, 0, 0.12)));
        }
        .mito-nrib-design-material.mito-nrib-pos-bottom {
          filter: var(--mito-nrib-custom-filter, drop-shadow(0 -6px 14px rgba(0, 0, 0, 0.12)));
        }
        .mito-nrib-dark.mito-nrib-design-material.mito-nrib-pos-top {
          filter: var(--mito-nrib-custom-filter, drop-shadow(0 8px 20px rgba(0, 0, 0, 0.48)));
        }
        .mito-nrib-dark.mito-nrib-design-material.mito-nrib-pos-bottom {
          filter: var(--mito-nrib-custom-filter, drop-shadow(0 -8px 20px rgba(0, 0, 0, 0.48)));
        }

        /* Neumorphic Dual-Light Directional Extrusion */
        .mito-nrib-design-neumorphic.mito-nrib-pos-top {
          filter: var(
            --mito-nrib-custom-filter,
            drop-shadow(var(--mito-nrib-x, 6px) var(--mito-nrib-y, 6px) var(--mito-nrib-blur, 12px) var(--mito-nrib-shadow-dark, rgba(0, 0, 0, 0.18)))
            drop-shadow(calc(var(--mito-nrib-x, 6px) * -0.45) calc(var(--mito-nrib-y, 6px) * -0.45) calc(var(--mito-nrib-blur, 12px) * 0.7) var(--mito-nrib-shadow-light, rgba(255, 255, 255, 0.8)))
          );
        }
        .mito-nrib-design-neumorphic.mito-nrib-pos-bottom {
          filter: var(
            --mito-nrib-custom-filter,
            drop-shadow(var(--mito-nrib-x, 6px) calc(var(--mito-nrib-y, 6px) * -1) var(--mito-nrib-blur, 12px) var(--mito-nrib-shadow-dark, rgba(0, 0, 0, 0.18)))
            drop-shadow(calc(var(--mito-nrib-x, 6px) * -0.45) calc(var(--mito-nrib-y, 6px) * 0.45) calc(var(--mito-nrib-blur, 12px) * 0.7) var(--mito-nrib-shadow-light, rgba(255, 255, 255, 0.8)))
          );
        }

        /* Skeuomorphic Deep Layered Hardware Shadow */
        .mito-nrib-design-skeuomorphic.mito-nrib-pos-top {
          filter: var(--mito-nrib-custom-filter, drop-shadow(0 8px 16px rgba(0, 0, 0, 0.24)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.16)));
        }
        .mito-nrib-design-skeuomorphic.mito-nrib-pos-bottom {
          filter: var(--mito-nrib-custom-filter, drop-shadow(0 -8px 16px rgba(0, 0, 0, 0.24)) drop-shadow(0 -2px 3px rgba(0, 0, 0, 0.16)));
        }
        .mito-nrib-dark.mito-nrib-design-skeuomorphic.mito-nrib-pos-top {
          filter: var(--mito-nrib-custom-filter, drop-shadow(0 10px 22px rgba(0, 0, 0, 0.62)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)));
        }
        .mito-nrib-dark.mito-nrib-design-skeuomorphic.mito-nrib-pos-bottom {
          filter: var(--mito-nrib-custom-filter, drop-shadow(0 -10px 22px rgba(0, 0, 0, 0.62)) drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.4)));
        }

        /* Clipped Liquid Surface */
        .mito-nrib-surface {
          position: relative;
          width: 100%;
          box-sizing: border-box;
          pointer-events: auto;
          background-color: var(--mito-nrib-bg);
          transition: background-color 0.3s ease;
        }
        .mito-nrib-dark .mito-nrib-surface {
          background-color: var(--mito-nrib-bg-dark);
        }
        .mito-nrib-pos-top .mito-nrib-surface {
          padding-top: env(safe-area-inset-top, 0px);
        }
        .mito-nrib-pos-bottom .mito-nrib-surface {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        /* Neumorphic Surface & Tactile Carved Track */
        .mito-nrib-design-neumorphic .mito-nrib-surface {
          background-color: var(--mito-nrib-env-bg);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, transparent 45%, rgba(0, 0, 0, 0.03) 100%);
        }
        .mito-nrib-dark.mito-nrib-design-neumorphic .mito-nrib-surface {
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, transparent 45%, rgba(0, 0, 0, 0.14) 100%);
        }
        .mito-nrib-design-neumorphic:not(.mito-nrib-glass) .mito-nrib-track {
          padding: 0.3rem;
          border-radius: 14px;
          background-color: var(--mito-nrib-env-bg);
          box-shadow: inset calc(var(--mito-nrib-x, 6px) * 0.65) calc(var(--mito-nrib-y, 6px) * 0.65) calc(var(--mito-nrib-blur, 12px) * 0.75) var(--mito-nrib-shadow-dark),
                      inset calc(var(--mito-nrib-x, 6px) * -0.65) calc(var(--mito-nrib-y, 6px) * -0.65) calc(var(--mito-nrib-blur, 12px) * 0.75) var(--mito-nrib-shadow-light);
        }
        .mito-nrib-design-neumorphic:not(.mito-nrib-glass) .mito-nrib-item {
          border-radius: 10px;
        }
        .mito-nrib-design-neumorphic:not(.mito-nrib-glass) .mito-nrib-item.mito-nrib-item-active {
          background-color: var(--mito-nrib-env-bg);
          box-shadow: calc(var(--mito-nrib-x, 6px) * 0.5) calc(var(--mito-nrib-y, 6px) * 0.5) calc(var(--mito-nrib-blur, 12px) * 0.6) var(--mito-nrib-shadow-dark),
                      calc(var(--mito-nrib-x, 6px) * -0.5) calc(var(--mito-nrib-y, 6px) * -0.5) calc(var(--mito-nrib-blur, 12px) * 0.6) var(--mito-nrib-shadow-light);
        }

        /* Skeuomorphic Surface & Tactile Beveled Hardware Track */
        .mito-nrib-design-skeuomorphic .mito-nrib-surface {
          background-color: var(--mito-nrib-env-bg);
          background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.42) 0%,
            rgba(255, 255, 255, 0.12) 18%,
            rgba(0, 0, 0, 0.02) 68%,
            rgba(0, 0, 0, 0.12) 100%
          );
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
        }
        .mito-nrib-dark.mito-nrib-design-skeuomorphic .mito-nrib-surface {
          background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.14) 0%,
            rgba(255, 255, 255, 0.04) 22%,
            rgba(0, 0, 0, 0.18) 72%,
            rgba(0, 0, 0, 0.42) 100%
          );
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }
        .mito-nrib-design-skeuomorphic:not(.mito-nrib-glass) .mito-nrib-track {
          padding: 0.25rem;
          border-radius: 12px;
          background-color: rgba(0, 0, 0, 0.055);
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.14), 0 1px 0 rgba(255, 255, 255, 0.72);
        }
        .mito-nrib-dark.mito-nrib-design-skeuomorphic:not(.mito-nrib-glass) .mito-nrib-track {
          background-color: rgba(0, 0, 0, 0.32);
          border: 1px solid rgba(0, 0, 0, 0.55);
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .mito-nrib-design-skeuomorphic:not(.mito-nrib-glass) .mito-nrib-item {
          border-radius: 9px;
          border: 1px solid transparent;
        }
        .mito-nrib-design-skeuomorphic:not(.mito-nrib-glass) .mito-nrib-item.mito-nrib-item-active {
          background-color: var(--mito-nrib-env-bg);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.08) 55%, rgba(0, 0, 0, 0.06) 100%);
          border: 1px solid rgba(0, 0, 0, 0.16);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 4px rgba(0, 0, 0, 0.14);
        }
        .mito-nrib-dark.mito-nrib-design-skeuomorphic:not(.mito-nrib-glass) .mito-nrib-item.mito-nrib-item-active {
          background-color: var(--mito-nrib-env-bg);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 55%, rgba(0, 0, 0, 0.25) 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 6px rgba(0, 0, 0, 0.45);
        }

        /* TrueGlass Surface (frosted backdrop clipped to the exact liquid wave!) */
        .mito-nrib-glass .mito-nrib-surface {
          backdrop-filter: blur(24px) saturate(1.7);
          -webkit-backdrop-filter: blur(24px) saturate(1.7);
        }
        .mito-nrib-design-outline.mito-nrib-glass .mito-nrib-surface,
        .mito-nrib-design-material.mito-nrib-glass .mito-nrib-surface {
          background-color: rgba(255, 255, 255, 0.56);
        }
        .mito-nrib-dark.mito-nrib-design-outline.mito-nrib-glass .mito-nrib-surface,
        .mito-nrib-dark.mito-nrib-design-material.mito-nrib-glass .mito-nrib-surface {
          background-color: rgba(13, 15, 23, 0.62);
        }
        .mito-nrib-design-neumorphic.mito-nrib-glass .mito-nrib-surface {
          background-color: rgba(255, 255, 255, 0.22);
        }
        .mito-nrib-dark.mito-nrib-design-neumorphic.mito-nrib-glass .mito-nrib-surface {
          background-color: rgba(13, 15, 23, 0.44);
        }
        .mito-nrib-design-skeuomorphic.mito-nrib-glass .mito-nrib-surface {
          background-color: rgba(255, 255, 255, 0.28);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0.06) 100%);
        }
        .mito-nrib-dark.mito-nrib-design-skeuomorphic.mito-nrib-glass .mito-nrib-surface {
          background-color: rgba(13, 15, 23, 0.46);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.24) 100%);
        }

        /* Curved Wave Edge Stroke Overlay */
        .mito-nrib-stroke-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 8;
          overflow: visible;
        }

        /* Hidden ClipPath Defs */
        .mito-nrib-clip-defs {
          position: absolute;
          width: 0;
          height: 0;
          pointer-events: none;
          overflow: hidden;
        }

        /* ------------------------- */
        /* INNER LAYOUT & LOGO ROW   */
        /* ------------------------- */
        .mito-nrib-inner {
          position: relative;
          z-index: 6;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0.7rem max(2rem, env(safe-area-inset-left, 0px));
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          box-sizing: border-box;
        }
        .mito-nrib-pos-top .mito-nrib-inner {
          padding-bottom: calc(var(--mito-nrib-wave-h, 18px) + 0.65rem);
        }
        .mito-nrib-pos-bottom .mito-nrib-inner {
          padding-top: calc(var(--mito-nrib-wave-h, 18px) + 0.65rem);
        }

        .mito-nrib-logo-row {
          display: flex;
          align-items: center;
          justify-content: var(--mito-nrib-logo-justify, flex-start);
          width: 100%;
        }

        .mito-nrib-brand {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .mito-nrib-brand-link {
          text-decoration: none;
          color: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.15rem;
          letter-spacing: 0.08em;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        .mito-nrib-brand-link img,
        .mito-nrib-brand-link svg {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .mito-nrib-main-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          width: 100%;
          min-width: 0;
        }

        /* ------------------------- */
        /* NAVIGATION TRACK & ITEMS  */
        /* ------------------------- */
        .mito-nrib-track-scroll {
          flex: 1 1 auto;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
          -ms-overflow-style: none;
          display: flex;
          justify-content: flex-start;
        }
        .mito-nrib-track-scroll::-webkit-scrollbar {
          display: none;
        }

        .mito-nrib-track {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-inline: auto;
          flex-shrink: 0;
          transition: box-shadow 0.3s ease, background-color 0.3s ease;
        }

        .mito-nrib-item {
          position: relative;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          white-space: nowrap;
          color: var(--mito-nrib-text);
          padding: 0.55rem 1.25rem;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
        }
        .mito-nrib-dark .mito-nrib-item {
          color: var(--mito-nrib-text-dark);
        }

        .mito-nrib-item:not(.mito-nrib-item-active):hover {
          color: var(--mito-nrib-hover);
        }
        .mito-nrib-dark .mito-nrib-item:not(.mito-nrib-item-active):hover {
          color: var(--mito-nrib-hover-dark);
        }

        .mito-nrib-item.mito-nrib-item-active {
          color: var(--mito-nrib-active);
          font-weight: 600;
        }
        .mito-nrib-item:focus-visible {
          outline: 2px solid var(--mito-nrib-active);
          outline-offset: 2px;
        }

        /* Actions Cluster */
        .mito-nrib-actions {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        /* ------------------------- */
        /* RESPONSIVE BREAKPOINTS    */
        /* ------------------------- */
        @media (max-width: 900px) {
          .mito-nrib-inner {
            padding-inline: max(1.25rem, env(safe-area-inset-left, 0px));
          }
          .mito-nrib-item {
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
          }
        }

        @media (max-width: 640px) {
          .mito-nrib-inner {
            padding-inline: max(0.85rem, env(safe-area-inset-left, 0px));
            gap: 0.4rem;
          }
          .mito-nrib-main-row {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .mito-nrib-track-scroll {
            flex: 1 1 100%;
            width: 100%;
          }
          .mito-nrib-track {
            gap: 0.2rem;
          }
          .mito-nrib-item {
            font-size: 0.85rem;
            padding: 0.5rem 0.85rem;
            min-height: 40px;
            box-sizing: border-box;
          }
          .mito-nrib-actions {
            width: 100%;
            justify-content: flex-end;
            gap: 0.5rem;
          }
        }
      `}} />

      <svg className="mito-nrib-clip-defs" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path ref={clipPathRef} />
          </clipPath>
        </defs>
      </svg>

      <div
        ref={surfaceRef}
        className="mito-nrib-surface"
        style={{
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`,
        }}
      >
        <div className="mito-nrib-inner">
          {isLogoAbove && renderLogoRow()}

          <div className="mito-nrib-main-row">
            <div ref={scrollContainerRef} className="mito-nrib-track-scroll">
              <nav className="mito-nrib-track" aria-label="Section Navigation">
                {safeNavItems.map((item, index) => {
                  const isActive = index === resolvedActiveIndex;
                  return (
                    <NavigationRibbonLink
                      key={`${item.href}-${index}`}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      href={item.href}
                      linkComponent={linkComponent}
                      isActive={isActive}
                      className="mito-nrib-item"
                      onNavigate={(href, e) => handleItemClick(href, index, e)}
                    >
                      {item.icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{item.icon}</span>}
                      <span>{item.label}</span>
                    </NavigationRibbonLink>
                  );
                })}
              </nav>
            </div>

            {children}

            {hasActions && (
              <NavigationRibbonActions>
                {actionsNode}
                {rightActions.map((action, i) => (
                  <React.Fragment key={i}>{action}</React.Fragment>
                ))}
              </NavigationRibbonActions>
            )}
          </div>

          {!isLogoAbove && renderLogoRow()}
        </div>
      </div>

      {(resolvedEdgeStroke !== 'transparent' || showBevelHighlight) && (
        <svg ref={strokeSvgRef} className="mito-nrib-stroke-svg" aria-hidden="true">
          {showBevelHighlight && (
            <path
              ref={bevelHighlightPathRef}
              fill="none"
              stroke={bevelHighlightColor}
              strokeWidth="1.25"
              strokeLinecap="round"
              transform={`translate(0, ${bevelOffsetY})`}
            />
          )}
          {resolvedEdgeStroke !== 'transparent' && (
            <path
              ref={strokePathRef}
              fill="none"
              stroke={resolvedEdgeStroke}
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          )}
        </svg>
      )}
    </Comp>
  );
});

NavigationRibbon.displayName = 'NavigationRibbon';


export const NavigationRibbonBrand = React.forwardRef<HTMLDivElement, NavigationRibbonSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-nrib-brand ${className}`} {...props} />;
});
NavigationRibbonBrand.displayName = 'NavigationRibbonBrand';

export const NavigationRibbonActions = React.forwardRef<HTMLDivElement, NavigationRibbonSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-nrib-actions ${className}`} {...props} />;
});
NavigationRibbonActions.displayName = 'NavigationRibbonActions';