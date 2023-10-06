// components
import { Button, Image, Td, Tr, Spinner } from "@chakra-ui/react";
import { Table } from "components";
// utils
import {
  AnyObject,
  ReportMetadataShape,
  ReportType,
  TableContentShape,
} from "types";
import { convertDateUtcToEt } from "utils";
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";

export const DashboardTable = ({
  reportsByState,
  reportType,
  reportId,
  body,
  openAddEditReportModal,
  enterSelectedReport,
  archiveReport,
  archiving,
  entering,
  releaseReport,
  releasing,
  sxOverride,
  isAdmin,
}: DashboardTableProps) => (
  <Table content={tableBody(body.table, isAdmin)} sx={sx.table}>
    {reportsByState.map((report: ReportMetadataShape) => (
      <Tr key={report.id}>
        {/* Edit Button */}
        {!isAdmin && reportType === "SAR" && !report?.locked ? (
          <EditReportButton
            report={report}
            openAddEditReportModal={openAddEditReportModal}
            sxOverride={sxOverride}
          />
        ) : (
          <Td></Td>
        )}
        {/* Report Name */}
        <Td sx={sxOverride.submissionNameText}>{report.submissionName}</Td>
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
              : report.submissionCount}{" "}
          </Td>
        )}
        {/* Action Buttons */}
        <Td sx={sxOverride.editReportButtonCell}>
          <Button
            variant="outline"
            data-testid="enter-report"
            onClick={() => enterSelectedReport(report)}
            isDisabled={report?.archived}
          >
            {entering && reportId == report.id ? (
              <Spinner size="md" />
            ) : report.status === "Approved" ||
              report.status === "Submitted" ||
              isAdmin ? (
              "View"
            ) : (
              "Edit"
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

interface DashboardTableProps {
  reportsByState: ReportMetadataShape[];
  body: { table: AnyObject };
  reportType: string;
  reportId: string | undefined;
  openAddEditReportModal: Function;
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
      return `In revision`;
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
      (e) => e !== "Due date"
    );
  }
  return body;
};

const EditReportButton = ({
  report,
  openAddEditReportModal,
  sxOverride,
}: EditReportProps) => {
  return (
    <Td sx={sxOverride.editReport}>
      <button onClick={() => openAddEditReportModal(report)}>
        <Image src={editIcon} alt="Edit Report" />
      </button>
    </Td>
  );
};

interface EditReportProps {
  report: ReportMetadataShape;
  openAddEditReportModal: Function;
  sxOverride: AnyObject;
}

const DateFields = ({ report, reportType, isAdmin }: DateFieldProps) => {
  return (
    <>
      {reportType === "WP" && !isAdmin && (
        <Td>{convertDateUtcToEt(report.createdAt)}</Td>
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
  const isDisabled = !(
    reportStatus === "Submitted" || reportStatus === "Approved"
  );

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
        width: "2rem",
        minWidth: "2rem",
      },
    },
  },
};
