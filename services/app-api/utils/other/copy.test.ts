import { copyFieldDataFromSource } from "./copy";
import { getReportFieldData } from "../../storage/reports";
import {
  ReportJson,
  ReportRoute,
  FormField,
  PageTypes,
  ReportType,
  ValidationType,
} from "../types";
import * as LD from "@launchdarkly/node-server-sdk";

jest.mock("@launchdarkly/node-server-sdk", () => ({
  init: jest.fn(),
}));
const waitForInitialization = jest.fn().mockResolvedValue(undefined);
const variation = jest.fn().mockResolvedValue(false);

jest.mock("../../storage/reports", () => ({
  getReportFieldData: jest.fn(),
}));

const consoleSpy: {
  log: jest.SpyInstance<void>;
} = {
  log: jest.spyOn(console, "log").mockImplementation(),
};

describe("Field data copy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.launchDarklyServer = "mock-sdk-key";

    (LD.init as jest.Mock).mockReturnValue({
      variation,
      waitForInitialization,
    });
  });

  test("Should copy validated fields", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockFieldId: "42",
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "mockFieldId",
                validation: ValidationType.NUMBER,
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockFieldId: "42",
    });
  });

  // TODO: Investigate this comment
  test("Should overwrite populated fields, apparently", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockFieldId: "42",
    });
    const fieldData = {
      mockFieldId: "255",
    };
    const formTemplate = {
      routes: [
        {
          form: {
            fields: [
              {
                id: "mockFieldId",
                validation: ValidationType.NUMBER,
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockFieldId: "42",
    });
  });

  test("Should not copy fields with no validation", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockFieldId: "42",
    });
    const fieldData = {};
    const formTemplate = {
      routes: [] as ReportRoute[],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({});
  });

  test("Should not copy entities with no validated fields", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [] as ReportRoute[],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({});
  });

  test("Should copy validated fields within entities", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
          defineInitiative_mockId: "mock",
          evaluationPlan: [
            {
              id: "mockEvaluationPlan",
            },
          ],
          fundingSources: [
            {
              id: "mockFundingSource",
            },
          ],
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: PageTypes.MODAL_DRAWER,
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              {
                id: "mockFieldId",
                validation: ValidationType.NUMBER,
              },
              {
                id: "defineInitiative_mockId",
                validation: ValidationType.TEXT,
              },
              {
                id: "evaluationPlan",
                validation: ValidationType.NUMBER,
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockEntityType: [
        expect.objectContaining({
          mockFieldId: "42",
        }),
      ],
    });
  });

  test("Should copy special fields within entities", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mock_name_field: "mock name", // key includes the string "name"
          key: "mock key",
          value: "mock value",
          id: "mock id",
          type: "mock type",
          isRequired: "mock is required",
          isInitiativeClosed: false,
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: PageTypes.MODAL_DRAWER,
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              /* no validated fields, so anything copied is special */
            ] as FormField[],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockEntityType: [
        {
          mock_name_field: "mock name",
          key: "mock key",
          value: "mock value",
          id: "mock id",
          type: "mock type",
          isRequired: "mock is required",
          isInitiativeClosed: false,
          isCopied: true,
        },
      ],
    });
  });

  test("Should not copy closed initiatives", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
          isInitiativeClosed: true,
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: PageTypes.MODAL_DRAWER,
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              {
                id: "mockFieldId",
                validation: ValidationType.NUMBER,
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    // TODO: Investigate this comment
    // I think this is a bug actually. Probably it should not copy this entity.
    expect(copiedData).toEqual({ mockEntityType: [] });
  });

  test("Should wipe the entire entity if no fields are being copied", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: PageTypes.MODAL_DRAWER,
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              /* no validated fields, therefore no copied fields */
            ] as FormField[],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({});
  });

  test("Should prune entity steps", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockSteps: [
            {
              mockFieldId: "42",
              mockExtraField: "not validated and thus not copied",
            },
          ],
        },
      ],
    });
    const fieldData = {};
    const formTemplate = {
      routes: [
        {
          pageType: PageTypes.MODAL_DRAWER,
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              {
                id: "mockFieldId",
                validation: ValidationType.NUMBER,
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const copiedData = await copyFieldDataFromSource(
      "CO",
      "mock-source-id",
      formTemplate,
      fieldData
    );

    expect(copiedData).toEqual({
      mockEntityType: [
        {
          mockSteps: [
            {
              mockFieldId: "42",
              isCopied: true,
            },
          ],
          isCopied: true,
        },
      ],
    });
  });

  describe("Financial report exclusions", () => {
    const runFinancialCopyCase = async (
      sourceFieldData: Record<string, any>,
      expected: Record<string, any>,
      fieldIds: string[]
    ) => {
      (getReportFieldData as jest.Mock).mockResolvedValueOnce(sourceFieldData);

      const formTemplate = {
        type: ReportType.FINANCIAL_REPORT,
        routes: [
          {
            form: {
              fields: fieldIds.map((id) => ({ id, validation: "text" })),
            },
          },
        ],
      } as ReportJson;

      const copiedData = await copyFieldDataFromSource(
        "CO",
        "mock-source-id",
        formTemplate,
        {}
      );

      expect(copiedData).toEqual(expected);
    };

    test("excludes state/territory and submission fields", async () => {
      await runFinancialCopyCase(
        {
          stateName: "CO",
          stateOrTerritory: "CO",
          submissionCount: "3",
          fmap_qualifiedHcbsPercentage: "75",
        },
        {
          fmap_qualifiedHcbsPercentage: "75",
        },
        ["fmap_qualifiedHcbsPercentage"]
      );
    });

    test("excludes computed totals, top-level overrides, and narrative fields", async () => {
      await runFinancialCopyCase(
        {
          fmap_qualifiedHcbsPercentage: "75",
          supplementalServices_narrative: "should not copy",
          administrativeCosts_narrative: "should not copy",
          qualifiedHcbs_comments: "should copy",
          "administrativeCosts_capacityBuilding_capacityBuilding-percentageOverride":
            "80",
          "administrativeCosts_budgetCategory_personnel-percentageOverride":
            "90",
          supplementalServices_category_otherCategories: [
            {
              category: "Other service",
              totalComputable: "33",
              totalStateTerritoryShare: "0",
              totalFederalShare: "33",
            },
          ],
        },
        {
          fmap_qualifiedHcbsPercentage: "75",
          qualifiedHcbs_comments: "should copy",
          supplementalServices_category_otherCategories: [
            {
              category: "Other service",
              isCopied: true,
            },
          ],
        },
        [
          "fmap_qualifiedHcbsPercentage",
          "supplementalServices_narrative",
          "administrativeCosts_narrative",
          "qualifiedHcbs_comments",
          "administrativeCosts_capacityBuilding_capacityBuilding-percentageOverride",
          "administrativeCosts_budgetCategory_personnel-percentageOverride",
          "supplementalServices_category_otherCategories",
        ]
      );
    });

    test.each([
      {
        name: "miscellaneous costs",
        sourceFieldData: {
          administrativeCosts_budgetCategory_miscellaneousCosts: [
            {
              category: "Other admin",
              totalComputable: "40",
              percentageOverride: "80",
              totalStateTerritoryShare: "8",
              totalFederalShare: "32",
            },
          ],
        },
        expected: {
          administrativeCosts_budgetCategory_miscellaneousCosts: [
            {
              category: "Other admin",
              isCopied: true,
            },
          ],
        },
      },
      {
        name: "subrecipients",
        sourceFieldData: {
          administrativeCosts_subRecipients_subRecipients: [
            {
              name: "Vendor A",
              description: "Statement of work",
              totalComputable: "50",
              percentageOverride: "90",
              totalStateTerritoryShare: "5",
              totalFederalShare: "45",
            },
          ],
        },
        expected: {
          administrativeCosts_subRecipients_subRecipients: [
            {
              name: "Vendor A",
              description: "Statement of work",
              isCopied: true,
            },
          ],
        },
      },
      {
        name: "personnel positions",
        sourceFieldData: {
          administrativeCosts_personnel_positions: [
            {
              title: "Project director",
              budgetedFullTimeEmployees: "2",
              filledFullTimeEmployees: "1",
            },
          ],
        },
        expected: {
          administrativeCosts_personnel_positions: [
            {
              title: "Project director",
              isCopied: true,
            },
          ],
        },
      },
    ])(
      "excludes entity-only fields for $name",
      async ({ sourceFieldData, expected }) => {
        const fieldId = Object.keys(sourceFieldData)[0];
        await runFinancialCopyCase(sourceFieldData, expected, [fieldId]);
      }
    );
  });

  describe("Copy initiative", () => {
    const formTemplate = {
      type: ReportType.WP,
      routes: [
        {
          pageType: PageTypes.MODAL_DRAWER,
          entityType: "mockEntityType",
          drawerForm: {
            fields: [
              {
                id: "mockFieldId",
                validation: ValidationType.NUMBER,
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const mockInitiative = {
      mockEntityType: [
        {
          mockSteps: [
            {
              mockFieldId: "mockStepId",
              initiative_name: "Mock initiative name",
              initiative_wpTopic: [
                {
                  key: "mockId",
                  value: "Mock topic",
                },
              ],
              defineInitiative_mock: "Mock description",
            },
          ],
          evaluationPlan: [
            {
              id: "mockEvaluationPlanId",
              value: "Mock value",
            },
          ],
          fundingSources: [
            {
              id: "mockFundingSourceId",
              value: "Mock value",
            },
          ],
        },
      ],
    };

    test("copy entire initiative with flag off", async () => {
      (getReportFieldData as jest.Mock).mockResolvedValueOnce(mockInitiative);
      const copiedData = await copyFieldDataFromSource(
        "CO",
        "mock-source-id",
        formTemplate,
        {}
      );
      expect(consoleSpy.log).toHaveBeenCalled();
      expect(copiedData).toEqual({
        mockEntityType: [
          {
            mockSteps: [
              {
                mockFieldId: "mockStepId",
                initiative_name: "Mock initiative name",
                initiative_wpTopic: [
                  {
                    key: "mockId",
                    value: "Mock topic",
                    isCopied: true,
                  },
                ],
                defineInitiative_mock: "Mock description",
                isCopied: true,
              },
            ],
            evaluationPlan: [
              {
                id: "mockEvaluationPlanId",
                value: "Mock value",
                isCopied: true,
              },
            ],
            fundingSources: [
              {
                id: "mockFundingSourceId",
                value: "Mock value",
                isCopied: true,
              },
            ],
            isCopied: true,
          },
        ],
      });
    });

    test("copy only initiative name and topic with flag on", async () => {
      (LD.init as jest.Mock).mockReturnValue({
        variation: jest.fn().mockResolvedValue(true),
        waitForInitialization,
      });
      (getReportFieldData as jest.Mock).mockResolvedValueOnce(mockInitiative);
      const copiedData = await copyFieldDataFromSource(
        "CO",
        "mock-source-id",
        formTemplate,
        {}
      );
      expect(consoleSpy.log).toHaveBeenCalled();
      expect(copiedData).toEqual({
        mockEntityType: [
          {
            mockSteps: [
              {
                mockFieldId: "mockStepId",
                initiative_name: "Mock initiative name",
                initiative_wpTopic: [
                  {
                    key: "mockId",
                    value: "Mock topic",
                    isCopied: true,
                  },
                ],
                isCopied: true,
              },
            ],
            isCopied: true,
          },
        ],
      });
    });
  });
});
