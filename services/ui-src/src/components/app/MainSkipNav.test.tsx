import { render, screen } from "@testing-library/react";
//components
import { MainSkipNav } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const mainSkipNav = <MainSkipNav />;

describe("<MainSkipNav />", () => {
  test("should be visible and focusable", async () => {
    render(mainSkipNav);
    const skipNav = document.getElementById("skip-nav-main")!;
    skipNav.focus();

    const skipNavLink = screen.getByText("Skip to main content");
    await expect(skipNavLink).toHaveFocus();
    await expect(skipNavLink).toBeVisible();
    await expect(skipNavLink).toHaveAttribute("href", "#main-content");
  });

  testA11yAct(mainSkipNav);
});
