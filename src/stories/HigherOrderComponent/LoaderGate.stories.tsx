import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  LoaderGate,
  type LoaderGateProps,
} from './LoaderGate';
import { Button } from '../Buttons/Button';
import '../../styles/fonts.scss';
import BlobLogo from '../Navigation/DripLogo';

// ---------------------------------------------------------------------------
// STORY FRAME (PURE LAYOUT CONTAINER — NO HARDCODED BUTTON)
// ---------------------------------------------------------------------------
const StoryFrame: React.FC<{
  darkMode?: boolean;
  background?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  statusNote?: React.ReactNode;
}> = ({ darkMode = false, background, children, footer, statusNote }) => (
  <div
    className="mito-lg-story-frame"
    style={{
      position: 'relative',
      height: '380px',
      width: '100%',
      overflow: 'hidden',
      background:
        background ||
        (darkMode
          ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
          : '#f8fafc'),
      color: darkMode ? '#f8fafc' : '#0f172a',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}
  >
    <style>{`
      .mito-lg-story-frame .mito-lg-wrapper,
      .mito-lg-story-frame .mito-lg-content {
        min-height: 380px !important;
        height: 380px !important;
      }
      .mito-lg-story-frame .mito-lg-overlay {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 20 !important;
      }
    `}</style>

    {children}

    {(statusNote || footer) && (
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          right: '16px',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {statusNote && (
          <span
            style={{
              fontSize: '0.8rem',
              padding: '6px 10px',
              borderRadius: '6px',
              backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
              border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e2e8f0',
              color: darkMode ? '#e2e8f0' : '#334155',
            }}
          >
            {statusNote}
          </span>
        )}
        {footer}
      </div>
    )}
  </div>
);

const UnlockedAppContent: React.FC<{ title?: string; subtitle?: string; darkMode?: boolean }> = ({
  title = 'Workspace Ready',
  subtitle = 'LoaderGate completed its timeout and unlocked the application tree.',
  darkMode = false,
}) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      color: darkMode ? '#f8fafc' : '#0f172a',
    }}
  >
    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75, maxWidth: '460px' }}>{subtitle}</p>
  </div>
);

export interface LoaderGateStoryProps extends LoaderGateProps {
  brandLightColor?: string;
  brandDarkColor?: string;
}

