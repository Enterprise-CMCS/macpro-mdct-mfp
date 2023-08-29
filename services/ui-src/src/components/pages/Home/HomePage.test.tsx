import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { HomePage } from "components";
// utils
import { mockLDFlags, RouterWrappedComponent } from "utils/testing/setupJest";

const homeView = (
  <RouterWrappedComponent>
    <HomePage />
  </RouterWrappedComponent>
);

mockLDFlags.setDefault({ wpReport: true, sarReport: true });

describe("Test HomePage", () => {
  beforeEach(() => {
    render(homeView);
  });

  test("Check that HomePage renders", () => {
    expect(screen.getByTestId("home-view")).toBeVisible();
  });
});

describe("Test HomePage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(homeView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
