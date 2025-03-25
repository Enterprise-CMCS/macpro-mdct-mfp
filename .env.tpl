API_URL=http://localhost:3030/local
BANNER_TABLE_NAME=local-banners
COGNITO_USER_POOL_CLIENT_ID=op://mdct_devs/mfp_secrets/COGNITO_USER_POOL_CLIENT_ID
COGNITO_USER_POOL_ID=op://mdct_devs/mfp_secrets/COGNITO_USER_POOL_ID
POST_SIGNOUT_REDIRECT=http://localhost:3000/
DISABLE_ESLINT_PLUGIN=true
DYNAMODB_URL=http://localhost:8000
FORM_TEMPLATE_TABLE_NAME=local-form-template-versions
IAM_PATH=/
IAM_PERMISSIONS_BOUNDARY="bound"
LOCAL_LOGIN=true
LOGGING_BUCKET=log-bucket
S3_LOCAL_ENDPOINT=http://localhost:4569
# SAR_FORM_BUCKET=op://mdct_devs/mfp_secrets/SAR_FORM_BUCKET
SAR_REPORT_TABLE_NAME=local-sar-reports
SKIP_PREFLIGHT_CHECK=true
TEMPLATE_BUCKET=op://mdct_devs/mfp_secrets/TEMPLATE_BUCKET
# WP_FORM_BUCKET=op://mdct_devs/mfp_secrets/WP_FORM_BUCKET
WP_REPORT_TABLE_NAME=local-wp-reports

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

SERVERLESS_LICENSE_KEY=op://mdct_devs/mfp_secrets/SERVERLESS_LICENSE_KEY

# AWS
AWS_ACCESS_KEY_ID=dummy_access_key
AWS_SECRET_ACCESS_KEY=dummy_secret_key # pragma: allowlist secret
AWS_SESSION_TOKEN=dummy_session_token
AWS_REGION=us-east-1
