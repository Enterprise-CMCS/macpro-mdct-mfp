import { AnyObject, ReportJson } from "../types";
import { transformFormTemplate } from "./transformations";

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
});
