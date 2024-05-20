import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { useFormContext } from "react-hook-form";
import { TextField } from "components";
// utils
import { mockStateUserStore } from "utils/testing/setupJest";
import { useStore } from "utils";

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

const textFieldComponent = (
  <TextField
    name="testTextField"
    label="test-label"
    placeholder="test-placeholder"
    data-testid="test-text-field"
  />
);

const textFieldComponentValidateOnRender = (
  <TextField
    name="testTextField"
    label="test-label"
    placeholder="test-placeholder"
    data-testid="test-text-field"
    validateOnRender={true}
  />
);

const mockHydrationValue = "abcdefg";

const textFieldComponentHydration = (
  <TextField
    name="testTextFieldWithHydrationValue"
    label="test-label-hydration-value"
    hydrate={mockHydrationValue}
  />
);

const textFieldComponentClearValue = (
  <TextField
    name="testTextFieldWithHydrationValue"
    label="test-label-hydration-value"
    hydrate={mockHydrationValue}
    clear
  />
);

describe("Test TextField component", () => {
  test("TextField is visible", () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues("");
    render(textFieldComponent);
    const textField = screen.getByRole("textbox");
    expect(textField).toBeVisible();
    jest.clearAllMocks();
  });

  test("Component with validateOnRender passed should validate on initial render", () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues("");
    render(textFieldComponentValidateOnRender);
    expect(mockTrigger).toHaveBeenCalled();
  });

  test("Component with hydration value should hydrate field", () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues("");
    const result = render(textFieldComponentHydration);
    const textFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testTextFieldWithHydrationValue']"
    )!;
    const displayValue = textFieldInput.value;
    expect(displayValue).toEqual(mockHydrationValue);
  });

  test("Component with hydration value and clear value should reset value to default", () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues("");
    const result = render(textFieldComponentClearValue);
    const textFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testTextFieldWithHydrationValue']"
    )!;
    const displayValue = textFieldInput.value;
    expect(displayValue).toEqual("");
  });
});

describe("Test TextField where validateOnRender is true", () => {
  test("validateOnRender triggers form.trigger", () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues("");
    render(textFieldComponentValidateOnRender);
    expect(mockRhfMethods.trigger).toHaveBeenCalled();
    jest.clearAllMocks();
  });
});

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    jest.clearAllMocks();
  });
});
