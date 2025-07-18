import { useContext, useEffect, useState } from "react";
// components
import { Alert, Form, Modal, ReportContext } from "components";
import { Button } from "@chakra-ui/react";
// form
import abcdFormJson from "forms/addEditAbcdReport/addEditAbcdReport.json";
// utils
import {
  AlertTypes,
  AnyObject,
  FormJson,
  ReportStatus,
  ReportType,
} from "types";
import { DEFAULT_TARGET_POPULATIONS, States } from "../../constants";
import { useStore } from "utils";

const reportType = ReportType.ABCD;

const resetAlertText = {
  title: "A MFP Work Plan for this Reporting Period already exists",
  description:
    "To avoid duplication, select a different Year or Reporting Period; or select “Cancel” and select “Continue MFP Work Plan for next Period”.",
};

const generateReportYearChoices = () => {
  const WP_LAUNCH_YEAR = 2025;
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

export const CreateAbcdModal = ({
  activeState,
  previousReport,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState } = useContext(ReportContext);
  const { reportsByState } = useStore();
  const { full_name } = useStore().user ?? {};
  const [formPeriodValue, setFormPeriodValue] = useState<number>();
  const [formYearValue, setFormYearValue] = useState<number>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form: FormJson = abcdFormJson;

  const notCopyingReport = !previousReport;

  if (notCopyingReport) {
    for (let field of form.fields) {
      if (field.id.match("reportPeriodYear")) {
        field.props = {
          ...field.props,
          choices: generateReportYearChoices(),
        };
      }
    }
  }

  // set alert to show if selected period and year match any existing report
  useEffect(() => {
    if (!reportsByState) return;
    for (const report of reportsByState) {
      if (
        report.reportPeriod === formPeriodValue &&
        report.reportYear === formYearValue &&
        !report.archived
      ) {
        setShowAlert(true);
      }
    }
  }, [formPeriodValue, formYearValue]);

  // reset error state to false upon modal close
  useEffect(() => {
    if (!modalDisclosure.isOpen) {
      setFormPeriodValue(undefined);
      setFormYearValue(undefined);
      setShowAlert(false);
    }
  }, [modalDisclosure.isOpen]);

  // used to get the form values to enable/disable alert and submit button
  const onChange = (formProvider: AnyObject) => {
    if (formProvider.target.name === "reportPeriod")
      setFormPeriodValue(formProvider.target.id === "reportPeriod-1" ? 1 : 2);
    if (formProvider.target.name === "reportPeriodYear")
      setFormYearValue(Number(formProvider.target.value));
    setShowAlert(false);
  };

  const prepareAbcdPayload = (formData: AnyObject) => {
    const submissionName = "ABCD Report";

    const abcdPayload: AnyObject = {
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

    if (notCopyingReport) {
      const formattedReportYear = Number(formData.reportPeriodYear[0].value);
      const formattedReportPeriod =
        formData.reportPeriod[0].key === "reportPeriod-1" ? 1 : 2;
      abcdPayload.metadata = {
        ...abcdPayload.metadata,
        reportYear: formattedReportYear,
        reportPeriod: formattedReportPeriod,
      };
    } else {
      abcdPayload.metadata.copyReport = previousReport;
    }

    return abcdPayload;
  };

  const writeReport = async (formData: AnyObject) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    const dataToWrite = prepareAbcdPayload(formData);

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

  const isCopyDisabled = () => {
    //if no previous report or the previous report is not approve, disable copy button
    return notCopyingReport || previousReport?.status !== "Approved";
  };

  return (
    <Modal
      data-testid="create-abcd-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      submitting={submitting}
      submitButtonDisabled={submitting || showAlert}
      content={{
        heading: !isCopyDisabled() ? form.heading?.edit : form.heading?.add,
        subheading: !isCopyDisabled()
          ? form.heading?.subheadingEdit
          : form.heading?.subheading,
        actionButtonText: notCopyingReport ? "Start new" : "",
        closeButtonText: notCopyingReport ? "Cancel" : "",
      }}
    >
      <Form
        data-testid="create-abcd-form"
        id={form.id}
        formJson={form}
        formData={previousReport}
        onSubmit={writeReport}
        validateOnRender={false}
        dontReset={true}
        onChange={onChange}
      />
      {showAlert && (
        <Alert
          title={resetAlertText.title}
          status={AlertTypes.ERROR}
          description={resetAlertText.description}
        />
      )}
      {!notCopyingReport && (
        <Button
          sx={sx.copyBtn}
          disabled={isCopyDisabled() || submitting}
          onClick={writeReport}
          type="submit"
        >
          Continue from previous period
        </Button>
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
};
