"use client";

import React, { type ReactNode, useEffect, useRef, useState, createContext, useContext, type JSX } from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { Flex, Text } from '@radix-ui/themes';
import { Column } from "./Column"; 
import { Icon } from "../../components/icons/Icons";
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";

/** Strong string literal union representing permitted design motifs. */
export type AccordionDesign = 'material' | 'outline' | 'neumorphic';

/** Internal layout synchronization channel for state propagation. */
const AccordionContext = createContext<{ 
  design: AccordionDesign; 
  brandcolor?: string;
  titleColor?: string;
}>({ design: 'outline' });

export interface AccordionProps {
  /**
   * The design variation of the Accordion. 
   * @default 'outline'
   * @example design="neumorphic"
   */
  design?: AccordionDesign;
  /**
   * The sectionId of the item that should be open by default. 
   * Renders all accordion sections in closed state if undefined.
   * @example defaultOpenId="section-1"
   */
  defaultOpenId?: string;
  /**
   * Option to allow multiple sections to be open at the same time.
   * @default false
   * @example allowMultiple={true}
   */
  allowMultiple?: boolean;
  /**
   * Option to pass a custom hex, rgb, or css variable to color the background of the AccordionItem headers.
   * @example brandcolor="var(--accent-3)"
   */
  brandcolor?: string;
  /**
   * Option to specify the text and icon color of the AccordionItem headers.
   * @example titleColor="#ffffff"
   */
  titleColor?: string;
  /**
   * The required viewport column width spanning across grid boundaries (1 to 12).
   * @default 12
   * @example width={12}
   */
  width?: number;
  /** Option to isolate and render Accordion component onto a clean structural row plane. */
  newRow?: boolean;
  /**
   * Option to specify a custom .scss class selector override handle.
   * @example className="teletraan-1-accordion"
   */
  className?: string;
  /** Inline CSS property override styles block. */
  style?: React.CSSProperties;
  /** Target AccordionItem child elements trees list. */
  children: ReactNode;
}

export interface AccordionItemProps {
  /**
   * The unique identifier for this specific accordion section.
   * @example sectionId="faq-1"
   */
  sectionId: string;
  /**
   * The header or trigger text for this accordion section.
   * @example title="What is the VΣ Protocol?"
   */
  title: ReactNode | string;
  /**
   * The subheader or trigger text for this accordion section.
   * @example subtitle="Get in touch to learn more"
   */
  subtitle?: ReactNode | string;
  /** Content layout block revealed when the disclosure region changes status to expanded. */
  children: ReactNode;
  /** Option to lock down interaction and disable click triggers across this specific node. */
  disabled?: boolean;
  /**
   * Option to append a custom icon component to the immediate left of the layout title.
   * @example icon={<Icon name="info" />}
   */
  icon?: ReactNode;
}

/**
 * @component Accordion
 * @description Encapsulated content disclosure interface. Employs embedded HTML style blocks to isolate visual theme variants natively with zero external stylesheet dependencies.
 */
