import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationRibbon,
  type NavigationRibbonProps,
  type NavigationRibbonItem,
} from './NavigationRibbon';
import { ActionButton } from '../Buttons/ActionButton';
import { Button } from '../Buttons/Button';
import { Icon } from '../../components/icons/Icons';
import '../../styles/fonts.scss';
import BlobLogo from './DripLogo';


const baseNavItems: NavigationRibbonItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Storage', href: '/storage' },
  { label: 'Compute', href: '/compute' },
  { label: 'Earnings', href: '/earnings' },
];

const iconNavItems: NavigationRibbonItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Icon name="dashboard" width="16" height="16" /> },
  { label: 'Storage', href: '/storage', icon: <Icon name="layers" width="16" height="16" /> },
  { label: 'Compute', href: '/compute', icon: <Icon name="code" width="16" height="16" /> },
  { label: 'Telemetry', href: '/telemetry', icon: <Icon name="activitylog" width="16" height="16" /> },
  { label: 'Earnings', href: '/earnings', icon: <Icon name="mixerhorizontal" width="16" height="16" /> },
];

const BrandLockup = ({ label = 'MITO UI', accent = '#4a7fff' }: { label?: string; accent?: string }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, letterSpacing: '0.12em' }}>
    <BlobLogo width="33" height="33" color={accent} />
    <span>{label}</span>
  </div>
);


export interface NavigationRibbonStoryProps extends NavigationRibbonProps {
  brandLightColor?: string;
  brandDarkColor?: string;
}

