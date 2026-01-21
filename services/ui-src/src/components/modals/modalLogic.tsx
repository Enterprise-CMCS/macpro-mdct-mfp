import { Spinner } from "@chakra-ui/react";
import { ReportMetadataShape } from "types";

export const actionButtonText = (
  submitting: boolean,
  viewOnly: boolean,
  isEditingExisting?: string
) => {
  //Occurs when clicking the button
  if (submitting) {
    return <Spinner size="md" />;
  }
  //Occurs when admin or state user is viewing a submitted report
  if (viewOnly) {
    return "Return";
  }
  //Occurs when a state user is editing an existing report
  if (isEditingExisting) {
    return "Update submission";
  }
  //Occurs when a state user is creating a new report
  return "Save";
};

export const checkForExistingReport = (
  reportYear?: number,
  reportPeriod?: number,
  reportsByState?: ReportMetadataShape[]
) => {
  if (!reportsByState) return false;
  for (const report of reportsByState) {
    if (
      report.reportPeriod === reportPeriod &&
      report.reportYear === reportYear &&
      !report.archived
    ) {
      return true;
    }
  }
  return false;
};
