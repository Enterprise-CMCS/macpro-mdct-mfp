import { mockReportJson } from "./mocks/mockReport";

export const mockDocumentClient = {
  get: { promise: jest.fn() },
  query: { promise: jest.fn() },
  put: { promise: jest.fn() },
  delete: { promise: jest.fn() },
  scan: { promise: jest.fn() },
  scanAll: { promise: jest.fn() },
};
jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => {
        return {
          get: () => mockDocumentClient.get,
          query: () => mockDocumentClient.query,
          put: () => mockDocumentClient.put,
          delete: () => mockDocumentClient.delete,
          scan: () => mockDocumentClient.scan,
          scanAll: () => mockDocumentClient.scanAll,
        };
      }),
      Converter: {
        unmarshall: (s: any) => s,
      },
    },
    S3: jest.fn().mockImplementation((_config) => {
      return {
        putObject: jest.fn((_params: any, callback: any) => {
          callback(undefined, { ETag: '"mockedEtag"' });
        }),
        getObject: jest.fn().mockImplementation((_params, callback) => {
          if (_params.Key.includes("mockReportFieldData"))
            callback(undefined, { Body: JSON.stringify(mockReportFieldData) });
          else if (_params.Key.includes("mockReportJson"))
            callback(undefined, { Body: JSON.stringify(mockReportJson) });
          else callback("Invalid Test Key");
        }),
        copyObject: jest.fn().mockImplementation((_params, callback) => {
          callback(undefined, { ETag: '"mockedEtag"' });
        }),
        listObjects: jest.fn(),
      };
    }),
    Credentials: jest.fn().mockImplementation(() => {
      return {
        accessKeyId: "LOCAL_FAKE_KEY", // pragma: allowlist secret
        secretAccessKey: "LOCAL_FAKE_SECRET", // pragma: allowlist secret
      };
    }),
    Endpoint: jest.fn().mockImplementation(() => "endPoint"),
  };
});

export const mockReportFieldData = {
  text: "text-input",
  number: 0,
};

// DYNAMO
export * from "./mocks/mockDynamo";
// FORM
export * from "./mocks/mockForm";
// Report
export * from "./mocks/mockReport";
