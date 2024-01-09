import { getOrCreateFormTemplate } from "./versioning";
import wp from "../../forms/wp.json";
import sar from "../../forms/sar.json";
import { createHash } from "crypto";
import { ReportType } from "../types";
import { mockDocumentClient } from "../testing/setupJest";
import s3Lib from "../s3/s3-lib";
import dynamodbLib from "../dynamo/dynamodb-lib";

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

describe("Test getOrCreateFormTemplate WP", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should create a new form template if none exist", async () => {
    const expectedFormInformation = {
      type: "WP",
      name: "MFP Work Plan (WP)",
    };

    const currentWPFormHash = createHash("md5")
      .update(JSON.stringify(wp))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-wp-reports",
      ReportType.WP
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual(
      expect.objectContaining(expectedFormInformation)
    );
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentWPFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    const currentWPFormHash = createHash("md5")
      .update(JSON.stringify(wp))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentWPFormHash,
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentWPFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-wp-reports",
      ReportType.WP
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentWPFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    const currentWPFormHash = createHash("md5")
      .update(JSON.stringify(wp))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentWPFormHash + "111111",
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentWPFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-wp-reports",
      ReportType.WP
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentWPFormHash);
  });
});
describe("Test getOrCreateFormTemplate SAR", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should create a new form template if none exist", async () => {
    const expectedFormInformation = {
      type: "SAR",
      name: "MFP Semi-Annual Progress Report (SAR)",
    };

    const currentSARFormHash = createHash("md5")
      .update(JSON.stringify(sar))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-sar-reports",
      ReportType.SAR
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplate).toEqual(
      expect.objectContaining(expectedFormInformation)
    );
    expect(result.formTemplateVersion?.versionNumber).toEqual(1);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentSARFormHash);
  });

  it("should return the right form and formTemplateVersion if it matches the most recent form", async () => {
    const currentSARFormHash = createHash("md5")
      .update(JSON.stringify(sar))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentSARFormHash,
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentSARFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-sar-reports",
      ReportType.SAR
    );
    expect(dynamoPutSpy).not.toHaveBeenCalled();
    expect(s3PutSpy).not.toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(3);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentSARFormHash);
  });

  it("should create a new form if it doesn't match the most recent form", async () => {
    const currentSARFormHash = createHash("md5")
      .update(JSON.stringify(sar))
      .digest("hex");
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentSARFormHash + "111111",
          versionNumber: 3,
        },
        {
          formTemplateId: "foo",
          id: "mockReportJson",
          md5Hash: currentSARFormHash + "111",
          versionNumber: 2,
        },
      ],
    });
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    const result = await getOrCreateFormTemplate(
      "local-sar-reports",
      ReportType.SAR
    );
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(s3PutSpy).toHaveBeenCalled();
    expect(result.formTemplateVersion?.versionNumber).toEqual(4);
    expect(result.formTemplateVersion?.md5Hash).toEqual(currentSARFormHash);
  });
});
