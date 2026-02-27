import {
  HTMLInputAutoCompleteAttribute,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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
  clear = false,
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
  validateOnRender = false,
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

    // submit field data to database (inline validation is run prior to API call)
    if (autosave) {
      // track the state of autosave in state management
      setAutosaveState(true);
      const fields = getAutosaveFields({
        name,
        type: ReportFormFieldType.TEXT,
        value,
        defaultValue,
        hydrationValue,
      });
      const fieldsToSave = updatedTextFields(fields, report?.fieldData);

      const reportArgs = {
        id: report?.id,
        reportType: report?.reportType,
        updateReport,
      };
      const user = { userName: full_name, state };

      await autosaveFieldData({
        form,
        fields: fieldsToSave,
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
  ariaLabelledby?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  autosave?: boolean;
  clear?: boolean;
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
  validateOnRender?: boolean;
}
