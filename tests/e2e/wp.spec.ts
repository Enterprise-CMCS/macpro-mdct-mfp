import { test, expect } from "@playwright/test";
import { logInStateUser, archiveExistingWPs, fillQuarters } from "./helpers";

const currentYear = new Date().getFullYear();

test("State user can create a work plan", async ({ page }) => {
  await archiveExistingWPs({ page });
  await logInStateUser({ page });

  await expect(
    page.getByText("Money Follows the Person (MFP) Portal")
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Enter Work Plan online" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Enter Work Plan online" }).click();

  expect(page).toHaveURL("/wp");
  page.waitForResponse("**/reports/WP/PR");

  const createButton = await page.getByRole("button", {
    name: "Start MFP Work Plan",
  });

  expect(createButton).toBeVisible();
  await createButton.click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Add new MFP Work Plan");

  await page.getByLabel(`${currentYear}`).click();
  await page.getByLabel(`First reporting period (January 1 - June 30)`).click();
  await page.getByRole("button", { name: "Start new" }).click();

  await expect(
    page.getByText(`Puerto Rico MFP Work Plan ${currentYear} - Period 1`)
  ).toBeVisible();

  const editButton = await page.getByRole("button", { name: "Edit" });
  expect(editButton).toBeEnabled();
  await editButton.click();

  await expect(page).toHaveURL("/wp/general-information");
  const continueButton = await page.getByRole("button", { name: "Continue" });
  expect(continueButton).toBeEnabled();
  await continueButton.click();

  // TRANSITION BENCHMARKS
  await expect(page).toHaveURL("/wp/transition-benchmarks");

  // OLDER ADULTS
  const olderAdultsEditButton = await page.getByRole("button", {
    name: "edit button for Older Adults",
  });
  expect(olderAdultsEditButton).toBeEnabled();
  await olderAdultsEditButton.click();

  await expect(
    page.getByText("Report transition benchmarks for  Older adults")
  ).toBeVisible();

  const olderAdultsRadioButton = await page.getByRole("radio", { name: "Yes" });
  expect(olderAdultsRadioButton).toBeEnabled();
  await olderAdultsRadioButton.click();

  await fillQuarters({ page });

  const olderAdultsSaveButton = await page.getByRole("button", {
    name: "Save & close",
  });
  expect(olderAdultsSaveButton).toBeEnabled();
  await olderAdultsSaveButton.click();

  // individualsWithPD
  const individualsWithPDEditButton = await page.getByRole("button", {
    name: "edit button for Individuals with physical disabilities (PD)",
  });
  expect(individualsWithPDEditButton).toBeEnabled();
  await individualsWithPDEditButton.click();

  await expect(
    page.getByText(
      "Report transition benchmarks for Individuals with physical disabilities (PD)"
    )
  ).toBeVisible();

  const individualsWithPDRadioButton = await page.getByRole("radio", {
    name: "No",
  });
  expect(individualsWithPDRadioButton).toBeEnabled();
  await individualsWithPDRadioButton.click();

  const individualsWithPDSaveButton = await page.getByRole("button", {
    name: "Save",
  });
  expect(individualsWithPDSaveButton).toBeEnabled();
  await individualsWithPDSaveButton.click();

  // individualsWithIDD
  const individualsWithIDDEditButton = await page.getByRole("button", {
    name: "edit button for Individuals with intellectual and developmental disabilities (I/DD)",
  });
  expect(individualsWithIDDEditButton).toBeEnabled();
  await individualsWithIDDEditButton.click();

  await expect(
    page.getByText(
      "Report transition benchmarks for Individuals with intellectual and developmental disabilities (I/DD)"
    )
  ).toBeVisible();

  const individualsWithIDDRadioButton = await page.getByRole("radio", {
    name: "No",
  });
  expect(individualsWithIDDRadioButton).toBeEnabled();
  await individualsWithIDDRadioButton.click();

  const individualsWithIDDSaveButton = await page.getByRole("button", {
    name: "Save",
  });
  expect(individualsWithIDDSaveButton).toBeEnabled();
  await individualsWithIDDSaveButton.click();

  // Individuals with mental health and substance use disorders (MH/SUD)

  const individualsWithMHSUDEditButton = await page.getByRole("button", {
    name: "edit button for Individuals with mental health and substance use disorders (MH/SUD)",
  });
  expect(individualsWithMHSUDEditButton).toBeEnabled();
  await individualsWithMHSUDEditButton.click();

  await expect(
    page.getByText(
      "Report transition benchmarks for Individuals with mental health and substance use disorders (MH/SUD)"
    )
  ).toBeVisible();

  const individualsWithMHSUDRadioButton = await page.getByRole("radio", {
    name: "No",
  });
  expect(individualsWithMHSUDRadioButton).toBeEnabled();
  await individualsWithMHSUDRadioButton.click();

  const individualsWithMHSUDSaveButton = await page.getByRole("button", {
    name: "Save",
  });
  expect(individualsWithMHSUDSaveButton).toBeEnabled();
  await individualsWithMHSUDSaveButton.click();

  await page.getByRole("button", { name: "Continue" }).click();

  // TRANSITION BENCHMARK STRATEGY
  await expect(page).toHaveURL("/wp/transition-benchmark-strategy");

  const strategyExplanation = page.getByLabel("Explain how you formulated");

  await strategyExplanation.fill("test text fill");

  const strategyAdditionalDetails = page.getByLabel(
    "Provide additional detail"
  );

  await strategyAdditionalDetails.fill("Additional details");

  await page.getByRole("button", { name: "Continue" }).click();

  // state-or-territory-specific-initiatives/instructions
  await expect(page).toHaveURL(
    "/wp/state-or-territory-specific-initiatives/instructions"
  );

  await expect(
    page.getByRole("heading", {
      name: "State or Territory-Specific Initiatives Instructions",
    })
  ).toBeVisible();

  await expect(
    page.getByText(
      "Are self-directed initiatives applicable to your state or territory?"
    )
  ).toBeVisible();

  const instructionsSelfDirectedInitiatives = await page
    .getByRole("group", { name: "Are self-directed initiatives" })
    .getByLabel("Yes");
  await instructionsSelfDirectedInitiatives.click();

  const instructionsTribalInitiatives = await page
    .getByRole("group", { name: "Are Tribal Initiatives" })
    .getByLabel("No");
  await instructionsTribalInitiatives.click();

  await page.getByRole("button", { name: "Continue" }).click();

  // Initiatives
  await expect(page).toHaveURL(
    "/wp/state-or-territory-specific-initiatives/initiatives"
  );

  // Add the initiatives

  // await addInitiatives({ page });

  // Transitions and Transition Coordination Services
  const addInitiativeButton = await page.getByRole("button", {
    name: "Add Initiative",
  });

  await addInitiativeButton.click();

  const initiativeNameTextbox = page.getByLabel("Initiative name");
  await initiativeNameTextbox.fill(
    "Transitions and Transition Coordination Services Initiative"
  );

  const transitionCoordinationRadio = await page.getByRole("radio", {
    name: "Transitions and transition coordination services",
  });
  await transitionCoordinationRadio.click();
  await page.getByRole("button", { name: "Save" }).click();

  await expect(
    page.getByRole("row", {
      name: "Transitions and Transition Coordination Services Initiative",
    })
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: "edit button for Transitions and Transition Coordination Services Initiative",
    })
    .click();

  // II
  await page
    .getByRole("button", { name: "edit button for II. Evaluation plan" })
    .click();

  await page.getByRole("button", { name: "Add objective" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Add objective for Transitions and Transition Coordination Services Initiative",
    })
  ).toBeVisible();

  const objectiveTextbox = await page.getByRole("textbox", {
    name: "Objective",
    exact: true,
  });

  await objectiveTextbox.fill("SMART goals, targets, milestones");

  await expect(objectiveTextbox).toHaveValue(
    "SMART goals, targets, milestones"
  );

  const performanceMeasuresTextbox = await page.getByLabel(
    "Describe the performance measures"
  );

  await performanceMeasuresTextbox.fill(
    "Performance measures or indicators your state or territory will use"
  );

  await page
    .getByLabel("Provide targets")
    .fill("Targets for the performance measures or indicators listed above");

  await page.getByRole("radio", { name: "Yes" }).click();

  await fillQuarters({ page });

  const additionalDetailsTextbox = await page.getByLabel(
    "Provide additional detail on"
  );

  await additionalDetailsTextbox.fill("Additional details");

  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByTestId("entityCard")).toBeVisible();
  await page.getByRole("button", { name: "Save & return" }).click();

  await expect(page.getByRole("table")).toBeVisible();

  // III
  await page
    .getByRole("button", { name: "edit button for III. Funding sources" })
    .click();

  await page.getByRole("button", { name: "Add funding source" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Add funding source and projected expenditures for Transitions and Transition Coordination Services Initiative",
    })
  ).toBeVisible();

  const fundingSourceRadioButton = await page.getByRole("radio", {
    name: "MFP cooperative agreement funds for qualified HCBS and demonstration services",
  });

  await fundingSourceRadioButton.click();

  await fillQuarters({ page });

  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByTestId("entityCard")).toBeVisible();
  await expect(page.getByTestId("entityCard")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Save & return" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Save & return" }).click();
  await expect(page.getByRole("table")).toBeVisible();

  // I
  await page
    .getByRole("button", { name: "edit button for I. Define initiative" })
    .click();

  await expect(
    page.getByText(
      "State or Territory-Specific Initiatives: I. Define initiative"
    )
  ).toBeVisible();

  await page
    .getByRole("textbox", {
      name: "Describe the initiative, including key activities",
    })
    .fill("initiative description, including target populations and timeframe");

  const olderAdultsCheckbox = await page.getByLabel("Older adults");
  await olderAdultsCheckbox.click();
  await expect(olderAdultsCheckbox).toBeChecked();

  await page
    .getByRole("textbox", { name: "Start date" })
    .fill(`02/03/${currentYear}`);

  const endDate = page.getByRole("radio", { name: "Yes" });

  await endDate.click();

  await expect(endDate).toBeChecked();

  await page
    .getByRole("textbox", { name: "Projected end date" })
    .fill(`05/03/${currentYear}`);

  await expect(page.getByRole("alert")).toBeHidden();

  await page.getByRole("button", { name: "Save & return" }).click();

  await expect(page.getByRole("table")).toBeVisible();

  await page.getByLabel("Return to all initiatives").first().click();

  // Housing-related Supports

  await addInitiativeButton.click();
  await initiativeNameTextbox.fill("Housing-related Supports Initiative");

  const housingSupportsRadio = await page.getByRole("radio", {
    name: "Housing-related supports",
  });
  await housingSupportsRadio.click();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(
    page.getByRole("row", {
      name: "Housing-related Supports Initiative",
    })
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: "edit button for Housing-related Supports Initiative",
    })
    .click();

  // II
  await page
    .getByRole("button", { name: "edit button for II. Evaluation plan" })
    .click();

  await page.getByRole("button", { name: "Add objective" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Add objective for Housing-related Supports Initiative",
    })
  ).toBeVisible();

  const objectiveTextboxHousing = await page.getByRole("textbox", {
    name: "Objective",
    exact: true,
  });

  await objectiveTextboxHousing.fill("SMART goals, targets, milestones");

  await expect(objectiveTextboxHousing).toHaveValue(
    "SMART goals, targets, milestones"
  );

  await performanceMeasuresTextbox.fill(
    "Performance measures or indicators your state or territory will use"
  );

  await page
    .getByLabel("Provide targets")
    .fill("Targets for the performance measures or indicators listed above");

  await page.getByRole("radio", { name: "Yes" }).click();

  await fillQuarters({ page });

  await additionalDetailsTextbox.fill("Additional details");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByTestId("entityCard")).toBeVisible();
  await page.getByRole("button", { name: "Save & return" }).click();

  // III
  await page
    .getByRole("button", { name: "edit button for III. Funding sources" })
    .click();

  await page.getByRole("button", { name: "Add funding source" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Add funding source and projected expenditures for Housing-related Supports Initiative",
    })
  ).toBeVisible();

  await fundingSourceRadioButton.click();

  await fillQuarters({ page });

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByTestId("entityCard")).toBeVisible();
  await expect(page.getByTestId("entityCard")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Save & return" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Save & return" }).click();
  await expect(page.getByRole("table")).toBeVisible();

  // I
  await page
    .getByRole("button", { name: "edit button for I. Define initiative" })
    .click();

  await expect(
    page.getByText(
      "State or Territory-Specific Initiatives: I. Define initiative"
    )
  ).toBeVisible();

  await page
    .getByRole("textbox", {
      name: "Describe the initiative, including key activities",
    })
    .fill("initiative description, including target populations and timeframe");

  await olderAdultsCheckbox.click();
  await expect(olderAdultsCheckbox).toBeChecked();

  await page
    .getByRole("textbox", { name: "Start date" })
    .fill(`02/03/${currentYear}`);

  await page.getByRole("radio", { name: "Yes" }).click();

  await page
    .getByRole("textbox", { name: "Projected end date" })
    .fill(`05/03/${currentYear}`);

  await expect(page.getByRole("alert")).toBeHidden();

  await page.getByRole("button", { name: "Save & return" }).click();

  await expect(page.getByRole("table")).toBeVisible();

  await page.getByLabel("Return to all initiatives").first().click();

  // Quality measurement and improvement

  await addInitiativeButton.click();
  await initiativeNameTextbox.fill(
    "Quality Measurement and Improvement Initiative"
  );

  const qualityMeasurementRadio = await page.getByRole("radio", {
    name: "Quality measurement and improvement",
  });
  await qualityMeasurementRadio.click();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(
    page.getByRole("row", {
      name: "Quality Measurement and Improvement Initiative",
    })
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: "edit button for Quality Measurement and Improvement Initiative",
    })
    .click();

  // II
  await page
    .getByRole("button", { name: "edit button for II. Evaluation plan" })
    .click();

  await page.getByRole("button", { name: "Add objective" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Add objective for Quality Measurement and Improvement Initiative",
    })
  ).toBeVisible();

  const objectiveTextboxQualityMeasure = await page.getByRole("textbox", {
    name: "Objective",
    exact: true,
  });

  await objectiveTextboxQualityMeasure.fill("SMART goals, targets, milestones");

  await expect(objectiveTextboxQualityMeasure).toHaveValue(
    "SMART goals, targets, milestones"
  );

  await performanceMeasuresTextbox.fill(
    "Performance measures or indicators your state or territory will use"
  );

  await page
    .getByLabel("Provide targets")
    .fill("Targets for the performance measures or indicators listed above");

  await page.getByRole("radio", { name: "Yes" }).click();

  await fillQuarters({ page });

  await additionalDetailsTextbox.fill("Additional details");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByTestId("entityCard")).toBeVisible();
  await page.getByRole("button", { name: "Save & return" }).click();

  // III
  await page
    .getByRole("button", { name: "edit button for III. Funding sources" })
    .click();

  await page.getByRole("button", { name: "Add funding source" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Add funding source and projected expenditures for Quality Measurement and Improvement Initiative",
    })
  ).toBeVisible();

  await fundingSourceRadioButton.click();

  await fillQuarters({ page });

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByTestId("entityCard")).toBeVisible();
  await expect(page.getByTestId("entityCard")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Save & return" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Save & return" }).click();
  await expect(page.getByRole("table")).toBeVisible();

  // I
  await page
    .getByRole("button", { name: "edit button for I. Define initiative" })
    .click();

  await expect(
    page.getByText(
      "State or Territory-Specific Initiatives: I. Define initiative"
    )
  ).toBeVisible();

  await page
    .getByRole("textbox", {
      name: "Describe the initiative, including key activities",
    })
    .fill("initiative description, including target populations and timeframe");

  await olderAdultsCheckbox.click();
  await expect(olderAdultsCheckbox).toBeChecked();

  await page
    .getByRole("textbox", { name: "Start date" })
    .fill(`02/03/${currentYear}`);

  await page.getByRole("radio", { name: "Yes" }).click();

  await page
    .getByRole("textbox", { name: "Projected end date" })
    .fill(`05/03/${currentYear}`);

  await expect(page.getByRole("alert")).toBeHidden();

  await page.getByRole("button", { name: "Save & return" }).click();

  await expect(page.getByRole("table")).toBeVisible();
  await page.getByLabel("Return to all initiatives").first().click();

  // Self-direction

  await addInitiativeButton.click();
  await initiativeNameTextbox.fill("Self-Direction Initiative");

  const selfDirectionRadio = await page.getByRole("radio", {
    name: "Self-direction",
  });
  await selfDirectionRadio.click();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(
    page.getByRole("row", {
      name: "Self-Direction Initiative",
    })
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: "edit button for Self-Direction Initiative",
    })
    .click();

  // II
  await page
    .getByRole("button", { name: "edit button for II. Evaluation plan" })
    .click();

  await page.getByRole("button", { name: "Add objective" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Add objective for Self-Direction Initiative",
    })
  ).toBeVisible();

  const objectiveTextboxSelfDirection = await page.getByRole("textbox", {
    name: "Objective",
    exact: true,
  });

  await objectiveTextboxSelfDirection.fill("SMART goals, targets, milestones");

  await expect(objectiveTextboxSelfDirection).toHaveValue(
    "SMART goals, targets, milestones"
  );

  await performanceMeasuresTextbox.fill(
    "Performance measures or indicators your state or territory will use"
  );

  await page
    .getByLabel("Provide targets")
    .fill("Targets for the performance measures or indicators listed above");

  await page.getByRole("radio", { name: "Yes" }).click();

  await fillQuarters({ page });

  await additionalDetailsTextbox.fill("Additional details");

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByTestId("entityCard")).toBeVisible();
  await page.getByRole("button", { name: "Save & return" }).click();

  // III
  await page
    .getByRole("button", { name: "edit button for III. Funding sources" })
    .click();

  await page.getByRole("button", { name: "Add funding source" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Add funding source and projected expenditures for Self-Direction Initiative",
    })
  ).toBeVisible();

  await fundingSourceRadioButton.click();

  await fillQuarters({ page });

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByTestId("entityCard")).toBeVisible();
  await expect(page.getByTestId("entityCard")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Save & return" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Save & return" }).click();
  await expect(page.getByRole("table")).toBeVisible();

  // I
  await page
    .getByRole("button", { name: "edit button for I. Define initiative" })
    .click();

  await expect(
    page.getByText(
      "State or Territory-Specific Initiatives: I. Define initiative"
    )
  ).toBeVisible();

  await page
    .getByRole("textbox", {
      name: "Describe the initiative, including key activities",
    })
    .fill("initiative description, including target populations and timeframe");

  await olderAdultsCheckbox.click();
  await expect(olderAdultsCheckbox).toBeChecked();

  await page
    .getByRole("textbox", { name: "Start date" })
    .fill(`02/03/${currentYear}`);

  await page.getByRole("radio", { name: "Yes" }).click();

  await page
    .getByRole("textbox", { name: "Projected end date" })
    .fill(`05/03/${currentYear}`);

  await expect(page.getByRole("alert")).toBeHidden();

  await page.getByRole("button", { name: "Save & return" }).click();

  await expect(page.getByRole("table")).toBeVisible();

  await page.getByLabel("Return to all initiatives").first().click();

  //////
  expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(page).toHaveURL("/wp/review-and-submit");

  await expect(page.getByText("Error")).toBeHidden();
  await expect(page.getByText("Complete")).toHaveCount(4);

  const submitButton = await page.getByRole("button", { name: "Submit" });

  expect(submitButton).toBeEnabled();

  await submitButton.click();

  await expect(page.getByText("Successfully Submitted")).toBeVisible();
});
