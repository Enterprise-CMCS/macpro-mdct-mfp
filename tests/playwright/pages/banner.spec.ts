import { expect, test } from "../utils/fixtures/base";
import { deleteAllBanners, postBanner } from "../utils/requests";
import { testBanner } from "../utils/consts";

const testBannerBody = {
  title: testBanner.title,
  description: testBanner.description,
  startDate: new Date(testBanner.startDate).getTime(),
  endDate: new Date(testBanner.endDate).getTime(),
};

test.describe("admin user banner page", () => {
  test.beforeEach(async ({ adminBannerPage }) => {
    try {
      await deleteAllBanners();
    } catch (error) {
      console.log(
        `⚠️ API banner deletion failed, falling back to UI: ${error.message}`
      );
      await adminBannerPage.deleteExistingBanners();
    }
    await adminBannerPage.goto();
  });
  test("Should see the correct banner page as an admin user", async ({
    adminBannerPage,
  }) => {
    await expect(adminBannerPage.title).toBeVisible();
  });

  test("Should be able to create banner as an admin user", async ({
    adminBannerPage,
  }) => {
    await adminBannerPage.createAdminBanner();
    await expect(adminBannerPage.deleteBannerButton).toBeVisible();
  });

  test("Should be able to delete banner as an admin user", async ({
    adminBannerPage,
  }) => {
    await postBanner(testBannerBody);
    await adminBannerPage.page.reload();
    await adminBannerPage.deleteAdminBanner();
    await expect(adminBannerPage.deleteBannerButton).not.toBeVisible();
  });

  test("Is accessible on all device types for admin user", async ({
    adminBannerPage,
  }) => {
    await adminBannerPage.e2eA11y();
  });
});

test("State User should not be able to edit a banner", async ({
  stateProfilePage,
}) => {
  await stateProfilePage.goto("/admin");
  await expect(stateProfilePage.title).toBeVisible();
  await expect(stateProfilePage.bannerEditorButton).not.toBeVisible();
});
