import { entityTypes } from "types";

export const mockGenericEntity = {
  id: "mock-generic-id",
  type: entityTypes[0],
  generic_generalCategory: [{ value: "mock-category" }],
  generic_standardDescription: "mock-description",
  generic_standardType: [{ value: "mock-standard-type" }],
  "generic_standardType-otherText": "",
  generic_providerType: [{ value: "mock-provider-type" }],
  generic_applicableRegion: [{ value: "Other, specify" }],
  "generic_applicableRegion-otherText": "mock-region-other-text",
  generic_population: [{ value: "mock-population" }],
  generic_monitoringMethods: [
    { value: "mock-monitoring-method-1" },
    { value: "mock-monitoring-method-2" },
  ],
  generic_oversightMethodFrequency: [
    { value: "mock-oversight-method-frequency" },
  ],
  objectivesProgress_deliverablesMet: [{ value: "No" }],
  objectivesProgress_deliverablesMet_otherText:
    "mock deliverables met other text",
};

export const mockUnfinishedGenericFormattedEntityData = {
  category: "mock-category",
  standardDescription: "mock-description",
  standardType: "mock-standard-type",
};

export const mockCompletedGenericFormattedEntityData = {
  ...mockUnfinishedGenericFormattedEntityData,
  provider: "mock-provider-type",
  region: "mock-region-other-text",
  population: "mock-population",
  monitoringMethods: ["mock-monitoring-method-1", "mock-monitoring-method-2"],
  methodFrequency: "mock-oversight-method-frequency",
  quarters: [
    {
      id: "mock_id",
      value: "mock_value",
    },
  ],
};

export const mockTargetPopulationEntity = {
  id: "mock-id1",
  type: entityTypes[1],
  isRequired: true,
  transitionBenchmarks_targetPopulationName: "Older Adults",
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "transitionBenchmarks_applicableToMfpDemonstration-mock-choice-2",
      value: "Yes",
    },
  ],
  ["mock-child-1"]: "3",
};

export const mockOtherTargetPopulationEntity = {
  id: "mock-id5",
  type: entityTypes[1],
  isRequired: false,
  transitionBenchmarks_targetPopulationName: "New target population",
};

export const mockTargetPopReqButNotApplicable = {
  id: "1",
  transitionBenchmarks_targetPopulationName: "Required-No",
  isRequired: true,
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "a",
      value: "No",
    },
  ],
  quarterlyProjections2023Q3: "",
};

export const mockTargetPopReqButApplicable = {
  id: "2",
  transitionBenchmarks_targetPopulationName: "Required-Yes",
  isRequired: true,
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "b",
      value: "Yes",
    },
  ],
  quarterlyProjections2023Q3: "1",
};

export const mockTargetPopReqButApplicableIsUndefined = {
  id: "3",
  transitionBenchmarks_targetPopulationName: "Required-Undefined",
  isRequired: true,
};

export const mockTargetPopButOtherApplicable = {
  id: "4",
  type: "targetPopulations",
  transitionBenchmarks_targetPopulationName: "Other-Yes",
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "c",
      value: "Yes",
    },
  ],
  quarterlyProjections2023Q3: "4",
};

export const mockTargetPopButOtherNotApplicable = {
  id: "5",
  type: "targetPopulations",
  transitionBenchmarks_targetPopulationName: "Other-No",
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "d",
      value: "No",
    },
  ],
  quarterlyProjections2023Q3: "",
};

export const mockTargetPopByOtherNotDefined = {
  id: "6",
  type: "targetPopulations",
  transitionBenchmarks_targetPopulationName: "Other-Undefined",
};

export const mockTargetPopDefaultButNotApplicable = {
  id: "7",
  transitionBenchmarks_targetPopulationName: "Older adults",
  isRequired: true,
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "a",
      value: "No",
    },
  ],
  quarterlyProjections2023Q3: "",
};

export const mockTargetPopDefaultAndApplicable = {
  id: "8",
  transitionBenchmarks_targetPopulationName: "Older adults",
  isRequired: true,
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "a",
      value: "Yes",
    },
  ],
  quarterlyProjections2023Q3: "",
};

export const mockObjectiveProgressFormattedEntityData = {
  objectiveName: "mockObjectiveName",
  description: "mockDescription",
  targets: "mock targets text",
  quarterProjections: [
    {
      id: "2024 Q1",
      value: "1",
    },
    {
      id: "2024 Q2",
      value: "2",
    },
  ],
  quarterActuals: [
    {
      id: "2024 Q1",
      value: "4",
    },
    {
      id: "2024 Q2",
      value: "4",
    },
  ],
  performanceMeasureProgress: "mock provided data on performance",
  targetsMet: "No",
  missedTargetReason:
    "mock progress description towards reaching the milestone",
};

export const mockFundingSourcesFormattedEntityData = {
  fundingSource: "mock-funding-source",
  description: "mockDescription",
  quarters: [
    {
      id: "2024 Q1",
      value: "100",
    },
    {
      id: "2024 Q2",
      value: "200",
    },
    {
      id: "2024 Q3",
      value: "300",
    },
    {
      id: "2024 Q4",
      value: "400",
    },
  ],
};

export const mockEvaluationPlanFormattedEntityDataWP = {
  objectiveName: "mockEvaluationPlanName",
  description: "mockDescription",
  targets: "1",
  includesTargets: "Yes",
  additionalDetails: "2",
  quarters: [
    {
      id: "2024 Q1",
      value: "1",
    },
    {
      id: "2024 Q2",
      value: "2",
    },
    {
      id: "2024 Q3",
      value: "3",
    },
    {
      id: "2024 Q4",
      value: "4",
    },
    {
      id: "2025 Q1",
      value: "2",
    },
    {
      id: "2025 Q2",
      value: "4",
    },
    {
      id: "2025 Q3",
      value: "6",
    },
    {
      id: "2025 Q4",
      value: "8",
    },
    {
      id: "2026 Q1",
      value: "1",
    },
    {
      id: "2026 Q2",
      value: "3",
    },
    {
      id: "2026 Q3",
      value: "5",
    },
    {
      id: "2026 Q4",
      value: "7",
    },
  ],
};

export const mockEvaluationPlanFormattedEntityDataSAR = {
  objectiveName: "mockEvaluationPlanName",
  description: "mockDescription",
  targets: "1",
  additionalDetails: "2",
  quarters: [
    {
      id: "2024 Q1",
      value: "1",
    },
    {
      id: "2024 Q2",
      value: "2",
    },
    {
      id: "2024 Q3",
      value: "3",
    },
    {
      id: "2024 Q4",
      value: "4",
    },
    {
      id: "2025 Q1",
      value: "2",
    },
    {
      id: "2025 Q2",
      value: "4",
    },
    {
      id: "2025 Q3",
      value: "6",
    },
    {
      id: "2025 Q4",
      value: "8",
    },
    {
      id: "2026 Q1",
      value: "1",
    },
    {
      id: "2026 Q2",
      value: "3",
    },
    {
      id: "2026 Q3",
      value: "5",
    },
    {
      id: "2026 Q4",
      value: "Not Answered",
    },
  ],
};
