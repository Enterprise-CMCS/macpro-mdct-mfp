import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  aws_ec2 as ec2,
  aws_events as events,
  aws_events_targets as targets,
  aws_iam as iam,
  aws_logs as logs,
  aws_s3 as s3,
  aws_s3_notifications as s3notifications,
  aws_wafv2 as wafv2,
  Duration,
  RemovalPolicy,
  Tags,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda";
import { WafConstruct } from "../constructs/waf";
import { LambdaDynamoEventSource } from "../constructs/lambda-dynamo-event";
import { DynamoDBTableIdentifiers } from "../constructs/dynamodb-table";
import { isDefined } from "../utils/misc";
import { isLocalStack } from "../local/util";

// TODO: does this need to point to the tsconfig.json file in services/app-api?
// TODO: with seds, table names and streams came from the database stack, confirm that is still happening here.
// TODO: add topicNamespace
// TODO: check function timeouts and memory sizes and environment variables

interface CreateApiComponentsProps {
  scope: Construct;
  stage: string;
  project: string;
  isDev: boolean;
  vpc: ec2.IVpc;
  privateSubnets: ec2.ISubnet[];
  tables: DynamoDBTableIdentifiers[];
  brokerString: string;
  iamPermissionsBoundary: iam.IManagedPolicy;
  iamPath: string;
  // wpFormBucket: s3.IBucket;
  // sarFormBucket: s3.IBucket;
  // templateBucket: s3.IBucket;
}

