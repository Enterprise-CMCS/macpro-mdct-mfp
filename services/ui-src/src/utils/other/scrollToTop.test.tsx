import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { testA11yAct } from "utils/testing/commonTests";
// // utils
import { ScrollToTopComponent } from "./scrollToTop";

const scrollToTopComponent = (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <div data-testid="test-scroll-comp">
      <ScrollToTopComponent />
    </div>
  </Router>
);

describe("<ScrollToTopComponent />", () => {
  test("test scrollToTop renders", () => {
    render(scrollToTopComponent);
    expect(screen.getByTestId("test-scroll-comp")).toBeVisible;
  });

  testA11yAct(scrollToTopComponent);
});
