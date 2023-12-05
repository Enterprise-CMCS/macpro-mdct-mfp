import { ReportShape } from "types";
import { getWPAlertStatus } from "./getWPAlertStatus";

describe("Test WP Alerts", () => {
  const topics = [
    "Transitions and transition coordination services",
    "Housing-related supports",
    "Quality measurement and improvement",
    "Self-direction",
    "Tribal Initiative",
  ];

  const initiative_wpTopic = topics.map((topic) => {
    return { value: topic };
  });

  test("Test checkInitiativesTopics not filled", () => {
    const report: ReportShape = {
      fieldData: {
        initiative: [
          {
            initiative_wpTopic: [],
          },
        ],
      },
    } as unknown as ReportShape;

    //turn on alertbox
    expect(getWPAlertStatus(report, "initiative")).toBeTruthy();
  });
  test("Test checkInitiativesTopics filled", () => {
    const report: ReportShape = {
      fieldData: {
        instructions_selfDirectedInitiatives: { value: "Yes" },
        instructions_tribalInitiatives: { value: "Yes" },
        initiative: [
          {
            initiative_wpTopic: initiative_wpTopic,
          },
        ],
      },
    } as unknown as ReportShape;

    //turn off alertbox
    expect(getWPAlertStatus(report, "initiative")).toBeFalsy();
  });
  test("Test checkInitiativesTopics if previous questions were not fileed", () => {
    const report: ReportShape = {
      fieldData: {
        initiative: [
          {
            initiative_wpTopic: initiative_wpTopic,
          },
        ],
      },
    } as unknown as ReportShape;

    //alertbox will still be active
    expect(getWPAlertStatus(report, "initiative")).toBeTruthy();
  });
});
