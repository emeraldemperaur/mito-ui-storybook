import type { Meta, StoryObj } from '@storybook/react';
import { SliderInput } from './SliderInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';
import { fn } from '@storybook/test';

const meta: Meta<typeof SliderInput> = {
  title: 'Inputs/SliderInput',
  component: SliderInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    mode: { control: 'radio', options: ['single', 'range'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent' }}>
        <Formik initialValues={{ volume: context.args.mode === 'range' ? [20, 80] : 50 }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SliderInput>;

export const SingleValue: Story = {
  args: {
    alias: 'volume',
    inputLabel: 'System Volume',
    mode: 'single',
    minvalue: 0,
    maxvalue: 100,
    design: 'outline',
  },
};

export const NeumorphicRange: Story = {
  args: {
    alias: 'volume',
    inputLabel: 'Price Range',
    mode: 'range',
    minvalue: 0,
    maxvalue: 100,
    design: 'neumorphic',
  },
};