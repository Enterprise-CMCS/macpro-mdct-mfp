export const mockStandardSTSReportPageJson = {
  name: "state-and-territory-specific-initiatives",
  path: "/wp/state-and-territory-specific-initiatives/initiatives",
  pageType: "modalOverlay",
  entityType: "initiatives",
  verbiage: {
    intro: {
      section: "",
      subsection: "State and Territory-Specific Initiatives",
      info: [
        {
          type: "html",
          content: "See ",
        },
        {
          type: "internalLink",
          content: "previous page",
          props: {
            to: "/wp/state-and-territory-specific-initiatives/instructions",
          },
        },
        {
          type: "html",
          content: " for detailed instructions.",
        },
      ],
      exportSectionHeader: "exportSectionHeader",
    },
    addEntityButtonText: "Add Initiative",
    editEntityButtonText: "Edit name",
    addEditModalAddTitle: "Add initiative",
    addEditModalEditTitle: "Edit initiative",
    deleteModalTitle: "Are you sure you want to delete this initiative?",
    deleteModalConfirmButtonText: "Yes, delete initiative",
    deleteModalWarning:
      "Are you sure you want to proceed? You will lose all information entered for this initiative in the Work Plan. The initiative will remain in previously submitted Semi-Annual Reports if applicable. <br/><br/>To close a completed initiative out, select “Cancel” and then the “Close out” button in the listing.",
    enterEntityDetailsButtonText: "Edit",
    dashboardTitle: "Initative total count",
    countEntitiesInTitle: true,
    tableHeader: "Initaitve name <br/> Work Plan topic",
    addEditModalHint:
      "Provide the name of one initiative. You will be then be asked to complete details for this initiative including description, evaluation plan and funding sources.",
    emptyDashboardText: "Empty",
  },
  modalForm: {
    id: "add_initiative",
    fields: [
      {
        id: "initiative_name",
        type: "textarea",
        validation: "text",
        props: {
          label: "Initiative name",
        },
      },
      {
        id: "initiative_wpTopic",
        type: "radio",
        validation: "radio",
        props: {
          label: "Work Plan topic:",
          hint: "Note: Initiative topics with * are required and must be selected at least once across all initiatives.",
          choices: [
            {
              id: "VjQ0OFqior9Dxu5RRNiZ5u",
              label: "Transitions and transition coordination services*",
            },
            {
              id: "wbUsMMqVP7q1n10szK5h5S",
              label: "Housing-related supports*",
            },
            {
              id: "SdaFlF3DJyzKcHCCu3Zylm",
              label: "Quality measurement and improvement*",
            },
            {
              id: "8CpFrev6sMfRijIhafMj7V",
              label: "Self-direction(*if applicable)",
            },
            {
              id: "tVURShWTPfVKGU94QmIwDn",
              label: "Tribal Initiative (*if applicable)",
            },
            {
              id: "1k3EnM5WrizX3hsa6Zn85G",
              label: "Recruitment and enrollment",
            },
            {
              id: "dtybJ8ZucoIn7a4LnMpWg2",
              label: "Person-centered planning and services",
            },
            {
              id: "rSTGMVEOaJ4OZ6amTQetaa",
              label: "No Wrong Door systems",
            },
            {
              id: "8In9QpCC7O3XBkDOyB36vy",
              label: "Community transition support",
            },
            {
              id: "GCBzQ9GDWMwILW0sBQ2dhN",
              label: "Direct service workforce and caregivers",
            },
            {
              id: "K8WifjAU3SymG751jAvv6j",
              label: "Data-based decision-making",
            },
            {
              id: "39oSwSqVoDpLGbD9HnfUhg",
              label: "Financing approaches",
            },
            {
              id: "I9A6C2SY0Dk3ezfvywqqwB",
              label: "Stakeholder engagement",
            },
            {
              id: "2qjBuLtpA5pDvUM1HSHMVq",
              label: "Equity and SDOH",
            },
            {
              id: "18Wb9b2zMIF13pZwWstdJF",
              label: "Other, specify",
              children: [
                {
                  id: "initiative_wp_otherTopic",
                  type: "textarea",
                  validation: {
                    type: "text",
                    nested: true,
                    parentFieldName: "initiative_wpTopic",
                  },
                },
              ],
            },
          ],
        },
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
