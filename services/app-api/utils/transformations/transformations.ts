import {
  AnyObject,
  DynamicModalOverlayReportPageShape,
  EntityDetailsOverlayShape,
  OverlayModalPageShape,
  PageTypes,
  ReportRoute,
} from "../types";

export const runSARTransformations = (
  route: DynamicModalOverlayReportPageShape,
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject
): ReportRoute => {
  if (!workPlanFieldData?.initiative)
    throw new Error(
      "Not implemented yet - Workplan must have initiatives that the SAR can build from"
    );

  const initiatives = [];
  for (let workPlanInitiative of workPlanFieldData.initiative) {
    const initiative = {
      initiativeId: workPlanInitiative.id,
      name: workPlanInitiative.initiative_name,
      topic: workPlanInitiative.initiative_wpTopic?.[0].value,
      dashboard: route?.template.dashboard,
      entitySteps: structuredClone(route?.template.entitySteps),
    };

    initiatives.push(initiative);
  }
  route.initiatives = initiatives;
  return route;
};

export const generateSARFormsForInitiatives = (
  reportRoutes: (
    | ReportRoute
    | OverlayModalPageShape
    | EntityDetailsOverlayShape
  )[],
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject
) => {
  for (let route of reportRoutes) {
    if (route?.pageType === PageTypes.DYNAMIC_MODAL_OVERLAY) {
      route = runSARTransformations(
        route as DynamicModalOverlayReportPageShape,
        reportPeriod,
        reportYear,
        workPlanFieldData
      );
      delete route.template;
    }
  }
  return reportRoutes;
};
