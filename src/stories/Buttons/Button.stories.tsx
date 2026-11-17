import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * Master interactive button element built for the Mito UI ecosystem. 
 * Features SSR-safe attribute bindings, dynamic background adaptation, and WCAG 2.1 AA compliance.
 */
const meta: Meta<typeof Button> = {
  title: 'Buttons/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Agents and developers must adhere to these strict types to prevent UI thread blocking and style pollution. Inline styles are strictly prohibited on the wrapper; use the designated color props.',
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
    variant: {
      control: 'select',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The core architectural design variant of the button.',
      table: { category: 'Design System', defaultValue: { summary: 'material' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },

    // --- Animations ---
    animate: {
      control: 'boolean',
      description: 'Enables complex interactions. WARNING: Only applies when variant is "material" or "outline".',
      table: { category: 'Animations', defaultValue: { summary: 'false' } },
      if: { arg: 'variant', eq: 'material' }, 
    },
    animation: {
      control: 'radio',
      options: ['none', 'bubble', 'prism'],
      description: 'The specific animation topology to apply when `animate` is true.',
      table: { category: 'Animations', defaultValue: { summary: 'none' } },
      if: { arg: 'animate', eq: true }, 
    },

    // --- Theming & Styling (CSS Variable Injections) ---
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
      description: 'Font family override to match specific UI brand primitives.',
      table: { category: 'Typography' },
    },
     className: {
      control: 'text',
      description: 'Component CSS class name override injection',
      table: { category: 'Theming' },
    },

    // --- State & Behaviors ---
    isLoading: {
      control: 'boolean',
      description: 'Toggles an active execution status layout, disables node, updates WCAG trees.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Native HTML disabled state.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Delegates rendering to the immediate child element via Radix Slot. Conflicts with `prism`.',
      table: { category: 'Advanced', defaultValue: { summary: 'false' } },
    },
    children: {
      control: 'text',
      description: 'Button content.',
      table: { category: 'Content' },
    },
    id: {
      control: 'text',
      description: 'Unique identifier for strict DOM querying and linking WCAG ARIA attributes.',
      table: { category: 'Content' },
    },

    // --- Interactions / Events ---
    onClick: {
      action: 'clicked',
      description: 'Standard native click event.',
      table: { category: 'Events' },
    },
    onHover: {
      action: 'hovered',
      description: 'Triggered when the user hovers over the button. Maps to onMouseEnter.',
      table: { category: 'Events' },
    },
    onLongClick: {
      action: 'long-clicked',
      description: 'Triggered when the user presses and holds the button for 500ms.',
      table: { category: 'Events' },
    },
  },
  args: {
    children: 'DEPLOY AGENT',
    variant: 'material',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    animate: false,
    animation: 'none',
    isLoading: false,
    disabled: false,
    darkMode: false,
    asChild: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ---------------------------------------------------------------------------
// CORE VARIANTS
// ---------------------------------------------------------------------------

export const Material: Story = {
  args: {
    variant: 'material',
    textColor: '#ffffff',
    darkTextColor: '#ffffff',
    backgroundColor: '#800020',
    darkBackgroundColor: '#000000'
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    textColor: '#ffffff',
    darkTextColor: '#ffffff',
    backgroundColor: '#000000',
    darkBackgroundColor: '#800020'
  },
};

export const Neumorphic: Story = {
  args: {
    variant: 'neumorphic',
    backgroundColor: '#e0e5ec', 
    textColor: '#000000',
    darkBackgroundColor: '#e0e5ec',
    darkTextColor: '#000000'
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft, extruded physical surface utilizing RGBA alpha overlays. Adapts to parent backgrounds.',
      },
    },
  },
};

export const Skeuomorphic: Story = {
  args: {
    variant: 'skeuomorphic',
    backgroundColor: '#ffffff',
    darkBackgroundColor: '#ffffff',
    textColor: '#464545',
    darkTextColor: '#464545'
  },
  parameters: {
    docs: {
      description: {
        story: 'High-fidelity 3D realistic mechanical button for critical, tactile interactions.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// ANIMATIONS
// ---------------------------------------------------------------------------

export const BubbleAnimation: Story = {
  args: {
    variant: 'material',
    animate: true,
    animation: 'bubble',
    backgroundColor: '#000000',
    darkBackgroundColor: '#000000',
    darkTextColor: "#ffffff",
    textColor: '#ffffff',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gooey liquid explosion on hover utilizing an inline SVG filter. **Note:** Only applies to `material` and `outline` variants.',
      },
    },
  },
};

export const TesseractAnimation: Story = {
  args: {
    variant: 'material',
    animate: true,
    animation: 'prism',
    backgroundColor: '#000000',
    darkBackgroundColor: '#000000',
    darkTextColor: '#ffffff',
    textColor: '#ffffff',
  },
  parameters: {
    docs: {
      description: {
        story: '3D rotational face swap on hover using CSS preserve-3d. **Note:** May conflict with `asChild` Radix Slot delegation.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// STATES & CONTEXTS
// ---------------------------------------------------------------------------

export const LoadingState: Story = {
  args: {
    variant: 'material',
    isLoading: true,
    backgroundColor: '#000000',
    textColor: '#ffffff',
    darkBackgroundColor: '#000000',
    darkTextColor: '#ffffff'
  },
  parameters: {
    docs: {
      description: {
        story: 'Automatically disables the interaction node and updates WCAG accessibility trees (`aria-busy`, `aria-live`).',
      },
    },
  },
};

export const DarkModeOverride: Story = {
  args: {
    variant: 'material',
    darkMode: true,
    darkBackgroundColor: '#000000',
    darkTextColor: '#800020',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Forces the component into dark mode, overriding system or parent theme contexts. Ideal for placing buttons over dark cinematic hero backgrounds.',
      },
    },
  },
};

export const PolymorphicAsChild: Story = {
  args: {
    asChild: true,
    variant: 'outline',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    darkBackgroundColor: '#800020',
    darkTextColor: '#ffffff',
    children: <a href="https://example.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>External Link as Button</a>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Delegates styling and behavior to a nested anchor tag using Radix UI Slot.',
      },
    },
  },
};