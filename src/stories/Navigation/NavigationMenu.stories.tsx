import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  type NavigationMenuProps,
  type NavItem,
} from './NavigationMenu';
import { ActionButton } from '../Buttons/ActionButton'; 
import { Button } from '../Buttons/Button';             
import { Icon } from '../../components/icons/Icons';                       
import '../../styles/fonts.scss';
import BlobLogo from './DripLogo';

// ---------------------------------------------------------------------------
// SHARED MOCK NAV BUILDER (WITH MULTI-COLUMN GROUPS & NESTED SUB-MENUS)
// ---------------------------------------------------------------------------
const buildNavItems = (activeRoute: string): NavItem[] => [
  {
    label: 'Overview',
    href: '/',
    isActive: activeRoute === '/',
  },
  {
    label: 'Platform',
    isActive:
      activeRoute.startsWith('/platform') ||
      activeRoute.startsWith('/forms') ||
      activeRoute === '/telemetry',
    dropdownGroups: [
      {
        title: 'Core Engines',
        items: [
          {
            title: 'Telemetry DataTable',
            description: 'Real-time sortable grid with virtualized glass polish',
            href: '/telemetry',
            isActive: activeRoute === '/telemetry',
            icon: <Icon name="dashboard" width="20" height="20" />,
          },
          {
            title: 'VectorSigma Forms',
            description: 'Schema-driven form builder with Yup & Formik',
            isActive: activeRoute.startsWith('/forms'),
            icon: <Icon name="layers" width="20" height="20" />,
            subItems: [
              {
                title: 'Codice (Linear)',
                description: 'Standard stacked layout',
                href: '/forms/codice',
                isActive: activeRoute === '/forms/codice',
              },
              {
                title: 'Codex (Wizard)',
                description: 'Step-by-step strict validation',
                href: '/forms/codex',
                isActive: activeRoute === '/forms/codex',
              },
              {
                title: 'Accordion Mode',
                description: 'Collapsible multi-section',
                href: '/forms/accordion',
                isActive: activeRoute === '/forms/accordion',
              },
            ],
          },
          {
            title: 'Command Modals',
            description: 'Z-index stacked drawers and glassmorphic overlays',
            href: '/platform/modals',
            isActive: activeRoute === '/platform/modals',
            icon: <Icon name="mixerhorizontal" width="20" height="20" />,
          },
        ],
      },
      {
        title: 'Developer Tools',
        items: [
          {
            title: 'MCP Context Specs',
            description: 'Strict JSDoc schemas for downstream AI agents',
            href: '/platform/mcp',
            isActive: activeRoute === '/platform/mcp',
            icon: <Icon name="code" width="20" height="20" />,
          },
          {
            title: 'Theme Studio',
            description: 'Ambient Neumorphic & Skeuomorphic token generator',
            href: '/platform/themes',
            isActive: activeRoute === '/platform/themes',
            icon: <Icon name="mixervertical" width="20" height="20" />,
          },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    dropdownGroups: [
      {
        title: 'Documentation',
        items: [
          {
            title: 'Quickstart Guide',
            description: 'Install and configure Mito UI in 5 minutes',
            href: '/docs/quickstart',
            isActive: activeRoute === '/docs/quickstart',
            icon: <Icon name="filetext" width="20" height="20" />,
          },
          {
            title: 'Changelog',
            description: 'Latest releases and migration notes',
            href: '/docs/changelog',
            isActive: activeRoute === '/docs/changelog',
            icon: <Icon name="activitylog" width="20" height="20" />,
          },
        ],
      },
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing',
    isActive: activeRoute === '/pricing',
  },
];

const MitoBrandLogo = ({ accent = '#2563eb' }: { accent?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, letterSpacing: '0.05em' }}>
    <BlobLogo width="33" height="33" color={accent} />
    <span>MITO UI</span>
  </div>
);

const AltMitoBrandLogo = ({ accent = '#2563eb' }: { accent?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, letterSpacing: '0.05em' }}>
    <BlobLogo width="23" height="23" color={accent} />
    <span>MITO</span>
  </div>
);


export interface NavigationMenuStoryProps extends NavigationMenuProps {
  brandLightColor?: string;
  brandDarkColor?: string;
}

const meta: Meta<NavigationMenuStoryProps> = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: true },
      description: {
        component:
          'Accessible, SSR-safe, router-agnostic enterprise navigation bar. Supports multi-column dropdowns, nested flyout sub-menus (`subItems`), configurable scroll visibility (`sticky`, `auto-hide`, `auto-hide-reappear`), glossy `trueGlass` surfaces, ambient-aware Neumorphic/Skeuomorphic 3D rendering, and composite action slots.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // BRANDING & LOGO CONTROLS
    // ----------------------------------------------------------------------
    logo: {
      control: false,
      description: 'ReactNode representing the brand logo (e.g., an SVG, image, or typography lockup).',
      table: { category: 'Branding & Logo', type: { summary: 'ReactNode' } },
    },
    brandLogo: {
      control: false,
      description: 'Legacy alias for `logo` maintained for backward compatibility. Takes lower precedence than `logo`.',
      table: { category: 'Branding & Logo', type: { summary: 'ReactNode' } },
    },
    logoWidth: {
      control: 'text',
      description: "Explicit CSS width applied to the logo container (e.g., '140px', 48).",
      table: { category: 'Branding & Logo', type: { summary: 'string | number' } },
    },
    logoHeight: {
      control: 'text',
      description: "Explicit CSS height applied to the logo container (e.g., '36px', 36).",
      table: { category: 'Branding & Logo', type: { summary: 'string | number' } },
    },
    logoPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Controls whether the brand logo is anchored on the far left or far right of the navigation bar.',
      table: { category: 'Branding & Logo', defaultValue: { summary: "'left'" }, type: { summary: "'left' | 'right'" } },
    },
    brandHref: {
      control: 'text',
      description: 'Destination URL or route path triggered when clicking the brand logo.',
      table: { category: 'Branding & Logo', defaultValue: { summary: "'/'" }, type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // NAVIGATION & ROUTING
    // ----------------------------------------------------------------------
    navItems: {
      control: false,
      description: 'Array of top-level `NavItem` definitions (`label`, `href`, `isActive`, `dropdownGroups` with nested `subItems`).',
      table: { category: 'Navigation & Routing', type: { summary: 'NavItem[]' } },
    },
    linkComponent: {
      control: false,
      description: 'Optional custom link component (e.g., React Router `Link` or Next.js `Link`) for SPA routing. Defaults to native `<a>`.',
      table: { category: 'Navigation & Routing', type: { summary: 'React.ElementType' } },
    },
    onNavigate: {
      control: false,
      description: 'Optional click interceptor fired whenever any navigation link is clicked, useful for programmatic routing or analytics.',
      table: { category: 'Navigation & Routing', type: { summary: '(href: string, e: React.MouseEvent) => void' } },
    },

    // ----------------------------------------------------------------------
    // COMPOSITE ACTION SLOTS
    // ----------------------------------------------------------------------
    actionsNode: {
      control: false,
      description: 'Single ReactNode slot for injecting custom social action buttons, search triggers, or login/account controls.',
      table: { category: 'Composite Action Slots', type: { summary: 'ReactNode' } },
    },
    rightActions: {
      control: false,
      description: 'Array of ReactNodes (e.g., `ActionButton` or `Button` instances) rendered in the actions cluster.',
      table: { category: 'Composite Action Slots', defaultValue: { summary: '[]' }, type: { summary: 'ReactNode[]' } },
    },

    // ----------------------------------------------------------------------
    // SCROLL & VISIBILITY BEHAVIOR
    // ----------------------------------------------------------------------
    menuVisibility: {
      control: 'select',
      options: ['sticky', 'auto-hide', 'auto-hide-reappear'],
      description: 'Controls how the navigation bar responds to vertical page scrolling.',
      table: {
        category: 'Scroll & Visibility',
        defaultValue: { summary: "'auto-hide'" },
        type: { summary: "'sticky' | 'auto-hide' | 'auto-hide-reappear'" },
      },
    },
    scrollReappearDelay: {
      control: { type: 'number', min: 100, max: 2000, step: 50 },
      description: 'Delay in milliseconds after scrolling stops before the menu reappears when `menuVisibility="auto-hide-reappear"`.',
      table: { category: 'Scroll & Visibility', defaultValue: { summary: '450' }, type: { summary: 'number' } },
    },

    // ----------------------------------------------------------------------
    // DESIGN ARCHITECTURE
    // ----------------------------------------------------------------------
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
      description: 'Toggles a glossy frosted glassmorphism aesthetic across the bar, dropdowns, sub-dropdowns, and mobile drawer.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    dropShadow: {
      control: 'text',
      description: 'Explicit CSS `box-shadow` string to override the default drop shadow of the active design variant.',
      table: { category: 'Design Architecture', type: { summary: 'string' } },
    },
    fontFamily: {
      control: 'text',
      description: 'Custom CSS font-family string applied globally to the navigation menu typography.',
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
      description: 'Explicit active/accent color override applied to active routes, focus rings, and brand highlights.',
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
      description: 'Explicit navigation bar background color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } },
    },
    textColor: {
      control: 'color',
      description: 'Explicit primary text color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } },
    },
    hoverTextColor: {
      control: 'color',
      description: 'Explicit hover text color override for links and triggers in light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // THEMING: DARK MODE
    // ----------------------------------------------------------------------
    darkBackgroundColor: {
      control: 'color',
      description: 'Explicit navigation bar background color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } },
    },
    darkTextColor: {
      control: 'color',
      description: 'Explicit primary text color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } },
    },
    darkHoverTextColor: {
      control: 'color',
      description: 'Explicit hover text color override for links and triggers in dark mode contexts.',
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
      description: 'Optional child nodes injected inside the primary navigation cluster beside the menu bar.',
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
    design: 'outline',
    trueGlass: false,
    darkMode: false,
    logoPosition: 'left',
    brandHref: '/',
    menuVisibility: 'auto-hide',
    scrollReappearDelay: 450,
    elevation: 6,
    neuIntensity: 1,
    lightSource: 'top-left',
    fontFamily: 'Inter, system-ui, sans-serif',
    asChild: false,
  },
};

export default meta;
type Story = StoryObj<NavigationMenuStoryProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: ({ brandLightColor, brandDarkColor, ...args }) => {
    const [activeRoute, setActiveRoute] = useState('/telemetry');

    return (
      <div
        style={{
          minHeight: '420px',
          background: args.darkMode
            ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
            : '#f8fafc',
          color: args.darkMode ? '#f8fafc' : '#0f172a',
          position: 'relative',
        }}
      >
        <NavigationMenu
          {...args}
          style={{ position: 'relative', ...args.style }}
          logo={<MitoBrandLogo accent={args.activeColor || (args.darkMode ? '#38bdf8' : '#2563eb')} />}
          navItems={buildNavItems(activeRoute)}
          menuVisibility="auto-hide-reappear"
          darkModeColors={
            brandLightColor || brandDarkColor
              ? { light: brandLightColor || '#2563eb', dark: brandDarkColor || '#38bdf8' }
              : undefined
          }
          onNavigate={(href, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          actionsNode={
            <>
              <ActionButton
                design={args.design}
                trueGlass={args.trueGlass}
                tactile
                darkMode={args.darkMode}
                title="GitHub Repository"
                onClick={() => alert('GitHub clicked')}
                icon={<Icon name="github" width="16" height="16" />}
              />
              <Button
                variant={args.design === 'neumorphic' ? 'outline' : args.design}
                darkMode={args.darkMode}
                backgroundColor="#2563eb"
                textColor="#ffffff"
                onClick={() => alert('Sign In Triggered')}
              >
                Sign In
              </Button>
            </>
          }
        />
        <div style={{ padding: '40px 2.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75 }}>
            Active Route: <strong>{activeRoute}</strong> — Open <strong>Platform &rarr; VectorSigma Forms</strong> to test nested flyout sub-menus.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground exposing all 33 props. Click **Platform** and hover/click **VectorSigma Forms** to test multi-column dropdowns and nested flyout sub-menus (`subItems`). Note: `position: relative` is applied in Docs previews so stacked stories do not overlap.',
      },
      source: {
        code: `import React, { useState } from 'react';
import { NavigationMenu, ActionButton, Button, Icon, type NavItem } from '@emeraldemperaur/mito-ui';

export const AppNavigation = () => {
  const [activeRoute, setActiveRoute] = useState('/telemetry');

  const navItems: NavItem[] = [
    { label: 'Overview', href: '/', isActive: activeRoute === '/' },
    {
      label: 'Platform',
      isActive: activeRoute.startsWith('/platform') || activeRoute === '/telemetry',
      dropdownGroups: [
        {
          title: 'Core Engines',
          items: [
            {
              title: 'Telemetry DataTable',
              description: 'Real-time sortable grid with virtualized glass polish',
              href: '/telemetry',
              isActive: activeRoute === '/telemetry',
              icon: <Icon name="dashboard" width="20" height="20" />,
            },
            {
              title: 'VectorSigma Forms',
              description: 'Schema-driven form builder with Yup & Formik',
              icon: <Icon name="layers" width="20" height="20" />,
              subItems: [
                { title: 'Codice (Linear)', description: 'Standard stacked layout', href: '/forms/codice' },
                { title: 'Codex (Wizard)', description: 'Step-by-step strict validation', href: '/forms/codex' },
                { title: 'Accordion Mode', description: 'Collapsible multi-section', href: '/forms/accordion' },
              ],
            },
          ],
        },
      ],
    },
    { label: 'Pricing', href: '/pricing', isActive: activeRoute === '/pricing' },
  ];

  return (
    <NavigationMenu
      design="outline"
      logo={<span>MITO UI</span>}
      navItems={navItems}
      menuVisibility="auto-hide-reappear"
      onNavigate={(href, e) => {
        e.preventDefault();
        setActiveRoute(href);
      }}
      actionsNode={
        <>
          <ActionButton icon={<Icon name="githublogo" width="16" height="16" />} tactile />
          <Button variant="outline" backgroundColor="#2563eb" textColor="#ffffff">Sign In</Button>
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
      <div style={{ minHeight: '360px', backgroundColor: '#ffffff' }}>
        <NavigationMenu
          design="outline"
          style={{ position: 'relative' }}
          logo={<MitoBrandLogo accent="#2563eb" />}
          navItems={buildNavItems(activeRoute)}
          menuVisibility="sticky"
          onNavigate={(href, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Inter, system-ui, sans-serif"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Clean flat surface with a crisp 1px bottom border. Ideal for documentation portals and minimalist SaaS dashboards.',
      },
      source: {
        code: `import { NavigationMenu } from '@emeraldemperaur/mito-ui';

export const OutlineNav = () => (
  <NavigationMenu
    design="outline"
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
// 3. DESIGN VARIANT: MATERIAL
// ---------------------------------------------------------------------------
export const MaterialVariant: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/telemetry');
    return (
      <div style={{ minHeight: '360px', backgroundColor: '#f1f5f9' }}>
        <NavigationMenu
          design="material"
          style={{ position: 'relative' }}
          logo={<MitoBrandLogo accent="#0ea5e9" />}
          activeColor="#0ea5e9"
          menuVisibility="sticky"
          navItems={buildNavItems(activeRoute)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Inter, system-ui, sans-serif"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Elevated surface with soft ambient drop shadows separating the navigation bar from scrolling content.',
      },
      source: {
        code: `import { NavigationMenu } from '@emeraldemperaur/mito-ui';

export const MaterialNav = () => (
  <NavigationMenu
    design="material"
    activeColor="#0ea5e9"
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
// 4. DESIGN VARIANT: NEUMORPHIC
// ---------------------------------------------------------------------------
export const NeumorphicVariant: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/telemetry');
    return (
      <div style={{ minHeight: '380px', backgroundColor: '#e2e8f0' }}>
        <NavigationMenu
          design="neumorphic"
          backgroundColor="#e2e8f0"
          elevation={6}
          neuIntensity={1.1}
          lightSource="top-left"
          style={{ position: 'relative' }}
          menuVisibility="sticky"
          logo={<MitoBrandLogo accent="#2563eb" />}
          navItems={buildNavItems(activeRoute)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Raleway, sans-serif"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Soft 3D extruded surface dynamically calibrated to its parent background color (`#e2e8f0`), extending seamlessly into the dropdown panels.',
      },
      source: {
        code: `import { NavigationMenu } from '@emeraldemperaur/mito-ui';

export const NeumorphicNav = () => (
  <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh' }}>
    <NavigationMenu
      design="neumorphic"
      backgroundColor="#e2e8f0"
      elevation={6}
      menuVisibility="sticky"
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
    const [activeRoute, setActiveRoute] = useState('/pricing');
    return (
      <div style={{ minHeight: '380px', backgroundColor: '#e2e8f0' }}>
        <NavigationMenu
          design="skeuomorphic"
          backgroundColor="#e2e8f0"
          elevation={5}
          menuVisibility="sticky"
          style={{ position: 'relative' }}
          logo={<MitoBrandLogo accent="#f59e0b" />}
          activeColor="#d97706"
          navItems={buildNavItems(activeRoute)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          fontFamily="Libre Franklin, sans-serif"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tactile, beveled 3D hardware-inspired bar with top-to-bottom directional lighting gradients and subtle inner rim highlights.',
      },
      source: {
        code: `import { NavigationMenu } from '@emeraldemperaur/mito-ui';

export const SkeuomorphicNav = () => (
  <NavigationMenu
    design="skeuomorphic"
    backgroundColor="#e2e8f0"
    activeColor="#d97706"
    elevation={5}
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
// 6. TRUEGLASS DARK SHOWCASE (AUTO-HIDE-REAPPEAR & NESTED SUBMENUS)
// ---------------------------------------------------------------------------
export const TrueGlassDarkShowcase: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/telemetry');

    return (
      <div
        style={{
          minHeight: '440px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: '#f8fafc',
        }}
      >
        <NavigationMenu
          design="skeuomorphic"
          trueGlass
          darkMode
          menuVisibility="auto-hide-reappear"
          scrollReappearDelay={450}
          activeColor="#38bdf8"
          style={{ position: 'relative' }}
          logo={<MitoBrandLogo accent="#38bdf8" />}
          logoPosition="left"
          navItems={buildNavItems(activeRoute)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          actionsNode={
            <>
              <ActionButton
                design="outline"
                trueGlass
                tactile
                darkMode
                title="GitHub Repository"
                onClick={() => window.open('https://github.com', '_blank')}
                icon={<Icon name="github" width="16" height="16" />}
              />
              <Button
                variant="outline"
                darkMode
                darkTextColor="#ffffff"
                textColor="#ffffff"
                hoverTextColor="#000000"
                darkHoverTextColor="#000000"
                onClick={() => alert('Sign In Triggered')}
              >
                Sign In
              </Button>
            </>
          }
        />
        <div style={{ padding: '48px 2.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Active Route: {activeRoute}</h3>
          <p style={{ margin: 0, opacity: 0.75 }}>
            Showcases glossy <code>trueGlass</code> frosted surfaces across the bar, multi-column dropdowns, and nested flyout sub-menus.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Enterprise dark-mode glassmorphism combining `design="skeuomorphic"`, `trueGlass`, `darkMode`, `menuVisibility="auto-hide-reappear"`, nested `subItems`, and composite `actionsNode`.',
      },
      source: {
        code: `import React, { useState } from 'react';
import { NavigationMenu, ActionButton, Button, Icon } from '@emeraldemperaur/mito-ui';

export const TrueGlassNavigation = () => {
  const [activeRoute, setActiveRoute] = useState('/telemetry');

  return (
    <div style={{ minHeight: '160vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#f8fafc' }}>
      <NavigationMenu
        design="skeuomorphic"
        trueGlass
        darkMode
        menuVisibility="auto-hide-reappear"
        scrollReappearDelay={450}
        activeColor="#38bdf8"
        logo={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <Icon name="rocket" width="22" height="22" color="#38bdf8" />
            <span>MITO UI</span>
          </div>
        }
        logoPosition="left"
        navItems={navItems}
        onNavigate={(href, e) => {
          e.preventDefault();
          setActiveRoute(href);
        }}
        actionsNode={
          <>
            <ActionButton
              design="outline"
              trueGlass
              tactile
              darkMode
              title="GitHub Repository"
              onClick={() => window.open('https://github.com', '_blank')}
              icon={<Icon name="githublogo" width="16" height="16" />}
            />
            <Button variant="outline" darkMode backgroundColor="#2563eb" textColor="#ffffff">
              Sign In
            </Button>
          </>
        }
      />
    </div>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 7. RIGHT-ALIGNED LOGO & RIGHT ACTIONS ARRAY
// ---------------------------------------------------------------------------
export const RightAlignedLogoAndActions: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('/');

    return (
      <div style={{ minHeight: '360px', backgroundColor: '#f8fafc' }}>
        <NavigationMenu
          design="outline"
          logoPosition="right"
          menuVisibility='sticky'
          logoWidth="130px"
          logoHeight="36px"
          style={{ position: 'relative' }}
          logo={<AltMitoBrandLogo accent="#023020" />}
          activeColor="#023020"
          navItems={buildNavItems(activeRoute)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActiveRoute(href);
          }}
          rightActions={[
            <ActionButton
              key="gh"
              design="outline"
              tactile
              title="GitHub"
              icon={<Icon name="github" width="16" height="16" />}
            />,
            <Button key="cta" variant="material" backgroundColor="#023020" darkBackgroundColor="#023020" 
            darkTextColor='#ffffff' textColor="#ffffff">
              Get Started
            </Button>,
          ]}
          fontFamily="Raleway, system-ui, sans-serif"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates `logoPosition="right"`, explicit `logoWidth`/`logoHeight` constraints, and passing an array of nodes via `rightActions`.',
      },
      source: {
        code: `import { NavigationMenu, ActionButton, Button, Icon } from '@emeraldemperaur/mito-ui';

export const RightLogoNav = () => (
  <NavigationMenu
    design="outline"
    logoPosition="right"
    logoWidth="130px"
    logoHeight="36px"
    activeColor="#023020"
    logo={<span>MITO UI</span>}
    fontFamily="Raleway, system-ui, sans-serif"
    navItems={navItems}
    rightActions={[
      <ActionButton key="gh" design="outline" tactile icon={<Icon name="githublogo" width="16" height="16" />} />,
      <Button key="cta" variant="material" backgroundColor="#023020" textColor="#ffffff" 
      darkBackgroundColor="#023020" darkTextColor='#ffffff'>Get Started</Button>,
    ]}
  />
);`,
      },
    },
  },
};