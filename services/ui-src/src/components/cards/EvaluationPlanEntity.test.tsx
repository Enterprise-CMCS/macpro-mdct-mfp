import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import {
  mockEvaluationPlanFormattedEntityDataWP,
  mockEvaluationPlanFormattedEntityDataSAR,
} from "utils/testing/mockEntities";
import { EvaluationPlanEntity } from "./EvaluationPlanEntity";
import { mockReportStore, mockSARReportStore } from "utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const evaluationPlanEntityWP = (
  <EvaluationPlanEntity
    formattedEntityData={mockEvaluationPlanFormattedEntityDataWP}
  />
);

const evaluationPlanEntitySAR = (
  <EvaluationPlanEntity
    formattedEntityData={mockEvaluationPlanFormattedEntityDataSAR}
  />
);

describe("<EvaluationPlanEntity />", () => {
  test("EvaluationPlanEntity renders correctly for workplan", () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(evaluationPlanEntityWP);

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
    expect(screen.getByText("2024 Q1:")).totoBeVisible();
  });

  test("EvaluationPlanEntity renders correctly for SAR", () => {
    mockedUseStore.mockReturnValue(mockSARReportStore);
    render(evaluationPlanEntitySAR);

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
    expect(screen.getByText("Not Answered")).toBeVisible();
  });

  testA11y(
    <EvaluationPlanEntity
      formattedEntityData={mockEvaluationPlanFormattedEntityDataWP}
    />
  );
});
