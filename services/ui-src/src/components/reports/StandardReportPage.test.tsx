import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { StandardReportPage } from "components";
// utils
import { mockStandardReportPageJson } from "utils/testing/setupJest";

const standardPageSectionComponent = (
  <StandardReportPage route={mockStandardReportPageJson} />
);

describe("Test StandardReportPage", () => {
  test("StandardReportPage view renders", () => {
    render(standardPageSectionComponent);
    expect(
      screen.getByText(mockStandardReportPageJson.verbiage.intro.section)
    ).toBeVisible();
  });
});

describe("Test StandardReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(standardPageSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
