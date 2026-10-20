import type { ReactNode } from "react";
import type { FormikContextType } from "formik";

export type InputDesign = 'material' | 'outline' | 'neumorphic';

/**
 * @interface BaseInputProps
 * @description Strongly-typed attributes configuring the Formik engine, dynamic design motifs, and AI/MCP semantic constraints.
 */
export interface BaseInputProps extends Omit<React.InputHTMLAttributes<any>, 'value' | 'onChange' | 'type' | 'color' | 'dir' | 'size' | 'height'> {
  /** The unique identifier and state key for the input field. */
  alias: string;
  /** Explicit input label description mapped to ARIA trees. */
  inputLabel?: string;
  /** Visual theme variation motif. @default 'outline' */
  design?: InputDesign;
  /** Custom overrides for primary light/dark mode accent colors. */
  darkModeColors?: { light?: string; dark?: string };
  /** Forces the container onto a clean structural row plane. */
  newRow?: boolean;
  /** Required viewport column width footprint (1 - 12). */
  width?: number;
  /** Toggles hint tooltip visibility. */
  isHinted?: boolean;
  /** Descriptive hint text displayed within the tooltip. */
  hintText?: string;
  /** External resource URL attached to the hint tooltip. */
  hintUrl?: string;
  /** Explicit error message string. Overrides Formik validation errors if provided. */
  errorText?: ReactNode | string;
  /** Explicit Formik context. Useful for bypassing duplicate context issues in monorepos. */
  formikContext?: FormikContextType<any>;
  /** Delegates structural rendering directly to the immediate child node. */
  asChild?: boolean;
  /** Standard controlled value. (Ignored if Formik is active). */
  value?: any;
  /** Standard change handler. (Ignored if Formik is active). */
  onChange?: (val: any) => void;

  // --- NEUMORPHIC SYSTEM PROPS ---
  /**
   * @description Defines the simulated distance of the component from its background plane. Higher values create larger, softer shadows.
   * @default 3
   */
  elevation?: number;
  /**
   * @description Defines the physical curvature mapping of the component surface.
   * @default 'flat'
   */
  surface?: 'flat' | 'convex' | 'concave' | 'inset';
  /**
   * @description Defines the simulated direction of the global light source, altering shadow cast angles.
   * @default 'top-left'
   */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/** * @constant sharedInputStyles 
 * @description Centralized scoped CSS mapping the complex Neumorphic Box-Shadow equations and standard visual variants into utility classes. 
 */
export const sharedInputStyles = `
  .v-input-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    font-family: var(--default-font-family, inherit);
  }
  .v-input-base {
    display: flex;
    align-items: center;
    width: 100%;
    height: 44px;
    padding: 0 16px;
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
    color: var(--gray-12);
    background: transparent;
  }
  .v-input-base input {
    all: unset;
    flex: 1;
    height: 100%;
    width: 100%;
  }
  .v-input-base input::placeholder { color: var(--gray-9); }
  
  /* Outline Variant */
  .v-input-outline {
    border: 1px solid var(--gray-6);
    border-radius: 6px;
    background: transparent;
  }
  .v-input-outline:focus-within { border-color: var(--ui-brand-color, var(--blue-9)); }
  .v-input-outline[data-error="true"] { border-color: var(--red-9); }

  /* Material Variant */
  .v-input-material {
    border-bottom: 2px solid var(--gray-6);
    border-radius: 4px 4px 0 0;
    background: var(--color-surface);
    padding: 0 16px;
  }
  .v-input-material:focus-within { border-bottom-color: var(--ui-brand-color, var(--blue-9)); }
  .v-input-material[data-error="true"] { border-bottom-color: var(--red-9); }

  /* Neumorphic Surface Topologies */
  .v-input-inset {
    background: var(--neu-bg, #e0e5ec);
    box-shadow: inset var(--neu-x) var(--neu-y) var(--neu-blur) var(--neu-dark), 
                inset calc(var(--neu-x) * -1) calc(var(--neu-y) * -1) var(--neu-blur) var(--neu-light);
  }
  .v-input-flat {
    background: var(--neu-bg, #e0e5ec);
    box-shadow: var(--neu-x) var(--neu-y) var(--neu-blur) var(--neu-dark), 
                calc(var(--neu-x) * -1) calc(var(--neu-y) * -1) var(--neu-blur) var(--neu-light);
  }
  
  /* Focus & Error Overrides for Neumorphism */
  .v-input-inset:focus-within, .v-input-flat:focus-within {
    box-shadow: inset calc(var(--neu-x) * 1.5) calc(var(--neu-y) * 1.5) calc(var(--neu-blur) * 1.5) var(--neu-dark), 
                inset calc(var(--neu-x) * -1.5) calc(var(--neu-y) * -1.5) calc(var(--neu-blur) * 1.5) var(--neu-light),
                0 0 0 2px var(--ui-brand-color, var(--blue-9));
  }
  .v-input-inset[data-error="true"], .v-input-flat[data-error="true"] { 
    box-shadow: inset var(--neu-x) var(--neu-y) var(--neu-blur) var(--neu-dark), 
                inset calc(var(--neu-x) * -1) calc(var(--neu-y) * -1) var(--neu-blur) var(--neu-light),
                0 0 0 2px var(--red-9); 
  }

  .v-input-label { font-size: 13px; font-weight: 600; color: var(--gray-12); display: flex; align-items: center; gap: 6px; }
  .v-input-error { font-size: 12px; font-weight: 500; color: var(--red-9); margin-top: 4px; }
`;