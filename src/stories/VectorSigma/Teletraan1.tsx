"use client";

import React, { useState, createContext, useContext, type JSX } from 'react';
import { type FormikHelpers } from 'formik';
import { Accordion, AccordionItem } from '../Layout/Accordion';
import { Codex, CodexItem, CodexControls } from '../Layout/Codex';
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

import { type InputOption, InputOptionsPlaceholder } from "../../utils/Vinci";
import { 
    buttonInputType, checkboxInputType, conditionalInputType, countrydropdownInputType, countrymultiselectInputType, creditCardInputType, 
    currencyInputType, datePickerInputType, dateRangePickerInputType, dateTimePickerInputType, dropdownInputType, 
    fileInputType, fileMultipleInputType, passwordInputType, radioInputType, rangeSliderInputType, selectInputType, 
    sliderInputType, stockInputType, textInputType, toggleInputType 
} from "../../utils/Voltaire";
import type { XFormType, XFormQuery } from '../../utils/Voltron';
import { VectorSigma } from './VectorSigma';

export type Teletraan1Display = 'accordion' | 'codice' | 'codex' | 'dual';

export interface Teletraan1Props {
    /** The required xFormModel {} schema object that will be rendered as an xForm. */
    xFormModel: XFormType;
    /** Option to render xForm as readonly (inputs disabled). @default false */
    readOnlyMode?: boolean;
    /** Option to specify the xForm display mode. @default 'codice' */
    displayMode?: Teletraan1Display;
    /** Option to specify the xForm primary color. @default '#000000' */
    brandColor?: string;
    /** Dynamic light/dark mode colors injected into the CSS variables for the entire form tree. */
    darkModeColors?: { light: string; dark: string };
    /** Optional callback for Codex display controls triggered before navigating to a previous step. */
    onPrev?: () => void;
    /** Optional callback for Codex display controls triggered before navigating to a next step. */
    onNext?: () => void;
    /** Optional callback for Codex display control triggered when the Finish button is clicked. */
    onFinish?: (values: any, actions: FormikHelpers<any>, instance: VectorSigma<any>) => void | Promise<any>;
}

/** Global Context Provider.*/
interface TeletraanContextValue {
    readOnlyMode: boolean;
    brandColor: string;
    darkModeColors?: { light: string; dark: string };
}
const TeletraanContext = createContext<TeletraanContextValue | null>(null);

export const useTeletraanContext = () => useContext(TeletraanContext);

/**
 * @component Teletraan1
 * @description The core rendering engine for XForm schemas. Parses JSON/JS objects into a fully functional 
 * React component tree with SSR compatibility and global Context Provider support.
 */
