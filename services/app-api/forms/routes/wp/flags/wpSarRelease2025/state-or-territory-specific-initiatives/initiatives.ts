// types
import {
  PageTypes,
  ReportFormFieldType,
  ValidationType,
  WPStateOrTerritorySpecificInitiativesV2Route,
  StepEntityType,
  FormTableType,
} from "../../../../../../utils/types";
// utils
import { tableFieldDynamicRowsTemplateBuilder } from "../../../../../../utils/routes/tables";

// Key Metrics table
const keyMetricsTableId = "defineInitiative_keyMetrics";
const keyMetricsHeaders = [
  "Performance Indicator",
  "Data Source",
  "Baseline",
  "Baseline Period",
  "Target/Benchmark",
  "Projected Date to Achieve Benchmark",
];

// Key Metrics table - dynamic rows
const keyMetricsDynamicRowId = `${keyMetricsTableId}_performanceIndicators`;
const keyMetricsDynamicBodyList = [
  {
    id: keyMetricsDynamicRowId,
    label: "Key Metrics",
    readOnly: true,
  },
];
const keyMetricsDynamicFieldsToReturn = [
  {
    id: "name",
    props: {
      label: "Performance indicator",
    },
  },
  {
    id: "dataSource",
    props: {
      hint: "Select the data source that will be used to measure the performance indicator.",
      label: "Data Source",
      choices: [
        {
          id: "n6nXX8AlLL5xvXAOvGWC8P",
          label: "Surveys",
        },
        {
          id: "yIxTj86VZ2bFY3xLX04G0V",
          label: "Interviews",
        },
        {
          id: "37Eu05n6ZROrEKN1f5N0M2",
          label: "Administrative data",
        },
        {
          id: "TpqI3gbVKn7yGpQA1u1xzd",
          label: "Focus groups",
        },
        {
          id: "Eb38oAo9f0TesXCOxZ38TU",
          label: "Service records",
        },
        {
          id: "ONdIhf87iXF6Q8T9odghsu",
          label: "Observations",
        },
        {
          id: "18Wb9b2zMIF13pZwWstdJF",
          label: "Other, specify",
          children: [
            {
              id: `${keyMetricsDynamicRowId}-otherText`,
              type: ReportFormFieldType.TEXT,
              validation: {
                type: ValidationType.TEXT,
                nested: true,
                parentFieldName: `${keyMetricsDynamicRowId}-dataSource`,
              },
            },
          ],
        },
      ],
    },
    options: {
      type: ReportFormFieldType.RADIO,
      validation: ValidationType.RADIO,
    },
  },
  {
    id: "baselineValue",
    props: {
      hint: "The baseline value should represent the value calculated or gathered on the start date of this initiative.",
      label: "Baseline Value",
    },
  },
  {
    id: "baselineStartDate",
    props: {
      label: "Baseline reporting period state date",
    },
    options: {
      type: ReportFormFieldType.DATE,
      validation: ValidationType.DATE,
    },
  },
  {
    id: "baselineEndDate",
    props: {
      label: "Baseline reporting period end date",
    },
    options: {
      type: ReportFormFieldType.DATE,
      validation: {
        type: ValidationType.END_DATE,
        dependentFieldName: `${keyMetricsDynamicRowId}-baselineStartDate`,
      },
    },
  },
  {
    id: "targetBenchmarkValue",
    props: {
      hint: "The target/benchmark value should represent the desired value calculated or gathered on the completion date of this initiative. The target/benchmark will be used as an internal benchmark for the state’s or territory’s quality improvement efforts for the initiative. MFP recipients will also use the performance target when developing their Quality Management Strategy and Plan, as detailed in MFP Program Terms and Conditions #31 and in accordance with section 6071(c)(11)(A) of the Deficit Reduction Act (DRA).",
      label: "Target/Benchmark Value",
    },
  },
  {
    id: "targetBenchmarkProjectedDate",
    props: {
      label: "Projected date to achieve benchmark value",
    },
    options: {
      type: ReportFormFieldType.DATE,
      validation: ValidationType.DATE,
    },
  },
];

