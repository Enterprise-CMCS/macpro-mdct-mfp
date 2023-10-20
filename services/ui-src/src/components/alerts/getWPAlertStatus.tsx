import { ReportShape, AnyObject } from "types";

//setting up function calls using entityType as call
export const checkInitiativeTopics = (fieldData: any, entities: any[]) => {
  let topics = [
    "Transitions and transition coordination services*",
    "Housing-related supports*",
    "Quality measurement and improvement*",
  ];

  //if user did not answer previous question, alert stays on
  if (
    !fieldData?.instructions_selfDirectedInitiatives ||
    !fieldData?.instructions_tribalInitiatives
  )
    return true;

  if (fieldData?.instructions_selfDirectedInitiatives[0]?.value === "Yes")
    topics.push("Self-direction (*if applicable)");

  if (fieldData?.instructions_tribalInitiatives[0]?.value === "Yes")
    topics.push("Tribal Initiative (*if applicable)");

  //filter down to the values of the radio selection
  const values = entities?.flatMap((entity) =>
    entity?.initiative_wpTopic?.map((topic: AnyObject) => {
      return topic?.value;
    })
  );
  //check if the values matches all the topics, if all topics is covered, return false
  return !topics.every((topic) => values?.includes(topic));
};

//store function calls here
const alertStatusFunctions: AnyObject = {
  initiative: checkInitiativeTopics,
};

export const getWPAlertStatus = (report: ReportShape, entityType: string) => {
  const fieldData = report?.fieldData;
  let fn = alertStatusFunctions[entityType];
  if (typeof fn === "function") {
    return fn(fieldData, fieldData[entityType]);
  }
  return false;
};
