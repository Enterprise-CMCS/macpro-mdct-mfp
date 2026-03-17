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
import { Flex, Td, Text, Th, Tr, VisuallyHidden } from "@chakra-ui/react";
import { EntityContext, ReportContext } from "components";
// types
import {
  AnyObject,
  DynamicFieldShape,
  DynamicRowsTemplate,
  FormField,
  FormTableCell,
  FormTableRow,
  InputChangeEvent,
  ReportFormFieldType,
  ReportShape,
} from "types";
// utils
import uuid from "react-uuid";
import {
  autosaveFieldData,
  createTempDynamicId,
  debounce,
  FieldInfo,
  formFieldFactory,
  getAutosaveFields,
  getFieldParts,
  hydrateFormFields,
  isTempDynamicField,
  maskResponseData,
  setPercentageAndValue,
  updateRenderFields,
  UpdatedFieldDataOnChange,
  updatedFieldDataOnFieldChange,
  useStore,
} from "utils";

export const DynamicTableContext = createContext<DynamicTableMethods>({
  addDynamicRow: Function,
  displayCell: Function,
  displayDynamicCell: Function,
  displayReadOnlyCell: Function,
  focusedRowIndex: null,
  generateRows: Function,
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
      name,
      value,
      percentage = 0,
      percentageOverride,
    }: UpdatedFieldDataOnChange) => {
      const updatedFieldData = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage,
        percentageOverride,
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
    type,
  }: DisplayReadOnlyCellOptions) => {
    const cellValue = localFieldData?.[id] || hydrate || initialValue;
    const readOnlyValue = Array.isArray(cellValue)
      ? cellValue?.[rowIndex]?.name || initialValue
      : cellValue;

    if (type === ReportFormFieldType.NUMBER) {
      return (
        <Text as="span" sx={sx.calculated}>
          {maskResponseData(readOnlyValue, mask)}
        </Text>
      );
    }

    return (
      <Text as="span" sx={sx.readonly}>
        {readOnlyValue}
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
    percentage: formPercentage,
    rowId,
    rowIndex,
  }: DisplayCellOptions) => {
    if (typeof cell === "string") return cell;

    const props = cell.props || {};
    const { initialValue, mask, readOnly } = props;
    const cellId = id || cell.id;

    const renderReadOnly = (hydrate?: string) =>
      displayReadOnlyCell({
        id: cellId,
        hydrate,
        initialValue,
        mask,
        rowIndex,
        type: cell.type,
      });

    const field = {
      ...cell,
      id: cellId,
      props: {
        ...props,
        ariaLabelledby: ariaLabelledby || `${rowId} ${columnId}`,
        label: undefined,
        handleOnChange: (event: InputChangeEvent) => {
          const { name, percentage, percentageOverride, value } =
            setPercentageAndValue(event, localFieldData, formPercentage);

          return debouncedUpdateReport({
            fieldData: localFieldData,
            name,
            percentage,
            percentageOverride,
            value,
          });
        },
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
      const templateFieldData = localFieldData?.[dynamicTemplateId] || [];
      const currentField = templateFieldData.find(
        (field: DynamicFieldShape) => field.id === dynamicFieldId
      );

      hydrateValue = currentField?.[fieldType];
      hydratedProps = {
        ...hydratedField.props,
        hydrate: hydrateValue,
      };
    }

    if (readOnly) return renderReadOnly(hydrateValue);

    const fieldsToRender = [
      {
        ...hydratedField,
        props: {
          ...hydratedField.props,
          ...hydratedProps,
        },
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
          <Flex sx={sx.label}>
            <label htmlFor={tempDynamicId} id={dynamicLabelId}>
              {cell.props?.dynamicLabel}
            </label>
          </Flex>
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

  const generateRows = ({
    cellPropsCallback = () => {},
    columnCount,
    disabled,
    dynamicRowsTemplate,
    formData,
    isTotalsRow = false,
    row,
    rowIndex,
    section,
    tableId,
  }: GenerateRows) => {
    let firstColumnWidth = dynamicRowsTemplate ? 30 : 36;

    if (columnCount === 3) {
      firstColumnWidth = 50;
    }

    if (columnCount > 5) {
      firstColumnWidth = 100 / columnCount;
    }

    const optionsWidth = 7;
    const otherColumnsWidth = 100 - firstColumnWidth;
    const otherColumnsCount = columnCount - 1;
    const remainingWidth = dynamicRowsTemplate
      ? otherColumnsWidth - optionsWidth
      : otherColumnsWidth;

    const thWidth = (index: number) =>
      index === 0
        ? `${firstColumnWidth}%`
        : `${remainingWidth / otherColumnsCount}%`;

    const thAlign = (cell: FormTableCell) => {
      const rightAlignedCells: FormTableCell[] = [
        "Total State / Territory Share",
        "Total Federal Share",
      ];

      if (typeof cell === "string" && rightAlignedCells.includes(cell)) {
        return "right";
      }

      return "left";
    };

    const Cell = section === "thead" ? Th : Td;
    const content =
      section === "thead" ? <VisuallyHidden>Options</VisuallyHidden> : null;
    const rowId = section === "tbody" ? "thead" : section;

    return (
      <Tr
        key={`${section}-row-${rowIndex}`}
        className={isTotalsRow ? "totals-row" : ""}
      >
        {row.map((cell, cellIndex: number) => (
          <Cell
            id={`${section}-row-${rowIndex}-cell-${cellIndex}`}
            key={`${section}-row-${rowIndex}-cell-${cellIndex}`}
            sx={{ textAlign: thAlign(cell), width: thWidth(cellIndex) }}
          >
            {displayCell({
              cell,
              columnId: `${section}-row-${rowIndex}-cell-0`,
              disabled,
              formData,
              rowId: `${rowId}-row-0-cell-${cellIndex}`,
              rowIndex,
              tableId,
              ...cellPropsCallback(cell),
            })}
          </Cell>
        ))}
        {dynamicRowsTemplate && (
          <Cell sx={{ width: `${optionsWidth}%` }}>{content}</Cell>
        )}
      </Tr>
    );
  };

  const addDynamicRow = async (
    dynamicRowsTemplate: DynamicRowsTemplate,
    initialData?: AnyObject,
    scroll: boolean = true
  ) => {
    const { id, type, props } = dynamicRowsTemplate;

    const dynamicKeys = props?.dynamicFields.map((field: FormField) => {
      const { fieldType } = getFieldParts(field.id);
      const initialValue = field.props?.initialValue || "";
      return [fieldType, initialValue];
    });
    const rows = localFieldData?.[dynamicRowsTemplate.id] || [];

    const newId = uuid();
    const updatedRows = [
      ...rows,
      {
        id: newId,
        name: newId,
        ...Object.fromEntries(dynamicKeys),
        ...initialData,
      },
    ];

    const newRowIndex = updatedRows.length - 1;
    if (scroll) setFocusedRowIndex(newRowIndex);

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
    dynamicFieldId: string,
    updatedFields: FieldInfo[] = []
  ) => {
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
    generateRows,
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
  generateRows: Function;
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
  type: string | ReportFormFieldType;
}

interface GenerateRows {
  cellPropsCallback?: Function;
  columnCount: number;
  disabled?: boolean;
  dynamicRowsTemplate?: DynamicRowsTemplate;
  formData?: AnyObject;
  headRows: FormTableRow[];
  isTotalsRow?: boolean;
  percentage?: number;
  row: FormTableRow;
  rowIndex: number;
  section: string;
  tableId?: string;
}

const sx = {
  readonly: {
    fontWeight: "bold",
  },
  calculated: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
  label: {
    alignItems: "center",
    marginRight: "spacer1",
  },
};
