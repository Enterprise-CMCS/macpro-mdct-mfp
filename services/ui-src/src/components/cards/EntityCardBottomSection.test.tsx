import { render, screen } from "@testing-library/react";
import { EntityStepCardBottomSection } from "./EntityCardBottomSection";
import { mockGenericEntity, mockUseSARStore } from "utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const verbiage = {
  entityMissingResponseMessage: "test string",
  entityEmptyResponseMessage: "test string",
};

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

const entityStepCardBottomSection = (
  <EntityStepCardBottomSection
    stepType={"mockStepType"}
    verbiage={verbiage}
    formattedEntityData={{}}
  />
);

const cardWithQualitativeAnswers = (
  <EntityStepCardBottomSection
    stepType={"objectiveProgress"}
    verbiage={verbiage}
    formattedEntityData={mockFullyCompletedObjectiveProgress}
    entity={mockGenericEntity}
  />
);
describe("Test EntityStepCardBottomSection renders", () => {
  test("EntityStepCardBottomSection renders correctly", () => {
    const bottomSection = render(entityStepCardBottomSection);
    expect(bottomSection.container).toBeEmptyDOMElement();
  });

  test("EntityStepCardBottomSection always returns default", () => {
    let entityStepCardBottomSectionSwitchCase = (
      <EntityStepCardBottomSection
        stepType={"mockStepType"}
        verbiage={verbiage}
        formattedEntityData={{}}
      />
    );

    const bottomSection = render(entityStepCardBottomSectionSwitchCase);
    expect(bottomSection.container).toBeEmptyDOMElement();

    entityStepCardBottomSectionSwitchCase = (
      <EntityStepCardBottomSection
        stepType={"anotherMockStepType"}
        verbiage={verbiage}
        formattedEntityData={{}}
      />
    );
    expect(bottomSection.container).toBeEmptyDOMElement();
  });
  test("EntityStepCardBottomSection returns default if objectiveProgress but not SAR", () => {
    let entityStepCardBottomSectionSwitchCase = (
      <EntityStepCardBottomSection
        stepType={"objectiveProgress"}
        verbiage={verbiage}
        formattedEntityData={{}}
      />
    );

    const bottomSection = render(entityStepCardBottomSectionSwitchCase);
    expect(bottomSection.container).toBeEmptyDOMElement();
  });
});

describe("Test EntityStepCardBottomSection renders the objective progress correctly", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockUseSARStore);
  });
  test("EntityStepCardBottomSection renders evalutionStep correctly", () => {
    const bottomOfCard = render(cardWithQualitativeAnswers);
    expect(
      bottomOfCard.getByText(
        `${mockFullyCompletedObjectiveProgress.quarterProjections[0].id} Target:`
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        `${mockFullyCompletedObjectiveProgress.quarterProjections[1].id} Target:`
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        `${mockFullyCompletedObjectiveProgress.quarterActuals[0].id} Actual:`
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        `${mockFullyCompletedObjectiveProgress.quarterActuals[1].id} Actual:`
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        mockFullyCompletedObjectiveProgress.performanceMeasureProgress
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(mockFullyCompletedObjectiveProgress.targetsMet)
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        mockFullyCompletedObjectiveProgress.missedTargetReason
      )
    ).toBeVisible();
  });
});
