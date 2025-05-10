import { Construct } from "constructs";
import { aws_dynamodb as dynamodb, aws_s3 as s3 } from "aws-cdk-lib";
import { DynamoDBTable } from "../../constructs/dynamodb-table";

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
}

export function createDataComponents(props: CreateDataComponentsProps) {
  const { scope, stage, isDev } = props;

  new DynamoDBTable(scope, "Banner", {
    stage,
    isDev,
    name: "banners",
    partitionKey: { name: "key", type: dynamodb.AttributeType.STRING },
  });

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
  });

  new DynamoDBTable(scope, "SarReports", {
    stage,
    isDev,
    name: "sar-reports",
    partitionKey: { name: "state", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
  });

  new DynamoDBTable(scope, "WpReports", {
    stage,
    isDev,
    name: "wp-reports",
    partitionKey: { name: "state", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
  });

  new s3.Bucket(scope, "SarFormBucket", {
    bucketName: `database-${stage}-sar`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  });

  new s3.Bucket(scope, "WpFormBucket", {
    bucketName: `database-${stage}-wp`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  });
}
