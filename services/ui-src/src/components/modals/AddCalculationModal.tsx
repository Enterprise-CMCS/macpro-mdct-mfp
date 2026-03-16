import { useRef, useState } from "react";
// components
import { Form, Modal } from "components";
// form
import { addSubRecipientForm } from "forms/addSubRecipient/addSubRecipient";
// types
import { FormJson } from "types";
import { Button, ModalFooter } from "@chakra-ui/react";

export const AddCalculationModal = ({
  modalDisclosure,
  userIsAdmin = false,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const modalForm = useRef<HTMLFormElement>(null);

  const form: FormJson = addSubRecipientForm;

  const viewOnly = userIsAdmin;

  /*
   *  This function is actually intercepting the form submission. This form lives inside
   * another form, and thus we need to handle the submission manually here. We can replace this
   * with a proper onSubmit handler in the future when we refactor the modal forms to not live
   * inside the main form.
   */
  const writeReport = async () => {
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
        actionButtonText: "",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-calculation-form"
        id={form.id}
        ref={modalForm}
        formJson={form}
        disabled={viewOnly}
        onSubmit={() => {}}
        validateOnRender={false}
        dontReset={true}
      />
      <ModalFooter sx={sx.modalFooter}>
        <Button
          type="submit"
          data-testid="modal-submit-button"
          onClick={writeReport}
        >
          Add Sub Recipient
        </Button>
      </ModalFooter>
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

const sx = {
  modalFooter: {
    paddingStart: 0,
    justifyContent: "start",
  },
};
