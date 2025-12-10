import { checkAccessbilityAcrossViewports } from "../utils/a11y";
import { expect, test } from "./fixtures/base";

test.describe("Admin profile", () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.page.goto("/profile");
  });

  test(
    "Admin user can navigate to /admin",
    { tag: "@admin" },
    async ({ adminPage }) => {
      await adminPage.navigateToBannerEditor();
      await expect(
        adminPage.page.getByRole("heading", { name: "Banner Admin" })
      ).toBeVisible();
    }
  );

  test(
    "Profile page is accessible on all device types for admin user @a11y",
    { tag: "@admin" },
    async ({ adminPage }) => {
      const accessibilityErrors = await checkAccessbilityAcrossViewports(
        adminPage.page,
        "/admin"
      );
      expect(accessibilityErrors).toEqual([]);
    }
  );
});

test.describe("State user profile", { tag: "@user" }, () => {
  test.beforeEach(async ({ statePage }) => {
    await statePage.page.goto("/profile");
  });

  test("State should not have access to /admin and should be redirected to their profile", async ({
    statePage,
  }) => {
    await expect(
      statePage.page.getByRole("button", { name: "Banner Editor" })
    ).not.toBeVisible();
    await statePage.page.goto("/admin");
    await expect(statePage.page).toHaveURL("/profile");
  });

  test("Profile page is accessible on all device types for state user @a11y", async ({
    statePage,
  }) => {
    const accessibilityErrors = await checkAccessbilityAcrossViewports(
      statePage.page,
      "/profile"
    );
    expect(accessibilityErrors).toEqual([]);
  });
});
