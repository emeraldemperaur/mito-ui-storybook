import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { Accordion, AccordionItem } from './Accordion';
import { Row } from './Row';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    design: {
      control: 'radio',
      options: ['material', 'outline', 'neumorphic'],
      description: 'The design variation of the Accordion.',
    },
    allowMultiple: {
      control: 'boolean',
      description: 'Allow multiple sections to be open concurrently.',
    },
    width: { control: { type: 'range', min: 1, max: 12, step: 1 } },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <div style={{ 
          padding: '2rem', 
          backgroundColor: isNeu ? '#e0e5ec' : 'transparent',
          minHeight: '400px'
        }}>
          <Row>
            <Story />
          </Row>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const OutlineSingle: Story = {
  args: {
    design: 'outline',
    allowMultiple: false,
    width: 8,
    children: (
      <>
        <AccordionItem sectionId="faq-1" title="What is the VΣ Protocol?" subtitle="Basic overview">
          The VΣ Protocol is a decentralized data integrity layer.
        </AccordionItem>
        <AccordionItem sectionId="faq-2" title="How do I get started?">
          Documentation is available in the developer portal.
        </AccordionItem>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByText('What is the VΣ Protocol?');
    
    expect(firstTrigger.closest('button')).toHaveAttribute('aria-expanded', 'false');
    
    await userEvent.click(firstTrigger);
    
    expect(firstTrigger.closest('button')).toHaveAttribute('aria-expanded', 'true');
    expect(canvas.getByText('The VΣ Protocol is a decentralized data integrity layer.')).toBeVisible();
  },
};

export const NeumorphicMultiple: Story = {
  args: {
    design: 'neumorphic',
    allowMultiple: true,
    width: 12,
    children: (
      <>
        <AccordionItem sectionId="n-1" title="Account Settings">Update your email and password.</AccordionItem>
        <AccordionItem sectionId="n-2" title="Billing Information">Manage payment methods.</AccordionItem>
        <AccordionItem sectionId="n-3" title="API Keys">Generate and revoke access tokens.</AccordionItem>
      </>
    ),
  },
};