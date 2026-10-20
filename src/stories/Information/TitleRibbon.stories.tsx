import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { TitleRibbon } from './TitleRibbon';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const meta: Meta<typeof TitleRibbon> = {
  title: 'Typography/TitleRibbon',
  component: TitleRibbon,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    textAlignment: { control: 'radio', options: ['left', 'center', 'right'] },
    typewriterFX: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <div style={{ padding: '3rem 0', backgroundColor: isNeu ? '#e0e5ec' : 'transparent', width: '100%' }}>
            <Story />
          </div>
        </GlobalUIContext.Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof TitleRibbon>;

export const StandardBanner: Story = {
  args: {
    title: 'System Architecture',
    design: 'outline',
    textAlignment: 'left',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 1, name: /system architecture/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('v-sr-only');
  },
};

export const CenteredMaterial: Story = {
  args: {
    title: 'Executive Dashboard',
    design: 'material',
    textAlignment: 'center',
    backgroundColor: '#ffffff',
  },
};

export const NeumorphicTypewriter: Story = {
  args: {
    title: 'Initializing Subroutines...',
    design: 'neumorphic',
    typewriterFX: true,
    textAlignment: 'center',
    textColor: '#2563eb',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    
    const fullyTypedText = await canvas.findByText('Initializing Subroutines...', {}, { timeout: 3000 });
    
    expect(fullyTypedText).toBeInTheDocument();
  },
};