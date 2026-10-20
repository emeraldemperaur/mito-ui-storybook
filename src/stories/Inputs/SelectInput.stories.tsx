import type { Meta, StoryObj } from '@storybook/react';
import { SelectInput } from './SelectInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';
import { fn } from '@storybook/test';

const mockOptions = [
  { optionid: '1', optionvalue: 'react', text: 'React' },
  { optionid: '2', optionvalue: 'vue', text: 'Vue' },
  { optionid: '3', optionvalue: 'angular', text: 'Angular' },
];

const meta: Meta<typeof SelectInput> = {
  title: 'Inputs/SelectInput',
  component: SelectInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    multiple: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent', minHeight: '350px' }}>
        <Formik initialValues={{ framework: context.args.multiple ? [] : '' }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SelectInput>;

export const SingleSelect: Story = {
  args: {
    alias: 'framework',
    inputLabel: 'Favorite Framework',
    options: mockOptions,
    design: 'outline',
    multiple: false,
  },
};

export const MultiSelectPopover: Story = {
  args: {
    alias: 'framework',
    inputLabel: 'Familiar Technologies',
    options: mockOptions,
    design: 'material',
    multiple: true,
  },
};