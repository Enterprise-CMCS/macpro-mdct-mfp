import {
  AnyObject,
  FormJson,
  ReportPageShapeBase,
  TableContentShape,
} from "types";

// components
import { Box } from "@chakra-ui/react";
import { Table } from "components";

// utils
import { useStore } from "utils";
import { notAnsweredText } from "../../constants";

export const generateMainTable = (
  rows: AnyObject,
  fieldData?: AnyObject,
  caption?: string
) => {
  const headerRow = generateTableHeader(rows);
  const bodyRows: string[][] = generateTableBody(rows, fieldData);
  const footRow: string[][] | undefined = generateTableFooter(
    bodyRows,
    headerRow.length
  );

  const table = {
    caption: `${caption} Table`,
    headRow: headerRow,
    bodyRows: bodyRows,
    footRow: footRow,
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
      const rowValue = fieldData?.[id] ?? notAnsweredText;
      row.push(rowValue);
    });
  });

  bodyRow.forEach((row) => {
    const total = sumRow(row, 1);
    row.push(isNaN(Number(total)) ? "-" : total);
  });

  return bodyRow;
};

export const sumRow = (row: string[], startIndex: number = 0) => {
  if (row.length === 0) return "-";

  return row?.reduce((accumulator, currentValue, index) => {
    if (index > startIndex && isNaN(Number(currentValue))) return accumulator;

    return index > startIndex
      ? (Number(accumulator) + Number(currentValue)).toString()
      : currentValue;
  });
};

export const generateTableHeader = (rows: AnyObject) => {
  const row: AnyObject[] = Object.values(rows)[0];

  const columnHeaders = row
    .map((keys) => truncateLabel(keys.label))
    .filter((keys) => {
      return keys;
    });

  const firstHeader = ["Population"];
  const totalHeader = ["Total"];
  return firstHeader.concat(columnHeaders.concat(totalHeader));
};

export const generateTableFooter = (bodyRows: string[][], size: number) => {
  if (bodyRows.length <= 1) return;

  let footRow: string[][] = [["Total by population"]];
  bodyRows.forEach((row: string[]) => {
    row.forEach((col: string, index: number) => {
      //if the column is a valid number
      if (!isNaN(Number(col))) {
        if (!footRow[0][index]) footRow[0][index] = "0";
        footRow[0][index] = (
          Number(footRow[0][index]) + Number(col)
        ).toString();
      }
    });
  });

  for (var i = 0; i < size; i++) {
    footRow[0][i] = footRow[0][i] ?? "-";
  }

  return footRow;
};

export const sumOfTwoRows = (row1: string[], row2: string[]) => {
  return row1
    .map((col, index) => {
      const total = Number(col) + Number(row2[index]);
      return isNaN(total) ? "-" : total.toString();
    })
    .splice(1, row1.length);
};

export const perOfTwoRows = (row1: string[], row2: string[]) => {
  return row1
    .map((col, index) => {
      const total = (Number(col) / Number(row2[index])) * 100;
      return isNaN(total) ? "-" : total.toFixed(2) + "%";
    })
    .splice(1, row1.length);
};

export const truncateLabel = (label: string) => {
  if (label.includes("Other:")) return label.replace("Other:", "");

  switch (label) {
    case "Number of Older adults":
      return "Older Adults";
    default: {
      return label.substring(label.indexOf("(") + 1, label.indexOf(")"));
    }
  }
};

export const RETFooters = (
  formId: string,
  fieldData: AnyObject,
  rows: string[][]
) => {
  switch (formId) {
    case "ret-mtrp":
      //Number of MFP transitions in the reporting period
      const quarterIds = [
        "quarterlyProjections2024Q1",
        "quarterlyProjections2024Q2",
      ];

      quarterIds.forEach((id: string) => {
        const quarterList = (fieldData?.targetPopulations as []).map(
          (target) => {
            return target[id] ? target[id] : "-";
          }
        );

        const total = sumRow(quarterList);
        rows.push(
          ["Transition targets " + id].concat(quarterList).concat(total)
        );
      });

      const totalTranstionTargets = [
        "Total transition targets",
        ...sumOfTwoRows(rows[rows.length - 2], rows[rows.length - 1]),
      ];
      const perTargetsAchieved = [
        "% targets achieved",
        ...perOfTwoRows(rows[0], totalTranstionTargets),
      ];
      rows.push(totalTranstionTargets, perTargetsAchieved);
      break;
    case "ret-mpdprp":
      //Number of MFP participants disenrolled from the program during the reporting period
      const table5Keys = Object.keys(fieldData)?.filter((key) =>
        key.includes("ret-tnamprp")
      );
      const table5Values = (table5Keys as [])?.map((key) => {
        return fieldData[key];
      });
      const table5Row = ["Total", ...table5Values, sumRow(table5Values)];

      const totalPopulation = rows[rows.length - 1];
      const totalPer = [
        "Total as a % of all current MFP participate",
        ...perOfTwoRows(totalPopulation, table5Row),
      ];
      rows.push(totalPer);
      break;
  }
};

