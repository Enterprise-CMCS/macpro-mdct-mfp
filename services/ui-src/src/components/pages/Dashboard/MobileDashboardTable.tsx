// components
import { Box, Button, Flex, Image, Text, Spinner } from "@chakra-ui/react";
// types
import { ReportMetadataShape, ReportType, SxObject } from "types";
// utils
import { convertDateUtcToEt, isArchivable, prettifyChoices } from "utils";
// assets
import editIcon from "assets/icons/icon_edit_square_gray.png";
import { getStatus, copyOverSubText } from "./DashboardTable";

export const MobileDashboardTable = ({
  reportsByState,
  reportId,
  reportType,
  openCreateReportModal,
  enterSelectedReport,
  archive,
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
            {reportType !== ReportType.WP && (
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
        {!isAdmin && reportType === ReportType.SAR && report?.populations && (
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>Target populations</Text>
            <Text>{prettifyChoices(report?.populations)}</Text>
          </Box>
        )}
        {/* Report Year */}
        {reportType === ReportType.EXPENDITURE && (
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>Report Year</Text>
            <Text>{report.reportYear}</Text>
          </Box>
        )}
        {/* Report Period */}
        {reportType === ReportType.EXPENDITURE && (
          <Box sx={sx.labelGroup}>
            <Text sx={sx.label}>Report Period</Text>
            <Text>{report.reportPeriod}</Text>
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
                <AdminReleaseButton
                  report={report}
                  reportType={reportType}
                  reportId={reportId}
                  releaseReport={releaseReport}
                  releasing={releasing}
                  sxOverride={sxOverride}
                />
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
          </Box>
        </Flex>
      </Box>
    ))}
  </>
);

interface MobileDashboardTableProps {
  reportsByState: ReportMetadataShape[];
  reportId: string | undefined;
  reportType: ReportType;
  openCreateReportModal: Function;
  enterSelectedReport: Function;
  archive: Function;
  archiving?: boolean;
  entering?: boolean;
  releaseReport?: Function | undefined;
  releasing?: boolean | undefined;
  isAdmin: boolean;
  isStateLevelUser: boolean;
  sxOverride: SxObject;
}

const DateFields = ({ report, reportType, isAdmin }: DateFieldProps) => {
  return (
    <>
      {!!reportType && !isAdmin && reportType !== ReportType.EXPENDITURE && (
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
    <Button
      variant="transparent"
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
  archive,
  sxOverride,
}: AdminArchiveButtonProps) => {
  return (
    <>
      {report?.archived ? (
        <Text data-testid="archived" sx={sx.archivedText}>
          Archived
        </Text>
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
    </>
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
  mobileTable: {
    padding: "1rem 0",
    borderBottom: "1px solid",
    borderColor: "gray_light",
  },
  labelGroup: {
    marginBottom: "spacer1",
  },
  label: {
    fontSize: "sm",
    fontWeight: "bold",
    color: "gray",
  },
  editDate: {
    marginRight: "spacer6",
  },
  archivedText: {
    fontSize: "sm",
    paddingLeft: 2,
    display: "flex",
    alignItems: "center",
  },
};
