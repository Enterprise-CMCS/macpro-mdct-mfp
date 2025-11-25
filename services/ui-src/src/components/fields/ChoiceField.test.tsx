import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { ChoiceField } from "components";
import { useFormContext } from "react-hook-form";
import { testA11yAct } from "utils/testing/commonTests";

const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
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
    getValues: jest.fn().mockReturnValue(returnValue),
  }));

const ChoiceFieldComponent = (
  <ChoiceField
    name="checkbox_choice"
    label="Checkbox A"
    hint="checkbox a"
    data-testid="test-checkbox-field"
  />
);

describe("<ChoiceField />", () => {
  describe("Test ChoiceField component", () => {
    test("ChoiceField renders as Checkbox", () => {
      render(ChoiceFieldComponent);
      const choice = screen.getByLabelText("Checkbox A");
      expect(choice).toBeVisible();
    });

    test("ChoiceField calls onChange function successfully", async () => {
      render(ChoiceFieldComponent);
      const choice = screen.getByLabelText("Checkbox A") as HTMLInputElement;
      expect(choice.checked).toBe(false);
      await act(async () => {
        await userEvent.click(choice);
      });
      expect(choice.checked).toBe(true);
    });
  });

  describe("Test ChoiceField hydration functionality", () => {
    const mockFormFieldValue = true;
    const mockHydrationValue = true;
    const ChoiceFieldComponentWithHydrationValue = (
      <ChoiceField
        name="checkbox_choice"
        label="Checkbox B"
        hint="checkbox b"
        hydrate={mockHydrationValue}
        data-testid="test-text-field-with-hydration-value"
      />
    );

    test("If only formFieldValue exists, displayValue is set to it", () => {
      mockGetValues(mockFormFieldValue);
      render(ChoiceFieldComponent);
      const choiceField: HTMLInputElement = screen.getByLabelText("Checkbox A");
      const displayValue = choiceField.value;
      expect(displayValue).toBeTruthy();
    });

    test("If only hydrationValue exists, displayValue is set to it", () => {
      mockGetValues(undefined);
      render(ChoiceFieldComponentWithHydrationValue);
      const choiceField: HTMLInputElement = screen.getByLabelText("Checkbox B");
      const displayValue = choiceField.value;
      expect(displayValue).toBeTruthy();
    });
  });

  testA11yAct(ChoiceFieldComponent);
});
