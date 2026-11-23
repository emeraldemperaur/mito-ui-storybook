import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VectorSigma, type VectorSigmaRenderProps } from './VectorSigma';
import { type XFormType } from '../../utils/Voltron';
import meLogo from '../../assets/me-devlogo-black.png'

type VectorSigmaStoryProps = VectorSigmaRenderProps & { 
  schemaToLoad: XFormType;
  darkModeLight?: string;
  darkModeDark?: string;
};

// ============================================================================
// DOMAIN SCHEMA 1: TELEOPERATION ROBOTICS
// ============================================================================
const teleoperationSchema: XFormType = {
  uuid: "teleop-uplink-001",
  name: "Remote Teleoperation Uplink",
  logo: meLogo,
  brandColor: "#800020", 
  logoPosition: "right",
  model: [
    {
      sectionId: "operator-info-section",
      title: "Operator Identification",
      icon: "user",
      queries: [
        {
          queryId: 1, inputType: "text-input", inputAlias: "operatorCallsign", inputLabel: "Operator Callsign",
          inputPlaceholder: "Enter authorized callsign", newRow: false, inputWidth: 6, isRequired: true,
          isHinted: true, hintText: "Logged in the mech's blackbox during the active session."
        },
        {
          queryId: 2, inputType: "password-input", inputAlias: "clearanceCode", inputLabel: "Biometric Override PIN",
          newRow: false, inputWidth: 6, isRequired: true, isHinted: true, hintText: "Required for the neural handshake."
        },
        {
          queryId: 4, inputType: "avatar-input", inputAlias: "operatorProfile", inputLabel: "Operator Neural Profile",
          newRow: true, inputWidth: 12, isRequired: false
        }
      ]
    },
    {
      sectionId: "kinematic-calibration",
      title: "Kinematic Calibration",
      icon: "mixervertical",
      queries: [
        {
          queryId: 6, inputType: "slider-input", inputAlias: "servoSensitivity", inputLabel: "Servo Sensitivity",
          newRow: false, inputWidth: 7, isRequired: true, minValue: 1, maxValue: 100, stepValue: 1, defaultValue: 45
        },
        {
          queryId: 7, inputType: "radiogroup-input", inputAlias: "chassisStance", inputLabel: "Default Chassis Stance",
          newRow: true, inputWidth: 6, isRequired: true,
          inputOptions: [
            { optionid: 1, optionvalue: "Bipedal", text: "Bipedal (Agility)" },
            { optionid: 2, optionvalue: "Quadruped", text: "Quadruped (Stability)" }
          ]
        }
      ]
    },
    {
      sectionId: "network-overrides",
      title: "Feedback Overrides",
      icon: "activitylog",
      queries: [
        {
          queryId: 9, inputType: "conditional-toggle", inputAlias: "enableHaptics", inputLabel: "Enable Full-Body Haptics?",
          newRow: false, inputWidth: 12, triggerValue: true, defaultValue: true,
          toggledInput: {
            queryId: 10, inputType: "dropdown-input", inputAlias: "hapticIntensity", inputLabel: "Haptic Intensity Limit",
            inputWidth: 6, isRequired: false, defaultValue: "Medium",
            inputOptions: [
              { optionid: 1, optionvalue: "Low", text: "Low (Vibration Only)" },
              { optionid: 2, optionvalue: "Medium", text: "Medium (Resistance)" },
              { optionid: 3, optionvalue: "High", text: "High (Full Kinematic Recoil)" }
            ]
          }
        }
      ]
    }
  ]
};

