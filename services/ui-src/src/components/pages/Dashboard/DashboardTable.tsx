// components
import { Button, Image, Td, Tr, Spinner, Text } from "@chakra-ui/react";
import { Table } from "components";
// utils
import {
  AnyObject,
  ReportMetadataShape,
  ReportType,
  TableContentShape,
} from "types";
import { convertDateUtcToEt, prettifyChoices } from "utils";
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";

export const DashboardTable = ({
  reportsByState,
  reportType,
  reportId,
  body,
  openCreateReportModal,
  enterSelectedReport,
  archiveReport,
  archiving,
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
        {reportType === ReportType.SAR && (
          <EditReportButton
            report={report}
            openCreateReportModal={openCreateReportModal}
            sxOverride={sxOverride}
          />
        )}
        {/* Report Name */}
        {reportType === ReportType.WP ? (
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
          <Td>
            {!report.submissionCount || report.submissionCount === 0
              ? 1
              : report.submissionCount}
          </Td>
        )}
        {/* Action Buttons */}
        <Td sx={sxOverride.editReportButtonCell}>
          <Button
            variant="outline"
            onClick={() => enterSelectedReport(report)}
            isDisabled={report?.archived}
          >
            {entering && reportId == report.id ? (
              <Spinner size="md" />
            ) : isStateLevelUser && !report?.locked ? (
              "Edit"
            ) : (
              "View"
            )}
          </Button>
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
            <AdminArchiveButton
              report={report}
              reportType={reportType}
              reportId={reportId}
              archiveReport={archiveReport}
              archiving={archiving}
              releaseReport={releaseReport}
              releasing={releasing}
              sxOverride={sxOverride}
            />
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

interface DashboardTableProps {
  reportsByState: ReportMetadataShape[];
  body: { table: AnyObject };
  reportType: string;
  reportId: string | undefined;
  openCreateReportModal: Function;
  enterSelectedReport: Function;
  archiveReport?: Function;
  archiving?: boolean;
  entering?: boolean;
  isAdmin: boolean;
  isStateLevelUser: boolean;
  releaseReport?: Function | undefined;
  releasing?: boolean | undefined;
  sxOverride: AnyObject;
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
const tableBody = (body: TableContentShape, isAdmin: boolean) => {
  var tableContent = body;
  if (!isAdmin) {
    tableContent.headRow = tableContent.headRow!.filter((e) => e !== "#");
    return tableContent;
  } else {
    tableContent.headRow = tableContent.headRow!.filter(
      (e) => e !== "Due date" && e !== "Target populations"
    );
  }
  return body;
};

const EditReportButton = ({
  report,
  openCreateReportModal,
  sxOverride,
}: EditReportProps) => {
  return (
    <Td sx={sxOverride.editReport}>
      <button onClick={() => openCreateReportModal(report)}>
        <Image src={editIcon} alt="Edit Report" />
      </button>
    </Td>
  );
};

interface EditReportProps {
  report: ReportMetadataShape;
  openCreateReportModal: Function;
  sxOverride: AnyObject;
}

const DateFields = ({ report, reportType, isAdmin }: DateFieldProps) => {
  return (
    <>
      {reportType === "WP" && !isAdmin && (
        <Td>{convertDateUtcToEt(report.dueDate)}</Td>
      )}
      {reportType === "SAR" && !isAdmin && (
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
}: AdminActionButtonProps) => {
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
        variant="link"
        disabled={isDisabled}
        sx={sxOverride.adminActionButton}
        onClick={() => releaseReport!(report)}
      >
        {releasing && reportId === report.id ? <Spinner size="md" /> : "Unlock"}
      </Button>
    </Td>
  );
};

const AdminArchiveButton = ({
  report,
  reportId,
  archiveReport,
  archiving,
  sxOverride,
}: AdminActionButtonProps) => {
  return (
    <Td>
      <Button
        variant="link"
        sx={sxOverride.adminActionButton}
        onClick={() => archiveReport!(report)}
      >
        {archiving && reportId === report.id ? (
          <Spinner size="md" />
        ) : report?.archived ? (
          "Unarchive"
        ) : (
          "Archive"
        )}
      </Button>
    </Td>
  );
};

interface AdminActionButtonProps {
  report: ReportMetadataShape;
  reportType: string;
  reportId: string | undefined;
  archiveReport?: Function;
  archiving?: boolean;
  releasing?: boolean;
  releaseReport?: Function;
  sxOverride: AnyObject;
}

const sx = {
  table: {
    marginBottom: "2.5rem",
    th: {
      padding: "0.5rem 0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      color: "palette.gray_medium",
      fontWeight: "bold",
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
    },
    td: {
      minWidth: "6rem",
      padding: "0.5rem 0.75rem",
      paddingLeft: 0,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
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
    color: "palette.gray_medium",
  },
};
