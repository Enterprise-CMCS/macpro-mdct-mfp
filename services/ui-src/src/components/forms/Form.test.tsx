import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { Form } from "components";
// utils
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import { mockAdminUser, mockStateUser } from "utils/testing/mockUsers";
import {
  mockBadTablesForm,
  mockForm,
  mockTablesForm,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

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

  test("submitting incomplete form shows errors", async () => {
    mockedUseStore.mockReturnValue(mockStateUser);
    render(formComponent());
    const submitButton = screen.getByRole("button", {
      name: "Submit",
    });
    await act(async () => {
      await userEvent.click(submitButton);
    });

    const errorMessage = screen.getAllByText("A response is required");
    expect(errorMessage).toHaveLength(3);
  });

  test("form tables are visible", () => {
    mockedUseStore.mockReturnValue(mockStateUser);
    render(formComponent(mockTablesForm));

    const tables = screen.getAllByRole("table");
    expect(tables).toHaveLength(mockTablesForm.tables.length);

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

    const entityModalTable = tables[2];
    expect(entityModalTable).toHaveAttribute(
      "id",
      "mockFormId_mockEntityModalTableId"
    );

    const entityModalTableHeading = screen.getByRole("heading", {
      level: 4,
      name: "Mock entityModal table title",
    });
    expect(entityModalTableHeading).toBeVisible();

    const entityModalInput = within(entityModalTable).getByRole("textbox", {
      name: "Heading 2 Mock text",
    });
    expect(entityModalInput).toBeVisible();

    const fieldHeading = screen.getByRole("heading", {
      level: 3,
      name: "Mock field title",
    });
    expect(fieldHeading).toBeVisible();
  });

  test("bad table type is skipped", () => {
    mockedUseStore.mockReturnValue(mockStateUser);
    render(formComponent(mockBadTablesForm));

    const table = screen.queryByRole("table");
    expect(table).not.toBeInTheDocument();
  });

  testA11yAct(formComponent());
});
