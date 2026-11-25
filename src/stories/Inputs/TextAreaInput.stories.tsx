import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextAreaInput, type TextAreaProps } from './TextAreaInput';
import { Form, Formik } from 'formik';
import { Row } from '../Layout/Row';


const meta: Meta<TextAreaProps> = {
  title: 'Inputs/TextAreaInput',
  component: TextAreaInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded', 
    docs: {
      description: {
        component: 'Master SSR-safe textarea component. Handles multi-line string state via Formik or controlled values, complete with macOS custom scrollbars, integrated Code Editing workflows via PrismJS, and Neumorphic 3D rendering.',
      },
    },
  },
  argTypes: {
    // ----------------------------------------------------------------------
    // CORE
    // ----------------------------------------------------------------------
    alias: {
      control: 'text',
      description: 'Unique identifier mapping the textarea to its Formik state and DOM label.',
      table: { category: 'Core', type: { summary: 'string' } }
    },
    value: {
      control: 'text',
      description: 'External fallback state value for standalone non-Formik setups.',
      table: { category: 'Core', type: { summary: 'string | number | readonly string[]' } }
    },
    onChange: {
      control: false,
      description: 'Unmasked raw string value callback for external state management.',
      table: { category: 'Core', type: { summary: '(value: string) => void' } }
    },
    placeholder: {
      control: 'text',
      description: 'Standard HTML placeholder text.',
      table: { category: 'Core', type: { summary: 'string' } }
    },
    readOnly: {
      control: 'boolean',
      description: 'Locks the textarea from user edits.',
      table: { category: 'Core', type: { summary: 'boolean' } }
    },
    
    // ----------------------------------------------------------------------
    // TEXTAREA SPECIFIC CONTROLS
    // ----------------------------------------------------------------------
    rows: {
      control: 'number',
      description: 'Physical row count dictating the initial vertical height.',
      table: { category: 'Textarea Specs', defaultValue: { summary: '4' }, type: { summary: 'number' } }
    },
    cols: {
      control: 'number',
      description: 'Physical column count dictating the character width threshold.',
      table: { category: 'Textarea Specs', type: { summary: 'number' } }
    },
    wrap: {
      control: 'select',
      options: ['soft', 'hard', 'off'],
      description: 'HTML wrap attribute behavior.',
      table: { category: 'Textarea Specs', type: { summary: "'soft' | 'hard' | 'off'" } }
    },
    lineHeight: {
      control: 'text',
      description: 'Typographic line-height override for legibility.',
      table: { category: 'Textarea Specs', defaultValue: { summary: '1.6' }, type: { summary: 'string | number' } }
    },

    // ----------------------------------------------------------------------
    // CODE SNIPPET CONTROLS
    // ----------------------------------------------------------------------
    sourceCode: {
      control: 'boolean',
      description: 'Optimizes typography and padding for code. Swaps native textarea for a PrismJS powered code editor with synchronized line numbers.',
      table: { category: 'Code Editor', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    sourceLang: {
      control: 'text',
      description: 'String identifier of the programming language (e.g., "typescript", "bash", "json"). Injects syntax highlighting and a sleek language badge.',
      table: { category: 'Code Editor', type: { summary: 'string' } }
    },

    // ----------------------------------------------------------------------
    // LABELS & HINTS
    // ----------------------------------------------------------------------
    inputLabel: {
      control: 'text',
      description: 'Text rendered above the textarea or floating over the border.',
      table: { category: 'Labels & Hints', type: { summary: 'string' } }
    },
    floatingLabel: {
      control: 'boolean',
      description: 'Toggles the interactive floating label animation (primarily used with the outline variant).',
      table: { category: 'Labels & Hints', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    isHinted: {
      control: 'boolean',
      description: 'Toggles an active hint tooltip next to the label.',
      table: { category: 'Labels & Hints', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    hintText: {
      control: 'text',
      description: 'The informational text displayed inside the hint tooltip.',
      table: { category: 'Labels & Hints', type: { summary: 'string' } }
    },
    hintUrl: {
      control: 'text',
      description: 'Optional URL to open when the hint tooltip icon is clicked.',
      table: { category: 'Labels & Hints', type: { summary: 'string' } }
    },

    // ----------------------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------------------
    errorText: {
      control: 'text',
      description: 'Explicit error message string. Overrides Formik validation errors if provided.',
      table: { category: 'Validation', type: { summary: 'string' } }
    },

    // ----------------------------------------------------------------------
    // AESTHETIC & DESIGN CONTROLS
    // ----------------------------------------------------------------------
    design: {
      control: 'select',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'The core architectural design variant of the textarea field.',
      table: { category: 'Aesthetic & Design', defaultValue: { summary: "'outline'" }, type: { summary: 'string' } }
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system or parent theme contexts.',
      table: { category: 'Aesthetic & Design', defaultValue: { summary: 'false' }, type: { summary: 'boolean' } }
    },
    backgroundColor: { control: 'color', description: 'Dynamic base background color for light mode.', table: { category: 'Aesthetic & Design', type: { summary: 'string' } } },
    darkBackgroundColor: { control: 'color', description: 'Dynamic base background color specifically for dark mode contexts.', table: { category: 'Aesthetic & Design', type: { summary: 'string' } } },
    textColor: { control: 'color', description: 'Standard text color for light mode.', table: { category: 'Aesthetic & Design', type: { summary: 'string' } } },
    darkTextColor: { control: 'color', description: 'Standard text color specifically for dark mode contexts.', table: { category: 'Aesthetic & Design', type: { summary: 'string' } } },
    errorTextColor: { control: 'color', description: 'Validation failure text color for light mode.', table: { category: 'Aesthetic & Design', type: { summary: 'string' } } },
    darkErrorTextColor: { control: 'color', description: 'Validation failure text color for dark mode.', table: { category: 'Aesthetic & Design', type: { summary: 'string' } } },
    activeColor: { control: 'color', description: 'Highlight color applied to the active/focused border.', table: { category: 'Aesthetic & Design', type: { summary: 'string' } } },
    fontFamily: { control: 'text', description: 'Font family override. (Ignored if sourceCode=true).', table: { category: 'Aesthetic & Design', type: { summary: 'string' } } },

    // ----------------------------------------------------------------------
    // LAYOUT & UNIVERSAL
    // ----------------------------------------------------------------------
    width: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Viewport column width configuration value (1 to 12).',
      table: { category: 'Layout & Universal', defaultValue: { summary: '12' }, type: { summary: 'number' } }
    },
    newRow: {
      control: 'boolean',
      description: 'Forces container layouts to break downward onto a fresh structural row line.',
      table: { category: 'Layout & Universal', type: { summary: 'boolean' } }
    },
    className: { control: 'text', description: 'Specific custom style class selector appended to the root container.', table: { category: 'Layout & Universal', type: { summary: 'string' } } },
    style: { control: 'object', description: 'Inline modification style rules object.', table: { category: 'Layout & Universal', type: { summary: 'React.CSSProperties' } } },
    asChild: { control: 'boolean', description: 'Delegates rendering to the immediate child element via Radix Slot.', table: { category: 'Layout & Universal', type: { summary: 'boolean' } } },
    formikContext: { control: false, description: 'Explicit Formik context object injected for nested step fields.', table: { category: 'Layout & Universal', type: { summary: 'FormikContextType<any>' } } },
  },
  args: {
    alias: 'example-textarea',
    design: 'outline',
    rows: 4,
    sourceCode: false,
    floatingLabel: false,
    darkMode: false,
    width: 12,
  }
};

export default meta;
type Story = StoryObj<TextAreaProps>;

// ---------------------------------------------------------------------------
// 1. PLAYGROUND
// ---------------------------------------------------------------------------
export const Playground: Story = {
  render: (args) => {
    const [val, setVal] = useState('');
    return (
      <div style={{ padding: '32px', backgroundColor: args.darkMode ? '#0f172a' : '#ffffff', borderRadius: '12px', maxWidth: '800px' }}>
        <TextAreaInput 
          {...args} 
          value={val}
          onChange={(newVal) => setVal(newVal)}
        />
      </div>
    );
  },
  args: {
    inputLabel: 'System Prompts',
    placeholder: 'Enter foundational agent instructions...',
  },
  parameters: {
    docs: {
      description: {
        story: 'The baseline interactive component playground. Note the native macOS custom scrollbar styling injected directly into the textarea wrapper.',
      },
      source: {
        code: `
import { useState } from 'react';
import { TextAreaInput } from '@emeraldemperaur/mito-ui';

export const Playground = () => {
  const [val, setVal] = useState('');

  return (
    <TextAreaInput 
      alias="system-prompts"
      inputLabel="System Prompts"
      placeholder="Enter foundational agent instructions..."
      value={val}
      onChange={setVal}
      design="outline"
    />
  );
};
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 2. PRISMJS CODE EDITOR
// ---------------------------------------------------------------------------
const mockCode = `function calculateTrajectory(velocity, angle) {
  const g = 9.81;
  const radians = angle * (Math.PI / 180);
  
  // Calculate maximum height
  const maxHeight = Math.pow(velocity * Math.sin(radians), 2) / (2 * g);
  
  return maxHeight;
}`;

export const SourceCodeEditor: Story = {
  render: () => {
    const [code, setCode] = useState(mockCode);
    return (
      <div style={{ padding: '32px', backgroundColor: '#1e293b', borderRadius: '12px', maxWidth: '800px' }}>
        <TextAreaInput 
          alias="flight-algorithm"
          inputLabel="Orbital Trajectory Algorithm"
          sourceCode={true}
          sourceLang="javascript"
          darkMode={true}
          value={code}
          onChange={setCode}
          rows={10}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Setting `sourceCode={true}` completely hot-swaps the underlying native textarea for a fully functional PrismJS code editor, complete with a synchronized line-number gutter and syntax highlighting badge.',
      },
      source: {
        code: `
import { useState } from 'react';
import { TextAreaInput } from '@emeraldemperaur/mito-ui';

export const CodeSnippetEditor = () => {
  const [code, setCode] = useState("function init() { return true; }");

  return (
    <TextAreaInput 
      alias="flight-algorithm"
      inputLabel="Orbital Trajectory Algorithm"
      sourceCode={true}
      sourceLang="javascript"
      darkMode={true}
      value={code}
      onChange={setCode}
      rows={10}
    />
  );
};
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 3. ARCHITECTURAL VARIANTS
// ---------------------------------------------------------------------------
export const ArchitecturalVariants: Story = {
  render: () => {
    const [outlineValue, setOutlineValue] = useState('');
    const [materialValue, setMaterialValue] = useState('');
    const [neumorphicValue, setNeumorphicValue] = useState('');
    const [skeuomorphicValue, setSkeumorphicValue] = useState('');
    return(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '48px', backgroundColor: '#e2e8f0', borderRadius: '16px', maxWidth: '800px' }}>
      
      <TextAreaInput 
        alias="var-outline"
        inputLabel="Outline Variant (with Floating Label)"
        floatingLabel={true}
        design="outline"
        placeholder="Enter data here..."
        value={outlineValue}
        onChange={(value) => setOutlineValue(value)}
      />

      <TextAreaInput 
        alias="var-material"
        inputLabel="Material Variant"
        design="material"
        placeholder=" Standard underline aesthetic..."
        value={materialValue}
        onChange={(value) => setMaterialValue(value)}
      />

      <TextAreaInput 
        alias="var-neumorphic"
        inputLabel="Neumorphic Variant"
        design="neumorphic"
        placeholder="Ambient 3D inset shadow..."
        backgroundColor="#e2e8f0"
        value={neumorphicValue}
        onChange={(value) => setNeumorphicValue(value)}
      />

      <TextAreaInput 
        alias="var-skeuomorphic"
        inputLabel="Skeuomorphic Variant"
        design="skeuomorphic"
        placeholder="High-fidelity mechanical input well..."
        backgroundColor="#e2e8f0"
        value={skeuomorphicValue}
        onChange={(value) => setSkeumorphicValue(value)}
      />

    </div>
)},
  parameters: {
    docs: {
      description: {
        story: 'Showcases all 4 core architectural design structures. Notice how Neumorphic and Skeuomorphic dynamically adjust their internal drop-shadows to match the `backgroundColor` of their parent container.',
      },
      source: {
        code: `
import { TextAreaInput } from '@emeraldemperaur/mito-ui';

export const VariantShowcase = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', background: '#e2e8f0' }}>
    <TextAreaInput alias="t1" design="outline" floatingLabel={true} inputLabel="Outline" />
    <TextAreaInput alias="t2" design="material" inputLabel="Material" />
    <TextAreaInput alias="t3" design="neumorphic" inputLabel="Neumorphic" backgroundColor="#e2e8f0" />
    <TextAreaInput alias="t4" design="skeuomorphic" inputLabel="Skeuomorphic" backgroundColor="#e2e8f0" />
  </div>
);
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 4. HINTS & VALIDATION
// ---------------------------------------------------------------------------
export const HintsAndValidation: Story = {
  render: () => {
    const [val, setVal] = useState('INVALID_PAYLOAD_X99');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '32px', backgroundColor: '#ffffff', borderRadius: '12px', maxWidth: '800px' }}>
        <TextAreaInput 
          alias="secure-key"
          inputLabel="RSA Encryption Key"
          design="outline"
          isHinted={true}
          hintText="Must be a valid 2048-bit PEM encoded string."
          hintUrl="https://en.wikipedia.org/wiki/RSA_(cryptosystem)"
          placeholder="-----BEGIN PUBLIC KEY-----..."
        />

        <TextAreaInput 
          alias="sys-override"
          inputLabel="System Override Authorization"
          design="outline"
          value={val}
          onChange={setVal}
          errorText="Authorization string contains illegal characters."
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the `isHinted` tooltips for complex developer workflows, and the explicit `errorText` prop which forces the component into a critical validation state with red borders and icons.',
      },
      source: {
        code: `
import { useState } from 'react';
import { TextAreaInput } from '@emeraldemperaur/mito-ui';

export const AdvancedFields = () => {
  const [val, setVal] = useState('INVALID_PAYLOAD_X99');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <TextAreaInput 
        alias="secure-key"
        inputLabel="RSA Encryption Key"
        isHinted={true}
        hintText="Must be a valid 2048-bit PEM encoded string."
        hintUrl="https://en.wikipedia.org/wiki/RSA_(cryptosystem)"
        placeholder="-----BEGIN PUBLIC KEY-----..."
      />

      <TextAreaInput 
        alias="sys-override"
        inputLabel="System Override Authorization"
        value={val}
        onChange={setVal}
        errorText="Authorization string contains illegal characters."
      />
    </div>
  );
};
        `
      }
    }
  }
};

// ---------------------------------------------------------------------------
// 5. CODE EDITOR DOWNSTREAM FLOW (VALIDATION, COPY & RAW SUBMISSION)
// ---------------------------------------------------------------------------
const defaultFlightScript = `def patrol_sector(altitude_m=120):
    print(f"UAV climbing to {altitude_m}m")
    return {"status": "patrolling", "altitude": altitude_m}`;

export const CodeEditorDownstreamFlow: Story = {
  render: (args) => {
    const [deployedCode, setDeployedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = (code: string) => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    };

    return (
      <Formik
        initialValues={{ myCode: defaultFlightScript }}
        validate={(values) => {
          const errors: Record<string, string> = {};
          if (!values.myCode.trim()) {
            errors.myCode = 'Script cannot be empty.';
          } else if (values.myCode.includes('rm -rf') || values.myCode.includes('os.system')) {
            errors.myCode = 'Destructive or restricted shell commands are blocked.';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setDeployedCode(values.myCode);
          setSubmitting(false);
        }}
      >
        {(formikProps) => {
          const lineCount = formikProps.values.myCode.split('\n').length;
          const charCount = formikProps.values.myCode.length;

          return (
            <Form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxWidth: '800px',
                width: '100%',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <div
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #1e293b',
                }}
              >
                <TextAreaInput
                  alias="myCode"
                  inputLabel="Autonomous Flight Script"
                  sourceCode={true}
                  sourceLang="python"
                  darkMode={true}
                  design={args.design}
                  isHinted
                  hintText="Try typing 'rm -rf' or 'os.system' to trigger live validation."
                  rows={8}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={formikProps.isSubmitting}
                      style={{
                        padding: '9px 18px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Deploy Script
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(formikProps.values.myCode)}
                      style={{
                        padding: '9px 16px',
                        backgroundColor: '#1e293b',
                        color: '#e2e8f0',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        fontWeight: 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    {lineCount} {lineCount === 1 ? 'line' : 'lines'} · {charCount} chars
                  </span>
                </div>
              </div>

              {deployedCode !== null && (
                <div
                  style={{
                    backgroundColor: '#020617',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #1e293b',
                    fontFamily: 'monospace',
                  }}
                >
                  <span
                    style={{
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Downstream Payload Received (Raw Unescaped String)
                  </span>
                  <pre
                    style={{
                      margin: '10px 0 0 0',
                      fontSize: '13px',
                      color: '#e2e8f0',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5,
                    }}
                  >
                    {deployedCode}
                  </pre>
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    );
  },
  args: {
    design: 'outline',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a complete downstream code-editing workflow inside Formik: blocking restricted commands in `validate`, reading `formikProps.values.myCode` in real time for clipboard copy and character/line metrics, and consuming the clean, unescaped raw string inside `onSubmit`.',
      },
      source: {
        code: `import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { TextAreaInput } from '@emeraldemperaur/mito-ui';

const defaultFlightScript = \`def patrol_sector(altitude_m=120):
    print(f"UAV climbing to {altitude_m}m")
    return {"status": "patrolling", "altitude": altitude_m}\`;

export const ScriptEditorForm = () => {
  const [deployedCode, setDeployedCode] = useState<string | null>(null);

  return (
    <Formik
      initialValues={{ myCode: defaultFlightScript }}
      validate={(values) => {
        const errors: Record<string, string> = {};
        if (!values.myCode.trim()) {
          errors.myCode = 'Script cannot be empty.';
        } else if (values.myCode.includes('rm -rf') || values.myCode.includes('os.system')) {
          errors.myCode = 'Destructive or restricted shell commands are blocked.';
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        // values.myCode is a clean, unescaped string ready for APIs or execution engines
        setDeployedCode(values.myCode);

        // Example API call:
        // await fetch('/api/execute-script', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ language: 'python', script: values.myCode }),
        // });

        setSubmitting(false);
      }}
    >
      {(formikProps) => (
        <Form>
          <TextAreaInput
            alias="myCode"
            inputLabel="Autonomous Flight Script"
            sourceCode={true}
            sourceLang="python"
            darkMode={true}
            rows={8}
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button type="submit" disabled={formikProps.isSubmitting}>
              Deploy Script
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(formikProps.values.myCode)}
            >
              Copy Code ({formikProps.values.myCode.length} chars)
            </button>
          </div>

          {deployedCode && <pre>{deployedCode}</pre>}
        </Form>
      )}
    </Formik>
  );
};`,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 6. FORMIK INTEGRATION
// ---------------------------------------------------------------------------

/**
 * **Interactive Form Pipeline:**
 * Showcases automatic Formik context binding via `alias`. When rendered inside a `<Formik>` tree
 * (or passed `formikContext` explicitly), `TextAreaInput` automatically synchronizes `values`, `touched`,
 * and `errors` using `getIn(context, alias)`—including nested dot-notation paths and PrismJS `sourceCode` editors.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          agent: {
            systemPrompt: '',
            safetyNotes: '',
          },
          toolConfig: '{\n  "maxRetries": 3,\n  "timeoutMs": 5000\n}',
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};

          if (!values.agent.systemPrompt || values.agent.systemPrompt.trim().length < 20) {
            errors.agent = {
              ...errors.agent,
              systemPrompt: 'System prompt must be at least 20 characters.',
            };
          }

          if (!values.agent.safetyNotes) {
            errors.agent = {
              ...errors.agent,
              safetyNotes: 'Safety guardrails are required before deployment.',
            };
          }

          if (!values.toolConfig) {
            errors.toolConfig = 'JSON configuration payload is required.';
          } else {
            try {
              JSON.parse(values.toolConfig);
            } catch {
              errors.toolConfig = 'Invalid JSON syntax. Please check brackets and quotes.';
            }
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          alert(`Form Submitted Successfully:\n${JSON.stringify(values, null, 2)}`);
          setSubmitting(false);
        }}
      >
        {(formikProps) => (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '100%',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                padding: '16px',
                color: '#f8fafc',
                fontFamily: 'monospace',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <span
                style={{
                  color: '#fb7185',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Live Formik State & Validation Errors
              </span>
              <pre
                style={{
                  margin: '8px 0 0 0',
                  fontSize: '12px',
                  color: '#93c5fd',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {JSON.stringify(
                  {
                    values: formikProps.values,
                    errors: formikProps.errors,
                    touched: formikProps.touched,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Row gap="4">
                <TextAreaInput
                  alias="agent.systemPrompt"
                  inputLabel="Agent System Prompt"
                  placeholder="Define the autonomous agent's core directives and persona..."
                  rows={4}
                  design={args.design}
                  width={6}
                />
                <TextAreaInput
                  alias="agent.safetyNotes"
                  inputLabel="Safety & Escalation Guardrails"
                  placeholder="Specify fallback protocols and human-in-the-loop triggers..."
                  rows={4}
                  isHinted
                  hintText="Required for production agent deployments."
                  design={args.design}
                  width={6}
                />
                <TextAreaInput
                  alias="toolConfig"
                  inputLabel="MCP Tooling Config (JSON)"
                  sourceCode={true}
                  sourceLang="json"
                  isHinted
                  hintText="Must be a valid JSON object. Try breaking the syntax to trigger validation."
                  design={args.design}
                  width={12}
                  newRow
                />
              </Row>

              <button
                type="submit"
                disabled={formikProps.isSubmitting}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Validate & Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  },
  args: {
    design: 'outline',
  },
  parameters: {
    useRow: false,
    docs: {
      description: {
        story:
          'Showcases automatic Formik context binding via `alias` for both standard multi-line textareas (with nested dot-notation paths like `agent.systemPrompt`) and the PrismJS `sourceCode` JSON editor with live syntax validation.',
      },
      source: {
        code: `import React from 'react';
import { Formik, Form } from 'formik';
import { TextAreaInput, Row } from '@emeraldemperaur/mito-ui';

export const FormikTextAreaPipeline = () => {
  return (
    <Formik
      initialValues={{
        agent: { systemPrompt: '', safetyNotes: '' },
        toolConfig: '{\\n  "maxRetries": 3,\\n  "timeoutMs": 5000\\n}',
      }}
      validate={(values) => {
        const errors: Record<string, any> = {};

        if (!values.agent.systemPrompt || values.agent.systemPrompt.trim().length < 20) {
          errors.agent = { ...errors.agent, systemPrompt: 'System prompt must be at least 20 characters.' };
        }

        if (!values.agent.safetyNotes) {
          errors.agent = { ...errors.agent, safetyNotes: 'Safety guardrails are required before deployment.' };
        }

        if (!values.toolConfig) {
          errors.toolConfig = 'JSON configuration payload is required.';
        } else {
          try {
            JSON.parse(values.toolConfig);
          } catch {
            errors.toolConfig = 'Invalid JSON syntax. Please check brackets and quotes.';
          }
        }

        return errors;
      }}
      onSubmit={(values) => console.log('Submitted:', values)}
    >
      <Form>
        <Row gap="4">
          <TextAreaInput alias="agent.systemPrompt" inputLabel="Agent System Prompt" rows={4} width={6} />
          <TextAreaInput alias="agent.safetyNotes" inputLabel="Safety & Escalation Guardrails" rows={4} width={6} />
          <TextAreaInput
            alias="toolConfig"
            inputLabel="MCP Tooling Config (JSON)"
            sourceCode={true}
            sourceLang="json"
            width={12}
            newRow
          />
        </Row>
        <button type="submit">Validate & Submit</button>
      </Form>
    </Formik>
  );
};`,
      },
    },
  },
};