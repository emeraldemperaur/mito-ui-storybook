import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationStrip,
  type NavigationStripProps,
  type NavigationStripItem,
} from './NavigationStrip';
import { ActionButton } from '../Buttons/ActionButton';
import { Button } from '../Buttons/Button';
import { Icon } from '../../components/icons/Icons';
import '../../styles/fonts.scss';
import BlobLogo from './DripLogo';


const buildStripItems = (activePath: string): NavigationStripItem[] => [
  {
    label: 'Home Page',
    href: '#home',
    isActive: activePath === '#home',
  },
  {
    label: 'Platform',
    isActive: activePath.startsWith('#platform'),
    dropdownGroups: [
      {
        title: 'Core Modules',
        items: [
          {
            title: 'VectorSigma Forms',
            description: 'Schema-driven form engines',
            isActive: activePath === '#platform-codice' || activePath === '#platform-codex',
            icon: <Icon name="layers" width="20" height="20" />,
            subItems: [
              {
                title: 'Codice (Linear)',
                description: 'Standard stacked layout',
                href: '#platform-codice',
                isActive: activePath === '#platform-codice',
              },
              {
                title: 'Codex (Wizard)',
                description: 'Step-by-step strict validation',
                href: '#platform-codex',
                isActive: activePath === '#platform-codex',
              },
            ],
          },
          {
            title: 'Telemetry Grid',
            description: 'Enterprise DataTable',
            href: '#platform-telemetry',
            isActive: activePath === '#platform-telemetry',
            icon: <Icon name="dashboard" width="20" height="20" />,
          },
        ],
      },
      {
        title: 'Developer Tools',
        items: [
          {
            title: 'MCP Context Specs',
            description: 'Strict JSDoc schemas for AI agents',
            href: '#platform-mcp',
            isActive: activePath === '#platform-mcp',
            icon: <Icon name="code" width="20" height="20" />,
          },
          {
            title: 'Theme Studio',
            description: 'Ambient 3D token generator',
            href: '#platform-themes',
            isActive: activePath === '#platform-themes',
            icon: <Icon name="mixerhorizontal" width="20" height="20" />,
          },
        ],
      },
    ],
  },
  {
    label: 'Pricing',
    href: '#pricing',
    isActive: activePath === '#pricing',
  },
  {
    label: 'Contact',
    href: '#contact',
    isActive: activePath === '#contact',
  },
];

const MitoLogoLockup = ({ accent = '#3498db' }: { accent?: string }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, letterSpacing: '0.1em' }}>
    <BlobLogo width="33" height="33" color={accent} />
    <span>MITO UI</span>
  </div>
);


export interface NavigationStripStoryProps extends NavigationStripProps {
  brandLightColor?: string;
  brandDarkColor?: string;
}

