import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import cardValidator from "card-validator";
import { CreditCardInput, type CreditCardInputProps } from './CreditCardInput';
import { Row } from '../Layout/Row'; 
import { GlobalUIContext } from '../Layout/GlobalUIContext'; 

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// Stateful wrapper so standalone stories are fully interactive out-of-the-box
const StatefulCreditCardInput = (args: CreditCardInputProps) => {
  const [val, setVal] = useState<string>(args.value !== undefined ? String(args.value) : '');

  return (
    <CreditCardInput
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
 * Enterprise payment input primitive. Integrates `card-validator` to detect card issuer in real-time, 
 * automatically updates the trailing brand icon (Visa, Mastercard, Amex, etc.), and uses `IMaskInput` 
 * to enforce exact 16-digit (or 15-digit Amex) spacing. Yields raw unmasked numerical strings to ensure pipeline precision.
 */
const meta: Meta<CreditCardInputProps> = {
  title: 'Inputs/CreditCardInput',
  component: CreditCardInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `CreditCardInput` exclusively for secure payment entry. The component handles spacing masks automatically (e.g. `0000 0000 0000 0000` vs `0000 000000 00000` for Amex). The trailing card icon is securely hardcoded; developers may supply an optional `icon` prop for the leading edge (such as a lock symbol).',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulCreditCardInput/g, 'CreditCardInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<CreditCardInput)/, '$1')
            .replace(/(<CreditCardInput[\s\S]*?\/>)\s*\}$/, '$1');
          const importStatement = `import { CreditCardInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
    // --- Core Identity ---
    alias: {
      control: 'text',
      description: 'Required unique identifier mapping the input to its Formik state and accessible `<label>`.',
      table: { category: 'Core & Identity' },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered statically above the field or animated inside the border.',
      table: { category: 'Core & Identity' },
    },
    placeholder: {
      control: 'text',
      description: 'Hint text displayed inside the input when empty.',
      table: { category: 'Core & Identity', defaultValue: { summary: '0000 0000 0000 0000' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents user modification while keeping the field focusable and submittable.',
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
      description: 'Toggles the interactive floating label animation (primarily used with the `outline` variant).',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system or parent theme contexts. Recalculates icon colors for contrast.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },

    // --- Icons ---
    icon: {
      control: 'select',
      options: ['None', 'Lock'],
      mapping: {
        None: undefined,
        Lock: <LockIcon />,
      },
      description: 'Optional secondary icon node. Note: The dynamic card brand icon is permanently affixed to the trailing right edge.',
      table: { category: 'Icons' },
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Determines secondary icon placement. Note: If set to right, it shifts inward to accommodate the permanent card brand icon.',
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

    // --- Formik & Events ---
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the raw unmasked string value (e.g. "4111222233334444" without spaces). Automatically intercepts and propagates to Formik.',
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
      description: 'Callback fired when the input loses focus. Automatically triggers Formik field validation (setting to `touched`).',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering outside a standard Formik provider.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'cardNumber',
    inputLabel: 'Card Number',
    placeholder: '0000 0000 0000 0000',
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'We accept Visa, Mastercard, Amex, Discover, Diners Club, and JCB.',
    icon: 'Lock' as unknown as React.ReactNode,
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
          </TooltipProvider>
        </GlobalUIContext.Provider>
      );
    },
  ],
  render: (args) => <StatefulCreditCardInput {...args} />,
};

export default meta;
type Story = StoryObj<CreditCardInputProps>;

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
    inputLabel: 'Corporate Card Number',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Secure Payment',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Physical Card',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION & BEHAVIORS
// ---------------------------------------------------------------------------

export const FloatingLabel: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Payment Method',
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'invalidCard',
    inputLabel: 'Card Number',
    isHinted: true,
    hintText: 'Enter a valid 16-digit card number.',
    errorText: 'The card network declined this transaction.',
    value: '4111111111111111',
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
    floatingLabel: true,
    inputLabel: 'Stored Card',
    activeColor: '#60a5fa',
  },
};

export const AmericanExpressFormat: Story = {
  args: {
    design: 'outline',
    alias: 'corporateCard',
    inputLabel: 'Corporate Amex',
    value: '378282246310005',
    icon: 'Lock' as unknown as React.ReactNode,
  },
  parameters: {
    docs: {
      description: {
        story: 'Automatically detects American Express routing numbers (starting with `34` or `37`), immediately swapping the trailing icon to the Amex brand and dynamically adjusting the IMask structure from standard 16-digit spacing to Amex\'s specific 15-digit format (`0000 000000 00000`).',
      },
    },
  },
};

export const VisaFormat: Story = {
  args: {
    design: 'outline',
    alias: 'personalCard',
    inputLabel: 'Personal Visa',
    value: '4111222233334444',
    icon: 'Lock' as unknown as React.ReactNode,
  },
  parameters: {
    docs: {
      description: {
        story: 'Detects Visa routing numbers (starting with `4`), rendering the Visa brand icon and enforcing the standard 16-digit (`0000 0000 0000 0000`) spacing mask.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Native React State (No Formik):**
 * When rendering outside a Formik context, the component functions as a standard controlled React input. 
 * Use `onChange` to capture the unmasked numerical string. Type in a Visa or Amex prefix (e.g. `4` or `37`) to see the icon swap.
 */
export const StandaloneUsage: Story = {
  render: (args) => {
    const [card, setCard] = useState("");

    const handleExtractValues = (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload = {
        cardNumber: card,
        cardLength: card.length,
      };

      alert(JSON.stringify(payload, null, 2));
    };

    return (
      <form onSubmit={handleExtractValues} style={{ width: '100%', maxWidth: '400px', fontFamily: 'system-ui, sans-serif' }}>
        <CreditCardInput
          alias="cardNumber"
          inputLabel="Payment Details"
          design={args.design}
          value={card}
          onChange={(val: string) => setCard(val)}
          icon={<LockIcon />}
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
import { CreditCardInput } from "@emeraldemperaur/mito-ui/CreditCardInput";
import { LockClosedIcon } from "@radix-ui/react-icons";

export const StandaloneCardExample = () => {
  const [card, setCard] = useState("");

  const handleExtractValues = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      cardNumber: card,
    };

    console.log("Extracted Standalone Payload:", payload);
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <form onSubmit={handleExtractValues} style={{ maxWidth: '400px' }}>
      <CreditCardInput
        alias="cardNumber"
        inputLabel="Payment Details"
        design="outline"
        value={card}
        onChange={(val: string) => setCard(val)}
        icon={<LockClosedIcon />}
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
 * Demonstrates the seamless binding of `CreditCardInput` inside a `Formik` context. 
 * The `card-validator` library (which powers the icon swapping inside the component) can also be used in your Formik `validate` step to ensure the unmasked number is mathematically sound via Luhn checks.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          paymentMethod: '',
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          
          if (!values.paymentMethod) {
            errors.paymentMethod = 'Card number is required.';
          } else {
            // Leverage the same validator library used internally by the component
            const numberValidation = cardValidator.number(values.paymentMethod);
            if (!numberValidation.isValid) {
              errors.paymentMethod = 'Invalid card number.';
            }
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
                Live PCI Scope Pipeline State
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
                <CreditCardInput
                  alias="paymentMethod"
                  inputLabel="Primary Payment Method"
                  icon={<LockIcon />}
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
                Save Payment Method
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
import { CreditCardInput, Row } from '@emeraldemepraur/mito-ui';
import cardValidator from "card-validator";
import { LockClosedIcon } from "@radix-ui/react-icons";

export const FormikPaymentPipeline = () => {
  return (
    <Formik
      initialValues={{ paymentMethod: '' }}
      validate={(values) => {
        const errors: Record<string, any> = {};
        if (!values.paymentMethod) {
          errors.paymentMethod = 'Required.';
        } else {
          const numberValidation = cardValidator.number(values.paymentMethod);
          if (!numberValidation.isValid) errors.paymentMethod = 'Invalid card number.';
        }
        return errors;
      }}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <Row gap="4">
          <CreditCardInput 
            alias="paymentMethod" 
            inputLabel="Primary Payment Method" 
            icon={<LockClosedIcon />}
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