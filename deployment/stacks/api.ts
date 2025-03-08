import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  aws_ec2 as ec2,
  aws_events as events,
  aws_events_targets as targets,
  aws_iam as iam,
  aws_logs as logs,
  aws_s3 as s3,
  aws_wafv2 as wafv2,
  Duration,
  RemovalPolicy,
  Tags,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda";
import { WafConstruct } from "../constructs/waf";
import { addIamPropertiesToBucketAutoDeleteRole } from "../utils/s3";
import { LambdaDynamoEventSource } from "../constructs/lambda-dynamo-event";
import { DynamoDBTableIdentifiers } from "../constructs/dynamodb-table";
import { isDefined } from "../utils/misc";
import { isLocalStack } from "../local/util";

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
      metricsEnabled: false,
      throttlingBurstLimit: 5000,
      throttlingRateLimit: 10000.0,
      cachingEnabled: false,
      cacheTtl: Duration.seconds(300),
      cacheDataEncrypted: false,
      accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
      accessLogFormat: apigateway.AccessLogFormat.custom(
        "requestId: $context.requestId, ip: $context.identity.sourceIp, " +
          "caller: $context.identity.caller, user: $context.identity.user, " +
          "requestTime: $context.requestTime, httpMethod: $context.httpMethod, " +
          "resourcePath: $context.resourcePath, status: $context.status, " +
          "protocol: $context.protocol, responseLength: $context.responseLength"
      ),
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
    ...Object.fromEntries(
      tables.map((table) => [`${table.id}Table`, table.name])
    ),
  };

  const additionalPolicies = [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:BatchWriteItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
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
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:Query", "dynamodb:Scan"],
      resources: tables.map((table) => `${table.arn}/index/*`),
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "cognito-idp:AdminGetUser",
        "ses:SendEmail",
        "ses:SendRawEmail",
        "lambda:InvokeFunction",
        "ssm:GetParameter",
      ],
      resources: ["*"],
    }),
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

  new Lambda(scope, "ForceKafkaSync", {
    entry: "services/app-api/handlers/kafka/get/forceKafkaSync.js",
    handler: "main",
    timeout: Duration.minutes(15),
    memorySize: 3072,
    ...commonProps,
  });

  new LambdaDynamoEventSource(scope, "postKafkaData", {
    entry: "services/app-api/handlers/kafka/post/postKafkaData.js",
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

  const dataConnectTables = tables.filter((table) =>
    [
      "FormQuestions",
      "AuthUser",
      "StateForms",
      "Forms",
      "FormTemplates",
      "States",
      "FormAnswers",
    ].includes(table.id)
  );

  new LambdaDynamoEventSource(scope, "dataConnectSource", {
    entry: "services/app-api/handlers/kafka/post/dataConnectSource.js",
    handler: "handler",
    timeout: Duration.seconds(120),
    memorySize: 2048,
    retryAttempts: 2,
    vpc,
    vpcSubnets: { subnets: privateSubnets },
    securityGroups: [kafkaSecurityGroup],
    ...commonProps,
    tables: dataConnectTables,
  });

  new Lambda(scope, "getUserById", {
    entry: "services/app-api/handlers/users/get/getUserById.js",
    handler: "main",
    path: "/users/{id}",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "getUsers", {
    entry: "services/app-api/handlers/users/get/listUsers.js",
    handler: "main",
    path: "/users",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "obtainUserByUsername", {
    entry: "services/app-api/handlers/users/post/obtainUserByUsername.js",
    handler: "main",
    path: "/users/get",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "obtainUserByEmail", {
    entry: "services/app-api/handlers/users/post/obtainUserByEmail.js",
    handler: "main",
    path: "/users/get/email",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "createUser", {
    entry: "services/app-api/handlers/users/post/createUser.js",
    handler: "main",
    path: "/users/add",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "adminCreateUser", {
    entry: "services/app-api/handlers/users/post/createUser.js",
    handler: "adminCreateUser",
    path: "/users/admin-add",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "updateUser", {
    entry: "services/app-api/handlers/users/post/updateUser.js",
    handler: "main",
    path: "/users/update/{userId}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "getForm", {
    entry: "services/app-api/handlers/forms/get.js",
    handler: "main",
    path: "/single-form/{state}/{specifiedYear}/{quarter}/{form}",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "getStateFormList", {
    entry: "services/app-api/handlers/forms/post/obtainFormsList.js",
    handler: "main",
    path: "/forms/obtain-state-forms",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "updateStateFormList", {
    entry: "services/app-api/handlers/state-forms/post/updateStateForms.js",
    handler: "main",
    path: "/state-forms/update",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "generateEnrollmentTotals", {
    entry:
      "services/app-api/handlers/state-forms/post/generateEnrollmentTotals.js",
    handler: "main",
    path: "/generate-enrollment-totals",
    method: "POST",
    timeout: Duration.minutes(15),
    ...commonProps,
  });

  new Lambda(scope, "obtainAvailableForms", {
    entry: "services/app-api/handlers/forms/post/obtainAvailableForms.js",
    handler: "main",
    path: "/forms/obtainAvailableForms",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "getFormTypes", {
    entry: "services/app-api/handlers/forms/get/getFormTypes.js",
    handler: "main",
    path: "/form-types",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "generateQuarterForms", {
    entry: "services/app-api/handlers/forms/post/generateQuarterForms.js",
    handler: "main",
    path: "/generate-forms",
    method: "POST",
    timeout: Duration.minutes(15),
    ...commonProps,
  });

  const generateQuarterFormsOnScheduleLambda = new Lambda(
    scope,
    "generateQuarterFormsOnSchedule",
    {
      entry: "services/app-api/handlers/forms/post/generateQuarterForms.js",
      handler: "scheduled",
      timeout: Duration.minutes(15),
      ...commonProps,
    }
  ).lambda;

  const rule = new events.Rule(scope, "GenerateQuarterFormsOnScheduleRule", {
    schedule: events.Schedule.cron({
      minute: "0",
      hour: "0",
      day: "1",
      month: "1,4,7,10",
    }),
  });
  rule.addTarget(
    new targets.LambdaFunction(generateQuarterFormsOnScheduleLambda)
  );

  //   #
  //   # NOTE: The MFP business owners have requested that the email flow to users be disabled, but would like to be
  //   # able to re-enable it at a future point (see: https://bit.ly/3w3mVmT). For now, scope handler will be commented out
  //   # and not removed.
  //   #
  //   # stateUsersEmail:
  //   #   handler: handlers/notification/stateUsers.main
  //   #   role: LambdaApiRole
  //   #   events:
  //   #     - http:
  //   #         path: notification/stateUsersEmail
  //   #         method: post
  //   #         cors: true
  //   #         authorizer: aws_iam
  //   #     - schedule:
  //   #         enabled: true
  //   #         rate: cron(0 0 1 */3 ? *)
  //   #
  //   # businessUsersEmail:
  //   #   handler: handlers/notification/businessUsers.main
  //   #   role: LambdaApiRole
  //   #   events:
  //   #     - http:
  //   #         path: notification/businessUsersEmail
  //   #         method: post
  //   #         cors: true
  //   #         authorizer: aws_iam
  //   #     - schedule:
  //   #         enabled: false
  //   #         rate: cron(0 0 1 */3 ? *)
  //   #
  //   # uncertified:
  //   #   handler: handlers/notification/uncertified.main
  //   #   role: LambdaApiRole
  //   #   events:
  //   #     - http:
  //   #         path: notification/uncertified
  //   #         method: post
  //   #         cors: true
  //   #         authorizer: aws_iam
  //   #

  new Lambda(scope, "saveForm", {
    entry: "services/app-api/handlers/forms/post/saveForm.js",
    handler: "main",
    path: "/single-form/save",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "getFormTemplate", {
    entry:
      "services/app-api/handlers/form-templates/post/obtainFormTemplate.js",
    handler: "main",
    path: "/form-template",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "getFormTemplateYears", {
    entry:
      "services/app-api/handlers/form-templates/post/obtainFormTemplateYears.js",
    handler: "main",
    path: "/form-templates/years",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "updateCreateFormTemplate", {
    entry:
      "services/app-api/handlers/form-templates/post/updateCreateFormTemplate.js",
    handler: "main",
    path: "/form-templates/add",
    method: "POST",
    ...commonProps,
  });

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

  addIamPropertiesToBucketAutoDeleteRole(
    scope,
    iamPermissionsBoundary.managedPolicyArn,
    iamPath
  );

  return {
    restApiId: api.restApiId,
    apiGatewayRestApiUrl: api.url.slice(0, -1),
  };
}
