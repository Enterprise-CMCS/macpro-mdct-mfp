export const mockStandardSTSReportPageJson = {
  name: "state-and-territory-specific-initiatives",
  path: "/wp/state-and-territory-specific-initiatives/initiatives",
  pageType: "modalOverlay",
  entityType: "entityType",
  verbiage: {
    intro: {
      section: "",
      subsection: "State and Territory-Specific Initiatives",
      info: "See previous page for detailed instructions.",
      exportSectionHeader: "exportSectionHeader",
    },
    addEntityButtonText: "Add Initiatives",
    dashboardTitle: "Initative Total Count",
    countEntitiesInTitle: false,
    tableHeader: "tableHeader",
    addEditModalHint: "addEditModalHint",
    emptyDashboardText: "Empty"
  },
  modalForm: {
    id: "mock-modal-form-id",
    fields: [
      {
        id: "mock-modal-text-field",
        type: "text",
        validation: "text"
      },
    ],
  },
  overlayForm: {
    id: "mock-drawer-form-id",
    fields: [
      {
        id: "mock-drawer-text-field",
        type: "text",
        validation: "text",
        props: {
          label: "mock drawer text field",
        },
      },
    ],
  },
};
