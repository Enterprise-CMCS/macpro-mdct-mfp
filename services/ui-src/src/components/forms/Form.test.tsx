import { render, screen, within } from "@testing-library/react";
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

  test("form tables are visible", () => {
    render(formComponent(mockTablesForm));

    const tables = screen.getAllByRole("table");
    expect(tables).toHaveLength(2);

    const calculationTable = tables[0];
    expect(calculationTable).toHaveAttribute(
      "id",
      "mockFormId_mockCalculationTableId"
    );

    const calculationTableHeading = screen.getByRole("heading", {
      level: 2,
      name: "Mock calculation table title",
    });
    expect(calculationTableHeading).toBeVisible();

    const calculationPct = screen.getByText("Mock Percentage: 100%");
    expect(calculationPct).toBeVisible();

    const calculationInput = within(calculationTable).getByRole("textbox", {
      name: "Heading 2 Mock text",
    });
    expect(calculationInput).toBeVisible();

    const summationTable = tables[1];
    expect(summationTable).toHaveAttribute(
      "id",
      "mockFormId_mockSummationTableId"
    );

    const summationTableHeading = screen.getByRole("heading", {
      level: 2,
      name: "Mock summation table title",
    });
    expect(summationTableHeading).toBeVisible();

    const summationInput = within(summationTable).getByRole("textbox", {
      name: "Heading 2 Mock text",
    });
    expect(summationInput).toBeVisible();

    const fieldHeading = screen.getByRole("heading", {
      level: 3,
      name: "Mock field title",
    });
    expect(fieldHeading).toBeVisible();
  });

  test("bad table type is skipped", () => {
    render(formComponent(mockBadTablesForm));

    const table = screen.queryByRole("table");
    expect(table).not.toBeInTheDocument();
  });

  testA11yAct(formComponent());
});
