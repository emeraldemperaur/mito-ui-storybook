"use client";

import React from 'react';
import { Grid } from '@radix-ui/themes';
import type { GridProps } from '@radix-ui/themes';

export interface RowProps extends Omit<GridProps, 'columns'>, React.AriaAttributes {
    /** Child nodes for the row. */
    children: React.ReactNode;
    className?: string;
    /** Buffer spacing between columns based on Radix spacing scale. */
    gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    /** Delegates rendering to the immediate child element via Radix Slot. */
    asChild?: boolean;
}

/**
 * @component Row
 * @description Horizontal 12-column grid container. Enforces WCAG grouping by default.
 */
export const Row = React.forwardRef<HTMLDivElement, RowProps>(({ 
    children, 
    className, 
    gap = "4",
    asChild,
    ...props 
}, ref) => {
    return (
        <Grid 
            ref={ref}
            columns="12" 
            gap={gap} 
            width="auto" 
            className={className}
            asChild={asChild}
            role={props.role || "group"}
            aria-label={props['aria-label'] || "Layout row"}
            {...props}
        >
            {children}
        </Grid>
    );
});

Row.displayName = 'Row';