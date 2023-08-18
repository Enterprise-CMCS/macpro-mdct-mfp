import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { AdminBannerForm } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const mockWriteAdminBanner = jest.fn();

const adminBannerFormComponent = (writeAdminBanner: Function) => (
  <RouterWrappedComponent>
    <AdminBannerForm
      writeAdminBanner={writeAdminBanner}
      data-testid="test-form"
    />
  </RouterWrappedComponent>
);

describe("Test AdminBannerForm component", () => {
  test("AdminBannerForm is visible", () => {
    render(adminBannerFormComponent(mockWriteAdminBanner));
    const form = screen.getByTestId("test-form");
    expect(form).toBeVisible();
  });
});

describe("Test AdminBannerForm accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      adminBannerFormComponent(mockWriteAdminBanner)
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
