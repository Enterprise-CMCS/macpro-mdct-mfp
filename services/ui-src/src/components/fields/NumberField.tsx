import {
  HTMLInputAutoCompleteAttribute,
  ReactNode,
  useEffect,
  useState,
} from "react";
// components
import { NumberFieldDisplay } from "components";
// utils
import {
  applyMask,
  cleanAndMaskNumberValues,
  FieldInfo,
  labelTextWithOptional,
  parseCustomHtml,
  updatedNumberFields,
  useStore,
} from "utils";
// types
import { SystemStyleObject } from "@chakra-ui/react";
import {
  CustomHtmlElement,
  InputChangeEvent,
  NumberMask,
  ReportFormFieldType,
} from "types";

export const NumberField = ({
  ariaLabelledby,
  autoComplete,
  autosave = false,
  decimalPlacesToRoundTo,
  disabled = false,
  handleOnChange,
  hint,
  hydrate,
  initialValue = "",
  label,
  mask,
  name,
  nested = false,
  placeholder,
  readOnly = false,
  styleAsOptional = false,
  sxOverride,
  updateFieldValues,
}: Props) => {
  const defaultValue = hydrate ?? initialValue;
  const [displayValue, setDisplayValue] = useState<string>(
    applyMask(defaultValue, mask, decimalPlacesToRoundTo).maskedValue,
  );

  const { report, selectedEntity, setAnswers, answers, errors } = useStore();

  useEffect(() => {
    setAnswers({ ...answers, [name]: "" });
  }, []);

  // update form data on change, but do not mask
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    setAnswers({ ...answers, [name]: value });

    if (handleOnChange) handleOnChange(event);
  };

  // if should autosave, submit field data to database on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) return;

    // update display value with masked value
    const { cleanedFieldValue, maskedFieldValue } = cleanAndMaskNumberValues({
      decimalPlacesToRoundTo,
      mask,
      value,
    });

    setDisplayValue(maskedFieldValue);

    // submit field data to database (inline validation is run prior to API call)
    if (autosave) {
      const entityFieldData = selectedEntity
        ? { ...report?.fieldData, ...selectedEntity }
        : report?.fieldData;

      const fieldsToSave = updatedNumberFields(
        [
          {
            name,
            type: ReportFormFieldType.NUMBER,
            value: cleanedFieldValue,
          },
        ],
        entityFieldData,
      );

      updateFieldValues(fieldsToSave);
    }
  };

  // prepare error message, hint, and classes
  const errorMessage = errors?.[name]?.message as ReactNode;
  const parsedHint = hint ? parseCustomHtml(hint) : undefined;
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  return (
    <NumberFieldDisplay
      ariaLabelledby={ariaLabelledby}
      autoComplete={autoComplete}
      disabled={disabled}
      errorMessage={errorMessage}
      hint={parsedHint}
      id={name}
      label={labelText}
      mask={mask}
      name={name}
      nested={nested}
      onBlur={onBlurHandler}
      onChange={onChangeHandler}
      placeholder={placeholder}
      readOnly={readOnly}
      sxOverride={sxOverride}
      value={displayValue}
    />
  );
};

interface Props {
  ariaLabelledby?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  autosave?: boolean;
  clear?: boolean;
  decimalPlacesToRoundTo?: number;
  disabled?: boolean;
  handleOnChange?: Function;
  hint?: CustomHtmlElement[];
  hydrate?: string;
  initialValue?: string;
  label?: string;
  mask?: NumberMask | null;
  name: string;
  nested?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  styleAsOptional?: boolean;
  sxOverride?: SystemStyleObject;
  validateOnRender?: boolean;
  updateFieldValues: (fieldsToSave: FieldInfo[]) => {};
}
