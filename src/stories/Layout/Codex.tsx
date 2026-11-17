"use client";

import React, { type ReactNode, useEffect, useRef, useState, createContext, useContext, type JSX, useMemo } from 'react';
import { Flex, Text, Box } from '@radix-ui/themes';
import { Slot } from '@radix-ui/react-slot';
import { FormikProvider, type FormikContextType, useFormikContext } from 'formik';
import { Column } from "../Layout/Column"; 
import { Icon, type IconName } from "../../components/icons/Icons";
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";
import { Button } from "../Buttons/Button"; 

/** 
 * @type CodexDesign 
 * @description Strong string literal union representing permitted enterprise design motifs. 
 */
export type CodexDesign = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

/**
 * @interface CodexContextProps
 * @description Internal state management contract for the Codex stepper. 
 * Facilitates reactive synchronization between the Root layout, the timeline indicator, 
 * the active Item panels, and the navigation Controls.
 */
interface CodexContextProps {
  /** The uniquely identifying string of the currently active/visible step. */
  activeStepId: string;
  /** State dispatcher to programmatically advance, regress, or jump to a specific step. */
  setActiveStepId: (id: string) => void;
  /** The design motif cascaded from the Root to ensure aesthetic consistency across all internal nodes. */
  design: CodexDesign;
  /** Enforces linear progression. When true, prevents users from skipping ahead via the timeline. */
  strictValidation: boolean;
  /** An ordered array of all registered step IDs extracted dynamically from children. */
  stepIds: string[];
  /** Propagates the active dark mode state to child controls and sub-components. */
  darkMode: boolean;
  /** Propagates the configured active highlight color to child controls. */
  activeColor?: string;
}

// Enforces strict architectural boundaries to catch rendering errors immediately
const CodexContext = createContext<CodexContextProps | null>(null);

/**
 * @function useStepper
 * @description Consumes the active Codex stepper state and theme context. Throws if invoked outside `Codex.Root`.
 */
export const useStepper = (): CodexContextProps => {
  const context = useContext(CodexContext);
  if (!context) throw new Error("Codex sub-components (Item, Controls) must be used within a Codex.Root");
  return context;
};

/**
 * @interface CodexRootProps
 * @description Strongly-typed attributes for the master state-managing wrapper of the Codex stepper.
 * Optimized for MCP context-injection to ensure deterministic linear flow and theme isolation.
 */
export interface CodexRootProps {
  /** Unique identifier for the Codex container. Essential for deterministic end-to-end testing. */
  id?: string;
  /** The design variation theme configuration. @default 'outline' */
  design?: CodexDesign;
  /** Explicit step identifier to open automatically upon mounting. */
  defaultStepId?: string;
  /** Restricts user navigation to linear progression via Next controls. @default false */
  strictValidation?: boolean;
  /** Forces the component into dark mode, overriding system or parent theme contexts. @default false */
  darkMode?: boolean;
  /** Color schema values for dynamic programmatic layout rendering. */
  brandcolor?: string;
  /** Dynamic base background color specifically for dark mode contexts. */
  darkBackgroundColor?: string;
  /** Dynamic highlight color applied to the active step, completed lines, and primary buttons. */
  activeColor?: string;
  /** Explicit color tracking string targeting label elements. */
  titleColor?: string;
  /** Standard text and icon color specifically for dark mode contexts. */
  darkTitleColor?: string;
  /** Font family override to match specific UI brand primitives. @default '"Mozilla Headline", "Montserrat", sans-serif' */
  fontFamily?: string;
  /** Controls the perceived physical distance of the 3D nodes from the background. @default 5 */
  elevation?: number;
  /** Mathematical multiplier applied to the opacity of light/dark shadow channels. @default 1 */
  neuIntensity?: number;
  /** Dictates the simulated directional angle of the global environment light source. @default 'top-left' */
  lightSource?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Viewport column width configuration value (1 to 12). @default 12 */
  width?: number;
  /** Forces container layouts to break downward onto a fresh structural row line. */
  newRow?: boolean;
  /** Specific custom style class selector appended to the root container. */
  className?: string;
  /** Inline modification style rules object. */
  style?: React.CSSProperties;
  /** Data link layer context mapping active Formik rules. */
  formikContext?: FormikContextType<any>;
  /** Toggles dynamic property forwarding rendering directly onto immediate child targets. */
  asChild?: boolean;
  /** Target child nodes list consisting strictly of Codex.Item components. */
  children: ReactNode;
}

