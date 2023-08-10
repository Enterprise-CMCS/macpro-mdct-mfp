import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { axe } from "jest-axe";
//components
import { Sidebar } from "components";

const sidebarComponent = (
  <RouterWrappedComponent>
    <Sidebar isHidden={false} />
  </RouterWrappedComponent>
);

describe("Test Sidebar", () => {
  beforeEach(() => {
    render(sidebarComponent);
  });

  test("Sidebar menu is visible", () => {
    expect(screen.getByText("Report Name")).toBeVisible();
  });
});

describe("Test Sidebar accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sidebarComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
