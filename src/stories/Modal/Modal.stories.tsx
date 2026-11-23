import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalTitle, type ModalProps } from './Modal';
import { Button } from '../Buttons/Button';
import '../../styles/fonts.scss';
import { Input } from '../Inputs/Input';


const ICONS = {
  none: null,
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#10b981' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#f59e0b' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#ef4444' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#3b82f6' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#6b7280' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  security: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#8b5cf6' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

export interface ModalStoryProps extends ModalProps {
  brandLightColor?: string;
  brandDarkColor?: string;
  selectedIcon?: keyof typeof ICONS;
  
  confirmBtnBg?: string;
  confirmBtnText?: string;
  cancelBtnBg?: string;
  cancelBtnText?: string;
}

/**
 * The `Modal` is a master enterprise composite overlay. Natively supports dynamic z-index stacking for 
 * associated/nested modals, rigorous body scroll-locking, CSS container adaptations, and deep 3D structural aesthetics.
 */
const meta: Meta<ModalStoryProps> = {
  title: 'Information/Modal',
  component: Modal as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', 
    docs: {
      story: { 
        inline: true, 
      },
      description: {
        component: 'Renders a strictly controlled portal overlay. The component intelligently manages its own z-index state for infinitely nested modals, locks body scrolling, and provides highly adaptive layout architectures (drawers, notifications, bottom sheets). Note: In these examples, React Portals are used to ensure the overlay spans the entire viewport perfectly.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // CORE VISIBILITY
    // ----------------------------------------------------------------------
    isOpen: {
      control: 'boolean',
      description: 'Controls the visibility state of the modal.',
      table: { category: 'Core State', type: { summary: 'boolean' } }
    },
    onClose: {
      control: false,
      description: 'Callback fired when the overlay is clicked, the escape key is pressed, or the default close button is triggered.',
      table: { category: 'Core State', type: { summary: '() => void' } }
    },

    // ----------------------------------------------------------------------
    // UNIVERSAL ATTRIBUTES
    // ----------------------------------------------------------------------
    className: {
      control: 'text',
      description: 'Standard CSS class name appended directly to the modal container element.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } }
    },
    asChild: {
      control: 'boolean',
      description: 'If true, merges component DOM into the immediate child via Radix Slot.',
      table: { category: 'Universal Attributes', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },

    // ----------------------------------------------------------------------
    // LAYOUT & POSITIONING
    // ----------------------------------------------------------------------
    layout: {
      control: 'select',
      options: ['fullscreen', 'xl', 'medium', 'top', 'bottom', 'left', 'right'],
      description: 'Structural blueprint of the modal. Controls width, height, and entrance animation trajectory.',
      table: { 
        category: 'Layout & Positioning', 
        defaultValue: { summary: 'medium' },
        type: { summary: "'fullscreen' | 'xl' | 'medium' | 'top' | 'bottom' | 'left' | 'right'" } 
      }
    },
    position: {
      control: 'select',
      options: ['left', 'center', 'right', 'full'],
      description: "Alignment on the X-axis. Only applies when layout is 'top' or 'bottom'.",
      table: { 
        category: 'Layout & Positioning', 
        defaultValue: { summary: 'center' },
        type: { summary: "'left' | 'center' | 'right' | 'full'" } 
      }
    },

    // ----------------------------------------------------------------------
    // COMPOSITE INJECTIONS
    // ----------------------------------------------------------------------
    title: {
      control: 'text',
      description: 'Optional standard title injected into the default header.',
      table: { category: 'Composite Injections', type: { summary: 'string' } }
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle or description injected immediately below the title in the default header.',
      table: { category: 'Composite Injections', type: { summary: 'string' } }
    },
    icon: {
      control: false,
      description: 'Optional React Node placed adjacent to the standard title.',
      table: { category: 'Composite Injections', type: { summary: 'ReactNode' } }
    },
    iconPosition: {
      control: 'select',
      options: ['left-of-title', 'right-of-title'],
      description: "Explicit instruction dictating the icon's position relative to the title/subtitle flexbox.",
      table: { category: 'Composite Injections', defaultValue: { summary: "'left-of-title'" }, type: { summary: "'left-of-title' | 'right-of-title'" } }
    },
    selectedIcon: {
      control: 'select',
      options: Object.keys(ICONS),
      description: 'Virtual Storybook control to inject 6 different SVG template icons into the `icon` prop.',
      table: { category: 'Composite Injections', type: { summary: 'string' } }
    },
    headerNode: {
      control: false,
      description: 'Completely replaces the default header block with a custom React Node.',
      table: { category: 'Composite Injections', type: { summary: 'ReactNode' } }
    },
    footerNode: {
      control: false,
      description: 'Completely replaces the default action footer block with a custom React Node.',
      table: { category: 'Composite Injections', type: { summary: 'ReactNode' } }
    },
    hideHeader: {
      control: 'boolean',
      description: 'Visually detaches and hides the header block entirely.',
      table: { category: 'Composite Injections', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    hideFooter: {
      control: 'boolean',
      description: 'Visually detaches and hides the footer block entirely.',
      table: { category: 'Composite Injections', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    headerJustify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
      description: 'Flexbox horizontal alignment for the header block.',
      table: { category: 'Composite Injections', defaultValue: { summary: 'space-between' }, type: { summary: 'string' } }
    },
    footerJustify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
      description: 'Flexbox horizontal alignment for the footer block.',
      table: { category: 'Composite Injections', defaultValue: { summary: 'flex-end' }, type: { summary: 'string' } }
    },

    // ----------------------------------------------------------------------
    // DEFAULT FOOTER OVERRIDES
    // ----------------------------------------------------------------------
    onConfirm: {
      control: false,
      description: "Callback fired by the default 'Confirm' button in the footer.",
      table: { category: 'Action Footer', type: { summary: '() => void | Promise<void>' } }
    },
    confirmText: {
      control: 'text',
      description: "Override text for the default 'Confirm' button.",
      table: { category: 'Action Footer', defaultValue: { summary: "'Confirm'" }, type: { summary: 'string' } }
    },
    cancelText: {
      control: 'text',
      description: "Override text for the default 'Cancel' button.",
      table: { category: 'Action Footer', defaultValue: { summary: "'Cancel'" }, type: { summary: 'string' } }
    },
    confirmVariant: {
      control: 'select',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: "Button aesthetic variant strictly for the primary Confirm action.",
      table: { category: 'Action Footer', type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" } }
    },
    isConfirmLoading: {
      control: 'boolean',
      description: 'Triggers the loading spinner state on the Confirm button, disabling interaction.',
      table: { category: 'Action Footer', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    
    // Virtual Map for Footer Overrides
    confirmButtonOverrides: { control: false, table: { category: 'Action Footer' } },
    cancelButtonOverrides: { control: false, table: { category: 'Action Footer' } },
    confirmBtnBg: { name: 'confirmButtonOverrides.backgroundColor', control: 'color', description: 'Background color override for the primary Confirm button.', table: { category: 'Action Footer' } },
    confirmBtnText: { name: 'confirmButtonOverrides.textColor', control: 'color', description: 'Text color override for the primary Confirm button.', table: { category: 'Action Footer' } },
    cancelBtnBg: { name: 'cancelButtonOverrides.backgroundColor', control: 'color', description: 'Background color override for the Cancel button.', table: { category: 'Action Footer' } },
    cancelBtnText: { name: 'cancelButtonOverrides.textColor', control: 'color', description: 'Text color override for the Cancel button.', table: { category: 'Action Footer' } },

    // ----------------------------------------------------------------------
    // AESTHETIC & DESIGN CONTROLS
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The architectural design system variation applied to the modal container.',
      table: { 
        category: 'Design Architecture', 
        defaultValue: { summary: 'material' },
        type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" }
      }
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles an enterprise-grade frosted glassmorphism aesthetic using backdrop filters.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    borderRadius: { 
      control: 'text', 
      description: "Explicit override for the container border radius.",
      table: { category: 'Dimensions', defaultValue: { summary: '16px' }, type: { summary: 'string | number' } } 
    },
    fontFamily: { 
      control: 'text', 
      description: 'Custom font family applied globally to the modal content.',
      table: { category: 'Typography', defaultValue: { summary: '"Bodoni Moda Variable", -apple-system, sans-serif' }, type: { summary: 'string' } } 
    },

    // ----------------------------------------------------------------------
    // THEMING
    // ----------------------------------------------------------------------
    darkMode: {
      control: 'boolean',
      description: 'Forces dark mode rendering independent of the global context.',
      table: { category: 'Theming: Global', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    darkModeColors: {
      control: false,
      description: 'Dynamic light/dark mode fallback color mapping for the active brand token.',
      table: { category: 'Theming: Global', type: { summary: '{ light: string; dark: string }' } }
    },
    brandLightColor: {
      name: 'darkModeColors.light',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.light` to bypass JSON editors.',
      table: { category: 'Theming: Global', type: { summary: 'string' } }
    },
    brandDarkColor: {
      name: 'darkModeColors.dark',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.dark` to bypass JSON editors.',
      table: { category: 'Theming: Global', type: { summary: 'string' } }
    },
    backgroundColor: { control: 'color', description: 'Explicit background color override for light mode contexts.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    textColor: { control: 'color', description: 'Explicit text color override for light mode contexts.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    titleColor: { control: 'color', description: 'Explicit title text color override for light mode.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    subtitleColor: { control: 'color', description: 'Explicit subtitle text color override for light mode.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    closeIconColor: { control: 'color', description: "Explicit override for the default 'X' close icon color.", table: { category: 'Theming: Global', type: { summary: 'string' } } },
    closeIconHoverColor: { control: 'color', description: "Explicit override for the default 'X' close icon hover background/text state.", table: { category: 'Theming: Global', type: { summary: 'string' } } },
    darkBackgroundColor: { control: 'color', description: 'Explicit background color override specifically for dark mode contexts.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },
    darkTextColor: { control: 'color', description: 'Explicit text color override specifically for dark mode contexts.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },
    darkTitleColor: { control: 'color', description: 'Explicit title text color override for dark mode.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },
    darkSubtitleColor: { control: 'color', description: 'Explicit subtitle text color override for dark mode.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },

    // ----------------------------------------------------------------------
    // 3D EXTRUSION
    // ----------------------------------------------------------------------
    elevation: {
      control: { type: 'range', min: 1, max: 24, step: 1 },
      description: 'Z-Axis elevation for 3D depth extrusion (Neumorphic/Skeuomorphic variants).',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '12' }, type: { summary: 'number' } }
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Multiplier for Neumorphic shadow intensity to ensure WCAG contrast.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '1' }, type: { summary: 'number' } }
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Global lighting angle that dictates the X and Y shadow trajectories.',
      table: { 
        category: '3D Extrusion (Neu/Skeuo)', 
        defaultValue: { summary: 'top-left' },
        type: { summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'" }
      }
    },
  },
  args: {
    isOpen: false,
    className: '',
    asChild: false,
    isConfirmLoading: false,
    layout: 'medium',
    position: 'center',
    selectedIcon: 'success',
    iconPosition: 'left-of-title',
    title: 'Standard Modal Title',
    subtitle: 'Provide optional context or instructions here.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    design: 'material',
    trueGlass: false,
    hideHeader: false,
    hideFooter: false,
    headerJustify: 'space-between',
    footerJustify: 'flex-end',
    borderRadius: '16px',
    darkMode: false,
    elevation: 12,
    neuIntensity: 1,
    lightSource: 'top-left',
    fontFamily: 'Libre Franklin',
    confirmBtnBg: '#06402B',
    cancelBtnBg: '#800020',
    cancelBtnText: '#ffffff',
    confirmBtnText: '#ffffff'
  }
};

export default meta;
type Story = StoryObj<ModalStoryProps>;


const PlaygroundWrapper = ({ 
  brandLightColor, 
  brandDarkColor, 
  selectedIcon, 
  confirmBtnBg, confirmBtnText, 
  cancelBtnBg, cancelBtnText, 
  ...args 
}: ModalStoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ textAlign: 'center', padding: '32px' }}>
      <Button variant="material" backgroundColor='#000000' darkBackgroundColor='#000000' textColor='#ffffff'
      darkTextColor='#ffffff' hoverColor='#800020' darkHoverColor='#800020' hoverTextColor='#ffffff' darkHoverTextColor='#ffffff' 
      onClick={() => setIsOpen(true)}>Launch Playground Modal</Button>
      {mounted && createPortal(
        <Modal 
          {...args}
          isOpen={isOpen}
          icon={selectedIcon && selectedIcon !== 'none' ? ICONS[selectedIcon] : null}
          darkModeColors={{ light: brandLightColor as string, dark: brandDarkColor as string }}
          confirmButtonOverrides={{ backgroundColor: confirmBtnBg, textColor: confirmBtnText, darkBackgroundColor: confirmBtnBg, darkTextColor: confirmBtnText }}
          cancelButtonOverrides={{ backgroundColor: cancelBtnBg, textColor: cancelBtnText, darkBackgroundColor: cancelBtnBg, darkTextColor: cancelBtnText }}
          onClose={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
        >
          <p style={{ margin: 0 }}>
            Use the modal property controls to dynamically adjust the architecture, 
            design variant, positioning and composition of this modal overlay in real-time.
          </p>
        </Modal>,
        document.body
      )}
    </div>
  );
};

export const InteractivePlayground: Story = {
  render: (args) => <PlaygroundWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to dynamically adjust layout architectures, design variants, positioning, and typography. The Modal natively accepts 6 pre-built SVG templates via the `icon` prop.',
      },
      source: {
        code: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const Playground = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Button variant="material" backgroundColor='#000000' darkBackgroundColor='#000000' textColor='#ffffff'
      darkTextColor='#ffffff' hoverColor='#800020' darkHoverColor='#800020' hoverTextColor='#ffffff' darkHoverTextColor='#ffffff' 
      onClick={() => setIsOpen(true)}>
        Launch Playground Modal
      </Button>

      {/* Wrapping the modal in a Portal ensures it covers the entire viewport */}
      {mounted && createPortal(
        <Modal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Standard Modal Title"
          subtitle="Provide optional context or instructions here."
          icon={<svg>...</svg>} 
          layout="medium"
          design="material"
          confirmText="Confirm"
          confirmButtonOverrides={{ backgroundColor: '#2563eb', textColor: '#ffffff' }}
          cancelButtonOverrides={{ backgroundColor: '#e5e7eb', textColor: '#1f2937' }}
          onConfirm={() => setIsOpen(false)}
        >
          <p>Use the controls to dynamically adjust the architecture.</p>
        </Modal>,
        document.body
      )}
    </>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. DESIGN ARCHITECTURES (INHERITED)
// ---------------------------------------------------------------------------
export const ArchitecturalVariants: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [openModal, setOpenModal] = useState<string | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mounted, setMounted] = useState(false);
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => setMounted(true), []);

    const baseProps = {
      title: 'Architectural Design Test',
      subtitle: 'Testing standard variant rendering.',
      fontFamily: 'Libre Franklin',
      onClose: () => setOpenModal(null),
      onConfirm: () => setOpenModal(null),
    };

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f1f5f9', padding: '48px', borderRadius: '16px', textAlign: 'center' }}>
        <Button variant="outline" backgroundColor='#000000' darkBackgroundColor='#000000' textColor='#ffffff' darkTextColor='#ffffff' onClick={() => setOpenModal('outline')}>Open Outline Modal</Button>
        <Button variant="material" backgroundColor='#800020' darkBackgroundColor='#800020' textColor='#ffffff' darkTextColor='#ffffff' onClick={() => setOpenModal('material')}>Open Material Modal</Button>
        <Button variant="neumorphic" onClick={() => setOpenModal('neumorphic')}>Open Neumorphic Modal</Button>
        <Button variant="skeuomorphic" onClick={() => setOpenModal('skeuomorphic')}>Open Skeuomorphic Modal</Button>

        {mounted && createPortal(
          <>
            <Modal isOpen={openModal === 'outline'} design="outline" cancelButtonOverrides={{backgroundColor:'#800020', darkBackgroundColor:'#800020', 
              textColor:'#ffffff', darkTextColor:'#ffffff'}} confirmButtonOverrides={{backgroundColor:'#06402B', darkBackgroundColor:'#06402B', 
              textColor:'#ffffff', darkTextColor:'#ffffff'}} {...baseProps}><p>Outline design variant</p></Modal>
            <Modal isOpen={openModal === 'material'} design="material" cancelButtonOverrides={{backgroundColor:'#800020', darkBackgroundColor:'#800020', 
              textColor:'#ffffff', darkTextColor:'#ffffff'}} confirmButtonOverrides={{backgroundColor:'#06402B', darkBackgroundColor:'#06402B', 
              textColor:'#ffffff', darkTextColor:'#ffffff'}} {...baseProps}><p>Material design variant</p></Modal>
            <Modal isOpen={openModal === 'neumorphic'} design="neumorphic" {...baseProps}><p>Neumorphic design variant</p></Modal>
            <Modal isOpen={openModal === 'skeuomorphic'} design="skeuomorphic" {...baseProps}><p>Skeuomorphic design variant</p></Modal>
          </>,
          document.body
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'The `Modal` intrinsically delegates rendering to the core `Card` architecture, seamlessly supporting all `design` paradigms (Material, Outline, Neumorphic, and Skeuomorphic) with perfect lighting inheritance.',
      },
      source: {
        code: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const ArchitecturalVariants = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleClose = () => setOpenModal(null);

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant="outline" onClick={() => setOpenModal('outline')}>Outline</Button>
      <Button variant="material" onClick={() => setOpenModal('material')}>Material</Button>
      <Button variant="neumorphic" onClick={() => setOpenModal('neumorphic')}>Neumorphic</Button>
      <Button variant="skeuomorphic" onClick={() => setOpenModal('skeuomorphic')}>Skeuomorphic</Button>

      {mounted && createPortal(
        <>
          <Modal isOpen={openModal === 'outline'} onClose={handleClose} design="outline" title="Design Test" onConfirm={handleClose} cancelButtonOverrides={{backgroundColor:'#800020', darkBackgroundColor:'#800020', 
              textColor:'#ffffff', darkTextColor:'#ffffff'}} confirmButtonOverrides={{backgroundColor:'#06402B', darkBackgroundColor:'#06402B', 
              textColor:'#ffffff', darkTextColor:'#ffffff'}}><p>Outline active.</p></Modal>
          <Modal isOpen={openModal === 'material'} onClose={handleClose} design="material" title="Design Test" onConfirm={handleClose} cancelButtonOverrides={{backgroundColor:'#800020', darkBackgroundColor:'#800020', 
              textColor:'#ffffff', darkTextColor:'#ffffff'}} confirmButtonOverrides={{backgroundColor:'#06402B', darkBackgroundColor:'#06402B', 
              textColor:'#ffffff', darkTextColor:'#ffffff'}}><p>Material active.</p></Modal>
          <Modal isOpen={openModal === 'neumorphic'} onClose={handleClose} design="neumorphic" title="Design Test" onConfirm={handleClose}><p>Neumorphic active.</p></Modal>
          <Modal isOpen={openModal === 'skeuomorphic'} onClose={handleClose} design="skeuomorphic" title="Design Test" onConfirm={handleClose}><p>Skeuomorphic active.</p></Modal>
        </>,
        document.body
      )}
    </div>
  );
};`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 3. TRUEGLASS (FROSTED GLASSMORPHISM)
// ---------------------------------------------------------------------------
export const TrueGlassVariant: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mounted, setMounted] = useState(false);
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => setMounted(true), []);

    return (
      <div style={{ textAlign: 'center', padding: '32px', backgroundImage: 'linear-gradient(to right, #800020 0%, #06402B 100%)', borderRadius: '16px' }}>
        <Button variant="material" onClick={() => setIsOpen(true)}>Launch trueGlass Modal</Button>
        {mounted && createPortal(
          <Modal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => setIsOpen(false)}
            design="material"
            trueGlass={true}
            title="Glassmorphism Active"
            subtitle="The background uses backdrop-filters."
            titleColor='#ffffff'
            subtitleColor='#ffffff'
          >
            <p style={{color: '#ffffff'}}>
              When <code>trueGlass</code> is enabled, the modal dynamically converts its opaque background into a translucent frosted glass pane, blurring the environment beneath it.
            </p>
          </Modal>,
          document.body
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'By setting the `trueGlass={true}` prop, the modal sheds its solid background color and implements a sophisticated `backdrop-filter: blur(24px)` effect. This creates a frosted cinematic overlay that interacts beautifully with complex underlying UI or vivid backgrounds.',
      },
      source: {
        code: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const TrueGlassExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Launch trueGlass Modal</Button>
      
      {mounted && createPortal(
        <Modal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
          design="material"
          trueGlass={true}
          title="Glassmorphism Active"
          subtitle="The background uses backdrop-filters."
          titleColor='#ffffff'
          subtitleColor='#ffffff'
        >
          <p style={{color: '#ffffff'}}>The opaque background is converted into a translucent frosted pane.</p>
        </Modal>,
        document.body
      )}
    </>
  );
};`,
      },
    },
  },
};


const NestedModalWrapper = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [modelName, setModelName] = useState("Alpha-Centauri Weights");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ textAlign: 'center', padding: '32px' }}>
      <Button backgroundColor='#002366' darkBackgroundColor='#002366' textColor='#ffffff' darkTextColor='#ffffff'
      hoverColor='#0034c3' darkHoverColor='#0034c3'
      onClick={() => setIsEditorOpen(true)}>Open Document Editor</Button>

      {mounted && createPortal(
        <>
          <Modal
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            layout="xl"
            design="material"
            title="Edit Neural Weights"
            subtitle="Adjust the hyper-parameters and network architecture configuration."
            footerNode={
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Button variant="outline" backgroundColor='#800020' darkBackgroundColor='#800020' textColor="#ffffff" 
                darkTextColor='#ffffff' onClick={() => setIsDeleteConfirmOpen(true)}>
                  Delete Model
                </Button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button variant="outline" backgroundColor='#800020' darkBackgroundColor='#800020' textColor='#ffffff' 
                  darkTextColor='#ffffff'  onClick={() => setIsEditorOpen(false)}>Cancel</Button>
                  <Button variant="material" backgroundColor='#06402B' darkBackgroundColor='#06402B' textColor='#ffffff' 
                  darkTextColor='#ffffff' onClick={() => setIsSaveConfirmOpen(true)}>Save Changes</Button>
                </div>
              </div>
            }
          >
            <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px', marginTop: '16px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Model Title</label>
              <Input
                alias='modelName'
                design='skeuomorphic' 
                type="text" 
                value={modelName}
                onChange={(e) => setModelName(e)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '16px' }} 
              />
              
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Weights Configuration (JSON)</label>
              <textarea 
                style={{ width: '100%', height: '150px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                defaultValue={'{\n  "layer_1": [0.24, -0.42, 0.88],\n  "layer_2": [0.11, 0.99, -0.33]\n}'} 
              />
            </div>
          </Modal>

          <Modal
            isOpen={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
            layout="medium"
            design="outline"
            title="⚠️ Confirm Deletion"
            confirmText="Yes, Delete Permanently"
            confirmVariant="material"
            confirmButtonOverrides={{ backgroundColor: '#800020', textColor: '#ffffff', 
              darkBackgroundColor: '#800020', darkTextColor: '#ffffff' }}
            onConfirm={() => {
              setIsDeleteConfirmOpen(false);
              setIsEditorOpen(false);
            }}
          >
            <p style={{ margin: 0 }}>
              Are you absolutely sure you want to delete <strong>{modelName}</strong>? This will purge the model weights from the database. This action cannot be undone.
            </p>
          </Modal>

          <Modal
            isOpen={isSaveConfirmOpen}
            onClose={() => setIsSaveConfirmOpen(false)}
            layout="medium"
            design="outline"
            title="Confirm Architecture Changes"
            confirmText="Apply Weights"
            confirmVariant="material"
            confirmButtonOverrides={{ backgroundColor: '#002366', textColor: '#ffffff', 
              darkBackgroundColor: '#002366', darkTextColor: '#ffffff' }}
            onConfirm={() => {
              setIsSaveConfirmOpen(false);
              setIsEditorOpen(false); 
            }}
          >
            <p style={{ margin: 0 }}>
              Are you sure you want to apply these new weights to <strong>{modelName}</strong>? This will trigger a rolling restart of the neural nodes.
            </p>
          </Modal>
        </>,
        document.body
      )}
    </div>
  );
};

export const NestedModalWorkflow: Story = {
  render: () => <NestedModalWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'This example demonstrates a complex parent modal (a data entry form with active inputs) that triggers two distinct secondary confirmation modals (Delete vs Save). The component natively handles stacking the z-index and overlay backgrounds, ensures form inputs remain interactive, and guarantees the Escape key only closes the top-most active modal.',
      },
      source: {
        code: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const NestedModalWorkflow = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Button backgroundColor='#002366' darkBackgroundColor='#002366' textColor='#ffffff' darkTextColor='#ffffff'
      hoverColor='#0034c3' darkHoverColor='#0034c3' onClick={() => setIsEditorOpen(true)}>Open Document Editor</Button>

      {mounted && createPortal(
        <>
          {/* PRIMARY MODAL: XL Layout */}
          <Modal
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            layout="xl"
            design="material"
            title="Edit Neural Weights"
            subtitle="Adjust the hyper-parameters and architecture."
            footerNode={
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Button variant="outline" textColor="#ef4444" onClick={() => setIsDeleteConfirmOpen(true)}>
                  Delete Model
                </Button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button variant="outline" backgroundColor='#800020' darkBackgroundColor='#800020' textColor='#ffffff' 
                  darkTextColor='#ffffff' onClick={() => setIsEditorOpen(false)}>Cancel</Button>
                  <Button variant="material" backgroundColor='#06402B' darkBackgroundColor='#06402B' textColor='#ffffff' 
                  darkTextColor='#ffffff' onClick={() => setIsSaveConfirmOpen(true)}>Save Changes</Button>
                </div>
              </div>
            }
          >
            <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
               <label>Weights Configuration (JSON)</label>
               <textarea style={{ width: '100%', height: '150px' }} defaultValue={'...'} />
            </div>
          </Modal>

          {/* SECONDARY MODAL A: DELETE */}
          <Modal
            isOpen={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
            layout="medium"
            design="outline"
            title="⚠️ Confirm Deletion"
            confirmText="Yes, Delete Permanently"
            confirmVariant="material"
            confirmButtonOverrides={{backgroundColor: '#800020', textColor: '#ffffff', 
            darkBackgroundColor: '#800020', darkTextColor: '#ffffff' }}
            onConfirm={() => {
              setIsDeleteConfirmOpen(false);
              setIsEditorOpen(false);
            }}
          >
            <p>Are you absolutely sure? This will purge the model weights from the database.</p>
          </Modal>

          {/* SECONDARY MODAL B: SAVE */}
          <Modal
            isOpen={isSaveConfirmOpen}
            onClose={() => setIsSaveConfirmOpen(false)}
            layout="medium"
            design="outline"
            title="Confirm Architecture Changes"
            confirmText="Apply Weights"
            confirmVariant="material"
            confirmButtonOverrides={{ backgroundColor: '#002366', textColor: '#ffffff', 
              darkBackgroundColor: '#002366', darkTextColor: '#ffffff' }}
            onConfirm={() => {
              setIsSaveConfirmOpen(false);
              setIsEditorOpen(false); 
            }}
          >
            <p>Are you sure you want to apply these new weights?</p>
          </Modal>
        </>,
        document.body
      )}
    </>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 5. THE GLASSMORPHIC EDGE-TO-EDGE BOTTOM SHEET
// ---------------------------------------------------------------------------
const BottomSheetWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ textAlign: 'center', padding: '32px' }}>
      <Button variant='outline' backgroundColor='#06402B' darkBackgroundColor='#06402B' textColor='#ffffff' darkTextColor='#ffffff'
      hoverColor='#033422' darkHoverColor='#033422'  onClick={() => setIsOpen(true)}>Open System Drawer</Button>

      {mounted && createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          layout="bottom"
          position="full"
          design="skeuomorphic"
          trueGlass={false}
          hideHeader={true}
          hideFooter={true} 
        >
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--mito-modal-border)', margin: '0 auto 24px', borderRadius: '4px' }} />
            <h3 style={{fontFamily: 'Raleway', fontWeight: 400, margin: '0 0 16px 0' }}>Quick Actions</h3><br/>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Button variant="skeuomorphic" onClick={() => setIsOpen(false)}>Run Diagnostics</Button>
              <Button variant="material" backgroundColor='#002366' darkBackgroundColor='#002366' textColor='#ffffff' darkTextColor='#ffffff'
              hoverColor='#033422' darkHoverColor='#033422' onClick={() => setIsOpen(false)}>Export Logs</Button>
            </div>
          </div>
        </Modal>,
        document.body
      )}
    </div>
  );
};

