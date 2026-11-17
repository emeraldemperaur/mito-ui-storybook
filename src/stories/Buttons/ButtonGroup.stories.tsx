import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik } from 'formik';
import { ButtonGroup } from './ButtonGroup';

type ButtonGroupStoryArgs = React.ComponentProps<typeof ButtonGroup.Root> & {
  itemDisabled?: boolean;
  itemValue?: string;
  itemAsChild?: boolean;
  onItemClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onItemHover?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onItemLongClick?: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
};

/**
 * Master state-managing wrapper for grouped interactive segments. 
 * Automatically syncs with form states and enforces a maximum of 12 child nodes.
 */
const meta: Meta<ButtonGroupStoryArgs> = {
  title: 'Buttons/ButtonGroup',
  component: ButtonGroup.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Agents and developers must adhere to these strict types to prevent UI layout fractures. Children must be `ButtonGroup.Item` components. Do not apply inline styles manually to children.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode.replace(/render:.*?\(\)\s*=>\s*/, '').replace(/^\{\s*(<ButtonGroup\.Root)/, '$1').replace(/(<\/ButtonGroup\.Root>)\s*\}$/, '$1');
          const importStatement = `import { ButtonGroup } from '@emeraldemepraur/mito-ui';\n\n`;
          return `${importStatement}${cleanCode.trim()}`;
        },
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1A1A1D' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // --- Architecture & Layout ---
    design: {
      control: 'select',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The core architectural design variant propagating to all child items.',
      table: { category: 'Design System', defaultValue: { summary: 'outline' } },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction of the button group.',
      table: { category: 'Design System', defaultValue: { summary: 'horizontal' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Opacity multiplier for the Neumorphic shadow intensity.',
      table: { category: 'Design System', defaultValue: { summary: '1' } },
      if: { arg: 'design', eq: 'neumorphic' },
    },
    borderRadius: {
      control: 'text',
      description: 'Custom border radius applied to the outer edges of the Button Group.',
      table: { category: 'Design System', defaultValue: { summary: '0' } },
    },

    // --- Animations ---
    animate: {
      control: 'boolean',
      description: 'Enables complex interactions and micro-animations. Applies strictly to `material` and `outline`.',
      table: { category: 'Animations', defaultValue: { summary: 'false' } },
      if: { arg: 'design', neq: 'neumorphic' }, 
    },
    animation: {
      control: 'radio',
      options: ['none', 'bubble', 'prism'],
      description: 'The specific animation topology to apply when `animate` is true.',
      table: { category: 'Animations', defaultValue: { summary: 'none' } },
      if: { arg: 'animate', eq: true }, 
    },

    // --- State & Behaviors ---
    multiselect: {
      control: 'boolean',
      description: 'Enables selection of multiple buttons concurrently.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    value: {
      control: 'text',
      description: 'Initial active value (or array of values if multiselect is true).',
      table: { category: 'State' },
    },

    // --- Theming & Styling ---
    backgroundColor: {
      control: 'color',
      description: 'Dynamic base background color for light mode.',
      table: { category: 'Theming' },
    },
    darkBackgroundColor: {
      control: 'color',
      description: 'Dynamic base background color specifically for dark mode contexts.',
      table: { category: 'Theming' },
    },
    textColor: {
      control: 'color',
      description: 'Dynamic text color for light mode.',
      table: { category: 'Theming' },
    },
    darkTextColor: {
      control: 'color',
      description: 'Dynamic text color specifically for dark mode contexts.',
      table: { category: 'Theming' },
    },
    hoverColor: {
      control: 'color',
      description: 'Optional hover background color (Material/Outline variants only).',
      table: { category: 'Theming' },
    },
    darkHoverColor: {
      control: 'color',
      description: 'Optional hover background color for dark mode (Material/Outline variants only).',
      table: { category: 'Theming' },
    },
    hoverTextColor: {
      control: 'color',
      description: 'Optional hover text color (Material/Outline variants only).',
      table: { category: 'Theming' },
    },
    darkHoverTextColor: {
      control: 'color',
      description: 'Optional hover text color for dark mode (Material/Outline variants only).',
      table: { category: 'Theming' },
    },
    textSize: {
      control: 'text',
      description: 'Typography scale injection (e.g., "14px", "1rem").',
      table: { category: 'Typography' },
    },
    fontFamily: {
      control: 'text',
      description: 'Font family override.',
      table: { category: 'Typography' },
    },

    onChange: {
      action: 'onChange (Root)',
      description: 'Triggered when the selection state of the group changes.',
      table: { category: 'Events' },
      control: false,
    },

    itemValue: {
      name: 'value',
      control: 'text',
      description: 'The specific value this button represents in the form state.',
      table: { category: 'ButtonGroup.Item Props' },
    },
    itemDisabled: {
      name: 'disabled',
      control: 'boolean',
      description: 'Disables a specific segment natively.',
      table: { category: 'ButtonGroup.Item Props', defaultValue: { summary: 'false' } },
    },
    itemAsChild: {
      name: 'asChild',
      control: 'boolean',
      description: 'Merges props onto the immediate child instead of wrapping it in a `<button>`.',
      table: { category: 'ButtonGroup.Item Props', defaultValue: { summary: 'false' } },
    },
    
    onItemClick: {
      name: 'onClick',
      action: 'onClick (Item)',
      description: 'Triggered when the user clicks the specific item.',
      table: { category: 'ButtonGroup.Item Props' },
      control: false, 
    },
    onItemHover: {
      name: 'onHover',
      action: 'onHover (Item)',
      description: 'Triggered when the user hovers over the specific item. Maps to onMouseEnter.',
      table: { category: 'ButtonGroup.Item Props' },
      control: false, 
    },
    onItemLongClick: {
      name: 'onLongClick',
      action: 'onLongClick (Item)',
      description: 'Triggered when the user presses and holds the item for 500ms.',
      table: { category: 'ButtonGroup.Item Props' },
      control: false,
    },
  },
  args: {
    design: 'outline',
    orientation: 'horizontal',
    multiselect: false,
    darkMode: false,
    animate: false,
    animation: 'none',
    borderRadius: '0px',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    itemDisabled: false,
    itemAsChild: false,
    itemValue: 'daily',
  },
  render: ({ itemDisabled, itemValue, itemAsChild, onItemClick, onItemHover, onItemLongClick, ...args }) => (
    <ButtonGroup.Root {...args}>
      <ButtonGroup.Item 
        value={itemValue || 'daily'} 
        disabled={itemDisabled}
        asChild={itemAsChild}
        onClick={onItemClick}
        onHover={onItemHover}
        onLongClick={onItemLongClick}
      >
        {itemAsChild ? <span>{itemValue || 'Daily'} (Span)</span> : (itemValue || 'Daily')}
      </ButtonGroup.Item>
      
      <ButtonGroup.Item value="weekly">
        Weekly
      </ButtonGroup.Item>
      <ButtonGroup.Item value="monthly">
        Monthly
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  ),
};

