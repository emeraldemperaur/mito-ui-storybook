"use client";

import React, { useRef, useState, useEffect, type JSX, type ReactNode } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground, type ButtonColorOverrides } from "../../utils/Vinci";
import { useGlobalUIContext } from "../Layout/GlobalUIContext";
import { Button } from '../Buttons/Button';

export type ModalLayout = 'fullscreen' | 'xl' | 'medium' | 'top' | 'bottom' | 'left' | 'right';
export type ModalPosition = 'left' | 'center' | 'right' | 'full';
export type ModalDesignVariant = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

let globalModalCount = 0;

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls the visibility state of the modal. */
  isOpen: boolean;
  /** Callback fired when the overlay is clicked, the escape key is pressed, or the default close button is triggered. */
  onClose: () => void;
  
  // --- LAYOUT & POSITIONING ---
  /** Structural blueprint of the modal. Controls width, height, and entrance animation trajectory. @default 'medium' */
  layout?: ModalLayout;
  /** Alignment on the X-axis. Only applies when layout is 'top' or 'bottom'. @default 'center' */
  position?: ModalPosition;
  
  // --- COMPOSITE INJECTIONS ---
  /** Optional standard title injected into the default header. */
  title?: string;
  /** Optional subtitle or description injected immediately below the title in the default header. */
  subtitle?: string;
  /** Optional icon node placed adjacent to the title. */
  icon?: ReactNode;
  /** Explicit instruction dictating the icon's position relative to the title/subtitle flexbox. @default 'left-of-title' */
  iconPosition?: 'left-of-title' | 'right-of-title';
  /** Completely replaces the default header block with a custom React node. */
  headerNode?: ReactNode;
  /** Completely replaces the default action footer block with a custom React node. */
  footerNode?: ReactNode;
  /** Visually detaches and hides the header block. @default false */
  hideHeader?: boolean;
  /** Visually detaches and hides the footer block. @default false */
  hideFooter?: boolean;
  /** Flexbox justification for the default header. @default 'space-between' */
  headerJustify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  /** Flexbox justification for the default footer. @default 'flex-end' */
  footerJustify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';

  // --- DEFAULT FOOTER ACTION OVERRIDES ---
  /** Callback fired by the default 'Confirm' button. */
  onConfirm?: () => void | Promise<void>;
  /** Override text for the default 'Confirm' button. @default 'Confirm' */
  confirmText?: string;
  /** Override text for the default 'Cancel' button. @default 'Cancel' */
  cancelText?: string;
  /** Button aesthetic variant for the Confirm action. @default 'material' */
  confirmVariant?: 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';
  /** Triggers the loading state on the Confirm button, disabling interaction. */
  isConfirmLoading?: boolean;
  /** Granular color overrides for the default Confirm button. */
  confirmButtonOverrides?: ButtonColorOverrides;
  /** Granular color overrides for the default Cancel button. */
  cancelButtonOverrides?: ButtonColorOverrides;
  
  // --- AESTHETIC & DESIGN CONTROLS ---
  /** The architectural design system variation. @default 'material' */
  design?: ModalDesignVariant;
  /** Explicit background color override for light mode contexts. */
  backgroundColor?: string;
  /** Explicit background color override specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Explicit text color override for light mode contexts. */
  textColor?: string;
  /** Explicit text color override specifically for dark mode contexts. */
  darkTextColor?: string;
  /** Explicit title text color override for light mode. */
  titleColor?: string;
  /** Explicit title text color override for dark mode. */
  darkTitleColor?: string;
  /** Explicit subtitle text color override for light mode. */
  subtitleColor?: string;
  /** Explicit subtitle text color override for dark mode. */
  darkSubtitleColor?: string;
  /** Explicit override for the default 'X' close icon color. */
  closeIconColor?: string;
  /** Explicit override for the default 'X' close icon hover background/text state. */
  closeIconHoverColor?: string;
  /** Custom font family applied globally to the modal content. */
  fontFamily?: string;
  /** Toggles an enterprise-grade frosted glassmorphism aesthetic using backdrop filters. @default false */
  trueGlass?: boolean;
  /** Explicit override for the container border radius. @default '16px' */
  borderRadius?: string | number;
  /** Force dark mode rendering independent of the global context or system preference. @default false */
  darkMode?: boolean;
  /** Dynamic light/dark mode fallback color mapping for the active brand token. */
  darkModeColors?: { light: string; dark: string };
  /** Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast. @default 1 */
  neuIntensity?: number;
  /** Z-Axis elevation for 3D depth extrusion (Neumorphic/Skeuomorphic variants). @default 12 */
  elevation?: number;
  /** Global lighting angle that dictates the X and Y shadow trajectories. @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** If true, merges component DOM into the immediate child via Radix Slot. @default false */
  asChild?: boolean;
}

