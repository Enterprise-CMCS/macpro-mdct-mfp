import { useContext, useEffect, useRef, useState } from "react";
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
  disabled = false,
  dynamicTemplateId,
  entityType,
  form,
  modalDisclosure,
  parentEntityId,
  report,
  userIsAdmin = false,
}: Props) => {
  const { updateReport } = useContext(ReportContext);

  const [currentEntityFieldData, setCurrentEntityFieldData] = useState<
    AnyObject[]
  >([]);
  const [currentEntityIndex, setCurrentEntityIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<AnyObject>(
    form.fields.reduce(
      (acc: any, curr) => ((acc[curr.id] = undefined), acc),
      {},
    ),
  );

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isReportSubmitted = report?.status === ReportStatus.SUBMITTED;
  const viewOnly = disabled || userIsAdmin || isReportSubmitted;

  const parentEntityFieldData = report?.fieldData?.[entityType] || [];
  const parentEntityIndex = parentEntityFieldData.findIndex(
    (field: DynamicFieldShape) => field.id === parentEntityId,
  );

  useEffect(() => {
    const fieldData =
      parentEntityFieldData?.[parentEntityIndex]?.[dynamicTemplateId] || [];
    setCurrentEntityFieldData(fieldData);

    const index = fieldData.findIndex(
      (t: DynamicFieldShape) => t.id === currentEntityId,
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
      modalDisclosure.onClose(false);
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

    const dynamicFieldId = currentEntityId || crypto.randomUUID();

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

    modalDisclosure.onClose(true);
  };

  return (
    <Modal
      data-testid="add-key-metrics-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      submitting={submitting}
      submitButtonDisabled={submitting}
      content={{
        heading: isEditing ? form.heading?.edit : form.heading?.add,
        subheading: isEditing
          ? form.heading?.subheadingEdit
          : form.heading?.subheading,
        actionButtonText: actionButtonText(submitting, viewOnly),
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-key-metrics-form"
        id={form.id}
        formJson={form}
        formData={form.fields.reduce(
          (acc: any, curr) => ((acc[curr.id] = undefined), acc),
          {},
        )}
        onSubmit={handleSubmit}
        validateOnRender={false}
        disabled={viewOnly}
        dontReset={false}
      />
    </Modal>
  );
};

interface Props {
  currentEntityId?: string;
  disabled?: boolean;
  dynamicTemplateId: string;
  entityType: string;
  form: FormJson;
  modalDisclosure: {
    isOpen: boolean;
    onClose: Function;
  };
  report?: ReportShape;
  parentEntityId?: string;
  userIsAdmin?: boolean;
}
