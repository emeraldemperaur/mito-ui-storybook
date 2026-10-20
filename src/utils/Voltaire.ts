import type { XFormQuery, XFormType } from "./Voltron";

/**
 * @module Voltaire
 * @description Lexical registry mapping string variations from JSON schemas to their respective React UI components.
 * All arrays are strictly typed as `readonly string[]` to prevent SSR memory mutations.
 */

export const avatarInputType: readonly string[] = ["avatar", "avatarinput", "avatar-input", "input-avatar", "inputavatar"];
export const buttonInputType: readonly string[] = ["button", "buttoninput", "button-input", "input-button", "inputbutton"];
export const checkboxInputType: readonly string[] = ["checkbox", "checkboxes", "checkboxinput", "chechbox-input", "input-checkbox", "inputcheckbox", "checkboxgroup-input"];
export const datePickerInputType: readonly string[] = ["datepicker", "datepickerinput", "datepicker-input", "input-datepicker", "inputdatepicker"];
export const dateRangePickerInputType: readonly string[] = ["daterangepicker", "daterangepickerinput", "daterangepicker-input", "input-daterangepicker", "inputdaterangepicker"];
export const dateTimePickerInputType: readonly string[] = ["datetimepicker", "datetimepickerinput", "datetimepicker-input", "input-datetimepicker", "inputdatetimepicker"];
export const dropdownInputType: readonly string[] = ["dropdown", "dropdowninput", "dropdown-input", "input-dropdown", "inputdropdown"];
export const countrydropdownInputType: readonly string[] = [
  "countrydropdown", "countrydropdowninput", "countrydropdown-input", "input-countrydropdown", "inputcountrydropdown", 
  "countryselect", "countryselect-input", "countryselectinput", "input-countryselect"
];
export const countrymultiselectInputType: readonly string[] = ["countrymultiselect", "countrymultiselectinput", "countrymultiselect-input", "input-countrymultiselect", "inputcountrymultiselect"];
export const fileInputType: readonly string[] = ["file", "fileinput", "file-input", "input-file", "inputfile"];
export const fileMultipleInputType: readonly string[] = ["filemultiple", "filemultipleinput", "filemultiple-input", "input-filemultiple", "inputfilemultiple"];
export const imageOutputType: readonly string[] = ["image", "imageoutput", "image-output", "output-image", "outputimage"];
export const textInputType: readonly string[] = ["text", "textinput", "text-input", "input-text", "inputtext"];
export const passwordInputType: readonly string[] = ["password", "passwordinput", "password-input", "input-password", "inputpassword"];
export const phoneInputType: readonly string[] = ["phone", "phoneinput", "phone-input", "input-phone", "inputphone"];
export const creditCardInputType: readonly string[] = ["creditcard", "creditcardinput", "creditcard-input", "input-creditcard", "inputcreditcard"];
export const currencyInputType: readonly string[] = ["currency", "currencyinput", "currency-input", "input-currency", "inputcurrency"];
export const stockInputType: readonly string[] = ["stock", "stockinput", "stock-input", "input-stock", "inputstock"];
export const radioInputType: readonly string[] = ["radio", "radioinput", "radio-input", "input-radio", "inputradio", "radiogroup", "radiogroup-input"];
export const selectInputType: readonly string[] = ["select", "selectinput", "select-input", "input-select", "inputselect", "optionselect", "optionselect-input", "input-optionselect"];
export const selectMultipleInputType: readonly string[] = ["selectmultiple", "selectmultipleinput", "selectmultiple-input", "input-selectmultiple", "inputselectmultiple"];
export const sliderInputType: readonly string[] = ["slider", "sliderinput", "slider-input", "input-slider", "inputslider"];
export const rangeSliderInputType: readonly string[] = ["range", "rangeslider", "rangeinput", "rangesliderinput", "rangeslider-input", "range-input", "input-rangeslider", "inputrangeslider"];
export const toggleInputType: readonly string[] = ["toggle", "switch", "toggleinput", "toggle-input", "input-toggle", "inputtoggle"];
export const sectionTitleOutputType: readonly string[] = ["title", "xtitle", "sectiontitle", "titlesection"];
export const conditionalInputType: readonly string[] = ["conditional", "conditionaltoggle", "conditionalcheckbox", "conditionalselect", "conditional-toggle", "conditional-select", "conditional-checkbox"];

/**
 * @function generateInitialValues
 * @description Extracts a flattened key-value record from an XFormType schema based on `inputAlias` and `defaultValue`.
 * Recursively inspects conditional toggled queries to ensure deep form hydration.
 * @param {XFormType} schema The complete validated XForm model.
 * @returns {Record<string, unknown>} A flattened dictionary of initial states ready for Formik injection.
 */
export const generateInitialValues = (schema: XFormType): Record<string, unknown> => {
    const initials: Record<string, unknown> = {};
    
    const traverseQueries = (queries: XFormQuery[]) => {
      queries.forEach(query => {
        initials[query.inputAlias] = query.defaultValue ?? "";
        if (query.toggledInput) {
          traverseQueries([query.toggledInput]);
        }
      });
    };
    
    schema.model.forEach(section => traverseQueries(section.queries));
    return initials;
};