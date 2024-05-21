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

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockReportStore);

const mockRoutes = {
  previousRoute: "/mock-previous-route",
  nextRoute: "/mock-next-route",
};

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
