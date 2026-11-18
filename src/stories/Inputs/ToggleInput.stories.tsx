import React, { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ToggleInput, type ToggleProps } from './ToggleInput';
import { Row } from '../Layout/Row';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const StatefulToggle = (args: ToggleProps) => {
  const [val, setVal] = useState<boolean>(args.value || false);

  return (
    <ToggleInput
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
            minHeight: '200px',
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
 * Enterprise boolean toggle primitive. Integrates Radix UI's accessible Toggle state with Formik bindings.
 * Supports standard button toggles (Outline/Material) and complex sliding tracks (Neumorphic).
 */
const meta: Meta<ToggleProps> = {
  title: 'Inputs/ToggleInput',
  component: ToggleInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `ToggleInput` to capture boolean (`true`/`false`) states. The component routes intelligently between traditional push-button states and tactile sliders depending on the injected `design` prop.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulToggle/g, 'ToggleInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          const importStatement = `import { ToggleInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
      description: 'Required unique identifier mapping the toggle to its Formik state and DOM label.',
      table: { category: 'Core & Logic' },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered inside the button (for Outline/Material) or alongside the track (for Neumorphic).',
      table: { category: 'Core & Logic' },
    },
    floatingLabel: {
      control: 'boolean',
      description: 'Toggles the interactive floating label animation (primarily used with Neumorphic).',
      table: { category: 'Core & Logic', defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Locks the component to prevent user interaction, dropping opacity slightly.',
      table: { category: 'Core & Logic', defaultValue: { summary: 'false' } },
    },
    asChild: {
      control: 'boolean',
      description: 'If true, merges component DOM into the immediate child via Radix Slot.',
      table: { category: 'Core & Logic', defaultValue: { summary: 'false' } },
    },

    // --- Design System & Layout ---
    design: {
      control: 'radio',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'Core architectural design variant. Expects `"outline"`, `"material"`, `"neumorphic"`, or `"skeuomorphic"`.',
      table: { 
        category: 'Design System', 
        defaultValue: { summary: 'outline' },
        type: { summary: "'outline' | 'material' | 'neumorphic' | 'skeuomorphic'" }
      },
    },
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
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system or parent theme contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Opacity multiplier for Neumorphic drop shadows to ensure WCAG contrast across custom parent backgrounds.',
      table: { category: 'Design System', defaultValue: { summary: '1' } },
    },

    // --- Icons ---
    icon: {
      control: 'text',
      description: 'String name of the Mito UI icon to render inside the button or next to the slider.',
      table: { category: 'Icons', defaultValue: { summary: 'layers' } },
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Determines if the icon is placed on the left (leading) or right (trailing) of the label.',
      table: { 
        category: 'Icons', 
        defaultValue: { summary: 'left' },
        type: { summary: "'left' | 'right'" }
      },
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

    // --- Theming & Typography ---
    activeColor: { 
      control: 'color', 
      description: 'Highlight color applied to the active state background or icon.',
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
      description: 'Standard text color for the label.',
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
    darkModeColors: {
      control: 'object',
      description: 'Legacy color override object. Prefer `activeColor` for standard implementations.',
      table: { category: 'Theming' }
    },
    fontFamily: { 
      control: 'text', 
      description: 'Font family override to match specific UI brand primitives.',
      table: { category: 'Typography' } 
    },

    // --- State & Events ---
    value: {
      control: 'boolean',
      description: 'External fallback boolean state for standalone non-Formik setups.',
      table: { category: 'State & Events' },
    },
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the boolean payload upon interaction. Automatically intercepts and propagates to Formik if present.',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering nested workflows manually.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'enableEncryption',
    inputLabel: 'Enable E2E Encryption',
    design: 'outline',
    icon: 'lockclosed',
    iconPosition: 'left',
    value: false,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Encrypts payloads using AES-256 before transmission.',
  },
  decorators: [withMitoContext],
  render: (args) => <StatefulToggle {...args} />,
};

export default meta;
type Story = StoryObj<ToggleProps>;

// ---------------------------------------------------------------------------
// CORE DESIGN VARIANTS
// ---------------------------------------------------------------------------

export const Outline: Story = {
  args: {
    design: 'outline',
    inputLabel: 'Outline Toggle',
    icon: 'layers',
    activeColor: '#2563eb',
    value: true,
  },
};

export const Material: Story = {
  args: {
    design: 'material',
    inputLabel: 'Material Solid Toggle',
    icon: 'check',
    activeColor: '#10b981',
    value: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'The `material` variant uses a solid color block for the active state with a sharp elevation drop shadow.',
      },
    },
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Tactile Inset Slider',
    icon: 'infocircled',
    value: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The `neumorphic` variant switches from a push-button to a Vanguard animated sliding track. It utilizes complex inset shadows to blend into the ambient background.',
      },
    },
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Mechanical Control Bay',
    icon: 'settings',
    value: false,
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION MODES & BEHAVIORS
// ---------------------------------------------------------------------------

