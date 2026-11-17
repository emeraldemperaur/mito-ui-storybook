import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form, Field } from 'formik';
import { Container } from './Container';
import { Row } from './Row';
import { Column } from './Column';
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const DivBox = ({ children, height = '80px', bg = '#e5e7eb', color = '#374151', border = '1px solid #d1d5db' }: any) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height,
    backgroundColor: bg,
    color,
    border,
    borderRadius: '6px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    textAlign: 'center'
  }}>
    {children}
  </div>
);

type LayoutStoryArgs = React.ComponentProps<typeof Container> & {
  rowGap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  colSpan?: number;
};

/**
 * Enterprise layout primitives. The Layout system is a strictly controlled CSS Grid architecture 
 * consisting of `Container`, `Row`, and `Column`. Agents and developers must use these primitives 
 * for all page-level and component-level layouts to prevent WCAG violations and DOM fractures.
 */
const meta: Meta<LayoutStoryArgs> = {
  title: 'Layout/Grid System',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The `Container` establishes maximum width boundaries and Formik boundaries. The `Row` strictly enforces a 12-column grid. The `Column` maps semantic responsive props directly to CSS grid-column tracks.',
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode.replace(/render:.*?\(\)\s*=>\s*/, '').replace(/^\{\s*(<Container)/, '$1').replace(/(<\/Container>)\s*\}$/, '$1');
          const importStatement = `import { Container, Row, Column } from '@emeraldemepraur/mito-ui';\n\n`;
          return `${importStatement}${cleanCode.trim()}`;
        },
      },
    },
  },
  argTypes: {
    // --- Container Props ---
    fluid: {
      control: 'boolean',
      description: 'Enables fluid width (100% of parent) instead of snapping to fixed breakpoints. Translates semantic ARIA role to `region`.',
      table: { category: 'Container' },
    },
    size: {
      control: 'select',
      options: ['1', '2', '3', '4'],
      description: 'Fixed maximum width boundary size (Radix scale). Ignored if `fluid` is true.',
      table: { category: 'Container', defaultValue: { summary: '3' } },
    },
    
    // --- Row Props ---
    rowGap: {
      name: 'gap (Row)',
      control: 'select',
      options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      description: 'Buffer spacing between columns based on the radix spacing scale.',
      table: { category: 'Row Props' },
    },

    // --- Column Props ---
    colSpan: {
      name: 'span (Column)',
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Base column width spanning across grid boundaries (1 to 12).',
      table: { category: 'Column Props' },
    },
  },
  args: {
    fluid: false,
    size: '3',
    rowGap: '4',
    colSpan: 4,
  },
  decorators: [
    (Story) => (
      <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 0' }}>
          <Story />
        </div>
      </GlobalUIContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<LayoutStoryArgs>;

// ---------------------------------------------------------------------------
// CORE LAYOUTS
// ---------------------------------------------------------------------------

export const FixedContainerGrid: Story = {
  render: ({ rowGap, colSpan = 4, ...args }) => (
    <Container {...args}>
      <Row gap={rowGap}>
        <Column span={colSpan}><DivBox>Column {colSpan}</DivBox></Column>
        <Column span={colSpan}><DivBox>Column {colSpan}</DivBox></Column>
        <Column span={colSpan}><DivBox>Column {colSpan}</DivBox></Column>
        {colSpan < 4 && <Column span={colSpan}><DivBox>Column {colSpan}</DivBox></Column>}
      </Row>
    </Container>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A standard fixed-width container locking its contents to a centered maximal width boundary (`size="3"`). Demonstrates a basic 3-column split.',
      },
    },
  },
};

export const FluidContainerGrid: Story = {
  render: ({ rowGap, ...args }) => (
    <Container {...args}>
      <Row gap={rowGap}>
        <Column span={3}><DivBox>Sidebar (Span 3)</DivBox></Column>
        <Column span={9}><DivBox>Main Content (Span 9)</DivBox></Column>
      </Row>
    </Container>
  ),
  args: {
    fluid: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Bypasses the fixed breakpoints to consume 100% of the available horizontal viewport width. Essential for edge-to-edge dashboard layouts.',
      },
    },
  },
};

export const AsymmetricAndNewLines: Story = {
  render: ({ rowGap, ...args }) => (
    <Container {...args}>
      <Row gap={rowGap}>
        <Column span={8}><DivBox>Span 8</DivBox></Column>
        <Column span={4}><DivBox>Span 4</DivBox></Column>
        
        <Column span={6} newLine><DivBox bg="#dbeafe" border="1px solid #93c5fd">Span 6 (newLine=true)</DivBox></Column>
        <Column span={6}><DivBox>Span 6</DivBox></Column>
      </Row>
    </Container>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates asymmetrical tracking and the `newLine` prop on `Column`, which strictly forces the element to Grid Line 1 regardless of available preceding space.',
      },
    },
  },
};

