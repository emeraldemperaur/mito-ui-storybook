import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useFormik } from 'formik';
import {
  GlobalUIProvider,
  useGlobalUIContext,
  type GlobalUIProviderProps,
  type ThemeColors,
} from './GlobalUIContext';
import { Input } from '../Inputs/Input';
import { ToggleInput } from '../Inputs/ToggleInput';
import { Row } from './Row';

type GlobalUIStoryProps = GlobalUIProviderProps & {
  lightColor?: string;
  darkColor?: string;
};

const ContextTelemetryProbe = ({ label = 'Active Context State' }: { label?: string }) => {
  const context = useGlobalUIContext();

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '16px',
        color: '#f8fafc',
        fontFamily: 'monospace',
        fontSize: '12px',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.25)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
        <span
          style={{
            backgroundColor: context.formikContext ? '#065f46' : '#334155',
            color: context.formikContext ? '#34d399' : '#94a3b8',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          {context.formikContext ? 'FORMIK PIPELINE ATTACHED' : 'STANDALONE THEME MODE'}
        </span>
      </div>

      <pre style={{ margin: 0, color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
        {JSON.stringify(
          {
            themeColors: context.themeColors || 'undefined (using component fallbacks)',
            formikValues: context.formikContext ? context.formikContext.values : 'null',
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

/**
 * Top-level architectural provider for the Mito UI design system.
 * Orchestrates global `themeColors` brand tokens and optionally wraps child trees in an external `FormikProvider` instance without requiring nested `<Formik>` boilerplate.
 */
const meta: Meta<GlobalUIStoryProps> = {
  title: 'Layout/GlobalUIProvider',
  component: GlobalUIProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Wrap your application root or multi-step form containers with `GlobalUIProvider` to distribute `themeColors` (`{ light, dark }`) and inject an imperative `useFormik()` instance (`formikContext`) across all descendant Mito UI primitives. Descendant components safely read this state via `useGlobalUIContext()`, which gracefully falls back to `{}` if no provider is mounted.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          const importStatement = `import { GlobalUIProvider, useGlobalUIContext } from '@emeraldemepraur/mito-ui';\n\n`;
          return `${importStatement}${cleanCode.trim()}`;
        },
      },
    },
  },
  argTypes: {
    // Keep `themeColors` documented in the Docs table while replacing the raw JSON editor with color pickers
    themeColors: {
      control: false,
      description: `**Global brand color tokens** propagated down the React tree via \`useGlobalUIContext()\`. Expects an object matching the \`ThemeColors\` interface:
<br/>
<br/>\`light\` *(string)* — Primary brand accent hex/RGB token for light-mode surfaces (e.g., \`"#2563eb"\`).
<br/>\`dark\` *(string)* — Primary brand accent hex/RGB token for dark-mode surfaces (e.g., \`"#38bdf8"\`).`,
      table: {
        category: 'Theming & Brand',
        type: { summary: '{ light?: string; dark?: string }' },
      },
    },
    lightColor: {
      name: 'themeColors.light',
      control: 'color',
      description: 'Interactive picker for `themeColors.light` — primary brand accent token for light-mode surfaces.',
      table: {
        category: 'Theming & Brand',
        defaultValue: { summary: '#2563eb' },
        type: { summary: 'string' },
      },
    },
    darkColor: {
      name: 'themeColors.dark',
      control: 'color',
      description: 'Interactive picker for `themeColors.dark` — primary brand accent token for dark-mode surfaces.',
      table: {
        category: 'Theming & Brand',
        defaultValue: { summary: '#38bdf8' },
        type: { summary: 'string' },
      },
    },
    formikContext: {
      control: false,
      description:
        'Imperative Formik instance returned by `useFormik()`. When supplied, `GlobalUIProvider` automatically mounts a `<FormikProvider>` around `children`, enabling zero-prop `alias` binding for all nested Mito UI inputs.',
      table: {
        category: 'Form Orchestration',
        type: { summary: 'FormikContextType<any>' },
      },
    },
    children: {
      control: false,
      description: 'Descendant component tree receiving global theme tokens and optional Formik context.',
      table: {
        category: 'Core',
        type: { summary: 'React.ReactNode' },
      },
    },
  },
  args: {
    lightColor: '#2563eb',
    darkColor: '#38bdf8',
  },
};

export default meta;
type Story = StoryObj<GlobalUIStoryProps>;

// ---------------------------------------------------------------------------
// CORE PROVIDER MODES
// ---------------------------------------------------------------------------

export const ThemeTokenPropagation: Story = {
  render: ({ lightColor, darkColor, themeColors }) => {
    const resolvedThemeColors: ThemeColors = {
      light: lightColor ?? themeColors?.light ?? '#2563eb',
      dark: darkColor ?? themeColors?.dark ?? '#38bdf8',
    };

    return (
      <GlobalUIProvider themeColors={resolvedThemeColors}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '560px', fontFamily: 'system-ui, sans-serif' }}>
          <ContextTelemetryProbe label="Injected GlobalUIContext Tokens" />

          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Light Token</span>
              <span
                style={{
                  backgroundColor: resolvedThemeColors.light,
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                }}
              >
                {resolvedThemeColors.light}
              </span>
            </div>

            <div
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>Dark Token</span>
              <span
                style={{
                  backgroundColor: resolvedThemeColors.dark,
                  color: '#0f172a',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                {resolvedThemeColors.dark}
              </span>
            </div>
          </div>
        </div>
      </GlobalUIProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground demonstrating `themeColors` propagation. Use the `themeColors.light` and `themeColors.dark` color pickers in the Controls panel to inspect live token distribution.',
      },
    },
  },
};

export const SafeFallbackWithoutProvider: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px', fontFamily: 'system-ui, sans-serif' }}>
      <ContextTelemetryProbe label="Unwrapped Fallback Hook Output" />
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
        Calling <code>useGlobalUIContext()</code> outside of a <code>GlobalUIProvider</code> never throws a null-context error; it safely returns an empty object (<code>{'{}'}</code>).
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the defensive fallback behavior of `useGlobalUIContext()`, ensuring Mito UI inputs remain fully functional in standalone non-provider environments.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Imperative `useFormik()` + Dynamic Theme Orchestration:**
 * Demonstrates passing an imperative `useFormik()` hook instance directly into `GlobalUIProvider`'s `formikContext` prop alongside live theme switching.
 * All nested Mito UI primitives (`Input`, `ToggleInput`) automatically bind to the injected Formik store via their `alias` without needing a `<Formik>` wrapper component.
 */
export const ImperativeFormikAndThemePipeline: Story = {
  render: () => {
    const [activePalette, setActivePalette] = useState<'enterpriseBlue' | 'emeraldOps' | 'amberAlert'>('enterpriseBlue');

    const PALETTES: Record<string, ThemeColors> = {
      enterpriseBlue: { light: '#2563eb', dark: '#38bdf8' },
      emeraldOps: { light: '#059669', dark: '#34d399' },
      amberAlert: { light: '#d97706', dark: '#fbbf24' },
    };

    const formik = useFormik({
      initialValues: {
        clusterEndpoint: 'https://telemetry.mito-core.io/v2',
        enableFailover: true,
      },
      onSubmit: (values) => {
        alert(`Imperative Formik Pipeline Dispatched:\n${JSON.stringify(values, null, 2)}`);
      },
    });

    const currentTheme = PALETTES[activePalette]!;

    return (
      <GlobalUIProvider themeColors={currentTheme} formikContext={formik}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '560px', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['enterpriseBlue', 'emeraldOps', 'amberAlert'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivePalette(key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: activePalette === key ? `2px solid ${PALETTES[key]?.light}` : '1px solid #cbd5e1',
                  backgroundColor: activePalette === key ? '#f8fafc' : '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {key}
              </button>
            ))}
          </div>

          <ContextTelemetryProbe label="Live GlobalUIProvider Pipeline" />

          <form
            onSubmit={formik.handleSubmit}
            style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Row gap="4">
              <Input
                alias="clusterEndpoint"
                inputLabel="Primary Telemetry Endpoint"
                design="outline"
                activeColor={currentTheme.light}
                width={12}
              />
              <br/>
              <ToggleInput
                alias="enableFailover"
                inputLabel="Automatic Multi-Region Failover"
                design="neumorphic"
                icon="lockclosed"
                activeColor={currentTheme.light}
                width={12}
              />
            </Row>

            <button
              type="submit"
              style={{
                padding: '10px 18px',
                backgroundColor: currentTheme.light,
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              Commit Configuration
            </button>
          </form>
        </div>
      </GlobalUIProvider>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `"use client";

import React from "react";
import { useFormik } from "formik";
import { GlobalUIProvider, Input, ToggleInput, Row } from "@emeraldemperaur/mito-ui";

export const AppRootWithGlobalContext = () => {
  const formik = useFormik({
    initialValues: {
      clusterEndpoint: "https://telemetry.mito-core.io/v2",
      enableFailover: true,
    },
    onSubmit: (values) => console.log("Submitted:", values),
  });

  return (
    <GlobalUIProvider
      themeColors={{ light: "#2563eb", dark: "#38bdf8" }}
      formikContext={formik}
    >
      <form onSubmit={formik.handleSubmit}>
        <Row gap="4">
          <Input
            alias="clusterEndpoint"
            inputLabel="Primary Telemetry Endpoint"
            design="outline"
            width={12}
          />
          <br/>
          <ToggleInput
            alias="enableFailover"
            inputLabel="Automatic Multi-Region Failover"
            design="neumorphic"
            width={12}
          />
        </Row>
        <button type="submit">Commit Configuration</button>
      </form>
    </GlobalUIProvider>
  );
};`,
      },
    },
  },
};