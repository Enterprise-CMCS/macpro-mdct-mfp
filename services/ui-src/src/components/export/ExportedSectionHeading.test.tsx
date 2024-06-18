import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedSectionHeading } from "components";
// utils
import {
  mockWpReportContext,
  mockVerbiageIntro,
} from "utils/testing/setupJest";
import { ReportPageVerbiage } from "types";
import { SAR_RET, WP_SAR_STATE_OR_TERRITORY } from "./ExportedSectionHeading";

const mockSectionHeading = {
  heading: "mock-heading",
  verbiage: {
    intro: mockVerbiageIntro,
  },
};
const { heading, verbiage } = mockSectionHeading;

const retVerbiage = {
  intro: {
    section: SAR_RET,
    info: [
      { type: "h3", content: "this text should be filtered out" },
      { type: "span", content: "this text should be visible" },
    ],
  },
};
const stateOrTerritoryVerbiage = {
  intro: {
    section: "",
    subsection: WP_SAR_STATE_OR_TERRITORY,
    hint: "this is a hint",
  },
};

const exportedReportSectionHeadingComponent = (
  verbiage: ReportPageVerbiage
) => {
  return (
    <ReportContext.Provider value={mockWpReportContext}>
      <ExportedSectionHeading heading={heading} verbiage={verbiage} />
    </ReportContext.Provider>
  );
};

describe("ExportedSectionHeading renders", () => {
  test("ExportedSectionHeading renders", () => {
    const { getByTestId } = render(
      exportedReportSectionHeadingComponent(verbiage)
    );
    const sectionHeading = getByTestId("exportedSectionHeading");
    expect(sectionHeading).toBeVisible();
  });
});

describe("ExportedSectionHeading displays correct heading", () => {
  test("Correct heading text is shown", () => {
    render(exportedReportSectionHeadingComponent(verbiage));
    const sectionHeading = screen.getByText(heading);
    expect(sectionHeading).toBeVisible();
  });
  test("Correct heading text is shown for R,E & T", () => {
    render(exportedReportSectionHeadingComponent(retVerbiage));
    const sectionHeading = screen.getByText(
      retVerbiage?.intro?.info[1].content
    );
    expect(sectionHeading).toBeVisible();
  });
  test("Correct heading text is shown for State or Territory-Specific Initiatives", () => {
    render(exportedReportSectionHeadingComponent(stateOrTerritoryVerbiage));
    expect(
      screen.queryByText(stateOrTerritoryVerbiage.intro.subsection)
    ).not.toBeInTheDocument();
  });
});

describe("Test ExportedSectionHeading accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      exportedReportSectionHeadingComponent(verbiage)
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
