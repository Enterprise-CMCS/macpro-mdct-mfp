import { Spinner } from "@chakra-ui/react";

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
