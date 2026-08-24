import { ReactNode, useEffect, useState } from "react";
import {
  DropdownChangeObject,
  Hint,
  InlineError,
  Label,
} from "@cmsgov/design-system";
import { Box, SystemStyleObject } from "@chakra-ui/react";
// utils
import {
  labelTextWithOptional,
  parseCustomHtml,
  shimComponent,
  useStore,
} from "utils";
// types
import { DropdownChoice, DropdownOptions } from "types";
// constants
import { dropdownDefaultOptionText } from "../../constants";

export const DropdownField = ({
  ariaLabel,
  name,
  label,
  options,
  hint,
  hydrate,
  nested,
  sxOverride,
  styleAsOptional,
  disabled,
}: Props) => {
  const { setAnswers, answers, errors } = useStore();

  useEffect(() => {
    setAnswers({ ...answers, [name]: "" });
  }, []);

  // fetch the option values and format them if necessary
  const formatOptions = (options: DropdownOptions[] | string) => {
    let dropdownOptions: any[] = [];
    if (options === "copyEligibleReports") {
      // will add back YoY copy
      dropdownOptions = [];
    } else if (typeof options === "string") {
      // will add back report field data options
      dropdownOptions = [];
    } else {
      dropdownOptions = options;
    }

    if (dropdownOptions[0]?.value !== "") {
      dropdownOptions.splice(0, 0, {
        label: dropdownDefaultOptionText,
        value: "",
      });
    }
    return dropdownOptions;
  };
  const formattedOptions = formatOptions(options);
  const defaultValue = formattedOptions[0];
  const [displayValue, setDisplayValue] = useState<DropdownChoice>(
    hydrate ?? defaultValue,
  );

  // update form data
  const onChangeHandler = async (event: DropdownChangeObject) => {
    const selectedValue = event.target.value;
    const selectedOption =
      formattedOptions.find((option) => option.value === selectedValue) ||
      defaultValue;
    setDisplayValue(selectedOption);
    setAnswers({ ...answers, [name]: selectedOption });
  };

  // update form field data & database data on blur
  const onBlurHandler = async () => {
    // if blanking field, trigger client-side field validation error
    if (displayValue?.value === defaultValue?.value) return;
  };

  // prepare error message, hint, and classes
  const errorMessage = errors?.[name]?.message as ReactNode;
  const parsedHint = hint ? parseCustomHtml(hint) : undefined;
  const ariaDescribedBy = `${name}__error${parsedHint ? ` ${name}-hint` : ""}`;
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const selectClasses = `ds-c-field${errorMessage ? " ds-c-field--error" : ""}`;
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  const InlineErrorShim = shimComponent(InlineError);

  return (
    <Box sx={sxOverride} className={`${nestedChildClasses} ${labelClass}`}>
      <Label htmlFor={name} id={`${name}-label`}>
        {labelText || ""}
      </Label>
      {parsedHint && <Hint id={`${name}-hint`}>{parsedHint}</Hint>}
      <InlineErrorShim id={`${name}__error`}>{errorMessage}</InlineErrorShim>
      <select
        name={name}
        id={name}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-invalid={!!errorMessage}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue?.value}
        className={selectClasses}
        disabled={disabled}
      >
        {formattedOptions.map((option) => (
          <option key={crypto.randomUUID()} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: any;
  options: DropdownOptions[] | string;
  nested?: boolean;
  clear?: boolean;
  autosave?: boolean;
  validateOnRender?: boolean;
  sxOverride?: SystemStyleObject;
  styleAsOptional?: boolean;
  disabled?: boolean;
  [key: string]: any;
}
