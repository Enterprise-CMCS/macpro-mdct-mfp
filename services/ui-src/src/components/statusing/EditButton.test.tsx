import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { EditButton } from "./EditButton";

const EditButtonComponentNotEditable = (
  <RouterWrappedComponent>
    <EditButton
      buttonAriaLabel="label"
      path=""
      editable={false}
      showIcon={true}
    />
  </RouterWrappedComponent>
);

const EditButtonComponent = (
  <RouterWrappedComponent>
    <EditButton
      buttonAriaLabel="label"
      path=""
      editable={true}
      showIcon={true}
    />
  </RouterWrappedComponent>
);

describe("EditButton", () => {
  test("EditButton when not editable", () => {
    render(EditButtonComponentNotEditable);
    const viewButton = screen.getByRole("button");
    const viewIcon = screen.getByRole("img");
    expect(viewButton).toHaveTextContent("View");
    expect(viewIcon).toHaveAttribute("alt", "View Program");
  });

  test("EditButton when editable", () => {
    render(EditButtonComponent);
    const editButton = screen.getByRole("button");
    const editIcon = screen.getByRole("img");
    expect(editButton).toHaveTextContent("Edit");
    expect(editIcon).toHaveAttribute("alt", "Edit Program");
  });
});

describe("Test EditButton accessibility", () => {
  test("Should not have basic accessibility issues", async () => {
    const { container } = render(EditButtonComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
