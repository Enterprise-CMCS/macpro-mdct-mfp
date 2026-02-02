//note: this file is more of a temporary fix until we figure out a better way to handle deeply nested forms
import { useContext, useState } from "react";
import uuid from "react-uuid";
// components
import { Form, Modal, ReportContext } from "components";
import { Text, Spinner } from "@chakra-ui/react";
// utils
import {
  AnyObject,
  EntityShape,
  FormJson,
  isFieldElement,
  ReportStatus,
  ReportType,
} from "types";
import {
  entityWasUpdated,
  filterFormData,
  getEntriesToClear,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";

export const AddEditOverlayEntityModal = ({
  entityType,
  entityName,
  entityIdLookup,
  form,
  verbiage,
  selectedEntity,
  modalDisclosure,
  userDisabled,
}: Props) => {
  const { report } = useStore();
  const { updateReport } = useContext(ReportContext);
  const { full_name } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  //using the entityTypes as a path list, recursively go through each object layer to find the desired objectKey
  const recusiveFindAndUpdate = (
    index: number,
    data: any,
    entityPath: string[],
    newEntity: AnyObject
  ) => {
    //if index is at the last avaliable path, that is the entityType we want to look at
    if (data && index === entityPath.length - 1) {
      data[entityPath[index]] = newEntity;
    } else {
      const currentEntityType = entityPath[index];
      if (entityIdLookup) {
        const currentEntity = data[currentEntityType].find(
          (entity: EntityShape) =>
            entity.id === entityIdLookup[currentEntityType]
        );
        recusiveFindAndUpdate(index + 1, currentEntity, entityPath, newEntity);
      }
    }
  };

  const findEntity = (data: AnyObject, entityTypes: string[]) => {
    let currentEntities: any = data;
    entityTypes.forEach((type, index) => {
      if (index < entityTypes.length - 1) {
        if (
          currentEntities?.[type] &&
          typeof currentEntities?.[type] === "object"
        ) {
          currentEntities = currentEntities?.[type]?.find(
            (entity: any) => entity.id === entityIdLookup?.[type]
          );
        }
      } else {
        currentEntities = [...(currentEntities[type] || [])];
      }
    });
    return currentEntities;
  };

  const writeEntity = async (enteredData: any) => {
    //do not try to save if the user has disabled editing
    if (userDisabled) {
      modalDisclosure.onClose();
      return;
    }

    setSubmitting(true);
    const reportKeys = {
      reportType: report?.reportType,
      state: report?.state,
      id: report?.id,
    };
    let dataToWrite = {
      metadata: {
        lastAlteredBy: full_name,
        status: ReportStatus.IN_PROGRESS,
      },
      fieldData: {},
    };

    const entityTypes: string[] =
      typeof entityType === "string" ? [entityType] : (entityType as string[]);

    //try to transverse the object if there are layers
    let currentEntities = findEntity(report?.fieldData!, entityTypes);

    const filteredFormData = filterFormData(
      enteredData,
      form.fields.filter(isFieldElement)
    );

    //create a hardcopy of the fieldData
    const fieldDataObject: any = structuredClone(report?.fieldData);

    if (selectedEntity?.id) {
      // if existing entity selected, edit
      const entriesToClear = getEntriesToClear(
        enteredData,
        form.fields.filter(isFieldElement)
      );
      const selectedEntityIndex = currentEntities.findIndex(
        (entity: EntityShape) => entity.id === selectedEntity.id
      );
      const updatedEntities = currentEntities;
      updatedEntities[selectedEntityIndex] = {
        id: selectedEntity.id,
        type: selectedEntity.type,
        ...currentEntities[selectedEntityIndex],
        ...filteredFormData,
      };
      updatedEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
        updatedEntities[selectedEntityIndex],
        entriesToClear
      );

      //using shallow update to modify the copied report data
      recusiveFindAndUpdate(0, fieldDataObject, entityTypes, updatedEntities);

      dataToWrite.fieldData = {
        [entityType[0]]: fieldDataObject?.[entityType[0]],
      };
      const shouldSave = entityWasUpdated(
        findEntity(report?.fieldData!, entityTypes),
        updatedEntities[selectedEntityIndex]
      );
      if (shouldSave) await updateReport(reportKeys, dataToWrite);
    } else {
      const newEntityData = [
        ...currentEntities,
        { id: uuid(), ...filteredFormData },
      ];

      //using shallow update to modify the copied report data
      recusiveFindAndUpdate(0, fieldDataObject, entityTypes, newEntityData);

      // create new entity
      dataToWrite.fieldData = {
        [entityType[0]]: fieldDataObject?.[entityType[0]],
      };
      await updateReport(reportKeys, dataToWrite);
    }

    setSubmitting(false);
    modalDisclosure.onClose();
  };

  const modalTitle = () => {
    let title;
    selectedEntity?.id
      ? (title = verbiage.addEditModalEditTitle)
      : (title = verbiage.addEditModalAddTitle);
    if (report?.reportType === ReportType.WP && entityName) {
      title = `${title} ${entityName}`;
    } else if (
      report?.reportType === ReportType.SAR &&
      selectedEntity?.objectiveProgress_objectiveName
    ) {
      title = `${title} ${selectedEntity.objectiveProgress_objectiveName}`;
    }
    return title;
  };

  const objectiveProgressWithTargets =
    selectedEntity?.objectiveProgress_includesTargets?.[0]?.value === "Yes";

  return (
    <Modal
      data-testid="add-edit-entity-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: modalTitle(),
        subheading: verbiage.addEditModalHint
          ? verbiage.addEditModalHint
          : undefined,
        actionButtonText: submitting ? <Spinner size="md" /> : "Save",
        closeButtonText: "Cancel",
      }}
      submitButtonDisabled={userDisabled}
    >
      <Form
        data-testid="add-edit-entity-form"
        id={form.id}
        formJson={form}
        formData={selectedEntity}
        onSubmit={writeEntity}
        validateOnRender={false}
        dontReset={true}
        disabled={true}
      />
      {objectiveProgressWithTargets && (
        <Text sx={sx.bottomModalMessage}>{verbiage.addEditModalMessage}</Text>
      )}
    </Modal>
  );
};

interface Props {
  entityType: string | string[];
  entityName?: string;
  entityIdLookup?: AnyObject;
  form: FormJson;
  verbiage: AnyObject;
  selectedEntity?: EntityShape;
  userDisabled?: boolean;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}

const sx = {
  bottomModalMessage: {
    fontSize: "xs",
    color: "primary_darker",
    marginTop: "spacer2",
    marginBottom: "-1rem",
  },
};
