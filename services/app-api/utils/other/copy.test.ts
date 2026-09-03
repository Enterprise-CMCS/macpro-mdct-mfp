import { Mock } from "vitest";
import { copyFieldDataFromSource } from "./copy";
import { getReportFieldData } from "../../storage/reports";
import {
  ReportJson,
  ReportRoute,
  FormField,
  PageTypes,
  ReportType,
  ValidationType,
  EntityType,
} from "../types";
import * as LD from "@launchdarkly/node-server-sdk";

vi.mock("@launchdarkly/node-server-sdk", () => ({
  init: vi.fn(),
}));
const waitForInitialization = vi.fn().mockResolvedValue(undefined);
const variation = vi.fn().mockResolvedValue(false);

vi.mock("../../storage/reports", () => ({
  getReportFieldData: vi.fn(),
}));

describe("Field data copy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.launchDarklyServer = "mock-sdk-key";

    (LD.init as Mock).mockReturnValue({
      variation,
      waitForInitialization,
    });
  });

  test("Should copy validated fields", async () => {
    (getReportFieldData as Mock).mockResolvedValueOnce({
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
    (getReportFieldData as Mock).mockResolvedValueOnce({
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
    (getReportFieldData as Mock).mockResolvedValueOnce({
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
    (getReportFieldData as Mock).mockResolvedValueOnce({
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
    (getReportFieldData as Mock).mockResolvedValueOnce({
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
    (getReportFieldData as Mock).mockResolvedValueOnce({
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
    (getReportFieldData as Mock).mockResolvedValueOnce({
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

    // The closed entity is excluded, but the key survives as an empty array.
    // downstream consumers distinguish an empty array from an absent key.
    expect(copiedData).toEqual({ mockEntityType: [] });
  });

  test("Should not delete an unrelated top-level array when a nested array gets fully pruned", async () => {
    (getReportFieldData as Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
          nestedRows: [
            {
              undeclaredField: "not in the form template, gets pruned away",
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

    // The nested array is left as an empty array (no declared fields matched),
    // but must not contain null holes (e.g. [null]) from deleted entries.
    // Null holes cause the next copy of this report to lose the parent entity.
    expect(copiedData).toEqual({
      mockEntityType: [
        {
          mockFieldId: "42",
          isCopied: true,
          nestedRows: [],
        },
      ],
    });
    expect(JSON.stringify(copiedData)).not.toContain("null");
  });

  test("Should wipe a fully pruned entity rather than leaving an empty husk behind", async () => {
    // The first entity holds a nested array, so pruning it recurses. The
    // second has nothing worth copying and must disappear completely.
    (getReportFieldData as Mock).mockResolvedValueOnce({
      mockEntityType: [
        {
          mockFieldId: "42",
          nestedRows: [{ mockFieldId: "43" }],
        },
        {
          undeclaredField: "not in the form template",
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
          mockFieldId: "42",
          isCopied: true,
          nestedRows: [{ mockFieldId: "43", isCopied: true }],
        },
      ],
    });
  });

  test("Should wipe the entire entity if no fields are being copied", async () => {
    (getReportFieldData as Mock).mockResolvedValueOnce({
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

    expect(copiedData).toEqual({ mockEntityType: [] });
  });

  test("Should prune entity steps", async () => {
    (getReportFieldData as Mock).mockResolvedValueOnce({
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
      (getReportFieldData as Mock).mockResolvedValueOnce(sourceFieldData);

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
          entityType: EntityType.INITIATIVE,
          drawerForm: {
            fields: [
              {
                id: "defineInitiative_mockField",
                validation: ValidationType.TEXT,
              },
            ],
          },
        },
      ],
    } as ReportJson;

    describe("initiativeV1", () => {
      const mockInitiativeV1 = {
        initiative: [
          {
            id: "mockInitiativeId",
            initiative_name: "Mock Initiative",
            initiative_wp_otherTopic: "",
            initiative_wpTopic: [
              {
                key: "initiative_wpTopic-mockTopicId",
                value: "Mock topic",
              },
            ],
            type: EntityType.INITIATIVE,
            defineInitiative_mockField: "Mock description",
            evaluationPlan: [
              {
                id: "mockEvaluationPlanId",
              },
            ],
            fundingSources: [
              {
                id: "mockFundingSourceId",
              },
            ],
          },
        ],
      };

      test("copy entire initiative v1 with flag off", async () => {
        (LD.init as Mock).mockReturnValue({
          variation,
          waitForInitialization,
        });
        (getReportFieldData as Mock).mockResolvedValueOnce(mockInitiativeV1);
        const copiedData = await copyFieldDataFromSource(
          "CO",
          "mock-source-id",
          formTemplate,
          {}
        );
        expect(copiedData).toEqual({
          initiative: [
            {
              id: "mockInitiativeId",
              initiative_name: "Mock Initiative",
              initiative_wp_otherTopic: "",
              initiative_wpTopic: [
                {
                  key: "initiative_wpTopic-mockTopicId",
                  value: "Mock topic",
                  isCopied: true,
                },
              ],
              type: EntityType.INITIATIVE,
              defineInitiative_mockField: "Mock description",
              evaluationPlan: [
                {
                  id: "mockEvaluationPlanId",
                  isCopied: true,
                },
              ],
              fundingSources: [
                {
                  id: "mockFundingSourceId",
                  isCopied: true,
                },
              ],
              isCopied: true,
            },
          ],
        });
      });

      test("copy only initiative v1 name and topic with flag on", async () => {
        (LD.init as Mock).mockReturnValue({
          variation: vi.fn().mockResolvedValue(true),
          waitForInitialization,
        });
        (getReportFieldData as Mock).mockResolvedValueOnce(mockInitiativeV1);
        const copiedData = await copyFieldDataFromSource(
          "CO",
          "mock-source-id",
          formTemplate,
          {}
        );
        expect(copiedData).toEqual({
          initiative: [
            {
              id: "mockInitiativeId",
              initiative_name: "Mock Initiative",
              initiative_wp_otherTopic: "",
              initiative_wpTopic: [
                {
                  key: "initiative_wpTopic-mockTopicId",
                  value: "Mock topic",
                  isCopied: true,
                },
              ],
              type: EntityType.INITIATIVE,
              isCopied: true,
            },
          ],
        });
      });

      test("strips v1 fields from every initiative regardless of entity order", async () => {
        (LD.init as Mock).mockReturnValue({
          variation: vi.fn().mockResolvedValue(true),
          waitForInitialization,
        });
        // Only the first entity carries a v1 marker. Pruning deletes that
        // marker as it goes, so a mid-pass recomputation would wrongly leave
        // the second entity's v1 fields intact.
        (getReportFieldData as Mock).mockResolvedValueOnce({
          initiative: [
            {
              id: "v1InitiativeId",
              initiative_name: "V1 Initiative",
              evaluationPlan: [{ id: "mockEvaluationPlanId" }],
            },
            {
              id: "otherInitiativeId",
              initiative_name: "Other Initiative",
              defineInitiative_mockField: "should be stripped too",
            },
          ],
        });
        const copiedData: any = await copyFieldDataFromSource(
          "CO",
          "mock-source-id",
          formTemplate,
          {}
        );
        expect(copiedData.initiative).toHaveLength(2);
        expect(copiedData.initiative[0].evaluationPlan).toBeUndefined();
        expect(
          copiedData.initiative[1].defineInitiative_mockField
        ).toBeUndefined();
      });

      test("does not strip v1 fields when the only v1 initiative is closed out", async () => {
        (LD.init as Mock).mockReturnValue({
          variation: vi.fn().mockResolvedValue(true),
          waitForInitialization,
        });
        (getReportFieldData as Mock).mockResolvedValueOnce({
          initiative: [
            {
              id: "closedInitiativeId",
              initiative_name: "Closed V1 Initiative",
              isInitiativeClosed: true,
              evaluationPlan: [{ id: "mockEvaluationPlanId" }],
            },
            {
              id: "openInitiativeId",
              initiative_name: "Open Initiative",
              defineInitiative_mockField: "kept",
            },
          ],
        });
        const copiedData: any = await copyFieldDataFromSource(
          "CO",
          "mock-source-id",
          formTemplate,
          {}
        );
        // The closed initiative never reaches the copy, so it should not
        // trigger v1 stripping on the surviving open initiative.
        expect(copiedData.initiative).toHaveLength(1);
        expect(copiedData.initiative[0].defineInitiative_mockField).toBe(
          "kept"
        );
      });
    });

    describe("initiativeV2", () => {
      const mockInitiativeV2 = {
        initiative: [
          {
            id: "mockInitiativeId",
            initiative_name: "Mock Initiative",
            initiative_wp_otherTopic: "",
            initiative_wpTopic: [
              {
                key: "initiative_wpTopic-mockTopicId",
                value: "Mock topic",
              },
            ],
            type: EntityType.INITIATIVE,
            defineInitiative_mockField: "Mock description",
            defineInitiative_mockTable_mocks: [
              {
                id: "mockId",
                mockField: "Mock value",
                mockChoice: [
                  {
                    key: "mockChoice-mockChoiceId",
                    value: "Mock choice",
                  },
                ],
              },
            ],
          },
        ],
      };

      const expectedResult = {
        initiative: [
          {
            id: "mockInitiativeId",
            initiative_name: "Mock Initiative",
            initiative_wp_otherTopic: "",
            initiative_wpTopic: [
              {
                key: "initiative_wpTopic-mockTopicId",
                value: "Mock topic",
                isCopied: true,
              },
            ],
            type: EntityType.INITIATIVE,
            defineInitiative_mockField: "Mock description",
            defineInitiative_mockTable_mocks: [
              {
                id: "mockId",
                mockField: "Mock value",
                mockChoice: [
                  {
                    key: "mockChoice-mockChoiceId",
                    value: "Mock choice",
                    isCopied: true,
                  },
                ],
                isCopied: true,
              },
            ],
            isCopied: true,
          },
        ],
      };

      test("copy entire initiative v2 with flag on", async () => {
        (LD.init as Mock).mockReturnValue({
          variation: vi.fn().mockResolvedValue(true),
          waitForInitialization,
        });
        (getReportFieldData as Mock).mockResolvedValueOnce(mockInitiativeV2);
        const copiedData = await copyFieldDataFromSource(
          "CO",
          "mock-source-id",
          formTemplate,
          {}
        );
        expect(copiedData).toEqual(expectedResult);
      });

      test("copy entire initiative v2 with flag off", async () => {
        (LD.init as Mock).mockReturnValue({
          variation,
          waitForInitialization,
        });
        (getReportFieldData as Mock).mockResolvedValueOnce(mockInitiativeV2);
        const copiedData = await copyFieldDataFromSource(
          "CO",
          "mock-source-id",
          formTemplate,
          {}
        );
        expect(copiedData).toEqual(expectedResult);
      });
    });
  });

  describe("Copy-of-a-copy regression (gen1 -> gen2 -> gen3)", () => {
    const formTemplate = {
      type: ReportType.WP,
      routes: [
        {
          pageType: PageTypes.MODAL_DRAWER,
          entityType: EntityType.INITIATIVE,
          drawerForm: {
            fields: [
              {
                id: "defineInitiative_mockField",
                validation: ValidationType.TEXT,
              },
            ],
          },
        },
      ],
    } as ReportJson;

    const gen1 = {
      initiative: [
        {
          id: "openInitiativeId",
          type: EntityType.INITIATIVE,
          initiative_name: "Open Initiative",
          initiative_wp_otherTopic: "",
          initiative_wpTopic: [
            { key: "initiative_wpTopic-mockTopicId", value: "Mock topic" },
          ],
          defineInitiative_mockField: "Mock description",
        },
      ],
    };

    it("carries initiatives forward through a second-generation copy, even after an empty array field is added", async () => {
      (getReportFieldData as Mock).mockResolvedValueOnce(
        JSON.parse(JSON.stringify(gen1))
      );
      const gen2: any = await copyFieldDataFromSource(
        "CO",
        "gen1-id",
        formTemplate,
        {}
      );

      // Simulate the real app: gen2 gains a close-out field that is an empty
      // array, which does not exist in gen1's source data. This is what
      // triggers the copy-of-a-copy bug
      gen2.initiative[0].closeOutInformation_initiativeStatus = [];

      (getReportFieldData as Mock).mockResolvedValueOnce(
        JSON.parse(JSON.stringify(gen2))
      );
      const gen3: any = await copyFieldDataFromSource(
        "CO",
        "gen2-id",
        formTemplate,
        {}
      );

      expect(gen3.initiative).toBeDefined();
      expect(gen3.initiative.length).toBe(1);
      expect(gen3.initiative[0].initiative_name).toBe("Open Initiative");
    });

    it("still excludes closed initiatives across a second-generation copy", async () => {
      const gen1WithClosed = {
        initiative: [
          ...gen1.initiative,
          {
            ...gen1.initiative[0],
            id: "closedInitiativeId",
            initiative_name: "Closed Initiative",
            isInitiativeClosed: true,
          },
        ],
      };

      (getReportFieldData as Mock).mockResolvedValueOnce(
        JSON.parse(JSON.stringify(gen1WithClosed))
      );
      const gen2: any = await copyFieldDataFromSource(
        "CO",
        "gen1-id",
        formTemplate,
        {}
      );
      expect(
        gen2.initiative.some((i: any) => i.id === "closedInitiativeId")
      ).toBe(false);

      (getReportFieldData as Mock).mockResolvedValueOnce(
        JSON.parse(JSON.stringify(gen2))
      );
      const gen3: any = await copyFieldDataFromSource(
        "CO",
        "gen2-id",
        formTemplate,
        {}
      );
      expect(
        gen3.initiative.some((i: any) => i.id === "closedInitiativeId")
      ).toBe(false);
      expect(gen3.initiative.length).toBe(1);
    });

    it("survives being copied forward repeatedly without producing nulls", async () => {
      let current: any = JSON.parse(JSON.stringify(gen1));

      for (let generation = 2; generation <= 5; generation++) {
        (getReportFieldData as Mock).mockResolvedValueOnce(
          JSON.parse(JSON.stringify(current))
        );
        current = await copyFieldDataFromSource(
          "CO",
          `gen${generation - 1}-id`,
          formTemplate,
          {}
        );

        expect(current.initiative).toHaveLength(1);
        expect(current.initiative[0].initiative_name).toBe("Open Initiative");
        expect(JSON.stringify(current)).not.toContain("null");
      }
    });

    it("drops a top-level array not in the template, but keeps a template-valid one that is empty", async () => {
      (getReportFieldData as Mock).mockResolvedValueOnce({
        obsoleteThing: [],
        initiative: [],
      });

      const copiedData = await copyFieldDataFromSource(
        "CO",
        "mock-source-id",
        formTemplate,
        {}
      );

      expect(copiedData).toEqual({ initiative: [] });
    });

    it("keeps an empty initiative array when every initiative is closed out", async () => {
      const allClosed = {
        initiative: [{ ...gen1.initiative[0], isInitiativeClosed: true }],
      };
      (getReportFieldData as Mock).mockResolvedValueOnce(
        JSON.parse(JSON.stringify(allClosed))
      );

      const gen2: any = await copyFieldDataFromSource(
        "CO",
        "gen1-id",
        formTemplate,
        {}
      );

      // SAR creation iterates fieldData.initiative unguarded so an absent key
      // would turn a valid (if empty) copy into a 500 on SAR creation.
      expect(gen2.initiative).toEqual([]);
    });

    it("clears close-out answers when copying a Work Plan forward", async () => {
      const gen1WithCloseOutAnswer = {
        initiative: [
          {
            ...gen1.initiative[0],
            closeOutInformation_closeOut: [
              {
                key: "closeOutInformation_closeOut-closeOutInitiativeNo",
                value: "No",
              },
            ],
            closeOutInformation_actualEndDate: "01/01/2026",
          },
        ],
      };
      (getReportFieldData as Mock).mockResolvedValueOnce(
        JSON.parse(JSON.stringify(gen1WithCloseOutAnswer))
      );

      const gen2: any = await copyFieldDataFromSource(
        "CO",
        "gen1-id",
        formTemplate,
        {}
      );

      expect(gen2.initiative).toHaveLength(1);
      expect(gen2.initiative[0].initiative_name).toBe("Open Initiative");
      expect(gen2.initiative[0].closeOutInformation_closeOut).toBeUndefined();
      expect(
        gen2.initiative[0].closeOutInformation_actualEndDate
      ).toBeUndefined();
    });
  });
});
