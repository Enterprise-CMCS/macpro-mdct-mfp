import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { useFormContext } from "react-hook-form";
import { TextField } from "components";
// utils
import { mockStateUserStore } from "utils/testing/setupJest";
import { useUser } from "utils";

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

jest.mock("utils/state/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const textFieldComponent = (
  <TextField
    name="testTextField"
    label="test-label"
    placeholder="test-placeholder"
    data-testid="test-text-field"
  />
);

describe("Test TextField component", () => {
  test("TextField is visible", () => {
    mockedUseUser.mockReturnValue(mockStateUserStore);
    mockGetValues("");
    render(textFieldComponent);
    const textField = screen.getByTestId("test-text-field");
    expect(textField).toBeVisible();
    jest.clearAllMocks();
  });
});

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    jest.clearAllMocks();
  });
});
