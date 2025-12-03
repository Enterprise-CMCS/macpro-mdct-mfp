import { render, screen } from "@testing-library/react";
import { shimComponent } from "./shim";

describe("shimComponent", () => {
  test("renders props and children", () => {
    const TestComponent = ({ children, text }: any) => (
      <div>
        <p aria-label={text}>{text}</p>
        {children}
      </div>
    );
    const TestShim = shimComponent(TestComponent);

    const testShimWithChild = (
      <TestShim text="Shim text">
        <p aria-label="Shim child">Shim child</p>
      </TestShim>
    );

    render(testShimWithChild);
    expect(screen.getByRole("paragraph", { name: "Shim text" })).toBeVisible();
    expect(screen.getByRole("paragraph", { name: "Shim child" })).toBeVisible();
  });
});
