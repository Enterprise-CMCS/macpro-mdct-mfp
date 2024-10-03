import { test } from "../utils/fixtures/base";
import { e2eA11y } from "../utils";

test("Is accessible on all device types for admin user", async ({
  page,
  adminHomePage,
}) => {
  await adminHomePage.isReady();
  await e2eA11y(page, "/admin");
});
