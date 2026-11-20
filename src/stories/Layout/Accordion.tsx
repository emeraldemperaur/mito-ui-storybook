"use client";

import React, { type ReactNode, useEffect, useRef, useState, createContext, useContext, type JSX, useMemo } from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { Column } from "../Layout/Column"; 
import { Icon } from "../../components/icons/Icons";
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";

/** 
 * @type AccordionDesign 
 * @description Strong string literal union representing permitted enterprise design motifs. 
 */
export type AccordionDesign = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/** 
 * @type AccordionImagePosition 
 * @description Defines the structural placement of the synchronized image gallery relative to the accordion list. 
 */
export type AccordionImagePosition = 'above' | 'below' | 'left' | 'right';

/**
 * @interface AccordionRootProps
 * @description Strongly-typed attributes for the master state-managing wrapper of the Accordion.
 * Optimized for MCP context-injection: Agents must adhere to these strict types to prevent UI thread blocking and style pollution.
 */
export interface AccordionRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'onChange' | 'defaultValue'> {
  /**
   * Unique identifier for the Accordion container. Essential for deterministic end-to-end testing and ARIA linking.
   */
  id?: string;

  /**
   * The core architectural design variant propagating to all child items.
   * - `material`: Contiguous block with solid surface backgrounds and elevated z-index shadows.
   * - `outline`: Crisp, contiguous bordered aesthetic with a transparent core.
   * - `neumorphic`: Detached, soft extruded physical surfaces adapting to the parent background.
   * - `skeuomorphic`: High-fidelity 3D realistic mechanical modules.
   * @default 'outline'
   */
  design?: AccordionDesign;

  /**
   * The `sectionId` (or array of ids) that should be expanded by default on initial mount.
   */
  defaultOpenId?: string | string[];

  /**
   * Toggles whether multiple accordion sections can be expanded concurrently.
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * Callback fired when the expanded state of any accordion item changes.
   * Provides the currently active sectionId(s).
   */
  onValueChange?: (value: string | string[]) => void;

  /** 
   * Forces the component into dark mode, overriding system or parent theme contexts. 
   * @default false
   */
  darkMode?: boolean;

  /* --- Image Synchronization --- */

  /**
   * Activates the synchronized image gallery UX. 
   * When true, dynamically extracts the `image` prop from child `AccordionItem`s and displays the image corresponding to the currently active section.
   * @default false
   */
  syncImage?: boolean;

  /**
   * Structural placement of the synchronized image gallery relative to the accordion items.
   * @default 'above'
   */
  imagePosition?: AccordionImagePosition;

  /* --- Dynamic Style Overrides --- */

  /**
   * Dynamic base background color for light mode. 
   * Injected as `--acc-bg`.
   */
  backgroundColor?: string;

  /**
   * Dynamic base background color specifically for dark mode contexts.
   */
  darkBackgroundColor?: string;

  /**
   * Standard text and icon color for light mode. 
   * Injected as `--acc-text`.
   */
  textColor?: string;

  /**
   * Standard text and icon color specifically for dark mode contexts.
   */
  darkTextColor?: string;

  /**
   * Dynamic highlight color applied to active/expanded item titles, icons, and borders.
   * Injected as `--acc-active-color`.
   */
  activeColor?: string;

  /**
   * Typographic scale injection for the item titles (e.g., '16px', '1.1rem'). 
   * Injected as `--acc-size`.
   */
  textSize?: string | number;

  /**
   * Font family override to match specific UI brand primitives. 
   * Injected as `--acc-font`.
   */
  fontFamily?: string;

  /* --- Neumorphic & Skeuomorphic Tuning --- */

  /**
   * Controls the perceived physical distance of the component from its background plane on the Z-axis.
   * @default 5
   */
  elevation?: number;

  /**
   * A mathematical multiplier applied to the opacity of both the light highlight and dark shadow channels. 
   * @default 1
   */
  neuIntensity?: number;

  /**
   * Dictates the simulated directional angle of the global environment light source.
   * @default 'top-left'
   */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /* --- Layout & Structural Constraints --- */

  /**
   * The required viewport column width spanning across grid boundaries (1 to 12).
   * @default 12
   */
  width?: number;

  /** Option to isolate and render the Accordion onto a clean structural row plane. */
  newRow?: boolean;

  /** Target AccordionItem child elements. */
  children: ReactNode;
}

/**
 * @interface AccordionItemProps
 * @description Strongly-typed attributes for individual Accordion sections.
 */
export interface AccordionItemProps {
  /**
   * The strictly unique identifier for this specific accordion section.
   */
  sectionId: string;

  /**
   * The primary header or trigger text.
   */
  title: ReactNode | string;

