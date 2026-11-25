"use client";

import React, { useRef, useState, useEffect, useCallback, type JSX, type ReactNode } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";

/**
 * @type NavigationBarDesignVariant
 * @description Strong string literal union representing the supported enterprise architectural design variants.
 */
export type NavigationBarDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @type NavigationBarVisibility
 * @description Dictates how the navigation bar responds to vertical page scrolling.
 * - `'sticky'`: Remains persistently visible at the configured `pagePosition`.
 * - `'auto-hide'`: Slides out of view when scrolling down and reappears when scrolling up.
 * - `'auto-hide-reappear'`: Slides out of view while scrolling down and automatically reappears once scrolling stops.
 */
export type NavigationBarVisibility = 'sticky' | 'auto-hide' | 'auto-hide-reappear';

/**
 * @type NavigationBarLogoPosition
 * @description Controls the vertical row (above or below the navigation pill track) and horizontal alignment of the brand logo.
 */
export type NavigationBarLogoPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * @type NavigationBarPagePosition
 * @description Controls whether the navigation bar is anchored to the top or bottom edge of the viewport.
 */
export type NavigationBarPagePosition = 'top' | 'bottom';

/**
 * @type NavigationBarShape
 * @description Controls the corner geometry of the navigation track, items, and sliding active indicator.
 * - `'pill'`: Fully rounded capsule geometry (`9999px`).
 * - `'rectangle'`: Crisp rectangular geometry (`4px`).
 */
export type NavigationBarShape = 'pill' | 'rectangle';

/**
 * @interface NavigationBarItem
 * @description Represents a single interactive destination inside the sliding-indicator navigation bar.
 */
export interface NavigationBarItem {
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
 * @interface NavigationBarProps
 * @description Strongly-typed attributes configuring the NavigationBar's sliding indicator, 9-item cap,
 * router-agnostic links, 6-position logo placement, top/bottom viewport docking, scroll visibility,
 * multi-variant 3D surface adaptation, glassmorphism, and granular light/dark color overrides.
 * Every prop is explicitly documented for optimal downstream MCP context-injection.
 */
export interface NavigationBarProps extends React.HTMLAttributes<HTMLElement> {
  // --- NAVIGATION & ROUTING ---
  /** Array of top-level `NavigationBarItem` definitions. Strictly capped at 9 items to enforce clean enterprise UI density. */
  navItems: NavigationBarItem[];
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
  logoPosition?: NavigationBarLogoPosition;
  /** Destination URL or route path triggered when clicking the brand logo. @default '/' */
  brandHref?: string;

  // --- COMPOSITE ACTION SLOTS ---
  /** Single ReactNode slot for injecting custom social action buttons, search triggers, or login/user account buttons. */
  actionsNode?: ReactNode;
  /** Array of ReactNodes (e.g., `ActionButton` or `Button` instances) rendered in the trailing actions cluster. */
  rightActions?: ReactNode[];

  // --- VIEWPORT DOCKING & SCROLL VISIBILITY ---
  /** Anchors the navigation bar to either the `'top'` or `'bottom'` of the viewport, automatically inverting scroll-hide animations. @default 'top' */
  pagePosition?: NavigationBarPagePosition;
  /** Controls the menu's visibility behavior relative to page scrolling (`'sticky'`, `'auto-hide'`, or `'auto-hide-reappear'`). @default 'auto-hide' */
  menuVisibility?: NavigationBarVisibility;
  /** Delay in milliseconds after scrolling stops before the menu reappears when `menuVisibility="auto-hide-reappear"`. @default 450 */
  scrollReappearDelay?: number;

