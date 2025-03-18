import { Construct } from "constructs";
import { Aws, aws_iam as iam, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../deployment-config";
import { createDataComponents } from "./data";
import { createUiAuthComponents } from "./ui-auth";
import { createUiComponents } from "./ui";
import { createApiComponents } from "./api";
import { deployFrontend } from "./deployFrontend";
import { createCustomResourceRole } from "./customResourceRole";
import { isLocalStack } from "../local/util";
import { createTopicsComponents } from "./topics";
import { createUploadsComponents } from "./uploads";

export class ParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    const { isDev } = props;

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
    };

    const { customResourceRole } = createCustomResourceRole({ ...commonProps });

    const { tables } = createDataComponents({
      ...commonProps,
      customResourceRole,
    });

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      tables,
    });

    if (!isLocalStack) {
      const { applicationEndpointUrl, distribution, uiBucket } =
        createUiComponents({ ...commonProps });

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
          props.secureCloudfrontDomainName || applicationEndpointUrl,
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
      privateSubnets,
    });

    createUploadsComponents({
      ...commonProps,
    });

    new CfnOutput(this, "ApiUrl", {
      value: apiGatewayRestApiUrl,
    });
  }
}
