import { render, screen } from "@testing-library/react";
//components
import { Alert } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const alertComponent = (
  <Alert
    title="Test alert!"
    description="This is for testing."
    link="test-link"
    data-testid="test-alert"
  />
);

describe("<Alert />", () => {
  test("Alert is visible", () => {
    render(alertComponent);
    expect(screen.getByTestId("test-alert")).toBeVisible();
  });

  testA11yAct(alertComponent);
});
