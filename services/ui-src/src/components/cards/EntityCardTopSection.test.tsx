import { render } from "@testing-library/react";
import { EntityStepCardTopSection } from "./EntityCardTopSection";
import { OverlayModalStepTypes } from "../../types";
import { mockCompletedGenericFormattedEntityData } from "../../utils/testing/setupJest";

const genericEntityStepCardTopSection = (
  <EntityStepCardTopSection
    stepType={"mockStepType"}
    formattedEntityData={{}}
  />
);

const evaluationPlanEntityStepCardTopSection = (
  <EntityStepCardTopSection
    stepType={OverlayModalStepTypes.EVALUATION_PLAN}
    formattedEntityData={mockCompletedGenericFormattedEntityData}
  />
);

const formattedEntityData = {
  ...mockCompletedGenericFormattedEntityData,
  fundingSource: "mock-funding-source",
  quarters: [
    {
      id: "mock-id-1",
      value: "mock-value-1",
    },
    {
      id: "mock-id-2",
      value: "mock-value-2",
    },
  ],
};

const fundingSourcesEntityStepCardTopSection = (
  <EntityStepCardTopSection
    stepType={OverlayModalStepTypes.FUNDING_SOURCES}
    formattedEntityData={formattedEntityData}
  />
);

describe("Test EntityStepCardTopSection renders", () => {
  test("EntityStepCardTopSection renders correctly", () => {
    const topSection = render(genericEntityStepCardTopSection);
    expect(topSection.getByText("mockStepType")).toBeVisible();
  });

  test("EntityStepCardTopSection renders evaluation plan case correctly", () => {
    const topSection = render(evaluationPlanEntityStepCardTopSection);
    expect(topSection.getByText("Performance measure targets")).toBeVisible();
  });

  test("EntityStepCardTopSection renders funding sources case correctly", () => {
    const topSection = render(fundingSourcesEntityStepCardTopSection);
    expect(
      topSection.getByText("Projected quarterly expenditures")
    ).toBeVisible();
  });
});
