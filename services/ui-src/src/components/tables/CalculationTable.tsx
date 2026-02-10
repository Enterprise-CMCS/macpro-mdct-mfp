import { useContext, useEffect } from "react";
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
import { AnyObject, FormTable, FormTableCell, ReportShape } from "types";
// utils
import { parseCustomHtml, translate } from "utils";

export const CalculationTable = ({
  bodyRows,
  disabled,
  dynamicRows = [],
  footRows,
  formData,
  headRows,
  id: tableId,
  options,
  order = 0,
  report = {} as ReportShape,
  verbiage,
}: Props) => {
  // Dynamic rows
  const { addDynamicRow, displayCell, localReport, setLocalReport } =
    useContext(DynamicTableContext);
  const hasDynamicRows = dynamicRows.length > 0;

  // Percentage field
  const percentageField = options?.percentageField;
  const formPercentage = percentageField
    ? localReport.fieldData?.[percentageField]
    : 100;

  const missingPercentage = Boolean(!formPercentage);
  const percentageDisplay = missingPercentage
    ? "[auto-populated]%"
    : `${formPercentage}%`;

  // Show error once if in a loop
  const showError = missingPercentage && order === 0;

  // Set cell width based on number of columns
  const firstRow = headRows[0];
  const thWidth = `${100 / firstRow.length}%`;

  // Disable fields if no percentage is set or report is submitted
  const isDisabled = missingPercentage || disabled;

  // Use field-level percentage or formPercentage
  const getPercentage = (cell: FormTableCell) => {
    if (typeof cell == "string") return formPercentage;

    const [keyFieldId] = cell.id.split("-");
    const fieldPercentageField = `${keyFieldId}-percentage`;
    return localReport.fieldData?.[fieldPercentageField] || formPercentage;
  };

  const cellProps = (cell: FormTableCell) => ({
    disabled: isDisabled,
    formData,
    percentage: getPercentage(cell),
    tableId,
  });

  useEffect(() => {
    // Use local state to speed up UI
    setLocalReport(report);
  }, []);

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
      {verbiage?.dynamicRows?.hint && (
        <Text sx={sx.dynamicRowsHint}>{verbiage?.dynamicRows?.hint}</Text>
      )}

      {hasDynamicRows && (
        <Button
          leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="" />}
          onClick={() => addDynamicRow(dynamicRows[0])}
          sx={sx.dynamicRowsButton}
          variant="outline"
        >
          {verbiage?.dynamicRows?.buttonText}
        </Button>
      )}

      <Table id={tableId} sx={sx.table}>
        <TableCaption placement="top" sx={sx.captionBox}>
          <VisuallyHidden>{verbiage?.title}</VisuallyHidden>
        </TableCaption>
        <Thead>
          {headRows.map((row, rowIndex: number) => (
            <Tr key={`thead-row-${rowIndex}`}>
              {row.map((cell, cellIndex: number) => (
                <Th
                  id={`thead-row-${rowIndex}-cell-${cellIndex}`}
                  key={`thead-row-${rowIndex}-cell-${cellIndex}`}
                  sx={{ width: thWidth }}
                >
                  {displayCell({
                    cell,
                    columnId: `thead-row-${rowIndex}-cell-0`,
                    index: rowIndex,
                    rowId: `thead-row-0-cell-${cellIndex}`,
                    ...cellProps(cell),
                  })}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {bodyRows.map((row, rowIndex: number) => (
            <Tr key={`tbody-row-${rowIndex}`}>
              {row.map((cell, cellIndex: number) => (
                <Td
                  id={`tbody-row-${rowIndex}-cell-${cellIndex}`}
                  key={`tbody-row-${rowIndex}-cell-${cellIndex}`}
                >
                  {displayCell({
                    cell,
                    columnId: `tbody-row-${rowIndex}-cell-0`,
                    index: rowIndex,
                    rowId: `thead-row-0-cell-${cellIndex}`,
                    ...cellProps(cell),
                  })}
                </Td>
              ))}
            </Tr>
          ))}
          <DynamicTableRows
            label={verbiage?.dynamicRows?.label}
            tableId={tableId}
          />
        </Tbody>
        <Tfoot>
          {footRows.map((row, rowIndex: number) => (
            <Tr key={`tfoot-row-${rowIndex}`}>
              {row.map((cell, cellIndex: number) => (
                <Td
                  id={`tfoot-row-${rowIndex}-cell-${cellIndex}`}
                  key={`tfoot-row-${rowIndex}-cell-${cellIndex}`}
                >
                  {displayCell({
                    cell,
                    columnId: `tfoot-row-${rowIndex}-cell-0`,
                    index: rowIndex,
                    rowId: `tfoot-row-0-cell-${cellIndex}`,
                    ...cellProps(cell),
                  })}
                </Td>
              ))}
            </Tr>
          ))}
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
