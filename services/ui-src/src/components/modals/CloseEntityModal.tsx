import { useState } from "react";
// components
import { Modal } from "components";
// types
import { AnyObject, EntityShape } from "types";
//utils
import { renderHtml } from "utils";

export const CloseEntityModal = ({ verbiage, modalDisclosure }: Props) => {
  //const { report } = useStore();
  const [closingOut, setClosingOut] = useState<boolean>(false);
  const modalInfo = verbiage.closeOutModal;

  const closeOutProgramHandler = async () => {
    setClosingOut(true);

    // TO-DO: what does it mean to close out an initiative? what do i have to send to the api here

    setClosingOut(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={closeOutProgramHandler}
      modalDisclosure={modalDisclosure}
      submitting={closingOut}
      content={{
        heading: modalInfo.closeOutModalTitle,
        actionButtonText: modalInfo.closeOutModalConfirmButtonText,
        closeButtonText: "Cancel",
      }}
    >
      {renderHtml(modalInfo.closeOutModalBodyText)}
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
