import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { Input } from './Input';
import { Icon } from '../../components/icons/Icons';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof Input> = {
  title: 'Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    type: { control: 'select', options: ['text', 'email', 'tel', 'url', 'search'] },
  },
  decorators: [
    (Story, context) => (
      <div style={{ padding: '2rem', backgroundColor: context.args.design === 'neumorphic' ? '#e0e5ec' : 'transparent' }}>
        <Formik initialValues={{ username: '' }} onSubmit={fn()}>
          <Form><Row><Story /></Row></Form>
        </Formik>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const StandardText: Story = {
  args: {
    alias: 'username',
    inputLabel: 'Username',
    placeholder: 'Enter your username',
    design: 'outline',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /username/i });
    await userEvent.type(input, 'johndoe123');
    expect(input).toHaveValue('johndoe123');
  },
};

export const WithIconNeumorphic: Story = {
  args: {
    alias: 'username',
    inputLabel: 'Search Database',
    type: 'search',
    icon: <Icon name="search" />,
    design: 'neumorphic',
  },
};