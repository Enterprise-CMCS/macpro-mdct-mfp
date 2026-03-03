import { useState } from "react";
// components
import { Form, Modal } from "components";
// form
import { addSubRecipientForm } from "forms/addSubRecipient/addSubRecipient";
// utils
import { actionButtonText } from "./modalLogic";
// types
import { AnyObject, FormJson } from "types";

export const AddCalculationModal = ({
  modalDisclosure,
  userIsAdmin,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form: FormJson = addSubRecipientForm;

  const viewOnly = userIsAdmin || false;

  const writeReport = async (formData: AnyObject) => {
    setSubmitting(true);
    // eslint-disable-next-line no-console
    console.log("formData", formData);
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
  userIsAdmin?: boolean;
}
