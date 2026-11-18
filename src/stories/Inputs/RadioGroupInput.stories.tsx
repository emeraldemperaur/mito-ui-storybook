import React, { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { RadioGroupInput, type RadioGroupProps } from './RadioGroupInput';
import { Row } from '../Layout/Row';
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import { type InputOption } from '../../utils/Vinci';

const AI_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'GPT-4 Omni', optionvalue: 'gpt4' },
  { optionid: 2, text: 'Claude 3.5 Sonnet', optionvalue: 'claude35' },
  { optionid: 3, text: 'Llama 3 70B', optionvalue: 'llama3' },
];

const FINANCE_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Aggressive Growth', optionvalue: 'aggressive' },
  { optionid: 2, text: 'Balanced / Mixed', optionvalue: 'balanced' },
  { optionid: 3, text: 'Conservative / Bonds', optionvalue: 'conservative' },
];

const AEROSPACE_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Low Earth Orbit (LEO)', optionvalue: 'leo' },
  { optionid: 2, text: 'Geosynchronous (GEO)', optionvalue: 'geo' },
  { optionid: 3, text: 'Lunar Transfer', optionvalue: 'lunar' },
];

const CONSTRUCTION_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Residential Single-Family', optionvalue: 'residential' },
  { optionid: 2, text: 'Commercial High-Rise', optionvalue: 'commercial' },
  { optionid: 3, text: 'Industrial Warehouse', optionvalue: 'industrial' },
];

const METALLURGY_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Cold Rolled Steel', optionvalue: 'cold_rolled' },
  { optionid: 2, text: 'Hot Rolled Steel', optionvalue: 'hot_rolled' },
  { optionid: 3, text: 'Galvanized Coating', optionvalue: 'galvanized' },
];

const MEDICAL_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Stat (Immediate)', optionvalue: 'stat' },
  { optionid: 2, text: 'Urgent (Within 24h)', optionvalue: 'urgent' },
  { optionid: 3, text: 'Routine (Standard)', optionvalue: 'routine' },
];

const ROBOTICS_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Aggressive Autonomy', optionvalue: 'auto_aggressive', tag: 'DANGER', score: 12.5, note: 'Ignores soft collision warnings' },
  { optionid: 2, text: 'Standard Pathing', optionvalue: 'auto_standard', tag: 'DEFAULT', score: 5.0, note: 'Follows pre-mapped coordinates' },
  { optionid: 3, text: 'Manual Teleoperation', optionvalue: 'manual_override', tag: 'SAFE', score: 1.2, note: 'Requires human joystick input' },
];

// --- Mock Icons for Storybook DX ---
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

