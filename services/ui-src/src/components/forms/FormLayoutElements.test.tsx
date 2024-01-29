import { render, screen } from "@testing-library/react";
import { SectionHeader, SectionContent } from "./FormLayoutElements";

describe("Section header", () => {
  test("should render content", () => {
    const props = {
      content: "mock content",
    };

    render(<SectionHeader {...props} />);

    expect(screen.getByText("mock content")).toBeVisible();
  });

  test("should pass through props", () => {
    const props = {
      id: "mock-id",
      content: "mock content",
    };

    const { container } = render(<SectionHeader {...props} />);

    expect(container.querySelector("#mock-id")).toBeVisible();
  });
});

describe("Section content", () => {
  test("should render content", () => {
    const props = {
      content: "mock content",
    };

    render(<SectionContent {...props} />);

    expect(screen.getByText("mock content")).toBeVisible();
  });
});
