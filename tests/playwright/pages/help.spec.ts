import { test } from "../utils/fixtures/base";

test.describe("Help Page", () => {
  test("should be accessible on all device types for state user", async ({
    statePage,
    runA11yScan,
  }) => {
    await statePage.help.goto();
    await statePage.help.isReady();
    await runA11yScan(statePage.help.page);
  });

  test("should be accessible on all device types for admin user", async ({
    adminPage,
    runA11yScan,
  }) => {
    await adminPage.help.goto();
    await adminPage.help.isReady();
    await runA11yScan(adminPage.help.page);
  });
});
