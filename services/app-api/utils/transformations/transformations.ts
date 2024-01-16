import { randomUUID } from "crypto";
import {
  AnyObject,
  DynamicModalOverlayReportPageShape,
  EntityDetailsOverlayShape,
  FieldChoice,
  FormField,
  FormJson,
  FormLayoutElement,
  OverlayModalPageShape,
  PageTypes,
  ReportJson,
  ReportRoute,
} from "../types";

export const removeConditionalRoutes = <T extends ReportRoute>(
  routes: T[],
  reportPeriod: number
): T[] => {
  for (let route of routes) {
    if (route.children) {
      route.children = removeConditionalRoutes(route.children, reportPeriod);
    }
    if (route.entitySteps) {
      route.entitySteps = removeConditionalRoutes(
        route.entitySteps,
        reportPeriod
      );
    }
  }

  return routes.filter((route) => {
    switch (route.conditionallyRender) {
      case undefined:
        // There is no condition, so this route is always included.
        return true;
      case "showOnlyInPeriod2":
        return reportPeriod === 2;
      default:
        throw new Error(
          `Route.conditionallyRender value '${route.conditionallyRender}' is not implemented.`
        );
    }
  });
};

export function* iterateAllForms(
  routes: ReportRoute[]
): Generator<FormJson, void, unknown> {
  for (let route of routes) {
    if (route.form) {
      yield route.form;
    }
    if (route.modalForm) {
      yield route.modalForm;
    }
    if (route.drawerForm) {
      yield route.drawerForm;
    }
    if (route.children) {
      yield* iterateAllForms(route.children);
    }
    if (route.initiatives) {
      for (let initiative of route.initiatives) {
        yield* iterateAllForms(initiative.entitySteps);
      }
    }
    if (route.entitySteps) {
      yield* iterateAllForms(route.entitySteps);
    }
  }
}
type ChoiceWithChildren = FieldChoice & Required<Pick<FieldChoice, "children">>;

export function* iterateChoicesWithChildren(
  fields: (FormField | FormLayoutElement)[]
): Generator<ChoiceWithChildren, void, undefined> {
  const hasChoices = (
    field: any
  ): field is FormField & { props: { choices: FieldChoice[] } } => {
    return !!field.props?.choices;
  };

  const hasChildren = (choice: any): choice is ChoiceWithChildren => {
    return !!choice.children;
  };

  for (let field of fields.filter(hasChoices)) {
    for (let choice of field.props.choices.filter(hasChildren)) {
      yield choice;
      yield* iterateChoicesWithChildren(choice.children);
    }
  }
}

/**
 * Apply all transformations to this list of fields. A "transformation" may
 * adjust the content of a field, or create copies of a field,
 * based on data in the report.
 */
export const transformFields = (
  fields: (FormField | FormLayoutElement)[],
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject,
  initiativeId?: string
): (FormField | FormLayoutElement)[] => {
  return fields.flatMap((field) => {
    if (!field.transformation?.rule) {
      // This field doesn't require any transformation.
      return field;
    }
    switch (field.transformation.rule) {
      case "nextTwelveQuarters":
        return nextTwelveQuarters(field as FormField, reportYear, reportPeriod);
      case "targetPopulations":
        // This transformation is only used within the SAR, based on data from its source WP.
        return targetPopulations(
          field as FormField,
          reportPeriod,
          workPlanFieldData?.targetPopulations
        );
      case "firstQuarterOfThePeriod":
        return firstQuarterOfThePeriod(field, reportPeriod);
      case "secondQuarterOfThePeriod":
        return secondQuarterOfThePeriod(field, reportPeriod);
      case "fundingSources":
        return fundingSources(
          field,
          reportPeriod,
          reportYear,
          workPlanFieldData,
          initiativeId
        );
      default:
        throw new Error(
          `Field transformation rule ${field.transformation.rule} is not implemented.`
        );
    }
  });
};

export const transformFormTemplate = (
  formTemplate: ReportJson,
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject
) => {
  formTemplate.routes = removeConditionalRoutes(
    formTemplate.routes,
    reportPeriod
  );

  for (let form of iterateAllForms(formTemplate.routes)) {
    form.fields = transformFields(
      form.fields,
      reportPeriod,
      reportYear,
      workPlanFieldData,
      form.initiativeId
    );
    for (let choiceWithChildren of iterateChoicesWithChildren(form.fields)) {
      choiceWithChildren.children = transformFields(
        choiceWithChildren.children,
        reportPeriod,
        reportYear,
        workPlanFieldData,
        form.initiativeId
      );
    }
  }

  return formTemplate;
};

/**
 * Given a field and a reporting period, create 12 copies of that field:
 * One copy for each of the next twelve, starting with the first quarter
 * of this period. For example, 2024 period 2 will cover 2024Q3 - 2027Q2.
 */
const nextTwelveQuarters = (
  field: FormField,
  reportYear: number,
  reportPeriod: number
) => {
  // The first quarter will be Q1 for period 1, or Q3 for period 2.
  const firstQuarterIndex = reportPeriod === 1 ? 0 : 2;

  // No point in keeping this around in the clones
  delete field.transformation;

  return [...new Array(12)]
    .map((_, index) => ({
      year: reportYear + Math.floor((firstQuarterIndex + index) / 4),
      quarter: `Q${1 + ((firstQuarterIndex + index) % 4)}`,
    }))
    .map(({ year, quarter }) => ({
      ...field,
      id: `${field.id}${year}${quarter}`,
      props: {
        ...field.props,
        label: `${year} ${quarter}`,
      },
    }));
};

/**
 * Create copies of the given field, one for each given population.
 * These fields are needed throughout the SAR, using populations from the WP.
 * The list of populations will be stored in a special field in the SAR
 * field data, captured at the moment the SAR is created.
 */
