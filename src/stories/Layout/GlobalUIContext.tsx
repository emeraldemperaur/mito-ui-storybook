"use client";

import React, { createContext, useContext } from 'react';
import type { FormikContextType } from 'formik';
import { FormikProvider } from 'formik';

/**
 * @interface ThemeColors
 * @description Shape for providing custom light and dark mode layout/brand overrides.
 */
export interface ThemeColors {
    light?: string;
    dark?: string;
}

/**
 * @type DesignVariant
 * @description Standardized design language variants for interactive UI components.
 */
export type DesignVariant = 'material' | 'outline' | 'neumorphic';

/**
 * @interface GlobalUIContextState
 * @description Global state interface for the entire component library.
 */
export interface GlobalUIContextState {
    themeColors?: ThemeColors;
    formikContext?: FormikContextType<any>;
}

export const GlobalUIContext = createContext<GlobalUIContextState | undefined>(undefined);

/**
 * @function useGlobalUIContext
 * @description Hook to safely consume the GlobalUIContext. Falls back safely if no provider exists.
 */
export const useGlobalUIContext = () => useContext(GlobalUIContext) || {};

export interface GlobalUIProviderProps extends GlobalUIContextState {
    children: React.ReactNode;
}

/**
 * @component GlobalUIProvider
 * @description Optional top-level provider. Wires up global form state and theme variables.
 */
export const GlobalUIProvider: React.FC<GlobalUIProviderProps> = ({ 
    children, 
    themeColors, 
    formikContext 
}) => {
    let content = children;
    if (formikContext) {
        content = <FormikProvider value={formikContext}>{content}</FormikProvider>;
    }
    return (
        <GlobalUIContext.Provider value={{ themeColors, formikContext }}>
            {content}
        </GlobalUIContext.Provider>
    );
};