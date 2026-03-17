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
import uuid from "react-uuid";
import { actionButtonText } from "./modalLogic";
import { calculationTableDynamicTotalsOnChange, getFieldParts } from "utils";

export const AddEditCalculationModal = ({
  dynamicTemplateId,
  form,
  modalDisclosure,
  report,
  selectedId,
  tableId,
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

    const submissionData = keys.reduce((data, key) => {
      const { fieldType } = getFieldParts(key);
      data[fieldType] = displayData[key];
      return data;
    }, {} as AnyObject);

    const dynamicFieldId = selectedId || uuid();
    const percentage = submissionData.percentageOverride || 100;

    const totals = calculationTableDynamicTotalsOnChange({
      dynamicFieldId,
      dynamicTemplateId,
      fieldData: report?.fieldData || {},
      fieldValue: submissionData.totalComputable,
      isPercentageOverrideUpdated: true,
      percentage,
      percentageOverride: submissionData.percentageOverride,
      tableId,
    });

    const dynamicFieldTotals = totals[dynamicTemplateId];
    const calculatedTotals = dynamicFieldTotals.find(
      (field: DynamicFieldShape) => field.id === dynamicFieldId
    );

    const updatedField = {
      id: dynamicFieldId,
      // Saved data
      ...templateFieldData[currentFieldIndex],
      // Calculated data
      ...calculatedTotals,
      // Entered data
      ...submissionData,
    };

    if (currentFieldIndex !== -1) {
      templateFieldData[currentFieldIndex] = updatedField;
    } else {
      templateFieldData.push(updatedField);
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
        ...totals,
        [dynamicTemplateId]: templateFieldData,
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
      data-testid="add-calculation-modal"
      formId={form.id}
      handleSubmit={submitForm}
      modalDisclosure={modalDisclosure}
      nestedForm={true}
      submitButtonDisabled={submitting}
      submitting={submitting}
    >
      <Form
        data-testid="add-calculation-form"
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
  report?: ReportShape;
  selectedId?: string;
  tableId: string;
  userIsAdmin?: boolean;
}
