import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Form } from "components";
import {
  mockForm,
  mockNonFieldForm,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockOnSubmit = jest.fn();

const formComponent = (
  <RouterWrappedComponent>
    <Form
      id={mockForm.id}
      formJson={mockForm}
      onSubmit={mockOnSubmit}
      validateOnRender={false}
      dontReset={false}
    />
    <button form={mockForm.id} type="submit">
      Submit
    </button>
  </RouterWrappedComponent>
);

const formComponentJustHeader = (
  <RouterWrappedComponent>
    <Form
      id={mockNonFieldForm.id}
      formJson={mockNonFieldForm}
      onSubmit={mockOnSubmit}
      validateOnRender={false}
      dontReset={false}
    />
    <button form={mockNonFieldForm.id} type="submit">
      Submit
    </button>
  </RouterWrappedComponent>
);

describe("Test Form component", () => {
  test("Form is visible", () => {
    render(formComponent);
    const form = screen.getByText(mockForm.fields[0].props.label);
    expect(form).toBeVisible();
  });
});

describe("Test Form accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(formComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
