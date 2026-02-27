import {
  ChangeEventHandler,
  createContext,
  FocusEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box, Flex, Text } from "@chakra-ui/react";
import { EntityContext, ReportContext } from "components";
// types
import {
  AnyObject,
  DynamicFieldShape,
  DynamicRowsTemplate,
  FormField,
  InputChangeEvent,
  ReportShape,
} from "types";
// utils
import uuid from "react-uuid";
import {
  autosaveFieldData,
  createTempDynamicId,
  debounce,
  formFieldFactory,
  getAutosaveFields,
  getFieldParts,
  hydrateFormFields,
  isTempDynamicField,
  maskResponseData,
  recalculateDynamicFields,
  updateRenderFields,
  updatedFieldDataOnFieldChange,
  useStore,
} from "utils";

export const DynamicTableContext = createContext<DynamicTableMethods>({
  addDynamicRow: Function,
  displayCell: Function,
  displayDynamicCell: Function,
  displayReadOnlyCell: Function,
  focusedRowIndex: null,
  localFieldData: {},
  removeDynamicRow: Function,
  setFocusedRowIndex: Function,
  setLocalFieldData: Function,
});

export const DynamicTableProvider = ({ children }: any) => {
  const form = useFormContext();
  const { full_name, state } = useStore().user ?? {};
  const { selectedEntity } = useStore();
  const report = useStore().report ?? ({} as ReportShape);
  const { fieldData } = report;
  const { updateReport } = useContext(ReportContext);
  const { prepareEntityPayload } = useContext(EntityContext);

  const [localFieldData, setLocalFieldData] = useState<AnyObject>({});
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalFieldData(fieldData);
  }, [fieldData]);

  const updatedFieldsForDisplay = useCallback(
    ({
      fieldData,
      id,
      name,
      value,
      percentage,
      tableId,
    }: UpdatedFieldsForDisplay) => {
      const updatedFieldData = updatedFieldDataOnFieldChange({
        fieldData,
        id,
        name,
        percentage,
        tableId,
        value,
      });
      setLocalFieldData(updatedFieldData);
    },
    []
  );

  const debouncedUpdateReport = useMemo(
    () => debounce(updatedFieldsForDisplay, 1),
    [updatedFieldsForDisplay]
  );

  const displayReadOnlyCell = ({
    id,
    hydrate,
    initialValue,
    mask,
    rowIndex,
  }: DisplayReadOnlyCellOptions) => {
    const cellValue = localFieldData?.[id] ?? hydrate ?? initialValue;
    const readOnlyValue = Array.isArray(cellValue)
      ? (cellValue?.[rowIndex]?.name ?? initialValue)
      : cellValue;

    return (
      <Text as="span" sx={sx.calculated}>
        {maskResponseData(readOnlyValue, mask)}
      </Text>
    );
  };

  const displayCell = ({
    ariaLabelledby,
    cell,
    columnId,
    disabled,
    formData,
    id,
    percentage,
    rowId,
    rowIndex,
    tableId,
  }: DisplayCellOptions) => {
    if (typeof cell === "string") return cell;

    const props = cell.props || {};
    const { initialValue, mask, readOnly } = props;
    const cellId = id ?? cell.id;

    const renderReadOnly = (hydrate?: string) =>
      displayReadOnlyCell({
        id: cellId,
        hydrate,
        initialValue,
        mask,
        rowIndex,
      });

    const field = {
      ...cell,
      id: cellId,
      props: {
        ...props,
        ariaLabelledby: ariaLabelledby || `${rowId} ${columnId}`,
        label: undefined,
        handleOnChange: (e: InputChangeEvent) =>
          debouncedUpdateReport({
            fieldData: localFieldData,
            id: e.target.id,
            name: e.target.name,
            value: e.target.value,
            percentage,
            tableId,
          }),
      },
    };

    const updatedReport = {
      ...report,
      fieldData: localFieldData,
    };

    const [hydratedField] = hydrateFormFields(
      updateRenderFields(updatedReport, [field], formData),
      formData
    );

    let hydrateValue;
    let hydratedProps;

    if (isTempDynamicField(hydratedField.id)) {
      const { dynamicFieldId, dynamicTemplateId, fieldType } = getFieldParts(
        hydratedField.id
      );
      const dynFieldData = localFieldData?.[dynamicTemplateId] || [];
      const dynField = dynFieldData.find(
        (f: DynamicFieldShape) => f.id === dynamicFieldId
      );

      hydrateValue = dynField?.[fieldType];
      hydratedProps = {
        ...hydratedField.props,
        hydrate: hydrateValue,
      };
    }

    if (readOnly) return renderReadOnly(hydrateValue);

    const fieldsToRender = [
      {
        ...hydratedField,
        ...hydratedProps,
      },
    ];

    return formFieldFactory(fieldsToRender, {
      autosave: true,
      disabled,
      validateOnRender: false,
    });
  };

  const displayDynamicCell = (props: DisplayDynamicCellOptions) => {
    const { cell, dynamicId, rowId } = props;

    if (typeof cell === "string") return cell;

    // Only used in UI
    const tempDynamicId = createTempDynamicId(cell.id, dynamicId);

    if (cell.props?.dynamicLabel) {
      const dynamicLabelId = `${tempDynamicId}_dynamic-label`;

      return (
        <Flex>
          <Box sx={sx.label}>
            <label htmlFor={tempDynamicId} id={dynamicLabelId}>
              {cell.props?.dynamicLabel}
            </label>
          </Box>
          {displayCell({
            ...props,
            ariaLabelledby: `${rowId} ${dynamicLabelId}`,
            id: tempDynamicId,
          })}
        </Flex>
      );
    }

    return displayCell({
      ...props,
      id: tempDynamicId,
    });
  };

  const addDynamicRow = async (dynamicRowsTemplate: DynamicRowsTemplate) => {
    const { id, type, props } = dynamicRowsTemplate;

    const dynamicKeys = props?.dynamicFields.map((field: FormField) => {
      const { fieldType } = getFieldParts(field.id);
      return [fieldType, field.props?.initialValue ?? ""];
    });
    const rows = localFieldData?.[dynamicRowsTemplate.id] || [];

    const newId = uuid();
    const updatedRows = [
      ...rows,
      {
        id: newId,
        name: newId,
        ...Object.fromEntries(dynamicKeys),
      },
    ];

    const newRowIndex = updatedRows.length - 1;
    setFocusedRowIndex(newRowIndex);

    const updatedFieldData = {
      ...localFieldData,
      [id]: updatedRows,
    };
    setLocalFieldData(updatedFieldData);

    const fields = getAutosaveFields({
      name: id,
      type,
      value: updatedRows,
      overrideCheck: true,
      hydrationValue: rows,
    });

    const fieldData = {
      ...localFieldData,
      [id]: updatedRows,
    };

    const reportArgs = {
      id: report.id,
      reportType: report.reportType,
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

  const removeDynamicRow = async (
    dynamicTemplateId: string,
    dynamicFieldId: string
  ) => {
    const { formId, tableId } = getFieldParts(dynamicTemplateId);
    const updatedFields = recalculateDynamicFields({
      dynamicFieldId,
      dynamicTemplateId: dynamicTemplateId,
      fieldData: localFieldData,
      formId,
      tableId,
      // Set row to be deleted value to 0
      value: 0,
    });

    const rows = localFieldData?.[dynamicTemplateId] || [];
    // Remove row to be deleted
    const updatedRows = rows.filter(
      (row: DynamicFieldShape) => row.id !== dynamicFieldId
    );
    const fields = updatedFields.map((field) => {
      return field.name === dynamicTemplateId
        ? {
            ...field,
            value: updatedRows,
          }
        : field;
    });

    const fieldData = {
      ...localFieldData,
      ...Object.fromEntries(fields.map(({ name, value }) => [name, value])),
    };
    setLocalFieldData(fieldData);

    const reportArgs = {
      id: report.id,
      reportType: report.reportType,
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

  const providerValue = {
    addDynamicRow,
    displayCell,
    displayDynamicCell,
    displayReadOnlyCell,
    focusedRowIndex,
    localFieldData,
    removeDynamicRow,
    setFocusedRowIndex,
    setLocalFieldData,
  };

  return (
    <DynamicTableContext.Provider value={providerValue}>
      {children}
    </DynamicTableContext.Provider>
  );
};

interface DynamicTableMethods {
  addDynamicRow: Function;
  displayCell: Function;
  displayDynamicCell: Function;
  displayReadOnlyCell: Function;
  focusedRowIndex: number | null;
  localFieldData: AnyObject;
  removeDynamicRow: Function;
  setFocusedRowIndex: Function;
  setLocalFieldData: Function;
}

interface DisplayCellOptions {
  ariaLabelledby?: string;
  cell: string | FormField;
  columnId: string;
  disabled: boolean;
  formData: AnyObject;
  id: string;
  percentage: number;
  rowId: string;
  rowIndex: number;
  tableId: string;
}

interface DisplayDynamicCellOptions extends DisplayCellOptions {
  dynamicId: string;
  onBlurHandler: FocusEventHandler<HTMLInputElement>;
  onChangeHandler: ChangeEventHandler<HTMLInputElement>;
}

interface DisplayReadOnlyCellOptions {
  id: string;
  hydrate?: string;
  initialValue: string;
  mask: string;
  rowIndex: number;
}

interface UpdatedFieldsForDisplay {
  fieldData: AnyObject;
  id: string;
  name: string;
  value: string;
  percentage: number;
  tableId: string;
}

const sx = {
  calculated: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
  label: {
    marginRight: "spacer1",
    marginTop: "spacer2",
  },
};
