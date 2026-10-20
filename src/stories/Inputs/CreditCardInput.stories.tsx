import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { CreditCardInput } from './CreditCardInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof CreditCardInput> = {
  title: 'Inputs/CreditCardInput',
  component: CreditCardInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent' }}>
        <Formik initialValues={{ cardNumber: '' }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CreditCardInput>;

export const CardDetection: Story = {
  args: {
    alias: 'cardNumber',
    inputLabel: 'Payment Method',
    design: 'outline',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /payment method/i });
    
    await userEvent.type(input, '4111222233334444');
    expect(input).toHaveValue('4111 2222 3333 4444');
  },
};