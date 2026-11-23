import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton, type ActionButtonProps } from './ActionButton';

const IconView = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);

const IconEdit = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
  </svg>
);

const IconDelete = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
);

const IconPower = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414 1.414a5 5 0 11-9.9 0L5.636 5.636a7 7 0 1012.728 0zM12 2v10"/>
  </svg>
);


const meta: Meta<ActionButtonProps> = {
  title: 'Buttons/ActionButton',
  component: ActionButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', 
    docs: {
      description: {
        component: 'Compact, highly interactive button component optimized for CRUD tables and toolbars. Supports long-press actions, dynamic hover injections, and ambient-aware 3D rendering.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // CORE
    // ----------------------------------------------------------------------
    icon: {
      control: false,
      description: 'The icon or text node to render centrally inside the button. Pass a raw SVG, FontAwesome icon, or string.',
      table: { category: 'Core', type: { summary: 'ReactNode' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Standard HTML attribute. Locks the button and renders a muted, un-clickable state.',
      table: { category: 'Core', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    
    // ----------------------------------------------------------------------
    // AESTHETIC & DESIGN CONTROLS
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The architectural design system variation dictating the visual styling.',
      table: { category: 'Aesthetic & Design', defaultValue: { summary: "'outline'" }, type: { summary: 'string' } }
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles an enterprise-grade realistic translucent glassmorphism aesthetic.',
      table: { category: 'Aesthetic & Design', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    tactile: {
      control: 'boolean',
      description: 'Enables a tactile physical hover effect with kinetic drop-shadow and translation transitions.',
      table: { category: 'Aesthetic & Design', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    hoverEffect: {
      control: 'select',
      options: ['subtle', 'medium', 'pronounced'],
      description: 'Dictates the severity/intensity of the tactile hover effect. Only applies if `tactile` is true.',
      table: { category: 'Aesthetic & Design', defaultValue: { summary: "'medium'" }, type: { summary: 'string' } }
    },
    size: {
      control: 'text',
      description: 'Uniform width and height dimension (e.g., "32px", "2rem", or 40).',
      table: { category: 'Aesthetic & Design', defaultValue: { summary: "'32px'" }, type: { summary: 'string | number' } }
    },
    
    // ----------------------------------------------------------------------
    // THEMING
    // ----------------------------------------------------------------------
    darkMode: {
      control: 'boolean',
      description: 'Force dark mode rendering independent of the global context.',
      table: { category: 'Theming', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    backgroundColor: { control: 'color', description: 'Explicit background color override for light mode contexts.', table: { category: 'Theming', type: { summary: 'string' } } },
    darkBackgroundColor: { control: 'color', description: 'Explicit background color override specifically for dark mode contexts.', table: { category: 'Theming', type: { summary: 'string' } } },
    borderColor: { control: 'color', description: 'Explicit border color override for specific variants (like outline).', table: { category: 'Theming', type: { summary: 'string' } } },
    textColor: { control: 'color', description: 'Explicit text/icon color override for light mode contexts.', table: { category: 'Theming', type: { summary: 'string' } } },
    darkTextColor: { control: 'color', description: 'Explicit text/icon color override specifically for dark mode contexts.', table: { category: 'Theming', type: { summary: 'string' } } },
    hoverTextColor: { control: 'color', description: 'Hover state text/icon color override.', table: { category: 'Theming', type: { summary: 'string' } } },
    hoverBackgroundColor: { control: 'color', description: 'Hover state background color override.', table: { category: 'Theming', type: { summary: 'string' } } },

    // ----------------------------------------------------------------------
    // 3D EXTRUSION
    // ----------------------------------------------------------------------
    elevation: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Neumorphic 3D extrusion distance in pixels.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '3' }, type: { summary: 'number' } }
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '1' }, type: { summary: 'number' } }
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Global lighting angle that dictates the X and Y shadow trajectories.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: 'top-left' }, type: { summary: 'string' } }
    },

    // ----------------------------------------------------------------------
    // INTERACTION & EVENTS
    // ----------------------------------------------------------------------
    onClick: {
      control: false,
      description: 'Standard click event handler.',
      table: { category: 'Interaction & Events', type: { summary: '(e) => void' } }
    },
    onLongClick: {
      control: false,
      description: 'Fired when the button is held down continuously for a specified duration.',
      table: { category: 'Interaction & Events', type: { summary: '(e) => void' } }
    },
    longClickDuration: {
      control: 'number',
      description: 'Duration in milliseconds required to trigger the onLongClick event.',
      table: { category: 'Interaction & Events', defaultValue: { summary: '500' }, type: { summary: 'number' } }
    },
    onHover: {
      control: false,
      description: 'Callback fired whenever the hover state enters or leaves.',
      table: { category: 'Interaction & Events', type: { summary: '(isHovered: boolean) => void' } }
    },
    
    // ----------------------------------------------------------------------
    // UNIVERSAL
    // ----------------------------------------------------------------------
    className: { control: 'text', description: 'Standard CSS class name appended directly to the element.', table: { category: 'Universal', type: { summary: 'string' } } },
    style: { control: 'object', description: 'Inline modification style rules object.', table: { category: 'Universal', type: { summary: 'React.CSSProperties' } } },
  },
  args: {
    design: 'outline',
    trueGlass: false,
    tactile: true,
    hoverEffect: 'medium',
    size: '32px',
    darkMode: false,
    disabled: false,
    elevation: 3,
    neuIntensity: 1,
    lightSource: 'top-left',
  }
};

export default meta;
type Story = StoryObj<ActionButtonProps>;

// ---------------------------------------------------------------------------
// 1. PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: '32px', backgroundColor: args.darkMode ? '#0f172a' : '#f8fafc', borderRadius: '12px' }}>
      <ActionButton {...args} icon={<IconEdit />} onClick={() => alert('Button Clicked!')} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The baseline interactive component playground. Use the controls panel to live-edit props like `design`, `tactile`, `size`, and various hover colors.',
      },
      source: {
        code: `
import { ActionButton } from '@emeraldemperaur/mito-ui';
import { EditIcon } from 'lucide-react';

export const Example = () => (
  <ActionButton 
    icon={<EditIcon size={16} />} 
    design="outline" 
    tactile={true} 
    onClick={() => console.log('Clicked!')} 
  />
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 2. DATA TABLE CRUD TOOLBAR
// ---------------------------------------------------------------------------
export const CrudToolbar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', padding: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <ActionButton 
        icon={<IconView />} 
        design="outline" 
        hoverTextColor="#3b82f6" 
        hoverBackgroundColor="#eff6ff"
        borderColor="#e2e8f0"
        title="View Record"
      />
      <ActionButton 
        icon={<IconEdit />} 
        design="outline" 
        hoverTextColor="#f59e0b" 
        hoverBackgroundColor="#fffbeb"
        borderColor="#e2e8f0"
        title="Edit Record"
      />
      <ActionButton 
        icon={<IconDelete />} 
        design="outline" 
        hoverTextColor="#ef4444" 
        hoverBackgroundColor="#fef2f2"
        borderColor="#e2e8f0"
        title="Delete Record"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The exact configuration used inside `DataTable` instances. Note the use of `hoverTextColor` and `hoverBackgroundColor` to give contextual intent (Blue for View, Yellow for Edit, Red for Delete) when hovered.',
      },
      source: {
        code: `
import { ActionButton } from '@emeraldemperaur/mito-ui';
import { ViewIcon, EditIcon, TrashIcon } from 'lucide-react';

export const TableActionsRow = () => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <ActionButton 
      icon={<ViewIcon size={16} />} 
      hoverTextColor="#3b82f6" 
      hoverBackgroundColor="#eff6ff"
      title="View Record"
    />
    <ActionButton 
      icon={<EditIcon size={16} />} 
      hoverTextColor="#f59e0b" 
      hoverBackgroundColor="#fffbeb"
      title="Edit Record"
    />
    <ActionButton 
      icon={<TrashIcon size={16} />} 
      hoverTextColor="#ef4444" 
      hoverBackgroundColor="#fef2f2"
      title="Delete Record"
    />
  </div>
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 3. LONG PRESS INTERACTION
// ---------------------------------------------------------------------------
const LongPressWrapper = () => {
  const [log, setLog] = useState<string>('Awaiting interaction...');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px', backgroundColor: '#f1f5f9', borderRadius: '12px' }}>
      <ActionButton 
        icon={<IconPower />} 
        design="skeuomorphic" 
        size="48px"
        tactile={true}
        hoverTextColor="#ef4444"
        onClick={() => setLog('Standard Click detected.')}
        onLongClick={() => setLog('LONG PRESS TRIGGERED! Executing command...')}
        longClickDuration={800}
      />
      <span style={{ fontFamily: 'monospace', color: '#475569', fontSize: '0.875rem' }}>{log}</span>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>(Click normally vs. Hold for 800ms)</p>
    </div>
  );
};

export const LongPressAction: Story = {
  render: () => <LongPressWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the `onLongClick` capability. Perfect for destructive actions (like hardware resets or deletes) that require intentional, prolonged tactile engagement from the user to prevent accidental clicks.',
      },
      source: {
        code: `
import { useState } from 'react';
import { ActionButton } from '@emeraldemperaur/mito-ui';
import { PowerIcon } from 'lucide-react';

export const SystemRebootButton = () => {
  const [log, setLog] = useState('');

  return (
    <ActionButton 
      icon={<PowerIcon size={20} />} 
      design="skeuomorphic"
      size="48px"
      tactile={true}
      hoverTextColor="#ef4444"
      onClick={() => setLog('Standard Click ignored.')}
      onLongClick={() => setLog('SYSTEM REBOOT INITIATED!')}
      longClickDuration={800}
    />
  );
};
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 4. TACTILE HOVER VARIATIONS
// ---------------------------------------------------------------------------
export const TactileKinetics: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', padding: '32px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <ActionButton icon={<IconEdit />} design="outline" tactile={true} hoverEffect="subtle" size="40px" />
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Subtle</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <ActionButton icon={<IconEdit />} design="outline" tactile={true} hoverEffect="medium" size="40px" />
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Medium</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <ActionButton icon={<IconEdit />} design="outline" tactile={true} hoverEffect="pronounced" size="40px" />
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Pronounced</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'By setting `tactile={true}`, buttons receive a physical translation and drop-shadow on hover. The `hoverEffect` prop modifies the intensity (`subtle`, `medium`, `pronounced`).',
      },
      source: {
        code: `
import { ActionButton } from '@emeraldemperaur/mito-ui';
import { EditIcon } from 'lucide-react';

export const TactileShowcase = () => (
  <div style={{ display: 'flex', gap: '32px' }}>
    <ActionButton icon={<EditIcon />} tactile={true} hoverEffect="subtle" />
    <ActionButton icon={<EditIcon />} tactile={true} hoverEffect="medium" />
    <ActionButton icon={<EditIcon />} tactile={true} hoverEffect="pronounced" />
  </div>
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 5. DESIGN VARIANTS & GLASSMORPHISM
// ---------------------------------------------------------------------------
export const ArchitecturalVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px', backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span style={{ width: '120px', color: '#94a3b8', fontSize: '0.875rem' }}>Material</span>
        <ActionButton icon={<IconView />} design="material" darkMode={true} />
        <ActionButton icon={<IconView />} design="material" darkMode={true} trueGlass={true} />
        <span style={{ color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic' }}>&larr; trueGlass</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span style={{ width: '120px', color: '#94a3b8', fontSize: '0.875rem' }}>Outline</span>
        <ActionButton icon={<IconView />} design="outline" darkMode={true} />
        <ActionButton icon={<IconView />} design="outline" darkMode={true} trueGlass={true} />
        <span style={{ color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic' }}>&larr; trueGlass</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span style={{ width: '120px', color: '#94a3b8', fontSize: '0.875rem' }}>Neumorphic</span>
        <ActionButton icon={<IconView />} design="neumorphic" darkMode={true} backgroundColor="#1e293b" />
        <ActionButton icon={<IconView />} design="neumorphic" darkMode={true} trueGlass={true} backgroundColor="#1e293b" />
        <span style={{ color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic' }}>&larr; trueGlass</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span style={{ width: '120px', color: '#94a3b8', fontSize: '0.875rem' }}>Skeuomorphic</span>
        <ActionButton icon={<IconView />} design="skeuomorphic" darkMode={true} backgroundColor="#1e293b" />
        <ActionButton icon={<IconView />} design="skeuomorphic" darkMode={true} trueGlass={true} backgroundColor="#1e293b" />
        <span style={{ color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic' }}>&larr; trueGlass</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcases all structural variants natively routing to dark mode contexts, alongside their `trueGlass` counter-parts which introduce frosted `backdrop-filter` rendering.',
      },
      source: {
        code: `
import { ActionButton } from '@emeraldemperaur/mito-ui';
import { ViewIcon } from 'lucide-react';

export const VariantShowcase = () => (
  <div style={{ background: '#0f172a', padding: '32px' }}>
    {/* Solid Variants */}
    <ActionButton icon={<ViewIcon />} design="material" darkMode={true} />
    <ActionButton icon={<ViewIcon />} design="outline" darkMode={true} />
    <ActionButton icon={<ViewIcon />} design="neumorphic" darkMode={true} />
    <ActionButton icon={<ViewIcon />} design="skeuomorphic" darkMode={true} />

    {/* trueGlass Variants (Frosted overlays) */}
    <ActionButton icon={<ViewIcon />} design="outline" darkMode={true} trueGlass={true} />
    <ActionButton icon={<ViewIcon />} design="skeuomorphic" darkMode={true} trueGlass={true} />
  </div>
);
        `
      }
    }
  }
};