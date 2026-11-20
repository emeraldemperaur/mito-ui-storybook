import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { SectionTitle, type SectionTitleProps } from './SectionTitle';
import { Row } from '../Layout/Row';
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import { Icon } from '../../components/icons/Icons';

type SectionTitleStoryProps = SectionTitleProps & {
  darkModeLight?: string;
  darkModeDark?: string;
};

const SecurityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 3 0 5 1 7 2a1 1 0 0 1 1 1z" />
  </svg>
);

const withMitoContext: Decorator = (Story, context) => {
  const { design, darkModeColors, darkModeLight, darkModeDark, backgroundColor } = context.args as any;
  const isDark = !!darkModeColors || !!darkModeLight || !!darkModeDark;

  let bg = '#ffffff';
  if (isDark) {
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
        <div style={{ width: '100%' }}>
          <Row gap="4">
            <Story />
          </Row>
        </div>
      </div>
    </GlobalUIContext.Provider>
  );
};

/**
 * Enterprise semantic heading component. Serves as the primary structural boundary marker for grouped form inputs (`Teletraan1` / `VectorSigma`) and content blocks.
 * Supports deep multi-variant design injection, native Neumorphic parent-ambient background calculations, and strict viewport grid tracking.
 */
const meta: Meta<SectionTitleStoryProps> = {
  title: 'Information/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `SectionTitle` to logically group complex form fields, data tables, or metrics. The component automatically adjusts its padding, border injection, and structural `<hr/>` separators based on the injected `design` prop.',
      },
    },
  },
  argTypes: {
    // --- Core Identity ---
    title: {
      control: 'text',
      description: 'The core title text rendered as an accessible `<h2>` heading.',
      table: { category: 'Typography' },
    },
    subTitle: {
      control: 'text',
      description: 'Optional secondary descriptive text rendered below the primary title.',
      table: { category: 'Typography' },
    },
    size: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      description: 'Typography scale for the primary title. Expects a string literal from `"1"` to `"9"`.',
      table: { 
        category: 'Typography', 
        defaultValue: { summary: '"5"' },
        type: { summary: '"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"' }
      },
    },
    subsize: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      description: 'Typography scale for the subtitle. Expects a string literal from `"1"` to `"9"`.',
      table: { 
        category: 'Typography', 
        defaultValue: { summary: '"2"' },
        type: { summary: '"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"' }
      },
    },
    align: {
      control: 'radio',
      options: ['left', 'center', 'right'],
      description: 'Horizontal alignment of the text and injected icon content. Expects `"left"`, `"center"`, or `"right"`.',
      table: { 
        category: 'Typography', 
        defaultValue: { summary: '"left"' },
        type: { summary: '"left" | "center" | "right"' }
      },
    },
    letterSpacing: {
      control: 'text',
      description: 'Typographic letter spacing (tracking) in `em` units.',
      table: { category: 'Typography', defaultValue: { summary: '"0.05em"' } },
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
      table: { category: 'Layout', defaultValue: { summary: 'true' } },
    },
    withSeparator: {
      control: 'boolean',
      description: 'Renders a visual geometric separator line beneath the title block.',
      table: { category: 'Layout', defaultValue: { summary: 'true' } },
    },
    asChild: {
      control: 'boolean',
      description: 'If true, merges component DOM into the immediate child via Radix Slot.',
      table: { category: 'Layout', defaultValue: { summary: 'false' } },
    },

    // --- Design System & Theming ---
    design: {
      control: 'radio',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'Core architectural design variant. Expects `"outline"`, `"material"`, `"neumorphic"`, or `"skeuomorphic"`.',
      table: { 
        category: 'Design System', 
        defaultValue: { summary: '"outline"' },
        type: { summary: "'outline' | 'material' | 'neumorphic' | 'skeuomorphic'" }
      },
    },
    icon: {
      control: 'select',
      options: ['None', 'SecurityIcon'],
      mapping: {
        None: undefined,
        Shield: <Icon name="lockclosed" width="24" height="24" />,
        Settings: <Icon name="settings" width="24" height="24" />,
        User: <Icon name="user" width="24" height="24" />,
        Rocket: <Icon name="rocket" width="24" height="24" />,
        Warning: <Icon name="error" width="24" height="24" />,
        Dashboard: <Icon name="dashboard" width="24" height="24" />,
      },
      description: 'ReactNode representing an icon rendered adjacently to the title text.',
      table: { category: 'Design System' },
    },
    backgroundColor: { 
      control: 'color', 
      description: 'Explicit background color override. If omitted, Neumorphic designs calculate the parent background natively.',
      table: { category: 'Theming' } 
    },
    titleColor: { 
      control: 'color', 
      description: 'Explicit primary title text color override.',
      table: { category: 'Theming' } 
    },
    subtitleColor: { 
      control: 'color', 
      description: 'Explicit subtitle text color override.',
      table: { category: 'Theming' } 
    },
    strokeColor: { 
      control: 'color', 
      description: 'Controls the structural border color for Outline (left stroke) and Material (bottom stroke) variants. Defaults to black (`#000000`) or inherits from the Global UI context.',
      table: { category: 'Theming' } 
    },
    darkModeColors: {
      control: false,
      description: 'Manual injection of dark mode variables to bypass context. Reconstructed natively via the `darkModeLight` and `darkModeDark` color pickers.',
      table: { category: 'Theming', type: { summary: '{ light: string; dark: string }' } }
    },
    darkModeLight: {
      name: 'darkModeColors.light',
      control: 'color',
      description: 'Interactive picker for `darkModeColors.light`. Forces the component into its dark-mode architecture.',
      table: { category: 'Theming', type: { summary: 'string' } },
    },
    darkModeDark: {
      name: 'darkModeColors.dark',
      control: 'color',
      description: 'Interactive picker for `darkModeColors.dark`. Forces the component into its dark-mode architecture.',
      table: { category: 'Theming', type: { summary: 'string' } },
    },
    borderRadius: {
      control: 'text',
      description: 'Explicit override for the container border radius (e.g. `"8px"`, `"12px"`, or numeric `8`).',
      table: { category: 'Design System', type: { summary: 'string | number' } }
    },
    
    // --- Neumorphic / Physical Properties ---
    elevation: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: 'Neumorphic 3D extrusion distance in pixels. Controls shadow throw.',
      table: { category: 'Physical Geometry (Neumorphic)', defaultValue: { summary: '4' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Opacity multiplier for Neumorphic drop shadows to ensure WCAG contrast.',
      table: { category: 'Physical Geometry (Neumorphic)', defaultValue: { summary: '1' } },
    },
    lightSource: {
      control: 'radio',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Global lighting angle that dictates the X and Y shadow trajectories. Expects `"top-left"`, `"top-right"`, `"bottom-left"`, or `"bottom-right"`.',
      table: { 
        category: 'Physical Geometry (Neumorphic)', 
        defaultValue: { summary: '"top-left"' },
        type: { summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'" }
      },
    },

    // --- Standard Props ---
    className: { control: 'text', table: { category: 'Standard Props' } },
    style: { control: 'object', table: { category: 'Standard Props' } },
  },
  args: {
    title: 'Core Telemetry Config',
    subTitle: 'Establish the primary endpoint variables for the data pipeline.',
    design: 'outline',
    width: 12,
    size: '5',
    subsize: '2',
    withSeparator: true,
    icon: 'Shield'
  },
  decorators: [withMitoContext],
  render: ({ darkModeLight, darkModeDark, darkModeColors, ...args }) => {
    const resolvedDarkModeColors = (darkModeLight || darkModeDark) 
      ? {
          light: darkModeLight ?? darkModeColors?.light ?? '#10b981',
          dark: darkModeDark ?? darkModeColors?.dark ?? '#10b981',
        }
      : darkModeColors;

    return <SectionTitle {...args} darkModeColors={resolvedDarkModeColors} />;
  },
};

