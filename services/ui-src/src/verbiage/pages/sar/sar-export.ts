export default {
  missingEntry: {
    noResponse: "Not answered",
    notApplicable: "Not applicable",
  },
  reportBanner: {
    intro: "Click below to export or print MFP SAR shown here",
    pdfButton: "Download PDF",
  },
  metadata: {
    author: "CMS",
    subject: "Semi-Annual Progress Report",
    language: "English",
  },
  reportPage: {
    heading: "Semi-Annual Progress Report (SAR) for",
    metadataTableHeaders: {
      submissionName: "Submission Name",
      dueDate: "Due date",
      lastEdited: "Last edited",
      editedBy: "Edited by",
      status: "Status",
    },
    combinedDataTable: {
      title: "Exclusion of CHIP from SAR",
      subtitle:
        "Enrollees in separate CHIP programs funded under Title XXI should not be reported in the SAR. Please check this box if the state is unable to remove information about Separate CHIP enrollees from its reporting on this program.",
    },
    sarDetailsTable: {
      headers: {
        indicator: "Indicator",
        response: "Response",
      },
      indicators: [
        "Associated MFP Work Plan",
        "Is this your state/territory's final MFP SAR for your period of performance in the MFP Demonstration?",
        "Select the target populations applicable to your state during this reporting period.",
      ],
    },
    reportTitle:
      "{{stateName}} Semi-Annual Progress Report (SAR) for {{reportYear}} - Period {{reportPeriod}}",
  },
  generalInformationTable: {
    headings: [
      "Resubmission Information",
      "Organization Information",
      "Authorized Organizational Representative (AOR)",
      "Project Director",
      "CMS Project Officer",
    ],
  },
  modalOverlayTableHeaders: {},
  tableHeaders: {
    number: "Number",
    indicator: "Indicator",
    response: "Response",
  },
  emptyEntityMessage: {
    accessMeasures: "0  - No access measures entered",
    sanctions: "0 - No sanctions entered",
    qualityMeasures: "0 - No quality & performance measures entered",
  },
  dashboardTitle: {
    objectiveProgress: "Objectives total count: ",
  },
};
