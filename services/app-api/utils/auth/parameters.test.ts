import { APIGatewayProxyEvent } from "../types";
import {
  parseSpecificReportParameters,
  parseStateReportParameters,
} from "./parameters";

describe("Path parameter parsing", () => {
  describe("Parsing parameters for a specific report", () => {
    it("Should require report type", () => {
      const mockEvent = {
        pathParameters: {
          reportType: undefined,
          state: "CO",
          id: "abc123",
        } as Record<string, string | undefined>,
      } as APIGatewayProxyEvent;
      const { allParamsValid } = parseSpecificReportParameters(mockEvent);
      expect(allParamsValid).toBe(false);
    });

    it("Should require state", () => {
      const mockEvent = {
        pathParameters: {
          reportType: "WP",
          state: undefined,
          id: "abc123",
        } as Record<string, string | undefined>,
      } as APIGatewayProxyEvent;
      const { allParamsValid } = parseSpecificReportParameters(mockEvent);
      expect(allParamsValid).toBe(false);
    });

    it("Should require id", () => {
      const mockEvent = {
        pathParameters: {
          reportType: "WP",
          state: "CO",
          id: undefined,
        } as Record<string, string | undefined>,
      } as APIGatewayProxyEvent;
      const { allParamsValid } = parseSpecificReportParameters(mockEvent);
      expect(allParamsValid).toBe(false);
    });

    it("Should return typed parameters if all are valid", () => {
      const mockEvent = {
        pathParameters: {
          reportType: "WP",
          state: "CO",
          id: "abc123",
        } as Record<string, string | undefined>,
      } as APIGatewayProxyEvent;
      const { allParamsValid, reportType, state, id } =
        parseSpecificReportParameters(mockEvent);
      expect(allParamsValid).toBe(true);
      expect(reportType).toBeDefined();
      expect(state).toBeDefined();
      expect(id).toBeDefined();
    });
  });

  describe("Parsing parameters for reports in a state", () => {
    it("Should require report type", () => {
      const mockEvent = {
        pathParameters: {
          reportType: undefined,
          state: "CO",
        } as Record<string, string | undefined>,
      } as APIGatewayProxyEvent;
      const { allParamsValid } = parseStateReportParameters(mockEvent);
      expect(allParamsValid).toBe(false);
    });

    it("Should require state", () => {
      const mockEvent = {
        pathParameters: {
          reportType: "WP",
          state: undefined,
        } as Record<string, string | undefined>,
      } as APIGatewayProxyEvent;
      const { allParamsValid } = parseStateReportParameters(mockEvent);
      expect(allParamsValid).toBe(false);
    });

    it("Should return typed parameters if all are valid", () => {
      const mockEvent = {
        pathParameters: {
          reportType: "WP",
          state: "CO",
        } as Record<string, string | undefined>,
      } as APIGatewayProxyEvent;
      const { allParamsValid, reportType, state } =
        parseStateReportParameters(mockEvent);
      expect(allParamsValid).toBe(true);
      expect(reportType).toBeDefined();
      expect(state).toBeDefined();
    });
  });
});
