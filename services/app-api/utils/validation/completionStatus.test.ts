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
});
