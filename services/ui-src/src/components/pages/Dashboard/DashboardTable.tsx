// components
import { Button, Image, Td, Tr, Spinner, Text } from "@chakra-ui/react";
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
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";

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
}: DashboardTableProps) => (
  <Table content={tableBody(body.table, isAdmin)} sx={sx.table}>
    {reportsByState.map((report: ReportMetadataShape) => (
      <Tr key={report.id}>
        {/* Edit Button */}
        {reportType !== ReportType.WP && (
          <EditReportButton
            report={report}
            openCreateReportModal={openCreateReportModal}
            sxOverride={sxOverride}
          />
        )}
        {/* Report Name */}
        {reportType === ReportType.WP ||
        reportType === ReportType.EXPENDITURE ? (
          <>
            <Td sx={sxOverride.wpSubmissionNameText}>
              {report.submissionName}
              {copyOverSubText(report, reportsByState)}
            </Td>
          </>
        ) : (
          <Td sx={sxOverride.sarSubmissionNameText}>{report.submissionName}</Td>
        )}
        {/* Target populations */}
        {!isAdmin && reportType === ReportType.SAR && report?.populations && (
          <Td>{prettifyChoices(report?.populations)}</Td>
        )}
        {/* Report Year */}
        {reportType === ReportType.EXPENDITURE && <Td>{report.reportYear}</Td>}
        {/* Report Period */}
        {reportType === ReportType.EXPENDITURE && (
          <Td>{report.reportPeriod}</Td>
        )}
        {/* Date Fields */}
        <DateFields report={report} reportType={reportType} isAdmin={isAdmin} />
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
        {/* Action Buttons */}
        <Td sx={sxOverride.editReportButtonCell}>
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
  if (reportType === "WP") {
    if (
      submissionCount &&
      submissionCount >= 1 &&
      !status.includes("Submitted")
    ) {
      return status;
    }
  }
  return status;
};

export const tableBody = (body: TableContentShape, isAdmin: boolean) => {
  const tableContent = { ...body };

  if (!tableContent.headRow) {
    return body;
  }

  if (isAdmin) {
    tableContent.headRow = tableContent.headRow.filter(
      (e) => !["Due date", "Target populations"].includes(e)
    );
  } else {
    tableContent.headRow = tableContent.headRow.filter((e) => e !== "#");
  }
  return tableContent;
};

const EditReportButton = ({
  report,
  openCreateReportModal,
  sxOverride,
}: EditReportProps) => {
  return (
    <Td sx={sxOverride.editReport}>
      <button onClick={() => openCreateReportModal(report)}>
        <Image
          src={editIcon}
          alt={`Edit ${report.reportYear} Period ${report.reportPeriod} report submission set-up information`}
        />
      </button>
    </Td>
  );
};

interface EditReportProps {
  report: ReportMetadataShape;
  openCreateReportModal: Function;
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

  return (
    <Button
      variant="outline"
      aria-label={`${editOrView} ${report.reportYear} Period ${report.reportPeriod} report submission set-up information`}
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
      {!!reportType && !isAdmin && reportType !== ReportType.EXPENDITURE && (
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
};
