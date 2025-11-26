import { render, screen } from "@testing-library/react";
//components
import { ErrorAlert } from "components";
import { ErrorVerbiage } from "types";
import { genericErrorContent } from "verbiage/errors";
import { testA11yAct } from "utils/testing/commonTests";

const error: ErrorVerbiage = {
  title: "We've run into a problem",
  description: genericErrorContent,
};

const errorAlertComponent = (
  <ErrorAlert error={error} data-testid="test-error-alert" />
);

describe("<ErrorAlert />", () => {
  test("ErrorAlert is visible", () => {
    render(errorAlertComponent);
    expect(screen.getByTestId("test-error-alert")).toBeVisible();
  });

  testA11yAct(errorAlertComponent);
});
