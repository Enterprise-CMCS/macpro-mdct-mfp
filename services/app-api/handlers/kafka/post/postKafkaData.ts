import {
  bucketTopics,
  reportBuckets,
  reportTables,
  tableTopics,
} from "../../../utils/constants/constants";
import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

const topicPrefix = "aws.mdct.mfp";
const version = "v0";
const tables = [
  { sourceName: reportTables.WP, topicName: tableTopics.WP },
  { sourceName: reportTables.SAR, topicName: tableTopics.SAR },
];

const buckets = [
  {
    sourceName: reportBuckets.WP,
    topicName: bucketTopics.WP,
    s3Prefix: "fieldData/",
  },
  {
    sourceName: reportBuckets.WP,
    topicName: bucketTopics.WP_TEMPLATE,
    s3Prefix: "formTemplates/",
  },
  {
    sourceName: reportBuckets.SAR,
    topicName: bucketTopics.SAR,
    s3Prefix: "fieldData/",
  },
  {
    sourceName: reportBuckets.SAR,
    topicName: bucketTopics.SAR_TEMPLATE,
    s3Prefix: "formTemplates/",
  },
];

const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables, buckets);

exports.handler = postKafkaData.handler.bind(postKafkaData);
