import { render, screen } from "@testing-library/react";
import { StatusIcon } from "./StatusIcon";
// types
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11y } from "utils/testing/commonTests";

const statusIconComponent = (
  <RouterWrappedComponent>
    <StatusIcon status={true} />
  </RouterWrappedComponent>
);

const statusIconComponentIncomplete = (
  <RouterWrappedComponent>
    <StatusIcon status={false} />
  </RouterWrappedComponent>
);

const statusIconComponentTest = (
  <RouterWrappedComponent>
    <StatusIcon />
  </RouterWrappedComponent>
);

describe("<StatusIcon />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render the correct status for complete rows", () => {
    render(statusIconComponent);

    const icon = screen.getByRole("img");
    expect(icon).not.toHaveAttribute("alt", "Error notification");
    expect(icon).toHaveAttribute("alt", "Success notification");
  });

  test("should render the correct status for incomplete rows", () => {
    render(statusIconComponentIncomplete);

    const icon = screen.getByRole("img");
    expect(icon).toHaveAttribute("alt", "Error notification");
    expect(icon).not.toHaveAttribute("alt", "Success notification");
  });

  test("should not render an image component if status is undefined", () => {
    render(statusIconComponentTest);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  testA11y(statusIconComponent);
});
