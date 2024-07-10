import { render, screen } from "@testing-library/react";
import { OverlayModalStepTypes } from "types";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import {
  mockCompletedGenericFormattedEntityData,
  mockEvaluationPlanFormattedEntityDataWP,
  mockGenericEntity,
  mockUnfinishedGenericFormattedEntityData,
} from "utils/testing/mockEntities";
import { mockReportStore } from "utils/testing/setupJest";
import { ExportedEntityStepCard } from "./ExportedEntityStepCard";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const CompletedExportedEvaluationPlanEntityCardComponent = (
  <ExportedEntityStepCard
    entity={mockGenericEntity}
    entityIndex={0}
    entityTotal={1}
    stepType={OverlayModalStepTypes.EVALUATION_PLAN}
    formattedEntityData={mockEvaluationPlanFormattedEntityDataWP}
  />
);

const IncompleteExportedEntityCardComponent = (
  <ExportedEntityStepCard
    entity={mockGenericEntity}
    entityIndex={0}
    entityTotal={1}
    stepType={OverlayModalStepTypes.EVALUATION_PLAN}
    formattedEntityData={mockUnfinishedGenericFormattedEntityData}
  />
);

describe("<ExportedEntityStepCard />", () => {
  test("ExportedEntityStepCard renders correctly", () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(CompletedExportedEvaluationPlanEntityCardComponent);
    expect(screen.getByTestId("exportedEntityCard")).toBeVisible();
    expect(screen.getByTestId("entities-count")).toContainHTML("1");
  });

  test("ExportedEntityStepCard displays completed status correctly", () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(CompletedExportedEvaluationPlanEntityCardComponent);
    expect(screen.getByText("Complete")).toBeVisible();
    const element = screen.getByTestId("print-status-indicator");
    expect(element).toBeVisible();
  });

  test("ExportedEntityStepCard displays incomplete status correctly", () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(IncompleteExportedEntityCardComponent);
    expect(screen.getByText("Error")).toBeVisible();
    const element = screen.getByTestId("print-status-indicator");
    expect(element).toBeVisible();
  });

  testA11y(
    <ExportedEntityStepCard
      entity={mockGenericEntity}
      entityIndex={0}
      stepType="stepType"
      formattedEntityData={mockCompletedGenericFormattedEntityData}
    />
  );
});