// ============================================================================
// DOMAIN SCHEMA 2: ROBOTICS AVIATION
// ============================================================================
const aviationSchema: XFormType = {
  uuid: "uav-manifest-001",
  name: "Autonomous UAV Flight Manifest",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Drone_icon.svg/120px-Drone_icon.svg.png",
  brandColor: "#2563eb", 
  logoPosition: "left",
  model: [
    {
      sectionId: "uav-identity",
      title: "UAV Identity",
      subtitle: "Define the core identity and clearance for this drone",
      icon: "rocket",
      queries: [
        { queryId: 1, inputType: "text-input", inputAlias: "uavCallsign", inputLabel: "UAV Callsign", inputWidth: 6, isRequired: true, isHinted: true, hintText: "Broadcast identifier for ATC transponders." },
        { queryId: 2, inputType: "password-input", inputAlias: "encryptionKey", inputLabel: "Telemetry Encryption Key", inputWidth: 6, isRequired: true, isHinted: true, hintText: "Secures the video and command downlink." },
        { queryId: 3, inputType: "phone-input", inputAlias: "commandCenterLink", inputLabel: "Command Center Sat-Link", inputWidth: 5, newRow: true },
        { queryId: 4, inputType: "creditcard-input", inputAlias: "clearanceBadge", inputLabel: "Commander Clearance Badge", inputWidth: 6, isRequired: true }
      ]
    },
    {
      sectionId: "avionics",
      title: "Avionics & Payload",
      icon: "dashboard",
      queries: [
        { queryId: 6, inputType: "currency-input", inputAlias: "fuelBudget", inputLabel: "Fuel Budget (kWh)", inputWidth: 4, defaultValue: "KWH" },
        { queryId: 7, inputType: "stock-input", inputAlias: "targetSector", inputLabel: "Primary Target Sector", inputWidth: 4, defaultValue: "GRID" },
        { 
          queryId: 8, inputType: "radiogroup-input", inputAlias: "engineMode", inputLabel: "Flight Engine Mode", inputWidth: 6, newRow: true, isRequired: true,
          inputOptions: [
            { optionid: 1, optionvalue: "Hover", text: "Loiter/Hover (Efficiency)" },
            { optionid: 2, optionvalue: "Intercept", text: "Intercept (Max Speed)" }
          ]
        },
        { queryId: 9, inputType: "countryselect-input", inputAlias: "deploymentRegion", inputLabel: "Deployment Origin Region", inputWidth: 6, isRequired: true },
        { queryId: 11, inputType: "countrymultiselect-input", inputAlias: "approvedAirspaces", inputLabel: "Approved Flyover Airspaces", inputWidth: 12, newRow: true }
      ]
    },
    {
      sectionId: "flight-parameters",
      title: "Flight Parameters",
      icon: "mixerhorizontal",
      queries: [
        { 
          queryId: 12, inputType: "selectmultiple-input", inputAlias: "targetUplinks", inputLabel: "Target Data Uplinks", inputWidth: 5, isRequired: true,
          inputOptions: [
            { optionid: 1, optionvalue: "LIDAR", text: "LIDAR Topography" },
            { optionid: 2, optionvalue: "FLIR", text: "Thermal Imaging (FLIR)" }
          ]
        },
        { queryId: 13, inputType: "slider-input", inputAlias: "maxAltitude", inputLabel: "Max Altitude Ceiling (10k ft)", inputWidth: 7, minValue: 1, maxValue: 6, stepValue: 1, defaultValue: 3 },
        { queryId: 14, inputType: "rangeslider-input", inputAlias: "patrolWindow", inputLabel: "Expected Patrol Window (Hours)", inputWidth: 6, newRow: true, minValue: 0, maxValue: 24, stepValue: 1 },
        { queryId: 15, inputType: "toggle-input", inputAlias: "autoReturn", inputLabel: "Enable Auto-Return to Base", inputWidth: 4, defaultValue: true }
      ]
    },
    {
      sectionId: "advanced-tactics",
      title: "Advanced Tactics & Overrides",
      icon: "crosshair",
      queries: [
        {
          queryId: 24, inputType: "conditional-toggle", inputAlias: "requireTargetLock", inputLabel: "Require Target Lock before Engagement?", inputWidth: 5, triggerValue: true,
          toggledInput: {
            queryId: 25, inputType: "dropdown-input", inputAlias: "targetingSystem", inputLabel: "Targeting System Processor", inputWidth: 7,
            inputOptions: [
              { optionid: 1, optionvalue: "Optic", text: "Optical Recognition (Daylight)" },
              { optionid: 2, optionvalue: "Thermal", text: "Infrared Signature Mapping" }
            ]
          }
        },
        {
          queryId: 26, inputType: "conditional-select", inputAlias: "threatLevel", inputLabel: "Assessed Area Threat Level", inputWidth: 5, newRow: true, triggerValue: "Critical",
          inputOptions: [
            { optionid: 1, optionvalue: "Low", text: "Low (Uncontested)" },
            { optionid: 3, optionvalue: "Critical", text: "Critical (Anti-Air Present)" }
          ],
          toggledInput: {
            queryId: 27, inputType: "dropdown-input", inputAlias: "evasionProtocol", inputLabel: "Critical Evasion Protocol", inputWidth: 7,
            inputOptions: [
              { optionid: 1, optionvalue: "Chaff", text: "Deploy Chaff & Dive" },
              { optionid: 3, optionvalue: "Scuttle", text: "Self-Destruct (Data Wipe)" }
            ]
          }
        }
      ]
    }
  ]
};

// ============================================================================
// STORYBOOK WRAPPER
// ============================================================================

const VectorSigmaRenderer = ({ darkModeLight, darkModeDark, darkModeColors, onSubmit, ...args }: VectorSigmaStoryProps) => {
  const resolvedDarkModeColors = (darkModeLight || darkModeDark) 
    ? {
        light: darkModeLight ?? darkModeColors?.light ?? '#18181b', 
        dark: darkModeDark ?? darkModeColors?.dark ?? '#09090b',
      }
    : darkModeColors;

  const builder = useMemo(() => new VectorSigma(args.schemaToLoad), [args.schemaToLoad]);
  
  const defaultSubmit = async (values: any, actions: any, instance: any) => {
    const hydratedSchema = instance.getxForm();
    const completionTimeSecs = ((instance.timeSubmitted || Date.now()) - instance.timeCreated) / 1000;
    
    console.log(`[Telemetry] Form completed in ${completionTimeSecs.toFixed(2)} seconds.`);
    console.log("[Hydrated Schema Output]:", hydratedSchema);
    
    alert(`Success!\n\nPayload:\n${JSON.stringify(values, null, 2)}\n\nSee console for hydrated XForm JSON and completion telemetry.`);
    actions.setSubmitting(false);
  };

  return builder.transform({
    ...args,
    darkModeColors: resolvedDarkModeColors,
    onSubmit: onSubmit || defaultSubmit 
  });
};

