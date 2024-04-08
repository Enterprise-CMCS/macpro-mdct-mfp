describe("MFP Work Plan Dashboard Page - Report Creation/Archiving", () => {
  describe("MFP Work Plan Dashboard Page - State User Report Creation", () => {
    it("State users can create Work Plans", () => {
      cy.ensureAvailableReport();
      cy.authenticate("stateUser");

      //Given I've logged in
      cy.url().should("include", "/");

      //And I enter the Work Plan Dashboard
      cy.contains("Enter Work Plan online").click();
      cy.url().should("include", "/wp");

      //When I click the create Work Plan Button and create a WP
      cy.contains("Start MFP Work Plan").click();
      cy.contains("Start new").click();

      //Then there is a new Workplan with the title
      cy.contains("MFP Work Plan", { matchCase: true }).should("be.visible");
    });
  });

  describe("MFP Work Plan Dashboard Page - Admin Archiving", () => {
    it("Admin users can archive/unarchive Work Plans", () => {
      cy.authenticate("adminUser");

      //Given I've logged in
      cy.url().should("include", "/");

      //When an admin selects the state and report type to look at
      cy.fillOutForm([
        ["state", "dropdown", "District of Columbia"],
        ["report", "radio", "MFP Work Plan (WP)"],
      ]);
      cy.contains("Go to Report Dashboard").click();
      cy.url().should("include", "/wp");

      //Then there is a new Workplan with the title
      cy.contains("District of Columbia MFP Work Plan", {
        matchCase: true,
      }).should("be.visible");

      //And when the admin clicks archive/unarchive it should do that to the report
      cy.contains("Archive").click();
      cy.contains("Unarchive").should("be.visible");

      cy.contains("Unarchive").click();
      cy.contains("Archive").should("be.visible");
    });
  });
});
