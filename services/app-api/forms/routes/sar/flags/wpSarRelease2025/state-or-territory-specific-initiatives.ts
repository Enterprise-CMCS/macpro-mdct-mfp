// types
import {
  FormTableType,
  PageTypes,
  ReportFormFieldType,
  SARStateOrTerritorySpecificInitiativesV2Route,
  StepEntityType,
  ValidationType,
} from "../../../../../utils/types";
// utils
import { tableFieldDynamicRowsTemplateBuilder } from "../../../../../utils/routes/tables";
import {
  keyMetricsDynamicBodyList,
  keyMetricsDynamicFieldsToReturn,
  keyMetricsDynamicFieldValidations,
  keyMetricsDynamicRowId,
  keyMetricsHeaders,
  keyMetricsTableId,
} from "../../../wp/flags/wpSarRelease2025/state-or-territory-specific-initiatives/initiatives";

// Key Metrics table
const sarKeyMetricsHeaders = [...keyMetricsHeaders, "Actual"];
// Style as optional
const sarKeyMetricsHeadersOptional = ["Actual"];

// Key Metrics table - dynamic rows
const sarKeyMetricsDynamicFieldsToReturn = [
  ...keyMetricsDynamicFieldsToReturn,
  {
    id: "targetBenchmarkActual",
    props: {
      label: "Actual",
      readOnly: false,
    },
    options: {
      type: ReportFormFieldType.TEXT,
      validation: ValidationType.TEXT_OPTIONAL,
    },
  },
];

const sarKeyMetricsDynamicRowsTemplate = tableFieldDynamicRowsTemplateBuilder({
  dynamicFieldsBodyList: keyMetricsDynamicBodyList,
  dynamicFieldsToReturn: sarKeyMetricsDynamicFieldsToReturn,
  dynamicFieldValidations: {
    ...keyMetricsDynamicFieldValidations,
    targetBenchmarkActualDate: ValidationType.DATE_OPTIONAL,
  },
  dynamicRowId: keyMetricsDynamicRowId,
  label: "Key Metrics",
  // TODO: Change to true when table statusing is figured out
  required: false,
  verbiage: {
    buttonText: "",
    hint: "",
  },
});

