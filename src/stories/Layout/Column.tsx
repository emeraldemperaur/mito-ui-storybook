"use client";

import React from 'react';
import { Box } from '@radix-ui/themes';
import type { BoxProps } from '@radix-ui/themes';
import '../../styles/Layout.scss';

/**
 * @type ColSize
 * @description Union type defining permitted values for column spanning.
 */
export type ColSize = number | "auto" | boolean;

/**
 * @type ColProps
 * @description Responsive grid item properties. Uses an intersection type (&) 
 * instead of an interface to safely extend Radix's complex BoxProps type.
 */
export type ColProps = Omit<BoxProps, 'gridColumn'> & React.AriaAttributes & {
    /** 
     * @description Base column span number (1 - 12). 
     * Dictates how many tracks the column occupies on the grid.
     */
    span?: number;
    
    /** 
     * @description Forces the column to start on a new grid row (Grid Line 1). 
     * @default false
     */
    newLine?: boolean; 
    
    /** 
     * @description Extra-small viewport span (mobile). 
     */
    xs?: ColSize;
    
    /** 
     * @description Small viewport span (tablet). 
     */
    sm?: ColSize;
    
    /** 
     * @description Medium viewport span (laptop). 
     */
    md?: ColSize;
    
    /** 
     * @description Large viewport span (desktop). 
     */
    lg?: ColSize;
    
    /** 
     * @description Extra-large viewport span (wide screens). 
     */
    xl?: ColSize;
    
    /** 
     * @description Delegates rendering to the immediate child. 
     * @default false
     */
    asChild?: boolean;
    
    /** 
     * @description Child nodes for the column layout block. 
     */
    children?: React.ReactNode;
};

/**
 * @component Column
 * @description Responsive grid item. Maps breakpoints flawlessly to CSS Grid tracks using local CSS variables, bypassing external grid limitations.
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
    className,
    style,
    ...props 
}, ref) => {
    
    const getSpan = (value?: ColSize): string | undefined => {
        if (value === undefined) return undefined;
        let spanStr = "";
        if (value === "auto") spanStr = "auto";
        else if (value === true) spanStr = "span 12"; 
        else spanStr = `span ${value}`;
        
        return newLine ? `1 / ${spanStr}` : spanStr;
    };

    const customStyles = {
        ...style,
        '--col-initial': getSpan(span || xs || 12),
        '--col-xs': getSpan(xs),
        '--col-sm': getSpan(sm),
        '--col-md': getSpan(md),
        '--col-lg': getSpan(lg),
        '--col-xl': getSpan(xl),
    } as React.CSSProperties & Record<string, any>;

    Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

    return (
        <Box
            ref={ref}
            asChild={asChild}
            className={`mito-layout-col ${className || ""}`}
            style={customStyles}
            {...props}
        >
            {children}
        </Box>
    );
});

Column.displayName = 'Column';