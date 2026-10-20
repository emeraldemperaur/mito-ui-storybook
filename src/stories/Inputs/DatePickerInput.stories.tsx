import type { Meta, StoryObj } from '@storybook/react';
import { DatePickerInput } from './DatePickerInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';
import { fn } from '@storybook/test';

const meta: Meta<typeof DatePickerInput> = {
  title: 'Inputs/DatePickerInput',
  component: DatePickerInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    mode: { control: 'radio', options: ['date', 'datetime', 'daterange'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent', minHeight: '400px' }}>
        <Formik initialValues={{ eventDate: null }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DatePickerInput>;

export const StandardDate: Story = {
  args: {
    alias: 'eventDate',
    inputLabel: 'Select Event Date',
    mode: 'date',
    design: 'outline',
  },
};

export const NeumorphicDateRange: Story = {
  args: {
    alias: 'eventDate',
    inputLabel: 'Booking Window',
    mode: 'daterange',
    design: 'neumorphic',
  },
};