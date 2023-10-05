// components
import { Modal } from "components";
// types
import { AnyObject, EntityShape } from "types";
//utils
import { renderHtml } from "utils";

export const CloseEntityModal = ({
  verbiage,
  modalDisclosure,
  formId,
}: Props) => {
  const modalInfo = verbiage.closeOutModal;

  return (
    <Modal
      formId={formId}
      modalDisclosure={modalDisclosure}
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
  formId: any;
}
