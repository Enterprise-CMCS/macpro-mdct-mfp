import { checkAccessbilityAcrossViewports } from "../utils/a11y";
import { test, expect } from "./fixtures/base";

test.describe("Help Page", () => {
  test("should be accessible on all device types for state user", async ({
    statePage,
  }) => {
    const accessibilityErrors = await checkAccessbilityAcrossViewports(
      statePage.page,
      "/help"
    );
    expect(accessibilityErrors).toEqual([]);
  });

  test("should be accessible on all device types for admin user", async ({
    adminPage,
  }) => {
    const accessibilityErrors = await checkAccessbilityAcrossViewports(
      adminPage.page,
      "/help"
    );
    expect(accessibilityErrors).toEqual([]);
  });
});
