import { render, screen } from "@testing-library/react";
//components
import { Alert } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const alertComponent = (
  <Alert
    title="Test alert!"
    description="This is for testing."
    link="test-link"
  />
);

describe("<Alert />", () => {
  test("Alert is visible", () => {
    render(alertComponent);
    expect(screen.getByRole("heading", { name: "Test alert!" })).toBeVisible();
    expect(screen.getByRole("link", { name: "test-link" })).toBeVisible();
  });

  testA11yAct(alertComponent);
});
