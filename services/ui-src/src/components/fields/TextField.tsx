import { useState, useEffect, useContext, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
// components
import { SystemStyleObject } from "@chakra-ui/react";
import { ReportContext, TextFieldDisplay } from "components";
import { EntityContext } from "components/reports/EntityProvider";
// utils
import {
  autosaveFieldData,
  getAutosaveFields,
  labelTextWithOptional,
  parseCustomHtml,
  useStore,
} from "utils";
// types
import { InputChangeEvent, CustomHtmlElement } from "types";

export const TextField = ({
  ariaLabelledby,
  autoComplete,
  autosave,
  clear,
  disabled,
  heading,
  hint,
  hydrate,
  label,
  maxLength,
  multiline,
  name,
  nested,
  placeholder,
  rows,
  styleAsOptional,
  sxOverride,
  validateOnRender,
}: Props) => {
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const fieldIsRegistered = name in form.getValues();
  const { full_name, state } = useStore().user ?? {};
  const { report, selectedEntity, setAutosaveState } = useStore();
  const { updateReport } = useContext(ReportContext);
  const { prepareEntityPayload } = useContext(EntityContext);

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
      if (clear) {
        setDisplayValue(defaultValue);
        form.setValue(name, defaultValue);
      } else {
        setDisplayValue(hydrationValue);
        form.setValue(name, hydrationValue, { shouldValidate: true });
      }
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update display value and form field data on change
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  // if should autosave, submit field data on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { value } = event.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) form.trigger(name);
    // submit field data to database
    if (autosave) {
      //track the state of autosave in state management
      setAutosaveState(true);
      const fields = getAutosaveFields({
        name,
        type: "text",
        value,
        defaultValue,
        hydrationValue,
      });
      const reportArgs = {
        id: report?.id,
        reportType: report?.reportType,
        updateReport,
      };
      const user = { userName: full_name, state };
      await autosaveFieldData({
        form,
        fields,
        report: reportArgs,
        user,
        entityContext: {
          selectedEntity,
          prepareEntityPayload,
        },
      }).then(() => {
        setAutosaveState(false);
      });
    }
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message as ReactNode;
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
  autosave?: boolean;
  clear?: boolean;
  heading?: string;
  hint?: CustomHtmlElement[];
  label?: string;
  maxLength?: number;
  multiline?: boolean;
  name: string;
  nested?: boolean;
  placeholder?: string;
  rows?: number;
  styleAsOptional?: boolean;
  sxOverride?: SystemStyleObject;
  [key: string]: any;
}
