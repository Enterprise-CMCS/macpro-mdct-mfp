import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Box } from "@chakra-ui/react";
import { AnyObject, CustomHtmlElement, InputChangeEvent } from "types";
// utils
import {
  labelTextWithOptional,
  checkDateCompleteness,
  parseCustomHtml,
} from "utils";
// components
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";

export const DateField = ({
  name,
  label,
  hint,
  sxOverride,
  nested,
  styleAsOptional,
  ...props
}: Props) => {
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // get form context and register form field
  const form = useFormContext();

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate || defaultValue;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setDisplayValue(fieldValue);
    }
    // else set hydrationValue or defaultValue as display value
    else if (hydrationValue) {
      if (props.clear) {
        setDisplayValue(defaultValue);
        form.setValue(name, defaultValue);
      } else {
        setDisplayValue(hydrationValue);
        form.setValue(name, hydrationValue, { shouldValidate: true });
      }
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update field display value and form field data on change
  const onChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayValue(rawValue);
    const isValidDate = checkDateCompleteness(maskedValue);
    if (isValidDate || maskedValue === "") {
      form.setValue(name, maskedValue, { shouldValidate: true });
    }
  };

  // if should autosave, submit field data to database on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) form.trigger(name);
    /*
     * submit field data to database
     * if (autosave) {
     *   const fields = getAutosaveFields({
     *     name,
     *     type: "date",
     *     value,
     *     defaultValue,
     *     hydrationValue,
     *   });
     *   const reportArgs = {
     *     id: report?.id,
     *     reportType: report?.reportType,
     *     updateReport,
     *   };
     *   const user = { userName: full_name, state };
     *   await autosaveFieldData({
     *     form,
     *     fields,
     *     report: reportArgs,
     *     user,
     *     entityContext: {
     *       selectedEntity,
     *       entityType,
     *       updateEntities,
     *       entities,
     *     },
     *   });
     * }
     */
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

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
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  timetype?: string;
  nested?: boolean;
  autosave?: boolean;
  validateOnRender?: boolean;
  sxOverride?: AnyObject;
  styleAsOptional?: boolean;
  clear?: boolean;
  [key: string]: any;
}

const sx = {
  // input box
  ".ds-c-single-input-date-field__field-wrapper": {
    maxWidth: "7rem",
  },
  // unlabelled child field hints
  "&.ds-c-choice__checkedChild.no-label": {
    ".ds-c-field__hint": {
      marginBottom: "0.25rem",
    },
  },
  ".optional-text": {
    fontWeight: "lighter",
  },
};
