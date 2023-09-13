// components
import { Form, Modal } from "components";
import { Text, Spinner } from "@chakra-ui/react";
// utils
import { AnyObject, EntityShape, FormJson } from "types";

export const AddEditEntityModal = ({
  form,
  verbiage,
  selectedEntity,
  modalDisclosure,
}: Props) => {
  const submitting = false;

  const writeEntity = async () => {
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");

    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-entity-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedEntity?.id
          ? verbiage.addEditModalEditTitle
          : verbiage.addEditModalAddTitle,
        subheading: verbiage.addEditModalHint
          ? verbiage.addEditModalHint
          : undefined,
        actionButtonText: submitting ? <Spinner size="md" /> : "Save & close",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-entity-form"
        id={form.id}
        formJson={form}
        formData={selectedEntity}
        onSubmit={writeEntity}
        validateOnRender={false}
        dontReset={true}
      />
      <Text sx={sx.bottomModalMessage}>{verbiage.addEditModalMessage}</Text>
    </Modal>
  );
};

interface Props {
  form: FormJson;
  verbiage: AnyObject;
  selectedEntity?: EntityShape;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}

const sx = {
  bottomModalMessage: {
    fontSize: "xs",
    color: "palette.primary_darker",
    marginTop: "1rem",
    marginBottom: "-1rem",
  },
};
