import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextAreaInput, type TextAreaProps } from './TextAreaInput';


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
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '48px', backgroundColor: '#e2e8f0', borderRadius: '16px', maxWidth: '800px' }}>
      
      <TextAreaInput 
        alias="var-outline"
        inputLabel="Outline Variant (with Floating Label)"
        floatingLabel={true}
        design="outline"
        placeholder="Enter data here..."
      />

      <TextAreaInput 
        alias="var-material"
        inputLabel="Material Variant"
        design="material"
        placeholder=" Standard underline aesthetic..."
      />

      <TextAreaInput 
        alias="var-neumorphic"
        inputLabel="Neumorphic Variant"
        design="neumorphic"
        placeholder="Ambient 3D inset shadow..."
        backgroundColor="#e2e8f0"
      />

      <TextAreaInput 
        alias="var-skeuomorphic"
        inputLabel="Skeuomorphic Variant"
        design="skeuomorphic"
        placeholder="High-fidelity mechanical input well..."
        backgroundColor="#e2e8f0"
      />

    </div>
  ),
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