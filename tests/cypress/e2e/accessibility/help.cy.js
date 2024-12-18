describe("Help Page - Accessibility Test", () => {
  it("is accessible on all device types for admin user", () => {
    cy.authenticate("adminUser");

    cy.visit("/help");
    cy.get("h1"); // ensure page loaded
    cy.location("pathname").should("match", /help/);

    cy.testPageAccessibility();
  });

  it("is accessible on all device types for state user", () => {
    cy.authenticate("stateUser");

    cy.visit("/help");
    cy.get("h1"); // ensure page loaded
    cy.location("pathname").should("match", /help/);

    cy.testPageAccessibility();
  });
});
