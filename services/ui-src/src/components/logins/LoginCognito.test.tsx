import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { LoginCognito } from "components";
import { testA11y } from "utils/testing/commonTests";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const mockSignIn = jest.fn();
jest.mock("aws-amplify/auth", () => ({
  signIn: (credentials: any) => mockSignIn(credentials),
}));

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const loginCognitoComponent = (
  <RouterWrappedComponent>
    <LoginCognito />
  </RouterWrappedComponent>
);

describe("<LoginCognito />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(loginCognitoComponent);
    });

    test("LoginCognito login calls amplify auth login", async () => {
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button");
      await userEvent.type(emailInput, "email@address.com");
      await userEvent.type(passwordInput, "p@$$w0rd"); //pragma: allowlist secret
      await userEvent.click(submitButton);
      expect(mockSignIn).toHaveBeenCalledWith({
        username: "email@address.com",
        password: "p@$$w0rd", //pragma: allowlist secret
      });
      expect(mockUseNavigate).toHaveBeenCalledWith("/");
    });
  });

  testA11y(loginCognitoComponent);
});
