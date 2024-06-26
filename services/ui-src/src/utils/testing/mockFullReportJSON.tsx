//temporary, delete when database is ready

import { ReportJson, ReportShape, ReportStatus } from "types";

export const mockFullReportJSON: ReportJson = {
  id: "2V2LLezUtxYOBRMEoiTp5r1O71X",
  type: "WP",
  name: "MFP Work Plan",
  basePath: "/wp",
  routes: [
    {
      name: "General Information",
      path: "/wp/general-information",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "",
          subsection: "General Information",
          info: [
            {
              type: "html",
              content:
                "The Money Follows the Person (MFP) Demonstration Work Plan is the state or territory’s road map for accomplishing the rebalancing objective described in section ",
            },
            {
              type: "externalLink",
              content: "6071(a)(1) of the Deficit Reduction Act (DRA)",
              props: {
                href: "https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf",
                target: "_blank",
                "aria-label":
                  "6071(a)(1) of the Deficit Reduction Act (DRA) (Link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                " as “increasing the use of home and community-based, rather than institutional, long-term care services.” The WP presents MFP Demonstration initiatives that support the state or territory’s unique rebalancing goals and objectives. The WP enables states or territories and Centers for Medicare & Medicaid Services (CMS) to monitor state or territory-specific initiatives throughout the grant and make course corrections where needed. While the WP describes state or territory initiatives and sets performance measures, the Semi-Annual Progress Report (SAR) will capture progress on these initiatives and performance measures, alongside other information. <br><br> A recipient submits an initial WP with the updated operational protocol for review and approval. The WP will be updated annually during Period 1 of SAR reporting (July–August). Recipients may also submit updates to the WP during Period 2 of SAR reporting (January–February) to reflect any planned changes in state or territory-specific initiatives or add new initiatives. Changes to the WP must be submitted to CMS for approval no later than 30 days prior to the planned date of implementation of the change and the proposed change(s) may not be implemented until approved. Approved changes will be integrated into the recipient’s SAR reporting for the following reporting period. Note that requests to change Transition Benchmark projections can be made once annually, during the July–August period. <br><br> CMS may amend or add new WP fields during the Demonstration period. For additional guidance on completing this form, please see the associated User Guide and Help File. ",
            },
          ],
        },
      },
      form: { id: "", fields: [] },
    },
    {
      name: "Transition Benchmarks",
      path: "/wp/transition-benchmarks",
      pageType: "modalDrawer",
      entityType: "targetPopulations",
      verbiage: {
        intro: {
          section: "",
          subsection: "Transition Benchmark Projections",
          info: [
            {
              type: "span",
              content:
                "Provide the projected number of transitions for target populations during each quarter. This number includes institutional residents who are discharged from an institution to a qualified residence during the reporting period, enroll in MFP, and being using Medicaid home and community-based services (HCBS).",
            },
          ],
        },
        dashboardTitle:
          "Report projected number of transitions for each target population",
        addEntityButtonText: "Add other target population",
        editEntityButtonText: "Edit name",
        readOnlyEntityButtonText: "View name",
        addEditModalAddTitle: "Add other target population",
        addEditModalEditTitle: "Edit other target population",
        deleteEntityButtonAltText: "Delete other target population",
        deleteModalTitle:
          "Are you sure you want to delete this target population?",
        deleteModalConfirmButtonText: "Yes, delete population",
        deleteModalWarning:
          "Are you sure you want to proceed? You will lose all information entered for this population in the Work Plan. The population will remain in previously submitted MFP Semi-Annual Reports if applicable.",
        entityUnfinishedMessage:
          "Complete the remaining indicators for this access measure by entering details.",
        enterEntityDetailsButtonText: "Edit",
        readOnlyEntityDetailsButtonText: "View",
        reviewPdfHint:
          "To view Transition Benchmark Totals by target population and by quarter, click <i>Review PDF</i> and it will open a summary in a new tab.",
        drawerTitle: "Report transition benchmarks for ",
        drawerInfo: [
          {
            type: "span",
            content:
              "Please provide the projected number of transitions for <i>[entity_name]</i> during each quarter. This number includes institutional residents who are discharged from an institution to a qualified residence during the reporting period, enroll in MFP, and begin using Medicaid HCBS.",
          },
          {
            type: "p",
            content:
              "Complete all fields and select the Save & close button to save this section.",
          },
        ],
      },
      modalForm: {
        id: "tb-modal",
        fields: [
          {
            id: "transitionBenchmarks_targetPopulationName",
            type: "text",
            validation: "text",
            props: {
              label: "Target population name",
              hint: 'Specify an "other" target population applicable to your MFP demonstration project. (e.g., HIV/AIDS, brain injury)',
            },
          },
        ],
      },
      drawerForm: {
        id: "tb-drawer",
        fields: [
          {
            id: "transitionBenchmarks_applicableToMfpDemonstration",
            type: "radio",
            validation: "radio",
            props: {
              label:
                "Is this target population applicable to your MFP Demonstration?",
              hint: "Enter 0 for quarters with no projected transitions. Enter N/A for quarters you do not expect to report.",
              choices: [
                {
                  id: "2UObIwERkSKEGVUU1g8E1v",
                  label: "No",
                },
                {
                  id: "2UObIuHjl15upf6tLcgcWd",
                  label: "Yes",
                  children: [
                    {
                      id: "quarterlyProjections_1",
                      type: "number",
                      nested: true,
                      parentFieldName:
                        "transitionBenchmarks_applicableToMfpDemonstration",
                      parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                      props: {
                        label: "2023 Q4",
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: "Transition Benchmark Strategy",
      path: "/wp/transition-benchmark-strategy",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "",
          subsection: "Transition Benchmark Strategy",
        },
      },
      form: {
        id: "2UkwX7CMrbfrcSF2YjiyfetUyIF",
        fields: [
          {
            id: "2Ukwki4yJ8wNNqz7KnvgNoTATkO",
            type: "textarea",
            validation: "text",
            props: {
              label:
                "Explain how you formulated your projected numbers, which should include descriptions of the data sources used, the time period for the analysis, and the methods used to project the number of transitions.",
            },
          },
          {
            id: "2Ukwj6bhkkok19JzSocDWLo1idj",
            type: "textarea",
            validation: "text",
            props: {
              label:
                "Provide additional detail on strategies or approaches the state or territory will use to achieve transition targets here and through a required state or territory specific initiative.",
            },
          },
        ],
      },
    },
    {
      name: "State or Territory-Specific Initiatives",
      path: "/wp/state-or-territory-specific-initiatives",
      children: [
        {
          name: "State or Territory-Specific Initiatives Instructions",
          path: "/wp/state-or-territory-specific-initiatives/instructions",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "",
              subsection:
                "State or Territory-Specific Initiatives Instructions",
              spreadsheet: "",
              info: [
                {
                  type: "html",
                  content:
                    "State or territory-specific initiatives are a distinct set of activities designed to increase the use of HCBS rather than institutional long-term services and supports. These initiatives can be funded using one or more of these funding sources:<br>",
                },
                {
                  type: "ul",
                  content: "",
                  props: {
                    style: {
                      marginLeft: "1.5rem",
                      padding: "1rem",
                    },
                  },
                  children: [
                    {
                      type: "li",
                      content: "MFP cooperative agreement funds for:",
                    },
                    {
                      content: "",
                      type: "ul",
                      props: {
                        style: {
                          marginLeft: "1rem",
                          paddingTop: "1rem",
                        },
                      },
                      children: [
                        {
                          type: "li",
                          props: {
                            style: {
                              paddingBottom: "1rem",
                            },
                          },
                          content: "Qualified HCBS and demonstration services",
                        },
                        {
                          type: "li",
                          props: {
                            style: {
                              paddingBottom: "1rem",
                            },
                          },
                          content: "Supplemental services",
                        },
                        {
                          type: "li",
                          props: {
                            style: {
                              paddingBottom: "1rem",
                            },
                          },
                          content: "Administrative activities",
                        },
                        {
                          type: "li",
                          props: {
                            style: {
                              paddingBottom: "1rem",
                            },
                          },
                          content: "Capacity building initiatives",
                        },
                      ],
                    },
                    {
                      type: "li",
                      content:
                        "State or territory equivalent funds attributable to the MFP-enhanced match",
                    },
                  ],
                },
                {
                  type: "table",
                  content: "",
                  children: [
                    {
                      type: "thead",
                      content: "",
                      children: [
                        {
                          type: "tr",
                          content: "",
                          children: [
                            {
                              type: "th",
                              props: {
                                style: {
                                  textTransform: "capitalize",
                                  color: "#71767a",
                                  fontFamily: "Open Sans",
                                  fontSize: "14px",
                                  lineHeight: "18px",
                                  letterSpacing: "0px",
                                  textAlign: "left",
                                },
                              },
                              content: "Required* Initiatives",
                            },
                            {
                              type: "th",
                              props: {
                                style: {
                                  textTransform: "capitalize",
                                  color: "#71767a",
                                  fontFamily: "Open Sans",
                                  fontSize: "14px",
                                  lineHeight: "18px",
                                  letterSpacing: "0px",
                                  textAlign: "left",
                                },
                              },
                              content: "Optional Initiatives",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "tbody",
                      content: "",
                      children: [
                        {
                          type: "tr",
                          content: "",
                          children: [
                            {
                              type: "td",
                              content: "",
                              props: {
                                style: {
                                  verticalAlign: "top",
                                },
                              },
                              children: [
                                {
                                  type: "ul",
                                  content: "",
                                  children: [
                                    {
                                      type: "li",
                                      content:
                                        "Transitions and transition coordination services",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content: "Housing-related supports",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content:
                                        "Quality measurement and improvement",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content: "Self-direction (if applicable)",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content:
                                        "Tribal initiative (if applicable)",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              type: "td",
                              content: "",
                              children: [
                                {
                                  type: "ul",
                                  content: "",
                                  children: [
                                    {
                                      type: "li",
                                      content: "Recruitment and enrollment",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content:
                                        "Person-centered planning and services",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content: "No Wrong Door systems",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content: "Community transition support",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content:
                                        "Direct service workforce and caregivers",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content: "Employment support",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content:
                                        "Convenient and accessible transportation options",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content: "Data-based decision-making",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content: "Financing approaches",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content: "Stakeholder engagement",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content:
                                        "Equity and social determinants of health (SDOH)",
                                      props: {
                                        style: {
                                          paddingBottom: ".5rem",
                                        },
                                      },
                                    },
                                    {
                                      type: "li",
                                      content: "Other",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "tfoot",
                      content: "",
                    },
                  ],
                },
                {
                  type: "text",
                  content:
                    "<sup>*Required by Program Terms and Conditions</sup>",
                  props: {
                    style: {
                      paddingTop: ".25rem",
                    },
                  },
                },
                {
                  type: "html",
                  content:
                    "<br>For each initiative, recipients will be asked to provide:<br>",
                },
                {
                  type: "ol",
                  content: "",
                  props: {
                    styleType: "upper-roman",
                    style: {
                      marginLeft: "1.5rem",
                      padding: "1rem",
                    },
                  },
                  children: [
                    {
                      type: "li",
                      content:
                        "Initiative description, including target populations and timeframe",
                      props: {
                        style: {
                          padding: ".5rem",
                        },
                      },
                    },
                    {
                      type: "li",
                      content:
                        "An evaluation plan, including measurable objectives",
                      props: {
                        style: {
                          padding: ".5rem",
                        },
                      },
                    },
                    {
                      type: "li",
                      content:
                        "Funding sources, with projected quarterly expenditures",
                      props: {
                        style: {
                          padding: ".5rem",
                        },
                      },
                    },
                    {
                      type: "li",
                      content:
                        "Initiative close-out information, to be completed as appropriate during WP revisions",
                      props: {
                        style: {
                          paddingTop: ".5rem",
                        },
                      },
                    },
                  ],
                },
                {
                  type: "html",
                  content:
                    "<br>The WP should establish one or more demonstrable objectives for each initiative, set associated performance measures or indicators to monitor progress, and clearly articulate the actions necessary to achieve the objectives. Progress towards meeting these objectives indicates a state’s or territory’s increased capacity to provide HCBS, rather than institutional, long-term care services.<br>",
                },
                {
                  type: "html",
                  content:
                    "<br>The recipient must identify the MFP funding source(s) for each initiative and provide quarterly projected spending by funding source. Funding sources for initiatives include state or territory funds equivalent to the MFP-enhanced Federal Medical Assistance Percentage (FMAP); MFP capacity building funding; MFP funding for qualified HCBS, demonstration services, and supplemental services; or MFP administrative cooperative agreement funding.<br>",
                },
                {
                  type: "html",
                  content:
                    "<br>If a recipient updates the WP to indicate that an initiative will no longer be sustained with MFP funding or state or territory-equivalent funding, the recipient must explain whether the initiative will be terminated or sustained through another funding source.<br>",
                },
                {
                  type: "text",
                  content:
                    "<p>Answer the following questions regarding required initiative topics. This is necessary in order to track completion of required data.</p>",
                  props: {
                    style: {
                      color: "#5B616B",
                    },
                  },
                },
              ],
            },
          },
          form: {
            id: "mock-form-id",
            fields: [
              {
                id: "firstquestion",
                type: "radio",
                validation: "radio",
                props: {
                  label:
                    "Are self-directed initiatives applicable to your state or territory?",
                  choices: [
                    {
                      id: "UG7uunqq5UCtUq1is3iyiw",
                      label: "Yes",
                    },
                    {
                      id: "3DGAqqnOBE2kwKVFMxUt3A",
                      label: "No",
                    },
                  ],
                },
              },
              {
                id: "secondquestion",
                type: "radio",
                validation: "radio",
                props: {
                  label:
                    "Are Tribal Initiatives applicable to your state or territory?",
                  choices: [
                    {
                      id: "UG7uunqq5UCtUq1is3iyiw",
                      label: "Yes",
                    },
                    {
                      id: "3DGAqqnOBE2kwKVFMxUt3A",
                      label: "No",
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          name: "State or Territory-Specific Initiatives",
          path: "/wp/state-or-territory-specific-initiatives/initiatives",
          pageType: "modalOverlay",
          entityType: "initiatives",
          verbiage: {
            intro: {
              section: "",
              subsection: "State or Territory-Specific Initiatives",
              info: [
                {
                  type: "html",
                  content: "See ",
                },
                {
                  type: "internalLink",
                  content: "previous page",
                  props: {
                    to: "/wp/state-or-territory-specific-initiatives/instructions",
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
            readOnlyEntityButtonText: "View name",
            addEditModalAddTitle: "Add initiative",
            addEditModalEditTitle: "Edit initiative",
            deleteModalTitle:
              "Are you sure you want to delete this initiative?",
            deleteModalConfirmButtonText: "Yes, delete initiative",
            deleteModalWarning:
              "Are you sure you want to proceed? You will lose all information entered for this initiative in the Work Plan. The initiative will remain in previously submitted Semi-Annual Reports if applicable. To close a completed initiative out, select “Cancel” and then the “Close out” button in the listing.",
            enterEntityDetailsButtonText: "Edit",
            readOnlyEntityDetailsButtonText: "View",
            dashboardTitle: "Initiative total count",
            countEntitiesInTitle: true,
            tableHeader: "Initiative name <br/> MFP Work Plan topic",
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
                  label: "MFP Work Plan topic:",
                  hint: "Note: Initiative topics with * are required and must be selected at least once across all initiatives.",
                  choices: [
                    {
                      id: "VjQ0OFqior9Dxu5RRNiZ5u",
                      label:
                        "Transitions and transition coordination services*",
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
                      label: "Equity and social determinants of health (SDOH)",
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
        },
        {
          name: "State or Territory-Specific Initiatives: I. Define initiative",
          path: "/wp/state-or-territory-specific-initiatives/define-initiative",
          pageType: "standard",
          verbiage: {
            intro: {
              section:
                "State or Territory-Specific Initiatives: I. Define initiative",
              subsection: "{Person-centered Planning}",
              info: [
                {
                  type: "html",
                  content:
                    "Provide initiative description, including target populations and timeframe.",
                },
              ],
              exportSectionHeader: "exportSectionHeader",
            },
          },
          form: {
            id: "2UkpXxLfnjAcf99ldXNdNMFJ0Df",
            fields: [
              {
                id: "2Ukwki4yJ8wNPqz7KnvgNoTATkO",
                type: "textarea",
                validation: "text",
                props: {
                  label: "Describe the initiative, including key activities:",
                },
              },
              {
                id: "target_population",
                type: "checkbox",
                validation: "checkbox",
                props: {
                  label: "Target Population(s):",
                  hint: "Select all that apply. Population you've added as &quot;Other&quot; in the Transition Benchmarks section will appear here.",
                  choices: [
                    {
                      id: "2iuXO7C6nk6cuP9JXbdd2w",
                      label: "Older adults",
                    },
                    {
                      id: "vmlIjQAe9kyz4FbtxBZINA",
                      label: "Individuals with physical disabilities (PD)",
                    },
                    {
                      id: "Vg8erh64Tk2nKd5olVwM9w",
                      label:
                        "Individuals with intellectual and developmental disabilities(MH/SUD)",
                    },
                    {
                      id: "azz5rhd8V0GK27fIXaYSmw",
                      label: "Other: {HIV/AIDS}",
                    },
                    {
                      id: "OLmKdPAEI0WnbSV1sVccVw",
                      label: "Other third-party vendor",
                    },
                    {
                      id: "Gxk89QOgQkmMTaNHH9WznQ",
                      label: "Other, specify",
                      children: [
                        {
                          id: "state_encounterDataValidationEntity-otherText",
                          type: "textarea",
                          validation: {
                            type: "text",
                            nested: true,
                            parentFieldName:
                              "state_encounterDataValidationEntity",
                          },
                        },
                      ],
                    },
                  ],
                },
              },
              {
                id: "2UkpVV0mypx5RnlS9UsflndyQDY",
                type: "date",
                validation: "date",
                props: {
                  label: "Start Date",
                  hint: "Enter projected start month/year for future initiatives or enter past start month/year for initiatives in the process.",
                },
              },
              {
                id: "2UkpXxLfnjAcf99ldXNdNMFJ0Df",
                type: "date",
                validation: "date",
                props: {
                  label: "End Date",
                  hint: "Enter projected end date or “N/A” if the initiative will be ongoing without a set point.",
                },
              },
            ],
          },
        },
      ],
    },
    {
      name: "Review & Submit",
      path: "/wp/review-and-submit",
      pageType: "reviewSubmit",
    },
  ],
  flatRoutes: [
    {
      name: "General Information",
      path: "/wp/general-information",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "",
          subsection: "General Information",
          info: [
            {
              type: "html",
              content:
                "The Money Follows the Person (MFP) Demonstration Work Plan is the state or territory’s road map for accomplishing the rebalancing objective described in section ",
            },
            {
              type: "externalLink",
              content: "6071(a)(1) of the Deficit Reduction Act (DRA)",
              props: {
                href: "https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf",
                target: "_blank",
                "aria-label":
                  "6071(a)(1) of the Deficit Reduction Act (DRA) (Link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                " as “increasing the use of home and community-based, rather than institutional, long-term care services.” The WP presents MFP Demonstration initiatives that support the state or territory’s unique rebalancing goals and objectives. The WP enables states or territories and Centers for Medicare & Medicaid Services (CMS) to monitor state or territory-specific initiatives throughout the grant and make course corrections where needed. While the WP describes state or territory initiatives and sets performance measures, the MFP Semi-Annual Progress Report will capture progress on these initiatives and performance measures, alongside other information. <br><br> CMS may amend or add new WP fields during the Demonstration period. For additional guidance on completing this form, please see the associated User Guide and Help File. ",
            },
          ],
        },
      },
      form: {
        id: "apoc",
        fields: [],
      },
    },
    {
      name: "Transition Benchmarks",
      path: "/wp/transition-benchmarks",
      pageType: "modalDrawer",
      verbiage: {
        intro: {
          section: "Section A: Program Information",
          subsection: "Reporting Period",
          spreadsheet: "A_Program_Info",
        },
      },
      form: {
        id: "arp",
        fields: [],
      },
    },
    {
      name: "Transition Benchmark Strategy",
      path: "/wp/transition-benchmark-strategy",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section A: Program Information",
          subsection: "Add plans (A.7)",
          info: "Enter the name of each plan that participates in the program for which the state is reporting data.",
          spreadsheet: "A_Program_Info",
        },
      },
      form: {
        id: "aap",
        fields: [],
      },
    },
    {
      name: "Transition Benchmark Strategy",
      path: "/wp/transition-benchmark-strategy",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section A: Program Information",
          subsection: "Add plans (A.7)",
          info: "Enter the name of each plan that participates in the program for which the state is reporting data.",
          spreadsheet: "A_Program_Info",
        },
      },
      form: {
        id: "aap",
        fields: [],
      },
    },
    {
      name: "Transition Benchmark Strategy",
      path: "/wp/transition-benchmark-strategy",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section A: Program Information",
          subsection: "Add plans (A.7)",
          info: "Enter the name of each plan that participates in the program for which the state is reporting data.",
          spreadsheet: "A_Program_Info",
        },
      },
      form: {
        id: "aap",
        fields: [],
      },
    },
    {
      name: "State or Territory-Specific Initiatives: 1. Define initiative",
      path: "/wp/state-or-territory-specific-initiatives/define-initiative",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section A: Program Information",
          subsection: "Add plans (A.7)",
          info: "Enter the name of each plan that participates in the program for which the state is reporting data.",
          spreadsheet: "A_Program_Info",
        },
      },
      form: {
        id: "aap",
        fields: [],
      },
    },
    {
      name: "Review & Submit",
      path: "/wp/review-and-submit",
      pageType: "reviewSubmit",
    },
  ],
};

export const reportShape: ReportShape = {
  id: "2V2LLf0ofcV5waGTA6XuZPev4PR",
  state: "MN",
  reportType: "WP",
  submissionName: "test",
  status: ReportStatus.NOT_STARTED,
  createdAt: 1694022189008,
  lastAltered: 1694022189008,
  lastAlteredBy: "Thelonious States",
  dueDate: 1659373200000,
  formTemplate: mockFullReportJSON,
  fieldData: {
    id: "2V2LLgyP7wjNYvYXHmzd5laXl7J",
    submissionName: "test",
    stateName: "Minnesota",
  },
  reportPeriod: 1,
  reportYear: 2023,
};

export const reportByState = {
  reportingPeriodStartDate: 1643778000000,
  dueDate: 1659373200000,
  formTemplateId: "2V2LLezUtxYOBRMEoiTp5r1O71X",
  lastAlteredBy: "Thelonious States",
  versionNumber: 1,
  reportType: "MCPAR",
  createdAt: 1694029173139,
  submissionName: "water",
  combinedData: false,
  lastAltered: 1694029173139,
  state: "MN",
  id: "2V2LLf0ofcV5waGTA6XuZPev4PR",
  fieldDataId: "2V2LLgyP7wjNYvYXHmzd5laXl7J",
  status: "Not started",
  reportPeriod: 1,
  reportYear: 2023,
};
