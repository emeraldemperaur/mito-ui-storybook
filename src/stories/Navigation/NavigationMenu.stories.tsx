import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { NavigationMenu } from './NavigationMenu';

const mockNavItems = [
  { label: 'Dashboard', href: '/dashboard' },
  {
    label: 'Products',
    dropdownGroups: [
      {
        title: 'Software',
        items: [
          { title: 'Vinci Engine', description: 'AI Layout Generation', href: '/vinci' },
          { title: 'Voltron', description: 'State Management', href: '/voltron' },
        ],
      },
    ],
  },
  { label: 'Documentation', href: '/docs' },
];

const meta: Meta<typeof NavigationMenu> = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    darkMode: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => (
      <div style={{ 
        minHeight: '150vh',
        paddingTop: '100px',
        backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : '#f8f9fa' 
      }}>
        <Story />
        <div style={{ padding: '2rem' }}>
          <h2>Scroll down to test auto-hide behavior</h2>
          <p>The navigation bar monitors scroll Y position and hides intelligently.</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

export const DesktopView: Story = {
  args: {
    brandLogo: <span style={{ color: 'var(--blue-9)' }}>MITO</span>,
    navItems: mockNavItems,
    design: 'outline',
    rightActions: [
      <button key="login" style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}>Login</button>
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const productsMenu = canvas.getByRole('button', { name: /products/i });
    await userEvent.click(productsMenu);
    
    expect(productsMenu).toHaveAttribute('aria-expanded', 'true');
    expect(canvas.getByText('Vinci Engine')).toBeVisible();
  },
};

export const MobileHamburgerView: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' }, 
  },
  args: {
    brandLogo: <span>MITO</span>,
    navItems: mockNavItems,
    design: 'material',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Hamburger menu should be visible on mobile
    const hamburgerBtn = canvas.getByLabelText(/toggle navigation menu/i);
    await userEvent.click(hamburgerBtn);
    
    // Menu opens
    expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'true');
    expect(canvas.getByText('Dashboard')).toBeVisible();
  },
};

export const NeumorphicDark: Story = {
  args: {
    brandLogo: <span>MITO OS</span>,
    navItems: mockNavItems,
    design: 'neumorphic',
    darkMode: true,
    backgroundColor: '#1f2937', 
  },
};