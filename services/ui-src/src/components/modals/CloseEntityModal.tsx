import React from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";

// types
import { AnyObject, EntityShape } from "types";
import { renderHtml } from "utils";

export const CloseEntityModal = ({
  selectedEntity,
  verbiage,
  modalDisclosure,
}: Props) => {
  const closing = false;
  const closeProgramHandler = async () => {
    // eslint-disable-next-line no-console
    console.log("Entity closed", selectedEntity);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={closeProgramHandler}
      modalDisclosure={modalDisclosure}
      submitting={closing}
      content={{
        heading: verbiage.closeOutModal.closeOutModalTitle,
        subheading: verbiage.closeOutModal.closeOutModalBodyText,
        actionButtonText: verbiage.closeOutModal.closeOutModalConfirmButtonText,
        closeButtonText: "Cancel",
      }}
    >
      <Text>{renderHtml(verbiage.closeModalWarning)}</Text>
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
