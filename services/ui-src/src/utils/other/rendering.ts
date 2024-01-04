import React from "react";
import { Choice } from "types";

// render '<' special character
export const renderHtml = (rawHTML: string) =>
  React.createElement("span", {
    dangerouslySetInnerHTML: { __html: rawHTML },
  });

export const prettifyChoices = (choices: Choice[]) =>
  choices.map((choice) => choice.value).join(", ");
