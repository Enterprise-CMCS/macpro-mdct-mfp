import { render, screen } from "@testing-library/react";
//components
import { SpreadsheetWidget } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const SpreadsheetWidgetComponent = (
  <SpreadsheetWidget
    description="mock-description"
    data-testid="spreadsheet-widget"
  />
);

describe("<SpreadsheetWidget />", () => {
  test("Component is visible", () => {
    render(SpreadsheetWidgetComponent);
    expect(screen.getByTestId("spreadsheet-widget")).toBeVisible();
  });

  testA11yAct(SpreadsheetWidgetComponent);
});
