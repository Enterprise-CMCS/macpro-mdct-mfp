import { MockedFunction } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { RadioField } from "components";
import { testA11yAct } from "utils/testing/commonTests";
import { mockFieldStore } from "utils/testing/setupTest";
import { useStore } from "utils";

const mockSetValue = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({ ...mockFieldStore, setAnswer: mockSetValue });

const RadioFieldComponent = (
  <div data-testid="test-radio-list">
    <RadioField
      choices={[
        {
          id: "Choice 1",
          name: "Choice 1",
          label: "Choice 1",
          value: "A",
          checked: false,
        },
        {
          id: "Choice 2",
          name: "Choice 2",
          label: "Choice 2",
          value: "B",
          checked: false,
        },
        {
          id: "Choice 3",
          name: "Choice 3",
          label: "Choice 3",
          value: "C",
          checked: false,
        },
      ]}
      label="Radio example"
      name="radio_choices"
      type="radio"
    />
  </div>
);

describe("<RadioField />", () => {
  test("RadioField renders as Radio", () => {
    render(RadioFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-radio-list")).toBeVisible();
  });

  test("RadioField allows checking radio choices", async () => {
    render(RadioFieldComponent);
    const firstRadio = screen.getByLabelText("Choice 1") as HTMLInputElement;
    await act(async () => {
      await userEvent.click(firstRadio);
    });
    expect(mockSetValue).toHaveBeenCalledWith("radio_choices", [
      { key: "Choice 1", value: "A" },
    ]);
  });

  testA11yAct(RadioFieldComponent);
});
