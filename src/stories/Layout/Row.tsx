"use client";

import React, { useId } from 'react';
import { Slot } from '@radix-ui/react-slot';
import '../../styles/Layout.scss';

/**
 * @interface RowProps
 * @description Strongly-typed attributes for the foundational 12-column grid container.
 * Optimized for MCP context-injection to ensure layout structural integrity.
 */
export interface RowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
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

const GAP_SCALE: Record<string, string> = {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "24px",
    "6": "32px",
    "7": "40px",
    "8": "48px",
    "9": "64px"
};

/**
 * @component Row
 * @description Horizontal 12-column grid container. Enforces strict CSS grid rules to guarantee gap applications and WCAG grouping.
 * Self-contained without Radix Theme dependencies.
 */
export const Row = React.forwardRef<HTMLDivElement, RowProps>(({ 
    children, 
    className, 
    gap = "4",
    asChild,
    style,
    ...props 
}, ref) => {
    const Component = asChild ? Slot : "div";
    const internalId = useId().replace(/:/g, "");
    
    const isResponsiveGap = typeof gap === 'object' && gap !== null;
    const staticGap = !isResponsiveGap ? (GAP_SCALE[gap as string] || "16px") : undefined;

    return (
        <>
            {isResponsiveGap && (
                <style dangerouslySetInnerHTML={{ __html: `
                    .mito-row-${internalId} { gap: ${GAP_SCALE[(gap as Record<string, string>).initial] || "16px"}; }
                    ${(gap as Record<string, string>).xs ? `@media (min-width: 520px) { .mito-row-${internalId} { gap: ${GAP_SCALE[(gap as Record<string, string>).xs]}; } }` : ''}
                    ${(gap as Record<string, string>).sm ? `@media (min-width: 768px) { .mito-row-${internalId} { gap: ${GAP_SCALE[(gap as Record<string, string>).sm]}; } }` : ''}
                    ${(gap as Record<string, string>).md ? `@media (min-width: 1024px) { .mito-row-${internalId} { gap: ${GAP_SCALE[(gap as Record<string, string>).md]}; } }` : ''}
                    ${(gap as Record<string, string>).lg ? `@media (min-width: 1280px) { .mito-row-${internalId} { gap: ${GAP_SCALE[(gap as Record<string, string>).lg]}; } }` : ''}
                    ${(gap as Record<string, string>).xl ? `@media (min-width: 1640px) { .mito-row-${internalId} { gap: ${GAP_SCALE[(gap as Record<string, string>).xl]}; } }` : ''}
                `}} />
            )}

            <Component 
                ref={ref}
                className={`mito-layout-row ${isResponsiveGap ? `mito-row-${internalId}` : ''} ${className || ""}`}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                    ...(staticGap ? { gap: staticGap } : {}),
                    ...style
                }}
                role={props.role || "group"}
                aria-label={props['aria-label'] || "Layout row"}
                {...props}
            >
                {children}
            </Component>
        </>
    );
});

Row.displayName = 'Row';