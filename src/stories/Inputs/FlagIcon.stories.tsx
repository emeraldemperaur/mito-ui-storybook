import type { Meta, StoryObj } from '@storybook/react';
import { FlagIcon, type FlagIconProps } from '../../components/icons/FlagIcon';

/**
 * Enterprise utility component for rendering crisp, standardized SVG country flags.
 * Powered by `country-flag-icons`, it strictly accepts ISO 3166-1 alpha-2 country codes alongside a custom 'EU' bypass.
 */
const meta: Meta<FlagIconProps> = {
  title: 'Information/FlagIcon',
  component: FlagIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Use `FlagIcon` to inject lightweight SVG flags into UI elements like language selectors, international phone inputs, or global region tables. Defaults to a strict `18x12px` dimension to guarantee alignment inside inputs, but can be freely scaled and styled.',
      },
    },
  },
  argTypes: {
    country: {
      control: 'select',
      options: ['US', 'GB', 'CA', 'NG', 'FR', 'DE', 'JP', 'BR', 'CN', 'IN', 'EU', 'XX'],
      description: 'The required 2-letter ISO 3166-1 alpha-2 country identifier. Pass `"EU"` for the European Union flag. Invalid or missing codes automatically render a neutral gray fallback block.',
      table: { 
        category: 'Core & Logic', 
        type: { summary: "CountryCode | 'EU'" } 
      },
    },
    width: {
      control: 'text',
      description: 'Dynamic control of the flag\'s width. Accepts standard CSS width values (e.g., `"18px"`, `"2rem"`, `24`).',
      table: { 
        category: 'Dimensions', 
        defaultValue: { summary: "'18px'" },
        type: { summary: 'string | number' }
      },
    },
    height: {
      control: 'text',
      description: 'Dynamic control of the flag\'s height. Accepts standard CSS height values (e.g., `"12px"`, `"1.5rem"`, `16`).',
      table: { 
        category: 'Dimensions', 
        defaultValue: { summary: "'12px'" },
        type: { summary: 'string | number' }
      },
    },
    style: {
      control: 'object',
      description: 'Optional inline styles to merge with the base flag element (useful for overriding border-radius, adding box-shadows, or applying filters).',
      table: { 
        category: 'Styling', 
        type: { summary: 'React.CSSProperties' }
      },
    },
  },
  args: {
    country: 'US',
    width: '18px',
    height: '12px',
  },
};

export default meta;
type Story = StoryObj<FlagIconProps>;

// ---------------------------------------------------------------------------
// CORE VARIANTS & SIZING
// ---------------------------------------------------------------------------

export const UnitedStates: Story = {
  args: {
    country: 'US',
  },
};

export const Nigeria: Story = {
  args: {
    country: 'NG',
    width: '48px',
    height: '32px',
    style: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderRadius: '4px',
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates scaling the `NG` (Nigeria) flag up using the `width` and `height` props, while injecting a custom drop-shadow and border-radius via the `style` prop.',
      },
    },
  },
};

export const EuropeanUnion: Story = {
  args: {
    country: 'EU',
  },
  parameters: {
    docs: {
      description: {
        story: 'The `EU` tag is uniquely intercepted and handled outside the standard ISO country code list to safely render the European Union flag.',
      },
    },
  },
};

export const FallbackUnknown: Story = {
  args: {
    country: 'XX' as any,
  },
  parameters: {
    docs: {
      description: {
        story: 'If an invalid or unrecognized string is passed, the component safely fails over to a structural gray block matching the exact `width` and `height` props to prevent UI layout shifts.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Clever Standalone Usage (Global Deployment Regions):**
 * Demonstrates how the default `18x12px` footprint of the `FlagIcon` perfectly aligns alongside text and badges in enterprise dropdown menus or tables.
 */
export const GlobalRegionSelector: Story = {
  render: () => {
    const REGIONS = [
      { code: 'US', label: 'us-east-1', name: 'N. Virginia', status: 'Operational' },
      { code: 'DE', label: 'eu-central-1', name: 'Frankfurt', status: 'Operational' },
      { code: 'NG', label: 'af-west-1', name: 'Lagos', status: 'Provisioning' },
      { code: 'JP', label: 'ap-northeast-1', name: 'Tokyo', status: 'Degraded' },
      { code: 'BR', label: 'sa-east-1', name: 'São Paulo', status: 'Operational' },
    ] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '320px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
          Select Edge Deployment Region
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {REGIONS.map((region) => (
            <button
              key={region.code}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid #f1f5f9',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => alert(`Targeting hardware in ${region.name} (${region.label})`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* FLAG INJECTION */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                  <FlagIcon country={region.code as any} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{region.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{region.label}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: region.status === 'Operational' ? '#10b981' : region.status === 'Provisioning' ? '#3b82f6' : '#f59e0b' 
                }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{region.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `import React from "react";
import { FlagIcon } from "@emeraldemperaur/mito-ui";

export const RegionMenu = () => {
  const REGIONS = [
    { code: 'US', label: 'us-east-1', name: 'N. Virginia' },
    { code: 'DE', label: 'eu-central-1', name: 'Frankfurt' },
    { code: 'NG', label: 'af-west-1', name: 'Lagos' },
  ] as const;

  return (
    <div className="menu-container">
      {REGIONS.map((region) => (
        <button key={region.code} className="menu-item">
          <FlagIcon country={region.code as any} width="18px" height="12px" />
          <div>
            <strong>{region.name}</strong>
            <span>{region.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};`,
      },
    },
  },
};