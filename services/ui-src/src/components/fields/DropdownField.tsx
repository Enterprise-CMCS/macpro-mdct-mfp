import { ReactNode, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  DropdownChangeObject,
  Hint,
  InlineError,
  Label,
} from "@cmsgov/design-system";
import { Box, SystemStyleObject } from "@chakra-ui/react";
import uuid from "react-uuid";
// utils
import { labelTextWithOptional, parseCustomHtml, shimComponent } from "utils";
// types
import { DropdownChoice, DropdownOptions, SelectedOption } from "types";
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
  validateOnRender,
  sxOverride,
  styleAsOptional,
  disabled,
}: Props) => {
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
  const [displayValue, setDisplayValue] =
    useState<DropdownChoice>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const fieldIsRegistered = name in form.getValues();

  useEffect(() => {
    if (!fieldIsRegistered && !validateOnRender) {
      form.register(name);
    } else if (validateOnRender) {
      form.trigger(name);
    }
  }, []);

  // set initial display value to form state field value or hydration value
  const hydrationValue = hydrate || defaultValue;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setDisplayValue(fieldValue);
    }
    // else set hydrationValue or defaultValue as display value
    else if (hydrationValue) {
      setDisplayValue(hydrationValue);
      form.setValue(name, hydrationValue);
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update form data
  const onChangeHandler = async (event: DropdownChangeObject) => {
    const selectedOption: SelectedOption = {
      label: event.target.name,
      value: event.target.value,
    };
    setDisplayValue(selectedOption);
    form.setValue(name, selectedOption, { shouldValidate: true });
  };

  // update form field data & database data on blur
  const onBlurHandler = async () => {
    // if blanking field, trigger client-side field validation error
    if (displayValue?.value === defaultValue?.value) form.trigger(name);
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message as ReactNode;
  const parsedHint = hint ? parseCustomHtml(hint) : undefined;
  const ariaDescribedBy = parsedHint ? `${name}-hint` : undefined;
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
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
      {errorMessage && <InlineErrorShim>{errorMessage}</InlineErrorShim>}
      <select
        name={name}
        id={name}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-invalid="false"
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue?.value}
        className="ds-c-field"
        disabled={disabled}
      >
        {formattedOptions.map((option) => (
          <option key={uuid()} value={option.value}>
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
  autosave?: boolean;
  validateOnRender?: boolean;
  sxOverride?: SystemStyleObject;
  styleAsOptional?: boolean;
  disabled?: boolean;
  [key: string]: any;
}
