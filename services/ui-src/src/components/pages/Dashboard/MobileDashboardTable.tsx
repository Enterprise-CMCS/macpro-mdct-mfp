// components
import { Box, Button, Flex, Image, Text, Spinner } from "@chakra-ui/react";
// utils
import { AnyObject, ReportMetadataShape, ReportType } from "types";
import { convertDateUtcToEt, prettifyChoices } from "utils";
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";
import { getStatus, copyOverSubText } from "./DashboardTable";

export const MobileDashboardTable = ({
  reportsByState,
  reportId,
  reportType,
  openCreateReportModal,
  enterSelectedReport,
  archiveReport,
  archiving,
  entering,
  releaseReport,
  releasing,
  isStateLevelUser,
  isAdmin,
  sxOverride,
}: MobileDashboardTableProps) => (
  <>
    {reportsByState.map((report: ReportMetadataShape) => (
      <Box data-testid="mobile-row" sx={sx.mobileTable} key={report.id}>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>{"Submission name"}</Text>
          <Flex alignContent="flex-start">
            {reportType === "SAR" && (
              <Box sx={sxOverride.editReport}>
                <button onClick={() => openCreateReportModal(report)}>
                  <Image src={editIcon} alt="Edit Report" />
                </button>
              </Box>
            )}
            <Text sx={sxOverride.submissionNameText}>
              {report.submissionName}
            </Text>
            {copyOverSubText(report, reportsByState)}
          </Flex>
        </Box>
        {!isAdmin && reportType === "SAR" && report?.populations && (
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>Target populations</Text>
            <Text>{prettifyChoices(report?.populations)}</Text>
          </Box>
        )}
        <Box sx={sx.labelGroup}>
          <Flex alignContent="flex-start">
            <DateFields
              report={report}
              reportType={reportType}
              isAdmin={isAdmin}
            />
          </Flex>
        </Box>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>Edited by</Text>
          <Text>{report?.lastAlteredBy || "-"}</Text>
        </Box>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>Status</Text>
          <Text>
            {getStatus(
              reportType as ReportType,
              report.status,
              report.archived,
              report.submissionCount
            )}
          </Text>
        </Box>
        {/* Admin: Submission count */}
        {isAdmin && (
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>#</Text>
            <Text sx={sx.label}>
              {!report.submissionCount || report.submissionCount === 0
                ? 1
                : report.submissionCount}{" "}
            </Text>
          </Box>
        )}
        <Flex alignContent="flex-start" gap={2}>
          <Box sx={sxOverride.editReportButtonCell}>
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
          </Box>
          <Box sx={sxOverride.adminActionCell}>
            {isAdmin && (
              <>
                {reportType === "WP" && (
                  <AdminReleaseButton
                    report={report}
                    reportId={reportId}
                    releaseReport={releaseReport}
                    releasing={releasing}
                    sxOverride={sxOverride}
                  />
                )}
                <AdminArchiveButton
                  report={report}
                  reportId={reportId}
                  archiveReport={archiveReport}
                  archiving={archiving}
                  sxOverride={sxOverride}
                />
              </>
            )}
          </Box>
        </Flex>
      </Box>
    ))}
  </>
);

interface MobileDashboardTableProps {
  reportsByState: ReportMetadataShape[];
  reportId: string | undefined;
  reportType: string;
  openCreateReportModal: Function;
  enterSelectedReport: Function;
  archiveReport?: Function;
  archiving?: boolean;
  entering?: boolean;
  releaseReport?: Function | undefined;
  releasing?: boolean | undefined;
  isAdmin: boolean;
  isStateLevelUser: boolean;
  sxOverride: AnyObject;
}

const DateFields = ({ report, reportType, isAdmin }: DateFieldProps) => {
  return (
    <>
      {reportType === "WP" && !isAdmin && (
        <Box sx={sx.editDate}>
          <Text sx={sx.label}>Due date</Text>
          <Text>{convertDateUtcToEt(report.createdAt)}</Text>
        </Box>
      )}
      {reportType === "SAR" && !isAdmin && (
        <Box sx={sx.editDate}>
          <Text sx={sx.label}>Due date</Text>
          <Text>{convertDateUtcToEt(report.dueDate)}</Text>
        </Box>
      )}
      <Box>
        <Text sx={sx.label}>Last edited</Text>
        <Text>{convertDateUtcToEt(report.lastAltered)}</Text>
      </Box>
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
    <Button
      variant="link"
      disabled={isDisabled}
      sx={sxOverride.adminActionButton}
      onClick={() => releaseReport!(report)}
    >
      {releasing && reportId === report.id ? <Spinner size="md" /> : "Unlock"}
    </Button>
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
  );
};

interface AdminActionButtonProps {
  report: ReportMetadataShape;
  reportId: string | undefined;
  archiveReport?: Function;
  archiving?: boolean;
  releasing?: boolean;
  releaseReport?: Function;
  sxOverride: AnyObject;
}

const sx = {
  mobileTable: {
    padding: "1rem 0",
    borderBottom: "1px solid",
    borderColor: "palette.gray_light",
  },
  labelGroup: {
    marginBottom: "0.5rem",
  },
  label: {
    fontSize: "sm",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  editDate: {
    marginRight: "3rem",
  },
};
