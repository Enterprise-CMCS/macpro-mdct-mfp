import { useContext, useState } from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal, ReportContext } from "components";

// types
import { AnyObject, EntityShape, ReportStatus } from "types";
import { renderHtml, useStore } from "utils";

export const DeleteEntityModal = ({
  entityType,
  selectedEntity,
  verbiage,
  modalDisclosure,
}: Props) => {
  const { report } = useStore();
  const { updateReport } = useContext(ReportContext);
  const { full_name } = useStore().user ?? {};
  const [deleting, setDeleting] = useState<boolean>(false);

  const deleteProgramHandler = async () => {
    setDeleting(true);
    const reportKeys = {
      reportType: report?.reportType,
      state: report?.state,
      id: report?.id,
    };
    const currentEntities = report?.fieldData?.[entityType] || [];
    const updatedEntities = currentEntities.filter(
      (entity: EntityShape) => entity != selectedEntity
    );
    await updateReport(reportKeys, {
      metadata: {
        lastAlteredBy: full_name,
        status: ReportStatus.IN_PROGRESS,
      },
      fieldData: {
        [entityType]: updatedEntities,
      },
    });
    setDeleting(false);
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
  entityType: string;
  selectedEntity?: EntityShape;
  verbiage: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
