import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { DropdownInput, type DropdownProps } from './DropdownInput';
import { Row } from '../Layout/Row'; 
import { GlobalUIContext } from '../Layout/GlobalUIContext'; 
import type { InputOption } from '../../utils/Vinci';

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const CpuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const AI_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Claude 3.5 Sonnet', optionvalue: 'claude35', tag: 'RECOMMENDED', score: 99, note: 'Extremely fast, exceptional reasoning.' },
  { optionid: 2, text: 'GPT-4 Omni', optionvalue: 'gpt4o', tag: 'PRO', score: 95, note: 'High intelligence, multimodal capabilities.' },
  { optionid: 3, text: 'Llama 3 70B', optionvalue: 'llama3', tag: 'LOCAL', score: 85, note: 'Self-hosted open weights model.' },
];

const FINANCE_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Equities (Stocks)', optionvalue: 'eq', tag: 'HIGH RISK', score: 80, note: 'Direct ownership shares in corporations.' },
  { optionid: 2, text: 'Treasury Bonds', optionvalue: 'tbond', tag: 'STABLE', score: 95, note: 'Low-yield government-backed securities.' },
  { optionid: 3, text: 'Derivatives', optionvalue: 'deriv', tag: 'LEVERAGE', score: 40, note: 'Complex instruments based on underlying assets.' },
];

const MEDICAL_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Cardiology', optionvalue: 'cardio', tag: 'SPECIALTY', score: 100, note: 'Heart and cardiovascular conditions.' },
  { optionid: 2, text: 'Neurology', optionvalue: 'neuro', tag: 'SPECIALTY', score: 95, note: 'Disorders of the nervous system.' },
  { optionid: 3, text: 'General Practice', optionvalue: 'gp', tag: 'PRIMARY', score: 85, note: 'Routine care and initial consultations.' },
];

const CONSTRUCTION_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Excavator', optionvalue: 'excavator', tag: 'HEAVY', score: 92, note: 'Earthmoving and trenching equipment.' },
  { optionid: 2, text: 'Tower Crane', optionvalue: 'crane', tag: 'LIFT', score: 88, note: 'High-altitude material transport.' },
  { optionid: 3, text: 'Concrete Mixer', optionvalue: 'mixer', tag: 'POUR', score: 75, note: 'On-site cement preparation.' },
];

const AVIATION_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Boeing 737 MAX', optionvalue: 'b737m', tag: 'COMMERCIAL', score: 85, note: 'Narrow-body short-to-medium haul airliner.' },
  { optionid: 2, text: 'Airbus A350', optionvalue: 'a350', tag: 'LONG HAUL', score: 98, note: 'Wide-body long-range twin-engine aircraft.' },
  { optionid: 3, text: 'Cessna 172', optionvalue: 'c172', tag: 'TRAINING', score: 99, note: 'Single-engine high-wing monoplane.' },
];

const POLITICS_OPTIONS: InputOption[] = [
  { optionid: 1, text: 'Legislative Branch', optionvalue: 'legislative', tag: 'LAWS', score: 100, note: 'Drafts, debates, and passes legislation.' },
  { optionid: 2, text: 'Executive Branch', optionvalue: 'executive', tag: 'ENFORCE', score: 95, note: 'Implements and enforces enacted laws.' },
  { optionid: 3, text: 'Judicial Branch', optionvalue: 'judicial', tag: 'REVIEW', score: 98, note: 'Interprets laws and ensures constitutionality.' },
];

const StatefulDropdownInput = (args: DropdownProps) => {
  const [val, setVal] = useState<string>(args.value !== undefined ? String(args.value) : '');

  return (
    <DropdownInput
      {...args}
      value={val}
      onChange={(unmaskedValue) => {
        setVal(unmaskedValue);
        args.onChange?.(unmaskedValue);
      }}
    />
  );
};

/**
 * Enterprise dropdown selection primitive. Built entirely on `Radix DropdownMenu` for maximum accessibility and keyboard navigation. 
 * Replaces native HTML `<select>` elements to enable deep styling, custom icons, floating labels, and dynamic link rendering.
 */
