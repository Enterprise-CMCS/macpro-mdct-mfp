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
  SomeRequired,
  isUsableForTransforms,
  TargetPopulation,
  WorkPlanFieldDataForTransforms,
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

export function* iterateChoicesWithChildren(
  fields: (FormField | FormLayoutElement)[]
): Generator<SomeRequired<FieldChoice, "children">, void, undefined> {
  const fieldsWithChoices = fields.filter((field) => !!field.props?.choices);
  for (let field of fieldsWithChoices) {
    const choicesWithChildren = field.props!.choices.filter(
      (choice: FieldChoice) => !!choice.children
    );

    for (let choice of choicesWithChildren) {
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
  workPlanFieldData?: unknown,
  initiativeId?: string,
  objectiveId?: string
): (FormField | FormLayoutElement)[] => {
  if (!isUsableForTransforms(workPlanFieldData)) {
    throw new Error(
      `Work Plan Field Data is not structured as expected for SAR form template transformation`
    );
  }

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
      case "quantitativeQuarters":
        return quantitativeQuarters(
          field,
          reportPeriod,
          reportYear,
          workPlanFieldData,
          initiativeId,
          objectiveId
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

  formTemplate.routes = generateSARFormsForInitiatives(
    formTemplate.routes,
    workPlanFieldData
  );

  for (let form of iterateAllForms(formTemplate.routes)) {
    form.fields = transformFields(
      form.fields,
      reportPeriod,
      reportYear,
      workPlanFieldData,
      form.initiativeId,
      form.objectiveId
    );
    for (let choiceWithChildren of iterateChoicesWithChildren(form.fields)) {
      choiceWithChildren.children = transformFields(
        choiceWithChildren.children,
        reportPeriod,
        reportYear,
        workPlanFieldData,
        form.initiativeId,
        form.objectiveId
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
  targetPopulations?: TargetPopulation[]
) => {
  if (!targetPopulations) {
    throw new Error(
      "Field transformation rule 'targetPopulations' requires targetPopulations."
    );
  }

  // No point keeping this around in the clones
  delete field.transformation;

  // Exclude populations that were marked in the WP as being non-applicable to MFP
  const isApplicable = (population: TargetPopulation) =>
    population.transitionBenchmarks_applicableToMfpDemonstration?.[0]?.value !==
    "No";

  const nameOf = (population: TargetPopulation) =>
    population.transitionBenchmarks_targetPopulationName;

  const labelOf = (population: TargetPopulation) =>
    population.isRequired === true
      ? `Number of ${nameOf(population)}`
      : `Other: ${nameOf(population)}`;

  return targetPopulations.filter(isApplicable).map((population: any) => ({
    ...field,
    id: `${field.id}_Period${reportPeriod}_${nameOf(population)}`,
    props: {
      ...field.props,
      label: labelOf(population),
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
  workPlanFieldData?: WorkPlanFieldDataForTransforms,
  initiativeId?: string
): (FormField | FormLayoutElement)[] => {
  delete field.transformation;

  const initiativeToUse = workPlanFieldData?.initiative?.find(
    (initiative: any) => initiative.id === initiativeId
  );

  if (!initiativeToUse) {
    throw new Error(
      `Transformation failed: Could not find initiative with id ${initiativeId}`
    );
  }

  const firstPeriodQuarters = [
    {
      number: 1,
      name: "First",
      range: "January 1 - March 31",
    },
    {
      number: 2,
      name: "Second",
      range: "April 1 - June 30",
    },
  ];

  const secondPeriodQuarters = [
    {
      number: 3,
      name: "Third",
      range: "July 1 - September 30",
    },
    {
      number: 4,
      name: "Fourth",
      range: "October 1 - December 31",
    },
  ];

  let quarters =
    reportPeriod === 1 ? firstPeriodQuarters : secondPeriodQuarters;

  return initiativeToUse.fundingSources.flatMap((fundingSource) => [
    {
      id: `fundingSourceHeader-${randomUUID()}`,
      type: "sectionHeader",
      props: {
        label: `${fundingSource.fundingSources_wpTopic[0].value}`,
      },
    },
    ...quarters.flatMap((quarter) => [
      {
        id: `fundingSources_actual${reportYear}Q${quarter.number}`,
        type: "number",
        validation: "number",
        props: {
          label: `Actual Spending (${quarter.name} quarter: ${quarter.range})`,
        },
      },
      {
        id: `fundingSources_quarters${reportYear}Q${quarter.number}`,
        type: "number",
        validation: "number",
        props: {
          label: `Projected Spending (${quarter.name} quarter: ${quarter.range})`,
        },
      },
    ]),
  ]);
};

export const quantitativeQuarters = (
  fieldToRepeat: FormField,
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject,
  initiativeId?: string,
  objectiveId?: string
) => {
  const fieldsToAppend = [];

  const initiativeToUse = workPlanFieldData?.initiative.find(
    (initiative: any) => initiative.id === initiativeId
  );

  const objectiveToUse = initiativeToUse.evaluationPlan.find(
    (objective: any) => objective.id === objectiveId
  );

  delete fieldToRepeat.transformation;

  if (objectiveToUse?.evaluationPlan_includesTargets?.[0]?.value === "Yes") {
    const objectivesHeader: FormField = {
      id: `objectivesHeader-${objectiveToUse.id}}`,
      type: "sectionHeader",
      props: {
        content: "Complete the following for quantitative targets:",
      },
    };
    fieldsToAppend.push(objectivesHeader);

    const headingStringFirstQuarter =
      reportPeriod == 1
        ? "First quarter (January 1 - March 31)"
        : "Third quarter (July 1 - September 30)";

    const headingStringSecondQuarter =
      reportPeriod == 1
        ? "Second quarter (April 1 - June 30)"
        : "Fourth quarter (October 1 - December 31)";

    // have to loop twice for both periods
    for (let quarterNumber = 1; quarterNumber <= 2; quarterNumber += 1) {
      const formFieldHeading: FormField = {
        id: `${objectiveToUse.id}${fieldToRepeat.id}Heading_Q${quarterNumber}`,
        type: "sectionHeader",
        props: {
          content:
            quarterNumber == 1
              ? headingStringFirstQuarter
              : headingStringSecondQuarter,
          label: "Complete the following for quantitative targets:",
        },
      };
      fieldsToAppend.push(formFieldHeading);

      const formFieldActual: FormField = {
        id: `${objectiveToUse.id}${fieldToRepeat.id}Actual_Q${quarterNumber}`,
        type: "number",
        validation: "number",
        props: {
          label: "Actual value",
        },
      };
      fieldsToAppend.push(formFieldActual);

      const formFieldTarget: FormField = {
        id: `quarterlyProjections${reportYear}Q${quarterNumber}`,
        type: "number",
        props: {
          label: "Target Value",
          hint: "Auto-populates from Work Plan.",
          disabled: true,
        },
      };
      fieldsToAppend.push(formFieldTarget);
    }
  }

  return fieldsToAppend;
};

export const runSARTransformations = (
  route: DynamicModalOverlayReportPageShape,
  workPlanFieldData?: WorkPlanFieldDataForTransforms
): ReportRoute => {
  if (!workPlanFieldData?.initiative)
    throw new Error(
      "Not implemented yet - Workplan must have initiatives that the SAR can build from"
    );

  // At this stage, we know that the route will have a template.
  const template = route.template!;
  delete route.template;

  route.initiatives = [];
  for (let workPlanInitiative of workPlanFieldData.initiative) {
    let templateEntitySteps = structuredClone(template.entitySteps);
    for (let step of templateEntitySteps) {
      for (let formType of ["form", "modalForm", "drawerForm"] as const) {
        if (step[formType]) {
          step[formType].initiativeId = workPlanInitiative.id;
        }
      }
      if (step.stepType === "evaluationPlan") {
        step.objectiveCards = [];
        for (let workPlanObjective of workPlanInitiative.evaluationPlan) {
          step.objectiveCards.push({
            ...step,
            objectiveCards: undefined,
            modalForm: {
              ...step.modalForm,
              initiativeId: workPlanInitiative.id,
              objectiveId: workPlanObjective.id,
            },
          });
        }
      }
    }

    route.initiatives.push({
      initiativeId: workPlanInitiative.id,
      name: workPlanInitiative.initiative_name,
      topic: workPlanInitiative.initiative_wpTopic?.[0].value,
      dashboard: template.dashboard,
      entitySteps: templateEntitySteps,
    });
  }

  return route;
};

const generateSARFormsForInitiatives = (
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
