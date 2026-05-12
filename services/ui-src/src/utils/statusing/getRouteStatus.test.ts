import { getRouteStatus } from "./getRouteStatus";
// utils
import {
  mockReportJson,
  mockSARFullReport,
  mockSARReportRoutesForStatus,
  mockWPFullReport,
  mockWPReportWithOverlays,
} from "utils/testing/setupJest";
import { getWPAlertStatus } from "components/alerts/getWPAlertStatus";
import { getInitiativeStatus } from "components/tables/getEntityStatus";
import {
  EntityStatuses,
  OverlayModalTypes,
  ReportFormFieldType,
  ReportRoute,
  ValidationType,
} from "types";

jest.mock("components/alerts/getWPAlertStatus");
jest.mock("components/tables/getEntityStatus");

describe("utils/getRouteStatus", () => {
  describe("getRouteStatus()", () => {
    test("Should return a valid status map for every route in the form other than review and submit", () => {
      const report = mockWPFullReport;
      const statusMap = getRouteStatus(report);
      expect(statusMap).toEqual([
        {
          name: "mock-route-1",
          path: "/mock/mock-route-1",
          status: true,
        },
        {
          name: "mock-route-2",
          path: "/mock/mock-route-2",
          children: [
            {
              name: "mock-route-2a",
              path: "/mock/mock-route-2a",
              status: false,
            },
            {
              name: "mock-route-2b",
              path: "/mock/mock-route-2b",
              status: true,
            },
            {
              name: "mock-route-2c",
              path: "/mock/mock-route-2c",
              status: true,
            },
            {
              name: "mock-route-2c-entitySteps",
              path: "/mock/mock-route-2c-entitySteps",
              status: undefined,
            },
            {
              name: "mock-route-2e",
              path: "/mock/mock-route-2e",
              status: undefined,
            },
          ],
        },
      ]);
    });

    test("Should return an empty array if there is no completionStatus from the API", () => {
      const { completionStatus, ...mockReportWithNoCompletionStatus } =
        mockWPFullReport;
      const statusMap = getRouteStatus(mockReportWithNoCompletionStatus);
      expect(completionStatus).toEqual(mockWPFullReport.completionStatus);
      expect(statusMap).toEqual([]);
    });

    describe("checkAlertOrUndefinedStatus()", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      describe("initiativeV1", () => {
        const report = {
          ...mockWPReportWithOverlays,
          completionStatus: {
            "/wp/state-or-territory-specific-initiatives/initiatives": true,
          },
        };
        test("returns alert status", () => {
          (getWPAlertStatus as jest.Mock).mockReturnValue(true);
          const statusMap = getRouteStatus(report);
          expect(statusMap).toEqual([
            {
              children: [
                {
                  path: "/wp/state-or-territory-specific-initiatives/initiatives",
                  status: false,
                },
              ],
              name: "mock-initiatives-route",
              path: "/wp/state-or-territory-specific-initiatives",
            },
          ]);
        });

        test("returns true completion status", () => {
          (getWPAlertStatus as jest.Mock).mockReturnValue(false);
          const statusMap = getRouteStatus(report);
          expect(statusMap).toEqual([
            {
              children: [
                {
                  path: "/wp/state-or-territory-specific-initiatives/initiatives",
                  status: true,
                },
              ],
              name: "mock-initiatives-route",
              path: "/wp/state-or-territory-specific-initiatives",
            },
          ]);
        });

        test("returns false completion status", () => {
          (getWPAlertStatus as jest.Mock).mockReturnValue(false);
          const report = {
            ...mockWPReportWithOverlays,
            completionStatus: {
              "/wp/state-or-territory-specific-initiatives/initiatives": false,
            },
          };
          const statusMap = getRouteStatus(report);
          expect(statusMap).toEqual([
            {
              children: [
                {
                  path: "/wp/state-or-territory-specific-initiatives/initiatives",
                  status: false,
                },
              ],
              name: "mock-initiatives-route",
              path: "/wp/state-or-territory-specific-initiatives",
            },
          ]);
        });
      });

      describe("initiativeV2", () => {
        const report = {
          ...mockWPReportWithOverlays,
          formTemplate: {
            ...mockWPFullReport.formTemplate,
            routes: [
              {
                name: "mock-initiatives-route",
                path: "/wp/state-or-territory-specific-initiatives",
                children: [
                  {
                    path: "/wp/state-or-territory-specific-initiatives/initiatives",
                    entityType: OverlayModalTypes.INITIATIVE,
                    overlayForm: {
                      fields: [
                        {
                          id: "mockFieldId",
                          type: ReportFormFieldType.TEXT,
                          validation: ValidationType.TEXT,
                        },
                      ],
                    },
                  },
                ],
              } as ReportRoute,
            ],
          },
          completionStatus: {
            "/wp/state-or-territory-specific-initiatives/initiatives": false,
          },
        };

        test("returns true status", () => {
          (getInitiativeStatus as jest.Mock).mockReturnValue(
            EntityStatuses.COMPLETE
          );
          const statusMap = getRouteStatus(report);
          expect(statusMap).toEqual([
            {
              children: [
                {
                  path: "/wp/state-or-territory-specific-initiatives/initiatives",
                  status: true,
                },
              ],
              name: "mock-initiatives-route",
              path: "/wp/state-or-territory-specific-initiatives",
            },
          ]);
        });

        test("returns false status", () => {
          (getInitiativeStatus as jest.Mock).mockReturnValue(
            EntityStatuses.INCOMPLETE
          );
          const statusMap = getRouteStatus(report);
          expect(statusMap).toEqual([
            {
              children: [
                {
                  path: "/wp/state-or-territory-specific-initiatives/initiatives",
                  status: false,
                },
              ],
              name: "mock-initiatives-route",
              path: "/wp/state-or-territory-specific-initiatives",
            },
          ]);
        });
      });

      test("return undefined status for SAR RET participants", () => {
        const report = {
          ...mockSARFullReport,
          formTemplate: {
            ...mockReportJson,
            routes: mockSARReportRoutesForStatus,
          },
        };
        const statusMap = getRouteStatus(report);
        expect(statusMap).toEqual([
          {
            name: "mock-route-1",
            path: "/mock/mock-route-1",
            status: true,
          },
          {
            name: "mock-route-1",
            path: "/mock/mock-route-1",
            children: [
              {
                name: "mock-sar-ret-hcbs",
                path: "/sar/recruitment-enrollment-transitions/number-of-hcbs-participants-admitted-to-facility-from-community",
                status: undefined,
              },
            ],
          },
        ]);
      });
    });
  });
});
