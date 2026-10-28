import { expect, test } from "./fixtures/base";
import {
  archiveAllReportsForState,
  hasActiveReportsWithSars,
} from "../utils/requests";
import {
  currentYear,
  fillWorkPlanTestData,
  stateAbbreviation,
  testWorkPlan,
} from "../utils/consts";
import { checkPageAccessibility } from "../utils/a11y";

test.describe("Work plan a11y", { tag: "@a11y" }, () => {
  test.beforeAll("check for active SAR reports", async () => {
    const hasActiveSarReports =
      await hasActiveReportsWithSars(stateAbbreviation);

    if (hasActiveSarReports) {
      test.skip(
        true,
        "Skipping Work Plan tests: Active reports with associated SARs found that cannot be archived"
      );
    }
  });

  test.beforeEach("reset work plans", async ({ statePage }) => {
    await archiveAllReportsForState(stateAbbreviation);
    await statePage.page.goto("/");
    const getReportsResp = statePage.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/WP/") &&
        response.request().method() === "GET" &&
        response.status() === 200
    );
    await statePage.page
      .getByRole("button", { name: "Enter Work Plan" })
      .click();
    await getReportsResp;
  });

  test("fill out work plan then run WCAG checks", async ({ statePage }) => {
    await test.step("fill out entire work plan", async () => {
      await statePage.startNewWorkPlan(
        currentYear,
        testWorkPlan.reportingPeriod
      );
      await statePage.fillWorkPlan(fillWorkPlanTestData);
    });

    await test.step("Navigate to /wp", async () => {
      const getReportsResp = statePage.page.waitForResponse(
        (response) =>
          response.url().includes("/reports/WP/") &&
          response.request().method() === "GET" &&
          response.status() === 200
      );
      await statePage.page.goto("/wp");
      await getReportsResp;
      await statePage.page
        .getByRole("heading", { name: "Puerto Rico MFP Work Plan" })
        .waitFor();
    });
    await test.step("WCAG checks on /wp", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to /wp/general-information", async () => {
      await statePage.page.getByRole("button", { name: "Edit" }).click();
      await statePage.page
        .getByRole("heading", { name: "General Information" })
        .waitFor();
    });
    await test.step("WCAG checks on /wp/general-information", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to /wp/transition-benchmarks", async () => {
      await statePage.page.getByRole("button", { name: "Continue" }).click();
      await statePage.page
        .getByRole("heading", { name: "Transition Benchmark Projections" })
        .waitFor();
    });
    await test.step("WCAG checks on /wp/transition-benchmarks", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to older adults drawer", async () => {
      await statePage.page
        .getByRole("button", { name: "Edit Older adults" })
        .click();
      await expect
        .soft(statePage.page.getByRole("dialog"))
        .toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
      await statePage.page.getByText("Report transition benchmarks").waitFor();
    });
    await test.step("WCAG checks on /wp/transition-benchmarks older adults drawer", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to Individuals with physical disabilities (PD) drawer", async () => {
      await statePage.page
        .getByRole("button", { name: "Save & close" })
        .click();
      await statePage.page
        .getByRole("heading", { name: "Transition Benchmark Projections" })
        .waitFor();
      await statePage.page
        .getByRole("button", {
          name: "Edit Individuals with physical disabilities (PD)",
        })
        .click();
      await expect
        .soft(statePage.page.getByRole("dialog"))
        .toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
      await statePage.page.getByText("Report transition benchmarks").waitFor();
    });
    await test.step("WCAG checks on /wp/transition-benchmarks individuals with physical drawer", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to Individuals with intellectual and developmental disabilities (I/DD) drawer", async () => {
      await statePage.page
        .getByRole("button", { name: "Save & close" })
        .click();
      await statePage.page
        .getByRole("heading", { name: "Transition Benchmark Projections" })
        .waitFor();
      await statePage.page
        .getByRole("button", {
          name: "Edit Individuals with intellectual and developmental disabilities (I/DD)",
        })
        .click();
      await expect
        .soft(statePage.page.getByRole("dialog"))
        .toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
      await statePage.page.getByText("Report transition benchmarks").waitFor();
    });
    await test.step("WCAG checks on /wp/transition-benchmarks individuals with physical drawer", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to Individuals with mental health and substance use disorders (MH/SUD) drawer", async () => {
      await statePage.page
        .getByRole("button", { name: "Save & close" })
        .click();
      await statePage.page
        .getByRole("heading", { name: "Transition Benchmark Projections" })
        .waitFor();
      await statePage.page
        .getByRole("button", {
          name: "Edit Individuals with mental health and substance use disorders (MH/SUD)",
        })
        .click();
      await expect
        .soft(statePage.page.getByRole("dialog"))
        .toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
      await statePage.page.getByText("Report transition benchmarks").waitFor();
    });
    await test.step("WCAG checks on /wp/transition-benchmarks Individuals with mental drawer", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to other target population modal", async () => {
      await statePage.page
        .getByRole("button", { name: "Save & close" })
        .click();
      await statePage.page
        .getByRole("heading", { name: "Transition Benchmark Projections" })
        .waitFor();
      await statePage.page
        .getByRole("button", { name: "Add other target population" })
        .click();
      await expect(statePage.page.getByRole("dialog")).toHaveCSS(
        "opacity",
        "1"
      );
      await statePage.page
        .getByRole("heading", { name: "Add other target population" })
        .waitFor();
    });
    await test.step("WCAG checks on /wp/transition-benchmarks Add other target population modal", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to transition /wp/transition-benchmark-strategy", async () => {
      await statePage.page.getByRole("button", { name: "Cancel" }).click();
      await statePage.page.getByRole("button", { name: "Continue" }).click();
      await statePage.page
        .getByRole("heading", { name: "Transition Benchmark Strategy" })
        .waitFor();
    });
    await test.step("WCAG checks on /wp/transition-benchmark-strategy", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to /wp/state-or-territory-specific-initiatives/instructions", async () => {
      await statePage.page.getByRole("button", { name: "Continue" }).click();
      await statePage.page
        .getByRole("heading", {
          name: "State or Territory-Specific Initiatives Instructions",
        })
        .waitFor();
      // Because this is the first page in the nav subsection, there is an animation that plays after page load.
      // This was causing the accessibility checks to fail due to contrast. This was a false positive, we need
      // to wait for the animation to finish (`height` becoming `auto`) before running the accessibility checker.
      const navSubsection = statePage.page
        .locator("#sidebar .chakra-collapse")
        .filter({
          has: statePage.page.locator(
            'a[href="/wp/state-or-territory-specific-initiatives/instructions"]'
          ),
        });
      await expect
        .poll(() => navSubsection.evaluate((element) => element.style.height))
        .toBe("auto");
    });
    await test.step("WCAG checks on /wp/state-or-territory-specific-initiatives/instructions", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to /wp/state-or-territory-specific-initiatives/initiatives", async () => {
      await statePage.page.getByRole("button", { name: "Continue" }).click();
      await statePage.page
        .getByRole("heading", {
          name: "State or Territory-Specific Initiatives",
        })
        .waitFor();
    });
    await test.step("WCAG checks on /wp/state-or-territory-specific-initiatives/initiatives", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to add initiative modal", async () => {
      await statePage.page
        .getByRole("button", { name: "Add initiative" })
        .click();
      await expect(statePage.page.getByRole("dialog")).toHaveCSS(
        "opacity",
        "1"
      );
      await statePage.page
        .getByRole("heading", {
          name: "Add initiative",
        })
        .waitFor();
    });
    await test.step("WCAG checks on /wp/state-or-territory-specific-initiatives/initiatives add initiative modal", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to delete initiative modal", async () => {
      await statePage.page.getByRole("button", { name: "Close" }).click();
      await statePage.page
        .getByRole("heading", {
          name: "State or Territory-Specific Initiatives",
        })
        .waitFor();
      await statePage.page
        .getByRole("row", { name: "Initiative01" })
        .getByTestId("delete-entity")
        .click();
      await expect(statePage.page.getByRole("dialog")).toHaveCSS(
        "opacity",
        "1"
      );
      await statePage.page
        .getByRole("heading", {
          name: "Are you sure you want to delete this initiative?",
        })
        .waitFor();
    });
    await test.step("WCAG checks on /wp/state-or-territory-specific-initiatives/initiatives delete initiative modal", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to Initiative01", async () => {
      await statePage.page.getByRole("button", { name: "Close" }).click();
      await statePage.page
        .getByRole("heading", {
          name: "State or Territory-Specific Initiatives",
        })
        .waitFor();
      await statePage.page
        .getByRole("button", { name: "Edit Initiative01" })
        .click();
      await statePage.page
        .getByRole("heading", {
          name: "Initiative01",
        })
        .waitFor();
    });
    await test.step("WCAG checks on /wp/state-or-territory-specific-initiatives/initiatives Initiative01", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to Review & Submit", async () => {
      await statePage.page
        .getByRole("button", { name: "Save & return" })
        .click();
      await statePage.page
        .getByRole("heading", {
          name: "State or Territory-Specific Initiatives",
        })
        .waitFor();
      await statePage.page.getByRole("button", { name: "Continue" }).click();
      await statePage.page
        .getByRole("heading", {
          name: "Review & Submit",
        })
        .waitFor();

      // Wait for button disabled to enabled animation to complete
      const submitButton = statePage.page.getByRole("button", {
        name: "Submit MFP Work Plan",
      });
      await expect(submitButton).toBeEnabled();
      await expect(submitButton).toHaveCSS(
        "background-color",
        "rgb(0, 113, 188)" // --mdct-colors-primary
      );
    });

    await test.step("WCAG checks on /wp/review-and-submit", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to /export", async () => {
      await statePage.page.goto("/wp/export");
      await statePage.page
        .getByText("Click below to export or print MFP Work Plan shown here")
        .waitFor();
    });
    await test.step("WCAG checks on /wp/export", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to submit modal", async () => {
      await statePage.page.goto("/wp/review-and-submit");
      await statePage.page
        .getByRole("heading", {
          name: "Review & Submit",
        })
        .waitFor();
      await statePage.page
        .getByRole("button", { name: "Submit MFP Work Plan" })
        .click();
      await expect(statePage.page.getByRole("dialog")).toHaveCSS(
        "opacity",
        "1"
      );
      await statePage.page
        .getByRole("heading", {
          name: "Are you sure you want to submit MFP Work Plan?",
        })
        .waitFor();
    });
    await test.step("WCAG checks on /wp/review-and-submit submit modal", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });

    await test.step("Navigate to submitted page", async () => {
      await statePage.page
        .getByRole("button", { name: "Submit MFP Work Plan" })
        .click();
      // Scroll so heading is visible on page
      await statePage.page.evaluate(() => window.scrollTo(0, 0));
      await statePage.page.getByRole("heading", {
        name: "Successfully Submitted",
      });
    });
    await test.step("WCAG checks on /wp/review-and-submit successfully submitted", async () => {
      const accessibilityErrors = await checkPageAccessibility(statePage.page);
      expect.soft(accessibilityErrors).toEqual([]);
    });
  });
});
