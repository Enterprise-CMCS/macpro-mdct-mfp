import { AttributeValue, QueryInput } from "aws-sdk/clients/dynamodb";
import dynamodbLib from "../dynamo/dynamodb-lib";
import wpForm from "../../forms/wp.json";
import sarForm from "../../forms/sar.json";
import s3Lib, { getFormTemplateKey, getTemplate } from "../s3/s3-lib";
import KSUID from "ksuid";
import { logger } from "../logging";
import {
  AnyObject,
  assertExhaustive,
  FormTemplate,
  ReportJson,
  ReportType,
} from "../types";
import { createHash } from "crypto";

export async function getNewestTemplateVersion(reportType: ReportType) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    KeyConditionExpression: `reportType = :reportType`,
    ExpressionAttributeValues: {
      ":reportType": reportType as unknown as AttributeValue,
    },
    Limit: 1,
    ScanIndexForward: false, // true = ascending, false = descending
  };
  const result = await dynamodbLib.query(queryParams);
  return result.Items?.[0];
}

export const formTemplateForReportType = (reportType: ReportType) => {
  switch (reportType) {
    case ReportType.WP:
      return wpForm as ReportJson;
    case ReportType.SAR:
      return sarForm as ReportJson;
    default:
      assertExhaustive(reportType);
      throw new Error(
        "Not Implemented: ReportType not recognized by FormTemplateProvider"
      );
  }
};

export async function getOrCreateFormTemplate(
  reportBucket: string,
  reportType: ReportType,
  copyReport?: AnyObject
) {
  //Make a copy of the form template so we don't accidentally corrupt the original
  const currentFormTemplate = structuredClone(
    formTemplateForReportType(reportType)
  );
  const stringifiedTemplate = JSON.stringify(currentFormTemplate);

  const currentTemplateHash = createHash("md5")
    .update(stringifiedTemplate)
    .digest("hex");

  const mostRecentTemplateVersion = await getNewestTemplateVersion(reportType);
  const mostRecentTemplateVersionHash = mostRecentTemplateVersion?.md5Hash;

  if (currentTemplateHash === mostRecentTemplateVersionHash && !copyReport) {
    return {
      formTemplate: await getTemplate(
        reportBucket,
        getFormTemplateKey(mostRecentTemplateVersion?.id)
      ),
      formTemplateVersion: mostRecentTemplateVersion,
    };
  } else {
    const newFormTemplateId = KSUID.randomSync().string;

    try {
      await s3Lib.put({
        Key: getFormTemplateKey(newFormTemplateId),
        Body: JSON.stringify(currentFormTemplate),
        ContentType: "application/json",
        Bucket: reportBucket,
      });
    } catch (err) {
      logger.error(err, "Error uploading new form template to S3");
      throw err;
    }

    // If we didn't find any form templates, start version at 1.
    const newFormTemplateVersionItem: FormTemplate = {
      versionNumber: mostRecentTemplateVersion?.versionNumber
        ? (mostRecentTemplateVersion.versionNumber += 1)
        : 1,
      md5Hash: currentTemplateHash,
      id: newFormTemplateId,
      lastAltered: new Date().toISOString(),
      reportType,
    };

    try {
      await dynamodbLib.put({
        TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
        Item: newFormTemplateVersionItem,
      });
    } catch (err) {
      logger.error(
        err,
        "Error writing a new form template version to DynamoDB."
      );
      throw err;
    }

    return {
      formTemplate: currentFormTemplate,
      formTemplateVersion: newFormTemplateVersionItem,
    };
  }
}
