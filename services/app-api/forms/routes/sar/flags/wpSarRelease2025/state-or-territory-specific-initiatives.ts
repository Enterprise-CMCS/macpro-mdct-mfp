// types
import {
  EntityType,
  FormTableType,
  PageTypes,
  ReportFormFieldType,
  SARStateOrTerritorySpecificInitiativesV2Route,
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
  required: true,
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
    entityType: EntityType.INITIATIVE,
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
            subtitle: [
              {
                type: "p",
                content:
                  "Enter quantitative findings in the actuals field if any findings were recorded during this reporting period.",
              },
              {
                type: "p",
                content:
                  "Performance indicator data is auto-populated from the previous Work Plan.",
              },
            ],
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
            hint: "Reference the initiative’s purpose, goals, and key activities from the MFP Work Plan. In the sections that follow, you will have an opportunity to provide updates on the key metrics and performance measures.",
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
            hint: "If your state or territory has not achieved the targets/benchmarks for performance indicators or the projected end date set in the initiative’s evaluation plan, describe the barriers or challenges that have hindered progress and your plans to address them. Include any planned discussions with your CMS Project Officers around these challenges and what potential changes may be made to the initiative.",
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
            label:
              "Describe any qualitative findings that were recorded during this reporting period.",
            maxLength: 1800,
          },
        },
        {
          id: "initiativeEvaluation_achievedExpectedResults",
          type: ReportFormFieldType.RADIO,
          validation: ValidationType.RADIO,
          props: {
            hint: "Please describe your selection of Yes, No, or Partially. Explain whether you accomplished what you planned and provide any additional qualitative or quantitative findings not reported above to support your selection.",
            label: "Did the initiative achieve its expected results?",
            subsectionTitle: "Findings and Sustainability",
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
            hint: "States and territories have multiple programs and options available to sustain the great work conducted through the MFP demonstration grant. These options could include incorporating successes and lessons learned into other HCBS authorities or the Rural Health Transformation Program, using state rebalancing funds to support transitions from institutions to community-based care, or using other Medicaid program funding to carry on the success of MFP initiatives.<br><br>Select “yes” for initiatives in which the MFP recipient has secured funding and staff to continue supporting the initiative. Select “unsure” for initiatives in which the MFP recipient is awaiting further internal discussion or decisions about the future of the initiative. Otherwise, select “no.”",
            label: "Do you plan to sustain this initiative?",
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
              "Describe how you will use the evaluation results for program improvement or decision-making.",
            maxLength: 1800,
            subsectionTitle: "Use of Findings",
          },
        },
      ],
      verbiage: {
        accordion: {
          buttonLabel: "Instructions",
          text: [
            {
              type: "p",
              content:
                "Recipients must report on the progress of initiatives that were ongoing during the current reporting period. For each initiative, recipients must report on the progress toward addressing the gap, challenge, or opportunity that the initiative aims to address, as described in the MFP Work Plan. Progress toward these gaps, challenges, or opportunities indicates the state or territory’s greater ability to provide HCBS instead of services in institutional settings.",
            },
          ],
        },
      },
    },
    verbiage: {
      // Dashboard
      countEntitiesInTitle: false,
      intro: {
        info: [
          {
            type: "p",
            content:
              "Your initiatives are auto-populated from your most recent approved MFP Work Plan.",
          },
          {
            type: "p",
            content: "Select an initiative below to report the status.",
          },
        ],
        section: "",
        subsection: "State or Territory-Specific Initiatives",
      },

      // Overlay
      backButtonText: "Return to all initiatives",

      // Table
      editEntityHint: `Select "Edit" to report data.`,
      enterEntityDetailsButtonText: "Edit",
      readOnlyEntityDetailsButtonText: "View",
      tableHeaders: ["", "Initiative name <br/> MFP Work Plan topic"],
    },
  };