export const BottomSheetModal: Story = {
  render: () => <BottomSheetWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Ideal for mobile-responsive contexts or command palettes. It slides in from the bottom, spans the full width (`position="full"`), and utilizes the `trueGlass` aesthetic for a cinematic OS-level feel. Both `hideHeader` and `hideFooter` are used to strip default structures.',
      },
      source: {
        code: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const BottomSheetModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Button backgroundColor='#002366' darkBackgroundColor='#002366' textColor='#ffffff' darkTextColor='#ffffff'
      hoverColor='#0034c3' darkHoverColor='#0034c3' onClick={() => setIsOpen(true)}>Open System Drawer</Button>

      {mounted && createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          layout="bottom"
          position="full"
          design="neumorphic"
          trueGlass={true}
          hideHeader={true}
          hideFooter={true} 
        >
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--mito-modal-border)', margin: '0 auto 24px', borderRadius: '4px' }} />
            <h3 style={{ margin: '0 0 16px 0' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Button variant="neumorphic" onClick={() => setIsOpen(false)}>Run Diagnostics</Button>
              <Button variant="neumorphic" variant="material" backgroundColor='#06402B' darkBackgroundColor='#06402B' textColor='#ffffff' darkTextColor='#ffffff'
              hoverColor='#033422' darkHoverColor='#033422' onClick={() => setIsOpen(false)}>Export Logs</Button>
            </div>
          </div>
        </Modal>,
        document.body
      )}
    </>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 6. THE SKEUOMORPHIC TOP-RIGHT NOTIFICATION HUB
// ---------------------------------------------------------------------------
const TopRightWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ textAlign: 'center', padding: '32px' }}>
      <Button backgroundColor='#4B006E' darkBackgroundColor='#4B006E' textColor='#ffffff' darkTextColor='#ffffff' 
      onClick={() => setIsOpen(true)}>🔔 Notifications</Button>

      {mounted && createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          layout="top"
          position="right"
          design="skeuomorphic"
          title="Activity Hub"
          subtitle="Recent system alerts"
          confirmText="Mark All as Read"
          fontFamily='Google Sans Code'
          onConfirm={() => setIsOpen(false)}
        >
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>Deployment #4092 successful.</li>
            <li>New login detected from 192.168.1.45.</li>
            <li>Database backup completed at 03:00 UTC.</li>
          </ul>
        </Modal>,
        document.body
      )}
    </div>
  );
};

