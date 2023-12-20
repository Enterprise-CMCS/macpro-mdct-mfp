import { useEffect, useState } from "react";
// components
import { Box, Heading } from "@chakra-ui/react";
import { Table } from "components";
// types
import { EntityShape, ModalDrawerReportPageShape } from "types";
// utils
import { convertToThousandsSeparatedString, useStore } from "utils";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: Props) => {
  const [overflow, setOverflow] = useState(false);
  const report = useStore().report;
  const entities = report?.fieldData?.[entityType];

  // if Transition Benchmark Header title has an abbrev. just display that
  const getTableHeaders = () => {
    let headers = [];
    const quarterHeader = "Pop. by Quarter";
    const bodyHeaders = entities.map(
      (entity: EntityShape) =>
        entity.transitionBenchmarks_targetPopulationName_short ??
        entity.transitionBenchmarks_targetPopulationName.slice(0, 29)
    );
    const totalHeader = "Total by Quarter";

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

  const quarterArraySeedData = Array(12).fill("Not answered");

  // creates arrays of 'only' quarterly values
  const quarterValueArray = entities.map((entity: EntityShape) => {
    const isNotApplicableToMfp =
      entity?.transitionBenchmarks_applicableToMfpDemonstration?.[0].value ===
      "No";

    const quarterArray = Object.keys(entity)
      .filter((key) => key.includes("quarterly"))
      .map((key) => (isNotApplicableToMfp ? "N/A" : entity[key]));

    return quarterArray.length === 0 ? [...quarterArraySeedData] : quarterArray;
  });

  // list of quarters to be added to the table (left column)
  const extractQuarterLabels = () => {
    const newEntities = new Array(...entities);
    let quarterLabelArray: any = [];
    newEntities.map((entity: EntityShape) => {
      for (const key in entity) {
        // push key values into quarterArray that are quarters

        if (key.includes("quarterly")) {
          const id = key.replace("quarterlyProjections", "").split("Q");
          quarterLabelArray.push(`${id[0]} Q${id[1]}`);
        }
      }
    });
    return quarterLabelArray;
  };
  const quarterLabels = [...extractQuarterLabels()];

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
      return displaySum === "-" ? displaySum : `${commaMasking(displaySum)}*`;
    };

    const commaMaskColumTotal = columnTotal.map((item: string) =>
      commaMasking(item)
    );
    return ["Total by Pop.", ...commaMaskColumTotal, footRowTotal()];
  };

  const getRowSumDisplayValue = (row: string[], sum: string) => {
    let displayValue = sum;
    if (row.includes("Not answered") || row.includes("-")) {
      displayValue = sum === "-" ? `${sum}` : `${sum}*`;
    }
    return displayValue;
  };

  const commaMasking = (item: string) => {
    return convertToThousandsSeparatedString(item).maskedValue;
  };

  const generateMainTable = () => {
    // create new quarter value array
    let newQuarterValueArray = new Array(...quarterValueArray);
    let tableHeadersArray = new Array(...getTableHeaders());
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
      ? generateFootRow().filter(
          (arr: any) => generateFootRow().indexOf(arr) <= 6
        )
      : generateFootRow();

    const table = {
      caption: "Transition Benchmark Totals Table",
      headRow: [...headerArray],
      bodyRows: [...formatBodyRow()],
      footRow: [...updateFooterRow],
    };

    return table;
  };

  const generateOverflowTable = () => {
    // create new quarter value array
    let newQuarterValueArray = new Array(...quarterValueArray);

    let overflowQuarterValueArray = newQuarterValueArray.filter(
      (arr: string[]) => newQuarterValueArray.indexOf(arr) > 5
    );
    let tableHeadersArray = new Array(...getTableHeaders());

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
      footRow: [...formatFootRow()],
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
      <Heading as="h2" sx={sx.dashboardTitle} data-testid="headerCount">
        {verbiage.pdfDashboardTitle}
      </Heading>
      <small>{"*asterisk denotes sum of incomplete fields"}</small>
      <Box sx={overflow ? sx.overflowStyles : {}}>
        <Table sx={sx.table} content={generateMainTable()}></Table>
        {overflow && (
          <Table sx={sx.table} content={generateOverflowTable()}></Table>
        )}
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
  dashboardTitle: {
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_darkest",
  },
  table: {
    marginTop: "1.25rem",
    borderLeft: "1px solid",
    tableLayout: "fixed",
    marginBottom: "2.25rem",
    br: {
      marginBottom: "0.25rem",
    },
    tr: {
      background: "palette.gray_lightest",
    },
    thead: {
      height: "100px",
      border: "1px solid",
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
  overflowStyles: {
    "table:first-child tfoot th:last-child": {
      background: "palette.secondary_lightest",
      color: "black",
    },
    "table:first-child tbody tr td:last-child": {
      background: "white",
      fontWeight: "normal",
    },
  },
  border: {
    marginTop: "1.25rem",
  },
};
