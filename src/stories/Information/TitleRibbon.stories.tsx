import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TitleRibbon, type TitleRibbonProps } from './TitleRibbon';
import '../../styles/fonts.scss';

const RadarIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="28" height="28" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 1010 10M12 6a6 6 0 106 6M12 10a2 2 0 102 2M12 12l7-7" />
  </svg>
);

const TerminalIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="26" height="26" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 17l6-6-6-6M12 19h8" />
  </svg>
);

const ShieldAlertIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="26" height="26" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4zm0 5v4m0 4h.01" />
  </svg>
);

// ---------------------------------------------------------------------------
// STORYBOOK META CONFIGURATION
// ---------------------------------------------------------------------------
export interface TitleRibbonStoryProps extends TitleRibbonProps {
  brandLightColor?: string;
  brandDarkColor?: string;
}

const meta: Meta<TitleRibbonStoryProps> = {
  title: 'Information/TitleRibbon',
  component: TitleRibbon as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      story: { inline: true },
      description: {
        component:
          'Master SSR-safe enterprise page/section header banner. Supports leading/trailing icon injection, subtitles with independent font families, character-by-character typewriter animations, ambient-aware Neumorphic and Skeuomorphic 3D rendering, and granular light/dark token overrides.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // CORE CONTENT & ICONS
    // ----------------------------------------------------------------------
    title: {
      control: 'text',
      description: 'Primary heading text rendered inside the banner. Also exposed to assistive technologies via a screen-reader `<h1>`.',
      table: { category: 'Core Content & Icons', type: { summary: 'string' } },
    },
    subtitle: {
      control: 'text',
      description: 'Optional secondary description or subtitle rendered directly beneath the primary title.',
      table: { category: 'Core Content & Icons', type: { summary: 'string' } },
    },
    icon: {
      control: false,
      description: 'Optional icon ReactNode injected adjacent to the title text.',
      table: { category: 'Core Content & Icons', type: { summary: 'ReactNode' } },
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Controls the placement of the injected icon relative to the title text.',
      table: { category: 'Core Content & Icons', defaultValue: { summary: "'left'" }, type: { summary: "'left' | 'right'" } },
    },

    // ----------------------------------------------------------------------
    // TYPOGRAPHY & ALIGNMENT
    // ----------------------------------------------------------------------
    textAlignment: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
      description: 'Horizontal text alignment of the title, icon, subtitle, and optional error message within the ribbon container.',
      table: { category: 'Typography & Alignment', defaultValue: { summary: "'left'" }, type: { summary: "'left' | 'center' | 'right'" } },
    },
    textSize: {
      control: 'text',
      description: 'Explicit CSS font-size string controlling the rendered scale of the title text.',
      table: { category: 'Typography & Alignment', defaultValue: { summary: "'2.4rem'" }, type: { summary: 'string' } },
    },
    borderRadius: {
      control: 'text',
      description: "Explicit override for the ribbon container's border radius across all design variants.",
      table: {
        category: 'Design Architecture & Motion',
        defaultValue: { summary: "'0px'" },
        type: { summary: 'string | number' },
      },
    },
    fontFamily: {
      control: 'text',
      description: 'Base CSS font-family string applied globally unless overridden by `titleFontFamily` or `subTitleFontFamily`.',
      table: { category: 'Typography & Alignment', defaultValue: { summary: '"Bodoni Moda Variable", -apple-system, serif' }, type: { summary: 'string' } },
    },
    titleFontFamily: {
      control: 'text',
      description: 'Explicit CSS font-family override applied specifically to the primary title text.',
      table: { category: 'Typography & Alignment', type: { summary: 'string' } },
    },
    subTitleFontFamily: {
      control: 'text',
      description: 'Explicit CSS font-family override applied specifically to the subtitle text.',
      table: { category: 'Typography & Alignment', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // DESIGN ARCHITECTURE & MOTION
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: "The architectural design system variation dictating the ribbon's surface, border, and depth styling.",
      table: { category: 'Design Architecture & Motion', defaultValue: { summary: "'outline'" }, type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" } },
    },
    typewriterFX: {
      control: 'boolean',
      description: 'Enables an SSR-safe, character-by-character typewriter entrance animation with a blinking cursor.',
      table: { category: 'Design Architecture & Motion', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    strokeColor: {
      control: 'color',
      description: "Explicit color override for the ribbon's brand accent stroke/border, taking precedence over `darkModeColors` and global theme tokens.",
      table: { category: 'Design Architecture & Motion', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // VALIDATION & SYSTEM ALERTS
    // ----------------------------------------------------------------------
    errorText: {
      control: 'text',
      description: 'Optional validation or system alert message displayed directly beneath the title/subtitle inside the ribbon.',
      table: { category: 'Validation & Alerts', type: { summary: 'string' } },
    },
    errorTextColor: {
      control: 'color',
      description: 'Explicit error message text color override for light mode contexts.',
      table: { category: 'Validation & Alerts', defaultValue: { summary: "'#dc2626'" }, type: { summary: 'string' } },
    },
    darkErrorTextColor: {
      control: 'color',
      description: 'Explicit error message text color override specifically for dark mode contexts.',
      table: { category: 'Validation & Alerts', defaultValue: { summary: "'#f87171'" }, type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // THEMING: GLOBAL
    // ----------------------------------------------------------------------
    darkMode: {
      control: 'boolean',
      description: 'Force dark mode rendering independent of the global UI context or OS preference.',
      table: { category: 'Theming: Global', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    darkModeColors: {
      control: false,
      description: 'Dynamic light/dark mode brand accent color mapping injected into `--ui-brand-color` to override global context.',
      table: { category: 'Theming: Global', type: { summary: '{ light: string; dark: string }' } },
    },
    brandLightColor: {
      name: 'darkModeColors.light',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.light` for the light-mode brand accent bar.',
      table: { category: 'Theming: Global', type: { summary: 'string' } },
    },
    brandDarkColor: {
      name: 'darkModeColors.dark',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.dark` for the dark-mode brand accent bar.',
      table: { category: 'Theming: Global', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // THEMING: LIGHT MODE
    // ----------------------------------------------------------------------
    backgroundColor: {
      control: 'color',
      description: 'Explicit container background color override for light mode contexts. Also serves as the base environment color for Neumorphic/Skeuomorphic shadow calculation.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } },
    },
    textColor: {
      control: 'color',
      description: 'Explicit title text color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // THEMING: DARK MODE
    // ----------------------------------------------------------------------
    darkBackgroundColor: {
      control: 'color',
      description: 'Explicit container background color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } },
    },
    darkTextColor: {
      control: 'color',
      description: 'Explicit title text color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // 3D EXTRUSION (NEU/SKEUO)
    // ----------------------------------------------------------------------
    elevation: {
      control: { type: 'range', min: 1, max: 16, step: 1 },
      description: 'Z-axis 3D extrusion distance in pixels for Neumorphic and Skeuomorphic shadow spread and offset.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '4' }, type: { summary: 'number' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Multiplier for Neumorphic and Skeuomorphic shadow contrast intensity to maintain WCAG visual clarity.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '1' }, type: { summary: 'number' } },
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Global lighting angle dictating the X and Y shadow trajectories for Neumorphic and Skeuomorphic variants.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: "'top-left'" }, type: { summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'" } },
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
      description: 'Standard CSS class name appended directly to the root container element.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } },
    },
    style: {
      control: 'object',
      description: 'Inline CSS style overrides applied to the root container element.',
      table: { category: 'Universal Attributes', type: { summary: 'React.CSSProperties' } },
    },
  },
  args: {
    title: 'Orbital Fleet Command',
    subtitle: 'Real-time autonomous telemetry, launch manifests, and sector diagnostics.',
    iconPosition: 'left',
    design: 'skeuomorphic',
    textAlignment: 'left',
    typewriterFX: false,
    fontFamily: '"Bodoni Moda Variable", -apple-system, serif',
    subTitleFontFamily: 'Inter, system-ui, sans-serif',
    textSize: '2.4rem',
    darkMode: false,
    errorText: '',
    elevation: 4,
    neuIntensity: 1,
    lightSource: 'top-left',
    asChild: false,
    borderRadius: '0px',
  },
};

export default meta;
type Story = StoryObj<TitleRibbonStoryProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: ({ brandLightColor, brandDarkColor, ...args }) => (
    <div
      style={{
        padding: '32px',
        backgroundColor: args.darkMode ? '#0f172a' : '#f8fafc',
        borderRadius: '16px',
      }}
    >
      <TitleRibbon
        {...args}
        icon={<RadarIcon />}
        darkModeColors={
          brandLightColor || brandDarkColor
            ? { light: brandLightColor || '#2563eb', dark: brandDarkColor || '#3b82f6' }
            : undefined
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground exposing every prop. Switch `design`, toggle `typewriterFX`, flip `iconPosition`, or customize `strokeColor`, `titleFontFamily`, and `subTitleFontFamily` live from the Controls table.',
      },
      source: {
        code: `import { TitleRibbon } from '@emeraldemperaur/mito-ui';

export const SectionHeader = () => (
  <TitleRibbon
    title="Orbital Fleet Command"
    subtitle="Real-time autonomous telemetry, launch manifests, and sector diagnostics."
    icon={<RadarIcon />}
    iconPosition="left"
    design="outline"
    textAlignment="left"
    textSize="2.4rem"
    subTitleFontFamily="Inter, system-ui, sans-serif"
  />
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. DESIGN VARIANT: OUTLINE
// ---------------------------------------------------------------------------
export const OutlineVariant: Story = {
  render: () => (
    <div style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px' }}>
      <TitleRibbon
        title="Autonomous Telemetry Manifest"
        subtitle="Verified orbital relays and active satellite uplinks."
        icon={<RadarIcon color="#2563eb" />}
        design="outline"
        strokeColor="#2563eb"
        titleFontFamily="Inter, system-ui, sans-serif"
        subTitleFontFamily="Inter, system-ui, sans-serif"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Clean bordered banner with a crisp 6px leading brand accent bar (`strokeColor`). Ideal for editorial dashboards and structured documentation headers.',
      },
      source: {
        code: `import { TitleRibbon } from '@emeraldemperaur/mito-ui';

export const OutlineBanner = () => (
  <TitleRibbon
    title="Autonomous Telemetry Manifest"
    subtitle="Verified orbital relays and active satellite uplinks."
    icon={<RadarIcon color="#2563eb" />}
    design="outline"
    strokeColor="#2563eb"
    titleFontFamily="Inter, system-ui, sans-serif"
    subTitleFontFamily="Inter, system-ui, sans-serif"
  />
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 3. DESIGN VARIANT: MATERIAL
// ---------------------------------------------------------------------------
export const MaterialVariant: Story = {
  render: () => (
    <div style={{ padding: '32px', backgroundColor: '#f1f5f9', borderRadius: '16px' }}>
      <TitleRibbon
        title="Quantitative Execution Desk"
        subtitle="Low-latency order routing and live alpha telemetry."
        design="material"
        strokeColor="#0ea5e9"
        titleFontFamily="IBM Plex Serif, serif"
        subTitleFontFamily="Inter, system-ui, sans-serif"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Elevated card surface with soft ambient drop shadows and a 3px bottom brand accent rule. Pairs serif display typography (`titleFontFamily`) with a clean sans-serif `subTitleFontFamily`.',
      },
      source: {
        code: `import { TitleRibbon } from '@emeraldemperaur/mito-ui';

export const MaterialBanner = () => (
  <TitleRibbon
    title="Quantitative Execution Desk"
    subtitle="Low-latency order routing and live alpha telemetry."
    design="material"
    strokeColor="#0ea5e9"
    titleFontFamily="IBM Plex Serif, serif"
    subTitleFontFamily="Inter, system-ui, sans-serif"
  />
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 4. DESIGN VARIANT: NEUMORPHIC
// ---------------------------------------------------------------------------
export const NeumorphicVariant: Story = {
  render: () => (
    <div style={{ padding: '40px', backgroundColor: '#e2e8f0', borderRadius: '16px' }}>
      <TitleRibbon
        title="Neural Reconnaissance Hub"
        subtitle="Ambient 3D inset surface dynamically calibrated to the parent container."
        design="neumorphic"
        backgroundColor="#e2e8f0"
        elevation={6}
        neuIntensity={1.1}
        lightSource="top-left"
        fontFamily="Raleway, sans-serif"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Soft, inset 3D surface that dynamically computes light and dark shadow tokens from its parent container background color.',
      },
      source: {
        code: `import { TitleRibbon } from '@emeraldemperaur/mito-ui';

export const NeumorphicBanner = () => (
  <div style={{ padding: '40px', backgroundColor: '#e2e8f0' }}>
    <TitleRibbon
      title="Neural Reconnaissance Hub"
      subtitle="Ambient 3D inset surface dynamically calibrated to the parent container."
      design="neumorphic"
      backgroundColor="#e2e8f0"
      elevation={6}
      neuIntensity={1.1}
      lightSource="top-left"
      fontFamily="Raleway, sans-serif"
    />
  </div>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 5. DESIGN VARIANT: SKEUOMORPHIC
// ---------------------------------------------------------------------------
export const SkeuomorphicVariant: Story = {
  render: () => (
    <div style={{ padding: '40px', backgroundColor: '#e2e8f0', borderRadius: '16px' }}>
      <TitleRibbon
        title="Hardware Diagnostics Console"
        subtitle="Physical bevel highlights and directional lighting gradients."
        design="skeuomorphic"
        backgroundColor="#e2e8f0"
        strokeColor="#f59e0b"
        elevation={5}
        fontFamily="Libre Franklin, sans-serif"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Tactile, beveled 3D hardware-inspired surface featuring directional top-to-bottom lighting gradients, inner bevel highlights, and a 3px bottom accent rule.',
      },
      source: {
        code: `import { TitleRibbon } from '@emeraldemperaur/mito-ui';

export const SkeuomorphicBanner = () => (
  <div style={{ padding: '40px', backgroundColor: '#e2e8f0' }}>
    <TitleRibbon
      title="Hardware Diagnostics Console"
      subtitle="Physical bevel highlights and directional lighting gradients."
      design="skeuomorphic"
      backgroundColor="#e2e8f0"
      strokeColor="#f59e0b"
      elevation={5}
      fontFamily="Libre Franklin, sans-serif"
    />
  </div>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 6. ICON + TYPEWRITER ENTRANCE ANIMATION
// ---------------------------------------------------------------------------
export const IconAndTypewriterEffect: Story = {
  render: () => {
    const [replayKey, setReplayKey] = useState(0);
    const [iconPos, setIconPos] = useState<'left' | 'right'>('left');

    return (
      <div style={{ padding: '32px', backgroundColor: '#0f172a', borderRadius: '16px' }}>
        <TitleRibbon
          key={replayKey}
          title="Initializing Deep Space Uplink..."
          subtitle="Synchronizing encrypted telemetry keys across Sector 4G relays."
          icon={<TerminalIcon color="#34d399" />}
          iconPosition={iconPos}
          design="outline"
          typewriterFX={true}
          darkMode={true}
          strokeColor="#10b981"
          darkTextColor="#34d399"
          titleFontFamily='"Google Sans Code", monospace'
          subTitleFontFamily="Inter, system-ui, sans-serif"
          textSize="1.85rem"
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Replay Typewriter
          </button>
          <button
            type="button"
            onClick={() => setIconPos((p) => (p === 'left' ? 'right' : 'left'))}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1e293b',
              color: '#34d399',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Toggle Icon Position ({iconPos})
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Combines an injected `icon` (with toggleable `iconPosition`) and `typewriterFX={true}` for a terminal-style entrance animation with a blinking cursor. The full title remains immediately readable to screen readers via the hidden `<h1>`.',
      },
      source: {
        code: `import { TitleRibbon } from '@emeraldemperaur/mito-ui';

export const TerminalBanner = () => (
  <TitleRibbon
    title="Initializing Deep Space Uplink..."
    subtitle="Synchronizing encrypted telemetry keys across Sector 4G relays."
    icon={<TerminalIcon color="#34d399" />}
    iconPosition="left"
    design="outline"
    typewriterFX={true}
    darkMode={true}
    strokeColor="#10b981"
    darkTextColor="#34d399"
    titleFontFamily='"Fira Code", monospace'
    subTitleFontFamily="Inter, system-ui, sans-serif"
    textSize="1.85rem"
  />
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 7. DARK MODE & SYSTEM ALERT (ERROR TEXT)
// ---------------------------------------------------------------------------
export const DarkModeAndSystemAlert: Story = {
  render: () => (
    <div style={{ padding: '32px', backgroundColor: '#020617', borderRadius: '16px' }}>
      <TitleRibbon
        title="Sector 7G Perimeter Defense"
        subtitle="Automated threat response and swarm containment status."
        icon={<ShieldAlertIcon color="#ef4444" />}
        iconPosition="left"
        design="material"
        textAlignment="center"
        darkMode={true}
        darkBackgroundColor="#0f172a"
        darkTextColor="#f8fafc"
        strokeColor="#ef4444"
        errorText="ALERT: Telemetry packet loss detected on UAV-X2. Automatic failover engaged."
        darkErrorTextColor="#fca5a5"
        fontFamily="Inter, system-ui, sans-serif"
        textSize="2.1rem"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Combines `darkMode={true}`, centered `textAlignment`, a warning `icon`, `subtitle`, and `errorText` for high-visibility system warnings.',
      },
      source: {
        code: `import { TitleRibbon } from '@emeraldemperaur/mito-ui';

export const AlertBanner = () => (
  <TitleRibbon
    title="Sector 7G Perimeter Defense"
    subtitle="Automated threat response and swarm containment status."
    icon={<ShieldAlertIcon color="#ef4444" />}
    iconPosition="left"
    design="material"
    textAlignment="center"
    darkMode={true}
    darkBackgroundColor="#0f172a"
    darkTextColor="#f8fafc"
    strokeColor="#ef4444"
    errorText="ALERT: Telemetry packet loss detected on UAV-X2. Automatic failover engaged."
    darkErrorTextColor="#fca5a5"
    textSize="2.1rem"
  />
);`,
      },
    },
  },
};