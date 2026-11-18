import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Formik, Form } from 'formik';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { FileInput, type FileInputProps } from './FileInput';
import { Row } from '../Layout/Row'; 
import { ACCEPTED_FORMATS, ACCEPTED_EXTENSIONS } from '../../utils/Vinci'; 
import { GlobalUIContext } from '../Layout/GlobalUIContext';

const CloudUploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 3 0 5 1 7 2a1 1 0 0 1 1 1z" />
  </svg>
);

const StatefulFileInput = (args: FileInputProps) => {
  const [val, setVal] = useState<File | File[] | null>(args.value || (args.multiple ? [] : null));

  return (
    <FileInput
      {...args}
      value={val}
      onChange={(newVal) => {
        setVal(newVal);
        args.onChange?.(newVal);
      }}
    />
  );
};

const formattedFormats = ACCEPTED_FORMATS.split(',').map(f => `\`${f}\``).join(' ');
const formattedExtensions = ACCEPTED_EXTENSIONS.split(',').map(e => `\`${e}\``).join(' ');

/**
 * Enterprise file dropzone primitive. Seamlessly handles single files or batched arrays, 
 * automatically generates object URLs for image previews, and parses standard MIME types. 
 * Replaces native HTML `<input type="file">` elements with rich Radix-powered interactive cards.
 */
