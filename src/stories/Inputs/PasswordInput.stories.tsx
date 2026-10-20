import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { PasswordInput } from './PasswordInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof PasswordInput> = {
  title: 'Inputs/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent' }}>
        <Formik initialValues={{ password: '' }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const VisibilityToggle: Story = {
  args: {
    alias: 'password',
    inputLabel: 'Account Password',
    design: 'outline',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/account password/i);
    
    expect(input).toHaveAttribute('type', 'password');
    
    const toggleBtn = canvas.getByRole('button', { name: /show password/i });
    await userEvent.click(toggleBtn);
    
    expect(input).toHaveAttribute('type', 'text');
  },
};