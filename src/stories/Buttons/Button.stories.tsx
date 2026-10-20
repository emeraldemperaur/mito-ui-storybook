import type { Meta, StoryObj } from '@storybook/react';
import { fn, within, expect, userEvent } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive'],
      description: 'Visual aesthetic design variant.',
    },
    isLoading: {
      control: 'boolean',
      description: 'Toggles active execution status layout.',
    },
    asChild: {
      control: 'boolean',
      description: 'Delegates rendering to the immediate child element.',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Submit Form',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /submit form/i });
    await userEvent.click(button);
    expect(args.onClick).toHaveBeenCalled();
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
};

export const LoadingState: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    children: 'Save Changes',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    // Ensure standard text is hidden and loading text is present
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(canvas.getByText('Loading...')).toBeInTheDocument();
  },
};

export const AsChildDelegation: Story = {
  args: {
    variant: 'secondary',
    asChild: true,
    children: <a href="https://example.com">Link Acting As Button</a>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /link acting as button/i });
    expect(link).toHaveAttribute('data-variant', 'secondary');
    expect(link.tagName).toBe('A');
  },
};