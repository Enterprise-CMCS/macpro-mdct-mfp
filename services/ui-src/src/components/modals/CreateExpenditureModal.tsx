import { useContext, useEffect, useState } from "react";
// components
import { Alert, Form, Modal, ReportContext } from "components";
// form
import { addEditExpenditureReport } from "forms/addEditExpenditureReport/addEditExpenditureReport";
// utils
import { useStore } from "utils";
// types
import { AlertTypes, AnyObject, ReportStatus, ReportType } from "types";
// constants
import { States } from "../../constants";

const reportType = ReportType.EXPENDITURE;

const generateReportYearOptions = () => {
  const EXPENDITURE_LAUNCH_YEAR = 2025;
  const currentYear = new Date(Date.now()).getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1]
    .filter((year) => year >= EXPENDITURE_LAUNCH_YEAR)
    .map((year) => ({
      id: `reportYear-${year}`,
      label: `${year}`,
      name: `${year}`,
      value: `${year}`,
    }))
    .reverse();
};

export const CreateExpenditureModal = ({
  activeState,
  selectedReport,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState } = useContext(ReportContext);
  const { reportsByState } = useStore();
  const { full_name } = useStore().user ?? {};
  const [formPeriodValue, setFormPeriodValue] = useState<number>();
  const [formYearValue, setFormYearValue] = useState<number>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form = addEditExpenditureReport;

  for (let field of form.fields) {
    if (field.id.match("reportYear")) {
      field.props = {
        ...field.props,
        options: generateReportYearOptions(),
      };
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
      setFormPeriodValue(Number(formProvider.target.value));
    if (formProvider.target.name === "reportYear")
      setFormYearValue(Number(formProvider.target.value));
    setShowAlert(false);
  };

  const prepareExpenditurePayload = (formData: AnyObject) => {
    const formattedReportYear = Number(formData.reportYear.value);
    const formattedReportPeriod = Number(formData.reportPeriod.value);

    const expenditurePayload: AnyObject = {
      metadata: {
        lastAlteredBy: full_name,
        locked: false,
        previousRevisions: [],
        reportYear: formattedReportYear,
        reportPeriod: formattedReportPeriod,
      },
      fieldData: {},
    };

    return expenditurePayload;
  };

  const writeReport = async (formData: AnyObject) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    const dataToWrite = prepareExpenditurePayload(formData);

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

  return (
    <Modal
      data-testid="create-expenditure-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      submitting={submitting}
      submitButtonDisabled={submitting || showAlert}
      content={{
        heading: form.heading?.add,
        subheading: form.heading?.subheading,
        actionButtonText: "Start new",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="create-expenditure-form"
        id={form.id}
        formJson={form}
        formData={selectedReport}
        onSubmit={writeReport}
        validateOnRender={false}
        dontReset={true}
        onChange={onChange}
      />
      {showAlert && (
        <Alert
          title="Alert title"
          status={AlertTypes.ERROR}
          description="Alert description"
        />
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
  selectedReport?: AnyObject;
}
