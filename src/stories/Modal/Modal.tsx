"use client";

import React, { useState, useEffect, type JSX } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";

export type ModalLayout = 'fullscreen' | 'xl' | 'bottom';
export type ModalPosition = 'left' | 'center' | 'right';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  layout?: ModalLayout;
  design?: DesignVariant;
  position?: ModalPosition;
  asChild?: boolean;
  title?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  fontFamily?: string;
  backgroundColor?: string;
  darkMode?: boolean;
  darkModeColors?: { light: string; dark: string };
  neuIntensity?: number;
  className?: string;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onClose,
  layout = 'xl',
  design = 'material',
  position = 'right',
  asChild = false,
  title,
  icon,
  children,
  footer,
  fontFamily = '"Bodoni Moda Variable", serif',
  backgroundColor,
  darkMode = false,
  darkModeColors,
  neuIntensity = 1,
  className = "",
  style,
  ...props
}, ref): JSX.Element | null => {

  const [mounted, setMounted] = useState(false);
  const titleId = React.useId();
  
  const globalContext = useGlobalUIContext();
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)';

  useEffect(() => {
    setMounted(true);
    if (isOpen && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const baseBg = backgroundColor || (darkMode ? '#1f2937' : '#f0f4f8');
  const shadowDark = adjustColor(baseBg, -20 * neuIntensity);
  const shadowLight = adjustColor(baseBg, 20 * neuIntensity);

  const cssVariables = {
    '--modal-font': fontFamily,
    '--ui-brand-color': resolvedBrandColor,
    '--modal-bg': baseBg,
    '--modal-text': darkMode ? '#f9fafb' : '#212529',
    '--modal-border': darkMode ? '#374151' : '#e5e7eb',
    '--close-color': darkMode ? '#9ca3af' : '#6b7280',
    '--close-hover': darkMode ? '#ffffff' : '#111827',
    '--overlay-bg': darkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
    '--neu-shadow-dark': shadowDark,
    '--neu-shadow-light': shadowLight,
  } as React.CSSProperties;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const Comp = asChild ? Slot : "div";

  return (
    <div 
      className={`v-modal-overlay v-modal-overlay-${design}`} 
      style={cssVariables}
      onClick={handleOverlayClick}
      aria-hidden="false"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .v-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; display: flex; box-sizing: border-box; background-color: var(--overlay-bg); animation: v-overlayFadeIn 0.2s ease-out forwards; font-family: var(--modal-font); }
        .v-modal-overlay-neumorphic { background-color: ${darkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(240, 244, 248, 0.6)'}; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .v-modal-container { background-color: var(--modal-bg); color: var(--modal-text); display: flex; flex-direction: column; box-sizing: border-box; position: relative; }
        .v-layout-fullscreen { width: 100%; height: 100%; border-radius: 0; animation: v-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .v-layout-xl { width: 100%; max-width: 1140px; max-height: 90vh; margin: auto; border-radius: 12px; animation: v-popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .v-layout-bottom { position: absolute; bottom: 0; width: 100%; max-width: 450px; max-height: 90vh; }
        .v-position-left { left: 0; border-radius: 0 16px 0 0; animation: v-slideInLeft 0.35s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
        .v-position-right { right: 0; border-radius: 16px 0 0 0; animation: v-slideInRight 0.35s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
        .v-position-center { left: 50%; transform: translateX(-50%); border-radius: 16px 16px 0 0; max-width: 600px; animation: v-slideInBottom 0.35s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
        .v-design-outline { border: 1px solid var(--modal-border); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .v-design-material { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .v-design-neumorphic { border: none; box-shadow: 20px 20px 60px var(--neu-shadow-dark), -20px -20px 60px var(--neu-shadow-light); }
        .v-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; flex-shrink: 0; border-bottom: 1px solid var(--modal-border); }
        .v-design-neumorphic .v-modal-header { border-bottom: 1px dashed var(--modal-border); }
        .v-modal-title { margin: 0; font-size: 1.25rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .v-modal-close { background: transparent; border: none; padding: 4px; border-radius: 4px; cursor: pointer; color: var(--close-color); display: flex; align-items: center; transition: all 0.2s ease; }
        .v-modal-close:hover { color: var(--close-hover); background: rgba(128,128,128,0.1); }
        .v-modal-close:focus-visible { outline: 2px solid var(--ui-brand-color); }
        .v-modal-body { flex-grow: 1; padding: 1.5rem; overflow-y: auto; font-size: 1rem; line-height: 1.5; }
        .v-modal-footer { padding: 1.25rem 1.5rem; flex-shrink: 0; border-top: 1px solid var(--modal-border); display: flex; justify-content: flex-end; gap: 0.75rem; }
        .v-design-neumorphic .v-modal-footer { border-top: 1px dashed var(--modal-border); }
        @keyframes v-overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes v-slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes v-popIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes v-slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes v-slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes v-slideInBottom { from { transform: translate(-50%, 100%); } to { transform: translate(-50%, 0); } }
      `}} />

      <Comp 
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`v-modal-container v-layout-${layout} v-design-${design} ${layout === 'bottom' ? `v-position-${position}` : ''} ${className}`}
        style={style}
        {...props}
      >
        <div className="v-modal-header">
          {title ? (
            <h2 id={titleId} className="v-modal-title">
              {icon && <span aria-hidden="true">{icon}</span>}
              {title}
            </h2>
          ) : (
            <div /> 
          )}
          
          <button className="v-modal-close" onClick={onClose} aria-label="Close Modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="v-modal-body">
          {children}
        </div>

        {footer && (
          <div className="v-modal-footer">
            {footer}
          </div>
        )}
      </Comp>
    </div>
  );
});

Modal.displayName = 'Modal';