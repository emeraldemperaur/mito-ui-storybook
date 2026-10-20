"use client";

import React from 'react';
import { Box } from '@radix-ui/themes';
import type { BoxProps } from '@radix-ui/themes';

export type ColSize = number | "auto" | boolean;

/**
 * @type ColProps
 * @description Responsive grid item properties. Uses an intersection type (&) 
 * instead of an interface to safely extend Radix's complex BoxProps type.
 */
export type ColProps = BoxProps & React.AriaAttributes & {
    /** Base span number (1 - 12). */
    span?: number;
    /** Forces the column to start on a new grid row. */
    newLine?: boolean; 
    /** Extra-small viewport span (mobile). */
    xs?: ColSize;
    /** Small viewport span (tablet). */
    sm?: ColSize;
    /** Medium viewport span (laptop). */
    md?: ColSize;
    /** Large viewport span (desktop). */
    lg?: ColSize;
    /** Extra-large viewport span (wide). */
    xl?: ColSize;
    /** Delegates rendering to the immediate child. */
    asChild?: boolean;
    /** Child nodes for the column. */
    children?: React.ReactNode;
};

/**
 * @component Column
 * @description Responsive grid item. Maps responsive breakpoints flawlessly to CSS Grid.
 */
export const Column = React.forwardRef<HTMLDivElement, ColProps>(({ 
    newLine, 
    span, 
    xs, 
    sm, 
    md, 
    lg, 
    xl, 
    children, 
    asChild,
    ...props 
}, ref) => {
    
    const getSpan = (value?: ColSize): string | undefined => {
        if (value === undefined) return undefined;
        if (value === "auto") return "auto";
        if (value === true) return "span 12"; 
        return `span ${value}`;
    };

    const formatGridColumn = (spanValue?: string): string | undefined => {
        if (!spanValue) return undefined;
        return newLine ? `1 / ${spanValue}` : spanValue;
    };

    const baseSpan = span ? `span ${span}` : (getSpan(xs) || "span 12");

    return (
        <Box
            ref={ref}
            asChild={asChild}
            {...props}
            gridColumn={{
                initial: formatGridColumn(baseSpan),
                xs: formatGridColumn(getSpan(xs)),
                sm: formatGridColumn(getSpan(sm)),
                md: formatGridColumn(getSpan(md)),
                lg: formatGridColumn(getSpan(lg)),
                xl: formatGridColumn(getSpan(xl)),
            }}
        >
            {children}
        </Box>
    );
});

Column.displayName = 'Column';