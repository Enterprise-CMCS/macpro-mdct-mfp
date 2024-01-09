import * as yup from "yup";

export const metadataValidationSchema = yup.object().shape({
  submissionName: yup.string(),
  reportPeriod: yup.number(),
  reportType: yup.string(),
  locked: yup.bool(),
  status: yup.string(),
  lastAlteredBy: yup.string(),
  submittedBy: yup.string(),
  submittedOnDate: yup.string(),
  previousRevisions: yup.array(),
  submissionCount: yup.number(),
  completionStatus: yup.mixed(),
  finalSar: yup.mixed(),
  populations: yup.mixed(),
});

export const reportCreationSchema = yup.object().shape({
  reportYear: yup.number(),
  reportPeriod: yup.number(),
  stateName: yup.string(),
  stateOrTerritory: yup.string(),
  submissionCount: yup.number(),
  targetPopulations: yup.array().of(yup.mixed()),
});
