import { render } from "@testing-library/react";
import { EntityCardByStepType } from "./EntityCardByStepType";
import { OverlayModalStepTypes } from "../../types";
import {
  mockCompletedGenericFormattedEntityData,
  mockUseSARStore,
} from "../../utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const verbiage = {
  entityUnfinishedMessage:
    "Report objective progress to complete this section.",
};

const genericEntityCard = (
  <EntityCardByStepType
    stepType={"mockStepType"}
    formattedEntityData={{}}
    verbiage={verbiage}
  />
);

const evaluationPlanEntityCard = (
  <EntityCardByStepType
    stepType={OverlayModalStepTypes.EVALUATION_PLAN}
    formattedEntityData={mockCompletedGenericFormattedEntityData}
    verbiage={verbiage}
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

const fundingSourcesEntityCardByStepType = (
  <EntityCardByStepType
    stepType={OverlayModalStepTypes.FUNDING_SOURCES}
    formattedEntityData={formattedEntityData}
    verbiage={verbiage}
  />
);

describe("Test EntityCardByStepType renders", () => {
  test("EntityCardByStepType renders correctly", () => {
    const topSection = render(genericEntityCard);
    expect(topSection.getByText("mockStepType")).toBeVisible();
  });

  test("EntityCardByStepType renders evaluation plan case correctly", () => {
    const topSection = render(evaluationPlanEntityCard);
    expect(topSection.getByText("Performance measure targets")).toBeVisible();
  });

  test("EntityCardByStepType renders funding sources case correctly", () => {
    const topSection = render(fundingSourcesEntityCardByStepType);
    expect(
      topSection.getByText("Projected quarterly expenditures")
    ).toBeVisible();
  });
});

describe("Test EntityCardByStepType renders correctly for SAR", () => {
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
  const ObjectiveProgressEntityCard = (
    <EntityCardByStepType
      stepType={OverlayModalStepTypes.OBJECTIVE_PROGRESS}
      formattedEntityData={mockFullyCompletedObjectiveProgress}
      verbiage={verbiage}
    />
  );

  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockUseSARStore);
  });
  test("EntityCardByStepType thats been fully completed renders correctly for SAR", () => {
    const topOfCard = render(ObjectiveProgressEntityCard);
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
        `${mockFullyCompletedObjectiveProgress.quarterProjections[1].id} Target:`
      )
    ).toBeVisible();
  });
});
