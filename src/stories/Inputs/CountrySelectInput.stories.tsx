import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { CountrySelectInput, type CountrySelectProps } from './CountrySelectInput';
import { Row } from '../Layout/Row'; 
import { GlobalUIContext } from '../Layout/GlobalUIContext'; 

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/>
    <path d="M16 6h.01"/>
    <path d="M12 6h.01"/>
    <path d="M12 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 10h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 10h.01"/>
    <path d="M8 14h.01"/>
  </svg>
);

const StatefulCountrySelectInput = (args: CountrySelectProps) => {
  const [val, setVal] = useState<string | string[]>(args.value !== undefined ? args.value : (args.multiselect ? [] : ''));

  return (
    <CountrySelectInput
      {...args}
      value={val}
      onChange={(newVal) => {
        setVal(newVal);
        args.onChange?.(newVal);
      }}
    />
  );
};

/**
 * Enterprise location selection primitive. Leverages `react-phone-number-input` data for comprehensive, 
 * localized country mapping and flag SVG rendering. Replaces native HTML `<select>` with a highly 
 * accessible, floating-label-compatible Radix Popover. Supports single and multi-select operational states.
 */
const meta: Meta<CountrySelectProps> = {
  title: 'Inputs/CountrySelectInput',
  component: CountrySelectInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `CountrySelectInput` to capture standardized international location data. Returns a strict ISO 3166-1 alpha-2 country code string (e.g. `"US"`) in single-select mode, or an array of strings (e.g. `["US", "CA"]`) when `multiselect={true}`.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulCountrySelectInput/g, 'CountrySelectInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<CountrySelectInput)/, '$1')
            .replace(/(<CountrySelectInput[\s\S]*?\/>)\s*\}$/, '$1');
          const importStatement = `import { CountrySelectInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
      description: 'Required unique identifier mapping the input to its Formik state and DOM label.',
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
      table: { category: 'Core & Identity', defaultValue: { summary: 'Select Country...' } },
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

    // --- Configuration & Behaviors ---
    displayFlag: {
      control: 'boolean',
      description: 'Option to render the country flag icon next to the country name.',
      table: { category: 'Configuration', defaultValue: { summary: 'true' } },
    },
    multiselect: {
      control: 'boolean',
      description: 'Option to allow multiple country selections. Changes the output type from `string` to `string[]`.',
      table: { category: 'Configuration', defaultValue: { summary: 'false' } },
    },
    enableSearch: {
      control: 'boolean',
      description: 'Option to enable a search bar inside the popup to filter the country list.',
      table: { category: 'Configuration', defaultValue: { summary: 'false' } },
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
      options: ['None', 'Globe', 'Building'],
      mapping: {
        None: undefined,
        Globe: <GlobeIcon />,
        Building: <BuildingIcon />,
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
      description: 'Yields the raw ISO country code (`string`) or array of codes (`string[]`) based on the `multiselect` prop. Automatically intercepts and propagates to Formik.',
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
    value: {
    control: 'text',
    description: 'External fallback state value for standalone non-Formik setups. Expects a two-letter ISO 3166-1 alpha-2 country code (e.g., "US", "GB"). If a `Formik` provider is present, the component automatically prioritizes the Formik pipeline state mapped via the `alias` key over this prop.',
    table: { 
      category: 'State & Events',
      type: {
        summary: 'string | string[]',
        detail: 'Expects valid two-letter ISO Alpha-2 country code(s).'
      }
    },
  },
  },
  args: {
    alias: 'primaryCountry',
    inputLabel: 'Headquarters Location',
    placeholder: 'Select Country...',
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    displayFlag: true,
    multiselect: false,
    enableSearch: true,
    width: 12,
    isHinted: false,
    hintText: 'Select the primary legal jurisdiction for this entity.',
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
                minHeight: '380px', 
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
  render: (args) => <StatefulCountrySelectInput {...args} />,
};

export default meta;
type Story = StoryObj<CountrySelectProps>;

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
    inputLabel: 'Registration Locale',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Origin Country',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Destination',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION & BEHAVIORS
// ---------------------------------------------------------------------------

export const MultiSelect: Story = {
  args: {
    design: 'outline',
    alias: 'operatingRegions',
    inputLabel: 'Operating Regions',
    multiselect: true,
    enableSearch: true,
    placeholder: 'Select all applicable regions...',
    value: ['US', 'CA', 'GB'],
    activeColor: '#8b5cf6',
  },
  parameters: {
    docs: {
      description: {
        story: 'Setting `multiselect={true}` alters the payload from a strict `string` to a `string[]` array. The popup stays open upon selection to allow rapid multi-picking, and selected items display a trailing checkmark.',
      },
    },
  },
};

export const FloatingLabelWithIcon: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Incorporation Entity',
    enableSearch: true,
    icon: 'Building' as unknown as React.ReactNode,
    iconPosition: 'left',
  },
};

export const DisabledSearchAndFlags: Story = {
  args: {
    design: 'outline',
    inputLabel: 'ISO Alpha-2 Code',
    displayFlag: false,
    enableSearch: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'For leaner UX requirements, the search bar and decorative flag SVG injections can be disabled.',
      },
    },
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'restrictedCountry',
    inputLabel: 'Shipping Destination',
    isHinted: true,
    hintText: 'Embargoed nations are not available for selection.',
    errorText: 'We do not currently offer shipping to this region.',
    value: 'KP',
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
    inputLabel: 'Offshore Holding',
    activeColor: '#60a5fa',
    dropdownTextColor: '#111827',
    darkDropdownTextColor: '#f9fafb',
    dropdownHoverTextColor: '#ffffff',
    darkDropdownHoverTextColor: '#ffffff',
    icon: 'Globe' as unknown as React.ReactNode,
    iconPosition: 'left',
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Native React State (No Formik):**
 * When rendering outside a Formik context, the component functions as a standard controlled React input. 
 * Use `onChange` to capture the ISO code. If `multiselect` is true, it yields an array of codes.
 */
export const StandaloneUsage: Story = {
  render: (args) => {
    const [primaryCountry, setPrimaryCountry] = useState<string>("");
    const [operatingCountries, setOperatingCountries] = useState<string[]>([]);

    const handleExtractValues = (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
        headquarters: primaryCountry,
        operations: operatingCountries,
      };
      alert(JSON.stringify(payload, null, 2));
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '400px', fontFamily: 'system-ui, sans-serif' }}>
        
        <CountrySelectInput
          alias="primaryCountry"
          inputLabel="Headquarters Location"
          design={args.design}
          enableSearch={true}
          value={primaryCountry}
          onChange={(val) => setPrimaryCountry(val as string)}
        />

        <CountrySelectInput
          alias="operatingCountries"
          inputLabel="Operating Regions"
          design={args.design}
          multiselect={true}
          enableSearch={true}
          value={operatingCountries}
          onChange={(val) => setOperatingCountries(val as string[])}
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
        code: `"use client";

