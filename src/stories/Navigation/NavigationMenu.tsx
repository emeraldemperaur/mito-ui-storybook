"use client";

import React, { useRef, useState, useEffect, type JSX, type ReactNode } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";

/**
 * @type NavigationMenuDesignVariant
 * @description Strong string literal union representing the supported enterprise architectural design variants.
 */
export type NavigationMenuDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @type NavigationMenuVisibility
 * @description Dictates how the navigation bar responds to vertical page scrolling.
 * - `'sticky'`: Remains persistently visible at the top of the viewport.
 * - `'auto-hide'`: Slides out of view when scrolling down and reappears when scrolling up.
 * - `'auto-hide-reappear'`: Slides out of view while scrolling down and automatically reappears once scrolling stops.
 */
export type NavigationMenuVisibility = 'sticky' | 'auto-hide' | 'auto-hide-reappear';

/**
 * @interface NavDropdownItem
 * @description Represents a single interactive link or nested sub-dropdown trigger inside a dropdown group.
 */
export interface NavDropdownItem {
  /** The primary display label for the dropdown link or sub-menu trigger. */
  title: string;
  /** Optional secondary text providing concise context for the link. */
  description?: string;
  /** Optional ReactNode icon rendered beside the dropdown link text. */
  icon?: ReactNode;
  /** Optional destination URL or client-side routing path. Can be omitted when `subItems` is provided. */
  href?: string;
  /** Optional flag indicating whether this dropdown link represents the currently active route. */
  isActive?: boolean;
  /** Optional nested array of `NavDropdownItem` entries rendered as a flyout sub-menu on desktop and an indented accordion on mobile. */
  subItems?: NavDropdownItem[];
}

/**
 * @interface NavDropdownGroup
 * @description Logical grouping of dropdown items, rendered as side-by-side columns on desktop.
 */
export interface NavDropdownGroup {
  /** Optional uppercase header title for this group of links. */
  title?: string;
  /** Array of `NavDropdownItem` entries belonging to this group. */
  items: NavDropdownItem[];
}

/**
 * @interface NavItem
 * @description Top-level navigation item configuration supporting either a direct link or a multi-group dropdown.
 */
export interface NavItem {
  /** The top-level menu label displayed in the navigation bar. */
  label: string;
  /** Optional destination URL or route path when the item is a direct link rather than a dropdown trigger. */
  href?: string;
  /** Optional flag marking this top-level item as the currently active route. */
  isActive?: boolean;
  /** Optional array of grouped links displayed inside an interactive dropdown panel. */
  dropdownGroups?: NavDropdownGroup[];
}

/**
 * @interface NavigationMenuProps
 * @description Strongly-typed attributes configuring the NavigationMenu's layout, routing, scroll visibility,
 * logo positioning, multi-variant 3D surface adaptation, glassmorphism, and granular light/dark color overrides.
 * Every prop is explicitly documented for optimal downstream MCP context-injection.
 */
