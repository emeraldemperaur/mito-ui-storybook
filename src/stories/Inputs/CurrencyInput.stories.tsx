import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { CurrencyInput, type CurrencyInputProps } from './CurrencyInput';
import { Row } from '../Layout/Row'; 
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import { TooltipProvider } from '@radix-ui/react-tooltip';

const ReceiptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 17.5v-11" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

const StatefulCurrencyInput = (args: CurrencyInputProps) => {
  const [val, setVal] = useState<string>(args.value !== undefined ? String(args.value) : '');

  return (
    <CurrencyInput
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
 * Enterprise financial input primitive. Integrates a native Radix Select primitive mapped to a unified `CURRENCIES` dictionary (flag icons, symbols, decimal scales). Implements `IMaskInput` for rigorous floating-point constraints and yields raw unmasked strings to Formik/onChange to ensure valuation precision.
 */
const meta: Meta<CurrencyInputProps> = {
  title: 'Inputs/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `CurrencyInput` for cross-border financial data entry. When bound to Formik, it manages two synchronized fields automatically: `[alias]` (the numerical string) and `[alias]Currency` (the ISO currency code from the selector dropdown). For native React state, supply an `onCurrencyChange` callback to track dropdown updates.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulCurrencyInput/g, 'CurrencyInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<CurrencyInput)/, '$1')
            .replace(/(<CurrencyInput[\s\S]*?\/>)\s*\}$/, '$1');
          const importStatement = `import { CurrencyInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
    // --- Core Identity & Configuration ---
    alias: {
      control: 'text',
      description: 'Required unique identifier mapping the input to its Formik state and DOM label. Also generates the `[alias]Currency` state key for the dropdown.',
      table: { category: 'Core & Identity' },
    },
    defaultCurrency: {
      control: 'select',
      options: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'], 
      description: 'Target local currency baseline configuration from the `CURRENCIES` dictionary.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'USD' } },
    },
    strictCurrency: {
      control: 'boolean',
      description: 'Locks the currency dropdown, preventing the user from changing the `defaultCurrency`.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'false' } },
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
      description: 'Prevents user modification and locks the currency selector while keeping the field focusable and submittable.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction entirely and excludes the field from native form submission.',
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
      description: 'Toggles the interactive floating label animation. Automatically offsets to account for the currency addon.',
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
      options: ['None', 'Receipt', 'Globe'],
      mapping: {
        None: undefined,
        Receipt: <ReceiptIcon />,
        Globe: <GlobeIcon />,
      },
      description: 'Optional trailing icon node. Leading icons are blocked as the currency selector occupies the leading edge.',
      table: { category: 'Icons' },
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Determines icon placement. Note: Left positioning is supported but not recommended as it clusters with the currency addon.',
      table: { category: 'Icons', defaultValue: { summary: 'right' } },
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
      description: 'Highlight color applied to the active border, dropdown hover states, and icons.',
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
    dropdownTextColor: {
      control: 'color',
      description: 'Text color for the dropdown items in light mode.',
      table: { category: 'Theming' }
    },
    darkDropdownTextColor: {
      control: 'color',
      description: 'Text color for the dropdown items in dark mode.',
      table: { category: 'Theming' }
    },
    dropdownHoverTextColor: {
      control: 'color',
      description: 'Text color when a dropdown item is hovered in light mode.',
      table: { category: 'Theming' }
    },
    darkDropdownHoverTextColor: {
      control: 'color',
      description: 'Text color when a dropdown item is hovered in dark mode.',
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
    onCurrencyChange: { 
      action: 'onCurrencyChange', 
      control: false, 
      description: 'Yields the ISO currency code when the dropdown changes. Essential for capturing state outside of Formik.',
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
      description: 'Callback fired when the input loses focus. Automatically triggers Formik field validation (setting to `touched`) and formats the numerical mask.',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering outside a standard Formik provider.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'invoiceTotal',
    inputLabel: 'Invoice Total',
    defaultCurrency: 'USD',
    strictCurrency: false,
    placeholder: '0.00',
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Enter the gross invoice amount before withholding taxes.',
    icon: 'None' as unknown as React.ReactNode,
    iconPosition: 'right',
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
  render: (args) => <StatefulCurrencyInput {...args} />,
};

export default meta;
type Story = StoryObj<CurrencyInputProps>;

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
    defaultCurrency: 'EUR',
    inputLabel: 'European Wire Transfer',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    defaultCurrency: 'GBP',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'London Retainer Fee',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    defaultCurrency: 'JPY',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Tokyo Equipment Lease',
    placeholder: '0',
  },
  parameters: {
    docs: {
      description: {
        story: 'Tactile mechanical well. Note how the JPY currency configuration automatically drops the decimal scale to 0 inside the component logic.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION & BEHAVIORS
// ---------------------------------------------------------------------------

export const StrictCurrency: Story = {
  args: {
    design: 'outline',
    strictCurrency: true,
    inputLabel: 'Locked Domestic Payment',
    defaultCurrency: 'NGN',
  },
  parameters: {
    docs: {
      description: {
        story: 'Setting `strictCurrency={true}` locks the dropdown trigger, effectively forcing the field into a single-currency mode.',
      },
    },
  },
};

export const FloatingLabelWithIcon: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Vendor Bill Amount',
    defaultCurrency: 'CAD',
    icon: 'Receipt' as unknown as React.ReactNode,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the `floatingLabel` animation gracefully clearing the fixed currency addon. Also features a trailing icon.',
      },
    },
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'escrowDeposit',
    defaultCurrency: 'CHF',
    inputLabel: 'Escrow Deposit Requirement',
    isHinted: true,
    hintText: 'Minimum required deposit is 50,000 CHF.',
    errorText: 'Deposit amount fails to meet the minimum threshold.',
    value: '14500.00',
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
    defaultCurrency: 'AUD',
    floatingLabel: true,
    inputLabel: 'Offshore Holding',
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
 * Use `onChange` to capture the unmasked numerical string, and `onCurrencyChange` to capture the ISO code.
 */
export const StandaloneUsage: Story = {
  render: (args) => {
    const [revenue, setRevenue] = useState("45000.00");
    const [revenueCurrency, setRevenueCurrency] = useState("USD");

    const handleExtractValues = (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
        revenueAmount: parseFloat(revenue || "0"),
        revenueCurrency: revenueCurrency,
      };
      alert(JSON.stringify(payload, null, 2));
    };

    return (
      <form onSubmit={handleExtractValues} style={{ width: '100%', maxWidth: '400px', fontFamily: 'system-ui, sans-serif' }}>
        <CurrencyInput
          alias="revenue"
          inputLabel="Annual Revenue"
          design={args.design}
          defaultCurrency="USD"
          value={revenue}
          onChange={(val: string) => setRevenue(val)}
          onCurrencyChange={(code: string) => setRevenueCurrency(code)}
        />
        <button
          type="submit"
          style={{
            marginTop: '24px',
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
          Extract Values
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
        code: `import React, { useState } from "react";
