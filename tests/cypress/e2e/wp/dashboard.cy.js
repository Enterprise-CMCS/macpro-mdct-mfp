const currentYear = new Date().getFullYear();

describe("MFP Work Plan Dashboard Page - Report Creation/Archiving", () => {
  describe("MFP Work Plan Dashboard Page - State User Report Creation", () => {
    it("State users can create Work Plans", () => {
      cy.archiveAnyExistingWorkPlans();
      cy.authenticate("stateUser");

      //Given I've logged in
      cy.url().should("include", "/");

      //And I enter the Work Plan Dashboard
      cy.contains("Enter Work Plan online").click();
      cy.url().should("include", "/wp");

      //When I click the create Work Plan Button and create a WP
      cy.contains("Start MFP Work Plan").click();
      cy.get(`[id="reportYear-${currentYear}"]`).check();
      cy.get(`[id="reportPeriod-1"]`).check();

      cy.contains("Start new").click();

      //Then there is a new Workplan with the title
      cy.contains(
        `District of Columbia MFP Work Plan ${currentYear} - Period 1`,
        { matchCase: true }
      ).should("be.visible");
    });
  });

  describe("MFP Work Plan Dashboard Page - Admin Archiving", () => {
    it("Admin users can archive Work Plans", () => {
      cy.authenticate("adminUser");

      //Given I've logged in
      cy.url().should("include", "/");

      //When an admin selects the state and report type to look at
      cy.fillOutForm([
        ["state", "dropdown", "District of Columbia"],
        ["report", "radio", "MFP Work Plan"],
      ]);
      cy.contains("Go to Report Dashboard").click();
      cy.url().should("include", "/wp");

      //Then there is a new Workplan with the title
      cy.contains(
        `District of Columbia MFP Work Plan ${currentYear} - Period 1`,
        {
          matchCase: true,
        }
      ).should("be.visible");

      //And when the admin clicks archive it should open the archive modal
      cy.contains("button", "Archive");
      cy.contains("button", "Archive").click();
      cy.contains("Are you sure you want to archive this MFP Work Plan").should(
        "be.visible"
      );
      //prompt to confirm and then user can actually archive
      cy.get("input").click().type("Archive");
      cy.get('[data-cy="modal-archive"]').click();
      cy.contains("button", "Archive").should("be.disabled");
    });
  });
});