export default meta;
type Story = StoryObj<SectionTitleStoryProps>;

// ---------------------------------------------------------------------------
// CORE DESIGN VARIANTS
// ---------------------------------------------------------------------------

export const Outline: Story = {
  args: {
    design: 'outline',
    title: 'Outline Boundary Header',
  },
  parameters: {
    docs: {
      description: {
        story: 'The default `outline` variant utilizes a sharp left border stroke mapped to the `strokeColor` prop.',
      },
    },
  },
};

export const Material: Story = {
  args: {
    design: 'material',
    title: 'Material Elevation Header',
    subTitle: 'Utilizes standard drop shadows and a colored baseline marker.',
  },
  parameters: {
    docs: {
      description: {
        story: 'The `material` variant wraps the header in a card-like container with a distinct bottom-border stroke mapped to the `strokeColor` prop.',
      },
    },
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    title: 'Tactile Neumorphic Header',
    icon: <SecurityIcon />,
    backgroundColor: '#e0e5ec',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    title: 'Mechanical Control Bay',
    subTitle: 'Complex multi-layered gradients and physical lighting simulation.',
    backgroundColor: '#e0e5ec',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION MODES & BEHAVIORS
// ---------------------------------------------------------------------------

export const ColorOverrides: Story = {
  args: {
    design: 'outline',
    title: 'Critical Danger Zone',
    subTitle: 'Proceed with extreme caution. These settings are destructive.',
    icon: <SecurityIcon />,
    backgroundColor: '#fef2f2',
    titleColor: '#991b1b',
    subtitleColor: '#b91c1c',
    strokeColor: '#ef4444',
    withSeparator: false,
    borderRadius: '8px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates deep manual color injection using `backgroundColor`, `titleColor`, `subtitleColor`, and `strokeColor` to create a prominent warning boundary without altering global brand tokens.',
      },
      source: {
        code: `import React from 'react';
import { SectionTitle, Icon } from '@emeraldemperaur/mito-ui';

export const DangerHeader = () => (
  <SectionTitle 
    design="outline"
    title="Critical Danger Zone"
    subTitle="Proceed with extreme caution. These settings are destructive."
    icon={<Icon name="warning" width="24" height="24" />}
    backgroundColor="#fef2f2"
    titleColor="#991b1b"
    subtitleColor="#b91c1c"
    strokeColor="#ef4444"
    withSeparator={false}
    borderRadius="8px"
  />
);`,
      },
    },
  },
};

export const DarkModeInjection: Story = {
  args: {
    design: 'material',
    title: 'System Access Log',
    subTitle: 'View encrypted SSH connections over the last 24 hours.',
    darkModeLight: '#10b981',
    darkModeDark: '#10b981',
    strokeColor: '#10b981',
    icon: <SecurityIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Passing `darkModeColors` manually forces the component into its dark-mode architecture, swapping out text colors and separator opacity automatically.',
      },
    },
  },
};