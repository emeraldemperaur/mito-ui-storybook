"use client";

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { FormikProvider, type FormikContextType } from 'formik';
import { useGlobalUIContext, type ThemeColors } from './GlobalUIContext';
import '../../styles/Layout.scss';

/**
 * @interface ContainerProps
 * @description Attributes for the primary layout boundary. Replaces Radix ContainerProps 
 * with native HTML attributes to ensure theme-agnostic stability.
 */
export interface ContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    /** 
     * @description Enables fluid width (100% of parent) instead of snapping to fixed breakpoints. 
     * Ensures edge-to-edge layout rendering.
     * @default false
     */
    fluid?: boolean;
    
    /**
     * @description Maximum width constraint based on Radix scaling.
     * 1: 448px, 2: 688px, 3: 896px, 4: 1136px
     * @default "4"
     */
    size?: "1" | "2" | "3" | "4";

    /**
     * @description Standard CSS display property override.
     */
    display?: string;

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

// Maps Radix container sizes to native CSS max-widths
const CONTAINER_SIZES: Record<string, string> = {
    "1": "448px",
    "2": "688px",
    "3": "896px",
    "4": "1136px"
};

/**
 * @component Container
 * @description Primary layout bounding box. Supports SSR asChild composition, 
 * WCAG landmarks, localized theme injection, and optional Formik state boundaries.
 * 100% self-contained without Radix Theme dependencies.
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ 
    fluid, 
    children, 
    asChild,
    themeOverrides,
    formikContext,
    style,
    display, 
    size = "4",  
    className,  
    ...props 
}, ref) => {
    const context = useGlobalUIContext();
    const Component = asChild ? Slot : "div";
    
    const activeLightColor = themeOverrides?.light || context.themeColors?.light;
    const activeDarkColor = themeOverrides?.dark || context.themeColors?.dark;

    const dynamicStyles: React.CSSProperties = {
        ...style,
        ...(activeLightColor ? { '--mito-container-bg-light': activeLightColor } : {}),
        ...(activeDarkColor ? { '--mito-container-bg-dark': activeDarkColor } : {}),
        // Replicates Radix `px="4"` logic directly via padding
        paddingLeft: 'var(--space-4, 16px)',
        paddingRight: 'var(--space-4, 16px)',
        ...(display ? { display } : {})
    };

    let content = children;
    
    if (formikContext) { 
        content = <FormikProvider value={formikContext}>{content}</FormikProvider>;
    }

    const role = props.role || (fluid ? "region" : undefined);

    if (fluid) {
        return (
            <Component 
                ref={ref} 
                role={role} 
                style={{ 
                    ...dynamicStyles, 
                    width: '100%', 
                    maxWidth: '100%' 
                }} 
                className={`mito-container-fluid ${className || ""}`}
                {...props}
            >
                {content}
            </Component>
        );
    }

    return (
        <Component 
            ref={ref} 
            role={role}
            style={{ 
                ...dynamicStyles, 
                width: '100%',
                maxWidth: CONTAINER_SIZES[size] || CONTAINER_SIZES["4"],
                margin: '0 auto' 
            }} 
            className={`mito-container-fixed ${className || ""}`}
            {...props}
        >
            {content}
        </Component>
    );
});

Container.displayName = 'Container';