import { render, screen } from "@testing-library/react";
// components
import { ReportContext, ExportedSectionHeading } from "components";
// utils
import { mockWpReportContext } from "utils/testing/setupJest";
import { CustomHtmlElement, HeadingLevel } from "types";
import { testA11y } from "utils/testing/commonTests";

const exportedReportSectionHeadingComponent = (
  heading: string,
  headingLevel?: HeadingLevel,
  hint?: string,
  info?: string | CustomHtmlElement[]
) => {
  return (
    <ReportContext.Provider value={mockWpReportContext}>
      <ExportedSectionHeading
        heading={heading}
        hint={hint}
        info={info}
        headingLevel={headingLevel}
      />
    </ReportContext.Provider>
  );
};

describe("<ExportedSectionHeading />", () => {
  test("renders container", () => {
    const { getByTestId } = render(
      exportedReportSectionHeadingComponent("Test Heading")
    );
    const sectionHeading = getByTestId("exportedSectionHeading");
    expect(sectionHeading).toBeVisible();
  });

  test("renders heading level", () => {
    render(exportedReportSectionHeadingComponent("Test Heading"));
    const sectionHeading = screen.getByRole("heading", {
      level: 2,
      name: "Test Heading",
    });
    expect(sectionHeading).toBeVisible();
  });

  test("renders custom heading level", () => {
    render(exportedReportSectionHeadingComponent("Test Heading", "h3"));
    const sectionHeading = screen.getByRole("heading", {
      level: 3,
      name: "Test Heading",
    });
    expect(sectionHeading).toBeVisible();
  });

  test("renders hint", () => {
    render(
      exportedReportSectionHeadingComponent(
        "Test Heading",
        undefined,
        "This is a hint"
      )
    );
    const hint = screen.getByText("This is a hint");
    expect(hint).toBeVisible();
  });

  test("renders info", () => {
    render(
      exportedReportSectionHeadingComponent(
        "Test Heading",
        undefined,
        undefined,
        "This is info"
      )
    );
    const info = screen.getByText("This is info");
    expect(info).toBeVisible();
  });

  testA11y(
    exportedReportSectionHeadingComponent(
      "Test Heading",
      "h2",
      "This is a hint",
      "This is info"
    )
  );
});
