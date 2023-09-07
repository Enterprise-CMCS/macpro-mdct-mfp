import React from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";

// types
import { AnyObject, EntityShape } from "types";
import { renderHtml } from "utils";

export const DeleteEntityModal = ({
  selectedEntity,
  verbiage,
  modalDisclosure,
}: Props) => {
  const deleting = false;
  const deleteProgramHandler = async () => {
    // eslint-disable-next-line no-console
    console.log("Entity Deleted", selectedEntity);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={deleteProgramHandler}
      modalDisclosure={modalDisclosure}
      submitting={deleting}
      content={{
        heading: verbiage.deleteModalTitle,
        actionButtonText: verbiage.deleteModalConfirmButtonText,
        closeButtonText: "Cancel",
      }}
    >
      <Text>{renderHtml(verbiage.deleteModalWarning)}</Text>
    </Modal>
  );
};

interface Props {
  selectedEntity?: EntityShape;
  verbiage: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
