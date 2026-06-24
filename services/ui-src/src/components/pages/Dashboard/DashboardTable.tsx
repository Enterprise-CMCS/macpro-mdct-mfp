// components
import { Button, HStack, Td, Tr, Spinner, Text } from "@chakra-ui/react";
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
  const isFinancialReport = reportType === ReportType.FINANCIAL_REPORT;
  const useFlexStartStyle =
    isAdmin && (isFinancialReport || reportType === ReportType.WP);
  const actionCellSx = {
    "& .admin-action-button": {
      width: "auto",
      minWidth: "auto",
    },
    "& .action-outline-button": {
      minWidth: "6rem",
    },
  };

  return (
    <Table content={tableBody(body.table, isAdmin)} sx={sx.table}>
      {reportsByState.map((report: ReportMetadataShape) => {
        const showEditReportButton = reportType !== ReportType.WP && !isAdmin;
        const showAdminReleaseButton = isAdmin;
        const hasAdminArchiveColumn = isAdmin && isArchivable(reportType);
        const showAdminArchiveButton =
          hasAdminArchiveColumn && !report?.associatedSar;

        return (
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
            {!isAdmin &&
              reportType === ReportType.SAR &&
              report?.populations && (
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
            <Td>{getStatus(report.status, report.archived)}</Td>
            {/* Admin: Submission count */}
            {isAdmin && (
              <Td
                data-testid="dashboard-submission-count"
                sx={sx.submissionCountCell}
              >
                {!report.submissionCount || report.submissionCount === 0
                  ? 1
                  : report.submissionCount}
              </Td>
            )}
            {/* Action Buttons */}
            <Td sx={actionCellSx}>
              <HStack
                spacing={2}
                justify={useFlexStartStyle ? "flex-start" : "center"}
                width="100%"
              >
                {showEditReportButton && (
                  <EditReportButton
                    report={report}
                    openCreateReportModal={openCreateReportModal}
                  />
                )}
                <ActionButton
                  report={report}
                  reportId={reportId}
                  isStateLevelUser={isStateLevelUser}
                  entering={entering}
                  enterSelectedReport={enterSelectedReport}
                />
                {showAdminReleaseButton && (
                  <AdminReleaseButton
                    report={report}
                    reportId={reportId}
                    releaseReport={releaseReport}
                    releasing={releasing}
                    sxOverride={sxOverride}
                  />
                )}
                {showAdminArchiveButton && (
                  <AdminArchiveButton
                    report={report}
                    archive={archive}
                    sxOverride={sxOverride}
                  />
                )}
              </HStack>
            </Td>
          </Tr>
        );
      })}
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

export const getStatus = (status: string, archived?: boolean) => {
  if (archived) {
    return `Archived`;
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
          ? { ...e, colSpan: 1 }
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
}: EditReportProps) => {
  const actionText = "Edit reporting";
  const reportLabel = report.submissionName;

  return (
    <Button
      className="edit-report-link"
      onClick={() => openCreateReportModal(report)}
      variant="link"
      sx={sx.editReporting}
      aria-label={`${actionText} of ${reportLabel}`}
    >
      {actionText}
    </Button>
  );
};

interface EditReportProps {
  report: ReportMetadataShape;
  openCreateReportModal: Function;
}

export const ActionButton = ({
  report,
  reportId,
  isStateLevelUser,
  entering,
  enterSelectedReport,
}: ActionButtonProps) => {
  const editOrView = isStateLevelUser && !report?.locked ? "Edit" : "View";

  return (
    <Button
      className="action-outline-button"
      variant="outline"
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
  const reportStatus = getStatus(report.status, report.archived);
  const isDisabled = !(reportStatus === "Submitted");

  return (
    <Button
      className="admin-action-button"
      variant="transparent"
      disabled={isDisabled}
      sx={{ ...sxOverride.adminActionButton, fontSize: "md" }}
      onClick={() => releaseReport!(report)}
    >
      {releasing && reportId === report.id ? <Spinner size="md" /> : "Unlock"}
    </Button>
  );
};

// AdminArchiveButton will call openArchiveModal from DashboardPage
const AdminArchiveButton = ({
  report,
  archive,
  sxOverride,
}: AdminArchiveButtonProps) => {
  return (
    <>
      {report?.archived ? (
        <Text
          className="admin-action-button"
          sx={{
            ...sxOverride.adminActionButton,
            ...sx.archivedText,
          }}
        >
          Archived
        </Text>
      ) : (
        <Button
          className="admin-action-button"
          variant="transparent"
          sx={{ ...sxOverride.adminActionButton, fontSize: "md" }}
          onClick={() => archive(report)}
        >
          Archive
        </Button>
      )}
    </>
  );
};

interface AdminArchiveButtonProps {
  report: ReportMetadataShape;
  archive: Function;
  sxOverride: SxObject;
}

interface AdminReleaseButtonProps {
  report: ReportMetadataShape;
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
    "td[data-testid='dashboard-submission-count']": {
      minWidth: "2rem",
      width: "2rem",
      maxWidth: "2rem",
    },
  },
  copyOverText: {
    fontSize: "xs",
    fontWeight: "300",
    color: "gray",
  },
  archivedText: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "1.75rem",
    lineHeight: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
  },
  submissionCountCell: {
    minWidth: "2rem",
    width: "2rem",
    maxWidth: "2rem",
    paddingLeft: 1,
    paddingRight: 1,
    textAlign: "center",
  },
  editReporting: {
    marginRight: 0,
    px: 0,
    py: 0,
    textDecoration: "underline",
    color: "primary",
    fontSize: "md",
    fontWeight: "300",
  },
};
