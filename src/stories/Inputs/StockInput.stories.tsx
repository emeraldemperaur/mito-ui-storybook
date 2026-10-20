import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { StockInput } from './StockInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof StockInput> = {
  title: 'Inputs/StockInput',
  component: StockInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent' }}>
        <Formik initialValues={{ targetPrice: '' }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StockInput>;

export const TickerFormatting: Story = {
  args: {
    alias: 'targetPrice',
    inputLabel: 'Target Entry Price',
    tickerSymbol: 'AAPL',
    design: 'outline',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /target entry price/i });
    
    await userEvent.type(input, '15050');
    expect(input).toHaveValue('150.50');
  },
};