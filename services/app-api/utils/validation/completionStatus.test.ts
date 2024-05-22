import { calculateCompletionStatus, isComplete } from "./completionStatus";

describe("Completion Status Tests", () => {
  describe("Test Nested Completion Check", () => {
    test("Fails if there are any false", () => {
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
    test("Succeeds if all true", () => {
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
  });
  describe("Test Completion Status of Report", () => {
    const entitiesRoutes = [
      {
        name: "A: Program Information",
        path: "/mcpar/program-information",
        children: [
          {
            name: "III: Encounter Data Report",
            path: "/mcpar/plan-level-indicators/encounter-data-report",
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
                    to: "/mcpar/program-information/add-plans",
                  },
                },
              ],
            },
            drawerForm: {
              id: "dedr",
              fields: undefined,
            },
          },
        ],
      },
    ];
    test("Basic Standard Form No Fields", async () => {
      jest.clearAllMocks();

      const testData = {};
      const formTemplate = {
        routes: [
          {
            name: "A: Program Information",
            path: "/mcpar/program-information",
            children: [
              {
                name: "Point of Contact",
                path: "/mcpar/program-information/point-of-contact",
                pageType: "standard",
                form: { fields: [] },
              },
            ],
          },
        ],
      };
      const result = await calculateCompletionStatus(testData, formTemplate);
      expect(result).toStrictEqual({
        "/mcpar/program-information": {
          "/mcpar/program-information/point-of-contact": false,
        },
      });
    });

    test("Basic Standard Form With Fields", async () => {
      jest.clearAllMocks();

      const testData = {};
      const formTemplate = {
        routes: [
          {
            name: "A: Program Information",
            path: "/mcpar/program-information",
            children: [
              {
                name: "Point of Contact",
                path: "/mcpar/program-information/point-of-contact",
                pageType: "standard",
                form: {
                  fields: [
                    {
                      id: "stateName",
                      type: "text",
                      validation: "text",
                      props: {
                        label: "A.1 State name",
                        hint: "Auto-populated from your account profile.",
                        disabled: true,
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };
      const result = await calculateCompletionStatus(testData, formTemplate);
      expect(result).toStrictEqual({
        "/mcpar/program-information": {
          "/mcpar/program-information/point-of-contact": false,
        },
      });
    });

    test("Null routes does not cause an exception", async () => {
      const result = await calculateCompletionStatus({}, {});
      expect(result).toMatchObject({});
    });

    test("Missing entities does not cause an exception", async () => {
      const result = await calculateCompletionStatus(
        {},
        { routes: entitiesRoutes }
      );
      expect(result).toMatchObject({});
    });
    test("Incomplete entities does not cause an exception", async () => {
      const result = await calculateCompletionStatus(
        {},
        { entities: {}, routes: entitiesRoutes }
      );
      expect(result).toMatchObject({});
    });

    test("Missing nested fields does not cause an exception", async () => {
      const result = await calculateCompletionStatus(
        {
          plans: [
            {
              id: "cd432-070f-0b5b-4cfb-73c12e6f45",
              name: "Dynamic Fill",
            },
          ],
        },
        { entities: { plans: { required: true } }, routes: entitiesRoutes }
      );
      expect(result).toMatchObject({});
    });

    test("Nested fields can be validated recursively", async () => {
      const fieldData = {
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
            path: "mock/path",
            pageType: "standard",
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

      const result = await calculateCompletionStatus(fieldData, formTemplate);

      // because completionSchemas.email rejects the string "not-an-email"
      expect(result).toEqual({ "mock/path": false });
    });

    test("An entity step with overlay modals is complete if all parts are complete", async () => {
      const fieldData = {
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
            path: "mock/path",
            pageType: "modalOverlay",
            entityType: "mockEntityType",
            entitySteps: [
              {
                pageType: "overlayModal",
                stepType: "mockStepType",
              },
            ],
            modalForm: {},
          },
        ],
        validationJson: {},
      };

      const result = await calculateCompletionStatus(fieldData, formTemplate);

      expect(result).toEqual({
        "mock/path": true,
      });
    });

    test("An entity step within a dynamic modal overlay is complete if all parts are complete", async () => {
      const fieldData = {
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
            path: "mock/path",
            pageType: "dynamicModalOverlay",
            entityType: "mockEntityType",
            initiatives: [
              {
                entitySteps: [
                  {
                    pageType: "overlayModal",
                    stepType: "mockStepType",
                  },
                ],
              },
            ],
          },
        ],
        validationJson: {},
      };

      const result = await calculateCompletionStatus(fieldData, formTemplate);

      expect(result).toEqual({
        "mock/path": true,
      });
    });
  });

  test("An entity step with overlay modals is incomplete if any parts are incomplete", async () => {
    const fieldData = {
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
          path: "mock/path",
          pageType: "modalOverlay",
          entityType: "mockEntityType",
          entitySteps: [
            {
              pageType: "overlayModal",
              stepType: "mockStepType",
            },
          ],
          modalForm: {},
        },
      ],
      validationJson: {},
    };

    const result = await calculateCompletionStatus(fieldData, formTemplate);

    expect(result).toEqual({
      "mock/path": false,
    });
  });

  test("An entity with steps can be marked complete with normal validation", async () => {
    const fieldData = {
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
          path: "mock/path",
          pageType: "modalOverlay",
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

    const result = await calculateCompletionStatus(fieldData, formTemplate);

    expect(result).toEqual({
      "mock/path": true,
    });
  });

  test("An entity with steps can be marked incomplete with normal validation", async () => {
    const fieldData = {
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
          path: "mock/path",
          pageType: "modalOverlay",
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

    const result = await calculateCompletionStatus(fieldData, formTemplate);

    expect(result).toEqual({
      "mock/path": false,
    });
  });

  const targetPopulationFieldDataOneYes = {
    targetPopulations: [
      {
        id: "2Vd02CVUtKgBETwqzDXpSIhi",
        transitionBenchmarks_targetPopulationName: "Older adults",
        isRequired: true,
        transitionBenchmarks_applicableToMfpDemonstration: [
          {
            key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v", // pragma: allowlist-secret
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
            key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v", // pragma: allowlist-secret
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
            key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v", // pragma: allowlist-secret
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
            key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIuHjl15upf6tLcgcWd", // pragma: allowlist-secret
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
        pageType: "modalDrawer",
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
              type: "text",
              validation: "text",
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
                        id: "quarterlyProjections",
                        type: "number",
                        validation: {
                          type: "validInteger",
                          parentFieldName:
                            "transitionBenchmarks_applicableToMfpDemonstration",
                          parentOptionId:
                            "transitionBenchmarks_applicableToMfpDemonstration-2UObIuHjl15upf6tLcgcWd", // pragma: allowlist-secret
                          nested: true,
                        },
                        transformation: {
                          rule: "nextTwelveQuarters",
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
      transitionBenchmarks_targetPopulationName: "text",
      transitionBenchmarks_applicableToMfpDemonstration: "radio",
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
    const targetPopulationsAllNo: any[] = new Array(
      targetPopulationFieldDataOneYes.targetPopulations
    );
    // last item is a yes. pop and replace with no.
    targetPopulationsAllNo[3] = {
      id: "2Vd02J1FHl3Ka1DbtU5FMSDh",
      transitionBenchmarks_targetPopulationName:
        "Individuals with mental health and substance use disorders (MH/SUD)",
      transitionBenchmarks_targetPopulationName_short: "MH/SUD",
      isRequired: true,
      transitionBenchmarks_applicableToMfpDemonstration: [
        {
          key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v", // pragma: allowlist-secret
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
