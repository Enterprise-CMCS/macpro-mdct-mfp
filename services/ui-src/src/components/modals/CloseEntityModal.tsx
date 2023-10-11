import { useContext } from "react";
// components
import { Modal, ReportContext } from "components";
// types
import { AnyObject, ReportStatus } from "types";
//utils
import { renderHtml, useStore } from "utils";

export const CloseEntityModal = ({
  entityName,
  verbiage,
  modalDisclosure,
  formId,
}: Props) => {
  const modalInfo = verbiage.closeOutModal;
  const { report } = useStore();
  const { full_name, state } = useStore().user ?? {};
  const { updateReport } = useContext(ReportContext);

  const onConfirmHandler = async (enteredData: AnyObject) => {
    const reportKeys = {
      reportType: report?.reportType,
      state: state,
      id: report?.id,
    };

    const dataToWrite = {
      metadata: {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
      },
      fieldData: {
        enteredData, // TO-DO: remove
        initiativeIsClosed: true,
      },
    };
    //console.log(dataToWrite);
    await updateReport(reportKeys, dataToWrite);
  };

  return (
    <Modal
      formId={formId}
      modalDisclosure={modalDisclosure}
      content={{
        heading: modalInfo.closeOutModalTitle + entityName,
        actionButtonText: modalInfo.closeOutModalConfirmButtonText,
        closeButtonText: "Cancel",
      }}
      onConfirmHandler={onConfirmHandler}
    >
      {renderHtml(modalInfo.closeOutModalBodyText)}
    </Modal>
  );
};

interface Props {
  entityName: string;
  verbiage: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  formId: string;
}
