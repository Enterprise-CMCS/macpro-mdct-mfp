import { render, screen } from "@testing-library/react";
// components
import { AdminBannerForm } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/mockRouter";
import userEvent from "@testing-library/user-event";
import { testA11y } from "utils/testing/commonTests";

const mockWriteAdminBanner = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const adminBannerFormComponent = (writeAdminBanner: Function) => (
  <RouterWrappedComponent>
    <AdminBannerForm
      writeAdminBanner={writeAdminBanner}
      data-testid="test-form"
    />
  </RouterWrappedComponent>
);

describe("<AdminBannerForm />", () => {
  test("AdminBannerForm is visible", () => {
    render(adminBannerFormComponent(mockWriteAdminBanner));
    const form = screen.getByTestId("test-form");
    expect(form).toBeVisible();
  });

  test("AdminBannerForm can be filled and submitted without error", async () => {
    render(adminBannerFormComponent(mockWriteAdminBanner));

    const titleInput = screen.getByLabelText("Title text");
    await userEvent.type(titleInput, "mock title");

    const descriptionInput = screen.getByLabelText("Description text");
    await userEvent.type(descriptionInput, "mock description");

    const linkInput = screen.getByLabelText("Link", { exact: false });
    await userEvent.type(linkInput, "http://example.com");

    const startDateInput = screen.getByLabelText("Start date");
    await userEvent.type(startDateInput, "01/01/1970");

    const endDateInput = screen.getByLabelText("End date");
    await userEvent.type(endDateInput, "01/01/1970");

    const submitButton = screen.getByText("Replace Current Banner");
    await userEvent.click(submitButton);

    const HOURS = 60 * 60 * 1000;

    expect(mockWriteAdminBanner).toHaveBeenCalledWith({
      key: "admin-banner-id",
      title: "mock title",
      description: "mock description",
      link: "http://example.com",
      startDate: 5 * HOURS, // midnight UTC, in New York
      endDate: 29 * HOURS - 1000, // 1 second before midnight of the next day
    });
  });

  test("AdminBannerForm shows an error when submit fails", async () => {
    mockWriteAdminBanner.mockImplementationOnce(() => {
      throw new Error("FAILURE");
    });

    render(adminBannerFormComponent(mockWriteAdminBanner));

    const titleInput = screen.getByLabelText("Title text");
    await userEvent.type(titleInput, "mock title");

    const descriptionInput = screen.getByLabelText("Description text");
    await userEvent.type(descriptionInput, "mock description");

    const linkInput = screen.getByLabelText("Link", { exact: false });
    await userEvent.type(linkInput, "http://example.com");

    const startDateInput = screen.getByLabelText("Start date");
    await userEvent.type(startDateInput, "01/01/1970");

    const endDateInput = screen.getByLabelText("End date");
    await userEvent.type(endDateInput, "01/01/1970");

    const submitButton = screen.getByText("Replace Current Banner");
    await userEvent.click(submitButton);

    const errorMessage = screen.getByText(
      "Current banner could not be replaced",
      { exact: false }
    );
    expect(errorMessage).toBeVisible();
  });

  testA11y(adminBannerFormComponent(mockWriteAdminBanner));
});