export const Accordion = ({
  design = 'outline',
  defaultOpenId = "",
  allowMultiple = false,
  brandcolor,
  titleColor,
  width = 12,
  newRow,
  className,
  style,
  children
}: AccordionProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (design === 'neumorphic' && containerRef.current) {
      const parentBg = getNearestParentBackground(containerRef.current.parentElement);
      setNeuVars({
        '--neu-bg': parentBg,
        '--neu-shadow-dark': adjustColor(parentBg, -20), 
        '--neu-shadow-light': adjustColor(parentBg, 20),
      } as React.CSSProperties);
    }
  }, [design]);

  const sharedProps = {
    className: `v-accordion-root-${design}`,
    children
  };

  const accordionRoot = allowMultiple ? (
    <RadixAccordion.Root
      type="multiple"
      defaultValue={defaultOpenId ? [defaultOpenId] : undefined}
      {...sharedProps}
    />
  ) : (
    <RadixAccordion.Root
      type="single"
      defaultValue={defaultOpenId || undefined}
      collapsible={true}
      {...sharedProps}
    />
  );

  return (
    <AccordionContext.Provider value={{ design, brandcolor, titleColor }}>
      <Column span={width} newLine={newRow}>
        <div 
          ref={containerRef} 
          className={className} 
          style={{ 
            width: '100%', 
            ...style, 
            ...neuVars,
            ...(brandcolor ? { '--accordion-header-bg': brandcolor } : {}),
            ...(titleColor ? { '--accordion-title-color': titleColor } : {})
          } as React.CSSProperties}
        >
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideDown {
              from { height: 0; opacity: 0; }
              to { height: var(--radix-accordion-content-height); opacity: 1; }
            }
            @keyframes slideUp {
              from { height: var(--radix-accordion-content-height); opacity: 1; }
              to { height: 0; opacity: 0; }
            }

            .v-accordion-content[data-state='open'] {
              animation: slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1);
            }
            .v-accordion-content[data-state='closed'] {
              animation: slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1);
            }
            
            .v-accordion-trigger[data-state='open'] .v-accordion-chevron {
              transform: rotate(180deg);
            }
            .v-accordion-chevron {
              transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
              color: var(--accordion-title-color, var(--gray-10));
            }

            .v-accordion-root-outline {
              border: 1px solid var(--gray-6);
              border-radius: var(--radius-3);
              background-color: transparent;
              overflow: hidden; 
            }
            .v-accordion-item-outline {
              border-bottom: 1px solid var(--gray-6);
            }
            .v-accordion-item-outline:last-child {
              border-bottom: none;
            }

            .v-accordion-root-material {
              border-radius: var(--radius-3);
              background-color: var(--color-surface);
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              overflow: hidden; 
            }
            .v-accordion-item-material {
              border-bottom: 1px solid var(--gray-4);
            }
            .v-accordion-item-material:last-child {
              border-bottom: none;
            }
            .v-accordion-item-material[data-state='open'] {
              border-left: 3px solid var(--accent-9);
            }

            .v-accordion-root-neumorphic {
              display: flex;
              flex-direction: column;
              gap: 16px; 
            }
            .v-accordion-item-neumorphic {
              background-color: var(--neu-bg);
              border-radius: 12px;
              box-shadow: 6px 6px 12px var(--neu-shadow-dark), -6px -6px 12px var(--neu-shadow-light);
              transition: all 0.3s ease;
              overflow: hidden; 
            }
            .v-accordion-item-neumorphic[data-state='open'] {
              box-shadow: inset 4px 4px 8px var(--neu-shadow-dark), inset -4px -4px 8px var(--neu-shadow-light);
            }
            
            .v-accordion-trigger {
              all: unset;
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              padding: 16px;
              cursor: pointer;
              font-family: var(--default-font-family);
              box-sizing: border-box;
              background-color: var(--accordion-header-bg, transparent); 
            }
            .v-accordion-trigger:disabled {
              cursor: not-allowed;
              opacity: 0.5;
            }
          `}} />

          {accordionRoot}
        </div>
      </Column>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({
  sectionId,
  title,
  subtitle,
  children,
  disabled = false,
  icon
}: AccordionItemProps): JSX.Element => {
  const { design } = useContext(AccordionContext);

  return (
    <RadixAccordion.Item 
      value={sectionId} 
      disabled={disabled}
      className={`v-accordion-item-${design}`}
    >
      <RadixAccordion.Header style={{ margin: 0 }}>
        <RadixAccordion.Trigger className="v-accordion-trigger">
          <Flex align="center" gap="3">
            {icon && (
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accordion-title-color, var(--accent-9))' }}>
                {icon}
              </div>
            )}
            <Text 
              size="3" 
              weight="bold" 
              style={{ color: 'var(--accordion-title-color, var(--gray-12))' }}
            >
              {title}
            </Text>
             <Text 
              size="2" 
              weight="light" 
              style={{ color: 'var(--accordion-title-color, var(--gray-12))' }}
            >
              {subtitle}
            </Text>
          </Flex>
          <Icon name="caretdown" height="20" width="20" className="v-accordion-chevron" />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>

      <RadixAccordion.Content className="v-accordion-content" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '24px 16px 24px 16px' }}>
          <Text size="2" color="gray" as="div">
            {children}
          </Text>
        </div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
};