import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { Input, type InputProps } from './Input';
import { Row } from '../Layout/Row';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const StatefulInput = (args: InputProps) => {
  const [val, setVal] = useState<string>(args.value !== undefined ? String(args.value) : '');

  return (
    <Input
      {...args}
      value={val}
      onChange={(newVal: string) => {
        setVal(newVal);
        args.onChange?.(newVal);
      }}
    />
  );
};

/**
 * Enterprise text input primitive. Wraps native HTML `<input>` capabilities inside a 12-column grid 
 * track (`Column`) with automated Formik binding, ambient background-matching 3D motifs, floating labels, 
 * and accessible error/tooltip annotations.
 */
const meta: Meta<InputProps> = {
  title: 'Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Agents and developers must supply a unique `alias` prop to bind DOM labels, ARIA attributes, and Formik state keys. Utilize the `design` prop to pivot seamlessly between `outline`, `material`, `neumorphic`, and `skeuomorphic` surfaces without altering form logic.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulInput/g, 'Input');
          
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<Input)/, '$1')
            .replace(/(<Input[\s\S]*?\/>)\s*\}$/, '$1');
            
          const importStatement = `import { Input } from '@emeraldemepraur/mito-ui';\n\n`;
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
    // --- Core Identity & Input Attributes ---
    alias: {
      control: 'text',
      description: 'Required unique identifier mapping the input to its Formik field path, HTML `name`, and accessible `<label>`.',
      table: { category: 'Core & Identity' },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'url', 'search', 'password', 'number'],
      description: 'Standard HTML input type governing browser keyboard and validation hints.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'text' } },
    },
    inputLabel: {
      control: 'text',
      description: 'Label text rendered statically above the field or animated inside the border when `floatingLabel` is enabled.',
      table: { category: 'Core & Identity' },
    },
    placeholder: {
      control: 'text',
      description: 'Hint text displayed inside the input when empty (hidden until focus when `floatingLabel` is active).',
      table: { category: 'Core & Identity' },
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
      description: 'Forces the component into dark mode, overriding system or parent theme contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },

    // --- Icons ---
    icon: {
      control: 'select',
      options: ['None', 'Mail', 'Search', 'Lock', 'CheckCircle'],
      mapping: {
        None: undefined,
        Mail: <MailIcon />,
        Search: <SearchIcon />,
        Lock: <LockIcon />,
        CheckCircle: <CheckCircleIcon />,
      },
      description: 'Optional leading or trailing icon node rendered inside the input track.',
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
      description: 'Explicit error message string. Overrides Formik validation errors when provided.',
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
      description: 'Grid column span width within a 12-column `Row` container (1 to 12).',
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
    asChild: {
      control: 'boolean',
      description: 'Delegates input rendering to the immediate child element via Radix Slot.',
      table: { category: 'Layout' },
    },

    // --- Theming & Typography ---
    activeColor: {
      control: 'color',
      description: 'Focus ring, active border, and floating label highlight color.',
      table: { category: 'Theming' },
    },
    backgroundColor: {
      control: 'color',
      description: 'Surface background color in light mode (also seeds 3D shadow calculation).',
      table: { category: 'Theming' },
    },
    darkBackgroundColor: {
      control: 'color',
      description: 'Surface background color in dark mode.',
      table: { category: 'Theming' },
    },
    textColor: {
      control: 'color',
      description: 'Input value and static label text color in light mode.',
      table: { category: 'Theming' },
    },
    darkTextColor: {
      control: 'color',
      description: 'Input value and static label text color in dark mode.',
      table: { category: 'Theming' },
    },
    errorTextColor: {
      control: 'color',
      description: 'Error message and invalid border highlight color in light mode.',
      table: { category: 'Theming' },
    },
    darkErrorTextColor: {
      control: 'color',
      description: 'Error message and invalid border highlight color in dark mode.',
      table: { category: 'Theming' },
    },
    fontFamily: {
      control: 'text',
      description: 'Custom font family override.',
      table: { category: 'Typography' },
    },

    // --- Formik & Events ---
    formikContext: {
      control: false,
      description: 'Explicit Formik context object injected when rendering outside a standard Formik provider.',
      table: { category: 'State & Events' },
    },
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Callback fired when the input value changes. Automatically intercepts and propagates to the Formik state tree if `alias` is bound within a context.',
      table: { category: 'State & Events' } 
    },
    onFocus: { 
      action: 'onFocus', 
      control: false, 
      description: 'Callback fired when the input receives focus. Triggers the floating label animation and applies the `activeColor` to borders and icons.',
      table: { category: 'State & Events' } 
    },
    onBlur: { 
      action: 'onBlur', 
      control: false, 
      description: 'Callback fired when the input loses focus. Automatically triggers Formik field validation (setting it to `touched`) and resets floating labels if the field is empty.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'workEmail',
    type: 'email',
    inputLabel: 'Work Email',
    placeholder: 'name@enterprise.com',
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    icon: 'Mail' as unknown as React.ReactNode,
    iconPosition: 'left',
    isHinted: false,
    hintText: 'Use your primary corporate domain email address.',
    width: 12,
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
  render: (args) => <StatefulInput {...args} />,
};

export default meta;
type Story = StoryObj<InputProps>;

// ---------------------------------------------------------------------------
// CORE DESIGN VARIANTS
// ---------------------------------------------------------------------------

export const Outline: Story = {
  args: {
    design: 'outline',
    activeColor: '#2563eb',
  },
};

export const FloatingLabelOutline: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Workspace Subdomain',
    placeholder: 'acme-corp',
    icon: 'Search' as unknown as React.ReactNode,
    iconPosition: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Combines the `outline` motif with `floatingLabel={true}`. Click into the field or enter text to observe the label smoothly transition onto the top border.',
      },
    },
  },
};