/**
 * @interface CodexItemProps
 * @description Strongly-typed attributes for individual steps within the Codex linear array.
 */
export interface CodexItemProps {
  /** Unique string key configuration value tracking placement inside linear stepper arrays. */
  stepId: string;
  /** Main navigation label text displayed in the timeline. */
  title: string;
  /** Secondary micro-copy descriptive layout subtitle text. */
  subtitleDescription?: string;
  /** Decorative custom element override map inside the active loop indicator. */
  icon?: ReactNode;
  /** Content block child nodes shown if context variables route matching execution onto this block. */
  children: ReactNode;
}

/**
 * @interface CodexControlsProps
 * @description Strongly-typed attributes for the Next/Prev/Submit linear navigation array.
 * Exposes granular light/dark mode base and hover color controls for the underlying library Button components.
 */
export interface CodexControlsProps {
  /** The target stepId to navigate to when 'Next' is clicked. Omit on the final step. */
  nextStepId?: string;
  /** The target stepId to navigate to when 'Back' is clicked. Omit on the first step. */
  prevStepId?: string;
  /** Label for the forward progression button. @default "Continue" */
  nextLabel?: string;
  /** Icon for the forward progression button. @default "doublearrowright" */
  nextIcon?: IconName;
  /** Label for the backward progression button. @default "Back" */
  prevLabel?: string;
  /** Icon for the backward progression button. @default "doublearrowleft" */
  prevIcon?: IconName;
  /** Label for the final terminal action button. @default "Submit" */
  finishLabel?: string;
  /** Icon for the final terminal action button. @default "paperplane" */
  finishIcon?: IconName;
  /** Determines if clicking Next/Finish triggers a form submission (type="submit"). @default true */
  onSubmit?: boolean;
  /** Overrides the parent Codex.Root darkMode state specifically for the control buttons. */
  darkMode?: boolean;
  /** Shared hover background color fallback applied to control buttons in light mode. */
  hoverColor?: string;
  /** Shared hover background color fallback applied to control buttons in dark mode. */
  darkHoverColor?: string;
  /** Shared hover text and icon color fallback applied to control buttons in light mode. */
  hoverTextColor?: string;
  /** Shared hover text and icon color fallback applied to control buttons in dark mode. */
  darkHoverTextColor?: string;
  /** Background color for the primary (Next/Submit) button in light mode. */
  nextBackgroundColor?: string;
  /** Background color for the primary (Next/Submit) button in dark mode. */
  darkNextBackgroundColor?: string;
  /** Text and icon color for the primary (Next/Submit) button in light mode. */
  nextTextColor?: string;
  /** Text and icon color for the primary (Next/Submit) button in dark mode. */
  darkNextTextColor?: string;
  /** Hover background color specifically for the primary (Next/Submit) button in light mode. */
  nextHoverColor?: string;
  /** Hover background color specifically for the primary (Next/Submit) button in dark mode. */
  darkNextHoverColor?: string;
  /** Hover text and icon color specifically for the primary (Next/Submit) button in light mode. */
  nextHoverTextColor?: string;
  /** Hover text and icon color specifically for the primary (Next/Submit) button in dark mode. */
  darkNextHoverTextColor?: string;
  /** Background color for the secondary (Back) button in light mode. */
  prevBackgroundColor?: string;
  /** Background color for the secondary (Back) button in dark mode. */
  darkPrevBackgroundColor?: string;
  /** Text and icon color for the secondary (Back) button in light mode. */
  prevTextColor?: string;
  /** Text and icon color for the secondary (Back) button in dark mode. */
  darkPrevTextColor?: string;
  /** Hover background color specifically for the secondary (Back) button in light mode. */
  prevHoverColor?: string;
  /** Hover background color specifically for the secondary (Back) button in dark mode. */
  darkPrevHoverColor?: string;
  /** Hover text and icon color specifically for the secondary (Back) button in light mode. */
  prevHoverTextColor?: string;
  /** Hover text and icon color specifically for the secondary (Back) button in dark mode. */
  darkPrevHoverTextColor?: string;
  /** Intercept function fired before progressing. If false is returned, navigation aborts. */
  onNext?: () => boolean | void | Promise<boolean | void>;
  /** Callback fired when navigating backwards. */
  onPrev?: () => void;
  /** Callback fired on the final submission step if no nextStepId is provided. */
  onFinish?: () => void;
}

