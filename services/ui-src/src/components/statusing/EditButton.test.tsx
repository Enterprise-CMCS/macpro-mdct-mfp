import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { EditButton } from "./EditButton";

const EditButtonComponentNotEditable = (
  <RouterWrappedComponent>
    <EditButton buttonAriaLabel="label" path="" editable={false} />
  </RouterWrappedComponent>
);

const EditButtonComponent = (
  <RouterWrappedComponent>
    <EditButton buttonAriaLabel="label" path="" editable={true} />
  </RouterWrappedComponent>
);

describe("EditButton", () => {
  test("check text when not editable", () => {
    render(EditButtonComponentNotEditable);
    expect(screen.getByText("View")).toBeVisible();
  });

  test("check text when editable", () => {
    render(EditButtonComponent);
    expect(screen.getByText("Edit")).toBeVisible();
  });
});

describe("Test EditButton accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(EditButtonComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
