import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  aws_ec2 as ec2,
  aws_logs as logs,
  aws_s3 as s3,
  aws_s3_notifications as s3notifications,
  aws_wafv2 as wafv2,
  CfnOutput,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda.ts";
import { WafConstruct } from "../constructs/waf.ts";
import { LambdaDynamoEventSource } from "../constructs/lambda-dynamo-event.ts";
import { isLocalStack } from "../local/util.ts";
import { DynamoDBTable } from "../constructs/dynamodb-table.ts";

// TODO: does this need to point to the tsconfig.json file in services/app-api?

interface CreateApiComponentsProps {
  scope: Construct;
  stage: string;
  project: string;
  isDev: boolean;
  vpc: ec2.IVpc;
  kafkaAuthorizedSubnets: ec2.ISubnet[];
  tables: DynamoDBTable[];
  brokerString: string;
  wpFormBucket: s3.IBucket;
  sarFormBucket: s3.IBucket;
  expenditureFormBucket: s3.IBucket;
  launchDarklyServer: string;
}

export function createApiComponents(props: CreateApiComponentsProps) {
  const {
    scope,
    stage,
    project,
    isDev,
    vpc,
    kafkaAuthorizedSubnets,
    tables,
    brokerString,
    wpFormBucket,
    sarFormBucket,
    expenditureFormBucket,
    launchDarklyServer,
  } = props;

  const service = "app-api";

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
      loggingLevel: isDev
        ? apigateway.MethodLoggingLevel.OFF
        : apigateway.MethodLoggingLevel.INFO,
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
    NODE_OPTIONS: "--enable-source-maps",
    brokerString,
    STAGE: stage,
    launchDarklyServer,
    WP_FORM_BUCKET: wpFormBucket.bucketName,
    SAR_FORM_BUCKET: sarFormBucket.bucketName,
    EXPENDITURE_FORM_BUCKET: expenditureFormBucket.bucketName,
    ...Object.fromEntries(
      tables.map((table) => [`${table.node.id}Table`, table.table.tableName])
    ),
  };

  const commonProps = {
    stackName: `${service}-${stage}`,
    api,
    environment,
    tables,
    buckets: [wpFormBucket, sarFormBucket, expenditureFormBucket],
    isDev,
  };

  new Lambda(scope, "createBanner", {
    entry: "services/app-api/handlers/banners/create.ts",
    handler: "createBanner",
    path: "/banners",
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
    path: "/banners",
    method: "GET",
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
    memorySize: 2048,
    timeout: Duration.seconds(30),
    ...commonProps,
  });

  new Lambda(scope, "updateReport", {
    entry: "services/app-api/handlers/reports/update.ts",
    handler: "updateReport",
    path: "/reports/{reportType}/{state}/{id}",
    method: "PUT",
    memorySize: 2048,
    timeout: Duration.seconds(30),
    ...commonProps,
  });

  new Lambda(scope, "approveReport", {
    entry: "services/app-api/handlers/reports/approve.ts",
    handler: "approveReport",
    path: "/reports/approve/{reportType}/{state}/{id}",
    method: "PUT",
    memorySize: 2048,
    timeout: Duration.seconds(30),
    ...commonProps,
  });

  new LambdaDynamoEventSource(scope, "postKafkaData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    timeout: Duration.seconds(120),
    memorySize: 2048,
    retryAttempts: 2,
    vpc,
    vpcSubnets: { subnets: kafkaAuthorizedSubnets },
    securityGroups: [kafkaSecurityGroup],
    ...commonProps,
    environment: {
      ...commonProps.environment,
      topicNamespace: isDev ? `--${project}--${stage}--` : "",
    },
    tables: tables.filter(
      (table) => table.node.id === "SarReports" || table.node.id === "WpReports"
    ),
  });

  const bucketLambdaProps = {
    timeout: Duration.seconds(120),
    memorySize: 2048,
    vpc,
    vpcSubnets: { subnets: kafkaAuthorizedSubnets },
    securityGroups: [kafkaSecurityGroup],
    ...commonProps,
    environment: { ...commonProps.environment, topicNamespace: "" },
  };

  const postWpBucketData = new Lambda(scope, "postWpBucketData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    ...bucketLambdaProps,
  });

  wpFormBucket.addEventNotification(
    s3.EventType.OBJECT_CREATED,
    new s3notifications.LambdaDestination(postWpBucketData.lambda),
    {
      suffix: ".json",
    }
  );

  wpFormBucket.addEventNotification(
    s3.EventType.OBJECT_TAGGING_PUT,
    new s3notifications.LambdaDestination(postWpBucketData.lambda),
    {
      suffix: ".json",
    }
  );

  const postSarBucketData = new Lambda(scope, "postSarBucketData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
    handler: "handler",
    ...bucketLambdaProps,
  });

  sarFormBucket.addEventNotification(
    s3.EventType.OBJECT_CREATED,
    new s3notifications.LambdaDestination(postSarBucketData.lambda),
    {
      suffix: ".json",
    }
  );

  sarFormBucket.addEventNotification(
    s3.EventType.OBJECT_TAGGING_PUT,
    new s3notifications.LambdaDestination(postSarBucketData.lambda),
    {
      suffix: ".json",
    }
  );

  const postExpenditureBucketData = new Lambda(
    scope,
    "postExpenditureBucketData",
    {
      entry: "services/app-api/handlers/kafka/post/postKafkaData.ts",
      handler: "handler",
      ...bucketLambdaProps,
    }
  );

  expenditureFormBucket.addEventNotification(
    s3.EventType.OBJECT_CREATED,
    new s3notifications.LambdaDestination(postExpenditureBucketData.lambda),
    {
      suffix: ".json",
    }
  );

  expenditureFormBucket.addEventNotification(
    s3.EventType.OBJECT_TAGGING_PUT,
    new s3notifications.LambdaDestination(postExpenditureBucketData.lambda),
    {
      suffix: ".json",
    }
  );

  if (!isLocalStack) {
    const waf = new WafConstruct(
      scope,
      "ApiWafConstruct",
      {
        name: `${project}-${service}-${stage}-webacl-waf`,
        blockRequestBodyOver8KB: false,
      },
      "REGIONAL"
    );

    new wafv2.CfnWebACLAssociation(scope, "WebACLAssociation", {
      resourceArn: api.deploymentStage.stageArn,
      webAclArn: waf.webAcl.attrArn,
    });
  }

  const apiGatewayRestApiUrl = api.url.slice(0, -1);

  new CfnOutput(scope, "ApiUrl", {
    value: apiGatewayRestApiUrl,
  });

  return {
    restApiId: api.restApiId,
    apiGatewayRestApiUrl,
  };
}
