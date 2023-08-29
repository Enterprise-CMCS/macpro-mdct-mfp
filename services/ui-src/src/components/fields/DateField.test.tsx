import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { DateField } from "components";
import { useUserStore } from "utils";
import { mockStateUserStore } from "utils/testing/setupJest";

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

const dateFieldComponent = (
  <DateField name="testDateField" label="test-date-field" />
);

describe("Test DateField basic functionality", () => {
  test("DateField is visible", () => {
    mockedUseUser.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    expect(dateFieldInput).toBeVisible();
  });

  test("onChange event fires handler when typing and stays even after blurred", async () => {
    mockedUseUser.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    await userEvent.type(dateFieldInput, "07/14/2022");
    await userEvent.tab();
    expect(dateFieldInput.value).toEqual("07/14/2022");
  });
});

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
