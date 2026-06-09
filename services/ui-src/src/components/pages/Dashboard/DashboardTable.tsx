// components
import { Button, Td, Tr, Spinner, Text } from "@chakra-ui/react";
import { Table } from "components";
// types
import {
  AnyObject,
  ReportMetadataShape,
  ReportType,
  SxObject,
  TableContentShape,
} from "types";
// utils
import { convertDateUtcToEt, isArchivable, prettifyChoices } from "utils";

export const DashboardTable = ({
  reportsByState,
  reportType,
  reportId,
  body,
  openCreateReportModal,
  enterSelectedReport,
  archive,
  entering,
  releaseReport,
  releasing,
  sxOverride,
  isStateLevelUser,
  isAdmin,
}: DashboardTableProps) => {
  const isNonWorkPlan = reportType !== ReportType.WP;
  const actionCellSx = isNonWorkPlan
    ? {
        ...sxOverride.editReportButtonCell,
        width: "5rem",
        "& button": {
          width: "5rem",
        },
      }
    : sxOverride.editReportButtonCell;

  return (
    <Table content={tableBody(body.table, isAdmin)} sx={sx.table}>
      {reportsByState.map((report: ReportMetadataShape) => (
        <Tr key={report.id}>
          {/* Report Name */}
          {reportType === ReportType.WP ||
          reportType === ReportType.FINANCIAL_REPORT ? (
            <>
              <Td sx={sxOverride.wpSubmissionNameText}>
                {report.submissionName}
                {copyOverSubText(report, reportsByState)}
              </Td>
            </>
          ) : (
            <Td sx={sxOverride.sarSubmissionNameText}>
              {report.submissionName}
            </Td>
          )}
          {/* Target populations */}
          {!isAdmin && reportType === ReportType.SAR && report?.populations && (
            <Td>{prettifyChoices(report?.populations)}</Td>
          )}
          {/* Report Year */}
          {reportType === ReportType.FINANCIAL_REPORT && (
            <Td>{report.reportYear}</Td>
          )}
          {/* Report Period */}
          {reportType === ReportType.FINANCIAL_REPORT && (
            <Td>{report.reportPeriod}</Td>
          )}
          {/* Date Fields */}
          <DateFields
            report={report}
            reportType={reportType}
            isAdmin={isAdmin}
          />
          {/* Last Altered By */}
          <Td>{report?.lastAlteredBy || "-"}</Td>
          {/* Report Status */}
          <Td>
            {getStatus(
              reportType as ReportType,
              report.status,
              report.archived,
              report.submissionCount
            )}
          </Td>
          {/* Admin: Submission count */}
          {isAdmin && (
            <Td data-testid="dashboard-submission-count">
              {!report.submissionCount || report.submissionCount === 0
                ? 1
                : report.submissionCount}
            </Td>
          )}
          {/* Edit Button */}
          {isNonWorkPlan && (
            <EditReportButton
              report={report}
              openCreateReportModal={openCreateReportModal}
              isAdmin={isAdmin}
              sxOverride={sxOverride}
            />
          )}
          {/* Action Buttons */}
          <Td sx={actionCellSx}>
            <ActionButton
              report={report}
              reportId={reportId}
              isStateLevelUser={isStateLevelUser}
              entering={entering}
              enterSelectedReport={enterSelectedReport}
            />
          </Td>
          {isAdmin && (
            <>
              {
                <AdminReleaseButton
                  report={report}
                  reportType={reportType}
                  reportId={reportId}
                  releaseReport={releaseReport}
                  releasing={releasing}
                  sxOverride={sxOverride}
                />
              }
              {isArchivable(reportType) && !report?.associatedSar && (
                <AdminArchiveButton
                  report={report}
                  reportType={reportType}
                  reportId={reportId}
                  archive={archive}
                  releaseReport={releaseReport}
                  releasing={releasing}
                  sxOverride={sxOverride}
                />
              )}
            </>
          )}
        </Tr>
      ))}
    </Table>
  );
};

export const copyOverSubText = (
  report: ReportMetadataShape,
  reportsByState: ReportMetadataShape[]
) =>
  report.isCopied && (
    <Text sx={sx.copyOverText}>{`copied from ${
      reportsByState[reportsByState.indexOf(report) + 1]?.reportYear
    } - Period ${
      reportsByState[reportsByState.indexOf(report) + 1]?.reportPeriod
    }`}</Text>
  );

export interface DashboardTableProps {
  reportsByState: ReportMetadataShape[];
  body: { table: AnyObject };
  reportType: ReportType;
  reportId: string | undefined;
  openCreateReportModal: Function;
  enterSelectedReport: Function;
  archive: Function;
  entering: boolean;
  archiving?: boolean;
  isAdmin: boolean;
  isStateLevelUser: boolean;
  releaseReport?: Function | undefined;
  releasing?: boolean | undefined;
  sxOverride: SxObject;
}

export const getStatus = (
  reportType: ReportType,
  status: string,
  archived?: boolean,
  submissionCount?: number
) => {
  if (archived) {
    return `Archived`;
  }
  if (
    reportType === "WP" &&
    submissionCount &&
    submissionCount >= 1 &&
    !status.includes("Submitted")
  ) {
    return status;
  }
  return status;
};

