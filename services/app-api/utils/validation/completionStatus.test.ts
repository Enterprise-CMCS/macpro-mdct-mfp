import {
  AnyObject,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ReportType,
  TransformationRule,
  ValidationType,
} from "../types";
import { calculateCompletionStatus, isComplete } from "./completionStatus";

describe("utils/validation/completionStatus", () => {
  describe("calculateCompletionStatus()", () => {
    const getFormTemplate = (
      pageType: PageTypes,
      form?: AnyObject,
      validationJson?: AnyObject,
      options?: AnyObject
    ) => {
      const entities = options?.entityType
        ? { entities: { [options.entityType]: { required: false } } }
        : {};

      return {
        routes: [
          {
            path: "/mockReportType/mock-parent-path",
            children: [
              {
                path: "/mockReportType/mock-parent-path/mock-child-path",
                pageType,
                ...form,
                ...options,
              },
            ],
          },
        ],
        ...entities,
        ...validationJson,
      };
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("pageType: PageTypes.STANDARD", () => {
      const pageType = PageTypes.STANDARD;
      test("returns true for complete fields/data", async () => {
        const testData = {
          mockField: "Mock text",
        };
        const form = {
          form: {
            fields: [
              {
                id: "mockField",
                type: ReportFormFieldType.TEXT,
                validation: ValidationType.TEXT,
              },
            ],
          },
        };
        const validation = {
          validationJson: {
            mockField: ValidationType.TEXT,
          },
        };
        const result = await calculateCompletionStatus(
          testData,
          getFormTemplate(pageType, form, validation)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": true,
          },
        });
      });

      test("returns false for incomplete fields/data", async () => {
        const form = {
          form: {
            fields: [
              {
                id: "mockField",
                type: ReportFormFieldType.TEXT,
                validation: ValidationType.TEXT,
              },
            ],
          },
        };
        const validation = {
          validationJson: {
            mockField: ValidationType.TEXT,
          },
        };
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType, form, validation)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": false,
          },
        });
      });

      test("returns false for incomplete fields", async () => {
        const form = { form: { fields: [] } };
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType, form)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": false,
          },
        });
      });

      test("ignores page with no form", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {},
        });
      });
    });

    describe("pageType: PageTypes.DRAWER", () => {
      const pageType = PageTypes.DRAWER;
      const entityType = "mockEntityType";
      const options = { entityType };
      const form = {
        drawerForm: {
          fields: [
            {
              id: "mockDrawerField",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
            },
          ],
        },
      };
      const validation = {
        validationJson: {
          mockDrawerField: ValidationType.TEXT,
        },
      };

      test("returns true for complete fields/data", async () => {
        const testData = {
          [entityType]: [{ mockDrawerField: "Mock text" }],
        };

        const result = await calculateCompletionStatus(
          testData,
          getFormTemplate(pageType, form, validation, options)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": true,
          },
        });
      });

      test("returns true for incomplete optional data", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType, form, validation, options)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": true,
          },
        });
      });

      test("ignores page with no form", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {},
        });
      });
    });

    describe("pageType: PageTypes.MODAL_DRAWER", () => {
      const pageType = PageTypes.MODAL_DRAWER;
      const entityType = "mockEntityType";
      const options = { entityType };
      const form = {
        drawerForm: {
          fields: [
            {
              id: "mockDrawerField",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              entityType,
            },
          ],
        },
        modalForm: {
          fields: [
            {
              id: "mockModalField",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              entityType,
            },
          ],
        },
      };
      const validation = {
        validationJson: {
          mockModalField: ValidationType.TEXT,
          mockDrawerField: ValidationType.TEXT,
        },
      };
      test("returns true for complete fields/data", async () => {
        const testData = {
          [entityType]: [
            {
              mockDrawerField: "Mock text",
              mockModalField: "Mock text",
            },
          ],
        };
        const result = await calculateCompletionStatus(
          testData,
          getFormTemplate(pageType, form, validation, options)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": true,
          },
        });
      });

      test("returns true for incomplete optional data", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType, form, validation, options)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": true,
          },
        });
      });

      test("ignores page with no form", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {},
        });
      });

      describe("targetPopulations", () => {
        const targetPopulationFieldDataOneYes = {
          targetPopulations: [
            {
              id: "2Vd02CVUtKgBETwqzDXpSIhi",
              transitionBenchmarks_targetPopulationName: "Older adults",
              isRequired: true,
              transitionBenchmarks_applicableToMfpDemonstration: [
                {
                  key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v", // pragma: allowlist secret
                  value: "No",
                },
              ],
              quarterlyProjections2024Q1: "",
              quarterlyProjections2024Q2: "",
              quarterlyProjections2024Q3: "",
              quarterlyProjections2024Q4: "",
              quarterlyProjections2025Q1: "",
              quarterlyProjections2025Q2: "",
              quarterlyProjections2025Q3: "",
              quarterlyProjections2025Q4: "",
              quarterlyProjections2026Q1: "",
              quarterlyProjections2026Q2: "",
              quarterlyProjections2026Q3: "",
              quarterlyProjections2026Q4: "",
            },
            {
              id: "2Vd02HAezQkxNu2ShmlQONHa",
              transitionBenchmarks_targetPopulationName:
                "Individuals with physical disabilities (PD)",
              transitionBenchmarks_targetPopulationName_short: "PD",
              isRequired: true,
              transitionBenchmarks_applicableToMfpDemonstration: [
                {
                  key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v", // pragma: allowlist secret
                  value: "No",
                },
              ],
              quarterlyProjections2024Q1: "",
              quarterlyProjections2024Q2: "",
              quarterlyProjections2024Q3: "",
              quarterlyProjections2024Q4: "",
              quarterlyProjections2025Q1: "",
              quarterlyProjections2025Q2: "",
              quarterlyProjections2025Q3: "",
              quarterlyProjections2025Q4: "",
              quarterlyProjections2026Q1: "",
              quarterlyProjections2026Q2: "",
              quarterlyProjections2026Q3: "",
              quarterlyProjections2026Q4: "",
            },
            {
              id: "2Vd02IvLwE59ebYAjfiU7H66",
              transitionBenchmarks_targetPopulationName:
                "Individuals with intellectual and developmental disabilities (I/DD)",
              transitionBenchmarks_targetPopulationName_short: "I/DD",
              isRequired: true,
              transitionBenchmarks_applicableToMfpDemonstration: [
                {
                  key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v", // pragma: allowlist secret
                  value: "No",
                },
              ],
              quarterlyProjections2024Q1: "",
              quarterlyProjections2024Q2: "",
              quarterlyProjections2024Q3: "",
              quarterlyProjections2024Q4: "",
              quarterlyProjections2025Q1: "",
              quarterlyProjections2025Q2: "",
              quarterlyProjections2025Q3: "",
              quarterlyProjections2025Q4: "",
              quarterlyProjections2026Q1: "",
              quarterlyProjections2026Q2: "",
              quarterlyProjections2026Q3: "",
              quarterlyProjections2026Q4: "",
            },
            {
              id: "2Vd02J1FHl3Ka1DbtU5FMSDh",
              transitionBenchmarks_targetPopulationName:
                "Individuals with mental health and substance use disorders (MH/SUD)",
              transitionBenchmarks_targetPopulationName_short: "MH/SUD",
              isRequired: true,
              transitionBenchmarks_applicableToMfpDemonstration: [
                {
                  key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIuHjl15upf6tLcgcWd", // pragma: allowlist secret
                  value: "Yes",
                },
              ],
              quarterlyProjections2024Q1: "5",
              quarterlyProjections2024Q2: "5",
              quarterlyProjections2024Q3: "5",
              quarterlyProjections2024Q4: "5",
              quarterlyProjections2025Q1: "5",
              quarterlyProjections2025Q2: "5",
              quarterlyProjections2025Q3: "5",
              quarterlyProjections2025Q4: "5",
              quarterlyProjections2026Q1: "5",
              quarterlyProjections2026Q2: "5",
              quarterlyProjections2026Q3: "5",
              quarterlyProjections2026Q4: "5",
            },
          ],
        };

        const targetPopulationFormTemplate = {
          routes: [
            {
              name: "Transition Benchmarks",
              path: "/wp/transition-benchmarks",
              pageType: PageTypes.MODAL_DRAWER,
              entityType: "targetPopulations",
              entityInfo: ["transitionBenchmarks_targetPopulationName"],
              verbiage: {
                accordion: {
                  buttonLabel: "Considerations around target populations",
                  intro: [
                    {
                      type: "html",
                      content:
                        "An approach for defining target populations should be outlined in your Operational Protocol. Those definitions should be used to report the transition benchmarks. You may need to track some populations outside of these categories to see utilization to address questions from stakeholders and those circumstances should be discussed with your CMS MFP Project Officer. <br><br> In the next section, you will be asked to describe your state or territory-specific initiatives, which may inform which target populations you include here when you think about who is being served by your different planned initiatives. <br><br>Additional information on strategies to achieve transition targets will be included in the state or territory-specific initiative on transitions and transition coordination services in the next section.",
                    },
                  ],
                },
                intro: {
                  section: "",
                  subsection: "Transition Benchmark Projections",
                  info: [
                    {
                      type: "html",
                      content:
                        "Provide the projected number of transitions for each target population during each quarter. This number includes qualified institutional residents who enroll in MFP, and are anticipated to be discharged from an institution to a qualified residence during the reporting period in the quarter.",
                    },
                  ],
                },
                dashboardTitle:
                  "Report projected number of transitions for each target population",
                pdfDashboardTitle: "Transition Benchmark Totals",
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
                  "Are you sure you want to proceed? You will lose all information entered for this population in the MFP Work Plan. The population will remain in previously submitted MFP Semi-Annual Progress Reports if applicable.",
                entityUnfinishedMessage:
                  "Complete the remaining indicators for this access measure by entering details.",
                enterEntityDetailsButtonText: "Edit",
                readOnlyEntityDetailsButtonText: "View",
                reviewPdfHint:
                  'To view Transition Benchmark Totals by target population and by quarter, click "Review PDF" and it will open a summary in a new tab.',
                drawerTitle: "Report transition benchmarks for ",
                drawerInfo: [
                  {
                    type: "span",
                    content:
                      "Provide the projected number of transitions for the target population during each quarter. This number includes institutional residents who are discharged from an institution to a qualified residence during the reporting period, enroll in MFP, and begin using Medicaid home and community-based services (HCBS).",
                  },
                  {
                    type: "p",
                    content:
                      'Complete all fields and select the "Save & close" button to save this section.',
                  },
                ],
              },
              modalForm: {
                id: "tb-modal",
                fields: [
                  {
                    id: "transitionBenchmarks_targetPopulationName",
                    type: ReportFormFieldType.TEXT,
                    validation: ValidationType.TEXT,
                    props: {
                      label: "Target population name",
                      hint: 'Specify an "other" target population applicable to your MFP Demonstration project. (e.g., HIV/AIDS, brain injury).',
                    },
                  },
                ],
              },
              drawerForm: {
                id: "tb-drawer",
                fields: [
                  {
                    id: "transitionBenchmarks_applicableToMfpDemonstration",
                    type: ReportFormFieldType.RADIO,
                    validation: ValidationType.RADIO,
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
                              id: "quarterlyProjections",
                              type: ValidationType.NUMBER,
                              validation: {
                                type: "validInteger",
                                parentFieldName:
                                  "transitionBenchmarks_applicableToMfpDemonstration",
                                parentOptionId:
                                  "transitionBenchmarks_applicableToMfpDemonstration-2UObIuHjl15upf6tLcgcWd", // pragma: allowlist secret
                                nested: true,
                              },
                              transformation: {
                                rule: TransformationRule.NEXT_TWELVE_QUARTERS,
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
          validationJson: {
            targetPopulations: "objectArray",
            transitionBenchmarks_targetPopulationName: ValidationType.TEXT,
            transitionBenchmarks_applicableToMfpDemonstration:
              ValidationType.RADIO,
          },
        };

        test("Target populations are considered complete if at least one defaults is applicable", async () => {
          const result = await calculateCompletionStatus(
            targetPopulationFieldDataOneYes,
            targetPopulationFormTemplate
          );
          expect(result).toEqual({
            "/wp/transition-benchmarks": true,
          });
        });

        test("Target populations are considered incomplete if all defaults are not applicable", async () => {
          const targetPopulationsAllNo: any[] =
            targetPopulationFieldDataOneYes.targetPopulations;
          // last item is a yes. pop and replace with no.
          targetPopulationsAllNo[3] = {
            id: "2Vd02J1FHl3Ka1DbtU5FMSDh",
            transitionBenchmarks_targetPopulationName:
              "Individuals with mental health and substance use disorders (MH/SUD)",
            transitionBenchmarks_targetPopulationName_short: "MH/SUD",
            isRequired: true,
            transitionBenchmarks_applicableToMfpDemonstration: [
              {
                key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v", // pragma: allowlist secret
                value: "No",
              },
            ],
            quarterlyProjections2024Q1: "",
            quarterlyProjections2024Q2: "",
            quarterlyProjections2024Q3: "",
            quarterlyProjections2024Q4: "",
            quarterlyProjections2025Q1: "",
            quarterlyProjections2025Q2: "",
            quarterlyProjections2025Q3: "",
            quarterlyProjections2025Q4: "",
            quarterlyProjections2026Q1: "",
            quarterlyProjections2026Q2: "",
            quarterlyProjections2026Q3: "",
            quarterlyProjections2026Q4: "",
          };
          const targetPopulationFieldDataAllNo = {
            targetPopulations: targetPopulationsAllNo,
          };

          const result = await calculateCompletionStatus(
            targetPopulationFieldDataAllNo,
            targetPopulationFormTemplate
          );

          expect(result).toEqual({
            "/wp/transition-benchmarks": false,
          });
        });
      });
    });

    describe("pageType: PageTypes.MODAL_OVERLAY", () => {
      const pageType = PageTypes.MODAL_OVERLAY;
      const entityType = "mockEntityType";
      const options = { entityType };
      const form = {
        modalForm: {
          fields: [
            {
              id: "mockModalField",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              entityType,
            },
          ],
        },
        overlayForm: {
          fields: [
            {
              id: "mockOverlayField",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              entityType,
            },
          ],
        },
      };
      const validation = {
        validationJson: {
          mockField: ValidationType.TEXT,
        },
      };

      test("returns true for complete fields/data", async () => {
        const testData = {
          [entityType]: [
            {
              mockModalField: "Mock text",
              mockOverlayField: "Mock text",
            },
          ],
        };
        const result = await calculateCompletionStatus(
          testData,
          getFormTemplate(pageType, form, validation, options)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": true,
          },
        });
      });

      test("returns true for incomplete optional data", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType, form, validation, options)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": true,
          },
        });
      });

      test("ignores page with no form", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {},
        });
      });

      describe("initiativeV1", () => {
        test("An entity step with overlay modals is incomplete if any parts are incomplete", async () => {
          const testData = {
            mockEntityType: [
              {
                mockStepType: [
                  /* mockStepType is an empty array and therefore incomplete */
                ],
              },
            ],
          };
          const formTemplate = {
            routes: [
              {
                path: "/mock/path",
                pageType: PageTypes.MODAL_OVERLAY,
                entityType: "mockEntityType",
                entitySteps: [
                  {
                    pageType: PageTypes.OVERLAY_MODAL,
                    stepType: "mockStepType",
                  },
                ],
                modalForm: {},
              },
            ],
            validationJson: {},
          };

          const result = await calculateCompletionStatus(
            testData,
            formTemplate
          );

          expect(result).toEqual({
            "/mock/path": false,
          });
        });

        test("An entity with steps can be marked complete with normal validation", async () => {
          const testData = {
            mockEntityType: [
              // we are in entityFields[]
              {
                // we are in entityFields
                mockStepType: [
                  // we are in entityFieldsList
                  {
                    // we are in stepFields aka dataForObject
                    mockFieldId: "test@example.com",
                  },
                ],
              },
            ],
          };
          const formTemplate = {
            routes: [
              {
                path: "/mock/path",
                pageType: PageTypes.MODAL_OVERLAY,
                entityType: "mockEntityType",
                entitySteps: [
                  // we are in entitySteps aka stepFormTemplates
                  {
                    // we are in a stepForm
                    pageType: "mockPageType",
                    stepType: "mockStepType",
                    form: {
                      // we are in nestedFormTemplate
                      fields: [
                        {
                          // we are in a formField
                          id: "mockFieldId",
                        },
                      ],
                    },
                  },
                ],
                modalForm: {},
              },
            ],
            validationJson: {
              mockFieldId: "email",
            },
          };

          const result = await calculateCompletionStatus(
            testData,
            formTemplate
          );

          expect(result).toEqual({
            "/mock/path": true,
          });
        });

        test("An entity with steps can be marked incomplete with normal validation", async () => {
          const testData = {
            mockEntityType: [
              // we are in entityFields[]
              {
                // we are in entityFields
                mockStepType: [
                  // we are in entityFieldsList
                  {
                    // we are in stepFields aka dataForObject
                    mockFieldId: "not an email",
                  },
                ],
              },
            ],
          };
          const formTemplate = {
            routes: [
              {
                path: "/mock/path",
                pageType: PageTypes.MODAL_OVERLAY,
                entityType: "mockEntityType",
                entitySteps: [
                  // we are in entitySteps aka stepFormTemplates
                  {
                    // we are in a stepForm
                    pageType: "mockPageType",
                    stepType: "mockStepType",
                    form: {
                      // we are in nestedFormTemplate
                      fields: [
                        {
                          // we are in a formField
                          id: "mockFieldId",
                        },
                      ],
                    },
                  },
                ],
                modalForm: {},
              },
            ],
            validationJson: {
              mockFieldId: "email",
            },
          };

          const result = await calculateCompletionStatus(
            testData,
            formTemplate
          );

          expect(result).toEqual({
            "/mock/path": false,
          });
        });

        test("An entity step with overlay modals is complete if all parts are complete", async () => {
          const testData = {
            mockEntityType: [
              {
                mockStepType: [
                  "mockStepType is a non-empty array and therefore complete",
                ],
              },
            ],
          };
          const formTemplate = {
            routes: [
              {
                path: "/mock/path",
                pageType: PageTypes.MODAL_OVERLAY,
                entityType: "mockEntityType",
                entitySteps: [
                  {
                    pageType: PageTypes.OVERLAY_MODAL,
                    stepType: "mockStepType",
                  },
                ],
                modalForm: {},
              },
            ],
            validationJson: {},
          };

          const result = await calculateCompletionStatus(
            testData,
            formTemplate
          );

          expect(result).toEqual({
            "/mock/path": true,
          });
        });
      });

      describe("initiativeV2", () => {
        const form = {
          modalForm: {
            fields: [
              {
                id: "mockModalField",
                type: ReportFormFieldType.TEXT,
                validation: ValidationType.TEXT,
              },
            ],
          },
          overlayForm: {
            fields: [
              {
                id: "mockOverlayField",
                type: ReportFormFieldType.TEXT,
                validation: ValidationType.TEXT,
              },
            ],
          },
        };
        const validation = {
          validationJson: {
            mockModalField: ValidationType.TEXT,
            mockOverlayField: ValidationType.TEXT,
          },
        };

        test("returns true for complete data", async () => {
          const testData = {
            mockModalField: "Mock text",
            mockOverlayField: "Mock text",
          };

          const result = await calculateCompletionStatus(
            testData,
            getFormTemplate(pageType, form, validation)
          );
          expect(result).toEqual({
            "/mockReportType/mock-parent-path": {},
          });
        });

        test("returns false for incomplete data", async () => {
          const result = await calculateCompletionStatus(
            {},
            getFormTemplate(pageType, form, validation)
          );
          expect(result).toEqual({
            "/mockReportType/mock-parent-path": {},
          });
        });
      });
    });

    describe("pageType: PageTypes.DYNAMIC_MODAL_OVERLAY", () => {
      const pageType = PageTypes.DYNAMIC_MODAL_OVERLAY;
      const entityType = "mockEntityType";
      const options = { entityType };
      const form = {
        overlayForm: {
          fields: [
            {
              id: "mockOverlayField",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              entityType,
            },
          ],
        },
      };
      const validation = {
        validationJson: {
          mockField: ValidationType.TEXT,
        },
      };

      test("returns true for complete fields/data", async () => {
        const testData = {
          [entityType]: [
            {
              mockOverlayField: "Mock text",
            },
          ],
        };
        const result = await calculateCompletionStatus(
          testData,
          getFormTemplate(pageType, form, validation, options)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": true,
          },
        });
      });

      test("returns true for incomplete optional data", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType, form, validation, options)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {
            "/mockReportType/mock-parent-path/mock-child-path": true,
          },
        });
      });

      test("ignores page with no form", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {},
        });
      });

      describe("initiativeV1", () => {
        const completedInitiatives = (val: number | string) => [
          {
            id: "mockInitiative1",
            other: [
              {
                id: "mockInitiative1_other",
                mockFieldId1: val,
              },
            ],
          },
          {
            id: "mockInitiative2",
            other: [
              {
                id: "mockInitiative2_other",
                mockFieldId2: val,
              },
            ],
          },
        ];

        const objectiveCards = [
          {
            modalForm: {
              fields: [
                {
                  id: "mockFieldId1",
                  validation: ValidationType.NUMBER,
                },
              ],
              objectiveId: "mockInitiative1_other",
            },
          },
          {
            modalForm: {
              fields: [
                {
                  id: "mockFieldId2",
                  validation: ValidationType.NUMBER,
                },
              ],
              objectiveId: "mockInitiative2_other",
            },
          },
          {
            id: "cardWithoutModalForm",
          },
        ];

        const route = {
          entitySteps: [],
          entityType: EntityType.INITIATIVE,
          modalForm: { fields: [] },
          name: "Mock Initiatives",
          pageType: PageTypes.MODAL_OVERLAY,
          path: "/mock-initiatives",
        };

        const validationJson = {
          mockFieldId1: ValidationType.NUMBER,
          mockFieldId2: ValidationType.NUMBER,
        };

        test("returns true for completed initiatives", async () => {
          const testData = {
            initiative: [...completedInitiatives(1)],
          };
          const formTemplate = {
            routes: [
              {
                ...route,
                entitySteps: [
                  {
                    stepType: "other",
                    objectiveCards,
                  },
                ],
              },
            ],
            validationJson,
          };
          const result = await calculateCompletionStatus(
            testData,
            formTemplate
          );

          expect(result).toEqual({
            "/mock-initiatives": true,
          });
        });

        test("returns true for completed and closed initiatives", async () => {
          const testData = {
            initiative: [
              ...completedInitiatives(1),
              {
                id: "mockInitiativeClosed",
                isInitiativeClosed: true,
                other: [
                  {
                    id: "mockInitiativeClosed_other",
                    mockFieldIdClosed: "",
                  },
                ],
              },
            ],
          };
          const formTemplate = {
            routes: [
              {
                ...route,
                entitySteps: [
                  {
                    stepType: "other",
                    objectiveCards: [
                      ...objectiveCards,
                      {
                        modalForm: {
                          fields: [
                            {
                              id: "mockFieldIdClosed",
                              validation: ValidationType.NUMBER,
                            },
                          ],
                          objectiveId: "mockInitiativeClosed_other",
                        },
                      },
                    ],
                  },
                ],
              },
            ],
            validationJson: {
              ...validationJson,
              mockFieldIdClosed: ValidationType.NUMBER,
            },
          };
          const result = await calculateCompletionStatus(
            testData,
            formTemplate
          );

          expect(result).toEqual({
            "/mock-initiatives": true,
          });
        });

        test("returns false for incomplete initiatives", async () => {
          const testData = {};
          const formTemplate = {
            routes: [{ ...route }],
          };
          const result = await calculateCompletionStatus(
            testData,
            formTemplate
          );

          expect(result).toEqual({
            "/mock-initiatives": false,
          });
        });

        test("returns false for incomplete initiatives", async () => {
          const testData = {
            initiative: [...completedInitiatives("")],
          };
          const formTemplate = {
            routes: [
              {
                ...route,
                entitySteps: [
                  { stepType: "overlayModal" },
                  { stepType: "closeOutInformation" },
                  {
                    stepType: "other",
                    objectiveCards,
                  },
                ],
              },
            ],
            validationJson,
          };
          const result = await calculateCompletionStatus(
            testData,
            formTemplate
          );

          expect(result).toEqual({
            "/mock-initiatives": false,
          });
        });

        test("SAR uses initiativeId", async () => {
          const testData = {
            initiative: [...completedInitiatives(1)],
          };
          const formTemplate = {
            type: ReportType.SAR,
            routes: [
              {
                ...route,
                entitySteps: [
                  {
                    stepType: "other",
                    form: {
                      fields: [
                        {
                          id: "mockFieldId1",
                          validation: ValidationType.NUMBER,
                        },
                      ],
                      initiativeId: "mockInitiative1_other",
                    },
                  },
                  {
                    stepType: "other",
                    modalForm: {
                      fields: [
                        {
                          id: "mockFieldId2",
                          validation: ValidationType.NUMBER,
                        },
                      ],
                      initiativeId: "mockInitiative2_other",
                    },
                  },
                ],
              },
            ],
            validationJson,
          };
          const result = await calculateCompletionStatus(
            testData,
            formTemplate
          );

          expect(result).toEqual({
            "/mock-initiatives": true,
          });
        });

        describe("entitySteps", () => {
          const testData = {
            mockEntityType: [
              {
                mockStepType: [
                  "mockStepType is a non-empty array and therefore complete",
                ],
              },
            ],
          };
          const getInitiativeFormTemplate = (initiative?: AnyObject) => ({
            routes: [
              {
                path: "/mock/path",
                pageType: PageTypes.DYNAMIC_MODAL_OVERLAY,
                entityType: "mockEntityType",
                initiatives: [
                  {
                    entitySteps: [
                      {
                        pageType: PageTypes.OVERLAY_MODAL,
                        stepType: "mockStepType",
                      },
                    ],
                  },
                  initiative,
                ],
              },
            ],
            validationJson: {},
          });

          test("returns true for complete steps", async () => {
            const secondInitiative = {
              id: "mockInitiativeWithoutSteps",
            };

            const result = await calculateCompletionStatus(
              testData,
              getInitiativeFormTemplate(secondInitiative)
            );

            expect(result).toEqual({
              "/mock/path": true,
            });
          });

          test("returns false for incomplete steps", async () => {
            const secondInitiative = {
              entitySteps: [
                {
                  pageType: PageTypes.OVERLAY_MODAL,
                  stepType: "mockIncompleteStepType",
                },
              ],
            };
            const testData = {
              mockEntityType: [
                {
                  mockStepType: [
                    "mockStepType is a non-empty array and therefore complete",
                  ],
                },
              ],
            };
            const result = await calculateCompletionStatus(
              testData,
              getInitiativeFormTemplate(secondInitiative)
            );

            expect(result).toEqual({
              "/mock/path": false,
            });
          });
        });
      });

      describe("initiativeV2", () => {
        const form = {
          overlayForm: {
            fields: [
              {
                id: "mockOverlayField",
                type: ReportFormFieldType.TEXT,
                validation: ValidationType.TEXT,
              },
            ],
          },
        };
        const validation = {
          validationJson: {
            mockOverlayField: ValidationType.TEXT,
          },
        };

        test("returns true for complete data", async () => {
          const testData = {
            mockOverlayField: "Mock text",
          };

          const result = await calculateCompletionStatus(
            testData,
            getFormTemplate(pageType, form, validation)
          );
          expect(result).toEqual({
            "/mockReportType/mock-parent-path": {},
          });
        });

        test("returns false for incomplete data", async () => {
          const result = await calculateCompletionStatus(
            {},
            getFormTemplate(pageType, form, validation)
          );
          expect(result).toEqual({
            "/mockReportType/mock-parent-path": {},
          });
        });
      });
    });

    describe("pageType: PageTypes.REVIEW_SUBMIT", () => {
      const pageType = PageTypes.REVIEW_SUBMIT;
      test("ignores page", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType)
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {},
        });
      });
    });

    describe("pageType: default", () => {
      const entityType = "mockEntityType";
      const pageType = "pageType" as PageTypes;
      const options = { entityType };
      const form = {
        id: "mockDrawerForm",
      };
      const entitiesRoutes = [
        {
          ...getFormTemplate(PageTypes.DRAWER, form, undefined, options),
        },
      ];
      test("ignores route without children", async () => {
        const result = await calculateCompletionStatus(
          {},
          getFormTemplate(pageType, { routes: [{}] })
        );
        expect(result).toEqual({
          "/mockReportType/mock-parent-path": {},
        });
      });

      test("Incomplete entities does not cause an exception", async () => {
        const result = await calculateCompletionStatus(
          {},
          { entities: {}, routes: entitiesRoutes }
        );
        expect(result).toEqual({});
      });

      test("Missing nested fields does not cause an exception", async () => {
        const result = await calculateCompletionStatus(
          {
            mockEntityType: [
              {
                id: "cd432-070f-0b5b-4cfb-73c12e6f45",
                name: "Dynamic Fill",
              },
            ],
          },
          {
            entities: { mockEntityType: { required: false } },
            routes: entitiesRoutes,
          }
        );
        expect(result).toEqual({});
      });

      test("Null routes does not cause an exception", async () => {
        const result = await calculateCompletionStatus({}, {});
        expect(result).toEqual({});
      });

      test("Missing entities does not cause an exception", async () => {
        const result = await calculateCompletionStatus(
          {},
          { routes: entitiesRoutes }
        );
        expect(result).toEqual({});
      });

      test("Nested fields can be validated recursively", async () => {
        const testData = {
          field1: [
            {
              key: "a-b-choiceId1",
            },
            {
              key: "a-b-choiceId2",
            },
          ],
          nestedField1: "test",
          nestedField2: [
            {
              key: "a-b-doublyNestedChoice",
            },
          ],
          doublyNestedField1: "not-an-email",
        };
        const formTemplate = {
          routes: [
            {
              path: "/mock/path",
              pageType: PageTypes.STANDARD,
              form: {
                fields: [
                  {
                    id: "field1",
                    props: {
                      choices: [
                        {
                          id: "choiceId1",
                        },
                        {
                          id: "choiceId2",
                          children: [
                            {
                              id: "nestedField1",
                            },
                            {
                              id: "nestedField2",
                              props: {
                                choices: [
                                  {
                                    id: "doublyNestedChoice",
                                    children: [
                                      {
                                        id: "doublyNestedField1",
                                      },
                                    ],
                                  },
                                  {
                                    id: "nestedField2",
                                  },
                                ],
                              },
                            },
                          ],
                        },
                        {
                          id: "choiceId3",
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
          validationJson: {
            doublyNestedField1: "email",
          },
        };

        const result = await calculateCompletionStatus(testData, formTemplate);

        // because completionSchemas.email rejects the string "not-an-email"
        expect(result).toEqual({ "/mock/path": false });
      });
    });
  });

  describe("isComplete()", () => {
    test("returns true for nested check if all true", () => {
      expect(
        isComplete({
          foo: true,
          bar: {
            baz: true,
            biz: {
              buzz: true,
            },
          },
        })
      ).toBe(true);
    });

    test("returns false for nested check there are any false", () => {
      expect(
        isComplete({
          foo: true,
          bar: {
            baz: true,
            biz: {
              buzz: false,
            },
          },
        })
      ).toBe(false);
    });
  });
});
