import {
  mockDynamicModalOverlayForm,
  mockFormField,
  mockNumberField,
  mockVerbiageIntro,
} from "../testing/setupJest";
import {
  AnyObject,
  DynamicModalOverlayReportPageShape,
  ModalOverlayReportPageVerbiage,
  ReportJson,
  ReportRoute,
  WorkPlanFieldDataForTransforms,
} from "../types";
import {
  extractWorkPlanData,
  iterateAllForms,
  runSARTransformations,
  transformFormTemplate,
} from "./transformations";

describe("transformFormTemplate", () => {
  it("should remove showOnlyInPeriod2 routes in period 1", () => {
    const formTemplate = {
      routes: [
        {
          conditionallyRender: "showOnlyInPeriod2",
        },
      ],
    } as ReportJson;
    const reportPeriod = 1;
    const reportYear = 2023;

    transformFormTemplate(formTemplate, reportPeriod, reportYear);

    expect(formTemplate.routes).toHaveLength(0);
  });

  it("should keep showOnlyInPeriod2 routes in period 2", () => {
    const formTemplate = {
      routes: [
        {
          conditionallyRender: "showOnlyInPeriod2",
        },
      ],
    } as ReportJson;
    const reportPeriod = 2;
    const reportYear = 2023;

    transformFormTemplate(formTemplate, reportPeriod, reportYear);

    expect(formTemplate.routes).toHaveLength(1);
  });

  it("should throw for unrecognized route conditions", () => {
    const formTemplate = {
      routes: [
        {
          conditionallyRender: "fake condition",
        },
      ],
    } as ReportJson;
    const reportPeriod = 3;
    const reportYear = 1;

    expect(() =>
      transformFormTemplate(formTemplate, reportPeriod, reportYear)
    ).toThrow("not implemented");
  });

  it("should supply content for firstQuarterOfThePeriod fields", () => {
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "field1",
                type: "sectionHeader",
                transformation: {
                  rule: "firstQuarterOfThePeriod",
                },
              },
            ],
          },
        },
      ],
    } as ReportJson;
    const reportPeriod = 1;
    const reportYear = 2023;

    transformFormTemplate(formTemplate, reportPeriod, reportYear);

    expect(formTemplate.routes?.[0].form?.fields[0]).toEqual({
      id: "field1",
      type: "sectionHeader",
      props: {
        content: "First quarter (January 1 - March 31)",
      },
    });
  });

  it("should supply content for secondQuarterOfThePeriod fields", () => {
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "field1",
                type: "sectionHeader",
                transformation: {
                  rule: "secondQuarterOfThePeriod",
                },
              },
            ],
          },
        },
      ],
    } as ReportJson;
    const reportPeriod = 1;
    const reportYear = 2023;

    transformFormTemplate(formTemplate, reportPeriod, reportYear);

    expect(formTemplate.routes?.[0].form?.fields[0]).toEqual({
      id: "field1",
      type: "sectionHeader",
      props: {
        content: "Second quarter (April 1 - June 30)",
      },
    });
  });

  it("should generate 12 fields for nextTwelveQuarters", () => {
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "field1",
                type: "text",
                transformation: {
                  rule: "nextTwelveQuarters",
                },
              },
            ],
          },
        },
      ],
    } as ReportJson;
    const reportYear = 2024;
    const reportPeriod = 1;

    transformFormTemplate(formTemplate, reportPeriod, reportYear);

    const transformedFields = formTemplate.routes[0].form?.fields;
    expect(transformedFields).toHaveLength(12);
    expect(transformedFields?.at(0)).toEqual({
      id: "field12024Q1",
      type: "text",
      props: {
        label: "2024 Q1",
      },
    });
    expect(transformedFields?.at(-1)).toEqual({
      id: "field12026Q4",
      type: "text",
      props: {
        label: "2026 Q4",
      },
    });
  });

  it("should require reportPeriod and targetPopulations for targetPopulations fields", () => {
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "field1",
                type: "text",
                transformation: {
                  rule: "targetPopulations",
                },
              },
            ],
          },
        },
      ],
    } as ReportJson;
    let fieldData = {
      _targetPopulationsFromWP: [],
    } as AnyObject;

    const reportPeriod = 1;
    const reportYear = 2023;

    expect(() =>
      transformFormTemplate(formTemplate, reportPeriod, reportYear, fieldData)
    ).toThrow("requires targetPopulations");
  });

  it("should generate new fields for targetPopulations", () => {
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "field1",
                type: "text",
                transformation: {
                  rule: "targetPopulations",
                },
              },
            ],
          },
        },
      ],
    } as ReportJson;
    const fieldData = {
      targetPopulations: [
        {
          isRequired: true,
          transitionBenchmarks_targetPopulationName: "popA",
          transitionBenchmarks_applicableToMfpDemonstration: [
            {
              key: "",
              value: "Yes",
            },
          ],
        },
        {
          isRequired: false,
          transitionBenchmarks_targetPopulationName: "popB",
          transitionBenchmarks_applicableToMfpDemonstration: [
            {
              key: "",
              value: "Yes",
            },
          ],
        },
      ],
    };

    const reportPeriod = 1;
    const reportYear = 2023;

    transformFormTemplate(formTemplate, reportPeriod, reportYear, fieldData);

    const fields = formTemplate.routes[0].form?.fields;
    expect(fields).toHaveLength(2);
    expect(fields).toEqual([
      {
        id: "field1_Period1_popA",
        type: "text",
        props: {
          label: "Number of popA",
        },
      },
      {
        id: "field1_Period1_popB",
        type: "text",
        props: {
          label: "Other: popB",
        },
      },
    ]);
  });

  it("should exclude populations that are not applicable to MFP", () => {
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "field1",
                type: "text",
                transformation: {
                  rule: "targetPopulations",
                },
              },
            ],
          },
        },
      ],
    } as ReportJson;
    const fieldData = {
      targetPopulations: [
        {
          isRequired: true,
          transitionBenchmarks_targetPopulationName: "popA",
          transitionBenchmarks_applicableToMfpDemonstration: [
            {
              key: "",
              value: "Yes",
            },
          ],
        },
        {
          isRequired: false,
          transitionBenchmarks_targetPopulationName: "popB",
          transitionBenchmarks_applicableToMfpDemonstration: [
            {
              key: "",
              value: "No",
            },
          ],
        },
      ],
    };

    const reportPeriod = 1;
    const reportYear = 2023;

    transformFormTemplate(formTemplate, reportPeriod, reportYear, fieldData);

    const fields = formTemplate.routes[0].form?.fields;
    expect(fields).toHaveLength(1);
    expect(fields).toEqual([
      {
        id: "field1_Period1_popA",
        type: "text",
        props: {
          label: "Number of popA",
        },
      },
    ]);
  });

  it("should generate funding sources from wp", () => {
    const formTemplate = {
      routes: [
        {
          pageType: "dynamicModalOverlay",
          entityType: "",
          entityInfo: [""],
          verbiage: {} as ModalOverlayReportPageVerbiage,
          initiatives: [],
          name: "",
          path: "",
          template: {
            dashboard: {},
            entitySteps: [
              {
                form: {
                  fields: [
                    {
                      id: "field1",
                      type: "text",
                      transformation: {
                        rule: "fundingSources",
                      },
                    },
                  ],
                },
              },
            ],
          },
        } as DynamicModalOverlayReportPageShape,
      ],
    } as ReportJson;
    const fieldData = {
      initiative: [
        {
          id: "mock-initiative-id",
          initiative_name: "mock-initiative-name",
          initiative_wpTopic: [
            {
              key: "mock-initiative-wp-topic-key",
              value: "mock-initiative-wp-topic",
            },
          ],
          fundingSources: [
            {
              id: "55b674-ce4-f10-d575-4a11c820268",
              fundingSources_wpTopic: [
                {
                  key: "fundingSources_wpTopic-key",
                  value: "Capacity-building funds",
                },
              ],
              fundingSources_quarters2024Q1: "1.00",
              fundingSources_quarters2024Q2: "1.00",
              fundingSources_quarters2024Q3: "1.00",
              fundingSources_quarters2024Q4: "1.00",
              fundingSources_quarters2025Q1: "1.00",
              fundingSources_quarters2025Q2: "1.00",
              fundingSources_quarters2025Q3: "1.00",
              fundingSources_quarters2025Q4: "1.00",
              fundingSources_quarters2026Q1: "1.00",
              fundingSources_quarters2026Q2: "1.00",
              fundingSources_quarters2026Q3: "1.00",
              fundingSources_quarters2026Q4: "1.00",
              initiative_wp_otherTopic: "",
            },
          ],
        },
      ],
    };

    const reportPeriod = 1;
    const reportYear = 2023;

    transformFormTemplate(formTemplate, reportPeriod, reportYear, fieldData);

    const fields =
      formTemplate.routes[0]?.initiatives?.[0].entitySteps[0].form?.fields;
    expect(fields).toHaveLength(6);
  });

  it("should generate quantitative quarters (in objectives progress) from wp", () => {
    const formTemplate = {
      routes: [
        {
          pageType: "dynamicModalOverlay",
          entityType: "",
          entityInfo: [],
          verbiage: {} as ModalOverlayReportPageVerbiage,
          initiatives: [],
          name: "",
          path: "",
          template: {
            entitySteps: [
              {
                stepType: "objectiveProgress",
                objectiveCardTemplate: {
                  modalForm: {
                    fields: [
                      {
                        id: "field1",
                        type: "text",
                        transformation: {
                          rule: "quantitativeQuarters",
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        } as DynamicModalOverlayReportPageShape,
      ],
    } as ReportJson;
    const fieldData = {
      initiative: [
        {
          id: "mock-initiative-id",
          initiative_name: "mock-initiative-name",
          initiative_wpTopic: [
            {
              key: "mock-initiative-wp-topic-key",
              value: "mock-initiative-wp-topic",
            },
          ],
          evaluationPlan: [
            {
              id: "epA",
              objectiveProgress_additionalDetails: "2",
              objectiveProgress_description: "2",
              evaluationPlan_includesTargets: [
                {
                  key: "evaluationPlan_includesTargets-a",
                  value: "Yes",
                },
              ],
              objectiveProgress_objectiveName: "w",
              objectiveProgress_targets: "3",
              objectiveTargets_projections_2024Q1: "1",
              objectiveTargets_projections_2024Q2: "2",
            },
          ],
          fundingSources: [],
        },
      ],
    };

    const reportPeriod = 1;
    const reportYear = 2023;

    transformFormTemplate(formTemplate, reportPeriod, reportYear, fieldData);

    const fields =
      formTemplate.routes[0]?.initiatives?.[0].entitySteps[0]
        .objectiveCards?.[0].modalForm?.fields;
    expect(fields).toHaveLength(6);
  });

  it("should throw for unrecognized transformations", () => {
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                transformation: {
                  rule: "mock rule",
                },
              },
            ],
          },
        },
      ],
    } as ReportJson;
    const fieldData = {};
    const reportPeriod = 1;
    const reportYear = 2023;

    expect(() =>
      transformFormTemplate(formTemplate, reportPeriod, reportYear, fieldData)
    ).toThrow("not implemented");
  });

  it("should throw error if there are no initiatives", () => {
    const fieldData = {};

    const route: DynamicModalOverlayReportPageShape = {
      entityType: "",
      entityInfo: [],
      pageType: "dynamicModalOverlay",
      verbiage: {
        addEntityButtonText: "",
        dashboardTitle: "",
        countEntitiesInTitle: false,
        tableHeader: "",
        addEditModalHint: "",
        emptyDashboardText: "",
        intro: {
          section: "",
        },
      },
      initiatives: [],
      name: "",
      path: "",
    };

    expect(() => runSARTransformations(route, fieldData)).toThrow(
      "Not implemented yet - Workplan must have initiatives that the SAR can build from"
    );
  });
});