const StatefulRadioGroup = (args: RadioGroupProps) => {
  const [val, setVal] = useState<string>(args.value || args.defaultValue || '');

  return (
    <RadioGroupInput
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
 * Enterprise single-selection radio array primitive. Orchestrates mutually-exclusive semantic `<input type="radio">` elements.
 * Fully supports CSS Grid layouts, Formik auto-sync, and rich Radix-powered tooltips out-of-the-box.
 */
const meta: Meta<RadioGroupProps> = {
  title: 'Inputs/RadioGroupInput',
  component: RadioGroupInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `RadioGroupInput` to force a user to select exactly one option from a predefined list. The component evaluates against an array of `InputOption` objects and maps seamlessly to a singular string payload in Formik.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulRadioGroup/g, 'RadioGroupInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          const importStatement = `import { RadioGroupInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
      description: 'Required unique identifier mapping the group to its Formik state and DOM label.',
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
      description: `**Data structure array for radio selections.** Each object must comply with the \`InputOption\` interface:
<br/>
<br/>\`optionid\` *(string | number)* — Required unique mapping key for React list iteration.
<br/>\`text\` *(string)* — The visible text rendered alongside the radio button.
<br/>\`optionvalue\` *(string | number | boolean)* — The underlying mutually-exclusive value yielded to Formik or \`onChange\`.
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
      description: 'Locks the component to prevent user interaction, rendering a disabled visual state while preserving the selection.',
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
      description: 'Directional flow of the radio layout grid. `column` strictly stacks, `row` attempts to wrap inline.',
      table: { category: 'Layout', defaultValue: { summary: 'column' } },
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
      description: 'Core architectural design variant of the internal radio inputs.',
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
    },
    hintUrl: {
      control: 'text',
      description: 'Optional URL to open when the hint tooltip icon is clicked.',
      table: { category: 'Validation & Hints' },
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
    defaultValue: {
      control: 'text',
      description: 'Initial default string value for uncontrolled usage.',
      table: { category: 'State & Events' },
    },
    value: {
      control: false,
      description: 'External fallback state string for standalone non-Formik setups. If a `Formik` provider is present, the component prioritizes the string mapped via the `alias`.',
      table: { category: 'State & Events' },
    },
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the mutually-exclusive string value upon interaction. Automatically intercepts and propagates to Formik if present.',
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
    alias: 'riskProfile',
    inputLabel: 'Target Risk Profile',
    options: 'Finance' as unknown as InputOption[],
    design: 'outline',
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'This establishes your baseline equity allocation metrics.',
  },
  decorators: [withMitoContext],
  render: (args) => <StatefulRadioGroup {...args} />,
};

export default meta;
type Story = StoryObj<RadioGroupProps>;

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
    inputLabel: 'Material Delivery Verification',
    options: 'Medical' as unknown as InputOption[],
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Tactile Processing Priority',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Mechanical Control Bay Target',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION MODES & BEHAVIORS
// ---------------------------------------------------------------------------

export const CSSGridColumns: Story = {
  args: {
    design: 'outline',
    alias: 'buildingMaterials',
    inputLabel: 'Primary Structural Material',
    options: 'Construction' as unknown as InputOption[],
    columns: '1fr 1fr', // Forces a perfect 2-column grid split
    activeColor: '#f59e0b',
  },
  parameters: {
    docs: {
      description: {
        story: 'Leverage the `columns` prop to inject strict CSS Grid templates (e.g. `"1fr 1fr"` or `"repeat(3, 1fr)"`). This ensures perfect vertical and horizontal alignment across columns regardless of label text length.',
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
        story: 'Setting `floatingLabel={true}` dynamically wraps the radio group in an outlined fieldset border, pulling the `inputLabel` and `icon` into the top border like a native `<legend>`.',
      },
    },
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'launchWindow',
    inputLabel: 'Mandatory Orbital Target',
    options: 'Aerospace' as unknown as InputOption[],
    isHinted: true,
    hintText: 'A launch window must be established before ignition sequence.',
    errorText: 'You must lock a trajectory before submitting.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates `isHinted` tooltip annotations alongside explicit `errorText` validation states (which gracefully colors the fieldset borders and warning icons red).',
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
 * This is highly useful for extracting appended data like `score`, `tag`, or `note` values to dynamically render side-effects or warning banners without writing complex external lookup functions.
 */
export const RichMetadataExtraction: Story = {
  render: (args: RadioGroupProps) => {
    // 1. Maintain native React states
    const [selectedMode, setSelectedMode] = useState<string>('auto_standard');
    const [modeWarning, setModeWarning] = useState<string | null>(null);
    const [modeScore, setModeScore] = useState<number>(5.0);

    const handleOptionToggle = (option: InputOption) => {
      // 2. Extract the attached tag, score, and note directly from the interacted option
      setModeScore(option.score || 0);
      
      if (option.tag === 'DANGER') {
        setModeWarning(`WARNING: ${option.note}`);
      } else {
        setModeWarning(null);
      }
    };

    const handleExtractValues = (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload = {
        navigationMode: selectedMode,
        activeSafetyScore: modeScore,
      };

      alert(`Metadata Extraction Complete:\n${JSON.stringify(payload, null, 2)}`);
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '440px', fontFamily: 'system-ui, sans-serif' }}>
        
        {modeWarning && (
          <div style={{ backgroundColor: '#fef2f2', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fecaca', animation: 'mito-fade-in 0.3s ease' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444' }}>
              {modeWarning}
            </span>
          </div>
        )}

        <RadioGroupInput
          alias="navigationMode"
          inputLabel="Configure Robot Pathfinding"
          design={args.design}
          floatingLabel={true}
          value={selectedMode}
          onChange={(val: string) => setSelectedMode(val)}
          onOptionChange={handleOptionToggle}
          options={ROBOTICS_OPTIONS}
          columns="1fr"
          activeColor={modeWarning ? '#ef4444' : '#2563eb'}
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
import { Button, RadioGroupInput, type InputOption } from "@emeraldemperaur/mito-ui";

const ROBOTICS_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Aggressive Autonomy', optionvalue: 'auto_aggressive', tag: 'DANGER', score: 12.5, note: 'Ignores soft collision warnings' },
  { optionid: 2, text: 'Standard Pathing', optionvalue: 'auto_standard', tag: 'DEFAULT', score: 5.0, note: 'Follows pre-mapped coordinates' },
  { optionid: 3, text: 'Manual Teleoperation', optionvalue: 'manual_override', tag: 'SAFE', score: 1.2, note: 'Requires human joystick input' },
];

export const StandaloneMetadataExample = () => {
  const [selectedMode, setSelectedMode] = useState<string>('auto_standard');
  const [modeWarning, setModeWarning] = useState<string | null>(null);

  // 1. Intercept the complete InputOption object natively
  const handleOptionToggle = (option: InputOption) => {
    // 2. Extract the attached tag, score, and note directly from the interacted option
    if (option.tag === 'DANGER') {
      setModeWarning(\`WARNING: \${option.note}\`);
    } else {
      setModeWarning(null);
    }
  };

  const handleExtractValues = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ navigationMode: selectedMode });
  };

  return (
    <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      
      {modeWarning && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          {modeWarning}
        </div>
      )}
      
      <RadioGroupInput
        alias="navigationMode"
        inputLabel="Configure Robot Pathfinding"
        design="outline"
        floatingLabel={true}
        value={selectedMode}
        onChange={(val: string) => setSelectedMode(val)}
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
 * Demonstrates seamless zero-boilerplate binding inside a `Formik` provider. Formik natively intercepts the mutually-exclusive string payload, enabling instant Yup validation logic.
 */
export const InteractiveFormTest: Story = {
  render: (args: RadioGroupProps) => {
    return (
      <Formik
        initialValues={{
          databaseEnvironment: '',
        }}
        validationSchema={Yup.object({
          databaseEnvironment: Yup.string()
            .required('You must explicitly authorize a deployment environment.'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          alert(`Payload Submitted:\n${JSON.stringify(values, null, 2)}`);
          setSubmitting(false);
        }}
      >
        {(formikProps) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', fontFamily: 'system-ui, sans-serif' }}>
            
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
                Live Formik String Payload
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
              <RadioGroupInput
                alias="databaseEnvironment"
                inputLabel="Target Deployment Cluster"
                design={args.design}
                floatingLabel={true}
                options={[
                  { optionid: 1, optionvalue: 'local', text: 'Localhost (Docker)' },
                  { optionid: 2, optionvalue: 'staging', text: 'Staging (AWS us-east-1)' },
                  { optionid: 3, optionvalue: 'production', text: 'Production (AWS Multi-AZ)' },
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
                Execute Deployment
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
import { RadioGroupInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikRadioPipeline = () => {
  return (
    <Formik
      initialValues={{ databaseEnvironment: '' }}
      validationSchema={Yup.object({
        databaseEnvironment: Yup.string()
          .required('You must explicitly authorize a deployment environment.'),
      })}
      onSubmit={(values) => console.log('Submitted Payload:', values)}
    >
      <Form>
        <Row gap="4">
          <RadioGroupInput
            alias="databaseEnvironment"
            inputLabel="Target Deployment Cluster"
            design="outline"
            floatingLabel={true}
            width={12}
            options={[
              { optionid: 1, optionvalue: 'local', text: 'Localhost' },
              { optionid: 2, optionvalue: 'staging', text: 'Staging (AWS)' },
              { optionid: 3, optionvalue: 'production', text: 'Production (Multi-AZ)' },
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