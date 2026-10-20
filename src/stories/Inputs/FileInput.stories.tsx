import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { FileInput } from './FileInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof FileInput> = {
  title: 'Inputs/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    multiple: { control: 'boolean' },
    preview: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <div style={{ padding: '2rem', backgroundColor: isNeu ? '#e0e5ec' : 'transparent', minHeight: '400px' }}>
          <Formik initialValues={{ document: context.args.multiple ? [] : null }} onSubmit={fn()}>
            <Form><Row><Story /></Row></Form>
          </Formik>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof FileInput>;

export const SingleUpload: Story = {
  args: {
    alias: 'document',
    inputLabel: 'Profile Picture',
    multiple: false,
    preview: true,
    design: 'outline',
    accept: 'image/*',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const file = new File(['hello'], 'profile.png', { type: 'image/png' });
    
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    
    await userEvent.upload(input, file);
    
    expect(await canvas.findByText('profile.png')).toBeInTheDocument();
    expect(canvas.getByText('1 file attached')).toBeInTheDocument();
  },
};

export const MultiFileUploadNeumorphic: Story = {
  args: {
    alias: 'document',
    inputLabel: 'Supporting Documents',
    multiple: true,
    design: 'neumorphic',
  },
};