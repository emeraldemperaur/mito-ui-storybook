import React, { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { SliderInput, type SliderInputProps } from './SliderInput';
import { Row } from '../Layout/Row';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const StatefulSlider = (args: SliderInputProps) => {
  const isRange = args.mode === 'range';
  
  const initialValue = isRange 
    ? (Array.isArray(args.value) ? args.value : [args.minvalue || 0, args.maxvalue || 100])
    : (typeof args.value === 'number' ? args.value : args.minvalue || 0);

  const [val, setVal] = useState<number | number[]>(initialValue);

  return (
    <SliderInput
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
 * Enterprise tactile fader component. Built on Radix primitives to natively support single-integer extraction, dual-handle range extraction, and strict Formik syncing across four complex visual variants.
 */
const meta: Meta<SliderInputProps> = {
  title: 'Inputs/SliderInput',
  component: SliderInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `SliderInput` for capturing continuous numeric data. Set `mode="single"` to extract a specific integer, or `mode="range"` to extract an array tuple `[min, max]`. Perfectly synchronizes with Formik or native React state.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulSlider/g, 'SliderInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          const importStatement = `import { SliderInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl'],
      description: 'The visual rendering and interaction reading direction of the track. Expects `"ltr"` (Left-to-Right) or `"rtl"` (Right-to-Left).',
      table: { 
        category: 'Core & Logic', 
        defaultValue: { summary: 'ltr' },
        type: { summary: "'ltr' | 'rtl'" }
      },
    },
    alias: {
      control: 'text',
      description: 'Required unique identifier mapping the slider to its Formik state and DOM label.',
      table: { category: 'Core & Logic' },
    },
    mode: {
      control: 'radio',
      options: ['single', 'range'],
      description: 'Determines the slider payload and handle count. Expects `"single"` for one numeric integer, or `"range"` for a dual-handle array tuple.',
      table: { 
        category: 'Core & Logic', 
        defaultValue: { summary: 'single' },
        type: { summary: "'single' | 'range'" }
      },
    },
    minvalue: {
      control: 'number',
      description: 'The minimum absolute boundary allowed on the left side of the track.',
      table: { category: 'Core & Logic', defaultValue: { summary: '0' } },
    },
    maxvalue: {
      control: 'number',
      description: 'The maximum absolute boundary allowed on the right side of the track.',
      table: { category: 'Core & Logic', defaultValue: { summary: '100' } },
    },
    stepvalue: {
      control: 'number',
      description: 'The incremental mathematical cadence of the slider. For example, `10` restricts selections to multiples of ten.',
      table: { category: 'Core & Logic', defaultValue: { summary: '1' } },
    },
    minStepsBetweenThumbs: {
      control: 'number',
      description: "Exclusively used in `mode='range'`. Enforces a mathematical gap between the left and right thumbs to prevent collision.",
      table: { category: 'Core & Logic', defaultValue: { summary: '0' } },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered above the slider track, sharing space with the live value counter.',
      table: { category: 'Core & Logic' },
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

    // --- Layout Options ---
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

    // --- Design System & Labels ---
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
    },
    hintUrl: {
      control: 'text',
      description: 'Optional URL to open when the hint tooltip icon is clicked.',
      table: { category: 'Validation & Hints' },
    },
    errorText: {
      control: 'text',
      description: 'Explicit error message string. Overrides Formik validation errors if provided.',
      table: { category: 'Validation & Hints' },
    },

    // --- Theming & Typography ---
    activeColor: { 
      control: 'color', 
      description: 'Highlight color applied to the active range track and the borders of the thumb handles.',
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
      description: 'Standard text color for the label and live numeric readout.',
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
      control: false,
      description: 'External fallback state for standalone non-Formik setups. Expects a single number (e.g., `45`) when mode is `"single"`, or a two-item numeric array (e.g., `[15, 75]`) when mode is `"range"`.',
      table: { 
        category: 'State & Events',
        type: { summary: 'number | number[]' }
      },
    },
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the raw numeric extraction upon thumb release. Automatically intercepts and propagates to Formik if present.',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering nested workflows manually.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'velocityThrottle',
    inputLabel: 'Main Drive Velocity Throttle',
    mode: 'single',
    design: 'outline',
    minvalue: 0,
    maxvalue: 100,
    stepvalue: 1,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Adjusts the max RPM capacity of the primary motor drive.',
  },
  decorators: [withMitoContext],
  render: (args) => <StatefulSlider {...args} />,
};

export default meta;
type Story = StoryObj<SliderInputProps>;

// ---------------------------------------------------------------------------
// CORE DESIGN VARIANTS
// ---------------------------------------------------------------------------

export const Outline: Story = {
  args: {
    design: 'outline',
    inputLabel: 'Outline Track Style',
    activeColor: '#2563eb',
    value: 65,
  },
};