describe("iterateAllForms", () => {
  it("should find forms of all types, in child routes and entity steps", () => {
    const formTemplate = {
      routes: [
        {
          form: {
            id: "standard, top level",
          },
          modalForm: {
            id: "modal, top level",
          },
        },
        {
          children: [
            {
              drawerForm: {
                id: "drawer in child",
              },
            },
            {
              children: [
                {
                  form: {
                    id: "standard in nested child",
                  },
                },
              ],
            },
            {
              entitySteps: [
                {
                  modalForm: {
                    id: "modal in entity steps",
                  },
                },
              ],
            },
          ],
        },
        {
          initiatives: [
            {
              entitySteps: [
                {
                  form: {
                    id: "form in initiatives",
                  },
                },
              ],
            },
          ],
        },
      ] as ReportRoute[],
    };

    const expectedFormIds = [
      "standard, top level",
      "modal, top level",
      "drawer in child",
      "standard in nested child",
      "modal in entity steps",
      "form in initiatives",
    ];

    let i = 0;
    for (let form of iterateAllForms(formTemplate.routes)) {
      expect(form.id).toBe(expectedFormIds[i]);
      i += 1;
    }
  });
});

describe("SAR transformations", () => {
  it("should generate the correct dynamic fields associated with entity step type", () => {
    const fieldData = {
      initiative: [
        {
          id: "initiative123",
          initiative_name: "first",
          initiative_wpTopic: [
            {
              key: "initTopic_wp",
              value: "Transitions and transition coordination services",
            },
          ],
        },
      ],
    } as WorkPlanFieldDataForTransforms;
    const route = mockDynamicModalOverlayForm;

    expect(runSARTransformations(route, fieldData)).toEqual({
      ...mockDynamicModalOverlayForm,
      initiatives: [
        {
          initiativeId: "initiative123",
          name: "first",
          topic: "Transitions and transition coordination services",
          dashboard: {
            name: "mock dashboard",
            mockVerbiageIntro,
          },
          entitySteps: [
            {
              stepName: "mock entity 1 1",
              form: {
                id: "mock-form-id",
                initiativeId: "initiative123",
                fields: [mockFormField, mockNumberField],
              },
            },
          ],
        },
      ],
    });
  });
});

