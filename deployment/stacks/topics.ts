import { Construct } from "constructs";
import {
  aws_lambda as lambda,
  aws_iam as iam,
  aws_ec2 as ec2,
  aws_ssm as ssm,
  Duration,
  Tags,
  Aws,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda";

interface CreateTopicsComponentsProps {
  scope: Construct;
  stage: string;
  project: string;
  vpc: ec2.IVpc;
  privateSubnets: ec2.ISubnet[];
  iamPermissionsBoundary: iam.IManagedPolicy;
  iamPath: string;
  brokerString: string;
}

export function createTopicsComponents(props: CreateTopicsComponentsProps) {
  const {
    scope,
    stage,
    project,
    vpc,
    privateSubnets,
    iamPermissionsBoundary,
    iamPath,
    brokerString,
  } = props;

  const service = "topics";
  Tags.of(scope).add("SERVICE", service);

  const deleteTopicsEnabled =
    stage === "main" || stage === "val" || stage === "production";

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
    vpcSubnets: { subnets: privateSubnets },
    securityGroups: [lambdaSecurityGroup],
  };

  const createTopicsLambda = new Lambda(scope, "CreateTopics", {
    entry: "services/topics/handlers/createTopics.js",
    handler: "handler",
    timeout: Duration.seconds(60),
    ...commonProps,
  });

  const deleteTopicsLambda = new Lambda(scope, "DeleteTopics", {
    entry: "services/topics/handlers/deleteTopics.js",
    handler: "handler",
    timeout: Duration.seconds(300),
    ...commonProps,
  });

  if (!deleteTopicsEnabled) {
    deleteTopicsLambda.node.addDependency(createTopicsLambda);
  }

  const listTopicsLambda = new Lambda(scope, "ListTopics", {
    entry: "services/topics/handlers/listTopics.js",
    handler: "handler",
    timeout: Duration.seconds(300),
    ...commonProps,
  });

  return {
    createTopicsLambda,
    deleteTopicsLambda,
    listTopicsLambda,
    lambdaSecurityGroup,
  };
}