export const Material: Story = {
  args: {
    design: 'material',
    inputLabel: 'Material Solid Fader',
    activeColor: '#10b981',
    value: 40,
  },
  parameters: {
    docs: {
      description: {
        story: 'The `material` variant removes all track borders and uses a solid color block for the thumb handle for a hyper-flat aesthetic.',
      },
    },
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Tactile Inset Slider',
    value: 80,
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Mechanical Audio Fader',
    value: 25,
  },
  parameters: {
    docs: {
      description: {
        story: 'The `skeuomorphic` variant recreates a physical studio mixing console fader using complex layered CSS gradients and deep inset shadows.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION MODES & BEHAVIORS
// ---------------------------------------------------------------------------

export const DualRangeTuple: Story = {
  args: {
    design: 'outline',
    alias: 'sensorProximity',
    inputLabel: 'Allowed Proximity Bounds (meters)',
    mode: 'range',
    minvalue: 5,
    maxvalue: 150,
    stepvalue: 5,
    minStepsBetweenThumbs: 2,
    activeColor: '#8b5cf6',
    value: [35, 95], // Must be an array tuple for 'range' mode
  },
  parameters: {
    docs: {
      description: {
        story: 'When `mode="range"`, the component injects a second thumb handle and strictly binds to a `[number, number]` tuple array state. We enforce a `minStepsBetweenThumbs={2}` to guarantee the bounds never collapse into each other.',
      },
    },
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'thermalLimit',
    inputLabel: 'Safety Thermal Overdrive (°C)',
    isHinted: true,
    hintText: 'Pushing beyond 90°C voids the hardware warranty.',
    errorText: 'Critical Error: Thermal limit exceeds structural tolerance.',
    value: 110,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates `isHinted` tooltip annotations alongside explicit `errorText` validation states (which forces the active track, thumb borders, and live numeric readout into the `--scoped-error` color).',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Clever Standalone Usage (Non-Formik Robotics Dashboard):**
 * `SliderInput` can natively control both single numbers and array tuples concurrently inside standard React states, making it incredibly powerful for hardware telemetry, physics simulations, or complex UI filtering.
 */
export const StandaloneUsage: Story = {
  render: (args: SliderInputProps) => {
    // 1. Maintain native React state variables (Single Number + Tuple Array)
    const [thrustPower, setThrustPower] = useState<number>(45);
    const [lidarBounds, setLidarBounds] = useState<number[]>([15, 75]);

    const handleExtractValues = (e: React.SyntheticEvent) => {
      e.preventDefault();
      
      const payload = {
        directive: "UPDATE_KINEMATICS",
        mainThrusterOutput: `${thrustPower}%`,
        lidarFieldOfView: {
          minAngle: lidarBounds[0],
          maxAngle: lidarBounds[1],
        }
      };

      alert(`Telemetry Payload Dispatched:\n${JSON.stringify(payload, null, 2)}`);
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '440px', fontFamily: 'system-ui, sans-serif' }}>
        
        <div style={{ backgroundColor: thrustPower > 80 ? '#fef2f2' : '#f0fdf4', padding: '16px', borderRadius: '8px', border: `1px solid ${thrustPower > 80 ? '#fecaca' : '#bbf7d0'}`, transition: 'all 0.3s ease' }}>
          <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: thrustPower > 80 ? '#ef4444' : '#16a34a', marginBottom: '8px' }}>
            {thrustPower > 80 ? '⚠️ WARNING: THRUSTER OVERDRIVE' : '✓ THRUSTER SYSTEMS NOMINAL'}
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>LIDAR Arc Sweep: {(lidarBounds[1] || 75) - (lidarBounds[0] || 15)}°</span>
            <span>Total Heat: {((thrustPower * 1.5) + 30).toFixed(0)}°C</span>
          </div>
        </div>

        <SliderInput
          alias="thrustPower"
          inputLabel="Main Thruster Output (%)"
          design={args.design}
          mode="single"
          minvalue={0}
          maxvalue={100}
          stepvalue={1}
          value={thrustPower}
          onChange={(val) => setThrustPower(val as number)} 
          activeColor={thrustPower > 80 ? '#ef4444' : '#2563eb'}
        />

        <SliderInput
          alias="lidarBounds"
          inputLabel="LIDAR Sweep Bounds (Degrees)"
          design={args.design}
          mode="range"
          minvalue={0}
          maxvalue={180}
          stepvalue={5}
          minStepsBetweenThumbs={2} 
          value={lidarBounds}
          onChange={(val) => setLidarBounds(val as number[])} 
          activeColor="#8b5cf6"
        />

        <button
          type="submit"
          style={{
            marginTop: '8px',
            padding: '10px 20px',
            backgroundColor: thrustPower > 80 ? '#ef4444' : '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Push Telemetry Update
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
import { Button, SliderInput } from "@emeraldemperaur/mito-ui";

export const StandaloneUsageDemo = () => {
  // 1. Single Mode State (Number)
  const [thrustPower, setThrustPower] = useState<number>(45);
  
  // 2. Range Mode State (Number Tuple Array)
  const [lidarBounds, setLidarBounds] = useState<number[]>([15, 75]);

  const handleExtractValues = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log({ thrustPower, lidarMin: lidarBounds[0], lidarMax: lidarBounds[1] });
  };

  return (
    <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '440px' }}>
      
      {/* SINGLE MODE */}
      <SliderInput
        alias="thrustPower"
        inputLabel="Main Thruster Output (%)"
        design="outline"
        mode="single"
        minvalue={0}
        maxvalue={100}
        stepvalue={1}
        value={thrustPower}
        onChange={(val) => setThrustPower(val as number)} // Cast as number
        activeColor={thrustPower > 80 ? '#ef4444' : '#2563eb'}
      />

      {/* RANGE MODE */}
      <SliderInput
        alias="lidarBounds"
        inputLabel="LIDAR Sweep Bounds (Degrees)"
        design="outline"
        mode="range"
        minvalue={0}
        maxvalue={180}
        stepvalue={5}
        minStepsBetweenThumbs={2}
        value={lidarBounds}
        onChange={(val) => setLidarBounds(val as number[])} // Cast as number[]
        activeColor="#8b5cf6"
      />

      <Button type="submit">Push Telemetry Update</Button>
    </form>
  );
};`,
      },
    },
  },
};

/**
 * **Interactive Form Pipeline (Formik Context):**
 * Demonstrates seamless zero-boilerplate binding inside a `Formik` provider. Formik natively intercepts both `number` (single mode) and `number[]` (range mode) payloads simultaneously, allowing robust Yup schema enforcement.
 */
export const InteractiveFormTest: Story = {
  render: (args: SliderInputProps) => {
    return (
      <Formik
        initialValues={{
          searchRadius: 25,
          ageDemographic: [18, 35],
        }}
        validationSchema={Yup.object({
          searchRadius: Yup.number()
            .max(50, 'Radius cannot exceed 50 miles for local queries.'),
          ageDemographic: Yup.array()
            .of(Yup.number())
            .min(2)
            .test(
              'legal-adults',
              'Marketing target minimum age is 21.',
              (val) => {
                const minAge = val?.[0];
                return minAge !== undefined && minAge >= 21;
              }
            ),
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
                Live Formik Numeric Payloads
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
                gap: '40px',
              }}
            >
              <SliderInput
                alias="searchRadius"
                inputLabel="Local Search Radius (Miles)"
                mode="single"
                design={args.design}
                minvalue={5}
                maxvalue={100}
                stepvalue={5}
                isHinted={true}
                hintText="Expands your search area from your primary zip code."
              />

              <SliderInput
                alias="ageDemographic"
                inputLabel="Target Age Demographic"
                mode="range"
                design={args.design}
                minvalue={18}
                maxvalue={65}
                stepvalue={1}
                minStepsBetweenThumbs={5} 
                activeColor="#f59e0b"
              />

              <button
                type="submit"
                disabled={formikProps.isSubmitting}
                style={{
                  marginTop: '8px',
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
                Apply Audience Filters
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
import { SliderInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikSliderPipeline = () => {
  return (
    <Formik
      initialValues={{ 
        searchRadius: 25,       // single mode maps to number
        ageDemographic: [18, 35] // range mode maps to tuple array
      }}
      validationSchema={Yup.object({
        searchRadius: Yup.number().max(50, 'Max 50 miles'),
        ageDemographic: Yup.array()
          .of(Yup.number())
          .test('adults', 'Min age is 21', (val) => {
            const minAge = val?.[0];
            return minAge !== undefined && minAge >= 21;
          }),
      })}
      onSubmit={(values) => console.log('Submitted Filters:', values)}
    >
      <Form>
        <Row gap="4">
          <SliderInput
            alias="searchRadius"
            inputLabel="Local Search Radius"
            mode="single"
            design="outline"
            minvalue={5} maxvalue={100} stepvalue={5}
          />
        </Row>
        
        <Row gap="4" style={{ marginTop: '32px' }}>
          <SliderInput
            alias="ageDemographic"
            inputLabel="Target Age Demographic"
            mode="range"
            design="outline"
            minvalue={18} maxvalue={65} stepvalue={1}
            minStepsBetweenThumbs={5}
          />
        </Row>
        
        <button type="submit" style={{ marginTop: '24px' }}>Submit</button>
      </Form>
    </Formik>
  );
};`,
      },
    },
  },
};