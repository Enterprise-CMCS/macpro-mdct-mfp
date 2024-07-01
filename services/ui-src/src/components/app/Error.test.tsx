import { render } from "@testing-library/react";
import { Error } from "components";
import { testA11y } from "utils/testing/commonTests";

const errorView = <Error />;

describe("<Error />", () => {
  test("Check that Error page renders", () => {
    const { getByTestId } = render(errorView);
    expect(getByTestId("error-view")).toBeVisible();
  });

  testA11y(errorView);
});
