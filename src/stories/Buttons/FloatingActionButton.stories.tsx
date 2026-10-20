import type { Meta, StoryObj } from '@storybook/react';
import { fn, within, expect, userEvent } from '@storybook/test';
import { FloatingActionButton } from './FloatingActionButton';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const meta: Meta<typeof FloatingActionButton> = {
  title: 'Buttons/FloatingActionButton',
  component: FloatingActionButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', 
    viewport: { defaultViewport: 'mobile1' }, 
  },
  args: {
    icon: <PlusIcon />,
    ariaLabel: 'Create new item',
    onClick: fn(),
  },
  argTypes: {
    design: {
      control: 'radio',
      options: ['material', 'outline', 'neumorphic'],
    },
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    },
    size: { control: { type: 'range', min: 40, max: 96, step: 4 } },
    offset: { control: { type: 'number' } },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <div style={{ 
            height: '100vh', 
            width: '100%', 
            backgroundColor: isNeu ? '#ecf0f3' : '#f8f9fa',
            position: 'relative' 
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

export const MaterialBottomRight: Story = {
  args: {
    design: 'material',
    position: 'bottom-right',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.parentElement || canvasElement);
    const fab = canvas.getByRole('button', { name: /create new item/i });
    
    await userEvent.click(fab);
    expect(args.onClick).toHaveBeenCalled();
  },
};

export const OutlineTopLeft: Story = {
  args: {
    design: 'outline',
    position: 'top-left',
    size: 56,
  },
};

export const NeumorphicCenteredBottom: Story = {
  args: {
    design: 'neumorphic',
    position: 'bottom-right',
    offset: 32,
    lightSource: 'top-left',
    elevation: 6,
  },
};