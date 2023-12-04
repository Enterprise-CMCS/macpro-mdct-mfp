// components
import { Box, Heading } from "@chakra-ui/react";
import { Table } from "components";
// utils
import { useStore } from "utils";
import { ModalDrawerReportPageShape } from "types";
import { AnyObject } from "yup/lib/types";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: Props) => {
  const { report } = useStore() ?? {};
  const entities = report?.fieldData?.[entityType];

  // if Transition Benchmark Header title has an abbrev.just display that
  const getTableHeaders = entities.map((entity: AnyObject) =>
    entity.transitionBenchmarks_targetPopulationName_short
      ? entity.transitionBenchmarks_targetPopulationName_short
      : entity.transitionBenchmarks_targetPopulationName
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
    let num = parseInt(item);
    if (typeof num === "number" && !isNaN(num)) {
      return num;
    } else {
      return 0;
    }
  };

  // creates arrays of 'only' quarterly values
  const quarterValueArray = entities.map((entity: AnyObject) => {
    let quarterArray = [];
    let overflowArray = [];
    if (entities.indexOf(entity) <= 6) {
      for (const key in entity) {
        // push key values into quarterArray that are quarters
        if (key.includes("quarterly")) {
          quarterArray.push(entity[key]);
        }
      }
    } else {
      overflowArray.push(entity);
    }

    return quarterArray;
  });

  // creates an array that totals up each each quarter column
  const columnTotal = quarterValueArray.map((column: string[]) => {
    let sum = 0;
    column.forEach((item: any) => {
      sum += convertToNum(item)!;
    });
    return sum;
  });

  // adds up the footer row for the grey box total on bottom right of table
  const footRowTotal = () => {
    let sum = 0;
    columnTotal.forEach((item: any) => {
      sum += convertToNum(item);
    });
    return sum;
  };

  /* layout of the table body rows  */
  /* sums up body rows */
  /* updates empty cells to "Not Answered"  */
  const createBodyRows = () => {
    let bodyRows = [];

    // get quarterValueArray.length because arrays are all the same length
    for (let item = 0; item < quarterValueArray[0].length; item++) {
      let row = [];

      // sum to be added up for each quarter row
      let sum = 0;
      row.push(quarterLabels[item]);

      // Add Not Answer if cell is empty string,
      quarterValueArray.forEach((array: any[]) => {
        if (array[item] === "") {
          array[item] = "Not Answered";
        }
        if (
          typeof parseInt(array[item]) === "number" &&
          array[item] !== "Not Answered"
        ) {
          sum += convertToNum(array[item]);
        }
        row.push(array[item].toString());
        return sum;
      });

      row.push(sum.toString());
      bodyRows.push(row);
    }
    return bodyRows;
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
      ".tablet &, .mobile &": {
        border: "none",
      },
    },
    "tbody tr": {
      background: "palette.white",
    },
    "tbody tr td:last-child, tfoot": {
      background: "palette.secondary_lightest",
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
