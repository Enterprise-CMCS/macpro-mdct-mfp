import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReviewSubmitPage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// verbiage
import verbiage from "verbiage/pages/mfp/mfp-review-and-submit";

const reviewSubmitPageSectionComponent = (
  <RouterWrappedComponent>
    <ReviewSubmitPage />
  </RouterWrappedComponent>
);

describe("Test ReviewSubmitPage", () => {
  test("ReviewSubmitPage view renders", () => {
    render(reviewSubmitPageSectionComponent);
    // Check that the header rendered
    expect(screen.getByText(verbiage.submitted.intro.header)).toBeVisible();
  });
});

describe("Test StandardReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(reviewSubmitPageSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
