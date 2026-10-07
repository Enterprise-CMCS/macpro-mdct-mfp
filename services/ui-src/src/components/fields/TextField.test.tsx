import { Mock, MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
// components
import { useFormContext } from "react-hook-form";
import { TextField } from "components";
// utils
import { mockStateUserStore } from "utils/testing/setupTest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

const mockTrigger = vi.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: vi.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as Mock<
  typeof useFormContext
>;
vi.mock("react-hook-form", () => ({
  useFormContext: vi.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: vi.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
const maxLength = 1000;

const textFieldComponent = (
  <TextField name="testTextField" label="test-label" />
);

const textFieldComponentWithMaxLength = (
  <TextField name="testTextField" label="test-label" maxLength={maxLength} />
);

const textFieldComponentValidateOnRender = (
  <TextField name="testTextField" label="test-label" validateOnRender={true} />
);

const mockHydrationValue = "expenditureefg";

const textFieldComponentHydration = (
  <TextField
    name="testTextFieldWithHydrationValue"
    label="test-label-hydration-value"
    hydrate={mockHydrationValue}
    maxLength={maxLength}
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

describe("<TextField />", () => {
  describe("Test TextField component", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues("");
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

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

    test("Component with validateOnRender passed should validate on initial render", () => {
      render(textFieldComponentValidateOnRender);
      expect(mockTrigger).toHaveBeenCalled();
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

    test("Component with hydration value and clear value should reset value to default", () => {
      render(textFieldComponentClearValue);
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    test("validateOnRender triggers form.trigger", () => {
      render(textFieldComponentValidateOnRender);
      expect(mockRhfMethods.trigger).toHaveBeenCalled();
    });
  });

  testA11yAct(
    textFieldComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      vi.clearAllMocks();
    }
  );
});
