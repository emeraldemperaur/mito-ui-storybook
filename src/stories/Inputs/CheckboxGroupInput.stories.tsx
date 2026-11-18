import React, { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { CheckboxGroupInput, type CheckboxGroupProps } from './CheckboxGroupInput';
import { Row } from '../Layout/Row';
import { type InputOption } from '../../utils/Vinci';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const AI_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Enable NLP Context Analysis', optionvalue: 'nlp' },
  { optionid: 2, text: 'Retain Training Data Logs', optionvalue: 'logs' },
  { optionid: 3, text: 'Opt-In to Beta Reasoning Models', optionvalue: 'beta' },
];

const FINANCE_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Equities (Stocks)', optionvalue: 'equities' },
  { optionid: 2, text: 'Fixed Income Bonds', optionvalue: 'bonds' },
  { optionid: 3, text: 'Derivatives & Options', optionvalue: 'derivatives' },
];

const AEROSPACE_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Turbine Diagnostics', optionvalue: 'turbines' },
  { optionid: 2, text: 'Avionics Telemetry', optionvalue: 'avionics' },
  { optionid: 3, text: 'Fuselage Integrity Scans', optionvalue: 'fuselage' },
];

const CONSTRUCTION_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Structural Concrete', optionvalue: 'concrete' },
  { optionid: 2, text: 'Load-Bearing Steel', optionvalue: 'steel' },
  { optionid: 3, text: 'Insulation & Drywall', optionvalue: 'drywall' },
];

const METALLURGY_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Titanium Alloys', optionvalue: 'titanium' },
  { optionid: 2, text: 'High-Carbon Steel', optionvalue: 'carbonsteel' },
  { optionid: 3, text: 'Aluminum Composites', optionvalue: 'aluminum' },
];

const MEDICAL_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Cardiology Review', optionvalue: 'cardiology' },
  { optionid: 2, text: 'Neurology Review', optionvalue: 'neurology' },
  { optionid: 3, text: 'Oncology Review', optionvalue: 'oncology' },
];

const ROBOTICS_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Kinematic Servos', optionvalue: 'servo_xyz', tag: 'CORE', score: 9.8, note: 'Primary mobility actuators' },
  { optionid: 2, text: 'LIDAR Navigation', optionvalue: 'lidar_v2', tag: 'SENSORY', score: 8.5, note: '360° environmental mapping' },
  { optionid: 3, text: 'Tactile Feedback Grippers', optionvalue: 'grip_tactile', tag: 'BETA', score: 4.2, note: 'Experimental pressure sensors' },
];

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 3 0 5 1 7 2a1 1 0 0 1 1 1z" />
  </svg>
);

const CpuIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

const StatefulCheckboxGroup = (args: CheckboxGroupProps) => {
  const [val, setVal] = useState<string[]>(args.value || []);

  return (
    <CheckboxGroupInput
      {...args}
      value={val}
      onChange={(newVal) => {
        setVal(newVal);
        args.onChange?.(newVal);
      }}
    />
  );
};

