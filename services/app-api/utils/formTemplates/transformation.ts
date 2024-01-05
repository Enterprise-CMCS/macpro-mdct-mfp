import {
  FormField,
  FormLayoutElement,
  ReportJson,
  ReportRoute,
} from "../types";
import { iterateAllForms } from "./utils";

/**
 * This type and its guard avoid a potentially dangerous situation.
 * It is a subset of ReportShape so it SEEMS we could simply use that instead.
 *
 * Normally, we control form templates completely; they are either hard-coded
 * or fetched from our cloud. We do not control report data; it comes to us
 * over the wire and thus may contain maliciously-crafted data. When validation
 * is a one-way street, we use our trusted templates to verify the data and
 * all is well.
 *
 * With form template transformations, we use (some of) the report data to
 * modify the form template, then use the modified template to validate that
 * same data. This two-way street could potentially be used for Evil.
 *
 * To eliminate that possibility, we must perform strict runtime checks on
 * all report data that may be used to influence the form template. Therefore
 * only a SufficientlyValidatedReport may be used to transform the template.
 *
 * If you are creating a transformation that depends on report data which is
 * not already present in this type, when you add it to the type, please
 * also add checks which are as strict as possible to the type guard.
 */
type SufficientlyValidatedReport = {
  reportYear?: number;
  reportPeriod?: ReportPeriod;
  fieldData?: {
    _targetPopulationsFromWP?: {
      name: string;
      label: string;
    }[];
  };
};

type ReportPeriod = 1 | 2;

const isSufficientlyValidated = (
  report: any
): report is SufficientlyValidatedReport => {
  /*
   * Note that reportYear and reportPeriod are only optional to make it easier
   * to write tests for validationJson; otherwise every unit test would need to
   * specify them in their mock data, even when irrelevant to the test.
   *
   * In prod, every report will have reportYear and reportPeriod every time.
   */
  if (report.reportYear) {
    if (typeof report.reportYear !== "number") return false;
  }
  if (report.reportPeriod) {
    if (typeof report.reportPeriod !== "number") return false;
    if (report.reportPeriod !== 1 && report.reportPeriod !== 2) return false;
  }
  if (report.fieldData?._targetPopulationsFromWP) {
    const populations = report.fieldData._targetPopulationsFromWP;
    if (!Array.isArray(populations)) return false;
    for (let population of populations) {
      if (!population.name) return false;
      if (typeof population.name !== "string") return false;
      if (!population.label) return false;
      if (typeof population.label !== "string") return false;
    }
  }

  return true;
};

export const transformFormTemplate = (
  formTemplate: ReportJson,
  report: unknown // This unknown forces the use of SufficientlyValidatedReport.
) => {
  if (!isSufficientlyValidated(report)) {
    throw new Error(
      `Report data is not valid for formTemplate transformation.`
    );
  }

  formTemplate.routes = removeConditionalRoutes(formTemplate.routes, report);

  for (let form of iterateAllForms(formTemplate.routes)) {
    form.fields = transformFields(form.fields, report);
  }

  return formTemplate;
};

export const removeConditionalRoutes = <T extends ReportRoute>(
  routes: T[],
  report: SufficientlyValidatedReport
): T[] => {
  for (let route of routes) {
    if (route.children) {
      route.children = removeConditionalRoutes(route.children, report);
    }
    if (route.entitySteps) {
      route.entitySteps = removeConditionalRoutes(route.entitySteps, report);
    }
  }

  return routes.filter((route) => {
    switch (route.conditionallyRender) {
      case undefined:
        // There is no condition, so this route is always included.
        return true;
      case "showOnlyInPeriod2":
        if (!report.reportPeriod)
          throw new Error(
            "Route transformation rule 'showOnlyInPeriod2' requires a reportPeriod."
          );
        return report.reportPeriod === 2;
      default:
        throw new Error(
          `Route.conditionallyRender value '${route.conditionallyRender}' is not implemented.`
        );
    }
  });
};

/**
 * Apply all transformations to this list of fields. A "transformation" may
 * adjust the content of a field, or create copies of a field,
 * based on data in the report.
 */
export const transformFields = (
  fields: (FormField | FormLayoutElement)[],
  report: SufficientlyValidatedReport
): (FormField | FormLayoutElement)[] => {
  return fields.flatMap((field) => {
    if (!field.transformation?.rule) {
      // This field doesn't require any transformation.
      return field;
    }

    switch (field.transformation.rule) {
      case "nextTwelveQuarters":
        return nextTwelveQuarters(
          field as FormField,
          report.reportYear,
          report.reportPeriod
        );
      case "targetPopulations":
        // This transformation is only used within the SAR, based on data from its source WP.
        return targetPopulations(
          field as FormField,
          report.reportPeriod,
          report.fieldData?._targetPopulationsFromWP
        );
      case "firstQuarterOfThePeriod":
        return firstQuarterOfThePeriod(field, report.reportPeriod);
      case "secondQuarterOfThePeriod":
        return secondQuarterOfThePeriod(field, report.reportPeriod);
      default:
        throw new Error(
          `Field transformation rule ${field.transformation.rule} has not been implemented.`
        );
    }
  });
};

/**
 * Given a field and a reporting period, create 12 copies of that field:
 * One copy for each of the next twelve, starting with the first quarter
 * of this period. For example, 2024 period 2 will cover 2024Q3 - 2027Q2.
 */
const nextTwelveQuarters = (
  field: FormField,
  reportYear?: number,
  reportPeriod?: ReportPeriod
) => {
  if (!reportYear)
    throw new Error(
      "Field transformation rule 'nextTwelveQuarters' requires a reportYear."
    );
  if (!reportPeriod)
    throw new Error(
      "Field transformation rule 'nextTwelveQuarters' requires a reportPeriod."
    );

  // The first quarter will be Q1 for period 1, or Q3 for period 2.
  const thisQuarterIndex = reportPeriod === 1 ? 0 : 2;

  return [...new Array(12)]
    .map((_, index) => ({
      year: reportYear + Math.floor((thisQuarterIndex + index) / 4),
      quarter: `Q${1 + ((thisQuarterIndex + index) % 4)}`,
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
  reportPeriod?: ReportPeriod,
  targetPopulations?: { name: string; label: string }[]
) => {
  if (!reportPeriod)
    throw new Error(
      "Field transformation rule 'targetPopulations' requires a reportPeriod."
    );
  if (!targetPopulations)
    throw new Error(
      "Field transformation rule 'targetPopulations' requires targetPopulations."
    );

  return targetPopulations.map((population) => ({
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
  reportPeriod?: ReportPeriod
) => {
  if (!reportPeriod)
    throw new Error(
      "Field transformation rule 'firstQuarterOfThePeriod' requires a reportPeriod."
    );

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
  reportPeriod?: ReportPeriod
) => {
  if (!reportPeriod)
    throw new Error(
      "Field transformation rule 'secondQuarterOfThePeriod' requires a reportPeriod."
    );

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
