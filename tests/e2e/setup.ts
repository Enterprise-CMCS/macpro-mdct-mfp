import { test as base } from "@playwright/test";
import { Login } from "./fixtures/login";

// Declare the types of your fixtures.
type TestFixtures = {
  login: Login;
};

// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<TestFixtures>({
  login: async ({ page }, use) => {
    await use(new Login(page));
  },
});
export { expect } from "@playwright/test";
