import { Construct } from "constructs";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  Effect,
  IManagedPolicy,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { isLocalStack } from "../local/util";

interface LambdaProps extends Partial<NodejsFunctionProps> {
  handler: string;
  timeout?: Duration;
  memorySize?: number;
  brokerString?: string;
  path?: string;
  method?: string;
  stackName: string;
  api?: apigateway.RestApi;
  additionalPolicies?: PolicyStatement[];
  iamPermissionsBoundary: IManagedPolicy;
  iamPath: string;
  requestParameters?: string[];
  requestValidator?: apigateway.IRequestValidator;
}

export class Lambda extends Construct {
  public readonly lambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    const {
      handler,
      timeout = Duration.seconds(6),
      memorySize = 1024,
      brokerString = "",
      environment = {},
      api,
      path,
      method,
      additionalPolicies = [],
      iamPath,
      iamPermissionsBoundary,
      stackName,
      requestParameters,
      requestValidator,
      ...restProps
    } = props;

    const role = new Role(this, `${id}LambdaExecutionRole`, {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
      ],
      permissionsBoundary: iamPermissionsBoundary,
      path: iamPath,
      inlinePolicies: {
        LambdaPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ["ssm:GetParameter"],
              resources: ["*"],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
              ],
              resources: ["arn:aws:logs:*:*:*"],
            }),
            ...additionalPolicies,
          ],
        }),
      },
    });

    this.lambda = new NodejsFunction(this, id, {
      functionName: `${stackName}-${id}`,
      handler,
      runtime: Runtime.NODEJS_20_X,
      timeout,
      memorySize,
      role,
      bundling: {
        minify: true,
        sourceMap: true,
        nodeModules: ["jsdom"],
      },
      environment,
      ...restProps,
    });

    if (api && path && method) {
      const resource = api.root.resourceForPath(path);
      resource.addMethod(
        method,
        new apigateway.LambdaIntegration(this.lambda),
        {
          authorizationType: isLocalStack
            ? undefined
            : apigateway.AuthorizationType.IAM,
          requestParameters: requestParameters
            ? Object.fromEntries(
                requestParameters.map((item) => [
                  `method.request.path.${item}`,
                  true,
                ])
              )
            : {},
          requestValidator,
        }
      );
    }
  }
}

// TODO: the options calls previously included "X-Amzn-Trace-Id" in Access-Control-Allow-Headers as well
// TODO: the options calls previously returned a 200 instead of a 204
