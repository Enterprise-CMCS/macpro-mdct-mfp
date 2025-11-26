import { render, screen } from "@testing-library/react";
// components
import { ReportPageFooter } from "components";
//utils
import {
  mockForm,
  mockReportStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import userEvent from "@testing-library/user-event";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockReportStore);

const mockRoutes = {
  previousRoute: "/mock-previous-route",
  nextRoute: "/mock-next-route",
};

const mockUseNavigate = jest.fn();

jest.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
}));

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useFindRoute: () => mockRoutes,
}));

const reportPageComponentWithoutForm = (
  <RouterWrappedComponent>
    <ReportPageFooter />
  </RouterWrappedComponent>
);
const reportPageComponentWithForm = (
  <RouterWrappedComponent>
    <ReportPageFooter form={mockForm} />
  </RouterWrappedComponent>
);

describe("<ReportPageFooter />", () => {
  test("Should render without a form", () => {
    render(reportPageComponentWithoutForm);
    expect(screen.getByText("Continue")).toBeVisible();
  });

  test("Should render with a form", () => {
    render(reportPageComponentWithForm);
    expect(screen.getByText("Continue")).toBeVisible();
  });

  test("Should render a submit button for state users", () => {
    mockedUseStore.mockReturnValue({
      user: { userIsEndUser: true },
      ...mockReportStore,
    });
    render(reportPageComponentWithForm);
    expect(screen.getByText("Continue")).toHaveAttribute("type", "submit");
  });

  test("Should render only a navigation button for admins", () => {
    mockedUseStore.mockReturnValue({
      user: { userIsAdmin: true },
      ...mockReportStore,
    });
    render(reportPageComponentWithForm);
    expect(screen.getByText("Continue")).not.toHaveAttribute("type", "submit");
  });

  test("Should navigate to the previous route when clicking the Previous button", async () => {
    render(reportPageComponentWithForm);
    const prevButton = screen.getByRole("button", { name: "Previous" });

    await userEvent.click(prevButton);
    expect(mockUseNavigate).toHaveBeenCalledWith(mockRoutes.previousRoute);
  });

  test("Should navigate to the next route when clicking Continue as admin user", async () => {
    mockedUseStore.mockReturnValue({
      user: { userIsAdmin: true },
      ...mockReportStore,
    });

    render(reportPageComponentWithForm);
    const nextButton = screen.getByRole("button", { name: "Continue" });

    await userEvent.click(nextButton);
    expect(mockUseNavigate).toHaveBeenCalledWith(mockRoutes.nextRoute);
  });

  describe("Without form", () => {
    testA11yAct(reportPageComponentWithoutForm);
  });

  describe("With form", () => {
    testA11yAct(reportPageComponentWithForm);
  });
});
