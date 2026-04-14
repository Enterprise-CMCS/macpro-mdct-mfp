// components
import { ExportedSarDetailsTable, Table } from "components";
// utils
import { ExportPageVerbiage, ReportShape, ReportType } from "types";
import { convertDateUtcToEt, useStore } from "utils";
import { assertExhaustive } from "utils/other/typing";

export const ExportedReportMetadataTable = ({
  reportType,
  verbiage,
}: Props) => {
  const { report } = useStore();
  return (
    <>
      <Table
        data-testid="exportedReportMetadataTable"
        sx={sx.metadataTable}
        content={{
          headRow: headerRowLabels(reportType, verbiage),
          bodyRows: bodyRowContent(reportType, report),
        }}
      />
      {reportType === ReportType.SAR && (
        <ExportedSarDetailsTable verbiage={verbiage} />
      )}
    </>
  );
};

export const headerRowLabels = (
  reportType: ReportType,
  { reportPage }: ExportPageVerbiage
): string[] => {
  switch (reportType) {
    case ReportType.WP:
    case ReportType.SAR:
    case ReportType.FINANCIAL_REPORT:
      return Object.values(reportPage.metadataTableHeaders);
    default:
      assertExhaustive(reportType as never);
      throw new Error(
        `The metadata table headers for report type '${reportType}' have not been implemented.`
      );
  }
};

export const bodyRowContent = (
  reportType: ReportType,
  report?: ReportShape
): string[][] => {
  if (!report) {
    return [[]];
  }
  switch (reportType) {
    case ReportType.WP:
    case ReportType.SAR:
      return [
        [
          report.submissionName || "",
          convertDateUtcToEt(report.dueDate),
          convertDateUtcToEt(report.lastAltered),
          report.status,
          report.lastAlteredBy,
        ],
      ];
    case ReportType.FINANCIAL_REPORT:
      return [
        [
          `${report.reportYear}`,
          `Q${report.reportPeriod}`,
          convertDateUtcToEt(report.lastAltered),
          report.lastAlteredBy,
          report.status,
        ],
      ];
    default:
      assertExhaustive(reportType as never);
      throw new Error(
        `The metadata table body for report type '${reportType}' has not been implemented.`
      );
  }
};

export interface Props {
  reportType: ReportType;
  verbiage: ExportPageVerbiage;
}

const sx = {
  metadataTable: {
    marginBottom: "spacer4",
    marginTop: "spacer3",
    maxWidth: "reportPageWidth",
    tableLayout: "fixed",
    td: {
      border: 0,
      padding: "spacerhalf",
      paddingLeft: 0,
      textAlign: "left",
      verticalAlign: "top",
    },
    th: {
      border: 0,
      color: "gray",
      fontWeight: "bold",
      padding: 0,
      paddingRight: "spacer1",
      textAlign: "left",
      verticalAlign: "top",
    },
  },
};
