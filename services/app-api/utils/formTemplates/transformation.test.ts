import { AnyObject, ReportJson } from "../types";
import { transformFormTemplate } from "./transformation";

describe("transformFormTemplate", () => {
  it("should reject reports with invalid shapes", () => {
    function transformWith(fieldData: any) {
      return function () {
        const formTemplate = {} as ReportJson;
        transformFormTemplate(formTemplate, fieldData);
      };
    }

    const message = "Report data is not valid";
    // Empty object is OK
    expect(transformWith({})).not.toThrow();

    // reportYear must be a number
    expect(transformWith({ reportYear: 2024 })).not.toThrow();
    expect(transformWith({ reportYear: "2024" })).toThrow(message);

    // reportPeriod must be a number; 1 or 2
    expect(transformWith({ reportPeriod: 1 })).not.toThrow();
    expect(transformWith({ reportPeriod: "1" })).toThrow(message);
    expect(transformWith({ reportPeriod: 3 })).toThrow(message);

    // _targetPopulationsFromWP must be an array
    expect(
      transformWith({
        fieldData: {
          _targetPopulationsFromWP: [],
        },
      })
    ).not.toThrow();
    expect(
      transformWith({
        fieldData: {
          _targetPopulationsFromWP: false,
        },
      })
    ).toThrow(message);

    // Populations must have a name string and a label string
    expect(
      transformWith({
        fieldData: {
          _targetPopulationsFromWP: [
            {
              name: "my pop",
              label: "Other: my pop",
            },
          ],
        },
      })
    ).not.toThrow();
    expect(
      transformWith({
        fieldData: {
          _targetPopulationsFromWP: [
            {
              name: "my pop",
            },
          ],
        },
      })
    ).toThrow(message);
    expect(
      transformWith({
        fieldData: {
          _targetPopulationsFromWP: [
            {
              label: "Other: my pop",
            },
          ],
        },
      })
    ).toThrow(message);
    expect(
      transformWith({
        fieldData: {
          _targetPopulationsFromWP: [
            {
              name: {},
              label: "Other: my pop",
            },
          ],
        },
      })
    ).toThrow(message);
    expect(
      transformWith({
        fieldData: {
          _targetPopulationsFromWP: [
            {
              name: "my pop",
              label: [],
            },
          ],
        },
      })
    ).toThrow(message);
  });

  it("should not change form templates without routes", () => {
    const formTemplate = {} as ReportJson;
    const fieldData = {};

    transformFormTemplate(formTemplate, fieldData);

    expect(formTemplate).toEqual({});
  });

  it("should require reportPeriod when a route has showOnlyInPeriod2", () => {
    const formTemplate = {
      routes: [
        {
          conditionallyRender: "showOnlyInPeriod2",
        },
      ],
    } as ReportJson;
    const fieldData = {};

    expect(() => transformFormTemplate(formTemplate, fieldData)).toThrow(
      "requires a reportPeriod"
    );
  });

  it("should remove showOnlyInPeriod2 routes in period 1", () => {
    const formTemplate = {
      routes: [
        {
          conditionallyRender: "showOnlyInPeriod2",
        },
      ],
    } as ReportJson;
    const fieldData = {
      reportPeriod: 1,
    };

    transformFormTemplate(formTemplate, fieldData);

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
    const fieldData = {
      reportPeriod: 2,
    };

    transformFormTemplate(formTemplate, fieldData);

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
    const fieldData = {};

    expect(() => transformFormTemplate(formTemplate, fieldData)).toThrow(
      "not implemented"
    );
  });

  it("should require reportPeriod for firstQuarterOfThePeriod fields", () => {
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
    const fieldData = {};

    expect(() => transformFormTemplate(formTemplate, fieldData)).toThrow(
      "requires a reportPeriod"
    );
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
    const fieldData = {
      reportPeriod: 1,
    };

    transformFormTemplate(formTemplate, fieldData);

    expect(formTemplate.routes?.[0].form?.fields[0]).toEqual({
      id: "field1",
      type: "sectionHeader",
      props: {
        content: "First quarter (January 1 - March 31)",
      },
    });
  });

  it("should require reportPeriod for secondQuarterOfThePeriod fields", () => {
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
    const fieldData = {};

    expect(() => transformFormTemplate(formTemplate, fieldData)).toThrow(
      "requires a reportPeriod"
    );
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
    const fieldData = {
      reportPeriod: 1,
    };

    transformFormTemplate(formTemplate, fieldData);

    expect(formTemplate.routes?.[0].form?.fields[0]).toEqual({
      id: "field1",
      type: "sectionHeader",
      props: {
        content: "Second quarter (April 1 - June 30)",
      },
    });
  });

  it("should require reportYear and reportPeriod for nextTwelveQuarters fields", () => {
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
    let fieldData = {
      reportYear: 2024,
    } as AnyObject;

    expect(() => transformFormTemplate(formTemplate, fieldData)).toThrow(
      "requires a reportPeriod"
    );

    fieldData = {
      reportPeriod: 1,
    };

    expect(() => transformFormTemplate(formTemplate, fieldData)).toThrow(
      "requires a reportYear"
    );
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
    let fieldData = {
      reportYear: 2024,
      reportPeriod: 1,
    };

    transformFormTemplate(formTemplate, fieldData);

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

  it("should require reportPeriod and _targetPopulationsFromWP for targetPopulations fields", () => {
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

    expect(() => transformFormTemplate(formTemplate, fieldData)).toThrow(
      "requires a reportPeriod"
    );

    fieldData = {
      reportPeriod: 1,
    };

    expect(() => transformFormTemplate(formTemplate, fieldData)).toThrow(
      "requires targetPopulations"
    );
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
      reportPeriod: 1,
      fieldData: {
        _targetPopulationsFromWP: [
          {
            name: "popA",
            label: "Number of pop A",
          },
          {
            name: "popB",
            label: "Other: pop B",
          },
        ],
      },
    };

    transformFormTemplate(formTemplate, fieldData);

    const fields = formTemplate.routes[0].form?.fields;
    expect(fields).toHaveLength(2);
    expect(fields).toEqual([
      {
        id: "field1_Period1_popA",
        type: "text",
        props: {
          label: "Number of pop A",
        },
      },
      {
        id: "field1_Period1_popB",
        type: "text",
        props: {
          label: "Other: pop B",
        },
      },
    ]);
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

    expect(() => transformFormTemplate(formTemplate, fieldData)).toThrow(
      "not implemented"
    );
  });
});
