import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext, ModalDrawerReportPage } from "components";
// utils
import {
  mockModalDrawerReportPageJson,
  mockTargetPopulationsReportPageJson,
  mockUseStore,
  mockWPFullReport,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import {
  getDefaultTargetPopulationNames,
  saveAndCloseText,
} from "../../constants";
// types
import {
  ModalDrawerReportPageShape,
  ReportContextShape,
  ReportShape,
} from "types";
import { AnyObject } from "yup/lib/types";
import { testA11y } from "utils/testing/commonTests";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

const {
  addEntityButtonText,
  editEntityButtonText,
  enterEntityDetailsButtonText,
  deleteModalConfirmButtonText,
} = mockModalDrawerReportPageJson.verbiage;

const modalDrawerReportPageComponent = (
  context: ReportContextShape,
  reportJson: ModalDrawerReportPageShape
) => (
  <RouterWrappedComponent>
    <ReportContext.Provider value={context}>
      <ModalDrawerReportPage route={reportJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const defaultTargetPopulationNames = getDefaultTargetPopulationNames();
const mockTPIncomplete: any[] = [];
defaultTargetPopulationNames.forEach((index) => {
  const population = {
    id: `mock-entity-id-${index}`,
    initiative_wpTopic: [
      {
        key: "initiative_wpTopic",
        value: "defaultTargetPopulationNames[0]",
      },
    ],
    name: `entity-name-${index}`,
    transitionBenchmarks_targetPopulationName: defaultTargetPopulationNames[0],
  };
  mockTPIncomplete.push(population);
});

const mockTPIncompleteFieldData = {
  targetPopulations: mockTPIncomplete,
};

const mockTPNA = mockTPIncompleteFieldData.targetPopulations.map(
  (population) => {
    return {
      ...population,
      transitionBenchmarks_applicableToMfpDemonstration: [
        {
          key: "mock-is-not-applicable",
          value: "No",
        },
      ],
    };
  }
);

const mockTargetPopulationsNAFieldData = {
  targetPopulations: mockTPNA,
};

const mockReportContextGivenFieldData = (fieldData: AnyObject) => {
  return {
    ...mockWpReportContext,
    report: {
      ...mockWPFullReport,
      fieldData: fieldData,
    },
  };
};

const mockReportStoreGivenFieldData = (fieldData: AnyObject) => {
  return {
    ...mockUseStore,
    report: {
      ...(mockWPFullReport as ReportShape),
      fieldData: fieldData,
    },
  };
};

describe("<ModelDrawerReportPage />", () => {
  describe("Test ModalDrawerReportPage without entities", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockReportStoreGivenFieldData({}));
      render(
        modalDrawerReportPageComponent(
          mockWpReportContext,
          mockModalDrawerReportPageJson
        )
      );
    });

    test("should render the view", () => {
      expect(screen.getByText(addEntityButtonText)).toBeVisible();
    });
  });

  describe("Test ModalDrawerReportPage with target populations", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const alertText =
      "You must have at least one default target population applicable to your MFP Demonstration";
    test("should render the view", () => {
      mockedUseStore.mockReturnValue(
        mockReportStoreGivenFieldData(mockTPIncompleteFieldData)
      );
      render(
        modalDrawerReportPageComponent(
          mockReportContextGivenFieldData(mockTPIncompleteFieldData),
          mockTargetPopulationsReportPageJson
        )
      );
      expect(screen.getByText(addEntityButtonText)).toBeVisible();
      expect(screen.queryByText(alertText)).not.toBeInTheDocument();
    });

    test("should render the alert when no default populations are applicable", () => {
      mockedUseStore.mockReturnValue(
        mockReportStoreGivenFieldData(mockTargetPopulationsNAFieldData)
      );
      render(
        modalDrawerReportPageComponent(
          mockReportContextGivenFieldData(mockTargetPopulationsNAFieldData),
          mockTargetPopulationsReportPageJson
        )
      );
      expect(screen.getByText(addEntityButtonText)).toBeVisible();
      expect(screen.getByText(alertText)).toBeVisible();
    });
  });

  describe("Test ModalDrawerReportPage with entities", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(
        modalDrawerReportPageComponent(
          mockWpReportContext,
          mockModalDrawerReportPageJson
        )
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("ModalDrawerReportPage should render the view", () => {
      expect(screen.getByText(addEntityButtonText)).toBeVisible();
    });

    test("ModalDrawerReportPage Modal opens correctly", async () => {
      const addEntityButton = screen.getByText(addEntityButtonText);
      await userEvent.click(addEntityButton);
      expect(screen.getByRole("dialog")).toBeVisible();

      const closeButton = screen.getByText("Cancel");
      await userEvent.click(closeButton);
    });

    test("ModalDrawerReportPage Edit Modal opens correctly", async () => {
      const editEntityButton = screen.getByText(editEntityButtonText);
      await userEvent.click(editEntityButton);
      expect(screen.getByRole("dialog")).toBeVisible();

      const closeButton = screen.getByText("Cancel");
      await userEvent.click(closeButton);
    });

    test("ModalDrawerReportPage opens the delete modal on remove click", async () => {
      const addEntityButton = screen.getByText(addEntityButtonText);
      const removeButton = screen.getByTestId("delete-entity");
      await userEvent.click(removeButton);
      // click delete in modal
      const deleteButton = screen.getByText(deleteModalConfirmButtonText);
      await userEvent.click(deleteButton);

      // verify that the field is removed
      const inputBoxLabelAfterRemove = screen.queryAllByTestId("test-label");
      expect(inputBoxLabelAfterRemove).toHaveLength(0);
      expect(addEntityButton).toBeVisible();
    });

    test("ModalDrawerReportPage opens the drawer on enter-details click", async () => {
      const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
      await userEvent.click(enterDetailsButton);
      expect(screen.getByRole("dialog")).toBeVisible();
    });

    test("ModalDrawerReportPage sidedrawer opens and saves for state user", async () => {
      const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
      await userEvent.click(launchDrawerButton);
      expect(screen.getByRole("dialog")).toBeVisible();

      const textField = await screen.getByLabelText("mock drawer text field");
      await userEvent.type(textField, "test");
      const saveAndCloseButton = screen.getByText(saveAndCloseText);
      await userEvent.click(saveAndCloseButton);
      expect(mockWpReportContext.updateReport).toHaveBeenCalledTimes(1);
    });

    test("Submit sidedrawer doesn't autosave if no change was made by State User", async () => {
      const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
      await userEvent.click(launchDrawerButton);
      expect(screen.getByRole("dialog")).toBeVisible();
      const saveAndCloseButton = screen.getByText(saveAndCloseText);
      await userEvent.click(saveAndCloseButton);
      expect(mockWpReportContext.updateReport).toHaveBeenCalledTimes(0);
    });
  });

  testA11y(
    modalDrawerReportPageComponent(
      mockWpReportContext,
      mockModalDrawerReportPageJson
    ),
    () => {
      mockedUseStore.mockReturnValue(mockUseStore);
    }
  );
});
