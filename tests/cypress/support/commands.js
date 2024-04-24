// ***** AUTHENTICATION COMMANDS *****

const cognitoEmailInputField = 'input[name="email"]';
const cognitoPasswordInputField = 'input[name="password"]';
const cognitoLoginButton = "[data-testid='cognito-login-button']";
const myAccountButton = '[aria-label="my account"';

const breakpoints = {
  mobile: [560, 800],
  tablet: [880, 1000],
  desktop: [1200, 1200],
};

const stateUserPassword = Cypress.env("STATE_USER_PASSWORD");
const adminUserPassword = Cypress.env("ADMIN_USER_PASSWORD");

// pragma: allowlist nextline secret
if (typeof stateUserPassword !== "string" || !stateUserPassword) {
  throw new Error(
    "Missing state user password value, set using CYPRESS_STATE_USER_PASSWORD=..."
  );
}

// pragma: allowlist nextline secret
if (typeof adminUserPassword !== "string" || !adminUserPassword) {
  throw new Error(
    "Missing state user password value, set using CYPRESS_ADMIN_USER_PASSWORD=..."
  );
}

// credentials
const stateUser = {
  email: Cypress.env("STATE_USER_EMAIL"),
  password: stateUserPassword,
};
const adminUser = {
  email: Cypress.env("ADMIN_USER_EMAIL"),
  password: adminUserPassword,
};

Cypress.Commands.add("navigateToHomePage", () => {
  if (cy.location("pathname") !== "/") cy.visit("/");
});

Cypress.Commands.add("testPageAccessibility", () => {
  for (let size of Object.values(breakpoints)) {
    cy.viewport(...size);
    cy.runAccessibilityTests();
  }
});

Cypress.Commands.add("archiveAnyExistingWorkPlans", () => {
  // login as admin
  cy.authenticate("adminUser");
  cy.navigateToHomePage();

  /*
   * Check if there is already a workplan, if so, archive
   * is to ensure a clean test bed
   */
  cy.get(
    '[aria-label="List of states, including District of Columbia and Puerto Rico"]'
  ).select("DC");
  cy.get('[id="report-WP"]').click();
  cy.contains("Go to Report Dashboard").click();
  cy.wait(3000);

  cy.get("table").then(($table) => {
    if ($table.find('button:contains("Archive")').length > 0) {
      cy.get('button:contains("Archive")').first().click();
      cy.wait(500);
    }
  });
});

Cypress.Commands.add("fillOutForm", (formInputs) => {
  formInputs.forEach((row) => {
    /*
     * Repeated inputs have the same name, so it comes back as an array. Thus we need to grab
     * which input in the array we need. Otherwise we can just query the name of the input
     */
    const repeatedInput = row?.[3];
    const input = repeatedInput
      ? cy.get(`input[name^="${row[0]}"]`)
      : cy.get(`[name='${row[0]}']`);
    const inputType = row[1];
    const inputValue = row[2];
    switch (inputType) {
      case "singleCheckbox":
        if (inputValue == "true") {
          input.check();
          input.blur();
        } else input.uncheck();
        break;
      case "radio":
        input.check(inputValue);
        input.blur();
        break;
      case "checkbox":
        input.check(inputValue);
        input.blur();
        break;
      case "dropdown":
        input.select(inputValue);
        input.blur();
        break;
      case "repeated":
        input.eq(repeatedInput);
        input.clear();
        input.type(inputValue);
        input.blur();
        break;
      default:
        input.clear();
        input.type(inputValue);
        input.blur();
        break;
    }
  });
});

Cypress.Commands.add("authenticate", (userType, userCredentials) => {
  Cypress.session.clearAllSavedSessions();
  cy.session([userType, userCredentials], () => {
    cy.visit("/");
    cy.wait(2000);
    let credentials = {};

    if (userType && userCredentials) {
      /* eslint-disable-next-line no-console */
      console.warn(
        "If userType and userCredentials are both provided, userType is ignored and provided userCredentials are used."
      );
    } else if (userCredentials) {
      credentials = userCredentials;
    } else if (userType) {
      switch (userType) {
        case "adminUser":
          credentials = adminUser;
          break;
        case "stateUser":
          credentials = stateUser;
          break;
        default:
          throw new Error("Provided userType not recognized.");
      }
    } else {
      throw new Error("Must specify either userType or userCredentials.");
    }

    cy.get(cognitoEmailInputField).type(credentials.email);
    cy.get(cognitoPasswordInputField).type(credentials.password, {
      log: false,
    });
    cy.get(cognitoLoginButton).click();

    /**
     * Waits for cognito session tokens to be set in local storage before saving session
     * This ensures reused sessions maintain these tokens
     * We expect at least three for the id, access, and refresh tokens
     */
    cy.wait(4500);
    cy.get(myAccountButton).should("exist");
  });
});

// ***** ACCESSIBILITY COMMANDS *****

Cypress.Commands.add("runAccessibilityTests", () => {
  // run cypress-axe accessibility tests (https://bit.ly/3HnJT9H)
  cy.injectAxe();
  cy.checkA11y(
    null,
    {
      values: ["wcag2a", "wcag2aa"],
      includedImpacts: ["minor", "moderate", "serious", "critical"],
      rules: {
        "duplicate-id": { enabled: false },
      },
    },
    terminalLog
  );
});

// ***** LOGGING ***** (https://bit.ly/3HnJT9H)

function terminalLog(violations) {
  cy.task(
    "log",
    `${violations.length} accessibility violation${
      violations.length === 1 ? "" : "s"
    } ${violations.length === 1 ? "was" : "were"} detected`
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    })
  );
  cy.task("table", violationData);
}