export const ResponsiveBreakpoints: Story = {
  render: ({ rowGap, ...args }) => (
    <Container {...args}>
      <Row gap={rowGap}>
        <Column xs={12} md={6} lg={3}><DivBox bg="#fce7f3" border="1px solid #f9a8d4">A (xs=12, md=6, lg=3)</DivBox></Column>
        <Column xs={12} md={6} lg={3}><DivBox bg="#fce7f3" border="1px solid #f9a8d4">B (xs=12, md=6, lg=3)</DivBox></Column>
        <Column xs={12} md={6} lg={3}><DivBox bg="#fce7f3" border="1px solid #f9a8d4">C (xs=12, md=6, lg=3)</DivBox></Column>
        <Column xs={12} md={6} lg={3}><DivBox bg="#fce7f3" border="1px solid #f9a8d4">D (xs=12, md=6, lg=3)</DivBox></Column>
      </Row>
    </Container>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shrink the viewport to observe the `Column` semantic breakpoints in action. Maps intelligently to standard device boundaries (xs, sm, md, lg, xl).',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// FORMIK & STATE BOUNDARIES
// ---------------------------------------------------------------------------

/**
 * **Interactive Form Context Boundary:**
 * The `Container` natively accepts `formikContext` and propagates it via a `FormikProvider` to all deeply nested UI primitives. 
 * Type into the inputs to observe the state update without manual drilling.
 */
export const InteractiveFormTest: Story = {
  render: ({ rowGap, ...args }) => {
    return (
      <Formik 
        initialValues={{ firstName: '', lastName: '', email: ''}} 
        onSubmit={(values, { setSubmitting }) => {
          alert(`Form Submitted: \n${JSON.stringify(values, null, 2)}`);
          setSubmitting(false);
        }}
      >
        {(formikProps) => (
          <Form style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <Container 
              {...args} 
              formikContext={formikProps} 
              themeOverrides={{ light: 'transparent', dark: 'transparent' }}
            >

              <div style={{ 
                backgroundColor: '#1e293b', 
                borderRadius: '8px', 
                padding: '20px', 
                color: '#f8fafc', 
                fontFamily: 'monospace',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                marginBottom: '24px'
              }}>
                <span style={{ color: '#fb7185', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Formik State Monitor</span>
                <pre style={{ margin: 0, marginTop: '12px', fontSize: '13px', color: '#93c5fd' }}>
                  {JSON.stringify(formikProps.values, null, 2)}
                </pre>
              </div>
              
              <div style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '12px', 
                padding: '32px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#111827', fontWeight: '600' }}>Account Registration</h2>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Please fill out your details to provision your enterprise workspace.</p>
                </div>
                
                <Row gap={rowGap}>
                  <Column xs={12} md={6}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>First Name</label>
                      <Field 
                        name="firstName" 
                        style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)' }} 
                        placeholder="Jane" 
                      />
                    </div>
                  </Column>
                  <Column xs={12} md={6}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Last Name</label>
                      <Field 
                        name="lastName" 
                        style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)' }} 
                        placeholder="Doe" 
                      />
                    </div>
                  </Column>
                  <Column span={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Email Address</label>
                      <Field 
                        name="email" 
                        type="email" 
                        style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)' }} 
                        placeholder="jane@enterprise.com" 
                      />
                    </div>
                  </Column>
                  <Column span={12} newLine>
                    <button 
                      type="submit" 
                      disabled={formikProps.isSubmitting}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: '#0f172a', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        cursor: 'pointer',
                        marginTop: '8px',
                        transition: 'opacity 0.2s',
                        opacity: formikProps.isSubmitting ? 0.7 : 1
                      }}
                    >
                      Submit Payload
                    </button>
                  </Column>
                </Row>
              </div>

            </Container>
          </Form>
        )}
      </Formik>
    );
  },
  args: {
    size: '2',
  },
  parameters: {
    docs: {
      source: {
        code: `import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Container, Row, Column } from '@emeraldemepraur/mito-ui';

export const FormikLayoutExample = () => {
  return (
    <Formik
      initialValues={{ firstName: '', lastName: '' }}
      onSubmit={(values) => console.log(values)}
    >
      {(formikProps) => (
        <Form>
          <Container formikContext={formikProps} size="2">
            <Row gap="4">
              <Column xs={12} md={6}>
                <Field name="firstName" placeholder="First Name" />
              </Column>
              <Column xs={12} md={6}>
                <Field name="lastName" placeholder="Last Name" />
              </Column>
              <Column span={12}>
                <button type="submit">Submit</button>
              </Column>
            </Row>
          </Container>
        </Form>
      )}
    </Formik>
  );
};`,
      },
    },
  },
};