export function createApiComponents(props: CreateApiComponentsProps) {
  const {
    scope,
    stage,
    project,
    isDev,
    vpc,
    privateSubnets,
    tables,
    brokerString,
    iamPermissionsBoundary,
    iamPath,
    // wpFormBucket, // TODO
    // sarFormBucket, // TODO
    // templateBucket, // TODO
  } = props;

  const service = "app-api";
  Tags.of(scope).add("SERVICE", service);

  const kafkaSecurityGroup = new ec2.SecurityGroup(
    scope,
    "KafkaSecurityGroup",
    {
      vpc,
      description:
        "Security Group for streaming functions. Egress all is set by default.",
      allowAllOutbound: true,
    }
  );

  const logGroup = new logs.LogGroup(scope, "ApiAccessLogs", {
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
  });

  const api = new apigateway.RestApi(scope, "ApiGatewayRestApi", {
    restApiName: `${stage}-app-api`,
    deploy: true,
    cloudWatchRole: false,
    deployOptions: {
      stageName: stage,
      tracingEnabled: true,
      loggingLevel: apigateway.MethodLoggingLevel.INFO,
      dataTraceEnabled: true,
      accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
    },
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
    },
  });

  api.addGatewayResponse("Default4XXResponse", {
    type: apigateway.ResponseType.DEFAULT_4XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers": "'*'",
    },
  });

  api.addGatewayResponse("Default5XXResponse", {
    type: apigateway.ResponseType.DEFAULT_5XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers": "'*'",
    },
  });

  const environment = {
    BOOTSTRAP_BROKER_STRING_TLS: brokerString,
    stage,
    // TEMPLATE_BUCKET: templateBucket.bucketName,
    // WP_FORM_BUCKET: wpFormBucket.bucketName,
    // SAR_FORM_BUCKET: sarFormBucket.bucketName,
    ...Object.fromEntries(
      tables.map((table) => [`${table.id}Table`, table.name])
    ),
  };

  const additionalPolicies = [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:DescribeTable",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
      ],
      resources: tables.map((table) => table.arn),
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:DescribeStream",
        "dynamodb:GetRecords",
        "dynamodb:GetShardIterator",
        "dynamodb:ListShards",
        "dynamodb:ListStreams",
      ],
      resources: tables.map((table) => table.streamArn).filter(isDefined),
    }),
    // new iam.PolicyStatement({
    //   effect: iam.Effect.ALLOW,
    //   actions: ["s3:GetObject", "s3:PutObject", "s3:ListBucket"],
    //   resources: [
    //     templateBucket.bucketArn,
    //     wpFormBucket.bucketArn,
    //     sarFormBucket.bucketArn,
    //     `${wpFormBucket.bucketArn}/fieldData/*`,
    //     `${sarFormBucket.bucketArn}/fieldData/*`,
    //   ],
    // }),
  ];

  const commonProps = {
    brokerString,
    stackName: `${service}-${stage}`,
    api,
    environment,
    additionalPolicies,
    iamPermissionsBoundary,
    iamPath,
  };

  const requestValidator = new apigateway.RequestValidator(scope, `Validator`, {
    requestValidatorName: `${commonProps.stackName} | Validate request body and querystring parameters`,
    restApi: api,
    validateRequestParameters: true,
    validateRequestBody: true,
  });

  new Lambda(scope, "createBanner", {
    entry: "services/app-api/handlers/banners/create.ts",
    handler: "createBanner",
    path: "/banners/{bannerId}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "deleteBanner", {
    entry: "services/app-api/handlers/banners/delete.ts",
    handler: "deleteBanner",
    path: "/banners/{bannerId}",
    method: "DELETE",
    ...commonProps,
  });

  new Lambda(scope, "fetchBanner", {
    entry: "services/app-api/handlers/banners/fetch.ts",
    handler: "fetchBanner",
    path: "/banners/{bannerId}",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "fetchTemplate", {
    entry: "services/app-api/handlers/templates/fetch.ts",
    handler: "fetchTemplate",
    path: "/templates/{templateName}",
    method: "GET",
    requestValidator,
    ...commonProps,
  });

  new Lambda(scope, "archiveReport", {
    entry: "services/app-api/handlers/reports/archive.ts",
    handler: "archiveReport",
    path: "/reports/archive/{reportType}/{state}/{id}",
    method: "PUT",
    ...commonProps,
  });

  new Lambda(scope, "createReport", {
    entry: "services/app-api/handlers/reports/create.ts",
    handler: "createReport",
    path: "/reports/{reportType}/{state}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "fetchReport", {
    entry: "services/app-api/handlers/reports/fetch.ts",
    handler: "fetchReport",
    path: "/reports/{reportType}/{state}/{id}",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "fetchReportsByState", {
    entry: "services/app-api/handlers/reports/fetch.ts",
    handler: "fetchReportsByState",
    path: "/reports/{reportType}/{state}",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "releaseReport", {
    entry: "services/app-api/handlers/reports/release.ts",
    handler: "releaseReport",
    path: "/reports/release/{reportType}/{state}/{id}",
    method: "PUT",
    ...commonProps,
  });

  new Lambda(scope, "submitReport", {
    entry: "services/app-api/handlers/reports/submit.ts",
    handler: "submitReport",
    path: "/reports/submit/{reportType}/{state}/{id}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "updateReport", {
    entry: "services/app-api/handlers/reports/update.ts",
    handler: "updateReport",
    path: "/reports/{reportType}/{state}/{id}",
    method: "PUT",
    ...commonProps,
  });

  new Lambda(scope, "approveReport", {
    entry: "services/app-api/handlers/reports/approve.ts",
    handler: "approveReport",
    path: "/reports/approve/{reportType}/{state}/{id}",
    method: "PUT",
    ...commonProps,
  });

  new LambdaDynamoEventSource(scope, "postKafkaData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    timeout: Duration.seconds(120),
    memorySize: 2048,
    retryAttempts: 2,
    vpc,
    vpcSubnets: { subnets: privateSubnets },
    securityGroups: [kafkaSecurityGroup],
    ...commonProps,
    tables,
  });
  // TODO: confirm only attached to the streams wpReport and sarReport

  const bucketLambdaProps = {
    timeout: Duration.seconds(120),
    memorySize: 2048,
    vpc,
    vpcSubnets: { subnets: privateSubnets },
    securityGroups: [kafkaSecurityGroup],
    ...commonProps,
  };

  const postWpBucketDataLambda = new Lambda(scope, "postWpBucketData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    ...bucketLambdaProps,
  }).lambda;

  // wpFormBucket.addEventNotification(
  //   s3.EventType.OBJECT_CREATED,
  //   new s3notifications.LambdaDestination(postWpBucketDataLambda),
  //   {
  //     prefix: "fieldData/",
  //     suffix: ".json",
  //   }
  // );
  // wpFormBucket.addEventNotification(
  //   s3.EventType.OBJECT_TAGGING_PUT,
  //   new s3notifications.LambdaDestination(postWpBucketDataLambda),
  //   {
  //     prefix: "fieldData/",
  //     suffix: ".json",
  //   }
  // );

  const postSarBucketDataLambda = new Lambda(scope, "postSarBucketData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    ...bucketLambdaProps,
  }).lambda;

  // sarFormBucket.addEventNotification(
  //   s3.EventType.OBJECT_CREATED,
  //   new s3notifications.LambdaDestination(postSarBucketDataLambda),
  //   {
  //     prefix: "fieldData/",
  //     suffix: ".json",
  //   }
  // );

  // sarFormBucket.addEventNotification(
  //   s3.EventType.OBJECT_TAGGING_PUT,
  //   new s3notifications.LambdaDestination(postSarBucketDataLambda),
  //   {
  //     prefix: "fieldData/",
  //     suffix: ".json",
  //   }
  // );

  if (!isLocalStack) {
    const waf = new WafConstruct(
      scope,
      "ApiWafConstruct",
      {
        name: `${project}-${stage}-${service}`,
        blockRequestBodyOver8KB: false,
      },
      "REGIONAL"
    );

    new wafv2.CfnWebACLAssociation(scope, "WebACLAssociation", {
      resourceArn: api.deploymentStage.stageArn,
      webAclArn: waf.webAcl.attrArn,
    });
  }

  return {
    restApiId: api.restApiId,
    apiGatewayRestApiUrl: api.url.slice(0, -1),
  };
}
