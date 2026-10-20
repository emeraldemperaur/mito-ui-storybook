import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { SectionTitle } from './SectionTitle';
import { Row } from '../Layout/Row';
import { Icon } from '../../components/icons/Icons';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const meta: Meta<typeof SectionTitle> = {
  title: 'Information/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    align: { control: 'radio', options: ['left', 'center', 'right'] },
    size: { control: 'select', options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] },
    width: { control: { type: 'range', min: 1, max: 12 } },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <div style={{ padding: '2rem', backgroundColor: isNeu ? '#e0e5ec' : '#f8f9fa' }}>
            <Row><Story /></Row>
          </div>
        </GlobalUIContext.Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SectionTitle>;

export const StandardLeft: Story = {
  args: {
    title: 'Account Settings',
    subTitle: 'Manage your personal information and security preferences.',
    design: 'outline',
    align: 'left',
    width: 12,
    withSeparator: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify title and subtitle rendering
    expect(canvas.getByRole('heading', { name: /account settings/i })).toBeInTheDocument();
    expect(canvas.getByText(/manage your personal information/i)).toBeInTheDocument();
  },
};

export const CenteredWithIconMaterial: Story = {
  args: {
    title: 'Security Metrics',
    subTitle: 'Last 30 days of firewall activity',
    design: 'material',
    align: 'center',
    icon: <Icon name="lockclosed" width="24" height="24" />,
    backgroundColor: '#ffffff',
  },
};

export const NeumorphicCustomColors: Story = {
  args: {
    title: 'Deployment Pipeline',
    design: 'neumorphic',
    align: 'left',
    titleColor: '#059669', // Emerald
    icon: <Icon name="rocket" width="28" height="28" />,
    withSeparator: true,
  },
};