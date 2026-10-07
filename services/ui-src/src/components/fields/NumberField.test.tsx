import { MockedFunction } from "vitest";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { NumberField } from "components";
// types
import { NumberMask } from "types";
// utils
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import { mockFieldStore } from "utils/testing/setupTest";

const mockSetValue = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({ ...mockFieldStore, setAnswer: mockSetValue });

const numberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    data-testid="test-number-field"
    updateFieldValues={mockSetValue}
  />
);

const commaMaskedNumberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    mask={NumberMask.COMMA_SEPARATED}
    updateFieldValues={mockSetValue}
  />
);

const currencyMaskedNumberFieldComponent = (
  <NumberField
    name="testNumberField"
    label=""
    mask={NumberMask.CURRENCY}
    updateFieldValues={mockSetValue}
  />
);

const percentageMaskedNumberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    mask={NumberMask.PERCENTAGE}
    updateFieldValues={mockSetValue}
  />
);

const ratioMaskedNumberFieldComponent = (
  <NumberField
    name="testNumberField"
    label="test-label"
    mask={NumberMask.RATIO}
    updateFieldValues={mockSetValue}
  />
);

describe("<NumberField />", () => {
  describe("Test Maskless NumberField", () => {
    test("NumberField is visible", () => {
      const result = render(numberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      expect(numberFieldInput).toBeVisible();
    });

    test("onChangeHandler updates unmasked field value", async () => {
      const result = render(numberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123");
      });
      expect(numberFieldInput.value).toEqual("123");
      await act(async () => {
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123");
    });
  });

  describe("Test Masked NumberField", () => {
    test("onChangeHandler updates comma masked field value", async () => {
      const result = render(commaMaskedNumberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123");
      });
      expect(numberFieldInput.value).toEqual("123");
      await act(async () => {
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "12055");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("12,055");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "12055.99");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("12,055.99");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "-1234");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("-1,234");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "$$1234567890.10");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("$$1234567890.10");
    });

    test("onChangeHandler updates Currency masked field value", async () => {
      const result = render(currencyMaskedNumberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123.00");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "5.99");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("5.99");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "1234.00");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("1,234.00");
    });

    test("onChangeHandler updates Percentage masked field value", async () => {
      const result = render(percentageMaskedNumberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123");
      });
      expect(numberFieldInput.value).toEqual("123");
      await act(async () => {
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "12055");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("12,055");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, "12055.99");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("12,055.99");
    });

    test("onChangeHandler updates ratio field value", async () => {
      const result = render(ratioMaskedNumberFieldComponent);
      const numberFieldInput: HTMLInputElement = result.container.querySelector(
        "[name='testNumberField']"
      )!;
      await act(async () => {
        await userEvent.type(numberFieldInput, "123:123");
      });
      expect(numberFieldInput.value).toEqual("123:123");
      await act(async () => {
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual("123:123");
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(
          numberFieldInput,
          "123,,,4567.1234567.1234:12,3456,7.1"
        );
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual(
        "123,,,4567.1234567.1234:12,3456,7.1"
      );
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(
          numberFieldInput,
          "123,,,4567.12345671234:12,3456,7.1"
        );
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual(
        "1,234,567.1234567123:1,234,567.1"
      );
      await act(async () => {
        await userEvent.clear(numberFieldInput);
        await userEvent.type(numberFieldInput, ":");
        await userEvent.tab();
      });
      expect(numberFieldInput.value).toEqual(":");
    });
  });

  describe("Test NumberField hydration functionality", () => {
    const mockHydrationValue = "12345";

    const numberFieldComponentWithHydrationValue = (
      <NumberField
        name="testNumberFieldWithHydrationValue"
        label="test-label"
        hydrate={mockHydrationValue}
        data-testid="test-id"
        updateFieldValues={mockSetValue}
      />
    );

    test("If only hydrationValue exists, displayValue is set to it", () => {
      const result = render(numberFieldComponentWithHydrationValue);
      const numberField: HTMLInputElement = result.container.querySelector(
        "[name='testNumberFieldWithHydrationValue']"
      )!;
      const displayValue = numberField.value;
      expect(displayValue).toEqual("12,345");
    });
  });

  testA11yAct(numberFieldComponent);
});
