import { render, screen } from "@testing-library/react";
import { StatusIcon } from "./StatusIcon";
// types
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const statusIconComponent = (status?: boolean, hideSuccess?: boolean) => (
  <RouterWrappedComponent>
    <StatusIcon status={status} hideSuccess={hideSuccess} />
  </RouterWrappedComponent>
);

describe("<StatusIcon />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render the correct status for complete rows", () => {
    render(statusIconComponent(true));

    const icon = screen.getByRole("img");
    expect(icon).not.toHaveAttribute("alt", "Error notification");
    expect(icon).toHaveAttribute("alt", "Success notification");
  });

  test("should render the correct status for incomplete rows", () => {
    render(statusIconComponent(false));

    const icon = screen.getByRole("img");
    expect(icon).toHaveAttribute("alt", "Error notification");
    expect(icon).not.toHaveAttribute("alt", "Success notification");
  });

  test("should not render an image component if status is undefined", () => {
    render(statusIconComponent());
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("should not render an image component if hideSuccess", () => {
    render(statusIconComponent(true, true));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  testA11yAct(statusIconComponent(true));
});
