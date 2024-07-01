import { render, screen } from "@testing-library/react";
// components
import { HelpPage } from "components/pages/HelpPage/HelpPage";
import { testA11y } from "utils/testing/commonTests";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// verbiage
import verbiage from "verbiage/pages/help";

const helpView = (
  <RouterWrappedComponent>
    <HelpPage />
  </RouterWrappedComponent>
);

describe("<HelpPage />", () => {
  beforeEach(() => {
    render(helpView);
  });

  test("Check that HelpPage renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
  });

  testA11y(helpView);
});
