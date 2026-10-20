"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";


export interface NavDropdownItem {
  /** The display label for the dropdown link. */
  title: string;
  /** Optional secondary text providing context for the link. */
  description?: string;
  /** ReactNode representing the icon next to the dropdown link. */
  icon?: React.ReactNode;
  /** The destination URL or routing path. */
  href: string;
}

export interface NavDropdownGroup {
  /** Optional header title for a specific group of links inside a dropdown. */
  title?: string;
  /** Array of items belonging to this group. */
  items: NavDropdownItem[];
}

export interface NavItem {
  /** The top-level menu label. */
  label: string;
  /** Optional destination if the top-level item is a direct link rather than a dropdown. */
  href?: string;
  /** Optional array of grouped links to display in a dropdown menu. */
  dropdownGroups?: NavDropdownGroup[];
}

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Text or ReactNode representing the brand logo. */
  brandLogo: React.ReactNode;
  /** URL for the brand logo link. @default "/" */
  brandHref?: string;
  /** Array of structural navigation items. */
  navItems: NavItem[];
  /** Array of ReactNodes (usually icon buttons) rendered on the far right of the menu. */
  rightActions?: React.ReactNode[];
  /** The architectural design system variation. @default 'outline' */
  design?: DesignVariant;
  /** Explicit background color override for the navigation bar. */
  backgroundColor?: string;
  /** Custom font family applied globally to the navigation content. @default '"Bodoni Moda Variable", sans-serif' */
  fontFamily?: string;
  /** Force dark mode rendering independent of the global context. */
  darkMode?: boolean;
  /** Dynamic light/dark mode colors to override global context. */
  darkModeColors?: { light: string; dark: string };
  /** Neumorphic 3D extrusion distance in pixels. @default 6 */
  elevation?: number;
  /** Opacity multiplier for the Neumorphic shadow intensity. @default 1 */
  neuIntensity?: number;
}

/**
 * @component NavigationMenu
 * @description Accessible, SSR-safe, and fully responsive navigation bar.
 * Natively supports multi-column dropdowns, hide-on-scroll behavior, and dynamic Neumorphic typography/layouts.
 */
