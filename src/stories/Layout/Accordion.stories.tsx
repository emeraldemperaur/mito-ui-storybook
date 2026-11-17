import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { Accordion } from './Accordion';
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import nicePlaceholder from '../../../src/assets/nice-negresco.jpg';
import promenadePlaceholder from '../../../src/assets/nice-promenade.webp';
import montecarloPlaceholder from '../../../src/assets/monte-carlo.jpg';
import { Row } from './Row';

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

type AccordionStoryArgs = React.ComponentProps<typeof Accordion.Root> & {
  itemDisabled?: boolean;
  itemTitle?: string;
  itemSubtitle?: string;
  itemIcon?: React.ReactNode;
  itemImage?: string;
};

/**
 * Master state-managing wrapper for the Accordion. Employs embedded HTML style blocks for 
 * strict architectural isolation and dynamically synchronizes visual media with disclosure states.
 */
const meta: Meta<AccordionStoryArgs> = {
  title: 'Information/Accordion',
  component: Accordion.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded', 
    docs: {
      description: {
        component: 'Agents and developers must adhere to these strict types to prevent UI thread blocking and style pollution. Utilize the `design` prop to seamlessly pivot between Material, Outline, Neumorphic, and Skeuomorphic layouts without fracturing the DOM.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode.replace(/render:.*?\(\)\s*=>\s*/, '').replace(/^\{\s*(<Accordion\.Root)/, '$1').replace(/(<\/Accordion\.Root>)\s*\}$/, '$1');
          const importStatement = `import { Accordion } from '@emeraldemepraur/mito-ui';\n\n`;
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
    // --- Architecture & Layout ---
    design: {
      control: 'radio',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The core architectural design variant propagating to all child items.',
      table: { category: 'Design System', defaultValue: { summary: 'outline' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    width: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'The required viewport column width spanning across grid boundaries (1 to 12).',
      table: { category: 'Layout', defaultValue: { summary: '12' } },
    },
    newRow: {
      control: 'boolean',
      description: 'Option to isolate and render the Accordion onto a clean structural row plane.',
      table: { category: 'Layout' },
    },

    // --- State & Behaviors ---
    allowMultiple: {
      control: 'boolean',
      description: 'Toggles whether multiple accordion sections can be expanded concurrently.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    defaultOpenId: {
      control: 'text',
      description: 'The `sectionId` (or array of ids) that should be expanded by default on initial mount.',
      table: { category: 'State' },
    },

    // --- Image Synchronization ---
    syncImage: {
      control: 'boolean',
      description: 'Activates the synchronized image gallery UX using the `image` prop on active children.',
      table: { category: 'Media Sync', defaultValue: { summary: 'false' } },
    },
    imagePosition: {
      control: 'select',
      options: ['above', 'below', 'left', 'right'],
      description: 'Structural placement of the synchronized image gallery relative to the accordion items.',
      table: { category: 'Media Sync', defaultValue: { summary: 'above' } },
      if: { arg: 'syncImage', eq: true },
    },

    // --- 3D Parameters (Neumorphic/Skeuomorphic) ---
    elevation: {
      control: { type: 'range', min: 1, max: 15, step: 1 },
      description: 'Controls perceived physical distance of the component from its background plane.',
      table: { category: '3D Parameters', defaultValue: { summary: '5' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Multiplier applied to the opacity of light/dark shadow channels.',
      table: { category: '3D Parameters', defaultValue: { summary: '1' } },
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Simulated directional angle of the environment light source.',
      table: { category: '3D Parameters', defaultValue: { summary: 'top-left' } },
    },

    // --- Theming & Styling ---
    backgroundColor: { control: 'color', table: { category: 'Theming' } },
    darkBackgroundColor: { control: 'color', table: { category: 'Theming' } },
    textColor: { control: 'color', table: { category: 'Theming' } },
    darkTextColor: { control: 'color', table: { category: 'Theming' } },
    activeColor: { 
      control: 'color', 
      description: 'Dynamic highlight color applied to active/expanded item titles, icons, and borders.', 
      table: { category: 'Theming' } 
    },
    textSize: { control: 'text', table: { category: 'Typography' } },
    fontFamily: { control: 'text', table: { category: 'Typography' } },

    // --- Events (Root) ---
    onValueChange: { action: 'onValueChange', description: 'Callback fired when the expanded state of any accordion item changes.', table: { category: 'Events' }, control: false },

    // --- Accordion.Item Props ---
    itemDisabled: { name: 'disabled (Item)', control: 'boolean', description: 'Locks down interaction across the first specific node.', table: { category: 'Accordion.Item Props' } },
    itemTitle: { name: 'title (Item)', control: 'text', description: 'The primary header or trigger text.', table: { category: 'Accordion.Item Props' } },
    itemSubtitle: { name: 'subtitle (Item)', control: 'text', description: 'The secondary subheader text displayed beneath the title.', table: { category: 'Accordion.Item Props' } },
    itemIcon: {
      name: 'icon (Item)',
      control: 'select',
      options: ['User', 'Shield', 'Settings', 'None'],
      mapping: { User: <UserIcon />, Shield: <ShieldIcon />, Settings: <SettingsIcon />, None: undefined },
      description: 'Optional custom icon component rendered to the immediate left of the title.',
      table: { category: 'Accordion.Item Props' },
    },
    itemImage: { 
      name: 'image (Item)', 
      control: 'text', 
      description: 'The URL of the image to display in the synchronized gallery when this section is active. Requires `syncImage={true}` on the Root.', 
      table: { category: 'Accordion.Item Props' } 
    },
  },
  args: {
    design: 'outline',
    allowMultiple: false,
    syncImage: false,
    imagePosition: 'left',
    darkMode: false,
    elevation: 5,
    itemDisabled: false,
    itemTitle: 'Personal Information',
    itemSubtitle: 'Manage your profile and contact details.',
    itemIcon: 'User' as unknown as React.ReactNode,
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
          <div style={{ 
            minHeight: '600px', 
            width: '100%', 
            backgroundColor: bg,
            padding: '2rem',
            position: 'relative',
            borderRadius: '12px',
            transition: 'background-color 0.3s ease',
            boxSizing: 'border-box' 
          }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {useRow ? (
                <Row>
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
  render: ({ itemDisabled, itemTitle, itemSubtitle, itemIcon, itemImage, ...args }) => (
    <Accordion.Root {...args}>
      <Accordion.Item 
        sectionId="section-1" 
        title={itemTitle || 'Personal Information'} 
        subtitle={itemSubtitle} 
        icon={itemIcon} 
        disabled={itemDisabled}
        image={itemImage || nicePlaceholder}
      >
        Your personal details are stored securely. You can update your display name, contact email, and phone number from the primary settings dashboard.
      </Accordion.Item>
      <Accordion.Item 
        sectionId="section-2" 
        title="Security Preferences" 
        subtitle="Manage 2FA and active sessions." 
        icon={<ShieldIcon />}
        image={promenadePlaceholder}
      >
        Review your security logs to ensure there is no unauthorized access. Enable two-factor authentication for an added layer of account security.
      </Accordion.Item>
      <Accordion.Item 
        sectionId="section-3" 
        title="Advanced Settings" 
        icon={<SettingsIcon />}
        image={montecarloPlaceholder}
      >
        Configure webhooks, API access tokens, and deeply customized integration behavior for your workspace environment.
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export default meta;
type Story = StoryObj<AccordionStoryArgs>;

// ---------------------------------------------------------------------------
// CORE VARIANTS
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
    backgroundColor: '#ffffff',
    darkBackgroundColor: '#1f2937',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#333333',
    activeColor: '#e11d48',
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft, extruded physical surfaces adapting to the parent background. Each accordion item functions as a detached, floating node.',
      },
    },
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    activeColor: '#2563eb',
  },
  parameters: {
    docs: {
      description: {
        story: 'High-fidelity 3D realistic mechanical modules. Features intricate gradient overlays and physical inset shadow deformations upon expansion.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// MEDIA & SYNCHRONIZATION
// ---------------------------------------------------------------------------

export const ImageSynchronization: Story = {
  args: {
    design: 'outline',
    syncImage: true,
    imagePosition: 'left',
    defaultOpenId: 'section-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'When `syncImage={true}` is provided alongside `Accordion.Item` elements containing an `image` prop, the Root intelligently mounts a responsive synchronized image gallery perfectly tied to the active disclosure state.',
      },
    },
  },
};

export const DarkModeOverride: Story = {
  args: {
    design: 'material',
    darkMode: true,
    activeColor: '#60a5fa',
    defaultOpenId: 'section-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Forces the component into dark mode, overriding system or parent theme contexts.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// FORMIK & STATE INTEGRATION
// ---------------------------------------------------------------------------

/**
 * **Interactive Form Test:**
 * Showcases how to deeply integrate the `Accordion` component into a Formik state pipeline.
 * Since the Accordion natively controls its own Radix UI state, we use `onValueChange` to bind the active sections directly to Formik's internal values array.
 */
export const InteractiveFormTest: Story = {
  render: ({ itemDisabled, itemTitle, itemSubtitle, itemIcon, ...args }) => {
    return (
      <Formik 
        initialValues={{ activeModules: ['section-2'] }} 
        onSubmit={(values, { setSubmitting }) => {
          console.log("Formik Submitted Values:", values);
          alert(`Formik Payload: \n${JSON.stringify(values, null, 2)}`);
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, isSubmitting, values }) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontWeight: 'bold', color: '#9f1239' }}>Live Formik State (activeModules):</span>
              <pre style={{ margin: 0, fontFamily: 'monospace', color: '#374151', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>
            
            <Accordion.Root 
              {...args} 
              defaultOpenId={values.activeModules}
              onValueChange={(val) => setFieldValue('activeModules', val)}
            >
              <Accordion.Item sectionId="section-1" title="Configuration Setup" icon={<SettingsIcon />}>
                Complete the primary configuration steps before launching the environment.
              </Accordion.Item>
              <Accordion.Item sectionId="section-2" title="User Access Controls" icon={<UserIcon />}>
                Define role-based access control strategies for the newly provisioned module.
              </Accordion.Item>
              <Accordion.Item sectionId="section-3" title="Firewall Routing" icon={<ShieldIcon />}>
                Establish internal port mapping and VPC security perimeters.
              </Accordion.Item>
            </Accordion.Root>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ cursor: 'pointer', padding: '12px 24px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', alignSelf: 'flex-start' }}
            >
              Save Form State
            </button>
          </Form>
        )}
      </Formik>
    );
  },
  args: {
    design: 'neumorphic',
    allowMultiple: true,
    width: 12, 
  },
  parameters: {
    useRow: false,
    docs: {
      source: {
        code: `import React from 'react';
import { Formik, Form } from 'formik';
import { Accordion } from '@emeraldemepraur/mito-ui';

export const FormikAccordionExample = () => {
  return (
    <Formik
      initialValues={{ activeModules: ['section-2'] }}
      onSubmit={(values) => console.log("Formik Payload:", values)}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form>
          <Accordion.Root 
            design="neumorphic" 
            allowMultiple={true}
            defaultOpenId={['section-2']}
            width={12}
            onValueChange={(val) => setFieldValue('activeModules', val)}
          >
            <Accordion.Item sectionId="section-1" title="Configuration Setup">...</Accordion.Item>
            <Accordion.Item sectionId="section-2" title="User Access Controls">...</Accordion.Item>
            <Accordion.Item sectionId="section-3" title="Firewall Routing">...</Accordion.Item>
          </Accordion.Root>

          <button type="submit" disabled={isSubmitting}>Save Form State</button>
        </Form>
      )}
    </Formik>
  );
};`,
      },
    },
  },
};