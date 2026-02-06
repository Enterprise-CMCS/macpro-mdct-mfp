import { useEffect, useState } from "react";
// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { Table } from "components";
// types
import { EntityShape, HeadingLevel, ModalDrawerReportPageShape } from "types";
// utils
import { convertToThousandsSeparatedString, useStore } from "utils";
import { notAnsweredText } from "../../constants";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
  headingLevel = "h3",
}: Props) => {
  const [overflow, setOverflow] = useState(false);
  const report = useStore().report;
  const entities = report?.fieldData?.[entityType];
  const { reportPeriod, reportYear } = report!;

  const getTableHeaders = () => {
    let headers = [];
    let bodyHeaders = [];
    const quarterHeader = {
      displayName: "Pop. by Quarter",
      ariaLabel: "Population by Quarter",
    };

    const totalHeader = {
      displayName: "Total by Quarter",
      ariaLabel: "Total by Quarter",
    };

    for (const entity of entities) {
      const shortName = entity.transitionBenchmarks_targetPopulationName_short;
      const longName = entity.transitionBenchmarks_targetPopulationName.slice(
        0,
        29
      );
      const ariaLabel = entity.transitionBenchmarks_targetPopulationName;

      bodyHeaders.push({
        displayName: shortName ?? longName,
        ariaLabel: ariaLabel,
      });
    }

    headers.push(quarterHeader, ...bodyHeaders, totalHeader);
    return headers;
  };

  // utility to convert array strings to num for calculating totals
  const convertToNum = (item: any) => {
    let num = isNaN(parseInt(item)) ? 0 : parseInt(item);
    return num;
  };

  const getSumDisplayValue = (sum: string) => {
    return sum === "0" ? "-" : sum;
  };

  const commaMasking = (item: string) => {
    return convertToThousandsSeparatedString(item).maskedValue;
  };

  const ariaLabelledAsterisk = `<span aria-label="sum of incomplete fields">*</span>`;

  // applicable quarters for report; populates left table column
  const generateQuarterLabels = () => {
    // The first quarter will be Q1 for period 1, or Q3 for period 2.
    const firstQuarterIndex = reportPeriod === 1 ? 0 : 2;

    // returns array of labels like ["2024 Q1", "2024 Q2", ...]
    return Array.from({ length: 12 })
      .map((_, index) => ({
        year: reportYear + Math.floor((firstQuarterIndex + index) / 4),
        quarter: `Q${1 + ((firstQuarterIndex + index) % 4)}`,
      }))
      .map(({ year, quarter }) => `${year} ${quarter}`);
  };
  const quarterLabels = generateQuarterLabels();

  // creates arrays of 'only' quarterly values
  const quarterValueArray = entities.map((entity: EntityShape) => {
    const isNotApplicableToMfp =
      entity?.transitionBenchmarks_applicableToMfpDemonstration?.[0].value ===
      "No";

    // if not applicable we populate the column with 12 "N/A" cells
    if (isNotApplicableToMfp) {
      return Array(12).fill("N/A");
    }

    const quarterArray = Object.keys(entity)
      .filter((key) => key.includes("quarterly"))
      .map((key) => entity[key]);

    // if length of filled in data is not 12, show "Not answered" in remaining cells
    while (quarterArray.length < 12) {
      quarterArray.push(notAnsweredText);
    }

    return quarterArray;
  });

  const generateFootRow = () => {
    // creates an array that totals up each each quarter column
    const columnTotal = quarterValueArray.map((column: string[]) => {
      let sum = 0;
      const isNACol = [];
      column.forEach((item: any) => {
        if (item === "N/A" || item === "Data not available") {
          isNACol.push(item);
        } else {
          sum += convertToNum(item);
        }
      });
      if (sum === 0 && isNACol.length !== 12) {
        return "-";
      } else if (isNACol.length === 12) {
        return "N/A";
      } else {
        return sum.toString();
      }
    });

    // adds up the footer row for the grey box total on bottom right of table
    const footRowTotal = () => {
      let sum = 0;
      columnTotal.forEach((item: any) => {
        sum += convertToNum(item);
      });
      // the dash - gets put in totals where the user did not answer the question
      const displaySum = getSumDisplayValue(sum.toString());
      if (columnTotal.includes("-")) {
        return displaySum === "-"
          ? "-"
          : `${commaMasking(displaySum)}${ariaLabelledAsterisk}`;
      } else {
        return commaMasking(displaySum);
      }
    };

    const commaMaskColumTotal = columnTotal.map((item: string) =>
      commaMasking(item)
    );
    return ["Total by Pop.", ...commaMaskColumTotal, footRowTotal()];
  };

  const getRowSumDisplayValue = (row: string[], sum: string) => {
    let displayValue = sum;
    if (row.includes(notAnsweredText) || row.includes("-")) {
      displayValue = sum === "-" ? `${sum}` : `${sum}${ariaLabelledAsterisk}`;
    }
    return displayValue;
  };

  const generateHeaderAriaLabels = () => {
    let ariaHeaders = getTableHeaders().map((obj) => obj.ariaLabel);
    return {
      headRow: [...ariaHeaders],
    };
  };

  const generateMainTable = () => {
    // create new quarter value array
    let newQuarterValueArray = new Array(...quarterValueArray);

    let tableHeadersArray = getTableHeaders().map((obj) => obj.displayName);

    {
      overflow === true ? tableHeadersArray.pop() : null;
    }

    const overflowHeaderRows = tableHeadersArray.filter((arr: any[]) => {
      return tableHeadersArray.indexOf(arr) <= 6 && arr;
    });

    const headerArray = overflow ? overflowHeaderRows : tableHeadersArray;

    const formatBodyRow = () => {
      let bodyRows = [];

      const overflowBodyRows = newQuarterValueArray.filter((arr) => {
        return newQuarterValueArray.indexOf(arr) <= 5 && arr;
      });

      const valueArray = overflow ? overflowBodyRows : newQuarterValueArray;

      // get mainQuarterValueArray.length because arrays are all the same length
      for (let index = 0; index < valueArray[0].length; index++) {
        let rows = [];
        // sum to be added up for each quarter row
        let sum = 0;
        rows.push(quarterLabels[index]);
        valueArray.forEach((array) => {
          sum += convertToNum(array[index]);
          rows.push(commaMasking(array[index]));
        });

        if (!overflow) {
          const displaySum = getRowSumDisplayValue(
            rows,
            getSumDisplayValue(sum.toString())
          );
          rows.push(commaMasking(displaySum));
        }

        bodyRows.push(rows);
      }

      return bodyRows;
    };

    const updateFooterRow = overflow
      ? generateFootRow().filter((item, index) => index <= 6)
      : generateFootRow();

    const table = {
      caption: "Transition Benchmark Totals Table",
      headRow: [...headerArray],
      bodyRows: [...formatBodyRow()],
      footRow: [[...updateFooterRow]],
    };

    return table;
  };

  const generateOverflowTable = () => {
    // create new quarter value array
    let newQuarterValueArray = new Array(...quarterValueArray);

    let overflowQuarterValueArray = newQuarterValueArray.filter(
      (arr: string[]) => newQuarterValueArray.indexOf(arr) > 5
    );
    let tableHeadersArray = getTableHeaders().map((obj) => obj.displayName);

    const formatBodyRow = () => {
      let bodyRows = [];

      // get quarterValueArray.length because arrays are all the same length
      for (
        let index = 0;
        index < overflowQuarterValueArray[0].length;
        index++
      ) {
        let rows = [];
        let rowsForSum: string[] = [];
        // sum to be added up for each quarter row
        let sum = 0;
        rows.push(quarterLabels[index]);
        overflowQuarterValueArray.forEach((array) => {
          rows.push(commaMasking(array[index]));
        });

        quarterValueArray.forEach((array: any[]) => {
          rowsForSum.push(commaMasking(array[index]));
          sum += convertToNum(array[index]);
        });

        // add asterisk to unfinished row totals
        const displaySum = getRowSumDisplayValue(
          new Array(...rows, ...rowsForSum),
          getSumDisplayValue(sum.toString())
        );
        rows.push(commaMasking(displaySum));
        bodyRows.push(rows);
      }
      return bodyRows;
    };

    const formatOverflowTableHeaders = () => {
      const overflowTableHeadersArray = [];
      overflowTableHeadersArray.push(tableHeadersArray[0]);

      tableHeadersArray.find((arr) => {
        if (tableHeadersArray.indexOf(arr) > 6) {
          overflowTableHeadersArray.push(arr);
        }
      });
      return overflowTableHeadersArray;
    };

    const formatFootRow = () => {
      const newFootRowArray = new Array(...generateFootRow());
      const mainFootRow = newFootRowArray.filter((item, index) => index >= 7);
      return ["Total by Pop.", ...mainFootRow];
    };

    const overflowTable = {
      caption: "Transition Benchmark Totals Table - Continued",
      headRow: [...formatOverflowTableHeaders()],
      bodyRows: [...formatBodyRow()],
      footRow: [[...formatFootRow()]],
    };

    return overflowTable;
  };

  useEffect(() => {
    if (quarterValueArray && quarterValueArray.length > 6) {
      setOverflow(true);
    } else {
      setOverflow(false);
    }
  }, []);

  return (
    <Box
      mt="2rem"
      data-testid="exportedModalDrawerReportSection"
      sx={sx.container}
    >
      {verbiage.pdfDashboardTitle && (
        <>
          <Heading
            as={headingLevel}
            sx={sx.dashboardTitle}
            data-testid="headerCount"
          >
            {verbiage.pdfDashboardTitle}
          </Heading>
          <Text sx={sx.text}>
            {"*asterisk denotes sum of incomplete fields"}
          </Text>
        </>
      )}
      <Box sx={overflow ? sx.overflowStyles : {}}>
        <Table
          sx={sx.table}
          content={generateMainTable()}
          ariaOverride={generateHeaderAriaLabels()}
        ></Table>
        {overflow && (
          <Table sx={sx.table} content={generateOverflowTable()}></Table>
        )}
      </Box>
    </Box>
  );
};

