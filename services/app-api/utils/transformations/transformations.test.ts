import { mockDynamicModalOverlayForm } from "../testing/setupJest";
import {
  AnyObject,
  DynamicModalOverlayReportPageShape,
  ReportJson,
  ReportRoute,
} from "../types";
import {
  iterateAllForms,
  runSARTransformations,
  transformFormTemplate,
} from "./transformations";

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

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
          label: "Number of pop A",
        },
        {
          isRequired: false,
          transitionBenchmarks_targetPopulationName: "popB",
          label: "Other: pop B",
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

  it("should generate funding sources from wp", () => {
    const formTemplate = {
      routes: [
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
    } as ReportJson;
    const fieldData = {
      initiative: [
        {
          fundingSources: [
            {
              id: "55b674-ce4-f10-d575-4a11c820268",
              fundingSources_wpTopic: [
                {
                  key: "fundingSources_wpTopic-2VLpZ9A92OivbZhKvY8pE4",
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

    const fields = formTemplate.routes[0].form?.fields;
    expect(fields).toHaveLength(5);
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
          type: "initiative",
          initiative_name: "first",
          initiative_wpTopic: [
            {
              key: "initiative_wpTopic-VjQ0OFqior9Dxu5RRNiZ5u",
              value: "Transitions and transition coordination services ",
            },
          ],
          evaluationPlan: [
            {
              id: "evaluationPlan123",
            },
          ],
        },
      ],
    };
    const route = mockDynamicModalOverlayForm;

    runSARTransformations(route, fieldData);
  });
});
