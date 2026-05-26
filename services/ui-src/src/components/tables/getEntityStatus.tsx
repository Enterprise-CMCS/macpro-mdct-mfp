// types
import {
  AnyObject,
  DynamicModalOverlayReportPageShape,
  EntityDetailsOverlayShape,
  EntityDetailsOverlayTypes,
  EntityDetailsStepTypes,
  EntityShape,
  EntityStatuses,
  FormJson,
  OverlayModalPageShape,
  OverlayModalTypes,
  ReportShape,
  ReportType,
} from "types";
// utils
import { isFieldElement, isFieldValidationOptional, routeChecker } from "utils";

export const getValidationList = (fields: AnyObject[], entity: AnyObject) => {
  //we want to have an array that checks for ids that needs to have data
  let validationIdList: string[] = [];
  //we need to make sure nested fields are looked at
  const fieldsNestedChoices = fields
    .flatMap((field) => {
      validationIdList.push(field.id);
      if (field.props?.choices) {
        return field.props.choices;
      }
    })
    .filter(Boolean);

  //Loop through the user entered entity to see which nested id the user had selected
  // typeof null === "object", so we need to guard against null field values
  const entityNestedSelection = Object.values(entity).filter(
    (field) => field !== null && typeof field === "object"
  );

  //Strip it to only the key information
  const entityNestedKeys = entityNestedSelection
    .flat()
    .map((entity) => {
      return entity.key;
    })
    .filter(Boolean);

  //look for the relevant child id for the selected nested values in the formTemplate data
  entityNestedKeys.forEach((key) => {
    const found = fieldsNestedChoices.find((choice) =>
      key.includes(choice?.id)
    );
    if (found && found.children) {
      found.children.forEach((child: AnyObject) => {
        validationIdList.push(child.id);
      });
    }
  });

  return validationIdList;
};

export const getEntityStatus = (
  report: ReportShape,
  entity: EntityShape,
  entityType: string
) => {
  const flatRoutes = (report?.formTemplate?.flatRoutes || []) as AnyObject[];
  const formTypes = ["form", "drawerForm", "modalForm", "overlayForm"];

  //find the correct route information for this entityType
  const routes = flatRoutes.filter((r) => r.entityType === entityType);

  if (routes.length === 0) return EntityStatuses.INCOMPLETE;

  const nonOptionalFields = routes.flatMap((route) =>
    formTypes
      .flatMap((formType) => route[formType]?.fields || [])
      .filter((field) => !isFieldValidationOptional(field))
  );

  const validationIdList = getValidationList(nonOptionalFields, entity);

  //check to see if each validation id was matched to user selected values
  const allFieldsFilled = validationIdList.every((id: string) => {
    const fieldValue = entity[id];
    return fieldValue?.length > 0;
  });

  return allFieldsFilled ? EntityStatuses.COMPLETE : EntityStatuses.INCOMPLETE;
};

/**
 * @deprecated No longer used as of Report Year 2026, Period 2
 */
const getEntityStepsStatus = (
  entitySteps: (EntityDetailsOverlayShape | OverlayModalPageShape)[],
  entity: EntityShape,
  reportType: ReportType,
  isPdf: boolean,
  ignoredSteps: EntityDetailsOverlayTypes[]
) => {
  let filteredEntitySteps = entitySteps.filter(
    (step) => !ignoredSteps.some((item) => step.stepType === item)
  );

  /**
   * Currently, on exporting a PDF of the Work Plan does not take into consideration the Close-out initiatives entity step,
   * but the status is always returning "incomplete" because that step is used to calculate the initiative status.
   * This removes the Close-out initiative step status from the PDF statusing calculation if it has not been closed out.
   */
  if (isPdf && !entity.isInitiativeClosed && reportType === ReportType.WP) {
    filteredEntitySteps = filteredEntitySteps.filter(
      (step) => step.stepType !== EntityDetailsStepTypes.CLOSE_OUT_INFORMATION
    );
  }

  const stepStatuses = filteredEntitySteps.map((step) => {
    return getInitiativeDashboardStatus(step, entity);
  });

  const allStepStatues =
    stepStatuses.length > 0 &&
    stepStatuses.every(
      (field: EntityStatuses) => field === EntityStatuses.COMPLETE
    );

  return allStepStatues ? EntityStatuses.COMPLETE : EntityStatuses.INCOMPLETE;
};

