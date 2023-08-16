import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import {
  mockModalDrawerReportPageJson,
  mockGenericEntity,
  mockCompletedGenericFormattedEntityData,
  mockUnfinishedGenericFormattedEntityData,
} from "utils/testing/setupJest";
import { EntityCard } from "./EntityCard";

const openAddEditEntityModal = jest.fn();
const openDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();

const { editEntityButtonText, enterEntityDetailsButtonText } =
  mockModalDrawerReportPageJson.verbiage;

const UnfinishedGenericEntityCardComponent = (
  <EntityCard
    entity={mockGenericEntity}
    entityIndex={0}
    entityType="mock-entity-type"
    formattedEntityData={mockUnfinishedGenericFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    printVersion={false}
  />
);

const GenericEntityTypeEntityCardComponent = (
  <EntityCard
    entity={mockGenericEntity}
    entityIndex={0}
    entityType="entityType"
    formattedEntityData={mockCompletedGenericFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    printVersion={false}
  />
);

describe("Test Completed EntityCard", () => {
  beforeEach(() => {
    render(GenericEntityTypeEntityCardComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("EntityCard is visible", () => {
    expect(screen.getByTestId("entityCard")).toBeVisible();
  });

  test("Clicking edit button opens the AddEditProgramModal", async () => {
    const editEntityButton = screen.getByText(editEntityButtonText);
    await userEvent.click(editEntityButton);
    await expect(openAddEditEntityModal).toBeCalledTimes(1);
  });

  test("EntityCard opens the delete modal on remove click", async () => {
    const removeButton = screen.getByTestId("delete-entity-button");
    await userEvent.click(removeButton);
    expect(openDeleteEntityModal).toBeCalledTimes(1);
  });

  test("EntityCard opens the drawer on edit-details click", async () => {
    const editDetailsButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(editDetailsButton);
    expect(mockOpenDrawer).toBeCalledTimes(1);
  });
});

describe("Test Unfinished EntityCard", () => {
  beforeEach(() => {
    render(UnfinishedGenericEntityCardComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("EntityCard is visible", () => {
    expect(screen.getByTestId("entityCard")).toBeVisible();
  });

  test("EntityCard opens the delete modal on remove click", async () => {
    const removeButton = screen.getByTestId("delete-entity-button");
    await userEvent.click(removeButton);
    expect(openDeleteEntityModal).toBeCalledTimes(1);
  });

  test("EntityCard opens the drawer on enter-details click", async () => {
    const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(enterDetailsButton);
    expect(mockOpenDrawer).toBeCalledTimes(1);
  });
});

describe("Test Generic EntityCard accessibility", () => {
  it("Unfinished AccessMeasures EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(UnfinishedGenericEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Completed Generic EntityCard should not have basic accessibility issues", async () => {
    const { container } = render(GenericEntityTypeEntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
