import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationBar,
  type NavigationBarProps,
  type NavigationBarItem,
} from './NavigationBar';
import { ActionButton } from '../Buttons/ActionButton';
import { Button } from '../Buttons/Button';
import { Icon } from '../../components/icons/Icons';
import '../../styles/fonts.scss';

const baseNavItems: NavigationBarItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Telemetry', href: '/telemetry' },
  { label: 'Forms', href: '/forms' },
  { label: 'Settings', href: '/settings' },
];

const iconNavItems: NavigationBarItem[] = [
  { label: 'Overview', href: '/', icon: <Icon name="dashboard" width="16" height="16" /> },
  { label: 'Telemetry', href: '/telemetry', icon: <Icon name="activitylog" width="16" height="16" /> },
  { label: 'Forms', href: '/forms', icon: <Icon name="layers" width="16" height="16" /> },
  { label: 'Developer', href: '/developer', icon: <Icon name="code" width="16" height="16" /> },
  { label: 'Settings', href: '/settings', icon: <Icon name="mixerhorizontal" width="16" height="16" /> },
];

const MitoLogoLockup = ({ accent = '#2563eb' }: { accent?: string }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, letterSpacing: '0.12em' }}>
    <Icon name="rocket" width="20" height="20" color={accent} />
    <span>MITO UI</span>
  </div>
);

export interface NavigationBarStoryProps extends NavigationBarProps {
  brandLightColor?: string;
  brandDarkColor?: string;
}

