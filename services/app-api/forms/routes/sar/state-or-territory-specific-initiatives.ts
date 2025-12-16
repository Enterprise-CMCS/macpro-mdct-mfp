import {
  PageTypes,
  ReportFormFieldType,
  SARStateOrTerritorySpecificInitiativesRoute,
  StepEntityType,
  StepType,
  TransformationRule,
  ValidationType,
} from "../../../utils/types";

export const stateOrTerritorySpecificInitiativesRoute: SARStateOrTerritorySpecificInitiativesRoute =
  {
    name: "State or Territory-Specific Initiatives",
    path: "/sar/state-or-territory-specific-initiatives",
    pageType: PageTypes.DYNAMIC_MODAL_OVERLAY,
    entityType: StepEntityType.INITIATIVE,
    entityInfo: ["initiative_name", "initiative_wpTopic"],
    verbiage: {
      intro: {
        section: "",
        subsection: "State or Territory-Specific Initiatives",
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
      },
      enterEntityDetailsButtonText: "Edit",
      readOnlyEntityDetailsButtonText: "View",
      tableHeader: "Initiative name <br/> MFP Work Plan topic",
      countEntitiesInTitle: false,
    },
    template: {
      dashboard: {
        name: "Intitiative Details Dashboard",
        verbiage: {
          intro: {
            section: "State or Territory-Specific Initiatives",
            info: [
              {
                type: "span",
                content:
                  "Report progress on this initiative for this reporting period by completing each of the following 3 sections. Further instructions will be available at the top of each section.",
              },
            ],
          },
        },
      },
      entitySteps: [
        {
          name: "Objectives progress",
          pageType: PageTypes.OVERLAY_MODAL,
          entityType: StepEntityType.INITIATIVE,
          stepType: StepType.OBJECTIVE_PROGRESS,
          stepInfo: ["name", "hint"],
          hint: "Report progress for each objective",
          isRequired: true,
          verbiage: {
            intro: {
              section: "State or Territory-Specific Initiatives",
              info: [
                {
                  type: "h3",
                  content: "Objectives progress",
                },
                {
                  type: "p",
                  content:
                    "Report progress for each objective by selecting the button for each.",
                },
                {
                  type: "p",
                  content:
                    "Objectives are framed as SMART goals and set associated performance measures or indicators to monitor progress toward each objective and evaluate success. Recipients define objectives in your MFP Work Plan’s evaluation plan.",
                },
              ],
            },
            accordion: {
              buttonLabel: "About SMART goals",
              intro: [
                {
                  type: "html",
                  content:
                    "The evaluation plan in your MFP Work Plan captured expected results for each state or territory-specific initiative. You identified one or more objectives per initiative and set associated performance measures or indicators to monitor progress toward each objective and evaluate success. In the Semi-Annual Progress Report, you must articulate how you will achieve targets and meet milestones. For more information on objectives and identifying appropriate performance measures, see ",
                },
                {
                  type: "externalLink",
                  content:
                    '"Using Data to Improve Money Follows the Person Program Performance."',
                  props: {
                    href: "https://www.medicaid.gov/sites/default/files/2023-01/MFP-Technical-Assistance-Brief.pdf",
                    target: "_blank",
                    "aria-label":
                      "Using Data to Improve Money Follows the Person Program Performance (Link opens in new tab)",
                  },
                },
                {
                  type: "html",
                  content: "<br/><br/>As a reminder, SMART stands for:",
                },
              ],
              list: [
                [
                  "<b>Specific:</b> Specifies the activities, actors, and beneficiaries",
                  "<b>Measurable:</b> Defines how a change will be measured",
                  "<b>Achievable:</b> Confirms the feasibility of implementing the intervention as planned",
                  "<b>Realistic/relevant</b>: Ensures the intervention relates to the goal",
                  "<b>Time-bound</b>: Specifies when the results are expected",
                ],
              ],
            },
            editEntityButtonText: "Edit objective progress",
            reportProgressButtonText: "Report objective progress",
            addEditModalEditTitle: "Report progress for ",
            enterEntityDetailsButtonText: "Edit",
            readOnlyEntityDetailsButtonText: "View",
            readOnlyEntityButtonText: "View",
            editEntityHint: 'Select "Edit" to report the objectives progress.',
            reviewPdfHint:
              'To view totals against targets from your associated MFP Work Plan, click "Review PDF" and it will open a summary in a new tab.',
            addEditModalMessage:
              'To view totals and percent target achieved, "Save", close, click "Review PDF" button and it will open a summary in a new tab.',
            entityUnfinishedMessage:
              "Report objective progress to complete this section.",
          },
          transformation: {
            rule: TransformationRule.OBJECTIVES,
          },
          objectiveCardTemplate: {
            modalForm: {
              id: "stsiop-modal",
              fields: [
                {
                  id: "objectivesProgress_performanceMeasuresIndicators",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: ValidationType.TEXT,
                  props: {
                    label:
                      "Provide data on performance measures or indicators used for monitoring progress toward the objective during the current reporting period. Include progress toward milestones and key deliverables.",
                  },
                },
                {
                  id: "objectivesProgress_quantitative",
                  type: ReportFormFieldType.NO_TYPE,
                  transformation: {
                    rule: TransformationRule.QUANTITATIVE_QUARTERS,
                  },
                },
                {
                  id: "objectivesProgress_deliverablesMet",
                  type: ReportFormFieldType.RADIO,
                  validation: ValidationType.RADIO,
                  props: {
                    label:
                      "Were targets for performance measures or expected time frames for deliverables met?",
                    choices: [
                      {
                        id: "2WaO1Jj3pyUN0j9KjeOqR",
                        label: "Yes",
                      },
                      {
                        id: "2WaO1K5umgZcZV4bAW5sPu",
                        label: "No",
                        children: [
                          {
                            id: "objectivesProgress_deliverablesMet_otherText",
                            props: {
                              label:
                                "Describe progress toward reaching the target/milestone during the reporting period. How close are you to meeting the target? How do you plan to address any obstacle(s) to meeting the target?",
                            },
                            type: ReportFormFieldType.TEXTAREA,
                            validation: {
                              type: ValidationType.TEXT,
                              parentFieldName:
                                "objectivesProgress_deliverablesMet",
                              parentOptionId:
                                "objectivesProgress_deliverablesMet-2WaO1K5umgZcZV4bAW5sPu",
                              nested: true,
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
        },
        {
          name: "Initiative progress",
          pageType: PageTypes.ENTITY_OVERLAY,
          entityType: StepEntityType.INITIATIVE,
          stepType: StepType.INITIATIVE_PROGRESS,
          stepInfo: ["name", "hint"],
          hint: "Report overall progress for the initiative",
          isRequired: true,
          verbiage: {
            intro: {
              section: "State or Territory-Specific Initiatives",
              info: [
                {
                  type: "h3",
                  content: "Initiative progress",
                },
                {
                  type: "p",
                  content:
                    "Report progress for this initiative during this reporting period.",
                },
                {
                  type: "p",
                  content:
                    "Report key accomplishments or challenges for this initiative that are not otherwise mentioned under the objective(s). Recipients can document whether they are considering changes to objective(s) or the initiative based on the developments to date, including collaborations that may be under consideration or occurring with external parties to assist with running the initiative or achieving objectives.",
                },
              ],
            },
            enterEntityDetailsButtonText: "Edit",
            readOnlyEntityDetailsButtonText: "View",
            editEntityHint: 'Select "Edit" to report the overall progress.',
            reviewPdfHint:
              'To view totals against targets from your associated MFP Work Plan, click "Review PDF" and it will open a summary in a new tab.',
          },
          form: {
            id: "stsiip",
            fields: [
              {
                id: "initiativeProgress_describeProgress",
                type: ReportFormFieldType.TEXTAREA,
                validation: ValidationType.TEXT,
                props: {
                  label:
                    "Describe any progress made under this initiative during the reporting period not otherwise mentioned under the objective(s).",
                },
              },
              {
                id: "initiativeProgress_describeIssuesChallenges",
                type: ReportFormFieldType.TEXTAREA,
                validation: ValidationType.TEXT,
                props: {
                  label:
                    "Describe any issues or challenges that have impacted the development and implementation of the initiative during the reporting period that are not otherwise mentioned under the objective(s).",
                  hint: "Detail what impact such issues may have on the state or territory's ability to provide HCBS rather than institutional services, and describe how you plan to address these issues.",
                },
              },
              {
                id: "initiativeProgress_describeCollaborationsWithExternalParties",
                type: ReportFormFieldType.TEXTAREA,
                validation: ValidationType.TEXT,
                props: {
                  label:
                    "List and describe any collaborations you have with any external parties to run the initiative tasks or to achieve initiative goals.",
                },
              },
            ],
          },
        },
        {
          name: "Expenditures",
          pageType: PageTypes.ENTITY_OVERLAY,
          entityType: StepEntityType.INITIATIVE,
          stepType: StepType.EXPENDITURES,
          stepInfo: ["name", "hint"],
          hint: "Report actual quarterly expenditures by funding source",
          isRequired: true,
          verbiage: {
            intro: {
              section: "State or Territory-Specific Initiatives",
              info: [
                {
                  type: "h3",
                  content: "Expenditures",
                },
                {
                  type: "p",
                  content:
                    "Report initiative expenditures by quarter and funding source. Report actual spending for each quarter for this initiative. Recipients plan quarterly expenditure targets in your MFP Work Plan’s funding sources. Recipients with discrepancies between projected and actual spending due solely to lag time between incurring costs and disbursing funds will have the option to note those cases in this section.",
                },
                {
                  type: "p",
                  content:
                    "Funding sources and projected spending are auto-populated from your associated MFP Work Plan.",
                },
              ],
            },
            enterEntityDetailsButtonText: "Edit",
            readOnlyEntityDetailsButtonText: "View",
            editEntityHint: 'Select "Edit" to report expenditures.',
            reviewPdfHint:
              'To view totals against targets from your associated MFP Work Plan, click "Review PDF" and it will open a summary in a new tab.',
          },
          form: {
            id: "stsie",
            fields: [
              {
                id: "fundingSources",
                type: ReportFormFieldType.NUMBER,
                validation: ValidationType.NUMBER,
                transformation: {
                  rule: TransformationRule.FUNDING_SOURCES,
                },
                props: {
                  mask: "currency",
                },
              },
              {
                id: "expenditures_onTrackToFullExpendFunds",
                type: ReportFormFieldType.RADIO,
                validation: ValidationType.RADIO,
                props: {
                  label:
                    "Taking the lag time for reporting expenditures into account, is the state or territory on track to fully expend funds within the projected time frame for this initiative?",
                  hint: "",
                  choices: [
                    {
                      id: "2WaUKOjwgUvHO6CMAqE8aOC",
                      label: "Yes",
                    },
                    {
                      id: "2WaUKNbCmetqXVFsKnaHqeK",
                      label: "No",
                      children: [
                        {
                          id: "expenditures_onTrackToFullExpendFunds-otherText",
                          type: ReportFormFieldType.TEXTAREA,
                          validation: {
                            type: ValidationType.TEXT,
                            parentFieldName:
                              "expenditures_onTrackToFullExpendFunds",
                            parentOptionId: "2WaUKNbCmetqXVFsKnaHqeK",
                            nested: true,
                          },
                          props: {
                            label:
                              "Briefly explain what has contributed to lower than projected expenditures (e.g., challenges with hiring, delays in start-up) and describe your revised time frame for fully expending awarded funds.",
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
      ],
    },
    initiatives: [],
  };
