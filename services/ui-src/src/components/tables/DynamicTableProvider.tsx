import { createContext, useCallback, useMemo, useState } from "react";
import uuid from "react-uuid";
// components
import { Text } from "@chakra-ui/react";
// types
import {
  AnyObject,
  FormField,
  FormTableRow,
  FormTableRows,
  InputChangeEvent,
  ReportShape,
} from "types";
// utils
import {
  debounce,
  formFieldFactory,
  hydrateFormFields,
  maskResponseData,
  updateRenderFields,
  updatedReportOnFieldChange,
} from "utils";

export const DynamicTableContext = createContext<DynamicTableMethods>({
  addDynamicRow: Function,
  displayCell: Function,
  focusedRowIndex: null,
  localDynamicRows: [],
  localReport: {} as ReportShape,
  removeDynamicRow: Function,
  setFocusedRowIndex: Function,
  setLocalDynamicRows: Function,
  setLocalReport: Function,
});

export const DynamicTableProvider = ({ children }: any) => {
  const [localReport, setLocalReport] = useState({} as ReportShape);
  const [localDynamicRows, setLocalDynamicRows] = useState([] as FormTableRows);
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);

  const updatedFieldsForDisplay = useCallback(
    (
      id: string,
      name: string,
      value: string,
      percentage: number,
      tableId: string
    ) => {
      setLocalReport((prev) =>
        updatedReportOnFieldChange({
          id,
          name,
          percentage,
          report: prev,
          tableId,
          value,
        })
      );
    },
    []
  );

  const debouncedUpdateReport = useMemo(
    () => debounce(updatedFieldsForDisplay, 1),
    [updatedFieldsForDisplay]
  );

  const displayCell = ({
    cell,
    columnId,
    disabled,
    formData,
    percentage,
    rowId,
    tableId,
  }: DisplayCellOptions) => {
    if (typeof cell === "string") return cell;

    const props = cell.props || {};
    const { initialValue, mask, readOnly } = props;

    // If input is readonly, display text instead of input
    if (readOnly) {
      const readOnlyValue = localReport.fieldData?.[cell.id] || initialValue;

      return (
        <Text as="span" sx={sx.calculated}>
          {maskResponseData(readOnlyValue, mask)}
        </Text>
      );
    }

    const field = {
      ...cell,
      props: {
        ...props,
        ariaLabelledby: `${rowId} ${columnId}`,
        // Use ariaLabelledby in lieu of label
        label: undefined,
        handleOnChange: (e: InputChangeEvent) =>
          debouncedUpdateReport(
            e.target.id,
            e.target.name,
            e.target.value,
            percentage,
            tableId
          ),
      },
    };

    const fieldsToRender = hydrateFormFields(
      updateRenderFields(localReport, [field], formData),
      formData
    );

    return formFieldFactory(fieldsToRender, {
      autosave: true,
      disabled,
      validateOnRender: false,
    });
  };

  const addDynamicRow = (dynamicRowTemplate: FormTableRow) => {
    const newId = uuid();
    const newRow = dynamicRowTemplate.map((templateRow: string | FormField) => {
      if (typeof templateRow === "string") return templateRow;

      const { id } = templateRow;
      const base = id.replace(/\[\d+\]$/, "");
      const fieldType = base.substring(base.lastIndexOf("-") + 1);

      return {
        ...templateRow,
        props: {
          ...templateRow.props,
          dynamicId: `${newId}-${fieldType}`,
        },
      };
    });
    const updatedRows = [...localDynamicRows, newRow];
    setLocalDynamicRows(updatedRows);
    setFocusedRowIndex(updatedRows.length - 1);
  };

  // TODO: Remove with confirmation
  const removeDynamicRow = () => {};

  const providerValue = {
    addDynamicRow,
    displayCell,
    focusedRowIndex,
    localDynamicRows,
    localReport,
    removeDynamicRow,
    setFocusedRowIndex,
    setLocalDynamicRows,
    setLocalReport,
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
  focusedRowIndex: number | null;
  localDynamicRows: FormTableRows;
  localReport: ReportShape;
  removeDynamicRow: Function;
  setFocusedRowIndex: Function;
  setLocalDynamicRows: Function;
  setLocalReport: Function;
}

interface DisplayCellOptions {
  cell: string | FormField;
  columnId: string;
  disabled: boolean;
  formData: AnyObject;
  index: number;
  percentage: number;
  rowId: string;
  tableId: string;
}

const sx = {
  calculated: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
};