const meta: Meta<DropdownProps> = {
  title: 'Inputs/DropdownInput',
  component: DropdownInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `DropdownInput` for standard single-selection lists. Provide an array of `InputOption` objects defining the mapping between the rendered `text` and the submitted `optionvalue`.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulDropdownInput/g, 'DropdownInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<DropdownInput)/, '$1')
            .replace(/(<DropdownInput[\s\S]*?\/>)\s*\}$/, '$1');
          const importStatement = `import { DropdownInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
    // --- Core Identity & Options ---
    alias: {
      control: 'text',
      description: 'Required unique identifier mapping the input to its Formik state and DOM label.',
      table: { category: 'Core & Identity' },
    },
    inputOptions: {
      control: 'select',
      options: ['AI', 'Finance', 'Medical', 'Construction', 'Aviation', 'Politics'],
      mapping: {
        AI: AI_OPTIONS,
        Finance: FINANCE_OPTIONS,
        Medical: MEDICAL_OPTIONS,
        Construction: CONSTRUCTION_OPTIONS,
        Aviation: AVIATION_OPTIONS,
        Politics: POLITICS_OPTIONS,
      },
      description: `**Data structure array for dropdown items.** Each object must comply with the \`InputOption\` interface:
<br/>
<br/>\`optionid\` *(string|number)* — Unique mapping key for list iteration.
<br/>\`text\` *(string)* — The visible text rendered in the dropdown item.
<br/>\`optionvalue\` *(string|number|boolean)* — The underlying value yielded to Formik/onChange.
<br/>\`tag\` *(string)* — Optional badge string (e.g. "BETA" or "PRO").
<br/>\`score\` *(number)* — Optional statistical/ranking weight.
<br/>\`note\` *(string)* — Optional sub-label hint.
<br/>\`optionurl\` *(string)* — Optional URL. If provided, the item acts as an external link instead of a selector.`,
      table: { category: 'Core & Identity' },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered statically above the field or animated inside the border.',
      table: { category: 'Core & Identity' },
    },
    placeholder: {
      control: 'text',
      description: 'Hint text displayed inside the trigger button when no selection exists.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'Select an option' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Locks the component to prevent selection changes, while preserving the current value and rendering a disabled visual state.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction entirely.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'false' } },
    },
    value: {
      control: 'text',
      description: 'External fallback state value for standalone non-Formik setups. If a `Formik` provider is present, the component automatically prioritizes the Formik pipeline state mapped via the `alias` key over this prop.',
      table: { category: 'State & Events' },
    },
    // --- Design System & Labels ---
    design: {
      control: 'radio',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'Core architectural design variant of the input container.',
      table: { category: 'Design System', defaultValue: { summary: 'outline' } },
    },
    floatingLabel: {
      control: 'boolean',
      description: 'Toggles the interactive floating label animation (primarily used with the `outline` variant).',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system or parent theme contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },

    // --- Icons ---
    icon: {
      control: 'select',
      options: ['None', 'Folder', 'Filter', 'Cpu'],
      mapping: {
        None: undefined,
        Folder: <FolderIcon />,
        Filter: <FilterIcon />,
        Cpu: <CpuIcon />,
      },
      description: 'Optional secondary icon node.',
      table: { category: 'Icons' },
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Determines secondary icon placement. Note: The dropdown chevron is always fixed on the right.',
      table: { category: 'Icons', defaultValue: { summary: 'left' } },
    },

    // --- Validation & Hints ---
    isHinted: {
      control: 'boolean',
      description: 'Toggles an active hint tooltip trigger icon next to the static label.',
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

    // --- Layout ---
    width: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Viewport column width configuration value (1 to 12) inside a `Row`.',
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

    // --- Theming & Typography ---
    activeColor: { 
      control: 'color', 
      description: 'Highlight color applied to the active/focused border, selected list items, and icons.',
      table: { category: 'Theming' } 
    },
    backgroundColor: { 
      control: 'color', 
      description: 'Dynamic base background color for light mode. Colors the trigger and the popover surface.',
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
    dropdownTextColor: {
      control: 'color',
      description: 'Text color for the unselected dropdown items in light mode.',
      table: { category: 'Theming' }
    },
    darkDropdownTextColor: {
      control: 'color',
      description: 'Text color for the unselected dropdown items in dark mode.',
      table: { category: 'Theming' }
    },
    dropdownHoverTextColor: {
      control: 'color',
      description: 'Text color when a dropdown item is selected or hovered in light mode.',
      table: { category: 'Theming' }
    },
    darkDropdownHoverTextColor: {
      control: 'color',
      description: 'Text color when a dropdown item is selected or hovered in dark mode.',
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

    // --- Formik & Events ---
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the raw string value (e.g. "active") of the selected option. Automatically intercepts and propagates to Formik.',
      table: { category: 'State & Events' } 
    },
    onOptionChange: { 
      action: 'onOptionChange', 
      control: false, 
      description: 'Yields the complete `InputOption` object when an option is selected, allowing downstream components to instantly access injected tags, scores, or notes.',
      table: { category: 'State & Events' } 
    },
    onBlur: { 
      action: 'onBlur', 
      control: false, 
      description: 'Callback fired when the popup closes. Automatically triggers Formik field validation (setting to `touched`).',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering outside a standard Formik provider.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'recordStatus',
    inputOptions: 'AI' as unknown as InputOption[],
    inputLabel: 'Record Status',
    placeholder: 'Select an option',
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Determines the visibility of the record across the platform.',
    icon: 'None' as unknown as React.ReactNode,
    iconPosition: 'left',
  },
  decorators: [
    (Story, context) => {
      const { design, darkMode, backgroundColor } = context.args;
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
                minHeight: '340px', 
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
    },
  ],
  render: (args) => <StatefulDropdownInput {...args} />,
};

export default meta;
type Story = StoryObj<DropdownProps>;

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
    inputLabel: 'Document State',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Assignment Phase',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'System Status',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION & BEHAVIORS
// ---------------------------------------------------------------------------

export const RichMetadataOptions: Story = {
  render: (args) => {
    // 1. Track the standard string value yielded by the component
    const [selectedValue, setSelectedValue] = useState<string>('');
    // 2. Track the full metadata payload yielded by onOptionChange
    const [extractedMetadata, setExtractedMetadata] = useState<InputOption | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '400px', fontFamily: 'system-ui, sans-serif' }}>
        <DropdownInput
          {...args}
          value={selectedValue}
          onChange={(val) => setSelectedValue(val)}
          onOptionChange={(fullOption) => setExtractedMetadata(fullOption)}
        />

        {extractedMetadata && (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
            color: '#334155',
            animation: 'mito-fade-in 0.3s ease'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '12px', color: '#0f172a', display: 'flex', justifyContent: 'space-between' }}>
              <span>Downstream Metadata Extract</span>
              {extractedMetadata.tag && (
                <span style={{ backgroundColor: '#800020', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>
                  {extractedMetadata.tag}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr' }}>
                <span style={{ color: '#64748b' }}>Value:</span> 
                <span style={{ fontFamily: 'monospace' }}>{String(extractedMetadata.optionvalue)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr' }}>
                <span style={{ color: '#64748b' }}>Score:</span> 
                <span>{extractedMetadata.score}/100</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr' }}>
                <span style={{ color: '#64748b' }}>Note:</span> 
                <span style={{ fontStyle: 'italic' }}>{extractedMetadata.note}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
  args: {
    design: 'outline',
    alias: 'aiModel',
    inputLabel: 'Inference Model Configuration',
    placeholder: 'Select a primary model...',
    icon: 'Cpu' as unknown as React.ReactNode,
    iconPosition: 'left',
    activeColor: '#800020',
    inputOptions: 'AI' as unknown as InputOption[],
  },
  parameters: {
    useRow: false,
    docs: {
      description: {
        story: 'Demonstrates the structural depth of the `InputOption` interface. By mapping `tag`, `score`, and `note` metadata into the options array, developers can package rich contextual data into the Dropdown config. The `onOptionChange` callback automatically extracts the complete `InputOption` payload when an item is clicked, eliminating the need for downstream array lookups.',
      },
      source: {
        code: `import { DropdownInput } from '@emeraldemepraur/mito-ui';

// 1. Define your rich dataset
const AI_MODELS = [
  { optionid: 1, text: 'Claude 3.5 Sonnet', optionvalue: 'claude35', tag: 'RECOMMENDED', score: 99, note: 'Extremely fast, exceptional reasoning.' },
  { optionid: 2, text: 'GPT-4 Omni', optionvalue: 'gpt4o', tag: 'PRO', score: 95, note: 'High intelligence, multimodal capabilities.' },
  { optionid: 3, text: 'Llama 3 70B', optionvalue: 'llama3', tag: 'LOCAL', score: 85, note: 'Self-hosted open weights model.' }
];

export const MyForm = () => {
  const [model, setModel] = useState("");
  // 2. Track the full metadata payload natively
  const [modelData, setModelData] = useState<InputOption | null>(null);

  return (
    <>
      <DropdownInput
        alias="aiModel"
        inputOptions={AI_MODELS}
        value={model}
        onChange={(val) => setModel(val)}
        onOptionChange={(fullOption) => setModelData(fullOption)}
      />
      
      {/* 3. Utilize extracted metadata downstream */}
      {modelData?.note && (
        <p>System Note: {modelData.note}</p>
      )}
    </>
  );
};`
      },
    },
  },
};

export const ExternalLinks: Story = {
  args: {
    design: 'outline',
    inputLabel: 'Documentation Routing',
    placeholder: 'Select a guide...',
    inputOptions: [
      { optionid: 1, optionvalue: 'local_guide', text: 'Local Setup Guide' },
      { optionid: 2, optionvalue: 'external_docs', text: 'Official Documentation', optionurl: 'https://react.dev' },
      { optionid: 3, optionvalue: 'github_repo', text: 'Source Code Repository', optionurl: 'https://github.com' },
    ] as unknown as InputOption[],
  },
  parameters: {
    docs: {
      description: {
        story: 'If an `InputOption` defines an `optionurl`, clicking that dropdown item will immediately open the URL in a new tab (and append an external link icon to the item) rather than selecting a value.',
      },
    },
  },
};

export const FloatingLabelWithIcon: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Filter Selection',
    icon: 'Filter' as unknown as React.ReactNode,
    iconPosition: 'left',
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'deploymentEnv',
    inputLabel: 'Deployment Environment',
    isHinted: true,
    hintText: 'Only authorized administrators can push to Production.',
    errorText: 'You lack the necessary permissions for this environment.',
    value: 'prod',
    inputOptions: [
      { optionid: 1, optionvalue: 'dev', text: 'Development Sandbox' },
      { optionid: 2, optionvalue: 'staging', text: 'Staging Server' },
      { optionid: 3, optionvalue: 'prod', text: 'Production Client' },
    ] as unknown as InputOption[],
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates `isHinted` tooltip annotations alongside explicit `errorText` validation states and ARIA alert bindings.',
      },
    },
  },
};

export const DarkModeOverride: Story = {
  args: {
    design: 'outline',
    darkMode: true,
    icon: 'Cpu' as unknown as React.ReactNode,
    floatingLabel: true,
    inputLabel: 'Server Region',
    activeColor: '#60a5fa',
    dropdownTextColor: '#111827',
    darkDropdownTextColor: '#f9fafb',
    dropdownHoverTextColor: '#ffffff',
    darkDropdownHoverTextColor: '#ffffff',
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Native React State (No Formik):**
 * When rendering outside a Formik context, the component functions as a standard controlled React input. 
 * Use `onChange` to capture the `optionvalue` of the selected item.
 */
export const StandaloneUsage: Story = {
  render: (args) => {
    const [status, setStatus] = useState<string>("");

    const handleExtractValues = (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
        recordStatus: status,
      };
      alert(JSON.stringify(payload, null, 2));
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '400px', fontFamily: 'system-ui, sans-serif' }}>
        
        <DropdownInput
          alias="status"
          inputLabel="Assignee Status"
          design={args.design}
          inputOptions={[
            { optionid: 1, optionvalue: 'available', text: 'Available to Work' },
            { optionid: 2, optionvalue: 'busy', text: 'Currently Busy' },
            { optionid: 3, optionvalue: 'offline', text: 'Offline' },
          ]}
          value={status}
          onChange={(val) => setStatus(val)}
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
          Extract Value
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
import { Button } from "@emeraldemperaur/mito-ui";
import { DropdownInput } from "@emeraldemperaur/mito-ui/DropdownInput";

export const StandaloneDropdownExample = () => {
  const [status, setStatus] = useState<string>("");

  const handleExtractValues = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      recordStatus: status,
    };

    console.log("Extracted Standalone Payload:", payload);
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <form onSubmit={handleExtractValues} style={{ maxWidth: '400px' }}>
      <DropdownInput
        alias="status"
        inputLabel="Assignee Status"
        design="outline"
        inputOptions={[
          { optionid: 1, optionvalue: 'available', text: 'Available to Work' },
          { optionid: 2, optionvalue: 'busy', text: 'Currently Busy' },
          { optionid: 3, optionvalue: 'offline', text: 'Offline' },
        ]}
        value={status}
        onChange={(val) => setStatus(val)}
      />

      <Button type="submit" style={{ marginTop: '24px' }}>
        Extract Value
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
 * Demonstrates the seamless binding of `DropdownInput` inside a `Formik` context. 
 * Formik captures the `optionvalue` string directly into the global validation state when an option is selected.
 */
export const FormikIntegration: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          contractType: '',
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          
          if (!values.contractType) {
            errors.contractType = 'A contract type must be selected.';
          } else if (values.contractType === 'legacy') {
            errors.contractType = 'Legacy contracts can no longer be issued to new clients.';
          }
          
          return errors;
        }}
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
                Live Formik Selection State
              </span>
              <pre style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify({ values: formikProps.values, errors: formikProps.errors, touched: formikProps.touched }, null, 2)}
              </pre>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Row gap="4">
                <DropdownInput
                  alias="contractType"
                  inputLabel="Master Service Agreement"
                  design={args.design}
                  width={12}
                  inputOptions={[
                    { optionid: 1, optionvalue: 'standard', text: 'Standard SLA (24h)' },
                    { optionid: 2, optionvalue: 'premium', text: 'Premium SLA (4h)' },
                    { optionid: 3, optionvalue: 'legacy', text: 'Legacy Plan (Do Not Use)' },
                  ]}
                />
              </Row>

              <button
                type="submit"
                disabled={formikProps.isSubmitting}
                style={{
                  marginTop: '20px',
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
                Validate Configuration
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
import { DropdownInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikSelectionPipeline = () => {
  return (
    <Formik
      initialValues={{ contractType: '' }}
      validate={(values) => {
        const errors: Record<string, any> = {};
        if (!values.contractType) {
          errors.contractType = 'Required.';
        } else if (values.contractType === 'legacy') {
          errors.contractType = 'Legacy contracts are retired.';
        }
        return errors;
      }}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <Row gap="4">
          <DropdownInput 
            alias="contractType" 
            inputLabel="Master Service Agreement" 
            width={12} 
            inputOptions={[
              { optionid: 1, optionvalue: 'standard', text: 'Standard SLA (24h)' },
              { optionid: 2, optionvalue: 'premium', text: 'Premium SLA (4h)' },
              { optionid: 3, optionvalue: 'legacy', text: 'Legacy Plan (Do Not Use)' },
            ]}
          />
        </Row>
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};`,
      },
    },
  },
};