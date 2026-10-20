import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { DataTable, type DataTableProps, type ColumnDef } from './DataTable';
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import React from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

const mockColumns: ColumnDef<Transaction>[] = [
  { header: 'Transaction ID', accessor: 'id', sortable: true },
  { header: 'Date', accessor: 'date', sortable: true },
  { 
    header: 'Amount', 
    accessor: 'amount', 
    sortable: true,
    render: (row) => <span style={{ fontWeight: 600 }}>${row.amount.toFixed(2)}</span> 
  },
  { 
    header: 'Status', 
    accessor: 'status',
    render: (row) => {
      const colors = { Completed: 'green', Pending: 'orange', Failed: 'red' };
      return <span style={{ color: colors[row.status], fontWeight: 'bold' }}>{row.status}</span>;
    }
  },
];

const mockData: Transaction[] = [
  { id: 'TRX-001', date: '2026-07-20', amount: 1250.00, status: 'Completed' },
  { id: 'TRX-002', date: '2026-07-21', amount: 45.50, status: 'Pending' },
  { id: 'TRX-003', date: '2026-07-22', amount: 899.99, status: 'Failed' },
  { id: 'TRX-004', date: '2026-07-23', amount: 15.00, status: 'Completed' },
  { id: 'TRX-005', date: '2026-07-24', amount: 4200.00, status: 'Completed' },
];

const TypedDataTable = DataTable as React.FC<DataTableProps<Transaction>>;

const meta: Meta<typeof TypedDataTable> = {
  title: 'Data/DataTable',
  component: TypedDataTable,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    darkMode: { control: 'boolean' },
    selectable: { control: 'boolean' },
    pagination: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      const bg = isNeu ? (context.args.darkMode ? '#1f2937' : '#e0e5ec') : 'transparent';
      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <div style={{ padding: '2rem', backgroundColor: bg, minHeight: '400px' }}>
            <Story />
          </div>
        </GlobalUIContext.Provider>
      );
    },
  ],
};

export default meta;
// Tell Storybook to use our newly typed component
type Story = StoryObj<typeof TypedDataTable>;

export const StandardMaterial: Story = {
  args: {
    columns: mockColumns,
    data: mockData,
    design: 'material',
    selectable: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify Rendering', async () => {
      expect(canvas.getByText('TRX-001')).toBeInTheDocument();
    });

    await step('Test Sorting', async () => {
      const amountHeader = canvas.getByText('Amount');
      // Click to sort Ascending
      await userEvent.click(amountHeader);
      const firstRowAmount = canvas.getAllByText(/\$/)[0];
      expect(firstRowAmount).toHaveTextContent('$15.00'); // Lowest amount
    });

    await step('Test Row Selection', async () => {
      const selectAllCheckbox = canvas.getByRole('checkbox', { name: /select all rows/i });
      await userEvent.click(selectAllCheckbox);
      // All row checkboxes should be checked
      const rowCheckboxes = canvas.getAllByRole('checkbox', { name: /select row/i });
      expect(rowCheckboxes[0]).toBeChecked();
    });
  },
};

export const NeumorphicPagination: Story = {
  args: {
    columns: mockColumns,
    data: [...mockData, ...mockData, ...mockData], // Duplicate data to force pagination
    design: 'neumorphic',
    pagination: true,
    defaultPageSize: 5,
    pageSizeOptions: [5, 10, 20],
  },
};

export const LoadingState: Story = {
  args: {
    columns: mockColumns,
    data: [],
    design: 'outline',
    isLoading: true,
  },
};