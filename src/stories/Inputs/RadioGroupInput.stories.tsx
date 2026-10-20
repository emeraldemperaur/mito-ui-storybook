import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroupInput } from './RadioGroupInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';
import { fn } from '@storybook/test';

const mockOptions = [
  { optionid: '1', optionvalue: 'daily', text: 'Daily Digest' },
  { optionid: '2', optionvalue: 'weekly', text: 'Weekly Summary' },
  { optionid: '3', optionvalue: 'never', text: 'Unsubscribe' },
];

const meta: Meta<typeof RadioGroupInput> = {
  title: 'Inputs/RadioGroupInput',
  component: RadioGroupInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    direction: { control: 'radio', options: ['row', 'column'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent' }}>
        <Formik initialValues={{ notificationFreq: 'weekly' }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RadioGroupInput>;

export const VerticalRadios: Story = {
  args: {
    alias: 'notificationFreq',
    inputLabel: 'Email Frequency',
    options: mockOptions,
    design: 'outline',
    direction: 'column',
  },
};

export const NeumorphicHorizontal: Story = {
  args: {
    alias: 'notificationFreq',
    inputLabel: 'Email Frequency',
    options: mockOptions,
    design: 'neumorphic',
    direction: 'row',
  },
};