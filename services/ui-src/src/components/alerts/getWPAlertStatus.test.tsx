import { ReportShape } from "types";
import { getWPAlertStatus } from "./getWPAlertStatus";

describe("alerts/getWPAlertStatus", () => {
  describe("getWPAlertStatus()", () => {
    const topics = [
      "Transitions and transition coordination services",
      "Housing-related supports",
      "Quality measurement and improvement",
      "Self-direction",
      "Tribal Initiative",
    ];

    const allTopics = topics.map((topic) => {
      return { value: topic };
    });

    const basicTopics = allTopics.slice(0, 3);

    test("Alert should not show when all topics are required and completed", () => {
      const report = {
        fieldData: {
          instructions_selfDirectedInitiatives: [{ value: "Yes" }],
          instructions_tribalInitiatives: [{ value: "Yes" }],
          initiative: [
            {
              initiative_wpTopic: allTopics,
            },
          ],
        },
      } as unknown as ReportShape;

      const alertVisible = getWPAlertStatus(report, "initiative");

      expect(alertVisible).toBe(false);
    });

    test("Alert should show when all topics are required, but optionally-applicable topics are not completed", () => {
      const report = {
        fieldData: {
          instructions_selfDirectedInitiatives: [{ value: "Yes" }],
          instructions_tribalInitiatives: [{ value: "Yes" }],
          initiative: [
            {
              initiative_wpTopic: basicTopics,
            },
          ],
        },
      } as unknown as ReportShape;

      const alertVisible = getWPAlertStatus(report, "initiative");

      expect(alertVisible).toBe(true);
    });

    test("Alert should not show when optionally-required topics are neither required nor completed", () => {
      const report = {
        fieldData: {
          instructions_selfDirectedInitiatives: [{ value: "No" }],
          instructions_tribalInitiatives: [{ value: "No" }],
          initiative: [
            {
              initiative_wpTopic: basicTopics,
            },
          ],
        },
      } as unknown as ReportShape;

      const alertVisible = getWPAlertStatus(report, "initiative");

      expect(alertVisible).toBe(false);
    });

    test("Alert should show when previous questions about optional topics are not answered", () => {
      const report = {
        fieldData: {
          initiative: [
            {
              initiative_wpTopic: allTopics,
            },
          ],
        },
      } as unknown as ReportShape;

      const alertVisible = getWPAlertStatus(report, "initiative");

      expect(alertVisible).toBe(true);
    });

    test("Alert should not show when the status function is not implemented", () => {
      const report = {} as unknown as ReportShape;

      const alertVisible = getWPAlertStatus(report, "fake entity type");

      expect(alertVisible).toBe(false);
    });
  });
});
