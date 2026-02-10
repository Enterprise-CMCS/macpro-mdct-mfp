import { createContext, useState } from "react";
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

    // If input is readonly, display text instead of input
    if (cell.props?.readOnly) {
      const readOnlyValue =
        localReport.fieldData?.[cell.id] || cell.props?.initialValue;
      const mask = cell.props?.mask;

      return (
        <Text as="span" sx={sx.calculated}>
          {maskResponseData(readOnlyValue, mask)}
        </Text>
      );
    }

    const updatedFieldsForDisplay = (
      id: string,
      name: string,
      value: string
    ) => {
      const updatedReport = updatedReportOnFieldChange({
        id,
        name,
        percentage,
        report: localReport,
        tableId,
        value,
      });
      setLocalReport(updatedReport);
    };

    const field = {
      ...cell,
      props: {
        ...cell.props,
        ariaLabelledby: `${rowId} ${columnId}`,
        // Use ariaLabelledby in lieu of label
        label: undefined,
        handleOnChange: (e: InputChangeEvent) =>
          updatedFieldsForDisplay(e.target.id, e.target.name, e.target.value),
      },
    };

    const fieldsToRender = hydrateFormFields(
      updateRenderFields(localReport, [field], formData),
      formData
    );

    return formFieldFactory(fieldsToRender, {
      disabled,
      autosave: true,
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
          idOverride: `${newId}-${fieldType}`,
        },
      };
    });
    const updatedRows = [...localDynamicRows, newRow];
    setLocalDynamicRows(updatedRows);
    setFocusedRowIndex(updatedRows.length - 1);
  };

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
