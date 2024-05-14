// Feature: SAR E2E Form Create
import wpTemplate from "../../../../services/app-api/forms/wp.json";
import { traverseRoutes } from "../../support/form";

const currentYear = new Date().getFullYear();

describe("Create SAR from Approved WP", () => {
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

  it("Admin users can approve a Work Plan submission", () => {
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

    cy.get(`button:contains("Approve")`).eq(0).focus().click();
    cy.wait(1500);

    cy.get("input").type("APPROVE");

    cy.get(`button:contains("Approve")`).eq(1).focus().click();
  });

  it("State user can create SAR", () => {
    cy.archiveAnyExistingSAR();
    cy.wait(2000);
    cy.authenticate("stateUser");
    cy.wait(2000);

    // go back to dashboard
    cy.visit("/");

    cy.wait(2000);
    cy.get(`button:contains("Enter SAR online")`).focus().click();
    cy.wait(2000);
    cy.get(`button:contains("Add new MFP SAR submission")`).focus().click();
    cy.wait(2000);
    cy.get('[type="radio"]').check("No");
    cy.wait(2000);
    cy.get('button:contains("Save")').focus().click();
    cy.wait(5000);
    cy.get('button:contains("Edit")').focus().click();
  });

  it("Fill out SAR General Information", () => {
    cy.get("#generalInformation_MfpOperatingOrganizationName").type(
      "input text"
    );
    cy.get("#generalInformation_stateTerritoryMedicaidAgency").type(
      "input text"
    );
    cy.get("#generalInformation_mfpProgramPublicName").type("input text");
    cy.get("#generalInformation_mfpProgramWebsite").type("https://google.com");
    cy.get("#generalInformation_aorName").type("input text");
    cy.get("#generalInformation_aorTitleAgency").type("input text");
    cy.get("#generalInformation_aorEmail").type("test@gmail.com");
    cy.get('[type="radio"]').check("No");
    cy.get("#generalInformation_projectDirectorName").type("test@gmail.com");
    cy.get("#generalInformation_projectDirectorTitle").type("input text");
    cy.get("#generalInformation_projectDirectorEmail").type("test@gmail.com");
    cy.get("#generalInformation_cmsProjectOfficerName").type("input text");

    cy.get('button:contains("Continue")').focus().click();
  });
});