export const TopRightHub: Story = {
  render: () => <TopRightWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the `layout="top"` architecture combined with `position="right"` to create an interactive notification or profile hub that drops down gracefully from the top-right corner of the viewport.',
      },
      source: {
        code: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const TopRightHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Button backgroundColor='#4B006E' darkBackgroundColor='#4B006E' textColor='#ffffff' darkTextColor='#ffffff' onClick={() => setIsOpen(true)}>🔔 Notifications</Button>

      {mounted && createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          layout="top"
          position="right"
          design="skeuomorphic"
          title="Activity Hub"
          subtitle="Recent system alerts"
          confirmText="Mark All as Read"
          fontFamily='Google Sans Code'
          onConfirm={() => setIsOpen(false)}
        >
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>Deployment #4092 successful.</li>
            <li>New login detected from 192.168.1.45.</li>
            <li>Database backup completed at 03:00 UTC.</li>
          </ul>
        </Modal>,
        document.body
      )}
    </>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 7. CUSTOM HEADER NODE (AVATAR REPLACEMENT)
// ---------------------------------------------------------------------------
const CustomHeaderWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ textAlign: 'center', padding: '32px' }}>
      <Button darkBackgroundColor='#012169' backgroundColor='#012169' darkTextColor=' #C8102E ' textColor=' #C8102E '
      darkHoverColor=' #000000 ' hoverColor=' #000000 ' darkHoverTextColor='#C8102E' hoverTextColor='#C8102E'
      onClick={() => setIsOpen(true)}>View Agent Identity</Button>

      {mounted && createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          layout="medium"
          fontFamily='Playfair Display'
          confirmButtonOverrides={{ backgroundColor: '#012169', textColor: '#ffffff', 
              darkBackgroundColor: '#012169', darkTextColor: '#ffffff' }}
          cancelButtonOverrides={{ backgroundColor: '#C8102E', textColor: '#ffffff', 
              darkBackgroundColor: '#C8102E', darkTextColor: '#ffffff' }}
          headerNode={
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#012169', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                JB
              </div>
              <div>
                <ModalTitle style={{ margin: 0 }}>James Bond</ModalTitle>
                <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>MI6 Agent Account</span>
              </div>
            </div>
          }
          confirmText="Verify Identity"
          onConfirm={() => setIsOpen(false)}
        >
          <p>Biometric scan required to access Zaibatsu protocols.</p>
        </Modal>,
        document.body
      )}
    </div>
  );
};

