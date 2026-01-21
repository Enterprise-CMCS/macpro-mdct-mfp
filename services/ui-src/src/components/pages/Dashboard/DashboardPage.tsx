import { useContext, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router";
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
  CreateWorkPlanModal,
  CreateSarModal,
  Modal,
  InstructionsAccordion,
  ErrorAlert,
  PageTemplate,
  ReportContext,
  Alert,
  DashboardFilter,
  handleExpenditureFilter,
} from "components";
import { ArchiveReportModal } from "components/modals/ArchiveReportModal";
import { ResponsiveDashboardTable } from "./ResponsiveDashboardTable";
import { ModalBundle } from "./Expenditure/ExpenditureDashboardPage";
// constants
import { States } from "../../../constants";
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
import {
  convertTargetPopulationsFromWPToSAREntity,
  parseCustomHtml,
  getApplicablePopulations,
  useStore,
  getReportVerbiage,
  isArchivable,
} from "utils";
// verbiage
import accordion from "verbiage/pages/accordion";
// assets
import arrowLeftIcon from "assets/icons/icon_arrow_left_blue.png";
import alertIcon from "assets/icons/icon_alert_circle.png";

export const DashboardPage = ({ reportType, showFilter, modal }: Props) => {
  const {
    errorMessage,
    fetchReportsByState,
    fetchReportForSarCreation,
    clearReportSelection,
    setReportSelection,
    releaseReport,
    fetchReport,
    archiveReport,
  } = useContext(ReportContext);
  const {
    reportsByState,
    workPlanToCopyFrom,
    clearSelectedEntity,
    setEditable,
  } = useStore();
  const navigate = useNavigate();
  const {
    state: userState,
    userIsEndUser,
    userIsReadOnly,
    userIsAdmin,
  } = useStore().user ?? {};
  const [reportsToDisplay, setReportsToDisplay] = useState<
    ReportMetadataShape[] | undefined
  >(undefined);
  const [previousReport, setPreviousReport] = useState<
    ReportMetadataShape | undefined
  >(undefined);

  const [searchParams] = useSearchParams();
  const filterYear = searchParams.get("year") || "All";
  const filterQuarter = searchParams.get("quarter") || "All";

  const [reportId, setReportId] = useState<string | undefined>(undefined);
  const [entering, setEntering] = useState<boolean>(false);
  const [releasing, setReleasing] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<AnyObject | undefined>(
    undefined
  );

  const { dashboardVerbiage } = getReportVerbiage(reportType);
  const { intro, body } = dashboardVerbiage;

  // if an admin or a read-only user has selected a state, retrieve it from local storage
  const adminSelectedState = localStorage.getItem("selectedState") || undefined;

  // if a user is an admin or a read-only type, use the selected state, otherwise use their assigned state
  const activeState =
    userIsAdmin || userIsReadOnly ? adminSelectedState : userState;

  const showSarAlert = useMemo(() => {
    if (reportType !== ReportType.SAR) return false;
    const activeSarList = reportsToDisplay?.filter(
      (report: ReportMetadataShape) => {
        return (
          report.reportType === ReportType.SAR &&
          report.status !== ReportStatus.SUBMITTED &&
          report?.archived !== true
        );
      }
    );
    return !workPlanToCopyFrom && activeSarList?.length === 0;
  }, [reportsToDisplay, workPlanToCopyFrom]);

  useEffect(() => {
    // if no activeState, go to homepage
    if (!activeState) {
      navigate("/");
    }
    switch (reportType) {
      case ReportType.WP:
      case ReportType.EXPENDITURE:
        fetchReportsByState(reportType, activeState);
        clearReportSelection();
        break;
      case ReportType.SAR:
        fetchReportForSarCreation(activeState);
        clearReportSelection();
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    let newReportsToDisplay = reportsByState;
    // sort by creation date (newest to oldest)
    newReportsToDisplay?.reverse();
    if (!userIsAdmin) {
      newReportsToDisplay = reportsByState?.filter(
        (report: ReportMetadataShape) => !report?.archived
      );
    }
    if (showFilter) {
      const filteredReports = handleExpenditureFilter(
        filterYear,
        filterQuarter,
        newReportsToDisplay
      );
      setReportsToDisplay(filteredReports);
      setPreviousReport(filteredReports?.[0]);
    } else {
      setReportsToDisplay(newReportsToDisplay);
      //grab the last report added, which is now the first report displayed
      setPreviousReport(newReportsToDisplay?.[0]);
    }
  }, [reportsByState, searchParams]);

  const isReportEditable = (selectedReport: ReportShape) => {
    //the wp is only editable only when the user is a state user and the form has not been submitted or approved, all over users are in view mode
    return (
      !userIsAdmin &&
      !userIsReadOnly &&
      !selectedReport?.locked &&
      selectedReport?.status !== ReportStatus.APPROVED &&
      selectedReport?.status !== ReportStatus.SUBMITTED
    );
  };

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
    const firstReportPagePath =
      selectedReport?.formTemplate.flatRoutes![0].path;
    setEditable(isReportEditable(selectedReport));
    navigate(firstReportPagePath);
  };
  const openCreateReportModal = (report?: ReportShape) => {
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
          populations: report.populations,
        },
        state: report.state,
        id: report.id,
        submittedBy: report.submittedBy,
        submitterEmail: report.submitterEmail,
        submittedOnDate: report?.submittedOnDate,
        status: report.status,
      };
    } else if (reportType == ReportType.SAR) {
      // We are creating a new SAR submission
      formData = {
        formData: {
          associatedWorkPlan: workPlanToCopyFrom?.submissionName,
          stateOrTerritory: userState,
          reportPeriod: workPlanToCopyFrom?.reportPeriod,
          populations: convertTargetPopulationsFromWPToSAREntity(
            getApplicablePopulations(
              workPlanToCopyFrom?.fieldData?.targetPopulations
            )
          ),
        },
      };
    }

    setSelectedReport(formData);

    const openHandlerMap: any = {
      WP: createWorkPlanModalOnOpenHandler,
      SAR: createSarModalOnOpenHandler,
    };

    openHandlerMap[reportType]();
  };

  const openResetWorkPlanModal = () => {
    setSelectedReport(undefined);
    setIsResetting(true);
    createWorkPlanModalOnOpenHandler();
  };

  const openArchiveModal = (report: ReportMetadataShape) => {
    setReportId(report?.id);
    confirmArchiveModalOnOpenHandler();
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
    switch (reportType) {
      case ReportType.SAR:
        return !workPlanToCopyFrom;
      case ReportType.WP:
        if (!previousReport) {
          return false;
        } else {
          // Prevent creating a new WP if the previous WP is for Q1 2026 and approved
          if (
            previousReport.reportPeriod === 1 &&
            previousReport.reportYear === 2026 &&
            previousReport.status === ReportStatus.APPROVED
          )
            return true;
          // Allow creating a new WP only if the previous WP is approved
          return previousReport.status !== ReportStatus.APPROVED;
        }
      case ReportType.EXPENDITURE:
        return false;
      default:
        return true;
    }
  };

  const isResetDisabled = (): boolean => {
    switch (reportType) {
      case ReportType.SAR:
        return !workPlanToCopyFrom;
      case ReportType.WP:
      case ReportType.EXPENDITURE:
        if (!previousReport) {
          return false;
        } else {
          return previousReport.status !== ReportStatus.APPROVED;
        }
      default:
        return true;
    }
  };

  const closeWorkPlanModal = () => {
    setIsResetting(false);
    createWorkPlanModalOnCloseHandler();
  };

  // new work plan modal disclosure
  const {
    isOpen: createWorkPlanModalIsOpen,
    onOpen: createWorkPlanModalOnOpenHandler,
    onClose: createWorkPlanModalOnCloseHandler,
  } = useDisclosure();

  // add/edit program modal disclosure
  const {
    isOpen: createSarModalIsOpen,
    onOpen: createSarModalOnOpenHandler,
    onClose: createSarModalOnCloseHandler,
  } = useDisclosure();

  //unlock modal disclosure
  const {
    isOpen: confirmUnlockModalIsOpen,
    onOpen: confirmUnlockModalOnOpenHandler,
    onClose: confirmUnlockModalOnCloseHandler,
  } = useDisclosure();

  //archive modal disclosure
  const {
    isOpen: confirmArchiveModalIsOpen,
    onOpen: confirmArchiveModalOnOpenHandler,
    onClose: confirmArchiveModalOnCloseHandler,
  } = useDisclosure();

  const fullStateName = States[activeState as keyof typeof States];
  return (
    <PageTemplate type="report" sx={sx.layout}>
      <Link as={RouterLink} to="/" sx={sx.returnLink}>
        <Image src={arrowLeftIcon} alt="Arrow left" className="returnIcon" />
        Return home
      </Link>
      <Box sx={sx.errorMessage}>
        {errorMessage && <ErrorAlert error={errorMessage} />}
      </Box>
      {/* Only show SAR alert banner if the corresponding Work Plan is not approved */}
      <Box sx={sx.leadTextBox}>
        {showSarAlert && (
          <Alert
            title={dashboardVerbiage.alertBanner.title}
            showIcon={true}
            icon={alertIcon}
            status={AlertTypes.ERROR}
            description={dashboardVerbiage.alertBanner.body}
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
          defaultIndex={[0]} // sets the accordion to open by default
        />
        {parseCustomHtml(intro.body)}
      </Box>
      <Box sx={sx.bodyBox}>
        {showFilter && <DashboardFilter />}

        {reportsToDisplay ? (
          <ResponsiveDashboardTable
            reportsByState={reportsToDisplay}
            reportType={reportType}
            reportId={reportId}
            body={body}
            openCreateReportModal={
              reportType === ReportType.EXPENDITURE
                ? modal!!.setModalReport
                : openCreateReportModal
            }
            enterSelectedReport={enterSelectedReport}
            archive={openArchiveModal}
            entering={entering}
            releaseReport={toggleReportLockStatus}
            releasing={releasing}
            isStateLevelUser={userIsEndUser!}
            isAdmin={userIsAdmin!}
            sxOverride={sxChildStyles}
          />
        ) : (
          !errorMessage && (
            <Flex sx={sx.spinnerContainer}>
              <Spinner size="md" />
            </Flex>
          )
        )}
        {!reportsToDisplay?.length && userIsEndUser && (
          <Text sx={sx.emptyTableContainer}>{body.empty}</Text>
        )}
        {/* only show add report button to state users */}
        {userState && (
          <Box sx={sx.callToActionContainer}>
            <Button
              type="submit"
              variant="primary"
              disabled={isAddSubmissionDisabled()}
              onClick={() =>
                reportType === ReportType.EXPENDITURE
                  ? modal?.setModalReport(undefined)
                  : openCreateReportModal()
              }
            >
              {!previousReport || reportType === ReportType.SAR
                ? body.callToAction
                : body.callToActionAdditions}
            </Button>
            {reportType === ReportType.WP && previousReport && (
              <Button
                sx={sx.resetBtn}
                onClick={openResetWorkPlanModal}
                disabled={isResetDisabled()}
                type="submit"
                variant="transparent"
              >
                Reset MFP Work Plan
              </Button>
            )}
          </Box>
        )}
      </Box>
      {modal?.modal && modal.modal}
      <CreateWorkPlanModal
        isResetting={isResetting}
        activeState={activeState!}
        previousReport={previousReport}
        modalDisclosure={{
          isOpen: createWorkPlanModalIsOpen,
          onClose: closeWorkPlanModal,
        }}
      />
      <CreateSarModal
        activeState={activeState!}
        selectedReport={selectedReport!}
        modalDisclosure={{
          isOpen: createSarModalIsOpen,
          onClose: createSarModalOnCloseHandler,
        }}
      />
      <Modal
        modalDisclosure={{
          isOpen: confirmUnlockModalIsOpen,
          onClose: confirmUnlockModalOnCloseHandler,
        }}
        onConfirmHandler={confirmUnlockModalOnCloseHandler}
        content={dashboardVerbiage.modalUnlock}
      />
      {isArchivable(reportType) && (
        <ArchiveReportModal
          adminState={adminSelectedState}
          archiveReport={archiveReport}
          fetchReportsByState={fetchReportsByState}
          modalDisclosure={{
            isOpen: confirmArchiveModalIsOpen,
            onClose: confirmArchiveModalOnCloseHandler,
          }}
          reportId={reportId}
          reportType={reportType}
        />
      )}
    </PageTemplate>
  );
};

interface Props {
  reportType: ReportType;
  showFilter?: boolean;
  modal?: ModalBundle;
}

const sx = {
  layout: {
    ".contentFlex": {
      maxWidth: "appMax",
      marginTop: "spacer2",
      marginBottom: "spacer7",
    },
  },
  returnLink: {
    display: "flex",
    width: "8.5rem",
    paddingTop: "spacer1",
    svg: {
      height: "1.375rem",
      width: "1.375rem",
      marginTop: "-0.125rem",
      marginRight: "spacer1",
    },
    textDecoration: "none",
    _hover: {
      textDecoration: "underline",
    },
    ".returnIcon": {
      width: "1.25rem",
      height: "1.25rem",
      marginTop: "spacer_half",
      marginRight: "spacer1",
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
    marginBottom: "spacer2",
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
        borderColor: "black",
      },
      "&:after": {
        borderLeftColor: "black",
      },
    },
  },
  emptyTableContainer: {
    maxWidth: "75%",
    margin: "0 auto",
    textAlign: "center",
  },
  callToActionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "spacer4",
  },
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: "10",
  },
  alertBanner: {
    marginBottom: "spacer4",
    borderInlineStartWidth: "7.5px",
    bgColor: "error_lightest",
    fontSize: "18px",
    p: {
      fontSize: "16px",
    },
  },
  errorMessage: {
    paddingTop: "spacer2",
  },
  resetBtn: {
    border: "none",
    marginTop: "spacer2",
    fontWeight: "none",
    textDecoration: "underline",
    fontSize: "0.875rem",
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
      color: "primary",
    },
  },
  editReport: {
    padding: "0",
    width: "2.5rem",
    ".tablet &, .mobile &": {
      width: "2rem",
    },
    img: {
      minHeight: "1.5rem",
      width: "1.5rem",
      marginLeft: 0,
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
