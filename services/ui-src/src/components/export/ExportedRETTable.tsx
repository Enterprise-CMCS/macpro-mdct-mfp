import {
  AnyObject,
  FormJson,
  ReportPageShapeBase,
  TableContentShape,
} from "types";

// components
import { Box, Text } from "@chakra-ui/react";
import { Table } from "components";

// utils
import { useStore, sumOfRow, sumOfTwoRows, perOfTwoRows } from "utils";
import { notAnsweredText } from "../../constants";

export const generateMainTable = (
  rows: AnyObject,
  fieldData?: AnyObject,
  caption?: string
) => {
  const labelHeader =
    fieldData?.formId === "ret-hcbs" ? "Term of Stay" : "Population";
  const totalLabel =
    fieldData?.formId === "ret-hcbs"
      ? "Total re-institutionalizations for any length of time"
      : "Total by population";

  const headerRow = generateTableHeader(rows, labelHeader);
  const bodyRows: string[][] = generateTableBody(rows, fieldData);
  const footRow: string[][] | undefined = generateTableFooter(
    bodyRows,
    headerRow.length,
    totalLabel
  );

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

  return [headerLabel, ...columnHeaders, "Total"];
};

export const generateTableBody = (rows: AnyObject, fieldData?: AnyObject) => {
  //get the table row labels
  const firstCols = Object.keys(rows).map((key) => {
    return [key];
  });
  let bodyRow: string[][] = firstCols;

  bodyRow.forEach((row: string[]) => {
    const matchRow: [] = rows[row[0]];
    const rowIds = matchRow.map((info: AnyObject) => info.id).flat();
    rowIds.forEach((id) => {
      const rowValue = fieldData?.[id] || notAnsweredText;
      row.push(rowValue);
    });
  });

  bodyRow.forEach((row) => {
    const total = sumOfRow(row, 1);
    row.push(isNaN(Number(total)) ? "-" : total);
  });

  return bodyRow;
};

export const generateTableFooter = (
  bodyRows: string[][],
  size: number,
  totalLabel: string
) => {
  if (bodyRows.length <= 1) return;

  let footRow: string[][] = [[totalLabel]];
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
    footRow[0][i] = footRow[0][i] || "-";
  }

  return footRow;
};

export const formatHeaderForRET = (label: string) => {
  if (label.includes("Other:")) return label.replace("Other:", "").trim();

  switch (label) {
    case "Population":
      return "Pop.";
    case "Number of Older adults":
      return "Older Adults";
    default: {
      if (label.includes("("))
        return label.substring(label.indexOf("(") + 1, label.indexOf(")"));
      return label;
    }
  }
};

export const formatLabelForRET = (
  formId: string,
  label: string,
  report: AnyObject
) => {
  switch (formId) {
    case "ret-mtrp": {
      if (label.includes("quarter")) {
        const quarterLabel: AnyObject = {
          "First quarter": "Q1",
          "Second quarter": "Q2",
          "Third quarter": "Q3",
          "Fourth quarter": "Q4",
        };
        const quarter: string = label.split("(")[0].trim();
        return `${report?.reportYear} ${quarterLabel[quarter]}`;
      }
      break;
    }
    case "ret-mtfqi": {
      //ex. "I am (Label)" returns "Label"
      if (label.includes("("))
        return label.substring(label.indexOf("(") + 1, label.indexOf(")"));
      break;
    }
    case "ret-mtfqr": {
      //ex. "I am (Label)" returns "I am"
      if (label.includes("(")) return label.split(" (")[0];
      else {
        //specific string modifications
        if (label.includes("Group home")) return "Group home";
        else if (label === "Apartment in qualified assisted living")
          return "Apt. in qualified assisted living";
      }
      break;
    }
    case "ret-mpdprp": {
      if (label === "Other, specify")
        return `Other: ${report?.fieldData["otherReasons-otherText"]}`;
      break;
    }
  }

  return label;
};

