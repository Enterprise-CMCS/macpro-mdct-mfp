import { useState, useEffect, useContext } from "react";
import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box, Heading } from "@chakra-ui/react";
// utils
import {
  autosaveFieldData,
  getAutosaveFields,
  labelTextWithOptional,
  parseCustomHtml,
  useStore,
} from "utils";
import { InputChangeEvent, AnyObject, CustomHtmlElement } from "types";
import { ReportContext } from "components";
import { EntityContext } from "components/reports/EntityProvider";

export const TextField = ({
  name,
  label,
  hint,
  placeholder,
  sxOverride,
  nested,
  autosave,
  validateOnRender,
  styleAsOptional,
  heading,
  ...props
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
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  return (
    <Box sx={sxOverride} className={`${nestedChildClasses} ${labelClass}`}>
      {/* SAR field sections */}
      {heading && <Heading sx={sx.fieldHeading}>{heading}</Heading>}
      <CmsdsTextField
        id={name}
        name={name}
        label={labelText || ""}
        hint={parsedHint}
        placeholder={placeholder}
        onChange={(e) => onChangeHandler(e)}
        onBlur={(e) => onBlurHandler(e)}
        errorMessage={errorMessage}
        value={displayValue}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  placeholder?: string;
  sxOverride?: AnyObject;
  nested?: boolean;
  autosave?: boolean;
  styleAsOptional?: boolean;
  heading?: string;
  clear?: boolean;
  [key: string]: any;
}

const sx = {
  fieldHeading: {
    fontSize: "28px",
    paddingTop: "1.5rem",
  },
};
