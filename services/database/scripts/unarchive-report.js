/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/unarchive-report.js {{reportId}}
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/unarchive-report.js {{reportId}}
 */

const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");

const isLocal = !!process.env.DYNAMODB_URL;
const branch = isLocal ? "localstack" : process.env.branchPrefix;
const reportId = process.argv[2];
const wpTableName = `${branch}-wp-reports`;

async function handler() {
  try {
    console.log("\n== Fetching report ==\n");

    const reports = await getDbItems(reportId);
    const report = filterDb(reports);

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

    await updateDbItems(wpTableName, reportId, reports);

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

async function getDbItems() {
  buildDynamoClient();
  const items = await scan({ TableName: wpTableName });
  return items;
}

function filterDb(items) {
  return items.find((item) => item.id === reportId);
}

async function updateDbItems(tableName, reportId, reports) {
  const updatedReports = reports.map((item) =>
    item.id === reportId ? unarchiveReport(item) : item
  );

  await update(tableName, updatedReports);

  console.log(`\n== Updated report ${reportId} in table ${tableName} ==\n`);
}

function unarchiveReport(report) {
  return {
    ...report,
    archived: false,
  };
}

handler();
