// components
import { Form, Modal } from "components";
import { Spinner } from "@chakra-ui/react";
// form
import mfpFormJson from "forms/addEditMfpReport/addEditMfpReport.json";
// utils
import { AnyObject, FormJson } from "types";

export const AddEditReportModal = ({
  selectedReport,
  reportType,
  modalDisclosure,
}: Props) => {
  const submitting = false;

  const modalFormJsonMap: any = {
    MFP: mfpFormJson,
  };

  const modalFormJson = modalFormJsonMap[reportType]!;
  const form: FormJson = modalFormJson;

  const writeReport = async () => {
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");

    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-report-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedReport?.id ? form.heading?.edit : form.heading?.add,
        actionButtonText: submitting ? <Spinner size="md" /> : "Save",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-report-form"
        id={form.id}
        formJson={form}
        formData={selectedReport?.fieldData}
        onSubmit={writeReport}
        validateOnRender={false}
        dontReset={true}
      />
    </Modal>
  );
};

interface Props {
  reportType: string;
  selectedReport?: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
