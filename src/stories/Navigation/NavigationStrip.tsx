"use client";

import React, { useRef, useState, useEffect, type JSX, type ReactNode } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";

/**
 * @type NavigationStripDesignVariant
 * @description Strong string literal union representing the supported enterprise architectural design variants.
 */
export type NavigationStripDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @type NavigationStripVisibility
 * @description Dictates how the navigation strip responds to vertical page scrolling.
 * - `'sticky'`: Remains persistently visible at the configured `pagePosition`.
 * - `'auto-hide'`: Slides out of view when scrolling down and reappears when scrolling up.
 * - `'auto-hide-reappear'`: Slides out of view while scrolling down and automatically reappears once scrolling stops.
 */
export type NavigationStripVisibility = 'sticky' | 'auto-hide' | 'auto-hide-reappear';

/**
 * @type NavigationStripLogoPosition
 * @description Controls the vertical row (above or below the navigation strip) and horizontal alignment of the brand logo.
 */
export type NavigationStripLogoPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * @type NavigationStripPagePosition
 * @description Controls whether the navigation strip is anchored to the top or bottom edge of the viewport.
 */
export type NavigationStripPagePosition = 'top' | 'bottom';

/**
 * @interface NavigationStripDropdownItem
 * @description Represents a single interactive link or nested sub-dropdown trigger inside a dropdown group.
 */
export interface NavigationStripDropdownItem {
  /** The primary display label for the dropdown link or nested sub-menu trigger. */
  title: string;
  /** Optional secondary text providing concise context for the link. */
  description?: string;
  /** Optional ReactNode icon rendered beside the dropdown link text. */
  icon?: ReactNode;
  /** Optional destination URL or client-side routing path. Can be omitted when `subItems` is provided. */
  href?: string;
  /** Optional flag indicating whether this dropdown link represents the currently active route. */
  isActive?: boolean;
  /** Optional nested array of `NavigationStripDropdownItem` entries rendered as a flyout sub-menu on desktop and an indented accordion on mobile. */
  subItems?: NavigationStripDropdownItem[];
}

/**
 * @interface NavigationStripDropdownGroup
 * @description Logical grouping of dropdown items, rendered as side-by-side columns on desktop.
 */
export interface NavigationStripDropdownGroup {
  /** Optional uppercase header title for this group of links. */
  title?: string;
  /** Array of `NavigationStripDropdownItem` entries belonging to this group. */
  items: NavigationStripDropdownItem[];
}

/**
 * @interface NavigationStripItem
 * @description Top-level navigation item configuration supporting either a direct link or a multi-group dropdown with nested sub-menus.
 */
export interface NavigationStripItem {
  /** The top-level menu label displayed in the navigation strip. */
  label: string;
  /** Optional destination URL or route path when the item is a direct link rather than a dropdown trigger. */
  href?: string;
  /** Optional ReactNode icon rendered immediately before the top-level label. */
  icon?: ReactNode;
  /** Optional flag marking this top-level item as the currently active route. */
  isActive?: boolean;
  /** Optional array of grouped links displayed inside an interactive dropdown panel. */
  dropdownGroups?: NavigationStripDropdownGroup[];
}

/**
 * @interface NavigationStripProps
 * @description Strongly-typed attributes configuring the NavigationStrip's animated underline effect,
 * sibling-dimming hover focus, enterprise click-pulse feedback, 9-item cap, nested dropdowns, router-agnostic links,
 * 6-position logo placement, top/bottom viewport docking, scroll visibility, multi-variant 3D adaptation,
 * glassmorphism, and granular light/dark color overrides.
 * Every prop is explicitly documented for optimal downstream MCP context-injection.
 */
export interface NavigationStripProps extends React.HTMLAttributes<HTMLElement> {
  // --- NAVIGATION & ROUTING ---
  /** Array of top-level `NavigationStripItem` definitions. Strictly capped at 9 items to enforce clean enterprise UI density. */
  navItems: NavigationStripItem[];
  /** Controlled index of the currently active top-level navigation item. Overrides internal active state when provided. */
  activeIndex?: number;
  /** Initial active item index used when operating in uncontrolled mode. @default 0 */
  defaultActiveIndex?: number;
  /** Optional custom link component (e.g., React Router `Link` or Next.js `Link`) for seamless SPA routing without page reloads. Defaults to native `<a>`. */
  linkComponent?: React.ElementType;
  /** Optional callback fired whenever any navigation or dropdown link is clicked, receiving the target `href` and mouse event. */
  onNavigate?: (href: string, e: React.MouseEvent) => void;

  // --- UNDERLINE & INTERACTION CONTROLS ---
  /** Dims non-hovered sibling top-level links on desktop hover to emphasize the focused destination. @default true */
  dimSiblingsOnHover?: boolean;
  /** Thickness in pixels of the animated underline bar beneath (or above) each navigation item. @default 2 */
  underlineHeight?: number;
  /** Triggers a refined, enterprise-grade concentric pulse animation on menu and dropdown items when clicked. @default true */
  pulseOnClick?: boolean;

  // --- BRANDING & LOGO CONTROLS ---
  /** Optional ReactNode representing the brand logo (e.g., an SVG, image, or typography lockup). */
  logo?: ReactNode;
  /** Explicit CSS width applied to the logo container (e.g., `'140px'`, `48`). */
  logoWidth?: string | number;
  /** Explicit CSS height applied to the logo container (e.g., `'36px'`, `36`). */
  logoHeight?: string | number;
  /** Controls the logo's placement above or below the navigation strip (`'top-left'`, `'top-center'`, `'top-right'`, `'bottom-left'`, `'bottom-center'`, `'bottom-right'`). @default 'top-left' */
  logoPosition?: NavigationStripLogoPosition;
  /** Destination URL or route path triggered when clicking the brand logo. @default '/' */
  brandHref?: string;

