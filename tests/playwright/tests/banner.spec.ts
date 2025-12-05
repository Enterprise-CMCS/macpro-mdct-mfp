import { test, expect } from "./fixtures/base";
import { deleteAllBanners, postBanner } from "../utils/requests";
import { testBanner } from "../utils/consts";
import { checkAccessbilityAcrossViewports } from "../utils/a11y";

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
      if (error instanceof Error) {
        console.log(
          `⚠️ API banner deletion failed, falling back to UI: ${error.message}`
        );
      } else {
        console.log(
          "⚠️ API banner deletion failed, falling back to UI: Unknown error"
        );
      }
      await adminPage.deleteExistingBanners();
    }
    await adminPage.page.goto("/admin");
  });

  test("should see the correct banner page as an admin user", async ({
    adminPage,
  }) => {
    await expect(
      adminPage.page.getByRole("heading", { name: "Banner Admin" })
    ).toBeVisible();
  });

  test("should be able to create banner as an admin user", async ({
    adminPage,
  }) => {
    await adminPage.createAdminBanner();
    await expect(
      adminPage.page.getByRole("button", { name: "Delete banner" })
    ).toBeVisible();
  });

  test("should be able to delete banner as an admin user", async ({
    adminPage,
  }) => {
    await postBanner(testBannerBody);
    await adminPage.page.reload();
    await adminPage.deleteAdminBanner();
    await expect(
      adminPage.page.getByRole("button", { name: "Delete banner" })
    ).not.toBeVisible();
  });

  test("should be accessible on all device types @a11y", async ({
    adminPage,
  }) => {
    const accessibilityErrors = await checkAccessbilityAcrossViewports(
      adminPage.page,
      "/admin"
    );
    expect(accessibilityErrors).toEqual([]);
  });
});

test("State User should not be able to edit a banner and should be redirected to their account page", async ({
  statePage,
}) => {
  await statePage.page.goto("/admin");
  await expect(
    statePage.page.getByRole("heading", { name: "My Account" })
  ).toBeVisible();
  await expect(
    statePage.page.getByRole("button", { name: "Banner Editor" })
  ).not.toBeVisible();
});
