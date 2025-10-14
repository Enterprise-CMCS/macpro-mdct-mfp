import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
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
    beforeEach(async () => {
      await act(async () => {
        await render(<DynamicFieldComponent />);
      });
    });

    test("DynamicField is visible", () => {
      const inputBoxLabel = screen.getByText(mockFieldLabel);
      expect(inputBoxLabel).toBeVisible();
    });

    test("DynamicField append button is visible", () => {
      const appendButton = screen.getByText("Add a row");
      expect(appendButton).toBeVisible();
    });

    test("DynamicField append button adds a field", async () => {
      // click append
      const appendButton = screen.getByText("Add a row");
      await userEvent.click(appendButton);

      // verify there are now two text boxes
      const inputBoxLabel = screen.getAllByText(mockFieldLabel);
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();
    });

    test("DynamicField remove button removes a field", async () => {
      // click append
      const appendButton = screen.getByText("Add a row");
      await userEvent.click(appendButton);

      // verify there are now two text boxes
      const inputBoxLabel = screen.getAllByText(mockFieldLabel);
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();

      // click remove
      const removeButton = screen.queryAllByTestId("removeButton")[1];
      await userEvent.click(removeButton);
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);

      // verify that the field is removed
      const inputBoxLabelAfterRemove = screen.getAllByText(mockFieldLabel);
      expect(removeButton).not.toBeVisible();
      expect(appendButton).toBeVisible();
      expect(inputBoxLabelAfterRemove).toHaveLength(1);
    });

    test("Removing all dynamic fields still leaves 1 open", async () => {
      // verify there is one input
      const inputBoxLabel = screen.getAllByText(mockFieldLabel);
      expect(inputBoxLabel).toHaveLength(1);

      // click remove
      const removeButton = screen.queryAllByTestId("removeButton")[0];
      await userEvent.click(removeButton);
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);

      // verify that there is still one field available
      const inputBoxLabelAfterRemove = screen.getAllByText(mockFieldLabel);
      expect(inputBoxLabelAfterRemove).toHaveLength(1);
      expect(removeButton).not.toBeVisible();
    });
  });

  describe("Test typing into DynamicField component", () => {
    test("DynamicField accepts input", async () => {
      const result = render(<DynamicFieldComponent />);
      const firstDynamicField: HTMLInputElement =
        result.container.querySelector("[name='mock-dynamic-field[0]']")!;
      expect(firstDynamicField).toBeVisible();
      await userEvent.type(firstDynamicField, "123");
      expect(firstDynamicField.value).toEqual("123");
    });
  });

  describe("Test DynamicField Autosave Functionality", () => {
    test("Autosaves when state user", async () => {
      const result = render(<DynamicFieldComponent />);
      const firstDynamicField: HTMLInputElement =
        result.container.querySelector("[name='mock-dynamic-field[0]']")!;
      expect(firstDynamicField).toBeVisible();
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
      expect(firstDynamicField.value).toBe("test user input");
    });
  });

  describe("Test DynamicField hydration Functionality", () => {
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

    test("Autosaves when state user", async () => {
      const result = render(
        <DynamicFieldComponent hydrationValue={testHydrationValue} />
      );
      const firstDynamicField: HTMLInputElement =
        result.container.querySelector("[name='mock-dynamic-field[0]']")!;
      const secondDynamicField: HTMLInputElement =
        result.container.querySelector("[name='mock-dynamic-field[1]']")!;
      expect(firstDynamicField).toBeVisible();
      expect(secondDynamicField).toBeVisible();
    });
  });

  testA11y(<DynamicFieldComponent />);
});