const withMitoContext: Decorator = (Story, context) => {
  const { design, darkMode, backgroundColor } = context.args as any;
  const useRow = context.parameters.useRow !== false;

  let bg = '#ffffff';
  if (darkMode) {
    bg = '#1f2937';
  } else if (design === 'neumorphic' || design === 'skeuomorphic') {
    bg = backgroundColor || '#e0e5ec';
  } else if (design === 'outline') {
    bg = '#f9fafb';
  }

  return (
    <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
      <TooltipProvider delayDuration={300}>
        <div
          style={{
            minHeight: '220px',
            width: '100%',
            backgroundColor: bg,
            padding: '2.5rem',
            borderRadius: '12px',
            transition: 'background-color 0.3s ease',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
            {useRow ? (
              <Row gap="4">
                <Story />
              </Row>
            ) : (
              <Story />
            )}
          </div>
        </div>
      </TooltipProvider>
    </GlobalUIContext.Provider>
  );
};

/**
 * Enterprise multi-selection array primitive. Orchestrates multiple semantic `<input type="checkbox">` elements.
 * Fully supports CSS Grid layouts, Formik auto-sync, and rich Radix-powered tooltips out-of-the-box.
 */
const meta: Meta<CheckboxGroupProps> = {
  title: 'Inputs/CheckboxGroupInput',
  component: CheckboxGroupInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `CheckboxGroupInput` to allow users to select multiple options from a predefined list. The component evaluates against an array of `InputOption` objects and maps seamlessly to an array payload in Formik.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulCheckboxGroup/g, 'CheckboxGroupInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          const importStatement = `import { CheckboxGroupInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
    // --- Core Identity & Logic ---
    alias: {
      control: 'text',
      description: 'Required unique identifier mapping the group to its Formik state array and DOM label.',
      table: { category: 'Core & Logic' },
    },
    options: {
      control: 'select',
      options: ['AI', 'Finance', 'Aerospace', 'Construction', 'Metallurgy', 'Medical'],
      mapping: {
        AI: AI_OPTIONS,
        Finance: FINANCE_OPTIONS,
        Aerospace: AEROSPACE_OPTIONS,
        Construction: CONSTRUCTION_OPTIONS,
        Metallurgy: METALLURGY_OPTIONS,
        Medical: MEDICAL_OPTIONS,
      },
      description: `**Data structure array for checkbox selections.** Each object must comply with the \`InputOption\` interface:
<br/>
<br/>\`optionid\` *(string | number)* — Required unique mapping key for React list iteration.
<br/>\`text\` *(string)* — The visible text rendered alongside the checkbox.
<br/>\`optionvalue\` *(string | number | boolean)* — The underlying value yielded to the Formik array or \`onChange\` callback when checked.
<br/>\`tag\` *(string)* — Optional badge string (e.g., "BETA" or "NEW").
<br/>\`score\` *(number)* — Optional statistical/ranking weight.
<br/>\`note\` *(string)* — Optional sub-label hint or description.
<br/>\`optionurl\` *(string)* — Optional URL routing attached to the selection.`,
      table: { category: 'Core & Logic' },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered statically above the group or animated into the border as a legend.',
      table: { category: 'Core & Logic' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Locks the component to prevent user interaction, rendering a disabled visual state while preserving selections.',
      table: { category: 'Core & Logic', defaultValue: { summary: 'false' } },
    },
    asChild: {
      control: 'boolean',
      description: 'If true, merges component DOM into the immediate child via Radix Slot.',
      table: { category: 'Core & Logic', defaultValue: { summary: 'false' } },
    },

    // --- Layout & Grid Options ---
    direction: {
      control: 'radio',
      options: ['row', 'column'],
      description: 'Directional flow of the checkbox layout grid. `row` attempts to wrap inline, `column` strictly stacks.',
      table: { category: 'Layout', defaultValue: { summary: 'row' } },
    },
    columns: {
      control: 'text',
      description: 'Explicit CSS Grid template column definitions (e.g. `"1fr 1fr"` or `"repeat(3, 1fr)"`). Overrides `direction`.',
      table: { category: 'Layout' },
    },
    width: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Viewport column width configuration value (1 to 12) inside a parent `<Row>`.',
      table: { category: 'Layout', defaultValue: { summary: '12' } },
    },
    newRow: {
      control: 'boolean',
      description: 'Forces container layouts to break downward onto a fresh structural row line.',
      table: { category: 'Layout' },
    },
    className: {
      control: 'text',
      description: 'Specific custom style class selector appended to the root container.',
      table: { category: 'Layout' },
    },
    style: {
      control: 'object',
      description: 'Inline modification style rules object.',
      table: { category: 'Layout' },
    },

    // --- Design System & Labels ---
    design: {
      control: 'radio',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'Core architectural design variant of the internal checkbox inputs.',
      table: { category: 'Design System', defaultValue: { summary: 'outline' } },
    },
    floatingLabel: {
      control: 'boolean',
      description: 'Toggles the interactive floating label animation, anchoring the label like a `<fieldset>` legend (works best with `outline`).',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system or parent theme contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Opacity multiplier for Neumorphic shadow intensity to ensure WCAG contrast across custom backgrounds.',
      table: { category: 'Design System', defaultValue: { summary: '1' } },
    },

    // --- Icons ---
    icon: {
      control: 'select',
      options: ['None', 'Shield', 'Cpu'],
      mapping: {
        None: undefined,
        Shield: <ShieldIcon />,
        Cpu: <CpuIcon />,
      },
      description: 'Optional icon node rendered inside the group header or floating label.',
      table: { category: 'Icons' },
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Determines if the icon is placed on the left (leading) or right (trailing) of the label.',
      table: { category: 'Icons', defaultValue: { summary: 'left' } },
    },

    // --- Validation & Hints ---
    isHinted: {
      control: 'boolean',
      description: 'Toggles an active hint tooltip next to the label.',
      table: { category: 'Validation & Hints', defaultValue: { summary: 'false' } },
    },
    hintText: {
      control: 'text',
      description: 'The informational text displayed inside the hint tooltip.',
      table: { category: 'Validation & Hints' },
      if: { arg: 'isHinted', eq: true },
    },
    hintUrl: {
      control: 'text',
      description: 'Optional URL to open when the hint tooltip icon is clicked.',
      table: { category: 'Validation & Hints' },
      if: { arg: 'isHinted', eq: true },
    },
    errorText: {
      control: 'text',
      description: 'Explicit error message string. Overrides Formik validation errors if provided.',
      table: { category: 'Validation & Hints' },
    },

    // --- Theming & Typography ---
    activeColor: { 
      control: 'color', 
      description: 'Highlight color applied to the active/checked borders and backgrounds.',
      table: { category: 'Theming' } 
    },
    backgroundColor: { 
      control: 'color', 
      description: 'Dynamic base background color for light mode.',
      table: { category: 'Theming' } 
    },
    darkBackgroundColor: { 
      control: 'color', 
      description: 'Dynamic base background color specifically for dark mode contexts.',
      table: { category: 'Theming' } 
    },
    textColor: { 
      control: 'color', 
      description: 'Standard text color for light mode.',
      table: { category: 'Theming' } 
    },
    darkTextColor: { 
      control: 'color', 
      description: 'Standard text color specifically for dark mode contexts.',
      table: { category: 'Theming' } 
    },
    errorTextColor: { 
      control: 'color', 
      description: 'Validation failure text color for light mode.',
      table: { category: 'Theming' } 
    },
    darkErrorTextColor: { 
      control: 'color', 
      description: 'Validation failure text color for dark mode.',
      table: { category: 'Theming' } 
    },
    darkModeColors: {
      control: 'object',
      description: 'Legacy color override object. Prefer `activeColor` for standard implementations.',
      table: { category: 'Theming' }
    },
    fontFamily: { 
      control: 'text', 
      description: 'Font family override to match specific UI brand primitives.',
      table: { category: 'Typography' } 
    },

    // --- State & Events ---
    value: {
      control: false,
      description: 'External fallback state array for standalone non-Formik setups. If a `Formik` provider is present, the component prioritizes the array mapped via the `alias`.',
      table: { category: 'State & Events' },
    },
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the entire array of selected values upon any interaction. Automatically intercepts and propagates to Formik if present.',
      table: { category: 'State & Events' } 
    },
    onOptionChange: { 
      action: 'onOptionChange', 
      control: false, 
      description: 'Yields the complete `InputOption` object and its new checked boolean state when toggled, allowing access to injected tags, scores, or notes natively.',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering nested workflows manually.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'selectedAssets',
    inputLabel: 'Portfolio Selection',
    options: 'Finance' as unknown as InputOption[],
    design: 'outline',
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Select multiple asset classes to diversify your portfolio risk.',
  },
  decorators: [withMitoContext],
  render: (args) => <StatefulCheckboxGroup {...args} />,
};

export default meta;
type Story = StoryObj<CheckboxGroupProps>;

// ---------------------------------------------------------------------------
// CORE DESIGN VARIANTS
// ---------------------------------------------------------------------------

export const Outline: Story = {
  args: {
    design: 'outline',
    activeColor: '#2563eb',
  },
};

export const Material: Story = {
  args: {
    design: 'material',
    inputLabel: 'Material Document Verification',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Tactile Selection Grid',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Mechanical Control Bay',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION MODES & BEHAVIORS
// ---------------------------------------------------------------------------

export const CSSGridColumns: Story = {
  args: {
    design: 'outline',
    alias: 'diagnosticSensors',
    inputLabel: 'Diagnostic Sensors',
    options: 'Aerospace' as unknown as InputOption[],
    columns: '1fr 1fr', // Forces a perfect 2-column grid split
    activeColor: '#f59e0b',
  },
  parameters: {
    docs: {
      description: {
        story: 'Leverage the `columns` prop to inject strict CSS Grid templates (e.g. `"1fr 1fr"` or `"repeat(3, 1fr)"`). This overrides the default `direction="row"` auto-fit logic, ensuring perfect alignment across columns regardless of label lengths.',
      },
    },
  },
};

export const FloatingLabelWithIcon: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Security Protocol Config',
    options: 'AI' as unknown as InputOption[],
    icon: 'Shield' as unknown as React.ReactNode,
    iconPosition: 'left',
    activeColor: '#8b5cf6',
  },
  parameters: {
    docs: {
      description: {
        story: 'Setting `floatingLabel={true}` dynamically wraps the checkbox group in an outlined fieldset border, pulling the `inputLabel` and `icon` into the top border like a native `<legend>`.',
      },
    },
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'complianceChecks',
    inputLabel: 'Mandatory Compliance Checks',
    isHinted: true,
    hintText: 'All items must be checked to proceed to payment.',
    errorText: 'You must acknowledge all terms before submitting.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates `isHinted` tooltip annotations alongside explicit `errorText` validation states (which colors the fieldset borders and icons red).',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Clever Standalone Usage (Rich Metadata Extraction):**
 * `onOptionChange` fires independently of the main `onChange` payload, exposing the full `InputOption` object natively.
 * This is highly useful for extracting appended data like `score`, `tag`, or `note` values to calculate running totals or trigger side-effects without writing complex lookup functions.
 */
export const RichMetadataExtraction: Story = {
  render: (args: CheckboxGroupProps) => {
    // 1. Maintain native React states
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [systemLoad, setSystemLoad] = useState<number>(0);

    const handleOptionToggle = (option: InputOption, isChecked: boolean) => {
      // 2. Extract the attached score directly from the interacted option
      const cost = option.score || 0;
      setSystemLoad(prev => isChecked ? prev + cost : prev - cost);
    };

    const handleExtractValues = (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload = {
        activeModules: selectedModules,
        totalSystemLoad: systemLoad.toFixed(2),
      };

      alert(`Metadata Extraction Complete:\n${JSON.stringify(payload, null, 2)}`);
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '440px', fontFamily: 'system-ui, sans-serif' }}>
        
        <div style={{ backgroundColor: systemLoad > 15 ? '#fef2f2' : '#f0fdf4', padding: '12px 16px', borderRadius: '8px', border: `1px solid ${systemLoad > 15 ? '#fecaca' : '#bbf7d0'}`, transition: 'all 0.3s ease' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: systemLoad > 15 ? '#ef4444' : '#16a34a' }}>
            Current System Load: {systemLoad.toFixed(1)} / 15.0 MAX
          </span>
        </div>

        <CheckboxGroupInput
          alias="roboticsModules"
          inputLabel="Configure Hardware Actuators"
          design={args.design}
          floatingLabel={true}
          value={selectedModules}
          onChange={(val: string[]) => setSelectedModules(val)}
          onOptionChange={handleOptionToggle}
          options={ROBOTICS_OPTIONS}
          columns="1fr"
        />

        <button
          type="submit"
          style={{
            marginTop: '8px',
            padding: '10px 20px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Initialize Boot Sequence
        </button>
      </form>
    );
  },
  args: {
    design: 'outline',
  },
  parameters: {
    useRow: false,
    docs: {
      source: {
        code: `"use client";

import React, { useState } from "react";
import { Button, CheckboxGroupInput, type InputOption } from "@emeraldemperaur/mito-ui";

const ROBOTICS_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Kinematic Servos', optionvalue: 'servo_xyz', score: 9.8 },
  { optionid: 2, text: 'LIDAR Navigation', optionvalue: 'lidar_v2', score: 8.5 },
  { optionid: 3, text: 'Tactile Feedback Grippers', optionvalue: 'grip_tactile', score: 4.2 },
];

export const StandaloneMetadataExample = () => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [systemLoad, setSystemLoad] = useState<number>(0);

  // 1. Intercept the complete InputOption object natively
  const handleOptionToggle = (option: InputOption, isChecked: boolean) => {
    // 2. Extract the attached score directly from the interacted option
    const cost = option.score || 0;
    setSystemLoad(prev => isChecked ? prev + cost : prev - cost);
  };

  const handleExtractValues = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ activeModules: selectedModules, totalSystemLoad: systemLoad.toFixed(2) });
  };

  return (
    <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      
      <div style={{ color: systemLoad > 15 ? 'red' : 'green' }}>
        Current System Load: {systemLoad.toFixed(1)} / 15.0 MAX
      </div>
      
      <CheckboxGroupInput
        alias="roboticsModules"
        inputLabel="Configure Hardware Actuators"
        design="outline"
        floatingLabel={true}
        value={selectedModules}
        onChange={(val: string[]) => setSelectedModules(val)}
        onOptionChange={handleOptionToggle}
        options={ROBOTICS_OPTIONS}
      />

      <Button type="submit">Initialize Boot Sequence</Button>
    </form>
  );
};`,
      },
    },
  },
};

/**
 * **Interactive Form Pipeline (Formik Context):**
 * Demonstrates seamless zero-boilerplate binding inside a `Formik` provider. Formik natively intercepts the array payload, enabling complex Yup validation logic (e.g., "Must select at least two options").
 */
export const InteractiveFormTest: Story = {
  render: (args: CheckboxGroupProps) => {
    return (
      <Formik
        initialValues={{
          marketingChannels: [],
        }}
        validationSchema={Yup.object({
          marketingChannels: Yup.array()
            .min(2, 'You must select at least two marketing channels to launch a campaign.')
            .required('Selection is required.'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          alert(`Payload Submitted:\n${JSON.stringify(values, null, 2)}`);
          setSubmitting(false);
        }}
      >
        {(formikProps) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', fontFamily: 'system-ui, sans-serif' }}>
            
            {/* Live Formik State Monitor */}
            <div
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                padding: '16px',
                color: '#f8fafc',
                fontFamily: 'monospace',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Formik Payload Array
              </span>
              <pre style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(
                  {
                    values: formikProps.values,
                    errors: formikProps.errors,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Enterprise Form */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <CheckboxGroupInput
                alias="marketingChannels"
                inputLabel="Target Distribution Channels"
                design={args.design}
                floatingLabel={true}
                columns="1fr 1fr"
                options={[
                  { optionid: 1, optionvalue: 'email', text: 'Email Newsletters' },
                  { optionid: 2, optionvalue: 'social', text: 'Social Media Ads' },
                  { optionid: 3, optionvalue: 'search', text: 'Google Search Ads' },
                  { optionid: 4, optionvalue: 'direct', text: 'Direct Mail' },
                ]}
              />

              <button
                type="submit"
                disabled={formikProps.isSubmitting}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Validate Campaign
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  },
  args: {
    design: 'outline',
  },
  parameters: {
    useRow: false,
    docs: {
      source: {
        code: `import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CheckboxGroupInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikCheckboxPipeline = () => {
  return (
    <Formik
      initialValues={{ marketingChannels: [] }}
      validationSchema={Yup.object({
        marketingChannels: Yup.array()
          .min(2, 'You must select at least two channels.')
          .required('Selection is required.'),
      })}
      onSubmit={(values) => console.log('Submitted Array:', values.marketingChannels)}
    >
      <Form>
        <Row gap="4">
          <CheckboxGroupInput
            alias="marketingChannels"
            inputLabel="Target Distribution Channels"
            design="outline"
            floatingLabel={true}
            columns="1fr 1fr"
            width={12}
            options={[
              { optionid: 1, optionvalue: 'email', text: 'Email Newsletters' },
              { optionid: 2, optionvalue: 'social', text: 'Social Media Ads' },
              { optionid: 3, optionvalue: 'search', text: 'Google Search Ads' },
              { optionid: 4, optionvalue: 'direct', text: 'Direct Mail' },
            ]}
          />
        </Row>
        <button type="submit" style={{ marginTop: '24px' }}>Submit</button>
      </Form>
    </Formik>
  );
};`,
      },
    },
  },
};