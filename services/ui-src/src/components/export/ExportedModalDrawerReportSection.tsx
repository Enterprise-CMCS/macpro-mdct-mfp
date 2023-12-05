// components
import { Box, Heading } from "@chakra-ui/react";
import { Table } from "components";
// utils
import { useStore } from "utils";
import { ModalDrawerReportPageShape, AnyObject } from "types";
import _ from "lodash";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: Props) => {
  const { report } = useStore() ?? {};
  const entities = report?.fieldData?.[entityType];

  const truncateHeader = (text: string) => {
    return _.truncate(text, { length: 30 });
  };

  // if Transition Benchmark Header title has an abbrev.just display that
  const getTableHeaders = entities.map((entity: AnyObject) =>
    entity.transitionBenchmarks_targetPopulationName_short
      ? entity.transitionBenchmarks_targetPopulationName_short
      : truncateHeader(entity.transitionBenchmarks_targetPopulationName)
  );

  // list of quarters to be added to the table (left column)
  const quarterLabels = [
    "2023 Q3",
    "2023 Q4",
    "2024 Q1",
    "2025 Q4",
    "2024 Q2",
    "2024 Q3",
    "2024 Q4",
    "2025 Q1",
    "2025 Q2",
    "2025 Q3",
    "2025 Q4",
    "2026 Q1",
    "2026 Q2",
  ];

  // utility to convert array strings to num for calculating totals
  const convertToNum = (item: any) => {
    let num = isNaN(parseInt(item)) ? 0 : parseInt(item);
    return num;
  };

  // creates arrays of 'only' quarterly values
  const quarterValueArray = entities.map((entity: AnyObject) => {
    let quarterArray = [];
    for (const key in entity) {
      // push key values into quarterArray that are quarters
      if (key.includes("quarterly")) {
        quarterArray.push(entity[key]);
      }
    }
    return quarterArray;
  });

  // creates an array that totals up each each quarter column
  const columnTotal = quarterValueArray.map((column: string[]) => {
    let sum = 0;
    let isNACol = [];
    column.forEach((item: any) => {
      if (item === "N/A") {
        isNACol.push(item);
      } else {
        sum += convertToNum(item)!;
      }
    });

    if (sum === 0 && isNACol.length !== 12) {
      return "-";
    } else if (isNACol.length === 12) {
      return "N/A";
    } else {
      return sum;
    }
  });

  // adds up the footer row for the grey box total on bottom right of table
  const footRowTotal = () => {
    let sum = 0;
    columnTotal.forEach((item: any) => {
      sum += convertToNum(item);
    });

    if (columnTotal.includes("N/A" || "Not Answered")) {
      return `${sum}*`;
    } else {
      return sum === 0 ? "-" : sum;
    }
  };

  /* layout of the table body rows  */
  /* sums up body rows */
  /* updates empty cells to "Not Answered"  */
  const createBodyRows = () => {
    let bodyRows = [];

    // get quarterValueArray.length because arrays are all the same length
    for (let item = 0; item < quarterValueArray[0].length; item++) {
      let row: string[] = [];
      // sum to be added up for each quarter row
      let sum = 0;
      row.push(quarterLabels[item]);

      // Add Not Answer if cell is empty string,
      quarterValueArray.forEach((array: any[]) => {
        if (array[item] === "") {
          array[item] = "Not Answered";
        }

        sum += convertToNum(array[item]);

        row.push(array[item].toString());
        return sum;
      });

      row.push(sum.toString());

      // add asteriks to unfinished row totals
      markUnfinishedRows(row);
      bodyRows.push(row);
    }
    return bodyRows;
  };

  const markUnfinishedRows = (row: string[]) => {
    if (row.includes("N/A" || "Not Answered")) {
      return (row[row.length - 1] = `${row[row.length - 1]}*`);
    }
    return;
  };

  const tableContent = {
    caption: "Transition Benchmark Totals Table",
    headRow: ["Pop. by Quarter", ...getTableHeaders, "Total by Quarter"],
    bodyRows: [...createBodyRows()],
    footRow: ["Total by Pop.", ...columnTotal, footRowTotal()],
  };

  return (
    <Box
      mt="2rem"
      data-testid="exportedModalDrawerReportSection"
      sx={sx.container}
    >
      <Heading as="h2" sx={sx.dashboardTitle} data-testid="headerCount">
        {verbiage.pdfDashboardTitle}
      </Heading>
      <small>{"*asterisk denotes sum of incomplete fields"}</small>
      <Box>
        <Table sx={sx.table} content={tableContent}></Table>
        {}
      </Box>
    </Box>
  );
};

export interface Props {
  section: ModalDrawerReportPageShape;
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  notAnswered: {
    display: "block",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.error_darker",
    marginTop: "0.5rem",
  },
  dashboardTitle: {
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_darkest",
  },
  // TODO: delete this
  table: {
    marginTop: "1.25rem",
    borderLeft: "1px solid",
    tableLayout: "fixed",
    br: {
      marginBottom: "0.25rem",
    },
    tr: {
      background: "palette.gray_lightest",
    },
    thead: {
      height: "100px",
      borderTop: "1px solid",
    },
    "td,th": {
      textAlign: "center",
      wordWrap: "break-word",
    },
    "td:first-child": {
      background: "palette.gray_lightest",
      fontWeight: "bold",
    },
    th: {
      borderBottom: "1px solid",
      borderRight: "1px solid",
      borderColor: "palette.black",
      color: "palette.black",
      lineHeight: "normal",
      fontWeight: "bold",
      width: "100px",
      minWidth: "100px",
      ".tablet &, .mobile &": {
        border: "none",
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
  border: {
    border: "1px solid black",
    marginTop: "1.25rem",
  },
};
