/* eslint-disable no-console */
const _ = require("lodash");
import { ConfigResourceTypes, Kafka } from "kafkajs";

/**
 * Generates topics in BigMac given the following
 * @param { string[] } brokers - List of brokers
 * @param {{ topic: string, numPartitions: number, replicationFactor: number }[]}
 *   desiredTopicConfigs - array of topics to create or update.
 *   The `topic` property should include any namespace.
 */
export async function createTopics(brokers, desiredTopicConfigs) {
  const kafka = new Kafka({
    clientId: "admin",
    brokers,
    ssl: true,
  });
  var admin = kafka.admin();
  await admin.connect();

  // Fetch topic names from MSK, filtering out __ internal management topic
  const listTopicResponse = await admin.listTopics();
  const existingTopicNames = listTopicResponse.filter(
    (name) => !name.startsWith("_")
  );

  console.log("Existing topics:", JSON.stringify(existingTopicNames, null, 2));

  // Fetch the metadata for those topics from MSK
  const fetchTopicResponse = await admin.fetchTopicMetadata({
    topics: existingTopicNames,
  });
  const existingTopicConfigs = fetchTopicResponse?.topics;
  console.log(
    "Topics Metadata:",
    JSON.stringify(existingTopicConfigs, null, 2)
  );

  // Any desired topics whose names don't exist in MSK need to be created
  const topicsToCreate = _.differenceWith(
    desiredTopicConfigs,
    existingTopicNames,
    (topicConfig, topic) => topicConfig.topic == topic
  );

  /*
   * Any topics which do exist, but with fewer partitions than desired,
   * need to be updated. Partitions can't be removed, only added.
   */
  const topicsToUpdate = _.intersectionWith(
    desiredTopicConfigs,
    existingTopicConfigs,
    (topicConfig, topicMetadata) =>
      topicConfig.topic == topicMetadata.name &&
      topicConfig.numPartitions > topicMetadata.partitions.length
  );

  // Format the request to update those topics (by creating partitions)
  const partitionsToCreate = topicsToUpdate.map((topic) => ({
    topic: topic.topic,
    count: topic.numPartitions,
  }));

  // Describe existing topics for informational logs
  let existingTopicDescriptions = [];
  if (existingTopicConfigs.length > 0) {
    const resourcesToDescribe = existingTopicConfigs.map((topic) => ({
      name: topic.name,
      type: ConfigResourceTypes.TOPIC,
    }));
    existingTopicDescriptions = await admin.describeConfigs({
      resources: resourcesToDescribe,
    });
  }

  console.log("Topics to Create:", JSON.stringify(topicsToCreate, null, 2));
  console.log("Topics to Update:", JSON.stringify(topicsToUpdate, null, 2));
  console.log(
    "Partitions to Update:",
    JSON.stringify(partitionsToCreate, null, 2)
  );
  console.log(
    "Topic configuration options:",
    JSON.stringify(existingTopicDescriptions, null, 2)
  );

  // Create all the new topics
  await admin.createTopics({ topics: topicsToCreate });

  // Create all the new partitions
  if (partitionsToCreate.length > 0) {
    await admin.createPartitions({ topicPartitions: partitionsToCreate });
  }

  await admin.disconnect();
}

/**
 * Deletes all topics for an ephemeral (`--` prefixed) namespace
 * @param { string[] } brokers - List of brokers
 * @param {string} topicNamespace
 */
export async function deleteTopics(brokers, topicNamespace) {
  if (!topicNamespace.startsWith("--")) {
    throw "ERROR:  The deleteTopics function only operates against topics that begin with --.";
  }

  const kafka = new Kafka({
    clientId: "admin",
    brokers,
    ssl: true,
    requestTimeout: 295000, // 5s short of the lambda function's timeout
  });
  var admin = kafka.admin();

  await admin.connect();

  const existingTopicNames = await admin.listTopics();
  console.log(`All existing topics: ${existingTopicNames}`);
  var topicsToDelete = existingTopicNames.filter(
    existingTopicNames,
    (name) =>
      name.startsWith(topicNamespace) ||
      name.startsWith(`_confluent-ksql-${topicNamespace}`)
  );
  console.log(`Deleting topics:  ${topicsToDelete}`);

  await admin.deleteTopics({
    topics: topicsToDelete,
  });
}
