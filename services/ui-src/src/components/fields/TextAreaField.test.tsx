import { render, screen } from "@testing-library/react";
//components
import { TextAreaField } from "components";
import { testA11yAct } from "utils/testing/commonTests";

vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
    register: () => {},
    getValues: vi.fn().mockReturnValueOnce([]).mockReturnValue("test"),
  }),
}));

const textAreaFieldComponent = (
  <TextAreaField
    name="testTextAreaField"
    label="test-label"
    placeholder="test-placeholder"
    data-testid="test-text-area-field"
  />
);

describe("<TextAreaField />", () => {
  test("TextAreaField is visible", () => {
    render(textAreaFieldComponent);
    const textAreaField = screen.getByRole("textbox");
    expect(textAreaField).toBeVisible();
  });

  testA11yAct(textAreaFieldComponent);
});