export const Teletraan1 = ({ 
    xFormModel, 
    readOnlyMode = false, 
    displayMode = 'codice', 
    brandColor = "#000000",
    darkModeColors,
    onPrev, onNext, onFinish
}: Teletraan1Props): JSX.Element => {

    const [dualToggled, setDualToggled] = useState(false);
    
    const contextValue = { readOnlyMode, brandColor, darkModeColors };

    const inputAlphaTrion = (
        inputAlias: string, inputType: string, inputWidth: number, inputLabel: string, 
        inputMinValue: number | string, inputMaxValue: number | string, defaultValue: any, inputOptions?: InputOption[],
        stepValue?: number | string, _inputHeight?: number | string, toggledInput?: React.ReactNode, triggerValue?: any,
        newRow?: boolean, inputPlaceholder?: string, readOnly?: boolean, isHinted?: boolean, 
        hintText?: string, hintUrl?: string, errorText?: string, inputUID?: string
    ) => {
        const width = inputWidth == null || inputWidth > 12 ? 4 : inputWidth;
        const uid = inputUID || crypto.randomUUID();
        const isReadonly = readOnlyMode || readOnly;

        const normalizedType = inputType.toLocaleLowerCase();

        const layoutProps = {
            alias: inputAlias,
            width: width,
            inputLabel: inputLabel,
            key: uid,
            newRow: newRow,
            readOnly: isReadonly,
            isHinted: isHinted,
            hintText: hintText,
            hintUrl: hintUrl,
            errorText: errorText,
            darkModeColors: darkModeColors,
            design: 'neumorphic' as const
        };

        switch(true){
            case buttonInputType.includes(normalizedType):
                return <Button {...layoutProps}>{defaultValue}</Button>
            
            case checkboxInputType.includes(normalizedType):
                return <CheckboxGroupInput {...layoutProps} direction='row' options={inputOptions || [InputOptionsPlaceholder]} />
            
            // --- CONDITIONAL TRIGGER MAPPING ---
            case conditionalInputType.includes(normalizedType):
                const derivedTriggerType = normalizedType.includes('checkbox') 
                  ? 'checkbox' 
                  : normalizedType.includes('select') 
                    ? 'select' 
                    : 'toggle';
                
                return (
                  <ConditionalTrigger 
                    {...layoutProps} 
                    triggerType={derivedTriggerType} 
                    triggerValue={triggerValue} 
                    inputOptions={inputOptions}
                    placeholder={inputPlaceholder}
                  >
                    {toggledInput}
                  </ConditionalTrigger>
                );
            // --- DATE SUPER COMPONENT MAPPING ---
            case datePickerInputType.includes(normalizedType):
                return <DatePickerInput mode="date" {...layoutProps} placeholder={inputPlaceholder} />
            case dateRangePickerInputType.includes(normalizedType):
                return <DatePickerInput mode="daterange" {...layoutProps} placeholder={inputPlaceholder}/>
            case dateTimePickerInputType.includes(normalizedType):
                return <DatePickerInput mode="datetime" {...layoutProps} placeholder={inputPlaceholder}/>
            // --- FILE SUPER COMPONENT MAPPING ---
            case fileInputType.includes(normalizedType):
                return <FileInput {...layoutProps} />
            case fileMultipleInputType.includes(normalizedType):
                return <FileInput multiple {...layoutProps} />
            // --- SLIDER SUPER COMPONENT MAPPING ---
            case sliderInputType.includes(normalizedType):
                return <SliderInput mode="single" {...layoutProps} stepvalue={Number(stepValue)} minvalue={Number(inputMinValue)} maxvalue={Number(inputMaxValue)} />
            case rangeSliderInputType.includes(normalizedType):
                return <SliderInput mode="range" {...layoutProps} stepvalue={Number(stepValue)} minvalue={Number(inputMinValue)} maxvalue={Number(inputMaxValue)} />
            // --- STANDARD INPUT MAPPINGS ---
            case dropdownInputType.includes(normalizedType):
                return <DropdownInput {...layoutProps} placeholder={inputPlaceholder} inputOptions={inputOptions || [InputOptionsPlaceholder]} />
            case countrydropdownInputType.includes(normalizedType):
                return <CountrySelectInput displayFlag enableSearch {...layoutProps} placeholder={inputPlaceholder} />
            case countrymultiselectInputType.includes(normalizedType):
                return <CountrySelectInput displayFlag enableSearch multiselect {...layoutProps} placeholder={inputPlaceholder} />
            case textInputType.includes(normalizedType):
                return <Input {...layoutProps} placeholder={inputPlaceholder} />
            case passwordInputType.includes(normalizedType):
                return <PasswordInput {...layoutProps} placeholder={inputPlaceholder} />
            case creditCardInputType.includes(normalizedType):
                return <CreditCardInput {...layoutProps} placeholder={inputPlaceholder} />
            case currencyInputType.includes(normalizedType):
                return <CurrencyInput {...layoutProps} placeholder={inputPlaceholder} />
            case stockInputType.includes(normalizedType):
                return <StockInput {...layoutProps} placeholder={inputPlaceholder} defaultValue={defaultValue} />
            case radioInputType.includes(normalizedType):
                return <RadioGroupInput {...layoutProps} direction="row" options={inputOptions || [InputOptionsPlaceholder]} />
            case selectInputType.includes(normalizedType):
                return <SelectInput {...layoutProps} placeholder={inputPlaceholder} options={inputOptions || [InputOptionsPlaceholder]} />
            case toggleInputType.includes(normalizedType):
                return <ToggleInput {...layoutProps} icon="layers"/>
            
            default:
                return <Input {...layoutProps} placeholder={inputPlaceholder} />
        }
    };

    const renderQueries = (queries: XFormQuery[]) => {
        if (!queries) return null;
        return queries.map((xFormelement) => {
            const childInput = xFormelement.toggledInput ? inputAlphaTrion(
                xFormelement.toggledInput.inputAlias, xFormelement.toggledInput.inputType, xFormelement.toggledInput.inputWidth, 
                xFormelement.toggledInput.inputLabel, String(xFormelement.toggledInput.minValue), String(xFormelement.toggledInput.maxValue), 
                xFormelement.toggledInput.defaultValue, xFormelement.toggledInput.inputOptions, xFormelement.toggledInput.stepValue, 
                xFormelement.toggledInput.inputHeight, null, 
                null, xFormelement.toggledInput.newRow, 
                xFormelement.toggledInput.inputPlaceholder, readOnlyMode, xFormelement.toggledInput.isHinted, xFormelement.toggledInput.hintText || "", 
                xFormelement.toggledInput.hintUrl || "", xFormelement.toggledInput.errorText, String(xFormelement.toggledInput.queryId) || crypto.randomUUID()
            ) : null;

            return inputAlphaTrion(
                xFormelement.inputAlias, xFormelement.inputType, xFormelement.inputWidth, xFormelement.inputLabel,
                String(xFormelement.minValue), String(xFormelement.maxValue), xFormelement.defaultValue, xFormelement.inputOptions, 
                xFormelement.stepValue, xFormelement.inputHeight, 
                childInput,
                xFormelement.triggerValue, xFormelement.newRow, 
                xFormelement.inputPlaceholder, readOnlyMode, xFormelement.isHinted, xFormelement.hintText || "", 
                xFormelement.hintUrl || "", xFormelement.errorText, String(xFormelement.queryId) || crypto.randomUUID()
            );
        });
    };

    const renderDisplayMode = () => {
        switch (displayMode) {
            case 'dual':
                return (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                            <button 
                                type="button"
                                role="switch"
                                aria-checked={dualToggled}
                                aria-label="Toggle display mode"
                                className="tele-dual-toggle"
                                style={{ opacity: readOnlyMode ? 0.6 : 1, pointerEvents: readOnlyMode ? 'none' : 'auto' }}
                                onClick={() => setDualToggled(!dualToggled)}
                            >
                                <style dangerouslySetInnerHTML={{__html: `
                                    .tele-dual-toggle { 
                                        all: unset; isolation: isolate; position: relative; height: 32px; width: 64px; border-radius: 16px; 
                                        cursor: pointer; background: var(--color-surface, #ecf0f3); 
                                        box-shadow: inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7); 
                                    }
                                    .tele-dual-toggle:focus-visible { outline: 2px solid var(--ui-brand-color, #000); outline-offset: 2px; }
                                    .tele-dual-indicator { 
                                        position: absolute; top: 2px; left: 2px; height: 28px; width: 28px; background: var(--color-surface, #ecf0f3); 
                                        border-radius: 50%; transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); 
                                        box-shadow: 2px 2px 5px rgba(0,0,0,0.2), -2px -2px 5px rgba(255,255,255,0.8); 
                                    }
                                    .tele-dual-toggle[aria-checked="true"] .tele-dual-indicator { transform: translateX(32px); }
                                `}} />
                                <div className="tele-dual-indicator"></div>
                            </button>
                            <Icon name="layers" height="20" width="20" color={brandColor} style={{ opacity: readOnlyMode ? 0.5 : 1, cursor: 'pointer' }} onClick={() => setDualToggled(!dualToggled)} />
                        </div>
                        {dualToggled ? 
                            <Accordion defaultOpenId={xFormModel.model?.[0]?.sectionId ? String(xFormModel.model[0].sectionId) : ''} allowMultiple brandcolor={brandColor} titleColor='#ffffff'>
                                {xFormModel.model.map((formsection) => (
                                    <AccordionItem key={formsection.sectionId} sectionId={String(formsection.sectionId)} title={formsection.title} 
                                    subtitle={ formsection.subtitle ? formsection.subtitle : undefined } icon={<Icon name={(formsection.icon || "fontfamily") as any}/>}>
                                        <Row key={formsection.sectionId}>{renderQueries(formsection.queries)}</Row>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        : 
                            xFormModel.model.map((formsection) => (
                                <React.Fragment key={formsection.sectionId || crypto.randomUUID()}>
                                    <SectionTitle withSeparator={false} backgroundColor={brandColor} titleColor='#FFFFFF' title={formsection.title} 
                                    subtitleColor='#FFFFFF' subTitle={formsection.subtitle ? formsection.subtitle : undefined} icon={<Icon name={(formsection.icon || "fontfamily") as any}/>}/>
                                    <Row>{renderQueries(formsection.queries)}</Row>
                                </React.Fragment>
                            ))
                        }
                    </>
                );

            case 'accordion':
                return (
                    <Accordion defaultOpenId={xFormModel.model?.[0]?.sectionId ? String(xFormModel.model[0].sectionId) : ''} allowMultiple brandcolor={brandColor} titleColor='#ffffff'>
                        {xFormModel.model.map((formsection) => (
                            <AccordionItem key={formsection.sectionId} sectionId={String(formsection.sectionId)} title={formsection.title} 
                            subtitle={ formsection.subtitle ? formsection.subtitle : undefined } icon={<Icon name={(formsection.icon || "fontfamily") as any}/>}>
                                <Row key={formsection.sectionId}>{renderQueries(formsection.queries)}</Row>
                            </AccordionItem>
                        ))}
                    </Accordion>
                );

            case 'codex':
                return (
                    <Codex brandcolor={brandColor}>
                        {xFormModel.model.map((formsection, index, array) => (
                            <CodexItem key={formsection.sectionId} stepId={String(formsection.sectionId)} title={formsection.title}
                            subtitleDescription={formsection.subtitle ? formsection.subtitle : undefined} icon={<Icon name={(formsection.icon || "fontfamily") as any}/>}>
                                <Row key={formsection.sectionId}>{renderQueries(formsection.queries)}</Row>
                                <CodexControls 
                                    prevStepId={index > 0 ? String(array[index - 1].sectionId) : undefined} 
                                    nextStepId={index < array.length - 1 ? String(array[index + 1].sectionId) : undefined}
                                    onPrev={onPrev}
                                    onNext={onNext}
                                    onFinish={() => onFinish}
                                />
                            </CodexItem>
                        ))}
                    </Codex>
                );

            case 'codice':
            default:
                return (
                    <React.Fragment key={xFormModel.uuid}>
                        {xFormModel.model.map((formsection) => (
                            <React.Fragment key={formsection.sectionId || crypto.randomUUID()}>
                                <SectionTitle withSeparator={false} backgroundColor={brandColor} titleColor='#FFFFFF' title={formsection.title}
                                subtitleColor='#FFFFFF' subTitle={formsection.subtitle ? formsection.subtitle : undefined} icon={<Icon name={(formsection.icon || "fontfamily") as any}/>}/>
                                <Row>{renderQueries(formsection.queries)}</Row>
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                );
        }
    };

    return (
        <TeletraanContext.Provider value={contextValue}>
            {renderDisplayMode()}
        </TeletraanContext.Provider>
    );
};