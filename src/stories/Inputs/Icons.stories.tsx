import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, type DynamicIconProps, type IconName } from '../../components/icons/Icons';

const ALL_ICONS: IconName[] = [
  'sun', 'moon', 'settings', 'user', 'cube', 'heart', 'backpack', 'questionmark', 'questionmarkcircled',
  'checkcircled', 'check', 'chat', 'enter', 'exit', 'calendar', 'camera', 'star', 'starfilled', 'code',
  'plus', 'pluscircled', 'minus', 'minuscircled', 'codesandbox', 'cardstack', 'cardstackminus', 'cardstackplus',
  'stack', 'layers', 'input', 'search', 'cancel', 'close', 'crosshair', 'github', 'instagram', 'twitter',
  'linkedin', 'file', 'filetext', 'home', 'delete', 'bell', 'switch', 'caretup', 'caretdown', 'caretleft',
  'caretright', 'caretsort', 'chevronup', 'chevrondown', 'chevronleft', 'chevronright', 'doublearrowup',
  'doublearrowdown', 'doublearrowleft', 'doublearrowright', 'notallowed', 'infocircled', 'envelopeopen',
  'envelopeclosed', 'paperplane', 'lockclosed', 'lockopen', 'slider', 'refresh', 'fontsize', 'cursorarrow',
  'cursortext', 'reset', 'clock', 'idcard', 'history', 'hamburgermenu', 'elipsishorizontal', 'elipsisvertical',
  'share', 'share2', 'download', 'upload', 'image', 'externallink', 'hyperlink', 'scissors', 'keyboard',
  'eyeopen', 'eyeclosed', 'avatar', 'dashboard', 'table', 'listbullet', 'activitylog', 'barchart', 'piechart',
  'dropdown', 'checkbox', 'quote', 'globe', 'rocket', 'bookmark', 'bookmarkfilled', 'pin', 'pinfilled',
  'reader', 'tokens', 'zoomin', 'zoomout', 'mixerhorizontal', 'mixervertical', 'mix', 'archive', 'crumpledpaper',
  'stopwatch', 'laptimer', 'clipboard', 'clipboardcopy', 'desktop', 'laptop', 'mobile', 'enterfullscreen',
  'exitfullscreen', 'copy', 'face', 'fontfamily', 'video', 'shuffle', 'loop', 'heading', 'error', 'play',
  'resume', 'pause', 'stop', 'trackprevious', 'tracknext', 'transform', 'speakerloud', 'speakermoderate',
  'speakerquiet', 'speakeroff', 'timer', 'fileplus', 'fileminus', 'lightningbolt', 'rulerhorizontal', 'reload',
  'rulersquare', 'rotatecounterclockwise', 'radiobutton', 'rowspacing', 'rows', 'accessibility', 'angle',
  'arrowbottomleft', 'arrowbottomright', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'arrowtopleft',
  'arrowtopright', 'link1', 'linkbreak1', 'linkbreak2', 'linknone1', 'linknone2', 'crosshair1', 'aspectratio',
  'allsides', 'alignleft', 'alignright', 'aligntop', 'alignbottom', 'pinleft', 'pinright', 'pintop', 'pinbottom',
  'pilcrow', 'badge', 'blendingmode', 'button', 'move', 'lockopen1', 'figma', 'framer', 'modulz', 'notion',
  'sketch', 'vercel', 'discord', 'iconjar', 'stitches', 'lettercasetoggle', 'lineheight', 'letterspacing',
  'layout', 'lettercasecapitalize', 'lettercaselowercase', 'lettercaseuppercase', 'box', 'boxmodel',
  'openinnewwindow', 'opacity', 'colorwheel', 'columns', 'circle', 'crop', 'countdowntimer', 'cookie', 'margin',
  'magicwand', 'maskoff', 'maskon', 'transparencygrid', 'target', 'triangleleft', 'triangleright', 'triangleup',
  'triangledown', 'text', 'eraser', 'fontstyle', 'sewingpinfilled', 'sewingpin'
];