  // --- COMPOSITE ACTION SLOTS ---
  /** Single ReactNode slot for injecting custom social action buttons, search triggers, or login/user account buttons. */
  actionsNode?: ReactNode;
  /** Array of ReactNodes (e.g., `ActionButton` or `Button` instances) rendered in the trailing actions cluster. */
  rightActions?: ReactNode[];

  // --- VIEWPORT DOCKING & SCROLL VISIBILITY ---
  /** Anchors the navigation strip to either the `'top'` or `'bottom'` of the viewport, automatically inverting scroll-hide animations, underline placement, and dropdown direction. @default 'top' */
  pagePosition?: NavigationStripPagePosition;
  /** Controls the menu's visibility behavior relative to page scrolling (`'sticky'`, `'auto-hide'`, or `'auto-hide-reappear'`). @default 'auto-hide' */
  menuVisibility?: NavigationStripVisibility;
  /** Delay in milliseconds after scrolling stops before the menu reappears when `menuVisibility="auto-hide-reappear"`. @default 450 */
  scrollReappearDelay?: number;

  // --- AESTHETIC & DESIGN CONTROLS ---
  /** The architectural design system variation dictating the strip's surface, borders, and depth. @default 'outline' */
  design?: NavigationStripDesignVariant;
  /** Toggles an enterprise-grade, hyper-realistic glossy frosted glassmorphism aesthetic across the strip, dropdowns, sub-dropdowns, and mobile drawer. @default false */
  trueGlass?: boolean;
  /** Explicit CSS `box-shadow` string to override the default drop shadow of the active design variant. */
  dropShadow?: string;
  /** Custom CSS font-family string applied globally to the navigation strip typography. @default '"Bodoni Moda Variable", -apple-system, sans-serif' */
  fontFamily?: string;
  /** Force dark mode rendering independent of the global UI context or OS preference. @default false */
  darkMode?: boolean;
  /** Dynamic light/dark mode brand color mapping used as fallback accent tokens. */
  darkModeColors?: { light: string; dark: string };
  /** Explicit active/accent color override applied to the animated underline bar, active routes, click-pulse rings, and focus rings. */
  activeColor?: string;
  /** Explicit container background color override for light mode contexts. */
  backgroundColor?: string;
  /** Explicit container background color override specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Explicit primary text color override for light mode contexts. */
  textColor?: string;
  /** Explicit primary text color override specifically for dark mode contexts. */
  darkTextColor?: string;
  /** Explicit hover text color override for links and triggers in light mode contexts. */
  hoverTextColor?: string;
  /** Explicit hover text color override for links and triggers in dark mode contexts. */
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
 * @interface NavigationStripSubComponentProps
 * @description Shared props for exported composite sub-components enabling deep layout extensibility.
 */
export interface NavigationStripSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;
}

/**
 * @interface NavigationStripLinkProps
 * @description Props for the router-agnostic `NavigationStripLink` sub-component.
 */
export interface NavigationStripLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
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
 * @component NavigationStripLink
 * @description Router-agnostic link primitive compatible with native `<a>` tags, React Router (`to`), or Next.js (`href`).
 */
