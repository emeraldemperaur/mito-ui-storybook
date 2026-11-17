import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form, Field } from 'formik';
import { Codex } from './Codex';
import { Row } from '../Layout/Row';
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import type { IconName } from '../../components/icons/Icons';

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CreditCardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

type CodexStoryArgs = React.ComponentProps<typeof Codex.Root> & {
  // Codex.Item Props
  itemStepId?: string;
  itemTitle?: string;
  itemSubtitle?: string;
  itemIcon?: React.ReactNode;

  // Codex.Controls Props
  nextStepId?: string;
  prevStepId?: string;
  nextLabel?: string;
  nextIcon?: IconName;
  prevLabel?: string;
  prevIcon?: IconName;
  finishLabel?: string;
  finishIcon?: IconName;
  onSubmit?: boolean;
  controlsDarkMode?: boolean;
  hoverColor?: string;
  darkHoverColor?: string;
  hoverTextColor?: string;
  darkHoverTextColor?: string;
  nextBackgroundColor?: string;
  darkNextBackgroundColor?: string;
  nextTextColor?: string;
  darkNextTextColor?: string;
  nextHoverColor?: string;
  darkNextHoverColor?: string;
  nextHoverTextColor?: string;
  darkNextHoverTextColor?: string;
  prevBackgroundColor?: string;
  darkPrevBackgroundColor?: string;
  prevTextColor?: string;
  darkPrevTextColor?: string;
  prevHoverColor?: string;
  darkPrevHoverColor?: string;
  prevHoverTextColor?: string;
  darkPrevHoverTextColor?: string;
  onNext?: () => boolean | void | Promise<boolean | void>;
  onPrev?: () => void;
  onFinish?: () => void;
};

/**
 * Enterprise semantic stepper system. Relies on a strict compound architecture to isolate 
 * workflow state, content panels, and linear navigation controls:
 * 
 * - **`Codex.Root`**: Master layout and state boundary. Manages active steps, validation locks, Formik context injection, and cascades design motifs.
 * - **`Codex.Item`**: Individual step panel. Registers timeline metadata (`stepId`, `title`, `subtitleDescription`, `icon`) and conditionally renders active panel children.
 * - **`Codex.Controls`**: Standardized linear navigation bar (`Back`, `Continue`, `Submit`). Supports async validation interceptors (`onNext`) and granular light/dark base and hover theming for the underlying library `Button` components.
 */
