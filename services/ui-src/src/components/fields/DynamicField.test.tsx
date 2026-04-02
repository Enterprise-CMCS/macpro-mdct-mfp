import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
// components
import { DynamicField, EntityProvider, ReportContext } from "components";
// types
import { AnyObject } from "types";
// utils
import { useStore } from "utils";
import {
  mockStateUserStore,
  mockWPReport,
  mockWpReportContext,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mockEntityType = "mock-entity-type";
const mockDynamicField = "mock-dynamic-field";
const mockFieldLabel = "test-label";

const mockReport: AnyObject = mockWPReport;
mockReport.fieldData["mock-entity-type"] = [
  {
    [mockDynamicField]: {
      id: "test-dynamic-field-1",
      name: "test value 1",
    },
  },
  {
    [mockDynamicField]: {
      id: "test-dynamic-field-2",
      name: "test value 2",
    },
  },
];

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  report: mockReport,
  selectedEntity: {
    type: mockEntityType,
  },
  setAutosaveState: jest.fn(),
});

const mockUpdateReport = jest.fn();
const mockedReportContext = {
  ...mockWpReportContext,
  updateReport: mockUpdateReport,
};

const MockForm = ({ dynamicLabel, hint, hydrationValue }: any) => {
  const form = useForm({
    shouldFocusError: false,
  });
  return (
    <ReportContext.Provider value={mockedReportContext}>
      <EntityProvider>
        <FormProvider {...form}>
          <form id="uniqueId" onSubmit={form.handleSubmit(jest.fn())}>
            <DynamicField
              autosave={true}
              dynamicLabel={dynamicLabel}
              hint={hint}
              hydrate={hydrationValue}
              label={mockFieldLabel}
              name={mockDynamicField}
            />
          </form>
        </FormProvider>
      </EntityProvider>
    </ReportContext.Provider>
  );
};

const DynamicFieldComponent = ({ dynamicLabel, hint, hydrationValue }: any) => (
  <MockForm
    dynamicLabel={dynamicLabel}
    hint={hint}
    hydrationValue={hydrationValue}
  />
);

describe("<DynamicField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Test DynamicField component", () => {
    beforeEach(() => {
      render(<DynamicFieldComponent />);
    });

    test("DynamicField is visible", () => {
      const fieldset = screen.getByRole("group", {
        name: mockFieldLabel,
      });
      expect(fieldset).toBeVisible();
    });

    test("DynamicField append button is visible", () => {
      const appendButton = screen.getByRole("button", { name: "Add a row" });
      expect(appendButton).toBeVisible();
    });

    test("DynamicField append button adds a field", async () => {
      const fieldset = screen.getByRole("group", {
        name: mockFieldLabel,
      });

      // click append
      const appendButton = screen.getByRole("button", { name: "Add a row" });
      await act(async () => {
        await userEvent.click(appendButton);
      });

      // verify there are now two text boxes
      const inputBoxLabel = within(fieldset).getAllByRole("textbox");
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();
    });

    test("DynamicField remove button removes a field", async () => {
      const fieldset = screen.getByRole("group", {
        name: mockFieldLabel,
      });

      // click append
      const appendButton = screen.getByRole("button", { name: "Add a row" });
      await act(async () => {
        await userEvent.click(appendButton);
      });

      // verify there are now two text boxes
      const inputBoxLabel = within(fieldset).getAllByRole("textbox");
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();

      // click remove
      const removeButtons = screen.getAllByRole("button", { name: "Delete" });
      const removeButton = removeButtons[1];
      expect(removeButtons).toHaveLength(2);

      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);

      // verify that the field is removed
      const inputBoxLabelAfterRemove = within(fieldset).getAllByRole("textbox");
      expect(removeButton).not.toBeVisible();
      expect(appendButton).toBeVisible();
      expect(inputBoxLabelAfterRemove).toHaveLength(1);
    });

    test("Removing all dynamic fields still leaves 1 open", async () => {
      const fieldset = screen.getByRole("group", {
        name: mockFieldLabel,
      });

      // verify there is one input
      const inputBoxLabel = within(fieldset).getAllByRole("textbox");
      expect(inputBoxLabel).toHaveLength(1);

      // click remove
      const removeButton = screen.getAllByRole("button", { name: "Delete" })[0];
      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);

      // verify that there is still one field available
      const inputBoxLabelAfterRemove = within(fieldset).getAllByRole("textbox");
      expect(inputBoxLabelAfterRemove).toHaveLength(1);
      expect(removeButton).not.toBeVisible();
    });

    test("DynamicField accepts input", async () => {
      const fieldset = screen.getByRole("group", {
        name: mockFieldLabel,
      });

      const firstDynamicField = within(fieldset).getByRole("textbox");
      await act(async () => {
        await userEvent.type(firstDynamicField, "123");
      });
      expect(firstDynamicField).toHaveValue("123");
    });

    test("Autosaves for state user", async () => {
      const fieldset = screen.getByRole("group", {
        name: mockFieldLabel,
      });

      const firstDynamicField = within(fieldset).getByRole("textbox");
      await act(async () => {
        await userEvent.type(firstDynamicField, "test user input");
        await userEvent.tab();
      });
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);
      expect(mockUpdateReport).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          fieldData: expect.objectContaining({
            [mockEntityType]: expect.arrayContaining([
              {
                [mockDynamicField]: expect.arrayContaining([
                  {
                    id: expect.any(String),
                    name: "test user input",
                  },
                ]),
              },
            ]),
          }),
        })
      );
      expect(firstDynamicField).toHaveValue("test user input");
    });
  });

  describe("Test DynamicField hint and dynamicLabel", () => {
    test("shows hint and dynamic labels", async () => {
      render(
        <DynamicFieldComponent dynamicLabel="Mock Label" hint="Mock hint" />
      );
      const fieldset = screen.getByRole("group", {
        name: mockFieldLabel,
      });
      const dynamicField = within(fieldset).getByRole("textbox", {
        name: "Mock Label",
      });
      const hint = within(fieldset).getByText("Mock hint");

      expect(dynamicField).toBeVisible();
      expect(hint).toHaveAttribute("id", "mock-dynamic-field__hint");
      expect(fieldset).toHaveAttribute(
        "aria-describedby",
        "mock-dynamic-field__hint"
      );
    });
  });

  describe("Test DynamicField hydration functionality", () => {
    const testHydrationValue = [
      {
        id: "123456",
        name: "hydrated value 1",
      },
      {
        id: "789001",
        name: "hydrated value 2",
      },
    ];

    test("hydrates correctly", async () => {
      render(<DynamicFieldComponent hydrationValue={testHydrationValue} />);
      const fieldset = screen.getByRole("group", {
        name: mockFieldLabel,
      });
      const dynamicFields = within(fieldset).getAllByRole("textbox");
      expect(dynamicFields).toHaveLength(2);
      expect(dynamicFields[0]).toHaveValue("hydrated value 1");
      expect(dynamicFields[1]).toHaveValue("hydrated value 2");
    });
  });

  testA11yAct(<DynamicFieldComponent />);
});
