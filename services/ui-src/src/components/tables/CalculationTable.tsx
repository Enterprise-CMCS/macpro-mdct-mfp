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
import {
  AnyObject,
  FormTable,
  FormTableCell,
  FormTableRow,
  ReportShape,
} from "types";
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

  const generateRows = (
    section: string,
    row: FormTableRow,
    rowIndex: number
  ) => {
    const Cell = section === "thead" ? Th : Td;
    const rowId = section === "tbody" ? "thead" : section;

    return (
      <Tr key={`${section}-row-${rowIndex}`}>
        {row.map((cell, cellIndex: number) => (
          <Cell
            id={`${section}-row-${rowIndex}-cell-${cellIndex}`}
            key={`${section}-row-${rowIndex}-cell-${cellIndex}`}
            sx={{ width: thWidth }}
          >
            {displayCell({
              cell,
              columnId: `${section}-row-${rowIndex}-cell-0`,
              index: rowIndex,
              rowId: `${rowId}-row-0-cell-${cellIndex}`,
              ...cellProps(cell),
            })}
          </Cell>
        ))}
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
      {verbiage?.dynamicRows?.hint && (
        <Text sx={sx.dynamicRowsHint}>{verbiage.dynamicRows.hint}</Text>
      )}

      {dynamicRows.map((dynamicRow, index) => (
        <Button
          key={`dynamic-button-${index}`}
          leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="" />}
          onClick={() => addDynamicRow(dynamicRow)}
          sx={sx.dynamicRowsButton}
          variant="outline"
        >
          {verbiage?.dynamicRows?.buttonText}
        </Button>
      ))}

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
          <DynamicTableRows
            label={verbiage?.dynamicRows?.label}
            dynamicRows={dynamicRows}
          />
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
