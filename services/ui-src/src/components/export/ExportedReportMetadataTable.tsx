// components
import { ExportedSarDetailsTable, Table } from "components";
// utils
import { ReportShape, ReportType } from "types";
import { convertDateUtcToEt, useStore } from "utils";

export const ExportedReportMetadataTable = ({
  reportType,
  verbiage,
}: Props) => {
  const { report } = useStore() ?? {};
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
  verbiage: any
): string[] => {
  switch (reportType) {
    case ReportType.WP:
      return [
        verbiage.metadataTableHeaders.submissionName,
        verbiage.metadataTableHeaders.dueDate,
        verbiage.metadataTableHeaders.lastEdited,
        verbiage.metadataTableHeaders.status,
        verbiage.metadataTableHeaders.editedBy,
      ];
    case ReportType.SAR:
      return [
        verbiage.metadataTableHeaders.submissionName,
        verbiage.metadataTableHeaders.dueDate,
        verbiage.metadataTableHeaders.lastEdited,
        verbiage.metadataTableHeaders.status,
        verbiage.metadataTableHeaders.editedBy,
      ];
    default:
      reportType as never;
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
      return [
        [
          report.submissionName,
          convertDateUtcToEt(report.dueDate),
          convertDateUtcToEt(report.lastAltered),
          report.status,
          report.lastAlteredBy,
        ],
      ];
    case ReportType.SAR:
      return [
        [
          report?.submissionName ?? "",
          convertDateUtcToEt(report.dueDate),
          convertDateUtcToEt(report.lastAltered),
          report.status,
          report.lastAlteredBy,
        ],
      ];
    default:
      reportType as never;
      throw new Error(
        `The metadata table body for report type '${reportType}' has not been implemented.`
      );
  }
};

export interface Props {
  reportType: ReportType;
  verbiage: any;
}

const sx = {
  metadataTable: {
    margin: "3rem 0",
    maxWidth: "reportPageWidth",
    tableLayout: "fixed",
    td: {
      verticalAlign: "middle",
      textAlign: "left",
      paddingTop: "0rem",
      padding: "8px",
    },
    th: {
      fontWeight: "bold",
      textAlign: "left",
      paddingBottom: "0rem",
      color: "palette.gray_medium",
    },
  },
};
