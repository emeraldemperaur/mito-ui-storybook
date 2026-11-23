import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type DataTableProps, type ColumnDef } from './DataTable';
import { Button } from '../Buttons/Button';
import { Modal } from '../Modal/Modal'; 
import { SelectInput } from '../Inputs/SelectInput';
import '../../styles/fonts.scss';
import { ActionButton } from '../Buttons/ActionButton';

// ---------------------------------------------------------------------------
// TYPES & MOCK DATA: SPACE AERONAUTICS
// ---------------------------------------------------------------------------
interface SpaceMission {
  id: string;
  vessel: string;
  target: string;
  launchDate: string;
  crewSize: number;
  status: 'In Transit' | 'Orbiting' | 'Docked' | 'Aborted';
}

const spaceMissions: SpaceMission[] = [
  { id: 'MSN-091', vessel: 'Ares V', target: 'Mars Alpha Base', launchDate: '2027-04-12', crewSize: 6, status: 'In Transit' },
  { id: 'MSN-092', vessel: 'Europa Clipper', target: 'Jupiter (Europa)', launchDate: '2026-11-05', crewSize: 0, status: 'Orbiting' },
  { id: 'MSN-093', vessel: 'Lunar Gateway', target: 'Moon (South Pole)', launchDate: '2028-02-28', crewSize: 4, status: 'Docked' },
  { id: 'MSN-094', vessel: 'Icarus Solar', target: 'Sun (Low Orbit)', launchDate: '2025-08-15', crewSize: 0, status: 'Aborted' },
  { id: 'MSN-095', vessel: 'Titan Voyager', target: 'Saturn (Titan)', launchDate: '2029-09-10', crewSize: 8, status: 'In Transit' },
  { id: 'MSN-096', vessel: 'Artemis VII', target: 'Moon (Tranquility)', launchDate: '2027-07-22', crewSize: 4, status: 'Docked' },
];

