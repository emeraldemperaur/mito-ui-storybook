"use client";

import React, { useState, useEffect, useRef, type JSX } from "react";
import { Slot } from '@radix-ui/react-slot';

export type CounterEasing = 'linear' | 'easeOut' | 'easeInOut';

/**
 * @interface NumberCounterProps
 * @description Strongly-typed attributes for an enterprise-grade incremental number counter.
 * Optimized for MCP context-injection and zero-layout-shift numeric telemetry displays.
 */
export interface NumberCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The target numeric value to count toward. */
  value: number;
  /** The starting value for the initial mount animation. @default 0 */
  startFrom?: number;
  /** Toggles the incremental count-up animation. When false, renders the final value immediately. @default true */
  animate?: boolean;
  /** Total duration of the count-up animation in milliseconds. @default 1500 */
  duration?: number;
  /** Mathematical easing curve applied to the interpolation. @default 'easeOut' */
  easing?: CounterEasing;
  /** Formats the rendered number with locale-standard thousand separators (e.g., 2,426,616). @default true */
  formatWithCommas?: boolean;
  /** Number of decimal places to retain during and after animation. @default 0 */
  decimals?: number;
  /** Optional prefix string (e.g., '$', '+'). */
  prefix?: string;
  /** Optional suffix string (e.g., '%', 'ms'). */
  suffix?: string;
  /** Enables a subtle fade-in transition on initial mount. @default true */
  fadeIn?: boolean;
  /** Explicit text color override for light mode. */
  color?: string;
  /** Explicit text color override for dark mode. */
  darkColor?: string;
  /** Force dark mode rendering independent of parent context. @default false */
  darkMode?: boolean;
  /** Custom font size override (e.g., '2rem', 32). */
  fontSize?: string | number;
  /** Custom font weight override. @default 700 */
  fontWeight?: React.CSSProperties['fontWeight'];
  /** Custom font family override. */
  fontFamily?: string;
  /** Delegates rendering to the immediate child element via Radix Slot. @default false */
  asChild?: boolean;
}

const easingFunctions: Record<CounterEasing, (t: number) => number> = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

/**
 * @component NumberCounter
 * @description SSR-safe, 60fps `requestAnimationFrame` number counter with smooth easing,
 * automatic comma formatting, and `tabular-nums` alignment to eliminate layout shift.
 */
export const NumberCounter = React.forwardRef<HTMLSpanElement, NumberCounterProps>(({
  value,
  startFrom = 0,
  animate = true,
  duration = 1500,
  easing = 'easeOut',
  formatWithCommas = true,
  decimals = 0,
  prefix = '',
  suffix = '',
  fadeIn = true,
  color,
  darkColor,
  darkMode = false,
  fontSize,
  fontWeight,
  fontFamily,
  asChild = false,
  className = "",
  style,
  ...props
}, ref): JSX.Element => {
  const [displayValue, setDisplayValue] = useState<number>(animate ? startFrom : value);
  const [hasMounted, setHasMounted] = useState(false);
  const previousValueRef = useRef<number>(animate ? startFrom : value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      previousValueRef.current = value;
      return;
    }

    const startVal = previousValueRef.current;
    const delta = value - startVal;

    if (delta === 0) {
      setDisplayValue(value);
      return;
    }

    let startTime: number | null = null;
    const ease = easingFunctions[easing] || easingFunctions.easeOut;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / Math.max(1, duration), 1);
      const current = startVal + delta * ease(progress);

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
        previousValueRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, animate, duration, easing]);

  const formatNumber = (num: number): string => {
    const fixed = decimals > 0 ? num.toFixed(decimals) : Math.floor(num).toString();
    if (!formatWithCommas) return fixed;
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const resolvedColor = darkMode ? (darkColor || color) : color;
  const resolvedFontSize = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;

  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      className={`mito-number-counter ${className}`}
      style={{
        fontVariantNumeric: 'tabular-nums',
        color: resolvedColor,
        fontSize: resolvedFontSize,
        fontWeight: fontWeight,
        fontFamily: fontFamily,
        opacity: fadeIn && animate && !hasMounted ? 0 : 1,
        transition: fadeIn ? `opacity ${Math.min(duration, 800)}ms ease-out` : undefined,
        ...style,
      }}
      {...props}
    >
      {prefix}{formatNumber(displayValue)}{suffix}
    </Comp>
  );
});

NumberCounter.displayName = 'NumberCounter';