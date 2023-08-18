import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { useFormContext } from "react-hook-form";
//components
import { DropdownField } from "components";
// utils
import { mockStateUserStore } from "utils/testing/setupJest";
import { useUserStore } from "utils";
import { mockDropdownOptions } from "utils/testing/fields/mockDropdownChoices";

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

jest.mock("utils/state/useUserStore");
const mockedUseUser = useUserStore as jest.MockedFunction<typeof useUserStore>;

const dropdownComponentWithOptions = (
  <DropdownField
    name="testDropdown"
    label="test-dropdown-label"
    options={mockDropdownOptions}
  />
);

describe("Test DropdownField basic functionality", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUserStore);
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
    mockedUseUser.mockReturnValue(mockStateUserStore);
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

describe("Test DropdownField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
    const { container } = render(dropdownComponentWithOptions);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
