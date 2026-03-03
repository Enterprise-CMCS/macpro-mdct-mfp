import { FormJson, ReportFormFieldType, ValidationType } from "types";

export const addSubRecipientForm: FormJson = {
  id: "add-sub-recipient-form",
  heading: {
    edit: "Edit Sub Recipient",
    add: "Add Sub Recipient",
    subheading: "",
    subheadingEdit: "",
  },
  fields: [
    {
      id: "subRecipient",
      type: ReportFormFieldType.TEXT,
      validation: ValidationType.TEXT,
      props: {
        label: "Sub Recipient",
      },
    },
    {
      id: "statementOfWork",
      type: ReportFormFieldType.TEXTAREA,
      validation: ValidationType.TEXT,
      props: {
        label: "Describe Statement of Work (SOW)",
        hint: "This is the hint text",
      },
    },
    {
      id: "expenditures",
      type: ReportFormFieldType.NUMBER,
      validation: ValidationType.NUMBER,
      props: {
        label: "Expenditures",
        mask: "currency",
      },
    },
    {
      id: "override",
      type: ReportFormFieldType.NUMBER,
      validation: ValidationType.NUMBER_OPTIONAL,
      props: {
        label: "Override % (optional)",
        mask: "percentage",
      },
    },
  ],
};
