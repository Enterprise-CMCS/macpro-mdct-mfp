import { render, screen } from "@testing-library/react";
import { mockObjectiveProgressFormattedEntityData } from "utils/testing/setupJest";
import { ObjectiveProgressEntity } from "./ObjectiveProgressEntity";
import { testA11y } from "utils/testing/commonTests";

const objectiveProgressEntityComponent = (
  <ObjectiveProgressEntity
    formattedEntityData={mockObjectiveProgressFormattedEntityData}
    entityCompleted={true}
  />
);

describe("<ObjectiveProgressEntity />", () => {
  beforeEach(async () => {
    render(objectiveProgressEntityComponent);
  });
  test("ObjectiveProgressEntity renders correctly", () => {
    expect(
      screen.getByRole("heading", { name: "mockObjectiveName" })
    ).toBeVisible();
  });

  test("ObjectiveProgressEntity renders evalutionStep correctly", () => {
    expect(
      screen.getByText(
        `${mockObjectiveProgressFormattedEntityData.quarterProjections[0].id} Target:`
      )
    ).toBeVisible();
    expect(
      screen.getByText(
        `${mockObjectiveProgressFormattedEntityData.quarterProjections[1].id} Target:`
      )
    ).toBeVisible();
    expect(
      screen.getByText(
        `${mockObjectiveProgressFormattedEntityData.quarterActuals[0].id} Actual:`
      )
    ).toBeVisible();
    expect(
      screen.getByText(
        `${mockObjectiveProgressFormattedEntityData.quarterActuals[1].id} Actual:`
      )
    ).toBeVisible();
    expect(
      screen.getByText(
        mockObjectiveProgressFormattedEntityData.performanceMeasureProgress
      )
    ).toBeVisible();
    expect(
      screen.getByText(mockObjectiveProgressFormattedEntityData.targetsMet)
    ).toBeVisible();
    expect(
      screen.getByText(
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