export interface Props {
  section: ModalDrawerReportPageShape;
  headingLevel?: HeadingLevel;
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  dashboardTitle: {
    fontSize: "21px",
    lineHeight: "130%",
    fontWeight: "bold",
    color: "gray_darkest",
  },
  table: {
    marginTop: "1.25rem",
    borderLeft: "1px solid",
    borderRight: "1px solid",
    border: "1px solid",
    tableLayout: "fixed",
    marginBottom: "2.25rem",
    br: {
      marginBottom: "spacer_half",
    },
    tr: {
      background: "gray_lightest",
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
    "td:first-of-type": {
      background: "gray_lightest",
      fontWeight: "bold",
    },
    th: {
      borderBottom: "1px solid",
      borderRight: "1px solid",
      border: "1px solid",
      borderColor: "black",
      color: "black",
      lineHeight: "normal",
      fontWeight: "bold",
      width: "100px",
      minWidth: "100px",
      ".tablet &, .mobile &": {
        border: "1px solid",
      },
    },
    "tbody tr": {
      background: "white",
    },
    "tbody tr td:last-child, tfoot": {
      background: "secondary_lightest",
      fontWeight: "bold",
    },
    "tbody tr td": {
      borderRight: "1px solid black",
      borderBottom: "1px solid black",
    },
    "tfoot th:last-child": {
      background: "gray",
      color: "white",
    },
  },
  overflowStyles: {
    "table:first-of-type tfoot th:last-child": {
      background: "secondary_lightest",
      color: "black",
    },
    "table:first-of-type tbody tr td:last-child": {
      background: "white",
      fontWeight: "normal",
    },
  },
  border: {
    marginTop: "1.25rem",
  },
  text: {
    fontSize: "0.875rem",
  },
};
