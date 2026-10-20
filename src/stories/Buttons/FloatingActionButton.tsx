"use client";

import React, { useRef, useState, useEffect, type JSX } from "react";
import { Slot } from '@radix-ui/react-slot';
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { useGlobalUIContext, type DesignVariant } from "../Layout/GlobalUIContext";

export type FABPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
  design?: DesignVariant;
  asChild?: boolean;
  position?: FABPosition;
  offset?: number;
  size?: number;
  backgroundColor?: string;
  darkModeColors?: { light: string; dark: string };
  elevation?: number;
  neuIntensity?: number;
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(({
  icon,
  ariaLabel,
  design = 'material',
  asChild = false,
  position = 'bottom-right',
  offset = 32,
  size = 64,
  backgroundColor,
  darkModeColors,
  elevation = 5,
  neuIntensity = 1,
  lightSource = 'top-left',
  className = "",
  style,
  type = "button",
  onClick,
  disabled,
  ...props
}, ref): JSX.Element => {

  const containerRef = useRef<HTMLButtonElement | null>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  const globalContext = useGlobalUIContext();
  const isFormik = Boolean(globalContext.formikContext);
  const resolvedBrandColor = darkModeColors?.light || globalContext.themeColors?.light || 'var(--blue-9, #2563eb)';
  const isReadOnly = disabled || globalContext.formikContext?.isSubmitting;

  useEffect(() => {
    if (design === 'neumorphic') {
      const environmentBg = backgroundColor || (typeof document !== 'undefined' ? getNearestParentBackground(document.body) : '#ecf0f3');
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(environmentBg, -25 * neuIntensity);
      const shadowLight = adjustColor(environmentBg, 25 * neuIntensity);

      setNeuVars({
        '--fab-bg': environmentBg,
        '--fab-shadow-dark': shadowDark,
        '--fab-shadow-light': shadowLight,
        '--fab-x': `${x}px`,
        '--fab-y': `${y}px`,
        '--fab-blur': `${blur}px`,
        '--ui-brand-color': resolvedBrandColor,
      } as React.CSSProperties);
    } else {
      setNeuVars({ '--ui-brand-color': resolvedBrandColor } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, resolvedBrandColor, backgroundColor]);

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isReadOnly) { e.preventDefault(); return; }
    if (isFormik && type === 'submit') globalContext.formikContext?.submitForm();
    if (onClick) onClick(e);
  };

  const positionStyles: React.CSSProperties = {
    top: position.includes('top') ? `${offset}px` : 'auto',
    bottom: position.includes('bottom') ? `${offset}px` : 'auto',
    left: position.includes('left') ? `${offset}px` : 'auto',
    right: position.includes('right') ? `${offset}px` : 'auto',
    width: `${size}px`, height: `${size}px`,
  };

  const Comp = asChild ? Slot : "button";

  return (
    <Comp 
      ref={(node: HTMLButtonElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      type={type}
      aria-label={ariaLabel}
      disabled={isReadOnly}
      onClick={handleAction}
      className={`v-fab v-fab-${design} ${className}`}
      style={{ ...positionStyles, ...neuVars, ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .v-fab { position: fixed; display: flex; justify-content: center; align-items: center; border-radius: 50%; cursor: pointer; transition: transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0.0, 0.2, 1); z-index: 9999; outline: none; -webkit-tap-highlight-color: transparent; }
        .v-fab:disabled { opacity: 0.5; cursor: not-allowed; transform: scale(1) !important; }
        .v-fab:focus-visible { outline: 3px solid var(--ui-brand-color); outline-offset: 4px; }
        .v-fab svg, .v-fab i { width: 50%; height: 50%; display: flex; justify-content: center; align-items: center; transition: transform 0.3s ease; }
        .v-fab-outline { background-color: ${backgroundColor || 'var(--color-surface, #ffffff)'}; border: 2px solid var(--ui-brand-color); color: var(--ui-brand-color); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .v-fab-outline:hover:not(:disabled) { background-color: var(--ui-brand-color); color: #ffffff; transform: scale(1.05) translateY(-2px); box-shadow: 0 8px 15px rgba(0,0,0,0.15); }
        .v-fab-material { background-color: ${backgroundColor || 'var(--ui-brand-color)'}; border: none; color: #ffffff; box-shadow: 0 6px 10px 0 rgba(0,0,0,0.3); }
        .v-fab-material:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 8px 15px 0 rgba(0,0,0,0.4); }
        .v-fab-material:active:not(:disabled) { transform: scale(0.98); box-shadow: 0 4px 6px 0 rgba(0,0,0,0.4); }
        .v-fab-neumorphic { background-color: var(--fab-bg); border: none; color: var(--ui-brand-color); box-shadow: var(--fab-x) var(--fab-y) var(--fab-blur) var(--fab-shadow-dark), calc(var(--fab-x) * -1) calc(var(--fab-y) * -1) var(--fab-blur) var(--fab-shadow-light); }
        .v-fab-neumorphic:hover:not(:disabled) { transform: scale(1.05); box-shadow: calc(var(--fab-x) * 1.2) calc(var(--fab-y) * 1.2) calc(var(--fab-blur) * 1.2) var(--fab-shadow-dark), calc(var(--fab-x) * -1.2) calc(var(--fab-y) * -1.2) calc(var(--fab-blur) * 1.2) var(--fab-shadow-light); }
        .v-fab-neumorphic:active:not(:disabled) { transform: scale(0.95); box-shadow: inset 4px 4px 8px var(--fab-shadow-dark), inset -4px -4px 8px var(--fab-shadow-light); }
        .v-fab-neumorphic:active:not(:disabled) svg { transform: scale(0.9); }
      `}} />
      {icon}
    </Comp>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';