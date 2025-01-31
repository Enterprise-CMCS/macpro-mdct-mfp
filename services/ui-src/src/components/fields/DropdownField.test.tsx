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
      const dropdown = screen.queryAllByText("test-dropdown-label");
      expect(dropdown).toHaveLength(2);
    });
  });

  describe("Test DropdownField hydration functionality", () => {
    /*
     * This has updated to see if a button exists with the intended displayValue. This is because of the CMSDS
     * Dropdown custom component released in 7.0.7 and how it builds itself now that its no longer a native selct.
     * It builds a button with the value displayed and then builds a list underneath it. Jest has a hard
     * time handling this hence the implementation below and the other tests in this group.
     */
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
      const option = screen.getByRole("button", {
        name: `${mockFormFieldValue.label} test-dropdown-label`,
      }) as HTMLOptionElement;
      expect(option).toBeInTheDocument();
    });

    test("If only hydrationValue exists, displayValue is set to it", () => {
      mockGetValues(undefined);
      render(dropdownComponentWithHydrationValue);
      const option = screen.getByRole("button", {
        name: `${mockHydrationValue.label} test-dropdown-field-to-hydrate`,
      }) as HTMLOptionElement;
      expect(option).toBeInTheDocument();
    });

    test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
      mockGetValues(mockFormFieldValue);
      render(dropdownComponentWithHydrationValue);
      const option = screen.getByRole("button", {
        name: `${mockFormFieldValue.label} test-dropdown-field-to-hydrate`,
      }) as HTMLOptionElement;
      expect(option).toBeInTheDocument();
    });
  });

  testA11y(dropdownComponentWithOptions, () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
  });
});
