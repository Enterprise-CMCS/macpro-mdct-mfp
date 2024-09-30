import { Page } from "@playwright/test";
import { logInAdminUser, logOutUser } from "./login";
import { stateAbbreviation } from "./consts";

export async function archiveReports(page: Page) {
  const archiveButtons = await page
    .getByRole("button", { name: "Archive", exact: true })
    .all();
  if (archiveButtons.length > 0) {
    await archiveButtons[0].click();
    const modal = page.getByRole("dialog");
    await modal.isVisible();
    await modal.getByRole("textbox").fill("ARCHIVE");
    await modal.getByRole("button", { name: "Archive" }).click();
    await page.waitForResponse(
      (response: Response) =>
        response.url().includes(`reports/archive/WP/${stateAbbreviation}/`) &&
        response.status() == 200
    );
    await modal.isHidden();
    await page.getByRole("table").isVisible();
    await archiveReports(page);
  }
}

export async function archiveExistingWPs(page: Page) {
  await logInAdminUser(page);
  await page
    .getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    })
    .selectOption(stateAbbreviation);
  await page.getByLabel("MFP Work Plan").click();

  await page.getByRole("button", { name: "Go to Report Dashboard" }).click();
  await page.getByRole("table").isVisible();
  await archiveReports(page);
  await logOutUser(page);
}
