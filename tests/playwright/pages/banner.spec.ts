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
  test.beforeEach(async ({ adminPage }) => {
    try {
      await deleteAllBanners();
    } catch (error) {
      // TODO: UI fallback should reside in deleteAllBanners function
      if (error instanceof Error) {
        console.log(
          `⚠️ API banner deletion failed, falling back to UI: ${error.message}`
        );
      } else {
        console.log(
          "⚠️ API banner deletion failed, falling back to UI: Unknown error"
        );
      }
      await adminPage.banner.deleteExistingBanners();
    }
    await adminPage.banner.goto();
  });

  test("should see the correct banner page as an admin user", async ({
    adminPage,
  }) => {
    await expect(adminPage.banner.title).toBeVisible();
  });

  test("should be able to create banner as an admin user", async ({
    adminPage,
  }) => {
    await adminPage.banner.createAdminBanner();
    await expect(adminPage.banner.deleteBannerButton).toBeVisible();
  });

  test("should be able to delete banner as an admin user", async ({
    adminPage,
  }) => {
    await postBanner(testBannerBody);
    await adminPage.banner.page.reload();
    await adminPage.banner.deleteAdminBanner();
    await expect(adminPage.banner.deleteBannerButton).not.toBeVisible();
  });

  test("should be accessible on all device types", async ({ adminPage }) => {
    await adminPage.banner.runA11yScan();
  });
});

test("State User should not be able to edit a banner", async ({
  statePage,
}) => {
  await statePage.profile.goto("/admin");
  await expect(statePage.profile.title).toBeVisible();
  await expect(statePage.profile.bannerEditorButton).not.toBeVisible();
});