import React, { useState } from "react";
import { Button } from "@emeraldemperaur/mito-ui";
import { CountrySelectInput } from "@emeraldemperaur/mito-ui/CountrySelectInput";

export const StandaloneCountrySelectExample = () => {
  // 1. Initialize standard React state for single selection (string)
  const [primaryCountry, setPrimaryCountry] = useState<string>("");
  
  // 2. Initialize standard React state for multiple selections (string array)
  const [operatingCountries, setOperatingCountries] = useState<string[]>([]);

  const handleExtractValues = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      headquarters: primaryCountry,
      operations: operatingCountries,
    };

    console.log("Extracted Standalone Payload:", payload);
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <form 
      onSubmit={handleExtractValues} 
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}
    >
      {/* Single Select: Emits a standard string (e.g., "US", "CA") */}
      <CountrySelectInput
        alias="primaryCountry"
        inputLabel="Headquarters Location"
        design="outline"
        enableSearch={true}
        value={primaryCountry}
        onChange={(val) => setPrimaryCountry(val as string)}
      />

      {/* Multi-Select: Emits an array of strings (e.g., ["US", "CA", "GB"]) */}
      <CountrySelectInput
        alias="operatingCountries"
        inputLabel="Operating Regions"
        design="outline"
        multiselect={true}
        enableSearch={true}
        value={operatingCountries}
        onChange={(val) => setOperatingCountries(val as string[])}
      />

      <Button type="submit" variant="material" backgroundColor="#2563eb" textColor="#ffffff">
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
 * Demonstrates the seamless binding of `CountrySelectInput` inside a `Formik` context. 
 * Formik captures the ISO Alpha-2 string directly into the global validation state.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          incorporationCountry: '',
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          
          if (!values.incorporationCountry) {
            errors.incorporationCountry = 'A jurisdiction must be selected.';
          } else if (values.incorporationCountry === 'KP' || values.incorporationCountry === 'IR') {
            errors.incorporationCountry = 'We cannot process entities in restricted jurisdictions.';
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
                Live Formik Jurisdiction State
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
                <CountrySelectInput
                  alias="incorporationCountry"
                  inputLabel="Incorporation Jurisdiction"
                  icon={<GlobeIcon />}
                  enableSearch={true}
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
                Validate Identity
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
import { CountrySelectInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikJurisdictionPipeline = () => {
  return (
    <Formik
      initialValues={{ incorporationCountry: '' }}
      validate={(values) => {
        const errors: Record<string, any> = {};
        if (!values.incorporationCountry) {
          errors.incorporationCountry = 'Required.';
        } else if (values.incorporationCountry === 'KP') {
          errors.incorporationCountry = 'Restricted jurisdiction.';
        }
        return errors;
      }}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <Row gap="4">
          <CountrySelectInput 
            alias="incorporationCountry" 
            inputLabel="Incorporation Jurisdiction" 
            enableSearch={true}
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