export const getInitiativeStatus = (
  report: ReportShape,
  entity: EntityShape,
  isPdf: boolean = false,
  ignoredSteps: EntityDetailsOverlayTypes[] = []
) => {
  const {
    formTemplate: { routes },
    reportType,
  } = report;
  const { initiative_name, isInitiativeClosed } = entity;

  switch (reportType) {
    case ReportType.WP:
      // Only show the close icon if inside the WP; SAR can still edit entity
      if (isInitiativeClosed) return EntityStatuses.CLOSE;

      // Direct pull of the initiative formTemplate json chunk
      const wpPage = routes.find((r) =>
        routeChecker.isWorkPlanInitiativesPage(r)
      );
      if (!wpPage?.children) return EntityStatuses.INCOMPLETE;

      // get the initiative report child
      const routeChildren = wpPage.children as EntityDetailsOverlayShape[];
      const wpInitiativePage = routeChildren.find(
        (child) => child.entityType === OverlayModalTypes.INITIATIVE
      );
      if (!wpInitiativePage) return EntityStatuses.INCOMPLETE;

      // deprecated: route.entitySteps removed as of Report Year 2026, Period 2
      if (wpInitiativePage.entitySteps) {
        return getEntityStepsStatus(
          wpInitiativePage.entitySteps,
          entity,
          reportType,
          isPdf,
          ignoredSteps
        );
      }

      return getEntityStatus(report, entity, wpInitiativePage.entityType);

    case ReportType.SAR:
      // Direct pull of the initiative formTemplate json chunk
      const sarPage = routes.find((r) =>
        routeChecker.isSarInitiativesPage(r)
      ) as DynamicModalOverlayReportPageShape;
      if (!sarPage) return EntityStatuses.INCOMPLETE;

      // deprecated: route.initiatives removed as of Report Year 2026, Period 2
      if (sarPage.initiatives) {
        //get the initiative report child by the entity's initiative_name
        const sarInitiativePage = sarPage.initiatives.find(
          (child) => child.name === initiative_name
        );

        return getEntityStepsStatus(
          sarInitiativePage?.entitySteps || [],
          entity,
          reportType,
          isPdf,
          ignoredSteps
        );
      }

      return getEntityStatus(report, entity, sarPage.entityType);

    default:
      return EntityStatuses.INCOMPLETE;
  }
};

/**
 * NOTE: this function works on the assumption that the fieldData saved is validated
 *
 * @deprecated No longer used as of Report Year 2026, Period 2
 */
export const getInitiativeDashboardStatus = (
  formEntity: EntityDetailsOverlayShape | OverlayModalPageShape,
  entity: EntityShape
) => {
  const stepType = formEntity.stepType;

  //check for form fields on the first layer
  const formFields = formEntity?.form
    ? formEntity?.form?.fields
    : formEntity?.modalForm?.fields;

  //check for form fields on the second layer
  const objectiveCardFields = (
    (formEntity as AnyObject)?.objectiveCards as []
  )?.map((card: AnyObject) =>
    card?.form ? card.form.fields : card.modalForm.fields
  );

  //if no data could be found, return incomplete
  if (!formFields && !objectiveCardFields) return EntityStatuses.INCOMPLETE;

  //this step is to consolidate the code by converting entity into a loopable array if there's no array of stepType to loop through
  const entities = entity[stepType] ? (entity[stepType] as []) : [entity];

  if (entities.length > 0) {
    let isFilled = true;

    entities.forEach((child: AnyObject, index: number) => {
      let fields = objectiveCardFields
        ? objectiveCardFields[index]
        : formFields;

      //create an array to use as a lookup for fieldData
      const fieldKeyInReport = getValidationList(
        fields.filter(isFieldElement),
        child
      );

      //filter down to the data for the current status topic
      const filteredFieldData = fieldKeyInReport.map((item: string) => {
        return child[item];
      });

      //if any of the field data is empty, that means we're missing data and the status is automatically false
      isFilled = !filteredFieldData.every(
        (field: AnyObject) => field?.length > 0
      )
        ? false
        : isFilled;
    });

    if (isFilled) {
      return EntityStatuses.COMPLETE;
    }
  }

  return EntityStatuses.INCOMPLETE;
};

/**
 * @deprecated No longer used as of Report Year 2026, Period 2
 */
export const getCloseoutStatus = (form: FormJson, entity?: EntityShape) => {
  if (entity) {
    const fieldIds = form.fields
      .filter(isFieldElement)
      .map((field) => (isFieldValidationOptional(field) ? "" : field.id))
      .filter(Boolean);
    const isFilled = fieldIds.map((id) => {
      return entity[id];
    });

    //need to get more specific for checkboxes with nested textboxes
    const checkboxes = (
      entity["closeOutInformation_initiativeStatus"] as []
    )?.map((field: AnyObject) => field.value);

    if (
      checkboxes?.includes("Discontinued initiative") &&
      !entity["closeOutInformation_initiativeStatus-terminationReason"]
    ) {
      return false;
    }

    if (
      checkboxes?.includes(
        "Sustaining initiative through a Medicaid authority"
      ) &&
      !entity["closeOutInformation_initiativeStatus-alternateFunding"]
    ) {
      return false;
    }

    return isFilled?.every((field: AnyObject) => {
      return field?.length > 0;
    });
  }

  return false;
};
