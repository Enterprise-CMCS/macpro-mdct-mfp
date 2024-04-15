import * as topics from "../libs/topics-lib.js";
import _ from "lodash";

/**
 * String in the format of `--${event.project}--${event.stage}--`
 *
 * Only used for temp branches for easy identification and cleanup.
 */
const namespace = process.env.topicNamespace;
const brokers = process.env.brokerString?.split(",") ?? [];

const condensedTopicList = [
  {
    // topics for the mfp service's connector
    topicPrefix: "aws.mdct.mfp",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [".wp-reports", ".wp-form", ".sar-reports", ".sar-form"],
  },
];

/**
 * Handler triggered on deploy by the serverless js to create known topics in bigmac
 * @param {*} event
 * @param {*} _context
 * @param {*} _callback
 */
exports.handler = async function (event, _context, _callback) {
  console.log("Received event:", JSON.stringify(event, null, 2)); // eslint-disable-line no-console
  var desiredTopicConfigs = [];

  // Generate the complete topic list from the condensed version above.
  for (var element of condensedTopicList) {
    desiredTopicConfigs.push(
      ..._.map(element.topics, (topic) => {
        return {
          topic: `${namespace}${element.topicPrefix}${topic}${element.version}`,
          numPartitions: element.numPartitions,
          replicationFactor: element.replicationFactor,
        };
      })
    );
  }

  await topics.createTopics(brokers, desiredTopicConfigs);
};
