export const traverseRoutes = (routes) => {
  //iterate over each route
  routes.forEach((route) => {
    traverseRoute(route);
  });
};

const traverseRoute = (route) => {
  //only perform checks on route if it contains some kind of form fill
  if (route.form || route.modalForm || route.drawerForm) {
    //validate we are on the URL we expect to be
    cy.url().should("include", route.path);
    //Validate the intro section is presented
    if (route.verbiage?.intro?.section)
      cy.contains(route.verbiage?.intro?.section);
    if (route.verbiage?.intro?.subsection)
      cy.contains(route.verbiage?.intro?.subsection);

    //Fill out the 3 different types of forms
    completeForm(route.form);
    completeModalForm(
      route.path,
      route.modalForm,
      route.verbiage?.addEntityButtonText
    );
    completeDrawerForm(route.drawerForm);
    completeOverlayEntity(route.path, route.entitySteps);

    cy.get('button:contains("Continue")').focus().click();
  }
  //If this route has children routes, traverse those as well
  if (route.children) traverseRoutes(route.children);
};

const completeDrawerForm = (drawerForm) => {
  if (drawerForm) {
    cy.get("table")
      .find('[aria-label="edit button"]')
      .each(($button) => {
        cy.wrap($button).click();
        cy.wait(500);
        completeForm(drawerForm);
        cy.get("form").submit();
      });
  }
};

const completeModalForm = (path, modalForm, buttonText) => {
  if (path === "/wp/state-or-territory-specific-initiatives/initiatives") {
    //Create 5 initiatives
    for (let i = 0; i < 5; i++) {
      cy.get(`button:contains("${buttonText}")`).focus().click();
      completeForm(modalForm, i);
      cy.get('[data-testid="modal-submit-button"]').focus().click();
      cy.wait(500);
    }
  } else {
    //open the modal, then fill out the form and save it
    if (modalForm && buttonText) {
      cy.get(`button:contains("${buttonText}")`).focus().click();
      completeForm(modalForm);
      cy.get('[data-testid="modal-submit-button"]').focus().click();
      cy.wait(500);
    }
  }
};

const completeOverlayEntity = (path, entitySteps) => {
  if (
    entitySteps &&
    path === "/wp/state-or-territory-specific-initiatives/initiatives"
  ) {
    cy.wait(500);

    //Edit each of the 5 initiatives
    for (let i = 0; i < 5; i++) {
      cy.get("table").find('[aria-label="edit button"]').eq(i).click();
      cy.wait(500);
      completeOverlayEntityStep(entitySteps);
      cy.get('button:contains("Return to all initiatives")')
        .first()
        .focus()
        .click();
      cy.wait(500);
    }
  }
};

const completeOverlayEntityStep = (entitySteps) => {
  //first step
  cy.get("table").find('[aria-label="edit button"]').first().click();
  cy.wait(500);
  completeForm(entitySteps[0].form);
  cy.get('button:contains("Save")').focus().click();
  cy.wait(500);

  //second step
  cy.get("table").find('[aria-label="edit button"]').eq(1).click();
  cy.wait(500);
  completeModalForm(
    undefined,
    entitySteps[1].modalForm,
    entitySteps[1].verbiage.addEntityButtonText
  );
  cy.get('button:contains("Save")').focus().click();
  cy.wait(500);

  //third step
  cy.get("table").find('[aria-label="edit button"]').eq(2).click();
  cy.wait(500);
  completeModalForm(
    undefined,
    entitySteps[2].modalForm,
    entitySteps[2].verbiage.addEntityButtonText
  );
  cy.get('button:contains("Save")').focus().click();
  cy.wait(500);
};

const completeForm = (form, optionToSelect = 0) => {
  //iterate over each field and fill it appropriately
  form?.fields?.forEach((field) => processField(field, optionToSelect));
};

const processField = (field, optionToSelect) => {
  //only try to fill it out if it's enabled
  if (!field.props?.disabled) {
    //Validation method shifts around based on field type
    const validationType = field.validation?.type
      ? field.validation?.type
      : field.validation;
    switch (field.type) {
      case "text":
      case "textarea":
        switch (validationType) {
          case "email":
            cy.get(`[name="${field.id}"]`).type("email@fill.com");
            break;
          case "url":
            cy.get(`[name="${field.id}"]`).type("https://fill.com");
            break;
          case "text":
            cy.get(`[name="${field.id}"]`).type(`Text Fill`);
            break;
          default:
            cy.get(`[name="${field.id}"]`).type("Unknown Fill");
        }
        break;
      case "date":
        cy.get(`[name="${field.id}"]`).type(
          new Date().toLocaleDateString("en-US")
        );
        break;
      case "dynamic":
        cy.get(`[name="${field.id}[0]"`).type("Dynamic Fill");
        break;
      case "number":
        switch (validationType) {
          case "ratio":
            cy.get(`[name="${field.id}"]`).type("1:1");
            break;
          default:
            if (
              field.props["data-cy"] &&
              field.props["data-cy"] == "transformedFundingSources"
            ) {
              cy.get("form")
                .find('*[data-cy^="transformedFundingSources"]')
                .each(($numberfield) => {
                  cy.get($numberfield).type(Math.ceil(Math.random() * 100));
                });
            } else {
              cy.get(`[name="${field.id}"]`).type(
                Math.ceil(Math.random() * 100)
              );
            }
        }
        break;
      case "dropdown":
        cy.get(`[name="${field.id}"]`).select(1);
        break;
      case "radio":
      case "checkbox":
        /*
         * This is a unique case where we're dealing with a transformed field. The options
         * won't exist in the wp.json to reference.
         */
        if (field.props.choices.length === 0) {
          cy.get("input[type=checkbox]").eq(0).check();
        } else {
          cy.get(
            `[id="${field.id}-${field.props.choices[optionToSelect].id}"]`
          ).check();
          field.props.choices[0].children?.forEach((childField) =>
            processField(childField)
          );
        }

        break;
    }
  }
};
