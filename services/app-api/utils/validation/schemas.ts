import * as yup from "yup";

export const metadataValidationSchema = yup.object().shape({
  programName: yup.string(),
  reportType: yup.string(),
  status: yup.string(),
  isComplete: yup.boolean(),
  createdAt: yup.number(),
  lastAlteredBy: yup.string(),
});
