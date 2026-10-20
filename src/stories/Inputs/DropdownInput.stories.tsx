import type { Meta, StoryObj } from '@storybook/react';
import { DropdownInput } from './DropdownInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';
import { fn } from '@storybook/test';

const mockOptions = [
  { optionid: '1', optionvalue: 'opt1', text: 'Standard User' },
  { optionid: '2', optionvalue: 'opt2', text: 'Administrator' },
  { optionid: '3', optionvalue: 'opt3', text: 'Super Admin', optionurl: 'https://example.com/roles' },
];

const meta: Meta<typeof DropdownInput> = {
  title: 'Inputs/DropdownInput',
  component: DropdownInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent', minHeight: '350px' }}>
        <Formik initialValues={{ userRole: '' }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DropdownInput>;

export const BasicDropdown: Story = {
  args: {
    alias: 'userRole',
    inputLabel: 'Assign Role',
    inputOptions: mockOptions,
    design: 'outline',
  },
};

export const NeumorphicMenu: Story = {
  args: {
    alias: 'userRole',
    inputLabel: 'Assign Role',
    inputOptions: mockOptions,
    design: 'neumorphic',
  },
};