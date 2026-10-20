import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { AuthenticationUI } from './AuthenticationUI';

const mockSignIn = async (credentials: any) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (credentials.email === 'error@example.com') {
    return { success: false, error: 'Invalid credentials' };
  }
  // Trigger verification flow for testing
  return { success: true, requiresVerification: true };
};

const mockSignUp = async (_credentials: any) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true, requiresVerification: true };
};

const mockVerify = async (credentials: any) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (credentials.verificationCode === '000000') {
    return { success: false, error: 'Invalid code' };
  }
  return { success: true };
};

const meta: Meta<typeof AuthenticationUI> = {
  title: 'Identity/AuthenticationUI',
  component: AuthenticationUI,
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'radio', options: ['chaimara', 'prometheus'] },
    variant: { control: 'radio', options: ['neumorphic', 'outline', 'material'] },
    darkMode: { control: 'boolean' },
    signInVerificationCode: { control: 'boolean' },
    signUpVerificationCode: { control: 'boolean' },
    primaryColor: { control: 'color' },
    backgroundColor: { control: 'color' },
  },
  args: {
    onSignIn: mockSignIn,
    onSignUp: mockSignUp,
    onVerifyCode: mockVerify,
    onResendCode: fn(),
    onForgotPassword: fn(),
  },
  parameters: {
    layout: 'fullscreen', 
  },
};

export default meta;
type Story = StoryObj<typeof AuthenticationUI>;

export const ChaimaraNeumorphic: Story = {
  args: {
    layout: 'chaimara',
    variant: 'neumorphic',
    darkMode: false,
    brandTitle: 'Vinci<br>Engine',
    brandSubtitle: 'POWERED BY MITO',
    signInVerificationCode: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify initial render', async () => {
      expect(canvas.getByText('SIGN IN')).toBeInTheDocument();
      expect(canvas.getByRole('textbox', { name: /email address/i })).toBeInTheDocument();
    });

    await step('Test Sign Up Toggle', async () => {
      const toggleBtn = canvas.getByRole('button', { name: /sign up/i });
      await userEvent.click(toggleBtn);
      
      expect(canvas.getByText('SIGN UP')).toBeInTheDocument();
      expect(canvas.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    await step('Test Error Handling', async () => {
      const emailInput = canvas.getByRole('textbox', { name: /email address/i });
      const passInput = canvas.getByLabelText(/^password/i); 
      const confirmPass = canvas.getByLabelText(/confirm password/i);
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passInput, 'password123');
      await userEvent.type(confirmPass, 'mismatch456');
      
      const submitBtn = canvas.getByRole('button', { name: /sign up/i });
      await userEvent.click(submitBtn);
      
      expect(await canvas.findByText('Passwords do not match')).toBeInTheDocument();
    });
  },
};

export const PrometheusDarkOutline: Story = {
  args: {
    layout: 'prometheus',
    variant: 'outline',
    darkMode: true,
    primaryColor: '#3b82f6',
    brandTitle: 'Voltron',
    brandSubtitle: 'SYSTEM ACCESS',
  },
};

export const VerificationFlow: Story = {
  args: {
    layout: 'chaimara',
    variant: 'material',
    signInVerificationCode: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Trigger Login', async () => {
      const emailInput = canvas.getByRole('textbox', { name: /email address/i });
      const passInput = canvas.getByLabelText(/^password/i);
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passInput, 'correcthorsebatterystaple');
      
      const submitBtn = canvas.getByRole('button', { name: /log in/i });
      await userEvent.click(submitBtn);
    });

    await step('Verify Multi-factor Transition', async () => {
      const codeInput = await canvas.findByRole('textbox', { name: /verification code/i }, { timeout: 2000 });
      expect(codeInput).toBeInTheDocument();
      expect(canvas.getByText('VERIFY')).toBeInTheDocument();
    });
  },
};

export const MobileViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
  args: {
    layout: 'chaimara',
    variant: 'neumorphic',
  },
};