import { useContext, useEffect, useRef, useState } from "react";
import uuid from "react-uuid";
// components
import { Form, Modal, ReportContext } from "components";
// types
import {
  AnyObject,
  DynamicFieldShape,
  FormJson,
  ReportShape,
  ReportStatus,
} from "types";
// utils
import { actionButtonText } from "./modalLogic";
import { getFieldParts } from "utils";

export const AddEditKeyMetricsModal = ({
  currentEntityId,
  dynamicTemplateId,
  entityType,
  form,
  modalDisclosure,
  parentEntityId,
  report,
  userIsAdmin = false,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { updateReport } = useContext(ReportContext);

  const [currentEntityFieldData, setCurrentEntityFieldData] = useState<
    AnyObject[]
  >([]);
  const [currentEntityIndex, setCurrentEntityIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<AnyObject>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isReportSubmitted = report?.status === ReportStatus.SUBMITTED;
  const viewOnly = userIsAdmin || isReportSubmitted;

  const parentEntityFieldData = report?.fieldData?.[entityType] || [];
  const parentEntityIndex = parentEntityFieldData.findIndex(
    (field: DynamicFieldShape) => field.id === parentEntityId
  );

  useEffect(() => {
    const fieldData =
      parentEntityFieldData?.[parentEntityIndex]?.[dynamicTemplateId] || [];
    setCurrentEntityFieldData(fieldData);

    const index = fieldData.findIndex(
      (t: DynamicFieldShape) => t.id === currentEntityId
    );
    setCurrentEntityIndex(index);

    const currentEntity = fieldData[index] || {};
    const keys = Object.keys(currentEntity);
    const updatedFormData = keys.reduce((data, key) => {
      data[`${dynamicTemplateId}-${key}`] = currentEntity[key];
      return data;
    }, {} as AnyObject);

    setFormData(updatedFormData);
    setIsEditing(!!currentEntityId);
  }, [currentEntityId, parentEntityIndex, dynamicTemplateId]);

  const handleSubmit = async (enteredData: AnyObject) => {
    if (viewOnly) {
      modalDisclosure.onClose();
      return;
    }

    setSubmitting(true);

    const keys = Object.keys(enteredData);
    const displayData = { ...formData, ...enteredData };
    setFormData(displayData);

    const submissionData = keys.reduce((data, key) => {
      const { fieldType } = getFieldParts(key);
      data[fieldType] = displayData[key];
      return data;
    }, {} as AnyObject);

    const dynamicFieldId = currentEntityId || uuid();

    const updatedEntity = {
      id: dynamicFieldId,
      // Saved data
      ...currentEntityFieldData[currentEntityIndex],
      // Entered data
      ...submissionData,
    };

    if (currentEntityIndex !== -1) {
      currentEntityFieldData[currentEntityIndex] = updatedEntity;
    } else {
      currentEntityFieldData.push(updatedEntity);
    }

    const updatedParentEntity = {
      ...parentEntityFieldData[parentEntityIndex],
      [dynamicTemplateId]: currentEntityFieldData,
    };

    if (parentEntityIndex !== -1) {
      parentEntityFieldData[parentEntityIndex] = updatedParentEntity;
    } else {
      parentEntityFieldData.push(updatedParentEntity);
    }

    const reportKeys = {
      reportType: report?.reportType,
      state: report?.state,
      id: report?.id,
    };

    const dataToWrite = {
      ...report,
      fieldData: {
        ...report?.fieldData,
        [entityType]: parentEntityFieldData,
      },
    };

    await updateReport(reportKeys, dataToWrite);

    setFormData({});
    setIsEditing(false);
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
        heading: isEditing ? form.heading?.edit : form.heading?.add,
        subheading: isEditing
          ? form.heading?.subheadingEdit
          : form.heading?.subheading,
        actionButtonText: actionButtonText(submitting, viewOnly),
        closeButtonText: "Cancel",
      }}
      data-testid="add-key-metrics-modal"
      formId={form.id}
      handleSubmit={submitForm}
      modalDisclosure={modalDisclosure}
      nestedForm={true}
      submitButtonDisabled={submitting}
      submitting={submitting}
    >
      <Form
        data-testid="add-edit-key-metrics-form"
        disabled={viewOnly}
        dontReset={false}
        formJson={form}
        formData={formData}
        id={form.id}
        nestedForm={true}
        onSubmit={(data: AnyObject) => handleSubmit(data)}
        ref={formRef}
        validateOnRender={false}
      />
    </Modal>
  );
};

interface Props {
  currentEntityId?: string;
  dynamicTemplateId: string;
  entityType: string;
  form: FormJson;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  report?: ReportShape;
  parentEntityId?: string;
  userIsAdmin?: boolean;
}
