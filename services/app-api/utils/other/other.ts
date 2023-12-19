import { States } from "../constants/constants";
import {
  AnyObject,
  ReportMetadataShape,
  ReportShape,
  ReportStatus,
  ReportType,
} from "../types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { fetchReportsByState, fetchReport } from "../../handlers/reports/fetch";

export const createReportName = (
  reportType: string,
  reportPeriod: number,
  state: string,
  reportYear?: number,
  workPlan?: ReportMetadataShape
) => {
  const reportName = reportType;
  const period =
    reportType === ReportType.SAR ? workPlan?.reportPeriod : reportPeriod;

  const fullStateName = States[state as keyof typeof States];
  return `${fullStateName} ${reportName} ${reportYear} - Period ${period}`;
};

export const lastCreatedWorkPlan = (
  currentWorkPlans: ReportMetadataShape[]
): ReportMetadataShape | undefined => {
  let lastCreatedWorkPlan: ReportMetadataShape | undefined = undefined;

  // For each work plan...
  currentWorkPlans.forEach((workPlan: ReportMetadataShape) => {
    /*
     * ...if the workplan hasn't been used to create a SAR before AND
     * the work plan has a status of "Not Started" OR "In Progress"...
     */
    if (
      (workPlan.status === ReportStatus.NOT_STARTED ||
        workPlan.status === ReportStatus.IN_PROGRESS) &&
      !workPlan?.associatedSar
    ) {
      /*
       * ...then do one of two things: if there are multiple work plans that meet this criteria,
       * grab the one that was created most recently and return that as our work plan to
       * copy from...
       */
      if (
        lastCreatedWorkPlan &&
        workPlan.createdAt > lastCreatedWorkPlan?.createdAt
      ) {
        lastCreatedWorkPlan = workPlan;
      } else if (!lastCreatedWorkPlan) {
        /*
         * ...Else this is our first run of the form and we found a work plan to copy from, so
         * set it as out last found submission to be tested against all other possible work plans.
         */
        lastCreatedWorkPlan = workPlan;
      }
    }
  });

  return lastCreatedWorkPlan;
};

export const getLastCreatedWorkPlan = async (
  event: APIGatewayProxyEvent,
  _context: any,
  state: string
): Promise<{
  workPlanMetadata?: ReportMetadataShape;
  workPlanFieldData?: AnyObject;
}> => {
  // Fetch All Work Plans for the state
  const workPlanEvent = event;
  workPlanEvent.pathParameters = {
    ...workPlanEvent.pathParameters,
    reportType: ReportType.WP,
  };
  const workPlanSubmissions = await fetchReportsByState(event, _context);
  const currentWorkPlans = JSON.parse(workPlanSubmissions.body);

  // Get last created Work Plan
  const eligbleWorkPlan = lastCreatedWorkPlan(currentWorkPlans);

  // And assuming we have one we want to get the data from.
  if (eligbleWorkPlan) {
    const fetchWPReportEvent = event;
    fetchWPReportEvent.pathParameters = {
      reportType: ReportType.WP,
      state: state,
      id: eligbleWorkPlan["id"],
    };
    // Get the data of the eligble work plan
    const workPlan = await fetchReport(fetchWPReportEvent, _context);
    const workPlanBody: ReportShape = JSON.parse(workPlan.body);

    // And get its metadata and field data from the response and return it!
    const workPlanMetadata: ReportMetadataShape = workPlanBody;
    const workPlanFieldData = workPlanBody.fieldData;
    return { workPlanMetadata, workPlanFieldData };
  }
  // If there wasn't an eligble work plan to copy from, return undefined
  return { workPlanMetadata: undefined, workPlanFieldData: undefined };
};
