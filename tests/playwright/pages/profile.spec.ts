import { expect, test } from "../utils/fixtures/base";

test.describe("Admin profile", () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.profile.goto();
    await adminPage.profile.isReady();
  });

  test(
    "Admin user can navigate to /admin",
    { tag: "@admin" },
    async ({ adminPage }) => {
      await adminPage.profile.navigateToBannerEditor();
      await adminPage.banner.isReady();
      await expect(adminPage.banner.title).toBeVisible();
    }
  );

  test(
    "Profile page is accessible on all device types for admin user",
    { tag: "@admin" },
    async ({ adminPage }) => {
      await adminPage.profile.runA11yScan();
    }
  );
});

test.describe("State user profile", { tag: "@user" }, () => {
  test.beforeEach(async ({ statePage }) => {
    await statePage.profile.goto();
    await statePage.profile.isReady();
  });

  test("State user cannot navigate to /admin", async ({ statePage }) => {
    await expect(statePage.profile.bannerEditorButton).not.toBeVisible();
    await statePage.profile.goto("/admin");
    await statePage.profile.isReady();
  });

  test("Profile page is accessible on all device types for state user", async ({
    statePage,
  }) => {
    await statePage.profile.runA11yScan();
  });
});
