"use client";

import React, { type ReactNode, useEffect, useRef, useState, createContext, useContext, type JSX } from 'react';
import { Flex, Text, Box, Button } from '@radix-ui/themes';
import { Slot } from '@radix-ui/react-slot';
import { FormikProvider, type FormikContextType } from 'formik';
import { Column } from "./Column"; 
import { Icon, type IconName } from "../../components/icons/Icons";
import { adjustColor, getNearestParentBackground } from "../../utils/Vinci";

export type CodexDesign = 'material' | 'outline' | 'neumorphic';

interface CodexContextProps {
  activeStepId: string;
  setActiveStepId: (id: string) => void;
  design: CodexDesign;
}

const CodexContext = createContext<CodexContextProps>({ 
  activeStepId: '', 
  setActiveStepId: () => {}, 
  design: 'outline' 
});

export const useStepper = (): CodexContextProps => useContext(CodexContext);

export interface CodexProps {
  /**
   * The design variation theme configuration.
   * @default 'outline'
   */
  design?: CodexDesign;
  /** Explicit step identifier to open automatically upon mounting. */
  defaultStepId?: string;
  /** Color schema values for dynamic programmatic layout rendering. */
  brandcolor?: string;
  /** Explicit color tracking string targeting label elements. */
  titleColor?: string;
  /** * Viewport column width configuration value (1 to 12).
   * @default 12
   */
  width?: number;
  /** Forces container layouts to break downward onto a fresh structural row line. */
  newRow?: boolean;
  /** Specific custom style class selector. */
  className?: string;
  /** Inline modification style rules object. */
  style?: React.CSSProperties;
  /** Data link layer context mapping active Formik rules. */
  formikContext?: FormikContextType<any>;
  /** Toggles dynamic property forwarding rendering directly onto immediate child targets. */
  asChild?: boolean;
  /** Target child nodes list consisting strictly of CodexItem components. */
  children: ReactNode;
}

export interface CodexItemProps {
  /** Unique string key configuration value tracking placement inside linear stepper arrays. */
  stepId: string;
  /** Main navigation label text. */
  title: string;
  /** Secondary micro-copy descriptive layout subtitle text. */
  subtitleDescription?: string;
  /** Decorative custom element override map inside the active loop indicator. */
  icon?: ReactNode;
  /** Content block child nodes shown if context variables route matching execution onto this block. */
  children: ReactNode;
}

/**
 * @component Codex
 * @description Encapsulated semantic stepper system panel. Utilizes embedded style strings to map layout variant operations instantly without bundle dependencies.
 */
