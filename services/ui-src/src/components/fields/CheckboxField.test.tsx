import { MockedFunction } from "vitest";
import { act, render, screen } from "@testing-library/react";
//components
import { CheckboxField } from "components";
import userEvent from "@testing-library/user-event";
import { testA11yAct } from "utils/testing/commonTests";
import { mockFieldStore } from "utils/testing/setupTest";
import { useStore } from "utils";

const mockSetValue = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({ ...mockFieldStore, setAnswer: mockSetValue });

const CheckboxFieldComponent = (
  <div data-testid="test-checkbox-list">
    <CheckboxField
      choices={[
        { id: "Choice 1", name: "Choice 1", label: "Choice 1", value: "A" },
        { id: "Choice 2", name: "Choice 2", label: "Choice 2", value: "B" },
        { id: "Choice 3", name: "Choice 3", label: "Choice 3", value: "C" },
      ]}
      label="Checkbox example"
      name="checkbox_choices"
      type="checkbox"
    />
  </div>
);

describe("<CheckboxField />", () => {
  test("CheckboxField renders as Checkbox", () => {
    render(CheckboxFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-checkbox-list")).toBeVisible();
  });

  test("CheckboxField allows checking checkbox choices", async () => {
    render(CheckboxFieldComponent);
    const firstCheckbox = screen.getByLabelText("Choice 1") as HTMLInputElement;
    await act(async () => {
      await userEvent.click(firstCheckbox);
    });

    expect(mockSetValue).toHaveBeenCalledWith("checkbox_choices", [
      { key: "Choice 1", value: "A" },
    ]);
  });

  testA11yAct(CheckboxFieldComponent, () => {});
});