export interface ModalSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
}

/**
 * @component Modal
 * @description Master enterprise composite overlay. Natively supports dynamic z-index stacking for associated modals, 
 * rigorous body scroll-locking, CSS container adaptations, and deep 3D structural aesthetics.
 */
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onClose,
  layout = 'medium',
  design = 'material',
  position = 'center',
  asChild = false,
  title,
  subtitle,
  icon,
  iconPosition = 'left-of-title',
  children,
  headerNode,
  footerNode,
  hideHeader = false,
  hideFooter = false,
  headerJustify = 'space-between',
  footerJustify = 'flex-end',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant,
  isConfirmLoading = false,
  confirmButtonOverrides,
  cancelButtonOverrides,
  fontFamily = '"Bodoni Moda Variable", -apple-system, sans-serif',
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  titleColor,
  darkTitleColor,
  subtitleColor,
  darkSubtitleColor,
  closeIconColor,
  closeIconHoverColor,
  trueGlass = false,
  borderRadius = '16px',
  darkMode = false,
  darkModeColors,
  neuIntensity = 1,
  elevation = 12,
  lightSource = 'top-left',
  className = "",
  style,
  ...props
}, ref): JSX.Element | null => {

  const [mounted, setMounted] = useState(false);
  const [zIndex, setZIndex] = useState(9999);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const titleId = React.useId();
  
  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)';

  useEffect(() => {
    setMounted(true);
    
    if (isOpen && typeof document !== 'undefined') {
      globalModalCount++;
      // Increment Z-Index dynamically for nested associated modals (e.g. 9999 -> 10009 -> 10019)
      setZIndex(9999 + (globalModalCount * 10));
      
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        // Only close the topmost modal
        if (e.key === 'Escape' && globalModalCount === Math.floor((zIndex - 9999) / 10)) {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        globalModalCount--;
        if (globalModalCount === 0) {
          document.body.style.overflow = '';
        }
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose, zIndex]);

  useEffect(() => {
    if (isOpen && (design === 'neumorphic' || design === 'skeuomorphic') && overlayRef.current) {
      // Intelligently adapt the 3D surface to match the closest DOM environment
      const parentBg = backgroundColor || getNearestParentBackground(document.body) || (darkMode ? '#1f2937' : '#f8fafc');
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -15 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 15 * neuIntensity);

      setNeuVars({
        '--mito-modal-bg-env': parentBg,
        '--mito-modal-shadow-dark': shadowDark,
        '--mito-modal-shadow-light': shadowLight,
        '--mito-modal-x': `${x}px`,
        '--mito-modal-y': `${y}px`,
        '--mito-modal-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [isOpen, design, elevation, lightSource, neuIntensity, backgroundColor, darkMode]);

  if (!mounted || !isOpen) return null;

  const resolvedRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
  
  // Determine standard vs custom header title/subtitle colors
  const defaultTitleColor = darkMode ? '#f9fafb' : '#111827';
  const resolvedTitleColor = darkMode ? (darkTitleColor || titleColor || defaultTitleColor) : (titleColor || defaultTitleColor);
  
  const defaultSubtitleColor = darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
  const resolvedSubtitleColor = darkMode ? (darkSubtitleColor || subtitleColor || defaultSubtitleColor) : (subtitleColor || defaultSubtitleColor);

  const cssVariables = {
    '--ui-brand-color': resolvedBrandColor,
    '--mito-modal-font': fontFamily,
    '--mito-modal-base-bg': backgroundColor || (darkMode ? '#1f2937' : '#ffffff'),
    '--mito-modal-base-bg-dark': darkBackgroundColor || backgroundColor || '#1f2937',
    '--mito-modal-text': textColor || (darkMode ? '#f9fafb' : '#111827'),
    '--mito-modal-text-dark': darkTextColor || textColor || '#f9fafb',
    '--mito-modal-border': darkMode ? '#374151' : '#e5e7eb',
    '--mito-modal-divider': darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    '--mito-modal-overlay-bg': darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(17, 24, 39, 0.4)',
    '--mito-modal-z-index': zIndex,
    '--mito-modal-title-c': resolvedTitleColor,
    '--mito-modal-subtitle-c': resolvedSubtitleColor,
    ...(closeIconColor ? { '--mito-modal-close-icon': closeIconColor } : {}),
    ...(closeIconHoverColor ? { '--mito-modal-close-hover': closeIconHoverColor } : {}),
    ...(resolvedRadius ? { '--mito-modal-radius': resolvedRadius } : {}),
    ...neuVars,
  } as React.CSSProperties;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const hasHeader = title || icon || headerNode;
  const hasFooter = onConfirm || footerNode;

  const Comp = asChild ? Slot : "div";
  const themeClass = darkMode ? 'mito-modal-dark' : '';
  const glassClass = trueGlass ? 'mito-modal-glass' : '';

  return (
    <div 
      ref={overlayRef}
      className={`mito-modal-overlay ${themeClass}`} 
      style={cssVariables}
      onClick={handleOverlayClick}
      aria-hidden="false"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .mito-modal-overlay { 
          position: fixed; inset: 0; z-index: var(--mito-modal-z-index); 
          display: flex; box-sizing: border-box; 
          background-color: var(--mito-modal-overlay-bg); 
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          animation: mito-overlayFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          font-family: var(--mito-modal-font); 
          
          align-items: ${layout === 'top' ? 'flex-start' : layout === 'bottom' ? 'flex-end' : 'center'};
          justify-content: ${layout === 'left' ? 'flex-start' : layout === 'right' ? 'flex-end' : position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center'};
          padding: ${(layout === 'fullscreen' || layout === 'left' || layout === 'right' || position === 'full') ? '0' : '1.5rem'};
        }

        .mito-modal-container { 
          display: flex; flex-direction: column; box-sizing: border-box; position: relative;
          color: var(--mito-modal-text);
          border-radius: var(--mito-modal-radius, 16px);
          max-height: 100%;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .mito-modal-dark .mito-modal-container { color: var(--mito-modal-text-dark); }

        /* ------------------------- */
        /* LAYOUT ARCHITECTURES      */
        /* ------------------------- */
        .mito-layout-medium { width: 100%; max-width: 600px; animation: mito-popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .mito-layout-xl { width: 100%; max-width: 1140px; animation: mito-popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .mito-layout-fullscreen { width: 100vw; height: 100vh; border-radius: 0; animation: mito-slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .mito-layout-top { width: 100%; max-width: 500px; border-top-left-radius: 0; border-top-right-radius: 0; animation: mito-slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; margin-top: -1.5rem; }
        .mito-layout-bottom { width: 100%; max-width: 500px; border-bottom-left-radius: 0; border-bottom-right-radius: 0; animation: mito-slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; margin-bottom: -1.5rem; }
        
        /* FIX: High-specificity reset for position="full" on top/bottom layouts */
        /* Using 100% instead of 100vw prevents OS-level vertical scrollbars from triggering a horizontal scroll */
        .mito-layout-top.mito-pos-full,
        .mito-layout-bottom.mito-pos-full {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }

        .mito-layout-left { width: 100%; max-width: 450px; height: 100vh; max-height: 100vh; border-top-left-radius: 0; border-bottom-left-radius: 0; animation: mito-slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .mito-layout-right { width: 100%; max-width: 450px; height: 100vh; max-height: 100vh; border-top-right-radius: 0; border-bottom-right-radius: 0; animation: mito-slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .mito-layout-top.mito-pos-left { margin-left: -1.5rem; border-bottom-left-radius: 0; }
        .mito-layout-top.mito-pos-right { margin-right: -1.5rem; border-bottom-right-radius: 0; }
        .mito-layout-bottom.mito-pos-left { margin-left: -1.5rem; border-top-left-radius: 0; }
        .mito-layout-bottom.mito-pos-right { margin-right: -1.5rem; border-top-right-radius: 0; }

        /* ------------------------- */
        /* DESIGN VARIANTS           */
        /* ------------------------- */
        .mito-design-outline { background-color: var(--mito-modal-base-bg); border: 1px solid var(--mito-modal-border); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
        .mito-modal-dark .mito-design-outline { background-color: var(--mito-modal-base-bg-dark); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }

        .mito-design-material { background-color: var(--mito-modal-base-bg); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: 1px solid var(--mito-modal-border); }
        .mito-modal-dark .mito-design-material { background-color: var(--mito-modal-base-bg-dark); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); }

        .mito-design-neumorphic { 
          background-color: var(--mito-modal-bg-env); border: none; 
        }

        .mito-design-skeuomorphic {
          background-color: var(--mito-modal-bg-env);
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.02) 100%);
          border: 1px solid rgba(0,0,0,0.15);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.6), 0 25px 50px -12px rgba(0,0,0,0.3);
        }
        .mito-modal-dark .mito-design-skeuomorphic {
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.2) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.15), 0 25px 50px -12px rgba(0,0,0,0.6);
        }

        /* ------------------------- */
        /* TRUEGLASS SUPPORT         */
        /* ------------------------- */
        .mito-modal-glass { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
        
        .mito-design-outline.mito-modal-glass, .mito-design-material.mito-modal-glass { 
          background-color: rgba(255, 255, 255, 0.15); 
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3); 
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .mito-modal-dark .mito-design-outline.mito-modal-glass, .mito-modal-dark .mito-design-material.mito-modal-glass { 
          background-color: rgba(255, 255, 255, 0.03); 
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .mito-design-neumorphic.mito-modal-glass { 
          background-color: rgba(255, 255, 255, 0.05); 
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), var(--mito-modal-x) var(--mito-modal-y) var(--mito-modal-blur) var(--mito-modal-shadow-dark); 
        }
        .mito-modal-dark .mito-design-neumorphic.mito-modal-glass {
          background-color: rgba(255, 255, 255, 0.02); 
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), var(--mito-modal-x) var(--mito-modal-y) var(--mito-modal-blur) var(--mito-modal-shadow-dark);
        }
        
        .mito-design-skeuomorphic.mito-modal-glass { 
          background-color: rgba(255, 255, 255, 0.1); 
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.2); 
        }
        .mito-modal-dark .mito-design-skeuomorphic.mito-modal-glass { 
          background-color: rgba(255, 255, 255, 0.04); 
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.5); 
        }

        /* ------------------------- */
        /* SUB-COMPONENTS            */
        /* ------------------------- */
        .mito-modal-header { display: flex; align-items: flex-start; padding: 1.25rem 1.5rem; flex-shrink: 0; border-bottom: 1px solid var(--mito-modal-divider); }
        .mito-design-neumorphic .mito-modal-header { border-bottom: 1px dashed var(--mito-modal-divider); }
        .mito-modal-header.no-border { border-bottom: none; }
        
        .mito-modal-title-group { display: flex; align-items: flex-start; gap: 12px; font-family: inherit; }
        .mito-modal-title-group.icon-right { flex-direction: row-reverse; justify-content: flex-end; }
        .mito-modal-title-text { display: flex; flex-direction: column; gap: 2px; }
        
        .mito-modal-title { margin: 0; font-size: 1.25rem; font-weight: 600; color: var(--mito-modal-title-c); }
        .mito-modal-subtitle { margin: 0; font-size: 0.875rem; color: var(--mito-modal-subtitle-c); font-weight: 400; line-height: 1.4; }
        
        .mito-modal-close-btn { 
          background: transparent; border: none; padding: 6px; border-radius: 6px; 
          cursor: pointer; color: var(--mito-modal-close-icon, inherit); opacity: var(--mito-modal-close-icon, 0.6); display: flex; align-items: center; 
          transition: all 0.2s ease; margin-left: 1rem; flex-shrink: 0;
        }
        /* If custom hover color is provided, opacity stays at 1 */
        .mito-modal-close-btn:hover { 
          opacity: 1; 
          background: var(--mito-modal-close-hover, var(--mito-modal-divider)); 
          color: var(--mito-modal-close-hover, inherit);
        }
        .mito-modal-close-btn:focus-visible { outline: 2px solid var(--ui-brand-color); outline-offset: 2px; }

        .mito-modal-body { flex-grow: 1; padding: 1.5rem; overflow-y: auto; font-size: 0.95rem; line-height: 1.5; font-family: inherit; }
        
        .mito-modal-footer { padding: 1.25rem 1.5rem; flex-shrink: 0; border-top: 1px solid var(--mito-modal-divider); display: flex; align-items: center; gap: 0.75rem; }
        .mito-design-neumorphic .mito-modal-footer { border-top: 1px dashed var(--mito-modal-divider); }
        .mito-modal-footer.no-border { border-top: none; }

        /* Keyframes */
        @keyframes mito-overlayFadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(4px); } }
        @keyframes mito-popIn { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes mito-slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes mito-slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes mito-slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes mito-slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}} />

      <Comp 
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hasHeader ? titleId : undefined}
        className={`mito-modal-container mito-layout-${layout} mito-pos-${position} mito-design-${design} ${glassClass} ${className}`}
        style={style}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        {...props}
      >
        {/* COMPOSITE HEADER */}
        {!hideHeader && hasHeader && (
          <ModalHeader justify={headerJustify}>
            {headerNode ? headerNode : (
              <>
                <div className={`mito-modal-title-group ${iconPosition === 'right-of-title' ? 'icon-right' : ''}`}>
                  {icon && <span aria-hidden="true" style={{ marginTop: '2px' }}>{icon}</span>}
                  <div className="mito-modal-title-text">
                    <ModalTitle id={titleId}>{title}</ModalTitle>
                    {subtitle && <p className="mito-modal-subtitle">{subtitle}</p>}
                  </div>
                </div>
                
                <button className="mito-modal-close-btn" onClick={onClose} aria-label="Close Modal">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </ModalHeader>
        )}

        {/* COMPOSITE BODY */}
        <ModalBody>
          {children}
        </ModalBody>

        {/* COMPOSITE FOOTER */}
        {!hideFooter && hasFooter && (
          <ModalFooter justify={footerJustify}>
            {footerNode ? footerNode : (
              <>
                <Button 
                  variant={design === 'material' ? 'outline' : design} 
                  darkMode={darkMode}
                  onClick={onClose}
                  disabled={isConfirmLoading}
                  style={{ fontFamily: fontFamily }}
                  backgroundColor={cancelButtonOverrides?.backgroundColor}
                  textColor={cancelButtonOverrides?.textColor}
                  darkBackgroundColor={cancelButtonOverrides?.darkBackgroundColor}
                  darkTextColor={cancelButtonOverrides?.darkTextColor}
                  hoverColor={cancelButtonOverrides?.hoverColor}
                  hoverTextColor={cancelButtonOverrides?.hoverTextColor}
                  darkHoverColor={cancelButtonOverrides?.darkHoverColor}
                  darkHoverTextColor={cancelButtonOverrides?.darkHoverTextColor}
                >
                  {cancelText}
                </Button>
                <Button 
                  variant={confirmVariant || design} 
                  darkMode={darkMode}
                  onClick={onConfirm}
                  isLoading={isConfirmLoading}
                  style={{ fontFamily: fontFamily }}
                  backgroundColor={confirmButtonOverrides?.backgroundColor || resolvedBrandColor}
                  textColor={confirmButtonOverrides?.textColor || "#ffffff"}
                  darkBackgroundColor={confirmButtonOverrides?.darkBackgroundColor}
                  darkTextColor={confirmButtonOverrides?.darkTextColor}
                  hoverColor={confirmButtonOverrides?.hoverColor}
                  hoverTextColor={confirmButtonOverrides?.hoverTextColor}
                  darkHoverColor={confirmButtonOverrides?.darkHoverColor}
                  darkHoverTextColor={confirmButtonOverrides?.darkHoverTextColor}
                >
                  {confirmText}
                </Button>
              </>
            )}
          </ModalFooter>
        )}
      </Comp>
    </div>
  );
});

Modal.displayName = 'Modal';

/* -------------------------------------------------------------------------- */
/* EXPORTED SUB-COMPONENTS FOR DEEP COMPOSITE CONTROL                         */
/* -------------------------------------------------------------------------- */

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalSubComponentProps>(({ 
  asChild, justify = 'space-between', className = "", style, ...props 
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-modal-header ${className}`} style={{ justifyContent: justify, ...style }} {...props} />;
});
ModalHeader.displayName = 'ModalHeader';

export const ModalBody = React.forwardRef<HTMLDivElement, ModalSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-modal-body ${className}`} {...props} />;
});
ModalBody.displayName = 'ModalBody';

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalSubComponentProps>(({ 
  asChild, justify = 'flex-end', className = "", style, ...props 
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={`mito-modal-footer ${className}`} style={{ justifyContent: justify, ...style }} {...props} />;
});
ModalFooter.displayName = 'ModalFooter';

export const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalSubComponentProps>(({ asChild, className = "", ...props }, ref) => {
  const Comp = asChild ? Slot : "h2";
  return <Comp ref={ref} className={`mito-modal-title ${className}`} {...props} />;
});
ModalTitle.displayName = 'ModalTitle';