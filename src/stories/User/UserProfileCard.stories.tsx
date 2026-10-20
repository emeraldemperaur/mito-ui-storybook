import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { UserProfileCard } from './UserProfileCard';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const meta: Meta<typeof UserProfileCard> = {
  title: 'User/UserProfileCard',
  component: UserProfileCard,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    darkMode: { control: 'boolean' },
  },
  args: {
    onSubscribe: fn(),
    onCancelSubscription: fn(),
    onRenewSubscription: fn(),
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <div style={{ padding: '3rem', backgroundColor: isNeu ? '#e0e5ec' : 'transparent' }}>
            <Story />
          </div>
        </GlobalUIContext.Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof UserProfileCard>;

export const ActiveSubscription: Story = {
  args: {
    username: 'Jane Doe',
    email: 'jane.doe@example.com',
    isVerified: true,
    role: 'Administrator',
    permissions: ['read:all', 'write:users', 'delete:records'],
    design: 'outline',
    subscription: {
      status: 'active',
      planName: 'Enterprise Pro',
      currentPeriodEnd: '2026-12-31T00:00:00.000Z',
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Verify data formatting
    expect(canvas.getByText('Enterprise Pro')).toBeInTheDocument();
    expect(canvas.getByText('Verified')).toBeInTheDocument();
    
    // Test the cancel button
    const cancelBtn = canvas.getByRole('button', { name: /cancel plan/i });
    await userEvent.click(cancelBtn);
    expect(args.onCancelSubscription).toHaveBeenCalled();
  },
};

export const PastDueNeumorphic: Story = {
  args: {
    username: 'John Smith',
    email: 'j.smith@corporate.net',
    isVerified: false,
    role: 'Editor',
    permissions: ['read:content', 'write:content'],
    design: 'neumorphic',
    subscription: {
      status: 'past_due',
      planName: 'Creator Basic',
      currentPeriodEnd: '2025-01-15T00:00:00.000Z',
    },
  },
};

export const FreeTierMaterial: Story = {
  args: {
    username: 'Guest User',
    email: 'guest@web.com',
    isVerified: true,
    role: 'Viewer',
    permissions: [],
    design: 'material',
    subscription: {
      status: 'none',
    },
  },
};