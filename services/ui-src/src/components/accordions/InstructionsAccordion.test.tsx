import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { InstructionsAccordion } from "components";
// verbiage
import { mockAccordion } from "utils/testing/setupJest";

const accordionComponent = <InstructionsAccordion verbiage={mockAccordion} />;

describe("Test InstructionsAccordion", () => {
  beforeEach(() => {
    render(accordionComponent);
  });

  test("Accordion is visible", () => {
    expect(screen.getByText(mockAccordion.buttonLabel)).toBeVisible();
  });

  test("Accordion default closed state only shows the question", () => {
    expect(screen.getByText(mockAccordion.buttonLabel)).toBeVisible();
    expect(screen.getByText(mockAccordion.text)).not.toBeVisible();
  });

  test("Accordion should show answer on click", async () => {
    const accordionQuestion = screen.getByText(mockAccordion.buttonLabel);
    expect(accordionQuestion).toBeVisible();
    expect(screen.getByText(mockAccordion.text)).not.toBeVisible();
    await userEvent.click(accordionQuestion);
    expect(accordionQuestion).toBeVisible();
    expect(screen.getByText(mockAccordion.text)).toBeVisible();
  });
});

describe("Test TemplateCardAccordion accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(accordionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