export const truncateTable = (table: TableContentShape, maxColumn: number) => {
  const splitTables = [];

  if (table.headRow) {
    //this prevents total from being the only column in an overflow
    const adjustMaxColumn =
      (table.headRow.length - 1) % maxColumn === 1 ? maxColumn - 1 : maxColumn;
    //we remove 1 from the header count because the first column are just labels
    const overflowTotal = (table.headRow.length - 1) / adjustMaxColumn;

    //make copies of the table for each overflow
    for (var i = 0; i < overflowTotal; i++) {
      splitTables.push(structuredClone(table));
    }

    const rowLength = table.headRow.length;

    splitTables.forEach((_table, index) => {
      const startIndex = index * adjustMaxColumn;
      const endIndex = (index + 1) * adjustMaxColumn + 1;

      //first cut from the max column to the length
      _table.headRow?.splice(endIndex, rowLength);
      //then skip the first column as those are the labels and cut to the start column
      _table.headRow?.splice(1, startIndex);

      _table.bodyRows?.forEach((row) => {
        row.splice(endIndex, rowLength);
        row.splice(1, startIndex);
      });
      _table.footRow?.forEach((row) => {
        row.splice(endIndex, rowLength);
        row.splice(1, startIndex);
      });
    });
  }

  return splitTables;
};

export const ExportRETTable = ({ section }: Props) => {
  const report = useStore().report;
  const form: FormJson = (section as AnyObject)?.form;

  let rows: AnyObject = {};
  let currentRow = report?.reportYear + " Period " + report?.reportPeriod;
  form?.fields?.forEach((field) => {
    if (field?.type === "sectionHeader") {
      currentRow = field?.props?.content ? field?.props?.content : currentRow;
    } else if (field?.type === "checkbox") {
      const checkboxList = report?.fieldData[field.id] as [];
      const childrens = checkboxList
        ?.map(
          (checkbox: AnyObject) =>
            (field.props?.choices as AnyObject[])?.find(
              (choice: AnyObject) => choice.id === checkbox.key.split("-")[1]
            )?.children
        )
        .flat();

      const childIds = childrens?.map((child: AnyObject) => {
        return {
          label: child?.props?.label,
          id: [child.id],
          parentId: child?.validation?.parentOptionId,
        };
      });

      checkboxList?.forEach((checkbox: AnyObject) => {
        const parentId = checkbox.key.split("-")[1];
        rows[checkbox.value] = childIds.filter(
          (child) => child.parentId === parentId
        );
      });
    } else {
      rows[currentRow] = rows[currentRow] ?? [];
      rows[currentRow].push({ label: field?.props?.label, id: [field.id] });
    }
  });

  const table = generateMainTable(rows, report?.fieldData, section.name);
  RETFooters(form?.id, report?.fieldData!, table.footRow!);
  const tables = truncateTable(table, 5);

  return (
    <Box
      mt="2rem"
      data-testid="exportedModalDrawerReportSection"
      sx={sx.container}
    >
      {tables &&
        tables.map((table) => {
          return <Table sx={sx.table} content={table}></Table>;
        })}
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
    "thead tr:first-child th": {
      background: "palette.gray_lightest",
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
    th: {
      color: "black",
    },
    "td,th": {
      textAlign: "center",
      wordWrap: "break-word",
      border: "1px solid black",
      fontWeight: "normal",
    },
    "td:first-child, tfoot th:first-child": {
      background: "palette.gray_lightest",
      fontWeight: "bold",
      color: "palette.black",
    },
    "tbody tr": {
      background: "palette.white",
    },
    ":last-of-type tbody tr td:last-child, tfoot th": {
      background: "palette.secondary_lightest",
      fontWeight: "bold",
    },
  },
};
