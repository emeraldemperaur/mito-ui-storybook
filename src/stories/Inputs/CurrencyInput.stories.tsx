import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { CurrencyInput } from './CurrencyInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof CurrencyInput> = {
  title: 'Inputs/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    defaultCurrency: { control: 'select', options: ['USD', 'EUR', 'GBP', 'JPY'] },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <div style={{ padding: '2rem', backgroundColor: isNeu ? '#e0e5ec' : 'transparent', minHeight: '300px' }}>
          <Formik initialValues={{ salary: '', salaryCurrency: 'USD' }} onSubmit={fn()}>
            <Form><Row><Story /></Row></Form>
          </Formik>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const StandardFormatting: Story = {
  args: {
    alias: 'salary',
    inputLabel: 'Annual Salary',
    design: 'outline',
    defaultCurrency: 'USD',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /annual salary/i });
    
    await userEvent.type(input, '15000050');
    
    expect(input).toHaveValue('150,000.50');
  },
};

export const NeumorphicEuro: Story = {
  args: {
    alias: 'salary',
    inputLabel: 'Project Budget',
    design: 'neumorphic',
    defaultCurrency: 'EUR',
  },
};