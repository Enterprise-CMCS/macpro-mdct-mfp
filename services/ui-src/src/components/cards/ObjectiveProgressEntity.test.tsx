import { render, screen } from "@testing-library/react";
import { mockObjectiveProgressFormattedEntityData } from "utils/testing/setupJest";
import { ObjectiveProgressEntity } from "./ObjectiveProgressEntity";
import { testA11yAct } from "utils/testing/commonTests";

const objectiveProgressEntityComponent = (
  <ObjectiveProgressEntity
    formattedEntityData={mockObjectiveProgressFormattedEntityData}
    entityCompleted={true}
  />
);
const renderedText = [
  `${mockObjectiveProgressFormattedEntityData.quarterProjections[0].id} Target:`,
  `${mockObjectiveProgressFormattedEntityData.quarterProjections[1].id} Target:`,
  `${mockObjectiveProgressFormattedEntityData.quarterActuals[0].id} Actual:`,
  `${mockObjectiveProgressFormattedEntityData.quarterActuals[1].id} Actual:`,
  mockObjectiveProgressFormattedEntityData.missedTargetReason,
  mockObjectiveProgressFormattedEntityData.performanceMeasureProgress,
  mockObjectiveProgressFormattedEntityData.performanceMeasureProgress,
];

describe("<ObjectiveProgressEntity />", () => {
  test("ObjectiveProgressEntity renders correctly", () => {
    render(objectiveProgressEntityComponent);
    expect(
      screen.getByRole("heading", { name: "mockObjectiveName" })
    ).toBeVisible();

    renderedText.forEach((text) =>
      expect(screen.getByText(text)).toBeVisible()
    );
  });

  testA11yAct(
    <ObjectiveProgressEntity
      formattedEntityData={mockObjectiveProgressFormattedEntityData}
      entityCompleted={true}
    />
  );
});
