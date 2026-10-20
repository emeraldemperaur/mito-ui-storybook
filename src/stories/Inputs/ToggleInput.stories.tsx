import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { ToggleInput } from './ToggleInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof ToggleInput> = {
  title: 'Inputs/ToggleInput',
  component: ToggleInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent' }}>
        <Formik initialValues={{ isEnabled: false }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToggleInput>;

export const OutlineToggle: Story = {
  args: {
    alias: 'isEnabled',
    inputLabel: 'Enable Beta Features',
    design: 'outline',
    icon: 'star',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggleBtn = canvas.getByRole('button');
    
    expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-pressed', 'true');
  },
};

export const CustomNeumorphicSwitch: Story = {
  args: {
    alias: 'isEnabled',
    inputLabel: 'Dark Mode',
    design: 'neumorphic',
    icon: 'moon',
  },
};