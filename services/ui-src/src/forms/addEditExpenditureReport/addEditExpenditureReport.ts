import { FormJson, ReportFormFieldType, ValidationType } from "types";

export const addEditExpenditureReport: FormJson = {
  id: "aea",
  options: {
    mode: "onChange",
  },
  heading: {
    edit: "Edit MFP Financial Reporting Form submission",
    add: "Add new MFP Financial Reporting Form submission",
    subheading:
      "Add a new report to start a blank report, or to copy an existing one.",
    subheadingEdit: "[hint text]",
  },
  fields: [
    {
      id: "copyReport",
      type: ReportFormFieldType.DROPDOWN,
      validation: ValidationType.DROPDOWN_OPTIONAL,
      props: {
        label: "If you want to copy an existing report, select one (optional)",
        hint: "This will pre-populate any fields you’ve added and settings you’ve applied, but will not copy quarterly financial data.",
        options: [],
      },
    },
    {
      id: "reportYear",
      type: ReportFormFieldType.DROPDOWN,
      validation: ValidationType.DROPDOWN,
      props: {
        label: "Reporting year",
        hint: "",
        options: [],
      },
    },
    {
      id: "reportPeriod",
      type: ReportFormFieldType.DROPDOWN,
      validation: ValidationType.DROPDOWN,
      props: {
        label: "Reporting period",
        hint: "",
        options: [
          {
            label: "Q1 (Quarter 1): January 1st to March 31st",
            value: "1",
          },
          {
            label: "Q2 (Quarter 2): April 1st to June 30th",
            value: "2",
          },
          {
            label: "Q3 (Quarter 3): July 1st to September 30th",
            value: "3",
          },
          {
            label: "Q4 (Quarter 4): October 1st to December 31st",
            value: "4",
          },
        ],
      },
    },
  ],
};
