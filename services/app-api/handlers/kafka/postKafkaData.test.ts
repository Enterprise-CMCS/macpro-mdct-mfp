import { handler } from "./postKafkaData";
import { Kafka } from "kafkajs";
import { mockClient } from "aws-sdk-client-mock";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

jest.spyOn(console, "debug").mockImplementation(jest.fn());
jest.spyOn(console, "info").mockImplementation(jest.fn());
jest.spyOn(console, "warn").mockImplementation(jest.fn());
jest.spyOn(console, "error").mockImplementation(jest.fn());

jest.mock("kafkajs", () => ({
  Kafka: jest.fn().mockReturnValue({
    producer: jest.fn().mockReturnValue({
      disconnect: jest.fn().mockResolvedValue(undefined),
      connect: jest.fn().mockResolvedValue(undefined),
      sendBatch: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
    }),
  }),
}));
const mockConnect = (Kafka as Function)().producer().connect;
const mockSendBatch = (Kafka as Function)().producer().sendBatch;
const mockDisconnect = (Kafka as Function)().producer().disconnect;
const mockOn = (Kafka as Function)().producer().on;

const mockS3Client = mockClient(S3Client);
const mockS3Get = jest.fn();
mockS3Client.on(GetObjectCommand).callsFake(mockS3Get);

const wpFieldDataRecord = {
  eventSourceARN: "aaa/local-wp-reports/bbb",
  eventID: "eid-123",
  eventName: "en-123",
  dynamodb: {
    Keys: {
      state: { S: "CO" },
      id: { S: "report123" },
    },
    NewImage: {
      state: { S: "CO" },
      id: { S: "report123" },
      status: { S: "In progress" },
    },
    OldImage: {
      state: { S: "CO" },
      id: { S: "report123" },
      status: { S: "Not started" },
    },
  },
} as any;

const wpFormTemplateRecord = {
  eventName: "ObjectCreated",
  eventTime: "2026-04-13T13:46:26.882Z",
  s3: {
    bucket: {
      arn: "aaa/database-local-wp/bbb",
      name: "database-local-wp",
    },
    object: {
      key: "formTemplates/ft123.json",
    },
  },
} as any;

const wpFormTemplate = { mock: "wpTemplate" };
mockS3Get.mockResolvedValue({
  Body: {
    transformToString: jest
      .fn()
      .mockResolvedValue(JSON.stringify(wpFormTemplate)),
  },
});

