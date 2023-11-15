/* eslint-disable multiline-comment-style */
import { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { States } from "../../../constants";

// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddEditReportModal,
  Modal,
  DashboardTable,
  InstructionsAccordion,
  ErrorAlert,
  MobileDashboardTable,
  PageTemplate,
  ReportContext,
  Alert,
} from "components";
// types
import {
  AnyObject,
  ReportMetadataShape,
  ReportKeys,
  ReportShape,
  ReportType,
  ReportStatus,
  AlertTypes,
} from "types";
// utils
import { parseCustomHtml, useBreakpoint, useStore } from "utils";
// verbiage
import wpVerbiage from "verbiage/pages/wp/wp-dashboard";
import sarVerbiage from "verbiage/pages/sar/sar-dashboard";
import accordion from "verbiage/pages/accordion";
// assets
import arrowLeftIcon from "assets/icons/icon_arrow_left_blue.png";
import alertIcon from "assets/icons/icon_alert_circle.png";

export const DashboardPage = ({ reportType }: Props) => {
  const {
    errorMessage,
    fetchReportsByState,
    fetchReportForSarCreation,
    clearReportSelection,
    setReportSelection,
    archiveReport,
    releaseReport,
    fetchReport,
  } = useContext(ReportContext);
  const { reportsByState, workPlanToCopyFrom, clearSelectedEntity } =
    useStore();
  const navigate = useNavigate();
  const {
    state: userState,
    userIsEndUser,
    userIsAdmin,
  } = useStore().user ?? {};
  const { isTablet, isMobile } = useBreakpoint();
  const [reportsToDisplay, setReportsToDisplay] = useState<
    ReportMetadataShape[] | undefined
  >(undefined);

  const [reportId, setReportId] = useState<string | undefined>(undefined);
  const [archiving, setArchiving] = useState<boolean>(false);
  const [entering, setEntering] = useState<boolean>(false);
  const [releasing, setReleasing] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<AnyObject | undefined>(
    undefined
  );

  const dashboardVerbiageMap: any = {
    WP: wpVerbiage,
    SAR: sarVerbiage,
  };

  const dashboardVerbiage = dashboardVerbiageMap[reportType]!;
  const { intro, body } = dashboardVerbiage;

  // get Work Plan status
  const workPlanStatus = workPlanToCopyFrom?.status;

  // get active state
  const adminSelectedState = localStorage.getItem("selectedState") || undefined;
  const activeState = userState || adminSelectedState;

  useEffect(() => {
    // if no activeState, go to homepage
    if (!activeState) {
      navigate("/");
    }
    if (reportType == ReportType.WP) {
      fetchReportsByState(reportType, activeState);
      clearReportSelection();
    } else {
      fetchReportForSarCreation(activeState);
      clearReportSelection();
    }
  }, []);

  useEffect(() => {
    let newReportsToDisplay = reportsByState;
    if (!userIsAdmin) {
      newReportsToDisplay = reportsByState?.filter(
        (report: ReportMetadataShape) => !report?.archived
      );
    }
    setReportsToDisplay(newReportsToDisplay);
  }, [reportsByState]);

  const enterSelectedReport = async (report: ReportMetadataShape) => {
    clearSelectedEntity();
    setReportId(report.id);
    setEntering(true);
    const reportKeys: ReportKeys = {
      reportType: report.reportType,
      state: report.state,
      id: report.id,
    };
    const selectedReport: ReportShape = await fetchReport(reportKeys);
    // set active report to selected report
    setReportSelection(selectedReport);
    setReportId(undefined);
    setEntering(false);
    const firstReportPagePath = selectedReport.formTemplate.flatRoutes![0].path;
    navigate(firstReportPagePath);
  };

  const openAddEditReportModal = (report?: ReportShape) => {
    let formData = undefined;
    //
    if (report && reportType == ReportType.SAR) {
      // We are editing a SAR submission
      formData = {
        formData: {
          associatedWorkPlan: report.submissionName,
          stateOrTerritory: report.state,
          reportPeriod: report.reportPeriod,
          finalSar: report.finalSar,
        },
        state: report.state,
        id: report.id,
        submittedBy: report.submittedBy,
        submitterEmail: report.submitterEmail,
        submittedOnDate: report?.submittedOnDate,
      };
    } else if (reportType == ReportType.SAR) {
      // We are creating a new SAR submission
      formData = {
        formData: {
          associatedWorkPlan: workPlanToCopyFrom?.submissionName,
          stateOrTerritory: userState,
          reportPeriod: workPlanToCopyFrom?.reportPeriod,
        },
      };
    }

    setSelectedReport(formData);

    // use disclosure to open modal
    addEditReportModalOnOpenHandler();
  };

  const toggleReportArchiveStatus = async (report: ReportShape) => {
    if (userIsAdmin) {
      setReportId(report.id);
      setArchiving(true);
      const reportKeys = {
        reportType: reportType,
        state: adminSelectedState,
        id: report.id,
      };
      await archiveReport(reportKeys);
      await fetchReportsByState(reportType, activeState);
      setReportId(undefined);
      setArchiving(false);
    }
  };

  const toggleReportLockStatus = async (report: ReportShape) => {
    if (userIsAdmin) {
      setReportId(report.id);
      setReleasing(true);
      const reportKeys = {
        reportType: reportType,
        state: adminSelectedState,
        id: report.id,
      };
      await releaseReport!(reportKeys);
      await fetchReportsByState(reportType, activeState);
      setReportId(undefined);
      setReleasing(false);

      // useDisclosure to open modal
      confirmUnlockModalOnOpenHandler();
    }
  };

  const isAddSubmissionDisabled = (): boolean => {
    const lastDisplayedReport =
      reportsToDisplay?.[reportsToDisplay?.length - 1];
    switch (reportType) {
      case ReportType.SAR:
        return !workPlanToCopyFrom;
      case ReportType.WP:
        if (!lastDisplayedReport) return false;
        return lastDisplayedReport.status !== ReportStatus.SUBMITTED;
      default:
        return true;
    }
  };

  // add/edit program modal disclosure
  const {
    isOpen: addEditReportModalIsOpen,
    onOpen: addEditReportModalOnOpenHandler,
    onClose: addEditReportModalOnCloseHandler,
  } = useDisclosure();

  //unlock modal disclosure
  const {
    isOpen: confirmUnlockModalIsOpen,
    onOpen: confirmUnlockModalOnOpenHandler,
    onClose: confirmUnlockModalOnCloseHandler,
  } = useDisclosure();

  const fullStateName = States[activeState as keyof typeof States];

  return (
    <PageTemplate type="report" sx={sx.layout}>
      <Link as={RouterLink} to="/" sx={sx.returnLink}>
        <Image src={arrowLeftIcon} alt="Arrow left" className="returnIcon" />
        Return home
      </Link>
      {errorMessage && <ErrorAlert error={errorMessage} />}
      {/* Only show SAR alert banner if the corresponding Work Plan is not approved */}
      <Box sx={sx.leadTextBox}>
        {reportType === ReportType.SAR &&
          workPlanStatus !== ReportStatus.APPROVED && (
            <Alert
              title={sarVerbiage.alertBanner.title}
              showIcon={true}
              icon={alertIcon}
              status={AlertTypes.ERROR}
              description={sarVerbiage.alertBanner.body}
              sx={sx.alertBanner}
            />
          )}
        <Heading as="h1" sx={sx.headerText}>
          {fullStateName} {intro.header}
        </Heading>
        <InstructionsAccordion
          verbiage={
            userIsAdmin
              ? accordion[reportType as keyof typeof ReportType].adminDashboard
              : accordion[reportType as keyof typeof ReportType]
                  .stateUserDashboard
          }
          defaultIndex={0} // sets the accordion to open by default
        />
        {parseCustomHtml(intro.body)}
      </Box>
      <Box sx={sx.bodyBox}>
        {reportsToDisplay ? (
          isTablet || isMobile ? (
            <MobileDashboardTable
              reportsByState={reportsToDisplay}
              reportType={reportType}
              reportId={reportId}
              openAddEditReportModal={openAddEditReportModal}
              enterSelectedReport={enterSelectedReport}
              archiveReport={toggleReportArchiveStatus}
              archiving={archiving}
              entering={entering}
              releaseReport={toggleReportLockStatus}
              releasing={releasing}
              isStateLevelUser={userIsEndUser!}
              isAdmin={userIsAdmin!}
              sxOverride={sxChildStyles}
            />
          ) : (
            <DashboardTable
              reportsByState={reportsToDisplay}
              reportType={reportType}
              reportId={reportId}
              body={body}
              openAddEditReportModal={openAddEditReportModal}
              enterSelectedReport={enterSelectedReport}
              archiveReport={toggleReportArchiveStatus}
              archiving={archiving}
              entering={entering}
              releaseReport={toggleReportLockStatus}
              releasing={releasing}
              isStateLevelUser={userIsEndUser!}
              isAdmin={userIsAdmin!}
              sxOverride={sxChildStyles}
            />
          )
        ) : (
          !errorMessage && (
            <Flex sx={sx.spinnerContainer}>
              <Spinner size="md" />
            </Flex>
          )
        )}
        {!reportsToDisplay?.length && (
          <Text sx={sx.emptyTableContainer}>{body.empty}</Text>
        )}
        {/* only show add report button to state users */}
        {userState && (
          <Box sx={sx.callToActionContainer}>
            <Button
              type="submit"
              disabled={isAddSubmissionDisabled()}
              onClick={() => openAddEditReportModal()}
            >
              {!reportsToDisplay?.length || reportType === ReportType.SAR
                ? body.callToAction
                : body.callToActionAdditions}
            </Button>
          </Box>
        )}
      </Box>
      <AddEditReportModal
        activeState={activeState!}
        selectedReport={selectedReport!}
        reportType={reportType}
        modalDisclosure={{
          isOpen: addEditReportModalIsOpen,
          onClose: addEditReportModalOnCloseHandler,
        }}
      />
      <Modal
        modalDisclosure={{
          isOpen: confirmUnlockModalIsOpen,
          onClose: confirmUnlockModalOnCloseHandler,
        }}
        onConfirmHandler={confirmUnlockModalOnCloseHandler}
        content={wpVerbiage.modalUnlock}
      />
    </PageTemplate>
  );
};