export const NavigationStripLink = React.forwardRef<HTMLAnchorElement, NavigationStripLinkProps>(({
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
        className={`${className} ${isActive ? 'mito-nstrip-active' : ''}`.trim()}
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
      className={`${className} ${isActive ? 'mito-nstrip-active' : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
});
NavigationStripLink.displayName = 'NavigationStripLink';

const MAX_NAV_ITEMS = 9;

/**
 * @component NavigationStrip
 * @description Enterprise-grade, SSR-safe, router-agnostic navigation bar featuring an animated expanding underline,
 * sibling-dimming hover focus, Material-inspired pointer-caret dropdowns with hairline dividers, and a concentric
 * click-pulse feedback animation. Supports nested flyout sub-dropdowns, a strict 9-item cap, 6-position logo layout,
 * top/bottom viewport docking with iOS safe-area insets, configurable scroll visibility, ambient-aware 3D variants,
 * and glossy `trueGlass` styling.
 */
export const NavigationStrip = React.forwardRef<HTMLElement, NavigationStripProps>(({
  navItems = [],
  activeIndex: controlledActiveIndex,
  defaultActiveIndex = 0,
  linkComponent,
  onNavigate,
  dimSiblingsOnHover = true,
  underlineHeight = 2,
  pulseOnClick = true,
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
  const headerRef = useRef<HTMLElement | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [pulsingKey, setPulsingKey] = useState<string | null>(null);

  const lastScrollY = useRef(0);
  const scrollStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Enforce clean UI ceiling of 9 top-level items
  const safeNavItems = navItems.slice(0, MAX_NAV_ITEMS);

  useEffect(() => {
    const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
    if (nodeEnv !== 'production' && navItems.length > MAX_NAV_ITEMS) {
      console.warn(
        `[Mito UI - NavigationStrip] Received ${navItems.length} navItems. Capping at ${MAX_NAV_ITEMS} to preserve clean navigation ergonomics.`
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

  const globalContext = useGlobalUIContext();
  const resolvedActiveColor =
    activeColor ||
    (darkMode
      ? (darkModeColors?.dark || darkModeColors?.light || globalContext.themeColors?.dark || globalContext.themeColors?.light || '#5380F7')
      : (darkModeColors?.light || globalContext.themeColors?.light || '#5380F7'));

  const resolvedBaseBg = darkMode
    ? (darkBackgroundColor || backgroundColor || '#18181b')
    : (backgroundColor || '#ffffff');

  // Trigger concentric enterprise pulse feedback on click
  const triggerPulse = (key: string) => {
    if (!pulseOnClick) return;
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    setPulsingKey(null);
    // Double-rAF guarantees CSS keyframe restarts cleanly even on rapid repeated clicks
    requestAnimationFrame(() => {
      setPulsingKey(key);
      pulseTimer.current = setTimeout(() => {
        setPulsingKey(null);
      }, 560);
    });
  };

  useEffect(() => {
    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, []);

  // Scroll visibility & global dismissal listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (menuVisibility === 'sticky' || isMobileMenuOpen) {
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
        setActiveDropdown(null);
        setOpenSubMenus({});
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

    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setOpenSubMenus({});
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setOpenSubMenus({});
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
    };
  }, [isMobileMenuOpen, menuVisibility, scrollReappearDelay]);

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
      const shadowDark = adjustColor(envBg, -18 * neuIntensity);
      const shadowLight = adjustColor(envBg, 18 * neuIntensity);

      setNeuVars({
        '--mito-nstrip-env-bg': envBg,
        '--mito-nstrip-shadow-dark': shadowDark,
        '--mito-nstrip-shadow-light': shadowLight,
        '--mito-nstrip-x': `${x}px`,
        '--mito-nstrip-y': `${y}px`,
        '--mito-nstrip-dist': `${elevation}px`,
        '--mito-nstrip-blur': `${blur}px`,
      } as React.CSSProperties);
    } else {
      setNeuVars({});
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor, darkBackgroundColor, darkMode, resolvedBaseBg]);

  const toggleDropdown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    triggerPulse(`top-${index}`);
    setActiveDropdown(activeDropdown === index ? null : index);
    setOpenSubMenus({});
  };

  const toggleSubMenu = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerPulse(`sub-${key}`);
    setOpenSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closeMenu = () => {
    setActiveDropdown(null);
    setOpenSubMenus({});
    setIsMobileMenuOpen(false);
  };

  const handleLinkNavigate = (href: string, e: React.MouseEvent, pulseKey?: string, topIndex?: number) => {
    if (pulseKey) triggerPulse(pulseKey);
    if (topIndex !== undefined && controlledActiveIndex === undefined) {
      setInternalActiveIndex(topIndex);
    }
    closeMenu();
    if (onNavigate) onNavigate(href, e);
  };

  const resolvedLogoWidth = typeof logoWidth === 'number' ? `${logoWidth}px` : logoWidth;
  const resolvedLogoHeight = typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight;

  const isLogoAbove = logoPosition.startsWith('top-');
  const logoHorizontalAlign = logoPosition.endsWith('center')
    ? 'center'
    : logoPosition.endsWith('right')
      ? 'flex-end'
      : 'flex-start';

  const hiddenTransform = pagePosition === 'bottom' ? 'translateY(110%)' : 'translateY(-110%)';

  const cssVariables = {
    '--mito-nstrip-active': resolvedActiveColor,
    '--mito-nstrip-underline-h': `${underlineHeight}px`,
    '--mito-nstrip-font': fontFamily,
    '--mito-nstrip-bg': backgroundColor || '#ffffff',
    '--mito-nstrip-bg-dark': darkBackgroundColor || backgroundColor || '#18181b',
    '--mito-nstrip-text': textColor || '#111827',
    '--mito-nstrip-text-dark': darkTextColor || textColor || '#f9fafb',
    '--mito-nstrip-text-muted': darkMode ? '#9ca3af' : '#6b7280',
    '--mito-nstrip-hover': hoverTextColor || resolvedActiveColor,
    '--mito-nstrip-hover-dark': darkHoverTextColor || hoverTextColor || '#ffffff',
    '--mito-nstrip-border': darkMode ? 'rgba(255, 255, 255, 0.14)' : '#e5e7eb',
    '--mito-nstrip-divider': darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    '--mito-nstrip-dropdown-bg': darkMode ? (darkBackgroundColor || '#1f2937') : (backgroundColor || '#ffffff'),
    '--mito-nstrip-logo-justify': logoHorizontalAlign,
    ...(dropShadow ? { '--mito-nstrip-custom-shadow': dropShadow } : {}),
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "header";
  const themeClass = darkMode ? 'mito-nstrip-dark' : '';
  const glassClass = trueGlass ? 'mito-nstrip-glass' : '';
  const posClass = pagePosition === 'bottom' ? 'mito-nstrip-pos-bottom' : 'mito-nstrip-pos-top';
  const dimClass = dimSiblingsOnHover ? 'mito-nstrip-dim-siblings' : '';
  const hasActions = Boolean(actionsNode) || rightActions.length > 0;

  const renderDropdownItems = (items: NavigationStripDropdownItem[], parentKey: string, topIndex: number): JSX.Element => (
    <ul className="mito-nstrip-dropdown-list" role="menu">
      {items.map((dropItem, dIndex) => {
        const itemKey = `${parentKey}-${dIndex}`;
        const hasSubItems = Boolean(dropItem.subItems && dropItem.subItems.length > 0);
        const isSubOpen = Boolean(openSubMenus[itemKey]);
        const isPulsing = pulsingKey === `sub-${itemKey}` || pulsingKey === `drop-${itemKey}`;

        if (hasSubItems) {
          return (
            <li key={itemKey} role="menuitem" className={`mito-nstrip-sub-item ${isSubOpen ? 'sub-open' : ''}`}>
              <button
                type="button"
                className={`mito-nstrip-dropdown-link mito-nstrip-sub-trigger ${dropItem.isActive ? 'mito-nstrip-active' : ''} ${isPulsing ? 'mito-nstrip-pulsing' : ''}`}
                aria-haspopup="true"
                aria-expanded={isSubOpen}
                onClick={(e) => toggleSubMenu(itemKey, e)}
              >
                <div className="mito-nstrip-dropdown-link-main">
                  {dropItem.icon && (
                    <div className="mito-nstrip-dropdown-icon" aria-hidden="true">
                      {dropItem.icon}
                    </div>
                  )}
                  <div className="mito-nstrip-dropdown-text">
                    <span className="mito-nstrip-dropdown-label">{dropItem.title}</span>
                    {dropItem.description && (
                      <span className="mito-nstrip-dropdown-desc">{dropItem.description}</span>
                    )}
                  </div>
                </div>
                <svg className="mito-nstrip-sub-chevron" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isPulsing && <span className="mito-nstrip-pulse-ring" aria-hidden="true" />}
              </button>

              <div className={`mito-nstrip-sub-dropdown ${isSubOpen ? 'active' : ''}`}>
                {renderDropdownItems(dropItem.subItems!, itemKey, topIndex)}
              </div>
            </li>
          );
        }

        return (
          <li key={itemKey} role="menuitem">
            <NavigationStripLink
              href={dropItem.href || '#'}
              linkComponent={linkComponent}
              isActive={dropItem.isActive}
              className={`mito-nstrip-dropdown-link ${isPulsing ? 'mito-nstrip-pulsing' : ''}`}
              onNavigate={(href, e) => handleLinkNavigate(href, e, `drop-${itemKey}`, topIndex)}
            >
              {dropItem.icon && (
                <div className="mito-nstrip-dropdown-icon" aria-hidden="true">
                  {dropItem.icon}
                </div>
              )}
              <div className="mito-nstrip-dropdown-text">
                <span className="mito-nstrip-dropdown-label">{dropItem.title}</span>
                {dropItem.description && (
                  <span className="mito-nstrip-dropdown-desc">{dropItem.description}</span>
                )}
              </div>
              {isPulsing && <span className="mito-nstrip-pulse-ring" aria-hidden="true" />}
            </NavigationStripLink>
          </li>
        );
      })}
    </ul>
  );

  const renderLogoRow = () =>
    logo ? (
      <div className="mito-nstrip-logo-row">
        <NavigationStripBrand>
          <NavigationStripLink
            href={brandHref}
            linkComponent={linkComponent}
            className="mito-nstrip-brand-link"
            onNavigate={(href, e) => handleLinkNavigate(href, e)}
            style={{
              width: resolvedLogoWidth,
              height: resolvedLogoHeight,
            }}
          >
            {logo}
          </NavigationStripLink>
        </NavigationStripBrand>
      </div>
    ) : null;

  return (
    <Comp
      ref={(node: HTMLElement | null) => {
        headerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      className={`mito-nstrip-header mito-nstrip-design-${design} ${themeClass} ${glassClass} ${posClass} ${dimClass} ${className}`}
      style={{
        ...cssVariables,
        transform: isVisible ? 'translateY(0)' : hiddenTransform,
        ...style,
      }}
      aria-label="Primary Navigation"
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-nstrip-header {
          position: fixed;
          left: 0;
          width: 100%;
          max-width: 100%;
          z-index: 1000;
          box-sizing: border-box;
          font-family: var(--mito-nstrip-font);
          color: var(--mito-nstrip-text);
          background-color: var(--mito-nstrip-bg);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .mito-nstrip-pos-top {
          top: 0;
          padding-top: env(safe-area-inset-top, 0px);
        }
        .mito-nstrip-pos-bottom {
          bottom: 0;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .mito-nstrip-dark.mito-nstrip-header {
          color: var(--mito-nstrip-text-dark);
          background-color: var(--mito-nstrip-bg-dark);
        }

        /* ------------------------- */
        /* ENTERPRISE CLICK PULSE    */
        /* ------------------------- */
        @keyframes mito-nstrip-click-pulse {
          0% {
            opacity: 0.42;
            transform: translate(-50%, -50%) scale(0.35);
            box-shadow: 0 0 0 0 var(--mito-nstrip-active),
                        0 0 0 10px var(--mito-nstrip-active),
                        0 0 0 22px var(--mito-nstrip-active);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.45);
            box-shadow: 0 0 0 12px var(--mito-nstrip-active),
                        0 0 0 28px var(--mito-nstrip-active),
                        0 0 0 46px transparent;
          }
        }

        .mito-nstrip-pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          pointer-events: none;
          animation: mito-nstrip-click-pulse 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        .mito-nstrip-design-outline.mito-nstrip-pos-top {
          border-bottom: 1px solid var(--mito-nstrip-border);
          box-shadow: var(--mito-nstrip-custom-shadow, none);
        }
        .mito-nstrip-design-outline.mito-nstrip-pos-bottom {
          border-top: 1px solid var(--mito-nstrip-border);
          box-shadow: var(--mito-nstrip-custom-shadow, none);
        }

        .mito-nstrip-design-material.mito-nstrip-pos-top {
          box-shadow: var(--mito-nstrip-custom-shadow, 0 4px 14px rgba(0, 0, 0, 0.08));
        }
        .mito-nstrip-design-material.mito-nstrip-pos-bottom {
          box-shadow: var(--mito-nstrip-custom-shadow, 0 -4px 14px rgba(0, 0, 0, 0.08));
        }
        .mito-nstrip-dark.mito-nstrip-design-material.mito-nstrip-pos-top {
          box-shadow: var(--mito-nstrip-custom-shadow, 0 6px 20px rgba(0, 0, 0, 0.5));
        }
        .mito-nstrip-dark.mito-nstrip-design-material.mito-nstrip-pos-bottom {
          box-shadow: var(--mito-nstrip-custom-shadow, 0 -6px 20px rgba(0, 0, 0, 0.5));
        }

        .mito-nstrip-design-neumorphic {
          background-color: var(--mito-nstrip-env-bg);
          border: none;
        }
        .mito-nstrip-design-neumorphic.mito-nstrip-pos-top {
          box-shadow: var(--mito-nstrip-custom-shadow, 0 var(--mito-nstrip-dist) var(--mito-nstrip-blur) var(--mito-nstrip-shadow-dark));
        }
        .mito-nstrip-design-neumorphic.mito-nstrip-pos-bottom {
          box-shadow: var(--mito-nstrip-custom-shadow, 0 calc(var(--mito-nstrip-dist) * -1) var(--mito-nstrip-blur) var(--mito-nstrip-shadow-dark));
        }

        .mito-nstrip-design-skeuomorphic {
          background-color: var(--mito-nstrip-env-bg);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(0, 0, 0, 0.02) 72%, rgba(0, 0, 0, 0.1) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.55);
          border-bottom: 1px solid rgba(0, 0, 0, 0.18);
          box-shadow: var(--mito-nstrip-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 6px 16px rgba(0, 0, 0, 0.18));
        }
        .mito-nstrip-dark.mito-nstrip-design-skeuomorphic {
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 25%, rgba(0, 0, 0, 0.18) 72%, rgba(0, 0, 0, 0.4) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom: 1px solid rgba(0, 0, 0, 0.55);
          box-shadow: var(--mito-nstrip-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 8px 20px rgba(0, 0, 0, 0.58));
        }

        /* ------------------------- */
        /* TRUEGLASS AESTHETIC       */
        /* ------------------------- */
        .mito-nstrip-glass {
          backdrop-filter: blur(24px) saturate(1.65);
          -webkit-backdrop-filter: blur(24px) saturate(1.65);
        }

        .mito-nstrip-design-outline.mito-nstrip-glass,
        .mito-nstrip-design-material.mito-nstrip-glass {
          background-color: rgba(255, 255, 255, 0.54);
          border-color: rgba(255, 255, 255, 0.45);
          box-shadow: var(--mito-nstrip-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 24px rgba(0, 0, 0, 0.08));
        }
        .mito-nstrip-dark.mito-nstrip-design-outline.mito-nstrip-glass,
        .mito-nstrip-dark.mito-nstrip-design-material.mito-nstrip-glass {
          background-color: rgba(24, 24, 27, 0.6);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: var(--mito-nstrip-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.45));
        }

        .mito-nstrip-design-neumorphic.mito-nstrip-glass {
          background-color: rgba(255, 255, 255, 0.18);
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
        }
        .mito-nstrip-dark.mito-nstrip-design-neumorphic.mito-nstrip-glass {
          background-color: rgba(24, 24, 27, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mito-nstrip-design-skeuomorphic.mito-nstrip-glass {
          background-color: rgba(255, 255, 255, 0.28);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.06) 100%);
          border-color: rgba(255, 255, 255, 0.45);
        }
        .mito-nstrip-dark.mito-nstrip-design-skeuomorphic.mito-nstrip-glass {
          background-color: rgba(0, 0, 0, 0.38);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.22) 100%);
          border-color: rgba(255, 255, 255, 0.12);
        }

        /* ------------------------- */
        /* INNER LAYOUT & LOGO ROW   */
        /* ------------------------- */
        .mito-nstrip-inner {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0.75rem max(2rem, env(safe-area-inset-left, 0px));
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          box-sizing: border-box;
        }

        .mito-nstrip-logo-row {
          display: flex;
          align-items: center;
          justify-content: var(--mito-nstrip-logo-justify, flex-start);
          width: 100%;
        }

        .mito-nstrip-brand {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .mito-nstrip-brand-link {
          text-decoration: none;
          color: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.35rem;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        .mito-nstrip-brand-link img,
        .mito-nstrip-brand-link svg {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .mito-nstrip-main-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          width: 100%;
          min-width: 0;
        }

        /* ------------------------- */
        /* UNDERLINE STRIP & ITEMS   */
        /* ------------------------- */
        .mito-nstrip-nav {
          flex: 1 1 auto;
          display: flex;
          justify-content: center;
          min-width: 0;
        }

        .mito-nstrip-list {
          display: inline-flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          border-bottom: 1px solid var(--mito-nstrip-border);
        }
        .mito-nstrip-pos-bottom .mito-nstrip-list {
          border-bottom: none;
          border-top: 1px solid var(--mito-nstrip-border);
        }

        .mito-nstrip-item {
          position: relative;
          display: flex;
          align-items: center;
        }

        /* Signature Expanding Underline */
        .mito-nstrip-item::after {
          content: "";
          position: absolute;
          left: 0;
          width: 100%;
          height: var(--mito-nstrip-underline-h, 2px);
          background-color: var(--mito-nstrip-active);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          pointer-events: none;
        }
        .mito-nstrip-pos-top .mito-nstrip-item::after {
          bottom: -1px;
        }
        .mito-nstrip-pos-bottom .mito-nstrip-item::after {
          top: -1px;
        }

        .mito-nstrip-item:hover::after,
        .mito-nstrip-item.mito-nstrip-item-active::after,
        .mito-nstrip-item.mito-nstrip-item-open::after {
          transform: scaleX(1);
        }

        /* Sibling Dimming Hover Focus (Desktop Hover Only) */
        @media (min-width: 1025px) and (hover: hover) {
          .mito-nstrip-dim-siblings .mito-nstrip-list:hover > .mito-nstrip-item:not(:hover) > .mito-nstrip-link {
            opacity: 0.32;
          }
        }

        .mito-nstrip-link {
          position: relative;
          overflow: hidden;
          background: transparent;
          border: none;
          font-family: inherit;
          font-size: 0.975rem;
          font-weight: 500;
          color: inherit;
          text-decoration: none;
          padding: 0.9rem 1.25rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          white-space: nowrap;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), color 0.25s ease;
        }
        .mito-nstrip-link:hover,
        .mito-nstrip-link[aria-expanded="true"] {
          color: var(--mito-nstrip-hover);
        }
        .mito-nstrip-dark .mito-nstrip-link:hover,
        .mito-nstrip-dark .mito-nstrip-link[aria-expanded="true"] {
          color: var(--mito-nstrip-hover-dark);
        }
        .mito-nstrip-link.mito-nstrip-active {
          color: var(--mito-nstrip-active);
          font-weight: 600;
        }
        .mito-nstrip-link:focus-visible {
          outline: 2px solid var(--mito-nstrip-active);
          outline-offset: -2px;
          border-radius: 4px;
        }

        .mito-nstrip-chevron {
          width: 16px;
          height: 16px;
          fill: currentColor;
          transition: transform 0.25s ease;
        }
        .mito-nstrip-link[aria-expanded="true"] .mito-nstrip-chevron {
          transform: rotate(180deg);
        }

        /* --------------------------------------------- */
        /* PURE CSS MATERIAL-STYLE DROPDOWN & CARET      */
        /* --------------------------------------------- */
        .mito-nstrip-dropdown,
        .mito-nstrip-sub-dropdown {
          position: absolute;
          background-color: var(--mito-nstrip-dropdown-bg);
          border-radius: 6px;
          min-width: 250px;
          display: flex;
          flex-direction: column;
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.28s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.28s cubic-bezier(0.165, 0.84, 0.44, 1), visibility 0.28s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 12px 28px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--mito-nstrip-border);
          z-index: 1010;
        }

        .mito-nstrip-pos-top .mito-nstrip-dropdown {
          top: calc(100% + 14px);
          left: 0;
          transform: translateY(-10px);
        }
        .mito-nstrip-pos-bottom .mito-nstrip-dropdown {
          bottom: calc(100% + 14px);
          left: 0;
          transform: translateY(10px);
        }

        /* Rotated Diamond Pointer Caret (CodePen Signature) */
        .mito-nstrip-dropdown::before {
          content: "";
          position: absolute;
          left: 24px;
          width: 12px;
          height: 12px;
          background-color: var(--mito-nstrip-dropdown-bg);
          transform: rotate(45deg);
          pointer-events: none;
          z-index: 0;
        }
        .mito-nstrip-pos-top .mito-nstrip-dropdown::before {
          top: -7px;
          border-top: 1px solid var(--mito-nstrip-border);
          border-left: 1px solid var(--mito-nstrip-border);
          box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.03);
        }
        .mito-nstrip-pos-bottom .mito-nstrip-dropdown::before {
          bottom: -7px;
          border-bottom: 1px solid var(--mito-nstrip-border);
          border-right: 1px solid var(--mito-nstrip-border);
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.03);
        }

        .mito-nstrip-sub-dropdown {
          top: -6px;
          left: calc(100% + 10px);
          padding: 0.25rem 0;
          transform: translateX(-8px);
          z-index: 1020;
        }

        .mito-nstrip-dark .mito-nstrip-dropdown,
        .mito-nstrip-dark .mito-nstrip-sub-dropdown {
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45), 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .mito-nstrip-design-neumorphic .mito-nstrip-dropdown,
        .mito-nstrip-design-neumorphic .mito-nstrip-sub-dropdown {
          background-color: var(--mito-nstrip-env-bg);
          border: none;
          box-shadow: var(--mito-nstrip-x) var(--mito-nstrip-y) var(--mito-nstrip-blur) var(--mito-nstrip-shadow-dark),
                      calc(var(--mito-nstrip-x) * -1) calc(var(--mito-nstrip-y) * -1) var(--mito-nstrip-blur) var(--mito-nstrip-shadow-light);
        }
        .mito-nstrip-design-neumorphic .mito-nstrip-dropdown::before {
          background-color: var(--mito-nstrip-env-bg);
          border: none;
        }

        .mito-nstrip-glass .mito-nstrip-dropdown,
        .mito-nstrip-glass .mito-nstrip-sub-dropdown {
          background-color: rgba(255, 255, 255, 0.86);
          backdrop-filter: blur(24px) saturate(1.65);
          -webkit-backdrop-filter: blur(24px) saturate(1.65);
          border: 1px solid rgba(255, 255, 255, 0.55);
        }
        .mito-nstrip-glass .mito-nstrip-dropdown::before {
          background-color: rgba(255, 255, 255, 0.86);
          border-color: rgba(255, 255, 255, 0.55);
        }
        .mito-nstrip-dark.mito-nstrip-glass .mito-nstrip-dropdown,
        .mito-nstrip-dark.mito-nstrip-glass .mito-nstrip-sub-dropdown {
          background-color: rgba(24, 24, 27, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }
        .mito-nstrip-dark.mito-nstrip-glass .mito-nstrip-dropdown::before {
          background-color: rgba(24, 24, 27, 0.88);
          border-color: rgba(255, 255, 255, 0.14);
        }

        .mito-nstrip-dropdown.active {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
        }

        .mito-nstrip-sub-item {
          position: relative;
        }

        .mito-nstrip-sub-dropdown.active {
          visibility: visible;
          opacity: 1;
          transform: translateX(0);
        }

        @media (min-width: 1025px) and (hover: hover) {
          .mito-nstrip-sub-item:hover > .mito-nstrip-sub-dropdown {
            visibility: visible;
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mito-nstrip-dropdown-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: row;
        }
        .mito-nstrip-dropdown-group {
          padding: 0.65rem 0;
          flex: 1;
          min-width: 240px;
        }
        .mito-nstrip-dropdown-group:not(:last-child) {
          border-right: 1px solid var(--mito-nstrip-divider);
        }

        .mito-nstrip-dropdown-title {
          font-weight: 700;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--mito-nstrip-text-muted);
          letter-spacing: 0.08em;
          margin-bottom: 0.35rem;
          display: block;
          padding: 0.25rem 1.25rem;
        }

        .mito-nstrip-dropdown-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .mito-nstrip-dropdown-list > li {
          position: relative;
          padding: 0 1.25rem;
        }

        .mito-nstrip-dropdown-link {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 0;
          text-decoration: none;
          color: inherit;
          border-bottom: 1px solid var(--mito-nstrip-divider);
          transition: color 0.2s ease, padding-left 0.2s ease;
          box-sizing: border-box;
        }
        .mito-nstrip-dropdown-list > li:last-child > .mito-nstrip-dropdown-link {
          border-bottom: none;
        }

        .mito-nstrip-sub-trigger {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--mito-nstrip-divider);
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          justify-content: space-between;
        }
        .mito-nstrip-dropdown-link-main {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }
        .mito-nstrip-sub-chevron {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: var(--mito-nstrip-text-muted);
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .mito-nstrip-sub-item:hover > .mito-nstrip-sub-trigger .mito-nstrip-sub-chevron,
        .mito-nstrip-sub-trigger[aria-expanded="true"] .mito-nstrip-sub-chevron {
          color: var(--mito-nstrip-hover);
        }

        .mito-nstrip-dropdown-link:hover {
          color: var(--mito-nstrip-hover);
          padding-left: 4px;
        }
        .mito-nstrip-dark .mito-nstrip-dropdown-link:hover {
          color: var(--mito-nstrip-hover-dark);
        }
        .mito-nstrip-dropdown-link.mito-nstrip-active {
          color: var(--mito-nstrip-active);
          font-weight: 600;
        }

        .mito-nstrip-dropdown-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }
        .mito-nstrip-dropdown-icon img,
        .mito-nstrip-dropdown-icon svg {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .mito-nstrip-dropdown-text {
          display: flex;
          flex-direction: column;
        }
        .mito-nstrip-dropdown-label {
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.01em;
        }
        .mito-nstrip-dropdown-desc {
          font-size: 0.76rem;
          color: var(--mito-nstrip-text-muted);
          margin-top: 0.15rem;
          line-height: 1.3;
        }

        /* Actions Cluster */
        .mito-nstrip-actions {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        /* ------------------------- */
        /* MOBILE HAMBURGER & DRAWER */
        /* ------------------------- */
        .mito-nstrip-hamburger {
          display: none;
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 6px;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }
        .mito-nstrip-hamburger:hover {
          background-color: rgba(128, 128, 128, 0.1);
        }

        .mito-nstrip-mobile-actions {
          display: none;
        }

        @media (max-width: 1024px) {
          .mito-nstrip-inner {
            padding: 0.65rem max(1.25rem, env(safe-area-inset-left, 0px));
          }
          .mito-nstrip-hamburger {
            display: inline-flex;
          }
          .mito-nstrip-desktop-actions {
            display: none;
          }

          .mito-nstrip-list {
            position: absolute;
            left: 0;
            width: 100%;
            background-color: var(--mito-nstrip-bg);
            border-top: 1px solid var(--mito-nstrip-border);
            border-bottom: 1px solid var(--mito-nstrip-border);
            flex-direction: column;
            align-items: stretch;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.32s ease-in-out;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.14);
          }
          .mito-nstrip-pos-top .mito-nstrip-list {
            top: 100%;
          }
          .mito-nstrip-pos-bottom .mito-nstrip-list {
            bottom: 100%;
            box-shadow: 0 -12px 24px rgba(0, 0, 0, 0.14);
          }
          .mito-nstrip-dark .mito-nstrip-list {
            background-color: var(--mito-nstrip-bg-dark);
          }
          .mito-nstrip-design-neumorphic .mito-nstrip-list {
            background-color: var(--mito-nstrip-env-bg);
            border: none;
          }
          .mito-nstrip-glass .mito-nstrip-list {
            background-color: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
          }
          .mito-nstrip-dark.mito-nstrip-glass .mito-nstrip-list {
            background-color: rgba(24, 24, 27, 0.94);
          }

          .mito-nstrip-list.mobile-open {
            max-height: 78vh;
            overflow-y: auto;
            padding: 0.5rem 0 1rem 0;
          }

          .mito-nstrip-item {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            border-bottom: 1px solid var(--mito-nstrip-border);
          }
          .mito-nstrip-item:last-of-type {
            border-bottom: none;
          }
          .mito-nstrip-item::after {
            display: none;
          }

          .mito-nstrip-link {
            width: 100%;
            justify-content: space-between;
            padding: 0.95rem 1.5rem;
          }

          .mito-nstrip-dropdown::before {
            display: none;
          }

          .mito-nstrip-dropdown,
          .mito-nstrip-sub-dropdown {
            position: static;
            box-shadow: none !important;
            border: none !important;
            opacity: 1;
            visibility: visible;
            transform: none !important;
            display: none;
            background-color: transparent !important;
            backdrop-filter: none !important;
            min-width: 100%;
          }
          .mito-nstrip-dropdown.active {
            display: block;
            padding-bottom: 0.5rem;
          }
          .mito-nstrip-sub-dropdown.active {
            display: block;
            padding: 0.25rem 0 0.5rem 1rem;
            margin-left: 0.5rem;
            border-left: 2px solid var(--mito-nstrip-border) !important;
            border-radius: 0;
          }
          .mito-nstrip-sub-trigger[aria-expanded="true"] .mito-nstrip-sub-chevron {
            transform: rotate(90deg);
          }

          .mito-nstrip-dropdown-content {
            flex-direction: column;
          }
          .mito-nstrip-dropdown-group {
            border-right: none !important;
            padding: 0.25rem 0.5rem;
          }

          .mito-nstrip-mobile-actions {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.75rem;
            padding: 1rem 1.5rem 0.25rem 1.5rem;
            border-top: 1px solid var(--mito-nstrip-border);
          }
        }
      `}} />

      <div className="mito-nstrip-inner">
        {isLogoAbove && renderLogoRow()}

        <div className="mito-nstrip-main-row">
          <nav className="mito-nstrip-nav" aria-label="Section Navigation">
            <ul className={`mito-nstrip-list ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              {safeNavItems.map((item, index) => {
                const hasDropdown = Boolean(item.dropdownGroups && item.dropdownGroups.length > 0);
                const isOpen = activeDropdown === index;
                const isActive = index === resolvedActiveIndex;
                const isTopPulsing = pulsingKey === `top-${index}`;

                return (
                  <li
                    key={`${item.label}-${index}`}
                    className={`mito-nstrip-item ${isActive ? 'mito-nstrip-item-active' : ''} ${isOpen ? 'mito-nstrip-item-open' : ''}`}
                  >
                    {hasDropdown ? (
                      <button
                        type="button"
                        className={`mito-nstrip-link ${isActive ? 'mito-nstrip-active' : ''} ${isTopPulsing ? 'mito-nstrip-pulsing' : ''}`}
                        aria-haspopup="true"
                        aria-expanded={isOpen}
                        onClick={(e) => toggleDropdown(index, e)}
                      >
                        {item.icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{item.icon}</span>}
                        <span>{item.label}</span>
                        <svg className="mito-nstrip-chevron" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                        {isTopPulsing && <span className="mito-nstrip-pulse-ring" aria-hidden="true" />}
                      </button>
                    ) : (
                      <NavigationStripLink
                        href={item.href || '#'}
                        linkComponent={linkComponent}
                        isActive={isActive}
                        className={`mito-nstrip-link ${isTopPulsing ? 'mito-nstrip-pulsing' : ''}`}
                        onNavigate={(href, e) => handleLinkNavigate(href, e, `top-${index}`, index)}
                      >
                        {item.icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{item.icon}</span>}
                        <span>{item.label}</span>
                        {isTopPulsing && <span className="mito-nstrip-pulse-ring" aria-hidden="true" />}
                      </NavigationStripLink>
                    )}

                    {hasDropdown && (
                      <div className={`mito-nstrip-dropdown ${isOpen ? 'active' : ''}`}>
                        <div className="mito-nstrip-dropdown-content">
                          {item.dropdownGroups!.map((group, gIndex) => (
                            <div key={gIndex} className="mito-nstrip-dropdown-group">
                              {group.title && <span className="mito-nstrip-dropdown-title">{group.title}</span>}
                              {renderDropdownItems(group.items, `${index}-${gIndex}`, index)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}

              {hasActions && (
                <li className="mito-nstrip-mobile-actions">
                  {actionsNode}
                  {rightActions.map((action, i) => (
                    <React.Fragment key={i}>{action}</React.Fragment>
                  ))}
                </li>
              )}
            </ul>
          </nav>

          {children}

          {hasActions && (
            <div className="mito-nstrip-desktop-actions">
              <NavigationStripActions>
                {actionsNode}
                {rightActions.map((action, i) => (
                  <React.Fragment key={i}>{action}</React.Fragment>
                ))}
              </NavigationStripActions>
            </div>
          )}

          <button
            type="button"
            className="mito-nstrip-hamburger"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {!isLogoAbove && renderLogoRow()}
      </div>
    </Comp>
  );
});

NavigationStrip.displayName = 'NavigationStrip';


export const NavigationStripBrand = React.forwardRef<HTMLDivElement, NavigationStripSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-nstrip-brand ${className}`} {...props} />;
});
NavigationStripBrand.displayName = 'NavigationStripBrand';

export const NavigationStripActions = React.forwardRef<HTMLDivElement, NavigationStripSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-nstrip-actions ${className}`} {...props} />;
});
NavigationStripActions.displayName = 'NavigationStripActions';