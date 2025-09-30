import { test } from "../utils/fixtures/base";

test.describe("Help Page", () => {
  test("should be accessible on all device types for state user", async ({
    statePage,
  }) => {
    await statePage.help.goto();
    await statePage.help.isReady();
    await statePage.help.runA11yScan();
  });

  test("should be accessible on all device types for admin user", async ({
    adminPage,
  }) => {
    await adminPage.help.goto();
    await adminPage.help.isReady();
    await adminPage.help.runA11yScan();
  });
});