interface Props {
  reportType: string;
}

const sx = {
  layout: {
    ".contentFlex": {
      maxWidth: "appMax",
      marginTop: "1rem",
      marginBottom: "3.5rem",
    },
  },
  returnLink: {
    display: "flex",
    width: "8.5rem",
    paddingTop: "0.5rem",
    svg: {
      height: "1.375rem",
      width: "1.375rem",
      marginTop: "-0.125rem",
      marginRight: ".5rem",
    },
    textDecoration: "none",
    _hover: {
      textDecoration: "underline",
    },
    ".returnIcon": {
      width: "1.25rem",
      height: "1.25rem",
      marginTop: "0.25rem",
      marginRight: "0.5rem",
    },
  },
  leadTextBox: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "2.5rem auto 0rem",
    ".tablet &, .mobile &": {
      margin: "2.5rem 0 1rem",
    },
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
    ".tablet &, .mobile &": {
      fontSize: "xl",
      lineHeight: "1.75rem",
      fontWeight: "bold",
    },
  },
  bodyBox: {
    maxWidth: "55.25rem",
    margin: "0 auto",
    ".desktop &": {
      width: "100%",
    },
    ".tablet &, .mobile &": {
      margin: "0",
    },
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
  emptyTableContainer: {
    maxWidth: "75%",
    margin: "0 auto",
    textAlign: "center",
  },
  callToActionContainer: {
    marginTop: "2.5rem",
    textAlign: "center",
  },
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: "10",
  },
  alertBanner: {
    marginBottom: "2rem",
    borderInlineStartWidth: "7.5px",
    bgColor: "palette.error_lightest",
    fontSize: "18px",
    p: {
      fontSize: "16px",
    },
  },
};

