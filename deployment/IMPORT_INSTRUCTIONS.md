# Import Instructions

## From `pete-sls` branch:

```sh
rm -rf node_modules
yarn install
./run update-env
# COMMENT OUT LOGGING_BUCKET, TEMPLATE_BUCKET, WP_FORM_BUCKET, and SAR_FORM_BUCKET in .env file
./run deploy --stage <YOUR_BRANCH_NAME>

# cloudfront.Distribution -
# cognito.UserPool -

# manually remove termination protection for sls stacks:
  # ui-<YOUR_BRANCH_NAME>
  # ui-auth-<YOUR_BRANCH_NAME>
  # ui-src-<YOUR_BRANCH_NAME>
  # app-api-<YOUR_BRANCH_NAME>
  # database-<YOUR_BRANCH_NAME>
# manually dissassociate web acl in app-api-<YOUR_BRANCH_NAME>
./run destroy --stage <YOUR_BRANCH_NAME>
```

## From `jon-cdk` branch:

```sh
rm -rf node_modules
yarn install
./run update-env
IMPORT_VARIANT=empty ./run deploy --stage pete-dunlap-tester
IMPORT_VARIANT=imports_included PROJECT=hcbs cdk import --context stage=pete-dunlap-tester --force
IMPORT_VARIANT=imports_included ./run deploy --stage pete-dunlap-tester
./run deploy --stage pete-dunlap-tester
```

Log into app using all options (Cognito and/or IDM) and follow instructions that app lead has provided to ensure app is working.
:tada: Congrats, you did it!
