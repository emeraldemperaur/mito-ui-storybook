import type { Meta, StoryObj } from '@storybook/react';
import { Row } from './Row';
import { Column } from './Column';
import React from 'react';

const BoxViz = ({ children }: { children: React.ReactNode }) => (
  <div style={{ backgroundColor: 'var(--blue-9, #3b82f6)', color: 'white', padding: '1rem', textAlign: 'center', borderRadius: '4px' }}>
    {children}
  </div>
);

const meta: Meta<typeof Row> = {
  title: 'Layout/Grid System',
  component: Row,
  tags: ['autodocs'],
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Row>;

export const Standard12Column: Story = {
  args: {
    gap: '4',
    children: (
      <>
        <Column span={4}><BoxViz>span 4</BoxViz></Column>
        <Column span={4}><BoxViz>span 4</BoxViz></Column>
        <Column span={4}><BoxViz>span 4</BoxViz></Column>
      </>
    ),
  },
};

export const ResponsiveBreakpoints: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Resize the viewport to see columns collapse. (xs=12, md=6, lg=3)',
      },
    },
  },
  args: {
    gap: '4',
    children: (
      <>
        {[1, 2, 3, 4].map((i) => (
          <Column key={i} xs={12} md={6} lg={3}>
            <BoxViz>Item {i}</BoxViz>
          </Column>
        ))}
      </>
    ),
  },
};