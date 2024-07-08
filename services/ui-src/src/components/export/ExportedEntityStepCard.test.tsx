import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import {
  mockCompletedGenericFormattedEntityData,
  mockGenericEntity,
} from "utils/testing/mockEntities";
import { ExportedEntityStepCard } from "./ExportedEntityStepCard";

jest.mock("utils/state/useStore");

const ExportedEntityCardComponent = (
  <ExportedEntityStepCard
    entity={mockGenericEntity}
    entityIndex={0}
    stepType="stepType"
    formattedEntityData={mockCompletedGenericFormattedEntityData}
  />
);

describe("<ExportedEntityStepCard />", () => {
  test("the status indicator should be visible", async () => {
    render(ExportedEntityCardComponent);
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
