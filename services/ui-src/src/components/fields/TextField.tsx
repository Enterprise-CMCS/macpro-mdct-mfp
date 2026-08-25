import { HTMLInputAutoCompleteAttribute, ReactNode, useEffect, useState } from "react";
// components
import { SystemStyleObject } from "@chakra-ui/react";
import { TextFieldDisplay } from "components";
// utils
import {
  FieldInfo,
  labelTextWithOptional,
  parseCustomHtml,
  updatedTextFields,
  useStore,
} from "utils";
// types
import {
  InputChangeEvent,
  CustomHtmlElement,
  ReportFormFieldType,
} from "types";

export const TextField = ({
  ariaLabelledby,
  autoComplete,
  autosave = false,
  disabled = false,
  heading,
  hint,
  hydrate,
  label,
  maxLength,
  multiline = false,
  name,
  nested = false,
  placeholder,
  rows,
  styleAsOptional = false,
  sxOverride,
  updateFieldValues,
}: Props) => {
  const { report, selectedEntity, setAnswer, errors, setField } = useStore();
  const defaultValue = hydrate ?? "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  useEffect(() => {
    setField(name);
  }, [])

  // update display value and form field data on change
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { value } = event.target;
    setDisplayValue(value);
    setAnswer(name, value);
  };

  // if should autosave, submit field data on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { value } = event.target;

    if (autosave) {
      const entityFieldData = selectedEntity
        ? { ...report?.fieldData, ...selectedEntity }
        : report?.fieldData;

      const fieldsToSave = updatedTextFields(
        [{ name, type: ReportFormFieldType.TEXT, value }],
        entityFieldData,
      );

      updateFieldValues(fieldsToSave);
    }
  };

  // prepare error message, hint, and classes
  const errorMessage = errors[name]?.message as ReactNode;
  const parsedHint = hint ? parseCustomHtml(hint) : undefined;
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  return (
    <TextFieldDisplay
      ariaLabelledby={ariaLabelledby}
      autoComplete={autoComplete}
      disabled={disabled}
      errorMessage={errorMessage}
      heading={heading}
      hint={parsedHint}
      id={name}
      label={labelText || ""}
      maxLength={maxLength}
      multiline={multiline}
      name={name}
      nested={nested}
      onBlur={onBlurHandler}
      onChange={onChangeHandler}
      placeholder={placeholder}
      rows={rows}
      sxOverride={sxOverride}
      value={displayValue}
    />
  );
};

interface Props {
  ariaLabelledby?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  autosave?: boolean;
  disabled?: boolean;
  heading?: string;
  hint?: CustomHtmlElement[];
  hydrate?: string;
  label?: string;
  maxLength?: number;
  multiline?: boolean;
  name: string;
  nested?: boolean;
  placeholder?: string;
  rows?: number;
  styleAsOptional?: boolean;
  sxOverride?: SystemStyleObject;
  updateFieldValues: (fieldsToSave: FieldInfo[]) => {};
}
