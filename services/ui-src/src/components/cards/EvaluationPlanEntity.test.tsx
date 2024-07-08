import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import { mockEvaluationPlanFormattedEntityData } from "utils/testing/mockEntities";
import { EvaluationPlanEntity } from "./EvaluationPlanEntity";

const evaluationPlanEntity = (
  <EvaluationPlanEntity
    formattedEntityData={mockEvaluationPlanFormattedEntityData}
  />
);

describe("<EvaluationPlanEntity />", () => {
  beforeEach(() => {
    render(evaluationPlanEntity);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("EvaluationPlanEntity renders correctly", () => {
    expect(
      screen.getByRole("heading", { name: "mockEvaluationPlanName" })
    ).toBeVisible();
  });

  testA11y(
    <EvaluationPlanEntity
      formattedEntityData={mockEvaluationPlanFormattedEntityData}
    />
  );
});
