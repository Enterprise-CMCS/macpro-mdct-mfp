import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { StandardReportPage } from "components";
// utils
import {
  mockStandardReportPageJson,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

const standardPageSectionComponent = (
  <RouterWrappedComponent>
    <StandardReportPage route={mockStandardReportPageJson} />
  </RouterWrappedComponent>
);

describe("Test StandardReportPage", () => {
  test("StandardReportPage view renders", () => {
    render(standardPageSectionComponent);
    // Check that the header rendered
    expect(
      screen.getByText(mockStandardReportPageJson.verbiage.intro.section)
    ).toBeVisible();

    // Check that the form reendered
    expect(
      screen.getByText(mockStandardReportPageJson.form.fields[0].props.label)
    ).toBeVisible();

    // Check that the footer rendered
    expect(
      screen.getByRole("button", {
        name: /Previous/,
      })
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: /Continue/,
      })
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
