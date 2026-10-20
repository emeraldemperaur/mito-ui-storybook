"use client";

import React, { useEffect, type JSX } from 'react';
import { XFormSchema, type XFormType, type XFormQuery, SectionSchema } from '../../utils/Voltron';
import { normalizeXForm } from '../../utils/Minerva'; 
import { Teletraan1, type Teletraan1Props } from './Teletraan1';
import { z } from "zod";
import { Theme, Button, Flex, type ThemeProps } from '@radix-ui/themes';
import { Formik, Form, useFormikContext, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import '../../styles/main.scss';

export interface VectorSigmaRenderProps<T extends Record<string, any> = Record<string, any>> extends Omit<Teletraan1Props, 'xFormModel'> {
    /** Optional callback fired when the form is submitted and passes validation. */
    onSubmit?: (values: T, actions: FormikHelpers<T>, instance: VectorSigma<T>) => void | Promise<any>;
    /** Optional Radix UI Theme configuration for structural CSS tokens. */
    theme?: Omit<ThemeProps, 'children'>;
    /** Optional toggle to disable the default xForm bottom submit button. */
    buttonOverride?: boolean;
}

/**
 * SSR-safe Observer Component. Evaluates Formik state inside the React tree lifecycle
 * and synchronizes it backwards into the VectorSigma Class Instance.
 */
const FormikStateObserver = <T extends Record<string, any>>({ instance }: { instance: VectorSigma<T> }): null => {
    const formikContext = useFormikContext<T>();
    
    useEffect(() => {
        instance.values = formikContext.values as Partial<T>;
        instance.errors = formikContext.errors;
        
        if (!instance.actions) {
            instance.actions = {
                submitForm: formikContext.submitForm,
                resetForm: formikContext.resetForm,
                setValues: formikContext.setValues,
                setFieldValue: formikContext.setFieldValue,
                setFieldError: formikContext.setFieldError,
                setFieldTouched: formikContext.setFieldTouched,
                validateForm: formikContext.validateForm,
                setSubmitting: formikContext.setSubmitting,
            };
        }

        // Status code tracking logic (0 = Empty, 1 = In Progress)
        if (formikContext.dirty && instance.statusCode === 0) {
            instance.statusCode = 1;
            instance.timeInProgress = Date.now();
        }
    }, [formikContext, instance]);

    return null; 
};

export interface VectorSigmaActions<T> {
    submitForm: () => Promise<void | undefined>;
    resetForm: (nextState?: Partial<import('formik').FormikState<T>>) => void;
    setValues: (values: React.SetStateAction<T>, shouldValidate?: boolean) => Promise<void | import('formik').FormikErrors<T>>;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | import('formik').FormikErrors<T>>;
    setFieldError: (field: string, message: string | undefined) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => Promise<void | import('formik').FormikErrors<T>>;
    validateForm: (values?: any) => Promise<import('formik').FormikErrors<T>>;
    setSubmitting: (isSubmitting: boolean) => void;
}

/**
 * @class VectorSigma
 * @description Builder pattern class for generating dynamic Formik-powered Teletraan1 structures.
 * Strongly typed and architected to support isomorphic Client/SSR lifecycles.
 */
export class VectorSigma<T extends Record<string, any> = Record<string, any>> {
    public isValid: boolean = false;
    public formObject: XFormType;
    public values: Partial<T> = {};
    public errors: Record<string, any> = {};
    public actions: VectorSigmaActions<T> | null = null;
    public statusCode: 0 | 1 | 2 = 0; 
    public timeCreated: number;
    public timeInProgress: number | null = null;
    public timeSubmitted: number | null = null;
    public isSubmitting: boolean = false;

    constructor(initializer?: string | XFormType | unknown) {
        this.timeCreated = Date.now();
        this.formObject = {
            uuid: crypto.randomUUID ? crypto.randomUUID() : `form-${Date.now()}`,
            name: 'Untitled Form',
            model: []
        };

        if (initializer) {
            this.validateAndSet(initializer);
        }
    }

    private validateAndSet(input: unknown) {
        let dataToValidate = input;

        if (typeof input === 'string') {
            try {
                dataToValidate = JSON.parse(input);
            } catch (error) {
                throw new Error(`VectorSigma Validation Error: Invalid xForm JSON string provided.\nDetails: ${(error as Error).message}`);
            }
        }

        const result = XFormSchema.safeParse(dataToValidate);
        this.isValid = result.success;

        if (result.success) {
            this.formObject = result.data;
        } else {
            const errorMessages = result.error.issues.map(
                issue => `  - Path: [${issue.path.join('.') || 'root'}] -> ${issue.message}`
            ).join('\n');

            throw new Error(`VectorSigma Validation Error: Invalid xForm Object Schema.\n${errorMessages}`);
        }
    }

    private buildFormikConfig(sanitizedData: XFormType) {
        const initialValues: Record<string, any> = {};
        const shape: Record<string, any> = {};

        const arrayTypes = [
            "checkbox", "checkboxes", "checkboxinput", "chechbox-input", "input-checkbox", "inputcheckbox", "checkboxgroup-input",
            "filemultiple", "filemultipleinput", "filemultiple-input", "input-filemultiple", "inputfilemultiple",
            "selectmultiple", "selectmultipleinput", "selectmultiple-input", "input-selectmultiple", "inputselectmultiple",
            "countrymultiselect", "countrymultiselectinput", "countrymultiselect-input", "input-countrymultiselect", "inputcountrymultiselect",
            "range", "rangeslider", "rangeinput", "rangesliderinput", "rangeslider-input", "range-input", "input-rangeslider", "inputrangeslider",
            "slider", "sliderinput", "slider-input", "input-slider", "inputslider"
        ];

        const booleanTypes = [
            "toggle", "switch", "toggleinput", "toggle-input", "input-toggle", "inputtoggle",
            "conditionaltoggle", "conditionalcheckbox", "conditional-toggle", "conditional-checkbox"
        ];

        const numberTypes = [
            "currency", "currencyinput", "currency-input", "input-currency", "inputcurrency",
            "stock", "stockinput", "stock-input", "input-stock", "inputstock"
        ];

        const traverseQueries = (queries: XFormQuery[]) => {
            queries.forEach(q => {
                const normalizedType = q.inputType.toLowerCase();

                const isArray = arrayTypes.includes(normalizedType);
                const isBoolean = booleanTypes.includes(normalizedType);
                const isNumber = numberTypes.includes(normalizedType);

                if (q.defaultValue !== undefined && q.defaultValue !== null) {
                    initialValues[q.inputAlias] = q.defaultValue;
                } else if (isArray) {
                    initialValues[q.inputAlias] = []; 
                } else if (isBoolean) {
                    initialValues[q.inputAlias] = false; 
                } else if (isNumber) {
                    initialValues[q.inputAlias] = 0; 
                } else {
                    initialValues[q.inputAlias] = ""; 
                }

                let validator: any;
                if (isArray) {
                    validator = Yup.array();
                } else if (isBoolean) {
                    validator = Yup.boolean();
                } else if (isNumber) {
                    validator = Yup.number();
                } else {
                    validator = Yup.string();
                }

                if (q.isRequired) {
                    const errorMsg = q.errorText || `${q.inputLabel || 'This field'} is required`;
                    if (isArray) {
                        validator = validator.min(1, errorMsg);
                    } else if (isBoolean) {
                        validator = validator.oneOf([true], errorMsg);
                    } else {
                        validator = validator.required(errorMsg);
                    }
                } else {
                    validator = validator.nullable().notRequired();
                }

                shape[q.inputAlias] = validator;

                if (q.toggledInput) {
                    traverseQueries([q.toggledInput]);
                }
            });
        };

        sanitizedData.model.forEach(section => traverseQueries(section.queries));
        this.values = initialValues as Partial<T>;

        return {
            initialValues,
            validationSchema: Yup.object().shape(shape)
        };
    }

    private hydrateQueryResponses(submittedValues: T) {
        const objectHydrationTypes = [
            "dropdown", "dropdowninput", "dropdown-input", "input-dropdown", "inputdropdown",
            "select", "selectinput", "select-input", "input-select", "inputselect",
            "selectmultiple", "selectmultipleinput", "selectmultiple-input", "input-selectmultiple", "inputselectmultiple"
        ];

        const traverseAndHydrate = (queries: XFormQuery[]) => {
            queries.forEach(query => {
                const formikValue = submittedValues[query.inputAlias];
                const normalizedType = query.inputType.toLowerCase();

                if (formikValue !== undefined && formikValue !== null) {
                    if (objectHydrationTypes.includes(normalizedType) && query.inputOptions) {
                        if (Array.isArray(formikValue)) {
                            query.queryResponse = query.inputOptions.filter(opt => 
                                formikValue.some(val => String(val) === String(opt.optionvalue))
                            );
                        } else {
                            const matchedOption = query.inputOptions.find(opt => String(opt.optionvalue) === String(formikValue));
                            query.queryResponse = matchedOption !== undefined ? matchedOption : formikValue;
                        }
                    } else {
                        query.queryResponse = formikValue;
                    }
                } else {
                    query.queryResponse = null;
                }
                
                if (query.toggledInput) {
                    traverseAndHydrate([query.toggledInput]);
                }
            });
        };

        this.formObject.model.forEach(section => {
            traverseAndHydrate(section.queries);
        });
    }

    // Builder Pattern Methods omitted for brevity (unchanged from original)
    public setUUID(uuid: string): this { this.formObject.uuid = uuid; return this; }
    public setName(name: string): this { this.formObject.name = name; return this; }
    public setBrand(color: string, logo?: string, logoPosition?: 'left' | 'center' | 'right'): this {
        this.formObject.brandColor = color;
        if (logo) this.formObject.logo = logo;
        if (logoPosition) this.formObject.logoPosition = logoPosition;
        return this;
    }
    public addSection(section: z.infer<typeof SectionSchema>): this { this.formObject.model.push(section); return this; }
    public createSection(sectionId: string, title: string, subtitle?: string, icon?: string): this {
        this.formObject.model.push({ sectionId, title, subtitle, icon, queries: [] }); return this;
    }
    public addQueryToSection(sectionId: string, query: XFormQuery): this {
        const section = this.formObject.model.find(s => s.sectionId === sectionId);
        if (!section) throw new Error(`VectorSigma Builder Error: Section with ID "${sectionId}" not found.`);
        section.queries.push(query);
        return this;
    }

    /**
     * VΣ `transform()` method for evaluating and mounting the Teletraan1 components inside a Formik state wrapper.
     */
    public transform(options?: VectorSigmaRenderProps<T>): JSX.Element {
        this.validateAndSet(this.formObject); 
        const sanitizedData = normalizeXForm(this.formObject);

        const { initialValues, validationSchema } = this.buildFormikConfig(sanitizedData);
        const isCodexMode = options?.displayMode === 'codex';
        const themeConfig: ThemeProps = {
            appearance: 'inherit', 
            accentColor: 'blue',
            radius: 'medium',
            ...options?.theme
        };
        
        return (
            <Theme {...themeConfig}>
                <Formik<T>
                    initialValues={initialValues as unknown as T}
                    validationSchema={validationSchema}
                    onSubmit={async (values, actions) => {
                        try {
                            this.statusCode = 2;
                            this.timeSubmitted = Date.now();
                            this.hydrateQueryResponses(values);
                            
                            if (options?.onSubmit) {
                                await options.onSubmit(values, actions, this);
                            }
                            
                            if (options?.onFinish) {
                                options.onFinish(values as any, actions as any, this as any);
                            }
                        } catch (error) {
                            console.error(`VectorSigma xForm Submission Error:`, error);
                        } finally {
                            actions.setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            {isSubmitting ? this.isSubmitting = isSubmitting : null}
                            <FormikStateObserver<T> instance={this} />

                            {sanitizedData.logo && (
                                <div style={{ display: 'flex', width: '100%', marginBottom: '24px', 
                                    justifyContent: 
                                        sanitizedData.logoPosition === 'center' ? 'center' :
                                        sanitizedData.logoPosition === 'right' ? 'flex-end' : 
                                        'flex-start'
                                }}>
                                    <img 
                                        src={sanitizedData.logo} 
                                        alt={`${sanitizedData.name || 'Form'} Logo`} 
                                        style={{ maxHeight: '64px', maxWidth: '100%', objectFit: 'contain' }} 
                                    />
                                </div>
                            )}

                            <Teletraan1 
                                brandColor={sanitizedData.brandColor} 
                                xFormModel={sanitizedData} 
                                darkModeColors={options?.darkModeColors}
                                {...options} 
                            />
                            
                            {!isCodexMode && !options?.readOnlyMode && !options?.buttonOverride && (
                                <Flex 
                                    mt="6" 
                                    justify="end" 
                                    style={{ width: '100%', paddingTop: '20px', borderTop: '1px solid var(--gray-5)' }}
                                >
                                    <Button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        style={{ 
                                            cursor: isSubmitting ? 'wait' : 'pointer',
                                            padding: '0 24px',
                                            backgroundColor: sanitizedData.brandColor || '#000000', 
                                            color: '#fff'
                                        }}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </Flex>
                            )}
                            
                        </Form>
                    )}
                </Formik>
            </Theme>
        );
    }

    public render(options?: VectorSigmaRenderProps<T>): JSX.Element {
        return this.transform(options);
    }

    public toJSON(): string {
        return JSON.stringify(this.formObject, null, 2);
    }
    public getxForm(): XFormType {
        return this.formObject;
    }
}