// Feature: MCPAR E2E Form Submission
import wpTemplate from "../../../..//services/app-api/forms/wp.json";
import { traverseRoutes } from "../../support/form";

const currentYear = new Date().getFullYear();

describe("MFP Work Plan E2E Submission", () => {
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
    //Find our new program and open it
    cy.get("table").within(() => {
      cy.get("tr")
        .as("workplan")
        .contains(
          `District of Columbia MFP Work Plan ${currentYear} - Period 1`
        );
      cy.get("@workplan").as("workplancontainer");
      cy.get("@workplancontainer")
        .find('button:contains("Edit")')
        .as("editbutton");
      cy.get("@editbutton").focus();
      cy.get("@editbutton").click();
    });

    //Using the json as a guide, traverse all the routes/forms and fill it out dynamically
    const template = wpTemplate;
    traverseRoutes(template.routes);

    cy.url().should("include", "/review-and-submit");

    // Confirm form is submittable
    cy.get('div[role*="alert"]').should("not.exist");
    cy.get(`button:contains("Submit")`).should("not.be.disabled");

    //Submit the program
    cy.get(`button:contains("Submit")`).focus().click();
    cy.get('[data-testid="modal-submit-button"]').focus().click();

    cy.contains("Successfully Submitted").should("be.visible");
  });

  it("Admin users can deny a Work Plan submission", () => {
    cy.authenticate("adminUser");
    cy.navigateToHomePage();
    cy.get(
      '[aria-label="List of states, including District of Columbia and Puerto Rico"]'
    ).select("DC");
    cy.get('[id="report-WP"]').click();
    cy.contains("Go to Report Dashboard").click();
    cy.wait(3000);

    //There is a new submitted Workplan with the title
    cy.contains(
      `District of Columbia MFP Work Plan ${currentYear} - Period 1`,
      { matchCase: true }
    ).should("be.visible");

    //Find our new program and open it
    cy.get("table").within(() => {
      cy.get("tr")
        .as("workplan")
        .contains(
          `District of Columbia MFP Work Plan ${currentYear} - Period 1`
        );
      cy.get("@workplan").as("workplancontainer");
      cy.get("@workplancontainer")
        .find('button:contains("View")')
        .as("viewButton");
      cy.get("@viewButton").first().focus();
      cy.get("@viewButton").first().click();
    });

    cy.get("p:contains('Review & Submit')").click();

    cy.url().should("include", "/review-and-submit");

    cy.get(`button:contains("Unlock")`).focus().click();
    cy.wait(1500);

    cy.get('button:contains("Return to dashboard")').focus().click();

    cy.contains("In revision").should("be.visible");
  });

  it("State users can update and submit an in revision Work Plan", () => {
    cy.authenticate("stateUser");

    //Given I've logged in
    cy.url().should("include", "/");

    //And I enter the Work Plan Dashboard
    cy.contains("Enter Work Plan online").click();
    cy.url().should("include", "/wp");

    //Find our new program and open it
    cy.get("table").within(() => {
      cy.get("tr")
        .as("workplan")
        .contains(
          `District of Columbia MFP Work Plan ${currentYear} - Period 1`
        );
      cy.get("@workplan").as("workplancontainer");
      cy.get("@workplancontainer")
        .find('button:contains("Edit")')
        .as("editButton");
      cy.get("@editButton").first().focus();
      cy.get("@editButton").first().click();
    });

    cy.get("p:contains('Review & Submit')").click();

    cy.url().should("include", "/review-and-submit");

    // Confirm form is submittable
    cy.get('div[role*="alert"]').should("not.exist");
    cy.get(`button:contains("Submit")`).should("not.be.disabled");

    //Submit the program
    cy.get(`button:contains("Submit")`).focus().click();
    cy.get('[data-testid="modal-submit-button"]').focus().click();

    cy.contains("Successfully Submitted").should("be.visible");

    cy.get('button:contains("Leave form")').focus().click();
    cy.url().should("include", "/wp");
    cy.contains("2").should("be.visible");
  });
});
