import { render, screen } from "@testing-library/react";
// components
import { DynamicModalOverlayReportPage } from "components";
// utils
import {
  RouterWrappedComponent,
  mockDynamicModalOverlayReportPageJson,
  mockReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockSetSidebarHidden = jest.fn();

const dynamicModalOverlayReportPageComponent = (
  <RouterWrappedComponent>
    <DynamicModalOverlayReportPage
      route={mockDynamicModalOverlayReportPageJson}
      setSidebarHidden={mockSetSidebarHidden}
    />
  </RouterWrappedComponent>
);

const editEntityButtonText = "Mock enter entity details button text";

describe("<DynamicModalOverlayReportPage />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("modaloverlaypage should render the view", () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(dynamicModalOverlayReportPageComponent);
    expect(screen.getByText(editEntityButtonText)).toBeVisible();
  });
});
