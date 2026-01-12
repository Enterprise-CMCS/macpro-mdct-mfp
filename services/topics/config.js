export default [
  {
    topicPrefix: "aws.mdct.mfp",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [
      ".wp-reports",
      ".wp-form",
      ".wp-form-template",
      ".sar-reports",
      ".sar-form",
      ".sar-form-template",
    ],
  },
];
