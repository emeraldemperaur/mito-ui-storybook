import { z } from "zod";

/**
 * @schema InputOptionSchema
 * @description Defines the standard structural model for selectable options (Dropdowns, Radios, Checkboxes, Multi-selects).
 * AI/MCP Context: Use this schema when generating options for multiple-choice elements.
 */
export const InputOptionSchema = z.object({
  /** Unique numeric identifier for the option. */
  optionid: z.number(),
  /** The actual underlying value submitted to the form state. */
  optionvalue: z.union([z.string(), z.number(), z.boolean()]),
  /** Optional external hyperlink attached to the option. */
  optionurl: z.string().optional(),
  /** The human-readable text rendered in the UI. */
  text: z.string(),
  /** Optional categorization tag. */
  tag: z.string().optional(),
  /** Optional weighting or scoring metric (supports floats natively). */
  score: z.number().optional(),
  /** Optional contextual note or description. */
  note: z.string().optional(),
});

/**
 * @type XFormQuery
 * @description Represents an individual input field, visual element, or interactive component within a form section.
 * Supports recursive nested inputs via `toggledInput` for complex conditional rendering.
 */
export type XFormQuery = {
  /** Unique numeric identifier for the query instance. */
  queryId: number;
  /** The literal string dictating the UI component to render (e.g., 'text-input', 'slider', 'conditionaltoggle'). */
  inputType: string;
  /** The unique state key mapped to the form's data payload (Formik name). */
  inputAlias: string;
  /** The primary human-readable label for the input. */
  inputLabel: string;
  /** Ghost text displayed when the input is empty. */
  inputPlaceholder?: string;
  /** If true, forces the component to break to a new layout row. */
  newRow?: boolean;
  /** Grid column width span (typically 1-12). */
  inputWidth: number;
  /** Explicit height constraints for specific components (like image outputs). */
  inputHeight?: number;
  /** Enforces validation requirements for form submission. */
  isRequired?: boolean;
  /** If true, renders a tooltip icon. */
  isHinted?: boolean;
  /** Text content for the tooltip. */
  hintText?: string;
  /** External URL for the tooltip "learn more" action. */
  hintUrl?: string;
  /** Custom error message displayed upon validation failure. */
  errorText?: string;
  /** The initial hydrated value before user interaction. */
  defaultValue?: any;
  /** The active user-submitted value (populated post-submission). */
  queryResponse?: any;
  /** Array of structural options for select/radio/checkbox inputs. */
  inputOptions?: z.infer<typeof InputOptionSchema>[];
  /** The specific value required to reveal the `toggledInput` (used in ConditionalTriggers). */
  triggerValue?: any;
  /** The nested XFormQuery to render when the conditional trigger is met. */
  toggledInput?: XFormQuery | null; 
  /** Minimum value constraint for SliderInput component(s) */
  minValue?: number;
  /** Maximum value constraint for SliderInput component(s) */
  maxValue?: number;
  /** Increment value for SliderInput component(s) */
  stepValue?: number;
};

/**
 * @schema QuerySchema
 * @description Zod schema for validating XFormQuery objects. 
 * Evaluated lazily to support infinitely recursive `toggledInput` conditions.
 */
export const QuerySchema: z.ZodType<XFormQuery> = z.lazy(() =>
  z.object({
    queryId: z.number(),
    inputType: z.string(),
    inputAlias: z.string(),
    inputLabel: z.string(),
    inputPlaceholder: z.string().optional(),
    newRow: z.boolean().optional(),
    inputWidth: z.number(),
    inputHeight: z.number().optional(),
    isRequired: z.boolean().optional(),
    isHinted: z.boolean().optional(),
    hintText: z.string().optional(),
    hintUrl: z.string().optional(),
    errorText: z.string().optional(),
    defaultValue: z.any().optional(),
    queryResponse: z.any().nullable().optional(),
    inputOptions: z.array(InputOptionSchema).optional(),
    triggerValue: z.any().optional(),
    toggledInput: QuerySchema.nullable().optional(),
    
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    stepValue: z.number().optional(),
  })
);

/**
 * @schema SectionSchema
 * @description Groups multiple XFormQueries into logical blocks (e.g., Accordion items, Codex steps, or page sections).
 */
export const SectionSchema = z.object({
  sectionId: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  icon: z.string().optional(),
  queries: z.array(QuerySchema),
});

/**
 * @schema XFormSchema
 * @description The root validation schema for the entire dynamic form configuration.
 * Consumed by VectorSigma and Teletraan1 to generate the final SSR-safe React tree.
 */
export const XFormSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  logo: z.string().optional(),
  brandColor: z.string().optional(),
  logoPosition: z.string().optional(),
  model: z.array(SectionSchema),
});

export type XFormType = z.infer<typeof XFormSchema>;