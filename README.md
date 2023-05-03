# macpro-mdct-mfp

MDCT is doing work for Money Follows the Person MFP

#### DynamoDB Jar Not Found Workaround

Currently (April 19th, 2023) there is a bug which prevents local usage of DynamoDB.
We rely on `serverless-dynamodb-local@0.2.40`, which relies on `dynamodb-localhost@0.0.9`, which attempts to download a .jar file from AWS.
Unfortunately, it attempts to do so over `http`, rather than `https`.
This fails.
[This has been fixed in the source](https://github.com/99x/dynamodb-localhost/commit/d4546c8110f1d5c2a454988c7e658e2f6a80d502),
but that fix [has not yet shipped in a release](https://www.npmjs.com/package/dynamodb-localhost?activeTab=versions) we can consume.

To workaround this issue we have overridden the dependency version in `./package.json`

Once the update ships [in dynamodb-localhost](https://github.com/99x/dynamodb-localhost/issues/83)
and [in serverless-dynamodb-local](https://github.com/99x/serverless-dynamodb-local/issues/294), the override in `./package.json` and
this section of the README will become obsolete and should be removed.
