import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { CheckboxGroupInput } from './CheckboxGroupInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const mockOptions = [
  { optionid: '1', optionvalue: 'read', text: 'Read Access' },
  { optionid: '2', optionvalue: 'write', text: 'Write Access' },
  { optionid: '3', optionvalue: 'delete', text: 'Delete Access' },
];

const meta: Meta<typeof CheckboxGroupInput> = {
  title: 'Inputs/CheckboxGroupInput',
  component: CheckboxGroupInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    direction: { control: 'radio', options: ['row', 'column'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent', minHeight: '200px' }}>
        <Formik initialValues={{ permissions: ['read'] }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CheckboxGroupInput>;

export const InteractiveCheckboxes: Story = {
  args: {
    alias: 'permissions',
    inputLabel: 'User Permissions',
    options: mockOptions,
    design: 'outline',
    direction: 'column',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const writeCheckbox = canvas.getByRole('checkbox', { name: /write access/i });
    expect(writeCheckbox).toHaveAttribute('data-state', 'unchecked');
    
    await userEvent.click(writeCheckbox);
    expect(writeCheckbox).toHaveAttribute('data-state', 'checked');
  },
};

export const NeumorphicRow: Story = {
  args: {
    alias: 'permissions',
    inputLabel: 'System Roles',
    options: mockOptions,
    design: 'neumorphic',
    direction: 'row',
  },
};