export const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(({
  brandLogo,
  brandHref = "/",
  navItems = [],
  rightActions = [],
  design = 'outline',
  backgroundColor,
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
  darkMode = false,
  darkModeColors,
  elevation = 6,
  neuIntensity = 1,
  className = "",
  style,
  ...props
}, ref): JSX.Element => {

  const navRef = useRef<HTMLElement | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  const lastScrollY = useRef(0);

  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #800020)';
  
  const baseBg = backgroundColor || (darkMode ? '#1b1c1d' : '#ffffff');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isMobileMenuOpen) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 123) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
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
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (design === 'neumorphic' && navRef.current) {
      const envBg = backgroundColor || (typeof document !== 'undefined' ? getNearestParentBackground(document.body) : baseBg);
      const blur = elevation * 2;
      const shadowDark = adjustColor(envBg, -15 * neuIntensity);
      const shadowLight = adjustColor(envBg, 15 * neuIntensity);

      setNeuVars({
        '--nav-bg': envBg,
        '--nav-shadow-dark': shadowDark,
        '--nav-shadow-light': shadowLight,
        '--nav-dist': `${elevation}px`,
        '--nav-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, neuIntensity, backgroundColor, baseBg]);

  const toggleDropdown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const closeMenu = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--nav-font': fontFamily,
    '--nav-base-bg': baseBg,
    '--nav-text': darkMode ? '#ffffff' : '#0B0B45',
    '--nav-text-muted': darkMode ? '#a9a9a9' : '#6b7280',
    '--nav-hover': darkMode ? '#a9a9a9' : resolvedBrandColor,
    '--nav-border': darkMode ? '#333333' : '#e5e7eb',
    '--nav-dropdown-bg': darkMode ? '#1b1c1d' : '#ffffff',
    ...neuVars,
  } as React.CSSProperties;

  return (
    <header
      ref={(node: HTMLElement | null) => {
        navRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      className={`v-nav-header v-nav-${design} ${className}`}
      style={{
        ...cssVariables,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        ...style
      }}
      aria-label="Main Navigation"
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .v-nav-header {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
          font-family: var(--nav-font); color: var(--nav-text);
          background-color: var(--nav-base-bg);
          transition: transform 0.3s ease-in-out, background-color 0.3s ease, border-color 0.3s ease;
        }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        .v-nav-outline { border-bottom: 1px solid var(--nav-border); }
        .v-nav-material { box-shadow: 0 2px 10px rgba(0, 0, 0, ${darkMode ? 0.3 : 0.08}); }
        .v-nav-neumorphic {
          background-color: var(--nav-bg); border: none;
          box-shadow: 0 var(--nav-dist) var(--nav-blur) var(--nav-shadow-dark);
        }

        /* ------------------------- */
        /* LAYOUT CONTAINERS         */
        /* ------------------------- */
        .v-nav-container {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1600px; margin: 0 auto; padding: 1.2rem 3rem; height: 90px;
          box-sizing: border-box;
        }

        .v-nav-left { display: flex; align-items: center; }
        .v-nav-right { display: flex; align-items: center; gap: 1rem; }

        .v-nav-brand {
          text-decoration: none; color: inherit; font-size: 1.5rem; font-weight: 700;
          margin-right: 2.5rem; display: flex; align-items: center;
        }

        /* ------------------------- */
        /* DESKTOP MENU              */
        /* ------------------------- */
        .v-nav-menu-bar {
          display: flex; align-items: center; list-style: none; margin: 0; padding: 0;
        }

        .v-nav-item { position: relative; }
        
        .v-nav-link {
          background: transparent; border: none; font-family: inherit; font-size: 1.1rem;
          color: inherit; font-weight: 500; cursor: pointer; padding: 0.5rem 1rem;
          display: flex; align-items: center; gap: 0.25rem; text-decoration: none;
          transition: color 0.2s ease;
        }
        .v-nav-link:hover, .v-nav-link[aria-expanded="true"] { color: var(--nav-hover); }

        .v-nav-chevron { width: 16px; height: 16px; transition: transform 0.2s ease; fill: currentColor; }
        .v-nav-link[aria-expanded="true"] .v-nav-chevron { transform: rotate(180deg); }

        /* ------------------------- */
        /* DROPDOWN MENUS            */
        /* ------------------------- */
        .v-nav-dropdown {
          position: absolute; top: calc(100% + 15px); left: 0;
          background-color: var(--nav-dropdown-bg); border-radius: 10px;
          min-width: 260px; display: flex; flex-direction: column;
          visibility: hidden; opacity: 0; transform: translateY(-10px);
          transition: all 0.2s ease-in-out;
          box-shadow: 0 10px 25px rgba(0, 0, 0, ${darkMode ? 0.5 : 0.1});
          border: 1px solid var(--nav-border);
        }
        
        .v-nav-neumorphic .v-nav-dropdown {
          background-color: var(--nav-bg); border: none;
          box-shadow: var(--nav-dist) var(--nav-dist) var(--nav-blur) var(--nav-shadow-dark), 
                      calc(var(--nav-dist) * -1) calc(var(--nav-dist) * -1) var(--nav-blur) var(--nav-shadow-light);
        }

        .v-nav-dropdown.active { visibility: visible; opacity: 1; transform: translateY(0); }
        
        /* Multiple Groups side-by-side if needed */
        .v-nav-dropdown-content { display: flex; flex-direction: row; }
        .v-nav-dropdown-group { padding: 1rem; flex: 1; min-width: 240px; }
        .v-nav-dropdown-group:not(:last-child) { border-right: 1px solid var(--nav-border); }

        .v-nav-dropdown-title {
          font-weight: 700; font-size: 0.85rem; text-transform: uppercase;
          color: var(--nav-text); opacity: 0.8; letter-spacing: 0.05em;
          margin-bottom: 0.75rem; display: block; padding-left: 0.5rem;
        }

        .v-nav-dropdown-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.25rem; }

        .v-dropdown-link {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0.5rem;
          text-decoration: none; color: inherit; border-radius: 6px; transition: background-color 0.2s, color 0.2s;
        }
        .v-dropdown-link:hover { background-color: rgba(128,128,128,0.1); color: var(--nav-hover); }

        .v-dropdown-icon { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; flex-shrink: 0; }
        .v-dropdown-icon img, .v-dropdown-icon svg { width: 100%; height: 100%; object-fit: contain; }

        .v-dropdown-text { display: flex; flex-direction: column; }
        .v-dropdown-label { font-weight: 600; font-size: 0.95rem; }
        .v-dropdown-desc { font-size: 0.8rem; color: var(--nav-text-muted); margin-top: 0.15rem; line-height: 1.2; }

        /* ------------------------- */
        /* MOBILE HAMBURGER          */
        /* ------------------------- */
        .v-nav-hamburger {
          display: none; background: transparent; border: none; color: inherit;
          font-size: 2rem; cursor: pointer; padding: 0.5rem; margin-left: 1rem;
        }

        @media (max-width: 1100px) {
          .v-nav-container { padding: 1rem 1.5rem; }
          .v-nav-hamburger { display: block; }
          .v-nav-right { display: none; } /* Hide right actions on mobile to save space, or move into menu */
          
          .v-nav-menu-bar {
            position: absolute; top: 100%; left: 0; width: 100%;
            background-color: var(--nav-base-bg); border-top: 1px solid var(--nav-border);
            border-bottom: 1px solid var(--nav-border);
            flex-direction: column; align-items: stretch;
            max-height: 0; overflow: hidden; transition: max-height 0.3s ease-in-out;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          .v-nav-neumorphic .v-nav-menu-bar { background-color: var(--nav-bg); border: none; }
          
          .v-nav-menu-bar.mobile-open { max-height: 80vh; overflow-y: auto; padding: 1rem 0; }

          .v-nav-item { width: 100%; border-bottom: 1px solid var(--nav-border); }
          .v-nav-item:last-child { border-bottom: none; }
          
          .v-nav-link { width: 100%; justify-content: space-between; padding: 1rem 1.5rem; }
          
          .v-nav-dropdown {
            position: static; box-shadow: none; border: none; opacity: 1; visibility: visible;
            transform: none; display: none; background-color: transparent; min-width: 100%;
          }
          .v-nav-dropdown.active { display: block; padding-bottom: 1rem; }
          
          .v-nav-dropdown-content { flex-direction: column; }
          .v-nav-dropdown-group { border-right: none !important; padding: 0.5rem 1.5rem; }
        }
      `}} />

      <div className="v-nav-container">
        
        <div className="v-nav-left">
          <a href={brandHref} className="v-nav-brand" onClick={closeMenu}>
            {brandLogo}
          </a>

          <nav>
            <ul className={`v-nav-menu-bar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              {navItems.map((item, index) => {
                const hasDropdown = item.dropdownGroups && item.dropdownGroups.length > 0;
                const isActive = activeDropdown === index;

                return (
                  <li key={index} className="v-nav-item">
                    {hasDropdown ? (
                      <button
                        className="v-nav-link"
                        aria-haspopup="true"
                        aria-expanded={isActive}
                        onClick={(e) => toggleDropdown(index, e)}
                      >
                        {item.label}
                        <svg className="v-nav-chevron" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </button>
                    ) : (
                      <a href={item.href || '#'} className="v-nav-link" onClick={closeMenu}>
                        {item.label}
                      </a>
                    )}

                    {hasDropdown && (
                      <div className={`v-nav-dropdown ${isActive ? 'active' : ''}`}>
                        <div className="v-nav-dropdown-content">
                          {item.dropdownGroups!.map((group, gIndex) => (
                            <div key={gIndex} className="v-nav-dropdown-group">
                              {group.title && <span className="v-nav-dropdown-title">{group.title}</span>}
                              <ul className="v-nav-dropdown-list" role="menu">
                                {group.items.map((dropItem, dIndex) => (
                                  <li key={dIndex} role="menuitem">
                                    <a href={dropItem.href} className="v-dropdown-link" onClick={closeMenu}>
                                      {dropItem.icon && <div className="v-dropdown-icon" aria-hidden="true">{dropItem.icon}</div>}
                                      <div className="v-dropdown-text">
                                        <span className="v-dropdown-label">{dropItem.title}</span>
                                        {dropItem.description && <span className="v-dropdown-desc">{dropItem.description}</span>}
                                      </div>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="v-nav-right">
          {rightActions.map((action, i) => (
            <React.Fragment key={i}>
              {action}
            </React.Fragment>
          ))}
        </div>

        <button
          className="v-nav-hamburger"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>

      </div>
    </header>
  );
});

NavigationMenu.displayName = 'NavigationMenu';