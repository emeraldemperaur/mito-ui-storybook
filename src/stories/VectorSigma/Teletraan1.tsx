"use client";

import React, { createContext, useContext, useState, type JSX, type ReactNode} from 'react';
import { useFormikContext, type FormikHelpers } from 'formik';
import { Accordion } from '../Layout/Accordion';
import { Codex } from '../Layout/Codex';
import { Row } from '../Layout/Row';
import { SectionTitle } from '../Information/SectionTitle';
import { Icon } from '../../components/icons/Icons';
import { Button } from '../Buttons/Button';
import { CheckboxGroupInput } from '../Inputs/CheckboxGroupInput';
import { DatePickerInput } from '../Inputs/DatePickerInput'; 
import { DropdownInput } from '../Inputs/DropdownInput'; 
import { FileInput } from '../Inputs/FileInput';
import { Input } from '../Inputs/Input';
import { PasswordInput } from '../Inputs/PasswordInput';
import { CreditCardInput } from '../Inputs/CreditCardInput';
import { CurrencyInput } from '../Inputs/CurrencyInput';
import { StockInput } from '../Inputs/StockInput';
import { RadioGroupInput } from '../Inputs/RadioGroupInput';
import { SelectInput } from '../Inputs/SelectInput';
import { SliderInput } from '../Inputs/SliderInput';
import { ToggleInput } from '../Inputs/ToggleInput'; 
import { ConditionalTrigger } from '../Inputs/ConditionalTrigger';
import { CountrySelectInput } from '../Inputs/CountrySelectInput';

import { InputOptionsPlaceholder } from "../../utils/Vinci";
import { 
    buttonInputType, checkboxInputType, conditionalInputType, countrydropdownInputType, countrymultiselectInputType, creditCardInputType, 
    currencyInputType, datePickerInputType, dateRangePickerInputType, dateTimePickerInputType, dropdownInputType, 
    fileInputType, fileMultipleInputType, passwordInputType, radioInputType, rangeSliderInputType, selectInputType, 
    sliderInputType, stockInputType, textInputType, toggleInputType 
} from "../../utils/Voltaire";
import {  type XFormQuery, type XFormType } from '../../utils/Voltron';
import { VectorSigma } from './VectorSigma';

export type Teletraan1Display = 'accordion' | 'codice' | 'codex' | 'dual';
export type Teletraan1Design = 'material' | 'outline' | 'neumorphic' | 'skeuomorphic';

export interface Teletraan1Props {
    xFormModel: XFormType;
    design?: Teletraan1Design;
    readOnlyMode?: boolean;
    displayMode?: Teletraan1Display;
    brandColor?: string;
    darkModeColors?: { light: string; dark: string };
    headingTextColor?: string;
    headingBackgroundColor?: string;
    fontFamily?: string;
    /** Enforces step-by-step section validation in Codex mode. Halts progression if active step has errors. */
    strictValidation?: boolean;
    /** Custom base color for Codex step navigation buttons. */
    stepButtonColor?: string;
    /** Custom text color for Codex step navigation buttons. */
    stepButtonTextColor?: string;
    /** Custom hover background color for Codex step navigation buttons. */
    stepButtonHoverColor?: string;
    /** Custom hover text color for Codex step navigation buttons. */
    stepButtonHoverTextColor?: string;
    onQueryChange?: (alias: string, value: any) => void;
    onPrev?: () => void;
    onNext?: (e?: any) => void | boolean | Promise<boolean | void>;
    onFinish?: (values: any, actions: FormikHelpers<any>, instance: VectorSigma<any>) => void | Promise<any>;
}

interface TeletraanContextValue {
    readOnlyMode: boolean;
    brandColor: string;
    design: Teletraan1Design;
    darkModeColors?: { light: string; dark: string };
}
const TeletraanContext = createContext<TeletraanContextValue | null>(null);
export const useTeletraanContext = () => useContext(TeletraanContext);

