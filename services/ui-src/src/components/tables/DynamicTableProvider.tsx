import {
  ChangeEventHandler,
  createContext,
  FocusEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import uuid from "react-uuid";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box, Flex, Text } from "@chakra-ui/react";
import { NumberFieldDisplay } from "components";
// types
import {
  AnyObject,
  FormField,
  FormTableRow,
  FormTableRows,
  InputChangeEvent,
  ReportFormFieldType,
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
  displayDynamicCell: Function,
  focusedRowIndex: null,
  localDynamicRows: [],
  localReport: {} as ReportShape,
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

  const displayReadOnlyCell = ({
    id,
    initialValue,
    mask,
    rowIndex,
  }: DisplayReadOnlyCellOptions) => {
    const cellValue = localReport.fieldData?.[id] || initialValue;
    const readOnlyValue = Array.isArray(cellValue)
      ? cellValue?.[rowIndex]?.name || initialValue
      : cellValue;

    return (
      <Text as="span" sx={sx.calculated}>
        {maskResponseData(readOnlyValue, mask)}
      </Text>
    );
  };

  const displayCell = ({
    cell,
    columnId,
    disabled,
    formData,
    percentage,
    rowId,
    rowIndex,
    tableId,
  }: DisplayCellOptions) => {
    if (typeof cell === "string") return cell;

    const props = cell.props || {};
    const { initialValue, mask, readOnly } = props;

    // If input is readonly, display text instead of input
    if (readOnly) {
      return displayReadOnlyCell({
        id: cell.id,
        initialValue,
        mask,
        rowIndex,
      });
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

  const displayDynamicCell = ({
    cell,
    columnId,
    disabled,
    label,
    onBlurHandler,
    onChangeHandler,
    rowId,
    rowIndex,
  }: DisplayDynamicCellOptions) => {
    if (typeof cell === "string") return cell;

    const props = cell.props || {};
    const { dynamicId, hydrate, initialValue, mask, readOnly, subType } = props;

    // If input is readonly, display text instead of input
    if (readOnly) {
      return displayReadOnlyCell({ id: cell.id, initialValue, mask, rowIndex });
    }

    const name = `${cell.id}[${rowIndex}]`;
    // TODO: Get error from form state
    const errorMessage = "";

    if (subType === ReportFormFieldType.NUMBER) {
      return (
        <NumberFieldDisplay
          ariaLabelledby={`${rowId} ${columnId}`}
          disabled={disabled}
          errorMessage={errorMessage}
          hint={undefined}
          id={dynamicId}
          label={undefined}
          mask={mask}
          name={name}
          nested={false}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          placeholder={undefined}
          readOnly={readOnly}
          value={hydrate}
        />
      );
    }

    const dynamicLabel = `${dynamicId}_dynamic-label`;
    const ariaProps = {
      "aria-labelledby": `${rowId} ${dynamicLabel}`,
    };

    return (
      <Flex>
        <Box sx={sx.label}>
          <label htmlFor={dynamicId} id={dynamicLabel}>
            {label}
          </label>
        </Box>
        <CmsdsTextField
          disabled={disabled}
          errorMessage={errorMessage}
          hint={undefined}
          id={dynamicId}
          label={undefined}
          name={name}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          placeholder={undefined}
          readOnly={readOnly}
          value={hydrate}
          {...ariaProps}
        />
      </Flex>
    );
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
          dynamicRowId: newId,
        },
      };
    });
    const updatedRows = [...localDynamicRows, newRow];
    setLocalDynamicRows(updatedRows);
    setFocusedRowIndex(updatedRows.length - 1);
  };

  const providerValue = {
    addDynamicRow,
    displayCell,
    displayDynamicCell,
    focusedRowIndex,
    localDynamicRows,
    localReport,
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
  displayDynamicCell: Function;
  focusedRowIndex: number | null;
  localDynamicRows: FormTableRows;
  localReport: ReportShape;
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
  rowIndex: number;
  tableId: string;
}

interface DisplayDynamicCellOptions extends DisplayCellOptions {
  label: string;
  onBlurHandler: FocusEventHandler<HTMLInputElement>;
  onChangeHandler: ChangeEventHandler<HTMLInputElement>;
}

interface DisplayReadOnlyCellOptions {
  id: string;
  initialValue: string;
  mask: string;
  rowIndex: number;
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
