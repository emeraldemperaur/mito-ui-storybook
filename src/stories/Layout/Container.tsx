"use client";

import React from 'react';
import { Box, Container as RadixContainer } from '@radix-ui/themes';
import type { ContainerProps as RadixContainerProps } from '@radix-ui/themes';
import { FormikProvider, type FormikContextType } from 'formik';
import { useGlobalUIContext, type ThemeColors } from './GlobalUIContext';
import '../../styles/Layout.scss';

/**
 * @interface ContainerProps
 * @description Attributes for the primary layout boundary.
 */
export interface ContainerProps extends RadixContainerProps, React.AriaAttributes {
    /** 
     * @description Enables fluid width (100% of parent) instead of snapping to fixed breakpoints. 
     * Ensures edge-to-edge layout rendering.
     * @default false
     */
    fluid?: boolean;
    
    /** 
     * @description Delegates rendering to the immediate child element via Radix Slot. 
     * @default false
     */
    asChild?: boolean;
    
    /** 
     * @description Localized override for light vs dark mode background colors. 
     * Overrides the global context theme for this specific container.
     */
    themeOverrides?: ThemeColors;
    
    /** 
     * @description Formik context to wire up internal inputs automatically. 
     * Creates a new Formik boundary if passed explicitly.
     */
    formikContext?: FormikContextType<any>;
    
    /** 
     * @description Optional custom CSS class name appended to the component's root node.
     */
    className?: string;

    /** 
     * @description Child nodes for the container. 
     */
    children: React.ReactNode;
}

/**
 * @component Container
 * @description Primary layout bounding box. Supports SSR asChild composition, 
 * WCAG landmarks, localized theme injection, and optional Formik state boundaries.
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ 
    fluid, 
    children, 
    asChild,
    themeOverrides,
    formikContext,
    style,
    display, 
    size,  
    className,  
    ...props 
}, ref) => {
    const context = useGlobalUIContext();
    
    const activeLightColor = themeOverrides?.light || context.themeColors?.light;
    const activeDarkColor = themeOverrides?.dark || context.themeColors?.dark;

    const dynamicStyles: React.CSSProperties = {
        ...style,
        ...(activeLightColor ? { '--mito-container-bg-light': activeLightColor } : {}),
        ...(activeDarkColor ? { '--mito-container-bg-dark': activeDarkColor } : {}),
    };

    let content = children;
    
    if (formikContext) { 
        content = <FormikProvider value={formikContext}>{content}</FormikProvider>;
    }

    const role = props.role || (fluid ? "region" : undefined);

    if (fluid) {
        return (
            <Box 
                ref={ref} 
                width="100%" 
                maxWidth="100%"
                px="4" 
                asChild={asChild} 
                role={role} 
                style={dynamicStyles} 
                display={display as any} 
                className={`mito-container-fluid ${className || ""}`}
                {...props}
            >
                {content}
            </Box>
        );
    }

    return (
        <RadixContainer 
            ref={ref} 
            size={size || "4"} 
            px="4" 
            asChild={asChild} 
            style={dynamicStyles} 
            display={display}
            className={`mito-container-fixed ${className || ""}`}
            {...props}
        >
            {content}
        </RadixContainer>
    );
});

Container.displayName = 'Container';