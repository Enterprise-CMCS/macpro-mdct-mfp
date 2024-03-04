// TODO: make an assertion in these tests
describe("login spec", () => {
  it("admin user", () => {
    cy.authenticate("adminUser");
  });

  it("state user", () => {
    cy.authenticate("stateUser");
  });
});
