import { render, screen } from "@testing-library/react";
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
import { testA11y } from "utils/testing/commonTests";

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
});

const mockUpdateReport = jest.fn();
const mockedReportContext = {
  ...mockWpReportContext,
  updateReport: mockUpdateReport,
};

const MockForm = (props: any) => {
  const form = useForm({
    shouldFocusError: false,
  });
  return (
    <ReportContext.Provider value={mockedReportContext}>
      <EntityProvider>
        <FormProvider {...form}>
          <form id="uniqueId" onSubmit={form.handleSubmit(jest.fn())}>
            <DynamicField
              name={mockDynamicField}
              label={mockFieldLabel}
              hydrate={props.hydrationValue}
            />
          </form>
        </FormProvider>
      </EntityProvider>
    </ReportContext.Provider>
  );
};

const DynamicFieldComponent = ({ hydrationValue }: any) => (
  <MockForm hydrationValue={hydrationValue} />
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
      const inputBoxLabel = screen.getByRole("textbox", {
        name: mockFieldLabel,
      });
      expect(inputBoxLabel).toBeVisible();
    });

    test("DynamicField append button is visible", () => {
      const appendButton = screen.getByRole("button", { name: "Add a row" });
      expect(appendButton).toBeVisible();
    });

    test("DynamicField append button adds a field", async () => {
      // click append
      const appendButton = screen.getByRole("button", { name: "Add a row" });
      await userEvent.click(appendButton);

      // verify there are now two text boxes
      const inputBoxLabel = screen.getAllByRole("textbox", {
        name: mockFieldLabel,
      });
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();
    });

    test("DynamicField remove button removes a field", async () => {
      // click append
      const appendButton = screen.getByRole("button", { name: "Add a row" });
      await userEvent.click(appendButton);

      // verify there are now two text boxes
      const inputBoxLabel = screen.getAllByRole("textbox", {
        name: mockFieldLabel,
      });
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();

      // click remove
      const removeButtons = screen.getAllByRole("button", { name: "Delete" });
      const removeButton = removeButtons[1];
      expect(removeButtons).toHaveLength(2);

      await userEvent.click(removeButton);
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);

      // verify that the field is removed
      const inputBoxLabelAfterRemove = screen.getAllByRole("textbox", {
        name: mockFieldLabel,
      });
      expect(removeButton).not.toBeVisible();
      expect(appendButton).toBeVisible();
      expect(inputBoxLabelAfterRemove).toHaveLength(1);
    });

    test("Removing all dynamic fields still leaves 1 open", async () => {
      // verify there is one input
      const inputBoxLabel = screen.getAllByRole("textbox", {
        name: mockFieldLabel,
      });
      expect(inputBoxLabel).toHaveLength(1);

      // click remove
      const removeButton = screen.queryAllByTestId("removeButton")[0];
      await userEvent.click(removeButton);
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);

      // verify that there is still one field available
      const inputBoxLabelAfterRemove = screen.getAllByRole("textbox", {
        name: mockFieldLabel,
      });
      expect(inputBoxLabelAfterRemove).toHaveLength(1);
      expect(removeButton).not.toBeVisible();
    });

    test("DynamicField accepts input", async () => {
      const firstDynamicField = screen.getByRole("textbox", {
        name: mockFieldLabel,
      });
      await userEvent.type(firstDynamicField, "123");
      expect(firstDynamicField).toHaveValue("123");
    });

    test("Autosaves for state user", async () => {
      const firstDynamicField = screen.getByRole("textbox", {
        name: mockFieldLabel,
      });
      await userEvent.type(firstDynamicField, "test user input");
      await userEvent.tab();
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
      const dynamicFields = screen.getAllByRole("textbox", {
        name: mockFieldLabel,
      });
      expect(dynamicFields).toHaveLength(2);
      expect(dynamicFields[0]).toHaveValue("hydrated value 1");
      expect(dynamicFields[1]).toHaveValue("hydrated value 2");
    });
  });

  testA11y(<DynamicFieldComponent />);
});
