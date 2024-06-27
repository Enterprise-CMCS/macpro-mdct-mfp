import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Auth } from "aws-amplify";
//components
import { LoginCognito } from "components";
import { testA11y } from "utils/testing/commonTests";

const loginCognitoComponent = (
  <RouterWrappedComponent>
    <LoginCognito />
  </RouterWrappedComponent>
);

jest.mock("aws-amplify", () => ({
  Auth: {
    signIn: jest.fn(),
  },
}));

describe("<LoginCognito />", () => {
  describe("Test LoginCognito", () => {
    beforeEach(() => {
      render(loginCognitoComponent);
    });

    test("LoginCognito email field is visible", () => {
      expect(screen.getByText("Email")).toBeVisible();
    });

    test("LoginCognito password field is visible", () => {
      expect(screen.getByText("Password")).toBeVisible();
    });

    test("LoginCognito login button is visible", () => {
      expect(screen.getByRole("button")).toBeVisible();
    });

    test("LoginCognito calls Auth.signIn", async () => {
      const loginButton = screen.getByText("Log In with Cognito", {
        selector: "button",
      });
      await userEvent.click(loginButton);

      expect(Auth.signIn).toHaveBeenCalled();
    });
  });

  testA11y(loginCognitoComponent);
});
