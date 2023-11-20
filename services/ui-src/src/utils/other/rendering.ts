import React from "react";
import { Choice, EntityShape } from "types";

// render '<' special character
export const renderHtml = (rawHTML: string) =>
  React.createElement("span", {
    dangerouslySetInnerHTML: { __html: rawHTML },
  });

// return MLR eligibility group text
export const eligibilityGroup = (entity: EntityShape) => {
  if (entity["report_eligibilityGroup-otherText"]) {
    return entity["report_eligibilityGroup-otherText"];
  }
  return entity.report_eligibilityGroup[0].value;
};

export const prettyPrintChoices = (choices: Choice[]) =>
  choices.map((choice) => choice.value).join(", ");
