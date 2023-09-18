import { useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import {
  formFieldFactory,
  labelTextWithOptional,
  parseCustomHtml,
  useStore,
} from "utils";
import {
  AnyObject,
  Choice,
  CustomHtmlElement,
  FieldChoice,
  FormField,
  InputChangeEvent,
} from "types";

export const ChoiceListField = ({
  name,
  type,
  label,
  choices,
  hint,
  nested,
  sxOverride,
  styleAsOptional,
  ...props
}: Props) => {
  const defaultValue: Choice[] = [];
  const [displayValue, setDisplayValue] = useState<Choice[]>(defaultValue);

  const { state: userIsReadOnly, userIsAdmin } = useStore().user ?? {};

  const report = useStore().report;

  const shouldDisableChildFields =
    ((userIsAdmin || userIsReadOnly) && !!props?.disabled) || report?.locked;

  // get form context and register field
  const form = useFormContext();

  // format choices with nested child fields to render (if any)
  const formatChoices = (choices: FieldChoice[]) => {
    return choices.map((choice: FieldChoice) => {
      setCheckedOrUnchecked(choice);
      const choiceObject: FieldChoice = { ...choice };
      const choiceChildren = choice?.children;
      if (choiceChildren) {
        const isNested = true;
        const formattedChildren = formFieldFactory(choiceChildren, {
          disabled: shouldDisableChildFields,
          nested: isNested,
        });
        choiceObject.checkedChildren = formattedChildren;
      }
      delete choiceObject.children;
      return choiceObject;
    });
  };

  const clearUncheckedNestedFields = (choices: FieldChoice[]) => {
    choices.forEach((choice: FieldChoice) => {
      // if a choice is not selected and there are children, clear out any saved data
      if (choice.children) {
        choice.children.forEach((child: FormField) => {
          switch (child.type) {
            case "radio":
            case "checkbox":
              if (child.props?.choices) {
                child.props.choices.forEach((choice: FieldChoice) => {
                  choice.checked = false;
                });
                child.props = { ...child.props, clear: true };
                form.setValue(child.id, []);
                form.unregister(child.id);
                clearUncheckedNestedFields(child.props.choices);
              }
              break;
            default:
              child.props = { ...child.props, clear: true };
              form.setValue(child.id, "");
              form.unregister(child.id);
              break;
          }
        });
      }
    });
  };

  const setCheckedOrUnchecked = (choice: FieldChoice) => {
    const checkedState = displayValue?.find(
      (option) => option.value === choice.value
    );
    choice.checked = !!checkedState;
  };

  // update field values
  const onChangeHandler = (event: InputChangeEvent) => {
    const clickedOption = { key: event.target.id, value: event.target.value };
    const isOptionChecked = event.target.checked;
    const preChangeFieldValues = displayValue || [];
    let selectedOptions = null;

    // handle radio
    if (type === "radio") {
      let everyOtherOption = choices.filter(
        (choice) => choice.id != clickedOption.key
      );
      clearUncheckedNestedFields(everyOtherOption);
      selectedOptions = [clickedOption];
      setDisplayValue(selectedOptions);
      form.setValue(name, selectedOptions, { shouldValidate: true });
    }
    // handle checkbox
    if (type === "checkbox") {
      if (!isOptionChecked) {
        let option = choices.find((choice) => choice.id == clickedOption.key);
        clearUncheckedNestedFields([option!]);
      }
      const checkedOptionValues = [...preChangeFieldValues, clickedOption];
      const uncheckedOptionValues = preChangeFieldValues.filter(
        (field) => field.value !== clickedOption.value
      );
      selectedOptions = isOptionChecked
        ? checkedOptionValues
        : uncheckedOptionValues;
      setDisplayValue(selectedOptions);
      form.setValue(name, selectedOptions, { shouldValidate: true });
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
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${nestedChildClasses} ${labelClass}`}
    >
      <CmsdsChoiceList
        name={name}
        type={type}
        label={labelText || ""}
        choices={formatChoices(choices)}
        hint={parsedHint}
        errorMessage={errorMessage}
        onChange={onChangeHandler}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  type: "checkbox" | "radio";
  label?: string;
  choices: FieldChoice[];
  hint?: CustomHtmlElement[];
  nested?: boolean;
  sxOverride?: AnyObject;
  styleAsOptional?: boolean;
  [key: string]: any;
}

const sx = {
  // checkboxes
  ".ds-c-choice[type='checkbox']:checked::after": {
    boxSizing: "content-box",
  },
};
