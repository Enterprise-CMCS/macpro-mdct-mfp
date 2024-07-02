import { render } from "@testing-library/react";
import { PageTemplate } from "components";
import { testA11y } from "utils/testing/commonTests";

const standardPageComponent = (
  <PageTemplate data-testid="page-template">
    <p>Test text</p>
  </PageTemplate>
);

const reportPageComponent = (
  <PageTemplate type="standard" data-testid="page-template">
    <p>Test text</p>
  </PageTemplate>
);

describe("<PageTemplate />", () => {
  describe("standard", () => {
    test("Check that PageTemplate (standard) renders", () => {
      const { getByTestId } = render(standardPageComponent);
      expect(getByTestId("page-template")).toBeVisible();
    });

    testA11y(standardPageComponent);
  });

  describe("report", () => {
    test("Check that PageTemplate (report) renders", () => {
      const { getByTestId } = render(reportPageComponent);
      expect(getByTestId("page-template")).toBeVisible();
    });

    testA11y(reportPageComponent);
  });
});
