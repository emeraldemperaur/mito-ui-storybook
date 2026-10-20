import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, fn } from '@storybook/test';
import { VectorSigma } from './VectorSigma';
import { useMemo } from 'react';

const VectorSigmaShowcase = (args: any) => {
  const vsInstance = useMemo(() => {
    const engine = new VectorSigma()
      .setName("Onboarding Form")
      .setBrand(args.brandColor || "#2563eb")
      .createSection("personal", "Personal Information", "Tell us about yourself", "user")
      .addQueryToSection("personal", {
        queryId: 1,
        inputAlias: "fullName",
        inputLabel: "Full Name",
        inputType: "text",
        isRequired: true,
        inputWidth: 6,
        inputPlaceholder: "John Doe",
      })
      .addQueryToSection("personal", {
        queryId: 2,
        inputAlias: "accountType",
        inputLabel: "Account Type",
        inputType: "dropdown",
        isRequired: true,
        inputWidth: 6,
        inputOptions: [
          { optionid: 1, optionvalue: 'personal', text: 'Personal' },
          { optionid: 2, optionvalue: 'business', text: 'Business' },
        ]
      })
      .createSection("preferences", "System Preferences", "Configure your experience", "settings")
      .addQueryToSection("preferences", {
        queryId: 3,
        inputAlias: "notifications",
        inputLabel: "Enable Notifications",
        inputType: "toggle",
        inputWidth: 12,
        newRow: true,
        toggledInput: {
          queryId: 4,
          inputAlias: "notificationEmail",
          inputLabel: "Notification Email",
          inputType: "email",
          inputWidth: 12,
          isRequired: true,
        }
      });

    return engine;
  }, [args.brandColor]);

  return vsInstance.render({
    displayMode: args.displayMode,
    readOnlyMode: args.readOnlyMode,
    onSubmit: args.onSubmit,
  });
};

const meta: Meta<typeof VectorSigmaShowcase> = {
  title: 'Engine/VectorSigma',
  component: VectorSigmaShowcase,
  tags: ['autodocs'],
  argTypes: {
    displayMode: { control: 'radio', options: ['codice', 'codex', 'accordion', 'dual'] },
    readOnlyMode: { control: 'boolean' },
    brandColor: { control: 'color' },
  },
  args: {
    onSubmit: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '600px', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VectorSigmaShowcase>;

export const CodiceStandardView: Story = {
  args: {
    displayMode: 'codice', 
    brandColor: '#2563eb',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Fill out text field', async () => {
      const nameInput = canvas.getByRole('textbox', { name: /full name/i });
      await userEvent.type(nameInput, 'Commander Shepard');
      expect(nameInput).toHaveValue('Commander Shepard');
    });

    await step('Trigger conditional rendering', async () => {
      const toggle = canvas.getByRole('switch', { name: /enable notifications/i });
      await userEvent.click(toggle);
      
      // The nested email input should appear
      const emailInput = await canvas.findByRole('textbox', { name: /notification email/i });
      expect(emailInput).toBeInTheDocument();
      await userEvent.type(emailInput, 'shepard@alliance.com');
    });

    await step('Submit Form Engine', async () => {
      const submitBtn = canvas.getByRole('button', { name: /submit/i });
      await userEvent.click(submitBtn);
      
     
      expect(await canvas.findByText(/this field is required/i)).toBeInTheDocument();
    });
  },
};

export const CodexStepperView: Story = {
  args: {
    displayMode: 'codex', 
    brandColor: '#059669', 
  },
};

export const AccordionView: Story = {
  args: {
    displayMode: 'accordion', 
    brandColor: '#7c3aed', 
  },
};

export const ReadOnlyMode: Story = {
  args: {
    displayMode: 'codice',
    readOnlyMode: true,
  },
};