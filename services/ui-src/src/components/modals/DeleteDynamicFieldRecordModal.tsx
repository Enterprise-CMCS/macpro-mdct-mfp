// components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";
// types
import { EntityShape, EntityType } from "types";

export const DeleteDynamicFieldRecordModal = ({
  selectedRecord,
  deleteRecord,
  entityType,
  modalDisclosure,
}: Props) => {
  const deleting = false;
  const fieldTypeMap: any = {
    plans: "plan",
  };

  const entityName = fieldTypeMap[entityType];

  const deleteProgramHandler = async () => {
    await deleteRecord(selectedRecord);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={deleteProgramHandler}
      modalDisclosure={modalDisclosure}
      submitting={deleting}
      content={{
        heading: `Delete ${entityName}`,
        actionButtonText: `Yes, delete ${entityName}`,
        closeButtonText: "Cancel",
      }}
    >
      <Text>
        Are you sure you want to delete this {entityName}? Once deleted it will
        also remove any additional information related to the {entityName}{" "}
        throughout the report.
      </Text>
    </Modal>
  );
};

interface Props {
  selectedRecord?: EntityShape;
  deleteRecord: Function;
  entityType: EntityType;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