const meta: Meta<NavigationBarStoryProps> = {
  title: 'Navigation/NavigationBar',
  component: NavigationBar as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: true },
      description: {
        component:
          'Enterprise-grade, SSR-safe sliding-indicator navigation bar. Features a smoothly interpolated active pill or rectangular indicator (`mix-blend-mode: difference` or solid `activeColor`), strict 9-item UI cap, 6-position logo layout, top/bottom viewport docking, configurable scroll visibility, ambient-aware 3D variants, and glossy `trueGlass` styling.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // NAVIGATION & ROUTING
    // ----------------------------------------------------------------------
    navItems: {
      control: false,
      description: 'Array of top-level `NavigationBarItem` definitions (`label`, `href`, `icon`, `isActive`). Strictly capped at 9 items.',
      table: { category: 'Navigation & Routing', type: { summary: 'NavigationBarItem[]' } },
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
      description: 'Anchors the navigation bar to either the top or bottom of the viewport, automatically inverting scroll-hide animations.',
      table: {
        category: 'Viewport Docking & Scroll',
        defaultValue: { summary: "'top'" },
        type: { summary: "'top' | 'bottom'" },
      },
    },
    menuVisibility: {
      control: 'select',
      options: ['sticky', 'auto-hide', 'auto-hide-reappear'],
      description: 'Controls how the navigation bar responds to vertical page scrolling.',
      table: {
        category: 'Viewport Docking & Scroll',
        defaultValue: { summary: "'auto-hide'" },
        type: { summary: "'sticky' | 'auto-hide' | 'auto-hide-reappear'" },
      },
    },
    scrollReappearDelay: {
      control: { type: 'number', min: 100, max: 2000, step: 50 },
      description: 'Delay in milliseconds after scrolling stops before the bar reappears when `menuVisibility="auto-hide-reappear"`.',
      table: { category: 'Viewport Docking & Scroll', defaultValue: { summary: '450' }, type: { summary: 'number' } },
    },

    // ----------------------------------------------------------------------
    // SLIDING INDICATOR & DESIGN ARCHITECTURE
    // ----------------------------------------------------------------------
    blendIndicator: {
      control: 'boolean',
      description: 'Uses CSS `mix-blend-mode: difference` on the sliding indicator for high-contrast inversion. Set to `false` for a solid `activeColor` indicator.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } },
    },
    pillShape: {
      control: 'inline-radio',
      options: ['pill', 'rectangle'],
      description: 'Controls the corner radius geometry of the navigation track, items, and sliding indicator (`9999px` vs `4px`).',
      table: {
        category: 'Design Architecture',
        defaultValue: { summary: "'pill'" },
        type: { summary: "'pill' | 'rectangle'" },
      },
    },
    design: {
      control: 'select',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: "The architectural design system variation dictating the bar's surface, borders, and depth.",
      table: {
        category: 'Design Architecture',
        defaultValue: { summary: "'outline'" },
        type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" },
      },
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles a glossy frosted glassmorphism aesthetic across the bar and track.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    dropShadow: {
      control: 'text',
      description: 'Explicit CSS `box-shadow` string to override the default drop shadow of the active design variant.',
      table: { category: 'Design Architecture', type: { summary: 'string' } },
    },
    fontFamily: {
      control: 'text',
      description: 'Custom CSS font-family string applied globally to the navigation bar typography.',
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
    activeTextColor: {
      control: 'color',
      description: 'Explicit text color override applied to the currently active navigation item. Works best with `blendIndicator={false}` for exact color accuracy.',
      table: {
        category: 'Theming: Global',
        type: { summary: 'string' },
      },
    },
    activeColor: {
      control: 'color',
      description: 'Explicit active/accent color override applied to the sliding indicator, active item states, and focus rings.',
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
      description: 'Explicit primary text color override for light mode contexts.',
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
      description: 'Explicit primary text color override specifically for dark mode contexts.',
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
      description: 'Optional child nodes injected inside the main row between the pill track and the trailing actions cluster.',
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
    defaultActiveIndex: 0,
    design: 'outline',
    pillShape: 'pill',
    blendIndicator: false,
    activeColor: '#800020',
    trueGlass: false,
    darkMode: false,
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
type Story = StoryObj<NavigationBarStoryProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: ({ brandLightColor, brandDarkColor, activeIndex, ...args }) => {
    const [selectedIdx, setSelectedIdx] = useState(activeIndex ?? args.defaultActiveIndex ?? 0);
    const [activeRoute, setActiveRoute] = useState(iconNavItems[selectedIdx]?.href || '/');

    useEffect(() => {
      if (activeIndex !== undefined) {
        setSelectedIdx(activeIndex);
        setActiveRoute(iconNavItems[activeIndex]?.href || '/');
      }
    }, [activeIndex]);

    const routeContent = (
      <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif', flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.78 }}>
          Active Route: <strong>{activeRoute}</strong> — Click any item to watch the sliding indicator glide across the track.
        </p>
      </div>
    );

    return (
      <div
        style={{
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          background: args.darkMode
            ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
            : '#f8fafc',
          color: args.darkMode ? '#f8fafc' : '#0f172a',
          position: 'relative',
        }}
      >
        {args.pagePosition === 'bottom' && routeContent}

        <NavigationBar
          {...args}
          activeIndex={selectedIdx}
          style={{ position: 'relative', ...args.style }}
          logo={<MitoLogoLockup accent={args.activeColor || (args.darkMode ? '#38bdf8' : '#2563eb')} />}
          navItems={iconNavItems}
          darkModeColors={
            brandLightColor || brandDarkColor
              ? { light: brandLightColor || '#111827', dark: brandDarkColor || '#ffffff' }
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
                backgroundColor={args.activeColor}
                darkBackgroundColor={args.activeColor}
                textColor={args.activeTextColor || '#ffffff'}
                darkTextColor={args.activeTextColor || '#ffffff'}
                onClick={() => alert('Account clicked')}
              >
                Account
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
          'Interactive playground exposing all props. Click any item to watch the sliding indicator interpolate across the track, toggle `pillShape` (`pill` vs `rectangle`), flip `blendIndicator`, or switch `logoPosition` across all 6 anchor points. Note: `position: relative` is applied in Docs previews so stacked stories do not overlap.',
      },
      source: {
        code: `import React, { useState } from 'react';
import { NavigationBar, ActionButton, Button, Icon, type NavigationBarItem } from '@emeraldemperaur/mito-ui';

const navItems: NavigationBarItem[] = [
  { label: 'Overview', href: '/', icon: <Icon name="dashboard" width="16" height="16" /> },
  { label: 'Telemetry', href: '/telemetry', icon: <Icon name="activitylog" width="16" height="16" /> },
  { label: 'Forms', href: '/forms', icon: <Icon name="layers" width="16" height="16" /> },
  { label: 'Settings', href: '/settings', icon: <Icon name="mixerhorizontal" width="16" height="16" /> },
];

export const AppNavigationBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <NavigationBar
      design="outline"
      pillShape="pill"
      menuVisibility="auto-hide-reappear"
      blendIndicator={true}
      logo={<span style={{ letterSpacing: '0.12em' }}>MITO UI</span>}
      logoPosition="top-left"
      logoHeight={28}
      navItems={navItems}
      activeIndex={activeIndex}
      onNavigate={(_href, index, e) => {
        e.preventDefault();
        if (index >= 0) setActiveIndex(index);
      }}
      actionsNode={
        <>
          <ActionButton design="outline" tactile icon={<Icon name="githublogo" width="16" height="16" />} />
          <Button
            variant="outline"
            backgroundColor="#800020"
            textColor="#ffffff"
            darkBackgroundColor="#800020"
            darkTextColor="#ffffff"
          >
            Account
          </Button>
        </>
      }
    />
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. DESIGN VARIANT: OUTLINE
// ---------------------------------------------------------------------------
export const OutlineVariant: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/');
    return (
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#0f172a' }}>
        <NavigationBar
          design="outline"
          style={{ position: 'relative' }}
          logo={<MitoLogoLockup accent="#2563eb" />}
          navItems={baseNavItems}
          menuVisibility="sticky"
          activeColor="#2563eb"
          blendIndicator={false}
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Inter, system-ui, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75 }}>
            Active Route: <strong>{activeRoute}</strong> — Outline variant with solid <code>activeColor</code> pill indicator.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Clean flat surface with a crisp 1px edge border and a solid `activeColor` sliding pill indicator.',
      },
      source: {
        code: `import { NavigationBar } from '@emeraldemperaur/mito-ui';

export const OutlineNavBar = () => (
  <NavigationBar
    design="outline"
    menuVisibility="sticky"
    logo={<span>MITO UI</span>}
    navItems={navItems}
    fontFamily="Inter, system-ui, sans-serif"
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
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/');
    return (
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9', color: '#0f172a' }}>
        <NavigationBar
          design="material"
          blendIndicator={false}
          activeColor="#0ea5e9"
          style={{ position: 'relative' }}
          logo={<MitoLogoLockup accent="#0ea5e9" />}
          navItems={baseNavItems}
          menuVisibility="sticky"
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Inter, system-ui, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75 }}>
            Active Route: <strong>{activeRoute}</strong> — Elevated Material surface with soft ambient drop shadows.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Elevated surface with soft ambient drop shadows and a solid `activeColor` sliding pill (`blendIndicator={false}`).',
      },
      source: {
        code: `import { NavigationBar } from '@emeraldemperaur/mito-ui';

export const MaterialNavBar = () => (
  <NavigationBar
    design="material"
    blendIndicator={false}
    activeColor="#0ea5e9"
    logo={<span>MITO UI</span>}
    navItems={navItems}
    menuVisibility="sticky"
    fontFamily="Inter, system-ui, sans-serif"
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
    const [activeRoute, setActiveRoute] = useState('/');
    return (
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
        <NavigationBar
          design="neumorphic"
          blendIndicator={false}
          hoverTextColor="#000000"
          textColor="#800020"
          elevation={6}
          neuIntensity={1.1}
          lightSource="top-left"
          style={{ position: 'relative' }}
          logo={<MitoLogoLockup accent="#2563eb" />}
          navItems={baseNavItems}
          menuVisibility="sticky"
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Raleway, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75 }}>
            Active Route: <strong>{activeRoute}</strong> — Soft 3D extruded bar with inset neumorphic pill track.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft 3D extruded bar with an inset neumorphic pill track dynamically calibrated to its parent background color (`#e2e8f0`).',
      },
      source: {
        code: `import { NavigationBar } from '@emeraldemperaur/mito-ui';

export const NeumorphicNavBar = () => (
  <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh' }}>
    <NavigationBar
      design="neumorphic"
      backgroundColor="#e2e8f0"
      elevation={6}
      neuIntensity={1.1}
      lightSource="top-left"
      logo={<span>MITO UI</span>}
      navItems={navItems}
      menuVisibility="sticky"
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
    const [activeRoute, setActiveRoute] = useState('/');
    return (
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
        <NavigationBar
          design="skeuomorphic"
          backgroundColor="#e2e8f0"
          blendIndicator={false}
          activeColor="#d97706"
          elevation={5}
          style={{ position: 'relative' }}
          logo={<MitoLogoLockup accent="#d97706" />}
          navItems={baseNavItems}
          menuVisibility="sticky"
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Libre Franklin, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75 }}>
            Active Route: <strong>{activeRoute}</strong> — Tactile beveled 3D surface with directional lighting gradients.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tactile, beveled 3D hardware-inspired bar with directional lighting gradients and inner rim highlights.',
      },
      source: {
        code: `import { NavigationBar } from '@emeraldemperaur/mito-ui';

export const SkeuomorphicNavBar = () => (
  <NavigationBar
    design="skeuomorphic"
    backgroundColor="#e2e8f0"
    blendIndicator={false}
    activeColor="#d97706"
    elevation={5}
    logo={<span>MITO UI</span>}
    navItems={navItems}
    menuVisibility="sticky"
  />
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 6. BOTTOM-DOCKED GLASSMORPHIC BAR (DARK MODE)
// ---------------------------------------------------------------------------
export const BottomDockedGlassmorphic: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/');
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
            Active Route: <strong>{activeRoute}</strong> — Bottom-docked <code>trueGlass</code> bar with <code>logoPosition="bottom-center"</code>.
          </p>
        </div>

        <NavigationBar
          design="skeuomorphic"
          trueGlass
          darkMode
          pagePosition="bottom"
          menuVisibility="auto-hide-reappear"
          logoPosition="bottom-center"
          logo={<span style={{ letterSpacing: '0.12em' }}>MITO UI</span>}
          logoHeight={28}
          style={{ position: 'relative' }}
          navItems={baseNavItems}
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
              <Button variant="skeuomorphic" darkMode onClick={() => alert('Account Triggered')}>
                Account
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
          'Bottom-docked (`pagePosition="bottom"`) frosted glassmorphic bar with `logoPosition="bottom-center"`, `menuVisibility="auto-hide-reappear"`, and composite `actionsNode`.',
      },
      source: {
        code: `import { Link } from 'react-router-dom';
import { NavigationBar, ActionButton, Button, Icon } from '@emeraldemperaur/mito-ui';

export const BottomGlassDock = () => (
  <NavigationBar
    design="skeuomorphic"
    trueGlass
    darkMode
    pagePosition="bottom"
    menuVisibility="auto-hide-reappear"
    logoPosition="bottom-center"
    logo={<span style={{ letterSpacing: '0.12em' }}>MITO UI</span>}
    logoHeight={28}
    linkComponent={Link}
    navItems={[
      { label: 'Home', href: '/' },
      { label: 'Telemetry', href: '/telemetry' },
      { label: 'Forms', href: '/forms' },
      { label: 'Settings', href: '/settings' },
    ]}
    actionsNode={
      <>
        <ActionButton
          design="skeuomorphic"
          trueGlass
          tactile
          darkMode
          title="GitHub"
          onClick={() => window.open('https://github.com', '_blank')}
          icon={<Icon name="githublogo" width="16" height="16" />}
        />
        <Button variant="skeuomorphic" darkMode onClick={handleAccountClick}>
          Account
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
// 7. RECTANGLE SHAPE (DARK OUTLINE)
// ---------------------------------------------------------------------------
export const RectangleShapeDark: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/');
    return (
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', backgroundColor: '#09090b', color: '#f8fafc' }}>
        <NavigationBar
          pillShape="rectangle"
          design="outline"
          darkMode
          style={{ position: 'relative' }}
          navItems={iconNavItems}
          menuVisibility="auto-hide-reappear"
          onNavigate={(href, _idx, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Inter, system-ui, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.78 }}>
            Active Route: <strong>{activeRoute}</strong> — Crisp <code>pillShape="rectangle"</code> geometry with leading item icons.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Switches `pillShape="rectangle"` (`4px` corner radius) in dark outline mode with leading item icons.',
      },
      source: {
        code: `import { NavigationBar } from '@emeraldemperaur/mito-ui';

export const RectangleNavBar = () => (
  <NavigationBar
    pillShape="rectangle"
    design="outline"
    darkMode
    navItems={navItems}
    menuVisibility="auto-hide-reappear"
  />
);`,
      },
    },
  },
};