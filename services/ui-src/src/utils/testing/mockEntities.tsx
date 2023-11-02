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
};

export const mockTargetPopulationEntity = {
  id: "mock-id1",
  type: entityTypes[0],
  isRequired: true,
  transitionBenchmarks_targetPopulationName: "Older Adults",
  transitionBenchmarks_applicableToMfpDemonstration: [{ value: "No" }],
};

export const mockOtherTargetPopulationEntity = {
  id: "mock-id5",
  type: entityTypes[0],
  isRequired: false,
  transitionBenchmarks_targetPopulationName: "New target population",
};
