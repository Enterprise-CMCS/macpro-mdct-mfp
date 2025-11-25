import { render, screen } from "@testing-library/react";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { LoginIDM } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const loginIDMComponent = (
  <RouterWrappedComponent>
    <LoginIDM />
  </RouterWrappedComponent>
);

describe("<LoginIDM />", () => {
  test("LoginIDM is visible", () => {
    render(loginIDMComponent);
    const loginButton = screen.getByRole("button");
    expect(loginButton).toBeVisible();
  });

  testA11yAct(loginIDMComponent);
});
