import { render, screen } from "@testing-library/react";
import { Form } from "components";
import {
  mockBadTablesForm,
  mockForm,
  mockTablesForm,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mockOnSubmit = jest.fn();

const formComponent = (form = mockForm) => (
  <RouterWrappedComponent>
    <Form
      id={form.id}
      formJson={form}
      onSubmit={mockOnSubmit}
      validateOnRender={false}
      dontReset={false}
    />
    <button form={form.id} type="submit">
      Submit
    </button>
  </RouterWrappedComponent>
);

describe("<Form />", () => {
  test("Form is visible", () => {
    render(formComponent());
    const form = screen.getByRole("textbox", {
      name: mockForm.fields[0].props.label,
    });
    expect(form).toBeVisible();
  });

  test("form table is visible", () => {
    render(formComponent(mockTablesForm));

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("id", "mock-table-id");

    const tableHeading = screen.getByRole("heading", {
      level: 2,
      name: "Mock table title",
    });
    expect(tableHeading).toBeVisible();

    const verbiageHeading = screen.getByRole("heading", {
      level: 3,
      name: "Mock verbiage title",
    });
    expect(verbiageHeading).toBeVisible();

    const pct = screen.getByText("Mock Percentage: 100%");
    expect(pct).toBeVisible();

    const input = screen.getByRole("textbox", { name: "Heading 2 Mock text" });
    expect(input).toBeVisible();
  });

  test("bad table type is skipped", () => {
    render(formComponent(mockBadTablesForm));

    const table = screen.queryByRole("table");
    expect(table).not.toBeInTheDocument();
  });

  testA11yAct(formComponent());
});
