import { Construct } from "constructs";
import {
  Aws,
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_s3 as s3,
  CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../deployment-config";
import { createDataComponents } from "./data";
import { createUiAuthComponents } from "./ui-auth";
import { createUiComponents } from "./ui";
import { createApiComponents } from "./api";
import { deployFrontend } from "./deployFrontend";
import { createCustomResourceRole } from "./customResourceRole";
import { isLocalStack } from "../local/util";
import { createTopicsComponents } from "./topics";
import { getSubnets } from "../utils/vpc";

export class ParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    const {
      isDev,
      secureCloudfrontDomainName,
      vpcName,
      kafkaAuthorizedSubnetIds,
    } = props;

    super(scope, id, {
      ...props,
      terminationProtection: !isDev,
    });

    const iamPermissionsBoundaryArn = `arn:aws:iam::${Aws.ACCOUNT_ID}:policy/cms-cloud-admin/developer-boundary-policy`;
    const iamPath = "/delegatedadmin/developer/";

    const commonProps = {
      scope: this,
      ...props,
      iamPermissionsBoundary: iam.ManagedPolicy.fromManagedPolicyArn(
        this,
        "iamPermissionsBoundary",
        iamPermissionsBoundaryArn
      ),
      iamPath,
      isDev,
    };

    const vpc = ec2.Vpc.fromLookup(this, "Vpc", { vpcName });
    const kafkaAuthorizedSubnets = getSubnets(
      this,
      kafkaAuthorizedSubnetIds ?? ""
    );

    const customResourceRole = createCustomResourceRole({ ...commonProps });

    const loggingBucket = s3.Bucket.fromBucketName(
      this,
      "LoggingBucket",
      `cms-cloud-${Aws.ACCOUNT_ID}-${Aws.REGION}`
    );

    const { tables, wpFormBucket, sarFormBucket } = createDataComponents({
      loggingBucket,
      ...commonProps,
    });

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      tables,
      vpc,
      kafkaAuthorizedSubnets,
      wpFormBucket,
      sarFormBucket,
    });

    if (!isLocalStack) {
      const { applicationEndpointUrl, distribution, uiBucket } =
        createUiComponents({ loggingBucket, ...commonProps });

      const {
        userPoolDomainName,
        identityPoolId,
        userPoolId,
        userPoolClientId,
      } = createUiAuthComponents({
        ...commonProps,
        applicationEndpointUrl,
        restApiId,
        customResourceRole,
      });

      deployFrontend({
        ...commonProps,
        uiBucket,
        distribution,
        apiGatewayRestApiUrl,
        applicationEndpointUrl:
          secureCloudfrontDomainName || applicationEndpointUrl,
        identityPoolId,
        userPoolId,
        userPoolClientId,
        userPoolClientDomain: `${userPoolDomainName}.auth.${this.region}.amazoncognito.com`,
        customResourceRole,
      });

      new CfnOutput(this, "CloudFrontUrl", {
        value: applicationEndpointUrl,
      });
    }

    createTopicsComponents({
      ...commonProps,
      vpc,
      kafkaAuthorizedSubnets,
    });
  }
}