export const Codex = ({
  design = 'outline',
  defaultStepId,
  brandcolor,
  titleColor,
  width = 12,
  newRow,
  className = "",
  style,
  formikContext,
  asChild,
  children
}: CodexProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [neuVars, setNeuVars] = useState<React.CSSProperties>({});
  const [activeStepId, setActiveStepId] = useState<string>('');

  const steps = React.Children.toArray(children)
    .filter((child): child is React.ReactElement<CodexItemProps> => React.isValidElement(child))
    .map((child) => ({
      id: child.props.stepId,
      title: child.props.title,
      description: child.props.subtitleDescription,
      icon: child.props.icon
    }));

  useEffect(() => {
    if (steps.length > 0 && !activeStepId) {
      const initialId = defaultStepId && steps.some(s => s.id === defaultStepId) 
        ? defaultStepId 
        : steps[0].id;
      setActiveStepId(initialId);
    }
  }, [defaultStepId, steps, activeStepId]);

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

  let content = children;
  if (formikContext) {
    content = <FormikProvider value={formikContext}>{content}</FormikProvider>;
  }

  const activeIndex = steps.findIndex(s => s.id === activeStepId);
  const Wrapper = asChild ? Slot : "div";

  return (
    <CodexContext.Provider value={{ activeStepId, setActiveStepId, design }}>
      <Column span={width} newLine={newRow}>
        <Wrapper 
          ref={containerRef} 
          className={`v-codex-wrapper ${className}`} 
          style={{ 
            width: '100%', 
            ...style, 
            ...neuVars,
            ...(brandcolor ? { '--ui-brand-color': brandcolor } : {}),
            ...(titleColor ? { '--ui-title-color': titleColor } : {})
          } as React.CSSProperties}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .v-step-circle {
              all: unset;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              cursor: pointer;
              transition: all 0.3s ease;
              box-sizing: border-box;
              font-weight: 600;
            }
            .v-step-line {
              flex: 1;
              height: 2px;
              margin: 0 8px;
              transition: background-color 0.3s ease;
            }

            /* Outline Style Rules */
            .v-stepper-outline .v-step-circle.pending { border: 2px solid var(--gray-6); color: var(--gray-8); }
            .v-stepper-outline .v-step-circle.active { border: 2px solid var(--ui-brand-color, var(--blue-9)); color: var(--ui-brand-color, var(--blue-9)); }
            .v-stepper-outline .v-step-circle.completed { background-color: var(--ui-brand-color, var(--blue-9)); color: white; }
            .v-stepper-outline .v-step-line.pending { background-color: var(--gray-5); }
            .v-stepper-outline .v-step-line.completed { background-color: var(--ui-brand-color, var(--blue-9)); }

            /* Material Style Rules */
            .v-stepper-material .v-step-circle { border-radius: 0px !important; }
            .v-stepper-material .v-step-circle.pending { border-bottom: 2px solid var(--gray-6); color: var(--gray-8); }
            .v-stepper-material .v-step-circle.active { border-bottom: 2px solid var(--ui-brand-color, var(--blue-9)); color: var(--ui-brand-color, var(--blue-9)); }
            .v-stepper-material .v-step-circle.completed { border-bottom: 2px solid var(--green-9); color: var(--green-9); }
            .v-stepper-material .v-step-line { background-color: var(--gray-5); }

            /* Neumorphic Style Rules */
            .v-stepper-neumorphic .v-step-circle {
              background-color: var(--neu-bg);
              box-shadow: 4px 4px 8px var(--neu-shadow-dark), -4px -4px 8px var(--neu-shadow-light);
            }
            .v-stepper-neumorphic .v-step-circle.active {
              box-shadow: inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light);
              color: var(--ui-brand-color, var(--blue-9));
            }
            .v-stepper-neumorphic .v-step-circle.completed {
              color: var(--green-9);
            }
            .v-stepper-neumorphic .v-step-line.pending { background-color: var(--gray-6); }
            .v-stepper-neumorphic .v-step-line.completed { background-color: var(--green-9); }
          `}} />

          <nav aria-label="Progress">
            <Box className={`v-stepper-${design}`} style={{ paddingBottom: '60px', paddingTop: '10px' }}>
              <ol style={{ display: 'flex', width: '100%', margin: 0, padding: 0, listStyle: 'none', alignItems: 'center' }}>
                {steps.map((step, index) => {
                  const isCompleted = index < activeIndex;
                  const isActive = index === activeIndex;
                  const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'pending';
                  const isFirst = index === 0;
                  const isLast = index === steps.length - 1;

                  return (
                    <li key={step.id} style={{ display: 'flex', flex: isLast ? '0' : '1', alignItems: 'center' }} aria-current={isActive ? 'step' : undefined}>
                      <Box style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button 
                          type="button"
                          className={`v-step-circle ${statusClass}`}
                          onClick={() => setActiveStepId(step.id)}
                          aria-label={`Step ${index + 1}: ${step.title}${isCompleted ? ' (Completed)' : ''}`}
                        >
                          {isCompleted ? <Icon name="check" width="20" height="20" aria-hidden="true" /> : (step.icon ? step.icon : <span>{index + 1}</span>)}
                        </button>

                        <Box style={{ position: 'absolute', top: '100%', marginTop: '12px', width: '120px', left: isFirst ? '0' : isLast ? 'auto' : '50%', right: isLast ? '0' : 'auto', transform: (!isFirst && !isLast) ? 'translateX(-50%)' : 'none', textAlign: isFirst ? 'left' : isLast ? 'right' : 'center' }}>
                          <Text size="2" weight={isActive ? "bold" : "regular"} style={{ color: isActive ? 'var(--gray-12)' : 'var(--gray-10)', display: 'block', lineHeight: 1.2 }}>
                            {step.title}
                          </Text>
                          {step.description && (
                            <Text size="1" color="gray" style={{ display: 'block', marginTop: '4px' }}>
                              {step.description}
                            </Text>
                          )}
                        </Box>
                      </Box>

                      {!isLast && (
                        <div className={`v-step-line ${isCompleted ? 'completed' : 'pending'}`} aria-hidden="true" />
                      )}
                    </li>
                  );
                })}
              </ol>
            </Box>
          </nav>

          <Box style={{ position: 'relative', marginTop: '33px', marginBottom: '33px' }}>
            {content}
          </Box>
        </Wrapper>
      </Column>
    </CodexContext.Provider>
  );
};

export const CodexItem = ({ stepId, children }: CodexItemProps): JSX.Element | null => {
  const { activeStepId } = useContext(CodexContext);
  if (activeStepId !== stepId) return null;

  return (
    <div className="v-step-content-animation" style={{ width: '100%' }} role="tabpanel">
      {children}
    </div>
  );
};

export interface CodexControlsProps {
  nextStepId?: string;
  prevStepId?: string;
  nextLabel?: string;
  nextIcon?: IconName;
  prevLabel?: string;
  prevIcon?: IconName;
  finishLabel?: string;
  finishIcon?: IconName;
  onSubmit?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
}

export const CodexControls = ({
  nextStepId,
  prevStepId,
  nextLabel = "Continue",
  prevLabel = "Back",
  finishLabel = "Submit",
  prevIcon = "doublearrowleft",
  nextIcon = "doublearrowright",
  finishIcon = "paperplane",
  onSubmit = true,
  onNext,
  onPrev,
  onFinish
}: CodexControlsProps): JSX.Element => {
  const { setActiveStepId } = useStepper();

  const handlePrev = () => {
    if (onPrev) onPrev();
    if (prevStepId) setActiveStepId(prevStepId);
  };

  const handleNext = () => {
    if (nextStepId) {
      if (onNext) onNext();
      setActiveStepId(nextStepId);
    } else {
      if (onFinish && !onSubmit) onFinish();
    }
  };

  return (
    <Flex gap="3" mt="6" justify="between" align="center" style={{ borderTop: '1px solid var(--gray-5)', paddingTop: '20px', width: '100%' }}>
      {prevStepId ? (
        <Button variant="soft" color="gray" onClick={handlePrev} aria-label="Go to previous step">
          {prevIcon && <><Icon name={prevIcon} aria-hidden="true" />&nbsp;</>}
          {prevLabel}
        </Button>
      ) : <div />}

      <Button 
        variant="solid" 
        color={nextStepId ? "blue" : "green"} 
        onClick={handleNext}
        type={onSubmit && !nextStepId ? "submit" : "button"}
        style={{ backgroundColor: 'var(--ui-brand-color, var(--accent-9))', color: 'white' }}
        aria-label={nextStepId ? "Go to next step" : "Submit form"}
      >
        {nextStepId ? (
          <>{nextIcon && <><Icon name={nextIcon} aria-hidden="true" />&nbsp;</>}{nextLabel}</>
        ) : (
          <>{finishIcon && <><Icon name={finishIcon} aria-hidden="true" />&nbsp;</>}{finishLabel}</>
        )}
      </Button>
    </Flex>
  );
};