describe("extractWorkPlanData", () => {
  it("Should move fundingSource and evaluationPlan data from the WP out to where the SAR can see it", () => {
    const sarFieldData = {
      initiative: [
        {
          fundingSources: [
            {
              id: "fsA",
              fundingSources_quarters2024Q1: "50",
              fundingSources_quarters2024Q2: "60",
            },
            {
              id: "fsB",
              fundingSources_quarters2024Q1: "70",
              fundingSources_quarters2024Q2: "80",
            },
          ],
          evaluationPlan: [
            {
              id: "epA",
              evaluationPlan_objectiveName: "w",
              evaluationPlan_description: "2",
              evaluationPlan_targets: "3",
              evaluationPlan_includesTargets: [
                {
                  key: "evaluationPlan_includesTargets-a",
                  value: "Yes",
                },
              ],
              evaluationPlan_additionalDetails: "2",
              quarterlyProjections2024Q1: "1",
              quarterlyProjections2024Q2: "2",
            },
            {
              id: "epB",
              evaluationPlan_objectiveName: "B",
              evaluationPlan_description: "description",
              evaluationPlan_targets: "targets",
              evaluationPlan_includesTargets: [
                {
                  key: "evaluationPlan_includesTargets-a",
                  value: "Yes",
                },
              ],
              evaluationPlan_additionalDetails: "dasda",
              quarterlyProjections2024Q1: "9",
              quarterlyProjections2024Q2: "8",
            },
          ],
        },
      ],
    };
    const reportYear = 2024;
    const reportPeriod = 1;

    extractWorkPlanData(sarFieldData, reportYear, reportPeriod);

    const initiative = sarFieldData.initiative[0];
    expect(initiative).toEqual({
      fundingSources: [
        {
          id: "fsA",
          fundingSources_quarters2024Q1: "50",
          fundingSources_quarters2024Q2: "60",
        },
        {
          id: "fsB",
          fundingSources_quarters2024Q1: "70",
          fundingSources_quarters2024Q2: "80",
        },
      ],
      fundingSources_projected_2024Q1_fsA: "50",
      fundingSources_projected_2024Q2_fsA: "60",
      fundingSources_projected_2024Q1_fsB: "70",
      fundingSources_projected_2024Q2_fsB: "80",
      evaluationPlan: [
        {
          id: "epA",
          evaluationPlan_objectiveName: "w",
          evaluationPlan_description: "2",
          evaluationPlan_targets: "3",
          evaluationPlan_includesTargets: [
            {
              key: "evaluationPlan_includesTargets-a",
              value: "Yes",
            },
          ],
          evaluationPlan_additionalDetails: "2",
          quarterlyProjections2024Q1: "1",
          quarterlyProjections2024Q2: "2",
        },
        {
          id: "epB",
          evaluationPlan_objectiveName: "B",
          evaluationPlan_description: "description",
          evaluationPlan_targets: "targets",
          evaluationPlan_includesTargets: [
            {
              key: "evaluationPlan_includesTargets-a",
              value: "Yes",
            },
          ],
          evaluationPlan_additionalDetails: "dasda",
          quarterlyProjections2024Q1: "9",
          quarterlyProjections2024Q2: "8",
        },
      ],
      objectiveProgress: [
        {
          id: "epA",
          objectiveProgress_additionalDetails: "2",
          objectiveProgress_description: "2",
          objectiveProgress_includesTargets: [
            {
              key: "evaluationPlan_includesTargets-a",
              value: "Yes",
            },
          ],
          objectiveProgress_objectiveName: "w",
          objectiveProgress_targets: "3",
          objectiveTargets_projections_2024Q1: "1",
          objectiveTargets_projections_2024Q2: "2",
        },
        {
          id: "epB",
          objectiveProgress_additionalDetails: "dasda",
          objectiveProgress_description: "description",
          objectiveProgress_includesTargets: [
            {
              key: "evaluationPlan_includesTargets-a",
              value: "Yes",
            },
          ],
          objectiveProgress_objectiveName: "B",
          objectiveProgress_targets: "targets",
          objectiveTargets_projections_2024Q1: "9",
          objectiveTargets_projections_2024Q2: "8",
        },
      ],
    });
  });
});
