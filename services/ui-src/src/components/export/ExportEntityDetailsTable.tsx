import {
  AnyObject,
  EntityDetailsStepTypes,
  EntityShape,
  FormField,
  ReportShape,
} from "types";
// components
import { Box } from "@chakra-ui/react";
import { Table } from "components";
// utils
import { notAnsweredText } from "../../constants";
import { convertToThousandsSeparatedString } from "utils";

export const generateMainTable = (rows: AnyObject, caption?: string) => {
  const headerRow: string[] = generateTableHeader(rows, "Spending");
  const bodyRows: string[][] = generateTableBody(rows);
  const footRow: string[][] = [];

  const table = {
    caption: `${caption} Table`,
    headRow: headerRow,
    bodyRows: bodyRows,
    footRow: footRow,
  };
  return table;
};

export const generateTableHeader = (rows: AnyObject, headerLabel: string) => {
  const row: AnyObject[] = Object.values(rows)[0];
  const columnHeaders = row
    .map((keys) => keys.label)
    .filter((keys) => {
      return keys;
    });

  return [headerLabel, ...columnHeaders];
};

export const generateTableBody = (rows: AnyObject) => {
  //get the table row labels
  const firstCols = Object.keys(rows).map((key) => {
    return [key];
  });
  let bodyRow: string[][] = firstCols;

  bodyRow.forEach((row: string[]) => {
    const matchRow: [] = rows[row[0]];
    const rowValues = matchRow.map((info: AnyObject) => info.value).flat();
    rowValues.forEach((value) => {
      row.push(value);
    });
  });
  return bodyRow;
};

export const formatColumns = (rows: AnyObject, type?: string) => {
  if (type === EntityDetailsStepTypes.EXPENDITURES) {
    insertTotalsColumns(rows);
    sortExpenditureColumns(rows);
  }
  return rows;
};

export const insertTotalsColumns = (rows: AnyObject) => {
  function formatValue(num: number | string, type?: string) {
    const val = Number(num);

    if (isNaN(val)) {
      return type === "masked" || type === "pct" ? "-" : num;
    }

    if (type === "pct") return `${val.toFixed(2)}%`;

    const currency = convertToThousandsSeparatedString(
      val.toString(),
      2
    ).maskedValue;
    return `$${currency}`;
  }

  Object.values(rows).forEach(
    (columnRow: { label: string; value: number | string }[]) => {
      let totalActual = 0;
      let totalProjected = 0;

      columnRow.forEach((col) => {
        const val = Number(col.value);
        // Sum actuals and projecteds based on labels
        if (col.label.startsWith("Actual spending")) {
          totalActual += val;
        } else if (col.label.startsWith("Projected spending")) {
          totalProjected += val;
        }
        col.value = formatValue(col.value);
      });

      const perTotalProjected = (totalActual / totalProjected) * 100;
      columnRow.push({
        label: "Total actual spending",
        value: formatValue(totalActual, "masked"),
      });
      columnRow.push({
        label: "% of total projected spending",
        value: formatValue(perTotalProjected, "pct"),
      });
    }
  );
};

export const sortExpenditureColumns = (rows: AnyObject) => {
  const columnTypeOrder = [
    "Actual spending",
    "Total actual spending",
    "Projected spending",
    "% of total projected spending",
  ];
  const quarterOrder = ["First", "Second", "Third", "Fourth"];

  Object.values(rows).forEach(
    (columnRow: { label: string; value: number | string }[]) => {
      columnRow.sort((a: any, b: any) => {
        const columnTypeIndex = (label: string) => {
          return columnTypeOrder.findIndex((group) => label.startsWith(group));
        };

        const typeA = columnTypeIndex(a.label);
        const typeB = columnTypeIndex(b.label);

        // Sort by columnTypeOrder
        if (typeA !== typeB) return typeA - typeB;

        if (
          ["Actual spending", "Projected spending"].includes(
            columnTypeOrder[typeA]
          )
        ) {
          const quarterIndex = (label: string) => {
            return quarterOrder.findIndex((q) => label.includes(q));
          };
          // Sort by quarterOrder
          return quarterIndex(a.label) - quarterIndex(b.label);
        }

        // Fallback sort for columns not defined in columnTypeOrder
        return a.label.localeCompare(b.label);
      });
    }
  );
};

export const formatHeaderLabel = (
  type: string,
  label: string,
  report: ReportShape
) => {
  if (type === "expenditures") {
    if (label.includes("(")) {
      let splitLabel = label.split(" (");
      const quarterLabel: AnyObject = {
        "First quarter": "Q1",
        "Second quarter": "Q2",
        "Third quarter": "Q3",
        "Fourth quarter": "Q4",
      };
      const quarter = splitLabel[1].split(":")[0];
      return `${splitLabel[0]} ${report.reportYear} ${quarterLabel[quarter]}`;
    }
  }
  return label;
};

export const ExportEntityDetailsTable = ({
  report,
  section,
  entity,
}: Props) => {
  const fields: FormField[] = section.form.fields;
  let rows: AnyObject = {};
  let currentRow: string;

  fields.forEach((field) => {
    if (field.type === "sectionHeader") {
      const repeat = Object.keys(rows).filter((key: string) => {
        return key.includes(field?.props?.content);
      });
      //handling edge case if the row label is the same
      currentRow =
        field?.props?.content + " " + (repeat.length > 0 ? repeat.length : "");
    } else if (field.type === "number") {
      rows[currentRow] = rows[currentRow] ?? [];
      const value = entity[field.id] || notAnsweredText;
      rows[currentRow].push({
        label: field?.props?.label,
        value: value,
      });
    }
  });

  const table = generateMainTable(
    formatColumns(rows, section?.stepType),
    section.name
  );
  table.headRow = table.headRow.map((label) =>
    formatHeaderLabel(section?.stepType, label, report!)
  );

  return (
    <Box mt="2rem" data-testid="exportEntityDetailsTable" sx={sx.container}>
      <Table content={table} className={section?.stepType}></Table>
    </Box>
  );
};

export interface Props {
  report: ReportShape;
  entity: EntityShape;
  section: AnyObject;
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
    table: {
      marginTop: "1.25rem",
      border: "1px solid",
      tableLayout: "fixed",
      marginBottom: "2.25rem",
      br: {
        marginBottom: "0.25rem",
      },
      thead: {
        height: "100px",
        border: "1px solid",
      },
      "thead tr:first-of-type th": {
        background: "palette.gray_lightest",
        border: "1px solid",
        borderColor: "palette.black",
        color: "palette.black",
        lineHeight: "normal",
        fontWeight: "bold",
        minWidth: "100px",
        width: "100px",
        ".tablet &, .mobile &": {
          border: "1px solid",
        },
      },
      th: {
        color: "black",
        verticalAlign: "middle",
      },
      "td,th": {
        textAlign: "center",
        wordWrap: "break-word",
        border: "1px solid black",
        fontWeight: "normal",
      },
      "td:first-of-type, tfoot th:first-of-type": {
        background: "palette.gray_lightest",
        fontWeight: "bold",
        color: "palette.black",
      },
      "tbody tr": {
        background: "palette.white",
      },
      "tfoot th": {
        background: "palette.secondary_lightest",
        fontWeight: "bold",
      },
    },
    ".expenditures": {
      "tbody tr": {
        "td:nth-of-type(n+4)": {
          background: "palette.secondary_lightest",
        },
        "td:nth-of-type(4), td:nth-of-type(7)": {
          fontWeight: "bold",
        },
      },
    },
  },
};
