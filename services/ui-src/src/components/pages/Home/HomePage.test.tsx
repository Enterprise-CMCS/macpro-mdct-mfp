import { render, screen } from "@testing-library/react";
// components
import { HomePage } from "components";
// utils
import { mockLDFlags, RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11y } from "utils/testing/commonTests";

const homeView = (
  <RouterWrappedComponent>
    <HomePage />
  </RouterWrappedComponent>
);

mockLDFlags.setDefault({ wpReport: true, sarReport: true });

describe("<HomePage />", () => {
  test("Check that HomePage renders", () => {
    render(homeView);
    expect(screen.getByTestId("home-view")).toBeVisible();
  });

  testA11y(homeView);
});