const meta: Meta<LoaderGateStoryProps> = {
  title: 'HigherOrderComponent/LoaderGate',
  component: LoaderGate as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: true },
      description: {
        component:
          'Master enterprise transition barrier and conditional gatekeeper. Orchestrates a full-screen, scroll-locked loading overlay with kinetic split-text animations (or custom `brandNode` injection) and supports both smooth `fade` and dynamic `liquid-curtain` entrance/exit transitions before revealing `children`, rendering priority `onPositiveNode`/`onNegativeNode` views, or triggering router-agnostic redirects via `onRedirect`.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // CORE CONTENT & LIFECYCLE
    // ----------------------------------------------------------------------
    children: {
      control: false,
      description: 'The underlying application tree concealed until the loader completes its lifecycle (when neither `onPositive` nor `onNegative` overrides it).',
      table: { category: 'Core Content & Lifecycle', type: { summary: 'ReactNode' } },
    },
    timeout: {
      control: { type: 'number', min: 300, max: 6000, step: 100 },
      description: 'Explicit delay in milliseconds before the gate unlocks, triggers its exit transition, and resolves to its destination content or redirect.',
      table: { category: 'Core Content & Lifecycle', defaultValue: { summary: '1700' }, type: { summary: 'number' } },
    },
    brandName: {
      control: 'text',
      description: 'Text or inline ReactNode rendered prominently inside the kinetic split-text animation. Ignored when `brandNode` is provided.',
      table: { category: 'Core Content & Lifecycle', defaultValue: { summary: "'Praimfaya'" }, type: { summary: 'ReactNode' } },
    },
    brandNode: {
      control: false,
      description: 'Custom ReactNode that completely overrides the default `brandName` upper/lower split-text loading element.',
      table: { category: 'Core Content & Lifecycle', type: { summary: 'ReactNode' } },
    },
    loadingText: {
      control: 'text',
      description: 'Secondary contextual status text revealed between the splitting brand halves (or beneath `brandNode`).',
      table: { category: 'Core Content & Lifecycle', defaultValue: { summary: "'Loading...'" }, type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // ENTRANCE / EXIT & LIQUID CURTAIN CONTROLS
    // ----------------------------------------------------------------------
    entranceExit: {
      control: 'inline-radio',
      options: ['fade', 'liquid-curtain'],
      description: "Controls the entrance and exit transition choreography (`'fade'` or `'liquid-curtain'`).",
      table: {
        category: 'Entrance / Exit & Curtain',
        defaultValue: { summary: "'fade'" },
        type: { summary: "'fade' | 'liquid-curtain'" },
      },
    },
    waveColor: {
      control: 'color',
      description: 'Explicit fill color for the liquid curtain body and its animated SVG wave edges in light mode. Defaults to the resolved background color.',
      table: { category: 'Entrance / Exit & Curtain', type: { summary: 'string' } },
    },
    darkWaveColor: {
      control: 'color',
      description: 'Explicit fill color for the liquid curtain body and its animated SVG wave edges specifically in dark mode.',
      table: { category: 'Entrance / Exit & Curtain', type: { summary: 'string' } },
    },
    curtainSpeed: {
      control: { type: 'range', min: 250, max: 2000, step: 50 },
      description: "Duration in milliseconds of the liquid curtain's slide-in and slide-out sweep transitions.",
      table: { category: 'Entrance / Exit & Curtain', defaultValue: { summary: '750' }, type: { summary: 'number' } },
    },

    // ----------------------------------------------------------------------
    // CONDITIONAL GATE RESOLUTION (POSITIVE / NEGATIVE)
    // ----------------------------------------------------------------------
    onPositive: {
      control: 'boolean',
      description: 'When `true`, resolves the gate into its positive branch after `timeout`, rendering `onPositiveNode` (priority) or redirecting to `onPositivePath`.',
      table: { category: 'Conditional Gate Resolution', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    onPositivePath: {
      control: 'text',
      description: 'Destination URL or client-side route path navigated to when `onPositive` is `true` and `onPositiveNode` is not provided.',
      table: { category: 'Conditional Gate Resolution', type: { summary: 'string' } },
    },
    onPositiveNode: {
      control: false,
      description: 'ReactNode rendered inside the gate when `onPositive` is `true`. Takes strict priority over `onPositivePath` if both are provided.',
      table: { category: 'Conditional Gate Resolution', type: { summary: 'ReactNode' } },
    },
    onNegative: {
      control: 'boolean',
      description: 'When `true` (and `onPositive` is not `true`), resolves into its negative branch, rendering `onNegativeNode` (priority) or redirecting to `onNegativePath`.',
      table: { category: 'Conditional Gate Resolution', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    onNegativePath: {
      control: 'text',
      description: 'Destination URL or client-side route path navigated to when `onNegative` is `true` and `onNegativeNode` is not provided.',
      table: { category: 'Conditional Gate Resolution', type: { summary: 'string' } },
    },
    onNegativeNode: {
      control: false,
      description: 'ReactNode rendered inside the gate when `onNegative` is `true`. Takes strict priority over `onNegativePath` if both are provided.',
      table: { category: 'Conditional Gate Resolution', type: { summary: 'ReactNode' } },
    },
    onRedirect: {
      control: false,
      description: 'Router-agnostic redirect handler (e.g., React Router `navigate` or Next.js `router.push`). Falls back to `window.location.assign(path)` when omitted.',
      table: { category: 'Conditional Gate Resolution', type: { summary: '(path: string) => void' } },
    },

    // ----------------------------------------------------------------------
    // BRANDING & LOGO CONTROLS
    // ----------------------------------------------------------------------
    logo: {
      control: false,
      description: 'Optional ReactNode representing an auxiliary brand logo icon injected into the loader card.',
      table: { category: 'Branding & Logo', type: { summary: 'ReactNode' } },
    },
    logoWidth: {
      control: 'text',
      description: "Explicit CSS width applied to the logo container (e.g., '48px', 48).",
      table: { category: 'Branding & Logo', type: { summary: 'string | number' } },
    },
    logoHeight: {
      control: 'text',
      description: "Explicit CSS height applied to the logo container (e.g., '48px', 48).",
      table: { category: 'Branding & Logo', type: { summary: 'string | number' } },
    },
    logoPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: "Controls whether the injected `logo` is positioned on the far `'left'` or far `'right'` of the loader card.",
      table: { category: 'Branding & Logo', defaultValue: { summary: "'left'" }, type: { summary: "'left' | 'right'" } },
    },

    // ----------------------------------------------------------------------
    // DESIGN ARCHITECTURE & TYPOGRAPHY
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: "The architectural design system variation dictating the central loading card's surface, borders, and depth.",
      table: {
        category: 'Design Architecture',
        defaultValue: { summary: "'material'" },
        type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" },
      },
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles an ultra-translucent architectural frosted glass aesthetic (with subtle fractal grain and 1px glass rims) across the overlay and loading card.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    dropShadow: {
      control: 'text',
      description: "Explicit CSS `box-shadow` string to override the default drop shadow of the active design variant's loading card.",
      table: { category: 'Design Architecture', type: { summary: 'string' } },
    },
    fontFamily: {
      control: 'text',
      description: "Custom CSS font-family string applied globally to the loader's brand and status typography.",
      table: { category: 'Typography', defaultValue: { summary: '"Bodoni Moda Variable", -apple-system, serif' }, type: { summary: 'string' } },
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
      description: 'Dynamic light/dark mode brand accent color mapping injected into the CSS variables to override global context.',
      table: { category: 'Theming: Global', type: { summary: '{ light: string; dark: string }' } },
    },
    brandLightColor: {
      name: 'darkModeColors.light',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.light`.',
      table: { category: 'Theming: Global', type: { summary: 'string' } },
    },
    brandDarkColor: {
      name: 'darkModeColors.dark',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.dark`.',
      table: { category: 'Theming: Global', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // THEMING: LIGHT MODE
    // ----------------------------------------------------------------------
    backgroundColor: {
      control: 'color',
      description: 'Explicit overlay and card background color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } },
    },
    textColor: {
      control: 'color',
      description: 'Explicit primary brand/status text color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // THEMING: DARK MODE
    // ----------------------------------------------------------------------
    darkBackgroundColor: {
      control: 'color',
      description: 'Explicit overlay and card background color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } },
    },
    darkTextColor: {
      control: 'color',
      description: 'Explicit primary brand/status text color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // 3D EXTRUSION (NEU/SKEUO)
    // ----------------------------------------------------------------------
    elevation: {
      control: { type: 'range', min: 2, max: 24, step: 1 },
      description: 'Z-axis 3D extrusion distance in pixels for Neumorphic and Skeuomorphic shadow spread and offset.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '12' }, type: { summary: 'number' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Opacity/contrast multiplier for Neumorphic and Skeuomorphic shadow intensity.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '1' }, type: { summary: 'number' } },
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Global lighting angle dictating the X and Y shadow trajectories for Neumorphic and Skeuomorphic variants.',
      table: {
        category: '3D Extrusion (Neu/Skeuo)',
        defaultValue: { summary: "'top-left'" },
        type: { summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'" },
      },
    },

    // ----------------------------------------------------------------------
    // UNIVERSAL ATTRIBUTES
    // ----------------------------------------------------------------------
    asChild: {
      control: 'boolean',
      description: 'Delegates rendering of the root wrapper element to its immediate child via Radix Slot.',
      table: { category: 'Universal Attributes', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    className: {
      control: 'text',
      description: 'Standard CSS class name appended directly to the root wrapper element.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } },
    },
    style: {
      control: 'object',
      description: 'Inline CSS style overrides applied to the root wrapper element.',
      table: { category: 'Universal Attributes', type: { summary: 'React.CSSProperties' } },
    },
  },
  args: {
    timeout: 1800,
    brandName: 'MITO UI',
    loadingText: 'Initializing Workspace...',
    entranceExit: 'fade',
    curtainSpeed: 750,
    onPositive: false,
    onNegative: false,
    logoPosition: 'left',
    design: 'material',
    trueGlass: false,
    darkMode: false,
    elevation: 12,
    neuIntensity: 1,
    lightSource: 'top-left',
    fontFamily: '"Bodoni Moda Variable", -apple-system, serif',
    asChild: false,
  },
};

export default meta;
type Story = StoryObj<LoaderGateStoryProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: ({ brandLightColor, brandDarkColor, ...args }) => {
    const [runKey, setRunKey] = useState(0);
    const [redirectLog, setRedirectLog] = useState<string | null>(null);

    return (
      <StoryFrame
        darkMode={args.darkMode}
        statusNote={redirectLog ? `Redirected → ${redirectLog}` : undefined}
        footer={
          <Button
            variant="material"
            darkMode={args.darkMode}
            backgroundColor="#002C51"
            darkBackgroundColor="#800020"
            textColor="#ffffff"
            darkTextColor="#ffffff"
            onClick={() => {
              setRedirectLog(null);
              setRunKey((k) => k + 1);
            }}
          >
            Replay Gate
          </Button>
        }
      >
        <LoaderGate
          key={runKey}
          {...args}
          logo={<BlobLogo width="69" height="69" color={args.darkMode ? '#800020' : '#002C51'} />}
          darkModeColors={
            brandLightColor || brandDarkColor
              ? { light: brandLightColor || '#002C51', dark: brandDarkColor || '#ffffff' }
              : undefined
          }
          onRedirect={(path) => setRedirectLog(path)}
        >
          <UnlockedAppContent darkMode={args.darkMode} />
        </LoaderGate>
      </StoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground exposing all props. Click **Replay Gate** after adjusting `design`, `entranceExit`, `trueGlass`, `timeout`, or conditional routing props in the Controls table.',
      },
      source: {
        code: `import React from 'react';
import { LoaderGate, Icon } from '@emeraldemperaur/mito-ui';

export const AppLoader = () => (
  <LoaderGate
    design="material"
    entranceExit="fade"
    brandName="MITO UI"
    loadingText="Initializing Workspace..."
    timeout={1800}
    logo={<Icon name="rocket" width="32" height="32" color="#2563eb" />}
    logoPosition="left"
  >
    <main>Your Application Content</main>
  </LoaderGate>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. DESIGN VARIANT: MATERIAL
// ---------------------------------------------------------------------------
export const MaterialVariant: Story = {
  render: () => {
    const [runKey, setRunKey] = useState(0);
    return (
      <StoryFrame
        background="#f1f5f9"
        footer={
          <Button
            variant="material"
            backgroundColor="#002D04"
            darkBackgroundColor="#002D04"
            textColor="#ffffff"
            darkTextColor="#ffffff"
            onClick={() => setRunKey((k) => k + 1)}
          >
            Replay Gate
          </Button>
        }
      >
        <LoaderGate
          key={runKey}
          design="material"
          backgroundColor="#ffffff"
          brandName="MITO UI"
          loadingText="Preparing Telemetry..."
          timeout={1700}
          logo={<BlobLogo width="69" height="69" color="#002D04" />}
        >
          <UnlockedAppContent title="Material Variant Unlocked" />
        </LoaderGate>
      </StoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Default elevated Material card (`design="material"`) with layered ambient drop shadows.',
      },
      source: {
        code: `import React from 'react';
import { LoaderGate, Icon } from '@emeraldemperaur/mito-ui';

export const MaterialLoader = () => (
  <LoaderGate
    design="material"
    backgroundColor="#ffffff"
    brandName="MITO UI"
    loadingText="Preparing Telemetry..."
    timeout={1700}
    logo={<Icon name="dashboard" width="30" height="30" color="#002D04" />}
  >
    <main>Your Application Content</main>
  </LoaderGate>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 3. DESIGN VARIANT: OUTLINE
// ---------------------------------------------------------------------------
export const OutlineVariant: Story = {
  render: () => {
    const [runKey, setRunKey] = useState(0);
    return (
      <StoryFrame
        footer={
          <Button
            variant="outline"
            backgroundColor="#FF4F00"
            darkBackgroundColor="#FF4F00"
            textColor="#ffffff"
            darkTextColor="#ffffff"
            onClick={() => setRunKey((k) => k + 1)}
          >
            Replay Gate
          </Button>
        }
      >
        <LoaderGate
          key={runKey}
          design="outline"
          brandName="MITO UI"
          loadingText="Syncing Modules..."
          timeout={1700}
          logo={<BlobLogo width="69" height="69" color="#FF4F00" />}
        >
          <UnlockedAppContent title="Outline Variant Unlocked" />
        </LoaderGate>
      </StoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Crisp `1.5px` bordered central card (`design="outline"`) with a leading brand icon.',
      },
      source: {
        code: `import React from 'react';
import { LoaderGate, Icon } from '@emeraldemperaur/mito-ui';

export const OutlineLoader = () => (
  <LoaderGate
    design="outline"
    brandName="MITO UI"
    loadingText="Syncing Modules..."
    timeout={1700}
    logo={<Icon name="rocket" width="30" height="30" color="#FF4F00" />}
  >
    <main>Your Application Content</main>
  </LoaderGate>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 4. DESIGN VARIANT: NEUMORPHIC
// ---------------------------------------------------------------------------
export const NeumorphicVariant: Story = {
  render: () => {
    const [runKey, setRunKey] = useState(0);
    return (
      <StoryFrame
        background="#e2e8f0"
        footer={
          <Button
            variant="material"
            backgroundColor="#0058A5"
            darkBackgroundColor="#0058A5"
            fontFamily="Work Sans"
            textColor="#ffffff"
            darkTextColor="#ffffff"
            onClick={() => setRunKey((k) => k + 1)}
          >
            Replay Gate
          </Button>
        }
      >
        <LoaderGate
          key={runKey}
          design="neumorphic"
          fontFamily="Work Sans"
          backgroundColor="#e2e8f0"
          elevation={12}
          neuIntensity={1.1}
          lightSource="top-left"
          brandName="MITO UI"
          loadingText="Calibrating Surface..."
          timeout={1800}
          logo={<BlobLogo width="69" height="69" color="#0058A5" />}
        >
          <UnlockedAppContent title="Neumorphic Variant Unlocked" />
        </LoaderGate>
      </StoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft 3D extruded Neumorphic card (`design="neumorphic"`) with a carved inner brand well dynamically calibrated to its parent surface (`#e2e8f0`).',
      },
      source: {
        code: `import React from 'react';
import { LoaderGate, Icon } from '@emeraldemperaur/mito-ui';

export const NeumorphicLoader = () => (
  <LoaderGate
    design="neumorphic"
    backgroundColor="#e2e8f0"
    elevation={12}
    neuIntensity={1.1}
    lightSource="top-left"
    brandName="MITO UI"
    loadingText="Calibrating Surface..."
    timeout={1800}
    logo={<Icon name="layers" width="30" height="30" color="#2563eb" />}
  >
    <main>Your Application Content</main>
  </LoaderGate>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 5. DESIGN VARIANT: SKEUOMORPHIC
// ---------------------------------------------------------------------------
export const SkeuomorphicVariant: Story = {
  render: () => {
    const [runKey, setRunKey] = useState(0);
    return (
      <StoryFrame
        background="#e2e8f0"
        footer={
          <Button
            variant="skeuomorphic"
            backgroundColor="#00B7BF"
            darkBackgroundColor="#00B7BF"
            textColor="#ffffff"
            darkTextColor="#ffffff"
            onClick={() => setRunKey((k) => k + 1)}
          >
            Replay Gate
          </Button>
        }
      >
        <LoaderGate
          key={runKey}
          design="skeuomorphic"
          backgroundColor="#e2e8f0"
          elevation={10}
          brandName="MITO UI"
          loadingText="Booting Engine..."
          timeout={1800}
          logo={<BlobLogo width="69" height="69" color="#00B7BF" />}
          logoPosition="left"
        >
          <UnlockedAppContent title="Skeuomorphic Variant Unlocked" />
        </LoaderGate>
      </StoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tactile, beveled 3D Skeuomorphic card (`design="skeuomorphic"`) featuring directional lighting gradients and a recessed display plate.',
      },
      source: {
        code: `import React from 'react';
import { LoaderGate, Icon } from '@emeraldemperaur/mito-ui';

export const SkeuomorphicLoader = () => (
  <LoaderGate
    design="skeuomorphic"
    backgroundColor="#e2e8f0"
    elevation={10}
    brandName="MITO UI"
    loadingText="Booting Engine..."
    timeout={1800}
    logo={<Icon name="rocket" width="32" height="32" color="#00B7BF" />}
    logoPosition="left"
  >
    <main>Your Application Content</main>
  </LoaderGate>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 6. TRUEGLASS FROSTED SHOWCASE
// ---------------------------------------------------------------------------
export const TrueGlassShowcase: Story = {
  render: () => {
    const [runKey, setRunKey] = useState(0);
    return (
      <StoryFrame
        darkMode
        background="radial-gradient(circle at 18% 28%, #001D00 0%, transparent 45%), radial-gradient(circle at 82% 72%, #800020 0%, transparent 48%), radial-gradient(circle at 52% 50%, #800020 0%, transparent 40%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)"
        footer={
          <Button
            variant="outline"
            darkMode
            backgroundColor="#ffffff"
            darkBackgroundColor="#ffffff"
            textColor="#800020"
            darkTextColor="#800020"
            onClick={() => setRunKey((k) => k + 1)}
          >
            Replay Gate
          </Button>
        }
      >
        <LoaderGate
          key={runKey}
          design="skeuomorphic"
          trueGlass
          darkMode
          brandName="MITO UI"
          loadingText="Rendering Glass Surface..."
          timeout={2200}
          logo={<BlobLogo width="69" height="69" color="#800020" />}
          logoPosition="left"
        >
          <UnlockedAppContent
            darkMode
            title="TrueGlass Surface Unlocked"
            subtitle="Vibrant mesh gradients beneath the overlay showcase the ultra-translucent frosted glass refraction and subtle fractal grain."
          />
        </LoaderGate>
      </StoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Showcases `trueGlass` ultra-translucent frosted glass (`backdrop-filter: blur(24px)` with fractal noise grain and 1px glass rims) layered over a vibrant multi-orb gradient backdrop.',
      },
      source: {
        code: `import React from 'react';
import { LoaderGate, Icon } from '@emeraldemperaur/mito-ui';

export const TrueGlassLoader = () => (
  <div
    style={{
      minHeight: '100vh',
      background:
        'radial-gradient(circle at 18% 28%, #38bdf8 0%, transparent 45%), radial-gradient(circle at 82% 72%, #a855f7 0%, transparent 48%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    }}
  >
    <LoaderGate
      design="skeuomorphic"
      trueGlass
      darkMode
      brandName="MITO UI"
      loadingText="Rendering Glass Surface..."
      timeout={2200}
      logo={<Icon name="rocket" width="32" height="32" color="#800020" />}
      logoPosition="left"
    >
      <main>Your Application Content</main>
    </LoaderGate>
  </div>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 7. LIQUID CURTAIN PRELOADER
// ---------------------------------------------------------------------------
export const LiquidCurtainPreloader: Story = {
  render: () => {
    const [runKey, setRunKey] = useState(0);
    return (
      <StoryFrame
        darkMode
        footer={
          <Button
            variant="outline"
            darkMode
            backgroundColor="#ffffff"
            darkBackgroundColor="#ffffff"
            textColor="#4a7fff"
            darkTextColor="#4a7fff"
            onClick={() => setRunKey((k) => k + 1)}
          >
            Replay Gate
          </Button>
        }
      >
        <LoaderGate
          key={runKey}
          entranceExit="liquid-curtain"
          waveColor="#0d0f17"
          darkWaveColor="#111827"
          curtainSpeed={750}
          design="material"
          darkMode
          brandName="MITO UI"
          loadingText="Initializing Workspace..."
          timeout={2000}
        >
          <UnlockedAppContent
            darkMode
            title="Liquid Curtain Complete"
            subtitle="The animated SVG wave curtain swept in from the right and exited to the left."
          />
        </LoaderGate>
      </StoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates `entranceExit="liquid-curtain"` with custom `waveColor`, `darkWaveColor`, and `curtainSpeed={750}`.',
      },
      source: {
        code: `import React from 'react';
import { LoaderGate } from '@emeraldemperaur/mito-ui';

export const LiquidCurtainLoader = () => (
  <LoaderGate
    entranceExit="liquid-curtain"
    waveColor="#0d0f17"
    darkWaveColor="#111827"
    curtainSpeed={750}
    design="material"
    darkMode
    brandName="MITO UI"
    loadingText="Initializing Workspace..."
    timeout={2000}
  >
    <main>Your Application Content</main>
  </LoaderGate>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 8. CONDITIONAL AUTH GATE (NODE PRIORITY & ROUTER REDIRECT)
// ---------------------------------------------------------------------------
export const AuthGateConditionalResolution: Story = {
  render: () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [runKey, setRunKey] = useState(0);
    const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

    const toggleAuthAndReplay = () => {
      setIsAuthenticated((prev) => !prev);
      setRedirectTarget(null);
      setRunKey((k) => k + 1);
    };

    return (
      <StoryFrame
        darkMode
        statusNote={
          <span>
            Auth: <strong>{isAuthenticated ? 'True' : 'False'}</strong>
            {redirectTarget ? ` • onRedirect("${redirectTarget}")` : ' • Priority Node Rendered'}
          </span>
        }
        footer={
          <Button
            variant="outline"
            darkMode
            backgroundColor="#ffffff"
            darkBackgroundColor="#ffffff"
            textColor="#0284c7"
            darkTextColor="#0284c7"
            onClick={() => {
              setRedirectTarget(null);
              setRunKey((k) => k + 1);
            }}
          >
            Replay Gate
          </Button>
        }
      >
        <div style={{ position: 'absolute', top: '14px', right: '16px', zIndex: 30 }}>
          <Button variant="outline" darkMode onClick={toggleAuthAndReplay}>
            Switch to {isAuthenticated ? 'Unauthenticated' : 'Authenticated'}
          </Button>
        </div>

        <LoaderGate
          key={runKey}
          design="skeuomorphic"
          trueGlass
          darkMode
          brandName="MITO UI"
          loadingText="Verifying Session..."
          timeout={1500}
          logo={<BlobLogo width="69" height="69" color="#38bdf8" />}
          logoPosition="left"
          onPositive={isAuthenticated}
          onPositivePath="/dashboard"
          onNegative={!isAuthenticated}
          onNegativeNode={
            <UnlockedAppContent
              darkMode
              title="Access Denied"
              subtitle="onNegativeNode took priority over onNegativePath — Please sign in to continue."
            />
          }
          onRedirect={(path) => setRedirectTarget(path)}
        >
          <UnlockedAppContent
            darkMode
            title="Redirect Intercepted"
            subtitle={`onPositive was true without onPositiveNode, so onRedirect("${redirectTarget || '/dashboard'}") was invoked.`}
          />
        </LoaderGate>
      </StoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates strict conditional resolution order: **Priority Node (`onPositiveNode` / `onNegativeNode`) > Path + `onRedirect(path)` > Native `window.location.assign(path)` > `children`**. Toggle authentication state in the top-right to test both branches.',
      },
      source: {
        code: `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderGate, Icon } from '@emeraldemperaur/mito-ui';

export const AuthGate = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const navigate = useNavigate();

  return (
    <LoaderGate
      design="skeuomorphic"
      trueGlass
      darkMode
      brandName="MITO UI"
      loadingText="Verifying Session..."
      timeout={1500}
      logo={<Icon name="rocket" width="32" height="32" color="#38bdf8" />}
      logoPosition="left"
      onPositive={isAuthenticated}
      onPositivePath="/dashboard"
      onNegative={!isAuthenticated}
      onNegativeNode={<div>Access Denied — Please sign in to continue.</div>}
      onRedirect={(path) => navigate(path)}
    >
      <div>Fallback Application Content</div>
    </LoaderGate>
  );
};`,
      },
    },
  },
};