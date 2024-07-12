import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import {
  mockModalDrawerReportPageJson,
  mockGenericEntity,
  mockCompletedGenericFormattedEntityData,
  mockUnfinishedGenericFormattedEntityData,
  mockUseStore,
  mockUseSARStore,
} from "utils/testing/setupJest";
import { EntityStepCard } from "./EntityStepCard";
import { OverlayModalStepTypes } from "types";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

const openAddEditEntityModal = jest.fn();
const openDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();
jest.mock("utils/state/useStore");

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const {
  editEntityButtonText,
  enterEntityDetailsButtonText,
  readOnlyEntityButtonText,
} = mockModalDrawerReportPageJson.verbiage;

const UnfinishedGenericEntityCardComponent = (
  <EntityStepCard
    entity={mockGenericEntity}
    stepType="mock-step-type"
    formattedEntityData={mockUnfinishedGenericFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const GenericEntityTypeEntityCardComponent = (
  <EntityStepCard
    entity={mockGenericEntity}
    stepType="stepType"
    formattedEntityData={mockCompletedGenericFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const DisabledEntityTypeEntityCardComponent = (
  <EntityStepCard
    entity={mockGenericEntity}
    stepType="stepType"
    formattedEntityData={mockCompletedGenericFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
    disabled={true}
  />
);

const UnfinishedEvaluationPlanCardComponent = (
  <EntityStepCard
    entity={mockGenericEntity}
    stepType={OverlayModalStepTypes.EVALUATION_PLAN}
    formattedEntityData={{
      ...mockUnfinishedGenericFormattedEntityData,
      objectiveName: "mock objective name",
      includesTargets: "Yes",
      quarters: [{ id: "2023 Q1", value: "mock quarter text" }],
    }}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const CompletedEvaluationPlanCardComponent = (
  <EntityStepCard
    entity={mockGenericEntity}
    stepType={OverlayModalStepTypes.EVALUATION_PLAN}
    formattedEntityData={mockCompletedGenericFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const UnfinishedFundingSourcesCardComponent = (
  <EntityStepCard
    entity={mockGenericEntity}
    stepType={OverlayModalStepTypes.FUNDING_SOURCES}
    formattedEntityData={{
      ...mockUnfinishedGenericFormattedEntityData,
      quarters: [{ id: "2023 Q1", value: "mock quarter text" }],
    }}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const CompletedFundingSourcesCardComponent = (
  <EntityStepCard
    entity={mockGenericEntity}
    stepType={OverlayModalStepTypes.FUNDING_SOURCES}
    formattedEntityData={{
      ...mockCompletedGenericFormattedEntityData,
      fundingSource: "mock funding source",
      quarters: [
        { id: "2021 Q1", value: "mock quarter text" },
        { id: "2021 Q2", value: "mock quarter text" },
        { id: "2021 Q3", value: "mock quarter text" },
        { id: "2021 Q4", value: "mock quarter text" },
        { id: "2022 Q1", value: "mock quarter text" },
        { id: "2022 Q2", value: "mock quarter text" },
        { id: "2022 Q3", value: "mock quarter text" },
        { id: "2022 Q4", value: "mock quarter text" },
        { id: "2023 Q1", value: "mock quarter text" },
        { id: "2023 Q2", value: "mock quarter text" },
        { id: "2023 Q3", value: "mock quarter text" },
        { id: "2023 Q4", value: "mock quarter text" },
      ],
    }}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openAddEditEntityModal={openAddEditEntityModal}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

const NoOpenAddEditEntityFunction = (
  <EntityStepCard
    entity={mockGenericEntity}
    stepType="mock-step-type"
    formattedEntityData={mockUnfinishedGenericFormattedEntityData}
    verbiage={mockModalDrawerReportPageJson.verbiage}
    openDeleteEntityModal={openDeleteEntityModal}
    openDrawer={mockOpenDrawer}
  />
);

describe("<EntityStepCard />", () => {
  describe("Completed EntityStepCard", () => {
    describe("Renders", () => {
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
        const editDetailsButton = screen.getByText(
          enterEntityDetailsButtonText
        );
        await userEvent.click(editDetailsButton);
        expect(mockOpenDrawer).toBeCalledTimes(1);
      });
    });

    testA11y(GenericEntityTypeEntityCardComponent);
  });

  describe("Unfinished EntityCard", () => {
    describe("Renders", () => {
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
        const enterDetailsButton = screen.getByText(
          enterEntityDetailsButtonText
        );
        await userEvent.click(enterDetailsButton);
        expect(mockOpenDrawer).toBeCalledTimes(1);
      });
    });

    testA11y(UnfinishedGenericEntityCardComponent);
  });

  describe("EntityCard with specific step types", () => {
    test("Unfinished evaluation plan card should have a button to enter details", () => {
      render(UnfinishedEvaluationPlanCardComponent);
      const detailsButton = screen.getByText(enterEntityDetailsButtonText);
      expect(detailsButton).toBeVisible();
    });

    test("Completed evaluation plan card should have a button to edit details", async () => {
      render(CompletedEvaluationPlanCardComponent);
      const detailsButton = screen.getByText(editEntityButtonText);
      expect(detailsButton).toBeVisible();
    });

    test("Unfinished funding sources card should have a button to enter details", () => {
      render(UnfinishedFundingSourcesCardComponent);
      const detailsButton = screen.getByText(enterEntityDetailsButtonText);
      expect(detailsButton).toBeVisible();
    });

    test("Completed funding sources card should have a button to edit details", () => {
      render(CompletedFundingSourcesCardComponent);
      const detailsButton = screen.getByText(editEntityButtonText);
      expect(detailsButton).toBeVisible();
    });

    test("Disabled prop shows correct copy", () => {
      render(DisabledEntityTypeEntityCardComponent);
      const detailsButton = screen.getByText(readOnlyEntityButtonText);
      expect(detailsButton).toBeVisible();
    });
  });

  describe("SAR TESTS", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue(mockUseSARStore);
    });

    test("Completed evaluation plan card should have a button to edit details", async () => {
      render(CompletedEvaluationPlanCardComponent);
      const reportEntityButton = screen.getByTestId("report-button");
      expect(reportEntityButton).toBeVisible();
      await userEvent.click(reportEntityButton);
      await expect(openAddEditEntityModal).toBeCalledTimes(1);
    });

    test("Completed evaluation plan card without OpenAddEditModal function doesn't show a button", async () => {
      render(NoOpenAddEditEntityFunction);
      const reportEntityButton = screen.queryByTestId("report-button");
      expect(reportEntityButton).not.toBeInTheDocument();
    });
  });
});
