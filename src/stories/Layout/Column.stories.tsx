import type { Meta, StoryObj } from '@storybook/react';
import { Column } from './Column';
import { Row } from './Row';

const MockContent = ({ text, bg = '#fef3c7', border = '#fcd34d' }: any) => (
  <div style={{ padding: '20px', backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '6px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px' }}>
    {text}
  </div>
);

/**
 * The `Column` is a responsive grid item. It maps explicit semantic breakpoints 
 * flawlessly to CSS Grid tracks, ensuring production-ready responsiveness within a `Row`.
 */
const meta: Meta<typeof Column> = {
  title: 'Layout/Column',
  component: Column,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Columns must be nested inside a `Row`. They utilize a 12-track system. Use `span` for a fixed width, or `xs`, `sm`, `md`, `lg`, `xl` for viewport-specific widths.',
      },
    },
  },
  argTypes: {
    span: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Base column width spanning across grid boundaries (1 to 12). Overrides responsive props if set.',
      table: { category: 'Sizing' },
    },
    newLine: {
      control: 'boolean',
      description: 'Strictly forces the column to start on a new grid row (Grid Line 1), breaking the auto-flow.',
      table: { category: 'Layout', defaultValue: { summary: 'false' } },
    },
    xs: { control: 'text', description: 'Extra-small viewport span (mobile).', table: { category: 'Responsive Sizing' } },
    sm: { control: 'text', description: 'Small viewport span (tablet).', table: { category: 'Responsive Sizing' } },
    md: { control: 'text', description: 'Medium viewport span (laptop).', table: { category: 'Responsive Sizing' } },
    lg: { control: 'text', description: 'Large viewport span (desktop).', table: { category: 'Responsive Sizing' } },
    xl: { control: 'text', description: 'Extra-large viewport span (wide).', table: { category: 'Responsive Sizing' } },
  },
  args: {
    span: 6,
    newLine: false,
  },
  decorators: [
    (Story) => (
      <Row gap="4">
        <Story />
        <Column span={12}><MockContent text="Visual Grid Baseline (Span 12)" bg="#f3f4f6" border="#d1d5db" /></Column>
      </Row>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Column>;

export const StandardSpan: Story = {
  render: (args) => (
    <>
      <Column {...args}><MockContent text={`Target Column (Span ${args.span})`} /></Column>
      <Column span={12 - (args.span || 6)}><MockContent text={`Remaining Space (Span ${12 - (args.span || 6)})`} bg="#e5e7eb" border="#d1d5db" /></Column>
    </>
  ),
  args: {
    span: 8,
  },
  parameters: {
    docs: { description: { story: 'Demonstrates a static span mapped directly to the 12-column grid tracks.' } },
  },
};

export const ResponsiveBehavior: Story = {
  render: (args) => (
    <>
      <Column {...args}><MockContent text="Responsive Column A" /></Column>
      <Column {...args}><MockContent text="Responsive Column B" /></Column>
      <Column {...args}><MockContent text="Responsive Column C" /></Column>
      <Column {...args}><MockContent text="Responsive Column D" /></Column>
    </>
  ),
  args: {
    span: undefined,
    xs: 12,
    sm: 6,
    lg: 3,
  },
  parameters: {
    docs: { description: { story: 'Shrink the viewport to observe the column width adapt intelligently. (Mobile: 12, Tablet: 6, Desktop: 3).' } },
  },
};

export const ForceNewLine: Story = {
  render: (args) => (
    <>
      <Column span={4}><MockContent text="Preceding Column (Span 4)" bg="#e5e7eb" border="#d1d5db" /></Column>
      <Column {...args}><MockContent text="Forced New Line (Span 6)" /></Column>
      <Column span={6}><MockContent text="Following Column (Span 6)" bg="#e5e7eb" border="#d1d5db" /></Column>
    </>
  ),
  args: {
    span: 6,
    newLine: true,
  },
  parameters: {
    docs: { description: { story: 'By passing `newLine={true}`, the column aggressively maps to Grid Line 1, forcing a visual break regardless of the remaining track space.' } },
  },
};