const sxChildStyles = {
  editReportButtonCell: {
    width: "6.875rem",
    padding: 0,
    button: {
      width: "6.875rem",
      height: "1.75rem",
      borderRadius: "0.25rem",
      textAlign: "center",
      fontSize: "sm",
      fontWeight: "normal",
      color: "palette.primary",
    },
  },
  editReport: {
    padding: "0",
    width: "2.5rem",
    ".tablet &, .mobile &": {
      width: "2rem",
    },
    img: {
      height: "1.5rem",
      minWidth: "21px",
      marginLeft: "0.5rem",
      ".tablet &, .mobile &": {
        marginLeft: 0,
      },
    },
  },
  sarSubmissionNameText: {
    fontSize: "md",
    fontWeight: "bold",
    width: "10rem",
    ".tablet &, .mobile &": {
      width: "100%",
    },
    lineHeight: "1.25rem",
  },
  wpSubmissionNameText: {
    fontSize: "md",
    fontWeight: "bold",
    width: "13rem",
    ".tablet &, .mobile &": {
      width: "100%",
    },
    lineHeight: "1.25rem",
  },
  adminActionCell: {
    width: "2.5rem",
    ".tablet &, .mobile &": {
      display: "flex",
    },
  },
  adminActionButton: {
    minWidth: "4.5rem",
    fontSize: "sm",
    fontWeight: "normal",
  },
};
