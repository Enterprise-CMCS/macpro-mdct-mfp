import { OverlayModalStepTypes } from "types";
import { getFormattedEntityData } from "./entitySteps";

describe("utils/reports/entitySteps", () => {
  describe("getFormattedEntityData()", () => {
    test("Should return the correct shape for evaluation plans", () => {
      const entity = {
        id: "mock id",
        type: "targetPopulations" as const,
        evaluationPlan_objectiveName: "mock objective",
        evaluationPlan_description: "mock description",
        evaluationPlan_targets: "mock targets",
        evaluationPlan_includesTargets: [
          {
            value: "Yes",
          },
        ],
        quarterlyProjections2023Q1: "99%",
        quarterlyProjections2023Q2: "99.9%",
        evaluationPlan_additionalDetails: "mock details",
      };

      const result = getFormattedEntityData(
        OverlayModalStepTypes.EVALUATION_PLAN,
        entity
      );

      expect(result).toEqual({
        objectiveName: "mock objective",
        description: "mock description",
        targets: "mock targets",
        includesTargets: "Yes",
        quarters: [
          { id: "2023 Q1", value: "99%" },
          { id: "2023 Q2", value: "99.9%" },
        ],
        additionalDetails: "mock details",
      });
    });

    test("Should return the correct shape for funding sources", () => {
      const entity = {
        id: "mock id",
        type: "initiative" as const,
        fundingSources_wpTopic: [
          {
            value: "mock source",
          },
        ],
        fundingSources_quarters2023Q1: "mock sources 2023-1",
        fundingSources_quarters2023Q2: "mock sources 2023-2",
        fundingSources_quarters2023Q3: "25.75",
        fundingSources_quarters2023Q4: "1000",
      };

      const result = getFormattedEntityData(
        OverlayModalStepTypes.FUNDING_SOURCES,
        entity
      );

      expect(result).toEqual({
        id: "mock id",
        fundingSource: "mock source",
        quarters: [
          { id: "2023 Q1", value: "$mock sources 2023-1" },
          { id: "2023 Q2", value: "$mock sources 2023-2" },
          { id: "2023 Q3", value: "$25.75" },
          { id: "2023 Q4", value: "$1,000.00" },
        ],
      });
    });

    test("Should find the specified Other work plan topic if specified", () => {
      const entity = {
        id: "mock id",
        type: "initiative" as const,
        fundingSources_wpTopic: [
          {
            value: "Other, specify",
          },
        ],
        initiative_wp_otherTopic: "other other other",
      };

      const result = getFormattedEntityData(
        OverlayModalStepTypes.FUNDING_SOURCES,
        entity
      );

      expect(result).toEqual({
        id: "mock id",
        fundingSource: "other other other",
        quarters: [],
      });
    });

    test("Should give up for unknown entity types", () => {
      const entity = {
        id: "mock id",
        type: "initiative" as const,
      };

      const result = getFormattedEntityData("unknown entity type", entity);

      expect(result).toEqual({});
    });

    test("Should return an appropriately-shaped object even for nullish entites", () => {
      const result = getFormattedEntityData(
        OverlayModalStepTypes.FUNDING_SOURCES,
        undefined
      );

      expect(result).toEqual({
        id: undefined,
        fundingSource: undefined,
        quarters: [],
      });
    });
  });
});
