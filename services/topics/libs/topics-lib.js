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

  const create = async () => {
    await admin.connect();

    // Fetch topic names from MSK, filtering out __ internal management topic
    const existingTopicNames = _.filter(await admin.listTopics(), function (n) {
      return !n.startsWith("_");
    });

    console.log(
      "Existing topics:",
      JSON.stringify(existingTopicNames, null, 2)
    );

    // Fetch the metadata for those topics from MSK
    const existingTopicConfigs = _.get(
      await admin.fetchTopicMetadata({ topics: existingTopicNames }),
      "topics",
      {}
    );
    console.log(
      "Topics Metadata:",
      JSON.stringify(existingTopicConfigs, null, 2)
    );

    // Any desired topics whose names don't exist in MSK need to be created
    const topicsToCreate = _.differenceWith(
      desiredTopicConfigs,
      existingTopicNames,
      (topicConfig, topic) => _.get(topicConfig, "topic") == topic
    );

    /*
     * Any topics which do exist, but with fewer partitions than desired,
     * need to be updated. Partitions can't be removed, only added.
     */
    const topicsToUpdate = _.intersectionWith(
      desiredTopicConfigs,
      existingTopicConfigs,
      (topicConfig, topicMetadata) =>
        _.get(topicConfig, "topic") == _.get(topicMetadata, "name") &&
        _.get(topicConfig, "numPartitions") >
          _.get(topicMetadata, "partitions", []).length
    );

    // Format the request to update those topics (by creating partitions)
    const partitionsToCreate = _.map(topicsToUpdate, function (topic) {
      return {
        topic: _.get(topic, "topic"),
        count: _.get(topic, "numPartitions"),
      };
    });

    // Format a request to describe existing topics
    const resourcesToDescribe = _.map(existingTopicConfigs, function (topic) {
      return {
        name: _.get(topic, "name"),
        type: _.get(ConfigResourceTypes, "TOPIC"),
      };
    });
    const existingTopicDescriptions =
      resourcesToDescribe.length != 0
        ? await admin.describeConfigs({ resources: resourcesToDescribe })
        : [];

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
    partitionsToCreate.length > 0 &&
      (await admin.createPartitions({ topicPartitions: partitionsToCreate }));

    await admin.disconnect();
  };

  await create();
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
  var topicsToDelete = _.filter(existingTopicNames, function (n) {
    console.log(n);
    return (
      n.startsWith(topicNamespace) ||
      n.startsWith(`_confluent-ksql-${topicNamespace}`)
    );
  });
  console.log(`Deleting topics:  ${topicsToDelete}`);

  await admin.deleteTopics({
    topics: topicsToDelete,
  });
}
