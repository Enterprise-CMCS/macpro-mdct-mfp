import { Construct } from "constructs";
import {
  aws_s3 as s3,
  aws_lambda as lambda,
  aws_lambda_event_sources as lambdaEventSources,
  aws_s3_notifications as s3notifications,
  aws_iam as iam,
  aws_events as events,
  aws_events_targets as eventstargets,
  Duration,
  RemovalPolicy,
  Tags,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda";
import { addIamPropertiesToBucketRole } from "../utils/s3";

interface createUploadsComponentsProps {
  scope: Construct;
  stage: string;
  iamPermissionsBoundary: iam.IManagedPolicy;
  iamPath: string;
}

export function createUploadsComponents(props: createUploadsComponentsProps) {
  const { scope, stage, iamPermissionsBoundary, iamPath } = props;
  const service = "uploads";

  Tags.of(scope).add("SERVICE", service);

  const attachmentsBucket = new s3.Bucket(scope, "AttachmentsBucket", {
    bucketName: `${service}-${stage}-attachments`,
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

  const clamDefsBucket = new s3.Bucket(scope, "ClamDefsBucket", {
    bucketName: `${service}-${stage}-avscan`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    removalPolicy: RemovalPolicy.RETAIN,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  });

  const commonProps = {
    stackName: `${service}-${stage}`,
    additionalPolicies: [
      new iam.PolicyStatement({
        actions: [
          "s3:GetObject",
          "s3:PutObjectTagging",
          "s3:PutObjectVersionTagging",
        ],
        resources: [
          `${attachmentsBucket.bucketArn}/*`,
          `${clamDefsBucket.bucketArn}/*`,
        ],
      }),
    ],
    iamPermissionsBoundary,
    iamPath,
  };

  const clamAvLayer = new lambda.LayerVersion(scope, "ClamAvLayer", {
    code: lambda.Code.fromAsset("services/uploads/lambda_layer.zip"),
    compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
  });

  const avScanLambda = new Lambda(scope, "AvScanLambda", {
    entry: "services/uploads/src/antivirus.js",
    handler: "lambdaHandleEvent",
    memorySize: 3008,
    timeout: Duration.seconds(300),
    layers: [clamAvLayer],
    environment: {
      CLAMAV_BUCKET_NAME: clamDefsBucket.bucketName,
      PATH_TO_AV_DEFINITIONS: "lambda/s3-antivirus/av-definitions",
    },
    ...commonProps,
  }).lambda;

  attachmentsBucket.addEventNotification(
    s3.EventType.OBJECT_CREATED_PUT,
    new s3notifications.LambdaDestination(avScanLambda)
  );

  addIamPropertiesToBucketRole(
    scope,
    "BucketNotificationsHandler050a0587b7544547bf325f094a3db834/Role/Resource",
    iamPermissionsBoundary.managedPolicyArn,
    iamPath
  );

  const avDownloadDefinitionsLambda = new Lambda(
    scope,
    "AvDownloadDefinitionsLambda",
    {
      entry: "services/uploads/src/download-definitions.js",
      handler: "lambdaHandleEvent",
      memorySize: 3072,
      timeout: Duration.seconds(300),
      layers: [clamAvLayer],
      environment: {
        CLAMAV_BUCKET_NAME: clamDefsBucket.bucketName,
        PATH_TO_AV_DEFINITIONS: "lambda/s3-antivirus/av-definitions",
      },
      ...commonProps,
    }
  ).lambda;

  new events.Rule(scope, `schedule-av-download-definitions`, {
    schedule: events.Schedule.cron({ minute: "15", hour: "1" }),
    targets: [
      new eventstargets.LambdaFunction(avDownloadDefinitionsLambda, {
        retryAttempts: 2,
      }),
    ],
  });

  return {
    attachmentsBucketArn: attachmentsBucket.bucketArn,
    attachmentsBucketName: attachmentsBucket.bucketName,
    clamDefsBucketArn: clamDefsBucket.bucketArn,
    clamDefsBucketName: clamDefsBucket.bucketName,
  };
}
