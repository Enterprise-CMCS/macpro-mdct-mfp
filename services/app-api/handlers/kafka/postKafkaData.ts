import { GetObjectCommand } from "@aws-sdk/client-s3";
import { reportBuckets } from "../../utils/constants/constants";
import {
  GetDynamoTopic,
  GetKafkaConfig,
  GetS3Object,
  GetS3Topic,
  kafkaHandler,
} from "./kafkaLib";
import { createClient } from "../../storage/s3-lib";

// Kafka rejects messages at 1 MB and above.
const MAX_KAFKA_S3_PAYLOAD_BYTES = 1_000_000;

const getConfig: GetKafkaConfig = () => {
  const { brokerString, STAGE } = process.env;

  if (!brokerString) {
    throw new Error("Missing config! Must specify brokerString");
  } else if (brokerString === "localstack") {
    console.debug("Ignoring event: Localstack should not talk to Kafka");
    return undefined;
  }

  if (!STAGE) {
    throw new Error("Missing config! Must specify STAGE");
  }

  return {
    clientId: `mfp-${STAGE}`,
    brokers: brokerString.split(","),
    retry: {
      initialRetryTime: 300,
      retries: 8,
    },
    ssl: {
      rejectUnauthorized: false,
    },
  };
};

const getDynamoTopic: GetDynamoTopic = (record) => {
  const namespace = process.env.topicNamespace ?? "";
  const tables = ["wp-reports", "sar-reports", "financial-reports"];

  const table = tables.find((t) =>
    record.eventSourceARN.includes(`/${process.env.STAGE}-${t}/`)
  );
  if (!table) {
    console.warn(`Ignoring record: no matching table`);
    return undefined;
  }

  return `${namespace}aws.mdct.mfp.${table}.v0`;
};

const getS3Topic: GetS3Topic = (record) => {
  const namespace = process.env.topicNamespace ?? "";
  const rules = [
    {
      bucket: reportBuckets.WP,
      folder: "fieldData/",
      topic: "wp-form",
    },
    {
      bucket: reportBuckets.WP,
      folder: "formTemplates/",
      topic: "wp-form-template",
    },
    {
      bucket: reportBuckets.SAR,
      folder: "fieldData/",
      topic: "sar-form",
    },
    {
      bucket: reportBuckets.SAR,
      folder: "formTemplates/",
      topic: "sar-form-template",
    },
    {
      bucket: reportBuckets.FINANCIAL_REPORT,
      folder: "fieldData/",
      topic: "financial-form",
    },
    {
      bucket: reportBuckets.FINANCIAL_REPORT,
      folder: "formTemplates/",
      topic: "financial-form-template",
    },
  ];

  const bucket = record.s3.bucket.name;
  const key = record.s3.object.key;
  const matchingRule = rules.find(
    (rule) =>
      bucket === rule.bucket &&
      key.startsWith(rule.folder) &&
      key.endsWith(".json")
  );

  if (!matchingRule) {
    console.warn(`Ignoring record: no matching s3 rule. ${bucket}#${key}`);
    return undefined;
  }

  const objectSize = Number(record.s3.object.size);
  if (Number.isFinite(objectSize) && objectSize >= MAX_KAFKA_S3_PAYLOAD_BYTES) {
    console.warn(
      `Ignoring record: oversized S3 object ${bucket}#${key} (${objectSize} bytes); Kafka rejects 1MB+ messages.`
    );
    return undefined;
  }

  return `${namespace}aws.mdct.mfp.${matchingRule.topic}.v0`;
};

const getS3Object: GetS3Object = async (Bucket, Key) => {
  const client = createClient();
  const response = await client.send(new GetObjectCommand({ Bucket, Key }));
  const obj = await response.Body?.transformToString();
  if (!obj) {
    throw new Error(`Failed to fetch S3 object: ${Bucket}#${Key}`);
  }
  return obj;
};

export const handler = kafkaHandler({
  getConfig,
  getDynamoTopic,
  getS3Topic,
  getS3Object,
});