const meta: Meta<CodexStoryArgs> = {
  title: 'Information/Codex',
  component: Codex.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Agents and developers must adhere to strict structural constraints when composing multi-step workflows. Map complex linear journeys into the 3-part compound composition (`Codex.Root`, `Codex.Item`, `Codex.Controls`), and utilize `strictValidation={true}` for forms requiring sequential data validation before progression.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<Codex\.Root)/, '$1')
            .replace(/(<\/Codex\.Root>)\s*\}$/, '$1');
          const importStatement = `import { Codex } from '@emeraldemepraur/mito-ui';\n\n`;
          return `${importStatement}${cleanCode.trim()}`;
        },
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1f2937' },
      ],
    },
  },
  argTypes: {
    // --- Codex.Root Props ---
    id: {
      control: 'text',
      description: 'Unique identifier for the Codex container. Essential for deterministic end-to-end testing.',
      table: { category: 'Codex.Root Props' },
    },
    design: {
      control: 'radio',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'Core architectural design motif propagating to the timeline UI and child `Codex.Controls` buttons.',
      table: { category: 'Codex.Root Props', defaultValue: { summary: 'outline' } },
    },
    defaultStepId: {
      control: 'text',
      description: 'Explicit step identifier to open automatically upon initial mount.',
      table: { category: 'Codex.Root Props' },
    },
    strictValidation: {
      control: 'boolean',
      description: 'Restricts navigation. When true, users cannot click ahead to future steps via the timeline circles; they must progress linearly via `Codex.Controls`.',
      table: { category: 'Codex.Root Props', defaultValue: { summary: 'false' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component and cascaded controls into dark mode, overriding system contexts.',
      table: { category: 'Codex.Root Props', defaultValue: { summary: 'false' } },
    },
    brandcolor: {
      control: 'color',
      description: 'Base environment/surface background color for light mode and 3D shadow calculation.',
      table: { category: 'Codex.Root Props' },
    },
    darkBackgroundColor: {
      control: 'color',
      description: 'Dynamic base background color specifically for dark mode contexts.',
      table: { category: 'Codex.Root Props' },
    },
    activeColor: {
      control: 'color',
      description: 'Highlight color applied to active step indicators, completed connector lines, and default primary control buttons.',
      table: { category: 'Codex.Root Props' },
    },
    titleColor: {
      control: 'color',
      description: 'Explicit color string targeting step title labels in light mode.',
      table: { category: 'Codex.Root Props' },
    },
    darkTitleColor: {
      control: 'color',
      description: 'Explicit color string targeting step title labels in dark mode.',
      table: { category: 'Codex.Root Props' },
    },
    fontFamily: {
      control: 'text',
      description: 'Font family override to match specific UI brand primitives.',
      table: { category: 'Codex.Root Props', defaultValue: { summary: '"Mozilla Headline", "Montserrat", sans-serif' } },
    },
    elevation: {
      control: { type: 'range', min: 1, max: 15, step: 1 },
      description: 'Controls perceived physical distance of 3D nodes from the background (Neumorphic/Skeuomorphic).',
      table: { category: 'Codex.Root Props', defaultValue: { summary: '5' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Mathematical multiplier applied to the opacity of light/dark shadow channels.',
      table: { category: 'Codex.Root Props', defaultValue: { summary: '1' } },
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Dictates the simulated directional angle of the global environment light source.',
      table: { category: 'Codex.Root Props', defaultValue: { summary: 'top-left' } },
    },
    width: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Viewport column width spanning across grid boundaries (1 to 12).',
      table: { category: 'Codex.Root Props', defaultValue: { summary: '12' } },
    },
    newRow: {
      control: 'boolean',
      description: 'Forces container layouts to break downward onto a fresh structural grid line.',
      table: { category: 'Codex.Root Props' },
    },
    asChild: {
      control: 'boolean',
      description: 'Toggles dynamic property forwarding directly onto immediate child targets via Radix Slot.',
      table: { category: 'Codex.Root Props' },
    },
    formikContext: {
      control: false,
      description: 'Explicit Formik context object injected via `FormikProvider` for nested step fields.',
      table: { category: 'Codex.Root Props' },
    },

    // --- Codex.Item Props ---
    itemStepId: {
      name: 'stepId (Item)',
      control: 'text',
      description: 'Unique string key tracking placement inside linear stepper arrays.',
      table: { category: 'Codex.Item Props' },
    },
    itemTitle: {
      name: 'title (Item)',
      control: 'text',
      description: 'Main navigation label text displayed in the timeline.',
      table: { category: 'Codex.Item Props' },
    },
    itemSubtitle: {
      name: 'subtitleDescription (Item)',
      control: 'text',
      description: 'Secondary micro-copy descriptive layout subtitle text.',
      table: { category: 'Codex.Item Props' },
    },
    itemIcon: {
      name: 'icon (Item)',
      control: 'select',
      options: ['User', 'CreditCard', 'ShieldCheck', 'None'],
      mapping: { User: <UserIcon />, CreditCard: <CreditCardIcon />, ShieldCheck: <ShieldCheckIcon />, None: undefined },
      description: 'Decorative custom element override inside the timeline step indicator.',
      table: { category: 'Codex.Item Props' },
    },

    // --- Codex.Controls Props ---
    nextStepId: {
      name: 'nextStepId (Controls)',
      control: 'text',
      description: 'Explicit target stepId to navigate to when Next is clicked. Auto-resolves sequentially if omitted.',
      table: { category: 'Codex.Controls Props' },
    },
    prevStepId: {
      name: 'prevStepId (Controls)',
      control: 'text',
      description: 'Explicit target stepId to navigate to when Back is clicked. Auto-resolves sequentially if omitted.',
      table: { category: 'Codex.Controls Props' },
    },
    nextLabel: {
      name: 'nextLabel (Controls)',
      control: 'text',
      description: 'Label for the forward progression button.',
      table: { category: 'Codex.Controls Props', defaultValue: { summary: 'Continue' } },
    },
    nextIcon: {
      name: 'nextIcon (Controls)',
      control: 'text',
      description: 'Icon name for the forward progression button.',
      table: { category: 'Codex.Controls Props', defaultValue: { summary: 'doublearrowright' } },
    },
    prevLabel: {
      name: 'prevLabel (Controls)',
      control: 'text',
      description: 'Label for the backward progression button.',
      table: { category: 'Codex.Controls Props', defaultValue: { summary: 'Back' } },
    },
    prevIcon: {
      name: 'prevIcon (Controls)',
      control: 'text',
      description: 'Icon name for the backward progression button.',
      table: { category: 'Codex.Controls Props', defaultValue: { summary: 'doublearrowleft' } },
    },
    finishLabel: {
      name: 'finishLabel (Controls)',
      control: 'text',
      description: 'Label for the final terminal action button.',
      table: { category: 'Codex.Controls Props', defaultValue: { summary: 'Submit' } },
    },
    finishIcon: {
      name: 'finishIcon (Controls)',
      control: 'text',
      description: 'Icon name for the final terminal action button.',
      table: { category: 'Codex.Controls Props', defaultValue: { summary: 'paperplane' } },
    },
    onSubmit: {
      name: 'onSubmit (Controls)',
      control: 'boolean',
      description: 'Determines if clicking Finish triggers a native form submission (`type="submit"`).',
      table: { category: 'Codex.Controls Props', defaultValue: { summary: 'true' } },
    },
    controlsDarkMode: {
      name: 'darkMode (Controls)',
      control: 'boolean',
      description: 'Overrides the parent `Codex.Root` darkMode state specifically for the control buttons.',
      table: { category: 'Codex.Controls Props' },
    },
    hoverColor: {
      name: 'hoverColor (Controls)',
      control: 'color',
      description: 'Shared hover background color fallback applied to control buttons in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkHoverColor: {
      name: 'darkHoverColor (Controls)',
      control: 'color',
      description: 'Shared hover background color fallback applied to control buttons in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    hoverTextColor: {
      name: 'hoverTextColor (Controls)',
      control: 'color',
      description: 'Shared hover text and icon color fallback applied to control buttons in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkHoverTextColor: {
      name: 'darkHoverTextColor (Controls)',
      control: 'color',
      description: 'Shared hover text and icon color fallback applied to control buttons in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    nextBackgroundColor: {
      name: 'nextBackgroundColor (Controls)',
      control: 'color',
      description: 'Background color for the primary (Next/Submit) button in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkNextBackgroundColor: {
      name: 'darkNextBackgroundColor (Controls)',
      control: 'color',
      description: 'Background color for the primary (Next/Submit) button in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    nextTextColor: {
      name: 'nextTextColor (Controls)',
      control: 'color',
      description: 'Text and icon color for the primary (Next/Submit) button in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkNextTextColor: {
      name: 'darkNextTextColor (Controls)',
      control: 'color',
      description: 'Text and icon color for the primary (Next/Submit) button in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    nextHoverColor: {
      name: 'nextHoverColor (Controls)',
      control: 'color',
      description: 'Hover background color specifically for the primary (Next/Submit) button in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkNextHoverColor: {
      name: 'darkNextHoverColor (Controls)',
      control: 'color',
      description: 'Hover background color specifically for the primary (Next/Submit) button in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    nextHoverTextColor: {
      name: 'nextHoverTextColor (Controls)',
      control: 'color',
      description: 'Hover text and icon color specifically for the primary (Next/Submit) button in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkNextHoverTextColor: {
      name: 'darkNextHoverTextColor (Controls)',
      control: 'color',
      description: 'Hover text and icon color specifically for the primary (Next/Submit) button in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    prevBackgroundColor: {
      name: 'prevBackgroundColor (Controls)',
      control: 'color',
      description: 'Background color for the secondary (Back) button in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkPrevBackgroundColor: {
      name: 'darkPrevBackgroundColor (Controls)',
      control: 'color',
      description: 'Background color for the secondary (Back) button in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    prevTextColor: {
      name: 'prevTextColor (Controls)',
      control: 'color',
      description: 'Text and icon color for the secondary (Back) button in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkPrevTextColor: {
      name: 'darkPrevTextColor (Controls)',
      control: 'color',
      description: 'Text and icon color for the secondary (Back) button in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    prevHoverColor: {
      name: 'prevHoverColor (Controls)',
      control: 'color',
      description: 'Hover background color specifically for the secondary (Back) button in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkPrevHoverColor: {
      name: 'darkPrevHoverColor (Controls)',
      control: 'color',
      description: 'Hover background color specifically for the secondary (Back) button in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    prevHoverTextColor: {
      name: 'prevHoverTextColor (Controls)',
      control: 'color',
      description: 'Hover text and icon color specifically for the secondary (Back) button in light mode.',
      table: { category: 'Codex.Controls Props' },
    },
    darkPrevHoverTextColor: {
      name: 'darkPrevHoverTextColor (Controls)',
      control: 'color',
      description: 'Hover text and icon color specifically for the secondary (Back) button in dark mode.',
      table: { category: 'Codex.Controls Props' },
    },
    onNext: {
      name: 'onNext (Controls)',
      action: 'onNext',
      description: 'Async intercept function fired before progressing. Returning `false` aborts navigation.',
      table: { category: 'Codex.Controls Props' },
      control: false,
    },
    onPrev: {
      name: 'onPrev (Controls)',
      action: 'onPrev',
      description: 'Callback fired when navigating backwards.',
      table: { category: 'Codex.Controls Props' },
      control: false,
    },
    onFinish: {
      name: 'onFinish (Controls)',
      action: 'onFinish',
      description: 'Callback fired on the final terminal step when `onSubmit={false}`.',
      table: { category: 'Codex.Controls Props' },
      control: false,
    },
  },
  args: {
    design: 'outline',
    strictValidation: false,
    darkMode: false,
    width: 12,
    elevation: 5,
    neuIntensity: 1,
    lightSource: 'top-left',
    itemStepId: 'step-1',
    itemTitle: 'Account Identity',
    itemSubtitle: 'Basic configuration',
    itemIcon: 'User' as unknown as React.ReactNode,
    nextLabel: 'Continue',
    prevLabel: 'Back',
    prevBackgroundColor: '#000000',
    darkPrevBackgroundColor: '#000000',
    prevTextColor: '#ffffff',
    darkPrevTextColor: '#ffffff',
    prevHoverColor: '#333232',
    darkPrevHoverColor: '#333232',
    finishLabel: 'Deploy Workspace',
    onSubmit: true,
  },
  decorators: [
    (Story, context) => {
      const { design, darkMode, brandcolor } = context.args;
      const disableRowWrap = context.parameters.disableRowWrap; 

      let bg = '#ffffff';
      if (darkMode) {
        bg = '#1f2937';
      } else if (design === 'neumorphic' || design === 'skeuomorphic') {
        bg = brandcolor || '#e0e5ec';
      } else if (design === 'outline') {
        bg = '#f9fafb';
      }

      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <div
            style={{
              minHeight: '480px',
              width: '100%',
              backgroundColor: bg,
              padding: '2rem',
              borderRadius: '12px',
              transition: 'background-color 0.3s ease',
              boxSizing: 'border-box',
            }}
          >
            {disableRowWrap ? (
              <Story />
            ) : (
              <Row gap="4">
                <Story />
              </Row>
            )}
          </div>
        </GlobalUIContext.Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<CodexStoryArgs>;

// ---------------------------------------------------------------------------
// SHARED DEMO HELPERS
// ---------------------------------------------------------------------------

const StandardContentBox = ({ title, desc, darkMode = false }: { title: string; desc: string; darkMode?: boolean }) => (
  <div
    style={{
      padding: '32px',
      backgroundColor: darkMode ? '#111827' : '#ffffff',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e5e7eb'}`,
      borderRadius: '8px',
      minHeight: '140px',
      boxSizing: 'border-box',
    }}
  >
    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: darkMode ? '#f9fafb' : '#111827' }}>{title}</h3>
    <p style={{ margin: 0, color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '14px', lineHeight: 1.5 }}>{desc}</p>
  </div>
);

const renderStandardSteps = (args: CodexStoryArgs) => {
  const {
    itemStepId,
    itemTitle,
    itemSubtitle,
    itemIcon,
    nextStepId,
    prevStepId,
    nextLabel,
    nextIcon,
    prevLabel,
    prevIcon,
    finishLabel,
    finishIcon,
    onSubmit,
    controlsDarkMode,
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
    onFinish,
    ...rootArgs
  } = args;

  const controlProps = {
    nextLabel,
    nextIcon,
    prevLabel,
    prevIcon,
    finishLabel,
    finishIcon,
    onSubmit,
    darkMode: controlsDarkMode,
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
    onFinish,
  };

  return (
    <Codex.Root {...rootArgs}>
      <Codex.Item
        stepId={itemStepId || 'step-1'}
        title={itemTitle || 'Account Identity'}
        subtitleDescription={itemSubtitle}
        icon={itemIcon}
      >
        <StandardContentBox
          title="Identity Configuration"
          desc="Establish the root administrator identity and domain namespace for your workspace."
          darkMode={rootArgs.darkMode}
        />
        <Codex.Controls {...controlProps} nextStepId={nextStepId} />
      </Codex.Item>

      <Codex.Item
        stepId="step-2"
        title="Billing Details"
        subtitleDescription="Payment method"
        icon={<CreditCardIcon />}
      >
        <StandardContentBox
          title="Payment Provisioning"
          desc="Securely attach an enterprise billing profile to authorize infrastructure scale-out."
          darkMode={rootArgs.darkMode}
        />
        <Codex.Controls {...controlProps} prevStepId={prevStepId} />
      </Codex.Item>

      <Codex.Item
        stepId="step-3"
        title="Validation"
        subtitleDescription="Final security check"
        icon={<ShieldCheckIcon />}
      >
        <StandardContentBox
          title="Security Validation"
          desc="Review all applied IAM policies and initialize the environment deployment."
          darkMode={rootArgs.darkMode}
        />
        <Codex.Controls {...controlProps} />
      </Codex.Item>
    </Codex.Root>
  );
};

// ---------------------------------------------------------------------------
// CORE VARIANTS
// ---------------------------------------------------------------------------

export const Outline: Story = {
  render: renderStandardSteps,
  args: {
    design: 'outline',
    activeColor: '#2563eb',
    nextHoverColor: '#1d4ed8',
    prevHoverColor: '#f3f4f6',
  },
};

export const Material: Story = {
  render: renderStandardSteps,
  args: {
    design: 'material',
    activeColor: '#10b981',
    nextHoverColor: '#059669',
    prevHoverColor: '#e5e7eb',
  },
};

export const Neumorphic: Story = {
  render: renderStandardSteps,
  args: {
    design: 'neumorphic',
    brandcolor: '#e0e5ec',
    titleColor: '#333333',
    activeColor: '#e11d48',
    nextBackgroundColor: '#e0e5ec',
    nextTextColor: '#e11d48',
    nextHoverColor: '#d1d9e6',
    prevBackgroundColor: '#e0e5ec',
    prevTextColor: '#000000',
    darkPrevTextColor: '#000000',
    prevHoverColor: '#d1d9e6',
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft, extruded physical surfaces adapting to the parent environment background (`#e0e5ec`). Control buttons inherit the `neumorphic` design motif and support custom hover states.',
      },
    },
  },
};

export const Skeuomorphic: Story = {
  render: renderStandardSteps,
  args: {
    design: 'skeuomorphic',
    brandcolor: '#e0e5ec',
    activeColor: '#2563eb',
    nextBackgroundColor: '#e0e5ec',
    nextTextColor: '#1e3a8a',
    nextHoverColor: '#dbeafe',
    prevBackgroundColor: '#e0e5ec',
    prevTextColor: '#374151',
    prevHoverColor: '#f3f4f6',
  },
  parameters: {
    docs: {
      description: {
        story: 'High-fidelity 3D realistic mechanical step indicators and tactile control buttons.',
      },
    },
  },
};

export const DarkModeOverride: Story = {
  render: renderStandardSteps,
  args: {
    design: 'outline',
    darkMode: true,
    activeColor: '#60a5fa',
    darkNextBackgroundColor: '#2563eb',
    darkNextTextColor: '#ffffff',
    darkNextHoverColor: '#1d4ed8',
    darkPrevBackgroundColor: '#374151',
    darkPrevTextColor: '#f9fafb',
    darkPrevHoverColor: '#4b5563',
  },
  parameters: {
    docs: {
      description: {
        story: 'Forces `Codex.Root` and cascaded `Codex.Controls` into dark mode with custom dark-theme base and hover button overrides.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// FORMIK & VALIDATION INTEGRATION
// ---------------------------------------------------------------------------

/**
 * **Interactive Form Pipeline:**
 * Deep integration mapping a multi-step Formik pipeline directly to `Codex.Root`. 
 * Features `strictValidation={true}`, locking timeline circles to prevent skipping ahead, 
 * and requiring users to pass the `onNext` validation intercept on `Codex.Controls`.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{ firstName: '', lastName: '', accessLevel: 'Standard' }}
        onSubmit={(values, { setSubmitting }) => {
          alert(`Codex Pipeline Complete: \n${JSON.stringify(values, null, 2)}`);
          setSubmitting(false);
        }}
      >
        {(formikProps) => (
          <Form style={{ display: 'flex', flexDirection: 'column', width: '100%', fontFamily: 'system-ui, sans-serif' }}>
            {/* Formik State Monitor Console */}
            <div
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                padding: '16px',
                color: '#f8fafc',
                fontFamily: 'monospace',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                marginBottom: '32px',
              }}
            >
              <span style={{ color: '#fb7185', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Formik State Monitor
              </span>
              <pre style={{ margin: 0, marginTop: '8px', fontSize: '13px', color: '#93c5fd' }}>
                {JSON.stringify(formikProps.values, null, 2)}
              </pre>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>
                * Strict Validation enabled. Complete First Name and Last Name to unlock Step 2.
              </div>
            </div>

            {/* The Codex component acts as the Formik state boundary */}
            <Codex.Root
              design={args.design}
              strictValidation={args.strictValidation}
              activeColor={args.activeColor}
              darkMode={args.darkMode}
              width={args.width}
              formikContext={formikProps}
            >
              <Codex.Item stepId="identity" title="Identity Details" subtitleDescription="Personal information" icon={<UserIcon />}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>First Name *</label>
                      <Field
                        name="firstName"
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
                        placeholder="Jane"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Last Name *</label>
                      <Field
                        name="lastName"
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>
                <Codex.Controls
                  nextHoverColor="#4338ca"
                  onNext={() => {
                    if (!formikProps.values.firstName || !formikProps.values.lastName) {
                      alert('Strict Validation Failure: First Name and Last Name are required.');
                      return false;
                    }
                    return true;
                  }}
                />
              </Codex.Item>

              <Codex.Item stepId="access" title="Security Roles" subtitleDescription="Permissions layer" icon={<ShieldCheckIcon />}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Access Level Provisioning</label>
                    <Field
                      as="select"
                      name="accessLevel"
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}
                    >
                      <option value="Standard">Standard User (Read-Only)</option>
                      <option value="Manager">Manager (Read/Write)</option>
                      <option value="Admin">Administrator (Full Access)</option>
                    </Field>
                  </div>
                </div>
                <Codex.Controls nextHoverColor="#4338ca" prevHoverColor="#e5e7eb" />
              </Codex.Item>

              <Codex.Item stepId="review" title="System Verification" subtitleDescription="Final confirmation" icon={<CreditCardIcon />}>
                <div style={{ backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '24px', border: '1px solid #bbf7d0', color: '#166534' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Ready for Provisioning</h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    All data policies have cleared. Click the button below to formally submit the payload to the ingestion API.
                  </p>
                </div>
                <Codex.Controls finishLabel="Provision Account" onSubmit={true} nextHoverColor="#4338ca" prevHoverColor="#e5e7eb" />
              </Codex.Item>
            </Codex.Root>
          </Form>
        )}
      </Formik>
    );
  },
  args: {
    design: 'material',
    strictValidation: true,
    activeColor: '#4f46e5',
  },
  parameters: {
    disableRowWrap: true,
    docs: {
      source: {
        code: `import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Codex } from '@emeraldemepraur/mito-ui';

export const FormikCodexPipeline = () => {
  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', accessLevel: 'Standard' }}
      onSubmit={(values) => console.log("Provisioning Payload:", values)}
    >
      {(formikProps) => (
        <Form>
          <Codex.Root formikContext={formikProps} design="material" strictValidation={true} activeColor="#4f46e5">
            
            <Codex.Item stepId="identity" title="Identity Details" subtitleDescription="Personal information">
              <Field name="firstName" placeholder="First Name" />
              <Field name="lastName" placeholder="Last Name" />
              <Codex.Controls 
                nextHoverColor="#4338ca"
                onNext={() => {
                  if (!formikProps.values.firstName || !formikProps.values.lastName) {
                    alert('Validation Failed');
                    return false;
                  }
                  return true;
                }} 
              />
            </Codex.Item>

            <Codex.Item stepId="access" title="Security Roles" subtitleDescription="Permissions layer">
              <Field as="select" name="accessLevel">
                <option value="Standard">Standard User</option>
                <option value="Admin">Administrator</option>
              </Field>
              <Codex.Controls nextHoverColor="#4338ca" prevHoverColor="#e5e7eb" />
            </Codex.Item>

            <Codex.Item stepId="review" title="System Verification" subtitleDescription="Final confirmation">
              <p>Ready to deploy.</p>
              <Codex.Controls finishLabel="Provision Account" onSubmit={true} nextHoverColor="#4338ca" prevHoverColor="#e5e7eb" />
            </Codex.Item>

          </Codex.Root>
        </Form>
      )}
    </Formik>
  );
};`,
      },
    },
  },
};