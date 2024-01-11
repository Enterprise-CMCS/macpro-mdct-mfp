import { AnyObject, FormJson, ReportPageShapeBase } from "types";
import { useEffect, useState } from "react";

// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { Table } from "components";

// utils
import { convertToThousandsSeparatedString, useStore } from "utils";
import { notAnsweredText } from "../../constants";

export const generateMainTable = (rows: AnyObject, fieldData?: AnyObject) => {
  const table = {
    caption: "Transition Benchmark Totals Table",
    headRow: generateTableHeader(rows),
    bodyRows: generateTableBody(rows, fieldData),
    footRow: [],
  };

  return table;
};

export const generateTableBody = (rows: AnyObject, fieldData?: AnyObject) => {
  const firstRows = Object.keys(rows).map((key) => {
    return [key];
  });
  let bodyRow: string[][] = firstRows;

  bodyRow.forEach((row: string[]) => {
    const matchRow: [] = rows[row[0]];
    const rowIds = matchRow.map((info: AnyObject) => info.id).flat();
    rowIds.forEach((id) => {
      if (fieldData?.[id]) row.push(fieldData?.[id]);
    });
  });

  bodyRow.forEach((row) => {
    const total = row.reduce((accumulator, currentValue, index) => {
      return index > 1
        ? (Number(accumulator) + Number(currentValue)).toString()
        : currentValue;
    });
    row.push(total);
  });

  return bodyRow;
};

export const generateTableHeader = (rows: AnyObject) => {
  const row: AnyObject[] = Object.values(rows)[0];

  const columnHeaders = row
    .map((keys) => keys.label)
    .filter((keys) => {
      return keys;
    });

  const firstHeader = ["Pop."];
  const totalHeader = ["Total"];
  return firstHeader.concat(columnHeaders.concat(totalHeader));
};

export const generateTableFooter = (rows:AnyObject) => {
    
}

export const ExportedOverflowTable = ({ section }: Props) => {
  const report = useStore().report;
  const form: FormJson = (section as AnyObject)?.form;

  let rows: AnyObject = {};
  let currentRow = "row";
  form?.fields?.forEach((field) => {
    if (field?.type === "sectionHeader") {
      currentRow = field?.props?.content ? field?.props?.content : currentRow;
    } else {
      rows[currentRow] = rows[currentRow] ?? [];
      rows[currentRow].push({ label: field?.props?.label, id: [field.id] });
    }
  });

  const table = generateMainTable(rows, report?.fieldData);

  return (
    <Box
      mt="2rem"
      data-testid="exportedModalDrawerReportSection"
      sx={sx.container}
    >
      <Table sx={sx.table} content={table}></Table>
    </Box>
  );
};

export interface Props {
  section: ReportPageShapeBase;
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  table: {
    marginTop: "1.25rem",
    borderLeft: "1px solid",
    borderRight: "1px solid",
    border: "1px solid",
    tableLayout: "fixed",
    marginBottom: "2.25rem",
    br: {
      marginBottom: "0.25rem",
    },
    tr: {
      background: "palette.gray_lightest",
      border: "1px solid",
    },
    thead: {
      height: "100px",
      border: "1px solid",
    },
    "td,th": {
      textAlign: "center",
      wordWrap: "break-word",
      border: "1px solid",
    },
    "td:first-child": {
      background: "palette.gray_lightest",
      fontWeight: "bold",
    },
    th: {
      borderBottom: "1px solid",
      borderRight: "1px solid",
      border: "1px solid",
      borderColor: "palette.black",
      color: "palette.black",
      lineHeight: "normal",
      fontWeight: "bold",
      width: "100px",
      minWidth: "100px",
      ".tablet &, .mobile &": {
        border: "1px solid",
      },
    },
    "tbody tr": {
      background: "palette.white",
    },
    "tbody tr td:last-child, tfoot": {
      background: "palette.secondary_lightest",
      fontWeight: "bold",
    },
    "tbody tr td": {
      borderRight: "1px solid black",
      borderBottom: "1px solid black",
    },
    "tfoot th:last-child": {
      background: "palette.gray_medium",
      color: "palette.white",
    },
  },
};
