import * as yup from "yup";

export const metadataValidationSchema = yup.object().shape({
  submissionName: yup.string(),
  reportType: yup.string(),
  locked: yup.bool(),
  status: yup.string(),
  lastAlteredBy: yup.string(),
  submittedBy: yup.string(),
  submittedOnDate: yup.string(),
  previousRevisions: yup.array(),
  submissionCount: yup.number(),
  completionStatus: yup.mixed(),
});