export const Material: Story = {
  args: {
    design: 'material',
    inputLabel: 'Project Identifier',
    placeholder: 'PRJ-2026-ALPHA',
    activeColor: '#800020',
    icon: 'CheckCircle' as unknown as React.ReactNode,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimalist bottom-bordered layout featuring an animated focus gradient and trailing status icon.',
      },
    },
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'API Access Secret',
    type: 'password',
    placeholder: '••••••••••••••••',
    icon: 'Lock' as unknown as React.ReactNode,
    iconPosition: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Recessed soft-UI channel calculated dynamically from the parent environment background (`#e0e5ec`).',
      },
    },
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Master Encryption Key',
    placeholder: 'Enter 256-bit hex key',
    icon: 'Lock' as unknown as React.ReactNode,
    type: 'password'
  },
  parameters: {
    docs: {
      description: {
        story: 'Tactile recessed mechanical well with top-lit bevel highlights and inner depth shadows.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// STATES, ANNOTATIONS & DARK MODE
// ---------------------------------------------------------------------------

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'billingEmail',
    inputLabel: 'Billing Contact Email',
    isHinted: true,
    hintText: 'Invoices and automated receipts are dispatched to this address.',
    hintUrl: 'https://example.com/docs/billing',
    errorText: 'Please enter a valid corporate email address.',
    value: 'invalid-email@',
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
    inputLabel: 'Security Token',
    placeholder: 'tok_live_98a7sd6f87a6sd',
    activeColor: '#60a5fa',
    icon: 'Lock' as unknown as React.ReactNode,
    type: 'text'
  },
  parameters: {
    docs: {
      description: {
        story: 'Forces the input into dark mode (`darkMode={true}`), automatically adapting surface backgrounds, borders, and floating label cutouts.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// FORMIK INTEGRATION
// ---------------------------------------------------------------------------

/**
 * **Interactive Form Pipeline:**
 * Showcases automatic Formik context binding via `alias`. When rendered inside a `<Formik>` tree 
 * (or passed `formikContext` explicitly), `Input` automatically synchronizes `values`, `touched`, 
 * and `errors` using `getIn(context, alias)`—including nested dot-notation paths like `profile.email`.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          profile: {
            fullName: '',
            email: '',
          },
          apiKey: '',
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          if (!values.profile.fullName) {
            errors.profile = { ...errors.profile, fullName: 'Full name is required.' };
          }
          if (!values.profile.email) {
            errors.profile = { ...errors.profile, email: 'Work email is required.' };
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.profile.email)) {
            errors.profile = { ...errors.profile, email: 'Invalid email address format.' };
          }
          if (!values.apiKey || values.apiKey.length < 8) {
            errors.apiKey = 'API key must be at least 8 characters.';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          alert(`Form Submitted Successfully:\n${JSON.stringify(values, null, 2)}`);
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
              <span style={{ color: '#fb7185', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Formik State & Validation Errors
              </span>
              <pre style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#93c5fd', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify({ values: formikProps.values, errors: formikProps.errors, touched: formikProps.touched }, null, 2)}
              </pre>
            </div>

            {/* Enterprise Card Wrapper */}
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
                <Input
                  alias="profile.fullName"
                  inputLabel="Full Name"
                  placeholder="Jane Doe"
                  design={args.design}
                  width={6}
                />
                <Input
                  alias="profile.email"
                  type="email"
                  inputLabel="Work Email"
                  placeholder="jane@enterprise.com"
                  icon={<MailIcon />}
                  design={args.design}
                  width={6}
                />
                <Input
                  alias="apiKey"
                  type="password"
                  inputLabel="Webhook Signing Secret"
                  placeholder="whsec_••••••••••••"
                  icon={<LockIcon />}
                  isHinted
                  hintText="Minimum 8 characters required for HMAC signature verification."
                  design={args.design}
                  width={12}
                  newRow
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
import { Input, Row } from '@emeraldemepraur/mito-ui';

export const FormikInputPipeline = () => {
  return (
    <Formik
      initialValues={{ profile: { fullName: '', email: '' }, apiKey: '' }}
      validate={(values) => {
        const errors: Record<string, any> = {};
        
        if (!values.profile.fullName) {
          errors.profile = { ...errors.profile, fullName: 'Full name is required.' };
        }
        
        if (!values.profile.email) {
          errors.profile = { ...errors.profile, email: 'Work email is required.' };
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test(values.profile.email)) {
          errors.profile = { ...errors.profile, email: 'Invalid email address format.' };
        }
        
        if (!values.apiKey || values.apiKey.length < 8) {
          errors.apiKey = 'API key must be at least 8 characters.';
        }
        
        return errors;
      }}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <Row gap="4">
          <Input alias="profile.fullName" inputLabel="Full Name" width={6} />
          <Input alias="profile.email" type="email" inputLabel="Work Email" width={6} />
          <Input alias="apiKey" type="password" inputLabel="Webhook Secret" width={12} newRow />
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