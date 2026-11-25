import React, { useState, useMemo, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SearchRibbon,
  type SearchRibbonProps,
  type FilterOption,
} from './SearchRibbon';
import { ActionButton } from '../Buttons/ActionButton'; 
import { Button } from '../Buttons/Button';            
import '../../styles/fonts.scss';


interface TelemetryRecord {
  id: string;
  name: string;
  category: 'uav' | 'orbital' | 'ground';
  status: string;
}

const mockRecords: TelemetryRecord[] = [
  { id: 'UAV-01', name: 'Predator Alpha Recon', category: 'uav', status: 'Active' },
  { id: 'UAV-02', name: 'Reaper Beta Intercept', category: 'uav', status: 'Engaged' },
  { id: 'ORB-01', name: 'Ares V Mars Transit', category: 'orbital', status: 'In Transit' },
  { id: 'ORB-02', name: 'Lunar Gateway South', category: 'orbital', status: 'Docked' },
  { id: 'ORB-03', name: 'Europa Clipper Probe', category: 'orbital', status: 'Orbiting' },
  { id: 'GND-01', name: 'Bipedal Recon A44', category: 'ground', status: 'Patrol' },
  { id: 'GND-02', name: 'Heavy Lifter B99', category: 'ground', status: 'Charging' },
];

const fleetFilterOptions: FilterOption[] = [
  { label: 'All Divisions', value: '' },
  { label: 'UAV Drones', value: 'uav' },
  { label: 'Orbital Vessels', value: 'orbital' },
  { label: 'Ground Robotics', value: 'ground' },
];

const IconRefresh = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconExport = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);


export interface SearchRibbonStoryProps extends SearchRibbonProps {
  brandLightColor?: string;
  brandDarkColor?: string;
}

