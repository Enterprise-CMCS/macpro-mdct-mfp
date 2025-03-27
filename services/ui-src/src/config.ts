//  @ts-nocheck

const config = {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    LOCAL_ENDPOINT: window._env_.S3_LOCAL_ENDPOINT,
    REGION: window._env_.S3_ATTACHMENTS_BUCKET_REGION,
    BUCKET: window._env_.S3_ATTACHMENTS_BUCKET_NAME,
  },
  apiGateway: {
    REGION: window._env_.API_REGION,
    URL: window._env_.API_URL,
  },
  cognito: {
    REGION: window._env_.COGNITO_REGION,
    USER_POOL_ID: window._env_.COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: window._env_.COGNITO_USER_POOL_CLIENT_ID,
    APP_CLIENT_DOMAIN: window._env_.COGNITO_USER_POOL_CLIENT_DOMAIN,
    IDENTITY_POOL_ID: window._env_.COGNITO_IDENTITY_POOL_ID,
    COGNITO_IDP_NAME: window._env_.COGNITO_IDP_NAME,
    REDIRECT_SIGNIN: window._env_.COGNITO_REDIRECT_SIGNIN,
    REDIRECT_SIGNOUT: window._env_.COGNITO_REDIRECT_SIGNOUT,
  },
  DEV_API_URL: window._env_.DEV_API_URL,
  REACT_APP_LD_SDK_CLIENT: window._env_.REACT_APP_LD_SDK_CLIENT,
  POST_SIGNOUT_REDIRECT: window._env_.POST_SIGNOUT_REDIRECT,
};

export default config;
