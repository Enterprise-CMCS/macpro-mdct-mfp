import { ReportShape, AnyObject } from "types";

//setting up function calls using entityType as call
export const checkInitiativesTopics = (entities: any[]) => {
  const topics = [
    "Transitions and transition coordination services*",
    "Housing-related supports*",
    "Quality measurement and improvement*",
    "Self-direction(*if applicable)",
    "Tribal Initiative (*if applicable)",
  ];

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
  initiatives: checkInitiativesTopics,
};

export const getWPAlertStatus = (report: ReportShape, entityType: string) => {
  const fieldData = report?.fieldData;
  var fn = alertStatusFunctions[entityType];
  if (typeof fn === "function") {
    return fn(fieldData[entityType]);
  }
  return false;
};
