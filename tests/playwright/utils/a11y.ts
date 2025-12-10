import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";
import { a11yTags, a11yViewports } from "./consts";

export async function checkPageAccessibility(page: Page) {
  const axeBuilder = new AxeBuilder({ page }).withTags(a11yTags);
  const results = await axeBuilder.analyze();
  return results.violations;
}

export async function checkAccessbilityAcrossViewports(
  page: Page,
  url: string
) {
  await page.goto(url);

  const accessibilityErrors: any[] = [];

  for (const [device, viewport] of Object.entries(a11yViewports)) {
    await page.setViewportSize(viewport);
    await page.locator("h1").first().waitFor({ state: "visible" });

    const axeBuilder = new AxeBuilder({ page })
      .withTags(a11yTags)
      .disableRules(["duplicate-id"]);

    const results = await axeBuilder.analyze();

    if (results.violations.length > 0) {
      accessibilityErrors.push({
        device,
        violations: results.violations,
      });
    }
  }

  return accessibilityErrors;
}
