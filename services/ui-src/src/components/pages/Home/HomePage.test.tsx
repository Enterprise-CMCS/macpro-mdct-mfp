import { render, screen } from "@testing-library/react";
// components
import { HomePage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const homeView = (
  <RouterWrappedComponent>
    <HomePage />
  </RouterWrappedComponent>
);

describe("<HomePage />", () => {
  test("Check that HomePage renders", () => {
    render(homeView);
    expect(screen.getByTestId("home-view")).toBeVisible();
  });

  testA11yAct(homeView);
});