const meta: Meta<FileInputProps> = {
  title: 'Inputs/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Use \`FileInput\` for document vaults, avatars, and attachments. It yields native JS \`File\` objects directly to Formik state or local state.

### Default Accepted Formats Reference
By default, the component restricts selection using these constants (which can be overridden via the \`accept\` prop):

| Selection Mode | Configuration Constant | Supported Types & Extensions |
| :--- | :--- | :--- |
| **Single-File** (\`multiple={false}\`) | \`ACCEPTED_FORMATS\` | ${formattedFormats} |
| **Multi-File** (\`multiple={true}\`) | \`ACCEPTED_EXTENSIONS\` | ${formattedExtensions} |
`,
      },
      source: {
        transform: (code: string) => {
          let cleanCode = code.replace(/StatefulFileInput/g, 'FileInput');
          cleanCode = cleanCode.replace(/import\s+.*?from\s+['"].*?['"];?[\r\n]*/g, '');
          cleanCode = cleanCode
            .replace(/render:.*?\(\)\s*=>\s*/, '')
            .replace(/^\{\s*(<FileInput)/, '$1')
            .replace(/(<FileInput[\s\S]*?\/>)\s*\}$/, '$1');
          const importStatement = `import { FileInput } from '@emeraldemepraur/mito-ui';\n\n`;
          return `${importStatement}${cleanCode.trim()}`;
        },
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1f2937' },
      ],
    },
  },
  argTypes: {
    // --- Core Identity & Mode ---
    alias: {
      control: 'text',
      description: 'Required unique identifier mapping the input to its Formik state and DOM label.',
      table: { category: 'Core & Identity' },
    },
    multiple: {
      control: 'boolean',
      description: 'Toggles standard single file payload (`File`) vs batch multi-file array payload (`File[]`).',
      table: { category: 'Core & Identity', defaultValue: { summary: 'false' } },
    },
    preview: {
      control: 'boolean',
      description: 'Automatically generates internal object URLs to preview images natively inside the file cards.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'true' } },
    },
    accept: {
      control: 'text',
      description: 'Overwrites the standard `ACCEPTED_FORMATS` / `ACCEPTED_EXTENSIONS` constants to restrict selection to specific MIME types or extensions (e.g., `image/png, .pdf`).',
      table: { category: 'Core & Identity' },
    },
    inputLabel: {
      control: 'text',
      description: 'Text rendered statically above the dropzone or animated into the header.',
      table: { category: 'Core & Identity' },
    },
    helperText: {
      control: 'text',
      description: 'Descriptive text outlining supported formats or instructions, displayed beneath the main dropzone label.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'Supports PDF, Images, Excel, JSON, ZIP' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Locks the component to prevent user interaction and file manipulation, rendering a disabled visual state while preserving previews.',
      table: { category: 'Core & Identity', defaultValue: { summary: 'false' } },
    },

    // --- Design System & Labels ---
    design: {
      control: 'radio',
      options: ['outline', 'material', 'neumorphic', 'skeuomorphic'],
      description: 'Core architectural design variant of the dropzone area and the generated file cards.',
      table: { category: 'Design System', defaultValue: { summary: 'outline' } },
    },
    floatingLabel: {
      control: 'boolean',
      description: 'Toggles the interactive floating label animation.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },
    darkMode: {
      control: 'boolean',
      description: 'Forces the component into dark mode, overriding system or parent theme contexts.',
      table: { category: 'Design System', defaultValue: { summary: 'false' } },
    },

    // --- Icons ---
    icon: {
      control: 'select',
      options: ['None', 'CloudUpload', 'Shield'],
      mapping: {
        None: undefined,
        CloudUpload: <CloudUploadIcon />,
        Shield: <ShieldIcon />,
      },
      description: 'Optional custom icon node rendered inside the dropzone avatar bubble.',
      table: { category: 'Icons' },
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Determines if the icon bubble is placed on the left (leading) or right (trailing).',
      table: { category: 'Icons', defaultValue: { summary: 'left' } },
    },

    // --- Validation & Hints ---
    isHinted: {
      control: 'boolean',
      description: 'Toggles an active hint tooltip trigger icon next to the static label.',
      table: { category: 'Validation & Hints', defaultValue: { summary: 'false' } },
    },
    hintText: {
      control: 'text',
      description: 'The informational text displayed inside the hint tooltip.',
      table: { category: 'Validation & Hints' },
      if: { arg: 'isHinted', eq: true },
    },
    hintUrl: {
      control: 'text',
      description: 'Optional URL to open when the hint tooltip icon is clicked.',
      table: { category: 'Validation & Hints' },
      if: { arg: 'isHinted', eq: true },
    },
    errorText: {
      control: 'text',
      description: 'Explicit error message string. Overrides Formik validation errors if provided.',
      table: { category: 'Validation & Hints' },
    },

    // --- Layout ---
    width: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Viewport column width configuration value (1 to 12) inside a `Row`.',
      table: { category: 'Layout', defaultValue: { summary: '12' } },
    },
    newRow: {
      control: 'boolean',
      description: 'Forces container layouts to break downward onto a fresh structural row line.',
      table: { category: 'Layout' },
    },
    className: {
      control: 'text',
      description: 'Specific custom style class selector appended to the root container.',
      table: { category: 'Layout' },
    },
    style: {
      control: 'object',
      description: 'Inline modification style rules object.',
      table: { category: 'Layout' },
    },

    // --- Theming & Typography ---
    activeColor: { 
      control: 'color', 
      description: 'Highlight color applied to the active/focused dropzone border and default icons.',
      table: { category: 'Theming' } 
    },
    backgroundColor: { 
      control: 'color', 
      description: 'Dynamic base background color for light mode. Colors the dropzone and file cards.',
      table: { category: 'Theming' } 
    },
    darkBackgroundColor: { 
      control: 'color', 
      description: 'Dynamic base background color specifically for dark mode contexts.',
      table: { category: 'Theming' } 
    },
    textColor: { 
      control: 'color', 
      description: 'Standard text color for light mode.',
      table: { category: 'Theming' } 
    },
    darkTextColor: { 
      control: 'color', 
      description: 'Standard text color specifically for dark mode contexts.',
      table: { category: 'Theming' } 
    },
    errorTextColor: { 
      control: 'color', 
      description: 'Validation failure text color for light mode.',
      table: { category: 'Theming' } 
    },
    darkErrorTextColor: { 
      control: 'color', 
      description: 'Validation failure text color for dark mode.',
      table: { category: 'Theming' } 
    },
    fontFamily: { 
      control: 'text', 
      description: 'Font family override to match specific UI brand primitives.',
      table: { category: 'Typography' } 
    },

    // --- State & Events ---
    value: {
      control: false,
      description: 'External fallback state value for standalone non-Formik setups. If a `Formik` provider is present, it prioritizes the state mapped via the `alias` key.',
      table: { 
        category: 'State & Events',
        type: {
          summary: 'File | File[] | null',
          detail: 'Yields a standard JS File object in single mode, or an array of File objects in multiselect mode.'
        }
      },
    },
    onChange: { 
      action: 'onChange', 
      control: false, 
      description: 'Yields the JavaScript `File` object (or `File[]`) upon selection. Automatically intercepts and propagates to Formik.',
      table: { category: 'State & Events' } 
    },
    onBlur: { 
      action: 'onBlur', 
      control: false, 
      description: 'Callback fired when focus is lost. Automatically triggers Formik field validation (setting to `touched`).',
      table: { category: 'State & Events' } 
    },
    formikContext: { 
      control: false, 
      description: 'Explicit Formik context object injected when rendering outside a standard Formik provider.',
      table: { category: 'State & Events' } 
    },
  },
  args: {
    alias: 'documentUpload',
    inputLabel: 'Secure Document Vault',
    multiple: false,
    preview: true,
    design: 'outline',
    floatingLabel: false,
    darkMode: false,
    width: 12,
    isHinted: false,
    hintText: 'Upload valid identification or utility bills.',
    icon: 'None' as unknown as React.ReactNode,
    iconPosition: 'left',
  },
  decorators: [
    (Story, context) => {
      const { design, darkMode, backgroundColor } = context.args;
      const useRow = context.parameters.useRow !== false;

      let bg = '#ffffff';
      if (darkMode) {
        bg = '#1f2937';
      } else if (design === 'neumorphic' || design === 'skeuomorphic') {
        bg = backgroundColor || '#e0e5ec';
      } else if (design === 'outline') {
        bg = '#f9fafb';
      }

      return (
        <GlobalUIContext.Provider value={{ themeColors: { light: '#2563eb', dark: '#3b82f6' } } as any}>
          <TooltipProvider delayDuration={300}>
            <div
              style={{
                minHeight: '340px', 
                width: '100%',
                backgroundColor: bg,
                padding: '2.5rem',
                borderRadius: '12px',
                transition: 'background-color 0.3s ease',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
                {useRow ? (
                  <Row gap="4">
                    <Story />
                  </Row>
                ) : (
                  <Story />
                )}
              </div>
            </div>
          </TooltipProvider>
        </GlobalUIContext.Provider>
      );
    },
  ],
  render: (args) => <StatefulFileInput {...args} />,
};

export default meta;
type Story = StoryObj<FileInputProps>;

// ---------------------------------------------------------------------------
// CORE DESIGN VARIANTS
// ---------------------------------------------------------------------------

export const Outline: Story = {
  args: {
    design: 'outline',
    activeColor: '#2563eb',
  },
};

export const Material: Story = {
  args: {
    design: 'material',
    inputLabel: 'Material Contract Upload',
    activeColor: '#10b981',
  },
};

export const Neumorphic: Story = {
  args: {
    design: 'neumorphic',
    backgroundColor: '#e0e5ec',
    textColor: '#1f2937',
    inputLabel: 'Extruded Asset Well',
  },
};

export const Skeuomorphic: Story = {
  args: {
    design: 'skeuomorphic',
    backgroundColor: '#e0e5ec',
    inputLabel: 'Mechanical File Bay',
  },
};

// ---------------------------------------------------------------------------
// CONFIGURATION MODES & BEHAVIORS
// ---------------------------------------------------------------------------

export const CustomHelperText: Story = {
  args: {
    design: 'outline',
    alias: 'brandAssets',
    inputLabel: 'Brand Asset Guidelines',
    helperText: 'Max file size 25MB. Must be exact 1024x1024 dimensions.',
    activeColor: '#f59e0b',
  },
  parameters: {
    docs: {
      description: {
        story: 'Leverage the `helperText` prop to overwrite the standard "Supports PDF, Images..." sub-label with specific instructional text, dimension constraints, or file size limits.',
      },
    },
  },
};

export const BatchUploads: Story = {
  args: {
    design: 'outline',
    alias: 'invoiceBatch',
    inputLabel: 'Batch Invoice Upload',
    multiple: true,
    activeColor: '#8b5cf6',
    icon: 'CloudUpload' as unknown as React.ReactNode,
  },
  parameters: {
    docs: {
      description: {
        story: 'Setting `multiple={true}` changes the underlying HTML input behavior to accept multiple files simultaneously. The component will generate an individual card (and image preview if applicable) for each file in the `File[]` payload.',
      },
    },
  },
};

export const StrictMimeTypes: Story = {
  args: {
    design: 'outline',
    alias: 'taxReturns',
    inputLabel: 'Tax Return (PDF Only)',
    helperText: 'Only standard PDF formats are accepted.',
    accept: 'application/pdf',
    icon: 'Shield' as unknown as React.ReactNode,
    activeColor: '#ef4444',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the `accept` prop to explicitly overwrite the standard format constants. In this example, the dropzone strictly accepts PDFs via `application/pdf`.',
      },
    },
  },
};

