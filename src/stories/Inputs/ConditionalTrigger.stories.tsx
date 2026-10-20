import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { ConditionalTrigger, GlobalFormContext } from './ConditionalTrigger';
import { Input } from './Input';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof ConditionalTrigger> = {
  title: 'Inputs/ConditionalTrigger',
  component: ConditionalTrigger,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    triggerType: { control: 'radio', options: ['toggle', 'checkbox', 'select'] },
    width: { control: { type: 'range', min: 1, max: 12 } },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <GlobalFormContext.Provider value={{ brandColor: '#3b82f6' }}>
          <div style={{ padding: '2rem', backgroundColor: isNeu ? '#e0e5ec' : 'transparent', minHeight: '300px' }}>
            <Formik initialValues={{ requiresShipping: false, additionalNotes: '' }} onSubmit={fn()}>
              <Form>
                <Row><Story /></Row>
              </Form>
            </Formik>
          </div>
        </GlobalFormContext.Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ConditionalTrigger>;

export const ToggleReveal: Story = {
  args: {
    alias: 'requiresShipping',
    inputLabel: 'Require Physical Shipping?',
    triggerType: 'toggle',
    triggerValue: true,
    design: 'outline',
    children: (
      <Input alias="shippingAddress" inputLabel="Shipping Address" placeholder="123 Main St" />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('switch', { name: /require physical shipping/i });
    
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    
    await userEvent.click(trigger);
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(canvas.getByLabelText(/shipping address/i)).toBeInTheDocument();
  },
};

export const NeumorphicSelectTrigger: Story = {
  args: {
    alias: 'requiresShipping', 
    inputLabel: 'Select Delivery Method',
    triggerType: 'select',
    triggerValue: 'express',
    design: 'neumorphic',
    inputOptions: [
      { optionid: '1', optionvalue: 'standard', text: 'Standard (3-5 days)' },
      { optionid: '2', optionvalue: 'express', text: 'Express (Overnight)' },
    ],
    children: (
      <div style={{ padding: '1rem' }}>Express shipping adds a $15.00 surcharge.</div>
    ),
  },
};