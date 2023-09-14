// components
import { Modal } from "components";

// types
import { AnyObject, EntityShape } from "types";

export const CloseEntityModal = ({ verbiage, modalDisclosure }: Props) => {
  const closing = false;
  const closeProgramHandler = async () => {
    modalDisclosure.onClose();
  };
  const modalInfo = verbiage.closeOutModal;

  return (
    <Modal
      onConfirmHandler={closeProgramHandler}
      modalDisclosure={modalDisclosure}
      submitting={closing}
      content={{
        heading: modalInfo.closeOutModalTitle,
        subheading: modalInfo.closeOutModalBodyText,
        actionButtonText: modalInfo.closeOutModalConfirmButtonText,
        closeButtonText: "Cancel",
      }}
    ></Modal>
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
