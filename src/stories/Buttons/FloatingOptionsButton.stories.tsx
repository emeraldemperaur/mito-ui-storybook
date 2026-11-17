import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { FloatingOptionsButton } from './FloatingOptionsButton';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const ToolIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
);
const ShareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);


type FOBStoryArgs = React.ComponentProps<typeof FloatingOptionsButton.Root> & {
  itemDisabled?: boolean;
  itemAsChild?: boolean;
  onItemClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onItemHover?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onItemLongClick?: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
};


/**
 * Master state-managing wrapper for the rotating options cluster. 
 * Evaluates contextual lighting, enforces the 4-item radial grid, and deeply integrates with Formik.
 */
const meta: Meta<FOBStoryArgs> = {
  title: 'Buttons/FloatingOptionsButton',
  component: FloatingOptionsButton.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded', 
    docs: {
      description: {
        component: 'Agents and developers must adhere to strict structural constraints to prevent UI layout fractures. This component relies on a 2x2 CSS Grid architecture, meaning exactly 4 `<FloatingOptionsButton.Item>` children must be provided to maintain optimal circular symmetry.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode.replace(/render:.*?\(\)\s*=>\s*/, '').replace(/^\{\s*(<FloatingOptionsButton\.Root)/, '$1').replace(/(<\/FloatingOptionsButton\.Root>)\s*\}$/, '$1');
          const importStatement = `import { FloatingOptionsButton } from '@emeraldemepraur/mito-ui';\n\n`;
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
  argTypes: {
    // --- Architecture & Layout ---
    design: {
      control: 'radio',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The core architectural design variant propagating to all quadrant items.',
      table: { category: 'Design System', defaultValue: { summary: 'material' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    rotate: {
      control: 'boolean',
      description: 'Activates continuous linear rotation animation. Pauses on hover.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      description: 'Screen positioning anchoring.',
      table: { category: 'Layout', defaultValue: { summary: 'bottom-right' } },
    },
    offset: { 
      control: { type: 'number' },
      description: 'Distance from the designated screen edges in pixels.',
      table: { category: 'Layout', defaultValue: { summary: '32' } },
    },
    width: { 
      control: { type: 'number' },
      description: 'Overall width of the circular cluster.',
      table: { category: 'Layout', defaultValue: { summary: '120' } },
    },
    height: { 
      control: { type: 'number' },
      description: 'Overall height of the circular cluster.',
      table: { category: 'Layout', defaultValue: { summary: '120' } },
    },

    // --- State & Behaviors ---
    multiselect: {
      control: 'boolean',
      description: 'Enables selection of multiple quadrants concurrently.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    value: {
      control: 'text',
      description: 'Initial active value (or array of values if multiselect is true).',
      table: { category: 'State' },
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
    hoverColor: { control: 'color', table: { category: 'Theming' } },
    darkHoverColor: { control: 'color', table: { category: 'Theming' } },
    hoverTextColor: { control: 'color', table: { category: 'Theming' } },
    darkHoverTextColor: { control: 'color', table: { category: 'Theming' } },
    textSize: { control: 'text', table: { category: 'Typography' } },
    fontFamily: { control: 'text', table: { category: 'Typography' } },

    // --- Events (Root) ---
    onChange: { action: 'onChange', description: 'Triggered when the selection state of the cluster changes.', table: { category: 'Events' }, control: false },

    // --- FloatingOptionsButton.Item Props ---
    itemDisabled: { name: 'disabled (Items)', control: 'boolean', description: 'Globally disables the quadrants.', table: { category: 'FloatingOptionsButton.Item Props' } },
    itemAsChild: { name: 'asChild (Items)', control: 'boolean', description: 'Merges quadrant props onto the immediate child.', table: { category: 'FloatingOptionsButton.Item Props' } },
    onItemClick: { name: 'onClick', action: 'onClick (Item)', description: 'Triggered when a specific quadrant is clicked.', table: { category: 'FloatingOptionsButton.Item Props' }, control: false },
    onItemHover: { name: 'onHover', action: 'onHover (Item)', description: 'Triggered when the user hovers over a quadrant.', table: { category: 'FloatingOptionsButton.Item Props' }, control: false },
    onItemLongClick: { name: 'onLongClick', action: 'onLongClick (Item)', description: 'Triggered when a quadrant is long-pressed for 500ms.', table: { category: 'FloatingOptionsButton.Item Props' }, control: false },
  },
  args: {
    design: 'material',
    position: 'bottom-right',
    offset: 32,
    width: 120,
    height: 120,
    rotate: false,
    multiselect: false,
    darkMode: false,
    elevation: 5,
    backgroundColor: '#000000',
    textColor: '#ffffff',
    itemDisabled: false,
    itemAsChild: false,
  },
  decorators: [
    (Story, context) => {
      const { design, darkMode, backgroundColor } = context.args;
      
      let bg = '#f8f9fa';
      if (darkMode) {
        bg = '#1A1A1D'; 
      } else if (design === 'neumorphic' || design === 'skeuomorphic') {
        bg = backgroundColor || '#e0e5ec'; 
      } else if (backgroundColor) {
        bg = '#e5e7eb'; 
      }

      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <div style={{ 
            height: '100vh', 
            width: '100%', 
            backgroundColor: bg,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px'
          }}>
            
            <Story />
          </div>
        </GlobalUIContext.Provider>
      );
    },
  ],
  render: ({ itemDisabled, itemAsChild, onItemClick, onItemHover, onItemLongClick, ...args }) => (
    <FloatingOptionsButton.Root {...args} style={{ position: 'absolute' }}>
      <FloatingOptionsButton.Item value="settings" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}>
        {itemAsChild ? <span><SettingsIcon /></span> : <SettingsIcon />}
      </FloatingOptionsButton.Item>
      <FloatingOptionsButton.Item value="user" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}>
        {itemAsChild ? <span><UserIcon /></span> : <UserIcon />}
      </FloatingOptionsButton.Item>
      <FloatingOptionsButton.Item value="tools" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}>
        {itemAsChild ? <span><ToolIcon /></span> : <ToolIcon />}
      </FloatingOptionsButton.Item>
      <FloatingOptionsButton.Item value="share" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}>
        {itemAsChild ? <span><ShareIcon /></span> : <ShareIcon />}
      </FloatingOptionsButton.Item>
    </FloatingOptionsButton.Root>
  ),
};

export default meta;
type Story = StoryObj<FOBStoryArgs>;

// ---------------------------------------------------------------------------
// CORE VARIANTS
// ---------------------------------------------------------------------------

export const Material: Story = {
  args: {
    design: 'material',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    hoverColor: '#333333',
    darkBackgroundColor: '#ffffff',
    darkTextColor: '#000000',
    darkHoverColor: '#cccccc',
  },
};

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

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#333333',
    darkBackgroundColor: '#1A1A1D',
    darkTextColor: '#90feb5',
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft, extruded physical surface utilizing RGBA alpha overlays. **Features a quadrant-specific radiating ripple on click.** Canvas background dynamically matches `#e0e5ec` to showcase shadows accurately.',
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
  },
  parameters: {
    docs: {
      description: {
        story: 'High-fidelity 3D realistic mechanical button. Use for critical, tactile interactions.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// ROTATION & CONTEXTS
// ---------------------------------------------------------------------------

export const Rotate: Story = {
  args: {
    design: 'outline',
    rotate: true,
    backgroundColor: '#000000',
    textColor: '#000000',
    hoverColor: '#333333',
    hoverTextColor: '#ffffff',
  },
  parameters: {
    docs: {
      description: {
        story: 'Activates continuous linear rotation animation across the entire cluster. Automatically pauses on hover to allow precise item selection.',
      },
    },
  },
};

export const DarkModeOverride: Story = {
  args: {
    design: 'material',
    darkMode: true,
    backgroundColor: '#800020',
    darkBackgroundColor: '#ffffff',
    darkTextColor: '#393838',
    textColor: '#000000',
    hoverColor: '#e0e0e0',
    hoverTextColor: '#000000',
    darkHoverTextColor: '#800020'
  },
  parameters: {
    docs: {
      description: {
        story: 'Forces the component into dark mode, overriding system or parent theme contexts. The custom decorator automatically adapts the preview background to `#1A1A1D`.',
      },
    },
  },
};


// ---------------------------------------------------------------------------
// FORMIK & STATE INTEGRATION
// ---------------------------------------------------------------------------

/**
 * **Standard State Test:**
 * Showcases how to use the FloatingOptionsButton outside of Formik using React's standard `useState` and the `onChange` event callback.
 */
export const StandardStateExample: Story = {
  render: ({ onItemClick, onItemHover, onItemLongClick, itemDisabled, itemAsChild, ...args }) => {
    const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>([]);

    const handleSelectionChange = (payload: any) => {
      setSelectedOptions(payload);
      console.log("Current Selection:", payload);
    };

    const handleSubmit = () => {
      alert(`Submitting values: ${selectedOptions.join(', ')}`);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px', margin: '40px auto' }}>
        
        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#0f766e' }}>Local State Selection:</span>
          <pre style={{ margin: 0, fontFamily: 'monospace', color: '#374151', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(selectedOptions, null, 2)}
          </pre>
        </div>
        
        <button 
          type="button" 
          onClick={handleSubmit} 
          style={{ cursor: 'pointer', padding: '10px 16px', backgroundColor: '#0d9488', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', position: 'relative', zIndex: 10000 }}
        >
          Submit Selection
        </button>

        <FloatingOptionsButton.Root 
          {...args} 
          value={selectedOptions}
          onChange={handleSelectionChange}
          style={{ position: 'absolute' }}
        >
          <FloatingOptionsButton.Item value="settings" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}><SettingsIcon /></FloatingOptionsButton.Item>
          <FloatingOptionsButton.Item value="user" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}><UserIcon /></FloatingOptionsButton.Item>
          <FloatingOptionsButton.Item value="tools" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}><ToolIcon /></FloatingOptionsButton.Item>
          <FloatingOptionsButton.Item value="share" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}><ShareIcon /></FloatingOptionsButton.Item>
        </FloatingOptionsButton.Root>
      </div>
    );
  },
  args: {
    multiselect: true,
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#333333',
  },
  parameters: {
    docs: {
      source: {
        code: `import React, { useState } from 'react';
import { FloatingOptionsButton } from '@emeraldemepraur/mito-ui';

export const StandardOptionsExample = () => {
  const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>([]);

  return (
    <FloatingOptionsButton.Root
      design="neumorphic"
      multiselect={true}
      value={selectedOptions}
      onChange={(payload) => setSelectedOptions(payload)}
    >
      <FloatingOptionsButton.Item value="option_1"><span>1</span></FloatingOptionsButton.Item>
      <FloatingOptionsButton.Item value="option_2"><span>2</span></FloatingOptionsButton.Item>
      <FloatingOptionsButton.Item value="option_3"><span>3</span></FloatingOptionsButton.Item>
      <FloatingOptionsButton.Item value="option_4"><span>4</span></FloatingOptionsButton.Item>
    </FloatingOptionsButton.Root>
  );
};`,
      },
    },
  },
};


/**
 * **Interactive Form Test:**
 * Showcases deep integration with Formik. Click the radial quadrants to observe the Formik context automatically evaluate and sync active bounds. 
 * Because `multiselect` is enabled, multiple quadrants can be toggled simultaneously.
 */
export const InteractiveFormTest: Story = {
  render: ({ onItemClick, onItemHover, onItemLongClick, itemDisabled, itemAsChild, ...args }) => {
    return (
      <Formik 
        initialValues={{ [args.alias || 'quadrantSelection']: ['user'] }} 
        onSubmit={(values, { setSubmitting }) => {
          console.log("Formik Submitted Values:", values);
          alert(`Formik Payload: ${JSON.stringify(values, null, 2)}`);
          setSubmitting(false);
        }}
      >
        {(formikProps) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px', margin: '40px auto' }}>
            
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#9f1239' }}>Live Formik State ({args.alias}):</span>
              <pre style={{ margin: 0, fontFamily: 'monospace', color: '#374151', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(formikProps.values, null, 2)}
              </pre>
            </div>
            
            <button 
              type="submit" 
              disabled={formikProps.isSubmitting}
              style={{ cursor: 'pointer', padding: '10px 16px', backgroundColor: '#e11d48', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', position: 'relative', zIndex: 10000 }}
            >
              Submit Formik
            </button>

            <FloatingOptionsButton.Root {...args} formikContext={formikProps} style={{ position: 'absolute' }}>
              <FloatingOptionsButton.Item value="settings" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}><SettingsIcon /></FloatingOptionsButton.Item>
              <FloatingOptionsButton.Item value="user" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}><UserIcon /></FloatingOptionsButton.Item>
              <FloatingOptionsButton.Item value="tools" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}><ToolIcon /></FloatingOptionsButton.Item>
              <FloatingOptionsButton.Item value="share" disabled={itemDisabled} asChild={itemAsChild} onClick={onItemClick} onHover={onItemHover} onLongClick={onItemLongClick}><ShareIcon /></FloatingOptionsButton.Item>
            </FloatingOptionsButton.Root>
          </Form>
        )}
      </Formik>
    );
  },
  args: {
    alias: 'quadrantSelection',
    multiselect: true,
    design: 'material',
    textColor: '#ffffff',
    backgroundColor: '#4f46e5',
    hoverColor: '#4338ca',
  },
  parameters: {
    docs: {
      source: {
        code: `import React from 'react';
import { Formik, Form } from 'formik';
import { FloatingOptionsButton } from '@emeraldemepraur/mito-ui';

export const FormikOptionsExample = () => {
  return (
    <Formik
      initialValues={{ quadrantSelection: ['option_2'] }}
      onSubmit={(values) => console.log("Formik Submitted Values:", values.quadrantSelection)}
    >
      {(formikProps) => (
        <Form>
          <button type="submit" disabled={formikProps.isSubmitting}>Submit Formik</button>

          <FloatingOptionsButton.Root 
            design="material" 
            multiselect={true} 
            alias="quadrantSelection"
            formikContext={formikProps}
          >
            <FloatingOptionsButton.Item value="option_1"><span>1</span></FloatingOptionsButton.Item>
            <FloatingOptionsButton.Item value="option_2"><span>2</span></FloatingOptionsButton.Item>
            <FloatingOptionsButton.Item value="option_3"><span>3</span></FloatingOptionsButton.Item>
            <FloatingOptionsButton.Item value="option_4"><span>4</span></FloatingOptionsButton.Item>
          </FloatingOptionsButton.Root>
        </Form>
      )}
    </Formik>
  );
};`,
      },
    },
  },
};