/**
 * @component Codex.Root
 * @description Encapsulated semantic stepper system panel. Utilizes embedded style strings to map layout variants instantly.
 */
const CodexRoot = ({
  id,
  design = 'outline',
  defaultStepId,
  strictValidation = false,
  darkMode = false,
  brandcolor,
  darkBackgroundColor,
  activeColor,
  titleColor,
  darkTitleColor,
  fontFamily,
  elevation = 5,
  neuIntensity = 1,
  lightSource = 'top-left',
  width = 12,
  newRow,
  className = "",
  style,
  formikContext,
  asChild,
  children
}: CodexRootProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [activeStepId, setActiveStepId] = useState<string>('');

  const themeClass = darkMode ? 'mito-codex-dark' : '';

  const steps = useMemo(() => {
    return React.Children.toArray(children)
      .reduce((acc, child) => {
        if (React.isValidElement<CodexItemProps>(child) && child.props.stepId) {
          acc.push({
            id: child.props.stepId,
            title: child.props.title,
            description: child.props.subtitleDescription,
            icon: child.props.icon
          });
        }
        return acc;
      }, [] as { id: string, title: string, description?: string, icon?: ReactNode }[]);
  }, [children]);

  const stepIds = useMemo(() => steps.map(s => s.id), [steps]);

  useEffect(() => {
    if (steps.length > 0 && !activeStepId) {
      const initialId = defaultStepId && stepIds.includes(defaultStepId) 
        ? defaultStepId 
        : steps[0].id;
      setActiveStepId(initialId);
    }
  }, [defaultStepId, steps, activeStepId, stepIds]);

  useEffect(() => {
    if ((design === 'neumorphic' || design === 'skeuomorphic') && containerRef.current) {
      const parentBg = brandcolor || getNearestParentBackground(containerRef.current.parentElement) || '#e0e5ec';
      const x = lightSource.includes('left') ? elevation : -elevation;
      const y = lightSource.includes('top') ? elevation : -elevation;
      const blur = elevation * 2;
      const shadowDark = adjustColor(parentBg, -20 * neuIntensity);
      const shadowLight = adjustColor(parentBg, 20 * neuIntensity);

      setNeuVars({
        '--mito-codex-bg-env': parentBg,
        '--mito-codex-shadow-dark': shadowDark,
        '--mito-codex-shadow-light': shadowLight,
        '--mito-codex-x': `${x}px`,
        '--mito-codex-y': `${y}px`,
        '--mito-codex-blur': `${blur}px`,
      } as React.CSSProperties);
    }
  }, [design, elevation, lightSource, neuIntensity, brandcolor]);

  let content = children;
  if (formikContext) {
    content = <FormikProvider value={formikContext}>{content}</FormikProvider>;
  }

  const activeIndex = steps.findIndex(s => s.id === activeStepId);
  const Wrapper = asChild ? Slot : "div";

  const customStyles = {
    width: '100%',
    ...style,
    ...neuVars,
    '--mito-codex-bg': brandcolor,
    '--mito-codex-bg-dark': darkBackgroundColor || brandcolor,
    '--mito-codex-text': titleColor,
    '--mito-codex-text-dark': darkTitleColor || titleColor,
    '--mito-codex-active': activeColor || 'var(--ui-brand-color, #2563eb)',
    '--mito-codex-font': fontFamily,
  } as React.CSSProperties & Record<string, any>;

  Object.keys(customStyles).forEach(key => customStyles[key] === undefined && delete customStyles[key]);

  return (
    <CodexContext.Provider value={{ activeStepId, setActiveStepId, design, strictValidation, stepIds, darkMode, activeColor }}>
      <Column span={width} newLine={newRow}>
        <Wrapper 
          id={id}
          ref={containerRef} 
          className={`mito-codex-wrapper ${themeClass} ${className}`} 
          style={customStyles}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .mito-codex-wrapper {
              --scoped-text: var(--mito-codex-text, #111827);
              --scoped-muted-text: rgba(17, 24, 39, 0.6);
              --scoped-active: var(--mito-codex-active, #2563eb);
              --scoped-font: var(--mito-codex-font, "Mozilla Headline", "Montserrat", sans-serif);
              font-family: var(--scoped-font);
            }
            .mito-codex-wrapper.mito-codex-dark {
              --scoped-text: var(--mito-codex-text-dark, #f9fafb);
              --scoped-muted-text: rgba(249, 250, 251, 0.6);
            }

            .mito-step-circle {
              all: unset;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              box-sizing: border-box;
              font-weight: 600;
              color: var(--scoped-text);
              position: relative;
              z-index: 2;
            }
            .mito-step-circle:disabled { cursor: not-allowed; opacity: 0.6; }
            .mito-step-line {
              flex: 1;
              height: 2px;
              margin: 0 8px;
              transition: background-color 0.4s ease;
            }

            /* Step Typography */
            .mito-step-title {
              font-family: var(--scoped-font, "Mozilla Headline", "Montserrat", sans-serif);
              font-size: 0.875rem;
              line-height: 1.25;
              letter-spacing: -0.01em;
              display: block;
              transition: color 0.25s ease;
            }
            .mito-step-subtitle {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
              font-size: 0.72rem;
              font-weight: 300;
              line-height: 1.35;
              display: block;
              margin-top: 4px;
              color: var(--scoped-muted-text);
            }

            /* --- Outline Variant --- */
            .mito-stepper-outline .mito-step-circle.pending {
              border: 1.5px solid var(--gray-6, #cbd5e1);
              background-color: var(--mito-codex-bg, #ffffff);
              color: var(--gray-9, #64748b);
            }
            .mito-stepper-outline .mito-step-circle.active {
              border: 2px solid var(--scoped-active);
              background-color: var(--mito-codex-bg, #ffffff);
              color: var(--scoped-active);
              box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
            }
            .mito-stepper-outline .mito-step-circle.completed {
              background-color: var(--scoped-active);
              border: 2px solid var(--scoped-active);
              color: #ffffff;
            }
            .mito-stepper-outline .mito-step-line.pending {
              background-color: var(--gray-5, #cbd5e1);
            }
            .mito-stepper-outline .mito-step-line.completed {
              background-color: var(--scoped-active);
            }
            .mito-codex-wrapper.mito-codex-dark .mito-stepper-outline .mito-step-circle.pending {
              border-color: rgba(255, 255, 255, 0.25);
              background-color: var(--mito-codex-bg-dark, #1e293b);
              color: rgba(255, 255, 255, 0.65);
            }
            .mito-codex-wrapper.mito-codex-dark .mito-stepper-outline .mito-step-circle.active {
              background-color: var(--mito-codex-bg-dark, #1e293b);
            }
            .mito-codex-wrapper.mito-codex-dark .mito-stepper-outline .mito-step-line.pending {
              background-color: rgba(255, 255, 255, 0.22);
            }

            /* --- Material Variant --- */
            .mito-stepper-material .mito-step-circle {
              border-radius: 8px !important;
              background-color: var(--gray-2, #f8fafc);
              border: 1px solid var(--gray-5, #cbd5e1);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .mito-stepper-material .mito-step-circle.pending {
              color: var(--gray-9, #64748b);
            }
            .mito-stepper-material .mito-step-circle.active {
              background-color: #ffffff;
              border-color: var(--gray-4, #e2e8f0);
              border-bottom: 3px solid var(--scoped-active);
              color: var(--scoped-active);
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              transform: translateY(-2px);
            }
            .mito-stepper-material .mito-step-circle.completed {
              background-color: var(--scoped-active);
              border-color: var(--scoped-active);
              color: #ffffff;
            }
            .mito-stepper-material .mito-step-line {
              background-color: var(--gray-5, #cbd5e1);
              height: 2px;
            }
            .mito-stepper-material .mito-step-line.completed {
              background-color: var(--scoped-active);
            }
            .mito-codex-wrapper.mito-codex-dark .mito-stepper-material .mito-step-circle {
              background-color: var(--gray-11, #1e293b);
              border-color: rgba(255, 255, 255, 0.18);
              color: rgba(255, 255, 255, 0.7);
            }
            .mito-codex-wrapper.mito-codex-dark .mito-stepper-material .mito-step-circle.active {
              background-color: var(--gray-12, #0f172a);
              border-color: rgba(255, 255, 255, 0.15);
              border-bottom: 3px solid var(--scoped-active);
              color: var(--scoped-active);
            }
            .mito-codex-wrapper.mito-codex-dark .mito-stepper-material .mito-step-line.pending {
              background-color: rgba(255, 255, 255, 0.22);
            }

            /* --- Neumorphic Variant --- */
            .mito-stepper-neumorphic .mito-step-circle {
              background-color: var(--mito-codex-bg-env);
              box-shadow: 4px 4px 8px var(--mito-codex-shadow-dark), -4px -4px 8px var(--mito-codex-shadow-light);
            }
            .mito-stepper-neumorphic .mito-step-circle.active {
              box-shadow: inset 4px 4px 8px var(--mito-codex-shadow-dark), inset -4px -4px 8px var(--mito-codex-shadow-light);
              color: var(--scoped-active);
            }
            .mito-stepper-neumorphic .mito-step-circle.completed { color: var(--scoped-active); }
            .mito-stepper-neumorphic .mito-step-line.pending { background-color: var(--mito-codex-shadow-dark); opacity: 0.5; }
            .mito-stepper-neumorphic .mito-step-line.completed { background-color: var(--scoped-active); box-shadow: 0 0 8px var(--scoped-active); }

            /* --- Skeuomorphic Variant --- */
            .mito-stepper-skeuomorphic .mito-step-circle {
              background-color: var(--mito-codex-bg-env);
              background-image: linear-gradient(to top, rgba(0,0,0,0.08) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.6) 100%);
              border: 1px solid rgba(0, 0, 0, 0.15);
              box-shadow: 0 4px 3px 1px rgba(255,255,255,0.5), 0 6px 8px rgba(0,0,0,0.1), inset 0 0 3px 0 rgba(0,0,0,0.1);
            }
            .mito-codex-wrapper.mito-codex-dark .mito-stepper-skeuomorphic .mito-step-circle {
              background-image: linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.1) 100%);
              border-color: rgba(255,255,255,0.05);
              box-shadow: 0 4px 3px 1px rgba(255,255,255,0.05), 0 6px 8px rgba(0,0,0,0.5), inset 0 0 3px 0 rgba(0,0,0,0.3);
            }
            .mito-stepper-skeuomorphic .mito-step-circle.active {
              background-image: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.6) 100%);
              box-shadow: 0 2px 2px 1px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.1), inset 0 0 5px 3px rgba(0,0,0,0.05), inset 0 0 20px rgba(0,0,0,0.1);
              color: var(--scoped-active);
            }
            .mito-stepper-skeuomorphic .mito-step-circle.completed { color: var(--scoped-active); text-shadow: 0 0 8px rgba(255,255,255,0.5); }
            .mito-stepper-skeuomorphic .mito-step-line.pending { background-color: rgba(0,0,0,0.1); border-bottom: 1px solid rgba(255,255,255,0.4); }
            .mito-stepper-skeuomorphic .mito-step-line.completed { background-color: var(--scoped-active); box-shadow: 0 1px 3px rgba(0,0,0,0.3); border: none; }
          `}} />

          <nav aria-label="Progress">
            <Box className={`mito-stepper-${design}`} style={{ paddingBottom: '64px', paddingTop: '10px' }}>
              <ol style={{ display: 'flex', width: '100%', margin: 0, padding: 0, listStyle: 'none', alignItems: 'center' }}>
                {steps.map((step, index) => {
                  const isCompleted = index < activeIndex;
                  const isActive = index === activeIndex;
                  const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'pending';
                  const isFirst = index === 0;
                  const isLast = index === steps.length - 1;
                  
                  // Strict Validation Logic: Prevent jumping ahead if restricted
                  const isClickable = !strictValidation || isCompleted || isActive;

                  const handleStepClick = () => {
                    if (isClickable) {
                      setActiveStepId(step.id);
                    }
                  };

                  return (
                    <li key={step.id} style={{ display: 'flex', flex: isLast ? '0' : '1', alignItems: 'center' }} aria-current={isActive ? 'step' : undefined}>
                      <Box style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button 
                          type="button"
                          disabled={!isClickable}
                          className={`mito-step-circle ${statusClass}`}
                          onClick={handleStepClick}
                          aria-label={`Step ${index + 1}: ${step.title}${isCompleted ? ' (Completed)' : ''}`}
                        >
                          {isCompleted ? <Icon name="check" width="20" height="20" aria-hidden="true" /> : (step.icon ? step.icon : <span>{index + 1}</span>)}
                        </button>

                        <Box style={{ position: 'absolute', top: '100%', marginTop: '12px', width: '148px', left: isFirst ? '0' : isLast ? 'auto' : '50%', right: isLast ? '0' : 'auto', transform: (!isFirst && !isLast) ? 'translateX(-50%)' : 'none', textAlign: isFirst ? 'left' : isLast ? 'right' : 'center' }}>
                          <Text
                            size="2"
                            weight={isActive ? "bold" : "medium"}
                            className="mito-step-title"
                            style={{
                              fontFamily: 'var(--scoped-font, "Mozilla Headline", "Montserrat", sans-serif)',
                              fontSize: '0.875rem',
                              fontWeight: isActive ? 700 : 600,
                              color: isActive ? 'var(--scoped-text)' : 'var(--scoped-muted-text)',
                            }}
                          >
                            {step.title}
                          </Text>
                          {step.description && (
                            <Text
                              size="1"
                              weight="light"
                              className="mito-step-subtitle"
                              style={{
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                fontSize: '0.72rem',
                                fontWeight: 300,
                                color: 'var(--scoped-muted-text)',
                              }}
                            >
                              {step.description}
                            </Text>
                          )}
                        </Box>
                      </Box>

                      {!isLast && (
                        <div className={`mito-step-line ${isCompleted ? 'completed' : 'pending'}`} aria-hidden="true" />
                      )}
                    </li>
                  );
                })}
              </ol>
            </Box>
          </nav>

          <Box style={{ position: 'relative', marginTop: '32px', marginBottom: '32px' }}>
            {content}
          </Box>
        </Wrapper>
      </Column>
    </CodexContext.Provider>
  );
};
CodexRoot.displayName = "Codex.Root";

/**
 * @component Codex.Item
 * @description Individual content panel for a specific step in the timeline. Automatically hides when inactive.
 */
const CodexItem = ({ stepId, children }: CodexItemProps): JSX.Element | null => {
  const { activeStepId } = useStepper();
  if (activeStepId !== stepId) return null;

  return (
    <div className="mito-step-content-animation" style={{ width: '100%', animation: 'mito-fade-in 0.4s ease' }} role="tabpanel">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes mito-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
      {children}
    </div>
  );
};
CodexItem.displayName = "Codex.Item";

/**
 * @component Codex.Controls
 * @description Standardized Next/Back navigation block. Supports asynchronous interceptors and deep light/dark Button theme and hover overrides.
 */
const CodexControls = ({
  nextStepId,
  prevStepId,
  nextLabel = "Continue",
  prevLabel = "Back",
  finishLabel = "Submit",
  prevIcon = "doublearrowleft",
  nextIcon = "doublearrowright",
  finishIcon = "paperplane",
  onSubmit = true,
  darkMode,
  hoverColor,
  darkHoverColor,
  hoverTextColor,
  darkHoverTextColor,
  nextBackgroundColor,
  darkNextBackgroundColor,
  nextTextColor,
  darkNextTextColor,
  nextHoverColor,
  darkNextHoverColor,
  nextHoverTextColor,
  darkNextHoverTextColor,
  prevBackgroundColor,
  darkPrevBackgroundColor,
  prevTextColor,
  darkPrevTextColor,
  prevHoverColor,
  darkPrevHoverColor,
  prevHoverTextColor,
  darkPrevHoverTextColor,
  onNext,
  onPrev,
  onFinish
}: CodexControlsProps): JSX.Element => {
  const { setActiveStepId, stepIds, activeStepId, design, darkMode: rootDarkMode, activeColor } = useStepper();
  
  const formik = useFormikContext(); 
  const [isProcessing, setIsProcessing] = useState(false);

  const resolvedDarkMode = darkMode ?? rootDarkMode;

  const resolvedNextBg = nextBackgroundColor || activeColor;
  const resolvedDarkNextBg = darkNextBackgroundColor || nextBackgroundColor || activeColor;
  const resolvedNextText = nextTextColor || (resolvedNextBg ? '#ffffff' : undefined);
  const resolvedDarkNextText = darkNextTextColor || nextTextColor || (resolvedDarkNextBg ? '#ffffff' : undefined);
  const resolvedNextHoverBg = nextHoverColor ?? hoverColor;
  const resolvedDarkNextHoverBg = darkNextHoverColor ?? darkHoverColor ?? nextHoverColor ?? hoverColor;
  const resolvedNextHoverText = nextHoverTextColor ?? hoverTextColor;
  const resolvedDarkNextHoverText = darkNextHoverTextColor ?? darkHoverTextColor ?? nextHoverTextColor ?? hoverTextColor;

  const resolvedPrevHoverBg = prevHoverColor ?? hoverColor;
  const resolvedDarkPrevHoverBg = darkPrevHoverColor ?? darkHoverColor ?? prevHoverColor ?? hoverColor;
  const resolvedPrevHoverText = prevHoverTextColor ?? hoverTextColor;
  const resolvedDarkPrevHoverText = darkPrevHoverTextColor ?? darkHoverTextColor ?? prevHoverTextColor ?? hoverTextColor;

  const currentIndex = stepIds.indexOf(activeStepId);
  const resolvedPrevId = prevStepId || (currentIndex > 0 ? stepIds[currentIndex - 1] : undefined);
  const resolvedNextId = nextStepId || (currentIndex < stepIds.length - 1 ? stepIds[currentIndex + 1] : undefined);

  const handlePrev = () => {
    if (onPrev) onPrev();
    if (resolvedPrevId) setActiveStepId(resolvedPrevId);
  };

  const handleNext = async (e: React.MouseEvent) => {
    if (resolvedNextId && formik) e.preventDefault();
    
    setIsProcessing(true);
    let canProceed = true;

    if (onNext) {
      const result = await onNext();
      if (result === false) canProceed = false;
    }

    setIsProcessing(false);

    if (canProceed) {
      if (resolvedNextId) {
        setActiveStepId(resolvedNextId);
      } else {
        if (onFinish && !onSubmit) onFinish();
      }
    }
  };

  const isTerminal = !resolvedNextId;

  return (
    <Flex
      gap="3"
      mt="6"
      justify="between"
      align="center"
      style={{
        borderTop: `1px solid ${resolvedDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
        paddingTop: '24px',
        width: '100%'
      }}
    >
      {resolvedPrevId ? (
        <Button 
          variant={design}
          darkMode={resolvedDarkMode}
          backgroundColor={prevBackgroundColor}
          darkBackgroundColor={darkPrevBackgroundColor}
          textColor={prevTextColor}
          darkTextColor={darkPrevTextColor}
          hoverColor={resolvedPrevHoverBg}
          darkHoverColor={resolvedDarkPrevHoverBg}
          hoverTextColor={resolvedPrevHoverText}
          darkHoverTextColor={resolvedDarkPrevHoverText}
          onClick={handlePrev} 
          aria-label="Go to previous step" 
          disabled={isProcessing}
          style={{ opacity: 0.85 }}
        >
          {prevIcon && <><Icon name={prevIcon} aria-hidden="true" />&nbsp;</>}
          {prevLabel}
        </Button>
      ) : <div />}
      &nbsp;&nbsp;
      <Button 
        variant={design}
        darkMode={resolvedDarkMode}
        backgroundColor={resolvedNextBg}
        darkBackgroundColor={resolvedDarkNextBg}
        textColor={resolvedNextText}
        darkTextColor={resolvedDarkNextText}
        hoverColor={resolvedNextHoverBg}
        darkHoverColor={resolvedDarkNextHoverBg}
        hoverTextColor={resolvedNextHoverText}
        darkHoverTextColor={resolvedDarkNextHoverText}
        onClick={handleNext}
        type={onSubmit && isTerminal ? "submit" : "button"}
        aria-label={!isTerminal ? "Go to next step" : "Submit form"}
        disabled={isProcessing || (formik && formik.isSubmitting)}
      >
        {!isTerminal ? (
          <>{nextIcon && <><Icon name={nextIcon} aria-hidden="true" />&nbsp;</>}{nextLabel}</>
        ) : (
          <>{finishIcon && <><Icon name={finishIcon} aria-hidden="true" />&nbsp;</>}{finishLabel}</>
        )}
      </Button>
    </Flex>
  );
};
CodexControls.displayName = "Codex.Controls";

export const Codex = {
  Root: CodexRoot,
  Item: CodexItem,
  Controls: CodexControls,
};