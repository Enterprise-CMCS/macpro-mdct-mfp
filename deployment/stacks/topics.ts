import { Construct } from "constructs";
import {
  aws_ec2 as ec2,
  aws_iam as iam,
  Aws,
  CfnOutput,
  Duration,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda";

interface CreateTopicsComponentsProps {
  brokerString: string;
  iamPath: string;
  iamPermissionsBoundary: iam.IManagedPolicy;
  isDev: boolean;
  kafkaAuthorizedSubnets: ec2.ISubnet[];
  project: string;
  scope: Construct;
  stage: string;
  vpc: ec2.IVpc;
}

export function createTopicsComponents(props: CreateTopicsComponentsProps) {
  const {
    brokerString,
    iamPath,
    iamPermissionsBoundary,
    isDev,
    kafkaAuthorizedSubnets,
    project,
    scope,
    stage,
    vpc,
  } = props;

  const service = "topics";

  const deleteTopicsEnabled = !isDev;

  const lambdaSecurityGroup = new ec2.SecurityGroup(
    scope,
    "LambdaSecurityGroup",
    {
      vpc,
      description: "Security Group for the topics service lambdas",
      allowAllOutbound: true,
    }
  );

  const commonProps = {
    brokerString,
    stackName: `${service}-${stage}`,
    environment: {
      brokerString,
      project,
    },
    additionalPolicies: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:${Aws.REGION}:${Aws.ACCOUNT_ID}:parameter/configuration/${stage}/*`,
        ],
      }),
    ],
    iamPermissionsBoundary,
    iamPath,
    vpc,
    vpcSubnets: { subnets: kafkaAuthorizedSubnets },
    securityGroups: [lambdaSecurityGroup],
  };

  const createTopicsLambda = new Lambda(scope, "CreateTopics", {
    entry: "services/topics/handlers/createTopics.js",
    handler: "handler",
    timeout: Duration.seconds(60),
    ...commonProps,
    environment: { topicNamespace: "", ...commonProps.environment },
  });

  if (!deleteTopicsEnabled) {
    const deleteTopicsLambda = new Lambda(scope, "DeleteTopics", {
      entry: "services/topics/handlers/deleteTopics.js",
      handler: "handler",
      timeout: Duration.seconds(300),
      ...commonProps,
    });

    deleteTopicsLambda.node.addDependency(createTopicsLambda);

    new CfnOutput(scope, "DeleteTopicsFunctionName", {
      value: deleteTopicsLambda.lambda.functionName,
    });
  }

  const listTopicsLambda = new Lambda(scope, "ListTopics", {
    entry: "services/topics/handlers/listTopics.js",
    handler: "handler",
    timeout: Duration.seconds(300),
    ...commonProps,
  });

  new CfnOutput(scope, "ListTopicsFunctionName", {
    value: listTopicsLambda.lambda.functionName,
  });
}