const meta: Meta<SearchRibbonStoryProps> = {
  title: 'Data/SearchRibbon',
  component: SearchRibbon as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      story: { inline: true },
      description: {
        component:
          'Master enterprise composite toolbar designed to sit above DataTables or lists. Orchestrates text search, categorical filtering, injected action buttons, animated record counters, and optional footer/pagination slots across Outline, Material, Neumorphic, and Skeuomorphic variants.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // DATA & SEARCH CONTROLS
    // ----------------------------------------------------------------------
    recordCount: {
      control: { type: 'number', min: 0 },
      description: 'The numeric total representing the number of currently found/active records.',
      table: { category: 'Data & Search', type: { summary: 'number' } },
    },
    recordLabel: {
      control: 'text',
      description: "Text appended next to the record count. Automatically strips trailing 's' when count is 1.",
      table: { category: 'Data & Search', defaultValue: { summary: "'Records'" }, type: { summary: 'string' } },
    },
    recordSuffix: {
      control: 'text',
      description: 'Trailing suffix text rendered after the record label.',
      table: { category: 'Data & Search', defaultValue: { summary: "'Found'" }, type: { summary: 'string' } },
    },
    animateCount: {
      control: 'boolean',
      description: 'Enables the incremental count-up animation for the record count using `NumberCounter`.',
      table: { category: 'Data & Search', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    countAnimationDuration: {
      control: { type: 'number', min: 100, max: 5000, step: 100 },
      description: 'Duration in milliseconds for the incremental counter animation.',
      table: { category: 'Data & Search', defaultValue: { summary: '1200' }, type: { summary: 'number' } },
    },
    searchTerm: {
      control: 'text',
      description: 'The controlled value of the primary search input field.',
      table: { category: 'Data & Search', defaultValue: { summary: "''" }, type: { summary: 'string' } },
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the search input field.',
      table: { category: 'Data & Search', defaultValue: { summary: "'Search...'" }, type: { summary: 'string' } },
    },
    onSearchChange: {
      control: false,
      description: 'Callback triggered continuously as the user types into the search field.',
      table: { category: 'Data & Search', type: { summary: '(value: string) => void' } },
    },
    selectedFilter: {
      control: 'text',
      description: 'The programmatic value of the currently selected filter from the dropdown.',
      table: { category: 'Data & Search', defaultValue: { summary: "''" }, type: { summary: 'string' } },
    },
    onFilterChange: {
      control: false,
      description: 'Callback triggered when the user alters the select filter category.',
      table: { category: 'Data & Search', type: { summary: '(value: string) => void' } },
    },
    filterOptions: {
      control: false,
      description: 'Array of category objects populating the dropdown. Expected properties per item: `label` and `value`.',
      table: { category: 'Data & Search', type: { summary: 'FilterOption[]' } },
    },

    // ----------------------------------------------------------------------
    // COMPOSITE & LAYOUT CONTROLS
    // ----------------------------------------------------------------------
    actionsNode: {
      control: false,
      description: 'Injects custom buttons or `ActionButton` nodes cleanly positioned to the right of the search/filter group.',
      table: { category: 'Composite & Layout', type: { summary: 'ReactNode' } },
    },
    footerNode: {
      control: false,
      description: 'Optional footer slot (e.g., custom pagination bar or active filter chips) rendered beneath the main ribbon bar.',
      table: { category: 'Composite & Layout', type: { summary: 'ReactNode' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands the SearchRibbon to span 100% page width with enterprise-grade padding and 0px border radius.',
      table: { category: 'Composite & Layout', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    borderRadius: {
      control: 'text',
      description: 'Explicit override for the container border radius (ignored when `fullWidth` is true).',
      table: { category: 'Composite & Layout', defaultValue: { summary: "'12px'" }, type: { summary: 'string | number' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Delegates rendering to the immediate child element via Radix Slot.',
      table: { category: 'Composite & Layout', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },

    // ----------------------------------------------------------------------
    // AESTHETIC & DESIGN CONTROLS
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'The architectural design system variation dictating the visual styling.',
      table: { category: 'Design Architecture', defaultValue: { summary: "'outline'" }, type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" } },
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles an enterprise-grade realistic translucent glassmorphism aesthetic across all design variants.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    fontFamily: {
      control: 'text',
      description: 'Custom CSS font-family string applied to all ribbon text.',
      table: { category: 'Typography', defaultValue: { summary: '"Bodoni Moda Variable", -apple-system, sans-serif' }, type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // 3D EXTRUSION (NEU/SKEUO)
    // ----------------------------------------------------------------------
    elevation: {
      control: { type: 'range', min: 1, max: 16, step: 1 },
      description: 'Neumorphic/Skeuomorphic 3D extrusion distance in pixels.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '4' }, type: { summary: 'number' } },
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '1' }, type: { summary: 'number' } },
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Global lighting angle that dictates the X and Y shadow trajectories.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: "'top-left'" }, type: { summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'" } },
    },

    // ----------------------------------------------------------------------
    // THEMING: GLOBAL
    // ----------------------------------------------------------------------
    darkMode: {
      control: 'boolean',
      description: 'Force dark mode rendering independent of the global context.',
      table: { category: 'Theming: Global', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } },
    },
    darkModeColors: {
      control: false,
      description: 'Dynamic light/dark mode brand colors injected into the CSS variables to override global context.',
      table: { category: 'Theming: Global', type: { summary: '{ light: string; dark: string }' } },
    },
    brandLightColor: {
      name: 'darkModeColors.light',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.light` for focus/brand highlights.',
      table: { category: 'Theming: Global', type: { summary: 'string' } },
    },
    brandDarkColor: {
      name: 'darkModeColors.dark',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.dark` for focus/brand highlights.',
      table: { category: 'Theming: Global', type: { summary: 'string' } },
    },

    // ----------------------------------------------------------------------
    // GRANULAR COLOR OVERRIDES: LIGHT MODE
    // ----------------------------------------------------------------------
    backgroundColor: { control: 'color', description: 'Explicit container background color override for light mode.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    textColor: { control: 'color', description: 'Explicit global text color override for light mode.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    recordCountColor: { control: 'color', description: 'Explicit override for the numeric record count color in light mode.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    recordLabelColor: { control: 'color', description: "Explicit override for the 'Records Found' label text color in light mode.", table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    inputTextColor: { control: 'color', description: 'Explicit override for the search input text color in light mode.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    dropdownTextColor: { control: 'color', description: 'Explicit override for the filter dropdown text color in light mode.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },

    // ----------------------------------------------------------------------
    // GRANULAR COLOR OVERRIDES: DARK MODE
    // ----------------------------------------------------------------------
    darkBackgroundColor: { control: 'color', description: 'Explicit container background color override for dark mode.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },
    darkTextColor: { control: 'color', description: 'Explicit global text color override for dark mode.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },
    darkRecordCountColor: { control: 'color', description: 'Explicit override for the numeric record count color in dark mode.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },
    darkRecordLabelColor: { control: 'color', description: "Explicit override for the 'Records Found' label text color in dark mode.", table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },
    darkInputTextColor: { control: 'color', description: 'Explicit override for the search input text color in dark mode.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },
    darkDropdownTextColor: { control: 'color', description: 'Explicit override for the filter dropdown text color in dark mode.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },

    // ----------------------------------------------------------------------
    // UNIVERSAL ATTRIBUTES
    // ----------------------------------------------------------------------
    className: { control: 'text', description: 'Standard CSS class name appended directly to the root container.', table: { category: 'Universal Attributes', type: { summary: 'string' } } },
    style: { control: 'object', description: 'Inline CSS style overrides applied to the root container.', table: { category: 'Universal Attributes', type: { summary: 'React.CSSProperties' } } },
  },
  args: {
    recordCount: 7,
    recordLabel: 'Units',
    recordSuffix: 'Found',
    animateCount: false,
    countAnimationDuration: 1200,
    searchPlaceholder: 'Search fleet units...',
    design: 'outline',
    trueGlass: false,
    fullWidth: false,
    borderRadius: '12px',
    darkMode: false,
    elevation: 4,
    neuIntensity: 1,
    lightSource: 'top-left',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};

export default meta;
type Story = StoryObj<SearchRibbonStoryProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: ({ brandLightColor, brandDarkColor, ...args }) => {
    const [searchTerm, setSearchTerm] = useState(args.searchTerm || '');
    const [selectedFilter, setSelectedFilter] = useState(args.selectedFilter || '');

    useEffect(() => {
      setSearchTerm(args.searchTerm || '');
    }, [args.searchTerm]);

    useEffect(() => {
      setSelectedFilter(args.selectedFilter || '');
    }, [args.selectedFilter]);

    const filteredRecords = useMemo(() => {
      return mockRecords.filter((rec) => {
        const matchesFilter = !selectedFilter || rec.category === selectedFilter;
        const matchesSearch =
          !searchTerm ||
          rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
      });
    }, [searchTerm, selectedFilter]);

    const isFiltering = Boolean(searchTerm || selectedFilter);
    const activeRecordCount = isFiltering ? filteredRecords.length : args.recordCount;

    return (
      <div
        style={{
          padding: '32px',
          backgroundColor: args.darkMode ? '#0f172a' : '#f8fafc',
          borderRadius: '16px',
        }}
      >
        <SearchRibbon
          {...args}
          recordCount={activeRecordCount}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          filterOptions={fleetFilterOptions}
          darkModeColors={
            brandLightColor || brandDarkColor
              ? { light: brandLightColor || '#2563eb', dark: brandDarkColor || '#60a5fa' }
              : undefined
          }
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground wired to a live mock dataset. Type in the search box or switch categories to see the `recordCount` update dynamically (including automatic singular/plural handling when count hits 1).',
      },
      source: {
        code: `import React, { useState, useMemo } from 'react';
import { SearchRibbon, type FilterOption } from '@emeraldemperaur/mito-ui';

const filterOptions: FilterOption[] = [
  { label: 'All Divisions', value: '' },
  { label: 'UAV Drones', value: 'uav' },
  { label: 'Orbital Vessels', value: 'orbital' },
  { label: 'Ground Robotics', value: 'ground' },
];

export const FleetSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const filtered = useMemo(() => {
    return records.filter((r) =>
      (!selectedFilter || r.category === selectedFilter) &&
      (!searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, selectedFilter]);

  return (
    <SearchRibbon
      recordCount={filtered.length}
      recordLabel="Units"
      recordSuffix="Found"
      searchTerm={searchTerm}
      searchPlaceholder="Search fleet units..."
      onSearchChange={setSearchTerm}
      selectedFilter={selectedFilter}
      onFilterChange={setSelectedFilter}
      filterOptions={filterOptions}
      design="outline"
    />
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. ARCHITECTURAL VARIANTS
// ---------------------------------------------------------------------------
export const ArchitecturalVariants: Story = {
  render: () => {
    const [term, setTerm] = useState('');
    const [filter, setFilter] = useState('');

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          padding: '36px',
          backgroundColor: '#e2e8f0',
          borderRadius: '16px',
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 10px 0', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>Outline</h4>
          <SearchRibbon
            design="outline"
            recordCount={142}
            searchTerm={term}
            onSearchChange={setTerm}
            selectedFilter={filter}
            onFilterChange={setFilter}
            filterOptions={fleetFilterOptions}
            fontFamily="Inter, sans-serif"
          />
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>Material</h4>
          <SearchRibbon
            design="material"
            recordCount={142}
            searchTerm={term}
            onSearchChange={setTerm}
            selectedFilter={filter}
            onFilterChange={setFilter}
            filterOptions={fleetFilterOptions}
            fontFamily="Inter, sans-serif"
          />
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>Neumorphic</h4>
          <SearchRibbon
            design="neumorphic"
            recordCount={142}
            searchTerm={term}
            onSearchChange={setTerm}
            selectedFilter={filter}
            onFilterChange={setFilter}
            filterOptions={fleetFilterOptions}
            backgroundColor="#e2e8f0"
            fontFamily="Inter, sans-serif"
          />
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>Skeuomorphic</h4>
          <SearchRibbon
            design="skeuomorphic"
            recordCount={142}
            searchTerm={term}
            onSearchChange={setTerm}
            selectedFilter={filter}
            onFilterChange={setFilter}
            filterOptions={fleetFilterOptions}
            backgroundColor="#e2e8f0"
            fontFamily="Inter, sans-serif"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Showcases all four core design architectures (`outline`, `material`, `neumorphic`, and `skeuomorphic`). Neumorphic and Skeuomorphic automatically compute ambient shadows from the parent background.',
      },
      source: {
        code: `import { SearchRibbon } from '@emeraldemperaur/mito-ui';

export const VariantShowcase = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', background: '#e2e8f0', padding: '36px' }}>
    <SearchRibbon design="outline" recordCount={142} filterOptions={fleetFilterOptions} />
    <SearchRibbon design="material" recordCount={142} filterOptions={fleetFilterOptions} />
    <SearchRibbon design="neumorphic" recordCount={142} filterOptions={fleetFilterOptions} backgroundColor="#e2e8f0" />
    <SearchRibbon design="skeuomorphic" recordCount={142} filterOptions={fleetFilterOptions} backgroundColor="#e2e8f0" />
  </div>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 3. TRUEGLASS OVERLAY
// ---------------------------------------------------------------------------
export const TrueGlassOverlay: Story = {
  render: () => {
    const [term, setTerm] = useState('');
    const [filter, setFilter] = useState('');

    return (
      <div
        style={{
          padding: '40px',
          backgroundImage: 'linear-gradient(135deg, #071945 0%, #06402B 100%)',
          borderRadius: '16px',
        }}
      >
        <SearchRibbon
          design="outline"
          trueGlass={true}
          darkMode={true}
          recordCount={84}
          recordLabel="Signals"
          recordSuffix="Active"
          searchTerm={term}
          onSearchChange={setTerm}
          selectedFilter={filter}
          onFilterChange={setFilter}
          filterOptions={fleetFilterOptions}
          darkTextColor="#ffffff"
          darkRecordCountColor="#34d399"
          darkRecordLabelColor="rgba(255,255,255,0.75)"
          darkInputTextColor="#ffffff"
          darkDropdownTextColor="#ffffff"
          fontFamily="Inter, sans-serif"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Combines `trueGlass={true}` with `darkMode={true}` and granular dark-mode typography tokens (`darkRecordCountColor`, `darkRecordLabelColor`, `darkInputTextColor`) for crisp legibility over rich gradients.',
      },
      source: {
        code: `import { SearchRibbon } from '@emeraldemperaur/mito-ui';

export const GlassSearchRibbon = () => (
  <div style={{ backgroundImage: 'linear-gradient(135deg, #071945 0%, #06402B 100%)', padding: '40px' }}>
    <SearchRibbon
      design="outline"
      trueGlass={true}
      darkMode={true}
      recordCount={84}
      recordLabel="Signals"
      recordSuffix="Active"
      filterOptions={fleetFilterOptions}
      darkTextColor="#ffffff"
      darkRecordCountColor="#34d399"
      darkRecordLabelColor="rgba(255,255,255,0.75)"
      darkInputTextColor="#ffffff"
      darkDropdownTextColor="#ffffff"
    />
  </div>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 4. ANIMATED COUNTER, ACTIONS & FOOTER SLOTS
// ---------------------------------------------------------------------------
export const AnimatedCounterAndSlots: Story = {
  render: () => {
    const [term, setTerm] = useState('');
    const [filter, setFilter] = useState('orbital');
    const [count, setCount] = useState(1284);

    return (
      <div style={{ padding: '32px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
        <SearchRibbon
          design="material"
          recordCount={count}
          recordLabel="Telemetry Logs"
          recordSuffix="Indexed"
          animateCount={true}
          countAnimationDuration={1200}
          recordCountColor="#2563eb"
          searchTerm={term}
          onSearchChange={setTerm}
          selectedFilter={filter}
          onFilterChange={setFilter}
          filterOptions={fleetFilterOptions}
          fontFamily="Inter, sans-serif"
          actionsNode={
            <>
              <ActionButton
                icon={<IconRefresh />}
                design="outline"
                tactile={true}
                title="Refresh Telemetry"
                onClick={() => setCount((c) => c + Math.floor(Math.random() * 50 + 10))}
              />
              <ActionButton
                icon={<IconExport />}
                design="outline"
                tactile={true}
                title="Export CSV"
                onClick={() => alert('Exporting telemetry logs...')}
              />
              <Button variant="material" backgroundColor="#0f172a" textColor="#ffffff">
                New Query
              </Button>
            </>
          }
          footerNode={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontSize: '0.825rem', color: '#64748b' }}>
              <span>
                Active filter: <strong>{filter || 'All Divisions'}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setTerm('');
                  setFilter('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset Filters
              </button>
            </div>
          }
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates `animateCount={true}` powered by `NumberCounter`, alongside composite `actionsNode` (integrating `ActionButton` and `Button`) and a custom `footerNode` for active filter status and quick resets.',
      },
      source: {
        code: `import React, { useState } from 'react';
import { SearchRibbon, ActionButton, Button } from '@emeraldemperaur/mito-ui';

export const CompositeSearchRibbon = () => {
  const [term, setTerm] = useState('');
  const [filter, setFilter] = useState('orbital');
  const [count, setCount] = useState(1284);

  return (
    <SearchRibbon
      design="material"
      recordCount={count}
      recordLabel="Telemetry Logs"
      recordSuffix="Indexed"
      animateCount={true}
      countAnimationDuration={1200}
      recordCountColor="#2563eb"
      searchTerm={term}
      onSearchChange={setTerm}
      selectedFilter={filter}
      onFilterChange={setFilter}
      filterOptions={fleetFilterOptions}
      actionsNode={
        <>
          <ActionButton icon={<RefreshIcon />} tactile={true} onClick={() => setCount((c) => c + 25)} />
          <ActionButton icon={<ExportIcon />} tactile={true} onClick={() => console.log('Export')} />
          <Button variant="material" backgroundColor="#0f172a" textColor="#ffffff">New Query</Button>
        </>
      }
      footerNode={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>Active filter: <strong>{filter || 'All Divisions'}</strong></span>
          <button type="button" onClick={() => { setTerm(''); setFilter(''); }}>Reset Filters</button>
        </div>
      }
    />
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 5. FULL-WIDTH ENTERPRISE TOOLBAR (DARK MODE)
// ---------------------------------------------------------------------------
export const FullWidthEnterpriseBar: Story = {
  render: () => {
    const [term, setTerm] = useState('');
    const [filter, setFilter] = useState('');

    return (
      <SearchRibbon
        fullWidth={true}
        darkMode={true}
        design="outline"
        recordCount={1}
        recordLabel="Alerts"
        recordSuffix="Active"
        darkRecordCountColor="#f87171"
        searchTerm={term}
        onSearchChange={setTerm}
        selectedFilter={filter}
        onFilterChange={setFilter}
        filterOptions={fleetFilterOptions}
        fontFamily="Inter, sans-serif"
      />
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Edge-to-edge `fullWidth={true}` toolbar in dark mode. Also demonstrates automatic singularization (`recordCount={1}` transforms `"Alerts"` into `"Alert"`).',
      },
      source: {
        code: `import { SearchRibbon } from '@emeraldemperaur/mito-ui';

export const FullWidthHeader = () => (
  <SearchRibbon
    fullWidth={true}
    darkMode={true}
    design="outline"
    recordCount={1}
    recordLabel="Alerts"
    recordSuffix="Active"
    darkRecordCountColor="#f87171"
    filterOptions={fleetFilterOptions}
  />
);`,
      },
    },
  },
};