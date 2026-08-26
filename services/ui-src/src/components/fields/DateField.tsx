import { ReactNode, useEffect, useState } from "react";
import { Box, SystemStyleObject } from "@chakra-ui/react";
// components
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
// types
import { CustomHtmlElement, InputChangeEvent } from "types";
// utils
import {
  labelTextWithOptional,
  checkDateCompleteness,
  parseCustomHtml,
  FieldInfo,
  useStore,
} from "utils";

export const DateField = ({
  ariaLabelledby,
  name,
  label,
  hint,
  sxOverride,
  nested,
  autosave,
  validateOnRender,
  styleAsOptional,
  updateFieldValues,
  ...props
}: Props) => {
  const { setAnswer, fields, setField } = useStore();
  const defaultValue = props?.hydrate ?? "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // update field display value and form field data on change
  const onChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayValue(rawValue);
    setAnswer(name, rawValue);
  };

  useEffect(() => {
    setField(name, displayValue);
  }, [])

  // if should autosave, submit field data to database on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) return;

    //submit field data to database
    if (autosave) {
      const fields = [
        {
          name,
          type: "date",
          value,
        },
      ];
      updateFieldValues(fields);
    }
  };

  // prepare error message, hint, and classes
  const errorMessage = fields.get(name)?.error.message as ReactNode;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  const { autoComplete, disabled } = props ?? {};
  const additionalProps = { autoComplete, disabled };

  const ariaProps = {
    "aria-labelledby": ariaLabelledby,
  };

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${labelClass} ${nestedChildClasses} date-field`}
    >
      <CmsdsDateField
        name={name}
        label={labelText || ""}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
        {...additionalProps}
        {...ariaProps}
      />
    </Box>
  );
};

interface Props {
  ariaLabelledby?: string;
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  timetype?: string;
  nested?: boolean;
  autosave?: boolean;
  validateOnRender?: boolean;
  sxOverride?: SystemStyleObject;
  styleAsOptional?: boolean;
  clear?: boolean;
  [key: string]: any;
  updateFieldValues: (fieldsToSave: FieldInfo[]) => {};
}

const sx = {
  // input box
  ".ds-c-single-input-date-field__field-wrapper": {
    maxWidth: "7rem",
  },
  // unlabelled child field hints
  "&.ds-c-choice__checkedChild.no-label": {
    ".ds-c-field__hint": {
      marginBottom: "spacer_half",
    },
  },
  ".optional-text": {
    fontWeight: "lighter",
  },
};
