import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportPageFooter } from "components";
//utils
import { mockForm } from "utils/testing/setupJest";

const reportPageComponentWithoutForm = <ReportPageFooter />;
const reportPageComponentWithForm = <ReportPageFooter form={mockForm} />;

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
