import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
//components
import { DropdownField } from "components";
// utils
import { mockStateUserStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { mockDropdownOptions } from "utils/testing/fields/mockDropdownChoices";
import { testA11yAct } from "utils/testing/commonTests";

const mockFormFieldValue = { label: "Option 1", value: "test-dropdown-1" };
const mockHydrationValue = { label: "Option 3", value: "test-dropdown-3" };

const mockRegister = jest.fn();
const mockTrigger = jest.fn();
const mockSetValue = jest.fn();
const mockRhfMethods = {
  getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(undefined),
  register: mockRegister,
  setValue: mockSetValue,
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));

const mockErrors = (name: string, message: string) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    formState: {
      errors: {
        [name]: {
          message,
        },
      },
    },
  }));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const dropdownComponentWithOptions = (
  options: any = mockDropdownOptions,
  validateOnRender: boolean = false
) => (
  <DropdownField
    hint="Dropdown hint"
    name="testDropdown"
    label="test-dropdown-label"
    options={options}
    validateOnRender={validateOnRender}
  />
);

describe("<DropdownField />", () => {
  describe("Test DropdownField basic functionality", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Dropdown renders", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithOptions());
      const dropdown = screen.getByLabelText("test-dropdown-label");
      expect(dropdown).toBeVisible();

      const hint = screen.getByText("Dropdown hint");
      expect(hint).toBeVisible();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(4);
    });

    test("renders inline error", () => {
      mockErrors("testDropdown", "Test error message");
      render(dropdownComponentWithOptions());
      const inlineError = screen.getByText("Test error message");
      expect(inlineError).toBeVisible();
    });

    test("renders empty options for copyEligibleReports", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithOptions("copyEligibleReports"));

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1);
    });

    test("renders empty options for string value", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithOptions("mock"));

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1);
    });

    test("calls form register without validateOnRender", () => {
      mockGetValues(mockFormFieldValue);
      render(dropdownComponentWithOptions("mock"));
      expect(mockRegister).toHaveBeenCalled();
    });

    test("calls change and blur events", async () => {
      mockGetValues(undefined);
      render(dropdownComponentWithOptions());
      const dropDown = screen.getByLabelText("test-dropdown-label");
      await act(async () => {
        await userEvent.selectOptions(dropDown, "test-dropdown-1");
      });
      expect(mockSetValue).toHaveBeenCalled();

      await act(async () => {
        await userEvent.selectOptions(dropDown, "");
        await userEvent.tab();
      });

      expect(mockTrigger).toHaveBeenCalled();
    });

    test("calls form trigger with validateOnRender", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithOptions("mock", true));
      expect(mockTrigger).toHaveBeenCalled();
    });
  });

  describe("Test DropdownField hydration functionality", () => {
    const dropdownComponentWithHydrationValue = (
      <DropdownField
        name="testDropdown"
        label="test-dropdown-field-to-hydrate"
        hydrate={mockHydrationValue}
        options={mockDropdownOptions}
      />
    );

    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
    });

    test("If only formFieldValue exists, displayValue is set to it", () => {
      mockGetValues(mockFormFieldValue);
      render(dropdownComponentWithOptions());
      const dropdownField: HTMLSelectElement = screen.getByLabelText(
        "test-dropdown-label"
      );
      const displayValue = dropdownField.value;
      expect(displayValue).toEqual(mockFormFieldValue.value);
    });

    test("If only hydrationValue exists, displayValue is set to it", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithHydrationValue);
      const dropdownField: HTMLSelectElement = screen.getByLabelText(
        "test-dropdown-field-to-hydrate"
      );
      const displayValue = dropdownField.value;
      expect(displayValue).toEqual(mockHydrationValue.value);
    });

    test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
      mockGetValues(mockFormFieldValue);
      render(dropdownComponentWithHydrationValue);
      const dropdownField: HTMLSelectElement = screen.getByLabelText(
        "test-dropdown-field-to-hydrate"
      );
      const displayValue = dropdownField.value;
      expect(displayValue).toEqual(mockFormFieldValue.value);
    });
  });

  testA11yAct(dropdownComponentWithOptions(), () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
  });
});
