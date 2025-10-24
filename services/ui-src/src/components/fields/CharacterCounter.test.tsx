import { render, screen } from "@testing-library/react";
//components
import { CharacterCounter } from "components";

describe("<CharacterCounter />", () => {
  test("shows characters allowed", () => {
    render(<CharacterCounter id={"id"} input={""} maxLength={100} />);
    expect(screen.getByText("100 characters allowed")).toBeVisible();
  });

  test("shows characters left", () => {
    render(<CharacterCounter id={"id"} input={"0123456789"} maxLength={10} />);
    expect(screen.getByText("0 characters left")).toBeVisible();
  });
});
