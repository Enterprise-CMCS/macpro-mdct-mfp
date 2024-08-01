import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import {
  mockEvaluationPlanFormattedEntityData,
  mockEvaluationPlanFormattedEntityDataNoQuarters,
} from "utils/testing/mockEntities";
import { EvaluationPlanEntity } from "./EvaluationPlanEntity";
import { mockReportStore, mockSARReportStore } from "utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const evaluationPlanEntity = (
  <EvaluationPlanEntity
    formattedEntityData={mockEvaluationPlanFormattedEntityData}
  />
);

const evaluationPlanEntityNoQuarters = (
  <EvaluationPlanEntity
    formattedEntityData={mockEvaluationPlanFormattedEntityDataNoQuarters}
  />
);

describe("<EvaluationPlanEntity />", () => {
  test("EvaluationPlanEntity renders correctly for workplan", () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(evaluationPlanEntity);

    expect(
      screen.getByRole("heading", { name: "mockEvaluationPlanName" })
    ).toBeVisible();
    expect(
      screen.getByText(
        "Does the performance measure include quantitative targets?"
      )
    ).toBeVisible();
    expect(screen.getByText("Yes")).toBeVisible();
    expect(screen.getByText("Quantitative Targets")).toBeVisible();
    expect(screen.getByText("2024 Q1:")).toBeVisible();
  });

  test("Correctly does not display quantitative targets when there are no quarters", () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(evaluationPlanEntityNoQuarters);

    expect(screen.queryByText("Quantitative Targets")).toBeNull();
  });

  test("EvaluationPlanEntity renders correctly for SAR", () => {
    mockedUseStore.mockReturnValue(mockSARReportStore);
    render(evaluationPlanEntity);

    expect(
      screen.getByRole("heading", { name: "mockEvaluationPlanName" })
    ).toBeVisible();
    expect(
      screen.queryByText(
        "Does the performance measure include quantitative targets?"
      )
    ).toBeNull();
    expect(screen.getByText("Quantitative Targets")).toBeVisible();
    expect(screen.getByText("2024 Q1:")).toBeVisible();
  });

  testA11y(
    <EvaluationPlanEntity
      formattedEntityData={mockEvaluationPlanFormattedEntityData}
    />
  );
});
