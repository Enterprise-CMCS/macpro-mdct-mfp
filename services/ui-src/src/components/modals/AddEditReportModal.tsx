import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import { Button, Spinner } from "@chakra-ui/react";
// form
import wpFormJson from "forms/addEditWpReport/addEditWpReport.json";
import sarFormJson from "forms/addEditSarReport/addEditSarReport.json";
// utils
import { AnyObject, FormJson, ReportStatus, ReportType } from "types";
import { States } from "../../constants";
import {
  injectFormWithTargetPopulations,
  removeNotApplicablePopulations,
  useStore,
} from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";

export const AddEditReportModal = ({
  activeState,
  selectedReport,
  previousReport,
  reportType,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState, updateReport } =
    useContext(ReportContext);
  const { full_name, userIsAdmin } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { workPlanToCopyFrom } = useStore();

  /**
   * edit modal will be in view-only mode for admins all the time,
   * and for state users after a SAR has been submitted
   */
  const sarReportWithSubmittedStatus =
    reportType == ReportType.SAR &&
    selectedReport?.status === ReportStatus.SUBMITTED;

  const viewOnly = userIsAdmin || sarReportWithSubmittedStatus;

  const dataToInject = selectedReport?.id
    ? selectedReport?.formData?.populations
    : workPlanToCopyFrom?.fieldData?.targetPopulations;

  const filteredDataToInject = removeNotApplicablePopulations(dataToInject);

  const modalFormJsonMap: any = {
    WP: wpFormJson,
    SAR: injectFormWithTargetPopulations(
      sarFormJson,
      filteredDataToInject,
      !!selectedReport?.id
    ),
  };

  const modalFormJson = modalFormJsonMap[reportType]!;
  const form: FormJson = modalFormJson;

  // temporary flag for testing copyover
  const isCopyOverTest = useFlags()?.isCopyOverTest;

  /**
   * @function: Prepare WP payload
   * @param wpReset: (optional) determine whether the user would like to continue a Work Plan for next period,
   * but clear / reset any existing data from the previous period
   */
  const prepareWpPayload = (wpReset?: boolean) => {
    const submissionName = "Work Plan";

    // static entities
    const targetPopulations = [
      {
        id: "2Vd02CVUtKgBETwqzDXpSIhi",
        transitionBenchmarks_targetPopulationName: "Older adults",
        isRequired: true,
      },
      {
        id: "2Vd02HAezQkxNu2ShmlQONHa",
        transitionBenchmarks_targetPopulationName:
          "Individuals with physical disabilities (PD)",
        transitionBenchmarks_targetPopulationName_short: "PD",
        isRequired: true,
      },
      {
        id: "2Vd02IvLwE59ebYAjfiU7H66",
        transitionBenchmarks_targetPopulationName:
          "Individuals with intellectual and developmental disabilities (I/DD)",
        transitionBenchmarks_targetPopulationName_short: "I/DD",
        isRequired: true,
      },
      {
        id: "2Vd02J1FHl3Ka1DbtU5FMSDh",
        transitionBenchmarks_targetPopulationName:
          "Individuals with mental health and substance use disorders (MH/SUD)",
        transitionBenchmarks_targetPopulationName_short: "MH/SUD",
        isRequired: true,
      },
    ];

    // add a flag to be passed to the backend for copy over testing
    if (previousReport) {
      previousReport.isCopyOverTest = isCopyOverTest;
    }

    return {
      metadata: {
        submissionName,
        lastAlteredBy: full_name,
        copyReport: previousReport,
        locked: false,
        previousRevisions: [],
        isReset: wpReset,
      },
      fieldData: {
        submissionName,
        ["targetPopulations"]: targetPopulations,
      },
    };
  };

  // SAR report payload
  const prepareSarPayload = (formData: any) => {
    const submissionName = formData["associatedWorkPlan"];
    const stateOrTerritory = formData["stateOrTerritory"];
    const reportPeriod = formData["reportPeriod"];
    const populations = formData["populations"];
    const finalSar = formData["finalSar"];
    return {
      metadata: {
        submissionName,
        stateOrTerritory,
        reportPeriod,
        lastAlteredBy: full_name,
        locked: false,
        previousRevisions: [],
        finalSar,
        populations,
      },
      fieldData: {
        submissionName,
        stateOrTerritory,
        reportPeriod,
      },
    };
  };

  /**
   * @param wpReset: (optional) determine whether the user would like to continue a Work Plan for next period,
   * but clear / reset any existing data from the previous period
   */
  const writeReport = async (formData: any, wpReset?: boolean) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    const dataToWrite =
      reportType === "WP"
        ? prepareWpPayload(wpReset)
        : prepareSarPayload(formData);

    // if an existing program was selected, use that report id
    if (selectedReport?.id) {
      const reportKeys = {
        reportType: reportType,
        state: activeState,
        id: selectedReport.id,
      };
      // edit existing report
      await updateReport(reportKeys, {
        ...dataToWrite,
        metadata: {
          ...dataToWrite.metadata,
          locked: undefined,
          status: undefined,
          submissionCount: undefined,
          previousRevisions: undefined,
        },
      });
    } else {
      await createReport(reportType, activeState, {
        ...dataToWrite,
        metadata: {
          ...dataToWrite.metadata,
          reportType,
          status: ReportStatus.NOT_STARTED,
          isComplete: false,
        },
        fieldData: {
          ...dataToWrite.fieldData,
          stateName: States[activeState as keyof typeof States],
          submissionCount: 0,
        },
      });
    }

    await fetchReportsByState(reportType, activeState);
    setSubmitting(false);
    modalDisclosure.onClose();
  };

  const resetReport = (formData: any) => {
    writeReport(formData, true);
    modalDisclosure.onClose();
  };

  const actionButtonText = () => {
    if (reportType === ReportType.WP) {
      return "";
    }
    return submitting ? <Spinner size="md" /> : viewOnly ? "Return" : "Save";
  };

  const isCopyDisabled = () => {
    //if no previous report or the previous report is not approve, disable copy button
    return !previousReport || previousReport?.status !== "Approved";
  };

  return (
    <Modal
      data-testid="add-edit-report-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: !isCopyDisabled() ? form.heading?.edit : form.heading?.add,
        subheading: !isCopyDisabled()
          ? form.heading?.subheadingEdit
          : form.heading?.subheading,
        actionButtonText: actionButtonText(),
        closeButtonText: "",
      }}
    >
      {(reportType == ReportType.SAR || !isCopyDisabled()) && (
        <Form
          data-testid="add-edit-report-form"
          id={form.id}
          formJson={form}
          formData={
            reportType == ReportType.WP
              ? previousReport
              : selectedReport?.formData
          }
          // if view-only (user is admin, report is submitted), close modal
          onSubmit={viewOnly ? modalDisclosure.onClose : writeReport}
          validateOnRender={false}
          dontReset={true}
          reportStatus={selectedReport?.status}
        />
      )}
      {reportType == ReportType.WP && (
        <>
          <Button
            sx={sx.copyBtn}
            disabled={isCopyDisabled() || submitting}
            onClick={writeReport}
            type="submit"
          >
            Continue from previous period
          </Button>
          {isCopyDisabled() ? (
            <Button
              sx={sx.close}
              onClick={writeReport}
              disabled={submitting}
              type="submit"
              variant="outline"
              data-testid="modal-logout-button"
            >
              Start new
            </Button>
          ) : (
            <Button
              sx={sx.resetBtn}
              onClick={resetReport}
              disabled={submitting}
              type="submit"
              variant="outline"
              data-testid="modal-logout-button"
            >
              Reset Work Plan
            </Button>
          )}
        </>
      )}
    </Modal>
  );
};

