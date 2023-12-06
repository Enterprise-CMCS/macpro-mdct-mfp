import { useContext, useState } from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal, ReportContext } from "components";

// types
import { AnyObject, EntityShape, ReportStatus } from "types";
import { useStore } from "utils";

export const DeleteEntityModal = ({
  entityType,
  entityIdLookup,
  selectedEntity,
  verbiage,
  modalDisclosure,
  userDisabled,
}: Props) => {
  const { report, editable } = useStore();
  const { updateReport } = useContext(ReportContext);
  const { full_name } = useStore().user ?? {};
  const [deleting, setDeleting] = useState<boolean>(false);

  const removeSelectedEntity: any = (
    data: any,
    entityKey: string,
    id?: string
  ) => {
    //if entity is found in current data layer, do a filter to keep the entities that don't match the selected entity
    if (data[entityKey]) {
      data[entityKey] = data[entityKey].filter(
        (entity: EntityShape) => entity.id !== id
      );
    } else {
      //convert the lookup to only the key names
      const lookupKeys: string[] = entityIdLookup
        ? Object.keys(entityIdLookup)
        : [];
      // see if current keys in the entity matches any in the lookup
      const matchedKey: any = Object.keys(data).find((key: string) =>
        lookupKeys?.includes(key)
      );

      //if there's a match, use that to look for the next layer down in the object
      if (matchedKey) {
        const keyId: string = entityIdLookup![matchedKey];
        const currentIndex = data[matchedKey].findIndex(
          (entity: EntityShape) => entity.id === keyId
        );

        if (currentIndex >= 0) {
          data[matchedKey][currentIndex] = removeSelectedEntity(
            data[matchedKey][currentIndex],
            entityKey,
            id
          );
        }
      }
    }

    return data;
  };

  const deleteProgramHandler = async () => {
    setDeleting(true);
    const reportKeys = {
      reportType: report?.reportType,
      state: report?.state,
      id: report?.id,
    };

    const entityTypes: string[] =
      typeof entityType === "string" ? [entityType] : (entityType as string[]);

    const updatedEntities = removeSelectedEntity(
      structuredClone(report?.fieldData),
      entityTypes[entityTypes.length - 1],
      selectedEntity?.id
    );

    await updateReport(reportKeys, {
      metadata: {
        lastAlteredBy: full_name,
        status: ReportStatus.IN_PROGRESS,
      },
      fieldData: { ...updatedEntities },
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
      submitButtonDisabled={!editable || userDisabled}
    >
      <Text>{verbiage.deleteModalWarning}</Text>
    </Modal>
  );
};

interface Props {
  entityType: string | string[];
  entityIdLookup?: AnyObject;
  selectedEntity?: EntityShape;
  verbiage: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  userDisabled?: boolean;
}
