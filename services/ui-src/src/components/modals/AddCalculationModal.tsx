import { useContext, useEffect, useState } from "react";
// components
import { Form, Modal } from "components";
// form
import { addEditExpenditureReport } from "forms/addEditExpenditureReport/addEditExpenditureReport";
// utils
import { actionButtonText } from "./modalLogic";
import { useStore } from "utils/state/useStore";
// types
import { AnyObject, FormJson, ReportType } from "types";

export const AddCalculationModal = ({
  modalDisclosure,
  userIsAdmin,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form: FormJson = {
    id: "add-calculation-form",
    fields: [],
  };

  const viewOnly = userIsAdmin || false;

  const writeReport = async (formData: AnyObject) => {
    setSubmitting(true);

    modalDisclosure.onClose();
    setSubmitting(false);
  };

  return (
    <Modal
      data-testid="add-calculation-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      submitting={submitting}
      submitButtonDisabled={submitting}
      content={{
        heading: form.heading?.add,
        subheading: form.heading?.subheading,
        actionButtonText: actionButtonText(submitting, viewOnly, undefined),
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-calculation-form"
        id={form.id}
        formJson={form}
        onSubmit={viewOnly ? modalDisclosure.onClose : writeReport}
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
  userIsAdmin?: boolean;
}