describe("Kafka message sending", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should convert AWS Dynamo Stream Events to Kafka Messages", async () => {
    const event = { Records: [wpFieldDataRecord] };

    // kafkalib.ts calls producer.connect() only once.
    // Reload the file to make sure we capture that call in this test.
    // Otherwise, assertions on producer.connect() would rely on test order.
    jest.resetModules();
    expect(mockConnect).not.toHaveBeenCalled();

    await handler(event);

    expect(Kafka).toHaveBeenCalledWith({
      clientId: "mfp-local",
      brokers: ["broker1", "broker2"],
      retry: { initialRetryTime: 300, retries: 8 },
      ssl: { rejectUnauthorized: false },
    });
    expect(mockConnect).toHaveBeenCalled();

    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        {
          topic: "aws.mdct.mfp.wp-reports.v0",
          messages: [
            {
              headers: {
                eventID: "eid-123",
                eventName: "en-123",
              },
              key: "CO#report123",
              partition: 0,
              value: JSON.stringify({
                NewImage: {
                  state: "CO",
                  id: "report123",
                  status: "In progress",
                },
                OldImage: {
                  state: "CO",
                  id: "report123",
                  status: "Not started",
                },
                Keys: {
                  state: "CO",
                  id: "report123",
                },
              }),
            },
          ],
        },
      ],
    });
  });

  it("should successfully process events for newly-created records", async () => {
    const record = structuredClone(wpFieldDataRecord);
    delete (record.dynamodb as any).OldImage;
    const event = { Records: [record] };
    await handler(event);
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        {
          topic: "aws.mdct.mfp.wp-reports.v0",
          messages: [
            {
              headers: {
                eventID: "eid-123",
                eventName: "en-123",
              },
              key: "CO#report123",
              partition: 0,
              value: JSON.stringify({
                NewImage: {
                  state: "CO",
                  id: "report123",
                  status: "In progress",
                },
                OldImage: {},
                Keys: {
                  state: "CO",
                  id: "report123",
                },
              }),
            },
          ],
        },
      ],
    });
  });

  it("should ignore events from tables with no associated topic", async () => {
    const record = structuredClone(wpFieldDataRecord);
    record.eventSourceARN = "aaa/local-unknown-table/bbb";
    const event = { Records: [record] };
    await handler(event);
    expect(mockSendBatch).not.toHaveBeenCalled();
  });

  it("should group messages by topic", async () => {
    const wpRecord2 = structuredClone(wpFieldDataRecord);
    wpRecord2.dynamodb.Keys.id.S = "report234";

    const sarRecord = structuredClone(wpFieldDataRecord);
    sarRecord.eventSourceARN = "aaa/local-sar-reports/bbb";
    sarRecord.dynamodb.Keys.id.S = "report456";

    const event = { Records: [wpFieldDataRecord, wpRecord2, sarRecord] };
    await handler(event);

    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        {
          topic: "aws.mdct.mfp.wp-reports.v0",
          messages: [
            expect.objectContaining({ key: "CO#report123" }),
            expect.objectContaining({ key: "CO#report234" }),
          ],
        },
        {
          topic: "aws.mdct.mfp.sar-reports.v0",
          messages: [expect.objectContaining({ key: "CO#report456" })],
        },
      ],
    });
  });

  it("should recognize all dynamo-related topics", async () => {
    const tables = ["wp-reports", "sar-reports"];
    const event = {
      Records: tables.map(
        (table) =>
          ({
            eventSourceARN: `asdf/local-${table}/qwer`,
            dynamodb: {
              Keys: { foo: { S: "bar" } },
              NewImage: { foo: { S: "bar" } },
            },
          }) as any
      ),
    };
    await handler(event);
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: tables.map((table) =>
        expect.objectContaining({ topic: `aws.mdct.mfp.${table}.v0` })
      ),
    });
  });

  it("should convert AWS S3 Stream Events to Kafka Messages", async () => {
    const event = { Records: [wpFormTemplateRecord] };
    await handler(event);
    expect(mockS3Get).toHaveBeenCalledWith(
      {
        Bucket: "database-local-wp",
        Key: "formTemplates/ft123.json",
      },
      expect.any(Function)
    );
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        {
          topic: "aws.mdct.mfp.wp-form-template.v0",
          messages: [
            {
              headers: {
                eventName: "ObjectCreated",
                eventTime: "2026-04-13T13:46:26.882Z",
              },
              key: "formTemplates/ft123.json",
              partition: 0,
              value: JSON.stringify(wpFormTemplate),
            },
          ],
        },
      ],
    });
  });

  it("should not attempt to fetch deleted S3 objects", async () => {
    const record = structuredClone(wpFormTemplateRecord);
    record.eventName = "ObjectRemoved";
    const event = { Records: [record] };
    await handler(event);
    expect(mockS3Get).not.toHaveBeenCalled();
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: [
        {
          topic: "aws.mdct.mfp.wp-form-template.v0",
          messages: [expect.objectContaining({ value: "" })],
        },
      ],
    });
  });

  it("should ignore events from buckets with no associated topic", async () => {
    const record = structuredClone(wpFormTemplateRecord);
    record.s3.bucket.name = "unknown-bucket";
    const event = { Records: [record] };
    await handler(event);
    expect(mockS3Get).not.toHaveBeenCalled();
    expect(mockSendBatch).not.toHaveBeenCalled();
  });

  it("should recognize all s3-related topics", async () => {
    const expectations = [
      {
        bucket: "database-local-wp",
        folder: "fieldData",
        topic: "wp-form",
      },
      {
        bucket: "database-local-wp",
        folder: "formTemplates",
        topic: "wp-form-template",
      },
      {
        bucket: "database-local-sar",
        folder: "fieldData",
        topic: "sar-form",
      },
      {
        bucket: "database-local-sar",
        folder: "formTemplates",
        topic: "sar-form-template",
      },
    ];

    const event = {
      Records: expectations.map(({ bucket, folder }) => {
        const record = structuredClone(wpFormTemplateRecord);
        record.s3.bucket.name = bucket;
        record.s3.object.key = `${folder}/obj.json`;
        return record;
      }),
    };
    await handler(event);

    expect(mockS3Get).toHaveBeenCalledTimes(expectations.length);
    expect(mockSendBatch).toHaveBeenCalledWith({
      topicMessages: expectations.map(({ topic }) =>
        expect.objectContaining({
          topic: `aws.mdct.mfp.${topic}.v0`,
        })
      ),
    });
  });

  it("should ignore events for non-JSON files", async () => {
    const record = structuredClone(wpFormTemplateRecord);
    record.s3.object.key = record.s3.object.key.replace(".json", ".csv");
    const event = { Records: [record] };
    await handler(event);
    expect(mockS3Get).not.toHaveBeenCalled();
    expect(mockSendBatch).not.toHaveBeenCalled();
  });

  it("should ignore events with unknown S3 prefixes", async () => {
    const record = structuredClone(wpFormTemplateRecord);
    record.s3.object.key = record.s3.object.key.replace(
      "formTemplates/",
      "elsewhere/"
    );
    const event = { Records: [record] };
    await handler(event);
    expect(mockS3Get).not.toHaveBeenCalled();
    expect(mockSendBatch).not.toHaveBeenCalled();
  });

  it("should fail if the S3 object does not exist", async () => {
    mockS3Get.mockResolvedValueOnce({});
    const event = { Records: [wpFormTemplateRecord] };
    await expect(() => handler(event)).rejects.toThrow("Failed to fetch");
  });

  it("should fail if the S3 fetch fails", async () => {
    mockS3Get.mockImplementationOnce(() => {
      throw new Error("mock s3 error");
    });
    const event = { Records: [wpFormTemplateRecord] };
    await expect(() => handler(event)).rejects.toThrow("mock s3 error");
  });

  it("should ignore empty events", async () => {
    await handler({});
    expect(mockSendBatch).not.toHaveBeenCalled();
  });

  it("should ignore events from unknown sources", async () => {
    const nonDynamoNonS3Record = {} as any;
    await handler({ Records: [nonDynamoNonS3Record] });
    expect(mockSendBatch).not.toHaveBeenCalled();
  });

  describe("when environment variables are not typical", () => {
    let originalEnv: any;

    beforeEach(() => {
      const keys = ["brokerString", "STAGE", "topicNamespace"];
      originalEnv = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
      jest.resetModules();
      jest.clearAllMocks();
    });

    afterEach(() => {
      for (let [key, value] of Object.entries(originalEnv)) {
        process.env[key] = value as string;
      }
    });

    it("should ignore all events when running in localstack", async () => {
      process.env.brokerString = "localstack";
      const event = { Records: [wpFieldDataRecord] };
      await handler(event);
      expect(mockSendBatch).not.toHaveBeenCalled();
    });

    it("should error immediately if brokerString is missing", async () => {
      delete process.env.brokerString;
      const event = { Records: [wpFieldDataRecord] };
      await expect(() => handler(event)).rejects.toThrow("Missing config");
      expect(mockSendBatch).not.toHaveBeenCalled();
    });

    it("should error immediately if STAGE is missing", async () => {
      delete process.env.STAGE;
      const event = { Records: [wpFieldDataRecord] };
      await expect(() => handler(event)).rejects.toThrow("Missing config");
      expect(mockSendBatch).not.toHaveBeenCalled();
    });

    it("should respect topic namespace for dynamo events", async () => {
      process.env.topicNamespace = "--mfp--my-branch--";
      const event = { Records: [wpFieldDataRecord] };
      await handler(event);
      expect(mockSendBatch).toHaveBeenCalledWith(
        expect.objectContaining({
          topicMessages: [
            expect.objectContaining({
              topic: "--mfp--my-branch--aws.mdct.mfp.wp-reports.v0",
            }),
          ],
        })
      );
    });

    it("should respect topic namespace for s3 events", async () => {
      process.env.topicNamespace = "--mfp--my-branch--";
      const event = { Records: [wpFormTemplateRecord] };
      await handler(event);
      expect(mockSendBatch).toHaveBeenCalledWith(
        expect.objectContaining({
          topicMessages: [
            expect.objectContaining({
              topic: "--mfp--my-branch--aws.mdct.mfp.wp-form-template.v0",
            }),
          ],
        })
      );
    });
  });

  it("should disconnect the kafka producer before exiting", async () => {
    const event = { Records: [wpFieldDataRecord] };

    await handler(event);
    expect(mockSendBatch).toHaveBeenCalled();
    expect(mockDisconnect).not.toHaveBeenCalled();

    process.emit("beforeExit", 0);
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it.skip("should connect only as needed", async () => {
    // Delay connect to ensure the two calls will be in progress simultaneously
    const delay = () => new Promise((res) => setTimeout(res, 200));
    mockConnect.mockImplementationOnce(delay).mockImplementationOnce(delay);
    const event = { Records: [wpFieldDataRecord] };

    jest.resetModules();
    expect(mockConnect).not.toHaveBeenCalled();

    // Kick off both calls at once
    await Promise.all([handler(event), handler(event)]);

    // The first event starts a connection; the second event awaits it.
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it("should reconnect as needed", async () => {
    const event = { Records: [wpFieldDataRecord] };

    jest.resetModules();
    expect(mockOn).not.toHaveBeenCalled();
    expect(mockConnect).not.toHaveBeenCalled();

    await handler(event);
    await handler(event);

    // The first event makes the connection; the second event reuses it.
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockOn).toHaveBeenCalledWith(
      "producer.disconnect",
      expect.any(Function)
    );
    const disconnectListener = mockOn.mock.calls[0][1];

    // The other end disconnects. A Kafka server error, say.
    await disconnectListener("mock disconnect reason");
    await handler(event);

    // The third event establishes a new connection.
    expect(mockConnect).toHaveBeenCalledTimes(2);
  });
});
