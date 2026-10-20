import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { LoaderGate } from './LoaderGate';
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import { useState } from 'react';

const LoaderGateWrapper = (args: any) => {
  const [mountKey, setMountKey] = useState(0);

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <LoaderGate key={mountKey} {...args}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Application Loaded Successfully</h2>
          <p>The LoaderGate has unmounted and revealed the children tree.</p>
          <button 
            onClick={() => setMountKey(prev => prev + 1)}
            style={{ marginTop: '1rem', padding: '8px 16px', background: 'var(--blue-9, #2563eb)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Re-trigger Loader Overlay
          </button>
        </div>
      </LoaderGate>
    </div>
  );
};

const meta: Meta<typeof LoaderGate> = {
  title: 'HigherOrderComponent/LoaderGate',
  component: LoaderGate,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['minimal', 'material', 'outline', 'neumorphic'] },
    timeout: { control: { type: 'range', min: 500, max: 5000, step: 100 } },
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
type Story = StoryObj<typeof LoaderGate>;

export const MinimalDefault: Story = {
  render: (args) => <LoaderGateWrapper {...args} />,
  args: {
    design: 'minimal',
    brandName: 'Vinci AI',
    loadingText: 'Initializing Systems...',
    timeout: 2000, 
  },
  play: async ({ step }) => {
    const root = within(document.body);
    
    await step('Verify loader is active', async () => {
      const statusOverlay = root.getByRole('status');
      expect(statusOverlay).toBeVisible();
      expect(root.getByText('Initializing Systems...')).toBeVisible();
    });

    await step('Wait for timeout to reveal children', async () => {
      const childContent = await root.findByText('Application Loaded Successfully', {}, { timeout: 3000 });
      expect(childContent).toBeVisible();
      
      const statusOverlay = root.queryByRole('status');
      if (statusOverlay) {
        expect(statusOverlay).toHaveClass('fade-out');
      }
    });
  },
};

export const NeumorphicCustomColors: Story = {
  render: (args) => <LoaderGateWrapper {...args} />,
  args: {
    design: 'neumorphic',
    brandName: 'Praimfaya',
    loadingText: 'Decrypting payload...',
    backgroundColor: '#e0e5ec',
    timeout: 3000,
    darkModeColors: { light: '#800020', dark: '#dc2626' }, 
  },
};

export const DarkModeMaterial: Story = {
  render: (args) => <LoaderGateWrapper {...args} />,
  args: {
    design: 'material',
    brandName: 'Voltron',
    loadingText: 'Syncing state...',
    darkMode: true,
    timeout: 1500,
  },
};