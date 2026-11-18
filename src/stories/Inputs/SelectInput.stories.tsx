import React, { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { SelectInput, type SelectInputProps } from './SelectInput';
import { Row } from '../Layout/Row';
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import { type InputOption } from '../../utils/Vinci';

const AI_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'GPT-4 Omni', optionvalue: 'gpt4', score: 85, tag: 'FLAGSHIP' },
  { optionid: 2, text: 'Claude 3.5 Sonnet', optionvalue: 'claude35', score: 70, tag: 'FAST' },
  { optionid: 3, text: 'Llama 3 70B', optionvalue: 'llama3', score: 15, tag: 'OPEN' },
];

const FINANCE_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Q1 Earnings Report', optionvalue: 'q1', note: 'Includes retail sector' },
  { optionid: 2, text: 'Q2 Earnings Report', optionvalue: 'q2', note: 'Includes tech sector' },
  { optionid: 3, text: 'Q3 Earnings Report', optionvalue: 'q3', note: 'Includes energy sector' },
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
  { optionid: 1, text: 'Kinematic Servos', optionvalue: 'servo_xyz', tag: 'CORE', score: 9.8, note: 'Primary mobility actuators' },
  { optionid: 2, text: 'LIDAR Navigation', optionvalue: 'lidar_v2', tag: 'SENSORY', score: 8.5, note: '360° environmental mapping' },
  { optionid: 3, text: 'Tactile Feedback Grippers', optionvalue: 'grip_tactile', tag: 'BETA', score: 4.2, note: 'Experimental pressure sensors' },
];

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const StatefulSelectInput = (args: SelectInputProps) => {
  const [val, setVal] = useState<any>(args.multiple ? [] : '');

  return (
    <SelectInput
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
            minHeight: '260px',
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
 * Enterprise dropdown selection primitive. Orchestrates single and multi-selection popovers mapped to Formik or native states.
 * Fully supports nested Radix Portal rendering to break out of CSS overflows, ensuring z-index perfection across all layouts.
 */
const meta: Meta<SelectInputProps> = {
  title: 'Inputs/SelectInput',
  component: SelectInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `SelectInput` for both standard dropdown selections and robust multi-select array tagging. The component evaluates against an array of `InputOption` objects and maps seamlessly to string or array payloads in Formik.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulSelectInput/g, 'SelectInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          const importStatement = `import { SelectInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
      description: 'Required unique identifier mapping the input to its Formik state and DOM label.',
      table: { category: 'Core & Logic' },
    },
    multiple: {
      control: 'boolean',
      description: 'Toggles between single-select (string payload) and multi-select (array payload) mode.',
      table: { category: 'Core & Logic', defaultValue: { summary: 'false' } },
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
      description: `**Data structure array for dropdown selections.** Each object must comply with the \`InputOption\` interface:
<br/>
<br/>\`optionid\` *(string | number)* — Required unique mapping key for React list iteration.
<br/>\`text\` *(string)* — The visible text rendered in the dropdown list.
<br/>\`optionvalue\` *(string | number | boolean)* — The underlying value yielded to Formik or \`onChange\`.
<br/>\`tag\` *(string)* — Optional badge string (e.g., "BETA" or "NEW").
<br/>\`score\` *(number)* — Optional statistical/ranking weight.
<br/>\`note\` *(string)* — Optional sub-label hint or description.
<br/>\`optionurl\` *(string)* — Optional URL routing attached to the selection.`,
      table: { category: 'Core & Logic' },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered statically above the input or animated into the border as a floating label.',
      table: { category: 'Core & Logic' },
    },
    placeholder: {
      control: 'text',
      description: 'Explicit placeholder text shown when the dropdown is empty.',
      table: { category: 'Core & Logic', defaultValue: { summary: 'Select an option' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Locks the component to prevent user interaction, rendering a disabled visual state.',
      table: { category: 'Core & Logic', defaultValue: { summary: 'false' } },
    },
    asChild: {
      control: 'boolean',
      description: 'If true, merges component DOM into the immediate child via Radix Slot.',
      table: { category: 'Core & Logic', defaultValue: { summary: 'false' } },
    },

    // --- Layout Options ---
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
      description: 'Core architectural design variant of the input well and popover content.',
      table: { category: 'Design System', defaultValue: { summary: 'outline' } },
    },
    floatingLabel: {
      control: 'boolean',
      description: 'Toggles the interactive floating label animation, anchoring the label like a `<fieldset>` legend.',
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
      options: ['None', 'Search', 'Filter'],
      mapping: {
        None: undefined,
        Search: <SearchIcon />,
        Filter: <FilterIcon />,
      },
      description: 'Optional icon node rendered inside the input field or floating label.',
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
      description: 'Highlight color applied to the active/checked borders, typography, and backgrounds.',
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
    fontFamily: { 
      control: 'text', 
      description: 'Font family override to match specific UI brand primitives.',
      table: { category: 'Typography' } 
    },

    // --- State & Events ---
    value: {
      control: false,
      description: 'External fallback state string/array for standalone non-Formik setups.',
      table: { category: 'State & Events' },
    },
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the selected string (or array of strings if `multiple`) upon interaction. Automatically intercepts and propagates to Formik if present.',
      table: { category: 'State & Events' } 
    },
    onOptionChange: { 
      action: 'onOptionChange', 
      control: false, 
      description: 'Yields the complete `InputOption` object and its new string/array state when toggled, allowing access to injected tags, scores, or notes natively.',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering nested workflows manually.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'selectedModel',
    inputLabel: 'AI Generative Model',
    placeholder: 'Select a primary model...',
    options: 'AI' as unknown as InputOption[],
    design: 'outline',
    multiple: false,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Select the primary model used for inference.',
  },
  decorators: [withMitoContext],
  render: (args) => <StatefulSelectInput {...args} />,
};

export default meta;
type Story = StoryObj<SelectInputProps>;

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
    alias: 'deliveryType',
    inputLabel: 'Material Delivery Verification',
    options: 'Medical' as unknown as InputOption[],
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    alias: 'orbitType',
    options: 'Aerospace' as unknown as InputOption[],
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Tactile Orbital Assignment',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    alias: 'alloyType',
    options: 'Metallurgy' as unknown as InputOption[],
    backgroundColor: '#e0e5ec',
    inputLabel: 'Mechanical Furnace Bay',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION MODES & BEHAVIORS
// ---------------------------------------------------------------------------

export const MultiSelectMode: Story = {
  args: {
    design: 'outline',
    alias: 'constructionMaterials',
    inputLabel: 'Required Structural Materials',
    placeholder: 'Select materials...',
    options: 'Construction' as unknown as InputOption[],
    multiple: true,
    hintText: 'Select the architectural strucuture categories',
    activeColor: '#800020',
    isHinted: true
  },
  parameters: {
    docs: {
      description: {
        story: 'When `multiple={true}`, the dropdown transforms into an array-based popover menu. Selected items are natively checked and mapped to a comma-separated display string inside the input field.',
      },
    },
  },
};

export const FloatingLabelWithIcon: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Search Datasets',
    options: 'Finance' as unknown as InputOption[],
    icon: 'Search' as unknown as React.ReactNode,
    iconPosition: 'left',
    activeColor: '#8b5cf6',
  },
  parameters: {
    docs: {
      description: {
        story: 'Setting `floatingLabel={true}` dynamically shrinks and anchors the `inputLabel` and `icon` into the top border like a native `<fieldset>` legend.',
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
        story: 'Demonstrates `isHinted` tooltip annotations alongside explicit `errorText` validation states (which gracefully colors the borders, text, and icons red).',
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
 * This is highly useful for extracting appended data like `score`, `tag`, or `note` values to dynamically calculate running totals or context banners without complex lookups.
 */
export const RichMetadataExtraction: Story = {
  render: (args: SelectInputProps) => {
    // 1. Maintain native React states
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [moduleCost, setModuleCost] = useState<number>(0);
    const [moduleNote, setModuleNote] = useState<string>('');

    const handleOptionToggle = (option: InputOption, _value: any) => {
      // 2. Extract the attached score and note directly from the interacted option
      setModuleCost(option.score || 0);
      setModuleNote(option.note || '');
    };

    const handleExtractValues = (e: React.SyntheticEvent) => {
      e.preventDefault();
      
      const payload = {
        actuatorModule: selectedModule,
        allocatedBudget: `$${moduleCost.toFixed(2)} USD`,
      };

      alert(`Metadata Extraction Complete:\n${JSON.stringify(payload, null, 2)}`);
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '440px', fontFamily: 'system-ui, sans-serif' }}>
        
        {moduleNote && (
          <div style={{ backgroundColor: '#f0fdf4', padding: '12px 16px', borderRadius: '8px', border: '1px solid #bbf7d0', animation: 'mito-fade-in 0.3s ease' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#16a34a' }}>
              Allocated Cost: ${moduleCost.toFixed(2)} — {moduleNote}
            </span>
          </div>
        )}

        <SelectInput
          alias="actuatorModule"
          inputLabel="Configure Primary Hardware Module"
          design={args.design}
          floatingLabel={true}
          value={selectedModule}
          onChange={(val: string) => setSelectedModule(val)}
          onOptionChange={handleOptionToggle}
          options={ROBOTICS_OPTIONS}
          activeColor="#16a34a"
        />

        <button
          type="submit"
          disabled={!selectedModule}
          style={{
            marginTop: '8px',
            padding: '10px 20px',
            backgroundColor: !selectedModule ? '#9ca3af' : '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: !selectedModule ? 'not-allowed' : 'pointer',
          }}
        >
          Initialize Module
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
import { Button, SelectInput, type InputOption } from "@emeraldemperaur/mito-ui";

const ROBOTICS_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Kinematic Servos', optionvalue: 'servo_xyz', score: 9.8, note: 'Primary mobility actuators' },
  { optionid: 2, text: 'LIDAR Navigation', optionvalue: 'lidar_v2', score: 8.5, note: '360° environmental mapping' },
  { optionid: 3, text: 'Tactile Feedback Grippers', optionvalue: 'grip_tactile', score: 4.2, note: 'Experimental pressure sensors' },
];

export const StandaloneMetadataExample = () => {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [moduleCost, setModuleCost] = useState<number>(0);

  // 1. Intercept the complete InputOption object natively
  const handleOptionToggle = (option: InputOption, value: any) => {
    // 2. Extract the attached score directly from the interacted option
    setModuleCost(option.score || 0);
  };

  const handleExtractValues = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log({ actuatorModule: selectedModule, allocatedBudget: moduleCost });
  };

  return (
    <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      
      {selectedModule && (
        <div style={{ color: 'green', fontWeight: 'bold' }}>
          Allocated Cost: \${moduleCost.toFixed(2)}
        </div>
      )}
      
      <SelectInput
        alias="actuatorModule"
        inputLabel="Configure Primary Hardware Module"
        design="outline"
        floatingLabel={true}
        value={selectedModule}
        onChange={(val: string) => setSelectedModule(val)}
        onOptionChange={handleOptionToggle}
        options={ROBOTICS_OPTIONS}
      />

      <Button type="submit">Initialize Module</Button>
    </form>
  );
};`,
      },
    },
  },
};


/**
 * **Clever Standalone Usage (Multi-Select Array Extraction):**
 * When `multiple={true}` is set without a Formik context, the `value` prop natively accepts and the `onChange` event naturally yields an array of strings (`string[]`).
 * This is perfect for capturing batch tagging, filtering, or assigning multiple operational targets natively.
 */
export const StandaloneMultiSelect: Story = {
  render: (args: SelectInputProps) => {
    // 1. Maintain native React state as an array of strings (pre-populating two regions)
    const [selectedRegions, setSelectedRegions] = useState<string[]>(['us_east', 'af_west']);

    const handleExtractValues = (e: React.SyntheticEvent) => {
      e.preventDefault();
      
      const payload = {
        deploymentId: "dep-774-xyz",
        targetRegions: selectedRegions,
      };

      alert(`Extracted Multi-Select Array Payload:\n${JSON.stringify(payload, null, 2)}`);
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '440px', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Dynamic State Monitor */}
        <div style={{ backgroundColor: selectedRegions.length === 0 ? '#fef2f2' : '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: `1px solid ${selectedRegions.length === 0 ? '#fecaca' : '#e2e8f0'}`, transition: 'all 0.3s ease' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: selectedRegions.length === 0 ? '#ef4444' : '#334155' }}>
            {selectedRegions.length} Region(s) Selected
          </span>
          {selectedRegions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {selectedRegions.map(region => (
                <span key={region} style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>
                  {region}
                </span>
              ))}
            </div>
          )}
        </div>

        <SelectInput
          alias="targetRegions"
          inputLabel="Assign Global Edge Regions"
          placeholder="Select one or more regions..."
          multiple={true}
          design={args.design}
          floatingLabel={true}
          width={12}
          value={selectedRegions}
          onChange={(val: string[]) => setSelectedRegions(val)}
          options={[
            { optionid: 1, optionvalue: 'us_east', text: 'US East (N. Virginia)' },
            { optionid: 2, optionvalue: 'us_west', text: 'US West (Oregon)' },
            { optionid: 3, optionvalue: 'eu_central', text: 'EU Central (Frankfurt)' },
            { optionid: 4, optionvalue: 'af_west', text: 'AF West (Lagos)' },
            { optionid: 5, optionvalue: 'af_east', text: 'AF East (Nairobi)' },
            { optionid: 6, optionvalue: 'ap_south', text: 'AP South (Mumbai)' },
            { optionid: 7, optionvalue: 'sa_east', text: 'SA East (São Paulo)' },
          ]}
          activeColor="#2563eb"
        />

        <button
          type="submit"
          disabled={selectedRegions.length === 0}
          style={{
            marginTop: '8px',
            padding: '10px 20px',
            backgroundColor: selectedRegions.length === 0 ? '#9ca3af' : '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: selectedRegions.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Dispatch Global Nodes
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
import { Button, SelectInput } from "@emeraldemperaur/mito-ui";

export const StandaloneMultiSelectExample = () => {
  // 1. Maintain native React state as an array of strings
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['us_east', 'eu_central']);

  const handleExtractValues = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log({ targetRegions: selectedRegions });
  };

  return (
    <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      
      <div style={{ fontWeight: 'bold' }}>
        {selectedRegions.length} Region(s) Selected
      </div>
      
      {/* 2. Bind the array state directly to 'value' and 'onChange' */}
      <SelectInput
        alias="targetRegions"
        inputLabel="Assign Global Edge Regions"
        placeholder="Select regions..."
        multiple={true}
        design="outline"
        floatingLabel={true}
        value={selectedRegions}
        onChange={(val: string[]) => setSelectedRegions(val)}
        options={[
          { optionid: 1, optionvalue: 'us_east', text: 'US East (N. Virginia)' },
          { optionid: 2, optionvalue: 'us_west', text: 'US West (Oregon)' },
          { optionid: 3, optionvalue: 'eu_central', text: 'EU Central (Frankfurt)' },
          { optionid: 4, optionvalue: 'ap_south', text: 'AP South (Mumbai)' },
          { optionid: 5, optionvalue: 'sa_east', text: 'SA East (São Paulo)' },
        ]}
      />

      <Button type="submit" disabled={selectedRegions.length === 0}>
        Dispatch Global Nodes
      </Button>
    </form>
  );
};`,
      },
    },
  },
};



/**
 * **Interactive Form Pipeline (Formik Context):**
 * Demonstrates seamless zero-boilerplate binding inside a `Formik` provider. Formik natively intercepts the array payload when `multiple={true}`, enabling complex Yup array validation logic out of the box.
 */
export const InteractiveFormTest: Story = {
  render: (args: SelectInputProps) => {
    return (
      <Formik
        initialValues={{
          assignedClusters: [],
        }}
        validationSchema={Yup.object({
          assignedClusters: Yup.array()
            .min(2, 'Multi-AZ redundancy requires at least two deployment clusters.')
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
                Live Formik Array Payload
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
              <SelectInput
                alias="assignedClusters"
                inputLabel="Target Deployment Clusters"
                placeholder="Select instances..."
                multiple={true}
                design={args.design}
                floatingLabel={true}
                options={[
                  { optionid: 1, optionvalue: 'us_east', text: 'AWS us-east-1' },
                  { optionid: 2, optionvalue: 'us_west', text: 'AWS us-west-2' },
                  { optionid: 3, optionvalue: 'eu_central', text: 'AWS eu-central-1' },
                  { optionid: 4, optionvalue: 'ap_south', text: 'AWS ap-south-1' },
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
                Execute Global Deployment
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
import { SelectInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikSelectPipeline = () => {
  return (
    <Formik
      initialValues={{ assignedClusters: [] }}
      validationSchema={Yup.object({
        assignedClusters: Yup.array()
          .min(2, 'Multi-AZ redundancy requires at least two deployment clusters.')
          .required('Selection is required.'),
      })}
      onSubmit={(values) => console.log('Submitted Payload:', values)}
    >
      <Form>
        <Row gap="4">
          <SelectInput
            alias="assignedClusters"
            inputLabel="Target Deployment Clusters"
            placeholder="Select instances..."
            multiple={true}
            design="outline"
            floatingLabel={true}
            width={12}
            options={[
              { optionid: 1, optionvalue: 'us_east', text: 'AWS us-east-1' },
              { optionid: 2, optionvalue: 'us_west', text: 'AWS us-west-2' },
              { optionid: 3, optionvalue: 'eu_central', text: 'AWS eu-central-1' },
              { optionid: 4, optionvalue: 'ap_south', text: 'AWS ap-south-1' },
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