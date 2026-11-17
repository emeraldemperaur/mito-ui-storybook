import type { Meta, StoryObj } from '@storybook/react';
import { Row } from './Row';
import { Column } from './Column';

const ColDivBox = () => (
  <div style={{ padding: '20px', backgroundColor: '#e0e7ff', border: '1px solid #a5b4fc', borderRadius: '6px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', color: '#3730a3', height: '100%', boxSizing: 'border-box' }}>
    Col
  </div>
);

/**
 * The `Row` acts as the foundational 12-column grid container. It enforces WCAG grouping 
 * by default and provides a stable, strictly-spaced width plane for nested `Column` components.
 */
const meta: Meta<typeof Row> = {
  title: 'Layout/Row',
  component: Row,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Always wrap `Column` components in a `Row` to ensure proper CSS Grid track calculations and gap spacing.',
      },
    },
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      description: 'Buffer spacing between columns based on the Radix spacing scale. Can accept responsive objects.',
      table: { category: 'Layout', defaultValue: { summary: '4' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Delegates rendering to the immediate child element.',
      table: { category: 'Composition' },
    },
  },
  args: {
    gap: '4',
  },
};

export default meta;
type Story = StoryObj<typeof Row>;

export const StandardGap: Story = {
  render: (args) => (
    <Row {...args}>
      <Column span={4}><ColDivBox /></Column>
      <Column span={4}><ColDivBox /></Column>
      <Column span={4}><ColDivBox /></Column>
    </Row>
  ),
  parameters: {
    docs: { description: { story: 'A standard row demonstrating the default gap spacing (scale 4) across a 3-column split.' } },
  },
};

export const TightGap: Story = {
  render: (args) => (
    <Row {...args}>
      <Column span={3}><ColDivBox /></Column>
      <Column span={3}><ColDivBox /></Column>
      <Column span={3}><ColDivBox /></Column>
      <Column span={3}><ColDivBox /></Column>
    </Row>
  ),
  args: {
    gap: '1',
  },
  parameters: {
    docs: { description: { story: 'A row with minimal gap spacing (scale 1), useful for highly condensed data displays.' } },
  },
};

export const NoGap: Story = {
  render: (args) => (
    <Row {...args}>
      <Column span={6}><ColDivBox /></Column>
      <Column span={6}><ColDivBox /></Column>
    </Row>
  ),
  args: {
    gap: '0',
  },
  parameters: {
    docs: { description: { story: 'A row with zero gap spacing. Useful for contiguous edge-to-edge component designs like split hero banners.' } },
  },
};