  // --- SLIDING INDICATOR & AESTHETICS ---
  /** Uses CSS `mix-blend-mode: difference` on the sliding indicator for the signature high-contrast inversion effect. Set to `false` to render a solid `activeColor` indicator instead. Ignored on the `outline` variant, which always renders a true stroked outline pill. @default true */
  blendIndicator?: boolean;
  /** Controls the corner radius geometry of the navigation track, items, and sliding indicator (`'pill'` or `'rectangle'`). @default 'pill' */
  pillShape?: NavigationBarShape;
  /** The architectural design system variation dictating the bar's surface, borders, and depth. @default 'outline' */
  design?: NavigationBarDesignVariant;
  /** Toggles an enterprise-grade, hyper-realistic glossy frosted glassmorphism aesthetic across the bar and track. @default false */
  trueGlass?: boolean;
  /** Explicit CSS `box-shadow` string to override the default drop shadow of the active design variant. */
  dropShadow?: string;
  /** Custom CSS font-family string applied globally to the navigation bar typography. @default '"Bodoni Moda Variable", -apple-system, sans-serif' */
  fontFamily?: string;
  /** Force dark mode rendering independent of the global UI context or OS preference. @default false */
  darkMode?: boolean;
  /** Dynamic light/dark mode brand color mapping used as fallback accent tokens. */
  darkModeColors?: { light: string; dark: string };
  /** Explicit active/accent color override applied to the sliding indicator, active item states, and focus rings. */
  activeColor?: string;
  /** Explicit text color override applied to the currently active navigation item. Works best with `blendIndicator={false}` or `design="outline"` for exact color accuracy. */
  activeTextColor?: string;
  /** Explicit container background color override for light mode contexts. */
  backgroundColor?: string;
  /** Explicit container background color override specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Explicit primary text color override for light mode contexts. */
  textColor?: string;
  /** Explicit primary text color override specifically for dark mode contexts. */
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
 * @interface NavigationBarSubComponentProps
 * @description Shared props for exported composite sub-components enabling deep layout extensibility.
 */
export interface NavigationBarSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;
}

/**
 * @interface NavigationBarLinkProps
 * @description Props for the router-agnostic `NavigationBarLink` sub-component.
 */
export interface NavigationBarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
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
 * @component NavigationBarLink
 * @description Router-agnostic link primitive compatible with native `<a>` tags, React Router (`to`), or Next.js (`href`).
 */
export const NavigationBarLink = React.forwardRef<HTMLAnchorElement, NavigationBarLinkProps>(({
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
        className={`${className} ${isActive ? 'mito-nbar-item-active' : ''}`.trim()}
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
      className={`${className} ${isActive ? 'mito-nbar-item-active' : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
});
NavigationBarLink.displayName = 'NavigationBarLink';

const MAX_NAV_ITEMS = 9;

/**
 * @component NavigationBar
 * @description Enterprise-grade, SSR-safe, mobile-ready sliding-indicator navigation bar.
 * Features a smoothly interpolated active pill/rectangular indicator, true outline pill styling for the outline variant,
 * strict 9-item UI cap, 6-position logo layout, top/bottom viewport docking with iOS safe-area insets,
 * configurable scroll visibility, ambient-aware 3D variants, and glossy `trueGlass` styling.
 */
export const NavigationBar = React.forwardRef<HTMLElement, NavigationBarProps>(({
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
  blendIndicator = true,
  pillShape = 'pill',
  design = 'outline',
  trueGlass = false,
  dropShadow,
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
  darkMode = false,
  darkModeColors,
  activeColor,
  activeTextColor,
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
  const headerRef = useRef<HTMLElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Enforce clean UI ceiling of 9 top-level items
  const safeNavItems = navItems.slice(0, MAX_NAV_ITEMS);

  useEffect(() => {
    const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
    if (nodeEnv !== 'production' && navItems.length > MAX_NAV_ITEMS) {
      console.warn(
        `[Mito UI - NavigationBar] Received ${navItems.length} navItems. Capping at ${MAX_NAV_ITEMS} to preserve clean navigation ergonomics.`
      );
    }
  }, [navItems.length]);

  // Resolve initial active index from prop or item.isActive flag
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

  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });
  const [isVisible, setIsVisible] = useState(true);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});

  const lastScrollY = useRef(0);
  const scrollStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const globalContext = useGlobalUIContext();
  const resolvedActiveColor =
    activeColor ||
    (darkMode
      ? (darkModeColors?.dark || darkModeColors?.light || globalContext.themeColors?.dark || globalContext.themeColors?.light || '#ffffff')
      : (darkModeColors?.light || globalContext.themeColors?.light || '#111827'));

  const resolvedBaseBg = darkMode
    ? (darkBackgroundColor || backgroundColor || '#0f0f12')
    : (backgroundColor || '#ffffff');

  // Measure indicator and smoothly center active item inside horizontal mobile scroll container
  const updateIndicator = useCallback((shouldCenterInView = false) => {
    const activeEl = itemRefs.current[resolvedActiveIndex];
    if (!activeEl) {
      setIndicatorStyle((prev) => ({ ...prev, ready: false }));
      return;
    }

    setIndicatorStyle({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth,
      ready: true,
    });

    if (shouldCenterInView && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeEl.offsetLeft - (container.clientWidth - activeEl.offsetWidth) / 2;
        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth',
        });
      }
    }
  }, [resolvedActiveIndex]);

  useEffect(() => {
    updateIndicator(true);

    if (typeof window === 'undefined') return;
    const handleResize = () => updateIndicator(false);
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      resizeObserver = new ResizeObserver(() => updateIndicator(false));
      resizeObserver.observe(trackRef.current);
    }

    // Re-measure once custom web fonts finish loading
    let cancelled = false;
    if (typeof document !== 'undefined' && 'fonts' in document && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) updateIndicator(false);
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateIndicator, safeNavItems.length, fontFamily]);

  // Scroll visibility engine (iOS bounce-safe, respects both top and bottom pagePosition)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (menuVisibility === 'sticky') {
        setIsVisible(true);
        return;
      }

      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - lastScrollY.current;

      // Ignore sub-6px touch jitter
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

  // Ambient-aware Neumorphic & Skeuomorphic surface calculation
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
      const blur = elevation * 2;
      const shadowDark = adjustColor(envBg, -15 * neuIntensity);
      const shadowLight = adjustColor(envBg, 15 * neuIntensity);

      setNeuVars({
        '--mito-nbar-env-bg': envBg,
        '--mito-nbar-shadow-dark': shadowDark,
        '--mito-nbar-shadow-light': shadowLight,
        '--mito-nbar-x': `${x}px`,
        '--mito-nbar-y': `${y}px`,
        '--mito-nbar-dist': `${elevation}px`,
        '--mito-nbar-blur': `${blur}px`,
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
  const resolvedPillRadius = pillShape === 'rectangle' ? '4px' : '9999px';

  const isLogoAbove = logoPosition.startsWith('top-');
  const logoHorizontalAlign = logoPosition.endsWith('center')
    ? 'center'
    : logoPosition.endsWith('right')
      ? 'flex-end'
      : 'flex-start';

  const hiddenTransform = pagePosition === 'bottom' ? 'translateY(110%)' : 'translateY(-110%)';

  const cssVariables = {
    '--mito-nbar-active': resolvedActiveColor,
    ...(activeTextColor ? { '--mito-nbar-active-text': activeTextColor } : {}),
    '--mito-nbar-radius': resolvedPillRadius,
    '--mito-nbar-font': fontFamily,
    '--mito-nbar-bg': backgroundColor || '#ffffff',
    '--mito-nbar-bg-dark': darkBackgroundColor || backgroundColor || '#0f0f12',
    '--mito-nbar-text': textColor || '#111827',
    '--mito-nbar-text-dark': darkTextColor || textColor || '#f9fafb',
    '--mito-nbar-hover': hoverTextColor || (darkMode ? '#ffffff' : resolvedActiveColor),
    '--mito-nbar-hover-dark': darkHoverTextColor || hoverTextColor || '#ffffff',
    '--mito-nbar-border': darkMode ? 'rgba(255, 255, 255, 0.12)' : '#e5e7eb',
    '--mito-nbar-logo-justify': logoHorizontalAlign,
    ...(dropShadow ? { '--mito-nbar-custom-shadow': dropShadow } : {}),
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "header";
  const themeClass = darkMode ? 'mito-nbar-dark' : '';
  const glassClass = trueGlass ? 'mito-nbar-glass' : '';
  const posClass = pagePosition === 'bottom' ? 'mito-nbar-pos-bottom' : 'mito-nbar-pos-top';
  const hasActions = Boolean(actionsNode) || rightActions.length > 0;

  const renderLogoRow = () =>
    logo ? (
      <div className="mito-nbar-logo-row">
        <NavigationBarBrand>
          <NavigationBarLink
            href={brandHref}
            linkComponent={linkComponent}
            className="mito-nbar-brand-link"
            onNavigate={(href, e) => onNavigate?.(href, -1, e)}
            style={{
              width: resolvedLogoWidth,
              height: resolvedLogoHeight,
            }}
          >
            {logo}
          </NavigationBarLink>
        </NavigationBarBrand>
      </div>
    ) : null;

  return (
    <Comp
      ref={(node: HTMLElement | null) => {
        headerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      className={`mito-nbar-header mito-nbar-design-${design} ${themeClass} ${glassClass} ${posClass} ${className}`}
      style={{
        ...cssVariables,
        transform: isVisible ? 'translateY(0)' : hiddenTransform,
        ...style,
      }}
      aria-label="Primary Navigation"
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-nbar-header {
          position: fixed;
          left: 0;
          width: 100%;
          max-width: 100%;
          z-index: 1000;
          box-sizing: border-box;
          font-family: var(--mito-nbar-font);
          color: var(--mito-nbar-text);
          background-color: var(--mito-nbar-bg);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .mito-nbar-pos-top {
          top: 0;
          padding-top: env(safe-area-inset-top, 0px);
        }
        .mito-nbar-pos-bottom {
          bottom: 0;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .mito-nbar-dark.mito-nbar-header {
          color: var(--mito-nbar-text-dark);
          background-color: var(--mito-nbar-bg-dark);
        }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        .mito-nbar-design-outline.mito-nbar-pos-top {
          border-bottom: 1px solid var(--mito-nbar-border);
          box-shadow: var(--mito-nbar-custom-shadow, none);
        }
        .mito-nbar-design-outline.mito-nbar-pos-bottom {
          border-top: 1px solid var(--mito-nbar-border);
          box-shadow: var(--mito-nbar-custom-shadow, none);
        }

        .mito-nbar-design-material.mito-nbar-pos-top {
          box-shadow: var(--mito-nbar-custom-shadow, 0 4px 14px rgba(0, 0, 0, 0.08));
        }
        .mito-nbar-design-material.mito-nbar-pos-bottom {
          box-shadow: var(--mito-nbar-custom-shadow, 0 -4px 14px rgba(0, 0, 0, 0.08));
        }
        .mito-nbar-dark.mito-nbar-design-material.mito-nbar-pos-top {
          box-shadow: var(--mito-nbar-custom-shadow, 0 6px 20px rgba(0, 0, 0, 0.5));
        }
        .mito-nbar-dark.mito-nbar-design-material.mito-nbar-pos-bottom {
          box-shadow: var(--mito-nbar-custom-shadow, 0 -6px 20px rgba(0, 0, 0, 0.5));
        }

        .mito-nbar-design-neumorphic {
          background-color: var(--mito-nbar-env-bg);
          border: none;
        }
        .mito-nbar-design-neumorphic.mito-nbar-pos-top {
          box-shadow: var(--mito-nbar-custom-shadow, 0 var(--mito-nbar-dist) var(--mito-nbar-blur) var(--mito-nbar-shadow-dark));
        }
        .mito-nbar-design-neumorphic.mito-nbar-pos-bottom {
          box-shadow: var(--mito-nbar-custom-shadow, 0 calc(var(--mito-nbar-dist) * -1) var(--mito-nbar-blur) var(--mito-nbar-shadow-dark));
        }

        .mito-nbar-design-skeuomorphic {
          background-color: var(--mito-nbar-env-bg);
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 0%, rgba(0, 0, 0, 0.04) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.35);
          border-bottom: 1px solid rgba(0, 0, 0, 0.16);
          box-shadow: var(--mito-nbar-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 6px 16px rgba(0, 0, 0, 0.18));
        }
        .mito-nbar-dark.mito-nbar-design-skeuomorphic {
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 0%, rgba(0, 0, 0, 0.28) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.45);
          box-shadow: var(--mito-nbar-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 20px rgba(0, 0, 0, 0.55));
        }

        /* ------------------------- */
        /* TRUEGLASS AESTHETIC       */
        /* ------------------------- */
        .mito-nbar-glass {
          backdrop-filter: blur(24px) saturate(1.65);
          -webkit-backdrop-filter: blur(24px) saturate(1.65);
        }

        .mito-nbar-design-outline.mito-nbar-glass,
        .mito-nbar-design-material.mito-nbar-glass {
          background-color: rgba(255, 255, 255, 0.52);
          border-color: rgba(255, 255, 255, 0.45);
          box-shadow: var(--mito-nbar-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 24px rgba(0, 0, 0, 0.08));
        }
        .mito-nbar-dark.mito-nbar-design-outline.mito-nbar-glass,
        .mito-nbar-dark.mito-nbar-design-material.mito-nbar-glass {
          background-color: rgba(15, 15, 18, 0.58);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: var(--mito-nbar-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.45));
        }

        .mito-nbar-design-neumorphic.mito-nbar-glass {
          background-color: rgba(255, 255, 255, 0.16);
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
        }
        .mito-nbar-dark.mito-nbar-design-neumorphic.mito-nbar-glass {
          background-color: rgba(15, 15, 18, 0.38);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mito-nbar-design-skeuomorphic.mito-nbar-glass {
          background-color: rgba(255, 255, 255, 0.26);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.06) 100%);
          border-color: rgba(255, 255, 255, 0.45);
        }
        .mito-nbar-dark.mito-nbar-design-skeuomorphic.mito-nbar-glass {
          background-color: rgba(0, 0, 0, 0.36);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.22) 100%);
          border-color: rgba(255, 255, 255, 0.12);
        }

        /* ------------------------- */
        /* INNER LAYOUT & LOGO ROW   */
        /* ------------------------- */
        .mito-nbar-inner {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0.75rem max(2rem, env(safe-area-inset-left, 0px));
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          box-sizing: border-box;
        }

        .mito-nbar-logo-row {
          display: flex;
          align-items: center;
          justify-content: var(--mito-nbar-logo-justify, flex-start);
          width: 100%;
        }

        .mito-nbar-brand {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .mito-nbar-brand-link {
          text-decoration: none;
          color: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        .mito-nbar-brand-link img,
        .mito-nbar-brand-link svg {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .mito-nbar-main-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          width: 100%;
          min-width: 0;
        }

        /* ------------------------- */
        /* SLIDING PILL TRACK        */
        /* ------------------------- */
        .mito-nbar-track-scroll {
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
        .mito-nbar-track-scroll::-webkit-scrollbar {
          display: none;
        }

        .mito-nbar-track {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem;
          margin-inline: auto;
          border-radius: var(--mito-nbar-radius, 9999px);
          isolation: isolate;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .mito-nbar-design-neumorphic .mito-nbar-track {
          background-color: var(--mito-nbar-env-bg);
          box-shadow: inset var(--mito-nbar-x) var(--mito-nbar-y) var(--mito-nbar-blur) var(--mito-nbar-shadow-dark),
                      inset calc(var(--mito-nbar-x) * -1) calc(var(--mito-nbar-y) * -1) var(--mito-nbar-blur) var(--mito-nbar-shadow-light);
        }

        .mito-nbar-item {
          position: relative;
          z-index: 1;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.975rem;
          white-space: nowrap;
          color: var(--mito-nbar-text);
          padding: 0.6em 1.15em;
          border-radius: var(--mito-nbar-radius, 9999px);
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: color 0.25s ease, text-shadow 0.25s ease-out;
        }
        .mito-nbar-dark .mito-nbar-item {
          color: var(--mito-nbar-text-dark);
        }

        .mito-nbar-item:not(.mito-nbar-item-active):hover {
          color: var(--mito-nbar-hover);
          text-shadow: 0 0 0.08em currentColor;
        }
        .mito-nbar-dark .mito-nbar-item:not(.mito-nbar-item-active):hover {
          color: var(--mito-nbar-hover-dark);
        }
        .mito-nbar-item:focus-visible {
          outline: 2px solid var(--mito-nbar-active);
          outline-offset: 2px;
        }

        /* Active item text color override */
        .mito-nbar-item.mito-nbar-item-active {
          color: var(--mito-nbar-active-text, var(--mito-nbar-text));
        }
        .mito-nbar-dark .mito-nbar-item.mito-nbar-item-active {
          color: var(--mito-nbar-active-text, var(--mito-nbar-text-dark));
        }

        /* Solid-indicator text contrast when blendIndicator=false */
        .mito-nbar-solid-indicator .mito-nbar-item.mito-nbar-item-active {
          color: var(--mito-nbar-active-text, #ffffff);
        }

        /* The Sliding Indicator */
        .mito-nbar-indicator {
          position: absolute;
          top: 0.25rem;
          bottom: 0.25rem;
          border-radius: var(--mito-nbar-radius, 9999px);
          background-color: var(--mito-nbar-active);
          box-sizing: border-box;
          pointer-events: none;
          transition: left 0.45s cubic-bezier(0.22, 1, 0.36, 1), width 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease, border-color 0.25s ease;
        }
        .mito-nbar-blend-indicator .mito-nbar-indicator {
          z-index: 2;
          mix-blend-mode: difference;
          background-color: #ffffff;
        }
        .mito-nbar-solid-indicator .mito-nbar-indicator {
          z-index: 0;
        }

        /* ------------------------- */
        /* TRUE OUTLINE PILL VARIANT */
        /* ------------------------- */
        .mito-nbar-design-outline .mito-nbar-indicator {
          background-color: transparent;
          border: 1.5px solid var(--mito-nbar-active);
          mix-blend-mode: normal;
          z-index: 0;
        }
        .mito-nbar-design-outline .mito-nbar-item.mito-nbar-item-active,
        .mito-nbar-design-outline.mito-nbar-dark .mito-nbar-item.mito-nbar-item-active,
        .mito-nbar-design-outline .mito-nbar-solid-indicator .mito-nbar-item.mito-nbar-item-active {
          color: var(--mito-nbar-active-text, var(--mito-nbar-active));
        }
        .mito-nbar-design-outline.mito-nbar-glass .mito-nbar-indicator {
          background-color: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .mito-nbar-design-outline.mito-nbar-dark.mito-nbar-glass .mito-nbar-indicator {
          background-color: rgba(255, 255, 255, 0.06);
        }

        /* Actions Cluster */
        .mito-nbar-actions {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        /* ------------------------- */
        /* RESPONSIVE BREAKPOINTS    */
        /* ------------------------- */
        @media (max-width: 900px) {
          .mito-nbar-inner {
            padding: 0.65rem max(1.25rem, env(safe-area-inset-left, 0px));
          }
          .mito-nbar-item {
            font-size: 0.875rem;
            padding: 0.55em 0.95em;
          }
        }

        @media (max-width: 640px) {
          .mito-nbar-inner {
            padding: 0.55rem max(0.85rem, env(safe-area-inset-left, 0px));
            gap: 0.5rem;
          }
          .mito-nbar-main-row {
            flex-wrap: wrap;
            gap: 0.55rem;
          }
          .mito-nbar-track-scroll {
            flex: 1 1 100%;
            width: 100%;
          }
          .mito-nbar-track {
            gap: 0.25rem;
          }
          .mito-nbar-item {
            font-size: 0.85rem;
            padding: 0.55em 0.85em;
            min-height: 40px;
            box-sizing: border-box;
          }
          .mito-nbar-actions {
            width: 100%;
            justify-content: flex-end;
            gap: 0.5rem;
          }
        }
      `}} />

      <div className="mito-nbar-inner">
        {isLogoAbove && renderLogoRow()}

        <div className="mito-nbar-main-row">
          <div ref={scrollContainerRef} className="mito-nbar-track-scroll">
            <nav
              ref={trackRef}
              className={`mito-nbar-track ${blendIndicator ? 'mito-nbar-blend-indicator' : 'mito-nbar-solid-indicator'}`}
              aria-label="Section Navigation"
            >
              {safeNavItems.map((item, index) => {
                const isActive = index === resolvedActiveIndex;
                return (
                  <NavigationBarLink
                    key={`${item.href}-${index}`}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    href={item.href}
                    linkComponent={linkComponent}
                    isActive={isActive}
                    className="mito-nbar-item"
                    onNavigate={(href, e) => handleItemClick(href, index, e)}
                  >
                    {item.icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{item.icon}</span>}
                    <span>{item.label}</span>
                  </NavigationBarLink>
                );
              })}

              <div
                className="mito-nbar-indicator"
                aria-hidden="true"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.ready ? 1 : 0,
                }}
              />
            </nav>
          </div>

          {children}

          {hasActions && (
            <NavigationBarActions>
              {actionsNode}
              {rightActions.map((action, i) => (
                <React.Fragment key={i}>{action}</React.Fragment>
              ))}
            </NavigationBarActions>
          )}
        </div>

        {!isLogoAbove && renderLogoRow()}
      </div>
    </Comp>
  );
});

NavigationBar.displayName = 'NavigationBar';


export const NavigationBarBrand = React.forwardRef<HTMLDivElement, NavigationBarSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-nbar-brand ${className}`} {...props} />;
});
NavigationBarBrand.displayName = 'NavigationBarBrand';

export const NavigationBarActions = React.forwardRef<HTMLDivElement, NavigationBarSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-nbar-actions ${className}`} {...props} />;
});
NavigationBarActions.displayName = 'NavigationBarActions';