const meta: Meta<NavigationStripStoryProps> = {
  title: 'Navigation/NavigationStrip',
  component: NavigationStrip as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: true },
      description: {
        component:
          'Enterprise-grade, SSR-safe, router-agnostic navigation strip featuring an animated expanding underline and sibling-dimming hover focus. Supports multi-column dropdowns, nested flyout sub-menus (`subItems`), a strict 9-item cap, 6-position logo placement, top/bottom viewport docking with automatic dropdown inversion, configurable scroll visibility, ambient-aware 3D variants, and glossy `trueGlass` styling.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // NAVIGATION & ROUTING
    // ----------------------------------------------------------------------
    navItems: {
      control: false,
      description: 'Array of top-level `NavigationStripItem` definitions (`label`, `href`, `icon`, `isActive`, `dropdownGroups` with nested `subItems`). Strictly capped at 9 items.',
      table: { category: 'Navigation & Routing', type: { summary: 'NavigationStripItem[]' } },
    },
    activeIndex: {
      control: { type: 'number', min: 0, max: 8, step: 1 },
      description: 'Controlled index of the currently active top-level navigation item. Overrides internal active state when provided.',
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
      description: 'Callback fired whenever any navigation or dropdown link is clicked, receiving the target `href` and mouse event.',
      table: { category: 'Navigation & Routing', type: { summary: '(href: string, e: React.MouseEvent) => void' } },
    },

    // ----------------------------------------------------------------------
    // UNDERLINE & INTERACTION CONTROLS
    // ----------------------------------------------------------------------
    dimSiblingsOnHover: {
      control: 'boolean',
      description: 'Dims non-hovered sibling top-level links on desktop hover to emphasize the focused destination.',
      table: { category: 'Underline & Interaction', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } },
    },
    underlineHeight: {
      control: { type: 'range', min: 1, max: 8, step: 1 },
      description: 'Thickness in pixels of the animated expanding underline bar beneath (or above) each navigation item.',
      table: { category: 'Underline & Interaction', defaultValue: { summary: '2' }, type: { summary: 'number' } },
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
      table: { category: 'Branding & Logo', defaultValue: { summary: ' ' }, type: { summary: 'string | number' } },
    },
    logoPosition: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
      description: 'Controls the vertical row (above or below the navigation strip) and horizontal alignment of the brand logo.',
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
      description: 'Anchors the navigation strip to either the top or bottom of the viewport, automatically inverting scroll-hide animations, underline placement, and dropdown direction.',
      table: {
        category: 'Viewport Docking & Scroll',
        defaultValue: { summary: "'top'" },
        type: { summary: "'top' | 'bottom'" },
      },
    },
    menuVisibility: {
      control: 'select',
      options: ['sticky', 'auto-hide', 'auto-hide-reappear'],
      description: 'Controls how the navigation strip responds to vertical page scrolling.',
      table: {
        category: 'Viewport Docking & Scroll',
        defaultValue: { summary: "'auto-hide'" },
        type: { summary: "'sticky' | 'auto-hide' | 'auto-hide-reappear'" },
      },
    },
    scrollReappearDelay: {
      control: { type: 'number', min: 100, max: 2000, step: 50 },
      description: 'Delay in milliseconds after scrolling stops before the strip reappears when `menuVisibility="auto-hide-reappear"`.',
      table: { category: 'Viewport Docking & Scroll', defaultValue: { summary: '450' }, type: { summary: 'number' } },
    },

    // ----------------------------------------------------------------------
    // DESIGN ARCHITECTURE
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: "The architectural design system variation dictating the strip's surface, borders, and depth.",
      table: {
        category: 'Design Architecture',
        defaultValue: { summary: "'outline'" },
        type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" },
      },
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles a glossy frosted glassmorphism aesthetic across the strip, dropdowns, sub-dropdowns, and mobile drawer.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    dropShadow: {
      control: 'text',
      description: 'Explicit CSS `box-shadow` string to override the default drop shadow of the active design variant.',
      table: { category: 'Design Architecture', type: { summary: 'string' } },
    },
    fontFamily: {
      control: 'text',
      description: 'Custom CSS font-family string applied globally to the navigation strip typography.',
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
      description: 'Explicit active/accent color override applied to the animated underline bar, active routes, and focus rings.',
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
      description: 'Explicit hover text color override for links and triggers in light mode contexts.',
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
      description: 'Optional child nodes injected inside the main row between the navigation list and the trailing actions cluster.',
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
    dimSiblingsOnHover: true,
    underlineHeight: 2,
    design: 'outline',
    trueGlass: false,
    darkMode: false,
    activeColor: '#2563eb',
    logoPosition: 'top-left',
    logoHeight: 28,
    brandHref: '#home',
    pagePosition: 'top',
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
type Story = StoryObj<NavigationStripStoryProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: ({ brandLightColor, brandDarkColor, activeIndex, ...args }) => {
    const [activePath, setActivePath] = useState('#home');
    const [controlledIdx, setControlledIdx] = useState<number | undefined>(activeIndex);

    useEffect(() => {
      setControlledIdx(activeIndex);
    }, [activeIndex]);

    const routeContent = (
      <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif', flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.78 }}>
          Active Route: <strong>{activePath}</strong> — Hover top-level items to test sibling dimming, or open <strong>Platform &rarr; VectorSigma Forms</strong> for nested flyout sub-menus.
        </p>
      </div>
    );

    return (
      <div
        style={{
          minHeight: '380px',
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

        <NavigationStrip
          {...args}
          activeIndex={controlledIdx}
          style={{ position: 'relative', ...args.style }}
          logo={<MitoLogoLockup accent={args.activeColor || (args.darkMode ? '#3498db' : '#2563eb')} />}
          navItems={buildStripItems(activePath)}
          menuVisibility="auto-hide-reappear"
          darkModeColors={
            brandLightColor || brandDarkColor
              ? { light: brandLightColor || '#2563eb', dark: brandDarkColor || '#3498db' }
              : undefined
          }
          onNavigate={(href, e) => {
            e.preventDefault();
            setActivePath(href);
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
                backgroundColor={args.activeColor || '#2563eb'}
                darkBackgroundColor={args.activeColor || '#3498db'}
                textColor="#ffffff"
                darkTextColor="#ffffff"
                onClick={() => alert('Sign In Triggered')}
              >
                Sign In
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
          'Interactive playground exposing all props. Hover over top-level links to experience `dimSiblingsOnHover` and the expanding underline (`underlineHeight`), or open **Platform → VectorSigma Forms** to test nested flyout sub-menus. Note: `position: relative` is applied in Docs previews so stacked stories do not overlap.',
      },
      source: {
        code: `import React, { useState } from 'react';
import { NavigationStrip, ActionButton, Button, Icon, type NavigationStripItem } from '@emeraldemperaur/mito-ui';

export const StandaloneNavigationStripExample = () => {
  const [activePath, setActivePath] = useState('#home');

  const navItems: NavigationStripItem[] = [
    { label: 'Home Page', href: '#home', isActive: activePath === '#home' },
    {
      label: 'Platform',
      isActive: activePath.startsWith('#platform'),
      dropdownGroups: [
        {
          title: 'Core Modules',
          items: [
            {
              title: 'VectorSigma Forms',
              description: 'Schema-driven form engines',
              subItems: [
                { title: 'Codice (Linear)', href: '#platform-codice', isActive: activePath === '#platform-codice' },
                { title: 'Codex (Wizard)', href: '#platform-codex', isActive: activePath === '#platform-codex' },
              ],
            },
            {
              title: 'Telemetry Grid',
              description: 'Enterprise DataTable',
              href: '#platform-telemetry',
              isActive: activePath === '#platform-telemetry',
            },
          ],
        },
      ],
    },
    { label: 'Pricing', href: '#pricing', isActive: activePath === '#pricing' },
    { label: 'Contact', href: '#contact', isActive: activePath === '#contact' },
  ];

  return (
    <NavigationStrip
      design="outline"
      dimSiblingsOnHover={true}
      underlineHeight={2}
      activeColor="#2563eb"
      menuVisibility="auto-hide-reappear"
      logo={<span>MITO UI</span>}
      logoPosition="top-left"
      brandHref="#home"
      navItems={navItems}
      onNavigate={(href, e) => {
        e.preventDefault();
        setActivePath(href);
      }}
      actionsNode={
        <>
          <ActionButton design="outline" tactile icon={<Icon name="githublogo" width="16" height="16" />} />
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
    const [activePath, setActivePath] = useState('#home');
    return (
      <div style={{ minHeight: '360px', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#0f172a' }}>
        <NavigationStrip
          design="outline"
          activeColor="#2563eb"
          menuVisibility="sticky"
          style={{ position: 'relative' }}
          logo={<MitoLogoLockup accent="#2563eb" />}
          navItems={buildStripItems(activePath)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActivePath(href);
          }}
          fontFamily="Inter, system-ui, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75 }}>
            Active Route: <strong>{activePath}</strong> — Clean flat Outline strip with expanding bottom underline.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Clean flat surface with a 1px bottom border and signature center-out expanding underline.',
      },
      source: {
        code: `import { NavigationStrip } from '@emeraldemperaur/mito-ui';

export const OutlineStrip = () => (
  <NavigationStrip
    design="outline"
    activeColor="#2563eb"
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
    const [activePath, setActivePath] = useState('#home');
    return (
      <div style={{ minHeight: '360px', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9', color: '#0f172a' }}>
        <NavigationStrip
          design="material"
          activeColor="#0ea5e9"
          menuVisibility="sticky"
          underlineHeight={3}
          style={{ position: 'relative' }}
          logo={<MitoLogoLockup accent="#0ea5e9" />}
          navItems={buildStripItems(activePath)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActivePath(href);
          }}
          fontFamily="Inter, system-ui, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75 }}>
            Active Route: <strong>{activePath}</strong> — Elevated Material surface with <code>underlineHeight={3}</code>.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Elevated Material surface with soft ambient drop shadows and a 3px animated underline.',
      },
      source: {
        code: `import { NavigationStrip } from '@emeraldemperaur/mito-ui';

export const MaterialStrip = () => (
  <NavigationStrip
    design="material"
    activeColor="#0ea5e9"
    menuVisibility="sticky"
    underlineHeight={3}
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
    const [activePath, setActivePath] = useState('#home');
    return (
      <div style={{ minHeight: '360px', display: 'flex', flexDirection: 'column', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
        <NavigationStrip
          design="neumorphic"
          backgroundColor="#e2e8f0"
          activeColor="#2563eb"
          menuVisibility="sticky"
          elevation={6}
          neuIntensity={1.1}
          lightSource="top-left"
          style={{ position: 'relative' }}
          logo={<MitoLogoLockup accent="#2563eb" />}
          navItems={buildStripItems(activePath)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActivePath(href);
          }}
          fontFamily="Raleway, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75 }}>
            Active Route: <strong>{activePath}</strong> — Soft 3D extruded Neumorphic strip calibrated to <code>#e2e8f0</code>.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft 3D extruded strip dynamically calibrated to its parent background color (`#e2e8f0`), extending into the dropdown panels.',
      },
      source: {
        code: `import { NavigationStrip } from '@emeraldemperaur/mito-ui';

export const NeumorphicStrip = () => (
  <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh' }}>
    <NavigationStrip
      design="neumorphic"
      activeColor="#2563eb"
      menuVisibility="sticky"
      backgroundColor="#e2e8f0"
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
    const [activePath, setActivePath] = useState('#home');
    return (
      <div style={{ minHeight: '360px', display: 'flex', flexDirection: 'column', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
        <NavigationStrip
          design="skeuomorphic"
          backgroundColor="#e2e8f0"
          activeColor="#d97706"
          menuVisibility="sticky"
          elevation={5}
          style={{ position: 'relative' }}
          logo={<MitoLogoLockup accent="#d97706" />}
          navItems={buildStripItems(activePath)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActivePath(href);
          }}
          fontFamily="Libre Franklin, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.75 }}>
            Active Route: <strong>{activePath}</strong> — Tactile beveled 3D Skeuomorphic strip with directional lighting gradients.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tactile, beveled 3D hardware-inspired strip with top-to-bottom directional lighting gradients and inner rim highlights.',
      },
      source: {
        code: `import { NavigationStrip } from '@emeraldemperaur/mito-ui';

export const SkeuomorphicStrip = () => (
  <NavigationStrip
    design="skeuomorphic"
    backgroundColor="#e2e8f0"
    activeColor="#d97706"
    menuVisibility="sticky"
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
// 6. DARK GLASSMORPHIC + NESTED SUB-DROPDOWNS SHOWCASE
// ---------------------------------------------------------------------------
export const DarkGlassmorphicNested: Story = {
  render: () => {
    const [activePath, setActivePath] = useState('#home');
    return (
      <div
        style={{
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: '#f8fafc',
        }}
      >
        <NavigationStrip
          design="skeuomorphic"
          trueGlass
          darkMode
          activeColor="#3498db"
          menuVisibility="auto-hide-reappear"
          logoPosition="top-left"
          logo={<MitoLogoLockup accent="#3498db" />}
          brandHref="#home"
          style={{ position: 'relative' }}
          navItems={buildStripItems(activePath)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActivePath(href);
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
              <Button variant="skeuomorphic" darkMode onClick={() => alert('Sign In')}>
                Sign In
              </Button>
            </>
          }
          fontFamily="Inter, system-ui, sans-serif"
        />
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
            Active Route: <strong>{activePath}</strong> — Dark <code>trueGlass</code> Skeuomorphic strip with nested flyout sub-dropdowns.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dark-mode glassmorphic showcase combining `design="skeuomorphic"`, `trueGlass`, `darkMode`, `menuVisibility="auto-hide-reappear"`, nested `subItems`, and composite `actionsNode`.',
      },
      source: {
        code: `import React, { useState } from 'react';
import { NavigationStrip, ActionButton, Button, Icon, type NavigationStripItem } from '@emeraldemperaur/mito-ui';

export const DarkGlassStrip = () => {
  const [activePath, setActivePath] = useState('#home');

  return (
    <NavigationStrip
      design="skeuomorphic"
      trueGlass
      darkMode
      activeColor="#3498db"
      menuVisibility="auto-hide-reappear"
      logoPosition="top-left"
      logo={<span>MITO UI</span>}
      brandHref="#home"
      navItems={navItems}
      onNavigate={(href, e) => {
        e.preventDefault();
        setActivePath(href);
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
            icon={<Icon name="githublogo" width="16" height="16" />}
          />
          <Button variant="skeuomorphic" darkMode onClick={() => alert('Sign In')}>
            Sign In
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
// 7. BOTTOM-DOCKED STRIP (UPWARD DROPDOWNS & TOP-EDGE UNDERLINE)
// ---------------------------------------------------------------------------
export const BottomDockedStrip: Story = {
  render: () => {
    const [activePath, setActivePath] = useState('#home');
    return (
      <div
        style={{
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
          color: '#f8fafc',
        }}
      >
        <div style={{ padding: '32px 2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.78 }}>
            Active Route: <strong>{activePath}</strong> — Bottom-docked strip automatically flips the expanding underline to the top border and opens dropdowns upward.
          </p>
        </div>

        <NavigationStrip
          design="outline"
          trueGlass
          darkMode
          pagePosition="bottom"
          logoPosition="bottom-center"
          activeColor="#38bdf8"
          menuVisibility="sticky"
          underlineHeight={3}
          logo={<MitoLogoLockup accent="#38bdf8" />}
          style={{ position: 'relative' }}
          navItems={buildStripItems(activePath)}
          onNavigate={(href, e) => {
            e.preventDefault();
            setActivePath(href);
          }}
          fontFamily="Inter, system-ui, sans-serif"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Bottom-docked (`pagePosition="bottom"`) navigation strip. Automatically moves the animated underline to the top edge of the track, opens dropdown panels upward, and anchors the logo via `logoPosition="bottom-center"`.',
      },
      source: {
        code: `import { NavigationStrip } from '@emeraldemperaur/mito-ui';

export const BottomDockedNavigationStrip = () => (
  <NavigationStrip
    design="outline"
    trueGlass
    darkMode
    pagePosition="bottom"
    logoPosition="bottom-center"
    activeColor="#38bdf8"
    menuVisibility="sticky"
    underlineHeight={3}
    logo={<span>MITO UI</span>}
    navItems={navItems}
  />
);`,
      },
    },
  },
};