/**
 * Enterprise universal icon primitive. Dynamically resolves robust semantic design tokens directly to optimized `15x15` Radix UI SVG components.
 * 
 * Heavily memoized via `React.memo` to guarantee zero redundant re-renders when mapping massive data tables, sidebars, or dense UI matrices.
 */
const meta: Meta<DynamicIconProps> = {
  title: 'Information/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      story: { inline: true },
      description: {
        component: 'Injects crisp, accessible SVGs globally by passing a semantic `IconName` string key. Transparently forwards all native SVG DOM attributes (`width`, `height`, `color`, `className`, `aria-label`, etc.) down to the underlying `svg` element.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: ALL_ICONS,
      description: 'The exact registered string key mapped to the target SVG component in the master `iconMap` registry.',
      table: { 
        category: 'Core', 
        type: { summary: 'IconName' }
      },
    },
    width: {
      control: 'text',
      description: 'Overrides the standard SVG width attribute. Native Radix elements default to `15`.',
      table: { category: 'Dimensions', type: { summary: 'string | number' } },
    },
    height: {
      control: 'text',
      description: 'Overrides the standard SVG height attribute. Native Radix elements default to `15`.',
      table: { category: 'Dimensions', type: { summary: 'string | number' } },
    },
    color: {
      control: 'color',
      description: 'Injects a hardcoded CSS color. When omitted, SVGs flawlessly inherit the nearest text color context via CSS `currentColor`.',
      table: { category: 'Styling', type: { summary: 'string' } },
    },
    className: {
      control: 'text',
      description: 'Standard CSS class name appended directly to the `<svg>` node.',
      table: { category: 'Styling', type: { summary: 'string' } },
    },
    style: {
      control: 'object',
      description: 'Inline React styles applied directly to the `<svg>` node.',
      table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
    },
  },
  args: {
    name: 'dashboard',
    width: '24',
    height: '24',
  },
};

export default meta;
type Story = StoryObj<DynamicIconProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------

