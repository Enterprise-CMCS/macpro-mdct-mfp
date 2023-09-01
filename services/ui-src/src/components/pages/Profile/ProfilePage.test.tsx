import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ProfilePage } from "components";
// utils
import {
  mockAdminUserStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";

const ProfilePageComponent = (
  <RouterWrappedComponent>
    <ProfilePage />
  </RouterWrappedComponent>
);

// MOCKS

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

// TESTS

describe("Test ProfilePage for admin users", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockAdminUserStore);
    render(ProfilePageComponent);
  });
  test("Check that Profile page renders properly", () => {
    expect(screen.getByTestId("profile-view")).toBeVisible();
  });

  test("Check that there is an banner editor button visible", () => {
    expect(screen.getByTestId("banner-admin-button")).toBeVisible();
  });

  test("Check that the state field is set to N/A", () => {
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("N/A")).toBeVisible();
  });

  test("Check that admin button navigates to /admin on click", () => {
    const adminButton = screen.getByTestId("banner-admin-button");
    expect(adminButton).toBeVisible();
    fireEvent.click(adminButton);
    expect(window.location.pathname).toEqual("/admin");
  });
});

describe("Test ProfilePage for state users", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(ProfilePageComponent);
  });
  test("Check that Profile page renders properly", () => {
    expect(screen.getByTestId("profile-view")).toBeVisible();
  });

  test("Check that state is visible and set accordingly", () => {
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("MN")).toBeVisible();
  });

  test("Check that there is not an banner editor button", () => {
    expect(screen.queryByText("Banner Editor")).not.toBeInTheDocument();
  });
});

describe("Test ProfilePage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockAdminUserStore);
    const { container } = render(ProfilePageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
