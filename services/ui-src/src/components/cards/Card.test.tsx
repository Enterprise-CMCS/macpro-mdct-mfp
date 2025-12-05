import { render, screen } from "@testing-library/react";
//components
import { Card } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const cardComponent = (
  <Card {...{ "data-testid": "card" }}>
    <p>Mock child component</p>
  </Card>
);

describe("<Card />", () => {
  test("Card is visible", () => {
    render(cardComponent);
    expect(screen.getByTestId("card")).toBeVisible();
  });

  testA11yAct(cardComponent);
});
