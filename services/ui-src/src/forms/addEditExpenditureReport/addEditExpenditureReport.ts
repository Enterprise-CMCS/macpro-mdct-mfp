import { FormJson, ReportFormFieldType, ValidationType } from "types";

export const addEditExpenditureReport: FormJson = {
  id: "aea",
  options: {
    mode: "onChange",
  },
  heading: {
    edit: "Continue MFP Expenditure Report",
    add: "Add new MFP Expenditure Report submission",
    subheading:
      "Add a new report to start a blank report or copy an existing report.",
    subheadingEdit: "[hint text]",
  },
  fields: [
    {
      id: "reportYear",
      type: ReportFormFieldType.DROPDOWN,
      validation: ValidationType.DROPDOWN,
      props: {
        label: "Reporting Year",
        hint: "",
        options: [],
      },
    },
    {
      id: "reportPeriod",
      type: ReportFormFieldType.DROPDOWN,
      validation: ValidationType.DROPDOWN,
      props: {
        label: "Reporting Period",
        hint: "",
        options: [
          {
            label: "Q1: January 1st to March 31st",
            value: "1",
          },
          {
            label: "Q2: April 1 to June 30",
            value: "2",
          },
          {
            label: "Q3: July 1 to September 30",
            value: "3",
          },
          {
            label: "Q4: October 1 to December 31",
            value: "4",
          },
        ],
      },
    },
  ],
};
