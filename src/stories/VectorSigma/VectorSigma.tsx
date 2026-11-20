"use client";

import React, { useEffect, type JSX } from 'react';
import { XFormSchema, type XFormType, type XFormQuery, SectionSchema } from '../../utils/Voltron';
import { normalizeXForm } from '../../utils/Minerva'; 
import { Teletraan1, type Teletraan1Props } from './Teletraan1';
import { z } from "zod";
import { Theme, type ThemeProps } from '@radix-ui/themes';
import { Formik, Form, useFormikContext, type FormikHelpers } from 'formik';
import { Button } from '../Buttons/Button';
import * as Yup from 'yup';
import '../../styles/main.scss';

export interface VectorSigmaRenderProps<T extends Record<string, any> = Record<string, any>> extends Omit<Teletraan1Props, 'xFormModel'> {
    /** Optional callback fired when the form is submitted and passes validation. */
    onSubmit?: (values: T, actions: FormikHelpers<T>, instance: VectorSigma<T>) => void | Promise<any>;
    /** Optional Radix UI Theme configuration for structural CSS tokens. */
    theme?: Omit<ThemeProps, 'children'>;
    /** Optional toggle to completely disable the default xForm bottom submit button. @default false */
    buttonOverride?: boolean;
    /** Injects an optional H2 title block above the form payload. */
    title?: string;
    /** Injects an optional sub-description paragraph beneath the header title block. */
    description?: string;
    /** Controls whether the heading block appears above or below the logo. @default 'aboveLogo' */
    headingPosition?: 'aboveLogo' | 'belowLogo';
    /** Header section text color configuration. Overrides global theme logic for legibility. */
    headingTextColor?: string;
    /** Header section background fill configuration. Overrides global theme logic. */
    headingBackgroundColor?: string;
    /** Visually toggles off the loaded schema logo without disrupting layout nodes. @default false */
    hideLogo?: boolean;
    /** Failsafe image source deployed if the original schema logo URL triggers an error. */
    fallbackLogo?: string;
    /** Overrides the horizontal alignment of the schema logo. */
    logoPosition?: 'left' | 'center' | 'right';
    /** Overrides the default "Submit" text on the terminal button. */
    submitText?: string;
    /** Custom base color for the submit button. */
    submitButtonColor?: string;
    /** Custom text color for the submit button. */
    submitButtonTextColor?: string;
    /** Custom hover background color for the submit button. */
    submitButtonHoverColor?: string;
    /** Custom hover text color for the submit button. */
    submitButtonHoverTextColor?: string;
}

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
                    validator = Yup.array().typeError(q.errorText || `${q.inputLabel || 'This field'} is invalid`);
                } else if (isBoolean) {
                    validator = Yup.boolean().typeError(q.errorText || `${q.inputLabel || 'This field'} must be true or false`);
                } else if (isNumber) {
                    validator = Yup.number()
                        .transform((_value, originalValue) => {
                            const parsed = String(originalValue).trim();
                            return parsed === '' ? null : Number(parsed);
                        })
                        .typeError(q.errorText || `${q.inputLabel || 'This field'} must be a valid numeric amount`);
                } else {
                    validator = Yup.string().typeError(q.errorText || `${q.inputLabel || 'This field'} is invalid`);
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

    public transform(options?: VectorSigmaRenderProps<T>): JSX.Element {
        this.validateAndSet(this.formObject); 
        const sanitizedData = normalizeXForm(this.formObject);

        const { initialValues, validationSchema } = this.buildFormikConfig(sanitizedData);
        const isCodexMode = options?.displayMode === 'codex';
        const resolvedButtonVariant = options?.design || 'material';
        const isBulkyButton = resolvedButtonVariant === 'neumorphic' || resolvedButtonVariant === 'skeuomorphic';
        
        const themeConfig: ThemeProps = {
            appearance: options?.darkModeColors ? 'dark' : 'light', 
            accentColor: 'blue',
            radius: 'medium',
            ...options?.theme
        };

        const renderHeadingBlock = () => {
            if (!options?.title && !options?.description) return null;
            return (
                <div style={{
                    backgroundColor: options.headingBackgroundColor || 'transparent',
                    color: options.headingTextColor || 'inherit',
                    padding: options.headingBackgroundColor ? '24px' : '0 0 24px 0',
                    borderRadius: '0px',
                    marginBottom: '24px',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {options.title && <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 600 }}>{options.title}</h2>}
                    {options.description && <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem' }}>{options.description}</p>}
                </div>
            );
        };

        const renderLogoBlock = () => {
            if (!sanitizedData.logo) return null;
            const resolvedLogoPosition = options?.logoPosition || sanitizedData.logoPosition || 'left';
            return (
                <div style={{ 
                    display: 'flex', width: '100%', marginBottom: '24px', 
                    justifyContent: 
                        resolvedLogoPosition === 'center' ? 'center' :
                        resolvedLogoPosition === 'right' ? 'flex-end' : 
                        'flex-start',
                    visibility: options?.hideLogo ? 'hidden' : 'visible'
                }}>
                    <img 
                        src={sanitizedData.logo} 
                        alt={`${sanitizedData.name || 'Form'} Logo`} 
                        style={{ maxHeight: '64px', maxWidth: '100%', objectFit: 'contain' }} 
                        onError={(e) => {
                            if (options?.fallbackLogo) {
                                e.currentTarget.src = options.fallbackLogo;
                            } else {
                                e.currentTarget.style.display = 'none';
                            }
                        }}
                    />
                </div>
            );
        };
        
        return (
            <Theme {...themeConfig} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
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
                        <Form style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            {isSubmitting ? this.isSubmitting = isSubmitting : null}
                            <FormikStateObserver<T> instance={this} />

                            <div style={{
                                fontFamily: options?.fontFamily || 'inherit',
                                width: '100%',
                                maxWidth: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                boxSizing: 'border-box',
                                overflowX: 'hidden'
                            }} className={options?.darkModeColors ? 'mito-theme-dark' : 'mito-theme-light'}>
                                
                                {options?.headingPosition === 'belowLogo' ? (
                                    <>
                                        {renderLogoBlock()}
                                        {renderHeadingBlock()}
                                    </>
                                ) : (
                                    <>
                                        {renderHeadingBlock()}
                                        {renderLogoBlock()}
                                    </>
                                )}

                                <Teletraan1 
                                    brandColor={sanitizedData.brandColor} 
                                    xFormModel={sanitizedData} 
                                    darkModeColors={options?.darkModeColors}
                                    headingTextColor={options?.headingTextColor}
                                    headingBackgroundColor={options?.headingBackgroundColor}
                                    fontFamily={options?.fontFamily}
                                    design={options?.design}
                                    {...options} 
                                />
                                
                                {!isCodexMode && !options?.readOnlyMode && !options?.buttonOverride && (
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        width: '100%', 
                                        boxSizing: 'border-box',
                                        paddingTop: '20px', 
                                        paddingBottom: isBulkyButton ? '16px' : '0',
                                        paddingRight: isBulkyButton ? '8px' : '0',
                                        marginTop: '24px',
                                        borderTop: `1px solid ${options?.darkModeColors ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}` 
                                    }}>
                                        <Button 
                                            type="submit" 
                                            variant={resolvedButtonVariant}
                                            darkMode={!!options?.darkModeColors}
                                            backgroundColor={options?.submitButtonColor || sanitizedData.brandColor || '#000000'}
                                            darkBackgroundColor={options?.submitButtonColor || options?.darkModeColors?.dark || sanitizedData.brandColor}
                                            textColor={options?.submitButtonTextColor || (resolvedButtonVariant === 'material' ? '#ffffff' : undefined)}
                                            hoverColor={options?.submitButtonHoverColor}
                                            hoverTextColor={options?.submitButtonHoverTextColor}
                                            fontFamily={options?.fontFamily}
                                            isLoading={isSubmitting}
                                        >
                                            {options?.submitText || 'Submit'}
                                        </Button>
                                    </div>
                                )}
                            </div>
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