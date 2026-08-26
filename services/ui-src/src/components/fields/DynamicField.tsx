import { useEffect, useState } from "react";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
// types
import {
  DynamicFieldShape,
  InputChangeEvent,
  ReportFormFieldType,
} from "types";
// utils
import { FieldInfo, useStore } from "utils";
// assets
import addIcon from "assets/icons/icon_add.png";
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";

export const DynamicField = ({
  autosave = false,
  disabled = false,
  dynamicButtonText,
  dynamicLabel,
  hint,
  label,
  multiline = false,
  name,
  rows = 3,
  updateFieldValues,
}: Props) => {
  const { selectedEntity, setAnswer, fields, setField } = useStore();
  const [displayValues, setDisplayValues] = useState<DynamicFieldShape[]>(
    selectedEntity?.[name] ?? [],
  );

  useEffect(() => {
    if (displayValues.length === 0) {
      appendNewRecord();
    }
    setField(name, displayValues);
  }, []);

  // update display value on change
  const onChangeHandler = (event: InputChangeEvent) => {
    const { id, value } = event.target;
    const currentEntityIndex = displayValues.findIndex(
      (entity) => entity.id === id,
    );

    const newDisplayValues = [...displayValues];
    newDisplayValues[currentEntityIndex].name = value;
    setDisplayValues(newDisplayValues);
    setAnswer(name, newDisplayValues);
  };

  // submit changed field data to database on blur
  const onBlurHandler = async () => {
    if (autosave) {
      const fields = [
        { name, type: ReportFormFieldType.DYNAMIC, displayValues },
      ];
      updateFieldValues(fields);
    }
  };

  const appendNewRecord = () => {
    const newRecord = { id: crypto.randomUUID(), name: "" };
    const newDisplayValues = [...displayValues, newRecord];
    setDisplayValues(newDisplayValues);
  };

  // remove selected record from the UI
  const removeRecord = (selectedRecord: DynamicFieldShape) => {
    const index = displayValues.findIndex(
      (entity: DynamicFieldShape) => entity.id === selectedRecord.id,
    );
    let newDisplayValues = [...displayValues];
    newDisplayValues.splice(index, 1);
    if (newDisplayValues.length === 0) {
      const newEntity = { id: crypto.randomUUID(), name: "" };
      newDisplayValues = [newEntity];
    }
    setDisplayValues(newDisplayValues);
  };

  const hintId = `${name}__hint`;
  const ariaProps = hint ? { "aria-describedby": hintId } : {};

  return (
    <Box as="fieldset" sx={sx.fieldset} {...ariaProps}>
      <Box
        as="legend"
        className="ds-c-label"
        sx={dynamicLabel ? sx.legendWithDynamicLabel : sx.legend}
      >
        {label}
      </Box>
      {hint && (
        <Text className="ds-c-hint" id={hintId}>
          {hint}
        </Text>
      )}

      {displayValues.map((field: DynamicFieldShape, index: number) => {
        const errorMessage = fields.get(name)?.error.message;
        const hasError = Boolean(errorMessage);
        const textareaStyle = hasError
          ? sx.removeBoxTextareaError
          : sx.removeBoxTextarea;
        const removeBoxStyle = multiline ? textareaStyle : sx.removeBoxInput;

        return (
          <Flex
            key={field.id}
            sx={{
              ...(dynamicLabel
                ? sx.dynamicFieldWithDynamicLabel
                : sx.dynamicField),
              ...(multiline ? sx.dynamicFieldTextarea : sx.dynamicFieldInput),
            }}
          >
            <CmsdsTextField
              errorMessage={errorMessage}
              hint={undefined}
              id={field.id}
              label={dynamicLabel}
              multiline={multiline}
              name={`${name}[${index}]`}
              onBlur={onBlurHandler}
              onChange={onChangeHandler}
              rows={rows}
              value={field.name || ""}
            />
            {!disabled && (
              <Box sx={removeBoxStyle}>
                <button type="button" onClick={() => removeRecord(field)}>
                  <Image
                    sx={
                      multiline ? sx.removeImageTextarea : sx.removeImageInput
                    }
                    src={cancelIcon}
                    alt={`Delete ${field.name || field.id}`}
                  />
                </button>
              </Box>
            )}
          </Flex>
        );
      })}
      {!disabled && (
        <Button
          leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="" />}
          onClick={appendNewRecord}
          sx={sx.appendButton}
          variant="outline"
        >
          {dynamicButtonText || "Add a row"}
        </Button>
      )}
    </Box>
  );
};

interface Props {
  autosave?: boolean;
  disabled?: boolean;
  dynamicButtonText?: string;
  dynamicLabel?: string;
  hint?: string;
  label: string;
  multiline?: boolean;
  name: string;
  rows?: number;
  updateFieldValues: (fieldsToSave: FieldInfo[]) => {};
}

const sx = {
  fieldset: {
    marginTop: "spacer3",
  },
  legend: {
    fontSize: "md",
  },
  legendWithDynamicLabel: {
    fontSize: "xl",
  },
  removeBoxInput: {
    marginBottom: "0.625rem",
    marginLeft: "0.625rem",
  },
  removeBoxTextarea: {
    marginLeft: "0.625rem",
    marginTop: "0",
  },
  removeBoxTextareaError: {
    marginLeft: "0.625rem",
    marginTop: "1.625rem",
  },
  removeImageInput: {
    width: "1.25rem",
    height: "1.25rem",
  },
  removeImageTextarea: {
    width: "1.5rem",
    height: "1.5rem",
  },
  appendButton: {
    width: "12.5rem",
    height: "2.5rem",
    marginTop: "2rem",
  },
  buttonIcons: {
    height: "1rem",
  },
  dynamicField: {
    ".desktop &": {
      width: "32rem",
    },
    ".tablet &": {
      width: "29rem",
    },
    ".ds-u-clearfix": {
      width: "100%",
    },
    "&:not(:first-of-type)": {
      paddingTop: "2rem",
    },
  },
  dynamicFieldWithDynamicLabel: {
    ".desktop &": {
      width: "32rem",
    },
    ".tablet &": {
      width: "29rem",
    },
    ".ds-u-clearfix": {
      width: "100%",
    },
  },
  dynamicFieldInput: {
    alignItems: "flex-end",
  },
  dynamicFieldTextarea: {
    alignItems: "center",
  },
};
