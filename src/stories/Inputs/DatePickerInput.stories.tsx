import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { DatePickerInput, type DatePickerInputProps } from './DatePickerInput';
import { Row } from '../Layout/Row'; 
import { GlobalUIContext } from '../Layout/GlobalUIContext'; 

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PlaneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6.5 4.5-3.5 3.5-3.1-.9c-.3-.1-.7.1-.8.4l-.6.6 3 2.1 2.1 3 .6-.6.4-.8-.9-3.1 3.5-3.5 4.5 6.5 1.2-.7.6-1.1c.4-.2.7-.6.6-1.1z" />
  </svg>
);

const StatefulDatePickerInput = (args: DatePickerInputProps) => {
  const [val, setVal] = useState<any>(args.value || (args.mode === 'daterange' ? { from: null, to: null } : null));

  return (
    <DatePickerInput
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
 * Enterprise date and time selection primitive. Wraps `react-datepicker` with a custom Radix-style input trigger 
 * to ensure exact visual parity across the application. Routes cleanly between standard Dates, DateTimes, 
 * and structural Ranges based on the provided `mode`.
 */
const meta: Meta<DatePickerInputProps> = {
  title: 'Inputs/DatePickerInput',
  component: DatePickerInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `DatePickerInput` for robust temporal data entry. Automatically intercepts Formik context. The component seamlessly shifts its payload return type (`Date` object vs `{ from: Date, to: Date }` objects) based on the `mode` parameter.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulDatePickerInput/g, 'DatePickerInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<DatePickerInput)/, '$1')
            .replace(/(<DatePickerInput[\s\S]*?\/>)\s*\}$/, '$1');
          const importStatement = `import { DatePickerInput } from '@emeraldemepraur/mito-ui';\n\n`;
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
    // --- Core Identity & Mode ---
    alias: {
      control: 'text',
      description: 'Required unique identifier mapping the input to its Formik state and DOM label.',
      table: { category: 'Core & Identity' },
    },
    mode: {
      control: 'select',
      options: ['date', 'datetime', 'daterange'],
      description: 'Structural mode altering the popover UI and standard data payload. `daterange` yields a `{from, to}` object.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'date' } },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered statically above the field or animated inside the border.',
      table: { category: 'Core & Identity' },
    },
    placeholder: {
      control: 'text',
      description: 'Hint text displayed inside the trigger field when no date is selected.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'Select date' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Locks the component to prevent calendar changes, while preserving the current value and rendering a disabled visual state.',
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
      description: 'Forces the component into dark mode, overriding system or parent theme contexts. Styles automatically cascade into the portal popup.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },

    // --- Icons ---
    icon: {
      control: 'select',
      options: ['None', 'Calendar', 'Clock', 'Plane'],
      mapping: {
        None: undefined,
        Calendar: <CalendarIcon />,
        Clock: <ClockIcon />,
        Plane: <PlaneIcon />,
      },
      description: 'Optional secondary icon node. If omitted, it falls back to a default calendar or clock icon based on the mode.',
      table: { category: 'Icons' },
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Determines icon placement within the trigger field.',
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
      description: 'Highlight color applied to the active/focused border, selected calendar days, and range extents.',
      table: { category: 'Theming' } 
    },
    backgroundColor: { 
      control: 'color', 
      description: 'Dynamic base background color for light mode. Colors the trigger and the calendar popover surface.',
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

    // --- State & Events ---
    value: {
      control: false,
      description: 'External fallback state value for standalone non-Formik setups. If a `Formik` provider is present, it prioritizes the state mapped via the `alias` key.',
      table: { 
        category: 'State & Events',
        type: {
          summary: 'Date | { from: Date, to: Date } | null',
          detail: 'Requires a standard JavaScript Date object (for "date" and "datetime" modes) or an object with "from" and "to" properties containing Dates (for "daterange" mode).'
        }
      },
    },
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the JavaScript Date object (or range object payload) upon selection. Automatically intercepts and propagates to Formik.',
      table: { category: 'State & Events' } 
    },
    onFocus: { 
      action: 'onFocus', 
      control: false, 
      description: 'Callback fired when the input receives focus.',
      table: { category: 'State & Events' } 
    },
    onBlur: { 
      action: 'onBlur', 
      control: false, 
      description: 'Callback fired when the popup closes or focus is lost. Automatically triggers Formik field validation (setting to `touched`).',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering outside a standard Formik provider.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'targetDate',
    mode: 'date',
    inputLabel: 'Target Deadline',
    placeholder: 'Select target date',
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Select the operational target date for this deployment.',
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
                minHeight: '440px', 
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
  render: (args) => <StatefulDatePickerInput {...args} />,
};

export default meta;
type Story = StoryObj<DatePickerInputProps>;

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
    inputLabel: 'Consultation Date',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Hardware Commission Date',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'System Lifecycle Start',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION MODES & BEHAVIORS
// ---------------------------------------------------------------------------

export const DateTimeMode: Story = {
  args: {
    design: 'outline',
    mode: 'datetime',
    alias: 'launchTime',
    inputLabel: 'Scheduled Launch Window',
    placeholder: 'Select date and time',
    activeColor: '#8b5cf6',
  },
  parameters: {
    docs: {
      description: {
        story: 'Setting `mode="datetime"` extends the popover to include a 15-minute interval time picker menu. The component automatically swaps the default icon to a clock if one isn\'t explicitly provided, and parses formatting to `MMM d, yyyy h:mm aa`.',
      },
    },
  },
};

export const DateRangeMode: Story = {
  args: {
    design: 'outline',
    mode: 'daterange',
    alias: 'tripDuration',
    inputLabel: 'Travel Itinerary Range',
    placeholder: 'Start Date - End Date',
    icon: 'Plane' as unknown as React.ReactNode,
    activeColor: '#f59e0b',
  },
  parameters: {
    docs: {
      description: {
        story: 'Setting `mode="daterange"` modifies the calendar to track spans. The `onChange` payload is a highly readable object: `{ from: Date | null, to: Date | null }`.',
      },
    },
  },
};

export const FloatingLabelWithIcon: Story = {
  args: {
    design: 'outline',
    floatingLabel: true,
    inputLabel: 'Estimated Time of Arrival',
    icon: 'Clock' as unknown as React.ReactNode,
    iconPosition: 'left',
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'auditDate',
    inputLabel: 'Compliance Audit Schedule',
    isHinted: true,
    hintText: 'Must be scheduled at least 30 days prior to license expiry.',
    errorText: 'The selected date violates the minimum statutory notice period.',
    value: new Date(),
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
    inputLabel: 'Server Maintenance Window',
    activeColor: '#60a5fa',
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Native React State (No Formik):**
 * Demonstrates a clever standalone setup orchestrating all three structural modes simultaneously. 
 * Use `onChange` to capture the JavaScript `Date` object or structured `{ from, to }` range object natively.
 */
export const StandaloneUsage: Story = {
  render: (args) => {
    // We recreate the state here so the preview behaves identically to the code snippet
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [appointment, setAppointment] = useState<Date | null>(null);
    const [vacationPeriod, setVacationPeriod] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

    const handleExtractValues = (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
        birthDate: birthDate?.toISOString() || null,
        appointment: appointment?.toISOString() || null,
        vacationStart: vacationPeriod.from?.toISOString() || null,
        vacationEnd: vacationPeriod.to?.toISOString() || null,
      };
      alert(JSON.stringify(payload, null, 2));
    };

    return (
      <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '400px', fontFamily: 'system-ui, sans-serif' }}>
        
        <DatePickerInput
          alias="birthDate"
          inputLabel="Date of Birth"
          mode="date"
          design={args.design}
          value={birthDate}
          onChange={(val: Date | null) => setBirthDate(val)}
        />

        <DatePickerInput
          alias="appointment"
          inputLabel="Appointment Schedule"
          mode="datetime"
          design={args.design}
          value={appointment}
          onChange={(val: Date | null) => setAppointment(val)}
        />

        <DatePickerInput
          alias="vacationPeriod"
          inputLabel="Approved Leave Period"
          mode="daterange"
          design={args.design}
          value={vacationPeriod}
          onChange={(val: { from: Date | null; to: Date | null }) => setVacationPeriod(val)}
        />

        <button
          type="submit"
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
          Extract Dates
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
import { Button } from "@emeraldemperaur/mito-ui";
import { DatePickerInput } from "@emeraldemperaur/mito-ui/DatePickerInput";

export const StandaloneDatePickerExample = () => {
  // 1. Standard Date State (Date | null)
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  // 2. DateTime State (Date | null)
  const [appointment, setAppointment] = useState<Date | null>(null);

  // 3. Date Range State ({ from: Date | null, to: Date | null })
  const [vacationPeriod, setVacationPeriod] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const handleExtractValues = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      birthDate: birthDate?.toISOString() || null,
      appointment: appointment?.toISOString() || null,
      vacationStart: vacationPeriod.from?.toISOString() || null,
      vacationEnd: vacationPeriod.to?.toISOString() || null,
    };

    console.log("Extracted Standalone Payload:", payload);
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <form onSubmit={handleExtractValues} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      
      {/* Date Mode: Yields JS Date */}
      <DatePickerInput
        alias="birthDate"
        inputLabel="Date of Birth"
        mode="date"
        design="outline"
        value={birthDate}
        onChange={(val: Date | null) => setBirthDate(val)}
      />

      {/* Date & Time Mode: Yields JS Date */}
      <DatePickerInput
        alias="appointment"
        inputLabel="Appointment Schedule"
        mode="datetime"
        design="outline"
        value={appointment}
        onChange={(val: Date | null) => setAppointment(val)}
      />

      {/* Date Range Mode: Yields { from: Date, to: Date } object */}
      <DatePickerInput
        alias="vacationPeriod"
        inputLabel="Approved Leave Period"
        mode="daterange"
        design="outline"
        value={vacationPeriod}
        onChange={(val: { from: Date | null; to: Date | null }) => setVacationPeriod(val)}
      />

      <Button type="submit" variant="material" backgroundColor="#2563eb" textColor="#ffffff">
        Extract Dates
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
 * Demonstrates the seamless binding of `DatePickerInput` inside a `Formik` context with Yup integration. 
 * Formik captures the JavaScript `Date` object directly into the global validation state.
 */
export const FormikIntegration: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          birthDate: null,
          appointment: null,
          vacationPeriod: { from: null, to: null },
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          
          if (!values.birthDate) {
            errors.birthDate = 'Date of birth is required.';
          }
          if (!values.appointment) {
            errors.appointment = 'An appointment date must be selected.';
          } else if (new Date(values.appointment) < new Date()) {
            errors.appointment = 'Appointments cannot be scheduled in the past.';
          }
          if (!values.vacationPeriod.from || !values.vacationPeriod.to) {
            errors.vacationPeriod = 'Both start and end dates are required.';
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
                Live Formik Temporal State
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
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <DatePickerInput
                alias="birthDate"
                mode="date"
                inputLabel="Date of Birth"
                design={args.design}
                floatingLabel
              />

              <DatePickerInput
                alias="appointment"
                mode="datetime"
                inputLabel="Initial Consultation"
                design={args.design}
                floatingLabel
              />

              <DatePickerInput
                alias="vacationPeriod"
                mode="daterange"
                inputLabel="Approved Leave Period"
                design={args.design}
                floatingLabel
              />

              <button
                type="submit"
                disabled={formikProps.isSubmitting}
                style={{
                  marginTop: '12px',
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
                Submit Formik Payload
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
        code: `import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@emeraldemperaur/mito-ui";
import { DatePickerInput } from "@emeraldemperaur/mito-ui/DatePickerInput";

// Optional Validation Schema
const ValidationSchema = Yup.object().shape({
  birthDate: Yup.date().nullable().required("Date of birth is required"),
  appointment: Yup.date().nullable().required("Appointment time is required"),
  vacationPeriod: Yup.object().shape({
    from: Yup.date().nullable().required("Start date required"),
    to: Yup.date().nullable().required("End date required"),
  }),
});

export const FormikDatePickerExample = () => {
  return (
    <Formik
      initialValues={{
        birthDate: null,
        appointment: null,
        vacationPeriod: { from: null, to: null },
      }}
      validationSchema={ValidationSchema}
      onSubmit={(values) => {
        console.log("Formik Payload Executed:", values);
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ isSubmitting }) => (
        <Form style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
          
          <DatePickerInput
            alias="birthDate"
            inputLabel="Date of Birth"
            mode="date"
            design="outline"
            floatingLabel
          />

          <DatePickerInput
            alias="appointment"
            inputLabel="Appointment Schedule"
            mode="datetime"
            design="outline"
            floatingLabel
          />

          <DatePickerInput
            alias="vacationPeriod"
            inputLabel="Approved Leave Period"
            mode="daterange"
            design="outline"
            floatingLabel
          />

          <Button type="submit" disabled={isSubmitting} variant="material" backgroundColor="#2563eb" textColor="#ffffff">
            Submit Formik Payload
          </Button>
        </Form>
      )}
    </Formik>
  );
};`,
      },
    },
  },
};