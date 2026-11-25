import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberCounter, type NumberCounterProps } from './NumberCounter';
import '../../styles/fonts.scss';

const meta: Meta<typeof NumberCounter> = {
  title: 'Information/NumberCounter',
  component: NumberCounter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      story: { inline: true },
      description: {
        component:
          'SSR-safe, 60fps `requestAnimationFrame` incremental number counter with configurable easing curves, automatic locale comma formatting, and `tabular-nums` alignment to eliminate horizontal layout shift during live telemetry updates.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // CORE DATA & FORMATTING
    // ----------------------------------------------------------------------
    value: {
      control: { type: 'number', step: 100 },
      description: 'The target numeric value to count toward.',
      table: { category: 'Core Data & Formatting', type: { summary: 'number' } },
    },
    startFrom: {
      control: { type: 'number', step: 100 },
      description: 'The starting value for the initial mount animation.',
      table: { category: 'Core Data & Formatting', defaultValue: { summary: '0' }, type: { summary: 'number' } },
    },
    formatWithCommas: {
      control: 'boolean',
      description: 'Formats the rendered number with locale-standard thousand separators (e.g., 2,426,616).',
      table: { category: 'Core Data & Formatting', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } },
    },
    decimals: {
      control: { type: 'number', min: 0, max: 6, step: 1 },
      description: 'Number of decimal places to retain during and after animation.',
      table: { category: 'Core Data & Formatting', defaultValue: { summary: '0' }, type: { summary: 'number' } },
    },
    prefix: {
      control: 'text',
      description: "Optional prefix string prepended to the number (e.g., '$', '+').",
      table: { category: 'Core Data & Formatting', defaultValue: { summary: "''" }, type: { summary: 'string' } },
    },
    suffix: {
      control: 'text',
      description: "Optional suffix string appended to the number (e.g., '%', 'ms', ' km').",
      table: { category: 'Core Data & Formatting', defaultValue: { summary: "''" }, type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // ANIMATION & MOTION
    // ----------------------------------------------------------------------
    animate: {
      control: 'boolean',
      description: 'Toggles the incremental count-up animation. When false, renders the final value immediately.',
      table: { category: 'Animation & Motion', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } },
    },
    duration: {
      control: { type: 'range', min: 100, max: 5000, step: 100 },
      description: 'Total duration of the count-up animation in milliseconds.',
      table: { category: 'Animation & Motion', defaultValue: { summary: '1500' }, type: { summary: 'number' } },
    },
    easing: {
      control: 'select',
      options: ['linear', 'easeOut', 'easeInOut'],
      description: 'Mathematical easing curve applied to the interpolation.',
      table: { category: 'Animation & Motion', defaultValue: { summary: "'easeOut'" }, type: { summary: "'linear' | 'easeOut' | 'easeInOut'" } },
    },
    fadeIn: {
      control: 'boolean',
      description: 'Enables a subtle opacity fade-in transition on initial mount.',
      table: { category: 'Animation & Motion', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } },
    },

    // ----------------------------------------------------------------------
    // THEMING & TYPOGRAPHY
    // ----------------------------------------------------------------------
    darkMode: {
      control: 'boolean',
      description: 'Force dark mode rendering independent of parent context.',
      table: { category: 'Theming & Typography', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    color: {
      control: 'color',
      description: 'Explicit text color override for light mode.',
      table: { category: 'Theming & Typography', type: { summary: 'string' } },
    },
    darkColor: {
      control: 'color',
      description: 'Explicit text color override for dark mode.',
      table: { category: 'Theming & Typography', type: { summary: 'string' } },
    },
    fontSize: {
      control: 'text',
      description: "Custom font size override (e.g., '2rem', '48px', or 32).",
      table: { category: 'Theming & Typography', type: { summary: 'string | number' } },
    },
    fontWeight: {
      control: 'select',
      options: [300, 400, 500, 600, 700, 800, 900],
      description: 'Custom CSS font-weight override.',
      table: { category: 'Theming & Typography', defaultValue: { summary: '700' }, type: { summary: "React.CSSProperties['fontWeight']" } },
    },
    fontFamily: {
      control: 'text',
      description: 'Custom CSS font-family override.',
      table: { category: 'Theming & Typography', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // UNIVERSAL ATTRIBUTES
    // ----------------------------------------------------------------------
    asChild: {
      control: 'boolean',
      description: 'Delegates rendering to the immediate child element via Radix Slot.',
      table: { category: 'Universal Attributes', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    className: {
      control: 'text',
      description: 'Standard CSS class name appended directly to the root span element.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } },
    },
    style: {
      control: 'object',
      description: 'Inline CSS style overrides applied to the root span element.',
      table: { category: 'Universal Attributes', type: { summary: 'React.CSSProperties' } },
    },
  },
  args: {
    value: 2426616,
    startFrom: 0,
    animate: true,
    duration: 1500,
    easing: 'easeOut',
    formatWithCommas: true,
    decimals: 0,
    prefix: '',
    suffix: '',
    fadeIn: true,
    darkMode: false,
    color: '#0f172a',
    darkColor: '#f8fafc',
    fontSize: '3rem',
    fontWeight: 700,
    fontFamily: 'Inter, system-ui, sans-serif',
    asChild: false,
  },
};

export default meta;
type Story = StoryObj<NumberCounterProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: (args) => {
    const [replayKey, setReplayKey] = useState(0);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '48px 32px',
          backgroundColor: args.darkMode ? '#0f172a' : '#f8fafc',
          borderRadius: '16px',
          border: args.darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
        }}
      >
        <NumberCounter key={replayKey} {...args} />
        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: args.darkMode ? '1px solid #334155' : '1px solid #cbd5e1',
            backgroundColor: args.darkMode ? '#1e293b' : '#ffffff',
            color: args.darkMode ? '#e2e8f0' : '#334155',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Replay Mount Animation
        </button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground exposing all props. Adjust `value`, `decimals`, `prefix`, `suffix`, `duration`, or `easing` in the Controls table, or click **Replay Mount Animation** to re-test `startFrom` and `fadeIn`.',
      },
      source: {
        code: `import { NumberCounter } from '@emeraldemperaur/mito-ui';

export const BasicCounter = () => (
  <NumberCounter
    value={2426616}
    startFrom={0}
    animate={true}
    duration={1500}
    easing="easeOut"
    formatWithCommas={true}
    fontSize="3rem"
    fontWeight={700}
  />
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. AI QUANTITATIVE FINANCE TERMINAL (LIVE STREAMING DELTAS)
// ---------------------------------------------------------------------------
export const AIFinanceTradingTerminal: Story = {
  render: () => {
    const [aum, setAum] = useState(4892410.75);
    const [alphaYield, setAlphaYield] = useState(18.42);
    const [latency, setLatency] = useState(11.4);
    const [tradesExecuted, setTradesExecuted] = useState(148290);

    const simulateMarketTick = () => {
      setAum((prev) => +(prev + (Math.random() * 45000 - 12000)).toFixed(2));
      setAlphaYield((prev) => +(prev + (Math.random() * 1.4 - 0.5)).toFixed(2));
      setLatency(+(8 + Math.random() * 9).toFixed(1));
      setTradesExecuted((prev) => prev + Math.floor(Math.random() * 850 + 120));
    };

    const cardStyle: React.CSSProperties = {
      backgroundColor: '#0f172a',
      border: '1px solid #1e293b',
      borderRadius: '12px',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    };

    const labelStyle: React.CSSProperties = {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#94a3b8',
    };

    return (
      <div
        style={{
          padding: '32px',
          backgroundColor: '#020617',
          borderRadius: '16px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>
              Autonomous Quant Fund: Live Execution Desk
            </h3>
            <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Smooth delta interpolation with zero horizontal layout shift via tabular-nums.
            </span>
          </div>
          <button
            type="button"
            onClick={simulateMarketTick}
            style={{
              padding: '9px 18px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
            }}
          >
            Simulate Market Tick
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={cardStyle}>
            <span style={labelStyle}>Assets Under Management</span>
            <NumberCounter
              value={aum}
              prefix="$"
              decimals={2}
              duration={900}
              easing="easeOut"
              darkMode={true}
              darkColor="#f8fafc"
              fontSize="1.75rem"
              fontWeight={700}
            />
          </div>

          <div style={cardStyle}>
            <span style={labelStyle}>30D AI Alpha Yield</span>
            <NumberCounter
              value={alphaYield}
              prefix="+"
              suffix="%"
              decimals={2}
              duration={800}
              easing="easeOut"
              darkMode={true}
              darkColor="#34d399"
              fontSize="1.75rem"
              fontWeight={700}
            />
          </div>

          <div style={cardStyle}>
            <span style={labelStyle}>Order Routing Latency</span>
            <NumberCounter
              value={latency}
              suffix="ms"
              decimals={1}
              duration={600}
              easing="easeInOut"
              darkMode={true}
              darkColor="#38bdf8"
              fontSize="1.75rem"
              fontWeight={700}
            />
          </div>

          <div style={cardStyle}>
            <span style={labelStyle}>Executions Today</span>
            <NumberCounter
              value={tradesExecuted}
              duration={900}
              easing="easeOut"
              darkMode={true}
              darkColor="#c084fc"
              fontSize="1.75rem"
              fontWeight={700}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates real-time financial telemetry using `prefix`, `suffix`, `decimals`, and `darkColor`. Click **Simulate Market Tick** to watch each counter smoothly interpolate from its previous value to the new target without shifting surrounding card layouts.',
      },
      source: {
        code: `import React, { useState } from 'react';
import { NumberCounter } from '@emeraldemperaur/mito-ui';

export const QuantTradingKPIs = () => {
  const [aum, setAum] = useState(4892410.75);
  const [alphaYield, setAlphaYield] = useState(18.42);
  const [latency, setLatency] = useState(11.4);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <NumberCounter
        value={aum}
        prefix="$"
        decimals={2}
        duration={900}
        darkMode={true}
        darkColor="#f8fafc"
        fontSize="1.75rem"
      />
      <NumberCounter
        value={alphaYield}
        prefix="+"
        suffix="%"
        decimals={2}
        duration={800}
        darkMode={true}
        darkColor="#34d399"
        fontSize="1.75rem"
      />
      <NumberCounter
        value={latency}
        suffix="ms"
        decimals={1}
        duration={600}
        easing="easeInOut"
        darkMode={true}
        darkColor="#38bdf8"
        fontSize="1.75rem"
      />
    </div>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 3. AUTONOMOUS ROBOTICS & UAV SWARM TELEMETRY
// ---------------------------------------------------------------------------
export const RoboticsFleetTelemetry: Story = {
  render: () => (
    <div
      style={{
        padding: '32px',
        backgroundImage: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        borderRadius: '16px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', color: '#ffffff', fontSize: '1.15rem' }}>
        Autonomous UAV Swarm — Sector Telemetry
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {[
          { label: 'Active Swarm Units', value: 1248, suffix: '', decimals: 0, color: '#ffffff' },
          { label: 'Autonomous Distance', value: 842910, suffix: ' km', decimals: 0, color: '#38bdf8' },
          { label: 'Vision Inference Rate', value: 94500, suffix: ' ops/s', decimals: 0, color: '#a78bfa' },
          { label: 'Mean Fleet Battery', value: 96.8, suffix: '%', decimals: 1, color: '#34d399' },
        ].map((metric) => (
          <div
            key={metric.label}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {metric.label}
            </span>
            <NumberCounter
              value={metric.value}
              suffix={metric.suffix}
              decimals={metric.decimals}
              duration={1800}
              easing="easeOut"
              color={metric.color}
              fontSize="1.85rem"
              fontWeight={700}
            />
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Showcases `NumberCounter` inside frosted glassmorphic telemetry cards for an autonomous robotics command center.',
      },
      source: {
        code: `import { NumberCounter } from '@emeraldemperaur/mito-ui';

export const SwarmMetrics = () => (
  <div style={{ display: 'flex', gap: '24px' }}>
    <NumberCounter value={1248} duration={1800} fontSize="1.85rem" color="#ffffff" />
    <NumberCounter value={842910} suffix=" km" duration={1800} fontSize="1.85rem" color="#38bdf8" />
    <NumberCounter value={94500} suffix=" ops/s" duration={1800} fontSize="1.85rem" color="#a78bfa" />
    <NumberCounter value={96.8} suffix="%" decimals={1} duration={1800} fontSize="1.85rem" color="#34d399" />
  </div>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 4. EASING CURVES COMPARISON
// ---------------------------------------------------------------------------
export const EasingCurvesComparison: Story = {
  render: () => {
    const [runId, setRunId] = useState(0);

    return (
      <div
        style={{
          padding: '32px',
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>Interpolation Easing Curves (2500ms)</h3>
          <button
            type="button"
            onClick={() => setRunId((r) => r + 1)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Trigger All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {(['linear', 'easeOut', 'easeInOut'] as const).map((curve) => (
            <div
              key={`${curve}-${runId}`}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                easing="{curve}"
              </span>
              <NumberCounter
                value={100000}
                duration={2500}
                easing={curve}
                color="#0f172a"
                fontSize="2rem"
                fontWeight={700}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of `linear`, `easeOut` (cubic deceleration), and `easeInOut` (cubic acceleration/deceleration) over a 2.5-second duration.',
      },
      source: {
        code: `import { NumberCounter } from '@emeraldemperaur/mito-ui';

export const EasingComparison = () => (
  <div style={{ display: 'flex', gap: '32px' }}>
    <NumberCounter value={100000} duration={2500} easing="linear" fontSize="2rem" />
    <NumberCounter value={100000} duration={2500} easing="easeOut" fontSize="2rem" />
    <NumberCounter value={100000} duration={2500} easing="easeInOut" fontSize="2rem" />
  </div>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 5. STATIC & UNFORMATTED (IDENTIFIERS, YEARS & PORTS)
// ---------------------------------------------------------------------------
export const StaticAndUnformatted: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap',
        padding: '32px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>BUILD YEAR (NO COMMAS)</span>
        <NumberCounter value={2026} formatWithCommas={false} animate={false} fontSize="1.75rem" color="#0f172a" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>MCP PORT (STATIC)</span>
        <NumberCounter value={8080} prefix=":" formatWithCommas={false} animate={false} fontSize="1.75rem" color="#2563eb" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Disabling `animate={false}` and `formatWithCommas={false}` allows `NumberCounter` to render static numeric identifiers like years, build numbers, or network ports without thousand separators.',
      },
      source: {
        code: `import { NumberCounter } from '@emeraldemperaur/mito-ui';

export const StaticIdentifiers = () => (
  <>
    <NumberCounter value={2026} formatWithCommas={false} animate={false} fontSize="1.75rem" />
    <NumberCounter value={8080} prefix=":" formatWithCommas={false} animate={false} fontSize="1.75rem" />
  </>
);`,
      },
    },
  },
};