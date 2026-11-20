import {
  mockDynamicFieldId,
  mockStandardReportPageJson,
  mockTransitionBenchmarks,
} from "utils/testing/mockForm";
import { fillWorkPlanPage } from "./wp";
import { mockReportFieldData } from "utils/testing/mockReport";

describe("Test dev wp functions", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "crypto", {
      value: {
        randomUUID: vi.fn(() => mockDynamicFieldId),
      },
    });
  });
  test("Test fillWorkPlanPage", () => {
    const newFieldData = fillWorkPlanPage(mockStandardReportPageJson, {});
    expect(newFieldData).toEqual({
      "mock-text-field": "mock text",
      "mock-date-field": "02/02/2026",
      "mock-number-field": 1234,
    });
  });
  test("Test fillWorkPlanPage returns original fieldData if no form", () => {
    const newFieldData = fillWorkPlanPage(
      {
        name: "mock-name",
        path: "mock-path",
      },
      {}
    );
    expect(newFieldData).toEqual({});
  });
  test("Test fillWorkPlanPage for transition benchmark", () => {
    const newFieldData = fillWorkPlanPage(mockTransitionBenchmarks as any, {
      targetPopulations: [{}],
    });
    expect(newFieldData).toEqual({
      targetPopulations: [
        {
          "choice-child-1": "1",
          "mock-field-1": [
            {
              key: "mock-field-1-choice-2",
              value: "Yes",
            },
          ],
        },
      ],
    });
  });
  test("Test fillWorkPlanPage for initiative", () => {
    const newFieldData = fillWorkPlanPage(
      {
        name: "mock-init",
        path: "initiatives",
        overlayForm: {
          fields: [
            {
              id: "overlay-1",
              type: "text",
            },
          ],
        },
        modalForm: {
          fields: [
            {
              id: "initiative_wpTopic",
              props: {
                choices: [{ id: "mock-topic-1", label: "mock topic 1*" }],
              },
            },
          ],
        },
      } as any,
      mockReportFieldData
    );
    expect(newFieldData).toEqual({
      initiative: [
        {
          id: "mock-initiative-id",
          name: "mock-name",
          type: "initiative",
          mockObjectiveProgress: [
            {
              id: "mock-objective-1",
              objectiveProgress_description: "2",
              objectiveProgress_objectiveName: "mock-objective-name-1",
              objectiveProgress_targets: "3",
              objectiveTargets_projections_2024Q1: "1",
            },
            {
              id: "mock-objective-2",
              objectiveProgress_description: "0",
              objectiveProgress_objectiveName: "mock-objective-name-2",
              objectiveProgress_targets: "9",
              objectiveTargets_projections_2024Q1: "8",
            },
          ],
        },
        {
          id: mockDynamicFieldId,
          initiative_name: "mock topic 1*",
          initiative_wpTopic: [
            {
              key: "initiative_wpTopic-mock-topic-1",
              value: "mock topic 1*",
            },
          ],
          type: "initiative",
          "overlay-1": "mock text",
          defineInitiative_expectedStartDate_value: "02/02/2022",
          defineInitiative_targetPopulations: [],
        },
      ],
    });
  });
});
