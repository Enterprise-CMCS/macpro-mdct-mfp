export const bannerErrors = {
  GET_BANNER_FAILED: "Banner could not be fetched. Please contact support.",
  REPLACE_BANNER_FAILED:
    "Current banner could not be replaced. Please contact support.",
  DELETE_BANNER_FAILED:
    "Current banner could not be deleted. Please contact support.",
  CREATE_BANNER_FAILED: "Could not create a banner. Please contact support.",
};

export const validationErrors = {
  REQUIRED_GENERIC: "A response is required",
  REQUIRED_CHECKBOX: "Select at least one response",
  INVALID_GENERIC: "Response must be valid",
  INVALID_EMAIL: "Response must be a valid email address",
  INVALID_URL: "Response must be a valid hyperlink/URL",
  INVALID_DATE: "Response must be a valid date",
  INVALID_END_DATE: "End date can't be before start date",
  NUMBER_LESS_THAN_ZERO: "Response must be greater than or equal to zero",
  INVALID_NUMBER: "Response must be a valid number",
  INVALID_NUMBER_OR_NA: 'Response must be a valid number or "N/A"',
  INVALID_RATIO: "Response must be a valid ratio",
};

const genericErrorContent = [
  {
    type: "span",
    content:
      "Something went wrong on our end. Refresh your screen and try again.<br/>If this persists, contact the MDCT Help Desk with questions or to request technical assistance by emailing ",
  },
  {
    type: "externalLink",
    content: "mdct_help@cms.hhs.gov",
    props: {
      href: "mailto:mdct_help@cms.hhs.gov",
      target: "_blank",
    },
  },
];

export const reportErrors = {
  GET_REPORT_DATA_FAILED: genericErrorContent,
  SET_REPORT_DATA_FAILED: genericErrorContent,
  GET_REPORT_FAILED: genericErrorContent,
  GET_REPORTS_BY_STATE_FAILED: genericErrorContent,
  SET_REPORT_FAILED: genericErrorContent,
  DELETE_REPORT_FAILED: genericErrorContent,
};
