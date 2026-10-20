import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    fluid: { control: 'boolean' },
    size: { control: 'select', options: ["1", "2", "3", "4"] },
  },
  decorators: [
    (Story) => (
      <GlobalUIContext.Provider value={{ themeColors: { light: '#f8f9fa', dark: '#212529' } } as any}>
        <div style={{ backgroundColor: '#e9ecef', padding: '2rem 0', minHeight: '300px' }}>
          <Story />
        </div>
      </GlobalUIContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const FixedWidth: Story = {
  args: {
    fluid: false,
    size: "3",
    style: { backgroundColor: 'white', minHeight: '200px', padding: '1rem', border: '1px dashed #ccc' },
    children: <h2>Standard Centered Container (Max Width Applied)</h2>,
  },
};

export const FluidWidth: Story = {
  args: {
    fluid: true,
    style: { backgroundColor: 'white', minHeight: '200px', padding: '1rem', border: '1px dashed #ccc' },
    children: <h2>Fluid Container (100% Width)</h2>,
  },
};