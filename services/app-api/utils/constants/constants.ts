export const error = {
  // generic errors
  UNAUTHORIZED: "User is not authorized to access this resource.",
  NO_KEY: "Must provide key for table.",
  MISSING_DATA: "Missing required data.",
  INVALID_DATA: "Provided data is not valid.",
  NO_MATCHING_RECORD: "No matching record found.",
  SERVER_ERROR: "An unspecified server error occured.",
  // bucket errors
  S3_OBJECT_CREATION_ERROR: "Report could not be created due to an S3 error.",
  S3_OBJECT_UPDATE_ERROR: "Report could not be updated due to an S3 error.",
  // dynamo errors
  DYNAMO_CREATION_ERROR: "Report could not be created due to a database error.",
  DYNAMO_UPDATE_ERROR: "Report could not be updated due to a database error.",
  // template errors
  NO_TEMPLATE_NAME: "Must request template for download.",
  INVALID_TEMPLATE_NAME: "Requested template does not exist or does not match.",
  NOT_IN_DATABASE: "Record not found in database.",
  MISSING_FORM_TEMPLATE: "Form Template not found in S3.",
  MISSING_FIELD_DATA: "Field Data not found in S3.",
  // admin action errors
  ALREADY_ARCHIVED: "Cannot update archived report.",
  ALREADY_LOCKED: "Cannot update locked report.",
  REPORT_INCOMPLETE: "Cannot submit incomplete form.",
};

export const buckets = {
  FORM_TEMPLATE: "formTemplates",
  FIELD_DATA: "fieldData",
};

// REPORTS

export const reportTables = {
  MFP: process.env.MFP_REPORT_TABLE_NAME!,
};

export const reportBuckets = {
  MFP: process.env.MFP_FORM_BUCKET!,
};

export const tableTopics = {
  MFP: "mfp-reports",
};
export const bucketTopics = {
  MFP: "mfp-form",
};

export const formTemplateTableName = process.env.FORM_TEMPLATE_TABLE_NAME!;
