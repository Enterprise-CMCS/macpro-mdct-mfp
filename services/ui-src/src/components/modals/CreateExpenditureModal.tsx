import { useContext, useEffect, useState } from "react";
// components
import { Alert, Form, Modal, ReportContext } from "components";
import {
  generateCopyReportOptions,
  generateReportYearOptions,
  prepareExpenditurePayload,
} from "components/pages/Dashboard/Expenditure/expenditureLogic";
// form
import { addEditExpenditureReport } from "forms/addEditExpenditureReport/addEditExpenditureReport";
// utils
import { actionButtonText, checkForExistingReport } from "./modalLogic";
import { useStore } from "utils/state/useStore";
// types
import { AlertTypes, AnyObject, ReportStatus, ReportType } from "types";
// constants
import { States } from "../../constants";

const reportType = ReportType.EXPENDITURE;

export const CreateExpenditureModal = ({
  activeState,
  selectedReport,
  modalDisclosure,
  userIsAdmin,
}: Props) => {
  const { createReport, fetchReportsByState, updateReport } =
    useContext(ReportContext);
  const { reportsByState } = useStore();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [formPeriodValue, setFormPeriodValue] = useState<number>();
  const [formYearValue, setFormYearValue] = useState<number>();

  const form = addEditExpenditureReport;
  const resetAlertText = {
    title: "An MFP Expenditure for this Reporting Period already exists",
    description:
      "To avoid duplication, please select a different Reporting Year or Reporting Period.",
  };
  const copyOverOptions = generateCopyReportOptions(reportsByState);

  for (let field of form.fields) {
    if (field.id.match("reportYear")) {
      field.props = {
        ...field.props,
        options: generateReportYearOptions(),
      };
    }
    if (field.id.match("copyReport")) {
      field.props = {
        ...field.props,
        options: copyOverOptions,
        disabled: copyOverOptions[0]?.label === "No reports eligble for copy",
      };
    }
  }

  useEffect(() => {
    if (!modalDisclosure.isOpen) {
      setFormPeriodValue(undefined);
      setFormYearValue(undefined);
      setShowAlert(false);
    }
  }, [modalDisclosure.isOpen]);

  useEffect(() => {
    setShowAlert(
      checkForExistingReport(formYearValue, formPeriodValue, reportsByState)
    );
  }, [formPeriodValue, formYearValue]);

  // used to get the form values to enable/disable alert and submit button
  const onChange = (formProvider: AnyObject) => {
    if (formProvider.target.name === "reportPeriod")
      setFormPeriodValue(Number(formProvider.target.value));
    if (formProvider.target.name === "reportYear")
      setFormYearValue(Number(formProvider.target.value));
  };

  /**
   * edit modal will be in view-only mode for admins all the time,
   * and for state users after a SAR has been submitted
   */
  const expenditureReportWithSubmittedStatus =
    selectedReport?.status === ReportStatus.SUBMITTED;

  const viewOnly = userIsAdmin || expenditureReportWithSubmittedStatus;

  const writeReport = async (formData: AnyObject) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    const dataToWrite = prepareExpenditurePayload(
      activeState,
      formData,
      reportsByState
    );

    if (selectedReport?.id) {
      const reportKeys = {
        reportType: reportType,
        state: activeState,
        id: selectedReport.id,
      };
      await updateReport(reportKeys, {
        ...dataToWrite,
        fieldData: {
          ...selectedReport.fieldData,
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

  return (
    <Modal
      data-testid="create-expenditure-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      submitting={submitting}
      submitButtonDisabled={submitting || showAlert}
      content={{
        heading: selectedReport?.id ? form.heading?.edit : form.heading?.add,
        subheading: form.heading?.subheading,
        actionButtonText: actionButtonText(
          submitting,
          viewOnly,
          selectedReport?.id
        ),
        closeButtonText: "Cancel",
      }}
    >
      {showAlert && (
        <Alert
          title={resetAlertText.title}
          status={AlertTypes.ERROR}
          description={resetAlertText.description}
        />
      )}
      <Form
        data-testid="create-expenditure-form"
        id={form.id}
        formJson={form}
        formData={selectedReport?.formData}
        onSubmit={viewOnly ? modalDisclosure.onClose : writeReport}
        reportStatus={selectedReport?.status}
        validateOnRender={false}
        dontReset={true}
        onChange={onChange}
      />
    </Modal>
  );
};

interface Props {
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  activeState: string;
  selectedReport?: AnyObject;
  userIsAdmin?: boolean;
}