export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  // --- BRANDING & LOGO CONTROLS ---
  /** ReactNode representing the brand logo (e.g., an SVG, image, or typography lockup). */
  logo?: ReactNode;
  /** Legacy alias for `logo` maintained for backward compatibility. Takes lower precedence than `logo`. */
  brandLogo?: ReactNode;
  /** Explicit CSS width applied to the logo container (e.g., `'140px'`, `48`). */
  logoWidth?: string | number;
  /** Explicit CSS height applied to the logo container (e.g., `'36px'`, `36`). */
  logoHeight?: string | number;
  /** Controls whether the brand logo is anchored on the far left or far right of the navigation bar. @default 'left' */
  logoPosition?: 'left' | 'right';
  /** Destination URL or route path triggered when clicking the brand logo. @default '/' */
  brandHref?: string;

  // --- NAVIGATION & ROUTING ---
  /** Array of top-level `NavItem` definitions populating the primary menu bar. */
  navItems: NavItem[];
  /** Optional custom link component (e.g., React Router `Link` or Next.js `Link`) for seamless SPA routing without page reloads. Defaults to native `<a>`. */
  linkComponent?: React.ElementType;
  /** Optional click interceptor fired whenever any navigation link is clicked, useful for programmatic navigation or analytics. */
  onNavigate?: (href: string, e: React.MouseEvent) => void;

  // --- COMPOSITE ACTION SLOTS ---
  /** Single ReactNode slot for injecting custom social action buttons, search triggers, or login/account controls into the menu. */
  actionsNode?: ReactNode;
  /** Array of ReactNodes (e.g., `ActionButton` or `Button` instances) rendered in the actions cluster. */
  rightActions?: ReactNode[];

  // --- SCROLL & VISIBILITY BEHAVIOR ---
  /** Controls the menu's visibility behavior relative to page scrolling (`'sticky'`, `'auto-hide'`, or `'auto-hide-reappear'`). @default 'auto-hide' */
  menuVisibility?: NavigationMenuVisibility;
  /** Delay in milliseconds after scrolling stops before the menu reappears when `menuVisibility="auto-hide-reappear"`. @default 450 */
  scrollReappearDelay?: number;

  // --- AESTHETIC & DESIGN CONTROLS ---
  /** The architectural design system variation dictating the bar's surface, borders, and depth. @default 'outline' */
  design?: NavigationMenuDesignVariant;
  /** Toggles an enterprise-grade, hyper-realistic glossy frosted glassmorphism aesthetic across the bar, dropdowns, sub-dropdowns, and mobile drawer. @default false */
  trueGlass?: boolean;
  /** Explicit CSS `box-shadow` string to override the default drop shadow of the active design variant. */
  dropShadow?: string;
  /** Custom CSS font-family string applied globally to the navigation menu typography. @default '"Bodoni Moda Variable", -apple-system, sans-serif' */
  fontFamily?: string;
  /** Force dark mode rendering independent of the global UI context or OS preference. @default false */
  darkMode?: boolean;
  /** Dynamic light/dark mode brand color mapping used as fallback accent tokens. */
  darkModeColors?: { light: string; dark: string };
  /** Explicit active/accent color override applied to active routes, focus rings, and brand highlights. */
  activeColor?: string;
  /** Explicit navigation bar background color override for light mode contexts. */
  backgroundColor?: string;
  /** Explicit navigation bar background color override specifically for dark mode contexts. */
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
 * @interface NavigationMenuSubComponentProps
 * @description Shared props for exported composite sub-components enabling deep layout extensibility.
 */
export interface NavigationMenuSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;
}

/**
 * @interface NavigationMenuLinkProps
 * @description Props for the router-agnostic `NavigationMenuLink` sub-component.
 */
export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
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
 * @component NavigationMenuLink
 * @description Router-agnostic link primitive that works seamlessly with native `<a>` tags, React Router (`to`), or Next.js (`href`).
 */
