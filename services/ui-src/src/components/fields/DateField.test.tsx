import { MockedFunction } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { DateField, ReportContext } from "components";
import { useStore } from "utils";
import { mockWpReportContext, mockFieldStore } from "utils/testing/setupTest";
import { testA11yAct } from "utils/testing/commonTests";

const mockTrigger = vi.fn();
const mockSetValue = vi.fn();
const mockAutoSave = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;

const dateFieldComponent = (
  <DateField
    name="testDateField"
    label="test-date-field"
    updateFieldValues={mockAutoSave}
  />
);

describe("<DateField />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStore.mockReturnValue({
      ...mockFieldStore,
      setAnswer: mockSetValue,
    });
  });
  describe("Test DateField basic functionality", () => {
    test("DateField is visible", () => {
      const result = render(dateFieldComponent);
      const dateFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testDateField']"
      )!;
      expect(dateFieldInput).toBeVisible();
    });

    test("onChange event fires handler when typing and stays even after blurred", async () => {
      const result = render(dateFieldComponent);
      const dateFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testDateField']"
      )!;
      await act(async () => {
        await userEvent.type(dateFieldInput, "07/14/2022");
        await userEvent.tab();
      });
      expect(dateFieldInput.value).toEqual("07/14/2022");
    });
  });

  describe("Test DateField hydration functionality", () => {
    const mockHydrationValue = "1/1/2022";

    const dateFieldComponentWithHydrationValue = (
      <DateField
        name="testDateFieldWithHydrationValue"
        label="test-date-field-with-hydration-value"
        hydrate={mockHydrationValue}
        updateFieldValues={mockAutoSave}
      />
    );

    test("DisplayValue is set to hydration value", () => {
      const result = render(dateFieldComponentWithHydrationValue);
      const dateFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testDateFieldWithHydrationValue']"
      )!;
      const displayValue = dateFieldInput.value;
      expect(displayValue).toEqual(mockHydrationValue);
    });
  });

  describe("Test DateField autosave functionality", () => {
    const dateFieldAutosavingComponent = (
      <ReportContext.Provider value={mockWpReportContext}>
        <DateField
          name="testDateField"
          label="test-date-field"
          updateFieldValues={mockAutoSave}
          autosave
        />
      </ReportContext.Provider>
    );

    test("Autosaves entered date when state user, autosave true, and field is valid", async () => {
      mockTrigger.mockReturnValue(true);
      render(dateFieldAutosavingComponent);
      const dateField = screen.getByRole("textbox", {
        name: "test-date-field",
      });
      expect(dateField).toBeVisible();
      await act(async () => {
        await userEvent.type(dateField, "07/14/2022");
        await userEvent.tab();
      });
      expect(mockAutoSave).toHaveBeenCalled();
    });

    test("Does not autosave if autosave is false", async () => {
      render(dateFieldComponent);
      const dateField = screen.getByRole("textbox", {
        name: "test-date-field",
      });
      expect(dateField).toBeVisible();
      await act(async () => {
        await userEvent.type(dateField, "07/14/2022");
        await userEvent.tab();
      });
      expect(mockAutoSave).toHaveBeenCalledTimes(0);
    });
  });

  describe("Datefield handles triggering validation", () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    test("Blanking field triggers form validation", async () => {
      const result = render(dateFieldComponent);
      expect(mockSetValue).not.toHaveBeenCalled();
      const dateFieldInput = result.getByRole("textbox", {
        name: "test-date-field",
      });
      await act(async () => {
        await userEvent.click(dateFieldInput);
        await userEvent.clear(dateFieldInput);
        await userEvent.tab();
      });
      expect(mockSetValue).toHaveBeenCalled();
    });
  });

  testA11yAct(dateFieldComponent);
});
