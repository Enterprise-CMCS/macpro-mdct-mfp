import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { SystemStyleObject } from "@chakra-ui/react";
// components
import { EntityContext, NumberFieldDisplay, ReportContext } from "components";
// utils
import {
  autosaveFieldData,
  getAutosaveFields,
  labelTextWithOptional,
  parseCustomHtml,
  updatedNumberFields,
  useStore,
} from "utils";
import { makeStringParseableForDatabase } from "utils/other/clean";
import { applyMask, maskMap } from "utils/other/mask";
// types
import { InputChangeEvent, ReportFormFieldType } from "types";

export const NumberField = ({
  ariaLabelledby,
  autoComplete,
  autosave,
  clear,
  decimalPlacesToRoundTo,
  disabled,
  handleOnChange,
  hint,
  hydrate,
  initialValue = "",
  label,
  mask,
  name,
  nested,
  placeholder,
  readOnly,
  styleAsOptional,
  sxOverride,
  validateOnRender,
}: Props) => {
  const defaultValue = initialValue;
  const [displayValue, setDisplayValue] = useState(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const fieldIsRegistered = name in form.getValues();
  const { full_name, state } = useStore().user ?? {};
  const { report, selectedEntity } = useStore();
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
  const onChangeHandler = async (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });

    if (handleOnChange) handleOnChange(e);
  };

  // update display value with masked value; if should autosave, submit field data to database on blur
  const onBlurHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) form.trigger(name);
    // mask value and set as display value
    const formattedFieldValue = applyMask(value, mask, decimalPlacesToRoundTo);
    const maskedFieldValue = formattedFieldValue.maskedValue;

    // this value eventually gets sent to the database, so we need to make it parseable as a number again
    const cleanedFieldValue = formattedFieldValue.isValid
      ? makeStringParseableForDatabase(maskedFieldValue, mask)
      : maskedFieldValue;
    form.setValue(name, cleanedFieldValue, { shouldValidate: true });
    setDisplayValue(maskedFieldValue);

    //submit field data to database (inline validation is run prior to API call)
    if (autosave) {
      const fields = getAutosaveFields({
        name,
        type: ReportFormFieldType.NUMBER,
        value: cleanedFieldValue,
        defaultValue,
        hydrationValue,
      });
      const fieldsToSave = updatedNumberFields(fields, report);

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
  autosave?: boolean;
  clear?: boolean;
  initialValue?: string;
  label?: string;
  mask?: keyof typeof maskMap | null;
  name: string;
  nested?: boolean;
  placeholder?: string;
  sxOverride?: SystemStyleObject;
  validateOnRender?: boolean;
  [key: string]: any;
}
