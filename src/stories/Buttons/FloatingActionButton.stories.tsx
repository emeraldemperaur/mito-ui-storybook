import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FloatingActionButton } from './FloatingActionButton';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/**
 * Enterprise-grade Floating Action Button (FAB). Features intelligent background assimilation for 3D variants, 
 * hardware-accelerated ripple mechanics, and strict accessibility requirements.
 */
const meta: Meta<typeof FloatingActionButton> = {
  title: 'Buttons/FloatingActionButton',
  component: FloatingActionButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', 
    viewport: { defaultViewport: 'mobile1' }, 
    docs: {
      description: {
        component: 'Agents and developers must strictly map layout coordinates via the `position` and `offset` props to prevent overlapping fixed nodes.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          const importStatement = `import { FloatingActionButton } from '@emeraldemepraur/mito-ui';\n\n`;
          return `${importStatement}${cleanCode.trim()}`;
        },
      },
    },
  },
  args: {
    icon: 'Plus' as unknown as React.ReactNode, 
    ariaLabel: 'Create new item',
    design: 'material',
    position: 'bottom-right',
    offset: 32,
    size: 64,
    darkMode: false,
  },
  argTypes: {
    icon: {
      control: 'select',
      options: ['Plus', 'Send'],
      mapping: {
        Plus: <PlusIcon />,
        Send: <SendIcon />,
      },
      description: 'The primary SVG or icon node to render inside the FAB center.',
      table: { category: 'Content' },
    },

    // --- Architecture & Layout ---
    design: {
      control: 'radio',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The core architectural design variant.',
      table: { category: 'Design System', defaultValue: { summary: 'material' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system contexts.',
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
      description: 'Margin offset from the anchored screen corner in pixels.',
      table: { category: 'Layout', defaultValue: { summary: '32' } },
    },
    size: { 
      control: { type: 'range', min: 40, max: 96, step: 4 },
      description: 'Diameter of the circular button in pixels.',
      table: { category: 'Layout', defaultValue: { summary: '64' } },
    },
    elevation: {
      control: { type: 'range', min: 1, max: 15, step: 1 },
      description: 'Controls the perceived physical distance of the component from its background plane on the Z-axis (Neumorphic/Skeuomorphic).',
      table: { category: '3D Parameters', defaultValue: { summary: '5' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'A mathematical multiplier applied to the opacity of both the light highlight and dark shadow channels.',
      table: { category: '3D Parameters', defaultValue: { summary: '1' } },
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Dictates the simulated directional angle of the global environment light source.',
      table: { category: '3D Parameters', defaultValue: { summary: 'top-left' } },
    },

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
    onClick: { action: 'onClick', description: 'Standard click event handler.', table: { category: 'Events' }, control: false },
    onHover: { action: 'onHover', description: 'Triggered when the user hovers over the button.', table: { category: 'Events' }, control: false },
    onLongClick: { action: 'onLongClick', description: 'Triggered when the user presses and holds the button for 500ms.', table: { category: 'Events' }, control: false },
  },
  decorators: [
    (Story, context) => {
      const { design, darkMode, backgroundColor, darkBackgroundColor } = context.args;
      
      let bg = '#f8f9fa';
      if (darkMode) {
        bg = darkBackgroundColor || '#1A1A1D';
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
            overflow: 'hidden'
          }}>
            <Story />
          </div>
        </GlobalUIContext.Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof FloatingActionButton>;

// ---------------------------------------------------------------------------
// CORE VARIANTS
// ---------------------------------------------------------------------------

export const MaterialBottomRight: Story = {
  args: {
    design: 'material',
    position: 'bottom-right',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    hoverColor: '#333333',
    darkBackgroundColor: '#ffffff',
    darkTextColor: '#000000',
    darkHoverColor: '#cccccc',
  },
};

export const OutlineTopLeft: Story = {
  args: {
    design: 'outline',
    position: 'top-left',
    size: 56,
    textColor: '#000000',
    backgroundColor: '#000000', 
    hoverColor: '#333333',
    hoverTextColor: '#ffffff',
  },
};

export const NeumorphicCenteredBottom: Story = {
  args: {
    design: 'neumorphic',
    position: 'bottom-right',
    offset: 32,
    lightSource: 'top-left',
    elevation: 6,
    backgroundColor: '#e0e5ec',
    textColor: '#333333',
    icon: 'Send' as unknown as React.ReactNode,
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft, extruded physical surface utilizing RGBA alpha overlays. **Features a dual-wave ripple animation on click.** Canvas background dynamically matches `#e0e5ec` to showcase shadows accurately.',
      },
    },
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    position: 'bottom-left',
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


export const DarkModeOverride: Story = {
  args: {
    design: 'outline',
    darkMode: true,
    position: 'bottom-right',
    backgroundColor: '#ffffff',
    textColor: '#ffffff',
    hoverColor: '#e0e0e0',
    hoverTextColor: '#000000',
  },
  parameters: {
    docs: {
      description: {
        story: 'Forces the component into dark mode, overriding system or parent theme contexts. The custom decorator automatically adapts the preview background to `#1A1A1D`.',
      },
    },
  },
};