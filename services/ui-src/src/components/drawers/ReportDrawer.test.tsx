import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import {
  mockAdminUserStore,
  mockDrawerForm,
  mockEmptyDrawerForm,
  mockGenericEntity,
  mockModalDrawerReportPageVerbiage,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
// utils
import { useStore } from "utils";
// constants
import { saveAndCloseText } from "../../constants";
import { ReportDrawer } from "./ReportDrawer";

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: mockOnClose,
};

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const drawerComponent = (
  <RouterWrappedComponent>
    <ReportDrawer
      verbiage={mockModalDrawerReportPageVerbiage}
      selectedEntity={mockGenericEntity}
      form={mockDrawerForm}
      onSubmit={mockOnSubmit}
      drawerDisclosure={mockDrawerDisclosure}
    />
  </RouterWrappedComponent>
);

describe("Test ReportDrawer rendering", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Should render save text for state user", async () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(drawerComponent);
    expect(screen.getByText(saveAndCloseText)).toBeVisible();
  });

  it("Should not render save text for admin user", async () => {
    mockedUseStore.mockReturnValue(mockAdminUserStore);
    render(drawerComponent);
    expect(screen.queryByText(saveAndCloseText)).not.toBeInTheDocument();
  });
});

const drawerComponentWithoutFormFields = (
  <ReportDrawer
    verbiage={mockModalDrawerReportPageVerbiage}
    selectedEntity={mockGenericEntity}
    form={mockEmptyDrawerForm}
    onSubmit={mockOnSubmit}
    drawerDisclosure={mockDrawerDisclosure}
  />
);

describe("Test ReportDrawerWithoutFormFields rendering", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Should render save text for state user", async () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(drawerComponentWithoutFormFields);
    expect(
      screen.getByText(mockModalDrawerReportPageVerbiage.drawerNoFormMessage)
    ).toBeVisible();
  });
});

describe("Test ReportDrawer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    const { container } = render(drawerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    jest.clearAllMocks();
  });
});
