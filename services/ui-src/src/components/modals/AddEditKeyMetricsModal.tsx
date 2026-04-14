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
  dynamicTemplateId,
  form,
  modalDisclosure,
  report,
  selectedId,
  currentEntityId,
  userIsAdmin = false,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { updateReport } = useContext(ReportContext);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<AnyObject>({});

  const isReportSubmitted = report?.status === ReportStatus.SUBMITTED;
  const viewOnly = userIsAdmin || isReportSubmitted;

  const templateFieldData = report?.fieldData?.[dynamicTemplateId] || [];
  const currentFieldIndex = templateFieldData.findIndex(
    (field: DynamicFieldShape) => field.id === selectedId
  );

  useEffect(() => {
    const fieldData = templateFieldData[currentFieldIndex] || {};
    const keys = Object.keys(fieldData);
    const updatedFormData = keys.reduce((data, key) => {
      data[`${dynamicTemplateId}-${key}`] = fieldData[key];
      return data;
    }, {} as AnyObject);

    setFormData(updatedFormData);
    setIsEditing(currentFieldIndex !== -1);
  }, [currentFieldIndex, dynamicTemplateId]);

  const handleSubmit = async (enteredData: AnyObject) => {
    if (viewOnly) {
      modalDisclosure.onClose();
      return;
    }

    setSubmitting(true);

    const keys = Object.keys(enteredData);
    const displayData = { ...formData, ...enteredData };
    setFormData(displayData);

    let submissionData = keys.reduce((data, key) => {
      const { fieldType } = getFieldParts(key);
      data[fieldType] = displayData[key];
      return data;
    }, {} as AnyObject);

    submissionData = {
      ...submissionData,
      baselinePeriod: `${submissionData.baselineStartDate} - ${submissionData.baselineEndDate}`,
    };

    const dynamicFieldId = selectedId || uuid();

    const updatedField = {
      id: dynamicFieldId,
      // Saved data
      ...templateFieldData[currentFieldIndex],
      // Entered data
      ...submissionData,
    };

    if (currentFieldIndex !== -1) {
      templateFieldData[currentFieldIndex] = updatedField;
    } else {
      templateFieldData.push(updatedField);
    }

    if (report) {
      const currentInitiativeIndex = report?.fieldData.initiative.findIndex(
        (init: any) => {
          return init.id === currentEntityId;
        }
      );

      var targetInitiative =
        report?.fieldData.initiative[currentInitiativeIndex];

      // check if this is the first Key Metric being added to Initiative
      if (!Object.hasOwn(targetInitiative, dynamicTemplateId)) {
        const keyMetrics = [updatedField];
        targetInitiative = {
          ...targetInitiative,
          [dynamicTemplateId]: keyMetrics,
        };
        // if not, push new key metric to existing array
      } else {
        targetInitiative[dynamicTemplateId].push(updatedField);
      }

      report.fieldData.initiative[currentInitiativeIndex] = targetInitiative;
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
        data-testid="add-key-metrics-form"
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
  dynamicTemplateId: string;
  form: FormJson;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  currentEntityId: string;
  report?: ReportShape;
  selectedId?: string;
  tableId: string;
  userIsAdmin?: boolean;
}
