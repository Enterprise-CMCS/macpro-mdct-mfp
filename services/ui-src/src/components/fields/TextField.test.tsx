import { MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
// components
import { TextField } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";
import { mockFieldStore } from "utils/testing/setupTest";
import { useStore } from "utils";

const mockAutosave = vi.fn();
const mockSetValue = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({ ...mockFieldStore, setAnswer: mockSetValue });

const maxLength = 1000;

const textFieldComponent = (
  <TextField
    name="testTextField"
    label="test-label"
    updateFieldValues={mockAutosave}
  />
);

const textFieldComponentWithMaxLength = (
  <TextField
    name="testTextField"
    label="test-label"
    maxLength={maxLength}
    updateFieldValues={mockAutosave}
  />
);

const mockHydrationValue = "expenditureefg";

const textFieldComponentHydration = (
  <TextField
    name="testTextFieldWithHydrationValue"
    label="test-label-hydration-value"
    hydrate={mockHydrationValue}
    maxLength={maxLength}
    updateFieldValues={mockAutosave}
  />
);

describe("<TextField />", () => {
  describe("Test TextField component", () => {
    test("TextField is visible", () => {
      render(textFieldComponent);
      expect(screen.getByRole("textbox")).toBeVisible();
    });

    test("TextField has character counter", () => {
      render(textFieldComponentWithMaxLength);
      const textFieldInput = screen.getByRole("textbox");
      const characterCounter = screen.getByText(
        `${maxLength} characters allowed`
      );
      expect(characterCounter).toBeVisible();

      const counterId = characterCounter.getAttribute("id");
      const describedBy = textFieldInput.getAttribute("aria-describedby");
      expect(describedBy).toBe(counterId);
    });

    test("Component with hydration value should hydrate field", () => {
      render(textFieldComponentHydration);
      expect(screen.getByRole("textbox")).toHaveValue(mockHydrationValue);

      const remainingCharacters = maxLength - mockHydrationValue.length;
      const characterCounter = screen.getByText(
        `${remainingCharacters} characters left`
      );
      expect(characterCounter).toBeVisible();
    });
  });

  testA11yAct(textFieldComponent);
});
