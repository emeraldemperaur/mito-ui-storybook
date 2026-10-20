import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { NumberInput } from './NumberInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof NumberInput> = {
  title: 'Inputs/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    decimals: { control: { type: 'number', min: 0, max: 4 } },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent' }}>
        <Formik initialValues={{ quantity: '' }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const StrictFormatting: Story = {
  args: {
    alias: 'quantity',
    inputLabel: 'Order Quantity (Decimals)',
    decimals: 2,
    design: 'outline',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /order quantity/i });
    
    await userEvent.type(input, '12abc34');
    expect(input).toHaveValue('1,234.00');
  },
};