export const stateOrTerritorySpecificInitiativesRoute: SARStateOrTerritorySpecificInitiativesV2Route =
  {
    name: "State or Territory-Specific Initiatives",
    path: "/sar/state-or-territory-specific-initiatives",
    pageType: PageTypes.DYNAMIC_MODAL_OVERLAY,
    entityType: StepEntityType.INITIATIVE,
    entityInfo: ["initiative_name", "initiative_wpTopic"],
    overlayForm: {
      id: "sar-state-or-territory-specific-initiatives",
      tables: [
        {
          id: keyMetricsTableId,
          bodyRows: [],
          dynamicRowsTemplate: sarKeyMetricsDynamicRowsTemplate,
          footRows: [],
          headRows: [sarKeyMetricsHeaders],
          styleAsOptionalHeadRows: sarKeyMetricsHeadersOptional,
          tableType: FormTableType.ENTITY_MODAL,
          verbiage: {
            sectionTitle: "Initiative Evaluation",
            subtitle: "Auto-populated from the previous Work Plan.",
            title: "Key Metrics",
          },
        },
      ],
      fields: [
        // Initiative Progress
        {
          id: "initiativeProgress_describeProgress",
          type: ReportFormFieldType.TEXTAREA,
          validation: {
            type: ValidationType.TEXT_CUSTOM,
            options: {
              maxLength: 1800,
            },
          },
          props: {
            label:
              "Describe any progress made under this initiative during the reporting period.",
            maxLength: 1800,
            sectionTitle: "Initiative Progress",
          },
        },
        {
          id: "initiativeProgress_describeIssuesChallenges",
          type: ReportFormFieldType.TEXTAREA,
          validation: {
            type: ValidationType.TEXT_CUSTOM,
            options: {
              maxLength: 1800,
            },
          },
          props: {
            label:
              "Describe any issues or challenges that have impacted the development and implementation of the initiative during the reporting period.",
            maxLength: 1800,
          },
        },
        // Initiative Evaluation
        // Key Metrics table
        sarKeyMetricsDynamicRowsTemplate,
        // Findings and Sustainability
        {
          id: "initiativeEvaluation_describeQualitativeDetail",
          type: ReportFormFieldType.TEXTAREA,
          validation: {
            type: ValidationType.TEXT_CUSTOM,
            options: {
              maxLength: 1800,
            },
          },
          props: {
            label: "Describe any qualitative detailed in your Work Plan.",
            maxLength: 1800,
            subsectionTitle: "Findings and Sustainability",
          },
        },
        {
          id: "initiativeEvaluation_achievedExpectedResults",
          type: ReportFormFieldType.RADIO,
          validation: ValidationType.RADIO,
          props: {
            label: "Did the initiative achieve its expected results?",
            choices: [
              {
                id: "2NywCe4me9M7mWNMDb53Av",
                label: "Yes",
                children: [
                  {
                    id: "initiativeEvaluation_achievedExpectedResults_describeYes",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT_CUSTOM,
                      options: {
                        maxLength: 1800,
                      },
                      nested: true,
                      parentFieldName:
                        "initiativeEvaluation_achievedExpectedResults",
                      parentOptionId: "2NywCe4me9M7mWNMDb53Av",
                    },
                    props: {
                      label: "Please describe:",
                      maxLength: 1800,
                    },
                  },
                ],
              },
              {
                id: "qrSoDeeGOFrLkMOs5uU0Gy",
                label: "Partially",
                children: [
                  {
                    id: "initiativeEvaluation_achievedExpectedResults_describePartially",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT_CUSTOM,
                      options: {
                        maxLength: 1800,
                      },
                      nested: true,
                      parentFieldName:
                        "initiativeEvaluation_achievedExpectedResults",
                      parentOptionId: "qrSoDeeGOFrLkMOs5uU0Gy",
                    },
                    props: {
                      label: "Please describe:",
                      maxLength: 1800,
                    },
                  },
                ],
              },
              {
                id: "gC1GxxnZbslzhK6sUGn29M",
                label: "No",
                children: [
                  {
                    id: "initiativeEvaluation_achievedExpectedResults_describeNo",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT_CUSTOM,
                      options: {
                        maxLength: 1800,
                      },
                      nested: true,
                      parentFieldName:
                        "initiativeEvaluation_achievedExpectedResults",
                      parentOptionId: "gC1GxxnZbslzhK6sUGn29M",
                    },
                    props: {
                      label: "Please describe:",
                      maxLength: 1800,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: "initiativeEvaluation_sustainBeyondGrantPeriod",
          type: ReportFormFieldType.RADIO,
          validation: ValidationType.RADIO,
          props: {
            label:
              "Do you plan to sustain this initiative beyond the grant period?",
            choices: [
              {
                id: "a18b25AS9qTaHgs6Nf7bP8",
                label: "Yes",
                children: [
                  {
                    id: "initiativeEvaluation_sustainBeyondGrantPeriod_describeYes",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT_CUSTOM,
                      options: {
                        maxLength: 1800,
                      },
                      nested: true,
                      parentFieldName:
                        "initiativeEvaluation_sustainBeyondGrantPeriod",
                      parentOptionId: "a18b25AS9qTaHgs6Nf7bP8",
                    },
                    props: {
                      label: "Please describe:",
                      maxLength: 1800,
                    },
                  },
                ],
              },
              {
                id: "VyoPjoZU5j7VKS5BeRyfRt",
                label: "No",
                children: [
                  {
                    id: "initiativeEvaluation_sustainBeyondGrantPeriod_describeNo",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT_CUSTOM,
                      options: {
                        maxLength: 1800,
                      },
                      nested: true,
                      parentFieldName:
                        "initiativeEvaluation_sustainBeyondGrantPeriod",
                      parentOptionId: "VyoPjoZU5j7VKS5BeRyfRt",
                    },
                    props: {
                      label: "Please describe:",
                      maxLength: 1800,
                    },
                  },
                ],
              },
              {
                id: "78sKnhsJFcaGZ41JDiq1mB",
                label: "Unsure",
                children: [
                  {
                    id: "initiativeEvaluation_sustainBeyondGrantPeriod_describeUnsure",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT_CUSTOM,
                      options: {
                        maxLength: 1800,
                      },
                      nested: true,
                      parentFieldName:
                        "initiativeEvaluation_sustainBeyondGrantPeriod",
                      parentOptionId: "78sKnhsJFcaGZ41JDiq1mB",
                    },
                    props: {
                      label: "Please describe:",
                      maxLength: 1800,
                    },
                  },
                ],
              },
            ],
          },
        },
        // Use of Findings
        {
          id: "initiativeEvaluation_describeFindings",
          type: ReportFormFieldType.TEXTAREA,
          validation: {
            type: ValidationType.TEXT_CUSTOM,
            options: {
              maxLength: 1800,
            },
          },
          props: {
            label:
              "Describe how you will use the evaluation results for program improvement or decision-making:",
            maxLength: 1800,
            subsectionTitle: "Use of Findings",
          },
        },
      ],
      verbiage: {},
    },
    verbiage: {
      // Dashboard
      countEntitiesInTitle: false,
      intro: {
        info: [
          {
            type: "h3",
            content: "Report progress for each initiative",
          },
          {
            type: "p",
            content:
              "Your initiatives are auto-populated from your most recent approved MFP Work Plan.",
          },
          {
            type: "p",
            content:
              "Recipients must report on the progress of initiatives that were ongoing during the current reporting period. For each initiative, enter information on expenditures and activities, whether continuing from prior reporting periods or initiated during this reporting period.",
          },
          {
            type: "p",
            content:
              "For each initiative, recipients must report on the progress toward achieving the objective(s) identified in the initiative’s evaluation plan, as described in the MFP Work Plan. Progress toward these objectives indicates the state or territory’s greater ability to provide HCBS instead of services in institutional settings.",
          },
          {
            type: "p",
            content:
              "If your state or territory has not achieved the targets for performance measures or expected time frames for deliverables set in the initiative’s evaluation plan, use the following questions to explain the barriers or challenges that have hindered progress and describe plans to address them.",
          },
        ],
        introAccordion: {
          buttonLabel: "Instructions",
          intro: [
            {
              type: "html",
              content:
                "This section requests information on current, new, or expanded initiatives implemented under the MFP demonstration. These initiatives can be funded using one or more of these funding sources:",
            },
          ],
          list: [
            "MFP cooperative agreement funds for:",
            [
              "Qualified home and community-based services (HCBS) and demonstration services",
              "Supplemental services",
              "Administrative activities",
              "Capacity building initiatives",
            ],
            "State/Territory equivalent funds attributable to the MFP-enhanced match",
          ],
          text: [
            {
              type: "html",
              content:
                "State or territory-specific initiatives are a distinct set of activities designed to increase the use of HCBS rather than institutional long-term services and supports (LTSS). These initiatives are specified in your MFP Work Plan and imported into the form below.",
            },
          ],
        },
        section: "",
        subsection: "State or Territory-Specific Initiatives",
      },

      // Overlay
      backButtonText: "Return to all initiatives",

      // Table
      editEntityHint: `Select "Edit" to report data.`,
      enterEntityDetailsButtonText: "Edit",
      readOnlyEntityDetailsButtonText: "View",
      tableHeader: "Initiative name <br/> MFP Work Plan topic",
    },
  };