// Key Metrics table - modal
const keyMetricsModalList = [
  {
    id: keyMetricsDynamicRowId,
    label: "Key Metrics",
  },
];
const keyMetricsModalFieldsToReturn = keyMetricsDynamicFieldsToReturn.map(
  (field) => {
    return {
      ...field,
      options: {
        ...field.options,
        forTableOnly: false,
      },
    };
  }
);

const keyMetricsDynamicRowsTemplate = tableFieldDynamicRowsTemplateBuilder({
  dynamicFieldsBodyList: keyMetricsDynamicBodyList,
  dynamicFieldsToReturn: keyMetricsDynamicFieldsToReturn,
  dynamicFieldValidations: {
    name: ValidationType.TEXT_OPTIONAL,
    dataSource: ValidationType.RADIO,
    baseline: ValidationType.TEXT_OPTIONAL,
    baselineStartDate: ValidationType.DATE_OPTIONAL,
    baselineEndDate: ValidationType.DATE_OPTIONAL,
    targetBenchmark: ValidationType.TEXT_OPTIONAL,
    targetBenchmarkProjectedDate: ValidationType.DATE_OPTIONAL,
  },
  dynamicModalList: keyMetricsModalList,
  dynamicModalFieldsToReturn: keyMetricsModalFieldsToReturn,
  dynamicModalVerbiage: {
    add: "Add Key Metric",
    edit: "Edit Key Metric",
  },
  dynamicRowId: keyMetricsDynamicRowId,
  label: "Key Metrics",
  verbiage: {
    buttonText: "Add key metric",
    hint: "",
  },
});

