import { useContext, useEffect, useState } from "react";
import uuid from "react-uuid";
import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { EntityContext, ReportContext } from "components";
// types
import {
  AnyObject,
  DynamicFieldShape,
  EntityShape,
  InputChangeEvent,
  ReportStatus,
} from "types";
// utils
import { autosaveFieldData, getAutosaveFields, useStore } from "utils";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";

export const DynamicField = ({
  label,
  name,
  disabled,
  hint,
  hydrate,
}: Props) => {
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  const { report, selectedEntity } = useStore();
  const { updateReport } = useContext(ReportContext);
  const { prepareEntityPayload } = useContext(EntityContext);
  const [displayValues, setDisplayValues] = useState<DynamicFieldShape[]>([]);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState<number>(0);

  // get form context and register field
  const form = useFormContext();
  form.register(name);
  const fieldErrorState: AnyObject | undefined =
    form?.formState?.errors?.[name];

  // make formfield dynamic array with config options
  const { append, remove } = useFieldArray({
    name: name,
    shouldUnregister: true,
  });

  useEffect(() => {
    if (selectedEntity) {
      setSelectedEntityIndex(
        report?.fieldData?.[selectedEntity.type]?.findIndex(
          (entity: EntityShape) => entity.id == selectedEntity.id
        )
      );
    }
  }, [report]);

  // on displayValue change, set field array value to match
  useEffect(() => {
    form.setValue(name, displayValues, { shouldValidate: true });
  }, [displayValues]);

  // modify fieldData for update and delete operations
  const modifyFieldData = (newValues: DynamicFieldShape[]) => {
    const fieldData = report?.fieldData;
    if (
      selectedEntity &&
      fieldData?.[selectedEntity.type][selectedEntityIndex]
    ) {
      fieldData[selectedEntity.type][selectedEntityIndex] = {
        ...fieldData[selectedEntity.type][selectedEntityIndex],
        [name]: newValues,
      };
    }
    return fieldData;
  };

  // update display value on change
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { id, value } = event.target;
    const currentEntity = displayValues.find((entity) => entity.id === id);
    const currentEntityIndex = displayValues.indexOf(currentEntity!);
    const newDisplayValues = [...displayValues];
    newDisplayValues[currentEntityIndex].name = value;
    setDisplayValues(newDisplayValues);
  };

  // submit changed field data to database on blur
  const onBlurHandler = async () => {
    // trigger client-side validation so blank fields get client-side validation warning
    form.trigger(name);
    // prepare args for autosave
    const fields = getAutosaveFields({
      name,
      type: "dynamic",
      value: displayValues,
      defaultValue: undefined,
      overrideCheck: true,
      hydrationValue: hydrate,
    });

    const fieldData = modifyFieldData(displayValues);

    const reportArgs = {
      id: report?.id,
      reportType: report?.reportType,
      updateReport,
      fieldData,
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
    });
  };

  const appendNewRecord = () => {
    const newRecord = { id: uuid(), name: "" };
    append(newRecord);
    const newDisplayValues = [...displayValues, newRecord];
    setDisplayValues(newDisplayValues);
  };

  // delete selected record from DB
  const deleteRecord = async (selectedRecord: DynamicFieldShape) => {
    if (userIsEndUser) {
      const reportKeys = {
        reportType: report?.reportType,
        state: state,
        id: report?.id,
      };

      // queue selected entity for deletion from DB
      const { [name]: entity } = form.getValues();
      const filteredEntities = entity.filter(
        (entity: AnyObject) => entity.id !== selectedRecord.id
      );

      const fieldData = modifyFieldData(filteredEntities);

      const dataToWrite = {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: full_name,
        },
        fieldData,
      };

      await updateReport(reportKeys, dataToWrite);
      removeRecord(selectedRecord);
    }
  };

  // remove selected record from the UI
  const removeRecord = (selectedRecord: DynamicFieldShape) => {
    const index = displayValues.findIndex(
      (entity: DynamicFieldShape) => entity.id === selectedRecord.id
    );
    remove(index);
    let newDisplayValues = [...displayValues];
    newDisplayValues.splice(index, 1);
    if (newDisplayValues.length === 0) {
      const newEntity = { id: uuid(), name: "" };
      append(newEntity);
      newDisplayValues = [newEntity];
    }
    setDisplayValues(newDisplayValues);
  };

  // set initial value to form field value or hydration value
  useEffect(() => {
    const hydrationValue = hydrate;
    if (hydrationValue?.length) {
      // guard against autosave refresh error where user can change input values while save operation is still in progress (https://bit.ly/3kiE2eE)
      const newInputAdded = displayValues?.length > hydrationValue?.length;
      const existingInputChanged =
        displayValues?.length === hydrationValue?.length &&
        displayValues !== hydrationValue;
      const valuesToSet =
        newInputAdded || existingInputChanged ? displayValues : hydrationValue;
      // set and append values
      setDisplayValues(valuesToSet);
    } else {
      appendNewRecord();
    }
  }, []); // only runs on hydrationValue fetch/update

  return (
    <Box>
      {displayValues.map((field: DynamicFieldShape, index: number) => {
        return (
          <Flex key={field.id} sx={sx.dynamicField}>
            <CmsdsTextField
              id={field.id}
              name={`${name}[${index}]`}
              hint={hint}
              label={label}
              errorMessage={fieldErrorState?.[index]?.name?.message}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={field.name}
            />
            {!disabled && (
              <Box sx={sx.removeBox}>
                <button type="button" onClick={() => deleteRecord(field)}>
                  <Image
                    sx={sx.removeImage}
                    src={cancelIcon}
                    alt={`Delete ${field.name}`}
                  />
                </button>
              </Box>
            )}
          </Flex>
        );
      })}
      {!disabled && (
        <Button
          variant="outline"
          sx={sx.appendButton}
          onClick={appendNewRecord}
        >
          Add a row
        </Button>
      )}
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
  hint?: string;
  hydrate?: DynamicFieldShape[];
}

const sx = {
  removeBox: {
    marginBottom: "0.625rem",
    marginLeft: "0.625rem",
  },
  removeImage: {
    width: "1.25rem",
    height: "1.25rem",
  },
  appendButton: {
    width: "12.5rem",
    height: "2.5rem",
    marginTop: "2rem",
  },
  dynamicField: {
    alignItems: "flex-end",
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
};
