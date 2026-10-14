import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { ChoiceField } from "components";
import { testA11yAct } from "utils/testing/commonTests";

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
      render(ChoiceFieldComponent);
      const choiceField: HTMLInputElement = screen.getByLabelText("Checkbox A");
      const displayValue = choiceField.value;
      expect(displayValue).toBeTruthy();
    });

    test("If only hydrationValue exists, displayValue is set to it", () => {
      render(ChoiceFieldComponentWithHydrationValue);
      const choiceField: HTMLInputElement = screen.getByLabelText("Checkbox B");
      const displayValue = choiceField.value;
      expect(displayValue).toBeTruthy();
    });
  });

  testA11yAct(ChoiceFieldComponent);
});