const meta: Meta<NavigationRibbonStoryProps> = {
  title: 'Navigation/NavigationRibbon',
  component: NavigationRibbon as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: true },
      description: {
        component:
          'Enterprise-grade, SSR-safe, mobile-ready navigation ribbon featuring a Safari-compatible liquid SVG wave indicator animated via `requestAnimationFrame` with quartic ease-in-out interpolation. Supports a strict 9-item UI cap, 6-position logo layout, top/bottom viewport docking with iOS safe-area insets, configurable scroll visibility, ambient-aware 3D variants, and glossy `trueGlass` styling.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // NAVIGATION & ROUTING
    // ----------------------------------------------------------------------
    navItems: {
      control: false,
      description: 'Array of top-level `NavigationRibbonItem` definitions (`label`, `href`, `icon`, `isActive`). Strictly capped at 9 items.',
      table: { category: 'Navigation & Routing', type: { summary: 'NavigationRibbonItem[]' } },
    },
    activeIndex: {
      control: { type: 'number', min: 0, max: 8, step: 1 },
      description: 'Controlled index of the currently active navigation item. Overrides internal active state when provided.',
      table: { category: 'Navigation & Routing', type: { summary: 'number' } },
    },
    defaultActiveIndex: {
      control: { type: 'number', min: 0, max: 8, step: 1 },
      description: 'Initial active item index used when operating in uncontrolled mode.',
      table: { category: 'Navigation & Routing', defaultValue: { summary: '0' }, type: { summary: 'number' } },
    },
    linkComponent: {
      control: false,
      description: 'Optional custom link component (e.g., React Router `Link` or Next.js `Link`) for SPA routing. Defaults to native `<a>`.',
      table: { category: 'Navigation & Routing', type: { summary: 'React.ElementType' } },
    },
    onNavigate: {
      control: false,
      description: 'Callback fired whenever a navigation item is clicked, receiving the target `href`, item index, and mouse event.',
      table: { category: 'Navigation & Routing', type: { summary: '(href: string, index: number, e: React.MouseEvent) => void' } },
    },

    // ----------------------------------------------------------------------
    // BRANDING & LOGO CONTROLS
    // ----------------------------------------------------------------------
    logo: {
      control: false,
      description: 'Optional ReactNode representing the brand logo (e.g., an SVG, image, or typography lockup).',
      table: { category: 'Branding & Logo', type: { summary: 'ReactNode' } },
    },
    logoWidth: {
      control: 'text',
      description: "Explicit CSS width applied to the logo container (e.g., '140px', 48).",
      table: { category: 'Branding & Logo', type: { summary: 'string | number' } },
    },
    logoHeight: {
      control: 'text',
      description: "Explicit CSS height applied to the logo container (e.g., '36px', 28).",
      table: { category: 'Branding & Logo', type: { summary: 'string | number' } },
    },
    logoPosition: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
      description: 'Controls the vertical row (above or below the navigation track) and horizontal alignment of the brand logo.',
      table: {
        category: 'Branding & Logo',
        defaultValue: { summary: "'top-left'" },
        type: { summary: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'" },
      },
    },
    brandHref: {
      control: 'text',
      description: 'Destination URL or route path triggered when clicking the brand logo.',
      table: { category: 'Branding & Logo', defaultValue: { summary: "'/'" }, type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // COMPOSITE ACTION SLOTS
    // ----------------------------------------------------------------------
    actionsNode: {
      control: false,
      description: 'Single ReactNode slot for injecting custom social action buttons, search triggers, or account controls.',
      table: { category: 'Composite Action Slots', type: { summary: 'ReactNode' } },
    },
    rightActions: {
      control: false,
      description: 'Array of ReactNodes (e.g., `ActionButton` or `Button` instances) rendered in the trailing actions cluster.',
      table: { category: 'Composite Action Slots', defaultValue: { summary: '[]' }, type: { summary: 'ReactNode[]' } },
    },

    // ----------------------------------------------------------------------
    // VIEWPORT DOCKING & SCROLL VISIBILITY
    // ----------------------------------------------------------------------
    pagePosition: {
      control: 'inline-radio',
      options: ['top', 'bottom'],
      description: 'Anchors the navigation ribbon to either the top or bottom of the viewport, automatically inverting scroll-hide animations and flipping the SVG wave.',
      table: {
        category: 'Viewport Docking & Scroll',
        defaultValue: { summary: "'top'" },
        type: { summary: "'top' | 'bottom'" },
      },
    },
    menuVisibility: {
      control: 'select',
      options: ['sticky', 'auto-hide', 'auto-hide-reappear'],
      description: 'Controls how the navigation ribbon responds to vertical page scrolling.',
      table: {
        category: 'Viewport Docking & Scroll',
        defaultValue: { summary: "'auto-hide'" },
        type: { summary: "'sticky' | 'auto-hide' | 'auto-hide-reappear'" },
      },
    },
    scrollReappearDelay: {
      control: { type: 'number', min: 100, max: 2000, step: 50 },
      description: 'Delay in milliseconds after scrolling stops before the ribbon reappears when `menuVisibility="auto-hide-reappear"`.',
      table: { category: 'Viewport Docking & Scroll', defaultValue: { summary: '450' }, type: { summary: 'number' } },
    },

    // ----------------------------------------------------------------------
    // LIQUID WAVE INDICATOR CONTROLS
    // ----------------------------------------------------------------------
    waveHeight: {
      control: { type: 'range', min: 4, max: 36, step: 1 },
      description: 'Height in pixels of the SVG wave bump protruding into the navigation bar.',
      table: { category: 'Liquid Wave Indicator', defaultValue: { summary: '16' }, type: { summary: 'number' } },
    },
    waveWidth: {
      control: { type: 'range', min: 32, max: 140, step: 4 },
      description: 'Half-width in pixels of the SVG wave bell curve. Controls how wide the liquid wave spans.',
      table: { category: 'Liquid Wave Indicator', defaultValue: { summary: '72' }, type: { summary: 'number' } },
    },
    waveDuration: {
      control: { type: 'range', min: 0, max: 1500, step: 40 },
      description: 'Duration in milliseconds of the quartic ease-in-out liquid wave travel animation.',
      table: { category: 'Liquid Wave Indicator', defaultValue: { summary: '480' }, type: { summary: 'number' } },
    },
    waveColor: {
      control: 'color',
      description: 'Explicit fill color for the SVG wave bump in light mode. Match the page background beneath the ribbon for the optical cutout illusion.',
      table: { category: 'Liquid Wave Indicator', type: { summary: 'string' } },
    },
    darkWaveColor: {
      control: 'color',
      description: 'Explicit fill color for the SVG wave bump in dark mode. Match the dark page background beneath the ribbon for the optical cutout illusion.',
      table: { category: 'Liquid Wave Indicator', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // DESIGN ARCHITECTURE
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: "The architectural design system variation dictating the ribbon's surface, borders, and depth.",
      table: {
        category: 'Design Architecture',
        defaultValue: { summary: "'outline'" },
        type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" },
      },
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles a glossy frosted glassmorphism aesthetic across the navigation ribbon.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    dropShadow: {
      control: 'text',
      description: 'Explicit CSS `box-shadow` string to override the default drop shadow of the active design variant.',
      table: { category: 'Design Architecture', type: { summary: 'string' } },
    },
    fontFamily: {
      control: 'text',
      description: 'Custom CSS font-family string applied globally to the navigation ribbon typography.',
      table: { category: 'Typography', defaultValue: { summary: '"Bodoni Moda Variable", -apple-system, sans-serif' }, type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // THEMING: GLOBAL
    // ----------------------------------------------------------------------
    darkMode: {
      control: 'boolean',
      description: 'Force dark mode rendering independent of the global UI context or OS preference.',
      table: { category: 'Theming: Global', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    activeColor: {
      control: 'color',
      description: 'Explicit active/accent color override applied to the active navigation item text and focus rings.',
      table: { category: 'Theming: Global', type: { summary: 'string' } },
    },
    darkModeColors: {
      control: false,
      description: 'Dynamic light/dark mode brand color mapping used as fallback accent tokens.',
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
      description: 'Explicit container background color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } },
    },
    textColor: {
      control: 'color',
      description: 'Explicit primary text color override for inactive items in light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } },
    },
    hoverTextColor: {
      control: 'color',
      description: 'Explicit hover text color override for inactive items in light mode contexts.',
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
      description: 'Explicit primary text color override for inactive items in dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } },
    },
    darkHoverTextColor: {
      control: 'color',
      description: 'Explicit hover text color override for inactive items in dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // 3D EXTRUSION (NEU/SKEUO)
    // ----------------------------------------------------------------------
    elevation: {
      control: { type: 'range', min: 1, max: 16, step: 1 },
      description: 'Z-axis 3D extrusion distance in pixels for Neumorphic and Skeuomorphic shadow spread and offset.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '6' }, type: { summary: 'number' } },
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
      description: 'Delegates rendering of the root `<header>` element to its immediate child via Radix Slot.',
      table: { category: 'Universal Attributes', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    children: {
      control: false,
      description: 'Optional child nodes injected inside the main row between the navigation track and the trailing actions cluster.',
      table: { category: 'Universal Attributes', type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Standard CSS class name appended directly to the root `<header>` element.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } },
    },
    style: {
      control: 'object',
      description: 'Inline CSS style overrides applied to the root `<header>` element.',
      table: { category: 'Universal Attributes', type: { summary: 'React.CSSProperties' } },
    },
  },
  args: {
    defaultActiveIndex: 1,
    design: 'material',
    trueGlass: false,
    darkMode: true,
    backgroundColor: '#ffffff',
    darkBackgroundColor: '#0d0f17',
    waveColor: '#f1f5f9',
    darkWaveColor: '#e8eaf2',
    activeColor: '#4a7fff',
    waveHeight: 16,
    waveWidth: 72,
    waveDuration: 480,
    logoPosition: 'top-left',
    logoHeight: 28,
    brandHref: '/',
    pagePosition: 'top',
    menuVisibility: 'auto-hide-reappear',
    scrollReappearDelay: 450,
    elevation: 6,
    neuIntensity: 1,
    lightSource: 'top-left',
    fontFamily: 'Inter, system-ui, sans-serif',
    asChild: false,
  },
};

export default meta;
type Story = StoryObj<NavigationRibbonStoryProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: ({ brandLightColor, brandDarkColor, activeIndex, ...args }) => {
    const [selectedIdx, setSelectedIdx] = useState(activeIndex ?? args.defaultActiveIndex ?? 1);
    const [activeRoute, setActiveRoute] = useState(iconNavItems[selectedIdx]?.href || '/storage');

    useEffect(() => {
      if (activeIndex !== undefined) {
        setSelectedIdx(activeIndex);
        setActiveRoute(iconNavItems[activeIndex]?.href || '/dashboard');
      }
    }, [activeIndex]);

    const canvasBg = args.darkMode
      ? args.darkWaveColor || '#e8eaf2'
      : args.waveColor || '#f1f5f9';

    const routeContent = (
      <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif', flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', opacity: 0.8 }}>
          Active Route: <strong>{activeRoute}</strong> — Click any item to watch the liquid SVG wave glide across the ribbon.
        </p>
      </div>
    );

    return (
      <div
        style={{
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: canvasBg,
          position: 'relative',
        }}
      >
        {args.pagePosition === 'bottom' && routeContent}

        <NavigationRibbon
          {...args}
          activeIndex={selectedIdx}
          style={{ position: 'relative', ...args.style }}
          logo={<BrandLockup label="MITO UI" accent={args.activeColor || '#4a7fff'} />}
          navItems={iconNavItems}
          darkModeColors={
            brandLightColor || brandDarkColor
              ? { light: brandLightColor || '#2563eb', dark: brandDarkColor || '#4a7fff' }
              : undefined
          }
          onNavigate={(href, index, e) => {
            e.preventDefault();
            setActiveRoute(href);
            if (index >= 0) setSelectedIdx(index);
          }}
          actionsNode={
            <>
              <ActionButton
                design={args.design}
                trueGlass={args.trueGlass}
                tactile
                darkMode={args.darkMode}
                title="GitHub"
                onClick={() => alert('GitHub clicked')}
                icon={<Icon name="github" width="16" height="16" />}
              />
              <Button
                variant={args.design === 'neumorphic' ? 'outline' : args.design}
                darkMode={args.darkMode}
                backgroundColor={args.activeColor || '#4a7fff'}
                darkBackgroundColor={args.activeColor || '#4a7fff'}
                textColor="#ffffff"
                darkTextColor="#ffffff"
                onClick={() => alert('Connect Wallet Triggered')}
              >
                Connect
              </Button>
            </>
          }
        />

        {args.pagePosition !== 'bottom' && routeContent}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground exposing all props. Adjust `waveHeight`, `waveWidth`, `waveDuration`, `waveColor`/`darkWaveColor`, or flip `pagePosition` (`top` vs `bottom`) in the Controls table. Note: `position: relative` is applied in Docs previews so stacked stories do not overlap.',
      },
      source: {
        code: `import { Link } from 'react-router-dom';
import { NavigationRibbon, ActionButton, Button, Icon } from '@emeraldemperaur/mito-ui';

export const AppNavigationRibbon = () => (
  <NavigationRibbon
    design="material"
    darkMode
    backgroundColor="#0d0f17"
    darkBackgroundColor="#0d0f17"
    darkWaveColor="#e8eaf2"
    activeColor="#4a7fff"
    menuVisibility="auto-hide-reappear"
    linkComponent={Link}
    logo={<span>MITO UI</span>}
    logoPosition="top-left"
    navItems={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Storage', href: '/storage', isActive: true },
      { label: 'Compute', href: '/compute' },
      { label: 'Earnings', href: '/earnings' },
    ]}
    actionsNode={
      <>
        <ActionButton
          design="material"
          tactile
          darkMode
          title="GitHub"
          onClick={() => window.open('https://github.com', '_blank')}
          icon={<Icon name="githublogo" width="16" height="16" />}
        />
        <Button variant="material" darkMode onClick={handleConnectWallet}>
          Connect
        </Button>
      </>
    }
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
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/dashboard');
    return (
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9', color: '#0f172a' }}>
        <NavigationRibbon
          design="outline"
          backgroundColor="#ffffff"
          waveColor="#f1f5f9"
          activeColor="#163611"
          menuVisibility="sticky"
          style={{ position: 'relative' }}
          logo={<BrandLockup label="MITO UI" accent="#163611" />}
          navItems={baseNavItems}
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Inter, system-ui, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.78 }}>
            Active Route: <strong>{activeRoute}</strong> — Outline variant with matching <code>waveColor="#f1f5f9"</code> cutout.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Clean flat surface with a 1px edge border and a liquid SVG wave matching the light content canvas below.',
      },
      source: {
        code: `import { NavigationRibbon } from '@emeraldemperaur/mito-ui';

export const OutlineRibbon = () => (
  <NavigationRibbon
    design="outline"
    backgroundColor="#ffffff"
    waveColor="#f1f5f9"
    activeColor="#163611"
    menuVisibility="sticky"
    logo={<span>MITO UI</span>}
    navItems={navItems}
  />
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 3. DESIGN VARIANT: MATERIAL (DARK CUTOUT SHOWCASE)
// ---------------------------------------------------------------------------
export const MaterialVariant: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/storage');
    return (
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: '#e8eaf2', color: '#0f172a' }}>
        <NavigationRibbon
          design="material"
          darkMode
          defaultActiveIndex={1}
          backgroundColor="#0d0f17"
          darkBackgroundColor="#0d0f17"
          darkWaveColor="#e8eaf2"
          activeColor="#800020"
          menuVisibility="sticky"
          style={{ position: 'relative' }}
          logo={<BrandLockup label="MITO UI" accent="#800020" />}
          navItems={baseNavItems}
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          actionsNode={
            <>
              <ActionButton
                design="material"
                tactile
                darkMode
                title="GitHub"
                onClick={() => window.open('https://github.com', '_blank')}
                icon={<Icon name="github" width="16" height="16" />}
              />
              <Button variant="material" darkMode backgroundColor="#800020" darkBackgroundColor="#800020" textColor="#ffffff" darkTextColor="#ffffff">
                Connect
              </Button>
            </>
          }
          fontFamily="Inter, system-ui, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.78 }}>
            Active Route: <strong>{activeRoute}</strong> — High-contrast dark Material ribbon with <code>darkWaveColor="#e8eaf2"</code>.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Elevated dark Material ribbon (`#0d0f17`) with `darkWaveColor="#e8eaf2"` creating a seamless optical cutout against a light workspace canvas.',
      },
      source: {
        code: `import { NavigationRibbon, ActionButton, Button, Icon } from '@emeraldemperaur/mito-ui';

export const MaterialRibbon = () => (
  <NavigationRibbon
    design="material"
    darkMode
    backgroundColor="#0d0f17"
    darkBackgroundColor="#0d0f17"
    darkWaveColor="#e8eaf2"
    activeColor="#800020"
    menuVisibility="sticky"
    logo={<span>IAGON</span>}
    navItems={navItems}
    actionsNode={
      <>
        <ActionButton design="material" tactile darkMode icon={<Icon name="githublogo" width="16" height="16" />} />
        <Button variant="material" darkMode>Connect</Button>
      </>
    }
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
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/dashboard');
    return (
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
        <NavigationRibbon
          design="neumorphic"
          backgroundColor="#e2e8f0"
          waveColor="#cbd5e1"
          activeColor="#2563eb"
          menuVisibility="sticky"
          elevation={6}
          neuIntensity={1.1}
          lightSource="top-left"
          style={{ position: 'relative' }}
          logo={<BrandLockup label="MITO UI" accent="#2563eb" />}
          navItems={baseNavItems}
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Raleway, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.78 }}>
            Active Route: <strong>{activeRoute}</strong> — Soft 3D extruded Neumorphic ribbon calibrated to <code>#e2e8f0</code>.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft 3D extruded ribbon dynamically calibrated to its parent background color (`#e2e8f0`).',
      },
      source: {
        code: `import { NavigationRibbon } from '@emeraldemperaur/mito-ui';

export const NeumorphicRibbon = () => (
  <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh' }}>
    <NavigationRibbon
      design="neumorphic"
      backgroundColor="#e2e8f0"
      waveColor="#cbd5e1"
      activeColor="#2563eb"
      menuVisibility="sticky"
      elevation={6}
      neuIntensity={1.1}
      lightSource="top-left"
      logo={<span>MITO UI</span>}
      navItems={navItems}
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
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/dashboard');
    return (
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', color: '#0f172a' }}>
        <NavigationRibbon
          design="skeuomorphic"
          backgroundColor="#e2e8f0"
          waveColor="#f8fafc"
          activeColor="#FF9B00"
          menuVisibility="sticky"
          elevation={5}
          style={{ position: 'relative' }}
          logo={<BrandLockup label="MITO UI" accent="#FF9B00" />}
          navItems={baseNavItems}
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Libre Franklin, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.78 }}>
            Active Route: <strong>{activeRoute}</strong> — Tactile beveled 3D Skeuomorphic ribbon with directional lighting gradients.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tactile, beveled 3D hardware-inspired ribbon with directional lighting gradients and inner rim highlights.',
      },
      source: {
        code: `import { NavigationRibbon } from '@emeraldemperaur/mito-ui';

export const SkeuomorphicRibbon = () => (
  <NavigationRibbon
    design="skeuomorphic"
    backgroundColor="#e2e8f0"
    waveColor="#f8fafc"
    activeColor="#d97706"
    elevation={5}
    logo={<span>MITO UI</span>}
    navItems={navItems}
  />
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 6. BOTTOM-DOCKED GLASSMORPHIC RIBBON (INVERTED WAVE)
// ---------------------------------------------------------------------------
export const BottomDockedGlassmorphic: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/dashboard');
    return (
      <div
        style={{
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: '#f8fafc',
        }}
      >
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.78 }}>
            Active Route: <strong>{activeRoute}</strong> — Bottom-docked <code>trueGlass</code> ribbon with automatically inverted SVG wave and <code>logoPosition="bottom-center"</code>.
          </p>
        </div>

        <NavigationRibbon
          design="skeuomorphic"
          trueGlass
          darkMode
          pagePosition="bottom"
          menuVisibility="auto-hide-reappear"
          logoPosition="bottom-center"
          darkWaveColor="#1e1b4b"
          activeColor="#38bdf8"
          logo={<BrandLockup label="MITO UI" accent="#38bdf8" />}
          logoHeight={28}
          style={{ position: 'relative' }}
          navItems={iconNavItems}
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          actionsNode={
            <>
              <ActionButton
                design="skeuomorphic"
                trueGlass
                tactile
                darkMode
                title="GitHub"
                onClick={() => window.open('https://github.com', '_blank')}
                icon={<Icon name="github" width="16" height="16" />}
              />
              <Button variant="skeuomorphic" darkMode onClick={() => alert('Connect Triggered')}>
                Connect
              </Button>
            </>
          }
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Bottom-docked (`pagePosition="bottom"`) frosted glassmorphic ribbon. Automatically flips the liquid SVG wave to the top edge (`scaleY(-1)`), applies iOS `env(safe-area-inset-bottom)`, and anchors the brand logo via `logoPosition="bottom-center"`.',
      },
      source: {
        code: `import { NavigationRibbon, ActionButton, Button, Icon } from '@emeraldemperaur/mito-ui';

export const BottomGlassRibbon = () => (
  <NavigationRibbon
    design="skeuomorphic"
    trueGlass
    darkMode
    pagePosition="bottom"
    menuVisibility="auto-hide-reappear"
    logoPosition="bottom-center"
    darkWaveColor="#1e1b4b"
    activeColor="#38bdf8"
    logo={<span>MITO UI</span>}
    logoHeight={28}
    navItems={navItems}
    actionsNode={
      <>
        <ActionButton design="skeuomorphic" trueGlass tactile darkMode icon={<Icon name="githublogo" width="16" height="16" />} />
        <Button variant="skeuomorphic" darkMode>Connect</Button>
      </>
    }
  />
);`,
      },
    },
  },
};