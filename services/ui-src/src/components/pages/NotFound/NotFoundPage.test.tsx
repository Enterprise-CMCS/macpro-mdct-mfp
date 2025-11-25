import { render } from "@testing-library/react";
// components
import { NotFoundPage } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const notFoundView = <NotFoundPage />;

describe("<NotFoundPage />", () => {
  test("Check that page renders", () => {
    const { getByTestId } = render(notFoundView);
    expect(getByTestId("404-view")).toBeVisible();
  });

  testA11yAct(notFoundView);
});
