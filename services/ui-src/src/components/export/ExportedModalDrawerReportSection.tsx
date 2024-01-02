// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { Table } from "components";
// utils
import { useEffect, useState } from "react";
import { useStore, convertToThousandsSeparatedString } from "utils";
import { ModalDrawerReportPageShape, AnyObject } from "types";
import _ from "lodash";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: Props) => {
  const [overflow, setOverflow] = useState(false);
  const { report } = useStore() ?? {};
  const entities = report?.fieldData?.[entityType];

  const truncateHeader = (text: string) => {
    return _.truncate(text, { length: 30 });
  };

  // if Transition Benchmark Header title has an abbrev. just display that
  const getTableHeaders = () => {
    let headers = [];
    const quarterHeader = "Pop. by Quarter";
    const bodyHeader = entities.map(
      (entity: AnyObject) =>
        entity.transitionBenchmarks_targetPopulationName_short ??
        truncateHeader(entity.transitionBenchmarks_targetPopulationName)
    );
    const totalHeader = "Total by Quarter";

    headers.push(quarterHeader, ...bodyHeader, totalHeader);
    return headers;
  };

  // utility to convert array strings to num for calculating totals
  const convertToNum = (item: any) => {
    let num = isNaN(parseInt(item)) ? 0 : parseInt(item);
    return num;
  };

  // creates arrays of 'only' quarterly values
  const quarterValueArray = entities.map((entity: AnyObject) => {
    let quarterArray = [];

    if (
      entity?.transitionBenchmarks_applicableToMfpDemonstration?.[0].value ===
      "Yes"
    ) {
      for (const key in entity) {
        // push key values into quarterArray that are quarters
        if (key.includes("quarterly")) {
          quarterArray.push(entity[key]);
        }
      }
    } else if (
      entity?.transitionBenchmarks_applicableToMfpDemonstration?.[0].value ===
      "No"
    ) {
      for (const key in entity) {
        // push key values into quarterArray that are quarters
        if (key.includes("quarterly")) {
          quarterArray.push("N/A");
        }
      }
    }

    if (quarterArray.length === 0) {
      let seedData = [
        "Not answered",
        "Not answered",
        "Not answered",
        "Not answered",
        "Not answered",
        "Not answered",
        "Not answered",
        "Not answered",
        "Not answered",
        "Not answered",
        "Not answered",
        "Not answered",
      ];
      quarterArray.push(...seedData);
    }
    return quarterArray;
  });

  // list of quarters to be added to the table (left column)
  const extractQuarterLabels = () => {
    const newEntities = new Array(...entities);
    let quarterLabelArray: any = [];
    newEntities.map((entity: AnyObject) => {
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
      let isNACol: any = [];
      column.forEach((item: any) => {
        if (item === "N/A" || item === "Data not available") {
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
      if (columnTotal.includes("-")) {
        return `${commaMasking(
          sum.toString()
        )}<span aria-label="sum of incomplete fields">*</span>`;
      } else {
        return sum === 0 ? "-" : commaMasking(sum.toString());
      }
    };

    const commaMaskColumTotal = columnTotal.map((item: string) =>
      commaMasking(item)
    );
    return ["Total by Pop.", ...commaMaskColumTotal, footRowTotal()];
  };

  const markUnfinishedRows = (row: string[]) => {
    if (row.includes("Not answered") || row.includes("-")) {
      return (row[row.length - 1] = `${
        row[row.length - 1]
      }<span aria-label="sum of incomplete fields">*</span>`);
    }
    return;
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
      let bodyRows: any[] = [];

      const overflowBodyRows = newQuarterValueArray.filter((arr: any[]) => {
        return newQuarterValueArray.indexOf(arr) <= 5 && arr;
      });

      const valueArray = overflow ? overflowBodyRows : newQuarterValueArray;

      // get mainQuarterValueArray.length because arrays are all the same length
      for (let item = 0; item < valueArray[0].length; item++) {
        let row: string[] = [];
        // sum to be added up for each quarter row
        let sum = 0;
        row.push(quarterLabels[item]);

        // Add Not Answer if cell is empty string,
        valueArray.forEach((array: any[]) => {
          if (!array[item] && array[item] === "") {
            array[item] = "Not answered";
          }

          sum += convertToNum(array[item]);
          row.push(commaMasking(array[item]));
          return sum;
        });

        {
          overflow === false ? row.push(commaMasking(sum.toString())) : null;
        }
        {
          overflow === false ? markUnfinishedRows(row) : null;
        }
        bodyRows.push(row);
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
      for (let item = 0; item < overflowQuarterValueArray[0].length; item++) {
        let row: string[] = [];
        // sum to be added up for each quarter row
        let sum = 0;
        row.push(quarterLabels[item]);
        // Add Not Answer if cell is empty string,
        overflowQuarterValueArray.forEach((array: any[]) => {
          if (!array[item] && array[item] === "") {
            array[item] = "Not answered";
          }
          row.push(commaMasking(array[item]));
        });

        quarterValueArray.forEach((array: any[]) => {
          sum += convertToNum(array[item]);
        });

        row.push(commaMasking(sum.toString()));
        // add asteriks to unfinished row totals
        markUnfinishedRows(row);
        bodyRows.push(row);
      }
      return bodyRows;
    };

    const formatOverflowTableHeaders = () => {
      let overflowTableHeadersArray: string[] = [];
      overflowTableHeadersArray.push(tableHeadersArray[0]);
      tableHeadersArray.find((arr: any) => {
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
      <Heading as="h3" sx={sx.dashboardTitle} data-testid="headerCount">
        {verbiage.pdfDashboardTitle}
      </Heading>
      <Text sx={sx.text}>{"*asterisk denotes sum of incomplete fields"}</Text>
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
  notAnswered: {
    display: "block",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.error_darker",
    marginTop: "0.5rem",
  },
  dashboardTitle: {
    fontSize: "21px",
    lineHeight: "130%",
    fontWeight: "bold",
    color: "palette.gray_darkest",
  },
  dashboardText: {
    fontSize: "0.875rem",
  },
  // TODO: delete this
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
      borderTop: "1px solid",
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
  text: {
    fontSize: "0.875rem",
  },
};
