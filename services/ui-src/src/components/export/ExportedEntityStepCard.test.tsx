import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import {
  mockCompletedGenericFormattedEntityData,
  mockGenericEntity,
} from "utils/testing/mockEntities";
import { mockModalDrawerReportPageJson } from "utils/testing/mockForm";
import { ExportedEntityStepCard } from "./ExportedEntityStepCard";

const openAddEditEntityModal = jest.fn();
const openDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();
jest.mock("utils/state/useStore");

const ExportedEntityCardComponent = (
  <ExportedEntityStepCard
    entity={mockGenericEntity}
    entityIndex={0}
    stepType="stepType"
    formattedEntityData={mockCompletedGenericFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
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
      verbiage={mockModalDrawerReportPageJson.verbiage}
    />
  );
});
