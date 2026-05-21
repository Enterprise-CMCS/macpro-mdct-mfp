import { render, screen } from "@testing-library/react";
// components
import { ErrorMessage } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const errorMessageComponent = (message?: any) => (
  <ErrorMessage id="mock__error" message={message} />
);

describe("<ErrorMessage />", () => {
  test("error message is visible", () => {
    render(errorMessageComponent("Mock error message"));

    const message = screen.getByRole("paragraph");
    expect(message).toHaveAttribute("id", "mock__error");
    expect(message).toHaveTextContent("Error: Mock error message");
  });

  test("error message is not visible", async () => {
    render(errorMessageComponent());

    const text = screen.queryByRole("paragraph");
    expect(text).not.toBeInTheDocument();
  });

  testA11yAct(errorMessageComponent("Mock error message"));
});
