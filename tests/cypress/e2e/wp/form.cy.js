// Feature: MCPAR E2E Form Submission
import wpTemplate from "../../../..//services/app-api/forms/wp.json";
import { traverseRoutes } from "../../support/form";

describe("MFP Work Plan E2E Submission", () => {
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
    cy.get(`[id="reportYear-${new Date().getFullYear()}"]`).check();
    cy.get(`[id="reportPeriod-1"]`).check();

    cy.contains("Start new").click();

    //Then there is a new Workplan with the title
    cy.contains("MFP Work Plan", { matchCase: true }).should("be.visible");

    //Find our new program and open it
    cy.get("table").within(() => {
      cy.get("td").as("workplan").contains("MFP Work Plan");
      cy.get("@workplan").parent().as("workplancontainer");
      cy.get("@workplancontainer")
        .find('button:contains("Edit")')
        .as("editbutton");
      cy.get("@editbutton").focus();
      cy.get("@editbutton").click();
    });

    //Using the json as a guide, traverse all the routes/forms and fill it out dynamically
    const template = wpTemplate;
    traverseRoutes(template.routes);

    // Confirm form is submittable
    cy.get('div[role*="alert"]').should("not.exist");
    cy.get(`button:contains("Submit")`).should("not.be.disabled");

    //Submit the program
    cy.get(`button:contains("Submit")`).focus().click();
    cy.get('[data-testid="modal-submit-button"]').focus().click();

    cy.contains("Successfully Submitted").should("be.visible");
  });
});
