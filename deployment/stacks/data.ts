import { Construct } from "constructs";
import {
  aws_dynamodb as dynamodb,
  aws_iam as iam,
  aws_s3 as s3,
  CfnOutput,
  Aws,
} from "aws-cdk-lib";
import { DynamoDBTable } from "../constructs/dynamodb-table";
import { IManagedPolicy } from "aws-cdk-lib/aws-iam";

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
  iamPermissionsBoundary: IManagedPolicy;
  iamPath: string;
  customResourceRole: iam.Role;
}

// TODO: check table configs
// TODO: check bucket logging configs

export function createDataComponents(props: CreateDataComponentsProps) {
  const {
    scope,
    stage,
    isDev,
    iamPermissionsBoundary,
    iamPath,
    customResourceRole,
  } = props;

  const tables = [
    new DynamoDBTable(scope, "Banner", {
      stage,
      isDev,
      name: "banners",
      partitionKey: { name: "key", type: dynamodb.AttributeType.STRING },
    }).identifiers,
    new DynamoDBTable(scope, "FormTemplateVersions", {
      stage,
      isDev,
      name: "form-template-versions",
      partitionKey: { name: "reportType", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "versionNumber", type: dynamodb.AttributeType.NUMBER },
      lsi: [
        {
          indexName: "LastAlteredIndex",
          sortKey: { name: "lastAltered", type: dynamodb.AttributeType.STRING },
        },
        {
          indexName: "IdIndex",
          sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
        },
        {
          indexName: "HashIndex",
          sortKey: { name: "md5Hash", type: dynamodb.AttributeType.STRING },
        },
      ],
    }).identifiers,
    new DynamoDBTable(scope, "SarReports", {
      stage,
      isDev,
      name: "sar-reports",
      partitionKey: { name: "state", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
    }).identifiers,
    new DynamoDBTable(scope, "WpReports", {
      stage,
      isDev,
      name: "wp-reports",
      partitionKey: { name: "state", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
    }).identifiers,
  ];

  const loggingBucket = s3.Bucket.fromBucketName(
    scope,
    "LoggingBucket",
    `cms-cloud-${Aws.ACCOUNT_ID}-us-east-1`
  );

  // TODO: confirm how end-users upload to this bucket and test with this deployed version
  const sarFormBucket = new s3.Bucket(scope, "SarFormBucket", {
    bucketName: `database-${stage}-sar`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    serverAccessLogsBucket: loggingBucket,
    serverAccessLogsPrefix: `AWSLogs/${Aws.ACCOUNT_ID}/s3/`,
    enforceSSL: true,
  });

  // TODO: confirm how end-users upload to this bucket and test with this deployed version
  const wpFormBucket = new s3.Bucket(scope, "WpFormBucket", {
    bucketName: `database-${stage}-wp`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    serverAccessLogsBucket: loggingBucket,
    serverAccessLogsPrefix: `AWSLogs/${Aws.ACCOUNT_ID}/s3/`,
    enforceSSL: true,
  });

  new CfnOutput(scope, "SarFormBucketName", {
    value: sarFormBucket.bucketName,
  });
  new CfnOutput(scope, "WpFormBucketName", { value: wpFormBucket.bucketName });

  return { tables, sarFormBucket, wpFormBucket };
}