export default meta;
type Story = StoryObj<ButtonGroupStoryArgs>;

// ---------------------------------------------------------------------------
// CORE VARIANTS
// ---------------------------------------------------------------------------

export const Outline: Story = {
  args: {
    design: 'outline',
    textColor: '#000000',
    backgroundColor: '#000000',
    hoverColor: '#333333',
    hoverTextColor: '#ffffff',
    darkBackgroundColor: '#ffffff',
    darkTextColor: '#ffffff',
    darkHoverColor: '#cccccc',
    darkHoverTextColor: '#000000',
  },
};

export const Material: Story = {
  args: {
    design: 'material',
    textColor: '#ffffff',
    backgroundColor: '#4f46e5',
    hoverColor: '#4338ca',
    darkBackgroundColor: '#3730a3',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#333333',
    darkBackgroundColor: '#1A1A1D',
    darkTextColor: '#90feb5',
  },
  render: (args) => (
    <div style={{ 
      padding: '4rem', 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      background: args.darkMode ? '#1A1A1D' : '#e0e5ec', 
      borderRadius: '16px',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <ButtonGroup.Root {...args}>
        <ButtonGroup.Item value="daily">Daily</ButtonGroup.Item>
        <ButtonGroup.Item value="weekly">Weekly</ButtonGroup.Item>
        <ButtonGroup.Item value="monthly">Monthly</ButtonGroup.Item>
      </ButtonGroup.Root>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Soft, extruded physical surface utilizing RGBA alpha overlays. Wrapped in a vivid padded container to showcase how the inset and extruded shadows blend into the parent surface intelligently.',
      },
      
    },
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#ffffff',
    textColor: '#464545',
    darkBackgroundColor: '#2a2a2a',
    darkTextColor: '#e0e0e0',
    borderRadius: '0px'
  },
  parameters: {
    docs: {
      description: {
        story: 'High-fidelity 3D realistic mechanical segmented control. Use for critical, tactile interactions.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// ANIMATIONS
// ---------------------------------------------------------------------------

export const TesseractAnimation: Story = {
  args: {
    design: 'material',
    animate: true,
    animation: 'prism',
    backgroundColor: '#800020',
    darkBackgroundColor: '#800020',
    textColor: '#ffffff',
    darkTextColor: '#ffffff',
    hoverColor: '#5a0016',
    darkHoverColor: '#5a0016',
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcases the 3D rotational face swap on hover using CSS preserve-3d. Applies strictly to `material` and `outline` ButtonGroup designs.',
      },
    },
  },
};



// ---------------------------------------------------------------------------
// LAYOUT & STATE
// ---------------------------------------------------------------------------

export const VerticalOrientation: Story = {
  args: {
    design: 'outline',
    orientation: 'vertical',
    textColor: '#000000',
    backgroundColor: '#000000',
  },
};

export const DarkModeOverride: Story = {
  args: {
    design: 'outline',
    darkMode: true,
    backgroundColor: '#800020',
    darkBackgroundColor: '#3730a3',
    textColor: '#ffffff',
    darkTextColor: '#ffffff',
    hoverColor: '#424242',
    darkHoverColor: '#0d0772',
    hoverTextColor: '#ffffff',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Forces the component into dark mode, overriding system or parent theme contexts.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// ANIMATIONS & TACTILE FEEDBACK
// ---------------------------------------------------------------------------

/**
 * **Tactile Animations & Transitions:**
 * Showcases the native hardware-accelerated CSS transitions. Click the items to observe 
 * the 3D mechanical depression mechanics and dynamic inset shadow morphing.
 */
export const TactileFeedback: Story = {
  render: (args) => (
    <div style={{ 
      padding: '3rem', 
      display: 'flex', 
      gap: '3rem', 
      flexDirection: 'column', 
      alignItems: 'center', 
      background: args.darkMode ? '#1A1A1D' : '#e0e5ec', 
      borderRadius: '16px',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: args.darkMode ? '#90feb5' : '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Mechanical 3D Press (Transform)
        </span>
        <ButtonGroup.Root {...args} design="skeuomorphic" backgroundColor={args.darkMode ? '#2a2a2a' : '#ffffff'} textColor={args.darkMode ? '#e0e0e0' : '#464545'}>
          <ButtonGroup.Item value="1">Tactile</ButtonGroup.Item>
          <ButtonGroup.Item value="2">Hardware</ButtonGroup.Item>
          <ButtonGroup.Item value="3">Switch</ButtonGroup.Item>
        </ButtonGroup.Root>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: args.darkMode ? '#90feb5' : '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Soft Extrusion (Shadow Morphing)
        </span>
        <ButtonGroup.Root {...args} design="neumorphic" backgroundColor={args.darkMode ? '#1A1A1D' : '#e0e5ec'} textColor={args.darkMode ? '#90feb5' : '#333333'}>
          <ButtonGroup.Item value="a">Fluid</ButtonGroup.Item>
          <ButtonGroup.Item value="b">Alpha</ButtonGroup.Item>
          <ButtonGroup.Item value="c">Overlay</ButtonGroup.Item>
        </ButtonGroup.Root>
      </div>
    </div>
  ),
  args: {
    multiselect: true, 
    darkMode: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcases the native hardware-accelerated cubic-bezier transitions, 3D mechanical depressing (`transform: translateY`), and dynamic inset shadow morphing native to the Mito UI ButtonGroup.',
      },
      source: {
        transform: () => `import { ButtonGroup } from '@emeraldemepraur/mito-ui';

// Skeuomorphic animation utilizes physical Y-axis transforms
<ButtonGroup.Root design="skeuomorphic">
  <ButtonGroup.Item value="1">Tactile</ButtonGroup.Item>
  <ButtonGroup.Item value="2">Hardware</ButtonGroup.Item>
</ButtonGroup.Root>

// Neumorphic animation utilizes RGBA box-shadow inversion
<ButtonGroup.Root design="neumorphic">
  <ButtonGroup.Item value="a">Fluid</ButtonGroup.Item>
  <ButtonGroup.Item value="b">Alpha</ButtonGroup.Item>
</ButtonGroup.Root>`,
      },
    },
  },
};


// ---------------------------------------------------------------------------
// FORMIK INTEGRATION
// ---------------------------------------------------------------------------

/**
 * **Interactive Form Test:**
 * Click the segments to observe the Formik context automatically evaluate and sync active bounds. 
 * Test the submission hook to see the payload.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    const handleMockSubmit = (values: any) => {
      alert(`Form Submitted! \n\nPayload: ${JSON.stringify(values, null, 2)}`);
      console.log('Mock Form Submitted:', values);
    };

    return (
      <Formik 
        initialValues={{ [args.alias || 'scheduleFrequency']: 'weekly' }} 
        onSubmit={handleMockSubmit}
      >
        {({ handleSubmit, values }) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', minWidth: '400px' }}>
            
            <ButtonGroup.Root {...args}>
              <ButtonGroup.Item value="daily">Daily</ButtonGroup.Item>
              <ButtonGroup.Item value="weekly">Weekly</ButtonGroup.Item>
              <ButtonGroup.Item value="monthly">Monthly</ButtonGroup.Item>
            </ButtonGroup.Root>
            
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#9f1239' }}>Live Formik State:</span>
              <pre style={{ margin: 0, fontFamily: 'monospace', color: '#374151', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>
            
            <button 
              type="button" 
              onClick={() => handleSubmit()} 
              style={{ cursor: 'pointer', padding: '10px 16px', backgroundColor: '#e11d48', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
            >
              Save Configuration
            </button>
          </div>
        )}
      </Formik>
    );
  },
  args: {
    alias: 'scheduleFrequency',
    multiselect: true,
    design: 'material',
    textColor: '#ffffff',
    backgroundColor: '#4f46e5',
    hoverColor: '#4338ca',
  },
  parameters: {
    docs: {
      source: {
        transform: () => `import { ButtonGroup } from '@emeraldemepraur/mito-ui';
import { Formik } from 'formik';

<Formik 
  initialValues={{ scheduleFrequency: 'weekly' }} 
  onSubmit={(values) => console.log(values)}
>
  {({ handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      <ButtonGroup.Root alias="scheduleFrequency" design="material" backgroundColor="#4f46e5" textColor="#ffffff">
        <ButtonGroup.Item value="daily">Daily</ButtonGroup.Item>
        <ButtonGroup.Item value="weekly">Weekly</ButtonGroup.Item>
        <ButtonGroup.Item value="monthly">Monthly</ButtonGroup.Item>
      </ButtonGroup.Root>
      
      <button type="submit">Save</button>
    </form>
  )}
</Formik>`,
      },
    },
  },
};