export const initiativesRoute: WPStateOrTerritorySpecificInitiativesV2Route = {
  name: "State or Territory-Specific Initiatives",
  path: "/wp/state-or-territory-specific-initiatives/initiatives",
  pageType: PageTypes.MODAL_OVERLAY,
  entityType: StepEntityType.INITIATIVE,
  entityInfo: ["initiative_name", "initiative_wpTopic"],
  overlayForm: {
    id: "stsidi",
    tables: [
      {
        id: keyMetricsTableId,
        bodyRows: [],
        dynamicRowsTemplate: keyMetricsDynamicRowsTemplate,
        footRows: [],
        headRows: [keyMetricsHeaders],
        tableType: FormTableType.ENTITY_MODAL,
        verbiage: {
          emptyTableMessage: "No Key Metrics added.",
          title: "Key Metrics",
        },
      },
    ],
    fields: [
      {
        id: "defineInitiative_describeInitiative",
        type: ReportFormFieldType.TEXTAREA,
        validation: {
          type: ValidationType.TEXT_CUSTOM,
          options: {
            maxLength: 1800,
          },
        },
        props: {
          label:
            "Describe the initiative, including the gap, challenge, or opportunity it aims to address.",
          maxLength: 1800,
          title: "Describe Initiative",
        },
      },
      {
        id: "defineInitiative_keyActivities",
        type: ReportFormFieldType.DYNAMIC,
        validation: ValidationType.DYNAMIC,
        props: {
          dynamicButtonText: "Add key activity",
          dynamicLabel: "Key Activity",
          hint: "List the key activities currently in progress or planned for future implementation that must occur within the timeframe for starting and completing the initiative. Potential activities could include, but are not limited to, data collection and analysis to inform the initiative, coordination with internal divisions/agencies and external partners, any training required for the initiative (ex., training care coordinators), establishment of new contracts required for the initiative, and gathering data (through key metrics, informational interviews, surveys, etc.) to evaluate the success of the initiative. An initiative must have been implemented, tested, and evaluated to be considered completed.",
          label: "Key Activities",
        },
      },
      {
        id: "defineInitiative_targetPopulations",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "Target population(s):",
          hint: [
            {
              type: "html",
              content:
                "Select all that apply. “Other” population(s) selected and defined in the ",
            },
            {
              type: "internalLink",
              content: "Transition Benchmarks",
              props: {
                to: "/wp/transition-benchmarks",
              },
            },
            {
              type: "html",
              content:
                " section automatically upload. Select “HCBS infrastructure/system-level development” for initiatives that strengthen or expand home and community-based services (HCBS).",
            },
          ],
          choices: [
            {
              id: "generatedCheckbox",
              label: "Target populations (generated)",
            },
          ],
        },
      },
      {
        id: "defineInitiative_startDate",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "Enter the expected or actual state date for the initiative.",
          hint: "For initiatives that have not yet begun, enter the projected date it will start. The projected start date should allow at least 30 days for Centers for Medicare & Medicaid Services (CMS) review and approval of the Work Plan before implementation. For initiatives in progress, if the exact date is unknown, provide an estimate.",
          choices: [
            {
              id: "wHDw5laJkJIRG1FrHs5VS6",
              label: "Expected start date",
              children: [
                {
                  id: "defineInitiative_expectedStartDate_value",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.DATE,
                    parentOptionId:
                      "defineInitiative_startDate-wHDw5laJkJIRG1FrHs5VS6",
                    parentFieldName: "defineInitiative_startDate",
                    nested: true,
                  },
                  props: {
                    label: "",
                  },
                },
              ],
            },
            {
              id: "lwkRrUT61kbVMe1OeZWOql",
              label: "Actual start date",
              children: [
                {
                  id: "defineInitiative_actualStartDate_value",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.DATE,
                    parentOptionId:
                      "defineInitiative_projectedStartDate-lwkRrUT61kbVMe1OeZWOql",
                    parentFieldName: "defineInitiative_projectedStartDate",
                    nested: true,
                  },
                  props: {
                    label: "",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "defineInitiative_endDate",
        type: ReportFormFieldType.DATE,
        validation: {
          type: ValidationType.END_DATE,
          dependentFieldName: "defineInitiative_expectedStartDate_value",
        },
        props: {
          label:
            "Enter the date for when the initiative was or will be completed.",
          hint: "To be considered completed, an initiative must have been implemented, tested, and evaluated. Aim for a 1-2 year period for implementation, testing, and evaluation. Include an explanation in the initiative description if it will take longer than 2 years.",
        },
      },
      // Initiative Evaluation
      {
        id: "defineInitiative_purposeAndGoals",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          hint: "Briefly describe the purpose of your evaluation (1-3 sentences):",
          label: "Purpose and Goals",
          subtitle: [
            {
              type: "p",
              content:
                "In this section, please provide information on a limited set of evaluation elements, including the evaluation’s purpose and goals, key metrics and indicators, qualitative evaluation methods, and anticipated funding sources related to sustainability. You do not need to submit a comprehensive evaluation plan, or address all components described above.",
            },
          ],
          title: "Initiative Evaluation",
        },
      },
      // Key Metrics table
      keyMetricsDynamicRowsTemplate,

      // Qualitative Methods
      {
        id: "defineInitiative_qualitativeMethods",
        type: ReportFormFieldType.TEXTAREA,
        validation: {
          type: ValidationType.TEXT_CUSTOM_OPTIONAL,
          options: {
            maxLength: 1800,
          },
        },
        props: {
          label:
            "If you are employing any qualitative methods for evaluation, please describe them.",
          maxLength: 1800,
          styleAsOptional: true,
          title: "Qualitative Methods",
        },
      },
      // Funding Sources
      {
        id: "defineInitiative_fundingSources",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "Identify funding source(s):",
          hint: "Select the funding sources used for this initiative. Cooperative Agreement is an alternative assistance instrument used whenever substantial federal involvement with the recipient during performance is anticipated. The difference between grants and cooperative agreements is the degree of federal programmatic involvement rather than the type of administrative requirements imposed. MFP recipients will no longer need to provide projected quarterly expenditures for each initiative. Actual quarterly expenditures will be reported in the recipient’s MFP Semi-Annual Progress Report (SAR).",
          title: "Funding Sources",
          choices: [
            {
              id: "awTB7dbwBc8x3fRjbWIRlC",
              label: "MFP administrative cooperative agreement funding",
            },
            {
              id: "z1l2sreTSR8zP1f7Z3Fu7z",
              label:
                "MFP funding for qualified HCBS and demonstration services",
            },
            {
              id: "imiTj7JUsAweLR33aYyqPO",
              label: "MFP funding for supplemental services",
            },
            {
              id: "c6GreErctvGyO839dPG3h5",
              label:
                "State or territory funds equivalent to the MFP-enhanced Federal Medical Assistance Percentage (FMAP)",
            },
            {
              id: "kmJzFT1wTnR3w5HqFbsy85",
              label: "MFP capacity building funding",
            },
          ],
        },
      },
      // Close-out
      {
        forCopyoverOnly: true,
        id: "defineInitiative_projectedEndDate_value",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          disabled: true,
          hint: "Auto-populates from “I. Define initiative”.",
          label: "Projected end date",
          styleAsOptional: true,
          styleTitleAsOptional: true,
          title: "Close-out {{initiativeName}}",
        },
      },
      {
        forCopyoverOnly: true,
        id: "closeOutInformation_actualEndDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE_OPTIONAL,
        props: {
          label: "Actual end date",
          styleAsOptional: true,
        },
      },
      {
        forCopyoverOnly: true,
        id: "closeOutInformation_initiativeStatus",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX_OPTIONAL,
        props: {
          hint: "Select all that apply.",
          label:
            "For initiatives that will no longer be sustained with MFP funding or state or territory-equivalent funding, indicate the status below:",
          styleAsOptional: true,
          choices: [
            {
              id: "FhAF0lzeuB4wLalyXv2BeG",
              label: "Completed initiative",
            },
            {
              id: "GUcwKDPBs8K6LY4yT1hPGD",
              label: "Discontinued initiative",
              children: [
                {
                  id: "closeOutInformation_initiativeStatus-terminationReason",
                  props: {
                    label: "Indicate reason for termination",
                  },
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "closeOutInformation_initiativeStatus",
                  },
                },
              ],
            },
            {
              id: "86SG3qhFfsZ0CAu3G4SxM5",
              label: "Sustaining initiative through a Medicaid authority",
              children: [
                {
                  id: "closeOutInformation_initiativeStatus-alternateFunding",
                  props: {
                    label: "Indicate alternative funding source",
                  },
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "closeOutInformation_initiativeStatus",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
    verbiage: {},
  },
  modalForm: {
    id: "add_initiative",
    fields: [
      {
        id: "initiative_name",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "Initiative name",
        },
      },
      {
        id: "initiative_wpTopic",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "MFP Work Plan topic:",
          hint: "Note: Initiative topics with <span aria-label='asterisk'>*</span> are required. Recipients must identify and describe the required initiatives, and they have the option to identify additional initiatives on other topics. MFP recipients with a self-direction option specified in their Operational Protocol should report a self-direction initiative. MFP recipients with a tribal initiative grant should report a tribal initiative.  A single initiative cannot fulfill more than one requirement.",
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
              label: "Self-direction (*if applicable)",
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
              id: "jZCOy2pgOiAxgnHDfizer4",
              label: "Employment support",
            },
            {
              id: "xpdOyHiM2GesrYekAT2s1U",
              label: "Convenient and accessible transportation options",
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
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.TEXT,
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
  verbiage: {
    // Dashboard
    addEntityButtonText: "Add initiative",
    countEntitiesInTitle: true,
    dashboardTitle: "Initiative total count:",
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
            style: {
              textDecoration: "underline",
            },
          },
        },
        {
          type: "html",
          content: " for detailed instructions.",
        },
      ],
    },

    // Modal
    addEditModalAddTitle: "Add initiative",
    addEditModalEditTitle: "Edit initiative",
    addEditModalHint:
      "Provide the name of one initiative. You will be then be asked to complete details for this initiative including a description, evaluation plan and funding sources.",
    deleteModalConfirmButtonText: "Yes, delete initiative",
    deleteModalTitle: "Are you sure you want to delete this initiative?",
    deleteModalWarning:
      "Are you sure you want to proceed? You will lose all information entered for this initiative in the MFP Work Plan.",

    // Overlay
    backButtonText: "Return to all initiatives",

    // Table
    editEntityButtonText: "Edit name/topic",
    editEntityHint: 'Select "Edit" to complete the details.',
    enterEntityDetailsButtonText: "Edit",
    readOnlyEntityButtonText: "View name/topic",
    readOnlyEntityDetailsButtonText: "View",
    tableHeader: "Initiative name <br/> MFP Work Plan topic",
  },
};
