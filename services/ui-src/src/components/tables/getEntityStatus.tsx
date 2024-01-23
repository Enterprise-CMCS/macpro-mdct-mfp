import { EntityStatuses } from "components";
import {
  EntityDetailsDashboardOverlayShape,
  EntityDetailsOverlayShape,
  EntityShape,
  FormJson,
  ModalOverlayReportPageShape,
  OverlayModalPageShape,
  ReportShape,
  OverlayModalTypes,
  isFieldElement,
} from "types";
import { AnyObject } from "yup/lib/types";

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
    .filter((field) => field);

  //Loop through the user entered entity to see which nested id the user had selected
  const entityNestedSelection: AnyObject[] = [];
  Object.values(entity).forEach((field: AnyObject) => {
    if (typeof field === "object") {
      entityNestedSelection.push(field);
    }
  });

  //Strip it to only the key information
  const entityNestedKeys = entityNestedSelection
    .flat()
    .map((entity) => {
      return entity.key;
    })
    .filter((key) => key);

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

//does not work with substeps
export const getEntityStatus = (
  report: ReportShape,
  entity: EntityShape,
  entityType: string
) => {
  const routes = report?.formTemplate?.flatRoutes;
  const pageTypes = ["form", "drawerForm", "modalForm"];

  if (routes) {
    //find the correct route information for this entityType
    const route = routes.find(
      (route) => (route as AnyObject).entityType === entityType
    );

    let fields: AnyObject[] = [];
    //store the fields data into an array to be looked through
    pageTypes.forEach((type) => {
      if (route && (route as AnyObject)[type])
        fields.push((route as AnyObject)[type].fields);
    });
    const validationIdList = getValidationList(fields.flat(), entity);

    const isFilled = validationIdList.map((id: string) => {
      return entity[id];
    });

    //check to see if each validation id was matched to user selected values
    return isFilled?.every((field: AnyObject) => {
      return field && field.length > 0;
    });
  }

  return false;
};

export const getInitiativeStatus = (
  report: ReportShape,
  entity: EntityShape,
  isPdf?: boolean,
  ignore?: string[]
) => {
  if (entity?.isInitiativeClosed) return EntityStatuses.CLOSE;

  // Direct pull of the initiative formTemplate json chunk
  const reportRoute = report.formTemplate
    .routes[3] as unknown as ModalOverlayReportPageShape;

  //get the intiative report child
  const reportChild: EntityDetailsDashboardOverlayShape = (
    reportRoute?.children! as EntityDetailsOverlayShape[]
  )?.find((child) => child.entityType === OverlayModalTypes.INITIATIVE)!;

  if (reportChild?.entitySteps) {
    const entitySteps: (EntityDetailsOverlayShape | OverlayModalPageShape)[] =
      reportChild.entitySteps;

    const filteredEntitySteps = entitySteps.filter(
      (step) => !ignore?.find((item) => step.stepType === item)
    );
    const stepStatuses = filteredEntitySteps.map((step) => {
      return getInitiativeDashboardStatus(step, entity);
    });

    /**
     * Currently, on exporting a PDF of the Work Plan does not take into consideration the Close-out initiatives entity step,
     * but the status is always returning "incomplete" because that step is used to calculate the initiative status.
     * This removes the Close-out initiative step status from the PDF statusing calculation if this is not a copy-over.
     */
    if (isPdf && !entity.isCopied) {
      stepStatuses.splice(-1);
    }

    return stepStatuses.every((field: boolean | EntityStatuses) => field);
  }

  return false;
};

//NOTE: this function works on the assumption that the fieldData saved is validated
export const getInitiativeDashboardStatus = (
  formEntity: EntityDetailsOverlayShape | OverlayModalPageShape,
  entity: EntityShape
) => {
  const stepType = formEntity.stepType;

  //pull fields from form type
  const fields = formEntity.form
    ? formEntity.form.fields
    : formEntity.modalForm.fields;

  //this step is to consolidate the code by converting entity into a loopable array if there's no array of stepType to loop through
  const entities = entity[stepType] ? (entity[stepType] as []) : [entity];

  if (entities.length > 0) {
    let isFilled = true;

    entities.forEach((child: AnyObject) => {
      //create an array to use as a lookup for fieldData
      const fieldKeyInReport = getValidationList(
        fields.filter(isFieldElement),
        child
      );

      //filter down to the data for the current status topic
      const filterdFieldData = fieldKeyInReport.map((item: string) => {
        return child[item];
      });

      //if any of the field data is empty, that means we're missing data and the status is automatically false
      isFilled = !filterdFieldData.every(
        (field: AnyObject) => field && field.length > 0
      )
        ? false
        : isFilled;
    });

    return isFilled;
  }

  return false;
};

export const getCloseoutStatus = (form: FormJson, entity: EntityShape) => {
  if (entity) {
    const fieldIds = form.fields
      .filter(isFieldElement)
      .map((field) => {
        // Some fields have validation: "foo", and some have validation: { type: "foo" }
        let validationType = (field as AnyObject)?.validation ?? "";
        if (typeof validationType === "object") {
          validationType = validationType.type ?? "";
        }
        return !validationType.includes("Optional") ? field.id : "";
      })
      .filter((field) => field);
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
      return field && field.length > 0;
    });
  }

  return false;
};
