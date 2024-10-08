import { test, expect } from "../utils/fixtures/base";
import { currentYear } from "../../seeds/helpers";
import {
  archiveExistingWPs,
  firstPeriod,
  logInStateUser,
  stateName,
} from "../utils";

test.skip("State user can create a SAR", async ({
  page,
  stateHomePage,
  sarDashboard,
}) => {
  await archiveExistingWPs(page);

  // TODO: Seed WP

  // View SARs
  await logInStateUser(page);
  await stateHomePage.sarButton.click();

  // Create SAR
  await sarDashboard.isReady();
  await sarDashboard.createButton.click();
  await expect(sarDashboard.modal).toBeVisible();
  await expect(sarDashboard.modal).toContainText("Add new MFP SAR submission");
  await expect(sarDashboard.associatedWP).toHaveValue(
    `${stateName} MFP Work Plan ${currentYear} - Period ${firstPeriod}`
  );

  await sarDashboard.createNewSAR();

  // Confirm created SAR is in table
  await expect(sarDashboard.firstReport).toBeVisible();

  const editIcon = sarDashboard.firstReport.getByRole("button", {
    name: "Edit Report",
  });
  await expect(editIcon).toBeVisible();

  const editButton = sarDashboard.firstReport.getByRole("button", {
    name: "Edit",
    exact: true,
  });
  await expect(editButton).toBeVisible();
});
