import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportPageFooter } from "components";
//utils
import { mockForm, RouterWrappedComponent } from "utils/testing/setupJest";

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

describe("Test ReportPageFooter without form", () => {
  test("Check that ReportPageFooter without form renders", () => {
    render(reportPageComponentWithoutForm);
    expect(screen.getByText("Continue")).toBeVisible();
  });

  test("Check that ReportPageFooter with form renders", () => {
    render(reportPageComponentWithForm);
    expect(screen.getByText("Continue")).toBeVisible();
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
