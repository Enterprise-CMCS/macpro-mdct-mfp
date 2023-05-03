export const mockDocumentClient = {
  get: { promise: jest.fn() },
  query: { promise: jest.fn() },
  put: { promise: jest.fn() },
  delete: { promise: jest.fn() },
  scan: { promise: jest.fn() },
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
        copyObject: jest.fn().mockImplementation((_params, callback) => {
          callback(undefined, { ETag: '"mockedEtag"' });
        }),
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
