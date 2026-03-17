import { useCallback, useContext } from "react";
// components
import {
  Box,
  Button,
  Heading,
  Image,
  Table,
  TableCaption,
  Tbody,
  Text,
  Tfoot,
  Thead,
  VisuallyHidden,
} from "@chakra-ui/react";
import { DynamicTableContext, DynamicTableRows } from "components";
// assets
import addIcon from "assets/icons/icon_add.png";
// types
import { AnyObject, FormTable, FormTableCell, ReportShape } from "types";
// utils
import {
  calculationTableDynamicTotalsOnSave,
  getFieldParts,
  parseCustomHtml,
  translate,
} from "utils";

export const CalculationTable = ({
  bodyRows,
  disabled,
  dynamicRowsTemplate,
  footRows,
  formData,
  headRows,
  id: tableId,
  options,
  order = 0,
  report,
  verbiage,
}: Props) => {
  // Dynamic rows
  const { addDynamicRow, generateRows } = useContext(DynamicTableContext);

  // Percentage field
  const percentageField = options?.percentageField;
  const formPercentage = percentageField
    ? report?.fieldData?.[percentageField]
    : 100;
  const missingPercentage = Boolean(!formPercentage);
  const percentageDisplay = missingPercentage
    ? "[auto-populated]%"
    : `${formPercentage}%`;

  // Show error once if in a loop
  const showError = missingPercentage && order === 0;

  // Disable fields if no percentage is set or report is submitted
  const isDisabled = disabled || missingPercentage;

  // Use field-level percentage or formPercentage
  const getPercentage = useCallback(
    (cell: FormTableCell) => {
      if (typeof cell === "string") return formPercentage;
      const { fieldId } = getFieldParts(cell.id);
      const fieldPercentage =
        report?.fieldData?.[`${fieldId}-percentageOverride`];
      return fieldPercentage || formPercentage;
    },
    [formPercentage, report?.fieldData]
  );

  // Check if a row contains non-footer totals field
  const isTotalsRow = useCallback((row: FormTableCell[]) => {
    return row.some((cell) => {
      if (typeof cell === "string") return false;
      return cell.id?.includes("totalsSummary_serviceTotals");
    });
  }, []);

  // Use useCallback to reduce lookups
  const cellPropsCallback = useCallback(
    (cell: FormTableCell) => ({
      percentage: getPercentage(cell),
    }),
    [formData, getPercentage]
  );

  const sharedCellProps = {
    columnCount: headRows?.[0].length || 0,
    disabled: isDisabled,
    dynamicRowsTemplate,
    formData,
    tableId,
  };

  const updatedFieldsCallback = (
    dynamicId: string,
    localFieldData: AnyObject
  ) => {
    return calculationTableDynamicTotalsOnSave({
      dynamicFieldId: dynamicId,
      dynamicTemplateId: dynamicRowsTemplate?.id || "",
      fieldData: localFieldData,
      fieldValue: 0,
      formId: "",
      tableId,
    });
  };

  return (
    <Box sx={sx.box}>
      {verbiage?.errorMessage && showError && (
        <Text sx={sx.error}>{parseCustomHtml(verbiage.errorMessage)}</Text>
      )}

      <Heading as="h2">{verbiage?.title}</Heading>
      {verbiage?.percentage && (
        <Text sx={sx.percentageText}>
          {translate(verbiage.percentage, { percentage: percentageDisplay })}
        </Text>
      )}
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

      <Table id={tableId} sx={sx.table}>
        <TableCaption placement="top" sx={sx.captionBox}>
          <VisuallyHidden>{verbiage?.title}</VisuallyHidden>
        </TableCaption>
        <Thead>
          {headRows.map((row, rowIndex: number) =>
            generateRows({
              cellPropsCallback,
              row,
              rowIndex,
              section: "thead",
              ...sharedCellProps,
            })
          )}
        </Thead>
        <Tbody>
          {bodyRows.map((row, rowIndex: number) =>
            generateRows({
              cellPropsCallback,
              isTotalsRow: isTotalsRow(row),
              row,
              rowIndex,
              section: "tbody",
              ...sharedCellProps,
            })
          )}
          {dynamicRowsTemplate && (
            <DynamicTableRows
              disabled={isDisabled}
              dynamicRowsTemplate={dynamicRowsTemplate}
              formData={formData}
              formPercentage={formPercentage}
              tableId={tableId}
              updatedFieldsCallback={updatedFieldsCallback}
            />
          )}
        </Tbody>
        <Tfoot>
          {footRows.map((row, rowIndex: number) =>
            generateRows({
              cellPropsCallback,
              row,
              rowIndex,
              section: "tfoot",
              ...sharedCellProps,
            })
          )}
        </Tfoot>
      </Table>
    </Box>
  );
};

interface Props extends Omit<FormTable, "tableType"> {
  disabled: boolean;
  formData?: AnyObject;
  order?: number;
  report?: ReportShape;
}

export const sx = {
  error: {
    fontWeight: "bold",
    marginBottom: "spacer4",
    a: {
      color: "primary",
    },
  },
  box: {
    h2: {
      fontSize: "2xl",
      marginBottom: "spacer2",
      marginTop: "spacer4",
      paddingBottom: 0,
    },
  },
  percentageText: {
    color: "gray_dark",
    fontWeight: "bold",
    paddingBottom: "spacer2",
  },
  subtitle: {
    color: "gray_dark",
    p: {
      marginBottom: "spacer2",
    },
  },
  dynamicRowsHint: {
    color: "gray_dark",
    marginBottom: "spacer2",
  },
  dynamicRowsButton: {
    marginBottom: "spacer2",
  },
  buttonIcons: {
    height: "1rem",
  },
  captionBox: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  table: {
    marginBottom: "spacer5",
    marginTop: "spacer1",
    width: "58rem",
    tbody: {
      "tr:nth-of-type(even)": {
        td: {
          backgroundColor: "gray_lightest_highlight",
        },
      },
      "tr.totals-row": {
        td: {
          backgroundColor: "gray_lighter",
          border: "none",
          fontWeight: "bold",
          paddingInlineEnd: "spacer2",
          paddingInlineStart: "spacer2",
        },
      },
      td: {
        border: "none",
        paddingBottom: "spacer1",
        paddingInlineEnd: "spacer2",
        paddingInlineStart: "spacer2",
        paddingTop: "spacer1",
      },
      label: {
        margin: 0,
      },
    },
    tfoot: {
      td: {
        backgroundColor: "gray_lighter",
        border: "none",
        fontWeight: "bold",
        paddingInlineEnd: "spacer2",
        paddingInlineStart: "spacer2",
      },
    },
    thead: {
      th: {
        backgroundColor: "primary_darkest",
        color: "white",
        fontSize: "lg",
        letterSpacing: "normal",
        lineHeight: "normal",
        paddingBottom: "spacer1",
        paddingInlineEnd: "spacer2",
        paddingInlineStart: "spacer2",
        paddingTop: "spacer1",
        textTransform: "none",
      },
    },
  },
};
