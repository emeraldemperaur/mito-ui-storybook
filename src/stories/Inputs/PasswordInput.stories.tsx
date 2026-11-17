import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { PasswordInput, type PasswordInputProps } from './PasswordInput';
import { Row } from '../Layout/Row'; 
import { GlobalUIContext } from '../Layout/GlobalUIContext'; 

const StatefulPasswordInput = (args: PasswordInputProps) => {
  const [val, setVal] = useState<string>(args.value !== undefined ? String(args.value) : '');

  return (
    <PasswordInput
      {...args}
      value={val}
      onChange={(e) => {
        setVal(e.target.value);
        args.onChange?.(e);
      }}
    />
  );
};

/**
 * Enterprise credential input primitive. Extends native HTML `<input type="password">` with an 
 * integrated, accessible show/hide visibility toggle, locked leading icon, and ambient 
 * background-matching 3D motifs. Automatically binds to Formik validation state.
 */
const meta: Meta<PasswordInputProps> = {
  title: 'Inputs/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `PasswordInput` specifically for secure credential entry. The component hardcodes the leading lock icon and trailing visibility toggle to ensure strict UX consistency across the application. Agents and developers must supply a unique `alias` prop to bind DOM labels, ARIA attributes, and Formik state keys.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulPasswordInput/g, 'PasswordInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<PasswordInput)/, '$1')
            .replace(/(<PasswordInput[\s\S]*?\/>)\s*\}$/, '$1');
          const importStatement = `import { PasswordInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
      description: 'Required unique identifier mapping the input to its Formik field path and accessible `<label>`.',
      table: { category: 'Core & Identity' },
    },
    inputLabel: {
      control: 'text',
      description: 'Label text rendered statically above the field or animated inside the border.',
      table: { category: 'Core & Identity' },
    },
    placeholder: {
      control: 'text',
      description: 'Hint text displayed inside the input when empty.',
      table: { category: 'Core & Identity', defaultValue: { summary: '••••••••' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents user modification while keeping the field focusable and submittable.',
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
      description: 'Forces the component into dark mode, overriding system contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
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
      description: 'Callback fired when the input value changes. Automatically intercepts and propagates to the Formik state tree if `alias` is bound within a context.',
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
    alias: 'securePassword',
    inputLabel: 'Account Password',
    placeholder: '••••••••',
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Must be at least 12 characters.',
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
  render: (args) => <StatefulPasswordInput {...args} />,
};

export default meta;
type Story = StoryObj<PasswordInputProps>;

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
    inputLabel: 'Current Password',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'New Passphrase',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Encryption Key',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION & BEHAVIORS
// ---------------------------------------------------------------------------

export const FloatingLabel: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Root Administrator Password',
    placeholder: 'Enter secure key',
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'newPassword',
    inputLabel: 'Confirm Password',
    isHinted: true,
    hintText: 'Must match the new password entered above exactly.',
    errorText: 'Passwords do not match.',
    value: 'invalid123',
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
    inputLabel: 'Secure Key',
    activeColor: '#60a5fa',
  },
};

// ---------------------------------------------------------------------------
// FORMIK INTEGRATION
// ---------------------------------------------------------------------------

/**
 * **Interactive Form Pipeline:**
 * Demonstrates the seamless binding of `PasswordInput` inside a `Formik` context. 
 * Formik automatically synchronizes `values`, `touched`, and `errors` directly 
 * via the `alias` mapping.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          if (!values.password) {
            errors.password = 'Password is required.';
          } else if (values.password.length < 8) {
            errors.password = 'Must be at least 8 characters.';
          }
          if (values.confirmPassword !== values.password) {
            errors.confirmPassword = 'Passwords must match.';
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
              <span style={{ color: '#fcd34d', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Credential State
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
                <PasswordInput
                  alias="password"
                  inputLabel="New Password"
                  design={args.design}
                  width={12}
                />
                <PasswordInput
                  alias="confirmPassword"
                  inputLabel="Confirm Password"
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
                Update Credentials
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
import { PasswordInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikCredentialPipeline = () => {
  return (
    <Formik
      initialValues={{ password: '', confirmPassword: '' }}
      validate={(values) => {
        const errors: Record<string, any> = {};
        
        if (!values.password) {
          errors.password = 'Password is required.';
        } else if (values.password.length < 8) {
          errors.password = 'Must be at least 8 characters.';
        }
        
        if (values.confirmPassword !== values.password) {
          errors.confirmPassword = 'Passwords must match.';
        }
        
        return errors;
      }}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <Row gap="4">
          <PasswordInput alias="password" inputLabel="New Password" width={12} />
          <PasswordInput alias="confirmPassword" inputLabel="Confirm Password" width={12} newRow />
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