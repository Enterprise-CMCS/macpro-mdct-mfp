import { ReportType } from "../types/reports";

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
  S3_OBJECT_GET_ERROR: "Error while fetching report.",
  // dynamo errors
  DYNAMO_CREATION_ERROR: "Report could not be created due to a database error.",
  DYNAMO_UPDATE_ERROR: "Report could not be updated due to a database error.",
  // template errors
  NO_TEMPLATE_NAME: "Must request template for download.",
  INVALID_TEMPLATE_NAME: "Requested template does not exist or does not match.",
  NOT_IN_DATABASE: "Record not found in database.",
  UNABLE_TO_COPY:
    "Unable to copy over report if todays date is in the same period and year as a previous report.",
  MISSING_FORM_TEMPLATE: "Form Template not found in S3.",
  MISSING_FIELD_DATA: "Field Data not found in S3.",
  NO_WORKPLANS_FOUND: "No record of Work Plans found in database",
  // admin action errors
  ALREADY_ARCHIVED: "Cannot update archived report.",
  ALREADY_LOCKED: "Cannot update locked report.",
  REPORT_INCOMPLETE: "Cannot submit incomplete form.",
} as const;

export const buckets = {
  FORM_TEMPLATE: "formTemplates",
  FIELD_DATA: "fieldData",
};

// STATES
export enum States {
  AL = "Alabama",
  AK = "Alaska",
  AS = "American Samoa",
  AZ = "Arizona",
  AR = "Arkansas",
  CA = "California",
  CO = "Colorado",
  CT = "Connecticut",
  DE = "Delaware",
  DC = "District of Columbia",
  FM = "Federated States of Micronesia",
  FL = "Florida",
  GA = "Georgia",
  GU = "Guam",
  HI = "Hawaii",
  ID = "Idaho",
  IL = "Illinois",
  IN = "Indiana",
  IA = "Iowa",
  KS = "Kansas",
  KY = "Kentucky",
  LA = "Louisiana",
  ME = "Maine",
  MH = "Marshall Islands",
  MD = "Maryland",
  MA = "Massachusetts",
  MI = "Michigan",
  MN = "Minnesota",
  MS = "Mississippi",
  MO = "Missouri",
  MT = "Montana",
  NE = "Nebraska",
  NV = "Nevada",
  NH = "New Hampshire",
  NJ = "New Jersey",
  NM = "New Mexico",
  NY = "New York",
  NC = "North Carolina",
  ND = "North Dakota",
  MP = "Northern Mariana Islands",
  OH = "Ohio",
  OK = "Oklahoma",
  OR = "Oregon",
  PW = "Palau",
  PA = "Pennsylvania",
  PR = "Puerto Rico",
  RI = "Rhode Island",
  SC = "South Carolina",
  SD = "South Dakota",
  TN = "Tennessee",
  TX = "Texas",
  UT = "Utah",
  VT = "Vermont",
  VI = "Virgin Islands",
  VA = "Virginia",
  WA = "Washington",
  WV = "West Virginia",
  WI = "Wisconsin",
  WY = "Wyoming",
}

// REPORTS

export const reportTables: { [key in ReportType]: string } = {
  SAR: process.env.SarReportsTable!,
  WP: process.env.WpReportsTable!,
  EXPENDITURE: process.env.ExpenditureReportsTable!,
};

export const reportBuckets: { [key in ReportType]: string } = {
  SAR: process.env.SAR_FORM_BUCKET!,
  WP: process.env.WP_FORM_BUCKET!,
  EXPENDITURE: process.env.EXPENDITURE_FORM_BUCKET!,
};

export const reportNames: { [key in ReportType]: string } = {
  SAR: "SAR",
  WP: "Work Plan",
  EXPENDITURE: "Expenditure",
};

export const tableTopics: { [key in ReportType]: string } = {
  SAR: "sar-reports",
  WP: "wp-reports",
  EXPENDITURE: "expenditure-reports",
};

export const bucketTopics: Record<string, string> = {
  SAR: "sar-form",
  SAR_TEMPLATE: "sar-form-template",
  WP: "wp-form",
  WP_TEMPLATE: "wp-form-template",
  EXPENDITURE: "expenditure-form",
};

export const DEFAULT_TARGET_POPULATION_NAMES = [
  "Older adults",
  "Individuals with physical disabilities (PD)",
  "Individuals with intellectual and developmental disabilities (I/DD)",
  "Individuals with mental health and substance use disorders (MH/SUD)",
  "HCBS infrastructure/system-level development",
];
