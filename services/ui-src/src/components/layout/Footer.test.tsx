import { render, screen } from "@testing-library/react";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Footer } from "components";
import { testA11y } from "utils/testing/commonTests";

const footerComponent = (
  <RouterWrappedComponent>
    <Footer />
  </RouterWrappedComponent>
);

describe("<Footer />", () => {
  describe("Test Footer", () => {
    beforeEach(() => {
      render(footerComponent);
    });

    test("Footer is visible", () => {
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeVisible();
    });

    test("Logo is visible", () => {
      expect(screen.getByAltText("MFP logo")).toBeVisible();
    });

    test("Help link is visible", () => {
      expect(screen.getByText("Contact Us")).toBeVisible();
    });

    test("Accessibility statement link is visible", () => {
      expect(screen.getByText("Accessibility Statement")).toBeVisible();
    });
  });

  testA11y(footerComponent);
});
