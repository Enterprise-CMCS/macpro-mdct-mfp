import { render, screen } from "@testing-library/react";
import { PageTemplate } from "components";
import { testA11y } from "utils/testing/commonTests";

const standardPageComponent = (
  <PageTemplate>
    <p>Test text</p>
  </PageTemplate>
);

const reportPageComponent = (
  <PageTemplate section={false} type="report">
    <p>Test text</p>
  </PageTemplate>
);

describe("<PageTemplate />", () => {
  describe("standard", () => {
    test("Check that PageTemplate (standard) renders", () => {
      const { container } = render(standardPageComponent);
      const firstElement = container.firstElementChild as Element;
      expect(firstElement.tagName).toBe("SECTION");
      expect(screen.getByText("Test text")).toBeVisible();
    });

    testA11y(standardPageComponent);
  });

  describe("report", () => {
    test("Check that PageTemplate (report) renders", () => {
      const { container } = render(reportPageComponent);
      const firstElement = container.firstElementChild as Element;
      expect(firstElement.tagName).toBe("DIV");
      expect(screen.getByText("Test text")).toBeVisible();
    });

    testA11y(reportPageComponent);
  });
});
