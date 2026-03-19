// components
import { Table } from "components";
// types
import { Choice, ReportShape } from "types";
// utils
import { useStore } from "utils";
// assets
import { sxSharedExportStyles } from "components/pages/Export/ExportedReportPage";

export const ExportedSarDetailsTable = ({ verbiage }: Props) => {
  const { report } = useStore() ?? {};
  return (
    <Table
      data-testid="exportedSarDetailsTable"
      sx={sx.table}
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
  table: {
    ...sxSharedExportStyles.table,
    "td:nth-of-type(1)": {
      fontWeight: "bold",
    },
  },
};
