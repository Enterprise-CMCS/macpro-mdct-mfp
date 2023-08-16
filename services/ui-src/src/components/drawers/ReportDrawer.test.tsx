import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import {
  mockAdminUser,
  mockDrawerForm,
  mockEmptyDrawerForm,
  mockGenericEntity,
  mockModalDrawerReportPageVerbiage,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
// utils
import { useUser } from "utils";
// constants
import { saveAndCloseText } from "../../constants";
import { ReportDrawer } from "./ReportDrawer";

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: mockOnClose,
};

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

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
    mockedUseUser.mockReturnValue(mockStateUser);
    render(drawerComponent);
    expect(screen.getByText(saveAndCloseText)).toBeVisible();
  });

  it("Should not render save text for admin user", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
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
    mockedUseUser.mockReturnValue(mockStateUser);
    render(drawerComponentWithoutFormFields);
    expect(
      screen.getByText(mockModalDrawerReportPageVerbiage.drawerNoFormMessage)
    ).toBeVisible();
  });
});

describe("Test ReportDrawer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { container } = render(drawerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    jest.clearAllMocks();
  });
});
