export default {
  missingEntry: {
    noResponse: "Not answered",
    notApplicable: "Not applicable",
  },
  reportBanner: {
    intro: "Click below to export or print WP shown here",
    pdfButton: "Download PDF",
  },
  metadata: {
    author: "CMS",
    subject: "MFP Program Work Plan",
    language: "English",
  },
  reportPage: {
    heading: "MFP Program Work Plan for ",
    metadataTableHeaders: {
      submissionName: "Submission Name",
      dueDate: "Due date",
      lastEdited: "Last edited",
      status: "Status",
      editedBy: "Edited by",
    },
    combinedDataTable: {
      title: "Exclusion of CHIP from WP",
      subtitle:
        "Enrollees in separate CHIP programs funded under Title XXI should not be reported in the WP. Please check this box if the state is unable to remove information about Separate CHIP enrollees from its reporting on this program.",
    },
  },
  tableHeaders: {
    indicator: "Indicator",
    response: "Response",
  },
  /**
   * TODO FIXME OBVIOUSLY INCORRECT
   *
   * If this object has no entries, then ExportedModalOverlayReportSection
   * will have an empty array for `headerLabels`,
   * which will mean an empty array for `headRow` in Table,
   * which will mean a <tr> with no children,
   * which is an accessibility issue.
   *
   * Reproduce by deleting the junk below and running the axe unit tests.
   */
  modalOverlayTableHeaders: {
    hello: "world",
    TODO: "fixme",
    required: "for accessibility",
    definitely: "DO NOT MERGE",
  },
  emptyEntityMessage: {
    evaluationPlan: "Objectives: 0  - No objectives added",
    fundingSources: "Funding sources: 0 - No funding sources added",
  },
  dashboardTitle: {
    evaluationPlan: "Objectives total count: ",
    fundingSources: "Funding sources: ",
  },
};
