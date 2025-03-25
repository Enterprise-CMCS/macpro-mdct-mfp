# Import Instructions

## From `pete-sls` branch:

```sh
rm -rf node_modules
yarn install
./run update-env
# COMMENT OUT LOGGING_BUCKET, TEMPLATE_BUCKET, WP_FORM_BUCKET, SAR_FORM_BUCKET and values for short-circuiting SSM in .env file
./run deploy --stage <YOUR_BRANCH_NAME>

# cloudfront.Distribution -
# cognito.UserPool -

# manually remove termination protection for sls stacks:
  # ui-<YOUR_BRANCH_NAME>
  # ui-auth-<YOUR_BRANCH_NAME>
  # ui-src-<YOUR_BRANCH_NAME>
  # app-api-<YOUR_BRANCH_NAME>
  # database-<YOUR_BRANCH_NAME>
  # topics-<YOUR_BRANCH_NAME>
  # uploads-<YOUR_BRANCH_NAME>
# manually dissassociate web acl in app-api-<YOUR_BRANCH_NAME>
./run destroy --stage <YOUR_BRANCH_NAME>
```

## From `jon-cdk` branch:

```sh
rm -rf node_modules
yarn install
./run update-env
IMPORT_VARIANT=empty ./run deploy --stage jon-holman-tester
IMPORT_VARIANT=imports_included PROJECT=mfp cdk import --context stage=jon-holman-tester --force
IMPORT_VARIANT=imports_included ./run deploy --stage jon-holman-tester
./run deploy --stage jon-holman-tester
```

Log into app using all options (Cognito and/or IDM) and follow instructions that app lead has provided to ensure app is working.
:tada: Congrats, you did it!
