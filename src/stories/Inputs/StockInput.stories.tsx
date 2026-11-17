import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { StockInput, type StockInputProps } from './StockInput';
import { Row } from '../Layout/Row'; 
import { GlobalUIContext } from '../Layout/GlobalUIContext'; 

const StatefulStockInput = (args: StockInputProps) => {
  const [val, setVal] = useState<string>(args.value !== undefined ? String(args.value) : '');

  return (
    <StockInput
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
 * Enterprise equity tracking input primitive. Utilizes `IMaskInput` to enforce strict financial formatting 
 * (2 decimals, right-aligned) and features an immutable ticker symbol badge prefix. Automatically binds to 
 * Formik validation state and shares exact visual parity with the standard `Input` variants.
 */
const meta: Meta<StockInputProps> = {
  title: 'Inputs/StockInput',
  component: StockInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `StockInput` for equity, asset, or ticker-based financial entry. The component yields raw unmasked strings to Formik/onChange to ensure valuation precision without floating-point math errors.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulStockInput/g, 'StockInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<StockInput)/, '$1')
            .replace(/(<StockInput[\s\S]*?\/>)\s*\}$/, '$1');
          const importStatement = `import { StockInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
    // --- Core Identity & Equity Tracking ---
    alias: {
      control: 'text',
      description: 'Unique identifier mapping the input to its Formik state and DOM label. (Required)',
      table: { category: 'Core & Identity' },
    },
    tickerSymbol: {
      control: 'text',
      description: 'The ticker symbol to display in the decorative leading badge (e.g., "AAPL", "TSLA"). If omitted, falls back to a chart icon.',
      table: { category: 'Core & Identity' },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered statically above the field or animated inside the border when `floatingLabel` is active.',
      table: { category: 'Core & Identity' },
    },
    placeholder: {
      control: 'text',
      description: 'Hint text displayed inside the input when empty.',
      table: { category: 'Core & Identity', defaultValue: { summary: '0.00' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents user modification while keeping the field focusable and submittable.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and excludes the field from native form submission.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'false' } },
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
      description: 'Highlight color applied to the active/focused border and icons.',
      table: { category: 'Theming' } 
    },
    backgroundColor: { 
      control: 'color', 
      description: 'Dynamic base background color for light mode. Seeds 3D calculations.',
      table: { category: 'Theming' } 
    },
    darkBackgroundColor: { 
      control: 'color', 
      description: 'Dynamic base background color specifically for dark mode contexts.',
      table: { category: 'Theming' } 
    },
    textColor: { 
      control: 'color', 
      description: 'Standard text and icon color for light mode.',
      table: { category: 'Theming' } 
    },
    darkTextColor: { 
      control: 'color', 
      description: 'Standard text and icon color specifically for dark mode contexts.',
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
      description: 'Yields the raw unmasked string value (e.g. "1250.50"). Automatically intercepts and propagates to the Formik state tree if `alias` is bound.',
      table: { category: 'State & Events' } 
    },
    onFocus: { 
      action: 'onFocus', 
      control: false, 
      description: 'Callback fired when the input receives focus. Triggers floating label animations and applies `activeColor`.',
      table: { category: 'State & Events' } 
    },
    onBlur: { 
      action: 'onBlur', 
      control: false, 
      description: 'Callback fired when the input loses focus. Automatically triggers Formik field validation (setting to `touched`) and formats the mask.',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering outside a standard Formik provider.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'appleShares',
    tickerSymbol: 'AAPL',
    inputLabel: 'Current Position Valuation',
    placeholder: '0.00',
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Enter the total estimated valuation of your held shares.',
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
  render: (args) => <StatefulStockInput {...args} />,
};

export default meta;
type Story = StoryObj<StockInputProps>;

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
    tickerSymbol: 'TSLA',
    inputLabel: 'Target Entry Price',
    placeholder: '0.00',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    tickerSymbol: 'MSFT',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Total Asset Value',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    tickerSymbol: 'NVDA',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Portfolio Weight',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION & BEHAVIORS
// ---------------------------------------------------------------------------

export const MissingTickerFallback: Story = {
  args: {
    design: 'outline',
    tickerSymbol: undefined,
    inputLabel: 'Unlisted Equity',
    placeholder: '0.00',
  },
  parameters: {
    docs: {
      description: {
        story: 'If `tickerSymbol` is omitted, the component falls back to a generic chart icon (`FaChartLine`) while maintaining the identical dynamic offset layout.',
      },
    },
  },
};

export const FloatingLabel: Story = {
  args: {
    design: 'outline',
    tickerSymbol: 'AMZN',
    floatingLabel: true,
    inputLabel: 'Buy Limit',
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'gmeShares',
    tickerSymbol: 'GME',
    inputLabel: 'Ask Price',
    isHinted: true,
    hintText: 'Enter the maximum price you are willing to accept.',
    errorText: 'Price is below the current market minimum.',
    value: '14.50',
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
    tickerSymbol: 'PLTR',
    floatingLabel: true,
    inputLabel: 'Allocated Capital',
    activeColor: '#60a5fa',
  },
};

// ---------------------------------------------------------------------------
// FORMIK INTEGRATION
// ---------------------------------------------------------------------------

/**
 * **Interactive Form Pipeline:**
 * Demonstrates the seamless binding of `StockInput` inside a `Formik` context. 
 * The component returns precise, unmasked strings (e.g. `"1500.50"`) to Formik, avoiding JS floating-point mutations.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          aaplShares: '',
          tslaShares: '',
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          if (!values.aaplShares) {
            errors.aaplShares = 'AAPL valuation is required.';
          } else if (parseFloat(values.aaplShares) <= 0) {
            errors.aaplShares = 'Amount must be greater than zero.';
          }
          if (parseFloat(values.tslaShares) > 50000) {
            errors.tslaShares = 'Exceeds maximum allowable portfolio allocation.';
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
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Equity Portfolio State
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
                <StockInput
                  alias="aaplShares"
                  tickerSymbol="AAPL"
                  inputLabel="Apple Inc."
                  placeholder="0.00"
                  design={args.design}
                  width={6}
                />
                <StockInput
                  alias="tslaShares"
                  tickerSymbol="TSLA"
                  inputLabel="Tesla Inc."
                  placeholder="0.00"
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
                Execute Trade
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
import { StockInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikEquityPipeline = () => {
  return (
    <Formik
      initialValues={{ aaplShares: '', tslaShares: '' }}
      validate={(values) => {
        const errors: Record<string, any> = {};
        if (!values.aaplShares) errors.aaplShares = 'Required.';
        if (parseFloat(values.tslaShares) > 50000) errors.tslaShares = 'Exceeds max allocation.';
        return errors;
      }}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <Row gap="4">
          <StockInput alias="aaplShares" tickerSymbol="AAPL" inputLabel="Apple Inc." width={6} />
          <StockInput alias="tslaShares" tickerSymbol="TSLA" inputLabel="Tesla Inc." width={6} />
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