export const ValidationAndTooltips: Story = {
  args: {
    design: 'neumorphic',
    alias: 'forceOverride',
    inputLabel: 'Force System Override',
    icon: 'infocircled',
    isHinted: true,
    hintText: 'Bypasses all safety protocols. Use with extreme caution.',
    errorText: 'Critical Error: Administrator privileges required for override.',
    value: false,
    backgroundColor: '#e0e5ec',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates `isHinted` tooltip annotations alongside explicit `errorText` validation states (which forces the track and slider into the `--scoped-error` color scheme).',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Clever Standalone Usage (Non-Formik Aviation/Robotics Control Board):**
 * `ToggleInput` can be deeply integrated with native React state to orchestrate complex physical systems or UX logic.
 * Here, we use the `neumorphic` track design to control an autonomous UAV (Unmanned Aerial Vehicle).
 */
export const StandaloneUsage: Story = {
  render: (_args: ToggleProps) => {
    // 1. Maintain native React state variables for UAV subsystems
    const [autopilot, setAutopilot] = useState<boolean>(true);
    const [thermalImaging, setThermalImaging] = useState<boolean>(false);
    const [stealthMode, setStealthMode] = useState<boolean>(false);

    const handleExtractValues = (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload = {
        directive: "UPDATE_SUBSYSTEMS",
        timestamp: new Date().toISOString(),
        telemetry: {
          autopilotEngaged: autopilot,
          thermalActive: thermalImaging,
          stealthActive: stealthMode,
        }
      };

      alert(`Aviation Subsystems Dispatched:\n${JSON.stringify(payload, null, 2)}`);
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '440px', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Dynamic Telemetry HUD */}
        <div style={{ backgroundColor: stealthMode ? '#1e293b' : '#f8fafc', padding: '16px', borderRadius: '8px', border: `1px solid ${stealthMode ? '#334155' : '#e2e8f0'}`, transition: 'all 0.4s ease' }}>
          <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: stealthMode ? '#38bdf8' : '#334155', marginBottom: '12px' }}>
            UAV STATUS: {stealthMode ? 'GHOST PROTOCOL' : 'STANDARD FLIGHT'}
          </span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!autopilot && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, padding: '4px 8px', backgroundColor: '#fef2f2', borderRadius: '4px', border: '1px solid #fecaca' }}>
                ⚠️ WARNING: MANUAL PILOT REQUIRED
              </span>
            )}
            {thermalImaging && (
              <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, padding: '4px 8px', backgroundColor: '#fffbeb', borderRadius: '4px', border: '1px solid #fde68a' }}>
                ☼ FLIR THERMAL SENSORS ONLINE
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ToggleInput
            alias="autopilot"
            inputLabel="Primary Autopilot Logic"
            design="neumorphic"
            icon="rocket"
            value={autopilot}
            onChange={(val) => setAutopilot(val)}
            activeColor={!autopilot ? '#ef4444' : '#10b981'}
          />

          <ToggleInput
            alias="thermalImaging"
            inputLabel="Forward-Looking Infrared (FLIR)"
            design="neumorphic"
            icon="camera"
            value={thermalImaging}
            onChange={(val) => setThermalImaging(val)}
            activeColor="#f59e0b"
          />

          <ToggleInput
            alias="stealthMode"
            inputLabel="Radar Signature Dampening"
            design="neumorphic"
            icon="eyeclosed"
            value={stealthMode}
            onChange={(val) => setStealthMode(val)}
            activeColor="#38bdf8"
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: '8px',
            padding: '12px 20px',
            backgroundColor: stealthMode ? '#38bdf8' : '#0f172a',
            color: stealthMode ? '#0f172a' : '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Push Telemetry Override
        </button>
      </form>
    );
  },
  args: {
    design: 'neumorphic',
  },
  parameters: {
    useRow: false,
    docs: {
      source: {
        code: `import React, { useState } from "react";
import { Button, ToggleInput } from "@emeraldemperaur/mito-ui";

export const UAVRoboticsDashboard = () => {
  // 1. Maintain native boolean states for flight subsystems
  const [autopilot, setAutopilot] = useState<boolean>(true);
  const [thermalImaging, setThermalImaging] = useState<boolean>(false);
  const [stealthMode, setStealthMode] = useState<boolean>(false);

  const handleExtractValues = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ autopilot, thermalImaging, stealthMode });
  };

  return (
    <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '440px' }}>
      
      {/* UAV Dynamic HUD */}
      <div style={{ color: stealthMode ? 'cyan' : 'black', padding: '16px', border: '1px solid gray' }}>
        UAV STATUS: {stealthMode ? 'GHOST PROTOCOL' : 'STANDARD FLIGHT'}
        {!autopilot && <div style={{ color: 'red' }}>⚠️ MANUAL PILOT REQUIRED</div>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ToggleInput
          alias="autopilot"
          inputLabel="Primary Autopilot Logic"
          design="neumorphic"
          icon="rocket"
          value={autopilot}
          onChange={(val) => setAutopilot(val)}
        />

        <ToggleInput
          alias="thermalImaging"
          inputLabel="Forward-Looking Infrared (FLIR)"
          design="neumorphic"
          icon="camera"
          value={thermalImaging}
          onChange={(val) => setThermalImaging(val)}
        />

        <ToggleInput
          alias="stealthMode"
          inputLabel="Radar Signature Dampening"
          design="neumorphic"
          icon="eye-off"
          value={stealthMode}
          onChange={(val) => setStealthMode(val)}
        />
      </div>

      <Button type="submit">Push Telemetry Override</Button>
    </form>
  );
};`,
      },
    },
  },
};