const meta: Meta<typeof VectorSigmaRenderer> = {
  title: 'Data/VectorSigma',
  component: VectorSigmaRenderer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      story: { inline: false, iframeHeight: 1000 },
    },
  },
  argTypes: {
    schemaToLoad: { control: false, table: { disable: true } },
    theme: { control: false, table: { disable: true } },
    darkModeColors: { control: false, table: { disable: true } },
    
    displayMode: {
      control: 'select', options: ['codice', 'accordion', 'codex', 'dual'],
      description: 'Determines the structural DOM layout of the parsed sections.',
      table: { category: 'Render Options', defaultValue: { summary: 'codice' } }
    },
    design: {
      control: 'select', options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'The global architectural design variant cascading down to all generated inputs.',
      table: { category: 'Render Options', defaultValue: { summary: 'outline' } }
    },
    readOnlyMode: { control: 'boolean', table: { category: 'Render Options' } },
    strictValidation: { control: 'boolean', table: { category: 'Render Options' } },
    buttonOverride: { control: 'boolean', table: { category: 'Render Options' } },

    title: { control: 'text', table: { category: 'Branding & Layout' } },
    description: { control: 'text', table: { category: 'Branding & Layout' } },
    headingPosition: { control: 'radio', options: ['aboveLogo', 'belowLogo'], table: { category: 'Branding & Layout' } },
    brandColor: { control: 'color', table: { category: 'Branding & Layout' } },
    headingTextColor: { control: 'color', table: { category: 'Branding & Layout' } },
    headingBackgroundColor: { control: 'color', table: { category: 'Branding & Layout' } },
    hideLogo: { control: 'boolean', table: { category: 'Branding & Layout' } },
    fallbackLogo: { 
      control: 'text', 
      description: 'Failsafe image source deployed if the original schema logo URL triggers an error.',
      table: { category: 'Branding & Layout' } 
    },
    logoPosition: {
      control: 'radio', options: ['left', 'center', 'right'],
      description: 'Overrides the horizontal alignment of the schema logo.',
      table: { category: 'Branding & Layout' }
    },
    fontFamily: { control: 'text', table: { category: 'Branding & Layout' } },
    
    darkModeLight: { name: 'darkModeColors.light', control: 'color', table: { category: 'Theming' } },
    darkModeDark: { name: 'darkModeColors.dark', control: 'color', table: { category: 'Theming' } },

    submitText: { control: 'text', description: 'Overrides the default "Submit" text on the terminal button.', table: { category: 'Submit Button Settings' } },
    submitButtonColor: { control: 'color', table: { category: 'Submit Button Settings' } },
    submitButtonTextColor: { control: 'color', table: { category: 'Submit Button Settings' } },
    submitButtonHoverColor: { control: 'color', description: 'Custom hover background color for the submit button.', table: { category: 'Submit Button Settings' } },
    submitButtonHoverTextColor: { control: 'color', description: 'Custom hover text color for the submit button.', table: { category: 'Submit Button Settings' } },

    stepButtonColor: { control: 'color', table: { category: 'Codex Button Settings' } },
    stepButtonTextColor: { control: 'color', table: { category: 'Codex Button Settings' } },
  },
  args: {
    displayMode: 'codice',
    design: 'skeuomorphic',
    readOnlyMode: false,
    buttonOverride: false,
    strictValidation: false,
    hideLogo: false,
    headingPosition: 'belowLogo',
    logoPosition: 'right',
  }
};

