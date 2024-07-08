import { render } from "@testing-library/react";
import {
  mockObjectiveProgressFormattedEntityData,
  mockUseSARStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { ObjectiveProgressEntity } from "./ObjectiveProgressEntity";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const objectiveProgressEntityComponent = (
  <ObjectiveProgressEntity
    formattedEntityData={mockObjectiveProgressFormattedEntityData}
    entityCompleted={true}
  />
);

describe("<ObjectiveProgressEntity />", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockUseSARStore);
  });
  test("ObjectiveProgressEntity renders correctly", () => {
    const objectiveProgressCard = render(objectiveProgressEntityComponent);
    expect(
      objectiveProgressCard.getByRole("heading", { name: "mockObjectiveName" })
    ).toBeVisible();
  });

  test("ObjectiveProgressEntity renders evalutionStep correctly", () => {
    const bottomOfCard = render(objectiveProgressEntityComponent);
    expect(
      bottomOfCard.getByText(
        `${mockObjectiveProgressFormattedEntityData.quarterProjections[0].id} Target:`
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        `${mockObjectiveProgressFormattedEntityData.quarterProjections[1].id} Target:`
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        `${mockObjectiveProgressFormattedEntityData.quarterActuals[0].id} Actual:`
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        `${mockObjectiveProgressFormattedEntityData.quarterActuals[1].id} Actual:`
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        mockObjectiveProgressFormattedEntityData.performanceMeasureProgress
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        mockObjectiveProgressFormattedEntityData.targetsMet
      )
    ).toBeVisible();
    expect(
      bottomOfCard.getByText(
        mockObjectiveProgressFormattedEntityData.missedTargetReason
      )
    ).toBeVisible();
  });

  testA11y(
    <ObjectiveProgressEntity
      formattedEntityData={mockObjectiveProgressFormattedEntityData}
      entityCompleted={true}
    />
  );
});
