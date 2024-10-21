describe("Home Page - Accessibility Test", () => {
  it("Is assessible when not logged in", () => {
    cy.visit("/");
    cy.wait(1000);
    cy.testPageAccessibility();
  });

  it("is accessible on all device types for admin user", () => {
    cy.authenticate("adminUser");

    cy.wait(1000);
    cy.testPageAccessibility();
  });

  it("is accessible on all device types for state user", () => {
    cy.authenticate("stateUser");

    cy.wait(1000);
    cy.testPageAccessibility();
  });
});
