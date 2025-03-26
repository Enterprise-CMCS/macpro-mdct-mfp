import { Construct } from "constructs";
import { aws_s3 as s3, RemovalPolicy, Tags, Aws } from "aws-cdk-lib";

interface createUploadsComponentsProps {
  scope: Construct;
  stage: string;
}

export function createUploadsComponents(props: createUploadsComponentsProps) {
  const { scope, stage } = props;

  const attachmentsBucket = new s3.Bucket(scope, "AttachmentsBucket", {
    bucketName: `uploads-${stage}-attachments-${Aws.ACCOUNT_ID}`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    removalPolicy: RemovalPolicy.RETAIN,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    cors: [
      {
        allowedOrigins: ["*"],
        allowedMethods: [
          s3.HttpMethods.GET,
          s3.HttpMethods.PUT,
          s3.HttpMethods.POST,
          s3.HttpMethods.DELETE,
          s3.HttpMethods.HEAD,
        ],
        allowedHeaders: ["*"],
        exposedHeaders: ["ETag"],
        maxAge: 3000,
      },
    ],
  });

  Tags.of(attachmentsBucket).add("SERVICE", "uploads");
}