export const ValidationAndTooltips: Story = {
  args: {
    design: 'outline',
    alias: 'kycDocument',
    inputLabel: 'Identity Verification (KYC)',
    isHinted: true,
    hintText: 'Must be a clear photo of a government-issued ID.',
    errorText: 'The uploaded file exceeds the 5MB size limit.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates `isHinted` tooltip annotations alongside explicit `errorText` validation states (which colors the dropzone borders red).',
      },
    },
  },
};

export const DarkModeOverride: Story = {
  args: {
    design: 'outline',
    darkMode: true,
    inputLabel: 'Confidential Disclosures',
    activeColor: '#60a5fa',
  },
};

// ---------------------------------------------------------------------------
// USAGE & INTEGRATION EXAMPLES
// ---------------------------------------------------------------------------

/**
 * **Native React State (FormData Preparation):**
 * A clever pattern for extracting single and batched `File` objects natively and appending them to a standard `FormData` object for immediate API transmission. 
 * Notice how `multiple={true}` yields an array to be looped, while `multiple={false}` yields a single file object.
 */
export const StandaloneUsage: Story = {
  render: (args) => {
    // 1. Single File State (Avatar)
    const [avatar, setAvatar] = useState<File | null>(null);
    // 2. Multi-File State (Supporting Documents)
    const [documents, setDocuments] = useState<File[]>([]);

    const handlePrepareUpload = (e: React.FormEvent) => {
      e.preventDefault();
      
      // 3. Construct a standard FormData object for REST/GraphQL pipelines
      const formData = new FormData();
      
      if (avatar) {
        formData.append("userAvatar", avatar, avatar.name);
      }
      
      documents.forEach((doc, idx) => {
        formData.append(`supportingDocument_${idx}`, doc, doc.name);
      });

      const debugOutput = Array.from(formData.entries()).map(([key, file]) => {
        const f = file as File;
        return `${key}: ${f.name} (${(f.size / 1024).toFixed(1)} KB)`;
      });

      alert(`FileInput\n\nPayload:\n${debugOutput.join('\n')}`);
    };

    return (
      <form onSubmit={handlePrepareUpload} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '440px', fontFamily: 'system-ui, sans-serif' }}>
        
        <FileInput
          alias="avatarUpload"
          inputLabel="Profile Avatar"
          design={args.design}
          multiple={false}
          accept="image/png, image/jpeg"
          helperText='Select a profile avatar image'
          value={avatar}
          onChange={(val) => setAvatar(val as File | null)}
        />

        <FileInput
          alias="documentUpload"
          inputLabel="Supporting Documents (Batch)"
          design={args.design}
          multiple={true}
          icon={<ShieldIcon />}
          value={documents}
          onChange={(val) => setDocuments(val as File[])}
        />

        <button
          type="submit"
          style={{
            marginTop: '8px',
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
          Prepare API FormData
        </button>
      </form>
    );
  },
  args: {
    design: 'outline',
  },
  parameters: {
    useRow: false,
    docs: {
      source: {
        code: `"use client";

import React, { useState } from "react";
import { Button } from "@emeraldemperaur/mito-ui";
import { FileInput } from "@emeraldemperaur/mito-ui/FileInput";

export const StandaloneKYCExample = () => {
  // 1. Single File State (Avatar)
  const [avatar, setAvatar] = useState<File | null>(null);
  
  // 2. Multi-File State (Supporting Documents)
  const [documents, setDocuments] = useState<File[]>([]);

  const handlePrepareUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. Construct a standard FormData object for REST/GraphQL pipelines
    const formData = new FormData();
    
    if (avatar) {
      formData.append("userAvatar", avatar, avatar.name);
    }
    
    documents.forEach((doc, idx) => {
      // Safely append multiple files to the payload
      formData.append(\`supportingDocument_\${idx}\`, doc, doc.name);
    });

    console.log("FormData Prepared for Fetch/Axios:", formData);
    alert("Check the console to see the FormData mapping.");
  };

  return (
    <form onSubmit={handlePrepareUpload} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      
      <FileInput
        alias="avatarUpload"
        inputLabel="Profile Avatar"
        design="outline"
        multiple={false}
        accept="image/png, image/jpeg"
        helperText='Select a profile avatar image'
        value={avatar}
        onChange={(val) => setAvatar(val as File | null)}
      />

      <FileInput
        alias="documentUpload"
        inputLabel="Supporting Documents (Batch)"
        design="outline"
        multiple={true}
        value={documents}
        onChange={(val) => setDocuments(val as File[])}
      />

      <Button type="submit" variant="material" backgroundColor="#2563eb" textColor="#ffffff">
        Prepare API FormData
      </Button>
    </form>
  );
};`,
      },
    },
  },
};

