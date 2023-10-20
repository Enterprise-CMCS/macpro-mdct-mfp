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
} from "types";
import {
  entityWasUpdated,
  filterFormData,
  getEntriesToClear,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";

export const AddEditEntityModal = ({
  entityType,
  entityName,
  form,
  verbiage,
  selectedEntity,
  modalDisclosure,
}: Props) => {
  const { report } = useStore();
  const { updateReport } = useContext(ReportContext);
  const { full_name } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  const writeEntity = async (enteredData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");

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
    const currentEntities = [...(report?.fieldData?.[entityType] || [])];
    const filteredFormData = filterFormData(
      enteredData,
      form.fields.filter(isFieldElement)
    );
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
        ...currentEntities[selectedEntityIndex],
        ...filteredFormData,
      };

      updatedEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
        updatedEntities[selectedEntityIndex],
        entriesToClear
      );

      dataToWrite.fieldData = {
        [entityType]: updatedEntities,
      };

      const shouldSave = entityWasUpdated(
        report?.fieldData?.[entityType][selectedEntityIndex],
        updatedEntities[selectedEntityIndex]
      );
      if (shouldSave) await updateReport(reportKeys, dataToWrite);
    } else {
      // create new entity
      dataToWrite.fieldData = {
        [entityType]: [...currentEntities, { id: uuid(), ...filteredFormData }],
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
    if (entityName) {
      title += entityName;
    }
    return title;
  };

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
        actionButtonText: submitting ? <Spinner size="md" /> : "Save & close",
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-entity-form"
        id={form.id}
        formJson={form}
        formData={selectedEntity}
        onSubmit={writeEntity}
        validateOnRender={false}
        dontReset={true}
      />
      <Text sx={sx.bottomModalMessage}>{verbiage.addEditModalMessage}</Text>
    </Modal>
  );
};

interface Props {
  entityType: string;
  entityName?: string;
  form: FormJson;
  verbiage: AnyObject;
  selectedEntity?: EntityShape;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}

const sx = {
  bottomModalMessage: {
    fontSize: "xs",
    color: "palette.primary_darker",
    marginTop: "1rem",
    marginBottom: "-1rem",
  },
};
