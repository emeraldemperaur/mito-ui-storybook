import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from './ErrorBoundary';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

/**
 * A volatile widget designed to intentionally throw a runtime exception during render.
 * Used exclusively to demonstrate the ErrorBoundary interception capabilities.
 */
const VolatileWidget = ({ name = "Primary Data Grid" }: { name?: string }) => {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error(`[SIMULATED FAULT]: React execution halted inside ${name}. Payload undefined.`);
  }

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f8fafc', 
      border: '1px solid #e2e8f0', 
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'flex-start'
    }}>
      <h3 style={{ margin: 0, color: '#334155', fontSize: '16px' }}>
        <span style={{ color: '#10b981', marginRight: '8px' }}>●</span> 
        {name} (Stable)
      </h3>
      <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
        This module is rendering successfully. Click the button below to inject a fatal runtime error into the React execution thread.
      </p>
      <button 
        onClick={() => setShouldCrash(true)}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#ef4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          fontWeight: '600', 
          cursor: 'pointer',
          marginTop: '8px'
        }}
      >
        Inject Fault
      </button>
    </div>
  );
};

/**
 * Enterprise-grade runtime error boundary. Intercepts fatal JavaScript exceptions anywhere in its 
 * nested child component tree, preventing total application crashes while surfacing recovery options 
 * and firing external telemetry hooks (e.g., Sentry, Datadog).
 */
const meta: Meta<typeof ErrorBoundary> = {
  title: 'HigherOrderComponent/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Wrap high-risk, data-heavy, or third-party component blocks in an `ErrorBoundary` to gracefully isolate crashes and maintain the surrounding UI architecture.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode.replace(/render:.*?\(\)\s*=>\s*/, '').replace(/^\{\s*(<ErrorBoundary)/, '$1').replace(/(<\/ErrorBoundary>)\s*\}$/, '$1');
          const importStatement = `import { ErrorBoundary } from '@emeraldemepraur/mito-ui';\n\n`;
          return `${importStatement}${cleanCode.trim()}`;
        },
      },
    },
  },
  argTypes: {
    fallback: {
      control: false,
      description: 'The visual fallback rendered when a fault is caught. Accepts a static `ReactNode` or an interactive render-prop function: `(error, reset) => ReactNode`.',
      table: { category: 'UI Configuration' },
    },
    onError: {
      action: 'onError (Telemetry Triggered)',
      description: 'Callback execution hook triggered immediately when an error is caught. Used to inject external telemetry tracking without polluting the UI primitive.',
      table: { category: 'Telemetry & Events' },
    },
    children: {
      control: false,
      description: 'The primary component tree to monitor for runtime exceptions.',
      table: { category: 'Composition' },
    },
  },
  decorators: [
    (Story) => (
      <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 0', fontFamily: 'system-ui, sans-serif' }}>
          <Story />
        </div>
      </GlobalUIContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

// ---------------------------------------------------------------------------
// CORE VARIANTS
// ---------------------------------------------------------------------------

/**
 * **Interactive Render-Prop Fallback (Recommended):**
 * Showcases the optimal DX pattern. By passing a function to the `fallback` prop, 
 * you gain access to the raw `Error` object for detailed messaging and the `reset` 
 * trigger to attempt a component remount without refreshing the page.
 */
export const InteractiveRecovery: Story = {
  render: (args) => (
    <ErrorBoundary
      {...args}
      fallback={(error, reset) => (
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #f87171', 
          borderRadius: '8px' 
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#991b1b', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            System Fault Intercepted
          </h3>
          <div style={{ padding: '12px', backgroundColor: '#7f1d1d', color: '#fecaca', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px', marginBottom: '16px' }}>
            {error.message}
          </div>
          <button 
            onClick={reset}
            style={{ 
              padding: '10px 16px', 
              backgroundColor: '#dc2626', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: '600', 
              cursor: 'pointer' 
            }}
          >
            Reboot Component
          </button>
        </div>
      )}
    >
      <VolatileWidget name="Revenue Chart Module" />
    </ErrorBoundary>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { ErrorBoundary } from '@emeraldemepraur/mito-ui';

<ErrorBoundary
  onError={(error, info) => Datadog.logException(error, info)}
  fallback={(error, reset) => (
    <div className="fault-container">
      <h3>System Fault Intercepted</h3>
      <code>{error.message}</code>
      <button onClick={reset}>Reboot Component</button>
    </div>
  )}
>
  <RevenueChartModule />
</ErrorBoundary>`,
      },
    },
  },
};

/**
 * **Static Fallback:**
 * A basic fallback providing a static `ReactNode`. This is useful for minor UI elements 
 * (like avatars or icons) where a complex recovery interface isn't necessary, and a simple 
 * placeholder is preferred upon failure.
 */
export const StaticPlaceholder: Story = {
  render: (args) => (
    <ErrorBoundary
      {...args}
      fallback={
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#fffbeb', 
          border: '1px dashed #f59e0b', 
          borderRadius: '8px',
          color: '#b45309',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          Widget temporarily unavailable. Our team has been notified.
        </div>
      }
    >
      <VolatileWidget name="Minor Avatar Module" />
    </ErrorBoundary>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { ErrorBoundary } from '@emeraldemepraur/mito-ui';

<ErrorBoundary fallback={<div className="placeholder">Widget unavailable.</div>}>
  <MinorAvatarModule />
</ErrorBoundary>`,
      },
    },
  },
};

/**
 * **Telemetry Integration Mock:**
 * While identical visually to the Interactive Recovery story, this demonstrates how 
 * to utilize the `onError` prop to pipe stack traces into monitoring services like Sentry. 
 * Check your Storybook Actions tab when you click "Inject Fault" to see the simulated payload.
 */
export const TelemetryIntegration: Story = {
  render: (args) => (
    <ErrorBoundary
      {...args}
      onError={(error, info) => {
        args.onError?.(error, info); 
        console.info("[Mock Sentry Sdk] Payload captured: ", { error: error.message, stack: info.componentStack });
      }}
      fallback={(_error, reset) => (
        <div style={{ padding: '24px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Service Disconnected</h3>
          <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>Telemetry data has been dispatched automatically.</p>
          <button onClick={reset} style={{ padding: '8px 16px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Retry Connection</button>
        </div>
      )}
    >
      <VolatileWidget name="External API Widget" />
    </ErrorBoundary>
  ),
};