import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { Codex, CodexItem, CodexControls } from './Codex';
import { Row } from './Row';

const meta: Meta<typeof Codex> = {
  title: 'Components/Codex',
  component: Codex,
  tags: ['autodocs'],
  argTypes: {
    design: {
      control: 'radio',
      options: ['material', 'outline', 'neumorphic'],
    },
    width: { control: { type: 'range', min: 1, max: 12 } },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      return (
        <div style={{ padding: '2rem', backgroundColor: isNeu ? '#e0e5ec' : 'transparent' }}>
          <Row><Story /></Row>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Codex>;

export const InteractiveStepper: Story = {
  args: {
    design: 'outline',
    width: 12,
    children: (
      <>
        <CodexItem stepId="step-1" title="Account Setup" subtitleDescription="Create credentials">
          <div style={{ padding: '2rem', border: '1px dashed #ccc', textAlign: 'center' }}>
            <h3>Step 1: Enter your email</h3>
            <CodexControls nextStepId="step-2" />
          </div>
        </CodexItem>
        <CodexItem stepId="step-2" title="Organization" subtitleDescription="Team details">
          <div style={{ padding: '2rem', border: '1px dashed #ccc', textAlign: 'center' }}>
            <h3>Step 2: Name your workspace</h3>
            <CodexControls prevStepId="step-1" nextStepId="step-3" />
          </div>
        </CodexItem>
        <CodexItem stepId="step-3" title="Complete">
          <div style={{ padding: '2rem', border: '1px dashed #ccc', textAlign: 'center' }}>
            <h3>Step 3: Ready to go!</h3>
            <CodexControls prevStepId="step-2" finishLabel="Launch App" nextStepId="" />
          </div>
        </CodexItem>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Step 1: Enter your email')).toBeInTheDocument();
    
    const nextBtn = canvas.getByRole('button', { name: /go to next step/i });
    await userEvent.click(nextBtn);
    
    expect(canvas.getByText('Step 2: Name your workspace')).toBeInTheDocument();
    
    const step1Node = canvas.getByRole('button', { name: /Step 1: Account Setup/i });
    expect(step1Node).toHaveClass('completed');
  },
};