export const CustomHeaderModal: Story = {
  render: () => <CustomHeaderWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'This injects a completely custom header layout (an avatar and complex title group) using the `headerNode` composite prop, while still benefiting from the modal\'s standard closing mechanics and rigorous structural CSS.',
      },
      source: {
        code: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, ModalTitle, Button } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const CustomHeaderModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Button darkBackgroundColor='#012169' backgroundColor='#012169' darkTextColor=' #C8102E ' textColor=' #C8102E '
      darkHoverColor=' #000000 ' hoverColor=' #000000 ' darkHoverTextColor='#C8102E' hoverTextColor='#C8102E' onClick={() => setIsOpen(true)}>View Agent Identity</Button>

      {mounted && createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          layout="medium"
          fontFamily='Playfair Display'
          headerNode={
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#012169', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                JB
              </div>
              <div>
                <ModalTitle style={{ margin: 0 }}>James Bond</ModalTitle>
                <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>MI6 Agent Account</span>
              </div>
            </div>
          }
          confirmText="Verify Identity"
          onConfirm={() => setIsOpen(false)}
        >
          <p>Biometric scan required to access Zaibatsu protocols.</p>
        </Modal>,
        document.body
      )}
    </>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 8. NEUMORPHIC RIGHT DRAWER
// ---------------------------------------------------------------------------
const RightDrawerWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ textAlign: 'center', padding: '32px' }}>
      <Button variant="skeuomorphic" onClick={() => setIsOpen(true)}>Open Preferences Drawer</Button>

      {mounted && createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          layout="right"
          design="material"
          borderRadius="0px"
          trueGlass={true} 
          title="System Preferences"
          titleColor='#ffffff'
          fontFamily='Work Sans'
          confirmText="Save Settings"
          onConfirm={() => setIsOpen(false)}
        >
          <p style={{color: '#ffffff'}}>Insert your environment configurations components here. <br/><br/><br/> Utilize the <code>trueGlass</code> aesthetic to elegantly blur the underlying context.</p>
        </Modal>,
        document.body
      )}
    </div>
  );
};

export const RightDrawer: Story = {
  render: () => <RightDrawerWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'This provides a beautiful side-panel configuration perfect for deep forms or system menus. Setting `layout="right"` stretches the modal full height and slides it in from the side, while `trueGlass={true}` produces a gorgeous frosted drawer effect.',
      },
      source: {
        code: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from '@emeraldemperaur/mito-ui';
import '../../styles/fonts.scss';

export const RightDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Button variant="skeuomorphic" onClick={() => setIsOpen(true)}>
        Open Preferences Drawer
      </Button>

      {mounted && createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          layout="right" // Snaps to the right edge, stretches full height
          design="material"
          borderRadius="0px"
          trueGlass={true} // Frosted glass drawer effect
          title="System Preferences"
          titleColor='#ffffff'
          fontFamily='Work Sans'
          confirmText="Save Settings"
          onConfirm={() => setIsOpen(false)}
        >
          <p style={{color: '#ffffff'}}>Insert your environment configurations components here...</p>
        </Modal>,
        document.body
      )}
    </>
  );
};`,
      },
    },
  },
};