export const tableBody = (body: TableContentShape, isAdmin: boolean) => {
  const tableContent = { ...body };

  if (!tableContent.headRow) {
    return body;
  }

  const getHeaderText = (cell: string | AnyObject): string =>
    typeof cell === "string" ? cell : cell.title;

  if (isAdmin) {
    tableContent.headRow = tableContent.headRow
      .filter(
        (e) => !["Due date", "Target populations"].includes(getHeaderText(e))
      )
      .map((e) =>
        typeof e !== "string" && e.title === "Actions"
          ? { ...e, colSpan: 4 }
          : e
      );
  } else {
    tableContent.headRow = tableContent.headRow.filter(
      (e) => getHeaderText(e) !== "#"
    );
  }
  return tableContent;
};

export const EditReportButton = ({
  report,
  openCreateReportModal,
  isAdmin,
  sxOverride,
}: EditReportProps) => {
  const actionText = isAdmin ? "View reporting" : "Edit reporting";
  const reportLabel = report.submissionName;

  return (
    <Td sx={sxOverride.editReport}>
      <Button
        onClick={() => openCreateReportModal(report)}
        variant="link"
        sx={sx.editReporting}
        aria-label={`${actionText} of ${reportLabel}`}
      >
        {actionText}
      </Button>
    </Td>
  );
};

interface EditReportProps {
  report: ReportMetadataShape;
  openCreateReportModal: Function;
  isAdmin: boolean;
  sxOverride: SxObject;
}

export const ActionButton = ({
  report,
  reportId,
  isStateLevelUser,
  entering,
  enterSelectedReport,
}: ActionButtonProps) => {
  const editOrView = isStateLevelUser && !report?.locked ? "Edit" : "View";
  const isWorkPlan = report.reportType === ReportType.WP;

  return (
    <Button
      variant="outline"
      sx={{
        width: isWorkPlan ? "auto" : "5rem",
        minWidth: isWorkPlan ? "auto" : "5rem",
      }}
      aria-label={`${editOrView} ${report.reportYear} Period ${report.reportPeriod} report`}
      onClick={() => enterSelectedReport(report)}
      data-testid="enter-report"
    >
      {entering && reportId == report.id ? <Spinner size="md" /> : editOrView}
    </Button>
  );
};

export interface ActionButtonProps {
  report: ReportMetadataShape;
  reportId: string | undefined;
  isStateLevelUser: boolean;
  entering: boolean;
  enterSelectedReport: Function;
}

const DateFields = ({ report, reportType, isAdmin }: DateFieldProps) => {
  return (
    <>
      {!!reportType &&
        !isAdmin &&
        reportType !== ReportType.FINANCIAL_REPORT && (
          <Td>{convertDateUtcToEt(report.dueDate)}</Td>
        )}
      <Td>{convertDateUtcToEt(report.lastAltered)}</Td>
    </>
  );
};

interface DateFieldProps {
  report: ReportMetadataShape;
  reportType: string;
  isAdmin: boolean;
}

const AdminReleaseButton = ({
  report,
  reportId,
  releasing,
  releaseReport,
  sxOverride,
}: AdminReleaseButtonProps) => {
  //unlock is enabled when status: approved and submitted, all other times, it is disabled
  const reportStatus = getStatus(
    report.reportType as ReportType,
    report.status,
    report.archived,
    report.submissionCount
  );
  const isDisabled = !(reportStatus === "Submitted");

  return (
    <Td>
      <Button
        variant="transparent"
        disabled={isDisabled}
        sx={sxOverride.adminActionButton}
        onClick={() => releaseReport!(report)}
      >
        {releasing && reportId === report.id ? <Spinner size="md" /> : "Unlock"}
      </Button>
    </Td>
  );
};

// AdminArchiveButton will call openArchiveModal from DashboardPage
const AdminArchiveButton = ({
  report,
  archive,
  sxOverride,
}: AdminArchiveButtonProps) => {
  return (
    <Td>
      {report?.archived ? (
        <Text sx={sx.archivedText}>Archived</Text>
      ) : (
        <Button
          variant="transparent"
          sx={sxOverride.adminActionButton}
          onClick={() => archive(report)}
          disabled={report?.archived}
        >
          Archive
        </Button>
      )}
    </Td>
  );
};

interface AdminArchiveButtonProps {
  report: ReportMetadataShape;
  reportType: string;
  reportId: string | undefined;
  archive: Function;
  releasing?: boolean;
  releaseReport?: Function;
  sxOverride: SxObject;
}

interface AdminReleaseButtonProps {
  report: ReportMetadataShape;
  reportType: string;
  reportId: string | undefined;
  releasing?: boolean;
  releaseReport?: Function;
  sxOverride: SxObject;
}

const sx = {
  table: {
    marginBottom: "spacer5",
    th: {
      padding: "0.5rem 0.5rem 0.5rem 0",
      borderBottom: "1px solid",
      borderColor: "gray_light",
      color: "gray",
      fontWeight: "bold",
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "gray_light",
    },
    td: {
      minWidth: "6rem",
      padding: "0.5rem 0.75rem",
      paddingLeft: 0,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "gray_light",
      textAlign: "left",
      "&:last-of-type": {
        paddingRight: 0,
      },
      "&:first-of-type": {
        minWidth: "2rem",
      },
    },
  },
  copyOverText: {
    fontSize: "xs",
    fontWeight: "300",
    color: "gray",
  },
  archivedText: {
    paddingLeft: 3,
  },
  editReporting: {
    textDecoration: "underline",
    color: "primary",
    fontSize: "sm",
    fontWeight: "300",
  },
};
