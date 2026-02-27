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
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
import { DynamicTableContext, DynamicTableRows } from "components";
// assets
import addIcon from "assets/icons/icon_add.png";
// types
import {
  AnyObject,
  FormTable,
  FormTableCell,
  FormTableRow,
  ReportShape,
} from "types";
// utils
import { getFieldParts, parseCustomHtml, translate } from "utils";

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
  const { addDynamicRow, displayCell } = useContext(DynamicTableContext);

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

  // Set cell width based on number of columns
  const firstRow = headRows[0];
  const firstColumnWidth = dynamicRowsTemplate ? 30 : 36;
  const optionsWidth = 7;
  const otherColumnsWidth = 100 - firstColumnWidth;
  const columnCount = firstRow.length - 1;
  const remainingWidth = dynamicRowsTemplate
    ? otherColumnsWidth - optionsWidth
    : otherColumnsWidth;
  const thWidth = (index: number) =>
    index === 0 ? `${firstColumnWidth}%` : `${remainingWidth / columnCount}%`;
  const thAlign = (index: number) => (index > 1 ? "right" : "left");

  // Disable fields if no percentage is set or report is submitted
  const isDisabled = disabled || missingPercentage;

  // Use field-level percentage or formPercentage
  const getPercentage = useCallback(
    (cell: FormTableCell) => {
      if (typeof cell === "string") return formPercentage;
      const { fieldId } = getFieldParts(cell.id);
      const fieldPercentageField = `${fieldId}-percentageOverride`;
      return report?.fieldData?.[fieldPercentageField] ?? formPercentage;
    },
    [formPercentage, report?.fieldData]
  );

  const cellProps = useCallback(
    (cell: FormTableCell) => ({
      disabled: isDisabled,
      formData,
      percentage: getPercentage(cell),
      tableId,
    }),
    [isDisabled, formData, tableId, getPercentage]
  );

  const generateRows = (
    section: string,
    row: FormTableRow,
    rowIndex: number
  ) => {
    const Cell = section === "thead" ? Th : Td;
    const content =
      section === "thead" ? <VisuallyHidden>Options</VisuallyHidden> : null;
    const rowId = section === "tbody" ? "thead" : section;

    return (
      <Tr key={`${section}-row-${rowIndex}`}>
        {row.map((cell, cellIndex: number) => (
          <Cell
            id={`${section}-row-${rowIndex}-cell-${cellIndex}`}
            key={`${section}-row-${rowIndex}-cell-${cellIndex}`}
            sx={{ textAlign: thAlign(cellIndex), width: thWidth(cellIndex) }}
          >
            {displayCell({
              cell,
              columnId: `${section}-row-${rowIndex}-cell-0`,
              rowId: `${rowId}-row-0-cell-${cellIndex}`,
              rowIndex,
              ...cellProps(cell),
            })}
          </Cell>
        ))}
        {dynamicRowsTemplate && (
          <Cell sx={{ width: `${optionsWidth}%` }}>{content}</Cell>
        )}
      </Tr>
    );
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
            generateRows("thead", row, rowIndex)
          )}
        </Thead>
        <Tbody>
          {bodyRows.map((row, rowIndex: number) =>
            generateRows("tbody", row, rowIndex)
          )}
          {dynamicRowsTemplate && (
            <DynamicTableRows
              disabled={isDisabled}
              dynamicRowsTemplate={dynamicRowsTemplate}
              formData={formData}
              formPercentage={formPercentage}
              tableId={tableId}
            />
          )}
        </Tbody>
        <Tfoot>
          {footRows.map((row, rowIndex: number) =>
            generateRows("tfoot", row, rowIndex)
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

const sx = {
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
  dynamicRowsHint: {
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
