"use client";

import React from 'react';
import { Grid } from '@radix-ui/themes';
import type { GridProps } from '@radix-ui/themes';
import '../../styles/Layout.scss';

/**
 * @interface RowProps
 * @description Strongly-typed attributes for the foundational 12-column grid container.
 * Optimized for MCP context-injection to ensure layout structural integrity.
 */
export interface RowProps extends Omit<GridProps, 'columns'>, React.AriaAttributes {
    /** 
     * @description Buffer spacing between columns based on the Radix spacing scale (0-9). 
     * Seamlessly accepts responsive objects (e.g., {{ initial: '2', md: '4' }}).
     * @default "4" 
     */
    gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | Record<string, string>;
    
    /** 
     * @description Delegates rendering to the immediate child element via Radix Slot. 
     * @default false
     */
    asChild?: boolean;
    
    /**
     * @description Optional custom CSS class name appended to the component's root node.
     * Use this to safely inject utility classes or custom scoped styling without disrupting the layout engine.
     */
    className?: string;
    
    /** 
     * @description Child nodes for the row, strictly expected to be `<Column>` components. 
     */
    children: React.ReactNode;
}

/**
 * @component Row
 * @description Horizontal 12-column grid container. Enforces strict CSS grid rules to guarantee gap applications and WCAG grouping.
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
            gap={gap} 
            className={`mito-layout-row ${className || ""}`}
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