export const Teletraan1 = ({ 
    xFormModel, 
    design = 'outline',
    readOnlyMode = false, 
    displayMode = 'codice', 
    brandColor = "#000000",
    darkModeColors,
    headingTextColor,
    headingBackgroundColor,
    fontFamily,
    strictValidation,
    stepButtonColor,
    stepButtonTextColor,
    stepButtonHoverColor,
    stepButtonHoverTextColor,
    onQueryChange,
    onPrev, onNext, onFinish
}: Teletraan1Props): JSX.Element => {

    const [dualToggled, setDualToggled] = useState(false);
    const contextValue = { readOnlyMode, brandColor, design, darkModeColors };
    const formikContext = useFormikContext<any>();

    const renderInput = (query: XFormQuery, toggledNode?: ReactNode): JSX.Element => {
        const normalizedType = query.inputType.toLocaleLowerCase();
        const uid = String(query.queryId || query.inputAlias);
        const colSpan = query.inputWidth == null || query.inputWidth > 12 || query.inputWidth < 1 ? 12 : query.inputWidth;

        const handleValueChange = (val: any) => {
            if (onQueryChange) onQueryChange(query.inputAlias, val);
        };

        const layoutProps = {
            alias: query.inputAlias,
            inputLabel: query.inputLabel,
            width: colSpan,
            newRow: query.newRow,
            readOnly: readOnlyMode,
            isHinted: query.isHinted,
            hintText: query.hintText || "",
            hintUrl: query.hintUrl || "",
            errorText: query.errorText,
            placeholder: query.inputPlaceholder,
            design: design,
            fontFamily: fontFamily,
            darkMode: !!darkModeColors,
            activeColor: brandColor,
            backgroundColor: darkModeColors?.light,
            darkBackgroundColor: darkModeColors?.dark,
        };

        switch (true) {
            case buttonInputType.includes(normalizedType):
                return <Button key={uid} variant={design} darkMode={!!darkModeColors} backgroundColor={brandColor} fontFamily={fontFamily} onClick={handleValueChange}>{query.defaultValue}</Button>;
            
            case checkboxInputType.includes(normalizedType):
                return <CheckboxGroupInput key={uid} {...layoutProps} direction="row" options={query.inputOptions || [InputOptionsPlaceholder]} onOptionChange={handleValueChange} />;
            
            case conditionalInputType.includes(normalizedType): {
                const derivedTriggerType = normalizedType.includes('checkbox') 
                    ? 'checkbox' 
                    : normalizedType.includes('select') 
                        ? 'select' 
                        : 'toggle';
                return (
                    <ConditionalTrigger 
                        key={uid}
                        {...layoutProps} 
                        triggerType={derivedTriggerType} 
                        triggerValue={query.triggerValue} 
                        inputOptions={query.inputOptions}
                    >
                        {toggledNode}
                    </ConditionalTrigger>
                );
            }

            case datePickerInputType.includes(normalizedType):
                return <DatePickerInput key={uid} mode="date" {...layoutProps} onChange={handleValueChange} />;
            case dateRangePickerInputType.includes(normalizedType):
                return <DatePickerInput key={uid} mode="daterange" {...layoutProps} onChange={handleValueChange} />;
            case dateTimePickerInputType.includes(normalizedType):
                return <DatePickerInput key={uid} mode="datetime" {...layoutProps} onChange={handleValueChange} />;
            
            case fileInputType.includes(normalizedType):
                return <FileInput key={uid} {...layoutProps} onChange={handleValueChange} />;
            case fileMultipleInputType.includes(normalizedType):
                return <FileInput key={uid} multiple {...layoutProps} onChange={handleValueChange} />;
            
            case sliderInputType.includes(normalizedType):
                return <SliderInput key={uid} mode="single" stepvalue={Number(query.stepValue)} minvalue={Number(query.minValue)} maxvalue={Number(query.maxValue)} {...layoutProps} onChange={handleValueChange} />;
            case rangeSliderInputType.includes(normalizedType):
                return <SliderInput key={uid} mode="range" stepvalue={Number(query.stepValue)} minvalue={Number(query.minValue)} maxvalue={Number(query.maxValue)} {...layoutProps} onChange={handleValueChange} />;
            
            case dropdownInputType.includes(normalizedType):
                return <DropdownInput key={uid} {...layoutProps} inputOptions={query.inputOptions || [InputOptionsPlaceholder]} onOptionChange={handleValueChange} />;
            case countrydropdownInputType.includes(normalizedType):
                return <CountrySelectInput key={uid} displayFlag enableSearch {...layoutProps} onChange={handleValueChange} />;
            case countrymultiselectInputType.includes(normalizedType):
                return <CountrySelectInput key={uid} displayFlag enableSearch multiselect {...layoutProps} onChange={handleValueChange} />;
            case textInputType.includes(normalizedType):
                return <Input key={uid} {...layoutProps} onChange={handleValueChange} />;
            case passwordInputType.includes(normalizedType):
                return <PasswordInput key={uid} {...layoutProps} onChange={handleValueChange} />;
            case creditCardInputType.includes(normalizedType):
                return <CreditCardInput key={uid} {...layoutProps} onChange={handleValueChange} />;
            case currencyInputType.includes(normalizedType):
                return <CurrencyInput key={uid} {...layoutProps} onChange={handleValueChange} />;
            case stockInputType.includes(normalizedType):
                return <StockInput key={uid} {...layoutProps} defaultValue={query.defaultValue} onChange={handleValueChange} />;
            case radioInputType.includes(normalizedType):
                return <RadioGroupInput key={uid} {...layoutProps} direction="row" options={query.inputOptions || [InputOptionsPlaceholder]} onOptionChange={handleValueChange} />;
            case selectInputType.includes(normalizedType):
                return <SelectInput key={uid} {...layoutProps} options={query.inputOptions || [InputOptionsPlaceholder]} onOptionChange={handleValueChange} />;
            case toggleInputType.includes(normalizedType):
                return <ToggleInput key={uid} {...layoutProps} icon="layers" onChange={handleValueChange} />;
            
            default:
                return <Input key={uid} {...layoutProps} onChange={handleValueChange} />;
        }
    };

    const renderQueries = (queries: XFormQuery[]) => {
        if (!queries) return null;
        return queries.map((query) => {
            const childInput = query.toggledInput ? renderInput(query.toggledInput) : undefined;
            return renderInput(query, childInput);
        });
    };

    const renderDisplayMode = () => {
        const resolvedHeadingBg = headingBackgroundColor ?? brandColor;
        const resolvedHeadingText = headingTextColor ?? '#ffffff';
        const resolvedSubtitleText = headingTextColor ?? 'rgba(255, 255, 255, 0.85)';

        switch (displayMode) {
            case 'dual':
                return (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div
                                onClick={() => !readOnlyMode && setDualToggled(!dualToggled)}
                                role="switch"
                                aria-checked={dualToggled}
                                aria-label="Toggle accordion layout mode"
                                tabIndex={readOnlyMode ? -1 : 0}
                                onKeyDown={(e) => {
                                    if (readOnlyMode) return;
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setDualToggled(!dualToggled);
                                    }
                                }}
                                style={{
                                    width: '44px',
                                    height: '24px',
                                    borderRadius: '12px',
                                    backgroundColor: dualToggled ? (brandColor || 'var(--accent-9)') : 'var(--gray-5, #cbd5e1)',
                                    cursor: readOnlyMode ? 'not-allowed' : 'pointer',
                                    position: 'relative',
                                    transition: 'background-color 0.2s ease',
                                    padding: '2px',
                                    boxSizing: 'border-box',
                                    opacity: readOnlyMode ? 0.6 : 1
                                }}
                            >
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                        transform: dualToggled ? 'translateX(20px)' : 'translateX(0)',
                                        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                />
                            </div>
                            <Icon 
                                name="layers" 
                                height="20" 
                                width="20" 
                                color={dualToggled ? (brandColor || 'var(--accent-9)') : 'var(--gray-9, #64748b)'} 
                                style={{ opacity: readOnlyMode ? 0.5 : 1, cursor: readOnlyMode ? 'not-allowed' : 'pointer', transition: 'color 0.2s ease' }} 
                                onClick={() => !readOnlyMode && setDualToggled(!dualToggled)} 
                            />
                        </div>
                        
                        {dualToggled ? 
                            <Accordion.Root 
                                design={design}
                                darkMode={!!darkModeColors}
                                activeColor={brandColor}
                                defaultOpenId={xFormModel.model?.[0]?.sectionId ? String(xFormModel.model[0].sectionId) : undefined} 
                                allowMultiple 
                            >
                                {xFormModel.model.map((formsection) => (
                                    <Accordion.Item 
                                        key={formsection.sectionId} 
                                        sectionId={String(formsection.sectionId)} 
                                        title={formsection.title} 
                                        subtitle={formsection.subtitle} 
                                        icon={<Icon name={(formsection.icon || "fontfamily") as any}/>}
                                    >
                                        <Row>{renderQueries(formsection.queries)}</Row>
                                    </Accordion.Item>
                                ))}
                            </Accordion.Root>
                        : 
                            xFormModel.model.map((formsection) => (
                                <React.Fragment key={formsection.sectionId}>
                                    <SectionTitle 
                                        withSeparator={false} 
                                        backgroundColor={resolvedHeadingBg} 
                                        titleColor={resolvedHeadingText} 
                                        title={formsection.title} 
                                        subtitleColor={resolvedSubtitleText} 
                                        subTitle={formsection.subtitle} 
                                        icon={<Icon name={(formsection.icon || "fontfamily") as any} color={resolvedHeadingText} />}
                                    />
                                    <Row>{renderQueries(formsection.queries)}</Row>
                                </React.Fragment>
                            ))
                        }
                    </>
                );

            case 'accordion':
                return (
                    <Accordion.Root 
                        design={design}
                        darkMode={!!darkModeColors}
                        activeColor={brandColor}
                        defaultOpenId={xFormModel.model?.[0]?.sectionId ? String(xFormModel.model[0].sectionId) : undefined} 
                        allowMultiple 
                    >
                        {xFormModel.model.map((formsection) => (
                            <Accordion.Item 
                                key={formsection.sectionId} 
                                sectionId={String(formsection.sectionId)} 
                                title={formsection.title} 
                                subtitle={formsection.subtitle} 
                                icon={<Icon name={(formsection.icon || "fontfamily") as any}/>}
                            >
                                <Row>{renderQueries(formsection.queries)}</Row>
                            </Accordion.Item>
                        ))}
                    </Accordion.Root>
                );

            case 'codex':
                return (
                    <Codex.Root 
                        design={design}
                        darkMode={!!darkModeColors}
                        activeColor={brandColor}
                        strictValidation={strictValidation}
                    >
                        {xFormModel.model.map((formsection, index, array) => {
                            const handleNextClick = async (e?: any) => {
                                if (strictValidation && formikContext) {
                                    const errors = await formikContext.validateForm();
                                    let hasError = false;
                                    // Relaxed the type to any to satisfy Formik's nested touched object signature
                                    const touched: Record<string, any> = { ...formikContext.touched };
                                    
                                    const checkErrors = (queries: XFormQuery[]) => {
                                        queries.forEach(q => {
                                            if (errors[q.inputAlias]) {
                                                hasError = true;
                                                touched[q.inputAlias] = true;
                                            }
                                            if (q.toggledInput) checkErrors([q.toggledInput]);
                                        });
                                    };
                                    
                                    checkErrors(formsection.queries);
                                    
                                    if (hasError) {
                                        formikContext.setTouched(touched);
                                        return false;
                                    }
                                }
                                if (onNext) return onNext(e);
                                return true;
                            };

                            return (
                                <Codex.Item 
                                    key={formsection.sectionId} 
                                    stepId={String(formsection.sectionId)} 
                                    title={formsection.title}
                                    subtitleDescription={formsection.subtitle} 
                                    icon={<Icon name={(formsection.icon || "fontfamily") as any}/>}
                                >
                                    <Row>{renderQueries(formsection.queries)}</Row>
                                    <Codex.Controls 
                                        prevStepId={index > 0 ? String(array[index - 1].sectionId) : undefined} 
                                        nextStepId={index < array.length - 1 ? String(array[index + 1].sectionId) : undefined}
                                        onPrev={onPrev}
                                        onNext={handleNextClick}
                                        onFinish={() => onFinish}
                                        nextBackgroundColor={stepButtonColor}
                                        darkNextBackgroundColor={stepButtonColor}
                                        nextTextColor={stepButtonTextColor}
                                        darkNextTextColor={stepButtonTextColor}
                                        nextHoverColor={stepButtonHoverColor}
                                        darkNextHoverColor={stepButtonHoverColor}
                                        nextHoverTextColor={stepButtonHoverTextColor}
                                        darkNextHoverTextColor={stepButtonHoverTextColor}
                                        prevBackgroundColor={stepButtonColor}
                                        darkPrevBackgroundColor={stepButtonColor}
                                        prevTextColor={stepButtonTextColor}
                                        darkPrevTextColor={stepButtonTextColor}
                                        prevHoverColor={stepButtonHoverColor}
                                        darkPrevHoverColor={stepButtonHoverColor}
                                        prevHoverTextColor={stepButtonHoverTextColor}
                                        darkPrevHoverTextColor={stepButtonHoverTextColor}
                                    />
                                </Codex.Item>
                            );
                        })}
                    </Codex.Root>
                );

            case 'codice':
            default:
                return (
                    <React.Fragment key={xFormModel.uuid}>
                        {xFormModel.model.map((formsection) => (
                            <React.Fragment key={formsection.sectionId}>
                                <SectionTitle 
                                    withSeparator={false} 
                                    backgroundColor={resolvedHeadingBg} 
                                    titleColor={resolvedHeadingText} 
                                    title={formsection.title}
                                    subtitleColor={resolvedSubtitleText} 
                                    subTitle={formsection.subtitle} 
                                    icon={<Icon name={(formsection.icon || "fontfamily") as any} color={resolvedHeadingText} />}
                                />
                                <Row>{renderQueries(formsection.queries)}</Row>
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                );
        }
    };

    return (
        <TeletraanContext.Provider value={contextValue}>
            <style dangerouslySetInnerHTML={{ __html: `
                .mito-input-wrapper:has(.mito-input-field) .mito-input-base {
                    padding: 0 !important;
                }
            `}} />
            {renderDisplayMode()}
        </TeletraanContext.Provider>
    );
};