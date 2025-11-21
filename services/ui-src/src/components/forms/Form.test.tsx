import { render, screen } from "@testing-library/react";
import { Form } from "components";
import { mockForm, RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

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

describe("<Form />", () => {
  test("Form is visible", () => {
    render(formComponent);
    const form = screen.getByText(mockForm.fields[0].props.label);
    expect(form).toBeVisible();
  });

  testA11yAct(formComponent);
});