  /**
   * The secondary subheader text displayed beneath the title.
   */
  subtitle?: ReactNode | string;

  /**
   * Optional custom icon component rendered to the immediate left of the title.
   */
  icon?: ReactNode;

  /**
   * The URL of the image to display in the synchronized gallery when this section is active.
   * Requires `syncImage={true}` on the Accordion Root to function.
   */
  image?: string;

  /** 
   * Option to lock down interaction and disable click triggers across this specific node. 
   * @default false
   */
  disabled?: boolean;

  /** Content layout block revealed when expanded. */
  children: ReactNode;
}

/** Internal context for cascading design rules and active state to child items. */
interface AccordionContextValue {
  design: AccordionDesign;
  darkMode: boolean;
}
const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * @component Accordion.Root
 * @description Master state-managing wrapper. Employs embedded HTML style blocks for 
 * strict architectural isolation and dynamically synchronizes visual media with disclosure states.
 */
const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(({
  id,
  design = 'outline',
  defaultOpenId,
  allowMultiple = false,
  onValueChange,
  darkMode = false,
  syncImage = false,
  imagePosition = 'above',
  backgroundColor,
  darkBackgroundColor,
  textColor,
  darkTextColor,
  activeColor,
  textSize,
  fontFamily,
  elevation = 5,
  neuIntensity = 1,
  lightSource = 'top-left',
  width = 12,
  newRow,
  className = "",
  style,
  children,
  ...props
}, _ref): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  
  const initialValues = useMemo(() => {
    if (!defaultOpenId) return [];
    return Array.isArray(defaultOpenId) ? defaultOpenId : [defaultOpenId];
  }, [defaultOpenId]);

  const [activeItems, setActiveItems] = useState<string[]>(initialValues);
  const themeClass = darkMode ? 'v-acc-dark' : '';

  const handleValueChange = (val: string | string[]) => {
    const nextValues = Array.isArray(val) ? val : (val ? [val] : []);
    setActiveItems(nextValues);
    if (onValueChange) onValueChange(val);
  };

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = backgroundColor || getNearestParentBackground(containerRef.current.parentElement) || '#e0e5ec';
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -20 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 20 * neuIntensity);

      setNeuVars({
        '--acc-bg-env': parentBg,
        '--acc-shadow-dark': shadowDark,
        '--acc-shadow-light': shadowLight,
        '--acc-x': `${x}px`,
        '--acc-y': `${y}px`,
        '--acc-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, backgroundColor]);

  const customStyles = {
    ...style,
    ...neuVars,
    '--acc-bg': backgroundColor,
    '--acc-bg-dark': darkBackgroundColor || backgroundColor,
    '--acc-text': textColor,
    '--acc-text-dark': darkTextColor || textColor,
    '--acc-active-color': activeColor || 'var(--ui-brand-color, #2563eb)',
    '--acc-size': typeof textSize === 'number' ? `${textSize}px` : textSize,
    '--acc-font': fontFamily,
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  const galleryImages = useMemo(() => {
    if (!syncImage) return [];
    return React.Children.toArray(children).reduce((acc: { id: string, src: string, alt: string }[], child) => {
      if (React.isValidElement<AccordionItemProps>(child) && child.props.sectionId && child.props.image) {
        acc.push({
          id: child.props.sectionId,
          src: child.props.image,
          alt: typeof child.props.title === 'string' ? child.props.title : `Accordion visual for ${child.props.sectionId}`
        });
      }
      return acc;
    }, []);
  }, [children, syncImage]);

  const activeImageId = activeItems.length > 0 ? activeItems[activeItems.length - 1] : null;

  const sharedProps = {
    className: `v-acc-list v-acc-list-${design}`,
    children
  };

  const accordionContent = allowMultiple ? (
    <RadixAccordion.Root
      type="multiple"
      value={activeItems}
      onValueChange={handleValueChange}
      {...sharedProps}
    />
  ) : (
    <RadixAccordion.Root
      type="single"
      value={activeItems[0] || ""}
      onValueChange={handleValueChange}
      collapsible={true}
      {...sharedProps}
    />
  );

  const getFlexLayout = () => {
    switch(imagePosition) {
      case 'left': return { flexDirection: 'row' as const, align: 'flex-start' };
      case 'right': return { flexDirection: 'row-reverse' as const, align: 'flex-start' };
      case 'below': return { flexDirection: 'column' as const, align: 'stretch' };
      case 'above': 
      default: return { flexDirection: 'column-reverse' as const, align: 'stretch' };
    }
  };

  const flexConfig = getFlexLayout();

  return (
    <AccordionContext.Provider value={{ design, darkMode }}>
      <Column span={width} newLine={newRow}>
        <div 
          id={id}
          ref={containerRef} 
          className={`v-acc-root v-acc-root-${design} ${themeClass} ${className}`} 
          style={customStyles}
          {...props}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .v-acc-root {
              --scoped-bg: var(--acc-bg, #ffffff);
              --scoped-text: var(--acc-text, #111827);
              --scoped-active: var(--acc-active-color, #2563eb);
              --scoped-font: var(--acc-font, "Mozilla Headline", "Montserrat", sans-serif);
              
              width: 100%;
              max-width: 100%;
              box-sizing: border-box;
              font-family: var(--scoped-font);
            }
            .v-acc-root.v-acc-dark {
              --scoped-bg: var(--acc-bg-dark, #1f2937);
              --scoped-text: var(--acc-text-dark, #f9fafb);
            }

            /* Animations */
            @keyframes vAccSlideDown { from { height: 0; opacity: 0; } to { height: var(--radix-accordion-content-height); opacity: 1; } }
            @keyframes vAccSlideUp { from { height: var(--radix-accordion-content-height); opacity: 1; } to { height: 0; opacity: 0; } }
            @keyframes vAccImageFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

            .v-acc-content[data-state='open'] { animation: vAccSlideDown 300ms cubic-bezier(0.87, 0, 0.13, 1); }
            .v-acc-content[data-state='closed'] { animation: vAccSlideUp 300ms cubic-bezier(0.87, 0, 0.13, 1); }
            
            .v-acc-trigger[data-state='open'] .v-acc-chevron { transform: rotate(180deg); color: var(--scoped-active); }
            .v-acc-chevron { transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1); color: var(--gray-10); }

            /* Structural Layouts */
            .v-acc-layout-sync { display: flex; gap: 2rem; width: 100%; max-width: 100%; align-items: stretch; box-sizing: border-box; }
            .v-acc-list { flex: 1; width: 100%; max-width: 100%; box-sizing: border-box; }
            .v-acc-gallery { flex: 1; display: flex; border-radius: 12px; overflow: hidden; position: relative; min-height: 250px; box-sizing: border-box; }
            
            @media (max-width: 768px) {
              .v-acc-layout-sync { flex-direction: column !important; }
            }

            .v-acc-gallery-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .v-acc-gallery-img--show { display: block; animation: vAccImageFade 0.4s ease-out forwards; }

            .v-acc-trigger {
              all: unset;
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              padding: 20px 24px;
              cursor: pointer;
              box-sizing: border-box;
              transition: all 0.2s ease;
            }
            .v-acc-trigger:disabled { cursor: not-allowed; opacity: 0.5; }
            .v-acc-trigger:hover:not(:disabled) { background-color: rgba(0,0,0,0.02); }
            .v-acc-root.v-acc-dark .v-acc-trigger:hover:not(:disabled) { background-color: rgba(255,255,255,0.05); }

            /* --- MATERIAL --- (Contiguous Block) */
            .v-acc-list-material {
              background-color: var(--scoped-bg);
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              overflow: hidden; 
            }
            .v-acc-root.v-acc-dark .v-acc-list-material { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5); }
            .v-acc-item-material { border-bottom: 1px solid rgba(0,0,0,0.08); }
            .v-acc-root.v-acc-dark .v-acc-item-material { border-bottom: 1px solid rgba(255,255,255,0.08); }
            .v-acc-item-material:last-child { border-bottom: none; }
            .v-acc-item-material[data-state='open'] { border-left: 4px solid var(--scoped-active); }

            /* --- OUTLINE --- (Contiguous Block) */
            .v-acc-list-outline {
              background-color: transparent;
              border: 1px solid rgba(0,0,0,0.12);
              border-radius: 8px;
              overflow: hidden; 
            }
            .v-acc-root.v-acc-dark .v-acc-list-outline { border-color: rgba(255,255,255,0.12); }
            .v-acc-item-outline { border-bottom: 1px solid rgba(0,0,0,0.12); }
            .v-acc-root.v-acc-dark .v-acc-item-outline { border-bottom: 1px solid rgba(255,255,255,0.12); }
            .v-acc-item-outline:last-child { border-bottom: none; }
            .v-acc-trigger[data-state='open'] .v-acc-title-text { color: var(--scoped-active) !important; }

            /* --- NEUMORPHIC --- (Detached Bubbles) */
            .v-acc-list-neumorphic { display: flex; flex-direction: column; gap: 16px; padding: calc(var(--acc-blur, 10px) + 2px); }
            .v-acc-item-neumorphic {
              background-color: var(--acc-bg-env);
              border-radius: 12px;
              box-shadow: var(--acc-x) var(--acc-y) var(--acc-blur) var(--acc-shadow-dark), calc(var(--acc-x) * -1) calc(var(--acc-y) * -1) var(--acc-blur) var(--acc-shadow-light);
              transition: all 0.3s ease;
              overflow: hidden; 
            }
            .v-acc-item-neumorphic[data-state='open'] {
              box-shadow: inset 4px 4px 8px var(--acc-shadow-dark), inset -4px -4px 8px var(--acc-shadow-light);
            }
            .v-acc-item-neumorphic[data-state='open'] .v-acc-title-text { color: var(--scoped-active) !important; }

            /* --- SKEUOMORPHIC --- (Detached Bubbles) */
            .v-acc-list-skeuomorphic { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
            .v-acc-item-skeuomorphic {
              background-color: var(--acc-bg-env);
              background-image: linear-gradient(to top, rgba(0,0,0,0.08) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.6) 100%);
              border: 1px solid rgba(0, 0, 0, 0.15);
              border-radius: 12px;
              box-shadow: 0 4px 3px 1px rgba(255,255,255,0.5), 0 6px 8px rgba(0,0,0,0.1), inset 0 0 3px 0 rgba(0,0,0,0.1);
              transition: all 0.2s ease;
              overflow: hidden;
            }
            .v-acc-root.v-acc-dark .v-acc-item-skeuomorphic {
              background-image: linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.1) 100%);
              border-color: rgba(255,255,255,0.05);
              box-shadow: 0 4px 3px 1px rgba(255,255,255,0.05), 0 6px 8px rgba(0,0,0,0.5), inset 0 0 3px 0 rgba(0,0,0,0.3);
            }
            .v-acc-item-skeuomorphic[data-state='open'] {
              background-image: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.6) 100%);
              box-shadow: 0 2px 2px 1px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.1), inset 0 0 5px 3px rgba(0,0,0,0.05), inset 0 0 20px rgba(0,0,0,0.1);
            }
            .v-acc-root.v-acc-dark .v-acc-item-skeuomorphic[data-state='open'] {
              background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.1) 100%);
              box-shadow: 0 2px 2px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.4), inset 0 0 5px 3px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.4);
            }
            .v-acc-item-skeuomorphic[data-state='open'] .v-acc-title-text { color: var(--scoped-active) !important; text-shadow: 0 0 8px rgba(37, 99, 235, 0.4); }
          `}} />

          {syncImage && galleryImages.length > 0 ? (
            <div className="v-acc-layout-sync" style={{ flexDirection: flexConfig.flexDirection, alignItems: flexConfig.align }}>
              <div className="v-acc-gallery">
                {galleryImages.map((img) => (
                  <img 
                    key={img.id} 
                    src={img.src} 
                    alt={img.alt} 
                    className={`v-acc-gallery-img ${activeImageId === img.id ? 'v-acc-gallery-img--show' : ''}`} 
                  />
                ))}
              </div>
              {accordionContent}
            </div>
          ) : (
            accordionContent
          )}
        </div>
      </Column>
    </AccordionContext.Provider>
  );
});
AccordionRoot.displayName = "Accordion.Root";

/**
 * @component Accordion.Item
 * @description Individual disclosure section. Automatically consumes the structural constraints and active states cascaded by the Accordion.Root.
 */
const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(({
  sectionId,
  title,
  subtitle,
  icon,
  disabled = false,
  children,
}, ref): JSX.Element => {
  const context = useContext(AccordionContext);
  
  if (!context) {
    throw new Error("Accordion.Item must be used within an Accordion.Root");
  }
  const { design } = context;

  return (
    <RadixAccordion.Item 
      ref={ref}
      value={sectionId} 
      disabled={disabled}
      className={`v-acc-item v-acc-item-${design}`}
    >
      <RadixAccordion.Header style={{ margin: 0 }}>
        <RadixAccordion.Trigger className="v-acc-trigger">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {icon && (
              <div className="v-acc-icon-container" style={{ display: 'flex', alignItems: 'center', color: 'inherit', paddingRight: '16px' }}>
                {icon}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
              <span 
                className="v-acc-title-text"
                style={{ color: 'var(--scoped-text)', transition: 'color 0.3s ease', fontSize: 'var(--acc-size, 16px)', fontWeight: 'bold' }}
              >
                {title}
              </span>
              {subtitle && (
                <span 
                  className="v-acc-subtitle-text"
                  style={{ color: 'var(--scoped-text)', opacity: 0.7, fontSize: '14px', fontWeight: 300 }}
                >
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          <Icon name="caretdown" height="20" width="20" className="v-acc-chevron" />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>

      <RadixAccordion.Content className="v-acc-content" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 24px 24px' }}>
          <div style={{ color: 'var(--scoped-text)', opacity: 0.85, fontSize: '14px' }}>
            {children}
          </div>
        </div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
});
AccordionItem.displayName = "Accordion.Item";

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
};