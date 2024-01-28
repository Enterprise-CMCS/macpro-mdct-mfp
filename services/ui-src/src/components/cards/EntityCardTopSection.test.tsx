import { render } from "@testing-library/react";
import { EntityStepCardTopSection } from "./EntityCardTopSection";
import { OverlayModalStepTypes } from "../../types";
import {
  mockCompletedGenericFormattedEntityData,
  mockUseSARStore,
} from "../../utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

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

describe("Test EntityStepCardTopSection renders correctly for SAR", () => {
  const mockFullyCompletedObjectiveProgress = {
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
  const ObjectiveProgressEntityStepCardTopSection = (
    <EntityStepCardTopSection
      stepType={OverlayModalStepTypes.OBJECTIVE_PROGRESS}
      formattedEntityData={mockFullyCompletedObjectiveProgress}
    />
  );

  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockUseSARStore);
  });
  test("EntityStepCardTopSection thats been fully completed renders correctly for SAR", () => {
    const topOfCard = render(ObjectiveProgressEntityStepCardTopSection);
    expect(
      topOfCard.getByText(mockFullyCompletedObjectiveProgress.objectiveName)
    ).toBeVisible();
    expect(
      topOfCard.getByText(mockFullyCompletedObjectiveProgress.description)
    ).toBeVisible();
    expect(
      topOfCard.getByText(mockFullyCompletedObjectiveProgress.targets)
    ).toBeVisible();
    expect(
      topOfCard.getByText(
        `${mockFullyCompletedObjectiveProgress.quarterProjections[0].id} Target:`
      )
    ).toBeVisible();
    expect(
      topOfCard.getByText(
        `${mockFullyCompletedObjectiveProgress.quarterProjections[0].id} Target:`
      )
    ).toBeVisible();
    expect(
      topOfCard.getByText(
        `${mockFullyCompletedObjectiveProgress.quarterActuals[0].id} Actual:`
      )
    ).toBeVisible();
    expect(
      topOfCard.getByText(
        `${mockFullyCompletedObjectiveProgress.quarterActuals[0].id} Actual:`
      )
    ).toBeVisible();
    expect(
      topOfCard.getByText(
        mockFullyCompletedObjectiveProgress.performanceMeasureProgress
      )
    ).toBeVisible();
    expect(
      topOfCard.getByText(mockFullyCompletedObjectiveProgress.targetsMet)
    ).toBeVisible();
    expect(
      topOfCard.getByText(
        mockFullyCompletedObjectiveProgress.missedTargetReason
      )
    ).toBeVisible();
  });
});
