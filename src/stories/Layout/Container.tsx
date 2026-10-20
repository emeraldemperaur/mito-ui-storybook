"use client";

import React from 'react';
import { Box, Container as RadixContainer } from '@radix-ui/themes';
import type { ContainerProps as RadixContainerProps } from '@radix-ui/themes';
import { FormikProvider, type FormikContextType } from 'formik';
import { useGlobalUIContext, type ThemeColors } from './GlobalUIContext';

export interface ContainerProps extends RadixContainerProps, React.AriaAttributes {
    /** Enables fluid width (100% of parent) instead of fixed breakpoints. */
    fluid?: boolean;
    /** Delegates rendering to the immediate child element via Radix Slot. */
    asChild?: boolean;
    /** Localized override for light vs dark mode background colors. */
    themeOverrides?: ThemeColors;
    /** Formik context to wire up internal inputs automatically. */
    formikContext?: FormikContextType<any>;
    /** Child nodes for the container. */
    children: React.ReactNode;
}

/**
 * @component Container
 * @description Primary layout bounding box. Supports SSR asChild composition, 
 * WCAG landmarks, and optional Formik injection.
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
    ...props 
}, ref) => {
    const context = useGlobalUIContext();
    
    const activeLightColor = themeOverrides?.light || context.themeColors?.light;
    const activeDarkColor = themeOverrides?.dark || context.themeColors?.dark;

    const dynamicStyles: React.CSSProperties = {
        ...style,
        ...(activeLightColor ? { '--os-layout-bg-light': activeLightColor } : {}),
        ...(activeDarkColor ? { '--os-layout-bg-dark': activeDarkColor } : {}),
    };

    let content = children;
    const activeFormikContext = formikContext || context.formikContext;
    
    if (activeFormikContext && formikContext) { 
        content = <FormikProvider value={activeFormikContext}>{content}</FormikProvider>;
    }

    const role = props.role || (fluid ? "region" : undefined);

    if (fluid) {
        return (
            <Box 
                ref={ref} 
                width="100%" 
                px="3" 
                asChild={asChild} 
                role={role} 
                style={dynamicStyles} 
                display={display as any} 
                {...props}
            >
                {content}
            </Box>
        );
    }

    return (
        <RadixContainer 
            ref={ref} 
            size={size || "3"} 
            px="3" 
            asChild={asChild} 
            style={dynamicStyles} 
            display={display}
            {...props}
        >
            {content}
        </RadixContainer>
    );
});

Container.displayName = 'Container';