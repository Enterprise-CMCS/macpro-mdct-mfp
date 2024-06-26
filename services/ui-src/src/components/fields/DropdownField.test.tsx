import { render, screen } from "@testing-library/react";
import { useFormContext } from "react-hook-form";
//components
import { DropdownField } from "components";
// utils
import { mockStateUserStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { mockDropdownOptions } from "utils/testing/fields/mockDropdownChoices";
import { testA11y } from "utils/testing/commonTests";

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
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

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const dropdownComponentWithOptions = (
  <DropdownField
    name="testDropdown"
    label="test-dropdown-label"
    options={mockDropdownOptions}
  />
);

describe("<DropdownField />", () => {
  describe("Test DropdownField basic functionality", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
    });

    test("Dropdown renders", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithOptions);
      const dropdown = screen.getByLabelText("test-dropdown-label");
      expect(dropdown).toBeVisible();
    });
  });

  describe("Test DropdownField hydration functionality", () => {
    const mockFormFieldValue = { label: "Option 1", value: "test-dropdown-1" };
    const mockHydrationValue = { label: "Option 3", value: "test-dropdown-3" };
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
      render(dropdownComponentWithOptions);
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

  testA11y(dropdownComponentWithOptions, () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
  });
});
