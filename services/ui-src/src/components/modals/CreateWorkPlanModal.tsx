import { useContext, useState } from "react";
// components
import { Button } from "@chakra-ui/react";
import { Form, Modal, ReportContext } from "components";
// forms
import copyWPFormJson from "forms/addEditWpReport/addEditWpReport.json";
import newWPFormJson from "forms/addEditWpReport/newWpReport.json";
// utils
import { AnyObject, FormJson, ReportStatus, ReportType } from "types";
import { useStore } from "utils";
import { States, DEFAULT_TARGET_POPULATIONS } from "../../constants";
import { useFlags } from "launchdarkly-react-client-sdk";

const reportType = ReportType.WP;

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

export const CreateWorkPlanModal = ({
  activeState,
  previousReport,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState } = useContext(ReportContext);
  const { full_name } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  // temporary flag for testing copyover
  const isCopyOverTest = useFlags()?.isCopyOverTest;

  const form: FormJson = !previousReport ? newWPFormJson : copyWPFormJson;

  if (!previousReport) {
    for (let field of form.fields) {
      if (field.id.match("reportPeriodYear")) {
        field.props = {
          ...field.props,
          choices: generateReportYearChoices(),
        };
      }
    }
  }

  /**
   * @function: Prepare WP payload
   * @param wpReset: (optional) determine whether the user would like to continue a Work Plan for next period,
   * but clear / reset any existing data from the previous period
   */
  const prepareWpPayload = (formData: any, wpReset?: boolean) => {
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

    if (!previousReport) {
      const formattedReportYear = Number(formData.reportPeriodYear[0].value);
      const formattedReportPeriod =
        formData.reportPeriod[0].key === "reportPeriod-1" ? 1 : 2;
      wpPayload.metadata = {
        ...wpPayload.metadata,
        reportYear: formattedReportYear,
        reportPeriod: formattedReportPeriod,
      };
    } else {
      previousReport.isCopyOverTest = isCopyOverTest;
      wpPayload.metadata = {
        ...wpPayload.metadata,
        copyReport: previousReport,
        isReset: wpReset,
      };
    }

    return wpPayload;
  };

  /**
   * @param wpReset: (optional) determine whether the user would like to continue a Work Plan for next period,
   * but clear / reset any existing data from the previous period
   */
  const writeReport = async (formData: any, wpReset?: boolean) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    const dataToWrite = prepareWpPayload(formData, wpReset);

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

    modalDisclosure.onClose();
    await fetchReportsByState(reportType, activeState);
    setSubmitting(false);
  };

  const resetReport = (formData: any) => {
    writeReport(formData, true);
    modalDisclosure.onClose();
  };

  const isCopyDisabled = () => {
    //if no previous report or the previous report is not approve, disable copy button
    return !previousReport || previousReport?.status !== "Approved";
  };

  return (
    <Modal
      data-testid="create-work-plan-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      submitting={submitting}
      submitButtonDisabled={submitting}
      content={{
        heading: !isCopyDisabled() ? form.heading?.edit : form.heading?.add,
        subheading: !isCopyDisabled()
          ? form.heading?.subheadingEdit
          : form.heading?.subheading,
        actionButtonText: !previousReport ? "Start new" : "",
        closeButtonText: !previousReport ? "Cancel" : "",
      }}
    >
      <Form
        data-testid="create-work-plan-form"
        id={form.id}
        formJson={form}
        formData={previousReport}
        onSubmit={writeReport}
        validateOnRender={false}
        dontReset={true}
      />
      {previousReport && (
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
  activeState?: string;
  previousReport?: AnyObject;
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