/**
 * **Interactive Form Pipeline (Formik Context):**
 * Demonstrates the seamless binding of `FileInput` inside a `Formik` context. 
 * Formik captures the JavaScript `File` objects directly into the global validation state, enabling size or type validation via Yup before submission.
 */
export const InteractiveFormTest: Story = {
  render: (args) => {
    return (
      <Formik
        initialValues={{
          contractFiles: [],
        }}
        validate={(values) => {
          const errors: Record<string, any> = {};
          
          if (!values.contractFiles || values.contractFiles.length === 0) {
            errors.contractFiles = 'At least one contract document must be attached.';
          } else {
            const files = values.contractFiles as File[];
            const oversized = files.some(file => file.size > 5 * 1024 * 1024); // 5MB Limit
            if (oversized) {
              errors.contractFiles = 'One or more files exceed the 5MB size limit.';
            }
          }
          
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const fileNames = (values.contractFiles as File[]).map(f => f.name).join(', ');
          alert(`Payload Validated!\nAttached Files: ${fileNames}`);
          setSubmitting(false);
        }}
      >
        {(formikProps) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', fontFamily: 'system-ui, sans-serif' }}>
            
            {/* Live Formik State Monitor */}
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
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Formik Payload Object
              </span>
              <pre style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify({ 
                  errors: formikProps.errors, 
                  touched: formikProps.touched,
                  values: {
                    contractFiles: formikProps.values.contractFiles.map((f: File) => f.name) // Truncated for readability
                  }
                }, null, 2)}
              </pre>
            </div>

            {/* Enterprise Form */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <FileInput
                alias="contractFiles"
                inputLabel="Executed Contracts"
                design={args.design}
                multiple={true}
              />

              <button
                type="submit"
                disabled={formikProps.isSubmitting}
                style={{
                  marginTop: '12px',
                  padding: '10px 20px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Validate Upload Batch
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
      source: {
        code: `import React from 'react';
import { Formik, Form } from 'formik';
import { FileInput, Row } from '@emeraldemepraur/mito-ui';

export const FormikAttachmentPipeline = () => {
  return (
    <Formik
      initialValues={{ contractFiles: [] }}
      validate={(values) => {
        const errors: Record<string, any> = {};
        
        if (!values.contractFiles || values.contractFiles.length === 0) {
          errors.contractFiles = 'Required.';
        } else {
          const files = values.contractFiles as File[];
          const oversized = files.some(file => file.size > 5 * 1024 * 1024);
          if (oversized) errors.contractFiles = 'Max file size is 5MB.';
        }
        
        return errors;
      }}
      onSubmit={(values) => console.log('Submitted Files:', values.contractFiles)}
    >
      <Form>
        <Row gap="4">
          <FileInput 
            alias="contractFiles" 
            inputLabel="Executed Contracts" 
            multiple={true}
            width={12} 
          />
        </Row>
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};`,
      },
    },
  },
};