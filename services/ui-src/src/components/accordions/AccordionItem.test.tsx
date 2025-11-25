import { render, screen } from "@testing-library/react";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const accordionItemComponent = (
  <RouterWrappedComponent>
    <Accordion>
      <AccordionItem data-testid="accordion-item" />
    </Accordion>
  </RouterWrappedComponent>
);

describe("<AccordionItem />", () => {
  beforeEach(() => {
    render(accordionItemComponent);
  });

  test("AccordionItem is visible", () => {
    expect(screen.getByTestId("accordion-item")).toBeVisible();
  });

  testA11yAct(accordionItemComponent);
});
