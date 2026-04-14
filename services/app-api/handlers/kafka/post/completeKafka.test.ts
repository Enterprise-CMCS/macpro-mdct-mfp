import * as postKafkaData from "./postKafkaData";
import { Kafka } from "kafkajs";
import { mockClient } from "aws-sdk-client-mock";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const handler = (postKafkaData as any).handler;

jest.spyOn(console, "log").mockImplementation(jest.fn());

jest.mock("kafkajs", () => ({
  Kafka: jest.fn().mockReturnValue({
    producer: jest.fn().mockReturnValue({
      disconnect: jest.fn().mockResolvedValue(undefined),
      connect: jest.fn().mockResolvedValue(undefined),
      sendBatch: jest.fn().mockResolvedValue(undefined),
    }),
  }),
}));
const mockConnect = (Kafka as Function)().producer().connect;
const mockSendBatch = (Kafka as Function)().producer().sendBatch;
const mockDisconnect = (Kafka as Function)().producer().disconnect;

const mockS3Client = mockClient(S3Client);
const mockS3Get = jest.fn();
mockS3Client.on(GetObjectCommand).callsFake(mockS3Get);

// Kafak-source-lib has one-time setup behavior, which we test one time here.
// Input env vars come from setupTests.ts.
expect(Kafka).toHaveBeenCalledWith({
  clientId: "mfp-local",
  brokers: ["broker1", "broker2"],
  retry: { initialRetryTime: 300, retries: 8 },
  ssl: { rejectUnauthorized: false },
});
expect(mockConnect).not.toHaveBeenCalled();

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
};

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
};

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
      Records: tables.map((table) => ({
        eventSourceARN: `asdf/local-${table}/qwer`,
        dynamodb: {
          Keys: { foo: { S: "bar" } },
          NewImage: { foo: { S: "bar" } },
        },
      })),
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
    record.s3.bucket.arn = "asdf/unknown-bucket/qwer";
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
        record.s3.bucket.arn = `foo/${bucket}/bar`;
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

  describe("when in a localstack environment", () => {
    let originalBrokerString: string | undefined;

    beforeAll(() => {
      originalBrokerString = process.env.brokerString;
      process.env.brokerString = "localstack";
    });

    afterAll(() => {
      process.env.brokerString = originalBrokerString;
    });

    it("should not send any messages", async () => {
      const event = {
        Records: [wpFieldDataRecord],
      };
      await handler(event);
      expect(mockSendBatch).not.toHaveBeenCalled();
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
});
