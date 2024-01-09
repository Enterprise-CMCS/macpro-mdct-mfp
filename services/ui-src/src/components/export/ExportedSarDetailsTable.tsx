// components
import { Table } from "components";
// types
import { Choice, ReportShape } from "types";
// utils
import { useStore } from "utils";

export const ExportedSarDetailsTable = ({ verbiage }: Props) => {
  const { report } = useStore() ?? {};
  return (
    <Table
      data-testid="exportedSarDetailsTable"
      sx={sx.sarDetailsTable}
      content={{
        headRow: [
          verbiage.sarDetailsTable.headers.indicator,
          verbiage.sarDetailsTable.headers.response,
        ],
        bodyRows: bodyRowContent(verbiage.sarDetailsTable, report),
      }}
    />
  );
};

const targetPopulations = (populations?: Choice[]): string => {
  const selectedPopulations = populations?.map((population) => {
    return " " + population["value"];
  });
  return selectedPopulations?.toString() ?? "";
};

const bodyRowContent = (verbiage: any, report?: ReportShape): string[][] => {
  // TODO: add responses for first two (2) rows
  return [
    [verbiage.indicators[0]],
    [verbiage.indicators[1]],
    [verbiage.indicators[2], targetPopulations(report?.populations!)],
  ];
};

export interface Props {
  verbiage: any;
}

const sx = {
  sarDetailsTable: {
    margin: "3rem 0",
    maxWidth: "reportPageWidth",
    td: {
      verticalAlign: "middle",
      textAlign: "left",
      padding: "8px",
    },
    "td:nth-of-type(1)": {
      fontWeight: "bold",
    },
    th: {
      fontWeight: "bold",
      textAlign: "left",
      paddingBottom: "0rem",
    },
  },
};
