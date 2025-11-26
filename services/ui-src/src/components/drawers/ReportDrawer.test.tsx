import { render, screen } from "@testing-library/react";
//components
import {
  mockDrawerForm,
  mockEmptyDrawerForm,
  mockGenericEntity,
  mockModalDrawerReportPageVerbiage,
  mockStateUserStore,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
// utils
import { useStore } from "utils";
// constants
import { saveAndCloseText } from "../../constants";
import { ReportDrawer } from "./ReportDrawer";
import { testA11yAct } from "utils/testing/commonTests";

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

const drawerComponentWithoutFormFields = (
  <ReportDrawer
    verbiage={mockModalDrawerReportPageVerbiage}
    selectedEntity={mockGenericEntity}
    form={mockEmptyDrawerForm}
    onSubmit={mockOnSubmit}
    drawerDisclosure={mockDrawerDisclosure}
  />
);

describe("<ReportDrawer />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("Should render save text if form is editable", async () => {
    mockUseStore.editable = true;
    mockedUseStore.mockReturnValue(mockUseStore);
    render(drawerComponent);
    expect(screen.getByText(saveAndCloseText)).toBeVisible();
  });

  test("Should not render save text if form is not editable", async () => {
    mockUseStore.editable = false;
    mockedUseStore.mockReturnValue(mockUseStore);
    render(drawerComponent);
    expect(screen.queryByText(saveAndCloseText)).not.toBeInTheDocument();
  });

  test("Should render save text for state user", async () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(drawerComponentWithoutFormFields);
    expect(
      screen.getByText(mockModalDrawerReportPageVerbiage.drawerNoFormMessage)
    ).toBeVisible();
  });

  testA11yAct(drawerComponent, () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
  });
});
