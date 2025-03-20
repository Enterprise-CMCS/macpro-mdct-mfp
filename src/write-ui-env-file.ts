import path, { dirname } from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputPath = path.join(__dirname, "../../services/ui-src", "public");
const configFilePath = path.resolve(outputPath, "env-config.js");

const region = "us-east-1";

// TODO: update the below for these additional variables
// export APPLICATION_ENDPOINT=${self:custom.application_endpoint}
// export COGNITO_IDP_NAME=${self:custom.cognito_idp_name}
// export POST_SIGNOUT_REDIRECT=${self:custom.signout_redirect_url}
// export REACT_APP_LD_SDK_CLIENT=${self:custom.ldSdkClient}
// export S3_ATTACHMENTS_BUCKET_REGION=${self:custom.s3_attachments_bucket_region}
// export S3_ATTACHMENTS_BUCKET_NAME=${self:custom.s3_attachments_bucket_name}

export async function writeLocalUiEnvFile(apiUrl: string) {
  const envVariables = {
    LOCAL_LOGIN: "false",
    SKIP_PREFLIGHT_CHECK: "true",
    API_REGION: region,
    API_URL: apiUrl.replace("https", "http"),
    COGNITO_REGION: process.env.COGNITO_REGION,
    COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
    COGNITO_USER_POOL_CLIENT_DOMAIN:
      process.env.COGNITO_USER_POOL_CLIENT_DOMAIN,
    COGNITO_IDP_NAME: "Okta",
    COGNITO_REDIRECT_SIGNIN: "http://localhost:3000/",
    COGNITO_REDIRECT_SIGNOUT: "http://localhost:3000/",
    POST_SIGNOUT_REDIRECT: "http://localhost:3000/",
    REACT_APP_LD_SDK_CLIENT: process.env.REACT_APP_LD_SDK_CLIENT,
  };

  await fs.rm(configFilePath, { force: true });

  const envConfigContent = [
    "window._env_ = {",
    ...Object.entries(envVariables).map(
      ([key, value]) => `  ${key}: "${value}",`
    ),
    "};",
  ].join("\n");

  await fs.writeFile(configFilePath, envConfigContent);
}
