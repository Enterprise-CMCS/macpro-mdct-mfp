import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
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

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockReportStore);

const mockRoutes = {
  previousRoute: "/mock-previous-route",
  nextRoute: "/mock-next-route",
};

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
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

describe("ReportPageFooter behavior", () => {
  it("Should render without a form", () => {
    render(reportPageComponentWithoutForm);
    expect(screen.getByText("Continue")).toBeVisible();
  });

  it("Should render with a form", () => {
    render(reportPageComponentWithForm);
    expect(screen.getByText("Continue")).toBeVisible();
  });

  it("Should render a submit button for state users", () => {
    mockedUseStore.mockReturnValue({
      user: { userIsEndUser: true },
      ...mockReportStore,
    });
    render(reportPageComponentWithForm);
    expect(screen.getByText("Continue")).toHaveAttribute("type", "submit");
  });

  it("Should render only a navigation button for admins", () => {
    mockedUseStore.mockReturnValue({
      user: { userIsAdmin: true },
      ...mockReportStore,
    });
    render(reportPageComponentWithForm);
    expect(screen.getByText("Continue")).not.toHaveAttribute("type", "submit");
  });

  it("Should navigate to the previous route when clicking the Previous button", async () => {
    render(reportPageComponentWithForm);
    const prevButton = screen.getByRole("button", { name: "Previous" });

    await userEvent.click(prevButton);
    expect(mockUseNavigate).toHaveBeenCalledWith(mockRoutes.previousRoute);
  });

  it("Should navigate to the next route when clicking Continue as admin user", async () => {
    mockedUseStore.mockReturnValue({
      user: { userIsAdmin: true },
      ...mockReportStore,
    });

    render(reportPageComponentWithForm);
    const nextButton = screen.getByRole("button", { name: "Continue" });

    await userEvent.click(nextButton);
    expect(mockUseNavigate).toHaveBeenCalledWith(mockRoutes.nextRoute);
  });
});

describe("Test ReportPageFooter accessibility", () => {
  test("ReportPageFooter without form should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponentWithoutForm);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ReportPageFooter with form should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponentWithForm);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
