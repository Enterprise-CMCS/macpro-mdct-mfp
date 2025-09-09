import { expect, test } from "../utils/fixtures/base";

test.describe("Admin profile", () => {
  test.beforeEach(async ({ adminProfilePage }) => {
    await adminProfilePage.goto();
    await adminProfilePage.isReady();
  });

  test(
    "Admin user can navigate to /admin",
    { tag: "@admin" },
    async ({ adminProfilePage }) => {
      const bannerPage = await adminProfilePage.navigateToBannerEditor();
      await bannerPage.isReady();
      await expect(bannerPage.title).toBeVisible();
    }
  );

  test(
    "Profile page is accessible on all device types for admin user",
    { tag: "@admin" },
    async ({ adminProfilePage }) => {
      await adminProfilePage.e2eA11y();
    }
  );
});

test.describe("State user profile", { tag: "@user" }, () => {
  test.beforeEach(async ({ stateProfilePage }) => {
    await stateProfilePage.goto();
    await stateProfilePage.isReady();
  });

  test("State user cannot navigate to /admin", async ({ stateProfilePage }) => {
    await expect(stateProfilePage.bannerEditorButton).not.toBeVisible();
    await stateProfilePage.goto("/admin");
    await stateProfilePage.isReady();
  });

  test("Profile page is accessible on all device types for state user", async ({
    stateProfilePage,
  }) => {
    await stateProfilePage.e2eA11y();
  });
});
