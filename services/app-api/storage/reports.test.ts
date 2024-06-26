// System under test
import {
  queryReportMetadatasForState,
  getReportMetadata,
  getReportFieldData,
  getReportFormTemplate,
  putReportMetadata,
  putReportFieldData,
  putReportFormTemplate,
  putFormTemplateVersion,
  queryFormTemplateVersionByHash,
  queryLatestFormTemplateVersionNumber,
} from "./reports";
// Mocks
import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
// Types
import {
  FormTemplateVersion,
  ReportFieldData,
  ReportJson,
  ReportMetadataShape,
  ReportType,
} from "../utils/types";

const mockDynamo = mockClient(DynamoDBDocumentClient);
const mockS3 = mockClient(S3Client);

const mockReportMetadata = {
  reportType: ReportType.WP,
  state: "CO",
  id: "abc",
  fieldDataId: "def",
  formTemplateId: "ghi",
} as ReportMetadataShape;

const mockReportFieldData = {
  mockFieldId: "mockFieldValue",
} as ReportFieldData;

const mockReportFormTemplate = {
  routes: [
    {
      form: {
        fields: [
          {
            id: "mockFieldId",
            validation: "text",
          },
        ],
      },
    },
  ],
} as ReportJson;

const mockFormTemplateVersion = {
  id: "ghi",
  reportType: ReportType.WP,
  versionNumber: 7,
  md5Hash: "0abc8def",
} as FormTemplateVersion;

describe("Report storage", () => {
  beforeEach(() => {
    mockDynamo.reset();
    mockS3.reset();
  });

  it("Should call Dynamo to put report metadata for a state", async () => {
    const mockPut = jest.fn();
    mockDynamo.on(PutCommand).callsFake(mockPut);
    await putReportMetadata(mockReportMetadata);
    expect(mockPut).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: "local-wp-reports",
        Item: mockReportMetadata,
      }),
      expect.any(Function)
    );
  });

  it("Should call Dynamo to query report metadata for a state", async () => {
    const mockQuery = jest.fn().mockResolvedValue({
      Items: [mockReportMetadata],
      LastEvaluatedKey: undefined,
    });
    mockDynamo.on(QueryCommand).callsFake(mockQuery);
    const metadatas = await queryReportMetadatasForState(ReportType.WP, "CO");
    expect(metadatas).toEqual([mockReportMetadata]);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: "local-wp-reports",
        ExpressionAttributeValues: { ":state": "CO" },
      }),
      expect.any(Function)
    );
  });

  it("Should call Dynamo to get metadata for a specific report", async () => {
    const mockGet = jest.fn().mockResolvedValue({
      Item: mockReportMetadata,
    });
    mockDynamo.on(GetCommand).callsFake(mockGet);
    const metadata = await getReportMetadata(ReportType.WP, "CO", "abc123");
    expect(metadata).toBe(mockReportMetadata);
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: "local-wp-reports",
        Key: { state: "CO", id: "abc123" },
      }),
      expect.any(Function)
    );
  });

  it("Should call S3 to store report field data", async () => {
    const mockPut = jest.fn();
    mockS3.on(PutObjectCommand).callsFake(mockPut);
    await putReportFieldData(mockReportMetadata, mockReportFieldData);
    expect(mockPut).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: "database-local-wp",
        Key: "fieldData/CO/def.json",
        Body: JSON.stringify(mockReportFieldData),
      }),
      expect.any(Function)
    );
  });

  it("Should call S3 to retrieve report field data", async () => {
    const mockGet = jest.fn().mockResolvedValue({
      Body: {
        transformToString: jest
          .fn()
          .mockResolvedValue(JSON.stringify(mockReportFieldData)),
      },
    });
    mockS3.on(GetObjectCommand).callsFake(mockGet);
    const fieldData = await getReportFieldData(mockReportMetadata);
    expect(fieldData).toEqual(mockReportFieldData);
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: "database-local-wp",
        Key: "fieldData/CO/def.json",
      }),
      expect.any(Function)
    );
  });

  it("Should call S3 to store report form templates", async () => {
    const mockPut = jest.fn();
    mockS3.on(PutObjectCommand).callsFake(mockPut);
    await putReportFormTemplate(mockReportMetadata, mockReportFormTemplate);
    expect(mockPut).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: "database-local-wp",
        Key: "formTemplates/ghi.json",
        Body: JSON.stringify(mockReportFormTemplate),
      }),
      expect.any(Function)
    );
  });

  it("Should call S3 to retrieve report form templates", async () => {
    const mockGet = jest.fn().mockResolvedValue({
      Body: {
        transformToString: jest
          .fn()
          .mockResolvedValue(JSON.stringify(mockReportFormTemplate)),
      },
    });
    mockS3.on(GetObjectCommand).callsFake(mockGet);
    const formTemplate = await getReportFormTemplate(mockReportMetadata);
    expect(formTemplate).toEqual(mockReportFormTemplate);
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: "database-local-wp",
        Key: "formTemplates/ghi.json",
      }),
      expect.any(Function)
    );
  });

  it("Should call Dynamo to store form template version info", async () => {
    const mockPut = jest.fn();
    mockDynamo.on(PutCommand).callsFake(mockPut);
    await putFormTemplateVersion(mockFormTemplateVersion);
    expect(mockPut).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: "local-form-template-versions",
        Item: mockFormTemplateVersion,
      }),
      expect.any(Function)
    );
  });

  it("Should call Dynamo to query form template versions by hash", async () => {
    const mockQuery = jest
      .fn()
      .mockResolvedValue({ Items: [mockFormTemplateVersion] });
    mockDynamo.on(QueryCommand).callsFake(mockQuery);

    const versionInfo = await queryFormTemplateVersionByHash(
      ReportType.WP,
      mockFormTemplateVersion.md5Hash
    );

    expect(versionInfo).toBe(mockFormTemplateVersion);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: "local-form-template-versions",
        ExpressionAttributeValues: {
          ":reportType": "WP",
          ":md5Hash": "0abc8def",
        },
        Limit: 1,
      }),
      expect.any(Function)
    );
  });

  it("Should call Dynamo to query form template version numbers", async () => {
    const mockQuery = jest
      .fn()
      .mockResolvedValue({ Items: [mockFormTemplateVersion] });
    mockDynamo.on(QueryCommand).callsFake(mockQuery);

    const versionNumber = await queryLatestFormTemplateVersionNumber(
      ReportType.WP
    );

    expect(versionNumber).toBe(7);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: "local-form-template-versions",
        ExpressionAttributeValues: { ":reportType": "WP" },
        Limit: 1,
        ScanIndexForward: false,
      }),
      expect.any(Function)
    );
  });

  it("Should default to version 0 if there are no existing form templates", async () => {
    const mockQuery = jest.fn().mockResolvedValue({ Items: [] });
    mockDynamo.on(QueryCommand).callsFake(mockQuery);
    const versionNumber = await queryLatestFormTemplateVersionNumber(
      ReportType.WP
    );
    expect(versionNumber).toBe(0);
  });
});
