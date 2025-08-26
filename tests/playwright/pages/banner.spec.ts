import { stateUserAuthPath } from "../utils";
import { expect, test } from "../utils/fixtures/base";
import BannerPage from "../utils/pageObjects/banner.page";
import { deleteAllBanners, postBanner } from "../utils/requests";
import { testBanner } from "../utils/consts";

const testBannerAPI = {
  title: testBanner.title,
  description: testBanner.description,
  startDate: new Date(testBanner.startDate).getTime(),
  endDate: new Date(testBanner.endDate).getTime(),
};

test.describe("admin user banner page", () => {
  test.beforeEach(async ({ bannerPage }) => {
    try {
      await deleteAllBanners(bannerPage.page.context());
    } catch (error) {
      console.log(
        `⚠️ API banner deletion failed, falling back to UI: ${error.message}`
      );
      await bannerPage.deleteExistingBanners();
    }
    await bannerPage.goto();
  });
  test("Should see the correct banner page as an admin user", async ({
    bannerPage,
  }) => {
    await expect(bannerPage.title).toBeVisible();
  });

  test("Should be able to create banner as an admin user", async ({
    bannerPage,
  }) => {
    await bannerPage.createAdminBanner();
    await expect(bannerPage.deleteBannerButton).toBeVisible();
  });

  test("Should be able to delete banner as an admin user", async ({
    bannerPage,
  }) => {
    await postBanner(testBannerAPI, bannerPage.page.context());
    await bannerPage.deleteAdminBanner();
    await expect(bannerPage.deleteBannerButton).not.toBeVisible();
  });

  test("Should not be able to edit a banner as a state user", async ({
    browser,
    profilePage,
  }) => {
    const userContext = await browser.newContext({
      storageState: stateUserAuthPath,
    });
    await profilePage.goto();
    const newBannerPage = new BannerPage(await userContext.newPage());
    await newBannerPage.goto();
    await newBannerPage.redirectPage("/profile");
    await profilePage.isReady();
    await expect(profilePage.title).toBeVisible();
    await expect(profilePage.bannerEditorButton).not.toBeVisible();
    await userContext.close();
  });

  test("Is accessible on all device types for admin user", async ({
    bannerPage,
  }) => {
    await bannerPage.e2eA11y();
  });
});
