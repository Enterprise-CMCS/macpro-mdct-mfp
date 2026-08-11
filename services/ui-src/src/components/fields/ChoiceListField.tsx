import { ReactNode, useState } from "react";
// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box, SystemStyleObject } from "@chakra-ui/react";
// utils
import {
  FieldInfo,
  formFieldFactory,
  labelTextWithOptional,
  parseCustomHtml,
  useStore,
} from "utils";
// types
import {
  AutosaveField,
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
  autosave,
  validateOnRender,
  sxOverride,
  styleAsOptional,
  clear,
  updateFieldValues,
  ...props
}: Props) => {
  const defaultValue: Choice[] = [];
  const [displayValue, setDisplayValue] = useState<Choice[]>(
    props?.hydrate ?? defaultValue,
  );
  const { editable, answers, setAnswers, errors } = useStore();
  //closeout will disables only certain parts of an active form
  const shouldDisableChildFields = !editable || !!props?.disabled;

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
          autosave: autosave,
          updateFieldValues: updateFieldValues,
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
                setAnswers({...answers, [child.id]:[]})
                clearUncheckedNestedFields(child.props.choices);
              }
              break;
            default:
              child.props = { ...child.props, clear: true };
              setAnswers({...answers, [child.id]:""})
              break;
          }
        });
      }
    });
  };

  const setCheckedOrUnchecked = (choice: FieldChoice) => {
    const checkedState = displayValue?.find(
      (option) => option.value === choice.value,
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
        (choice) => choice.id != clickedOption.key,
      );
      clearUncheckedNestedFields(everyOtherOption);
      selectedOptions = [clickedOption];
      setDisplayValue(selectedOptions);

      //TEST: REMOVE
      setAnswers({...answers, [event.target.name] : selectedOptions})
    }
    // handle checkbox
    if (type === "checkbox") {
      if (!isOptionChecked) {
        let option = choices.find((choice) => choice.id == clickedOption.key);
        clearUncheckedNestedFields([option!]);
      }
      const checkedOptionValues = [...preChangeFieldValues, clickedOption];
      const uncheckedOptionValues = preChangeFieldValues.filter(
        (field) => field.value !== clickedOption.value,
      );
      selectedOptions = isOptionChecked
        ? checkedOptionValues
        : uncheckedOptionValues;
      setDisplayValue(selectedOptions);      
      
      //TEST: REMOVE
      setAnswers({...answers, [event.target.name] : selectedOptions})
    }
  };

  // if should autosave, submit field data to database on component blur
  const onComponentBlurHandler = () => {
    if (autosave) {
      const fields = [
        {
          name,
          type,
          value: displayValue,
        },
      ];

      const choicesWithNestedEnabledFields = choices.map((choice) => {
        if (choice.children) {
          return {
            ...choice,
            children: choice.children.filter((child) => !child.props?.disabled),
          };
        }
        return choice;
      });

      const combinedFields = [
        ...fields,
        ...getNestedChildFields(choicesWithNestedEnabledFields, answers),
      ];

      if (updateFieldValues) {
        updateFieldValues(combinedFields);
      }
    }
  };

  const errorMessage = errors?.[name]?.message as ReactNode;
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
        choices={formatChoices(choices) as any[]}
        hint={parsedHint}
        errorMessage={errorMessage}
        onChange={onChangeHandler}
        onComponentBlur={onComponentBlurHandler}
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
  sxOverride?: SystemStyleObject;
  styleAsOptional?: boolean;
  updateFieldValues?: (fieldsToSave: FieldInfo[]) => {};
  [key: string]: any;
}

const sx = {
  // checkboxes
  ".ds-c-choice[type='checkbox']:checked::after": {
    boxSizing: "content-box",
  },
};

export const getNestedChildFields = (
  choices: FieldChoice[],
  answers: any,
): AutosaveField[] => {
  // set up nested field compilation
  const nestedFields: any = [];
  const compileNestedFields = (fields: FormField[]) => {
    fields.forEach((field: FormField) => {
      // for each child field, get field info
      const fieldDefaultValue = ["radio", "checkbox"].includes(field.type)
        ? []
        : "";

      const fieldInfo = [
        {
          name: field.id,
          type: field.type,
          value: answers[field.id] || fieldDefaultValue,
        },
      ];
      // add to nested fields to be autosaved
      nestedFields.push(fieldInfo);
      // recurse through additional nested children as needed
      const fieldChoices = field.props?.choices;
      fieldChoices?.forEach(
        (choice: FieldChoice) =>
          choice.children && compileNestedFields(choice.children),
      );
    });
  };

  choices.forEach((choice: FieldChoice) => {
    if (choice.children) {
      compileNestedFields(choice.children);
    }
  });
  return nestedFields;
};
