import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { 
  Card, CardHeader, CardBody, CardFooter, 
  CardTitle, CardSubtitle, CardText, CardImage, CardListGroup, CardListItem 
} from './Card';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const meta: Meta<typeof Card> = {
  title: 'Information/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    darkMode: { control: 'boolean' },
    elevation: { control: { type: 'range', min: 1, max: 20 } },
    neuIntensity: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      const isDark = context.args.darkMode;
      
      let bg = 'transparent';
      if (isNeu) bg = isDark ? '#1f2937' : '#e0e5ec';
      
      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <div style={{ padding: '3rem', backgroundColor: bg, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <Story />
            </div>
          </div>
        </GlobalUIContext.Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const MaterialWithImage: Story = {
  args: {
    design: 'material',
    children: (
      <>
        <CardImage position="top" src="https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=600&auto=format&fit=crop" alt="Abstract gradient" style={{ height: '200px' }} />
        <CardBody>
          <CardTitle>Global Markets</CardTitle>
          <CardSubtitle>Q3 Performance Review</CardSubtitle>
          <CardText>
            An in-depth analysis of technological equities and emerging market trends over the last fiscal quarter.
          </CardText>
          <button style={{ padding: '8px 16px', background: 'var(--blue-9, #2563eb)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '16px' }}>
            Read Full Report
          </button>
        </CardBody>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Global Markets')).toBeInTheDocument();
    expect(canvas.getByRole('img')).toHaveAttribute('src');
    
    const btn = canvas.getByRole('button', { name: /read full report/i });
    await userEvent.hover(btn);
  },
};

export const OutlineWithListGroup: Story = {
  args: {
    design: 'outline',
    children: (
      <>
        <CardHeader>
          <CardTitle style={{ margin: 0 }}>System Status</CardTitle>
        </CardHeader>
        <CardListGroup flush>
          <CardListItem>Database Cluster 1 <span style={{ float: 'right', color: 'green' }}>Healthy</span></CardListItem>
          <CardListItem>Authentication API <span style={{ float: 'right', color: 'green' }}>Healthy</span></CardListItem>
          <CardListItem>Storage Bucket <span style={{ float: 'right', color: 'orange' }}>80% Full</span></CardListItem>
        </CardListGroup>
        <CardFooter style={{ fontSize: '0.85rem', color: 'gray', textAlign: 'center' }}>
          Last updated: Just now
        </CardFooter>
      </>
    ),
  },
};

export const NeumorphicDark: Story = {
  args: {
    design: 'neumorphic',
    darkMode: true,
    elevation: 8,
    children: (
      <>
        <CardBody>
          <CardTitle style={{ color: '#f9fafb' }}>Vinci Engine</CardTitle>
          <CardText style={{ color: '#d1d5db' }}>
            Generative architectural AI system primed and ready for token ingestion.
          </CardText>
        </CardBody>
      </>
    ),
  },
};