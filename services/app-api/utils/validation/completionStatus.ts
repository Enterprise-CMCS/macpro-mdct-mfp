// types
import { DEFAULT_TARGET_POPULATION_NAMES } from "../constants/constants";
import {
  AnyObject,
  CompletionData,
  FormJson,
  FieldChoice,
  Choice,
  FormField,
  ReportRoute,
} from "../types";
// utils
import { validateFieldData } from "./completionValidation";

export const isComplete = (completionStatus: CompletionData): boolean => {
  const flatten = (obj: AnyObject, out: AnyObject) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "object") {
        out = flatten(obj[key], out);
      } else {
        out[key] = obj[key];
      }
    });
    return out;
  };

  const flattenedStatus = flatten(completionStatus, {});

  for (const status in flattenedStatus) {
    if (flattenedStatus[status] === false) {
      return false;
    }
  }
  return true;
};

// Entry point for calculating completion status
export const calculateCompletionStatus = async (
  fieldData: AnyObject,
  formTemplate: AnyObject
) => {
  // Parent Dictionary for holding all route completion status

  const validationJson = formTemplate.validationJson;

  const areFieldsValid = async (
    fieldsToBeValidated: Record<string, string>
  ) => {
    let areAllFieldsValid = false;
    try {
      // all fields successfully validated if validatedFields is not undefined
      areAllFieldsValid =
        (await validateFieldData(validationJson, fieldsToBeValidated)) !==
        undefined;
    } catch {
      // Silently ignore error, will result in false
    }
    return areAllFieldsValid;
  };

  const calculateFormCompletion = async (
    nestedFormTemplate: FormJson,
    dataForObject: AnyObject = fieldData
  ) => {
    // Build an object of k:v for fields to validate
    let fieldsToBeValidated: Record<string, string> = {};
    // Repeat fields can't be validated at same time, so holding their completion status here
    let repeatersValid = true; //default to true in case of no repeat fields

    const getNestedFields = (
      fieldChoices: FieldChoice[],
      selectedChoices: Choice[]
    ) => {
      let selectedChoicesIds = selectedChoices
        .map((choice: Choice) => choice.key)
        .map((choiceId: string) => choiceId?.split("-").pop());
      let selectedChoicesWithChildren = fieldChoices?.filter(
        (fieldChoice: FieldChoice) =>
          selectedChoicesIds.includes(fieldChoice.id) && fieldChoice.children
      );
      let fieldIds: string[] = [];
      selectedChoicesWithChildren?.forEach((selectedChoice: FieldChoice) => {
        selectedChoice.children?.forEach((childChoice: FormField) => {
          fieldIds.push(childChoice.id);
          if (childChoice.props?.choices && dataForObject?.[childChoice.id]) {
            let childFields = getNestedFields(
              childChoice.props?.choices,
              dataForObject[childChoice.id]
            );
            fieldIds.push(...childFields);
          }
        });
      });
      return fieldIds;
    };
    // Iterate over all fields in form
    for (var formField of nestedFormTemplate?.fields || []) {
      // Key: Form Field ID, Value: Report Data for field
      if (Array.isArray(dataForObject[formField.id])) {
        let nestedFields: string[] = getNestedFields(
          formField.props?.choices,
          dataForObject[formField.id]
        );
        nestedFields?.forEach((nestedField: string) => {
          fieldsToBeValidated[nestedField] = dataForObject[nestedField]
            ? dataForObject[nestedField]
            : null;
        });
      }

      fieldsToBeValidated[formField.id] = dataForObject[formField.id]
        ? dataForObject[formField.id]
        : null;
    }
    // Validate all fields en masse, passing flag that uses required validation schema
    return repeatersValid && (await areFieldsValid(fieldsToBeValidated));
  };

  const isDefaultPopulationApplicable = (targetPopulations: AnyObject[]) => {
    const filteredPopulations = targetPopulations?.filter((population) => {
      const isDefault = DEFAULT_TARGET_POPULATION_NAMES.includes(
        population.transitionBenchmarks_targetPopulationName
      );

      const isApplicable =
        population?.transitionBenchmarks_applicableToMfpDemonstration?.[0]
          ?.value === "Yes";
      return isDefault && isApplicable;
    });
    return filteredPopulations.length >= 1;
  };

  const calculateEntityCompletion = async (
    nestedFormTemplates: FormJson[],
    entityType: string
  ) => {
    let atLeastOneTargetPopApplicable = false;
    //value for holding combined result
    var areAllFormsComplete = true;
    for (var nestedFormTemplate of nestedFormTemplates) {
      if (fieldData[entityType] && fieldData[entityType].length > 0) {
        // if target population, at least one must be applicable to be complete
        if (
          entityType === "targetPopulations" &&
          nestedFormTemplate?.id === "tb-drawer"
        ) {
          atLeastOneTargetPopApplicable = isDefaultPopulationApplicable(
            fieldData[entityType]
          );
        }
        // iterate over each entity (eg transition benchmark)
        for (var dataForEntity of fieldData[entityType]) {
          // get completion status for entity, using the correct form template
          const isEntityComplete = await calculateFormCompletion(
            nestedFormTemplate,
            dataForEntity
          );
          // update combined result
          areAllFormsComplete &&= isEntityComplete;
        }
      } else {
        //Entity not present in report data, so check to see if it is required and update combined result
        areAllFormsComplete &&=
          formTemplate.entities && !formTemplate.entities[entityType]?.required;
      }
    }
    if (entityType === "targetPopulations" && !atLeastOneTargetPopApplicable) {
      return false;
    }
    return areAllFormsComplete;
  };

  const calculateEntityWithStepsCompletion = async (
    stepFormTemplates: any[],
    entityType: string
  ) => {
    if (!fieldData[entityType] || fieldData[entityType].length <= 0)
      return false;

    var areAllFormsComplete = true;
    for (let i = 0; i < stepFormTemplates.length; i++) {
      let stepForm = stepFormTemplates[i];
      for (var entityFields of fieldData[entityType]) {
        //modal overlay pages should have an array of key stepType in fieldData, automatic false if it doesn't exist or array is empty
        if (
          stepForm.pageType === "overlayModal" &&
          (!entityFields[stepForm.stepType] ||
            entityFields[stepForm.stepType].length <= 0)
        ) {
          areAllFormsComplete &&= false;
        } else if (stepForm.stepType === "closeOutInformation") {
          //skip over closeOut at the moment until we can make WP copies
        } else {
          //detemine which fieldData to match to the stepForm
          const entityFieldsList = entityFields[stepForm.stepType]
            ? entityFields[stepForm.stepType]
            : [entityFields];
          //loop through all children that belong to that entity and validate the values
          for (var stepFields of entityFieldsList) {
            if (stepForm?.objectiveCards) {
              for (let card of stepForm.objectiveCards) {
                if (card?.modalForm) {
                  const nestedFormTemplate = card.modalForm;

                  if (nestedFormTemplate?.objectiveId !== stepFields?.id) {
                    continue;
                  }
                  const isEntityComplete = await calculateFormCompletion(
                    nestedFormTemplate,
                    stepFields
                  );
                  areAllFormsComplete &&= isEntityComplete;
                }
              }
            } else {
              const nestedFormTemplate = stepForm.form
                ? stepForm.form
                : stepForm.modalForm;

              //WP uses modaloverlay so it doesn't have an initiativeId, only SAR does
              if (
                nestedFormTemplate?.initiativeId !== stepFields?.id &&
                formTemplate.type === "SAR"
              ) {
                continue;
              }
              const isEntityComplete = await calculateFormCompletion(
                nestedFormTemplate,
                stepFields
              );
              areAllFormsComplete &&= isEntityComplete;
            }
          }
        }
      }
    }

    return areAllFormsComplete;
  };

  const calculateDynamicModalOverlayCompletion = async (
    initiatives: any[],
    entityType: string
  ) => {
    let areAllFormsComplete = true;

    for (let initiative of initiatives) {
      const isComplete = await calculateEntityWithStepsCompletion(
        initiative.entitySteps,
        entityType
      );
      if (!isComplete) {
        areAllFormsComplete = false;
        break;
      }
    }
    return areAllFormsComplete;
  };

  const calculateRouteCompletion = async (route: ReportRoute) => {
    let routeCompletion;
    // Determine which type of page we are calculating status for
    switch (route.pageType) {
      case "standard":
        if (!route.form) break;
        // Standard forms use simple validation
        routeCompletion = {
          [route.path]: await calculateFormCompletion(route.form),
        };
        break;
      case "drawer":
        if (!route.drawerForm) break;
        routeCompletion = {
          [route.path]: await calculateEntityCompletion(
            [route.drawerForm],
            route.entityType
          ),
        };
        break;
      case "modalDrawer":
        if (!route.drawerForm || !route.modalForm) break;
        routeCompletion = {
          [route.path]: await calculateEntityCompletion(
            [route.drawerForm, route.modalForm],
            route.entityType
          ),
        };
        break;
      case "modalOverlay":
        if (!route.modalForm) break;
        if (route.entitySteps) {
          routeCompletion = {
            [route.path]: await calculateEntityWithStepsCompletion(
              route.entitySteps as [],
              route.entityType
            ),
          };
        } else {
          routeCompletion = {
            [route.path]: await calculateEntityCompletion(
              [route.modalForm],
              route.entityType
            ),
          };
        }
        break;
      case "dynamicModalOverlay":
        if (!route.initiatives) break;
        routeCompletion = {
          [route.path]: await calculateDynamicModalOverlayCompletion(
            route.initiatives as [],
            route.entityType
          ),
        };
        break;
      case "reviewSubmit":
        // Don't evaluate the review and submit page
        break;
      default:
        if (!route.children) break;
        // Default behavior indicates that we are not on a form to be evaluated, which implies we have child routes to evaluate
        routeCompletion = {
          [route.path]: await calculateRoutesCompletion(route.children),
        };
        break;
    }
    return routeCompletion;
  };

  const calculateRoutesCompletion = async (routes: ReportRoute[]) => {
    var completionDict: CompletionData = {};
    // Iterate over each route
    for (var route of routes || []) {
      // Determine the status of each child in the route
      const routeCompletionDict = await calculateRouteCompletion(route);
      // Add completion status to parent dictionary
      completionDict = { ...completionDict, ...routeCompletionDict };
    }
    return completionDict;
  };

  return await calculateRoutesCompletion(formTemplate.routes);
};
