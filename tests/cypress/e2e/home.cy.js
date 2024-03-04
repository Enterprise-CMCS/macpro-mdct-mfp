// element selectors
const templateCardAccordionVerbiage = "When is the MFP Work Plan due?";
const templateCardAccordionContent = "The MFP Work Plan will be created";

beforeEach(() => {
  cy.authenticate("stateUser");
});

afterEach(() => {
  cy.navigateToHomePage();
});

describe("Homepage integration tests", () => {
  it("Clicking accordion expander opens accordion", () => {
    cy.contains(templateCardAccordionVerbiage).first().click();
    cy.contains(templateCardAccordionContent).should("be.visible");
  });
});
