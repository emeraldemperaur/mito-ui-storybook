import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { Modal } from './Modal';
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import { useState } from 'react';

const ModalStoryWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ padding: '2rem', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '6px', background: 'var(--blue-9, #2563eb)', color: 'white', border: 'none' }}
      >
        Open Modal
      </button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

const meta: Meta<typeof Modal> = {
  title: 'Modals/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    layout: { control: 'radio', options: ['fullscreen', 'xl', 'bottom'] },
    position: { control: 'radio', options: ['left', 'center', 'right'] },
    darkMode: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
        <Story />
      </GlobalUIContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const StandardXL: Story = {
  render: (args) => <ModalStoryWrapper {...args} />,
  args: {
    layout: 'xl',
    design: 'outline',
    title: 'System Settings',
    children: <p>Adjust your preferences and account settings here.</p>,
    footer: (
      <button style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '4px' }}>
        Save Changes
      </button>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const root = within(document.body);
    const canvas = within(canvasElement);
    
    await step('Open Modal', async () => {
      const openBtn = canvas.getByRole('button', { name: /open modal/i });
      await userEvent.click(openBtn);
    });

    await step('Verify Contents', async () => {
      expect(await root.findByText('System Settings')).toBeInTheDocument();
    });
  },
};

export const SlideInDrawer: Story = {
  render: (args) => <ModalStoryWrapper {...args} />,
  args: {
    layout: 'bottom',
    position: 'right', 
    design: 'material',
    title: 'Notifications',
    children: <p>You have 3 new messages.</p>,
  },
};

export const NeumorphicDark: Story = {
  render: (args) => <ModalStoryWrapper {...args} />,
  args: {
    layout: 'xl',
    design: 'neumorphic',
    darkMode: true,
    title: 'Security Alert',
    children: <p style={{ color: '#d1d5db' }}>A new login was detected.</p>,
  },
};