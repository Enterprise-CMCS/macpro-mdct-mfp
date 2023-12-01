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

  const tableHeaders = entities.map((entity: AnyObject) =>
    entity.transitionBenchmarks_targetPopulationName_short
      ? entity.transitionBenchmarks_targetPopulationName_short
      : entity.transitionBenchmarks_targetPopulationName
  );
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

  // create new arrays with only quarter values to populate the tbody
  const extractQuarters = entities.map((element: any) => {
    let arr = [];
    for (const x in element) {
      if (x.includes("quarterly")) {
        arr.push(element[x]);
      }
    }
    return arr;
  });

  // create array for tfoot section
  const totalByPopSum = extractQuarters.map((element: any) => {
    let sum = 0;

    element.forEach((num: any) => {
      let convertToNum = parseInt(num);
      if (Number.isInteger(convertToNum)) {
        sum += convertToNum;
      }
    });
    return sum;
  });

  // add up bottom row sums
  const finalPopSum = () => {
    let sum = 0;
    for (let i = 0; i < totalByPopSum.length; i++) {
      let convertToNum = parseInt(totalByPopSum[i]);
      if (Number.isInteger(convertToNum)) {
        sum += convertToNum;
      }
    }
    return sum;
  };

  const createBodyRows = () => {
    let bodyRows = [];

    for (let i = 0; i < extractQuarters[0].length; i++) {
      let arr = [];
      arr.push(quarterLabels[i]);
      extractQuarters.forEach((array: any) => {
        if (array[i] === "") {
          array[i] = "Not Answered";
        }
        arr.push(array[i]);
      });
      arr.push("sum");
      bodyRows.push(arr);
    }
    return bodyRows;
  };

  const tableContent = {
    caption: "Transition Benchmark Totals Table",
    headRow: ["Pop. by Quarter", ...tableHeaders, "Total by Quarter"],
    bodyRows: [...createBodyRows()],
    footRow: ["Total by Pop.", ...totalByPopSum, finalPopSum()],
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
      <small>{"*astrisk denotes sum of incomplete fields"}</small>
      <Box>
        <Table sx={sx.table} content={tableContent}></Table>
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
