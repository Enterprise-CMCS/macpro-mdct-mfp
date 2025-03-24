BannerTable=local-banners
COGNITO_USER_POOL_CLIENT_ID=op://mdct_devs/mfp_secrets/COGNITO_USER_POOL_CLIENT_ID
COGNITO_USER_POOL_ID=op://mdct_devs/mfp_secrets/COGNITO_USER_POOL_ID
COGNITO_USER_POOL_CLIENT_DOMAIN=op://mdct_devs/mfp_secrets/COGNITO_USER_POOL_CLIENT_DOMAIN
COGNITO_IDENTITY_POOL_ID=op://mdct_devs/mfp_secrets/COGNITO_IDENTITY_POOL_ID
POST_SIGNOUT_REDIRECT=http://localhost:3000/
REACT_APP_LD_SDK_CLIENT=op://mdct_devs/mfp_secrets/REACT_APP_LD_SDK_CLIENT
DISABLE_ESLINT_PLUGIN=true
FormTemplateVersionsTable=local-form-template-versions
IAM_PATH=/
IAM_PERMISSIONS_BOUNDARY="bound"
LOGGING_BUCKET=log-bucket
S3_LOCAL_ENDPOINT=http://localhost:4569
SAR_FORM_BUCKET=op://mdct_devs/mfp_secrets/SAR_FORM_BUCKET
SarReportsTable=local-sar-reports
SKIP_PREFLIGHT_CHECK=true
TEMPLATE_BUCKET=op://mdct_devs/mfp_secrets/TEMPLATE_BUCKET
WP_FORM_BUCKET=op://mdct_devs/mfp_secrets/WP_FORM_BUCKET
WpReportsTable=local-wp-reports

# Values used for short-circuiting ssm: lookups, most likely won't need locally
WP_REPORT_TABLE_STREAM_ARN=local-nonsense
SAR_REPORT_TABLE_STREAM_ARN=local-nonsense
VPC_ID=local-nonsense
VPC_SUBNET_A=local-nonsense
VPC_SUBNET_B=local-nonsense
VPC_SUBNET_C=local-nonsense
BROKER_STRINGS=local-nonsense

# needed for e2e tests
CYPRESS_ADMIN_USER_EMAIL=op://mdct_devs/mfp_secrets/CYPRESS_ADMIN_USER_EMAIL
CYPRESS_ADMIN_USER_PASSWORD=op://mdct_devs/mfp_secrets/CYPRESS_ADMIN_USER_PASSWORD # pragma: allowlist secret
CYPRESS_STATE_USER_EMAIL=op://mdct_devs/mfp_secrets/CYPRESS_STATE_USER_EMAIL
CYPRESS_STATE_USER_PASSWORD=op://mdct_devs/mfp_secrets/CYPRESS_STATE_USER_PASSWORD # pragma: allowlist secret

# db:seed
SEED_ADMIN_USER_EMAIL=op://mdct_devs/mfp_secrets/SEED_ADMIN_USER_EMAIL
SEED_ADMIN_USER_PASSWORD=op://mdct_devs/mfp_secrets/SEED_ADMIN_USER_PASSWORD # pragma: allowlist secret
SEED_STATE_USER_EMAIL=op://mdct_devs/mfp_secrets/SEED_STATE_USER_EMAIL
SEED_STATE_USER_PASSWORD=op://mdct_devs/mfp_secrets/SEED_STATE_USER_PASSWORD # pragma: allowlist secret
SEED_STATE=op://mdct_devs/mfp_secrets/SEED_STATE
SEED_STATE_NAME=op://mdct_devs/mfp_secrets/SEED_STATE_NAME
