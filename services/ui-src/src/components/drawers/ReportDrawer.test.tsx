import { render, screen } from "@testing-library/react";
import { MockedFunction } from "vitest";
//components
import {
  mockDrawerForm,
  mockEmptyDrawerForm,
  mockGenericEntity,
  mockModalDrawerReportPageVerbiage,
  mockStateUserStore,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupTest";
// utils
import { useStore } from "utils";
// constants
import { saveAndCloseText } from "../../constants";
import { ReportDrawer } from "./ReportDrawer";
import { testA11yAct } from "utils/testing/commonTests";

const mockOnClose = vi.fn();
const mockOnSubmit = vi.fn();

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: mockOnClose,
};

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;

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
    vi.clearAllMocks();
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
