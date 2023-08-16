export const mockQualityMeasuresEntity = {
  id: "ad3126-7225-17a8-628f-821857076e",
  qualityMeasure_domain: [
    {
      key: "qualityMeasure_domain-id",
      value: "Primary care access and preventative care",
    },
  ],
  qualityMeasure_name: "Measure Name",
  qualityMeasure_nqfNumber: "1234",
  qualityMeasure_reportingRateType: [
    {
      key: "qualityMeasure_reportingRateType-id",
      value: "Program-specific rate",
    },
  ],
  qualityMeasure_set: [
    {
      key: "qualityMeasure_set-id",
      value: "Medicaid Child Core Set",
    },
  ],
  qualityMeasure_reportingPeriod: [
    {
      key: "qualityMeasure_reportingPeriod-id",
      value: "Yes",
    },
  ],
  qualityMeasure_description: "Measure Description",
};

export const mockCompletedQualityMeasuresEntity = {
  ...mockQualityMeasuresEntity,
  "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
  "qualityMeasure_plan_measureResults_mock-plan-id-2": "mock-response-2",
};
