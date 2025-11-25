import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { FaqAccordion } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const accordionItems = [
  {
    question: "Question?",
    answer: "Answer!",
  },
];

const faqAccordionComponent = (
  <RouterWrappedComponent>
    <FaqAccordion accordionItems={accordionItems} />
  </RouterWrappedComponent>
);

describe("<FaqAccordion />", () => {
  beforeEach(() => {
    render(faqAccordionComponent);
  });

  test("FaqAccordion is visible", () => {
    expect(screen.getByText(accordionItems[0].question)).toBeVisible();
  });

  test("FaqAccordion default closed state only shows the question", () => {
    expect(screen.getByText(accordionItems[0].question)).toBeVisible();
    expect(screen.getByText(accordionItems[0].answer)).not.toBeVisible();
  });

  test("FaqAccordion should show answer on click", async () => {
    const faqQuestion = screen.getByText(accordionItems[0].question);
    expect(faqQuestion).toBeVisible();
    expect(screen.getByText(accordionItems[0].answer)).not.toBeVisible();
    await act(async () => {
      await userEvent.click(faqQuestion);
    });
    expect(faqQuestion).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText(accordionItems[0].answer)).toBeVisible();
    });
  });

  testA11yAct(faqAccordionComponent);
});
