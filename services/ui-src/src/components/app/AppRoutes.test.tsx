import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { AppRoutes } from "components";
import { useUser, UserProvider } from "utils";
import { mockStateUser } from "utils/testing/setupJest";

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const appRoutesComponent = (history: any) => (
  <Router location={history.location} navigator={history}>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </Router>
);

let history: any;

describe("Test AppRoutes 404 handling", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    history = createMemoryHistory();
    history.push("/obviously-fake-route");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });

  test("not-found routes redirect to 404", () => {
    expect(screen.getByTestId("404-view")).toBeVisible();
  });
});
