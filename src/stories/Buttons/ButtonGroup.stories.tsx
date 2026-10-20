import type { Meta, StoryObj } from '@storybook/react';
import { fn, within, expect, userEvent } from '@storybook/test';
import { ButtonGroup } from './ButtonGroup';
import { Formik, Form } from 'formik';
import { useState } from 'react';

const ControlledButtonGroup = (args: any) => {
  const [value, setValue] = useState(args.multiselect ? ['1'] : '1');
  return (
    <ButtonGroup.Root {...args} value={value} onChange={setValue}>
      <ButtonGroup.Item value="1">Daily</ButtonGroup.Item>
      <ButtonGroup.Item value="2">Weekly</ButtonGroup.Item>
      <ButtonGroup.Item value="3">Monthly</ButtonGroup.Item>
    </ButtonGroup.Root>
  );
};

const meta: Meta<typeof ButtonGroup.Root> = {
  title: 'Buttons/ButtonGroup',
  component: ButtonGroup.Root,
  tags: ['autodocs'],
  argTypes: {
    design: {
      control: 'radio',
      options: ['material', 'outline', 'neumorphic'],
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    multiselect: { control: 'boolean' },
    neuIntensity: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <div style={{ 
          padding: '2rem', 
          backgroundColor: isNeu ? '#e0e5ec' : 'transparent',
          borderRadius: '8px'
        }}>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup.Root>;

export const OutlineHorizontal: Story = {
  render: (args) => <ControlledButtonGroup {...args} />,
  args: {
    design: 'outline',
    orientation: 'horizontal',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const weeklyBtn = canvas.getByRole('radio', { name: /weekly/i });
    await userEvent.click(weeklyBtn);
    expect(weeklyBtn).toHaveAttribute('aria-checked', 'true');
    expect(weeklyBtn).toHaveAttribute('data-state', 'on');
  },
};

export const MaterialVertical: Story = {
  render: (args) => <ControlledButtonGroup {...args} />,
  args: {
    design: 'material',
    orientation: 'vertical',
  },
};

export const Neumorphic: Story = {
  render: (args) => <ControlledButtonGroup {...args} />,
  args: {
    design: 'neumorphic',
    neuIntensity: 1,
    elevation: 4,
  },
};

export const WithFormikIntegration: Story = {
  render: (args) => (
    <Formik 
      initialValues={{ frequency: '2' }} 
      onSubmit={fn()}
    >
      <Form>
        <ButtonGroup.Root {...args} alias="frequency">
          <ButtonGroup.Item value="1">Option A</ButtonGroup.Item>
          <ButtonGroup.Item value="2">Option B</ButtonGroup.Item>
          <ButtonGroup.Item value="3">Option C</ButtonGroup.Item>
        </ButtonGroup.Root>
      </Form>
    </Formik>
  ),
  args: {
    design: 'outline',
  },
};