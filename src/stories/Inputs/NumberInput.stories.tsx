import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { NumberInput, type NumberInputProps } from './NumberInput';
import { Row } from '../Layout/Row'; 
import { GlobalUIContext } from '../Layout/GlobalUIContext'; 

// --- Mock Icons for Storybook DX ---
const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const PercentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const HashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

// Stateful wrapper so standalone stories are fully interactive out-of-the-box
const StatefulNumberInput = (args: NumberInputProps) => {
  const [val, setVal] = useState<string>(args.value !== undefined ? String(args.value) : '');

  return (
    <NumberInput
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
 * Enterprise numerical input primitive. Utilizes `IMaskInput` to enforce strict formatting, 
 * decimal padding, and character blocking. Features right-aligned tabular numbers, Formik 
 * binding, and shares exact visual parity with the standard `Input` variants.
 */
const meta: Meta<NumberInputProps> = {
  title: 'Inputs/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `NumberInput` for financial, metric, or strictly quantitative data entry. Adjust `decimals` and `allowNegative` to control the input mask mask. The component yields raw unmasked strings to Formik/onChange to ensure precision without floating-point math errors.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulNumberInput/g, 'NumberInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<NumberInput)/, '$1')
            .replace(/(<NumberInput[\s\S]*?\/>)\s*\}$/, '$1');
          const importStatement = `import { NumberInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
    // --- Core Identity & Number Rules ---
    alias: {
      control: 'text',
      description: 'Required unique identifier mapping the input to its Formik field path and accessible `<label>`.',
      table: { category: 'Core & Mask Rules' },
    },
    decimals: {
      control: { type: 'range', min: 0, max: 6, step: 1 },
      description: 'Number of decimal places to enforce and automatically pad with zeros.',
      table: { category: 'Core & Mask Rules', defaultValue: { summary: '2' } },
    },
    allowNegative: {
      control: 'boolean',
      description: 'Permits the entry of negative numerical values using the `-` key.',
      table: { category: 'Core & Mask Rules', defaultValue: { summary: 'false' } },
    },
    inputLabel: {
      control: 'text',
      description: 'Label text rendered statically above the field or animated inside the border.',
      table: { category: 'Core & Mask Rules' },
    },
    placeholder: {
      control: 'text',
      description: 'Hint text displayed inside the input when empty.',
      table: { category: 'Core & Mask Rules', defaultValue: { summary: '0.00' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents user modification while keeping the field focusable.',
      table: { category: 'Core & Mask Rules', defaultValue: { summary: 'false' } },
    },

    // --- Design System & Labels ---
    design: {
      control: 'radio',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'Core architectural motif of the input container.',
      table: { category: 'Design System', defaultValue: { summary: 'outline' } },
    },
    floatingLabel: {
      control: 'boolean',
      description: 'Animates `inputLabel` smoothly onto the top border on focus or value entry.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },

    // --- Icons ---
    icon: {
      control: 'select',
      options: ['None', 'Dollar', 'Percent', 'Hash'],
      mapping: {
        None: undefined,
        Dollar: <DollarIcon />,
        Percent: <PercentIcon />,
        Hash: <HashIcon />,
      },
      description: 'Optional leading or trailing icon node.',
      table: { category: 'Icons' },
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Determines whether the icon sits on the leading (left) or trailing (right) edge.',
      table: { category: 'Icons', defaultValue: { summary: 'left' } },
    },

    // --- Validation & Hints ---
    errorText: {
      control: 'text',
      description: 'Explicit error message string. Overrides Formik validation errors if provided.',
      table: { category: 'Validation & Hints' },
    },
    isHinted: {
      control: 'boolean',
      description: 'Renders an interactive tooltip trigger icon adjacent to static labels.',
      table: { category: 'Validation & Hints', defaultValue: { summary: 'false' } },
    },
    hintText: {
      control: 'text',
      description: 'Tooltip copy displayed when hovering or focusing the hint icon.',
      table: { category: 'Validation & Hints' },
      if: { arg: 'isHinted', eq: true },
    },
    hintUrl: {
      control: 'text',
      description: 'Optional external documentation URL opened when clicking the hint icon.',
      table: { category: 'Validation & Hints' },
      if: { arg: 'isHinted', eq: true },
    },

    // --- Layout ---
    width: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Grid column span width within a 12-column `Row` container.',
      table: { category: 'Layout', defaultValue: { summary: '12' } },
    },
    newRow: {
      control: 'boolean',
      description: 'Forces the input column to break onto Grid Line 1 of a fresh structural row.',
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
      description: 'Focus ring, active border, and floating label highlight color.',
      table: { category: 'Theming' } 
    },
    backgroundColor: { 
      control: 'color', 
      description: 'Surface background color in light mode (also seeds 3D shadow calculation).',
      table: { category: 'Theming' } 
    },
    darkBackgroundColor: { 
      control: 'color', 
      description: 'Surface background color explicitly for dark mode contexts.',
      table: { category: 'Theming' } 
    },
    textColor: { 
      control: 'color', 
      description: 'Input value and static label text color in light mode.',
      table: { category: 'Theming' } 
    },
    darkTextColor: { 
      control: 'color', 
      description: 'Input value and static label text color in dark mode.',
      table: { category: 'Theming' } 
    },
    errorTextColor: { 
      control: 'color', 
      description: 'Error message and invalid border highlight color in light mode.',
      table: { category: 'Theming' } 
    },
    darkErrorTextColor: { 
      control: 'color', 
      description: 'Error message and invalid border highlight color in dark mode.',
      table: { category: 'Theming' } 
    },
    fontFamily: { 
      control: 'text', 
      description: 'Custom font family override.',
      table: { category: 'Typography' } 
    },

    // --- Formik & Events ---
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the raw unmasked string value (e.g. "1250.50"). Automatically intercepts and propagates to the Formik state tree if `alias` is bound.',
      table: { category: 'State & Events' } 
    },
    onFocus: { 
      action: 'onFocus', 
      control: false, 
      description: 'Callback fired when the input receives focus. Triggers the floating label animation and applies the `activeColor` highlight to borders and icons.',
      table: { category: 'State & Events' } 
    },
    onBlur: { 
      action: 'onBlur', 
      control: false, 
      description: 'Callback fired when the input loses focus. Automatically triggers Formik field validation (setting the field to `touched`) and forces IMask to format/pad fractional zeros.',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering outside a standard Formik provider.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'transactionAmount',
    inputLabel: 'Transaction Amount',
    placeholder: '0.00',
    decimals: 2,
    allowNegative: false,
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    icon: 'Dollar' as unknown as React.ReactNode,
    iconPosition: 'left',
    width: 12,
    isHinted: false,
    hintText: 'Enter the exact transaction amount.',
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
              alignItems: 'center',
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
        </GlobalUIContext.Provider>
      );
    },
  ],
  render: (args) => <StatefulNumberInput {...args} />,
};

export default meta;
type Story = StoryObj<NumberInputProps>;

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
    inputLabel: 'Target Revenue',
    placeholder: '0.00',
    activeColor: '#10b981',
    icon: 'Dollar' as unknown as React.ReactNode,
    iconPosition: 'left',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Discount Percentage',
    placeholder: '0.0',
    decimals: 1,
    icon: 'Percent' as unknown as React.ReactNode,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft recessed layout. Modified to demonstrate 1 decimal place with a trailing percentage icon.',
      },
    },
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Total Shares',
    placeholder: '0',
    decimals: 0,
    icon: 'Hash' as unknown as React.ReactNode,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tactile mechanical well. Set to `decimals={0}` to enforce strictly integer inputs.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION & BEHAVIORS
// ---------------------------------------------------------------------------

export const AllowNegativeValues: Story = {
  args: {
    design: 'outline',
    inputLabel: 'Net Adjustment',
    placeholder: '0.00',
    allowNegative: true,
    activeColor: '#8b5cf6',
  },
  parameters: {
    docs: {
      description: {
        story: 'By setting `allowNegative={true}`, the user can toggle a negative sign using the `-` key on their keyboard. The mask will safely format it.',
      },
    },
  },
};

export const FloatingLabel: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Quarterly Spend',
    icon: 'Dollar' as unknown as React.ReactNode,
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'taxRate',
    inputLabel: 'Applied Tax Rate',
    icon: 'Percent' as unknown as React.ReactNode,
    iconPosition: 'right',
    isHinted: true,
    hintText: 'Ensure this matches the regional tax bracket. Click to view tax tables.',
    hintUrl: 'https://example.com/tax-tables',
    errorText: 'Tax rate cannot exceed the maximum regional threshold of 100%.',
    value: '145.00',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates `isHinted` tooltip annotations alongside explicit `errorText` validation states and ARIA alert bindings specifically mapped to numerical data entry.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// FORMIK INTEGRATION
// ---------------------------------------------------------------------------

/**
 * **Interactive Form Pipeline:**
 * Demonstrates the seamless binding of `NumberInput` inside a `Formik` context. 
 * The component returns precise, unmasked strings (e.g. `"1500.50"`) to Formik, avoiding JS floating-point mutations.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          grossAmount: '',
          taxRate: '5.00',
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          if (!values.grossAmount) {
            errors.grossAmount = 'Gross amount is required.';
          } else if (parseFloat(values.grossAmount) <= 0) {
            errors.grossAmount = 'Amount must be greater than zero.';
          }
          if (parseFloat(values.taxRate) > 100) {
            errors.taxRate = 'Tax rate cannot exceed 100%.';
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
              <span style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Numerical Formik State
              </span>
              <pre style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify({ values: formikProps.values, errors: formikProps.errors }, null, 2)}
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
              }}
            >
              <Row gap="4">
                <NumberInput
                  alias="grossAmount"
                  inputLabel="Gross Revenue"
                  placeholder="0.00"
                  icon={<DollarIcon />}
                  design={args.design}
                  width={6}
                />
                <NumberInput
                  alias="taxRate"
                  inputLabel="Applied Tax Rate"
                  placeholder="0.00"
                  icon={<PercentIcon />}
                  iconPosition="right"
                  design={args.design}
                  width={6}
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
                Validate & Submit
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
import { NumberInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikNumericalPipeline = () => {
  return (
    <Formik
      initialValues={{ grossAmount: '', taxRate: '5.00' }}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <Row gap="4">
          <NumberInput alias="grossAmount" inputLabel="Gross Revenue" width={6} />
          <NumberInput alias="taxRate" inputLabel="Tax Rate" iconPosition="right" width={6} />
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