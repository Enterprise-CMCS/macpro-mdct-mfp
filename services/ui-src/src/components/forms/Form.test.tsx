import { render, screen } from "@testing-library/react";
import { Form } from "components";
import {
  mockBadTablesForm,
  mockForm,
  mockTablesForm,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import { mockAdminUser, mockStateUser } from "utils/testing/mockUsers";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Form is visible and disabled by default", () => {
    mockedUseStore.mockReturnValue({});
    render(formComponent());
    const form = screen.getByRole("textbox", {
      name: mockForm.fields[0].props.label,
    });
    expect(form).toBeVisible();
    expect(form).toBeDisabled();
  });

  test("Form is enabled for state users", () => {
    mockedUseStore.mockReturnValue(mockStateUser);
    render(formComponent());
    const form = screen.getByRole("textbox", {
      name: mockForm.fields[0].props.label,
    });
    expect(form).toBeVisible();
    expect(form).toBeEnabled();
  });

  test("Form is enabled for admin users when specified", () => {
    mockedUseStore.mockReturnValue(mockAdminUser);
    const mockFormEditableByAdmins = {
      ...mockForm,
      editableByAdmins: true,
    };
    render(formComponent(mockFormEditableByAdmins));
    const form = screen.getByRole("textbox", {
      name: mockForm.fields[0].props.label,
    });
    expect(form).toBeVisible();
    expect(form).toBeEnabled();
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
