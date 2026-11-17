import React, { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ConditionalTrigger, type ConditionalProps } from './ConditionalTrigger';
import { Input } from './Input';
import { CurrencyInput } from './CurrencyInput';
import { StockInput } from './StockInput';
import { Row } from '../Layout/Row';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

// Standalone wrapper for native state tracking
const StatefulConditionalTrigger = (args: ConditionalProps) => {
  const [val, setVal] = useState<any>(args.triggerType === 'select' ? '' : false);

  return (
    <ConditionalTrigger
      {...args}
      value={val}
      onChange={(newVal) => {
        setVal(newVal);
        args.onChange?.(newVal);
      }}
    />
  );
};

// Typed decorator providing Mito UI context and TooltipProvider
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
            minHeight: '280px',
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
 * Enterprise conditional layout primitive. Orchestrates smooth, animated DOM expansions linked to Formik or native state.
 * Supports Toggle (Switch), Checkbox, and Select trigger modalities to reveal deeply nested forms or advanced settings regions.
 */
const meta: Meta<ConditionalProps> = {
  title: 'Inputs/ConditionalTrigger',
  component: ConditionalTrigger,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `ConditionalTrigger` to progressively disclose form complexity. The component expands its `children` region when the bound field value strictly equals the `triggerValue`. Supports seamless Formik integration natively via the `alias` prop, or standalone usage via the `value` prop.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulConditionalTrigger/g, 'ConditionalTrigger');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          const importStatement = `import { ConditionalTrigger, Input, CurrencyInput, StockInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
      description: 'Required unique identifier mapping the trigger to its Formik state and DOM label.',
      table: { category: 'Core & Logic' },
    },
    triggerType: {
      control: 'radio',
      options: ['toggle', 'checkbox', 'select'],
      description: 'The interaction modality used to capture state and evaluate the conditional render.',
      table: { category: 'Core & Logic', defaultValue: { summary: 'toggle' } },
    },
    triggerValue: {
      control: 'text',
      description: 'The exact value the field must strictly equal (`===`) to expand and reveal the child components. While represented as a text input in Storybook controls, it natively supports booleans, numbers, and strings in your application code.',
      table: {
        category: 'Core & Logic',
        type: {
          summary: 'string | boolean | number',
          detail: 'Evaluates strictly (===) against the Formik state or local value.',
        },
      },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered alongside the toggle/checkbox, or statically above the select trigger.',
      table: { category: 'Core & Logic' },
    },
    inputOptions: {
      control: 'object',
      description: 'Array of structural options (`{ optionid, optionvalue, text }`). Exclusively required if `triggerType` is `"select"`.',
      table: { category: 'Core & Logic' },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when the `select` triggerType is empty.',
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

    // --- Design System & Labels ---
    design: {
      control: 'radio',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'Core architectural design variant of the trigger and the expanded container well.',
      table: { category: 'Design System', defaultValue: { summary: 'outline' } },
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
      description: 'Highlight color applied to the active/focused borders, toggles, and checkboxes.',
      table: { category: 'Theming' },
    },
    backgroundColor: {
      control: 'color',
      description: 'Dynamic base background color for light mode. Colors the container and well background.',
      table: { category: 'Theming' },
    },
    darkBackgroundColor: {
      control: 'color',
      description: 'Dynamic base background color specifically for dark mode contexts.',
      table: { category: 'Theming' },
    },
    textColor: {
      control: 'color',
      description: 'Standard text color for light mode.',
      table: { category: 'Theming' },
    },
    darkTextColor: {
      control: 'color',
      description: 'Standard text color specifically for dark mode contexts.',
      table: { category: 'Theming' },
    },
    errorTextColor: {
      control: 'color',
      description: 'Validation failure text color for light mode.',
      table: { category: 'Theming' },
    },
    darkErrorTextColor: {
      control: 'color',
      description: 'Validation failure text color for dark mode.',
      table: { category: 'Theming' },
    },
    fontFamily: {
      control: 'text',
      description: 'Font family override to match specific UI brand primitives.',
      table: { category: 'Typography' },
    },

    // --- State & Events ---
    value: {
      control: false,
      description: 'External fallback state value for standalone non-Formik setups. If a `Formik` provider is present, the component automatically prioritizes the Formik pipeline state mapped via the `alias` key over this prop.',
      table: { category: 'State & Events' },
    },
    onChange: {
      action: 'onChange',
      control: false,
      description: 'Yields the raw value upon interaction. Automatically intercepts and propagates to Formik if present.',
      table: { category: 'State & Events' },
    },
    formikContext: {
      control: false,
      description: 'Explicit Formik context object injected when rendering nested workflows manually.',
      table: { category: 'State & Events' },
    },
  },
  args: {
    alias: 'enableAdvancedSettings',
    triggerType: 'toggle',
    triggerValue: true,
    inputLabel: 'Enable Advanced API Configuration',
    design: 'outline',
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Only enable this if instructed by enterprise support.',
    children: (
      <Input
        alias="webhookUrl"
        inputLabel="Endpoint Webhook URL"
        placeholder="https://api.yourdomain.com/v1/webhook"
        design="outline"
        width={12}
      />
    ),
  },
  decorators: [withMitoContext],
  render: (args) => <StatefulConditionalTrigger {...args} />,
};

export default meta;
type Story = StoryObj<ConditionalProps>;

// ---------------------------------------------------------------------------
// TRIGGER MODALITIES
// ---------------------------------------------------------------------------

export const ToggleTrigger: Story = {
  args: {
    design: 'outline',
    triggerType: 'toggle',
    alias: 'enableMarginTrading',
    inputLabel: 'Enable Equity Allocation & Margin Limit',
    triggerValue: true,
    activeColor: '#2563eb',
    children: (
      <>
        <StockInput
          alias="tickerSymbol"
          inputLabel="Target Equity Ticker"
          placeholder="AAPL"
          design="outline"
          width={6}
        />
        <CurrencyInput
          alias="allocationCap"
          inputLabel="Maximum Allocation"
          placeholder="10,000.00"
          design="outline"
          width={6}
        />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'The default `toggle` trigger renders an animated switch. Because `ConditionalTrigger` wraps its `children` inside an internal `<Row>`, child Mito UI primitives (`StockInput`, `CurrencyInput`) automatically snap onto the 12-column responsive grid.',
      },
    },
  },
};

export const CheckboxTrigger: Story = {
  args: {
    design: 'material',
    triggerType: 'checkbox',
    alias: 'hasCustomDeposit',
    inputLabel: 'Specify a custom initial retainer deposit',
    triggerValue: true,
    activeColor: '#10b981',
    children: (
      <CurrencyInput
        alias="retainerAmount"
        inputLabel="Retainer Deposit Amount"
        placeholder="2,500.00"
        design="material"
        activeColor="#10b981"
        width={12}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'The `checkbox` trigger offers a classic opt-in experience, revealing a matching `material` variant `CurrencyInput` when checked.',
      },
    },
  },
};

export const SelectTrigger: Story = {
  args: {
    design: 'neumorphic',
    triggerType: 'select',
    alias: 'assetClass',
    inputLabel: 'Primary Portfolio Asset Class',
    placeholder: 'Select an asset class...',
    triggerValue: 'equities',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputOptions: [
      { optionid: 1, optionvalue: 'cash', text: 'Money Market / Cash' },
      { optionid: 2, optionvalue: 'bonds', text: 'Fixed Income Bonds' },
      { optionid: 3, optionvalue: 'equities', text: 'Public Equities (Specify Ticker)' },
    ],
    children: (
      <StockInput
        alias="primaryTicker"
        inputLabel="Lead Equity Symbol"
        placeholder="NVDA"
        design="neumorphic"
        backgroundColor="#e0e5ec"
        width={12}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'The `select` trigger evaluates against a dropdown payload. Selecting `"Public Equities"` satisfies `assetClass === "equities"` and reveals a recessed `neumorphic` `StockInput` inside the inset well.',
      },
    },
  },
};

export const SkeuomorphicDesign: Story = {
  args: {
    design: 'skeuomorphic',
    triggerType: 'toggle',
    alias: 'overrideCap',
    inputLabel: 'Manual Treasury Disbursement Override',
    triggerValue: true,
    backgroundColor: '#e0e5ec',
    children: (
      <CurrencyInput
        alias="overrideLimit"
        inputLabel="Authorized Disbursement Ceiling"
        placeholder="50,000.00"
        design="skeuomorphic"
        backgroundColor="#e0e5ec"
        width={12}
      />
    ),
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    triggerType: 'toggle',
    alias: 'requestAudit',
    inputLabel: 'Request Tier 3 Security Audit',
    triggerValue: true,
    isHinted: true,
    hintText: 'This will incur an additional compliance retainer fee.',
    errorText: 'Your account tier is ineligible for on-demand audits.',
    children: (
      <Input
        alias="cisoEmail"
        inputLabel="Compliance Contact Email"
        placeholder="ciso@yourdomain.com"
        design="outline"
        width={12}
      />
    ),
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Clever Standalone Usage (Non-Formik):**
 * Orchestrates multiple Mito UI primitives (`Input`, `CurrencyInput`, and `StockInput`) inside standalone `ConditionalTrigger` blocks using native React state.
 */
export const StandaloneUsage: Story = {
  render: (args: ConditionalProps) => {
    const [wantsGiftWrap, setWantsGiftWrap] = useState<boolean>(false);
    const [settlementType, setSettlementType] = useState<string>('fiat');

    const [giftMessage, setGiftMessage] = useState<string>('');
    const [equityTicker, setEquityTicker] = useState<string>('');
    const [settlementAmount, setSettlementAmount] = useState<string>('');

    const handleExtractValues = (e: React.FormEvent) => {
      e.preventDefault();

      const payload = {
        wantsGiftWrap,
        giftMessage: wantsGiftWrap ? giftMessage : null,
        settlementType,
        equitySettlement: settlementType === 'equity'
          ? { ticker: equityTicker, amount: settlementAmount }
          : null,
      };

      alert(`Extracted Standalone Payload:\n${JSON.stringify(payload, null, 2)}`);
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '500px', fontFamily: 'system-ui, sans-serif' }}>
        <ConditionalTrigger
          alias="giftWrap"
          triggerType="toggle"
          inputLabel="Include Personalized Note?"
          design={args.design}
          value={wantsGiftWrap}
          triggerValue={true}
          onChange={(val: boolean) => setWantsGiftWrap(val)}
        >
          <Input
            alias="giftMessage"
            inputLabel="Recipient Note"
            placeholder="Enter a message for the recipient..."
            design={args.design}
            value={giftMessage}
            onChange={(val) => setGiftMessage(val)}
            width={12}
          />
        </ConditionalTrigger>

        <ConditionalTrigger
          alias="settlementType"
          triggerType="select"
          inputLabel="Disbursement Instrument"
          design={args.design}
          value={settlementType}
          triggerValue="equity"
          onChange={(val: string) => setSettlementType(val)}
          inputOptions={[
            { optionid: 1, optionvalue: 'fiat', text: 'Wire Transfer (USD)' },
            { optionid: 2, optionvalue: 'equity', text: 'Direct Equity Grant (RSU)' },
          ]}
        >
          <StockInput
            alias="equityTicker"
            inputLabel="Grant Ticker"
            placeholder="MSFT"
            design={args.design}
            value={equityTicker}
            onChange={(val) => setEquityTicker(val)}
            width={6}
          />
          <CurrencyInput
            alias="settlementAmount"
            inputLabel="Grant Value"
            placeholder="25,000.00"
            design={args.design}
            value={settlementAmount}
            onChange={(val) => setSettlementAmount(val)}
            width={6}
          />
        </ConditionalTrigger>

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
          Extract Payload
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
import { Button, ConditionalTrigger, Input, CurrencyInput, StockInput } from "@emeraldemperaur/mito-ui";

export const StandaloneConditionalExample = () => {
  const [wantsGiftWrap, setWantsGiftWrap] = useState<boolean>(false);
  const [settlementType, setSettlementType] = useState<string>("fiat");

  const [giftMessage, setGiftMessage] = useState<string>("");
  const [equityTicker, setEquityTicker] = useState<string>("");
  const [settlementAmount, setSettlementAmount] = useState<string>("");

  const handleExtractValues = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      wantsGiftWrap,
      giftMessage: wantsGiftWrap ? giftMessage : null,
      settlementType,
      equitySettlement: settlementType === "equity"
        ? { ticker: equityTicker, amount: settlementAmount }
        : null,
    };

    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
      <ConditionalTrigger
        alias="giftWrap"
        triggerType="toggle"
        inputLabel="Include Personalized Note?"
        design="outline"
        value={wantsGiftWrap}
        triggerValue={true}
        onChange={(val: boolean) => setWantsGiftWrap(val)}
      >
        <Input
          alias="giftMessage"
          inputLabel="Recipient Note"
          placeholder="Enter a message..."
          value={giftMessage}
          onChange={(val) => setGiftMessage(val)}
        />
      </ConditionalTrigger>

      <ConditionalTrigger
        alias="settlementType"
        triggerType="select"
        inputLabel="Disbursement Instrument"
        design="outline"
        value={settlementType}
        triggerValue="equity"
        onChange={(val: string) => setSettlementType(val)}
        inputOptions={[
          { optionid: 1, optionvalue: "fiat", text: "Wire Transfer (USD)" },
          { optionid: 2, optionvalue: "equity", text: "Direct Equity Grant (RSU)" },
        ]}
      >
        <StockInput
          alias="equityTicker"
          inputLabel="Grant Ticker"
          placeholder="MSFT"
          value={equityTicker}
          onChange={(val) => setEquityTicker(val)}
          width={6}
        />
        <CurrencyInput
          alias="settlementAmount"
          inputLabel="Grant Value"
          placeholder="25,000.00"
          value={settlementAmount}
          onChange={(val) => setSettlementAmount(val)}
          width={6}
        />
      </ConditionalTrigger>

      <Button type="submit" variant="material" backgroundColor="#2563eb" textColor="#ffffff">
        Extract Payload
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
 * Demonstrates seamless zero-boilerplate binding of `ConditionalTrigger` alongside child Mito UI `Input`, `StockInput`, and `CurrencyInput` primitives inside a single `Formik` provider.
 */
export const FormikIntegration: Story = {
  render: (args: ConditionalProps) => {
    return (
      <Formik
        initialValues={{
          allocateEquities: false,
          tickerSymbol: '',
          investmentAmount: '',
          brokerageMemo: '',
        }}
        validationSchema={Yup.object({
          tickerSymbol: Yup.string().when('allocateEquities', {
            is: true,
            then: (schema) => schema.required('Ticker symbol is required.'),
            otherwise: (schema) => schema.notRequired(),
          }),
          investmentAmount: Yup.string().when('allocateEquities', {
            is: true,
            then: (schema) => schema.required('Investment amount is required.'),
            otherwise: (schema) => schema.notRequired(),
          }),
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
                Live Formik Logic State
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
              <ConditionalTrigger
                alias="allocateEquities"
                triggerType="checkbox"
                triggerValue={true}
                inputLabel="Include Public Equity Allocation in Trade Order"
                design={args.design}
              >
                <StockInput
                  alias="tickerSymbol"
                  inputLabel="Stock Symbol"
                  placeholder="AAPL"
                  design={args.design}
                  width={6}
                />
                <CurrencyInput
                  alias="investmentAmount"
                  inputLabel="Order Capital"
                  placeholder="15,000.00"
                  design={args.design}
                  width={6}
                />
                <Input
                  alias="brokerageMemo"
                  inputLabel="Execution Instructions (Optional)"
                  placeholder="Execute at market open..."
                  design={args.design}
                  width={12}
                  newRow
                />
              </ConditionalTrigger>

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
                Evaluate Trade Order
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
import { ConditionalTrigger, StockInput, CurrencyInput, Input } from '@emeraldemepraur/mito-ui';

export const FormikConditionalPipeline = () => {
  return (
    <Formik
      initialValues={{
        allocateEquities: false,
        tickerSymbol: '',
        investmentAmount: '',
        brokerageMemo: '',
      }}
      validationSchema={Yup.object({
        tickerSymbol: Yup.string().when('allocateEquities', {
          is: true,
          then: (schema) => schema.required('Ticker symbol is required.'),
        }),
        investmentAmount: Yup.string().when('allocateEquities', {
          is: true,
          then: (schema) => schema.required('Investment amount is required.'),
        }),
      })}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <ConditionalTrigger
          alias="allocateEquities"
          triggerType="checkbox"
          triggerValue={true}
          inputLabel="Include Public Equity Allocation in Trade Order"
          design="outline"
        >
          <StockInput
            alias="tickerSymbol"
            inputLabel="Stock Symbol"
            placeholder="AAPL"
            width={6}
          />
          <CurrencyInput
            alias="investmentAmount"
            inputLabel="Order Capital"
            placeholder="15,000.00"
            width={6}
          />
          <Input
            alias="brokerageMemo"
            inputLabel="Execution Instructions (Optional)"
            placeholder="Execute at market open..."
            width={12}
            newRow
          />
        </ConditionalTrigger>

        <button type="submit" style={{ marginTop: '24px' }}>Submit</button>
      </Form>
    </Formik>
  );
};`,
      },
    },
  },
};