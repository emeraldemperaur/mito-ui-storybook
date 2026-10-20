import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { SearchRibbon } from './SearchRibbon';
import { GlobalUIContext } from '../Layout/GlobalUIContext';
import { useState } from 'react';

const mockFilters = [
  { label: 'All Categories', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
];

const InteractiveRibbon = (args: any) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  return (
    <SearchRibbon 
      {...args} 
      searchTerm={search} 
      onSearchChange={setSearch}
      selectedFilter={filter}
      onFilterChange={setFilter}
    />
  );
};

const meta: Meta<typeof SearchRibbon> = {
  title: 'Data/SearchRibbon',
  component: SearchRibbon,
  tags: ['autodocs'],
  argTypes: {
    design: { control: 'radio', options: ['material', 'outline', 'neumorphic'] },
    recordCount: { control: 'number' },
    darkMode: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => {
      const isNeu = context.args.design === 'neumorphic';
      const bg = isNeu ? (context.args.darkMode ? '#1f2937' : '#e0e5ec') : 'transparent';
      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <div style={{ padding: '2rem 0', backgroundColor: bg }}>
            <Story />
          </div>
        </GlobalUIContext.Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SearchRibbon>;

export const OutlineToolbar: Story = {
  render: (args) => <InteractiveRibbon {...args} />,
  args: {
    design: 'outline',
    recordCount: 142,
    recordLabel: 'Users',
    filterOptions: mockFilters,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const searchInput = canvas.getByRole('searchbox', { name: /search records/i });
    await userEvent.type(searchInput, 'Admin');
    expect(searchInput).toHaveValue('Admin');

    const filterSelect = canvas.getByRole('combobox', { name: /search filter category/i });
    await userEvent.selectOptions(filterSelect, 'active');
    expect(filterSelect).toHaveValue('active');
  },
};

export const NeumorphicDark: Story = {
  render: (args) => <InteractiveRibbon {...args} />,
  args: {
    design: 'neumorphic',
    darkMode: true,
    recordCount: 1, 
    recordLabel: 'Queries',
    filterOptions: mockFilters,
  },
};