// utils
import { AnyObject, ReportPageProgress, ReportRoute, ReportShape } from "types";
import { getWPAlertStatus } from "components/alerts/getWPAlertStatus";

/**
 * This function takes a report and returns an array of objects that represent the
 * status of each page in the report.
 * @param {ReportShape} report
 * @returns {ReportPageProgress[]}
 */
export const getRouteStatus = (report: ReportShape): ReportPageProgress[] => {
  const {
    formTemplate: { routes },
  } = report;
  // Filter out the reviewSubmit pageType
  const validRoutes = routes.filter(
    (r: ReportRoute) =>
      r.pageType !== "reviewSubmit" && r.path !== "/wp/general-information"
  );

  // Ensure there is a response from the API containing the completion status
  if (!report.completionStatus) {
    return [];
  }

  /*
   * Takes the completionStatus from the report and flattens it to get each page
   * in the report
   */
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

  const checkForAlertStatus = (path: string, status: boolean) => {
    switch (path) {
      case "/wp/state-or-territory-specific-initiatives/initiatives":
        //if the alert is false (meaning no alert), default to the validation status check, else the task is not completed
        return !getWPAlertStatus(report, "initiative") ? status : false;
      // this section is optional and should not have a status
      case "/sar/recruitment-enrollment-transitions/number-of-hcbs-participants-admitted-to-facility-from-community":
        return undefined;
    }

    return status;
  };

  // Flatten the completion status to get the pages under each section
  const flattenedStatus = flatten(report.completionStatus, {});

  /**
   * Recursively goes through every route and its child to find out the completion of
   * each page in a report and returns the entire forms progress
   * @param {ReportRoute[]} routes
   * @returns {ReportPageProgress[]}
   */
  const createStatusMap = (routes: ReportRoute[]): ReportPageProgress[] => {
    const overallReportProgress = [];
    const routeLength = routes.length;
    for (let i = 0; i < routeLength; i++) {
      const route = routes[i];
      if (route.children) {
        const parentRoute: ReportPageProgress = {
          name: route.name,
          path: route.path,
          children: createStatusMap(route.children),
        };
        overallReportProgress.push(parentRoute);
      } else {
        const routeProgress: ReportPageProgress = {
          name: route.name,
          path: route.path,
          status: checkForAlertStatus(route.path, flattenedStatus[route.path]),
        };
        overallReportProgress.push(routeProgress);
      }
    }
    return overallReportProgress;
  };

  return createStatusMap(validRoutes);
};
