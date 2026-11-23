import type { Meta, StoryObj } from '@storybook/react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  CardTitle, 
  CardSubtitle, 
  CardText,
  CardImage,
  CardImageOverlay,
  CardListGroup,
  CardListItem,
  type CardProps
} from './Card';
import { Button } from '../Buttons/Button'; 

export interface CardStoryProps extends CardProps {
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: string | number;
  withBorder?: boolean;
  position?: 'top' | 'bottom' | 'overlay';
  src?: string;
  alt?: string;
  flush?: boolean;
}

/**
 * The `Card` is an accessible, multi-variant structural container. 
 * It serves as the root provider of CSS variables for its internal sub-components, seamlessly supporting 
 * flat Outlines, elevated Material shadows, Skeuomorphic realism, and kinetic Neumorphic extrusions.
 */
const meta: Meta<CardStoryProps> = {
  title: 'Information/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      story: { inline: true },
      description: {
        component: 'Use the `Card` component in conjunction with its semantic sub-components (`CardHeader`, `CardBody`, `CardFooter`, `CardListGroup`, etc.) to build highly structured, responsive UI modules. The rigid sub-component architecture ensures padding, borders, and flex alignments remain mathematically perfect regardless of the nesting order.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // UNIVERSAL ATTRIBUTES (Applies to Card & All Sub-Components)
    // ----------------------------------------------------------------------
    id: {
      control: 'text',
      description: 'Unique identifier for the DOM element, essential for strict WCAG ARIA linking.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } }
    },
    asChild: {
      control: 'boolean',
      description: 'If true, merges component DOM into the immediate child via Radix Slot. Applicable to the root Card and ALL sub-components.',
      table: { category: 'Universal Attributes', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    className: {
      control: 'text',
      description: 'Standard CSS class name appended directly to the element.',
      table: { category: 'Universal Attributes', type: { summary: 'string' } }
    },
    style: {
      control: 'object',
      description: 'Inline React CSS properties applied to the element.',
      table: { category: 'Universal Attributes', type: { summary: 'React.CSSProperties' } }
    },

    // ----------------------------------------------------------------------
    // ROOT CARD: ARCHITECTURE & INTERACTIONS
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['material', 'outline', 'neumorphic', 'skeuomorphic'],
      description: 'The global architectural design variant.',
      table: { 
        category: 'Architecture', 
        defaultValue: { summary: 'material' },
        type: { summary: "'material' | 'outline' | 'neumorphic' | 'skeuomorphic'" }
      }
    },
    trueGlass: {
      control: 'boolean',
      description: 'Toggles an enterprise-grade frosted glassmorphism aesthetic using backdrop filters.',
      table: { category: 'Architecture', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    materialBorder: { 
      control: 'boolean', 
      description: 'Toggles the outer structural border specifically for the Material design variant.',
      table: { category: 'Architecture', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } } 
    },
    tactile: {
      control: 'boolean',
      description: 'Enables a tactile physical hover effect with kinetic drop-shadow transitions.',
      table: { category: 'Interactions', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    hoverEffect: {
      control: 'select',
      options: ['subtle', 'medium', 'pronounced'],
      description: 'Dictates the severity of the tactile hover effect.',
      table: { 
        category: 'Interactions', 
        defaultValue: { summary: 'medium' },
        type: { summary: "'subtle' | 'medium' | 'pronounced'" }
      }
    },

    // ----------------------------------------------------------------------
    // ROOT CARD: THEMING
    // ----------------------------------------------------------------------
    darkMode: {
      control: 'boolean',
      description: 'Forces dark mode rendering independent of the global context.',
      table: { category: 'Theming: Global', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    darkModeColors: {
      control: 'object',
      description: 'Dynamic light/dark mode fallback color mapping for the active brand token.',
      table: { category: 'Theming: Global', type: { summary: '{ light: string; dark: string }' } }
    },
    backgroundColor: { 
      control: 'color', 
      description: 'Explicit background color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } } 
    },
    textColor: { 
      control: 'color', 
      description: 'Explicit text color override for light mode contexts.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } } 
    },
    borderColor: { 
      control: 'color', 
      description: 'Explicit override for the structural border color in light mode.',
      table: { category: 'Theming: Light Mode', type: { summary: 'string' } } 
    },
    darkBackgroundColor: { 
      control: 'color', 
      description: 'Explicit background color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } 
    },
    darkTextColor: { 
      control: 'color', 
      description: 'Explicit text color override specifically for dark mode contexts.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } 
    },
    darkBorderColor: { 
      control: 'color', 
      description: 'Explicit override for the structural border color in dark mode.',
      table: { category: 'Theming: Dark Mode', type: { summary: 'string' } } 
    },

    // ----------------------------------------------------------------------
    // ROOT CARD: DIMENSIONS & TYPOGRAPHY
    // ----------------------------------------------------------------------
    fontFamily: { 
      control: 'text', 
      description: 'Custom font family applied globally to the card content.',
      table: { category: 'Typography', defaultValue: { summary: '"Bodoni Moda Variable", -apple-system, sans-serif' }, type: { summary: 'string' } } 
    },
    borderWidth: { 
      control: 'text', 
      description: "Explicit override for the container's border width.",
      table: { category: 'Dimensions', defaultValue: { summary: '1px' }, type: { summary: 'string | number' } } 
    },
    borderRadius: { 
      control: 'text', 
      description: "Explicit override for the container's border radius.",
      table: { category: 'Dimensions', defaultValue: { summary: '0.75rem' }, type: { summary: 'string | number' } } 
    },

    // ----------------------------------------------------------------------
    // ROOT CARD: 3D EXTRUSION (NEUMORPHIC/SKEUOMORPHIC)
    // ----------------------------------------------------------------------
    elevation: {
      control: { type: 'range', min: 1, max: 24, step: 1 },
      description: 'Neumorphic/Skeuomorphic 3D extrusion distance in pixels.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '6' }, type: { summary: 'number' } }
    },
    neuIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Multiplier for Neumorphic shadow intensity to ensure WCAG contrast.',
      table: { category: '3D Extrusion (Neu/Skeuo)', defaultValue: { summary: '1' }, type: { summary: 'number' } }
    },
    lightSource: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Global lighting angle for shadow trajectories.',
      table: { 
        category: '3D Extrusion (Neu/Skeuo)', 
        defaultValue: { summary: 'top-left' },
        type: { summary: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'" }
      }
    },

    // ----------------------------------------------------------------------
    // SUB-COMPONENTS (VIRTUAL ARGS MAPPED FOR DOCUMENTATION)
    // ----------------------------------------------------------------------
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
      description: 'Horizontal alignment of the inner content. Applicable to `<CardHeader>` and `<CardFooter>`.',
      table: { category: 'Sub-Components: Header & Footer', type: { summary: "'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'" } }
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch'],
      description: 'Vertical alignment of the inner content. Applicable to `<CardHeader>` and `<CardFooter>`.',
      table: { category: 'Sub-Components: Header & Footer', type: { summary: "'flex-start' | 'center' | 'flex-end' | 'stretch'" } }
    },
    gap: {
      control: 'number',
      description: 'Gap between child elements in pixels or rems. Applicable to `<CardHeader>` and `<CardFooter>`.',
      table: { category: 'Sub-Components: Header & Footer', type: { summary: 'string | number' } }
    },
    withBorder: {
      control: 'boolean',
      description: 'Toggles the structural separation line border. Applicable to `<CardHeader>` and `<CardFooter>`.',
      table: { category: 'Sub-Components: Header & Footer', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } }
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'overlay'],
      description: 'Dictates border-radius rendering based on image placement. Applicable to `<CardImage>`.',
      table: { category: 'Sub-Components: Image', defaultValue: { summary: 'top' }, type: { summary: "'top' | 'bottom' | 'overlay'" } }
    },
    src: {
      control: 'text',
      description: 'URL of the image. Standard React `img` attribute. Applicable to `<CardImage>`.',
      table: { category: 'Sub-Components: Image', type: { summary: 'string' } }
    },
    alt: {
      control: 'text',
      description: 'Alternative text for screen readers. Standard React `img` attribute. Applicable to `<CardImage>`.',
      table: { category: 'Sub-Components: Image', type: { summary: 'string' } }
    },
    flush: {
      control: 'boolean',
      description: 'Removes outer borders and rounded corners to fit edge-to-edge inside the card. Applicable to `<CardListGroup>`.',
      table: { category: 'Sub-Components: List Group', defaultValue: { summary: 'true' }, type: { summary: 'boolean' } }
    },
  },
  args: {
    design: 'material',
    tactile: false,
    hoverEffect: 'medium',
    trueGlass: false,
    darkMode: false,
    materialBorder: true,
    elevation: 6,
    neuIntensity: 1,
    lightSource: 'top-left',
    justify: 'space-between',
    align: 'center',
    gap: 12,
    withBorder: true,
  }
};

export default meta;
type Story = StoryObj<CardStoryProps>;

// ---------------------------------------------------------------------------
// 1. INTERACTIVE PLAYGROUND
// ---------------------------------------------------------------------------
export const InteractivePlayground: Story = {
  render: (args) => (
    <div style={{ width: '400px', padding: '24px', backgroundColor: args.darkMode ? '#111827' : 'transparent', borderRadius: '12px' }}>
      <Card {...args}>
        <CardHeader justify={args.justify} align={args.align} gap={args.gap} withBorder={args.withBorder}>
          <CardTitle>Enterprise Analytics</CardTitle>
          <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '999px', fontWeight: 600 }}>Active</span>
        </CardHeader>
        <CardBody>
          <CardSubtitle>Q3 Performance Metrics</CardSubtitle>
          <CardText>
            Deployments have increased by 42% over the last fiscal quarter, driven primarily by automated CI/CD pipeline integrations.
          </CardText>
        </CardBody>
        <CardFooter justify="flex-end" gap={12} withBorder={args.withBorder}>
          <Button variant="outline" backgroundColor='#800020' darkBackgroundColor='#000000' textColor='#ffffff' darkTextColor='#ffffff' darkMode={args.darkMode}>Cancel</Button>
          <Button variant="material" backgroundColor="#800020" darkBackgroundColor='#000000' textColor="#ffffff" darkTextColor='#ffffff'>View Report</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to test the structural `design` prop, toggle `darkMode`, and preview the layout alignments applied to the `CardHeader` and `CardFooter`. Note the sub-component props documented below in their respective categories.',
      },
      source: {
        code: `import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, CardText, CardFooter, Button } from '@emeraldemperaur/mito-ui';

export const StandardCard = () => (
  <Card design="material" tactile hoverEffect="medium">
    <CardHeader justify="space-between" align="center" withBorder={true}>
      <CardTitle>Enterprise Analytics</CardTitle>
      <span style={{ padding: '4px 8px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '999px', fontWeight: 600 }}>Active</span>
    </CardHeader>
    <CardBody>
      <CardSubtitle>Q3 Performance Metrics</CardSubtitle>
      <CardText>
        Deployments have increased by 42% over the last fiscal quarter.
      </CardText>
    </CardBody>
    <CardFooter justify="flex-end" gap={12} withBorder={true}>
      <Button variant="outline">Cancel</Button>
      <Button variant="material" backgroundColor="#2563eb" textColor="#ffffff">View Report</Button>
    </CardFooter>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. ADVANCED COMPOSITION (DASHBOARD WIDGET)
// ---------------------------------------------------------------------------
export const AdvancedComposition: Story = {
  render: () => (
    <div style={{ width: '450px' }}>
      <Card design="material" tactile>
        <CardHeader justify="space-between" align="flex-start">
          <div>
            <CardTitle>Node-04 Alpha</CardTitle>
            <CardSubtitle>us-west-2a (Production)</CardSubtitle>
          </div>
          <span style={{ padding: '4px 8px', backgroundColor: '#ecfdf5', color: '#047857', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Healthy</span>
        </CardHeader>
        
        <CardBody>
          <CardText>
            Primary database replica processing real-time telemetry data. 
            Expect high I/O operations during peak hours.
          </CardText>
        </CardBody>
        
        <CardListGroup flush>
          <CardListItem style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>CPU Usage</span>
            <strong style={{ color: '#0f172a' }}>42%</strong>
          </CardListItem>
          <CardListItem style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Memory Allocation</span>
            <strong style={{ color: '#0f172a' }}>12.4 / 16 GB</strong>
          </CardListItem>
          <CardListItem style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Network I/O</span>
            <strong style={{ color: '#0f172a' }}>845 MB/s</strong>
          </CardListItem>
        </CardListGroup>
        
        <CardFooter justify="space-between" align="center">
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Last sync: 2m ago</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline" backgroundColor="#800020" darkBackgroundColor='#800020' textColor="#ffffff" darkTextColor='#ffffff'>Reboot</Button>
            <Button variant="material" backgroundColor="#0E2053" darkBackgroundColor='#0E2053' textColor="#ffffff" darkTextColor='#ffffff'>View Logs</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `Card` is built on a robust composition model. By snapping together `CardHeader`, `CardBody`, `CardListGroup`, and `CardFooter`, developers can construct highly complex, data-dense dashboard widgets without writing any custom CSS. The structural sub-components automatically manage their own internal padding, border-radii inheritance, and separating lines.',
      },
      source: {
        code: `import { Card, CardHeader, CardTitle, CardSubtitle, CardBody, CardText, CardListGroup, CardListItem, CardFooter, Button } from '@emeraldemperaur/mito-ui';

export const DashboardWidget = () => (
  <Card design="material" tactile>
    <CardHeader justify="space-between" align="flex-start">
      <div>
        <CardTitle>Node-04 Alpha</CardTitle>
        <CardSubtitle>us-west-2a (Production)</CardSubtitle>
      </div>
      <Badge color="green">Healthy</Badge>
    </CardHeader>
    
    <CardBody>
      <CardText>Primary database replica processing real-time telemetry data.</CardText>
    </CardBody>
    
    <CardListGroup flush>
      <CardListItem className="flex justify-between">
        <span className="text-gray-500">CPU Usage</span>
        <strong>42%</strong>
      </CardListItem>
      <CardListItem className="flex justify-between">
        <span className="text-gray-500">Memory Allocation</span>
        <strong>12.4 / 16 GB</strong>
      </CardListItem>
    </CardListGroup>
    
    <CardFooter justify="space-between" align="center">
      <span className="text-xs text-gray-400">Last sync: 2m ago</span>
      <div className="flex gap-2">
        <Button variant="outline">Reboot</Button>
        <Button variant="material" backgroundColor="#0f172a" textColor="#ffffff">View Logs</Button>
      </div>
    </CardFooter>
  </Card>
);`,
      },
    },
  },
};


// ---------------------------------------------------------------------------
// 3. DESIGN ARCHITECTURES
// ---------------------------------------------------------------------------
export const ArchitecturalVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', width: '800px', backgroundColor: '#f1f5f9', padding: '48px', borderRadius: '16px' }}>
      
      <Card design="outline">
        <CardBody>
          <CardTitle>Outline Design</CardTitle>
          <CardText>Flat, border-driven aesthetic ideal for dense, data-heavy dashboards to prevent visual fatigue.</CardText>
        </CardBody>
      </Card>

      <Card design="material">
        <CardBody>
          <CardTitle>Material Design</CardTitle>
          <CardText>Standard elevated surface leveraging CSS drop shadows for clear Z-index layering.</CardText>
        </CardBody>
      </Card>

      <Card design="neumorphic">
        <CardBody>
          <CardTitle>Neumorphic Extrusion</CardTitle>
          <CardText>Calculates drop shadows based on the parent background color to appear extruded from the surface.</CardText>
        </CardBody>
      </Card>

      <Card design="skeuomorphic">
        <CardBody>
          <CardTitle>Skeuomorphic Realism</CardTitle>
          <CardText>Utilizes inner bevels and light-source gradients to mimic tactile, physical materials.</CardText>
        </CardBody>
      </Card>

    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `Card` component supports four primary `design` languages out-of-the-box. Neumorphic and Skeuomorphic variants automatically scan the DOM for the nearest parent background color to seamlessly blend their shadows.',
      },
      source: {
        code: `import { Card, CardBody, CardTitle, CardText } from '@emeraldemperaur/mito-ui';

export const Architectures = () => (
  <>
    <Card design="outline">
      <CardBody>
        <CardTitle>Outline</CardTitle>
        <CardText>Flat, border-driven aesthetic.</CardText>
      </CardBody>
    </Card>

    <Card design="neumorphic">
      <CardBody>
        <CardTitle>Neumorphic</CardTitle>
        <CardText>Extrudes from parent background.</CardText>
      </CardBody>
    </Card>
  </>
);`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 4. RICH MEDIA PROFILE
// ---------------------------------------------------------------------------
export const RichMediaProfile: Story = {
  render: () => (
    <div style={{ width: '350px' }}>
      <Card design="material" tactile>
        <CardImage 
          position="top" 
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop" 
          alt="Profile Header"
          style={{ height: '140px' }}
        />
        <CardBody>
          <CardTitle>Mito Chromeone</CardTitle>
          <CardSubtitle>Senior Cloud Architect</CardSubtitle>
          <CardText>Specializes in distributed systems, Kubernetes orchestration, and AWS infrastructure scaling.</CardText>
        </CardBody>
        <CardListGroup flush>
          <CardListItem>📍 Firenze, IT</CardListItem>
          <CardListItem>✉️ mito.chromeone@enterprise.com</CardListItem>
          <CardListItem>🔗 github.com/mitochromeone</CardListItem>
        </CardListGroup>
        <CardFooter justify="center">
          <Button variant="material" darkBackgroundColor='#0f172a' darkTextColor='#ffffff' backgroundColor="#0f172a" textColor="#ffffff" style={{ width: '100%' }}>
            View Full Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Leverage `CardImage` with `position="top"` to seamlessly clip images into the rounded corners. When paired with `CardListGroup flush`, you can create highly polished, edge-to-edge profile or product cards.',
      },
      source: {
        code: `import { Card, CardImage, CardBody, CardTitle, CardSubtitle, CardListGroup, CardListItem, CardFooter, Button } from '@emeraldemperaur/mito-ui';

export const ProfileCard = () => (
  <Card design="material" tactile>
    <CardImage position="top" src="/header-bg.jpg" alt="Header Image" style={{ height: '140px' }} />
    <CardBody>
      <CardTitle>Mito Chromeone</CardTitle>
      <CardSubtitle>Cloud Architect</CardSubtitle>
    </CardBody>
    <CardListGroup flush>
      <CardListItem>📍 Firenze, IT</CardListItem>
      <CardListItem>✉️ mito.chromeone@enterprise.com</CardListItem>
      <CardListItem>🔗 github.com/mitochromeone</CardListItem>
    </CardListGroup>
    <CardFooter justify="center">
      <Button variant="material" darkBackgroundColor='#0f172a' darkTextColor='#ffffff' backgroundColor="#0f172a" textColor="#ffffff" style={{ width: '100%' }}>
        View Full Profile
      </Button>
    </CardFooter>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 5. DATA LIST GROUPS (FLUSH & BORDERED)
// ---------------------------------------------------------------------------
export const DataListGroups: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', width: '800px', alignItems: 'start' }}>
      
      {/* Flush List Group */}
      <Card design="material">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardSubtitle>Flush (Edge-to-Edge)</CardSubtitle>
        </CardHeader>
        <CardListGroup flush>
          <CardListItem style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>AWS Web Services</span>
            <strong style={{ color: '#ef4444' }}>-$420.50</strong>
          </CardListItem>
          <CardListItem style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>GitHub Copilot</span>
            <strong style={{ color: '#ef4444' }}>-$10.00</strong>
          </CardListItem>
          <CardListItem style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Stripe Payout</span>
            <strong style={{ color: '#10b981' }}>+$1,250.00</strong>
          </CardListItem>
        </CardListGroup>
        <CardFooter>
          <Button darkBackgroundColor='#163611' darkTextColor='#ffffff' backgroundColor='#163611' textColor='#ffffff' variant="outline" style={{ width: '100%' }}>View All Statements</Button>
        </CardFooter>
      </Card>

      {/* Embedded Bordered List Group */}
      <Card design="outline">
        <CardBody>
          <CardTitle>System Requirements</CardTitle>
          <CardSubtitle>Standard (Contained)</CardSubtitle>
          <CardText>Please ensure your cluster meets the minimum specifications before deployment.</CardText>
          
          <CardListGroup flush={false} style={{ marginTop: '16px' }}>
            <CardListItem>CPU: 4 Cores (Minimum)</CardListItem>
            <CardListItem>RAM: 16 GB ECC</CardListItem>
            <CardListItem>Storage: 250 GB NVMe</CardListItem>
            <CardListItem>Network: 1 Gbps Fiber</CardListItem>
          </CardListGroup>
        </CardBody>
      </Card>

    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `CardListGroup` component allows for semantic unordered lists (`<ul>`) designed specifically for the card architecture. By default, `flush={true}` removes outer borders and rounded corners so the list items bleed seamlessly to the edges of the card. Setting `flush={false}` retains the borders and border-radius, making it perfect for embedding inside a padded `CardBody`.',
      },
      source: {
        code: `import { Card, CardHeader, CardTitle, CardBody, CardListGroup, CardListItem } from '@emeraldemperaur/mito-ui';

export const ListExamples = () => (
  <>
    {/* FLUSH LIST (Attached to edges) */}
    <Card>
      <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
      <CardListGroup flush>
        <CardListItem>AWS Web Services</CardListItem>
        <CardListItem>Stripe Payout</CardListItem>
      </CardListGroup>
    </Card>

    {/* CONTAINED LIST (Embedded in body) */}
    <Card>
      <CardBody>
        <CardTitle>System Requirements</CardTitle>
        <CardListGroup flush={false}>
          <CardListItem>CPU: 4 Cores</CardListItem>
          <CardListItem>RAM: 16 GB</CardListItem>
        </CardListGroup>
      </CardBody>
    </Card>
  </>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 6. IMAGE OVERLAYS
// ---------------------------------------------------------------------------
export const ImageBackgroundOverlay: Story = {
  render: () => (
    <div style={{ width: '450px' }}>
      <Card design="outline">
        <CardImage 
          position="overlay" 
          src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop" 
          alt="Overlay Background"
          style={{ minHeight: '250px' }}
        />
        <CardImageOverlay>
          <CardTitle>Project Hesperides</CardTitle>
          <CardSubtitle>Confidential Initiative</CardSubtitle>
          <CardText>
            This card uses an image as its direct structural background. The `CardImageOverlay` component automatically applies a frosted dark gradient to ensure text contrast remains WCAG compliant.
          </CardText>
        </CardImageOverlay>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Setting `CardImage` to `position="overlay"` and wrapping the content in a `CardImageOverlay` automatically scales the image to fill the card bounds while darkening it for text readability.',
      },
      source: {
        code: `import { Card, CardImage, CardImageOverlay, CardTitle, CardSubtitle, CardText } from '@emeraldemperaur/mito-ui';

export const OverlayExample = () => (
  <Card design="outline">
    <CardImage position="overlay" src="/background.jpg" alt="Background" style={{ minHeight: '250px' }} />
    <CardImageOverlay>
      <CardTitle>Project Apollo</CardTitle>
      <CardSubtitle>Confidential Initiative</CardSubtitle>
      <CardText>
        This card uses an image as its direct structural background.
      </CardText>
    </CardImageOverlay>
  </Card>
);`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 7. TACTILE HOVER KINETICS
// ---------------------------------------------------------------------------
export const TactileHoverEffects: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px' }}>
      <Card design="material" tactile hoverEffect="subtle" style={{ width: '250px' }}>
        <CardBody>
          <CardTitle>Subtle Hover</CardTitle>
          <CardText>Gently translates Y by -2px with a mild shadow increase.</CardText>
        </CardBody>
      </Card>
      <Card design="material" tactile hoverEffect="medium" style={{ width: '250px' }}>
        <CardBody>
          <CardTitle>Medium Hover</CardTitle>
          <CardText>Translates Y by -4px. The default standard for tactile elements.</CardText>
        </CardBody>
      </Card>
      <Card design="material" tactile hoverEffect="pronounced" style={{ width: '250px' }}>
        <CardBody>
          <CardTitle>Pronounced Hover</CardTitle>
          <CardText>Translates Y by -8px with a massive shadow bloom. Great for pricing tiers.</CardText>
        </CardBody>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Applying the `tactile` boolean prop enables kinetic CSS transitions on hover. The `hoverEffect` prop dials the Y-translation intensity.',
      },
      source: {
        code: `import { Card, CardBody, CardTitle, CardText } from '@emeraldemperaur/mito-ui';

export const TactileCards = () => (
  <>
    <Card design="material" tactile hoverEffect="subtle">
      <CardBody>
        <CardTitle>Subtle Hover</CardTitle>
      </CardBody>
    </Card>

    <Card design="material" tactile hoverEffect="pronounced">
      <CardBody>
        <CardTitle>Pronounced Hover</CardTitle>
      </CardBody>
    </Card>
  </>
);`,
      }
    },
  },
};

// ---------------------------------------------------------------------------
// 8. TRUEGLASS (GLASSMORPHISM)
// ---------------------------------------------------------------------------
export const Glassmorphism: Story = {
  render: () => (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '16px'
    }}>
      <Card design="skeuomorphic" trueGlass tactile style={{ width: '350px' }}>
        <CardBody>
          <CardTitle>Glassmorphism Active</CardTitle>
          <CardSubtitle>Powered by trueGlass</CardSubtitle>
          <CardText>
            The `trueGlass` property converts the solid background into a semi-transparent layer backed by a dynamic `backdrop-filter: blur(16px)`.
          </CardText>
        </CardBody>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `trueGlass` attribute seamlessly converts any `design` variant into an enterprise-grade frosted glass container. It works exceptionally well with `skeuomorphic` bevels.',
      },
      source: {
        code: `import { Card, CardBody, CardTitle, CardSubtitle, CardText } from '@emeraldemperaur/mito-ui';

export const GlassCard = () => (
  <Card design="skeuomorphic" trueGlass tactile>
    <CardBody>
      <CardTitle>Glassmorphism Active</CardTitle>
      <CardSubtitle>Powered by trueGlass</CardSubtitle>
      <CardText>This card blurs the background behind it dynamically.</CardText>
    </CardBody>
  </Card>
);`,
      },
    },
  },
};

// ============================================================================
// SUB-COMPONENT DEVELOPER REFERENCE
// ============================================================================

// ---------------------------------------------------------------------------
// 9. CardHeader
// ---------------------------------------------------------------------------
export const SubComponentCardHeader: Story = {
  name: 'Sub-Component: CardHeader',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardHeader justify="space-between" align="center" withBorder={true}>
        <CardTitle>System Header</CardTitle>
        <Button variant="outline" darkBackgroundColor='#0f172a' darkTextColor='#ffffff' backgroundColor="#0f172a" textColor="#ffffff">Settings</Button>
      </CardHeader>
      <CardBody><CardText>Content rests below the header boundary.</CardText></CardBody>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardHeader>` structurally caps the top of the card. It automatically inherits the parent border radius for its top corners and provides flex-box layout tools (`justify`, `align`, `gap`) and a separating boundary line via `withBorder`.',
      },
      source: {
        code: `import { Card, CardHeader, CardTitle, CardBody, CardText, Button } from '@emeraldemperaur/mito-ui';

export const HeaderExample = () => (
  <Card>
    <CardHeader justify="space-between" align="center" withBorder={true}>
      <CardTitle>System Header</CardTitle>
      <Button variant="outline">Settings</Button>
    </CardHeader>
    <CardBody>
      <CardText>Content rests below the header boundary.</CardText>
    </CardBody>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 10. CardBody
// ---------------------------------------------------------------------------
export const SubComponentCardBody: Story = {
  name: 'Sub-Component: CardBody',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardBody>
        <CardTitle>Main Body Context</CardTitle>
        <CardText>The CardBody applies standardized 1.5rem padding to encapsulate primary text, forms, or content layouts.</CardText>
      </CardBody>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardBody>` acts as the primary content wrapper, ensuring standard, accessible padding (1.5rem / 24px) around text, forms, or internal layouts.',
      },
      source: {
        code: `import { Card, CardBody, CardTitle, CardText } from '@emeraldemperaur/mito-ui';

export const BodyExample = () => (
  <Card>
    <CardBody>
      <CardTitle>Main Body Context</CardTitle>
      <CardText>
        The CardBody applies standardized 1.5rem padding to encapsulate primary text, forms, or content layouts.
      </CardText>
    </CardBody>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 11. CardFooter
// ---------------------------------------------------------------------------
export const SubComponentCardFooter: Story = {
  name: 'Sub-Component: CardFooter',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardBody><CardText>Content requiring final action.</CardText></CardBody>
      <CardFooter justify="flex-end" gap={12} withBorder={true}>
        <Button variant="outline" darkBackgroundColor='#800020' darkTextColor='#ffffff' backgroundColor="#800020" textColor="#ffffff">Cancel</Button>
        <Button variant="material" darkBackgroundColor='#00072D' darkTextColor='#ffffff' backgroundColor="#00072D" textColor="#ffffff">Save Changes</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardFooter>` caps the bottom of the card. Like the header, it provides native flex properties and inherits border-radius constraints to prevent buttons or backgrounds from bleeding outside the bottom corners.',
      },
      source: {
        code: `import { Card, CardBody, CardText, CardFooter, Button } from '@emeraldemperaur/mito-ui';

export const FooterExample = () => (
  <Card>
    <CardBody>
      <CardText>Content requiring final action.</CardText>
    </CardBody>
    <CardFooter justify="flex-end" gap={12} withBorder={true}>
      <Button variant="outline">Cancel</Button>
      <Button variant="material">Save Changes</Button>
    </CardFooter>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 12. CardTitle
// ---------------------------------------------------------------------------
export const SubComponentCardTitle: Story = {
  name: 'Sub-Component: CardTitle',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardBody>
        <CardTitle>Semantic H5 Title Block</CardTitle>
      </CardBody>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardTitle>` renders a semantic `<h5>` tag by default. It manages its own margin-bottom to ensure optimal spacing from subtitles or paragraph text.',
      },
      source: {
        code: `import { Card, CardBody, CardTitle } from '@emeraldemperaur/mito-ui';

export const TitleExample = () => (
  <Card>
    <CardBody>
      <CardTitle>Semantic H5 Title Block</CardTitle>
    </CardBody>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 13. CardSubtitle
// ---------------------------------------------------------------------------
export const SubComponentCardSubtitle: Story = {
  name: 'Sub-Component: CardSubtitle',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardBody>
        <CardTitle>Main Title</CardTitle>
        <CardSubtitle>Semantic H6 Subtitle Block</CardSubtitle>
      </CardBody>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardSubtitle>` renders an `<h6>` tag with reduced opacity (0.7) and negative top-margin to nestle closely beneath a `CardTitle`.',
      },
      source: {
        code: `import { Card, CardBody, CardTitle, CardSubtitle } from '@emeraldemperaur/mito-ui';

export const SubtitleExample = () => (
  <Card>
    <CardBody>
      <CardTitle>Main Title</CardTitle>
      <CardSubtitle>Semantic H6 Subtitle Block</CardSubtitle>
    </CardBody>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 14. CardText
// ---------------------------------------------------------------------------
export const SubComponentCardText: Story = {
  name: 'Sub-Component: CardText',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardBody>
        <CardText>Paragraph one demonstrates standard 1.5 line height.</CardText>
        <CardText>Paragraph two demonstrates margin removal. As the `:last-child` of the container, its bottom margin is stripped to preserve perfect padding.</CardText>
      </CardBody>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardText>` renders a standard `<p>` tag. It includes a smart CSS selector (`:last-child { margin-bottom: 0 }`) to ensure it never breaks the bottom padding of the `CardBody`.',
      },
      source: {
        code: `import { Card, CardBody, CardText } from '@emeraldemperaur/mito-ui';

export const TextExample = () => (
  <Card>
    <CardBody>
      <CardText>Paragraph one demonstrates standard 1.5 line height.</CardText>
      <CardText>Paragraph two demonstrates margin removal. As the :last-child of the container, its bottom margin is stripped.</CardText>
    </CardBody>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 15. CardImage
// ---------------------------------------------------------------------------
export const SubComponentCardImage: Story = {
  name: 'Sub-Component: CardImage',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardImage position="top" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" alt="Header Layer" style={{ height: '100px' }} />
      <CardBody><CardText>Image clipped cleanly to the top corners.</CardText></CardBody>
      <CardImage position="bottom" src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop" alt="Footer Layer" style={{ height: '100px' }} />
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardImage>` accepts a `position` prop (`top` | `bottom` | `overlay`). This dynamically adjusts the border-radius mathematics so the image fits perfectly into the corners of the card without bleeding.',
      },
      source: {
        code: `import { Card, CardImage, CardBody, CardText } from '@emeraldemperaur/mito-ui';

export const ImageExample = () => (
  <Card>
    <CardImage position="top" src="/header.jpg" alt="Header Image" style={{ height: '100px' }} />
    <CardBody>
      <CardText>Image clipped cleanly to the top corners.</CardText>
    </CardBody>
    <CardImage position="bottom" src="/footer.jpg" alt="Footer Image" style={{ height: '100px' }} />
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 16. CardImageOverlay
// ---------------------------------------------------------------------------
export const SubComponentCardImageOverlay: Story = {
  name: 'Sub-Component: CardImageOverlay',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardImage position="overlay" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop" alt="Background" style={{ minHeight: '150px' }} />
      <CardImageOverlay>
        <CardTitle>Overlay Text</CardTitle>
        <CardText>Forces light text colors atop a dark frosted backdrop.</CardText>
      </CardImageOverlay>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardImageOverlay>` renders as an absolute-positioned bounding box with a `rgba(0,0,0,0.5)` background layer. It forces internal text components to render with high-contrast white tokens.',
      },
      source: {
        code: `import { Card, CardImage, CardImageOverlay, CardTitle, CardText } from '@emeraldemperaur/mito-ui';

export const OverlayExample = () => (
  <Card>
    <CardImage position="overlay" src="/background.jpg" alt="Background" style={{ minHeight: '150px' }} />
    <CardImageOverlay>
      <CardTitle>Overlay Text</CardTitle>
      <CardText>Forces light text colors atop a dark frosted backdrop.</CardText>
    </CardImageOverlay>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 17. CardListGroup
// ---------------------------------------------------------------------------
export const SubComponentCardListGroup: Story = {
  name: 'Sub-Component: CardListGroup',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardHeader><CardTitle>Edge-to-Edge List</CardTitle></CardHeader>
      <CardListGroup flush={true}>
        <CardListItem>Item Alpha</CardListItem>
        <CardListItem>Item Beta</CardListItem>
      </CardListGroup>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardListGroup>` maps to a `<ul>` tag. When `flush={true}` is set, it strips its own outer borders and rounded corners, allowing it to fuse directly to the sides of the outer Card container.',
      },
      source: {
        code: `import { Card, CardHeader, CardTitle, CardListGroup, CardListItem } from '@emeraldemperaur/mito-ui';

export const ListGroupExample = () => (
  <Card>
    <CardHeader>
      <CardTitle>Edge-to-Edge List</CardTitle>
    </CardHeader>
    <CardListGroup flush={true}>
      <CardListItem>Item Alpha</CardListItem>
      <CardListItem>Item Beta</CardListItem>
    </CardListGroup>
  </Card>
);`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 18. CardListItem
// ---------------------------------------------------------------------------
export const SubComponentCardListItem: Story = {
  name: 'Sub-Component: CardListItem',
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardListGroup flush={true}>
        <CardListItem style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Individual Item Rendering</span>
          <span style={{ padding: '2px 6px', backgroundColor: '#e2e8f0', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>Li</span>
        </CardListItem>
      </CardListGroup>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The `<CardListItem>` renders as an `<li>` tag with predefined standard padding (`1rem 1.5rem`) and manages its own internal border lines based on its position in the list.',
      },
      source: {
        code: `import { Card, CardListGroup, CardListItem } from '@emeraldemperaur/mito-ui';

export const ListItemExample = () => (
  <Card>
    <CardListGroup flush={true}>
      <CardListItem style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Individual Item Rendering</span>
        <span style={{ padding: '2px 6px', backgroundColor: '#e2e8f0', borderRadius: '4px', fontSize: '12px' }}>Li</span>
      </CardListItem>
    </CardListGroup>
  </Card>
);`,
      },
    },
  },
};