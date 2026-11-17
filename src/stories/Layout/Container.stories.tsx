import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const MockContent = ({ text, bg = '#dbeafe', border = '#93c5fd' }: any) => (
  <div style={{ padding: '40px', backgroundColor: bg, border: `2px dashed ${border}`, borderRadius: '8px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', color: '#1e3a8a' }}>
    {text}
  </div>
);

/**
 * The `Container` is the primary layout bounding box. It establishes maximum width boundaries, 
 * supports SSR `asChild` composition, and acts as a semantic WCAG landmark.
 */
const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Use the `Container` to constrain page content to readable line lengths or enable `fluid` mode for edge-to-edge dashboard views.',
      },
    },
  },
  argTypes: {
    fluid: {
      control: 'boolean',
      description: 'Enables fluid width (100% of parent) instead of snapping to fixed breakpoints. Automatically assigns `role="region"`.',
      table: { category: 'Layout', defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'select',
      options: ['1', '2', '3', '4'],
      description: 'Fixed maximum width boundary size based on the Radix scale. Ignored if `fluid` is true.',
      table: { category: 'Layout', defaultValue: { summary: '3' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Delegates rendering to the immediate child element via Radix Slot.',
      table: { category: 'Composition' },
    },
  },
  args: {
    fluid: false,
    size: '3',
  },
  decorators: [
    (Story) => (
      <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '40px 0' }}>
          <Story />
        </div>
      </GlobalUIContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const DefaultFixed: Story = {
  render: (args) => (
    <Container {...args}>
      <MockContent text={`Fixed Container (Size: ${args.size})`} />
    </Container>
  ),
  parameters: {
    docs: { description: { story: 'A standard fixed-width container locking its contents to a centered maximal width boundary.' } },
  },
};

export const FluidEdgeToEdge: Story = {
  render: (args) => (
    <Container {...args}>
      <MockContent text="Fluid Container (100% Width)" bg="#fce7f3" border="#f9a8d4" />
    </Container>
  ),
  args: {
    fluid: true,
  },
  parameters: {
    docs: { description: { story: 'Bypasses the fixed breakpoints to consume 100% of the available horizontal viewport width.' } },
  },
};