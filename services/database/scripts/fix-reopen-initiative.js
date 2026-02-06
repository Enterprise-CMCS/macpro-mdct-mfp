/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/fix-closed-initiative.js {{reportId}}
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/fix-reopen-initiative.js {{reportId}}
 */

const { buildDynamoClient, scan } = require("./utils/dynamodb.js");
const { buildS3Client, getObject, putObject, list } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const branch = isLocal ? "localstack" : process.env.branchPrefix;
const reportId = process.argv[2];
const wpTableName = `${branch}-wp-reports`;
const wpBucketName = `database-${branch}-wp`;

async function handler() {
  try {
    console.log("\n== Fetching report ==\n");

    const report = await getDbItem(reportId);

    if (!report) {
      console.log(
        `\n== No report ${reportId} found in table ${wpTableName} ==\n`
      );
      return;
    } else {
      console.log(
        `\n== Found report ${reportId}: ${report.submissionName} in table ${wpTableName} ==\n`
      );
    }

    await updateS3Item(report.state, report.fieldDataId);

    return {
      statusCode: 200,
      body: "All done!",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
}

async function getDbItem() {
  buildDynamoClient();
  const items = await scan({ TableName: wpTableName });
  const report = filterDb(items);
  return report;
}

function filterDb(items) {
  return items.find((item) => item.id === reportId);
}

async function updateS3Item(state, fieldDataId) {
  buildS3Client();

  const allObjects = await list({
    Bucket: wpBucketName,
    Prefix: `fieldData/${state}`,
  });
  const fieldDataObject = filterS3(allObjects, fieldDataId);

  if (fieldDataObject) {
    await transformS3Object(wpBucketName, fieldDataObject.Key);
  } else {
    console.log(`\n== No S3 object found for ${fieldDataId} ==\n`);
  }
}

function filterS3(bucketObjects, fieldDataId) {
  return bucketObjects.find((obj) => obj.Key.includes(fieldDataId));
}

async function transformS3Object(bucketName, objectKey) {
  const s3FieldData = await getObject({
    Key: objectKey,
    Bucket: bucketName,
  });

  const updatedData = reopenInitiatives(s3FieldData);

  if (updatedData) {
    await putObject({
      Bucket: bucketName,
      Key: objectKey,
      Body: JSON.stringify(updatedData),
      ContentType: "application/json",
    });

    console.log("\n== fieldData update complete ==\n");
  } else {
    console.log("\n== No fieldData to update ==\n");
  }
}

function reopenInitiatives(data) {
  const initiatives = data.initiative;
  const closedInitiatives = initiatives.filter(
    (item) => item.isInitiativeClosed === true
  );

  if (closedInitiatives.length === 0) return;

  closedInitiatives.forEach((item) => {
    console.log(
      `\n== Reopening initiative ${item.id}: ${item.initiative_name} ==\n`
    );

    delete item.isInitiativeClosed;
  });

  return {
    ...data,
    initiative: [...initiatives],
  };
}

handler();
