export default [
  {
    topicPrefix: "aws.mdct.mfp",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [".wp-reports", ".wp-form", ".sar-reports", ".sar-form"],
  },
];
