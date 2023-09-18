import { ReportShape } from "types";
import { getWPAlertStatus } from "./getWPAlertStatus";

describe("Test WP Alerts", () => {
  test("Test checkInitiativesTopics not filled", () => {
    const report: ReportShape = {
      fieldData: {
        initiatives: [
          {
            initiative_wpTopic: [],
          },
        ],
      },
    } as unknown as ReportShape;

    //turn on alertbox
    expect(getWPAlertStatus(report, "initiatives")).toBeTruthy();
  });
  test("Test checkInitiativesTopics filled", () => {
    const topics = [
      "Transitions and transition coordination services*",
      "Housing-related supports*",
      "Quality measurement and improvement*",
      "Self-direction(*if applicable)",
      "Tribal Initiative (*if applicable)",
    ];

    const initiative_wpTopic = topics.map((topic) => {
      return { value: topic };
    });

    const report: ReportShape = {
      fieldData: {
        initiatives: [
          {
            initiative_wpTopic: initiative_wpTopic,
          },
        ],
      },
    } as unknown as ReportShape;

    //turn off alertbox
    expect(getWPAlertStatus(report, "initiatives")).toBeFalsy();
  });
});
