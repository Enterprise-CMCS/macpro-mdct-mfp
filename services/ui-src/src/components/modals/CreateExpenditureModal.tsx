import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import {
  generateReportYearOptions,
  prepareExpenditurePayload,
} from "components/pages/Dashboard/Expenditure/expenditureLogic";
// form
import { addEditExpenditureReport } from "forms/addEditExpenditureReport/addEditExpenditureReport";
// types
import { AnyObject, ReportStatus, ReportType } from "types";
// constants
import { States } from "../../constants";

const reportType = ReportType.EXPENDITURE;

export const CreateExpenditureModal = ({
  activeState,
  selectedReport,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState, updateReport } =
    useContext(ReportContext);
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

  const writeReport = async (formData: AnyObject) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    const dataToWrite = prepareExpenditurePayload(activeState, formData);

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
      submitButtonDisabled={submitting}
      content={{
        heading: form.heading?.add,
        subheading: form.heading?.subheading,
        actionButtonText: "Update submission",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="create-expenditure-form"
        id={form.id}
        formJson={form}
        formData={selectedReport?.formData}
        onSubmit={writeReport}
        validateOnRender={false}
        dontReset={true}
      />
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
