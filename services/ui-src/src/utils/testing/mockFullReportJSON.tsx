//temporary, delete when database is ready

import {
  ReportJson,
  ReportMetadataShape,
  ReportShape,
  ReportStatus,
} from "types";

export const mockFullReportJSON: ReportJson = {
  id: "2V2LLezUtxYOBRMEoiTp5r1O71X",
  type: "WP",
  name: "WP Report Submission Form",
  basePath: "/wp",
  routes: [
    {
      name: "A: Program Information",
      path: "/wp/general-information",
      children: [
        {
          name: "Point of Contact",
          path: "/mcpar/program-information/point-of-contact",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section A: Program Information",
              subsection: "Point of Contact",
              spreadsheet: "A_Program_Info",
            },
          },
          form: {
            id: "apoc",
            fields: [
              {
                id: "stateName",
                type: "text",
                validation: "text",
                props: {
                  label: "A.1 State name",
                  hint: "Auto-populated from your account profile.",
                  disabled: true,
                  hydrate: "Minnesota",
                },
              },
              {
                id: "contactName",
                type: "text",
                validation: "text",
                props: {
                  label: "A.2a Contact name",
                  hint: "First and last name of the contact person. <br/> States that do not wish to list a specific individual on the report are encouraged to use a department or program-wide email address that will allow anyone with questions to quickly reach someone who can provide answers.",
                },
              },
              {
                id: "contactEmailAddress",
                type: "text",
                validation: "email",
                props: {
                  label: "A.2b Contact email address",
                  hint: "Enter email address. Department or program-wide email addresses ok.",
                },
              },
              {
                id: "submitterName",
                type: "text",
                validation: "textOptional",
                props: {
                  label: "A.3a Submitter name",
                  hint: "CMS receives this data upon submission of this MCPAR report.",
                  disabled: true,
                },
              },
              {
                id: "submitterEmailAddress",
                type: "text",
                validation: "emailOptional",
                props: {
                  label: "A.3b Submitter email address",
                  hint: "CMS receives this data upon submission of this MCPAR report.",
                  disabled: true,
                },
              },
              {
                id: "reportSubmissionDate",
                type: "date",
                validation: "textOptional",
                props: {
                  label: "A.4 Date of report submission",
                  hint: "CMS receives this date upon submission of this MCPAR report.",
                  disabled: true,
                },
              },
            ],
          },
        },
        {
          name: "Reporting Period",
          path: "/mcpar/program-information/reporting-period",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section A: Program Information",
              subsection: "Reporting Period",
              spreadsheet: "A_Program_Info",
            },
          },
          form: {
            id: "arp",
            fields: [
              {
                id: "reportingPeriodStartDate",
                type: "date",
                validation: "date",
                props: {
                  label: "A.5a Reporting period start date",
                  hint: "Auto-populated from report dashboard.",
                  disabled: true,
                },
              },
              {
                id: "reportingPeriodEndDate",
                type: "date",
                validation: "date",
                props: {
                  label: "A.5b Reporting period end date",
                  hint: "Auto-populated from report dashboard.",
                  disabled: true,
                },
              },
              {
                id: "programName",
                type: "text",
                validation: "text",
                props: {
                  label: "A.6 Program name",
                  hint: "Auto-populated from report dashboard.",
                  disabled: true,
                },
              },
            ],
          },
        },
        {
          name: "Add Plans",
          path: "/mcpar/program-information/add-plans",
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
            fields: [
              {
                id: "plans",
                type: "dynamic",
                validation: "dynamic",
                props: {
                  label: "Plan name",
                },
              },
            ],
          },
        },
        {
          name: "Add BSS Entities",
          path: "/mcpar/program-information/add-bss-entities",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section A: Program Information",
              subsection: "Add BSS entities (A.8)",
              spreadsheet: "A_Program_Info",
              info: [
                {
                  type: "span",
                  content:
                    "Enter the names of Beneficiary Support System (BSS) entities that support enrollees in the program for which the state is reporting data. Learn more about BSS entities at ",
                },
                {
                  type: "externalLink",
                  content: "42 CFR 438.71",
                  props: {
                    href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.71",
                    target: "_blank",
                    "aria-label": "42 CFR 438.71 (link opens in new tab).",
                  },
                },
                {
                  type: "html",
                  content:
                    "<span>. See Glossary in Excel Workbook for the definition of BSS entities.</span><p>Examples of BSS entity types include a: State or Local Government Entity, Ombudsman Program, State Health Insurance Program (SHIP), Aging and Disability Resource Network (ADRN), Center for Indepedent Living (CIL), Legal Assistance Organization, Community-based Organization, Subcontractor, Enrollment Broker, Consultant, or Academic/Research Organization.</p>",
                },
              ],
            },
          },
          form: {
            id: "absse",
            fields: [
              {
                id: "bssEntities",
                type: "dynamic",
                validation: "dynamic",
                props: {
                  label: "BSS entity name",
                },
              },
            ],
          },
        },
      ],
    },
    {
      name: "B: State-Level Indicators",
      path: "/wp/state-level-indicators",
      children: [
        {
          name: "I: Program Characteristics",
          path: "/wp/state-level-indicators/program-characteristics",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section B: State-Level Indicators",
              subsection: "Topic I. Program Characteristics and Enrollment",
              spreadsheet: "B_State",
            },
          },
          form: {
            id: "bpc",
            fields: [
              {
                id: "state_statewideMedicaidEnrollment",
                type: "number",
                validation: "number",
                props: {
                  label: "B.I.1 Statewide Medicaid enrollment",
                  hint: "Enter the total number of individuals enrolled in Medicaid as of the first day of the last month of the reporting year.</br>Include all FFS and managed care enrollees, and count each person only once, regardless of the delivery system(s) in which they are enrolled.",
                  mask: "comma-separated",
                },
              },
              {
                id: "state_statewideMedicaidManagedCareEnrollment",
                type: "number",
                validation: "number",
                props: {
                  label: "B.I.2 Statewide Medicaid managed care enrollment",
                  hint: "Enter the total, unduplicated number of individuals enrolled in any type of Medicaid managed care as of the first day of the last month of the reporting year.</br>Include enrollees in all programs, and count each person only once, even if they are enrolled in more than one managed care program or more than one managed care plan.",
                  mask: "comma-separated",
                },
              },
            ],
          },
        },
        {
          name: "III: Encounter Data Report",
          path: "/wp/state-level-indicators/encounter-data-report",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section B: State-Level Indicators",
              subsection: "Topic III. Encounter Data Report",
              spreadsheet: "B_State",
            },
          },
          form: {
            id: "bedr",
            fields: [
              {
                id: "state_encounterDataValidationEntity",
                type: "checkbox",
                validation: "checkbox",
                props: {
                  label: "B.III.1 Data validation entity",
                  hint: "Select the state agency/division or contractor tasked with evaluating the validity of encounter data submitted by MCPs.</br>Encounter data validation includes verifying the accuracy, completeness, timeliness, and/or consistency of encounter data records submitted to the state by Medicaid managed care plans. Validation steps may include pre-acceptance edits and post-acceptance analyses. See Glossary in Excel Workbook for more information.",
                  choices: [
                    {
                      id: "2iuXO7C6nk6cuP9JXbdd2w",
                      label: "State Medicaid agency staff",
                    },
                    {
                      id: "vmlIjQAe9kyz4FbtxBZINA",
                      label: "Other state agency staff",
                    },
                    {
                      id: "Vg8erh64Tk2nKd5olVwM9w",
                      label: "State actuaries",
                    },
                    {
                      id: "azz5rhd8V0GK27fIXaYSmw",
                      label: "EQRO",
                    },
                    {
                      id: "OLmKdPAEI0WnbSV1sVccVw",
                      label: "Other third-party vendor",
                    },
                    {
                      id: "SyQu5rtdV06hEaUBCLZsYw",
                      label: "Proprietary system(s)",
                      children: [
                        {
                          id: "state_encounterDataValidationSystemHipaaCompliance",
                          type: "radio",
                          validation: {
                            type: "radio",
                            nested: true,
                            parentFieldName:
                              "state_encounterDataValidationEntity",
                          },
                          props: {
                            label:
                              "B.III.2 HIPAA compliance of proprietary system(s) for encounter data validation",
                            hint: "Were the system(s) utilized fully HIPAA compliant? Select one.",
                            choices: [
                              {
                                id: "DeRYxSPAg0aZpPgqHfUcGA",
                                label: "Yes",
                              },
                              {
                                id: "CJVUudlBrEGWZAv7CVqKrQ",
                                label: "No",
                              },
                            ],
                          },
                        },
                      ],
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
            ],
          },
        },
        {
          name: "X: Program Integrity",
          path: "/wp/state-level-indicators/program-integrity",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section B: State-Level Indicators",
              subsection: "Topic X: Program Integrity",
              spreadsheet: "B_State",
            },
          },
          form: {
            id: "bpi",
            fields: [
              {
                id: "state_focusedProgramIntegrityActivitiesConducted",
                type: "textarea",
                validation: "text",
                props: {
                  label: "B.X.1 Payment risks between the state and plans",
                  hint: "Describe service-specific or other focused PI activities that the state conducted during the past year in this managed care program.</br>Examples include analyses focused on use of long-term services and supports (LTSS) or prescription drugs or activities that focused on specific payment issues to identify, address, and prevent fraud, waste or abuse. Consider data analytics, reviews of under/overutilization, and other activities.",
                },
              },
              {
                id: "state_overpaymentStandard",
                type: "radio",
                validation: "radio",
                props: {
                  label: "B.X.2 Contract standard for overpayments",
                  hint: "Does the state allow plans to retain overpayments, require the return of overpayments, or has established a hybrid system? Select one.",
                  choices: [
                    {
                      id: "UG7uunqq5UCtUq1is3iyiw",
                      label: "Allow plans to retain overpayments",
                    },
                    {
                      id: "3DGAqqnOBE2kwKVFMxUt3A",
                      label: "State requires the return of overpayments",
                    },
                    {
                      id: "jlIZKSPaf0GSVGmJbRUBzg",
                      label: "State has established a hybrid system",
                    },
                  ],
                },
              },
              {
                id: "state_overpaymentStandardContractLanguageLocation",
                type: "textarea",
                validation: "text",
                props: {
                  label:
                    "B.X.3 Location of contract provision stating overpayment standard",
                  hint: "Describe where the overpayment standard in the previous indicator is located in plan contracts, as required by 42 CFR 438.608(d)(1)(i).",
                },
              },
              {
                id: "state_overpaymentStandardDescription",
                type: "textarea",
                validation: "text",
                props: {
                  label: "B.X.4 Description of overpayment contract standard",
                  hint: "Briefly describe the overpayment standard (for example, details on whether the state allows plans to retain overpayments, requires the plans to return overpayments, or administers a hybrid system) selected in indicator B.X.2.",
                },
              },
              {
                id: "state_overpaymentReportingMonitoringEfforts",
                type: "textarea",
                validation: "text",
                props: {
                  label: "B.X.5 State overpayment reporting monitoring",
                  hint: "Describe how the state monitors plan performance in reporting overpayments to the state, e.g. does the state track compliance with this requirement and/or timeliness of reporting?</br>The regulations at 438.604(a)(7), 608(a)(2) and 608(a)(3) require plan reporting to the state on various overpayment pieces (whether annually or promptly). This indicator is asking the state how it monitors that reporting.",
                },
              },
              {
                id: "state_beneficiaryCircumstanceChangeReconciliationEfforts",
                type: "textarea",
                validation: "text",
                props: {
                  label: "B.X.6 Changes in beneficiary circumstances",
                  hint: "Describe how the state ensures timely and accurate reconciliation of enrollment files between the state and plans to ensure appropriate payments for enrollees experiencing a change in status (e.g., incarcerated, deceased, switching plans).",
                },
              },
              {
                id: "state_providerTerminationReportingMonitoringEfforts",
                type: "radio",
                validation: "radio",
                props: {
                  label:
                    "B.X.7a Changes in provider circumstances: Monitoring plans",
                  hint: "Does the state monitor whether plans report provider “for cause” terminations in a timely manner under 42 CFR 438.608(a)(4)? Select one.",
                  choices: [
                    {
                      id: "WFrdLUutmEujEZkS7rWVqQ",
                      label: "Yes",
                      children: [
                        {
                          id: "state_providerTerminationReportingMonitoringMetrics",
                          type: "radio",
                          validation: {
                            type: "radio",
                            nested: true,
                            parentFieldName:
                              "state_providerTerminationReportingMonitoringEfforts",
                          },
                          props: {
                            label:
                              "B.X.7b Changes in provider circumstances: Metrics",
                            hint: "Does the state use a metric or indicator to assess plan reporting performance? Select one.",
                            choices: [
                              {
                                id: "SPqyExyg8UioX6Od1IWvlg",
                                label: "Yes",
                                children: [
                                  {
                                    id: "state_providerTerminationReportingMonitoringMetricsDescription",
                                    type: "textarea",
                                    validation: {
                                      type: "text",
                                      nested: true,
                                      parentFieldName:
                                        "state_providerTerminationReportingMonitoringMetrics",
                                    },
                                    props: {
                                      label:
                                        "B.X.7c Changes in provider circumstances: Describe metric",
                                      hint: "Describe the metric or indicator that the state uses.",
                                    },
                                  },
                                ],
                              },
                              {
                                id: "XPflE27BV0G3RJFYxuw8QA",
                                label: "No",
                              },
                            ],
                          },
                        },
                      ],
                    },
                    {
                      id: "3tIhiqQxhEiSIhM7UW1DKQ",
                      label: "No",
                    },
                  ],
                },
              },
              {
                id: "state_excludedEntityIdentifiedInFederalDatabaseCheck",
                type: "radio",
                validation: "radio",
                props: {
                  label:
                    "B.X.8a Federal database checks: Excluded person or entities",
                  hint: "During the state's federal database checks, did the state find any person or entity excluded? Select one.</br>Consistent with the requirements at 42 CFR 455.436 and 438.602, the State must confirm the identity and determine the exclusion status of the MCO, PIHP, PAHP, PCCM or PCCM entity, any subcontractor, as well as any person with an ownership or control interest, or who is an agent or managing employee of the MCO, PIHP, PAHP, PCCM or PCCM entity through routine checks of Federal databases.",
                  choices: [
                    {
                      id: "zrrv4vmXRkGhSkaS2V2d3A",
                      label: "Yes",
                      children: [
                        {
                          id: "state_excludedEntityIdentificationInstancesSummary",
                          type: "textarea",
                          validation: {
                            type: "text",
                            nested: true,
                            parentFieldName:
                              "state_excludedEntityIdentifiedInFederalDatabaseCheck",
                          },
                          props: {
                            label:
                              "B.X.8b Federal database checks: Summarize instances of exclusion",
                            hint: "Summarize the instances and whether the entity was notified as required in 438.602(d). Report actions taken, such as plan-level sanctions and corrective actions.",
                          },
                        },
                      ],
                    },
                    {
                      id: "ed1vyv6qB0a4aDLSeHOGPQ",
                      label: "No",
                    },
                  ],
                },
              },
              {
                id: "state_ownershipControlDisclosureWebsite",
                type: "radio",
                validation: "radio",
                props: {
                  label:
                    "B.X.9a Website posting of 5 percent or more ownership control",
                  hint: "Does the state post on its website the names of individuals and entities with 5% or more ownership or control interest in MCOs, PIHPs, PAHPs, PCCMs and PCCM entities and subcontractors? Refer to §455.104 and required by 42 CFR 438.602(g)(3).",
                  choices: [
                    {
                      id: "fNiPtEub20Soo1W5FcdU3A",
                      label: "Yes",
                      children: [
                        {
                          id: "state_ownershipControlDisclosureWebsiteLink",
                          type: "text",
                          validation: {
                            type: "url",
                            nested: true,
                            parentFieldName:
                              "state_ownershipControlDisclosureWebsite",
                          },
                          props: {
                            label:
                              "B.X.9b Website posting of 5 percent or more ownership control: Link",
                            hint: "What is the link to the website? Refer to 42 CFR 602(g)(3).",
                          },
                        },
                      ],
                    },
                    {
                      id: "qhyidi0w4UiiBvCsoTgFOg",
                      label: "No",
                    },
                  ],
                },
              },
              {
                id: "state_submittedDataAuditResults",
                type: "textarea",
                validation: "text",
                props: {
                  label: "B.X.10 Periodic audits",
                  hint: "If the state conducted any audits during the contract year to determine the accuracy, truthfulness, and completeness of the encounter and financial data submitted by the plans, what is the link(s) to the audit results? Refer to 42 CFR 438.602(e).",
                },
              },
            ],
          },
        },
      ],
    },
    {
      name: "C: Program-Level Indicators",
      path: "/wp/program-level-indicators",
      children: [
        {
          name: "I: Program Characteristics",
          path: "/wp/program-level-indicators/program-characteristics",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section C: Program-Level Indicators",
              subsection: "Topic I: Program Characteristics",
              // "spreadsheet": "C1_Program_Set"
            },
          },
          form: {
            id: "cpc",
            fields: [
              {
                id: "program_contractTitle",
                type: "text",
                validation: "text",
                props: {
                  label: "C1.I.1 Program contract",
                  hint: "Enter the title of the contract between the state and plans participating in the managed care program.",
                },
              },
              {
                id: "program_contractDate",
                type: "date",
                validation: "date",
                props: {
                  hint: "Enter the date of the contract between the state and plans participating in the managed care program.",
                },
              },
              {
                id: "program_contractUrl",
                type: "text",
                validation: "url",
                props: {
                  label: "C1.I.2 Contract URL",
                  hint: "Provide the hyperlink to the model contract or landing page for executed contracts for the program reported in this program.",
                },
              },
              {
                id: "program_type",
                type: "radio",
                validation: "radio",
                props: {
                  label: "C1.I.3 Program type",
                  hint: "What is the type of MCPs that contract with the state to provide the services covered under the program? Select one.",
                  choices: [
                    {
                      id: "rP1NWfC2jEGDwLSnSZVWDg",
                      label: "Managed Care Organization (MCO)",
                    },
                    {
                      id: "rJHLjCGMa0CW2YIX0HOC6w",
                      label: "Prepaid Inpatient Health Plan (PIHP)",
                    },
                    {
                      id: "MaaUjgQ8sk6egWLalC6h7w",
                      label: "Prepaid Ambulatory Health Plan (PAHP)",
                    },
                    {
                      id: "atiwcA9QUE2eoTchV2ZLtw",
                      label: "Primary Care Case Management (PCCM) Entity",
                    },
                    {
                      id: "oaiOvxrN6EqfTqV1lAc9kQ",
                      label: "Other, specify",
                      children: [
                        {
                          id: "program_type-otherText",
                          type: "textarea",
                          validation: {
                            type: "text",
                            nested: true,
                            parentFieldName: "program_type",
                          },
                        },
                      ],
                    },
                  ],
                },
              },
              {
                id: "program_coveredSpecialBenefits",
                type: "checkbox",
                validation: "checkbox",
                props: {
                  label: "C1.I.4a Special program benefits",
                  hint: "Are any of the four special benefit types covered by the managed care program: (1) behavioral health, (2) long-term services and supports, (3) dental, and (4) transportation, or (5) none of the above? Select one or more.</br>Only list the benefit type if it is a covered service as specified in a contract between the state and managed care plans participating in the program. Benefits available to eligible program enrollees via fee-for-service should not be listed here.",
                  choices: [
                    {
                      id: "TXvFpzmNqkCgpLcDckL5QQ",
                      label: "Behavioral health",
                    },
                    {
                      id: "87et9SaCr0uSt4vqFercBw",
                      label: "Long-term services and supports (LTSS)",
                    },
                    {
                      id: "I1FxuAG3U0WbV5KSNGXXug",
                      label: "Dental",
                    },
                    {
                      id: "4hRianKm4Ui74nk0WqTA0A",
                      label: "Transportation",
                    },
                    {
                      id: "WDiUOKx9LUSmspPjMMZ1Qg",
                      label: "None of the above",
                      children: [
                        {
                          id: "program_coveredSpecialBenefits-otherText",
                          type: "textarea",
                          validation: {
                            type: "text",
                            nested: true,
                            parentFieldName: "program_coveredSpecialBenefits",
                          },
                        },
                      ],
                    },
                  ],
                },
              },
              {
                id: "program_specialBenefitsAvailabilityVariation",
                type: "textarea",
                validation: "text",
                props: {
                  label: "C1.I.4b Variation in special benefits",
                  hint: 'What are any variations in the availability of special benefits within the program (e.g. by service area or population)? Enter "N/A" if not applicable.',
                },
              },
              {
                id: "program_enrollment",
                type: "number",
                validation: "number",
                props: {
                  label: "C1.I.5 Program enrollment",
                  hint: "Enter the total number of individuals enrolled in the managed care program as of the first day of the last month of the reporting year.",
                  mask: "comma-separated",
                },
              },
              {
                id: "program_enrollmentBenefitChanges",
                type: "textarea",
                validation: "text",
                props: {
                  label: "C1.I.6 Changes to enrollment or benefits",
                  hint: "Briefly explain any major changes to the population enrolled in or benefits provided by the managed care program during the reporting year.",
                },
              },
            ],
          },
        },
        {
          name: "III: Encounter Data Report",
          path: "/wp/program-level-indicators/encounter-data-report",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section C: Program-Level Indicators",
              subsection: "Topic III: Encounter Data Report",
              // "spreadsheet": "C1_Program_Set"
            },
          },
          form: {
            id: "cedr",
            fields: [
              {
                id: "program_encounterDataUses",
                type: "checkbox",
                validation: "checkbox",
                props: {
                  label: "C1.III.1 Uses of encounter data",
                  hint: "For what purposes does the state use encounter data collected from managed care plans (MCPs)? Select one or more.<br/>Federal regulations require that states, through their contracts with MCPs, collect and maintain sufficient enrollee encounter data to identify the provider who delivers any item(s) or service(s) to enrollees (42 CFR 438.242(c)(1)).",
                  choices: [
                    {
                      id: "eSrOkLMTyEmmixeqNXV1ZA",
                      label: "Rate setting",
                    },
                    {
                      id: "Ga9PZEVDBEOZULWeJdJznw",
                      label: "Quality/performance measurement",
                    },
                    {
                      id: "OF4juaUqz0GrUVVzvHjuEA",
                      label: "Monitoring and reporting",
                    },
                    {
                      id: "n8IjGT6b60qpp5KCHAJeyA",
                      label: "Contract oversight",
                    },
                    {
                      id: "6JVi42VKSEO39fJSma8BzA",
                      label: "Program integrity",
                    },
                    {
                      id: "RuBQRzexDUeq9St0E6sJdw",
                      label: "Policy making and decision support",
                    },
                    {
                      id: "Lxb161V64E27MlzL7boAFw",
                      label: "Other, specify",
                      children: [
                        {
                          id: "program_encounterDataUses-otherText",
                          type: "textarea",
                          validation: {
                            type: "text",
                            nested: true,
                            parentFieldName: "program_encounterDataUses",
                          },
                        },
                      ],
                    },
                    {
                      id: "WeIIplvIUEiCMdD2qKNz9w",
                      label: "Encounter data not used for any purpose",
                    },
                  ],
                },
              },
              {
                id: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria",
                type: "checkbox",
                validation: "checkbox",
                props: {
                  label:
                    "C1.III.2 Criteria/measures to evaluate MCP performance",
                  hint: "What types of measures are used by the state to evaluate managed care plan performance in encounter data submission and correction? Select one or more.<br/>Federal regulations also require that states validate that submitted enrollee encounter data they receive is a complete and accurate representation of the services provided to enrollees under the contract between the state and the MCO, PIHP, or PAHP. 42 CFR 438.242(d).",
                  choices: [
                    {
                      id: "kP5W9deIb06jK7SXX8dnRA",
                      label: "Timeliness of initial data submissions",
                    },
                    {
                      id: "rsqVEBVarkij4Ks9vmgE3g",
                      label: "Timeliness of data corrections",
                    },
                    {
                      id: "Lo4seplZ3UGTktvCFuAtqw",
                      label: "Timeliness of data certifications",
                    },
                    {
                      id: "448Z26i8ikOhiFzqbdkeNg",
                      label: "Use of correct file formats",
                    },
                    {
                      id: "auYEK7okWkSc1hSwsYaAVQ",
                      label: "Provider ID field complete",
                    },
                    {
                      id: "mmtZcSBPUkGPCpQqc9wkyg",
                      label:
                        "Overall data accuracy (as determined through data validation)",
                    },
                    {
                      id: "J8l0u9V4VEeQmiZCB5Djrg",
                      label: "Other, specify",
                      children: [
                        {
                          id: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria-otherText",
                          type: "textarea",
                          validation: {
                            type: "text",
                            nested: true,
                            parentFieldName:
                              "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria",
                          },
                        },
                      ],
                    },
                    {
                      id: "FrCigNtArkCCqdkxU8fjlA",
                      label: "None of the above",
                    },
                  ],
                },
              },
              {
                id: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteriaContractLanguageLocation",
                type: "textarea",
                validation: "text",
                props: {
                  label:
                    "C1.III.3 Encounter data performance criteria contract language",
                  hint: "Provide reference(s) to the contract section(s) that describe the criteria by which managed care plan performance on encounter data submission and correction will be measured. Use contract section references, not page numbers.",
                },
              },
              {
                id: "program_encounterDataSubmissionQualityFinancialPenaltiesContractLanguageLocation",
                type: "textarea",
                validation: "text",
                props: {
                  label: "C1.III.4 Financial penalties contract language",
                  hint: "Provide reference(s) to the contract section(s) that describes any financial penalties the state may impose on plans for the types of failures to meet encounter data submission and quality standards. Use contract section references, not page numbers.",
                },
              },
              {
                id: "program_encounterDataQualityIncentives",
                type: "textarea",
                validation: "text",
                props: {
                  label: "C1.III.5 Incentives for encounter data quality",
                  hint: 'Describe the types of incentives that may be awarded to managed care plans for encounter data quality. Reply with "N/A" if the plan does not use incentives to award encounter data quality.',
                },
              },
              {
                id: "program_encounterDataCollectionValidationBarriers",
                type: "textarea",
                validation: "text",
                props: {
                  label:
                    "C1.III.6 Barriers to collecting/validating encounter data",
                  hint: "Describe any barriers to collecting and/or validating managed care plan encounter data that the state has experienced during the reporting period.",
                },
              },
            ],
          },
        },
        {
          name: "IV: Appeals, State Fair Hearings & Grievances",
          path: "/wp/program-level-indicators/appeals-state-fair-hearings-and-grievances",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section C: Program-Level Indicators",
              subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
              // "spreadsheet": "C1_Program_Set"
            },
          },
          form: {
            id: "casfhag",
            fields: [
              {
                id: "program_criticalIncidentDefinition",
                type: "textarea",
                validation: "text",
                props: {
                  label:
                    'C1.IV.1 State\'s definition of "critical incident," as used for reporting purposes in its MLTSS program',
                  hint: 'If this report is being completed for a managed care program that covers LTSS, what is the definition that the state uses for "critical incidents" within the managed care program? Respond with "N/A" if the managed care program does not cover LTSS.',
                },
              },
              {
                id: "program_standardAppealTimelyResolutionDefinition",
                type: "textarea",
                validation: "text",
                props: {
                  label:
                    'C1.IV.2 State definition of "timely" resolution for standard appeals',
                  hint: "Provide the state's definition of timely resolution for standard appeals in the managed care program.</br>Per 42 CFR §438.408(b)(2), states must establish a timeframe for timely resolution of standard appeals that is no longer than 30 calendar days from the day the MCO, PIHP or PAHP receives the appeal.",
                },
              },
              {
                id: "program_expeditedAppealTimelyResolutionDefinition",
                type: "textarea",
                validation: "text",
                props: {
                  label:
                    'C1.IV.3 State definition of "timely" resolution for expedited appeals',
                  hint: "Provide the state's definition of timely resolution for expedited appeals in the managed care program.</br>Per 42 CFR §438.408(b)(3), states must establish a timeframe for timely resolution of expedited appeals that is no longer than 72 hours after the MCO, PIHP or PAHP receives the appeal.",
                },
              },
              {
                id: "program_grievanceTimelyResolutionDefinition",
                type: "textarea",
                validation: "text",
                props: {
                  label:
                    'C1.IV.4 State definition of "timely" resolution for grievances',
                  hint: "Provide the state's definition of timely resolution for grievances in the managed care program.</br>Per 42 CFR §438.408(b)(1), states must establish a timeframe for timely resolution of grievances that is no longer than 90 calendar days from the day the MCO, PIHP or PAHP receives the grievance.",
                },
              },
            ],
          },
        },
        {
          name: "V: Availability & Accessibility",
          path: "/wp/program-level-indicators/availability-and-accessibility",
          children: [
            {
              name: "Network Adequacy",
              path: "/wp/program-level-indicators/availability-and-accessibility/network-adequacy",
              pageType: "standard",
              verbiage: {
                intro: {
                  section: "Section C: Program-Level Indicators",
                  subsection:
                    "Topic V. Availability, Accessibility and Network Adequacy",
                  // "spreadsheet": "C1_Program_Set",
                  info: [
                    {
                      type: "heading",
                      as: "h3",
                      content: "Network Adequacy",
                    },
                  ],
                },
              },
              form: {
                id: "cna",
                fields: [
                  {
                    id: "program_networkAdequacyChallenges",
                    type: "textarea",
                    validation: "text",
                    props: {
                      label: "C1.V.1 Gaps/challenges in network adequacy",
                      hint: "What are the state’s biggest challenges? Describe any challenges MCPs have maintaining adequate networks and meeting standards.",
                    },
                  },
                  {
                    id: "program_networkAdequacyGapResponseEfforts",
                    type: "textarea",
                    validation: "text",
                    props: {
                      label:
                        "C1.V.2 State response to gaps in network adequacy",
                      hint: "How does the state work with MCPs to address gaps in network adequacy?",
                    },
                  },
                ],
              },
            },
          ],
        },
        {
          name: "IX: BSS",
          path: "/wp/program-level-indicators/bss",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section C: Program-Level Indicators",
              subsection: "Topic IX: Beneficiary Support System (BSS)",
              // "spreadsheet": "C1_Program_Set"
            },
          },
          form: {
            id: "cbss",
            fields: [
              {
                id: "state_bssWebsite",
                type: "textarea",
                validation: "text",
                props: {
                  label: "C1.IX.1 BSS website",
                  hint: "List the website(s) and/or email address that beneficiaries use to seek assistance from the BSS through electronic means. Separate entries with commas.",
                },
              },
              {
                id: "state_bssEntityServiceAccessibility",
                type: "textarea",
                validation: "text",
                props: {
                  label: "C1.IX.2 BSS auxiliary aids and services",
                  hint: "How do BSS entities offer services in a manner that is accessible to all beneficiaries who need their services, including beneficiaries with disabilities, as required by 42 CFR 438.71(b)(2))?</br>CFR 438.71 requires that the beneficiary support system be accessible in multiple ways including phone, Internet, in-person, and via auxiliary aids and services when requested.",
                },
              },
              {
                id: "state_bssEntityLtssProgramDataIssueAssistance",
                type: "textarea",
                validation: "text",
                props: {
                  label: "C1.IX.3 BSS LTSS program data",
                  hint: "How do BSS entities assist the state with identifying, remediating, and resolving systemic issues based on a review of LTSS program data such as grievances and appeals or critical incident data? Refer to 42 CFR 438.71(d)(4).",
                },
              },
              {
                id: "state_bssEntityPerformanceEvaluationMethods",
                type: "textarea",
                validation: "text",
                props: {
                  label: "C1.IX.4 State evaluation of BSS entity performance",
                  hint: "What are steps taken by the state to evaluate the quality, effectiveness, and efficiency of the BSS entities' performance?",
                },
              },
            ],
          },
        },
        {
          name: "X: Program Integrity",
          path: "/wp/program-level-indicators/program-integrity",
          pageType: "standard",
          verbiage: {
            intro: {
              section: "Section C: Program-Level Indicators",
              subsection: "Topic X: Program Integrity",
              // "spreadsheet": "C1_Program_Set"
            },
          },
          form: {
            id: "cpi",
            fields: [
              {
                id: "program_prohibitedAffiliationDisclosure",
                type: "radio",
                validation: "radio",
                props: {
                  label: "C1.X.3 Prohibited affiliation disclosure",
                  hint: "Did any plans disclose prohibited affiliations? If the state took action, enter those actions under D: Plan-level Indicators, Section VIII - Sanctions (Corresponds with Tab D3 in the Excel Workbook). Refer to 42 CFR 438.610(d).",
                  choices: [
                    {
                      id: "7emiYPcs60GzXxKS5Pc9bg",
                      label: "Yes",
                    },
                    {
                      id: "SCGdBlpSQU6OVWAf3mDlMQ",
                      label: "No",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    {
      name: "D: Plan-Level Indicators",
      path: "/wp/plan-level-indicators",
      children: [
        {
          name: "I: Program Characteristics",
          path: "/wp/plan-level-indicators/program-characteristics",
          pageType: "drawer",
          entityType: "plans",
          verbiage: {
            intro: {
              section: "Section D: Plan-Level Indicators",
              subsection: "Topic I. Program Characteristics & Enrollment",
              // "spreadsheet": "D1_Plan_Set"
            },
            dashboardTitle:
              "Report program characteristics & enrollment for each plan",
            drawerTitle: "Report program characteristics & enrollment for",
            missingEntityMessage: [
              {
                type: "span",
                content:
                  "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
              },
              {
                type: "internalLink",
                content: "Add Plans",
                props: {
                  to: "/wp/program-information/add-plans",
                },
              },
            ],
          },
          drawerForm: {
            id: "dpc",
            fields: [
              {
                id: "plan_enrollment",
                type: "number",
                validation: "number",
                props: {
                  label: "D1.I.1 Plan enrollment",
                  hint: "What is the total number of individuals enrolled in each plan as of the first day of the last month of the reporting year?",
                  mask: "comma-separated",
                },
              },
              {
                id: "plan_medicaidEnrollmentSharePercentage",
                type: "number",
                validation: "number",
                props: {
                  label: "D1.I.2 Plan share of Medicaid",
                  hint: "<p>What is the plan enrollment (within the specific program) as a percentage of the state's total Medicaid enrollment?</p><ul><li>Numerator: Plan enrollment (D1.I.1)</li><li>Denominator: Statewide Medicaid enrollment (B.I.1)</li></ul>",
                  mask: "percentage",
                },
              },
              {
                id: "plan_medicaidManagedCareEnrollmentSharePercentage",
                type: "number",
                validation: "number",
                props: {
                  label: "D1.I.3 Plan share of any Medicaid managed care",
                  hint: "<p>What is the plan enrollment (regardless of program) as a percentage of total Medicaid enrollment in any type of managed care?</p><ul><li>Numerator: Plan enrollment (D1.I.1)</li><li>Denominator: Statewide Medicaid managed care enrollment (B.I.2)</li></ul>",
                  mask: "percentage",
                },
              },
            ],
          },
        },
        {
          name: "II: Financial Performance",
          path: "/wp/plan-level-indicators/financial-performance",
          pageType: "drawer",
          entityType: "plans",
          verbiage: {
            intro: {
              section: "Section D: Plan-Level Indicators",
              subsection: "Topic II. Financial Performance",
              // "spreadsheet": "D1_Plan_Set"
            },
            dashboardTitle: "Report financial performance for each plan",
            drawerTitle: "Report financial performance for",
            missingEntityMessage: [
              {
                type: "span",
                content:
                  "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
              },
              {
                type: "internalLink",
                content: "Add Plans",
                props: {
                  to: "/wp/program-information/add-plans",
                },
              },
            ],
          },
          drawerForm: {
            id: "dfp",
            fields: [
              {
                id: "plan_medicalLossRatioPercentage",
                type: "number",
                validation: "number",
                props: {
                  label: "D1.II.1a Medical Loss Ratio (MLR)",
                  hint: "What is the MLR percentage? Per 42 CFR 438.66(e)(2)(i), the Managed Care Program Annual Report must provide information on the Financial performance of each MCO, PIHP, and PAHP, including MLR experience.</br>If MLR data are not available for this reporting period due to data lags, enter the MLR calculated for the most recently available reporting period and indicate the reporting period in item D1.II.3 below. See Glossary in Excel Workbook for the regulatory definition of MLR.",
                  mask: "percentage",
                },
              },
              {
                id: "plan_medicalLossRatioPercentageAggregationLevel",
                type: "radio",
                validation: "radio",
                props: {
                  label: "D1.II.1b Level of aggregation",
                  hint: "What is the aggregation level that best describes the MLR being reported in the previous indicator? Select one.</br>As permitted under 42 CFR 438.8(i), states are allowed to aggregate data for reporting purposes across programs and populations.",
                  choices: [
                    {
                      id: "BSfARaemtUmbuMnZC11pog",
                      label: "Program-specific statewide",
                    },
                    {
                      id: "Sk684CJrvE6vAefOKX6flA",
                      label: "Program-specific regional",
                    },
                    {
                      id: "LRDviCXq5ESAYi3UhGhMBw",
                      label: "Statewide all programs & populations",
                    },
                    {
                      id: "OQ0onGPAMUqDZgIxAjR3aQ",
                      label: "Regional all programs & populations",
                    },
                    {
                      id: "ou7IxaZKnEeGLuqBSehl9g",
                      label: "Other, specify",
                      children: [
                        {
                          id: "plan_medicalLossRatioPercentageAggregationLevel-otherText",
                          type: "textarea",
                          validation: {
                            type: "text",
                            nested: true,
                            parentFieldName:
                              "plan_medicalLossRatioPercentageAggregationLevel",
                          },
                        },
                      ],
                    },
                  ],
                },
              },
              {
                id: "plan_populationSpecificMedicalLossRatioDescription",
                type: "textarea",
                validation: "text",
                props: {
                  label: "D1.II.2 Population specific MLR description",
                  hint: 'Does the state require plans to submit separate MLR calculations for specific populations served within this program, for example, MLTSS or Group VIII expansion enrollees? If so, describe the populations here. Enter "N/A" if not applicable.</br>See glossary for the regulatory definition of MLR.',
                },
              },
              {
                id: "plan_medicalLossRatioReportingPeriod",
                type: "radio",
                validation: "radio",
                props: {
                  label: "D1.II.3 MLR reporting period discrepancies",
                  hint: "Does the data reported in item D1.II.1a cover a different time period than the MCPAR report?",
                  choices: [
                    {
                      id: "UgEFak34A0e1hJaHXtXbrw",
                      label: "Yes",
                      children: [
                        {
                          id: "plan_medicalLossRatioReportingPeriodStartDate",
                          type: "date",
                          validation: {
                            type: "date",
                            nested: true,
                            parentFieldName:
                              "plan_medicalLossRatioReportingPeriod",
                          },
                          props: {
                            hint: "Enter the start date.",
                            timetype: "startDate",
                          },
                        },
                        {
                          id: "plan_medicalLossRatioReportingPeriodEndDate",
                          type: "date",
                          validation: {
                            type: "endDate",
                            dependentFieldName:
                              "plan_medicalLossRatioReportingPeriodStartDate",
                            nested: true,
                            parentFieldName:
                              "plan_medicalLossRatioReportingPeriod",
                          },
                          props: {
                            hint: "Enter the end date.",
                            timetype: "endDate",
                          },
                        },
                      ],
                    },
                    {
                      id: "Jt8dUZQO60OpeGvhe6KaOA",
                      label: "No",
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          name: "III: Encounter Data Report",
          path: "/wp/plan-level-indicators/encounter-data-report",
          pageType: "drawer",
          entityType: "plans",
          verbiage: {
            intro: {
              section: "Section D: Plan-Level Indicators",
              subsection: "Topic III. Encounter Data",
              // "spreadsheet": "D1_Plan_Set"
            },
            dashboardTitle: "Report on encounter data for each plan",
            drawerTitle: "Report encounter data for",
            missingEntityMessage: [
              {
                type: "span",
                content:
                  "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
              },
              {
                type: "internalLink",
                content: "Add Plans",
                props: {
                  to: "/wp/program-information/add-plans",
                },
              },
            ],
          },
          drawerForm: {
            id: "dedr",
            fields: [
              {
                id: "program_encounterDataSubmissionTimelinessStandardDefinition",
                type: "textarea",
                validation: "text",
                props: {
                  label:
                    "D1.III.1 Definition of timely encounter data submissions",
                  hint: "Describe the state's standard for timely encounter data submissions used in this program.</br>If reporting frequencies and standards differ by type of encounter within this program, please explain.",
                },
              },
              {
                id: "plan_encounterDataSubmissionTimelinessCompliancePercentage",
                type: "number",
                validation: "number",
                props: {
                  label:
                    "D1.III.2 Share of encounter data submissions that met state’s timely submission requirements",
                  hint: "What percent of the plan’s encounter data file submissions (submitted during the reporting period) met state requirements for timely submission?</br>If the state has not yet received any encounter data file submissions for the entire contract period when it submits this report, the state should enter here the percentage of encounter data submissions that were compliant out of the file submissions it has received from the managed care plan for the reporting period.",
                  mask: "percentage",
                },
              },
              {
                id: "plan_encounterDataSubmissionHipaaCompliancePercentage",
                type: "number",
                validation: "number",
                props: {
                  label:
                    "D1.III.3 Share of encounter data submissions that were HIPAA compliant",
                  hint: "What percent of the plan’s encounter data submissions (submitted during the reporting period) met state requirements for HIPAA compliance?</br>If the state has not yet received encounter data submissions for the entire contract period when it submits this report, enter here percentage of encounter data submissions that were compliant out of the proportion received from the managed care plan for the reporting period.",
                  mask: "percentage",
                },
              },
            ],
          },
        },
        {
          name: "IV: Appeals, State Fair Hearings & Grievances",
          path: "/wp/plan-level-indicators/appeals-state-fair-hearings-and-grievances",
          children: [
            {
              name: "Appeals Overview",
              path: "/wp/plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-overview",
              pageType: "drawer",
              entityType: "plans",
              verbiage: {
                intro: {
                  section: "Section D: Plan-Level Indicators",
                  subsection:
                    "Topic IV. Appeals, State Fair Hearings & Grievances",
                  // "spreadsheet": "D1_Plan_Set",
                  info: [
                    {
                      type: "heading",
                      as: "h3",
                      content: "Appeals Overview",
                    },
                  ],
                },
                dashboardTitle: "Report on appeals for each plan",
                drawerTitle: "Report on appeals for",
                missingEntityMessage: [
                  {
                    type: "span",
                    content:
                      "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
                  },
                  {
                    type: "internalLink",
                    content: "Add Plans",
                    props: {
                      to: "/wp/program-information/add-plans",
                    },
                  },
                ],
              },
              drawerForm: {
                id: "dao",
                fields: [
                  {
                    id: "plan_resolvedAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label: "D1.IV.1 Appeals resolved (at the plan level)",
                      hint: 'Enter the total number of appeals resolved as of the first day of the last month of the reporting year.</p>An appeal is "resolved" at the plan level when the plan has issued a decision, regardless of whether the decision was wholly or partially favorable or adverse to the beneficiary, and regardless of whether the beneficiary (or the beneficiary\'s representative) chooses to file a request for a State Fair Hearing or External Medical Review.',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_activeAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label: "D1.IV.2 Active appeals",
                      hint: "Enter the total number of appeals still pending or in process (not yet resolved) as of the first day of the last month of the reporting year.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_ltssUserFiledAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label: "D1.IV.3 Appeals filed on behalf of LTSS users",
                      hint: "Enter the total number of appeals filed during the reporting year by or on behalf of LTSS users. Enter “N/A” if not applicable.</p>An LTSS user is an enrollee who received at least one LTSS service at any point during the reporting year (regardless of whether the enrollee was actively receiving LTSS at the time that the appeal was filed).",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledAppeal",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.4 Number of critical incidents filed during the reporting period by (or on behalf of) an LTSS user who previously filed an appeal",
                      hint: 'For managed care plans that cover LTSS, enter the number of critical incidents filed within the reporting period by (or on behalf of) LTSS users who previously filed appeals in the reporting year. If the managed care plan does not cover LTSS, enter “N/A”.</p>Also, if the state already submitted this data for the reporting year via the CMS readiness review appeal and grievance report (because the managed care program or plan were new or serving new populations during the reporting year), and the readiness review tool was submitted for at least 6 months of the reporting year, enter “N/A”.</p>The appeal and critical incident do not have to have been "related" to the same issue - they only need to have been filed by (or on behalf of) the same enrollee. Neither the critical incident nor the appeal need to have been filed in relation to delivery of LTSS — they may have been filed for any reason, related to any service received (or desired) by an LTSS user.</p>To calculate this number, states or managed care plans should first identify the LTSS users for whom critical incidents were filed during the reporting year, then determine whether those enrollees had filed an appeal during the reporting year, and whether the filing of the appeal preceded the filing of the critical incident.',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_timelyResolvedStandardAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.5a Standard appeals for which timely resolution was provided",
                      hint: "Enter the total number of standard appeals for which timely resolution was provided by plan during the reporting period.</p>See 42 CFR §438.408(b)(2) for requirements related to timely resolution of standard appeals.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_timelyResolvedExpeditedAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.5b Expedited appeals for which timely resolution was provided",
                      hint: "Enter the total number of expedited appeals for which timely resolution was provided by plan during the reporting period.</p>See 42 CFR §438.408(b)(3) for requirements related to timely resolution of standard appeals.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedPreServiceAuthorizationDenialAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.6a Resolved appeals related to denial of authorization or limited authorization of a service",
                      hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial of authorization for a service not yet rendered or limited authorization of a service.</p>(Appeals related to denial of payment for a service already rendered should be counted in indicator D1.IV.6c).",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.6b Resolved appeals related to reduction, suspension, or termination of a previously authorized service",
                      hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's reduction, suspension, or termination of a previously authorized service.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedPostServiceAuthorizationDenialAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.6c Resolved appeals related to payment denial",
                      hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial, in whole or in part, of payment for a service that was already rendered.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedServiceTimelinessAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.6d Resolved appeals related to service timeliness",
                      hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's failure to provide services in a timely manner (as defined by the state).",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedUntimelyResponseAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.6e Resolved appeals related to lack of timely plan response to an appeal or grievance",
                      hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's failure to act within the timeframes provided at 42 CFR §438.408(b)(1) and (2) regarding the standard resolution of grievances and appeals.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedRightToRequestOutOfNetworkCareDenialAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.6f Resolved appeals related to plan denial of an enrollee's right to request out-of-network care",
                      hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial of an enrollee's request to exercise their right, under 42 CFR §438.52(b)(2)(ii), to obtain services outside the network (only applicable to residents of rural areas with only one MCO).",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedRequestToDisputeFinancialLiabilityDenialAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.6g Resolved appeals related to denial of an enrollee's request to dispute financial liability",
                      hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial of an enrollee's request to dispute a financial liability.",
                      mask: "comma-separated",
                    },
                  },
                ],
              },
            },
            {
              name: "Appeals by Service",
              path: "/wp/plan-level-indicators/appeals-state-fair-hearings-grievances/appeals-by-service",
              pageType: "drawer",
              entityType: "plans",
              verbiage: {
                intro: {
                  section: "Section D: Plan-Level Indicators",
                  subsection:
                    "Topic IV. Appeals, State Fair Hearings & Grievances",
                  // "spreadsheet": "D1_Plan_Set",
                  info: [
                    {
                      type: "heading",
                      as: "h3",
                      content: "Appeals by Service",
                    },
                    {
                      type: "p",
                      content:
                        "Number of appeals resolved during the reporting period related to various services. Note: A single appeal may be related to multiple service types and may therefore be counted in multiple categories.",
                    },
                  ],
                },
                dashboardTitle: "Report on appeals by service for each plan",
                drawerTitle: "Report appeals by service for",
                missingEntityMessage: [
                  {
                    type: "span",
                    content:
                      "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
                  },
                  {
                    type: "internalLink",
                    content: "Add Plans",
                    props: {
                      to: "/wp/program-information/add-plans",
                    },
                  },
                ],
              },
              drawerForm: {
                id: "dabs",
                fields: [
                  {
                    id: "plan_resolvedGeneralInpatientServiceAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7a Resolved appeals related to general inpatient services",
                      hint: '<p>Enter the total number of appeals resolved by the plan during the reporting year that were related to general inpatient care, including diagnostic and laboratory services.</p><p>Do not include appeals related to inpatient behavioral health services – those should be included in indicator D1.IV.7c. If the managed care plan does not cover general inpatient services, enter "N/A".</p>',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedGeneralOutpatientServiceAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7b Resolved appeals related to general outpatient services",
                      hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to general outpatient care, including diagnostic and laboratory services. Please do not include appeals related to outpatient behavioral health services – those should be included in indicator D1.IV.7d. If the managed care plan does not cover general outpatient services, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedInpatientBehavioralHealthServiceAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7c Resolved appeals related to inpatient behavioral health services",
                      hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to inpatient mental health and/or substance use services. If the managed care plan does not cover inpatient behavioral health services, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedOutpatientBehavioralHealthServiceAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7d Resolved appeals related to outpatient behavioral health services",
                      hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to outpatient mental health and/or substance use services. If the managed care plan does not cover outpatient behavioral health services, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedCoveredOutpatientPrescriptionDrugAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7e Resolved appeals related to covered outpatient prescription drugs",
                      hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to outpatient prescription drugs covered by the managed care plan. If the managed care plan does not cover outpatient prescription drugs, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedSnfServiceAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7f Resolved appeals related to skilled nursing facility (SNF) services",
                      hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to SNF services. If the managed care plan does not cover skilled nursing services, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedLtssServiceAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7g Resolved appeals related to long-term services and supports (LTSS)",
                      hint: '<p>Enter the total number of appeals resolved by the plan during the reporting year that were related to institutional LTSS or LTSS provided through home and community-based (HCBS) services, including personal care and self-directed services. If the managed care plan does not cover LTSS services, enter "N/A".</p><p(Appeals related to denial of payment for a service already rendered should be counted in indicator D1.IV.6c).</p>',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedDentalServiceAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7h Resolved appeals related to dental services",
                      hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to dental services. If the managed care plan does not cover dental services, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedNemtAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7i Resolved appeals related to non-emergency medical transportation (NEMT)",
                      hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to NEMT. If the managed care plan does not cover NEMT, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedOtherServiceAppeals",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.7j Resolved appeals related to other service types",
                      hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to services that do not fit into one of the categories listed above. If the managed care plan does not cover services other than those in items D1.IV.7a-i, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                ],
              },
            },
            {
              name: "State Fair Hearings",
              path: "/wp/plan-level-indicators/appeals-state-fair-hearings-grievances/state-fair-hearings",
              pageType: "drawer",
              entityType: "plans",
              verbiage: {
                intro: {
                  section: "Section D: Plan-Level Indicators",
                  subsection:
                    "Topic IV. Appeals, State Fair Hearings & Grievances",
                  // "spreadsheet": "D1_Plan_Set",
                  info: [
                    {
                      type: "heading",
                      as: "h3",
                      content: "State Fair Hearings",
                    },
                  ],
                },
                dashboardTitle:
                  "Report state fair hearings and external medical reviews for each plan",
                drawerTitle:
                  "Report state fair hearings and external medical reviews for",
                missingEntityMessage: [
                  {
                    type: "span",
                    content:
                      "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
                  },
                  {
                    type: "internalLink",
                    content: "Add Plans",
                    props: {
                      to: "/wp/program-information/add-plans",
                    },
                  },
                ],
              },
              drawerForm: {
                id: "dsfh",
                fields: [
                  {
                    id: "plan_stateFairHearingRequestsFiled",
                    type: "number",
                    validation: "number",
                    props: {
                      label: "D1.IV.8a State Fair Hearing requests",
                      hint: "Enter the total number of requests for a State Fair Hearing filed during the reporting year by plan that issued the adverse benefit determination.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_stateFairHearingRequestsWithFavorableDecision",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.8b State Fair Hearings resulting in a favorable decision for the enrollee",
                      hint: "Enter the total number of State Fair Hearing decisions rendered during the reporting year that were partially or fully favorable to the enrollee.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_stateFairHearingRequestsWithAdverseDecision",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.8c State Fair Hearings resulting in an adverse decision for the enrollee",
                      hint: "Enter the total number of State Fair Hearing decisions rendered during the reporting year that were adverse for the enrollee.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_stateFairHearingRequestsRetracted",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.8d State Fair Hearings retracted prior to reaching a decision",
                      hint: "Enter the total number of State Fair Hearing decisions retracted (by the enrollee or the representative who filed a State Fair Hearing request on behalf of the enrollee) prior to reaching a decision.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_stateFairHearingRequestsWithExternalMedicalReviewWithFavorableDecision",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.9a External Medical Reviews resulting in a favorable decision for the enrollee",
                      hint: 'If your state does offer an external medical review process, enter the total number of external medical review decisions rendered during the reporting year that were partially or fully favorable to the enrollee. If your state does not offer an external medical review process, enter "N/A".</p><p>External medical review is defined and described at 42 CFR §438.402(c)(i)(B).',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_stateFairHearingRequestsWithExternalMedicalReviewWithAdverseDecision",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.9b External Medical Reviews resulting in an adverse decision for the enrollee",
                      hint: '<p>If your state does offer an external medical review process, enter the total number of external medical review decisions rendered during the reporting year that were adverse to the enrollee. If your state does not offer an external medical review process, enter "N/A".</p><p>External medical review is defined and described at 42 CFR §438.402(c)(i)(B).</p>',
                      mask: "comma-separated",
                    },
                  },
                ],
              },
            },
            {
              name: "Grievances Overview",
              path: "/wp/plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-overview",
              pageType: "drawer",
              entityType: "plans",
              verbiage: {
                intro: {
                  section: "Section D: Plan-Level Indicators",
                  subsection:
                    "Topic IV. Appeals, State Fair Hearings & Grievances",
                  // "spreadsheet": "D1_Plan_Set",
                  info: [
                    {
                      type: "heading",
                      as: "h3",
                      content: "Grievances Overview",
                    },
                  ],
                },
                dashboardTitle: "Report on grievances for each plan",
                drawerTitle: "Report on grievances for",
                missingEntityMessage: [
                  {
                    type: "span",
                    content:
                      "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
                  },
                  {
                    type: "internalLink",
                    content: "Add Plans",
                    props: {
                      to: "/wp/program-information/add-plans",
                    },
                  },
                ],
              },
              drawerForm: {
                id: "dgo",
                fields: [
                  {
                    id: "plan_resolvedGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label: "D1.IV.10 Grievances resolved",
                      hint: '<p>Enter the total number of grievances resolved by the plan during the reporting year.</p><p>A grievance is "resolved" when it has reached completion and been closed by the plan.</p>',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_activeGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label: "D1.IV.11 Active grievances",
                      hint: "Enter the total number of grievances still pending or in process (not yet resolved) as of the first day of the last month of the reporting year.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_ltssUserFieldGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.12 Grievances filed on behalf of LTSS users",
                      hint: "<p>Enter the total number of grievances filed during the reporting year by or on behalf of LTSS users.</p><p>An LTSS user is an enrollee who received at least one LTSS service at any point during the reporting year (regardless of whether the enrollee was actively receiving LTSS at the time that the grievance was filed). If this does not apply, enter N/A.</p>",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledGrievance",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.13 Number of critical incidents filed during the reporting period by (or on behalf of) an LTSS user who previously filed a grievance",
                      hint: '<p>For managed care plans that cover LTSS, enter the number of critical incidents filed within the reporting period by (or on behalf of) LTSS users who previously filed grievances in the reporting year. The grievance and critical incident do not have to have been "related" to the same issue  - they only need to have been filed by (or on behalf of) the same enrollee. Neither the critical incident nor the grievance need to have been filed in relation to delivery of LTSS - they may have been filed for any reason, related to any service received (or desired) by an LTSS user.</p><p>If the managed care plan does not cover LTSS, the state should enter "N/A" in this field. Additionally, if the state already submitted this data for the reporting year via the CMS readiness review appeal and grievance report (because the managed care program or plan were new or serving new populations during the reporting year), and the readiness review tool was submitted for at least 6 months of the reporting year, the state can enter "N/A" in this field.</p><p>To calculate this number, states or managed care plans should first identify the LTSS users for whom critical incidents were filed during the reporting year, then determine whether those enrollees had filed a grievance during the reporting year, and whether the filing of the grievance preceded the filing of the critical incident.</p>',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_timyleResolvedGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.14 Number of grievances for which timely resolution was provided",
                      hint: "<p>Enter the number of grievances for which timely resolution was provided by plan during the reporting period.</p><p>See 42 CFR §438.408(b)(1) for requirements related to the timely resolution of grievances.</p>",
                      mask: "comma-separated",
                    },
                  },
                ],
              },
            },
            {
              name: "Grievances by Service",
              path: "/wp/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-service",
              pageType: "drawer",
              entityType: "plans",
              verbiage: {
                intro: {
                  section: "Section D: Plan-Level Indicators",
                  subsection:
                    "Topic IV. Appeals, State Fair Hearings & Grievances",
                  // "spreadsheet": "D1_Plan_Set",
                  info: [
                    {
                      type: "heading",
                      as: "h3",
                      content: "Grievances by Service",
                    },
                    {
                      type: "p",
                      content:
                        "Report the number of grievances resolved by plan during the reporting period by service.",
                    },
                  ],
                },
                dashboardTitle: "Report on grievances by service for each plan",
                drawerTitle: "Report on grievances by service for",
                drawerInfo: [
                  {
                    type: "p",
                    content:
                      "A single grievance may be related to multiple service types and may therefore be counted in multiple categories.",
                  },
                ],
                missingEntityMessage: [
                  {
                    type: "span",
                    content:
                      "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
                  },
                  {
                    type: "internalLink",
                    content: "Add Plans",
                    props: {
                      to: "/wp/program-information/add-plans",
                    },
                  },
                ],
              },
              drawerForm: {
                id: "dgbs",
                fields: [
                  {
                    id: "plan_resolvedGeneralInpatientServiceGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15a Resolved grievances related to general inpatient services",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to general inpatient care, including diagnostic and laboratory services. Do not include grievances related to inpatient behavioral health services — those should be included in indicator D1.IV.15c. If the managed care plan does not cover this type of service, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedGeneralOutpatientServiceGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15b Resolved grievances related to general outpatient services",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to general outpatient care, including diagnostic and laboratory services. Do not include grievances related to outpatient behavioral health services — those should be included in indicator D1.IV.15d. If the managed care plan does not cover this type of service, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedInpatientBehavioralHealthServiceGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15c Resolved grievances related to inpatient behavioral health services",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to inpatient mental health and/or substance use services. If the managed care plan does not cover this type of service, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedOutpatientBehavioralHealthServiceGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15d Resolved grievances related to outpatient behavioral health services",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to outpatient mental health and/or substance use services. If the managed care plan does not cover this type of service, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedCoveredOutpatientPrescriptionDrugGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15e Resolved grievances related to coverage of outpatient prescription drugs",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to outpatient prescription drugs covered by the managed care plan. If the managed care plan does not cover this type of service, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedSnfServiceGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15f Resolved grievances related to skilled nursing facility (SNF) services",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to SNF services. If the managed care plan does not cover this type of service, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedLtssServiceGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15g Resolved grievances related to long-term services and supports (LTSS)",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to institutional LTSS or LTSS provided through home and community-based (HCBS) services, including personal care and self-directed services. If the managed care plan does not cover this type of service, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedDentalServiceGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15h Resolved grievances related to dental services",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to dental services. If the managed care plan does not cover this type of service, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedNemtGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15i Resolved grievances related to non-emergency medical transportation (NEMT)",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to NEMT. If the managed care plan does not cover this type of service, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedOtherServiceGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.15j Resolved grievances related to other service types",
                      hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to services that do not fit into one of the categories listed above. If the managed care plan does not cover services other than those in items D1.IV.15a-i, enter "N/A".',
                      mask: "comma-separated",
                    },
                  },
                ],
              },
            },
            {
              name: "Grievances by Reason",
              path: "/wp/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-reason",
              pageType: "drawer",
              entityType: "plans",
              verbiage: {
                intro: {
                  section: "Section D: Plan-Level Indicators",
                  subsection:
                    "Topic IV. Appeals, State Fair Hearings & Grievances",
                  // "spreadsheet": "D1_Plan_Set",
                  info: [
                    {
                      type: "heading",
                      as: "h3",
                      content: "Grievances by Reason",
                    },
                    {
                      type: "p",
                      content:
                        "Report the number of grievances resolved by plan during the reporting period by reason.",
                    },
                  ],
                },
                dashboardTitle: "Report on grievances by reason for each plan",
                drawerTitle: "Report on grievances by reason for",
                drawerInfo: [
                  {
                    type: "p",
                    content:
                      "A single grievance may be related to multiple reasons and may therefore be counted in multiple categories.",
                  },
                ],
                missingEntityMessage: [
                  {
                    type: "span",
                    content:
                      "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
                  },
                  {
                    type: "internalLink",
                    content: "Add Plans",
                    props: {
                      to: "/wp/program-information/add-plans",
                    },
                  },
                ],
              },
              drawerForm: {
                id: "dgbr",
                fields: [
                  {
                    id: "plan_resolvedCustomerServiceGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16a Resolved grievances related to plan or provider customer service",
                      hint: "<p>Enter the total number of grievances resolved by the plan during the reporting year that were related to plan or provider customer service.</p><p>Customer service grievances include complaints about interactions with the plan's Member Services department, provider offices or facilities, plan marketing agents, or any other plan or provider representatives.</p>",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedCareCaseManagementGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16b Resolved grievances related to plan or provider care management/case management",
                      hint: "<p>Enter the total number of grievances resolved by the plan during the reporting year that were related to plan or provider care management/case management.</p><p>Care management/case management grievances include complaints about the timeliness of an assessment or complaints about the plan or provider care or case management process.</p>",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedAccessToCareGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16c Resolved grievances related to access to care/services from plan or provider",
                      hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to access to care.</p><p>Access to care grievances include complaints about difficulties finding qualified in-network providers, excessive travel or wait times, or other access issues.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedQualityOfCareGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16d Resolved grievances related to quality of care",
                      hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to quality of care.</p><p>Quality of care grievances include complaints about the effectiveness, efficiency, equity, patient-centeredness, safety, and/or acceptability of care provided by a provider or the plan.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedPlanCommunicationGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16e Resolved grievances related to plan communications",
                      hint: "<p>Enter the total number of grievances resolved by the plan during the reporting year that were related to plan communications.</p><p>Plan communication grievances include grievances related to the clarity or accuracy of enrollee materials or other plan communications or to an enrollee's access to or the accessibility of enrollee materials or plan communications.</p>",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedPaymentBillingGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16f Resolved grievances related to payment or billing issues",
                      hint: "Enter the total number of grievances resolved during the reporting period that were filed for a reason related to payment or billing issues.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedSuspectedFraudGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16g Resolved grievances related to suspected fraud",
                      hint: "Enter the total number of grievances resolved during the reporting year that were related to suspected fraud.</p><p>Suspected fraud grievances include suspected cases of financial/payment fraud perpetuated by a provider, payer, or other entity. Note: grievances reported in this row should only include grievances submitted to the managed care plan, not grievances submitted to another entity, such as a state Ombudsman or Office of the Inspector General.",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedAbuseNeglectExploitationGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16h Resolved grievances related to abuse, neglect or exploitation",
                      hint: "<p>Enter the total number of grievances resolved during the reporting year that were related to abuse, neglect or exploitation.</p><p>Abuse/neglect/exploitation grievances include cases involving potential or actual patient harm.</p>",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedUntimelyResponseGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16i Resolved grievances related to lack of timely plan response to a service authorization or appeal (including requests to expedite or extend appeals)",
                      hint: "Enter the total number of grievances resolved during the reporting year that were filed due to a lack of timely plan response to a service authorization or appeal request (including requests to expedite or extend appeals).",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedDenialOfExpeditedAppealGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16j Resolved grievances related to plan denial of expedited appeal",
                      hint: "<p>Enter the total number of grievances resolved during the reporting year that were related to the plan's denial of an enrollee's request for an expedited appeal.</p><p>Per 42 CFR §438.408(b)(3), states must establish a timeframe for timely resolution of expedited appeals that is no longer than 72 hours after the MCO, PIHP or PAHP receives the appeal. If a plan denies a request for an expedited appeal, the enrollee or their representative have the right to file a grievance.</p>",
                      mask: "comma-separated",
                    },
                  },
                  {
                    id: "plan_resolvedOtherGrievances",
                    type: "number",
                    validation: "number",
                    props: {
                      label:
                        "D1.IV.16k Resolved grievances filed for other reasons",
                      hint: "Enter the total number of grievances resolved during the reporting period that were filed for a reason other than the reasons listed above.",
                      mask: "comma-separated",
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: "E: BSS Entity Indicators",
      path: "/wp/bss-entity-indicators",
      pageType: "drawer",
      entityType: "bssEntities",
      verbiage: {
        intro: {
          section: "Section E: BSS Entity Indicators",
          subsection: "Topic IX. Beneficiary Support System (BSS) Entities",
          // "spreadsheet": "E_BSS_Entities",
          info: [
            {
              type: "span",
              content:
                "Per 42 CFR 438.66(e)(2)(ix), the Managed Care Program Annual Report must provide information on and an assessment of the operation of the managed care program including activities and performance of the beneficiary support system. Information on how BSS entities support program-level functions is on the ",
            },
            {
              type: "internalLink",
              content: "Program-Level BSS",
              props: {
                to: "/wp/program-information/add-bss-entities",
              },
            },
            {
              type: "span",
              content: " page.",
            },
          ],
        },
        dashboardTitle: "Report on role and type for each BSS entity",
        drawerTitle: "Report on",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing BSS entities. You won’t be able to complete this section until you’ve added all the names of BSS entities that support enrollees in the program. ",
          },
          {
            type: "internalLink",
            content: "Add BSS entities",
            props: {
              to: "/wp/program-information/add-bss-entities",
            },
          },
        ],
      },
      drawerForm: {
        id: "ebssei",
        fields: [
          {
            id: "bssEntity_entityType",
            type: "checkbox",
            validation: "checkbox",
            props: {
              label: "E.IX.1 BSS entity type",
              hint: "What type of entity was contracted to perform each BSS activity? Check all that apply. Refer to 42 CFR 438.71(b).",
              choices: [
                {
                  id: "b8RT4wLcoU2yb0QgswyAfQ",
                  label: "State Government Entity",
                },
                {
                  id: "n8Nje9xGS0SXCymALzc42g",
                  label: "Local Government Entity",
                },
                {
                  id: "iDWw3TwoI0iHbO1V7XO1Nw",
                  label: "Ombudsman Program",
                },
                {
                  id: "0l4OWGZg7keJKdoRr3rNNA",
                  label: "State Health Insurance Assistance Program (SHIP)",
                },
                {
                  id: "9KfSY0XoS0Kn4AVEQWqYZw",
                  label: "Aging and Disability Resource Network (ADRN)",
                },
                {
                  id: "TqLWs965B0e0EmYnaShjOQ",
                  label: "Center for Independent Living (CIL)",
                },
                {
                  id: "XStmnayyVE6WDw2lhN682g",
                  label: "Legal Assistance Organization",
                },
                {
                  id: "Zc6FUo3Ee0i3kbbcYa3G8Q",
                  label: "Other Community-Based Organization",
                },
                {
                  id: "rXh51BskxUGvkWUaYtEVIA",
                  label: "Subcontractor",
                },
                {
                  id: "vXL3hGQHSUazZCZzQyX3hw",
                  label: "Enrollment Broker",
                },
                {
                  id: "xTEi7XgUvkGM4rU3FRaHDQ",
                  label: "Consultant",
                },
                {
                  id: "9vVNL9HLokKe3c6h4WAiAg",
                  label: "Academic/Research Organization",
                },
                {
                  id: "dgtCWe8drkivORajgmqYRw",
                  label: "Other, specify",
                  children: [
                    {
                      id: "bssEntity_entityType-otherText",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName: "bssEntity_entityType",
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "bssEntity_entityRole",
            type: "checkbox",
            validation: "checkbox",
            props: {
              label: "E.IX.2 BSS entity role",
              hint: "What are the roles performed by the BSS entity? Check all that apply. Refer to 42 CFR 438.71(b).",
              choices: [
                {
                  id: "aZ0uOjpYOE6zavUNXcZYrw",
                  label: "Enrollment Broker/Choice Counseling",
                },
                {
                  id: "eU2xXBr95USN7KG6VuVs3w",
                  label: "Beneficiary Outreach",
                },
                {
                  id: "GWTY3GEjGU2OhEOpqzm2AQ",
                  label: "LTSS Complaint Access Point",
                },
                {
                  id: "aF6Gt3rcsEibKmYvlKUH2A",
                  label: "LTSS Grievance/Appeals Education",
                },
                {
                  id: "gNJg0G5VXUmOk86B5pvyRg",
                  label: "LTSS Grievance/Appeals Assistance",
                },
                {
                  id: "cCu7xtpMDEGeJwbuaiO5XQ",
                  label: "Review/Oversight of LTSS Data",
                },
                {
                  id: "HcfrzcLqYU6faU0EBi9dfA",
                  label: "Other, specify",
                  children: [
                    {
                      id: "bssEntity_entityRole-otherText",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName: "bssEntity_entityRole",
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
      name: "Review & Submit",
      path: "/wp/review-and-submit",
      pageType: "reviewSubmit",
    },
  ],
  flatRoutes: [
    {
      name: "Point of Contact",
      path: "/wp/general-information",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section A: Program Information",
          subsection: "Point of Contact",
          spreadsheet: "A_Program_Info",
        },
      },
      form: {
        id: "apoc",
        fields: [
          {
            id: "stateName",
            type: "text",
            validation: "text",
            props: {
              label: "A.1 State name",
              hint: "Auto-populated from your account profile.",
              disabled: true,
              hydrate: "Minnesota",
            },
          },
          {
            id: "contactName",
            type: "text",
            validation: "text",
            props: {
              label: "A.2a Contact name",
              hint: "First and last name of the contact person. <br/> States that do not wish to list a specific individual on the report are encouraged to use a department or program-wide email address that will allow anyone with questions to quickly reach someone who can provide answers.",
            },
          },
          {
            id: "contactEmailAddress",
            type: "text",
            validation: "email",
            props: {
              label: "A.2b Contact email address",
              hint: "Enter email address. Department or program-wide email addresses ok.",
            },
          },
          {
            id: "submitterName",
            type: "text",
            validation: "textOptional",
            props: {
              label: "A.3a Submitter name",
              hint: "CMS receives this data upon submission of this MCPAR report.",
              disabled: true,
            },
          },
          {
            id: "submitterEmailAddress",
            type: "text",
            validation: "emailOptional",
            props: {
              label: "A.3b Submitter email address",
              hint: "CMS receives this data upon submission of this MCPAR report.",
              disabled: true,
            },
          },
          {
            id: "reportSubmissionDate",
            type: "date",
            validation: "textOptional",
            props: {
              label: "A.4 Date of report submission",
              hint: "CMS receives this date upon submission of this MCPAR report.",
              disabled: true,
            },
          },
        ],
      },
    },
    {
      name: "Reporting Period",
      path: "/wp/program-information/reporting-period",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section A: Program Information",
          subsection: "Reporting Period",
          spreadsheet: "A_Program_Info",
        },
      },
      form: {
        id: "arp",
        fields: [
          {
            id: "reportingPeriodStartDate",
            type: "date",
            validation: "date",
            props: {
              label: "A.5a Reporting period start date",
              hint: "Auto-populated from report dashboard.",
              disabled: true,
            },
          },
          {
            id: "reportingPeriodEndDate",
            type: "date",
            validation: "date",
            props: {
              label: "A.5b Reporting period end date",
              hint: "Auto-populated from report dashboard.",
              disabled: true,
            },
          },
          {
            id: "programName",
            type: "text",
            validation: "text",
            props: {
              label: "A.6 Program name",
              hint: "Auto-populated from report dashboard.",
              disabled: true,
            },
          },
        ],
      },
    },
    {
      name: "Add Plans",
      path: "/wp/program-information/add-plans",
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
        fields: [
          {
            id: "plans",
            type: "dynamic",
            validation: "dynamic",
            props: {
              label: "Plan name",
            },
          },
        ],
      },
    },
    {
      name: "Add BSS Entities",
      path: "/wp/program-information/add-bss-entities",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section A: Program Information",
          subsection: "Add BSS entities (A.8)",
          spreadsheet: "A_Program_Info",
          info: [
            {
              type: "span",
              content:
                "Enter the names of Beneficiary Support System (BSS) entities that support enrollees in the program for which the state is reporting data. Learn more about BSS entities at ",
            },
            {
              type: "externalLink",
              content: "42 CFR 438.71",
              props: {
                href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.71",
                target: "_blank",
                "aria-label": "42 CFR 438.71 (link opens in new tab).",
              },
            },
            {
              type: "html",
              content:
                "<span>. See Glossary in Excel Workbook for the definition of BSS entities.</span><p>Examples of BSS entity types include a: State or Local Government Entity, Ombudsman Program, State Health Insurance Program (SHIP), Aging and Disability Resource Network (ADRN), Center for Indepedent Living (CIL), Legal Assistance Organization, Community-based Organization, Subcontractor, Enrollment Broker, Consultant, or Academic/Research Organization.</p>",
            },
          ],
        },
      },
      form: {
        id: "absse",
        fields: [
          {
            id: "bssEntities",
            type: "dynamic",
            validation: "dynamic",
            props: {
              label: "BSS entity name",
            },
          },
        ],
      },
    },
    {
      name: "I: Program Characteristics",
      path: "/wp/state-level-indicators/program-characteristics",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section B: State-Level Indicators",
          subsection: "Topic I. Program Characteristics and Enrollment",
          spreadsheet: "B_State",
        },
      },
      form: {
        id: "bpc",
        fields: [
          {
            id: "state_statewideMedicaidEnrollment",
            type: "number",
            validation: "number",
            props: {
              label: "B.I.1 Statewide Medicaid enrollment",
              hint: "Enter the total number of individuals enrolled in Medicaid as of the first day of the last month of the reporting year.</br>Include all FFS and managed care enrollees, and count each person only once, regardless of the delivery system(s) in which they are enrolled.",
              mask: "comma-separated",
            },
          },
          {
            id: "state_statewideMedicaidManagedCareEnrollment",
            type: "number",
            validation: "number",
            props: {
              label: "B.I.2 Statewide Medicaid managed care enrollment",
              hint: "Enter the total, unduplicated number of individuals enrolled in any type of Medicaid managed care as of the first day of the last month of the reporting year.</br>Include enrollees in all programs, and count each person only once, even if they are enrolled in more than one managed care program or more than one managed care plan.",
              mask: "comma-separated",
            },
          },
        ],
      },
    },
    {
      name: "III: Encounter Data Report",
      path: "/wp/state-level-indicators/encounter-data-report",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section B: State-Level Indicators",
          subsection: "Topic III. Encounter Data Report",
          spreadsheet: "B_State",
        },
      },
      form: {
        id: "bedr",
        fields: [
          {
            id: "state_encounterDataValidationEntity",
            type: "checkbox",
            validation: "checkbox",
            props: {
              label: "B.III.1 Data validation entity",
              hint: "Select the state agency/division or contractor tasked with evaluating the validity of encounter data submitted by MCPs.</br>Encounter data validation includes verifying the accuracy, completeness, timeliness, and/or consistency of encounter data records submitted to the state by Medicaid managed care plans. Validation steps may include pre-acceptance edits and post-acceptance analyses. See Glossary in Excel Workbook for more information.",
              choices: [
                {
                  id: "2iuXO7C6nk6cuP9JXbdd2w",
                  label: "State Medicaid agency staff",
                },
                {
                  id: "vmlIjQAe9kyz4FbtxBZINA",
                  label: "Other state agency staff",
                },
                {
                  id: "Vg8erh64Tk2nKd5olVwM9w",
                  label: "State actuaries",
                },
                {
                  id: "azz5rhd8V0GK27fIXaYSmw",
                  label: "EQRO",
                },
                {
                  id: "OLmKdPAEI0WnbSV1sVccVw",
                  label: "Other third-party vendor",
                },
                {
                  id: "SyQu5rtdV06hEaUBCLZsYw",
                  label: "Proprietary system(s)",
                  children: [
                    {
                      id: "state_encounterDataValidationSystemHipaaCompliance",
                      type: "radio",
                      validation: {
                        type: "radio",
                        nested: true,
                        parentFieldName: "state_encounterDataValidationEntity",
                      },
                      props: {
                        label:
                          "B.III.2 HIPAA compliance of proprietary system(s) for encounter data validation",
                        hint: "Were the system(s) utilized fully HIPAA compliant? Select one.",
                        choices: [
                          {
                            id: "DeRYxSPAg0aZpPgqHfUcGA",
                            label: "Yes",
                          },
                          {
                            id: "CJVUudlBrEGWZAv7CVqKrQ",
                            label: "No",
                          },
                        ],
                      },
                    },
                  ],
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
                        parentFieldName: "state_encounterDataValidationEntity",
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
      name: "X: Program Integrity",
      path: "/wp/state-level-indicators/program-integrity",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section B: State-Level Indicators",
          subsection: "Topic X: Program Integrity",
          spreadsheet: "B_State",
        },
      },
      form: {
        id: "bpi",
        fields: [
          {
            id: "state_focusedProgramIntegrityActivitiesConducted",
            type: "textarea",
            validation: "text",
            props: {
              label: "B.X.1 Payment risks between the state and plans",
              hint: "Describe service-specific or other focused PI activities that the state conducted during the past year in this managed care program.</br>Examples include analyses focused on use of long-term services and supports (LTSS) or prescription drugs or activities that focused on specific payment issues to identify, address, and prevent fraud, waste or abuse. Consider data analytics, reviews of under/overutilization, and other activities.",
            },
          },
          {
            id: "state_overpaymentStandard",
            type: "radio",
            validation: "radio",
            props: {
              label: "B.X.2 Contract standard for overpayments",
              hint: "Does the state allow plans to retain overpayments, require the return of overpayments, or has established a hybrid system? Select one.",
              choices: [
                {
                  id: "UG7uunqq5UCtUq1is3iyiw",
                  label: "Allow plans to retain overpayments",
                },
                {
                  id: "3DGAqqnOBE2kwKVFMxUt3A",
                  label: "State requires the return of overpayments",
                },
                {
                  id: "jlIZKSPaf0GSVGmJbRUBzg",
                  label: "State has established a hybrid system",
                },
              ],
            },
          },
          {
            id: "state_overpaymentStandardContractLanguageLocation",
            type: "textarea",
            validation: "text",
            props: {
              label:
                "B.X.3 Location of contract provision stating overpayment standard",
              hint: "Describe where the overpayment standard in the previous indicator is located in plan contracts, as required by 42 CFR 438.608(d)(1)(i).",
            },
          },
          {
            id: "state_overpaymentStandardDescription",
            type: "textarea",
            validation: "text",
            props: {
              label: "B.X.4 Description of overpayment contract standard",
              hint: "Briefly describe the overpayment standard (for example, details on whether the state allows plans to retain overpayments, requires the plans to return overpayments, or administers a hybrid system) selected in indicator B.X.2.",
            },
          },
          {
            id: "state_overpaymentReportingMonitoringEfforts",
            type: "textarea",
            validation: "text",
            props: {
              label: "B.X.5 State overpayment reporting monitoring",
              hint: "Describe how the state monitors plan performance in reporting overpayments to the state, e.g. does the state track compliance with this requirement and/or timeliness of reporting?</br>The regulations at 438.604(a)(7), 608(a)(2) and 608(a)(3) require plan reporting to the state on various overpayment pieces (whether annually or promptly). This indicator is asking the state how it monitors that reporting.",
            },
          },
          {
            id: "state_beneficiaryCircumstanceChangeReconciliationEfforts",
            type: "textarea",
            validation: "text",
            props: {
              label: "B.X.6 Changes in beneficiary circumstances",
              hint: "Describe how the state ensures timely and accurate reconciliation of enrollment files between the state and plans to ensure appropriate payments for enrollees experiencing a change in status (e.g., incarcerated, deceased, switching plans).",
            },
          },
          {
            id: "state_providerTerminationReportingMonitoringEfforts",
            type: "radio",
            validation: "radio",
            props: {
              label:
                "B.X.7a Changes in provider circumstances: Monitoring plans",
              hint: "Does the state monitor whether plans report provider “for cause” terminations in a timely manner under 42 CFR 438.608(a)(4)? Select one.",
              choices: [
                {
                  id: "WFrdLUutmEujEZkS7rWVqQ",
                  label: "Yes",
                  children: [
                    {
                      id: "state_providerTerminationReportingMonitoringMetrics",
                      type: "radio",
                      validation: {
                        type: "radio",
                        nested: true,
                        parentFieldName:
                          "state_providerTerminationReportingMonitoringEfforts",
                      },
                      props: {
                        label:
                          "B.X.7b Changes in provider circumstances: Metrics",
                        hint: "Does the state use a metric or indicator to assess plan reporting performance? Select one.",
                        choices: [
                          {
                            id: "SPqyExyg8UioX6Od1IWvlg",
                            label: "Yes",
                            children: [
                              {
                                id: "state_providerTerminationReportingMonitoringMetricsDescription",
                                type: "textarea",
                                validation: {
                                  type: "text",
                                  nested: true,
                                  parentFieldName:
                                    "state_providerTerminationReportingMonitoringMetrics",
                                },
                                props: {
                                  label:
                                    "B.X.7c Changes in provider circumstances: Describe metric",
                                  hint: "Describe the metric or indicator that the state uses.",
                                },
                              },
                            ],
                          },
                          {
                            id: "XPflE27BV0G3RJFYxuw8QA",
                            label: "No",
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  id: "3tIhiqQxhEiSIhM7UW1DKQ",
                  label: "No",
                },
              ],
            },
          },
          {
            id: "state_excludedEntityIdentifiedInFederalDatabaseCheck",
            type: "radio",
            validation: "radio",
            props: {
              label:
                "B.X.8a Federal database checks: Excluded person or entities",
              hint: "During the state's federal database checks, did the state find any person or entity excluded? Select one.</br>Consistent with the requirements at 42 CFR 455.436 and 438.602, the State must confirm the identity and determine the exclusion status of the MCO, PIHP, PAHP, PCCM or PCCM entity, any subcontractor, as well as any person with an ownership or control interest, or who is an agent or managing employee of the MCO, PIHP, PAHP, PCCM or PCCM entity through routine checks of Federal databases.",
              choices: [
                {
                  id: "zrrv4vmXRkGhSkaS2V2d3A",
                  label: "Yes",
                  children: [
                    {
                      id: "state_excludedEntityIdentificationInstancesSummary",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName:
                          "state_excludedEntityIdentifiedInFederalDatabaseCheck",
                      },
                      props: {
                        label:
                          "B.X.8b Federal database checks: Summarize instances of exclusion",
                        hint: "Summarize the instances and whether the entity was notified as required in 438.602(d). Report actions taken, such as plan-level sanctions and corrective actions.",
                      },
                    },
                  ],
                },
                {
                  id: "ed1vyv6qB0a4aDLSeHOGPQ",
                  label: "No",
                },
              ],
            },
          },
          {
            id: "state_ownershipControlDisclosureWebsite",
            type: "radio",
            validation: "radio",
            props: {
              label:
                "B.X.9a Website posting of 5 percent or more ownership control",
              hint: "Does the state post on its website the names of individuals and entities with 5% or more ownership or control interest in MCOs, PIHPs, PAHPs, PCCMs and PCCM entities and subcontractors? Refer to §455.104 and required by 42 CFR 438.602(g)(3).",
              choices: [
                {
                  id: "fNiPtEub20Soo1W5FcdU3A",
                  label: "Yes",
                  children: [
                    {
                      id: "state_ownershipControlDisclosureWebsiteLink",
                      type: "text",
                      validation: {
                        type: "url",
                        nested: true,
                        parentFieldName:
                          "state_ownershipControlDisclosureWebsite",
                      },
                      props: {
                        label:
                          "B.X.9b Website posting of 5 percent or more ownership control: Link",
                        hint: "What is the link to the website? Refer to 42 CFR 602(g)(3).",
                      },
                    },
                  ],
                },
                {
                  id: "qhyidi0w4UiiBvCsoTgFOg",
                  label: "No",
                },
              ],
            },
          },
          {
            id: "state_submittedDataAuditResults",
            type: "textarea",
            validation: "text",
            props: {
              label: "B.X.10 Periodic audits",
              hint: "If the state conducted any audits during the contract year to determine the accuracy, truthfulness, and completeness of the encounter and financial data submitted by the plans, what is the link(s) to the audit results? Refer to 42 CFR 438.602(e).",
            },
          },
        ],
      },
    },
    {
      name: "I: Program Characteristics",
      path: "/wp/program-level-indicators/program-characteristics",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section C: Program-Level Indicators",
          subsection: "Topic I: Program Characteristics",
          spreadsheet: "C1_Program_Set",
        },
      },
      form: {
        id: "cpc",
        fields: [
          {
            id: "program_contractTitle",
            type: "text",
            validation: "text",
            props: {
              label: "C1.I.1 Program contract",
              hint: "Enter the title of the contract between the state and plans participating in the managed care program.",
            },
          },
          {
            id: "program_contractDate",
            type: "date",
            validation: "date",
            props: {
              hint: "Enter the date of the contract between the state and plans participating in the managed care program.",
            },
          },
          {
            id: "program_contractUrl",
            type: "text",
            validation: "url",
            props: {
              label: "C1.I.2 Contract URL",
              hint: "Provide the hyperlink to the model contract or landing page for executed contracts for the program reported in this program.",
            },
          },
          {
            id: "program_type",
            type: "radio",
            validation: "radio",
            props: {
              label: "C1.I.3 Program type",
              hint: "What is the type of MCPs that contract with the state to provide the services covered under the program? Select one.",
              choices: [
                {
                  id: "rP1NWfC2jEGDwLSnSZVWDg",
                  label: "Managed Care Organization (MCO)",
                },
                {
                  id: "rJHLjCGMa0CW2YIX0HOC6w",
                  label: "Prepaid Inpatient Health Plan (PIHP)",
                },
                {
                  id: "MaaUjgQ8sk6egWLalC6h7w",
                  label: "Prepaid Ambulatory Health Plan (PAHP)",
                },
                {
                  id: "atiwcA9QUE2eoTchV2ZLtw",
                  label: "Primary Care Case Management (PCCM) Entity",
                },
                {
                  id: "oaiOvxrN6EqfTqV1lAc9kQ",
                  label: "Other, specify",
                  children: [
                    {
                      id: "program_type-otherText",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName: "program_type",
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "program_coveredSpecialBenefits",
            type: "checkbox",
            validation: "checkbox",
            props: {
              label: "C1.I.4a Special program benefits",
              hint: "Are any of the four special benefit types covered by the managed care program: (1) behavioral health, (2) long-term services and supports, (3) dental, and (4) transportation, or (5) none of the above? Select one or more.</br>Only list the benefit type if it is a covered service as specified in a contract between the state and managed care plans participating in the program. Benefits available to eligible program enrollees via fee-for-service should not be listed here.",
              choices: [
                {
                  id: "TXvFpzmNqkCgpLcDckL5QQ",
                  label: "Behavioral health",
                },
                {
                  id: "87et9SaCr0uSt4vqFercBw",
                  label: "Long-term services and supports (LTSS)",
                },
                {
                  id: "I1FxuAG3U0WbV5KSNGXXug",
                  label: "Dental",
                },
                {
                  id: "4hRianKm4Ui74nk0WqTA0A",
                  label: "Transportation",
                },
                {
                  id: "WDiUOKx9LUSmspPjMMZ1Qg",
                  label: "None of the above",
                  children: [
                    {
                      id: "program_coveredSpecialBenefits-otherText",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName: "program_coveredSpecialBenefits",
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "program_specialBenefitsAvailabilityVariation",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.I.4b Variation in special benefits",
              hint: 'What are any variations in the availability of special benefits within the program (e.g. by service area or population)? Enter "N/A" if not applicable.',
            },
          },
          {
            id: "program_enrollment",
            type: "number",
            validation: "number",
            props: {
              label: "C1.I.5 Program enrollment",
              hint: "Enter the total number of individuals enrolled in the managed care program as of the first day of the last month of the reporting year.",
              mask: "comma-separated",
            },
          },
          {
            id: "program_enrollmentBenefitChanges",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.I.6 Changes to enrollment or benefits",
              hint: "Briefly explain any major changes to the population enrolled in or benefits provided by the managed care program during the reporting year.",
            },
          },
        ],
      },
    },
    {
      name: "III: Encounter Data Report",
      path: "/wp/program-level-indicators/encounter-data-report",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section C: Program-Level Indicators",
          subsection: "Topic III: Encounter Data Report",
          spreadsheet: "C1_Program_Set",
        },
      },
      form: {
        id: "cedr",
        fields: [
          {
            id: "program_encounterDataUses",
            type: "checkbox",
            validation: "checkbox",
            props: {
              label: "C1.III.1 Uses of encounter data",
              hint: "For what purposes does the state use encounter data collected from managed care plans (MCPs)? Select one or more.<br/>Federal regulations require that states, through their contracts with MCPs, collect and maintain sufficient enrollee encounter data to identify the provider who delivers any item(s) or service(s) to enrollees (42 CFR 438.242(c)(1)).",
              choices: [
                {
                  id: "eSrOkLMTyEmmixeqNXV1ZA",
                  label: "Rate setting",
                },
                {
                  id: "Ga9PZEVDBEOZULWeJdJznw",
                  label: "Quality/performance measurement",
                },
                {
                  id: "OF4juaUqz0GrUVVzvHjuEA",
                  label: "Monitoring and reporting",
                },
                {
                  id: "n8IjGT6b60qpp5KCHAJeyA",
                  label: "Contract oversight",
                },
                {
                  id: "6JVi42VKSEO39fJSma8BzA",
                  label: "Program integrity",
                },
                {
                  id: "RuBQRzexDUeq9St0E6sJdw",
                  label: "Policy making and decision support",
                },
                {
                  id: "Lxb161V64E27MlzL7boAFw",
                  label: "Other, specify",
                  children: [
                    {
                      id: "program_encounterDataUses-otherText",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName: "program_encounterDataUses",
                      },
                    },
                  ],
                },
                {
                  id: "WeIIplvIUEiCMdD2qKNz9w",
                  label: "Encounter data not used for any purpose",
                },
              ],
            },
          },
          {
            id: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria",
            type: "checkbox",
            validation: "checkbox",
            props: {
              label: "C1.III.2 Criteria/measures to evaluate MCP performance",
              hint: "What types of measures are used by the state to evaluate managed care plan performance in encounter data submission and correction? Select one or more.<br/>Federal regulations also require that states validate that submitted enrollee encounter data they receive is a complete and accurate representation of the services provided to enrollees under the contract between the state and the MCO, PIHP, or PAHP. 42 CFR 438.242(d).",
              choices: [
                {
                  id: "kP5W9deIb06jK7SXX8dnRA",
                  label: "Timeliness of initial data submissions",
                },
                {
                  id: "rsqVEBVarkij4Ks9vmgE3g",
                  label: "Timeliness of data corrections",
                },
                {
                  id: "Lo4seplZ3UGTktvCFuAtqw",
                  label: "Timeliness of data certifications",
                },
                {
                  id: "448Z26i8ikOhiFzqbdkeNg",
                  label: "Use of correct file formats",
                },
                {
                  id: "auYEK7okWkSc1hSwsYaAVQ",
                  label: "Provider ID field complete",
                },
                {
                  id: "mmtZcSBPUkGPCpQqc9wkyg",
                  label:
                    "Overall data accuracy (as determined through data validation)",
                },
                {
                  id: "J8l0u9V4VEeQmiZCB5Djrg",
                  label: "Other, specify",
                  children: [
                    {
                      id: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria-otherText",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName:
                          "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria",
                      },
                    },
                  ],
                },
                {
                  id: "FrCigNtArkCCqdkxU8fjlA",
                  label: "None of the above",
                },
              ],
            },
          },
          {
            id: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteriaContractLanguageLocation",
            type: "textarea",
            validation: "text",
            props: {
              label:
                "C1.III.3 Encounter data performance criteria contract language",
              hint: "Provide reference(s) to the contract section(s) that describe the criteria by which managed care plan performance on encounter data submission and correction will be measured. Use contract section references, not page numbers.",
            },
          },
          {
            id: "program_encounterDataSubmissionQualityFinancialPenaltiesContractLanguageLocation",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.III.4 Financial penalties contract language",
              hint: "Provide reference(s) to the contract section(s) that describes any financial penalties the state may impose on plans for the types of failures to meet encounter data submission and quality standards. Use contract section references, not page numbers.",
            },
          },
          {
            id: "program_encounterDataQualityIncentives",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.III.5 Incentives for encounter data quality",
              hint: 'Describe the types of incentives that may be awarded to managed care plans for encounter data quality. Reply with "N/A" if the plan does not use incentives to award encounter data quality.',
            },
          },
          {
            id: "program_encounterDataCollectionValidationBarriers",
            type: "textarea",
            validation: "text",
            props: {
              label:
                "C1.III.6 Barriers to collecting/validating encounter data",
              hint: "Describe any barriers to collecting and/or validating managed care plan encounter data that the state has experienced during the reporting period.",
            },
          },
        ],
      },
    },
    {
      name: "IV: Appeals, State Fair Hearings & Grievances",
      path: "/wp/program-level-indicators/appeals-state-fair-hearings-and-grievances",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section C: Program-Level Indicators",
          subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
          spreadsheet: "C1_Program_Set",
        },
      },
      form: {
        id: "casfhag",
        fields: [
          {
            id: "program_criticalIncidentDefinition",
            type: "textarea",
            validation: "text",
            props: {
              label:
                'C1.IV.1 State\'s definition of "critical incident," as used for reporting purposes in its MLTSS program',
              hint: 'If this report is being completed for a managed care program that covers LTSS, what is the definition that the state uses for "critical incidents" within the managed care program? Respond with "N/A" if the managed care program does not cover LTSS.',
            },
          },
          {
            id: "program_standardAppealTimelyResolutionDefinition",
            type: "textarea",
            validation: "text",
            props: {
              label:
                'C1.IV.2 State definition of "timely" resolution for standard appeals',
              hint: "Provide the state's definition of timely resolution for standard appeals in the managed care program.</br>Per 42 CFR §438.408(b)(2), states must establish a timeframe for timely resolution of standard appeals that is no longer than 30 calendar days from the day the MCO, PIHP or PAHP receives the appeal.",
            },
          },
          {
            id: "program_expeditedAppealTimelyResolutionDefinition",
            type: "textarea",
            validation: "text",
            props: {
              label:
                'C1.IV.3 State definition of "timely" resolution for expedited appeals',
              hint: "Provide the state's definition of timely resolution for expedited appeals in the managed care program.</br>Per 42 CFR §438.408(b)(3), states must establish a timeframe for timely resolution of expedited appeals that is no longer than 72 hours after the MCO, PIHP or PAHP receives the appeal.",
            },
          },
          {
            id: "program_grievanceTimelyResolutionDefinition",
            type: "textarea",
            validation: "text",
            props: {
              label:
                'C1.IV.4 State definition of "timely" resolution for grievances',
              hint: "Provide the state's definition of timely resolution for grievances in the managed care program.</br>Per 42 CFR §438.408(b)(1), states must establish a timeframe for timely resolution of grievances that is no longer than 90 calendar days from the day the MCO, PIHP or PAHP receives the grievance.",
            },
          },
        ],
      },
    },
    {
      name: "Network Adequacy",
      path: "/wp/program-level-indicators/availability-and-accessibility/network-adequacy",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section C: Program-Level Indicators",
          subsection:
            "Topic V. Availability, Accessibility and Network Adequacy",
          spreadsheet: "C1_Program_Set",
          info: [
            {
              type: "heading",
              as: "h3",
              content: "Network Adequacy",
            },
          ],
        },
      },
      form: {
        id: "cna",
        fields: [
          {
            id: "program_networkAdequacyChallenges",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.V.1 Gaps/challenges in network adequacy",
              hint: "What are the state’s biggest challenges? Describe any challenges MCPs have maintaining adequate networks and meeting standards.",
            },
          },
          {
            id: "program_networkAdequacyGapResponseEfforts",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.V.2 State response to gaps in network adequacy",
              hint: "How does the state work with MCPs to address gaps in network adequacy?",
            },
          },
        ],
      },
    },
    {
      name: "IX: BSS",
      path: "/wp/program-level-indicators/bss",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section C: Program-Level Indicators",
          subsection: "Topic IX: Beneficiary Support System (BSS)",
          spreadsheet: "C1_Program_Set",
        },
      },
      form: {
        id: "cbss",
        fields: [
          {
            id: "state_bssWebsite",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.IX.1 BSS website",
              hint: "List the website(s) and/or email address that beneficiaries use to seek assistance from the BSS through electronic means. Separate entries with commas.",
            },
          },
          {
            id: "state_bssEntityServiceAccessibility",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.IX.2 BSS auxiliary aids and services",
              hint: "How do BSS entities offer services in a manner that is accessible to all beneficiaries who need their services, including beneficiaries with disabilities, as required by 42 CFR 438.71(b)(2))?</br>CFR 438.71 requires that the beneficiary support system be accessible in multiple ways including phone, Internet, in-person, and via auxiliary aids and services when requested.",
            },
          },
          {
            id: "state_bssEntityLtssProgramDataIssueAssistance",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.IX.3 BSS LTSS program data",
              hint: "How do BSS entities assist the state with identifying, remediating, and resolving systemic issues based on a review of LTSS program data such as grievances and appeals or critical incident data? Refer to 42 CFR 438.71(d)(4).",
            },
          },
          {
            id: "state_bssEntityPerformanceEvaluationMethods",
            type: "textarea",
            validation: "text",
            props: {
              label: "C1.IX.4 State evaluation of BSS entity performance",
              hint: "What are steps taken by the state to evaluate the quality, effectiveness, and efficiency of the BSS entities' performance?",
            },
          },
        ],
      },
    },
    {
      name: "X: Program Integrity",
      path: "/wp/program-level-indicators/program-integrity",
      pageType: "standard",
      verbiage: {
        intro: {
          section: "Section C: Program-Level Indicators",
          subsection: "Topic X: Program Integrity",
          spreadsheet: "C1_Program_Set",
        },
      },
      form: {
        id: "cpi",
        fields: [
          {
            id: "program_prohibitedAffiliationDisclosure",
            type: "radio",
            validation: "radio",
            props: {
              label: "C1.X.3 Prohibited affiliation disclosure",
              hint: "Did any plans disclose prohibited affiliations? If the state took action, enter those actions under D: Plan-level Indicators, Section VIII - Sanctions (Corresponds with Tab D3 in the Excel Workbook). Refer to 42 CFR 438.610(d).",
              choices: [
                {
                  id: "7emiYPcs60GzXxKS5Pc9bg",
                  label: "Yes",
                },
                {
                  id: "SCGdBlpSQU6OVWAf3mDlMQ",
                  label: "No",
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: "I: Program Characteristics",
      path: "/wp/plan-level-indicators/program-characteristics",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic I. Program Characteristics & Enrollment",
          spreadsheet: "D1_Plan_Set",
        },
        dashboardTitle:
          "Report program characteristics & enrollment for each plan",
        drawerTitle: "Report program characteristics & enrollment for",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dpc",
        fields: [
          {
            id: "plan_enrollment",
            type: "number",
            validation: "number",
            props: {
              label: "D1.I.1 Plan enrollment",
              hint: "What is the total number of individuals enrolled in each plan as of the first day of the last month of the reporting year?",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_medicaidEnrollmentSharePercentage",
            type: "number",
            validation: "number",
            props: {
              label: "D1.I.2 Plan share of Medicaid",
              hint: "<p>What is the plan enrollment (within the specific program) as a percentage of the state's total Medicaid enrollment?</p><ul><li>Numerator: Plan enrollment (D1.I.1)</li><li>Denominator: Statewide Medicaid enrollment (B.I.1)</li></ul>",
              mask: "percentage",
            },
          },
          {
            id: "plan_medicaidManagedCareEnrollmentSharePercentage",
            type: "number",
            validation: "number",
            props: {
              label: "D1.I.3 Plan share of any Medicaid managed care",
              hint: "<p>What is the plan enrollment (regardless of program) as a percentage of total Medicaid enrollment in any type of managed care?</p><ul><li>Numerator: Plan enrollment (D1.I.1)</li><li>Denominator: Statewide Medicaid managed care enrollment (B.I.2)</li></ul>",
              mask: "percentage",
            },
          },
        ],
      },
    },
    {
      name: "II: Financial Performance",
      path: "/wp/plan-level-indicators/financial-performance",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic II. Financial Performance",
          spreadsheet: "D1_Plan_Set",
        },
        dashboardTitle: "Report financial performance for each plan",
        drawerTitle: "Report financial performance for",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dfp",
        fields: [
          {
            id: "plan_medicalLossRatioPercentage",
            type: "number",
            validation: "number",
            props: {
              label: "D1.II.1a Medical Loss Ratio (MLR)",
              hint: "What is the MLR percentage? Per 42 CFR 438.66(e)(2)(i), the Managed Care Program Annual Report must provide information on the Financial performance of each MCO, PIHP, and PAHP, including MLR experience.</br>If MLR data are not available for this reporting period due to data lags, enter the MLR calculated for the most recently available reporting period and indicate the reporting period in item D1.II.3 below. See Glossary in Excel Workbook for the regulatory definition of MLR.",
              mask: "percentage",
            },
          },
          {
            id: "plan_medicalLossRatioPercentageAggregationLevel",
            type: "radio",
            validation: "radio",
            props: {
              label: "D1.II.1b Level of aggregation",
              hint: "What is the aggregation level that best describes the MLR being reported in the previous indicator? Select one.</br>As permitted under 42 CFR 438.8(i), states are allowed to aggregate data for reporting purposes across programs and populations.",
              choices: [
                {
                  id: "BSfARaemtUmbuMnZC11pog",
                  label: "Program-specific statewide",
                },
                {
                  id: "Sk684CJrvE6vAefOKX6flA",
                  label: "Program-specific regional",
                },
                {
                  id: "LRDviCXq5ESAYi3UhGhMBw",
                  label: "Statewide all programs & populations",
                },
                {
                  id: "OQ0onGPAMUqDZgIxAjR3aQ",
                  label: "Regional all programs & populations",
                },
                {
                  id: "ou7IxaZKnEeGLuqBSehl9g",
                  label: "Other, specify",
                  children: [
                    {
                      id: "plan_medicalLossRatioPercentageAggregationLevel-otherText",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName:
                          "plan_medicalLossRatioPercentageAggregationLevel",
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "plan_populationSpecificMedicalLossRatioDescription",
            type: "textarea",
            validation: "text",
            props: {
              label: "D1.II.2 Population specific MLR description",
              hint: 'Does the state require plans to submit separate MLR calculations for specific populations served within this program, for example, MLTSS or Group VIII expansion enrollees? If so, describe the populations here. Enter "N/A" if not applicable.</br>See glossary for the regulatory definition of MLR.',
            },
          },
          {
            id: "plan_medicalLossRatioReportingPeriod",
            type: "radio",
            validation: "radio",
            props: {
              label: "D1.II.3 MLR reporting period discrepancies",
              hint: "Does the data reported in item D1.II.1a cover a different time period than the MCPAR report?",
              choices: [
                {
                  id: "UgEFak34A0e1hJaHXtXbrw",
                  label: "Yes",
                  children: [
                    {
                      id: "plan_medicalLossRatioReportingPeriodStartDate",
                      type: "date",
                      validation: {
                        type: "date",
                        nested: true,
                        parentFieldName: "plan_medicalLossRatioReportingPeriod",
                      },
                      props: {
                        hint: "Enter the start date.",
                        timetype: "startDate",
                      },
                    },
                    {
                      id: "plan_medicalLossRatioReportingPeriodEndDate",
                      type: "date",
                      validation: {
                        type: "endDate",
                        dependentFieldName:
                          "plan_medicalLossRatioReportingPeriodStartDate",
                        nested: true,
                        parentFieldName: "plan_medicalLossRatioReportingPeriod",
                      },
                      props: {
                        hint: "Enter the end date.",
                        timetype: "endDate",
                      },
                    },
                  ],
                },
                {
                  id: "Jt8dUZQO60OpeGvhe6KaOA",
                  label: "No",
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: "III: Encounter Data Report",
      path: "/wp/plan-level-indicators/encounter-data-report",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic III. Encounter Data",
          spreadsheet: "D1_Plan_Set",
        },
        dashboardTitle: "Report on encounter data for each plan",
        drawerTitle: "Report encounter data for",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dedr",
        fields: [
          {
            id: "program_encounterDataSubmissionTimelinessStandardDefinition",
            type: "textarea",
            validation: "text",
            props: {
              label: "D1.III.1 Definition of timely encounter data submissions",
              hint: "Describe the state's standard for timely encounter data submissions used in this program.</br>If reporting frequencies and standards differ by type of encounter within this program, please explain.",
            },
          },
          {
            id: "plan_encounterDataSubmissionTimelinessCompliancePercentage",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.III.2 Share of encounter data submissions that met state’s timely submission requirements",
              hint: "What percent of the plan’s encounter data file submissions (submitted during the reporting period) met state requirements for timely submission?</br>If the state has not yet received any encounter data file submissions for the entire contract period when it submits this report, the state should enter here the percentage of encounter data submissions that were compliant out of the file submissions it has received from the managed care plan for the reporting period.",
              mask: "percentage",
            },
          },
          {
            id: "plan_encounterDataSubmissionHipaaCompliancePercentage",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.III.3 Share of encounter data submissions that were HIPAA compliant",
              hint: "What percent of the plan’s encounter data submissions (submitted during the reporting period) met state requirements for HIPAA compliance?</br>If the state has not yet received encounter data submissions for the entire contract period when it submits this report, enter here percentage of encounter data submissions that were compliant out of the proportion received from the managed care plan for the reporting period.",
              mask: "percentage",
            },
          },
        ],
      },
    },
    {
      name: "Appeals Overview",
      path: "/wp/plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-overview",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
          spreadsheet: "D1_Plan_Set",
          info: [
            {
              type: "heading",
              as: "h3",
              content: "Appeals Overview",
            },
          ],
        },
        dashboardTitle: "Report on appeals for each plan",
        drawerTitle: "Report on appeals for",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dao",
        fields: [
          {
            id: "plan_resolvedAppeals",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.1 Appeals resolved (at the plan level)",
              hint: 'Enter the total number of appeals resolved as of the first day of the last month of the reporting year.</p>An appeal is "resolved" at the plan level when the plan has issued a decision, regardless of whether the decision was wholly or partially favorable or adverse to the beneficiary, and regardless of whether the beneficiary (or the beneficiary\'s representative) chooses to file a request for a State Fair Hearing or External Medical Review.',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_activeAppeals",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.2 Active appeals",
              hint: "Enter the total number of appeals still pending or in process (not yet resolved) as of the first day of the last month of the reporting year.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_ltssUserFiledAppeals",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.3 Appeals filed on behalf of LTSS users",
              hint: "Enter the total number of appeals filed during the reporting year by or on behalf of LTSS users. Enter “N/A” if not applicable.</p>An LTSS user is an enrollee who received at least one LTSS service at any point during the reporting year (regardless of whether the enrollee was actively receiving LTSS at the time that the appeal was filed).",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledAppeal",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.4 Number of critical incidents filed during the reporting period by (or on behalf of) an LTSS user who previously filed an appeal",
              hint: 'For managed care plans that cover LTSS, enter the number of critical incidents filed within the reporting period by (or on behalf of) LTSS users who previously filed appeals in the reporting year. If the managed care plan does not cover LTSS, enter “N/A”.</p>Also, if the state already submitted this data for the reporting year via the CMS readiness review appeal and grievance report (because the managed care program or plan were new or serving new populations during the reporting year), and the readiness review tool was submitted for at least 6 months of the reporting year, enter “N/A”.</p>The appeal and critical incident do not have to have been "related" to the same issue - they only need to have been filed by (or on behalf of) the same enrollee. Neither the critical incident nor the appeal need to have been filed in relation to delivery of LTSS — they may have been filed for any reason, related to any service received (or desired) by an LTSS user.</p>To calculate this number, states or managed care plans should first identify the LTSS users for whom critical incidents were filed during the reporting year, then determine whether those enrollees had filed an appeal during the reporting year, and whether the filing of the appeal preceded the filing of the critical incident.',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_timelyResolvedStandardAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.5a Standard appeals for which timely resolution was provided",
              hint: "Enter the total number of standard appeals for which timely resolution was provided by plan during the reporting period.</p>See 42 CFR §438.408(b)(2) for requirements related to timely resolution of standard appeals.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_timelyResolvedExpeditedAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.5b Expedited appeals for which timely resolution was provided",
              hint: "Enter the total number of expedited appeals for which timely resolution was provided by plan during the reporting period.</p>See 42 CFR §438.408(b)(3) for requirements related to timely resolution of standard appeals.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedPreServiceAuthorizationDenialAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.6a Resolved appeals related to denial of authorization or limited authorization of a service",
              hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial of authorization for a service not yet rendered or limited authorization of a service.</p>(Appeals related to denial of payment for a service already rendered should be counted in indicator D1.IV.6c).",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.6b Resolved appeals related to reduction, suspension, or termination of a previously authorized service",
              hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's reduction, suspension, or termination of a previously authorized service.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedPostServiceAuthorizationDenialAppeals",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.6c Resolved appeals related to payment denial",
              hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial, in whole or in part, of payment for a service that was already rendered.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedServiceTimelinessAppeals",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.6d Resolved appeals related to service timeliness",
              hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's failure to provide services in a timely manner (as defined by the state).",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedUntimelyResponseAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.6e Resolved appeals related to lack of timely plan response to an appeal or grievance",
              hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's failure to act within the timeframes provided at 42 CFR §438.408(b)(1) and (2) regarding the standard resolution of grievances and appeals.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedRightToRequestOutOfNetworkCareDenialAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.6f Resolved appeals related to plan denial of an enrollee's right to request out-of-network care",
              hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial of an enrollee's request to exercise their right, under 42 CFR §438.52(b)(2)(ii), to obtain services outside the network (only applicable to residents of rural areas with only one MCO).",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedRequestToDisputeFinancialLiabilityDenialAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.6g Resolved appeals related to denial of an enrollee's request to dispute financial liability",
              hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial of an enrollee's request to dispute a financial liability.",
              mask: "comma-separated",
            },
          },
        ],
      },
    },
    {
      name: "Appeals by Service",
      path: "/wp/plan-level-indicators/appeals-state-fair-hearings-grievances/appeals-by-service",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
          spreadsheet: "D1_Plan_Set",
          info: [
            {
              type: "heading",
              as: "h3",
              content: "Appeals by Service",
            },
            {
              type: "p",
              content:
                "Number of appeals resolved during the reporting period related to various services. Note: A single appeal may be related to multiple service types and may therefore be counted in multiple categories.",
            },
          ],
        },
        dashboardTitle: "Report on appeals by service for each plan",
        drawerTitle: "Report appeals by service for",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dabs",
        fields: [
          {
            id: "plan_resolvedGeneralInpatientServiceAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.7a Resolved appeals related to general inpatient services",
              hint: '<p>Enter the total number of appeals resolved by the plan during the reporting year that were related to general inpatient care, including diagnostic and laboratory services.</p><p>Do not include appeals related to inpatient behavioral health services – those should be included in indicator D1.IV.7c. If the managed care plan does not cover general inpatient services, enter "N/A".</p>',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedGeneralOutpatientServiceAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.7b Resolved appeals related to general outpatient services",
              hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to general outpatient care, including diagnostic and laboratory services. Please do not include appeals related to outpatient behavioral health services – those should be included in indicator D1.IV.7d. If the managed care plan does not cover general outpatient services, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedInpatientBehavioralHealthServiceAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.7c Resolved appeals related to inpatient behavioral health services",
              hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to inpatient mental health and/or substance use services. If the managed care plan does not cover inpatient behavioral health services, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedOutpatientBehavioralHealthServiceAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.7d Resolved appeals related to outpatient behavioral health services",
              hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to outpatient mental health and/or substance use services. If the managed care plan does not cover outpatient behavioral health services, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedCoveredOutpatientPrescriptionDrugAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.7e Resolved appeals related to covered outpatient prescription drugs",
              hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to outpatient prescription drugs covered by the managed care plan. If the managed care plan does not cover outpatient prescription drugs, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedSnfServiceAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.7f Resolved appeals related to skilled nursing facility (SNF) services",
              hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to SNF services. If the managed care plan does not cover skilled nursing services, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedLtssServiceAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.7g Resolved appeals related to long-term services and supports (LTSS)",
              hint: '<p>Enter the total number of appeals resolved by the plan during the reporting year that were related to institutional LTSS or LTSS provided through home and community-based (HCBS) services, including personal care and self-directed services. If the managed care plan does not cover LTSS services, enter "N/A".</p><p(Appeals related to denial of payment for a service already rendered should be counted in indicator D1.IV.6c).</p>',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedDentalServiceAppeals",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.7h Resolved appeals related to dental services",
              hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to dental services. If the managed care plan does not cover dental services, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedNemtAppeals",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.7i Resolved appeals related to non-emergency medical transportation (NEMT)",
              hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to NEMT. If the managed care plan does not cover NEMT, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedOtherServiceAppeals",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.7j Resolved appeals related to other service types",
              hint: 'Enter the total number of appeals resolved by the plan during the reporting year that were related to services that do not fit into one of the categories listed above. If the managed care plan does not cover services other than those in items D1.IV.7a-i, enter "N/A".',
              mask: "comma-separated",
            },
          },
        ],
      },
    },
    {
      name: "State Fair Hearings",
      path: "/wp/plan-level-indicators/appeals-state-fair-hearings-grievances/state-fair-hearings",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
          spreadsheet: "D1_Plan_Set",
          info: [
            {
              type: "heading",
              as: "h3",
              content: "State Fair Hearings",
            },
          ],
        },
        dashboardTitle:
          "Report state fair hearings and external medical reviews for each plan",
        drawerTitle:
          "Report state fair hearings and external medical reviews for",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dsfh",
        fields: [
          {
            id: "plan_stateFairHearingRequestsFiled",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.8a State Fair Hearing requests",
              hint: "Enter the total number of requests for a State Fair Hearing filed during the reporting year by plan that issued the adverse benefit determination.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_stateFairHearingRequestsWithFavorableDecision",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.8b State Fair Hearings resulting in a favorable decision for the enrollee",
              hint: "Enter the total number of State Fair Hearing decisions rendered during the reporting year that were partially or fully favorable to the enrollee.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_stateFairHearingRequestsWithAdverseDecision",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.8c State Fair Hearings resulting in an adverse decision for the enrollee",
              hint: "Enter the total number of State Fair Hearing decisions rendered during the reporting year that were adverse for the enrollee.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_stateFairHearingRequestsRetracted",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.8d State Fair Hearings retracted prior to reaching a decision",
              hint: "Enter the total number of State Fair Hearing decisions retracted (by the enrollee or the representative who filed a State Fair Hearing request on behalf of the enrollee) prior to reaching a decision.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_stateFairHearingRequestsWithExternalMedicalReviewWithFavorableDecision",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.9a External Medical Reviews resulting in a favorable decision for the enrollee",
              hint: 'If your state does offer an external medical review process, enter the total number of external medical review decisions rendered during the reporting year that were partially or fully favorable to the enrollee. If your state does not offer an external medical review process, enter "N/A".</p><p>External medical review is defined and described at 42 CFR §438.402(c)(i)(B).',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_stateFairHearingRequestsWithExternalMedicalReviewWithAdverseDecision",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.9b External Medical Reviews resulting in an adverse decision for the enrollee",
              hint: '<p>If your state does offer an external medical review process, enter the total number of external medical review decisions rendered during the reporting year that were adverse to the enrollee. If your state does not offer an external medical review process, enter "N/A".</p><p>External medical review is defined and described at 42 CFR §438.402(c)(i)(B).</p>',
              mask: "comma-separated",
            },
          },
        ],
      },
    },
    {
      name: "Grievances Overview",
      path: "/wp/plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-overview",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
          spreadsheet: "D1_Plan_Set",
          info: [
            {
              type: "heading",
              as: "h3",
              content: "Grievances Overview",
            },
          ],
        },
        dashboardTitle: "Report on grievances for each plan",
        drawerTitle: "Report on grievances for",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dgo",
        fields: [
          {
            id: "plan_resolvedGrievances",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.10 Grievances resolved",
              hint: '<p>Enter the total number of grievances resolved by the plan during the reporting year.</p><p>A grievance is "resolved" when it has reached completion and been closed by the plan.</p>',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_activeGrievances",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.11 Active grievances",
              hint: "Enter the total number of grievances still pending or in process (not yet resolved) as of the first day of the last month of the reporting year.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_ltssUserFieldGrievances",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.12 Grievances filed on behalf of LTSS users",
              hint: "<p>Enter the total number of grievances filed during the reporting year by or on behalf of LTSS users.</p><p>An LTSS user is an enrollee who received at least one LTSS service at any point during the reporting year (regardless of whether the enrollee was actively receiving LTSS at the time that the grievance was filed). If this does not apply, enter N/A.</p>",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledGrievance",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.13 Number of critical incidents filed during the reporting period by (or on behalf of) an LTSS user who previously filed a grievance",
              hint: '<p>For managed care plans that cover LTSS, enter the number of critical incidents filed within the reporting period by (or on behalf of) LTSS users who previously filed grievances in the reporting year. The grievance and critical incident do not have to have been "related" to the same issue  - they only need to have been filed by (or on behalf of) the same enrollee. Neither the critical incident nor the grievance need to have been filed in relation to delivery of LTSS - they may have been filed for any reason, related to any service received (or desired) by an LTSS user.</p><p>If the managed care plan does not cover LTSS, the state should enter "N/A" in this field. Additionally, if the state already submitted this data for the reporting year via the CMS readiness review appeal and grievance report (because the managed care program or plan were new or serving new populations during the reporting year), and the readiness review tool was submitted for at least 6 months of the reporting year, the state can enter "N/A" in this field.</p><p>To calculate this number, states or managed care plans should first identify the LTSS users for whom critical incidents were filed during the reporting year, then determine whether those enrollees had filed a grievance during the reporting year, and whether the filing of the grievance preceded the filing of the critical incident.</p>',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_timyleResolvedGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.14 Number of grievances for which timely resolution was provided",
              hint: "<p>Enter the number of grievances for which timely resolution was provided by plan during the reporting period.</p><p>See 42 CFR §438.408(b)(1) for requirements related to the timely resolution of grievances.</p>",
              mask: "comma-separated",
            },
          },
        ],
      },
    },
    {
      name: "Grievances by Service",
      path: "/wp/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-service",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
          spreadsheet: "D1_Plan_Set",
          info: [
            {
              type: "heading",
              as: "h3",
              content: "Grievances by Service",
            },
            {
              type: "p",
              content:
                "Report the number of grievances resolved by plan during the reporting period by service.",
            },
          ],
        },
        dashboardTitle: "Report on grievances by service for each plan",
        drawerTitle: "Report on grievances by service for",
        drawerInfo: [
          {
            type: "p",
            content:
              "A single grievance may be related to multiple service types and may therefore be counted in multiple categories.",
          },
        ],
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dgbs",
        fields: [
          {
            id: "plan_resolvedGeneralInpatientServiceGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.15a Resolved grievances related to general inpatient services",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to general inpatient care, including diagnostic and laboratory services. Do not include grievances related to inpatient behavioral health services — those should be included in indicator D1.IV.15c. If the managed care plan does not cover this type of service, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedGeneralOutpatientServiceGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.15b Resolved grievances related to general outpatient services",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to general outpatient care, including diagnostic and laboratory services. Do not include grievances related to outpatient behavioral health services — those should be included in indicator D1.IV.15d. If the managed care plan does not cover this type of service, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedInpatientBehavioralHealthServiceGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.15c Resolved grievances related to inpatient behavioral health services",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to inpatient mental health and/or substance use services. If the managed care plan does not cover this type of service, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedOutpatientBehavioralHealthServiceGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.15d Resolved grievances related to outpatient behavioral health services",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to outpatient mental health and/or substance use services. If the managed care plan does not cover this type of service, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedCoveredOutpatientPrescriptionDrugGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.15e Resolved grievances related to coverage of outpatient prescription drugs",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to outpatient prescription drugs covered by the managed care plan. If the managed care plan does not cover this type of service, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedSnfServiceGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.15f Resolved grievances related to skilled nursing facility (SNF) services",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to SNF services. If the managed care plan does not cover this type of service, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedLtssServiceGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.15g Resolved grievances related to long-term services and supports (LTSS)",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to institutional LTSS or LTSS provided through home and community-based (HCBS) services, including personal care and self-directed services. If the managed care plan does not cover this type of service, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedDentalServiceGrievances",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.15h Resolved grievances related to dental services",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to dental services. If the managed care plan does not cover this type of service, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedNemtGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.15i Resolved grievances related to non-emergency medical transportation (NEMT)",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to NEMT. If the managed care plan does not cover this type of service, enter "N/A".',
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedOtherServiceGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.15j Resolved grievances related to other service types",
              hint: 'Enter the total number of grievances resolved by the plan during the reporting year that were related to services that do not fit into one of the categories listed above. If the managed care plan does not cover services other than those in items D1.IV.15a-i, enter "N/A".',
              mask: "comma-separated",
            },
          },
        ],
      },
    },
    {
      name: "Grievances by Reason",
      path: "/wp/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-reason",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
          spreadsheet: "D1_Plan_Set",
          info: [
            {
              type: "heading",
              as: "h3",
              content: "Grievances by Reason",
            },
            {
              type: "p",
              content:
                "Report the number of grievances resolved by plan during the reporting period by reason.",
            },
          ],
        },
        dashboardTitle: "Report on grievances by reason for each plan",
        drawerTitle: "Report on grievances by reason for",
        drawerInfo: [
          {
            type: "p",
            content:
              "A single grievance may be related to multiple reasons and may therefore be counted in multiple categories.",
          },
        ],
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dgbr",
        fields: [
          {
            id: "plan_resolvedCustomerServiceGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.16a Resolved grievances related to plan or provider customer service",
              hint: "<p>Enter the total number of grievances resolved by the plan during the reporting year that were related to plan or provider customer service.</p><p>Customer service grievances include complaints about interactions with the plan's Member Services department, provider offices or facilities, plan marketing agents, or any other plan or provider representatives.</p>",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedCareCaseManagementGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.16b Resolved grievances related to plan or provider care management/case management",
              hint: "<p>Enter the total number of grievances resolved by the plan during the reporting year that were related to plan or provider care management/case management.</p><p>Care management/case management grievances include complaints about the timeliness of an assessment or complaints about the plan or provider care or case management process.</p>",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedAccessToCareGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.16c Resolved grievances related to access to care/services from plan or provider",
              hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to access to care.</p><p>Access to care grievances include complaints about difficulties finding qualified in-network providers, excessive travel or wait times, or other access issues.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedQualityOfCareGrievances",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.16d Resolved grievances related to quality of care",
              hint: "Enter the total number of grievances resolved by the plan during the reporting year that were related to quality of care.</p><p>Quality of care grievances include complaints about the effectiveness, efficiency, equity, patient-centeredness, safety, and/or acceptability of care provided by a provider or the plan.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedPlanCommunicationGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.16e Resolved grievances related to plan communications",
              hint: "<p>Enter the total number of grievances resolved by the plan during the reporting year that were related to plan communications.</p><p>Plan communication grievances include grievances related to the clarity or accuracy of enrollee materials or other plan communications or to an enrollee's access to or the accessibility of enrollee materials or plan communications.</p>",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedPaymentBillingGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.16f Resolved grievances related to payment or billing issues",
              hint: "Enter the total number of grievances resolved during the reporting period that were filed for a reason related to payment or billing issues.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedSuspectedFraudGrievances",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.16g Resolved grievances related to suspected fraud",
              hint: "Enter the total number of grievances resolved during the reporting year that were related to suspected fraud.</p><p>Suspected fraud grievances include suspected cases of financial/payment fraud perpetuated by a provider, payer, or other entity. Note: grievances reported in this row should only include grievances submitted to the managed care plan, not grievances submitted to another entity, such as a state Ombudsman or Office of the Inspector General.",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedAbuseNeglectExploitationGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.16h Resolved grievances related to abuse, neglect or exploitation",
              hint: "<p>Enter the total number of grievances resolved during the reporting year that were related to abuse, neglect or exploitation.</p><p>Abuse/neglect/exploitation grievances include cases involving potential or actual patient harm.</p>",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedUntimelyResponseGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.16i Resolved grievances related to lack of timely plan response to a service authorization or appeal (including requests to expedite or extend appeals)",
              hint: "Enter the total number of grievances resolved during the reporting year that were filed due to a lack of timely plan response to a service authorization or appeal request (including requests to expedite or extend appeals).",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedDenialOfExpeditedAppealGrievances",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.IV.16j Resolved grievances related to plan denial of expedited appeal",
              hint: "<p>Enter the total number of grievances resolved during the reporting year that were related to the plan's denial of an enrollee's request for an expedited appeal.</p><p>Per 42 CFR §438.408(b)(3), states must establish a timeframe for timely resolution of expedited appeals that is no longer than 72 hours after the MCO, PIHP or PAHP receives the appeal. If a plan denies a request for an expedited appeal, the enrollee or their representative have the right to file a grievance.</p>",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedOtherGrievances",
            type: "number",
            validation: "number",
            props: {
              label: "D1.IV.16k Resolved grievances filed for other reasons",
              hint: "Enter the total number of grievances resolved during the reporting period that were filed for a reason other than the reasons listed above.",
              mask: "comma-separated",
            },
          },
        ],
      },
    },
    {
      name: "X: Program Integrity",
      path: "/wp/plan-level-indicators/program-integrity",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: {
          section: "Section D: Plan-Level Indicators",
          subsection: "Topic X. Program Integrity",
          spreadsheet: "D1_Plan_Set",
        },
        dashboardTitle: "Report on program integrity for each plan",
        drawerTitle: "Program integrity for",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/wp/program-information/add-plans",
            },
          },
        ],
      },
      drawerForm: {
        id: "dpi",
        fields: [
          {
            id: "plan_dedicatedProgramIntegrityStaff",
            type: "number",
            validation: "number",
            props: {
              label: "D1.X.1 Dedicated program integrity staff",
              hint: "Report or enter the number of dedicated program integrity staff for routine internal monitoring and compliance risks. Refer to 42 CFR 438.608(a)(1)(vii).",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_openedProgramIntegrityInvestigations",
            type: "number",
            validation: "number",
            props: {
              label: "D1.X.2 Count of opened program integrity investigations",
              hint: "How many program integrity investigations have been opened by the plan in the past year?",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_programIntegrityInvestigationsToEnrolleesRatio",
            type: "number",
            validation: "ratio",
            props: {
              label:
                "D1.X.3 Ratio of opened program integrity investigations to enrollees",
              hint: "What is the ratio of program integrity investigations opened by the plan in the past year per 1,000 beneficiaries enrolled in the plan on the first day of the last month of the reporting year?",
              mask: "ratio",
            },
          },
          {
            id: "plan_resolvedProgramIntegrityInvestigations",
            type: "number",
            validation: "number",
            props: {
              label:
                "D1.X.4 Count of resolved program integrity investigations",
              hint: "How many program integrity investigations have been resolved by the plan in the past year?",
              mask: "comma-separated",
            },
          },
          {
            id: "plan_resolvedProgramIntegrityInvestigationsToEnrolleesRatio",
            type: "number",
            validation: "ratio",
            props: {
              label:
                "D1.X.5 Ratio of resolved program integrity investigations to enrollees",
              hint: "What is the ratio of program integrity investigations resolved by the plan in the past year per 1,000 beneficiaries enrolled in the plan at the beginning of the reporting year?",
              mask: "ratio",
            },
          },
          {
            id: "plan_programIntegrityReferralPath",
            type: "radio",
            validation: "radio",
            props: {
              label:
                "D1.X.6 Referral path for program integrity referrals to the state",
              hint: "What is the referral path that the plan uses to make program integrity referrals to the state? Select one.",
              choices: [
                {
                  id: "1LOghpdQOkaOd76btMJ8qA",
                  label:
                    "Makes referrals to the Medicaid Fraud Control Unit (MFCU) only",
                  children: [
                    {
                      id: "plan_mfcuProgramIntegrityReferrals",
                      type: "number",
                      validation: {
                        type: "number",
                        nested: true,
                        parentFieldName: "plan_programIntegrityReferralPath",
                      },
                      props: {
                        label:
                          "D1.X.7 Count of program integrity referrals to the state",
                        hint: "Enter the count of program integrity referrals that the plan made to the state in the past year. Enter the count of referrals made.",
                        mask: "comma-separated",
                      },
                    },
                  ],
                },
                {
                  id: "Urpmgw3wiUWyYfiFg8OTNQ",
                  label:
                    "Makes referrals to the State Medicaid Agency (SMA) and MFCU concurrently",
                  children: [
                    {
                      id: "plan_smaMfcuConcurrentProgramIntegrityReferrals",
                      type: "number",
                      validation: {
                        type: "number",
                        nested: true,
                        parentFieldName: "plan_programIntegrityReferralPath",
                      },
                      props: {
                        label:
                          "D1.X.7 Count of program integrity referrals to the state",
                        hint: "Enter the count of program integrity referrals that the plan made to the state in the past year. Enter the count of unduplicated referrals",
                        mask: "comma-separated",
                      },
                    },
                  ],
                },
                {
                  id: "ZGHlkg7EEkSb4gin6YSNlg",
                  label:
                    "Makes some referrals to the SMA and others directly to the MFCU",
                  children: [
                    {
                      id: "plan_smaMfcuAggregateProgramIntegrityReferrals",
                      type: "number",
                      validation: {
                        type: "number",
                        nested: true,
                        parentFieldName: "plan_programIntegrityReferralPath",
                      },
                      props: {
                        label:
                          "D1.X.7 Count of program integrity referrals to the state",
                        hint: "Enter the count of program integrity referrals that the plan made to the state in the past year. Enter the count of referrals made to the SMA and the MFCU in aggregate.",
                        mask: "comma-separated",
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "plan_programIntegrityReferralsPerThousandBeneficiaries",
            type: "number",
            validation: "ratio",
            props: {
              label: "D1.X.8 Ratio of program integrity referral to the state",
              hint: "What is the ratio of program integrity referral listed in the previous indicator made to the state in the past year per 1,000 beneficiaries, using the plan's total enrollment as of the first day of the last month of the reporting year (reported in indicator D1.I.1) as the denominator.",
              mask: "ratio",
            },
          },
          {
            id: "plan_overpaymentRecoveryReportDescription",
            type: "textarea",
            validation: "text",
            props: {
              label: "D1.X.9 Plan overpayment reporting to the state",
              hint: "Describe the plan’s latest annual overpayment recovery report submitted to the state as required under 42 CFR 438.608(d)(3).</br>Include, for example, the following information:<ul><li>The date of the report (rating period or calendar year).</li><li>The dollar amount of overpayments recovered.</li><li>The ratio of the dollar amount of overpayments recovered as a percent of premium revenue as defined in MLR reporting under 438.8(f)(2).</li></ul>",
            },
          },
          {
            id: "plan_beneficiaryCircumstanceChangeReportingFrequency",
            type: "radio",
            validation: "radio",
            props: {
              label: "D1.X.10 Changes in beneficiary circumstances",
              hint: "Select the frequency the plan reports changes in beneficiary circumstances to the state.",
              choices: [
                {
                  id: "D79APWVHmkGzLcmBQrRXOA",
                  label: "Daily",
                },
                {
                  id: "MdxvXlRKGk2mK1n3L0JVhg",
                  label: "Weekly",
                },
                {
                  id: "rhq0lLeGKUa0h8KDDmH0xw",
                  label: "Bi-weekly",
                },
                {
                  id: "LPHYHUonAU6CDMPSmG5VhA",
                  label: "Monthly",
                },
                {
                  id: "cuF3zAprGUGnP8KkSIVXow",
                  label: "Bi-monthly",
                },
                {
                  id: "erownxjo30SA9PI9VdATTA",
                  label: "Quarterly",
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: "E: BSS Entity Indicators",
      path: "/wp/bss-entity-indicators",
      pageType: "drawer",
      entityType: "bssEntities",
      verbiage: {
        intro: {
          section: "Section E: BSS Entity Indicators",
          subsection: "Topic IX. Beneficiary Support System (BSS) Entities",
          spreadsheet: "E_BSS_Entities",
          info: [
            {
              type: "span",
              content:
                "Per 42 CFR 438.66(e)(2)(ix), the Managed Care Program Annual Report must provide information on and an assessment of the operation of the managed care program including activities and performance of the beneficiary support system. Information on how BSS entities support program-level functions is on the ",
            },
            {
              type: "internalLink",
              content: "Program-Level BSS",
              props: {
                to: "/wp/program-information/add-bss-entities",
              },
            },
            {
              type: "span",
              content: " page.",
            },
          ],
        },
        dashboardTitle: "Report on role and type for each BSS entity",
        drawerTitle: "Report on",
        missingEntityMessage: [
          {
            type: "span",
            content:
              "This program is missing BSS entities. You won’t be able to complete this section until you’ve added all the names of BSS entities that support enrollees in the program. ",
          },
          {
            type: "internalLink",
            content: "Add BSS entities",
            props: {
              to: "/wp/program-information/add-bss-entities",
            },
          },
        ],
      },
      drawerForm: {
        id: "ebssei",
        fields: [
          {
            id: "bssEntity_entityType",
            type: "checkbox",
            validation: "checkbox",
            props: {
              label: "E.IX.1 BSS entity type",
              hint: "What type of entity was contracted to perform each BSS activity? Check all that apply. Refer to 42 CFR 438.71(b).",
              choices: [
                {
                  id: "b8RT4wLcoU2yb0QgswyAfQ",
                  label: "State Government Entity",
                },
                {
                  id: "n8Nje9xGS0SXCymALzc42g",
                  label: "Local Government Entity",
                },
                {
                  id: "iDWw3TwoI0iHbO1V7XO1Nw",
                  label: "Ombudsman Program",
                },
                {
                  id: "0l4OWGZg7keJKdoRr3rNNA",
                  label: "State Health Insurance Assistance Program (SHIP)",
                },
                {
                  id: "9KfSY0XoS0Kn4AVEQWqYZw",
                  label: "Aging and Disability Resource Network (ADRN)",
                },
                {
                  id: "TqLWs965B0e0EmYnaShjOQ",
                  label: "Center for Independent Living (CIL)",
                },
                {
                  id: "XStmnayyVE6WDw2lhN682g",
                  label: "Legal Assistance Organization",
                },
                {
                  id: "Zc6FUo3Ee0i3kbbcYa3G8Q",
                  label: "Other Community-Based Organization",
                },
                {
                  id: "rXh51BskxUGvkWUaYtEVIA",
                  label: "Subcontractor",
                },
                {
                  id: "vXL3hGQHSUazZCZzQyX3hw",
                  label: "Enrollment Broker",
                },
                {
                  id: "xTEi7XgUvkGM4rU3FRaHDQ",
                  label: "Consultant",
                },
                {
                  id: "9vVNL9HLokKe3c6h4WAiAg",
                  label: "Academic/Research Organization",
                },
                {
                  id: "dgtCWe8drkivORajgmqYRw",
                  label: "Other, specify",
                  children: [
                    {
                      id: "bssEntity_entityType-otherText",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName: "bssEntity_entityType",
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "bssEntity_entityRole",
            type: "checkbox",
            validation: "checkbox",
            props: {
              label: "E.IX.2 BSS entity role",
              hint: "What are the roles performed by the BSS entity? Check all that apply. Refer to 42 CFR 438.71(b).",
              choices: [
                {
                  id: "aZ0uOjpYOE6zavUNXcZYrw",
                  label: "Enrollment Broker/Choice Counseling",
                },
                {
                  id: "eU2xXBr95USN7KG6VuVs3w",
                  label: "Beneficiary Outreach",
                },
                {
                  id: "GWTY3GEjGU2OhEOpqzm2AQ",
                  label: "LTSS Complaint Access Point",
                },
                {
                  id: "aF6Gt3rcsEibKmYvlKUH2A",
                  label: "LTSS Grievance/Appeals Education",
                },
                {
                  id: "gNJg0G5VXUmOk86B5pvyRg",
                  label: "LTSS Grievance/Appeals Assistance",
                },
                {
                  id: "cCu7xtpMDEGeJwbuaiO5XQ",
                  label: "Review/Oversight of LTSS Data",
                },
                {
                  id: "HcfrzcLqYU6faU0EBi9dfA",
                  label: "Other, specify",
                  children: [
                    {
                      id: "bssEntity_entityRole-otherText",
                      type: "textarea",
                      validation: {
                        type: "text",
                        nested: true,
                        parentFieldName: "bssEntity_entityRole",
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
  programName: "test",
  status: ReportStatus.NOT_STARTED,
  createdAt: 1694022189008,
  lastAltered: 1694022189008,
  lastAlteredBy: "Thelonious States",
  dueDate: 1659373200000,
  formTemplate: mockFullReportJSON,
  fieldData: {
    id: "2V2LLgyP7wjNYvYXHmzd5laXl7J",
    reportingPeriodStartDate: "01/02/2022",
    reportingPeriodEndDate: "02/02/2022",
    programName: "test",
    stateName: "Minnesota",
  },
};

export const reportByState = {
  reportingPeriodStartDate: 1643778000000,
  dueDate: 1659373200000,
  formTemplateId: "2V2LLezUtxYOBRMEoiTp5r1O71X",
  lastAlteredBy: "Thelonious States",
  versionNumber: 1,
  reportType: "MCPAR",
  createdAt: 1694029173139,
  programName: "water",
  combinedData: false,
  lastAltered: 1694029173139,
  reportingPeriodEndDate: 1643778000000,
  state: "MN",
  id: "2V2LLf0ofcV5waGTA6XuZPev4PR",
  fieldDataId: "2V2LLgyP7wjNYvYXHmzd5laXl7J",
  status: "Not started",
};