import { CurrencyInput, Button } from "@emeraldemperaur/mito-ui";

export const StandaloneCurrencyExample = () => {
  // Track both the amount and the currency code
  const [revenue, setRevenue] = useState("");
  const [revenueCurrency, setRevenueCurrency] = useState("USD"); 

  const handleExtractValues = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      revenueAmount: parseFloat(revenue || "0"),
      revenueCurrency: revenueCurrency,
    };

    console.log("Extracted Standalone Payload:", payload);
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <form onSubmit={handleExtractValues} style={{ maxWidth: '400px' }}>
      <CurrencyInput
        alias="revenue"
        inputLabel="Annual Revenue"
        design="outline"
        defaultCurrency="USD"
        value={revenue}
        onChange={(val: string) => setRevenue(val)}
        onCurrencyChange={(code: string) => setRevenueCurrency(code)}
      />

      <Button type="submit" style={{ marginTop: '24px' }}>
        Extract Values
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
 * Demonstrates the synchronized, multi-key binding of `CurrencyInput` inside a `Formik` context. 
 * Formik captures the numerical amount (`[alias]`) and the ISO currency code (`[alias]Currency`) automatically.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          remittanceAmount: '',
          remittanceAmountCurrency: 'USD',
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          if (!values.remittanceAmount) {
            errors.remittanceAmount = 'Amount is required.';
          } else if (parseFloat(values.remittanceAmount) <= 0) {
            errors.remittanceAmount = 'Amount must be greater than zero.';
          }
          
          if (values.remittanceAmountCurrency === 'JPY' && parseFloat(values.remittanceAmount) < 10000) {
             errors.remittanceAmount = 'Minimum JPY remittance is ¥10,000.';
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
              <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Dual-Bound Formik State
              </span>
              <pre style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify({ values: formikProps.values, errors: formikProps.errors }, null, 2)}
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
                <CurrencyInput
                  alias="remittanceAmount"
                  inputLabel="Remittance Value"
                  defaultCurrency="USD"
                  placeholder="0.00"
                  icon={<GlobeIcon />}
                  iconPosition="right"
                  design={args.design}
                  width={12}
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
                Execute Transfer
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
import { CurrencyInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikRemittancePipeline = () => {
  return (
    <Formik
      initialValues={{ remittanceAmount: '', remittanceAmountCurrency: 'USD' }}
      validate={(values) => {
        const errors: Record<string, any> = {};
        if (!values.remittanceAmount) {
          errors.remittanceAmount = 'Amount is required.';
        } else if (parseFloat(values.remittanceAmount) <= 0) {
          errors.remittanceAmount = 'Amount must be greater than zero.';
        }
        
        if (values.remittanceAmountCurrency === 'JPY' && parseFloat(values.remittanceAmount) < 10000) {
             errors.remittanceAmount = 'Minimum JPY remittance is ¥10,000.';
        }
        return errors;
      }}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <Row gap="4">
          <CurrencyInput 
            alias="remittanceAmount" 
            defaultCurrency="USD" 
            inputLabel="Remittance Value" 
            width={12} 
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