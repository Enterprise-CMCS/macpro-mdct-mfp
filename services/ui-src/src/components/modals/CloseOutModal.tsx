import { useContext, useRef, useState } from "react";
// components
import { Alert, Form, Modal, ReportContext } from "components";
// types
import {
  AlertTypes,
  AnyObject,
  EntityShape,
  ErrorVerbiage,
  FormJson,
  ReportStatus,
} from "types";
// utils
import {
  entityWasUpdated,
  filterFormData,
  getEntriesToClear,
  isClosedInitiative,
  isFieldElement,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";

export const CloseOutModal = ({
  disabled = false,
  entityType,
  errorMessage,
  form,
  heading,
  modalDisclosure,
  selectedEntity,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { updateReport } = useContext(ReportContext);
  const { report, setSelectedEntity } = useStore();
  const { full_name, state } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (enteredData: AnyObject) => {
    if (disabled) {
      modalDisclosure.onClose();
      return;
    }

    setSubmitting(true);

    const currentEntities = [...(report?.fieldData?.[entityType] || [])];
    const selectedEntityIndex = currentEntities.findIndex(
      (entity: EntityShape) => entity.id === selectedEntity?.id
    );

    if (selectedEntityIndex === -1) {
      setSubmitting(false);
      modalDisclosure.onClose();
      return;
    }

    const closeOutFields = form.fields.filter(isFieldElement);
    const filteredFormData = filterFormData(enteredData, closeOutFields);
    const entriesToClear = getEntriesToClear(enteredData, closeOutFields);
    const closeOutInitiative = isClosedInitiative(enteredData)
      ? { closedBy: full_name, isInitiativeClosed: true }
      : {};

    let newEntity = {
      ...currentEntities[selectedEntityIndex],
      ...filteredFormData,
      ...closeOutInitiative,
    };
    newEntity = setClearedEntriesToDefaultValue(newEntity, entriesToClear);

    const newEntities = [...currentEntities];
    newEntities[selectedEntityIndex] = newEntity;

    const shouldSave = entityWasUpdated(
      currentEntities[selectedEntityIndex],
      newEntity
    );
    if (shouldSave) {
      const reportKeys = {
        reportType: report?.reportType,
        state,
        id: report?.id,
      };
      await updateReport(reportKeys, {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: full_name,
        },
        fieldData: { [entityType]: newEntities },
      });
    }

    setSelectedEntity(newEntity);
    setSubmitting(false);
    modalDisclosure.onClose();
  };

  const submitForm = (event: SubmitEvent) => {
    event.preventDefault();
    formRef.current?.requestSubmit();
  };

  return (
    <Modal
      content={{
        heading,
        actionButtonText: disabled ? "Return" : "Save",
        closeButtonText: "Cancel",
      }}
      formId={form.id}
      handleSubmit={submitForm}
      modalDisclosure={modalDisclosure}
      nestedForm={true}
      submitButtonDisabled={submitting}
      submitting={submitting}
    >
      <Form
        disabled={disabled}
        dontReset={false}
        formData={selectedEntity}
        formJson={form}
        id={form.id}
        nestedForm={true}
        onSubmit={(data: AnyObject) => handleSubmit(data)}
        ref={formRef}
        validateOnRender={false}
      />
      {errorMessage && (
        <Alert
          description={errorMessage.description}
          status={AlertTypes.WARNING}
          title={errorMessage.title}
        />
      )}
    </Modal>
  );
};

interface Props {
  disabled?: boolean;
  entityType: string;
  errorMessage?: ErrorVerbiage;
  form: FormJson;
  heading: string;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  selectedEntity?: EntityShape;
}
