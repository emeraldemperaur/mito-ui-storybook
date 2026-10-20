import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { ErrorBoundary } from './ErrorBoundary';
import { useState } from 'react';

const BuggyComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  
  if (shouldThrow) {
    throw new Error("Simulated Runtime Exception!");
  }
  
  return (
    <div style={{ padding: '2rem', border: '1px solid green', borderRadius: '8px' }}>
      <h3>System Stable</h3>
      <button onClick={() => setShouldThrow(true)} type="button">
        Trigger Crash
      </button>
    </div>
  );
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Layout/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  args: {
    children: <BuggyComponent />,
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const StandardCatch: Story = {
  args: {
    fallback: (error: Error, reset: () => void) => (
      <div style={{ padding: '2rem', border: '1px solid red', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
        <h3 style={{ color: '#991b1b', margin: 0 }}>System Fault Detected</h3>
        <p style={{ color: '#7f1d1d' }}>{error.message}</p>
        <button onClick={reset} type="button">Reboot Component</button>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('System Stable')).toBeInTheDocument();
    
    const crashButton = canvas.getByRole('button', { name: /trigger crash/i });
    await userEvent.click(crashButton);
    
    expect(canvas.getByText('System Fault Detected')).toBeInTheDocument();
    expect(canvas.getByText('Simulated Runtime Exception!')).toBeInTheDocument();
  },
};