const breakpoints = {
  mobile: [560, 800],
  tablet: [880, 1000],
  desktop: [1200, 1200],
};

// TODO: unskip these tests and resolve a11y issues
describe.skip("home page spec", () => {
  it("is accessible on all device types for admin user", () => {
    cy.authenticate("adminUser");
    //Iterate over each device type screen size and run an accessibility test on the current page
    Object.keys(breakpoints).forEach((deviceSize) => {
      const size = breakpoints[deviceSize];
      cy.viewport(...size);
      cy.runAccessibilityTests();
    });
  });

  it("is accessible on all device types for state user", () => {
    cy.authenticate("stateUser");
    //Iterate over each device type screen size and run an accessibility test on the current page
    Object.keys(breakpoints).forEach((deviceSize) => {
      const size = breakpoints[deviceSize];
      cy.viewport(...size);
      cy.runAccessibilityTests();
    });
  });
});
