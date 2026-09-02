import { useContext, useEffect } from "react";
// components
import {
  Box,
  Button,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { DynamicTableContext, DynamicTableRows } from "components";
// assets
import addIcon from "assets/icons/icon_add.png";
import { sx } from "./CalculationTable";
// types
import { AnyObject, FormField, FormTable, ReportShape } from "types";
// utils
import {
  getFieldParts,
  parseCustomHtml,
  summationTableDynamicTotalsOnSave,
} from "utils";
import { ResponsiveTable } from "./ResponsiveTable";

export const SummationTable = ({
  bodyRows,
  disabled,
  dynamicRowsTemplate,
  footRows,
  formData,
  headRows,
  id: tableId,
  verbiage,
}: Props) => {
  // Dynamic rows
  const { addDynamicRow, generateRows } = useContext(DynamicTableContext);

  // Add initial row if one doesn't exist
  useEffect(() => {
    if (!dynamicRowsTemplate) return;

    const rows = formData?.[dynamicRowsTemplate.id];
    if (!rows) {
      const dynamicKeys = dynamicRowsTemplate.props?.dynamicFields.map(
        (field: FormField) => {
          const { fieldType } = getFieldParts(field.id);
          const initialValue = field.props?.initialValue || "";
          return [fieldType, initialValue];
        },
      );
      const initialData = Object.fromEntries(dynamicKeys);
      addDynamicRow(dynamicRowsTemplate, initialData, false);
    }
  }, [dynamicRowsTemplate, formData]);

  const sharedCellProps = {
    columnCount: headRows?.[0].length || 0,
    disabled,
    dynamicRowsTemplate,
    formData,
    tableId,
  };

  const updatedFieldsCallback = (
    dynamicId: string,
    localFieldData: AnyObject,
  ) => {
    return summationTableDynamicTotalsOnSave({
      dynamicFieldId: dynamicId,
      dynamicTemplateId: dynamicRowsTemplate?.id || "",
      fieldData: localFieldData,
      fieldValue: 0,
      formId: "",
      tableId,
    });
  };

  const tableData = {
    id: tableId,
    title: verbiage?.title,
    headers: headRows.map((row, rowIndex: number) =>
      generateRows({
        row,
        rowIndex,
        section: "thead",
        ...sharedCellProps,
      }),
    ),
    rows: bodyRows.map((row, rowIndex: number) =>
      generateRows({
        row,
        rowIndex,
        section: "tbody",
        ...sharedCellProps,
      }),
    ),
    dynamicRows: dynamicRowsTemplate && (
      <DynamicTableRows
        disabled={disabled}
        dynamicRowsTemplate={dynamicRowsTemplate}
        emptyTableMessage={verbiage?.emptyTableMessage}
        formData={formData}
        formPercentage={0}
        hasDynamicModalForm={false}
        hasStaticRows={bodyRows.length > 0}
        tableId={tableId}
        updatedFieldsCallback={updatedFieldsCallback}
      />
    ),
    foot: footRows.map((row, rowIndex: number) =>
      generateRows({
        row,
        rowIndex,
        section: "tfoot",
        ...sharedCellProps,
      }),
    ),
  };

  return (
    <Box sx={sx.box}>
      {verbiage?.title && <Heading as="h2">{verbiage.title}</Heading>}
      {verbiage?.subtitle && (
        <Box sx={sx.subtitle}>{parseCustomHtml(verbiage.subtitle)}</Box>
      )}

      {dynamicRowsTemplate && (
        <>
          <Text sx={sx.dynamicRowsHint}>
            {dynamicRowsTemplate.verbiage.hint}
          </Text>
          <Button
            leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="" />}
            onClick={() => addDynamicRow(dynamicRowsTemplate)}
            sx={sx.dynamicRowsButton}
            variant="outline"
          >
            {dynamicRowsTemplate.verbiage.buttonText}
          </Button>
        </>
      )}
      {ResponsiveTable(tableData)}
    </Box>
  );
};

interface Props extends Omit<FormTable, "tableType"> {
  disabled: boolean;
  formData?: AnyObject;
  order?: number;
  report?: ReportShape;
}
