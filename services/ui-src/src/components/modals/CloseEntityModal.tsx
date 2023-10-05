import { useState, useContext } from "react";
// components
import { Modal, ReportContext } from "components";
// types
import { AnyObject, EntityShape } from "types";
//utils
import { renderHtml, useStore } from "utils";

export const CloseEntityModal = ({ verbiage, modalDisclosure }: Props) => {
  const { report } = useStore();
  const [closingOut, setClosingOut] = useState<boolean>(false);
  const modalInfo = verbiage.closeOutModal;
  const { full_name, state } = useStore().user ?? {};
  const { updateReport } = useContext(ReportContext);

  const closeOutProgramHandler = async () => {
    setClosingOut(true);

    const reportKeys = {
      reportType: report?.reportType,
      state: state,
      id: report?.id,
    };

    const dataToWrite = {
      metadata: {
        isInitiativeClosedOut: true,
        lastAltered: Date.now(),
        lastAlteredBy: full_name,
      },
    };
    await updateReport(reportKeys, dataToWrite);

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