const spaceColumns: ColumnDef<SpaceMission>[] = [
  { header: 'Mission ID', accessor: 'id', sortable: true },
  { header: 'Vessel Class', accessor: 'vessel', sortable: true },
  { header: 'Primary Target', accessor: 'target', sortable: true },
  { header: 'Launch Window', accessor: 'launchDate', sortable: true, align: 'center' },
  { header: 'Crew', accessor: 'crewSize', sortable: true, align: 'center' },
  { 
    header: 'Telemetry Status', 
    accessor: 'status', 
    sortable: true,
    align: 'right',
    render: (row) => {
      const colors = { 
        'In Transit': { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
        'Orbiting': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
        'Docked': { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
        'Aborted': { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
      };
      const theme = colors[row.status];
      return (
        <span style={{ 
          backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`,
          padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap'
        }}>
          {row.status}
        </span>
      );
    } 
  },
];

// ---------------------------------------------------------------------------
// TYPES & MOCK DATA: AI TELEOPERATION ROBOTICS
// ---------------------------------------------------------------------------
interface RoboticsUnit {
  id: string;
  model: string;
  latency: number;
  battery: number;
  location: string;
}

const botData: RoboticsUnit[] = [
  { id: 'UNIT-A44', model: 'Bipedal Recon', latency: 42, battery: 89, location: 'Sector 4G' },
  { id: 'UNIT-B99', model: 'Heavy Lifter', latency: 120, battery: 12, location: 'Sector 7B' },
  { id: 'UNIT-C12', model: 'Drone Scout', latency: 15, battery: 98, location: 'Sector 1A' },
  { id: 'UNIT-D88', model: 'Assault Crawler', latency: 210, battery: 45, location: 'Sector 9F' },
  { id: 'UNIT-E01', model: 'Medical Drone', latency: 8, battery: 100, location: 'Sector 2B' },
];

// ---------------------------------------------------------------------------
// TYPES & MOCK DATA: AVATAR PERSONNEL ROSTER
// ---------------------------------------------------------------------------
interface AgentPersonnel {
  id: string;
  agent: { name: string; avatar: string };
  role: string;
  clearance: string;
  status: 'Active' | 'On Leave' | 'M.I.A.';
}

const personnelData: AgentPersonnel[] = [
  { id: 'OP-001', agent: { name: 'Optimus Prime', avatar: 'https://i.pravatar.cc/150?u=optimus' }, role: 'Commander', clearance: 'Level 9', status: 'Active' },
  { id: 'EL-002', agent: { name: 'Elita One', avatar: 'https://i.pravatar.cc/150?u=elita' }, role: 'Strategist', clearance: 'Level 8', status: 'Active' },
  { id: 'BB-003', agent: { name: 'Bumblebee', avatar: 'https://i.pravatar.cc/150?u=bumblebee' }, role: 'Scout', clearance: 'Level 5', status: 'On Leave' },
  { id: 'JZ-004', agent: { name: 'Jazz', avatar: 'https://i.pravatar.cc/150?u=jazz' }, role: 'Special Ops', clearance: 'Level 7', status: 'M.I.A.' },
];

const personnelColumns: ColumnDef<AgentPersonnel>[] = [
  { header: 'Agent ID', accessor: 'id', sortable: true },
  { 
    header: 'Identity', 
    accessor: 'agent', 
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src={row.agent.avatar} alt={row.agent.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
        <span style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{row.agent.name}</span>
      </div>
    )
  },
  { header: 'Primary Role', accessor: 'role', sortable: true },
  { header: 'Security Clearance', accessor: 'clearance', sortable: true },
  { 
    header: 'Duty Status', 
    accessor: 'status', 
    sortable: true,
    align: 'right',
    render: (row) => {
      const isRed = row.status === 'M.I.A.';
      const isYellow = row.status === 'On Leave';
      return (
        <span style={{ color: isRed ? '#ef4444' : isYellow ? '#f59e0b' : '#10b981', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          {row.status === 'M.I.A.' ? '⚠️ M.I.A.' : row.status}
        </span>
      );
    }
  },
];

export interface DataTableStoryProps extends DataTableProps<any> {
  brandLightColor?: string;
  brandDarkColor?: string;
  initialSortKey?: string;
  initialSortDir?: 'asc' | 'desc';
  pageSizesString?: string;
}

const meta: Meta<DataTableStoryProps> = {
  title: 'Data/DataTable',
  component: DataTable as React.ComponentType<any>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded', 
    docs: {
      story: { inline: true },
      description: {
        component: 'Highly extensible, SSR-safe data grid. Supports complex client-side sorting, pagination, and multi-row selection while rendering flawlessly across Outline, Material, and Neumorphic design languages.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <style>{`
          /* CRITICAL FIX: Resolves the Flexbox min-content blowout causing page-level scrollbars */
          .mito-data-table-container { min-width: 0 !important; }
          .mito-tbl-scroll-wrapper { min-width: 0 !important; }
          
          /* CRITICAL FIX: Ensures Radix Popovers outrank the Modal z-index (9999+) */
          .mito-select-popover { z-index: 99999 !important; }
        `}</style>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    // ----------------------------------------------------------------------
    // CORE DATA
    // ----------------------------------------------------------------------
    darkModeColors: {
      control: false, 
      description: 'Dynamic light/dark mode brand colors injected into the CSS variables to override global context.',
      table: { category: 'Theming: Global', type: { summary: '{ light: string; dark: string }' } }
    },
    initialSort: {
      control: false, 
      description: 'Initial sorting configuration applied immediately upon mounting.',
      table: { category: 'Behavior & Interaction', defaultValue: { summary: 'null' }, type: { summary: 'SortConfig<T> | null' } }
    },
    pageSizeOptions: {
      control: false, 
      description: 'The available steps mapped into the pagination size selector.',
      table: { category: 'Behavior & Interaction', defaultValue: { summary: '[5, 10, 25, 50]' }, type: { summary: 'number[]' } }
    },
    columns: {
      control: false,
      description: 'Array of column definitions. Expected properties per column object: `header`, `accessor`, `render`, `sortable`, `minWidth`, and `align`.',
      table: { category: 'Core Data', type: { summary: 'ColumnDef<T>[]' } }
    },
    data: {
      control: false,
      description: 'The primary array of typed objects to be rendered into the table rows. The keys in these objects must correspond to the `accessor` strings defined in your `columns` array.',
      table: { category: 'Core Data', type: { summary: 'T[]' } }
    },

    // ----------------------------------------------------------------------
    // COMPOSITE INJECTIONS
    // ----------------------------------------------------------------------
    headerNode: {
      control: false,
      description: 'Inject a custom ReactNode above the table as a distinct header panel (e.g., Search bars, filters).',
      table: { category: 'Composite Injections', type: { summary: 'ReactNode' } }
    },
    footerNode: {
      control: false,
      description: 'Inject a custom ReactNode below the table as a distinct footer panel, replacing the default pagination.',
      table: { category: 'Composite Injections', type: { summary: 'ReactNode' } }
    },

    // ----------------------------------------------------------------------
    // BEHAVIOR & INTERACTION CONTROLS
    // ----------------------------------------------------------------------
    selectable: {
      control: 'boolean',
      description: 'Enables row-level checkbox selection. Injects a leading checkbox column.',
      table: { category: 'Behavior & Interaction', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    onSelectionChange: {
      control: false,
      description: 'Callback function triggered whenever the row selection state changes.',
      table: { category: 'Behavior & Interaction', type: { summary: '(selectedRows: T[]) => void' } }
    },
    pagination: {
      control: 'boolean',
      description: 'Enables client-side pagination, breaking data into controlled views and appending a footer navigation block.',
      table: { category: 'Behavior & Interaction', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    defaultPageSize: {
      control: 'number',
      description: 'The default number of records to display per page when pagination is active.',
      table: { category: 'Behavior & Interaction', defaultValue: { summary: '10' }, type: { summary: 'number' } }
    },
    isLoading: {
      control: 'boolean',
      description: 'Toggles the table into a loading state, replacing data rows with a progress indicator or empty state.',
      table: { category: 'Behavior & Interaction', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    loadingData: {
      control: false,
      description: "Override for the default 'Loading data...' empty state text. Accepts any custom ReactNode (like spinners or skeletons).",
      table: { category: 'Behavior & Interaction', defaultValue: { summary: "'Loading data...'" }, type: { summary: 'ReactNode' } }
    },
    
    // Virtual Props mapped to complex objects for superior DX
    initialSortKey: {
      control: 'text',
      description: 'Virtual control mapping to `initialSort.key`. Maps to the column accessor you want sorted on mount.',
      table: { category: 'Behavior & Interaction', type: { summary: 'string' } }
    },
    initialSortDir: {
      control: 'select',
      options: ['asc', 'desc'],
      description: 'Virtual control mapping to `initialSort.direction`. Determines initial chronological or alphabetical order.',
      table: { category: 'Behavior & Interaction', type: { summary: "'asc' | 'desc'" } }
    },
    pageSizesString: {
      control: 'text',
      description: 'Virtual control mapped to `pageSizeOptions`. Pass a comma-separated string (e.g. "5, 10, 25") to dynamically build the pagination array without a raw JSON editor.',
      table: { category: 'Behavior & Interaction', type: { summary: 'string' } }
    },

    // ----------------------------------------------------------------------
    // AESTHETIC & DESIGN CONTROLS
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The architectural design system variation dictating the visual styling.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'material' }, type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" } }
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles an enterprise-grade realistic translucent glassmorphism aesthetic.',
      table: { category: 'Design Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    borderRadius: { 
      control: 'text', 
      description: "Explicit override for the container border radius.",
      table: { category: 'Dimensions', defaultValue: { summary: '16px' }, type: { summary: 'string | number' } } 
    },
    fontFamily: { 
      control: 'text', 
      description: 'Custom CSS font-family string applied globally to the table content.',
      table: { category: 'Typography', defaultValue: { summary: '"Bodoni Moda Variable", -apple-system, sans-serif' }, type: { summary: 'string' } } 
    },

    // ----------------------------------------------------------------------
    // THEMING
    // ----------------------------------------------------------------------
    darkMode: {
      control: 'boolean',
      description: 'Force dark mode rendering independent of the global context.',
      table: { category: 'Theming: Global', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    brandLightColor: {
      name: 'darkModeColors.light',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.light` to inject active selection colors.',
      table: { category: 'Theming: Global', type: { summary: 'string' } }
    },
    brandDarkColor: {
      name: 'darkModeColors.dark',
      control: 'color',
      description: 'Virtual color picker mapped to `darkModeColors.dark` to inject active selection colors.',
      table: { category: 'Theming: Global', type: { summary: 'string' } }
    },
    backgroundColor: { control: 'color', description: 'Explicit background color override for light mode contexts.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    textColor: { control: 'color', description: 'Explicit text color override for light mode contexts.', table: { category: 'Theming: Light Mode', type: { summary: 'string' } } },
    darkBackgroundColor: { control: 'color', description: 'Explicit background color override specifically for dark mode contexts.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },
    darkTextColor: { control: 'color', description: 'Explicit text color override specifically for dark mode contexts.', table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } },

    // ----------------------------------------------------------------------
    // 3D EXTRUSION
    // ----------------------------------------------------------------------
    elevation: {
      control: { type: 'range', min: 1, max: 24, step: 1 },
      description: 'Neumorphic/Skeuomorphic 3D extrusion distance in pixels. Controls shadow spread and offset.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '6' }, type: { summary: 'number' } }
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Opacity multiplier for the Neumorphic shadow intensity to ensure WCAG contrast.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '1' }, type: { summary: 'number' } }
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Global lighting angle that dictates the X and Y shadow trajectories.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: 'top-left' }, type: { summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'" } }
    },

    // ----------------------------------------------------------------------
    // UNIVERSAL ATTRIBUTES
    // ----------------------------------------------------------------------
    className: {
      control: 'text',
      description: 'Standard CSS class name appended directly to the table container element.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } }
    },
    asChild: {
      control: 'boolean',
      description: 'Delegates rendering to the immediate child element via Radix Slot.',
      table: { category: 'Universal Attributes', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
  },
  args: {
    design: 'material',
    selectable: true,
    pagination: true,
    defaultPageSize: 5,
    pageSizesString: '5, 10, 25',
    isLoading: false,
    trueGlass: false,
    darkMode: false,
    borderRadius: '16px',
    elevation: 6,
    neuIntensity: 1,
    lightSource: 'top-left',
    fontFamily: 'Libre Franklin'
  }
};

export default meta;
type Story = StoryObj<DataTableStoryProps>;

// ---------------------------------------------------------------------------
// 1. SPACE AERONAUTICS (PLAYGROUND)
// ---------------------------------------------------------------------------
export const SpaceAeronauticsPlayground: Story = {
  render: ({ brandLightColor, brandDarkColor, initialSortKey, initialSortDir, pageSizesString, ...args }) => {
    // Process virtual props into valid complex objects
    const parsedPageSizes = pageSizesString ? pageSizesString.split(',').map(s => parseInt(s.trim(), 10)) : [5, 10, 25];
    const initialSortObj = initialSortKey ? { key: initialSortKey, direction: initialSortDir || 'asc' } : undefined;

    return (
      <div style={{ width: '100%', boxSizing: 'border-box', padding: '32px', backgroundColor: args.darkMode ? '#0f172a' : '#f8fafc', borderRadius: '16px' }}>
        <DataTable
          {...args}
          columns={spaceColumns}
          data={spaceMissions}
          initialSort={initialSortObj}
          pageSizeOptions={parsedPageSizes}
          darkModeColors={{ light: brandLightColor as string, dark: brandDarkColor as string }}
          headerNode={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Orbital Fleet Command</h3>
                <span style={{ fontSize: '0.875rem', opacity: 0.6 }}>Active launch manifests and telemetry statuses.</span>
              </div>
              <Button variant="material" darkBackgroundColor="#007FFF" darkTextColor="#ffffff" backgroundColor="#007FFF" textColor="#fff">New Mission</Button>
            </div>
          }
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A deep overview of the component\'s composition capabilities. This story uses a strictly controlled flex-boundary to prevent horizontal clipping, injects a custom `headerNode` (acting as a control panel), allows row selection, enables pagination, and showcases advanced inline column rendering for the Status badges.',
      },
      source: {
        code: `
import { DataTable, ColumnDef, Button } from '@emeraldemperaur/mito-ui';

interface SpaceMission {
  id: string;
  vessel: string;
  target: string;
  status: 'In Transit' | 'Orbiting' | 'Docked' | 'Aborted';
}

const spaceColumns: ColumnDef<SpaceMission>[] = [
  { header: 'Mission ID', accessor: 'id', sortable: true },
  { header: 'Vessel Class', accessor: 'vessel', sortable: true },
  { header: 'Primary Target', accessor: 'target', sortable: true },
  { header: 'Launch Window', accessor: 'launchDate', sortable: true, align: 'center' },
  { header: 'Crew', accessor: 'crewSize', sortable: true, align: 'center' },
  { 
    header: 'Telemetry Status', 
    accessor: 'status', 
    sortable: true,
    align: 'right',
    render: (row) => {
      const colors = { 
        'In Transit': { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
        'Orbiting': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
        'Docked': { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
        'Aborted': { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
      };
      const theme = colors[row.status];
      return (
        <span style={{ 
          backgroundColor: theme.bg, color: theme.text, border: \`1px solid \${theme.border}\`,
          padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap'
        }}>
          {row.status}
        </span>
      );
    } 
  }
];

export const FleetCommandTable = () => (
  <DataTable
    columns={spaceColumns}
    data={spaceMissions} // Assuming spaceMissions data array is defined
    initialSort={{ key: 'target', direction: 'asc' }}
    pageSizeOptions={[5, 10, 25]}
    headerNode={
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <h3 style={{ margin: 0 }}>Orbital Fleet Command</h3>
          <span style={{ opacity: 0.6 }}>Active launch manifests.</span>
        </div>
        <Button variant="material" darkBackgroundColor="#007FFF" darkTextColor="#ffffff" backgroundColor="#007FFF" textColor="#fff">New Mission</Button>
      </div>
    }
  />
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 2. DESIGN VARIANT: MATERIAL
// ---------------------------------------------------------------------------
const RoboticsTeleoperationWrapper = () => {
  const [selectedBot, setSelectedBot] = useState<RoboticsUnit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const openDiagnostics = (bot: RoboticsUnit) => {
    setSelectedBot(bot);
    setIsModalOpen(true);
  };

  const getRobotColumns = (): ColumnDef<RoboticsUnit>[] => [
    { header: 'Unit ID', accessor: 'id', sortable: true },
    { header: 'Chassis Model', accessor: 'model', sortable: true },
    { 
      header: 'Latency (ms)', 
      accessor: 'latency', 
      align: 'center',
      render: (row) => (
        <span style={{ color: row.latency > 100 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
          {row.latency}ms
        </span>
      )
    },
    { 
      header: 'Battery', 
      accessor: 'battery',
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <div style={{ width: '40px', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${row.battery}%`, height: '100%', backgroundColor: row.battery < 20 ? '#ef4444' : '#3b82f6' }} />
          </div>
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{row.battery}%</span>
        </div>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <Button variant="outline" backgroundColor='#000000' darkBackgroundColor='#000000' 
        textColor='#ffffff' darkTextColor='#ffffff' onClick={() => openDiagnostics(row)}>Deploy</Button>
      )
    }
  ];

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: '32px', backgroundColor: '#e2e8f0', borderRadius: '16px' }}>
      <h2 style={{ fontFamily: 'IBM Plex Serif', margin: '0 0 24px 0', color: '#1e293b' }}>Teleoperation Hub</h2>
      <DataTable 
        columns={getRobotColumns()} 
        data={botData} 
        design="material" 
        fontFamily="IBM Plex Serif"
        selectable={true} 
        pagination={true}
        defaultPageSize={3}
      />

      {mounted && createPortal(
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Diagnostics: ${selectedBot?.id}`}
          subtitle={`Running deep teleoperation scan for ${selectedBot?.model} in ${selectedBot?.location}`}
          design="material"
          fontFamily='IBM Plex Serif'
          confirmText="Reboot Unit"
          onConfirm={() => {
            alert(`Rebooting ${selectedBot?.id}...`);
            setIsModalOpen(false);
          }}
        >
          <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '8px', fontFamily: 'monospace' }}>
             &gt; ping {selectedBot?.id} <br/>
             &gt; latency: {selectedBot?.latency}ms (Status: {selectedBot && selectedBot.latency > 100 ? 'POOR' : 'OPTIMAL'}) <br/>
             &gt; battery_level: {selectedBot?.battery}% <br/>
             &gt; connection_established: TRUE
          </div>
        </Modal>,
        document.body
      )}
    </div>
  );
};

export const MaterialVariant: Story = {
  render: () => <RoboticsTeleoperationWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Showcases the `material` design variant operating on a Robotics Telemetry dataset. It also demonstrates how a custom column `render` function can trigger sophisticated associated UI (like a `Modal` teleporting to the document body) to perform remote diagnostics on a specific row\'s data entity.',
      },
      source: {
        code: `
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { DataTable, ColumnDef, Button, Modal } from '@emeraldemperaur/mito-ui';

export const TeleoperationHub = () => {
  const [selectedBot, setSelectedBot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDiagnostics = (bot) => {
    setSelectedBot(bot);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<RoboticsUnit>[] = [
    { header: 'Unit ID', accessor: 'id', sortable: true },
    { header: 'Chassis Model', accessor: 'model', sortable: true },
    { 
      header: 'Latency (ms)', 
      accessor: 'latency', 
      align: 'center',
      render: (row) => (
        <span style={{ color: row.latency > 100 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
          {row.latency}ms
        </span>
      )
    },
    { 
      header: 'Battery', 
      accessor: 'battery',
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <div style={{ width: '40px', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: \`\${row.battery}%\`, height: '100%', backgroundColor: row.battery < 20 ? '#ef4444' : '#3b82f6' }} />
          </div>
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{row.battery}%</span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <Button 
          variant="outline" 
          backgroundColor='#000000' 
          darkBackgroundColor='#000000' 
          textColor='#ffffff' 
          darkTextColor='#ffffff' 
          onClick={() => openDiagnostics(row)}>
          Deploy
        </Button>
      )
    }
  ];

  return (
    <>
      <DataTable 
        columns={columns} 
        data={botData} // Assuming botData array is defined
        design="material" 
        fontFamily="IBM Plex Serif"
        selectable={true} 
        pagination={true} 
        defaultPageSize={3} 
      />
      
      {createPortal(
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={\`Diagnostics: \${selectedBot?.id}\`}
          design="material"
          fontFamily="IBM Plex Serif"
          confirmText="Reboot Unit"
        >
          <p>Running deep scan...</p>
        </Modal>,
        document.body
      )}
    </>
  );
};
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 3. DESIGN VARIANT: OUTLINE (WITH AVATAR IMAGES)
// ---------------------------------------------------------------------------
export const OutlineVariant: Story = {
  render: () => (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px' }}>
      <h2 style={{ fontFamily: 'Libre Franklin', margin: '0 0 24px 0', color: '#0f172a' }}>Active Personnel</h2>
      <DataTable 
        columns={personnelColumns} 
        data={personnelData} 
        design="outline" 
        fontFamily="Libre Franklin"
        selectable={true} 
        pagination={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcases the crisp `outline` design variant. Crucially, this story demonstrates how to utilize the column `render` method to safely inject raw `img` elements and create beautiful **Avatar Profiles** directly inside the table cells.',
      },
      source: {
        code: `
import { DataTable, ColumnDef } from '@emeraldemperaur/mito-ui';

const personnelColumns: ColumnDef<AgentPersonnel>[] = [
  { header: 'Agent ID', accessor: 'id', sortable: true },
  { 
    header: 'Identity', 
    accessor: 'agent', 
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src={row.agent.avatar} 
          alt={row.agent.name} 
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }} 
        />
        <span style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{row.agent.name}</span>
      </div>
    )
  },
  { header: 'Primary Role', accessor: 'role', sortable: true },
  { header: 'Security Clearance', accessor: 'clearance', sortable: true },
];

export const PersonnelRoster = () => (
  <DataTable 
    columns={personnelColumns} 
    data={personnelData} // Assuming personnelData array is defined
    design="outline" 
    fontFamily="Libre Franklin"
    selectable={true} 
  />
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 4. DESIGN VARIANT: NEUMORPHIC
// ---------------------------------------------------------------------------
export const NeumorphicVariant: Story = {
  render: () => (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: '32px', backgroundColor: '#e2e8f0', borderRadius: '16px' }}>
      <h2 style={{ fontFamily: 'Raleway', margin: '0 0 24px 0', color: '#1e293b' }}>Telemetry Logs</h2>
      <DataTable 
        columns={spaceColumns} 
        data={spaceMissions} 
        design="neumorphic" 
        fontFamily="Raleway"
        selectable={true} 
        pagination={true}
        defaultPageSize={4}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcases the `neumorphic` design variant perfectly sinking into the slate grey background of its parent container using 3D lighting algorithms.',
      },
      source: {
        code: `
import { DataTable } from '@emeraldemperaur/mito-ui';

export const TelemetryLogs = () => (
  <DataTable 
    columns={spaceColumns} 
    data={spaceMissions} 
    design="neumorphic" 
    fontFamily="Raleway"
    selectable={true} 
    pagination={true} 
    defaultPageSize={4}
  />
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 5. DESIGN VARIANT: SKEUOMORPHIC
// ---------------------------------------------------------------------------
export const SkeuomorphicVariant: Story = {
  render: () => (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: '32px', backgroundColor: '#f1f5f9', borderRadius: '16px' }}>
      <h2 style={{ fontFamily: 'Libre Franklin', margin: '0 0 24px 0', color: '#1e293b' }}>System Registers</h2>
      <DataTable 
        columns={spaceColumns} 
        data={spaceMissions} 
        design="skeuomorphic" 
        fontFamily="Libre Franklin"
        selectable={true} 
        pagination={true}
        defaultPageSize={4}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcases the highly-detailed `skeuomorphic` design variant, utilizing subtle internal bevels and gradients to simulate physical hardware screens.',
      },
      source: {
        code: `
import { DataTable } from '@emeraldemperaur/mito-ui';

export const SystemRegisters = () => (
  <DataTable 
    columns={spaceColumns} 
    data={spaceMissions} 
    design="skeuomorphic" 
    fontFamily="Libre Franklin"
    selectable={true} 
    pagination={true} 
    defaultPageSize={4}
  />
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 6. TRUEGLASS (FROSTED GLASSMORPHISM)
// ---------------------------------------------------------------------------
export const trueGlassEnabled: Story = {
  render: () => (
    <div style={{ 
      width: '100%', 
      boxSizing: 'border-box',
      padding: '32px', 
      backgroundImage: 'linear-gradient(135deg, #071945 0%, #06402B 100%)', 
      borderRadius: '16px',
    }}>
      <h2 style={{ fontFamily: 'Inter', margin: '0 0 24px 0', color: '#ffffff' }}>Quantum Subspace Logs</h2>
      <DataTable 
        columns={spaceColumns} 
        data={spaceMissions} 
        design="outline" 
        trueGlass={true}
        selectable={true} 
        pagination={true}
        defaultPageSize={4}
        textColor="#ffffff"
        darkTextColor="#ffffff"
        fontFamily='Inter'
        style={{ 
          '--mito-tbl-header-text': '#ffffff',
          '--mito-tbl-secondary-text': 'rgba(255,255,255,0.8)'
        } as React.CSSProperties}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'By setting the `trueGlass={true}` prop, the table sheds its solid background color and implements a sophisticated `backdrop-filter: blur(24px)` effect. This creates a frosted cinematic overlay that interacts beautifully with vivid backgrounds. Note the use of `textColor="#ffffff"` and injected CSS variables to ensure high contrast over the vibrant gradient.',
      },
      source: {
        code: `
import { DataTable } from '@emeraldemperaur/mito-ui';

export const QuantumSubspaceLogs = () => (
  <div style={{ backgroundImage: 'linear-gradient(135deg, #071945 0%, #06402B 100%)', padding: '32px' }}>
    <DataTable 
      columns={spaceColumns} 
      data={spaceMissions} 
      design="outline" 
      trueGlass={true}
      selectable={true} 
      pagination={true}
      defaultPageSize={4}
      textColor="#ffffff"
      darkTextColor="#ffffff"
      fontFamily="Inter"
      style={{ 
        '--mito-tbl-header-text': '#ffffff',
        '--mito-tbl-secondary-text': 'rgba(255,255,255,0.8)'
      } as React.CSSProperties}
    />
  </div>
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 7. DEFAULT LOADING STATE
// ---------------------------------------------------------------------------
export const DefaultLoadingState: Story = {
  render: () => (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: '32px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
      <DataTable
        columns={spaceColumns}
        data={[]}
        isLoading={true}
        design="material"
        fontFamily='Work Sans'
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcases the native `isLoading` behavior. When `isLoading` is set to `true` and no custom `loadingData` is provided, the table gracefully falls back to its default "Loading data..." string rendered within a unified empty-state cell.',
      },
      source: {
        code: `
import { DataTable } from '@emeraldemperaur/mito-ui';

export const DefaultLoading = () => (
  <DataTable
    columns={spaceColumns}
    data={[]}
    isLoading={true}
    design="material"
    fontFamily="Work Sans"
  />
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 8. CUSTOM REACT-NODE LOADING STATE
// ---------------------------------------------------------------------------
export const CustomLoadingState: Story = {
  render: () => (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: '32px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
      <DataTable
        columns={spaceColumns}
        data={[]}
        isLoading={true}
        design="outline"
        fontFamily='Raleway'
        loadingData={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '64px 0', color: '#3b82f6' }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" 
              stroke="currentColor" strokeWidth={1.5} 
              style={{ animation: 'spin 2s linear infinite' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1.25rem' }}>Establishing Deep Space Uplink...</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Waiting for orbital satellite synchronization.</p>
            </div>
          </div>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Properly showcases the `isLoading` state coupled with the immense flexibility of the `loadingData` prop. Instead of a simple text string, we completely override the empty state with a rich `ReactNode` containing an animated SVG spinner and custom typography.',
      },
      source: {
        code: `
import { DataTable } from '@emeraldemperaur/mito-ui';

export const CustomLoading = () => (
  <DataTable
    columns={spaceColumns}
    data={[]}
    isLoading={true}
    design="outline"
    fontFamily="Raleway"
    loadingData={
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 0', color: '#3b82f6' }}>
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ animation: 'spin 2s linear infinite' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
        <style>{\`@keyframes spin { 100% { transform: rotate(360deg); } }\`}</style>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1.25rem' }}>Establishing Deep Space Uplink...</h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Waiting for orbital satellite synchronization.</p>
        </div>
      </div>
    }
  />
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 9. UAV CRUD WORKFLOW (ADVANCED MODAL ROUTING)
// ---------------------------------------------------------------------------
interface UAVDrone {
  id: string;
  designation: string;
  status: 'Patrol' | 'Engaged' | 'Charging' | 'Offline';
  battery: number;
}

const uavData: UAVDrone[] = [
  { id: 'UAV-X1', designation: 'Predator Alpha (Recon)', status: 'Patrol', battery: 88 },
  { id: 'UAV-X2', designation: 'Reaper Beta (Assault)', status: 'Engaged', battery: 42 },
  { id: 'UAV-X3', designation: 'Global Hawk (Comms)', status: 'Charging', battery: 12 },
];

const CRUDWrapper = () => {
  const [selectedUav, setSelectedUav] = useState<UAVDrone | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'view' | 'edit' | 'delete'>('none');
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("NRM");

  useEffect(() => setMounted(true), []);

  const openAction = (uav: UAVDrone, action: 'view' | 'edit' | 'delete') => {
    setSelectedUav(uav);
    setActiveModal(action);
  };

  const closeAll = () => setActiveModal('none');

  const uavColumns: ColumnDef<UAVDrone>[] = [
    { header: 'Drone ID', accessor: 'id', sortable: true },
    { header: 'Designation', accessor: 'designation', sortable: true },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        const colors = { 
          'Patrol': '#3b82f6', 'Engaged': '#ef4444', 
          'Charging': '#f59e0b', 'Offline': '#64748b' 
        };
        return <span style={{ backgroundColor: colors[row.status], color: '#ffffff', fontWeight: 'bold', border: `1px solid ${colors[row.status]}`,
          padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{row.status}</span>;
      }
    },
    { 
      header: 'Power Cell', 
      accessor: 'battery',
      render: (row) => (
        <span style={{ color: row.battery < 20 ? '#ef4444' : '#ffffff' }}>{row.battery}%</span>
      )
    },
    { 
      header: 'Command Overrides', 
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <ActionButton 
            design="outline" 
            trueGlass={true} 
            title="View Telemetry"
            onClick={() => openAction(row, 'view')}
            icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>}
          />
          
          <ActionButton 
            design="outline" 
            trueGlass={true} 
            title="Edit Directives"
            onClick={() => openAction(row, 'edit')}
            icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>}
          />
          
          <ActionButton 
            design="outline" 
            trueGlass={true} 
            title="Scuttle Unit"
            textColor="#ef4444" 
            borderColor="rgba(239, 68, 68, 0.3)" 
            hoverBackgroundColor="rgba(239, 68, 68, 0.1)" 
            onClick={() => openAction(row, 'delete')}
            icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
          />
        </div>
      )
    }
  ];

  return (
    <div style={{ 
      width: '100%', boxSizing: 'border-box', padding: '32px', 
      backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', 
      borderRadius: '16px' 
    }}>
      <h2 style={{ margin: '0 0 24px 0', color: '#ffffff', fontFamily: 'Inter' }}>CRUD Workflow</h2>
      
      <DataTable 
        columns={uavColumns} 
        data={uavData} 
        design="outline"
        trueGlass={true}
        textColor="#ffffff"
        darkTextColor="#ffffff"
        fontFamily="Google Sans Code"
        borderRadius="0px"
        style={{ '--mito-tbl-header-text': '#ffffff', '--mito-tbl-secondary-text': '#94a3b8' } as React.CSSProperties}
      />

      {mounted && createPortal(
        <>
          <Modal
            isOpen={activeModal === 'view'}
            onClose={closeAll}
            layout="xl"
            design="material"
            fontFamily="Google Sans Code"
            title={`Telemetry Stream: ${selectedUav?.designation}`}
            confirmText="Close Feed"
            onConfirm={closeAll}
          >
            <div style={{ height: '300px', backgroundColor: '#0f172a', borderRadius: '8px', padding: '16px', color: '#10b981', fontFamily: 'Google Sans Code' }}>
              <p>[{new Date().toISOString()}] ESTABLISHING SECURE UPLINK...</p>
              <p>SIGNAL STRENGTH: EXCELLENT</p>
              <p>BATTERY YIELD: {selectedUav?.battery}%</p>
              <p>ROUTING VIDEO FEED...</p>
            </div>
          </Modal>

          <Modal
            isOpen={activeModal === 'edit'}
            onClose={closeAll}
            layout="fullscreen"
            design="skeuomorphic"
            fontFamily="Google Sans Code"
            title={`Override Operational Directives: ${selectedUav?.id}`}
            confirmText="Deploy New Parameters"
            onConfirm={closeAll}
          >
            <p>Accessing root command console for remote parameter overrides...</p>
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
              <label style={{ fontWeight: 'bold' }}>Targeting Algorithm</label>
              <SelectInput 
                alias='targetingAlgorith' 
                design='skeuomorphic'
                textColor='#ffffff'
                fontFamily="Google Sans Code"
                value={value}
                onChange={(newVal) => setValue(newVal)}
                options={[
                  {optionid: 1, text: "Astar Pathfinding (Default)", optionvalue: "ASTAR"},
                  {optionid: 2, text: "Neural Reconnaissance Mode", optionvalue: "NRM"},
                  {optionid: 3, text: "Aggressive Intercept", optionvalue: "AGINT"},
                ]}
              />
            </div>
          </Modal>

          <Modal
            isOpen={activeModal === 'delete'}
            onClose={closeAll}
            layout="bottom"
            position="full"
            design="outline"
            fontFamily="Google Sans Code"
            trueGlass={true}
            title={`⚠️ CRITICAL: Scuttle ${selectedUav?.id}?`}
            titleColor='#ffffff'
            confirmText="AUTHORIZE DESTRUCT SEQUENCE"
            confirmVariant="material"
            confirmButtonOverrides={{ backgroundColor: '#800020', textColor: '#ffffff', darkTextColor: '#ffffff', darkBackgroundColor: '#800020' }}
            onConfirm={closeAll}
          >
            <p style={{ margin: 0, color: '#ffffff', fontSize: '1.125rem' }}>
              WARNING: This will permanently detonate the onboard scuttling charges for <strong>{selectedUav?.designation}</strong> to prevent hostile capture. This action cannot be aborted once transmitted.
            </p>
          </Modal>
        </>,
        document.body
      )}
    </div>
  );
};

export const CRUDWorkflow: Story = {
  render: () => <CRUDWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'A highly advanced CRUD architecture utilizing the column `render` function to inject custom frosted-glass action buttons (View, Edit, Delete). Each button is natively wired to seamlessly trigger a distinct modal architecture (`xl`, `fullscreen`, and `bottom-sheet` respectively) to handle complex teleoperation workflows. Note the `SelectInput` integration within the fullscreen Edit modal.',
      },
      source: {
        code: `
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { DataTable, ColumnDef, Modal, SelectInput } from '@emeraldemperaur/mito-ui';

export const UavCrudWorkflow = () => {
  const [selectedUav, setSelectedUav] = useState(null);
  const [activeModal, setActiveModal] = useState<'none' | 'view' | 'edit' | 'delete'>('none');

  const openAction = (uav, action) => {
    setSelectedUav(uav);
    setActiveModal(action);
  };
  const closeAll = () => setActiveModal('none');

  const glassyStyle = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '32px', height: '32px', borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer', color: '#ffffff'
  };

  const columns: ColumnDef<UAVDrone>[] = [
    { header: 'Drone ID', accessor: 'id', sortable: true },
    { header: 'Designation', accessor: 'designation', sortable: true },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        const colors = { 
          'Patrol': '#3b82f6', 'Engaged': '#ef4444', 
          'Charging': '#f59e0b', 'Offline': '#64748b' 
        };
        return (
          <span style={{ 
            backgroundColor: colors[row.status], color: '#ffffff', 
            fontWeight: 'bold', border: \`1px solid \${colors[row.status]}\`,
            padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem' 
          }}>
            {row.status}
          </span>
        );
      }
    },
    { 
      header: 'Power Cell', 
      accessor: 'battery',
      render: (row) => (
        <span style={{ color: row.battery < 20 ? '#ef4444' : '#ffffff' }}>{row.battery}%</span>
      )
    },
    { 
      header: 'Command Overrides', 
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={() => openAction(row, 'view')} style={glassyStyle}>👁️</button>
          <button onClick={() => openAction(row, 'edit')} style={glassyStyle}>✏️</button>
          <button onClick={() => openAction(row, 'delete')} style={glassyStyle}>🗑️</button>
        </div>
      )
    }
  ];

  return (
    <>
      <div style={{ backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', padding: '32px' }}>
        <DataTable 
          columns={columns} 
          data={uavData} 
          design="outline"
          trueGlass={true}
          textColor="#ffffff"
        />
      </div>

      {createPortal(
        <>
          <Modal isOpen={activeModal === 'view'} onClose={closeAll} layout="xl" title={\`Telemetry: \${selectedUav?.id}\`}>
             <p>Viewing telemetry stream...</p>
          </Modal>

          <Modal isOpen={activeModal === 'edit'} onClose={closeAll} layout="fullscreen" title={\`Override Parameters: \${selectedUav?.id}\`}>
             <p>Accessing root command console...</p>
             <SelectInput 
                alias="targetingAlgorith" 
                design="skeuomorphic"
                textColor='#800020'
                fontFamily="Google Sans Code"
                options={[
                  {optionid: 1, text: "Astar Pathfinding (Default)", optionvalue: "ASTAR"},
                  {optionid: 2, text: "Neural Reconnaissance Mode", optionvalue: "NRM"}
                ]}
              />
          </Modal>

          <Modal isOpen={activeModal === 'delete'} onClose={closeAll} layout="bottom" position="full" title={\`Scuttle Unit \${selectedUav?.id}?\`}>
             <p>Authorize destruct sequence...</p>
          </Modal>
        </>,
        document.body
      )}
    </>
  );
};
        `
      }
    }
  }
};