import { useContext } from "react";
// components
import { Modal, ReportContext } from "components";
// types
import { ReportStatus, EntityShape, EntityDetailsOverlayShape } from "types";
//utils
import {
  entityWasUpdated,
  renderHtml,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";

export const CloseEntityModal = ({
  route,
  selectedEntity,
  modalDisclosure,
}: Props) => {
  const { report } = useStore();
  const { full_name, state } = useStore().user ?? {};
  const { updateReport } = useContext(ReportContext);
  const { entityType, verbiage } = route;
  const modalInfo = verbiage.closeOutModal;

  const onConfirmHandler = async () => {
    const reportKeys = {
      reportType: report?.reportType,
      state: state,
      id: report?.id,
    };

    let dataToWrite = {
      metadata: {
        lastAlteredBy: full_name,
        status: ReportStatus.IN_PROGRESS,
      },
      fieldData: {},
    };

    const currentEntities = [...(report?.fieldData?.[entityType] || [])];

    if (selectedEntity?.id) {
      const selectedEntityIndex = currentEntities.findIndex(
        (entity: EntityShape) => entity.id === selectedEntity.id
      );
      const updatedEntities = currentEntities;

      updatedEntities[selectedEntityIndex] = {
        id: selectedEntity.id,
        ...currentEntities[selectedEntityIndex],
        isInitiativeClosed: true,
      };

      updatedEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
        updatedEntities[selectedEntityIndex],
        []
      );

      dataToWrite.fieldData = { [entityType]: updatedEntities };
      const shouldSave = entityWasUpdated(
        report?.fieldData?.[entityType][selectedEntityIndex],
        updatedEntities[selectedEntityIndex]
      );
      if (shouldSave) await updateReport(reportKeys, dataToWrite);
      modalDisclosure.onClose();
    }
  };

  return (
    <Modal
      modalDisclosure={modalDisclosure}
      content={{
        heading:
          modalInfo?.closeOutModalTitle + selectedEntity?.initiative_name,
        actionButtonText: modalInfo?.closeOutModalConfirmButtonText,
        closeButtonText: "Cancel",
      }}
      onConfirmHandler={onConfirmHandler}
    >
      {renderHtml(modalInfo?.closeOutModalBodyText)}
    </Modal>
  );
};

interface Props {
  route: EntityDetailsOverlayShape;
  selectedEntity?: EntityShape;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