/**
 * **Interactive Form Pipeline (Formik Context):**
 * Demonstrates seamless zero-boilerplate binding inside a `Formik` provider. Formik natively intercepts the boolean payload, allowing robust Yup schema enforcement.
 */
export const InteractiveFormTest: Story = {
  render: (args: ToggleProps) => {
    return (
      <Formik
        initialValues={{
          termsAccepted: false,
          marketingOptIn: true,
        }}
        validationSchema={Yup.object({
          termsAccepted: Yup.boolean()
            .oneOf([true], 'You must accept the Terms of Service to proceed.'),
        })}
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
                Live Formik Boolean Payloads
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
                padding: '32px 24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <ToggleInput
                alias="termsAccepted"
                inputLabel="I accept the Master Service Agreement"
                design={args.design}
                icon='filetext'
              />

              <ToggleInput
                alias="marketingOptIn"
                inputLabel="Subscribe to Security Advisories"
                design={args.design}
                icon="envelopeopen"
                activeColor="#10b981"
              />

              <button
                type="submit"
                disabled={formikProps.isSubmitting}
                style={{
                  marginTop: '16px',
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
                Provision Account
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
import { ToggleInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikTogglePipeline = () => {
  return (
    <Formik
      initialValues={{ termsAccepted: false, marketingOptIn: true }}
      validationSchema={Yup.object({
        termsAccepted: Yup.boolean().oneOf([true], 'Must accept terms.'),
      })}
      onSubmit={(values) => console.log('Submitted Payload:', values)}
    >
      <Form>
        <Row gap="4">
          <ToggleInput
            alias="termsAccepted"
            inputLabel="I accept the Master Service Agreement"
            design="outline"
            icon="file-text"
          />
        </Row>
        
        <Row gap="4" style={{ marginTop: '16px' }}>
          <ToggleInput
            alias="marketingOptIn"
            inputLabel="Subscribe to Security Advisories"
            design="outline"
            icon="mail"
          />
        </Row>
        
        <button type="submit" style={{ marginTop: '24px' }}>Provision Account</button>
      </Form>
    </Formik>
  );
};`,
      },
    },
  },
};