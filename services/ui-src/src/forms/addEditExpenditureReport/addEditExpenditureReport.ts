import { FormJson, ReportFormFieldType, ValidationType } from "types";

export const addEditExpenditureReport: FormJson = {
  id: "aea",
  options: {
    mode: "onChange",
  },
  heading: {
    edit: "Continue MFP Expenditure Report",
    add: "Add new MFP Expenditure Report",
    subheading:
      "Start a new MFP Expenditure Report for the reporting period. Once you complete this MFP Expenditure Report and CMS approves it, you’ll be able to continue updating it by selecting “Continue from previous period” or completely reset your MFP report information and start from a blank form. You will be able to view all MFP Expenditure Reports from previous periods.",
    subheadingEdit:
      "Update your MFP Work Plan for the next period, starting from the information in your last approved MFP Work Plan by selecting “Continue from previous period”. “Cancel” and use “Reset MFP Work Plan” only when you want to completely reset your MFP program information and start from a blank form. You will still be able to view the MFP Work Plans from all previous periods.",
  },
  fields: [
    {
      id: "reportPeriodYear",
      type: ReportFormFieldType.RADIO,
      validation: ValidationType.RADIO,
      props: {
        label: "Reporting Period Year",
        hint: "Select the reporting period year.",
        choices: [],
      },
    },
    {
      id: "reportPeriod",
      type: ReportFormFieldType.RADIO,
      validation: ValidationType.RADIO,
      props: {
        label: "Reporting Period",
        hint: "Select the reporting period.",
        choices: [
          {
            id: "reportPeriod-1",
            label: "First reporting period (January 1 - June 30)",
            name: "1",
            value: "1",
          },
          {
            id: "reportPeriod-2",
            label: "Second reporting period (July 1 - December 31)",
            name: "2",
            value: "2",
          },
        ],
      },
    },
  ],
};