export default meta;
type Story = StoryObj<typeof VectorSigmaRenderer>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND (Default Codice)
// ---------------------------------------------------------------------------
export const InteractivePlayground: Story = {
  args: {
    schemaToLoad: teleoperationSchema,
    displayMode: 'codice',
    design: 'skeuomorphic',
    fontFamily: 'Raleway',
    title: 'Teleoperation Uplink',
    description: 'Establish secure neural handshake with the MekaGodzilla™',
  },
  render: (args) => (
    <VectorSigmaRenderer key={`${args.design}-${args.displayMode}-${args.logoPosition}`} {...args} />
  ),
  parameters: {
    docs: {
      story: { iframeHeight: 1200 }, 
      source: {
        code: `import React, { useMemo } from 'react';
import { VectorSigma } from '@emeraldemperaur/mito-ui';
import { teleoperationSchema } from './schemas';

export const TeleoperationForm = () => {
  const builder = useMemo(() => new VectorSigma(teleoperationSchema), []);

  return builder.transform({
    displayMode: 'codice',
    design: 'skeuomorphic',
    fontFamily: 'Raleway',
    title: 'Teleoperation Uplink',
    description: 'Establish secure neural handshake with the external chassis.',
    logoPosition: 'left',
    onSubmit: async (values, actions, instance) => {
      const hydratedSchema = instance.getxForm();
      const timeToComplete = (Date.now() - instance.timeCreated) / 1000;
      console.log(\`Form completed in \${timeToComplete} seconds.\`, hydratedSchema);
      actions.setSubmitting(false);
    }
  });
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. FLUENT BUILDER METHOD
// ---------------------------------------------------------------------------
export const BuilderMethodInstantiation: Story = {
  args: {
    schemaToLoad: { uuid: "dynamic", name: "Dynamic", model: [] },
    displayMode: 'dual',
    design: 'material',
  },
  render: (args) => {
    const builder = useMemo(() => {
      const vSigma = new VectorSigma()
        .setName("Dynamic Telemetry Config")
        .setBrand("#2563eb")
        .createSection("sec-1", "System Settings", "Core endpoint parameters", "settings");
        
      vSigma.addQueryToSection("sec-1", {
        queryId: 1, inputType: "text-input", inputAlias: "endpointUrl", inputLabel: "Primary API Endpoint",
        inputWidth: 12, isRequired: true
      });

      vSigma.addQueryToSection("sec-1", {
        queryId: 2, inputType: "toggle-input", inputAlias: "enableSSL", inputLabel: "Enforce Strict SSL",
        inputWidth: 12, defaultValue: true
      });
      
      return vSigma;
    }, []);

    return builder.transform({ ...args, onSubmit: (v, actions, instance) => {
      console.log(instance.getxForm());
      alert(JSON.stringify(v));
      actions.setSubmitting(false);
    } });
  },
  parameters: {
    docs: {
      story: { iframeHeight: 600 }, 
      source: {
        code: `import React, { useMemo } from 'react';
import { VectorSigma } from '@emeraldemperaur/mito-ui';

export const DynamicBuilderForm = () => {
  // Construct the form schema fluently using Builder Methods
  const builder = useMemo(() => {
    const vSigma = new VectorSigma()
      .setName("Dynamic Telemetry Config")
      .setBrand("#2563eb")
      .createSection("sec-1", "System Settings", "Core endpoint parameters", "settings");
      
    vSigma.addQueryToSection("sec-1", {
      queryId: 1,
      inputType: "text-input",
      inputAlias: "endpointUrl",
      inputLabel: "Primary API Endpoint",
      inputWidth: 12,
      isRequired: true
    });
    
    return vSigma;
  }, []);

  return builder.transform({
    displayMode: 'dual',
    design: 'material',
    onSubmit: (values, actions, instance) => {
      const finalSchema = instance.getxForm();
      console.log('Final Database Object:', finalSchema);
      actions.setSubmitting(false);
    }
  });
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 3. EXTERNAL STATE CONTROL (AI COMMAND CENTER)
// ---------------------------------------------------------------------------
export const AICommandCenterDashboard: Story = {
  args: {
    schemaToLoad: aviationSchema,
  },
  render: () => {
    const vsInstance = useMemo(() => new VectorSigma(aviationSchema), []);
    const [, setTriggerRender] = useState(0);
    const updateUI = () => setTriggerRender(prev => prev + 1);

    const handleInjectMockData = () => {
      vsInstance.actions?.setFieldValue('uavCallsign', 'GHOST_01');
      vsInstance.actions?.setFieldValue('encryptionKey', 'AES-256-GCM-XT');
      vsInstance.actions?.validateForm();
      updateUI();
    };

    return (
      <div style={{ width: '100%', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* EXTERNAL CONTROL PANEL (STACKED ABOVE) */}
        <div style={{ width: '100%', marginBottom: '24px', boxSizing: 'border-box', backgroundColor: '#111827', padding: '20px', borderRadius: '12px', color: '#f9fafb' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#38bdf8' }}>AI Uplink Dashboard</h3>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Status Panel */}
            <div style={{ flex: '1 1 200px', backgroundColor: '#1f2937', padding: '16px', borderRadius: '8px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#9ca3af' }}>VΣ Status:</span>
                <span style={{ color: vsInstance.statusCode === 0 ? '#9ca3af' : '#10b981', fontWeight: 600 }}>
                  {vsInstance.statusCode === 0 ? '0 - Empty' : vsInstance.statusCode === 1 ? '1 - Editing' : '2 - Submitted'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>Form Errors:</span>
                <span style={{ color: Object.keys(vsInstance.errors).length > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                  {Object.keys(vsInstance.errors).length} Blockers
                </span>
              </div>
            </div>

            {/* Actions Panel */}
            <div style={{ flex: '3 1 400px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={() => { vsInstance.actions?.submitForm(); updateUI(); }} style={{ flex: 1, padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                Force Remote Submission
              </button>
              <button onClick={() => { alert(`DRAFT SAVED:\n\n${JSON.stringify(vsInstance.getxForm(), null, 2)}`); }} style={{ flex: 1, padding: '12px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Save Internal Draft
              </button>
              <button onClick={handleInjectMockData} style={{ flex: 1, padding: '12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Inject Telemetry
              </button>
            </div>

          </div>
        </div>

        {/* FULL WIDTH FORM */}
        <div style={{ width: '100%' }}>
          {vsInstance.transform({
            displayMode: 'accordion',
            design: 'outline',
            buttonOverride: true,
            onSubmit: async (values, actions, instance) => {
              const seconds = ((instance.timeSubmitted || Date.now()) - instance.timeCreated) / 1000;
              alert(`[Auth Granted in ${seconds}s]\n\nPayload:\n${JSON.stringify(values, null, 2)}`);
              actions.resetForm();
              updateUI();
            }
          })}
        </div>

      </div>
    );
  },
  parameters: {
    docs: {
      story: { iframeHeight: 750 },
      description: {
        story: 'Showcases how to take full programmatic control of the `VectorSigma` instance from outside the component. By passing `buttonOverride: true`, the native submit button is completely suppressed. The core `instance`—accessible globally via a `useMemo` reference or through the `onSubmit` callback—grants developers deep structural access. You can monitor live validation via `instance.errors`, read the hydrated schema state via `instance.getxForm()`, automatically fill fields using `instance.actions.setFieldValue()`, and remotely trigger validation and submission via `instance.actions.submitForm()`. The dashboard console above demonstrates this by driving the form beneath it entirely via external function calls.',
      },
      source: {
        code: `import React, { useMemo, useState } from 'react';
import { VectorSigma } from '@emeraldemperaur/mito-ui';
import { aviationSchema } from './schemas';

export const AICommandCenter = () => {
  const vsInstance = useMemo(() => new VectorSigma(aviationSchema), []);
  const [, setTriggerRender] = useState(0);

  return (
    <div style={{ width: '100%' }}>
      
      {/* 1. External Control Console (Above Form) */}
      <div className="top-console" style={{ width: '100%', marginBottom: '24px' }}>
        <h3>Errors: {Object.keys(vsInstance.errors).length}</h3>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { 
            vsInstance.actions?.submitForm(); 
            setTriggerRender(prev => prev + 1); 
          }}>
            Force Remote Submission
          </button>
          
          <button onClick={() => {
            vsInstance.actions?.setFieldValue('uavCallsign', 'GHOST_01');
            vsInstance.actions?.validateForm();
            setTriggerRender(prev => prev + 1); 
          }}>
            Inject Data
          </button>
        </div>
      </div>

      {/* 2. Mount the Form (Full Width) */}
      <div style={{ width: '100%' }}>
        {vsInstance.transform({
          displayMode: 'accordion',
          buttonOverride: true, // Hides native submit to allow external control
          onSubmit: (values, actions, instance) => {
             console.log("Submitted Schema:", instance.getxForm());
             actions.setSubmitting(false);
          }
        })}
      </div>

    </div>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 4. CODEX WIZARD WITH STRICT VALIDATION
// ---------------------------------------------------------------------------
export const AviationCodexWizard: Story = {
  args: {
    schemaToLoad: aviationSchema,
    displayMode: 'codex',
    design: 'material',
    strictValidation: true,
    stepButtonColor: '#2563eb', 
    stepButtonTextColor: '#ffffff',
  },
  parameters: {
    docs: {
      story: { iframeHeight: 700 }, 
      source: {
        code: `import React, { useMemo } from 'react';
import { VectorSigma } from '@emeraldemperaur/mito-ui';
import { aviationSchema } from './schemas';

export const FlightWizard = () => {
  const builder = useMemo(() => new VectorSigma(aviationSchema), []);

  return builder.transform({
    displayMode: 'codex',
    design: 'material',
    strictValidation: true, // Halts progression if active step has Yup errors
    stepButtonColor: '#2563eb', 
    stepButtonTextColor: '#ffffff',
    onSubmit: async (values, actions, instance) => {
      console.log('Hydrated Payload:', instance.getxForm());
      actions.setSubmitting(false);
    }
  });
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 5. DARK NEUMORPHIC AMBIENT INTEGRATION
// ---------------------------------------------------------------------------
export const DarkNeumorphic: Story = {
  args: {
    schemaToLoad: aviationSchema,
    displayMode: 'accordion',
    design: 'neumorphic',
    darkModeLight: '#18181b', 
    darkModeDark: '#09090b',
    headingTextColor: '#ffffff',
    submitButtonColor: '#ef4444',
    submitButtonTextColor: '#ffffff',
  },
  render: (args) => (
    <div style={{ backgroundColor: '#18181b', padding: '24px', borderRadius: '12px', width: '100%' }}>
      <VectorSigmaRenderer {...args} />
    </div>
  ),
  parameters: {
    docs: {
      story: { iframeHeight: 1200 }, 
      source: {
        code: `import React, { useMemo } from 'react';
import { VectorSigma } from '@emeraldemperaur/mito-ui';
import { aviationSchema } from './schemas';

export const DarkModeForm = () => {
  const builder = useMemo(() => new VectorSigma(aviationSchema), []);

  return (
    {/* Ensure the parent container matches the darkModeLight ambient color exactly to hide borders */}
    <div style={{ backgroundColor: '#18181b', padding: '24px', borderRadius: '12px' }}>
      {builder.transform({
        displayMode: 'accordion',
        design: 'neumorphic',
        darkModeColors: { light: '#18181b', dark: '#09090b' },
        headingTextColor: '#ffffff',
        submitButtonColor: '#ef4444',
        submitButtonTextColor: '#ffffff',
        onSubmit: (values, actions, instance) => {
          console.log('Payload:', instance.getxForm());
          actions.setSubmitting(false);
        }
      })}
    </div>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 6. ENTERPRISE WYSIWYG SCHEMA BUILDER 
// ---------------------------------------------------------------------------
export const WYSIWYGSchemaEditor: Story = {
  args: {
    schemaToLoad: { uuid: "1", name: "", model: [] }, // Overridden
  },
  render: () => {
    // 1. Maintain the raw schema state
    const [schema, setSchema] = useState<XFormType>({
      uuid: "schema-" + Date.now(),
      name: "Enterprise Target Form",
      brandColor: "#059669",
      logo: "",
      logoPosition: "left",
      model: [
        { sectionId: "sec-1", title: "General Information", subtitle: "Core identifiers", icon: "filetext", queries: [] }
      ]
    });

    // 2. Form & Section Config State
    const [activeSectionId, setActiveSectionId] = useState("sec-1");
    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [newSectionSubtitle, setNewSectionSubtitle] = useState("");
    const [newSectionIcon, setNewSectionIcon] = useState("");

    // 3. Field Editor State
    const [fieldType, setFieldType] = useState("text-input");
    const [fieldLabel, setFieldLabel] = useState("");
    const [fieldAlias, setFieldAlias] = useState("");
    const [fieldPlaceholder, setFieldPlaceholder] = useState("");
    const [fieldDefaultValue, setFieldDefaultValue] = useState("");
    const [fieldErrorText, setFieldErrorText] = useState("");
    
    const [fieldWidth, setFieldWidth] = useState(12);
    const [fieldRequired, setFieldRequired] = useState(false);
    const [fieldNewRow, setFieldNewRow] = useState(false);
    
    const [fieldHint, setFieldHint] = useState("");
    const [fieldOptions, setFieldOptions] = useState(""); 
    
    // Conditional / Advanced State
    const [fieldTriggerValue, setFieldTriggerValue] = useState("");
    const [fieldToggledType, setFieldToggledType] = useState("text-input");
    const [fieldToggledLabel, setFieldToggledLabel] = useState("");
    const [fieldMinValue, setFieldMinValue] = useState<number | ''>('');
    const [fieldMaxValue, setFieldMaxValue] = useState<number | ''>('');
    const [fieldStepValue, setFieldStepValue] = useState<number | ''>('');

    // 4. Mount VectorSigma to preview live changes
    const previewInstance = useMemo(() => new VectorSigma(schema), [schema]);

    const addSection = () => {
      if (!newSectionTitle) return;
      const newSecId = `sec-${Date.now()}`;
      setSchema({
        ...schema,
        model: [...schema.model, { 
          sectionId: newSecId, 
          title: newSectionTitle, 
          subtitle: newSectionSubtitle || undefined,
          icon: newSectionIcon || undefined,
          queries: [] 
        }]
      });
      setActiveSectionId(newSecId);
      setNewSectionTitle("");
      setNewSectionSubtitle("");
      setNewSectionIcon("");
    };

    const addField = () => {
      if (!fieldLabel || !fieldAlias) return;
      const newSchema = { ...schema };
      const targetSection = newSchema.model.find(s => s.sectionId === activeSectionId);
      if (!targetSection) return;

      const parsedOptions = fieldOptions ? fieldOptions.split(',').map((opt, i) => {
        const val = opt.trim();
        return { optionid: i + 1, optionvalue: val, text: val };
      }) : undefined;

      const isConditional = fieldType.includes('conditional');
      let toggledInput = null;
      if (isConditional && fieldToggledLabel) {
         toggledInput = {
            queryId: Date.now() + 1,
            inputType: fieldToggledType,
            inputAlias: `${fieldAlias}_toggled`,
            inputLabel: fieldToggledLabel,
            inputWidth: 12,
            inputOptions: parsedOptions
         };
      }

      targetSection.queries.push({
        queryId: Date.now(),
        inputType: fieldType,
        inputAlias: fieldAlias.trim().replace(/\s+/g, '_'),
        inputLabel: fieldLabel,
        inputPlaceholder: fieldPlaceholder || undefined,
        defaultValue: fieldDefaultValue || undefined,
        errorText: fieldErrorText || undefined,
        inputWidth: fieldWidth,
        isRequired: fieldRequired,
        newRow: fieldNewRow,
        isHinted: !!fieldHint,
        hintText: fieldHint || undefined,
        inputOptions: parsedOptions,
        triggerValue: fieldTriggerValue || undefined,
        toggledInput: toggledInput,
        minValue: fieldMinValue !== '' ? Number(fieldMinValue) : undefined,
        maxValue: fieldMaxValue !== '' ? Number(fieldMaxValue) : undefined,
        stepValue: fieldStepValue !== '' ? Number(fieldStepValue) : undefined,
      });

      setSchema(newSchema);
      setFieldLabel("");
      setFieldAlias("");
      setFieldPlaceholder("");
      setFieldDefaultValue("");
      setFieldErrorText("");
      setFieldHint("");
      setFieldOptions("");
      setFieldTriggerValue("");
      setFieldToggledLabel("");
      setFieldMinValue('');
      setFieldMaxValue('');
      setFieldStepValue('');
    };

    const inputStyle = { padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' as const, width: '100%', fontSize: '13px' };
    const labelStyle = { fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'system-ui, sans-serif', width: '100%' }}>
        
      
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '16px' }}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Form Name</label>
              <input value={schema.name} onChange={e => setSchema({...schema, name: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Brand Color</label>
              <input type="color" value={schema.brandColor} onChange={e => setSchema({...schema, brandColor: e.target.value})} style={{...inputStyle, padding: '4px', height: '35px'}} />
            </div>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Form Logo URL</label>
              <input value={schema.logo || ""} onChange={e => setSchema({...schema, logo: e.target.value})} placeholder="https://..." style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Logo Position</label>
              <select value={schema.logoPosition} onChange={e => setSchema({...schema, logoPosition: e.target.value})} style={inputStyle}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', borderBottom: '1px solid #cbd5e1', paddingBottom: '16px' }}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Target Section</label>
              <select value={activeSectionId} onChange={e => setActiveSectionId(e.target.value)} style={inputStyle}>
                {schema.model.map(s => <option key={s.sectionId} value={s.sectionId}>{s.title} ({s.sectionId})</option>)}
              </select>
            </div>
            <div style={{ flex: 1.5 }}>
              <label style={labelStyle}>New Section Title</label>
              <input value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} placeholder="e.g. Flight Parameters" style={inputStyle} />
            </div>
            <div style={{ flex: 1.5 }}>
              <label style={labelStyle}>New Subtitle</label>
              <input value={newSectionSubtitle} onChange={e => setNewSectionSubtitle(e.target.value)} placeholder="Optional" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Icon Name</label>
              <input value={newSectionIcon} onChange={e => setNewSectionIcon(e.target.value)} placeholder="e.g. user" style={inputStyle} />
            </div>
            <button onClick={addSection} style={{ padding: '8px 16px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', height: '35px', fontWeight: 600 }}>Add Section</button>
          </div>

          <h3 style={{ margin: '8px 0 0 0', fontSize: '1.1rem' }}>Inject Field into Active Section</h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ flex: '1 1 20%' }}>
              <label style={labelStyle}>Component Type</label>
              <select value={fieldType} onChange={(e) => setFieldType(e.target.value)} style={inputStyle}>
                <optgroup label="Standard Inputs">
                  <option value="text-input">Text Input</option>
                  <option value="textarea-input">Text Area / Code Editor</option>
                  <option value="password-input">Password Input</option>
                  <option value="currency-input">Currency Input</option>
                  <option value="phone-input">Phone Input</option>
                  <option value="creditcard-input">Credit Card</option>
                </optgroup>
                <optgroup label="Selection Inputs">
                  <option value="dropdown-input">Dropdown Select</option>
                  <option value="radiogroup-input">Radio Group</option>
                  <option value="checkboxgroup-input">Checkbox Group</option>
                  <option value="countryselect-input">Country Select</option>
                </optgroup>
                <optgroup label="Complex Interfaces">
                  <option value="slider-input">Slider Input</option>
                  <option value="rangeslider-input">Range Slider</option>
                  <option value="toggle-input">Boolean Toggle</option>
                  <option value="datetimepicker-input">Date & Time Picker</option>
                  <option value="file-input">File Upload</option>
                  <option value="conditional-toggle">Conditional Toggle Reveal</option>
                  <option value="conditional-select">Conditional Select Reveal</option>
                </optgroup>
              </select>
            </div>
            <div style={{ flex: '1 1 20%' }}>
              <label style={labelStyle}>Field Label</label>
              <input value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} placeholder="e.g. Access Code" style={inputStyle} />
            </div>
            <div style={{ flex: '1 1 20%' }}>
              <label style={labelStyle}>JSON Alias (Key)</label>
              <input value={fieldAlias} onChange={(e) => setFieldAlias(e.target.value)} placeholder="e.g. initScript" style={inputStyle} />
            </div>
            <div style={{ flex: '1 1 10%' }}>
              <label style={labelStyle}>Grid Width</label>
              <input type="number" min="1" max="12" value={fieldWidth} onChange={(e) => setFieldWidth(Number(e.target.value))} style={inputStyle} />
            </div>
            <div style={{ flex: '1 1 15%', display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '16px' }}>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="checkbox" checked={fieldRequired} onChange={(e) => setFieldRequired(e.target.checked)} /> Required
              </label>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="checkbox" checked={fieldNewRow} onChange={(e) => setFieldNewRow(e.target.checked)} /> New Row
              </label>
            </div>
          </div>

          {/* Field Metadata Attributes */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Placeholder</label>
              <input value={fieldPlaceholder} onChange={(e) => setFieldPlaceholder(e.target.value)} placeholder="Optional grey text" style={inputStyle} />
            </div>
            {fieldType !== 'textarea-input' && (
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Default Value</label>
                <input value={fieldDefaultValue} onChange={(e) => setFieldDefaultValue(e.target.value)} placeholder="Initial value" style={inputStyle} />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Custom Error Text</label>
              <input value={fieldErrorText} onChange={(e) => setFieldErrorText(e.target.value)} placeholder="Overrides default validation msg" style={inputStyle} />
            </div>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Hint Text (UX Guidance)</label>
              <input value={fieldHint} onChange={(e) => setFieldHint(e.target.value)} placeholder="Displays below the input" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', backgroundColor: '#e2e8f0', padding: '12px', borderRadius: '6px' }}>
            
            {fieldType === 'textarea-input' && (
              <>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Initial Rows (Height)</label>
                  <input 
                    type="number" 
                    min="2" 
                    max="30" 
                    value={fieldMaxValue} 
                    onChange={(e) => setFieldMaxValue(e.target.value as any)} 
                    placeholder="Default: 4" 
                    style={inputStyle} 
                  />
                </div>
                <div style={{ flex: 1.5 }}>
                  <label style={labelStyle}>Code Language (Requires 'code' or 'script' in alias)</label>
                  <select 
                    value={fieldDefaultValue} 
                    onChange={(e) => setFieldDefaultValue(e.target.value)} 
                    style={inputStyle}
                  >
                    <option value="">Plain Text (Standard Textarea)</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="json">JSON</option>
                    <option value="bash">Bash / Shell</option>
                    <option value="python">Python</option>
                  </select>
                </div>
              </>
            )}

            {(fieldType.includes('dropdown') || fieldType.includes('select') || fieldType.includes('radio') || fieldType.includes('checkbox')) && !fieldType.includes('country') && (
               <div style={{ flex: 2 }}>
                 <label style={labelStyle}>Input Options (Comma Separated)</label>
                 <input value={fieldOptions} onChange={(e) => setFieldOptions(e.target.value)} placeholder="e.g. Option A, Option B" style={inputStyle} />
               </div>
            )}

            {fieldType.includes('slider') && (
                <>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Min Value</label>
                        <input type="number" value={fieldMinValue} onChange={(e) => setFieldMinValue(e.target.value as any)} style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Max Value</label>
                        <input type="number" value={fieldMaxValue} onChange={(e) => setFieldMaxValue(e.target.value as any)} style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Step Interval</label>
                        <input type="number" value={fieldStepValue} onChange={(e) => setFieldStepValue(e.target.value as any)} style={inputStyle} />
                    </div>
                </>
            )}

            {fieldType.includes('conditional') && (
                <>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Trigger Value (to reveal)</label>
                        <input value={fieldTriggerValue} onChange={(e) => setFieldTriggerValue(e.target.value)} placeholder="e.g. true, or Option A" style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Nested Input Type</label>
                        <select value={fieldToggledType} onChange={(e) => setFieldToggledType(e.target.value)} style={inputStyle}>
                            <option value="text-input">Text Input</option>
                            <option value="textarea-input">Text Area / Code Editor</option>
                            <option value="dropdown-input">Dropdown Select</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Nested Input Label</label>
                        <input value={fieldToggledLabel} onChange={(e) => setFieldToggledLabel(e.target.value)} placeholder="Label for nested field" style={inputStyle} />
                    </div>
                </>
            )}

            <button onClick={addField} style={{ padding: '8px 24px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, height: '35px', marginLeft: 'auto' }}>
              Inject Field
            </button>
          </div>

        </div>

        {/* ==========================================
            MIDDLE: LIVE PREVIEW (Collapsible)
        ========================================== */}
        <details open style={{ border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
          <summary style={{ padding: '16px 24px', backgroundColor: '#f1f5f9', cursor: 'pointer', fontWeight: 600, color: '#334155', letterSpacing: '0.5px' }}>
             LIVE TELETRAAN1 PREVIEW
          </summary>
          <div style={{ padding: '32px' }}>
            {previewInstance.transform({
              displayMode: 'codice',
              design: 'skeuomorphic',
              buttonOverride: true 
            })}
          </div>
        </details>

        {/* ==========================================
            BOTTOM: OUTPUT CODE (Collapsible)
        ========================================== */}
        <details open style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
          <summary style={{ padding: '16px 24px', backgroundColor: '#f1f5f9', cursor: 'pointer', fontWeight: 600, color: '#334155', letterSpacing: '0.5px' }}>
             GENERATED TYPESCRIPT / JSON OBJECT
          </summary>
          <div style={{ padding: '0' }}>
            <pre style={{ margin: 0, padding: '24px', backgroundColor: '#0f172a', color: '#38bdf8', fontSize: '13px', overflowX: 'auto', maxHeight: '600px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
              {JSON.stringify(schema, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    );
  },
  parameters: {
    docs: {
      story: { iframeHeight: 700 }, 
      source: {
        code: `// Use the interactive tool above to generate your schema. 
// Then, copy the JSON output and pass it to VectorSigma:

import { VectorSigma } from '@emeraldemperaur/mito-ui';

const myGeneratedSchema =  /* Paste JSON Output Here */ ;

const builder = new VectorSigma(myGeneratedSchema);
return builder.transform({ displayMode: 'codice' });`,
      },
    },
  },
};