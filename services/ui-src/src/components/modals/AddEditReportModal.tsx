import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import { Button, Spinner } from "@chakra-ui/react";
// form
import copyWPFormJson from "forms/addEditWpReport/addEditWpReport.json";
import newWPFormJson from "forms/addEditWpReport/newWpReport.json";
import sarFormJson from "forms/addEditSarReport/addEditSarReport.json";
// utils
import { AnyObject, FormJson, ReportStatus, ReportType } from "types";
import { States, DEFAULT_TARGET_POPULATIONS } from "../../constants";
import {
  injectFormWithTargetPopulations,
  removeNotApplicablePopulations,
  useStore,
} from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";

export const AddEditReportModal = ({
  modalDisclosure,
  reportType,
  activeState,
  previousReport,
  selectedReport,
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
    reportType === ReportType.SAR &&
    selectedReport?.status === ReportStatus.SUBMITTED;

  const viewOnly = userIsAdmin || sarReportWithSubmittedStatus;

  const dataToInject = selectedReport?.id
    ? selectedReport?.formData?.populations
    : workPlanToCopyFrom?.fieldData?.targetPopulations;

  const filteredDataToInject = removeNotApplicablePopulations(dataToInject);

  const modalFormJsonMap: any = {
    WP: !previousReport ? newWPFormJson : copyWPFormJson,
    SAR: injectFormWithTargetPopulations(
      sarFormJson,
      filteredDataToInject,
      !!selectedReport?.id
    ),
  };

  const modalFormJson = modalFormJsonMap[reportType]!;
  const form: FormJson = modalFormJson;

  /**
   * @function: Generate report year choices
   * Populate previous, current, and next year for the choice list,
   * except if it is the first year of the work plan feature
   */
  const generateReportYearChoices = () => {
    const WP_LAUNCH_YEAR = 2024;
    const currentYear = new Date(Date.now()).getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1]
      .filter((year) => year >= WP_LAUNCH_YEAR)
      .map((year) => ({
        id: `reportYear-${year}`,
        label: `${year}`,
        name: `${year}`,
        value: `${year}`,
      }));
  };

  // prepare form if first WP
  if (reportType === ReportType.WP && !previousReport) {
    for (let field of form.fields) {
      if (field.id.match("reportPeriodYear")) {
        field.props = {
          ...field.props,
          choices: generateReportYearChoices(),
        };
      }
    }
  }

  // temporary flag for testing copyover
  const isCopyOverTest = useFlags()?.isCopyOverTest;

  /**
   * @function: Prepare WP payload
   * @param wpReset: (optional) determine whether the user would like to continue a Work Plan for next period,
   * but clear / reset any existing data from the previous period
   */
  const prepareWpPayload = (formData?: any, wpReset?: boolean) => {
    const submissionName = "Work Plan";

    const wpPayload: AnyObject = {
      metadata: {
        submissionName,
        lastAlteredBy: full_name,
        locked: false,
        previousRevisions: [],
      },
      fieldData: {
        submissionName,
        ["targetPopulations"]: DEFAULT_TARGET_POPULATIONS,
      },
    };

    // add a flag to be passed to the backend for copy over testing
    if (previousReport) {
      previousReport.isCopyOverTest = isCopyOverTest;
      wpPayload.metadata = {
        ...wpPayload.metadata,
        copyReport: previousReport,
        isReset: wpReset,
      };
    } else {
      const formattedReportYear = Number(formData.reportPeriodYear[0].value);
      const formattedReportPeriod =
        formData.reportPeriod[0].key === "reportPeriod-1" ? 1 : 2;
      wpPayload.metadata = {
        ...wpPayload.metadata,
        reportYear: formattedReportYear,
        reportPeriod: formattedReportPeriod,
      };
    }

    return wpPayload;
  };

  // SAR report payload
  const prepareSarPayload = (formData: any) => {
    const submissionName = formData["associatedWorkPlan"];
    const stateOrTerritory = formData["stateOrTerritory"];
    const populations = formData["populations"];
    const finalSar = formData["finalSar"];
    return {
      metadata: {
        submissionName,
        stateOrTerritory,
        lastAlteredBy: full_name,
        locked: false,
        previousRevisions: [],
        finalSar,
        populations,
      },
      fieldData: {
        submissionName,
        stateOrTerritory,
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
      reportType === ReportType.WP
        ? prepareWpPayload(formData, wpReset)
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

    modalDisclosure.onClose();
    await fetchReportsByState(reportType, activeState);
    setSubmitting(false);
  };

  const resetReport = (formData: any) => {
    writeReport(formData, true);
    modalDisclosure.onClose();
  };

  const actionButtonText = () => {
    if (reportType === ReportType.WP) {
      return !previousReport ? "Start new" : "";
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
      submitting={submitting}
      submitButtonDisabled={submitting}
      content={{
        heading: !isCopyDisabled() ? form.heading?.edit : form.heading?.add,
        subheading: !isCopyDisabled()
          ? form.heading?.subheadingEdit
          : form.heading?.subheading,
        actionButtonText: actionButtonText(),
        closeButtonText: !previousReport ? "Cancel" : "",
      }}
    >
      <Form
        data-testid="add-edit-report-form"
        id={form.id}
        formJson={form}
        formData={
          reportType === ReportType.WP
            ? previousReport
            : selectedReport?.formData
        }
        // if view-only (user is admin, report is submitted), close modal
        onSubmit={viewOnly ? modalDisclosure.onClose : writeReport}
        validateOnRender={false}
        dontReset={true}
        reportStatus={selectedReport?.status}
      />
      {reportType === ReportType.WP && previousReport && (
        <>
          <Button
            sx={sx.copyBtn}
            disabled={isCopyDisabled() || submitting}
            onClick={writeReport}
            type="submit"
          >
            Continue from previous period
          </Button>
          {!isCopyDisabled() && (
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
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  reportType: string;
  activeState?: string;
  previousReport?: AnyObject;
  selectedReport?: AnyObject;
}

const sx = {
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
};
