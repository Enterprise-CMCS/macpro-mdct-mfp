import {
  HTMLInputAutoCompleteAttribute,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";
// components
import { EntityContext, NumberFieldDisplay, ReportContext } from "components";
// utils
import {
  applyMask,
  autosaveFieldData,
  cleanAndMaskNumberValues,
  getAutosaveFields,
  labelTextWithOptional,
  makeStringParseableForDatabase,
  maskMap,
  parseCustomHtml,
  updatedNumberFields,
  useStore,
} from "utils";
// types
import { SystemStyleObject } from "@chakra-ui/react";
import {
  CustomHtmlElement,
  InputChangeEvent,
  ReportFormFieldType,
} from "types";

export const NumberField = ({
  ariaLabelledby,
  autoComplete,
  autosave = false,
  clear = false,
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
  validateOnRender = false,
}: Props) => {
  const defaultValue = initialValue;
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
      const maskedFieldValue = applyMask(
        fieldValue,
        mask,
        decimalPlacesToRoundTo
      ).maskedValue;
      setDisplayValue(maskedFieldValue);
    }
    // else set hydrationValue or defaultValue display value
    else if (hydrationValue) {
      if (clear) {
        setDisplayValue(defaultValue);
        form.setValue(name, defaultValue);
      } else {
        const formattedHydrationValue = applyMask(
          hydrationValue,
          mask,
          decimalPlacesToRoundTo
        );
        const maskedHydrationValue = formattedHydrationValue.maskedValue;
        setDisplayValue(maskedHydrationValue);

        // this value eventually gets sent to the database, so we need to make it parseable as a number again
        const cleanedFieldValue = formattedHydrationValue.isValid
          ? makeStringParseableForDatabase(maskedHydrationValue, mask)
          : maskedHydrationValue;
        form.setValue(name, cleanedFieldValue, { shouldValidate: true });
      }
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update form data on change, but do not mask
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });

    if (handleOnChange) handleOnChange(event);
  };

  // if should autosave, submit field data to database on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) form.trigger(name);

    // update display value with masked value
    const { cleanedFieldValue, maskedFieldValue } = cleanAndMaskNumberValues({
      decimalPlacesToRoundTo,
      mask,
      value,
    });

    form.setValue(name, cleanedFieldValue, { shouldValidate: true });
    setDisplayValue(maskedFieldValue);

    // submit field data to database (inline validation is run prior to API call)
    if (autosave) {
      // track the state of autosave in state management
      setAutosaveState(true);
      const fields = getAutosaveFields({
        name,
        type: ReportFormFieldType.NUMBER,
        value: cleanedFieldValue,
        defaultValue,
        hydrationValue,
      });
      const fieldsToSave = updatedNumberFields(fields, report?.fieldData);

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
  mask?: keyof typeof maskMap | null;
  name: string;
  nested?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  styleAsOptional?: boolean;
  sxOverride?: SystemStyleObject;
  validateOnRender?: boolean;
}