interface Props {
  activeState?: string;
  reportType: string;
  selectedReport?: AnyObject;
  previousReport?: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}

const sx = {
  modalContent: {
    boxShadow: ".125rem .125rem .25rem",
    borderRadius: "0",
    maxWidth: "30rem",
    marginX: "4rem",
    padding: "0",
  },
  modalHeader: {
    padding: "2rem 2rem 0 2rem",
  },
  modalBody: {
    padding: "1rem 2rem 0 2rem",
  },
  modalFooter: {
    justifyContent: "flex-start",
    padding: "0 2rem 2rem 2rem",
  },
  copyBtn: {
    justifyContent: "center",
    marginTop: "1rem",
    marginRight: "1rem",
    minWidth: "7.5rem",
    span: {
      marginLeft: "1rem",
      marginRight: "-0.25rem",
      "&.ds-c-spinner": {
        marginLeft: 0,
      },
    },
    ".mobile &": {
      fontSize: "sm",
    },
  },
  resetBtn: {
    border: "none",
    marginTop: "1rem",
    fontWeight: "none",
    textDecoration: "underline",
    fontSize: "0.875rem",
  },
  close: {
    justifyContent: "start",
    padding: ".5rem 1rem",
    marginTop: "1rem",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    ".mobile &": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
};
