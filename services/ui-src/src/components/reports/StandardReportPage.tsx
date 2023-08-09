// components
import { Box } from "@chakra-ui/react";
import { ReportPageFooter, ReportPageIntro } from "components";
import { StandardReportPageShape } from "types";
// utils

export const StandardReportPage = ({ route }: Props) => {
  const submitting = false;
  return (
    <Box>
      {route.verbiage.intro && <ReportPageIntro text={route.verbiage.intro} />}
      <ReportPageFooter submitting={submitting} form={route.form} />
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
}