export const InteractivePlayground: Story = {
  args: {
    name: 'rocket',
    width: '48',
    height: '48',
    color: '#3b82f6',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the Controls table below to interactively swap between all registered `IconName` values and test physical dimensions or color injections.',
      },
      source: {
        code: `import { Icon } from '@emeraldemperaur/mito-ui';

<Icon name="rocket" width="48" height="48" color="#3b82f6" />`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. CONTEXTUAL COLOR INHERITANCE
// ---------------------------------------------------------------------------

export const InheritingCurrentColor: Story = {
  render: (args) => (
    <div style={{ 
      color: '#10b981', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      fontSize: '20px', 
      fontWeight: 600,
      padding: '16px 24px',
      backgroundColor: '#ecfdf5',
      border: '1px solid #a7f3d0',
      borderRadius: '8px'
    }}>
      <Icon {...args} />
      <span>Systems Operational</span>
    </div>
  ),
  args: {
    name: 'checkcircled',
    width: '24',
    height: '24',
  },
  parameters: {
    docs: {
      description: {
        story: 'When the `color` prop is deliberately omitted, the SVG utilizes native CSS `currentColor`. This allows icons to automatically match the text color of hover states, active tabs, or colored alert banners without requiring prop drill updates.',
      },
      source: {
        code: `import { Icon } from '@emeraldemperaur/mito-ui';

{/* The icon automatically turns Emerald Green to match the parent text */}
<div style={{ color: '#10b981' }}>
  <Icon name="checkcircled" width="24" height="24" />
  <span>Systems Operational</span>
</div>`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 3. ACTION BAR INTEGRATION
// ---------------------------------------------------------------------------

export const InteractiveActionBar: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <button 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.backgroundColor = '#eff6ff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
          title="Settings"
          aria-label="Settings"
        >
          <Icon name="settings" width="20" height="20" />
        </button>

        <button 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.backgroundColor = '#ecfdf5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
          title="Export CSV"
          aria-label="Export CSV"
        >
          <Icon name="download" width="20" height="20" />
        </button>

        <button 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
          title="Delete Workspace"
          aria-label="Delete Workspace"
        >
          <Icon name="delete" width="20" height="20" />
        </button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Combining `Icon` components with standard HTML buttons creates highly accessible, hover-reactive action strips perfectly suited for tables and headers.',
      },
      source: {
        code: `import { Icon } from '@emeraldemperaur/mito-ui';

export const ActionBar = () => (
  <div className="action-bar flex gap-3">
    <button aria-label="Settings" className="icon-btn hover:text-blue-600">
      <Icon name="settings" width="20" height="20" />
    </button>

    <button aria-label="Export" className="icon-btn hover:text-green-600">
      <Icon name="download" width="20" height="20" />
    </button>

    <button aria-label="Delete" className="icon-btn hover:text-red-600">
      <Icon name="delete" width="20" height="20" />
    </button>
  </div>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 4. SEMANTIC DATA MAPPING
// ---------------------------------------------------------------------------

export const SemanticDataMapping: Story = {
  render: () => {
    const NAVIGATION_DATA: { id: string; label: string; token: IconName }[] = [
      { id: 'home', label: 'Overview Dashboard', token: 'dashboard' },
      { id: 'team', label: 'Team Directory', token: 'avatar' },
      { id: 'billing', label: 'Billing & Invoices', token: 'cardstack' },
      { id: 'logs', label: 'System Audit Logs', token: 'activitylog' },
      { id: 'security', label: 'Security & Auth', token: 'lockclosed' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '320px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        {NAVIGATION_DATA.map((item) => (
          <div 
            key={item.id} 
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', color: '#475569' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#475569'; }}
          >
            <Icon name={item.token} width="18" height="18" style={{ opacity: 0.8 }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Because the component requires a strict string token (`IconName`), it is extraordinarily effective at hydrating JSON configurations, API payloads, or array maps into rich visual interfaces dynamically.',
      },
      source: {
        code: `import { Icon, type IconName } from '@emeraldemperaur/mito-ui';

// Type-safe JSON routing configuration
const NAVIGATION_DATA: { id: string; label: string; token: IconName }[] = [
  { id: 'home', label: 'Overview Dashboard', token: 'dashboard' },
  { id: 'team', label: 'Team Directory', token: 'avatar' },
  { id: 'billing', label: 'Billing & Invoices', token: 'cardstack' },
];

export const MappedSidebar = () => (
  <div className="sidebar-menu">
    {NAVIGATION_DATA.map((item) => (
      <div key={item.id} className="menu-row flex items-center gap-4">
        <Icon name={item.token} width="18" height="18" />
        <span className="font-medium">{item.label}</span>
      </div>
    ))}
  </div>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 5. MASTER ICON GALLERY
// ---------------------------------------------------------------------------

export const MasterIconGallery: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredIcons = ALL_ICONS.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#ffffff', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
            <Icon name="search" width="20" height="20" color="#64748b" />
            <input 
              type="text" 
              placeholder="Search registry tokens (e.g. 'lock', 'arrow', 'chart')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: '#0f172a', width: '100%' }}
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {filteredIcons.map(iconName => (
            <div 
              key={iconName} 
              title={iconName}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '12px', 
                padding: '24px 16px', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
              onClick={() => {
                navigator.clipboard.writeText(`name="${iconName}"`);
                alert(`Copied prop: name="${iconName}"`);
              }}
            >
              <Icon name={iconName} width="28" height="28" color="#334155" />
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', textAlign: 'center', wordBreak: 'break-all' }}>
                {iconName}
              </span>
            </div>
          ))}
          
          {filteredIcons.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
              No icons match the search token.
            </div>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    // Override the 'centered' layout from the meta block to allow the grid to stretch to 100% width
    layout: 'padded',
    docs: {
      story: { iframeHeight: 600 },
      description: {
        story: 'A complete reference gallery of all available `IconName` tokens synchronized with the `iconMap` registry. Click on any tile to instantly copy the `name` prop to your clipboard.',
      },
      source: {
        code: `// Reference the gallery above for all valid string tokens.`,
      },
    },
  },
};