const targetPopulations = (
  field: FormField,
  reportPeriod: number,
  targetPopulations?: AnyObject
) => {
  if (!targetPopulations) {
    throw new Error(
      "Field transformation rule 'targetPopulations' requires targetPopulations."
    );
  }

  const mappedTargetPopulations = targetPopulations.map((population: any) => ({
    name: population.transitionBenchmarks_targetPopulationName,
    label:
      population.isRequired === true
        ? `Number of ${population.transitionBenchmarks_targetPopulationName}`
        : `Other: ${population.transitionBenchmarks_targetPopulationName}`,
  }));

  // No point keeping this around in the clones
  delete field.transformation;

  return mappedTargetPopulations.map((population: any) => ({
    ...field,
    id: `${field.id}_Period${reportPeriod}_${population.name}`,
    props: {
      ...field.props,
      label: population.label,
    },
  }));
};

/** Create a section header with content depending on the report period */
const firstQuarterOfThePeriod = (
  field: FormLayoutElement,
  reportPeriod: number
) => {
  return {
    id: `${field.id}`,
    type: `${field.type}`,
    props: {
      content:
        reportPeriod == 1
          ? "First quarter (January 1 - March 31)"
          : "Third quarter (July 1 - September 30)",
    },
  };
};

/** Create a section header with content depending on the report period */
const secondQuarterOfThePeriod = (
  field: FormLayoutElement,
  reportPeriod: number
) => {
  return {
    id: `${field.id}`,
    type: `${field.type}`,
    props: {
      content:
        reportPeriod == 1
          ? "Second quarter (April 1 - June 30)"
          : "Fourth quarter (October 1 - December 31)",
    },
  };
};

// Funding sources
export const fundingSources = (
  field: FormField,
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject,
  initiativeId?: string
) => {
  const fieldsToAppend = [];

  const initiativeToUse = workPlanFieldData?.initiative.find(
    (initiative: any) => initiative.id === initiativeId
  );

  delete field.transformation;

  for (let fundingSource of initiativeToUse.fundingSources) {
    const isFirstReportPeriod = reportPeriod == 1;
    const fundingSourceHeader: FormField = {
      id: `fundingSourceHeader-${randomUUID()}`,
      type: "sectionHeader",
      props: {
        label: `${fundingSource?.fundingSources_wpTopic?.[0]?.value}`,
      },
    };
    fieldsToAppend.push(fundingSourceHeader);

    // have to loop twice for both periods
    for (let quarterNumber = 1; quarterNumber <= 2; quarterNumber += 1) {
      let longformQuarter = "";
      let spendingMonths = "";

      if (quarterNumber === 1) {
        longformQuarter = isFirstReportPeriod ? "First" : "Third";
        spendingMonths = isFirstReportPeriod
          ? "January 1 - March 31"
          : "July 1 - September 30";
      } else {
        longformQuarter = isFirstReportPeriod ? "Second" : "Fourth";
        spendingMonths = isFirstReportPeriod
          ? "April 1 - June 30"
          : "October 1 - December 31";
      }

      const actualSpending: FormField = {
        id: `fundingSources_actual${reportYear}Q${quarterNumber}`,
        type: "number",
        validation: "number",
        props: {
          label: `Actual Spending (${longformQuarter} quarter: ${spendingMonths})`,
        },
      };
      const projectedSpending: FormField = {
        id: `fundingSources_quarters${reportYear}Q${quarterNumber}`,
        type: "number",
        validation: "number",
        props: {
          label: `Projected Spending (${longformQuarter} quarter: ${spendingMonths})`,
        },
      };
      fieldsToAppend.push(actualSpending, projectedSpending);
    }
  }
  return fieldsToAppend;
};

export const runSARTransformations = (
  route: DynamicModalOverlayReportPageShape,
  workPlanFieldData?: AnyObject
): ReportRoute => {
  if (!workPlanFieldData?.initiative)
    throw new Error(
      "Not implemented yet - Workplan must have initiatives that the SAR can build from"
    );

  // TODO: refactor :)
  const initiatives = [];
  for (let workPlanInitiative of workPlanFieldData.initiative) {
    // At this stage, we know that the route will have a template
    let templateEntitySteps = structuredClone(route.template!.entitySteps);
    templateEntitySteps = templateEntitySteps.map((step: any) => {
      if (step.form) {
        return {
          ...step,
          form: { ...step.form, initiativeId: workPlanInitiative.id },
        };
      } else if (step.modalForm) {
        return {
          ...step,
          modalForm: { ...step.modalForm, initiativeId: workPlanInitiative.id },
        };
      } else if (step.drawerForm) {
        return {
          ...step,
          drawerForm: {
            ...step.drawerForm,
            initiativeId: workPlanInitiative.id,
          },
        };
      }
    });
    const initiative = {
      initiativeId: workPlanInitiative.id,
      name: workPlanInitiative.initiative_name,
      topic: workPlanInitiative.initiative_wpTopic?.[0].value,
      // At this stage, we know that the route will have a template
      dashboard: route.template!.dashboard,
      entitySteps: templateEntitySteps,
    };

    initiatives.push(initiative);
  }
  route.initiatives = initiatives;
  console.log(route, "route");
  return route;
};

export const generateSARFormsForInitiatives = (
  reportRoutes: (
    | ReportRoute
    | OverlayModalPageShape
    | EntityDetailsOverlayShape
  )[],
  workPlanFieldData?: AnyObject
) => {
  for (let route of reportRoutes) {
    if (route?.pageType === PageTypes.DYNAMIC_MODAL_OVERLAY) {
      route = runSARTransformations(
        route as DynamicModalOverlayReportPageShape,
        workPlanFieldData
      );
      delete route.template;
    }
  }
  return reportRoutes;
};