export const formatFooterForRET = (
  formId: string,
  report: AnyObject,
  rows: string[][],
  header?: string[]
) => {
  const fieldData = report?.fieldData;
  const year = report?.reportYear;
  const period = report?.reportPeriod;

  switch (formId) {
    //Number of MFP transitions in the reporting period
    case "ret-mtrp": {
      //update the total label to the unique values for this RET section
      rows[0][0] = "Total transitions";
      //generate the ids to pull the correct values from WP
      const quarterIds = [
        `quarterlyProjections${year}${period === 1 ? "Q1" : "Q3"}`,
        `quarterlyProjections${year}${period === 1 ? "Q2" : "Q4"}`,
      ];
      //filter the target population to only the ones that were selected
      const filteredTargetPopulation = (
        fieldData?.targetPopulations as []
      )?.filter((target) => {
        const targetLabel = target["transitionBenchmarks_targetPopulationName"];
        const findLabel = header?.filter((label) => {
          return label.includes(targetLabel);
        });
        return findLabel?.length || false;
      });
      //get the row values for this target transition from WP targetPopulations, unique to ret-mtrp
      quarterIds.forEach((id: string) => {
        const quarterList = filteredTargetPopulation?.map((target) => {
          return target[id] ? target[id] : "-";
        });
        rows.push([
          `Transition targets ${year} ${id.split(year)[1]}`,
          ...quarterList,
          sumOfRow(quarterList),
        ]);
      });
      //extra row added to sum the transition targets, only unique to ret-mtrp section
      const totalTranstionTargets = [
        "Total transition targets",
        ...sumOfTwoRows(rows[rows.length - 2], rows[rows.length - 1]),
      ];
      //extra row added to get the percentage of targets, only unique to ret-mtrp section
      const perTargetsAchieved = [
        "% targets achieved",
        ...perOfTwoRows(rows[0], totalTranstionTargets),
      ];
      rows.push(totalTranstionTargets, perTargetsAchieved);
      break;
    }
    //Number of MFP participants disenrolled from the program during the reporting period
    case "ret-mpdprp": {
      const table5Keys = Object.keys(fieldData)?.filter((key) =>
        key.includes("ret-tnamprp")
      );
      const table5Values = (table5Keys as [])?.map((key) => {
        return fieldData[key];
      });
      const table5Row = ["Total", ...table5Values, sumOfRow(table5Values)];

      const totalPopulation = rows[rows.length - 1];
      const totalPer = [
        "Total as a % of all current MFP participate",
        ...perOfTwoRows(totalPopulation, table5Row),
      ];
      rows.push(totalPer);
      break;
    }
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
    //loop through the copied tables and start splicing columns out of the row
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
  //setting up the data to generate the rows
  form?.fields?.forEach((field) => {
    if (field?.type === "sectionHeader") {
      //the content in sectionHeader field types are used as row labels
      currentRow = field?.props?.content || currentRow;
    } else if (field?.type === "checkbox") {
      //get a list of all the selected checkboxes in this section
      const checkboxList = report?.fieldData[field.id] as [];
      //strip out the nested values in the selected checkboxes, we need the ids to find the inputted values
      const childrens = checkboxList
        ?.map(
          (checkbox: AnyObject) =>
            (field.props?.choices as AnyObject[])?.find(
              (choice: AnyObject) => choice.id === checkbox.key.split("-")[1]
            )?.children
        )
        .flat();
      //clean up the children value to a usable array for lookup
      const childIds = childrens?.map((child: AnyObject) => {
        return {
          label: child?.props?.label,
          id: [child?.id],
          parentId: child?.validation?.parentOptionId,
        };
      });
      //generate the row with the correct checkedbox inputs
      checkboxList?.forEach((checkbox: AnyObject) => {
        const parentId = checkbox.key.split("-")[1];
        rows[formatLabelForRET(form?.id, checkbox.value, report!)] =
          childIds?.filter((child) => child.parentId === parentId);
      });
    } else {
      rows[currentRow] = rows[currentRow] ?? [];
      rows[currentRow].push({ label: field?.props?.label, id: [field.id] });
    }
  });

  const formattedFieldData = { ...report?.fieldData, formId: form?.id };
  //generate the table
  let table: TableContentShape = {};
  let ariaOverride: TableContentShape = {};
  if (Object.keys(rows).length > 0) {
    table = generateMainTable(rows, formattedFieldData, section.name);
    formatFooterForRET(form?.id, report!, table.footRow!, table.headRow!);
    //copying the current table before label truncating; these are the desired aria-labels
    ariaOverride = structuredClone(table);
    //truncating the table labels
    table.headRow = table.headRow?.map((label) => formatHeaderForRET(label));
    table.bodyRows = table.bodyRows?.map((rows) => {
      rows[0] = formatLabelForRET(form?.id, rows[0], report!);
      return rows;
    });
  }
  //split the table if there are >= 3 Other columns
  const tables: TableContentShape[] = truncateTable(table, 7);

  return (
    <Box mt="1.5rem" data-testid="exportRETTable" sx={sx.container}>
      {tables.length > 0 ? (
        tables?.map((table, index) => {
          return (
            <Table
              sx={sx.table}
              content={table}
              key={`table-${index}`}
              ariaOverride={ariaOverride}
            ></Table>
          );
        })
      ) : (
        <Text sx={sx.retAlert}>
          Your associated MFP Work Plan does not contain any target populations.
        </Text>
      )}
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
    ":last-of-type tbody tr td:last-child, tfoot th": {
      background: "palette.secondary_lightest",
      fontWeight: "bold",
    },
  },
  // RE&T warning message
  retAlert: {
    color: "palette.error_dark",
  },
};