export const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(({
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
        className={`${className} ${isActive ? 'mito-nav-active' : ''}`.trim()}
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
      className={`${className} ${isActive ? 'mito-nav-active' : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
});
NavigationMenuLink.displayName = 'NavigationMenuLink';

/**
 * @component NavigationMenu
 * @description Accessible, SSR-safe, router-agnostic enterprise navigation bar.
 * Natively supports multi-column dropdowns, nested flyout sub-dropdowns, configurable scroll visibility,
 * glossy `trueGlass` surfaces, ambient-aware Neumorphic/Skeuomorphic 3D rendering, and composite action slots.
 */
export const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(({
  logo,
  brandLogo,
  logoWidth,
  logoHeight,
  logoPosition = 'left',
  brandHref = "/",
  navItems = [],
  linkComponent,
  onNavigate,
  actionsNode,
  rightActions = [],
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
  const navRef = useRef<HTMLElement | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});

  const lastScrollY = useRef(0);
  const scrollStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const globalContext = useGlobalUIContext();
  const resolvedActiveColor =
    activeColor ||
    (darkMode
      ? (darkModeColors?.dark || darkModeColors?.light || globalContext.themeColors?.dark || globalContext.themeColors?.light || '#3b82f6')
      : (darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)'));

  const resolvedBaseBg = darkMode
    ? (darkBackgroundColor || backgroundColor || '#18181b')
    : (backgroundColor || '#ffffff');

  const resolvedLogo = logo ?? brandLogo;

  // Scroll visibility & global dismissal listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (menuVisibility === 'sticky' || isMobileMenuOpen) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      if (scrollStopTimer.current) {
        clearTimeout(scrollStopTimer.current);
        scrollStopTimer.current = null;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setActiveDropdown(null);
        setOpenSubMenus({});
      } else if (currentScrollY < lastScrollY.current || currentScrollY <= 100) {
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
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
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
    if ((design === 'neumorphic' || design === 'skeuomorphic') && navRef.current) {
      const explicitBg = darkMode ? (darkBackgroundColor || backgroundColor) : backgroundColor;
      const envBg =
        explicitBg ||
        (typeof document !== 'undefined' ? getNearestParentBackground(navRef.current.parentElement || document.body) : resolvedBaseBg) ||
        resolvedBaseBg;

      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(envBg, -15 * neuIntensity);
      const shadowLight = adjustColor(envBg, 15 * neuIntensity);

      setNeuVars({
        '--mito-nav-env-bg': envBg,
        '--mito-nav-shadow-dark': shadowDark,
        '--mito-nav-shadow-light': shadowLight,
        '--mito-nav-x': `${x}px`,
        '--mito-nav-y': `${y}px`,
        '--mito-nav-dist': `${elevation}px`,
        '--mito-nav-blur': `${blur}px`,
      } as React.CSSProperties);
    } else {
      setNeuVars({});
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor, darkBackgroundColor, darkMode, resolvedBaseBg]);

  const toggleDropdown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === index ? null : index);
    setOpenSubMenus({});
  };

  const toggleSubMenu = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closeMenu = () => {
    setActiveDropdown(null);
    setOpenSubMenus({});
    setIsMobileMenuOpen(false);
  };

  const handleLinkNavigate = (href: string, e: React.MouseEvent) => {
    closeMenu();
    if (onNavigate) onNavigate(href, e);
  };

  const resolvedLogoWidth = typeof logoWidth === 'number' ? `${logoWidth}px` : logoWidth;
  const resolvedLogoHeight = typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight;

  const cssVariables = {
    '--mito-nav-active': resolvedActiveColor,
    '--mito-nav-font': fontFamily,
    '--mito-nav-bg': backgroundColor || '#ffffff',
    '--mito-nav-bg-dark': darkBackgroundColor || backgroundColor || '#18181b',
    '--mito-nav-text': textColor || '#111827',
    '--mito-nav-text-dark': darkTextColor || textColor || '#f9fafb',
    '--mito-nav-text-muted': darkMode ? '#9ca3af' : '#6b7280',
    '--mito-nav-hover': hoverTextColor || resolvedActiveColor,
    '--mito-nav-hover-dark': darkHoverTextColor || hoverTextColor || resolvedActiveColor,
    '--mito-nav-border': darkMode ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
    '--mito-nav-dropdown-bg': darkMode ? (darkBackgroundColor || '#1f2937') : (backgroundColor || '#ffffff'),
    ...(dropShadow ? { '--mito-nav-custom-shadow': dropShadow } : {}),
    ...neuVars,
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "header";
  const themeClass = darkMode ? 'mito-nav-dark' : '';
  const glassClass = trueGlass ? 'mito-nav-glass' : '';
  const hasActions = Boolean(actionsNode) || rightActions.length > 0;

  const renderDropdownItems = (items: NavDropdownItem[], parentKey: string): JSX.Element => (
    <ul className="mito-nav-dropdown-list" role="menu">
      {items.map((dropItem, dIndex) => {
        const itemKey = `${parentKey}-${dIndex}`;
        const hasSubItems = Boolean(dropItem.subItems && dropItem.subItems.length > 0);
        const isSubOpen = Boolean(openSubMenus[itemKey]);

        if (hasSubItems) {
          return (
            <li key={itemKey} role="menuitem" className={`mito-nav-sub-item ${isSubOpen ? 'sub-open' : ''}`}>
              <button
                type="button"
                className={`mito-nav-dropdown-link mito-nav-sub-trigger ${dropItem.isActive ? 'mito-nav-active' : ''}`}
                aria-haspopup="true"
                aria-expanded={isSubOpen}
                onClick={(e) => toggleSubMenu(itemKey, e)}
              >
                <div className="mito-nav-dropdown-link-main">
                  {dropItem.icon && (
                    <div className="mito-nav-dropdown-icon" aria-hidden="true">
                      {dropItem.icon}
                    </div>
                  )}
                  <div className="mito-nav-dropdown-text">
                    <span className="mito-nav-dropdown-label">{dropItem.title}</span>
                    {dropItem.description && (
                      <span className="mito-nav-dropdown-desc">{dropItem.description}</span>
                    )}
                  </div>
                </div>
                <svg className="mito-nav-sub-chevron" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`mito-nav-sub-dropdown ${isSubOpen ? 'active' : ''}`}>
                {renderDropdownItems(dropItem.subItems!, itemKey)}
              </div>
            </li>
          );
        }

        return (
          <li key={itemKey} role="menuitem">
            <NavigationMenuLink
              href={dropItem.href || '#'}
              linkComponent={linkComponent}
              isActive={dropItem.isActive}
              className="mito-nav-dropdown-link"
              onNavigate={handleLinkNavigate}
            >
              {dropItem.icon && (
                <div className="mito-nav-dropdown-icon" aria-hidden="true">
                  {dropItem.icon}
                </div>
              )}
              <div className="mito-nav-dropdown-text">
                <span className="mito-nav-dropdown-label">{dropItem.title}</span>
                {dropItem.description && (
                  <span className="mito-nav-dropdown-desc">{dropItem.description}</span>
                )}
              </div>
            </NavigationMenuLink>
          </li>
        );
      })}
    </ul>
  );

  const renderBrandBlock = () =>
    resolvedLogo ? (
      <NavigationMenuBrand
        className={logoPosition === 'right' ? 'mito-nav-brand-right' : 'mito-nav-brand-left'}
      >
        <NavigationMenuLink
          href={brandHref}
          linkComponent={linkComponent}
          className="mito-nav-brand-link"
          onNavigate={handleLinkNavigate}
          style={{
            width: resolvedLogoWidth,
            height: resolvedLogoHeight,
          }}
        >
          {resolvedLogo}
        </NavigationMenuLink>
      </NavigationMenuBrand>
    ) : null;

  const renderActionsBlock = () =>
    hasActions ? (
      <NavigationMenuActions>
        {actionsNode}
        {rightActions.map((action, i) => (
          <React.Fragment key={i}>{action}</React.Fragment>
        ))}
      </NavigationMenuActions>
    ) : null;

  return (
    <Comp
      ref={(node: HTMLElement | null) => {
        navRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      className={`mito-nav-header mito-nav-design-${design} ${themeClass} ${glassClass} ${className}`}
      style={{
        ...cssVariables,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        ...style,
      }}
      aria-label="Main Navigation"
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-nav-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          max-width: 100%;
          z-index: 1000;
          box-sizing: border-box;
          font-family: var(--mito-nav-font);
          color: var(--mito-nav-text);
          background-color: var(--mito-nav-bg);
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .mito-nav-dark.mito-nav-header {
          color: var(--mito-nav-text-dark);
          background-color: var(--mito-nav-bg-dark);
        }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        .mito-nav-design-outline {
          border-bottom: 1px solid var(--mito-nav-border);
          box-shadow: var(--mito-nav-custom-shadow, none);
        }

        .mito-nav-design-material {
          border-bottom: 1px solid transparent;
          box-shadow: var(--mito-nav-custom-shadow, 0 4px 12px rgba(0, 0, 0, 0.08));
        }
        .mito-nav-dark.mito-nav-design-material {
          box-shadow: var(--mito-nav-custom-shadow, 0 6px 18px rgba(0, 0, 0, 0.45));
        }

        .mito-nav-design-neumorphic {
          background-color: var(--mito-nav-env-bg);
          border: none;
          box-shadow: var(--mito-nav-custom-shadow, 0 var(--mito-nav-dist) var(--mito-nav-blur) var(--mito-nav-shadow-dark));
        }

        .mito-nav-design-skeuomorphic {
          background-color: var(--mito-nav-env-bg);
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 0%, rgba(0, 0, 0, 0.04) 100%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.16);
          box-shadow: var(--mito-nav-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 6px 14px rgba(0, 0, 0, 0.16));
        }
        .mito-nav-dark.mito-nav-design-skeuomorphic {
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 0%, rgba(0, 0, 0, 0.25) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: var(--mito-nav-custom-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 18px rgba(0, 0, 0, 0.55));
        }

        /* ------------------------- */
        /* TRUEGLASS AESTHETIC       */
        /* ------------------------- */
        .mito-nav-glass {
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
        }

        .mito-nav-design-outline.mito-nav-glass,
        .mito-nav-design-material.mito-nav-glass {
          background-color: rgba(255, 255, 255, 0.55);
          border-bottom: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: var(--mito-nav-custom-shadow, inset 0 -1px 0 rgba(255, 255, 255, 0.35), 0 8px 24px rgba(0, 0, 0, 0.06));
        }
        .mito-nav-dark.mito-nav-design-outline.mito-nav-glass,
        .mito-nav-dark.mito-nav-design-material.mito-nav-glass {
          background-color: rgba(24, 24, 27, 0.55);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: var(--mito-nav-custom-shadow, inset 0 -1px 0 rgba(255, 255, 255, 0.05), 0 8px 24px rgba(0, 0, 0, 0.4));
        }

        .mito-nav-design-neumorphic.mito-nav-glass {
          background-color: rgba(255, 255, 255, 0.16);
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: var(--mito-nav-custom-shadow, inset 0 1px 1px rgba(255, 255, 255, 0.45), 0 var(--mito-nav-dist) var(--mito-nav-blur) var(--mito-nav-shadow-dark));
        }
        .mito-nav-dark.mito-nav-design-neumorphic.mito-nav-glass {
          background-color: rgba(24, 24, 27, 0.35);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mito-nav-design-skeuomorphic.mito-nav-glass {
          background-color: rgba(255, 255, 255, 0.28);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.08) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: var(--mito-nav-custom-shadow, inset 0 1px 2px rgba(255, 255, 255, 0.7), 0 10px 20px rgba(0, 0, 0, 0.12));
        }
        .mito-nav-dark.mito-nav-design-skeuomorphic.mito-nav-glass {
          background-color: rgba(0, 0, 0, 0.35);
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        /* ------------------------- */
        /* LAYOUT CONTAINERS         */
        /* ------------------------- */
        .mito-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0.85rem 2.5rem;
          min-height: 76px;
          gap: 1.5rem;
          box-sizing: border-box;
        }

        .mito-nav-primary {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1 1 auto;
          min-width: 0;
        }

        .mito-nav-brand {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .mito-nav-brand-link {
          text-decoration: none;
          color: inherit;
          font-size: 1.35rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .mito-nav-brand-link img,
        .mito-nav-brand-link svg {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .mito-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        /* ------------------------- */
        /* DESKTOP MENU              */
        /* ------------------------- */
        .mito-nav-menu-bar {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0.25rem;
        }

        .mito-nav-item {
          position: relative;
        }

        .mito-nav-link {
          background: transparent;
          border: none;
          font-family: inherit;
          font-size: 1rem;
          color: inherit;
          font-weight: 500;
          cursor: pointer;
          padding: 0.5rem 0.9rem;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          text-decoration: none;
          transition: color 0.2s ease, background-color 0.2s ease;
          white-space: nowrap;
        }
        .mito-nav-link:hover,
        .mito-nav-link[aria-expanded="true"] {
          color: var(--mito-nav-hover);
          background-color: rgba(128, 128, 128, 0.08);
        }
        .mito-nav-dark .mito-nav-link:hover,
        .mito-nav-dark .mito-nav-link[aria-expanded="true"] {
          color: var(--mito-nav-hover-dark);
        }
        .mito-nav-link.mito-nav-active {
          color: var(--mito-nav-active);
          font-weight: 600;
        }
        .mito-nav-link:focus-visible {
          outline: 2px solid var(--mito-nav-active);
          outline-offset: 2px;
        }

        .mito-nav-chevron {
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
          fill: currentColor;
        }
        .mito-nav-link[aria-expanded="true"] .mito-nav-chevron {
          transform: rotate(180deg);
        }

        /* ------------------------- */
        /* DROPDOWN & SUB-DROPDOWN   */
        /* ------------------------- */
        .mito-nav-dropdown,
        .mito-nav-sub-dropdown {
          position: absolute;
          background-color: var(--mito-nav-dropdown-bg);
          border-radius: 12px;
          min-width: 250px;
          display: flex;
          flex-direction: column;
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
          border: 1px solid var(--mito-nav-border);
        }
        .mito-nav-dropdown {
          top: calc(100% + 12px);
          left: 0;
          transform: translateY(-8px);
        }
        .mito-nav-sub-dropdown {
          top: -8px;
          left: calc(100% + 10px);
          padding: 0.5rem;
          transform: translateX(-6px);
          z-index: 1010;
        }
        .mito-nav-dark .mito-nav-dropdown,
        .mito-nav-dark .mito-nav-sub-dropdown {
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.55);
        }

        .mito-nav-design-neumorphic .mito-nav-dropdown,
        .mito-nav-design-neumorphic .mito-nav-sub-dropdown {
          background-color: var(--mito-nav-env-bg);
          border: none;
          box-shadow: var(--mito-nav-x) var(--mito-nav-y) var(--mito-nav-blur) var(--mito-nav-shadow-dark),
                      calc(var(--mito-nav-x) * -1) calc(var(--mito-nav-y) * -1) var(--mito-nav-blur) var(--mito-nav-shadow-light);
        }

        .mito-nav-glass .mito-nav-dropdown,
        .mito-nav-glass .mito-nav-sub-dropdown {
          background-color: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .mito-nav-dark.mito-nav-glass .mito-nav-dropdown,
        .mito-nav-dark.mito-nav-glass .mito-nav-sub-dropdown {
          background-color: rgba(24, 24, 27, 0.86);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .mito-nav-dropdown.active {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
        }

        .mito-nav-sub-item {
          position: relative;
        }

        .mito-nav-sub-dropdown.active {
          visibility: visible;
          opacity: 1;
          transform: translateX(0);
        }

        @media (min-width: 1025px) and (hover: hover) {
          .mito-nav-sub-item:hover > .mito-nav-sub-dropdown {
            visibility: visible;
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mito-nav-dropdown-content {
          display: flex;
          flex-direction: row;
        }
        .mito-nav-dropdown-group {
          padding: 1rem;
          flex: 1;
          min-width: 230px;
        }
        .mito-nav-dropdown-group:not(:last-child) {
          border-right: 1px solid var(--mito-nav-border);
        }

        .mito-nav-dropdown-title {
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--mito-nav-text-muted);
          letter-spacing: 0.06em;
          margin-bottom: 0.65rem;
          display: block;
          padding-left: 0.5rem;
        }

        .mito-nav-dropdown-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .mito-nav-dropdown-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.55rem;
          text-decoration: none;
          color: inherit;
          border-radius: 8px;
          transition: background-color 0.18s ease, color 0.18s ease;
          box-sizing: border-box;
        }
        .mito-nav-sub-trigger {
          width: 100%;
          background: transparent;
          border: none;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          justify-content: space-between;
        }
        .mito-nav-dropdown-link-main {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }
        .mito-nav-sub-chevron {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: var(--mito-nav-text-muted);
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .mito-nav-sub-item:hover > .mito-nav-sub-trigger .mito-nav-sub-chevron,
        .mito-nav-sub-trigger[aria-expanded="true"] .mito-nav-sub-chevron {
          color: var(--mito-nav-hover);
        }

        .mito-nav-dropdown-link:hover {
          background-color: rgba(128, 128, 128, 0.1);
          color: var(--mito-nav-hover);
        }
        .mito-nav-dark .mito-nav-dropdown-link:hover {
          color: var(--mito-nav-hover-dark);
        }
        .mito-nav-dropdown-link.mito-nav-active {
          color: var(--mito-nav-active);
          background-color: rgba(128, 128, 128, 0.08);
        }

        .mito-nav-dropdown-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }
        .mito-nav-dropdown-icon img,
        .mito-nav-dropdown-icon svg {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .mito-nav-dropdown-text {
          display: flex;
          flex-direction: column;
        }
        .mito-nav-dropdown-label {
          font-weight: 600;
          font-size: 0.925rem;
        }
        .mito-nav-dropdown-desc {
          font-size: 0.78rem;
          color: var(--mito-nav-text-muted);
          margin-top: 0.15rem;
          line-height: 1.3;
        }

        /* ------------------------- */
        /* MOBILE HAMBURGER & DRAWER */
        /* ------------------------- */
        .mito-nav-hamburger {
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
        .mito-nav-hamburger:hover {
          background-color: rgba(128, 128, 128, 0.1);
        }

        .mito-nav-mobile-actions {
          display: none;
        }

        @media (max-width: 1024px) {
          .mito-nav-container {
            padding: 0.75rem 1.25rem;
            min-height: 68px;
          }
          .mito-nav-hamburger {
            display: inline-flex;
          }
          .mito-nav-desktop-actions {
            display: none;
          }

          .mito-nav-menu-bar {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: var(--mito-nav-bg);
            border-top: 1px solid var(--mito-nav-border);
            border-bottom: 1px solid var(--mito-nav-border);
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.14);
          }
          .mito-nav-dark .mito-nav-menu-bar {
            background-color: var(--mito-nav-bg-dark);
          }
          .mito-nav-design-neumorphic .mito-nav-menu-bar {
            background-color: var(--mito-nav-env-bg);
            border: none;
          }
          .mito-nav-glass .mito-nav-menu-bar {
            background-color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
          }
          .mito-nav-dark.mito-nav-glass .mito-nav-menu-bar {
            background-color: rgba(24, 24, 27, 0.92);
          }

          .mito-nav-menu-bar.mobile-open {
            max-height: 82vh;
            overflow-y: auto;
            padding: 0.5rem 0 1rem 0;
          }

          .mito-nav-item {
            width: 100%;
            border-bottom: 1px solid var(--mito-nav-border);
          }
          .mito-nav-item:last-of-type {
            border-bottom: none;
          }

          .mito-nav-link {
            width: 100%;
            justify-content: space-between;
            padding: 0.95rem 1.5rem;
            border-radius: 0;
          }

          .mito-nav-dropdown,
          .mito-nav-sub-dropdown {
            position: static;
            box-shadow: none !important;
            border: none !important;
            opacity: 1;
            visibility: visible;
            transform: none;
            display: none;
            background-color: transparent !important;
            backdrop-filter: none !important;
            min-width: 100%;
          }
          .mito-nav-dropdown.active {
            display: block;
            padding-bottom: 0.75rem;
          }
          .mito-nav-sub-dropdown.active {
            display: block;
            padding: 0.25rem 0 0.5rem 1.25rem;
            margin-left: 0.75rem;
            border-left: 2px solid var(--mito-nav-border) !important;
            border-radius: 0;
          }
          .mito-nav-sub-trigger[aria-expanded="true"] .mito-nav-sub-chevron {
            transform: rotate(90deg);
          }

          .mito-nav-dropdown-content {
            flex-direction: column;
          }
          .mito-nav-dropdown-group {
            border-right: none !important;
            padding: 0.5rem 1.5rem;
          }

          .mito-nav-mobile-actions {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.75rem;
            padding: 1rem 1.5rem 0.25rem 1.5rem;
            border-top: 1px solid var(--mito-nav-border);
          }
        }
      `}} />

      <div className="mito-nav-container">
        {logoPosition === 'left' && renderBrandBlock()}

        <div className="mito-nav-primary">
          <nav aria-label="Primary">
            <ul className={`mito-nav-menu-bar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              {navItems.map((item, index) => {
                const hasDropdown = Boolean(item.dropdownGroups && item.dropdownGroups.length > 0);
                const isOpen = activeDropdown === index;

                return (
                  <li key={index} className="mito-nav-item">
                    {hasDropdown ? (
                      <button
                        type="button"
                        className={`mito-nav-link ${item.isActive ? 'mito-nav-active' : ''}`}
                        aria-haspopup="true"
                        aria-expanded={isOpen}
                        onClick={(e) => toggleDropdown(index, e)}
                      >
                        {item.label}
                        <svg className="mito-nav-chevron" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </button>
                    ) : (
                      <NavigationMenuLink
                        href={item.href || '#'}
                        linkComponent={linkComponent}
                        isActive={item.isActive}
                        className="mito-nav-link"
                        onNavigate={handleLinkNavigate}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    )}

                    {hasDropdown && (
                      <div className={`mito-nav-dropdown ${isOpen ? 'active' : ''}`}>
                        <div className="mito-nav-dropdown-content">
                          {item.dropdownGroups!.map((group, gIndex) => (
                            <div key={gIndex} className="mito-nav-dropdown-group">
                              {group.title && <span className="mito-nav-dropdown-title">{group.title}</span>}
                              {renderDropdownItems(group.items, `${index}-${gIndex}`)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}

              {hasActions && (
                <li className="mito-nav-mobile-actions">
                  {actionsNode}
                  {rightActions.map((action, i) => (
                    <React.Fragment key={i}>{action}</React.Fragment>
                  ))}
                </li>
              )}
            </ul>
          </nav>
          {children}
        </div>

        <div className="mito-nav-desktop-actions">
          {renderActionsBlock()}
        </div>

        {logoPosition === 'right' && renderBrandBlock()}

        <button
          type="button"
          className="mito-nav-hamburger"
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
    </Comp>
  );
});

NavigationMenu.displayName = 'NavigationMenu';

/* -------------------------------------------------------------------------- */
/* EXPORTED SUB-COMPONENTS FOR DEEP COMPOSITE CONTROL                         */
/* -------------------------------------------------------------------------- */

export const NavigationMenuBrand = React.forwardRef<HTMLDivElement, NavigationMenuSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-nav-brand ${className}`} {...props} />;
});
NavigationMenuBrand.displayName = 'NavigationMenuBrand';

export const NavigationMenuActions = React.forwardRef<HTMLDivElement, NavigationMenuSubComponentProps>(({
  asChild, className = "", ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-nav-actions ${className}`} {...props} />;
});
NavigationMenuActions.displayName = 'NavigationMenuActions';