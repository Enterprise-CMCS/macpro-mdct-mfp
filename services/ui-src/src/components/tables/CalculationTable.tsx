import { useEffect, useState } from "react";
// components
import {
  Box,
  Heading,
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
// types
import { AnyObject, FormField, FormTable, ReportShape } from "types";
// utils
import {
  formFieldFactory,
  hydrateFormFields,
  maskResponseData,
  parseCustomHtml,
  translate,
  updateRenderFields,
  updatedReportOnFieldChange,
} from "utils";

export const CalculationTable = ({
  bodyRows = [],
  disabled,
  footRows,
  formData,
  headRows,
  id: tableId,
  options,
  order = 0,
  report = {} as ReportShape,
  verbiage,
}: Props) => {
  const [localReport, setLocalReport] = useState({} as ReportShape);

  const percentageField = options?.percentageField;
  const percentage = percentageField
    ? localReport.fieldData?.[percentageField]
    : 100;

  // Fields are disabled if no percentage is set
  const missingPercentage = Boolean(!percentage);
  const percentageDisplay = missingPercentage
    ? "[auto-populated]%"
    : `${percentage}%`;

  // Show error once if in a loop
  const showError = missingPercentage && order === 0;

  // Set cell width based on number of columns
  const firstRow = headRows[0];
  const thWidth = `${100 / firstRow.length}%`;

  // Disable fields if no percentage is set or report is submitted
  const isDisabled = disabled || missingPercentage;

  const displayCell = ({ cell, columnId, rowId }: DisplayCellOptions) => {
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

    const field = {
      ...cell,
      props: {
        ...cell.props,
        ariaLabelledby: `${rowId} ${columnId}`,
        // Use ariaLabelledby in lieu of label
        label: undefined,
        handleOnChange: (e: { target: { id: string; value: string } }) =>
          updatedFieldsForDisplay(e.target.id, e.target.value),
      },
    };

    const fieldsToRender = hydrateFormFields(
      updateRenderFields(localReport, [field], formData),
      formData
    );

    return formFieldFactory(fieldsToRender, {
      disabled: isDisabled,
      autosave: true,
      validateOnRender: false,
    });
  };

  const updatedFieldsForDisplay = (name: string, value: string) => {
    const updatedReport = updatedReportOnFieldChange({
      id: name,
      name,
      percentage,
      report: localReport,
      tableId,
      value,
    });
    setLocalReport(updatedReport);
  };

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
      <>
        {verbiage?.percentage && (
          <Text sx={sx.text}>
            {translate(verbiage.percentage, { percentage: percentageDisplay })}
          </Text>
        )}
        {verbiage?.hint && (
          <Text sx={sx.hintText}>{parseCustomHtml(verbiage.hint)}</Text>
        )}
      </>
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
                  {displayCell({ cell })}
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
                    rowId: `thead-row-0-cell-${cellIndex}`,
                  })}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          {footRows.map((row, rowIndex: number) => (
            <Tr key={`tfoot-row-${rowIndex}`}>
              {row.map((cell, cellIndex: number) => (
                <Td
                  id={`tfoot-row-${rowIndex}-cell-${cellIndex}`}
                  key={`tfoot-row-${rowIndex}-cell-${cellIndex}`}
                >
                  {displayCell({ cell })}
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

interface DisplayCellOptions {
  cell: string | FormField;
  columnId?: string;
  rowId?: string;
}

const sx = {
  box: {
    h2: {
      fontSize: "2xl",
      marginBottom: "spacer1",
      marginTop: "spacer4",
      paddingBottom: 0,
    },
  },
  calculated: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
  error: {
    fontWeight: "bold",
    marginBottom: "spacer4",
    a: {
      color: "primary",
    },
  },
  text: {
    color: "gray_dark",
    fontWeight: "bold",
    marginBottom: "spacer3",
  },
  hintText: {
    color: "gray_dark",
    marginTop: "spacer2",
    h3: {
      marginBottom: "-0.75rem",
    },
    a: {
      color: "primary",
      "&:hover": {
        color: "primary_darker",
      },
    },
    p: {
      marginBottom: "spacer2",
    },
  },
  captionBox: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  table: {
    marginBottom: "spacer5",
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
