import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { CountrySelectInput } from './CountrySelectInput';
import { Row } from '../Layout/Row';
import { Formik, Form } from 'formik';

const meta: Meta<typeof CountrySelectInput> = {
  title: 'Inputs/CountrySelectInput',
  component: CountrySelectInput,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    multiselect: { control: 'boolean' },
    enableSearch: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <div style={{ padding: '3rem', backgroundColor: isNeu ? '#e0e5ec' : 'transparent', minHeight: '500px' }}>
          <Formik initialValues={{ country: context.args.multiselect ? [] : '' }} onSubmit={fn()}>
            <Form><Row><Story /></Row></Form>
          </Formik>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CountrySelectInput>;

export const SingleWithSearch: Story = {
  args: {
    alias: 'country',
    inputLabel: 'Citizenship',
    enableSearch: true,
    design: 'outline',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    
    await step('Open Dropdown', async () => {
      const trigger = canvas.getByRole('button', { name: /select country/i });
      await userEvent.click(trigger);
    });

    await step('Search and Select', async () => {
      const searchInput = await body.findByPlaceholderText('Search countries...');
      await userEvent.type(searchInput, 'Canada');
      
      const canadaOption = await body.findByText('Canada');
      await userEvent.click(canadaOption);
    });

    await step('Verify Selection', async () => {
      expect(await canvas.findByText('Canada')).toBeInTheDocument();
    });
  },
};

export const MultiSelectNeumorphic: Story = {
  args: {
    alias: 'country',
    inputLabel: 'Target Markets',
    multiselect: true,
    enableSearch: true,
    design: 'neumorphic',
  },
};