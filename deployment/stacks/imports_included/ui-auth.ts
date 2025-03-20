import { Construct } from "constructs";
import {
  aws_cognito as cognito,
  RemovalPolicy,
} from "aws-cdk-lib";

interface CreateUiAuthComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
}

export function createUiAuthComponents(props: CreateUiAuthComponentsProps) {
  const {
    scope,
    stage,
    isDev,
  } = props;

  new cognito.UserPool(scope, "UserPool", {
    userPoolName: `${stage}-user-pool`,
    signInAliases: {
      email: true,
    },
    autoVerify: {
      email: true,
    },
    selfSignUpEnabled: false,
    standardAttributes: {
      givenName: {
        required: false,
        mutable: true,
      },
      familyName: {
        required: false,
        mutable: true,
      },
      phoneNumber: {
        required: false,
        mutable: true,
      },
    },
    customAttributes: {
      ismemberof: new cognito.StringAttribute({ mutable: true }),
    },
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN
    // advancedSecurityMode: cognito.AdvancedSecurityMode.ENFORCED, DEPRECATED WE NEED FEATURE_PLAN.plus if we want to use StandardThreatProtectionMode.FULL_FUNCTION which I think is the new way to do this
  });
}
