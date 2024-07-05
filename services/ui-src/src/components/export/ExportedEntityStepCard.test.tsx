import { render, screen } from "@testing-library/react";
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

const PrintViewEntityTypeEntityCardComponent = (
  <ExportedEntityStepCard
    entity={mockGenericEntity}
    entityIndex={0}
    stepType="stepType"
    formattedEntityData={mockCompletedGenericFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    printVersion={true}
  />
);

describe("PrintOnly TESTS", () => {
  test("in Print View the status indicator should be visible", async () => {
    render(PrintViewEntityTypeEntityCardComponent);
    const element = screen.getByTestId("print-status-indicator");
    expect(element).toBeVisible();
  });
});
