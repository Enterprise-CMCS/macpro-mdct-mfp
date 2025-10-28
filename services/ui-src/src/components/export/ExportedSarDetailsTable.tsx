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
  const associatedWp = `${report?.fieldData.stateName} Work Plan ${report?.reportYear} - Period ${report?.reportPeriod}`;
  return [
    [verbiage.indicators[0], associatedWp],
    [verbiage.indicators[1], report?.finalSar?.[0].value],
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
    tableLayout: "fixed",
    td: {
      verticalAlign: "middle",
      textAlign: "left",
      padding: "spacer1",
    },
    "td:nth-of-type(1)": {
      fontWeight: "bold",
      color: "base",
    },
    th: {
      fontWeight: "bold",
      textAlign: "left",
      color: "gray",
    },
  },
};
